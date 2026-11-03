"""Análise estática do CSS/JS de cada site: tokens exportados presentes, cores fixas fora dos tokens,
safe areas, 100dvh, prefers-reduced-motion, viewport-fit, raios usados. Só leitura."""
import json, re, pathlib, sys

BASE = pathlib.Path('/home/user/prontuario-eletronico/design-system-studio/auditoria')
SITES = BASE / 'fase3-sites/P1-atlas-workspace'
OUT = BASE / 'fase4-fidelidade/P1-atlas-workspace/medicoes/s11-estatico.json'
tok_css = (BASE / 'fase2-projetos/P1-atlas-workspace/exportados/atlas-workspace-tokens.css').read_text()
export = dict(re.findall(r'--(color-[a-z0-9-]+):\s*(#[0-9a-f]{6})', tok_css))

HEX = re.compile(r'#[0-9a-fA-F]{3,8}\b')
RGB = re.compile(r'rgba?\(\s*\d')
res = {}
for dev in ['dev-1', 'dev-2', 'dev-3']:
    d = SITES / dev
    css_files = sorted((d / 'css').glob('*.css'))
    js_files = sorted((d / 'js').glob('*.js'))
    allcss = '\n'.join(f.read_text() for f in css_files)
    # bloco(s) :root com tokens
    roots = re.findall(r':root\s*\{([^}]*)\}', allcss)
    rootvars = {}
    for blk in roots:
        for k, v in re.findall(r'--([a-zA-Z0-9-]+)\s*:\s*([^;]+);', blk):
            rootvars[k] = v.strip()
    hexvals = {v.lower() for v in rootvars.values() if re.fullmatch(r'#[0-9a-fA-F]{6}', v)}
    present = {k: (v in hexvals) for k, v in export.items()}
    # literais de cor fora das declarações de custom properties
    def literals(text):
        n = 0; ex = []
        for line in text.splitlines():
            s = line.strip()
            if s.startswith('--') or s.startswith('/*') or s.startswith('*') or s.startswith('//'):
                continue
            for m in HEX.findall(s) + RGB.findall(s):
                n += 1
                if len(ex) < 8: ex.append(s[:90])
        return n, ex
    css_lit = {}
    for f in css_files:
        css_lit[f.name] = literals(f.read_text())
    js_lit = {}
    for f in js_files:
        t = f.read_text()
        # ignora data-URIs de SVG com cor codificada
        js_lit[f.name] = literals(t)
    idx = (d / 'index.html').read_text()
    res[dev] = {
        'css_files': [f.name for f in css_files],
        'root_vars': len(rootvars),
        'export_tokens_present': sum(present.values()), 'export_tokens_total': len(present),
        'missing': [k for k, v in present.items() if not v],
        'css_literals': {k: v[0] for k, v in css_lit.items()},
        'css_literal_examples': {k: v[1][:4] for k, v in css_lit.items() if v[0]},
        'js_literals': {k: v[0] for k, v in js_lit.items() if v[0]},
        'js_literal_examples': {k: v[1][:3] for k, v in js_lit.items() if v[0]},
        'safe_top': len(re.findall(r'safe-area-inset-top', allcss)),
        'safe_bottom': len(re.findall(r'safe-area-inset-bottom', allcss)),
        'viewport_fit_cover': 'viewport-fit=cover' in idx,
        'dvh': len(re.findall(r'\b100dvh\b', allcss)),
        'vh100': len(re.findall(r'\b100vh\b', allcss)),
        'reduced_motion': len(re.findall(r'prefers-reduced-motion', allcss)),
        'radius_values': sorted(set(re.findall(r'border-radius\s*:\s*([^;]+);', allcss)))[:25],
        'gradients': len(re.findall(r'(linear|radial)-gradient', allcss)),
        'box_shadows': sorted(set(re.findall(r'box-shadow\s*:\s*([^;]+);', allcss)))[:15],
        'font_family_decl': sorted(set(re.findall(r'font-family\s*:\s*([^;]+);', allcss)))[:6],
        'font_vars': {k: v for k, v in rootvars.items() if 'font' in k or 'ff' in k}
    }
json.dump(res, open(OUT, 'w'), indent=1, ensure_ascii=False)
for k, v in res.items():
    print('#####', k)
    for kk, vv in v.items():
        print(' ', kk, ':', vv)
