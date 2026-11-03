#!/usr/bin/env python3
"""Análise estática: tokens exportados x tokens declarados; cores fixas fora de :root; safe areas; reduced motion.
Uso: python3 -I tokens.py  (lê os sites em ../../../fase3-sites/P5-conecta)"""
import re, json, pathlib
BASE = pathlib.Path(__file__).resolve().parents[3]
EXP = BASE / 'fase2-projetos/P5-conecta/exportados/conecta-tokens.css'
SITES = BASE / 'fase3-sites/P5-conecta'
OUT = pathlib.Path(__file__).resolve().parent / 'out'

def colors_of(css):
    return {m.group(1): m.group(2).lower() for m in re.finditer(r'(--color-[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})', css)}

exp = colors_of(EXP.read_text())
exp_vals = {}
for k, v in exp.items(): exp_vals.setdefault(v, []).append(k)
HEX = re.compile(r'#[0-9a-fA-F]{3,8}\b')
RGB = re.compile(r'rgba?\(\s*\d')

def strip_root(css):
    # remove blocos :root { ... } (inclusive aninhados em @media)
    out, i = [], 0
    for m in re.finditer(r':root[^{]*\{', css):
        pass
    res = re.sub(r':root\s*(\[[^\]]*\])?\s*\{[^}]*\}', '', css)
    return res

report = {}
for site in ['dev-1', 'dev-2', 'dev-3']:
    d = SITES / site
    css_files = sorted((d / 'css').glob('*.css'))
    js_files = sorted((d / 'js').glob('*.js'))
    allcss = '\n'.join(f.read_text() for f in css_files)
    declared_vals = set(v.lower() for v in HEX.findall(' '.join(re.findall(r':root[^{]*\{([^}]*)\}', allcss))))
    present = [k for k, v in exp.items() if v in declared_vals]
    missing = [k for k, v in exp.items() if v not in declared_vals]
    # cores fixas fora de :root
    hard_css = {}
    for f in css_files:
        body = re.sub(r'/\*.*?\*/', '', f.read_text(), flags=re.S)
        body = strip_root(body)
        hs = HEX.findall(body) + RGB.findall(body)
        if hs: hard_css[f.name] = len(hs)
    hard_js = {}
    for f in js_files:
        body = re.sub(r'/\*.*?\*/', '', f.read_text(), flags=re.S)
        hs = HEX.findall(body)
        if hs: hard_js[f.name] = len(hs)
    # safe areas
    rules = re.findall(r'([^{}]+)\{([^{}]*)\}', re.sub(r'/\*.*?\*/', '', allcss, flags=re.S))
    sa_top = sorted(set(sel.strip()[:60] for sel, body in rules if 'safe-area-inset-top' in body))
    sa_bottom = sorted(set(sel.strip()[:60] for sel, body in rules if 'safe-area-inset-bottom' in body))
    reduced = 'prefers-reduced-motion' in allcss
    vp_fit = 'viewport-fit=cover' in (d / 'index.html').read_text()
    gradient = len(re.findall(r'gradient\(', allcss)) + sum(len(re.findall(r'gradient\(', f.read_text())) for f in js_files)
    backdrop = 'backdrop-filter' in allcss
    dvh = 'dvh' in allcss
    mobile_first = len(re.findall(r'@media[^{]*min-width', allcss)), len(re.findall(r'@media[^{]*max-width', allcss))
    report[site] = dict(tokens_exportados=len(exp), presentes=len(present), ausentes=missing,
                        cores_fixas_css=hard_css, cores_fixas_js=hard_js, safe_top=sa_top, safe_bottom=sa_bottom,
                        reduced_motion=reduced, viewport_fit_cover=vp_fit, gradientes=gradient, backdrop=backdrop, dvh=dvh,
                        media_min_max=mobile_first)
(OUT / 'tokens.json').write_text(json.dumps(report, indent=1, ensure_ascii=False))
for s, r in report.items():
    print('=====', s)
    for k, v in r.items(): print(' ', k, v)
