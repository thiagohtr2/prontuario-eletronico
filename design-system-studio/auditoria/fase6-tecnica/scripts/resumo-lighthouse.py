# Resume os JSON do Lighthouse (mediana de 3 execuções por URL × perfil).
import json, glob, os, statistics, collections
D = os.path.join(os.path.dirname(__file__), '..', 'dados', 'lighthouse')
rows = collections.defaultdict(list)
for f in sorted(glob.glob(os.path.join(D, '*.json')) + glob.glob(os.path.join(D, '*.json.gz'))):
    try:
        r = json.load(__import__('gzip').open(f) if f.endswith('.gz') else open(f))
    except Exception:
        continue
    name = os.path.basename(f).replace('.gz', '').rsplit('-', 1)[0]
    a = r['audits']
    g = lambda k: a[k].get('numericValue') if k in a else None
    rows[name].append({
        'score': round((r['categories']['performance']['score'] or 0) * 100),
        'fcp': g('first-contentful-paint'), 'lcp': g('largest-contentful-paint'), 'tbt': g('total-blocking-time'),
        'cls': g('cumulative-layout-shift'), 'si': g('speed-index'), 'tti': g('interactive'),
        'bytes': g('total-byte-weight'), 'mainthread': g('mainthread-work-breakdown'), 'bootup': g('bootup-time'),
        'unusedJs': (a.get('unused-javascript', {}).get('details') or {}).get('overallSavingsBytes'),
        'dom': g('dom-size'), 'url': r.get('finalDisplayedUrl') or r.get('finalUrl'),
        'warnings': r.get('runWarnings', [])[:1],
    })
out = {}
for k, v in rows.items():
    med = lambda key: (round(statistics.median([x[key] for x in v if x[key] is not None]), 3) if any(x[key] is not None for x in v) else None)
    out[k] = {'n': len(v), 'score': med('score'), 'scores': [x['score'] for x in v], 'fcp_ms': med('fcp'), 'lcp_ms': med('lcp'), 'tbt_ms': med('tbt'), 'cls': med('cls'),
              'si_ms': med('si'), 'tti_ms': med('tti'), 'bytes_KB': round(med('bytes') / 1024) if med('bytes') else None,
              'mainthread_ms': med('mainthread'), 'bootup_ms': med('bootup'), 'unusedJs_KB': round(med('unusedJs') / 1024) if med('unusedJs') else None,
              'dom': med('dom'), 'url': v[0]['url'], 'warn': v[0]['warnings']}
json.dump(out, open(os.path.join(D, '..', 'lighthouse-resumo.json'), 'w'), indent=1, ensure_ascii=False)
for k, v in out.items():
    print(k, v)
