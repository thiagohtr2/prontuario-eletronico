"""Análise estática de tokens: compara custom properties dos sites com verde-vivo-tokens.css,
conta hex literais fora do arquivo de tokens, procura cores da inspiração/landing original e regras-chave."""
import re, json, pathlib, sys
BASE = pathlib.Path(__file__).resolve().parents[3]
SITES = BASE / 'fase3-sites' / 'P2-verde-vivo'
REF = (BASE / 'fase2-projetos' / 'P2-verde-vivo' / 'exportados' / 'verde-vivo-tokens.css').read_text()
ref = {m.group(1): m.group(2).strip().lower() for m in re.finditer(r'--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})', REF)}
CHAVE = ['primary', 'primary-hover', 'primary-active', 'on-primary', 'primary-soft', 'secondary', 'accent', 'bg', 'bg-alt', 'surface', 'surface-alt',
         'text', 'text-muted', 'border', 'focus-ring', 'link', 'nav-bg', 'nav-text', 'nav-active', 'nav-active-text']
INSP = ['#f3eee3', '#faf7f0', '#1d2a1e', '#5e6a5a', '#2e5e3e', '#c9a27e', '#f4f1e8', '#1f2a1d', '#2f6b3a', '#d9a441', '#9f1239']
out = {}
for site in ['dev-1', 'dev-2', 'dev-3']:
    d = SITES / site
    css = {p: p.read_text() for p in d.rglob('*.css')}
    js = {p: p.read_text() for p in d.rglob('*.js') if 'tools' not in p.parts and 'tests' not in p.parts}
    html = (d / 'index.html').read_text()
    allcss = '\n'.join(css.values())
    # valores de todas as custom properties com hex
    props = {}
    for m in re.finditer(r'--([a-zA-Z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\b', allcss):
        props.setdefault(m.group(1).lower(), m.group(2).lower())
    vals = set(props.values())
    found = {}
    for k in CHAVE:
        v = ref[k]
        names = [n for n, val in props.items() if val == v]
        found[k] = {'ref': v, 'presente': v in vals, 'nomes': names[:3]}
    nok = sum(1 for k in CHAVE if found[k]['presente'])
    allref_ok = sum(1 for k, v in ref.items() if v in vals)
    # hex literais fora do arquivo de tokens (CSS + JS + HTML inline style)
    tok_files = [p for p in css if 'tokens' in p.name]
    lit = []
    for p, t in list(css.items()) + list(js.items()):
        if p in tok_files: continue
        t2 = re.sub(r'/\*[\s\S]*?\*/', '', t)
        for m in re.finditer(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b', t2):
            ctx = t2[max(0, m.start()-25):m.end()+5].replace('\n', ' ')
            if 'data:image' in ctx or 'href="#' in ctx or "href='#" in ctx or 'url(#' in ctx: continue
            lit.append((p.name, m.group(0), ctx))
    lit_rgba = sum(len(re.findall(r'rgba?\(\s*\d', re.sub(r'/\*[\s\S]*?\*/', '', t))) for p, t in css.items() if p not in tok_files)
    insp = {h: allcss.lower().count(h) + sum(t.lower().count(h) for t in js.values()) for h in INSP}
    out[site] = {
        'tokensChave': f'{nok}/{len(CHAVE)}', 'tokensTodos': f'{allref_ok}/{len(ref)}', 'faltando': [k for k in CHAVE if not found[k]['presente']],
        'hexForaTokens': len(lit), 'exHex': lit[:8], 'rgbaForaTokens': lit_rgba,
        'inspiracao': {k: v for k, v in insp.items() if v},
        'reducedMotion': 'prefers-reduced-motion' in allcss,
        'scale098': bool(re.search(r':active[^{]*\{[^}]*scale\(\s*0?\.98', allcss)),
        'focusVisible': allcss.count(':focus-visible'),
        'safeTop': 'safe-area-inset-top' in allcss, 'safeBottom': 'safe-area-inset-bottom' in allcss,
        'scrollSnap': 'scroll-snap-type' in allcss, 'dvh': 'dvh' in allcss,
        'fontsGoogle': 'fonts.googleapis' in html, 'fontsLocais': any(p.suffix == '.woff2' for p in d.rglob('*')),
        'radiusVals': sorted(set(re.findall(r'--(?:radius|r)[a-z-]*\s*:\s*([0-9.]+px)', allcss))),
        'shadowTokens': sorted(set(re.findall(r'--(shadow[a-z-]*)\s*:', allcss))),
    }
json.dump(out, open(pathlib.Path(__file__).parent / 'resultados' / 'm06-tokens.json', 'w'), indent=1, ensure_ascii=False)
for s, o in out.items():
    print('=====', s)
    for k, v in o.items(): print(' ', k, json.dumps(v, ensure_ascii=False)[:400])
