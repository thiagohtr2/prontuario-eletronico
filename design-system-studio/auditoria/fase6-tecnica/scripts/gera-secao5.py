# Gera as tabelas da seção 5 (desempenho) a partir dos JSON em dados/.
import csv, json, os
D = os.path.join(os.path.dirname(__file__), '..', 'dados')
J = lambda f: json.load(open(os.path.join(D, f)))
out = []
w = out.append

# 5.1 build
rows = list(csv.DictReader(open(os.path.join(D, 'build-assets.csv'))))
tot = {}
for r in rows:
    t = tot.setdefault(r['tipo'], [0, 0, 0])
    t[0] += int(r['bruto_bytes']); t[1] += int(r['gzip_bytes']); t[2] += 1
w('### 5.1 Tamanho do build (`dados/build-assets.csv`, gzip -9 calculado localmente)\n')
w('| Tipo | Arquivos | Bruto | gzip |')
w('| --- | --- | --- | --- |')
for k in ['js', 'css', 'woff2']:
    t = tot[k]
    w(f'| {k} | {t[2]} | {t[0]/1024:.0f} KB | {t[1]/1024:.0f} KB |')
w('\nMaiores arquivos:\n')
w('| Arquivo | Conteúdo | Bruto | gzip |')
w('| --- | --- | --- | --- |')
desc = {
    'catalog-UkV6Iy_N.js': 'catálogos de entrada, inspiração, cores, templates e navegação (um único chunk compartilhado)',
    'InspirationPage-C6hq26Qz.js': 'galeria de inspiração com os 20 sites',
    'index-C6Bu2Cqn.js': 'núcleo: React, roteador, Zod, store, shell, ícones',
    'text-V1Ac2YwC.js': 'motor de prompts + famílias/categorias de componentes',
    'TemplatesPage-B3gY76Be.js': 'templates (renderizadores)',
    'LandingPreview-VxUGRd_B.js': 'prévias de landing/login',
    'ComponentLibrary-Dx1ccL5w.js': 'biblioteca de componentes',
    'catalog-CknkcLD7.js': 'catálogo de layouts desktop/mobile',
    'NavigationShowcase-J02zvCFp.js': 'Navigation Showcase',
    'MobileStudio-zvxuMjYu.js': 'galerias de layout (celular + esquemas)',
    'server.browser-BVq-L8Gg.js': 'react-dom/server (renderToStaticMarkup para exportar HTML)',
}
for r in sorted(rows, key=lambda r: -int(r['bruto_bytes']))[:11]:
    if r['tipo'] != 'js':
        continue
    w(f"| `{r['arquivo']}` | {desc.get(r['arquivo'], '')} | {int(r['bruto_bytes'])/1024:.0f} KB | {int(r['gzip_bytes'])/1024:.0f} KB |")
w('\nFontes: 4 famílias variáveis (Inter, Fraunces, Space Grotesk, JetBrains Mono) com todos os subsets (latin, latin-ext, cyrillic, greek, vietnamese) = 18 arquivos/422 KB; graças ao `unicode-range` o navegador baixa só o necessário (47 KB na home, até 144 KB na inspiração). O build autônomo `dist-standalone/index.html` (gerado antes do commit auditado; só informativo) tem 3,1 MB (1,1 MB gzip) com 19 fontes em base64.\n')

# 5.2 JS por rota
w('### 5.2 JavaScript necessário por rota (mapa de pré-carregamento do Vite, `dados/chunks-por-rota.txt`)\n')
w('| Rota (chunk) | Arquivos | JS bruto | JS gzip |')
w('| --- | --- | --- | --- |')
for line in open(os.path.join(D, 'chunks-por-rota.txt')).read().splitlines()[1:]:
    c, n, jr, jg, cg = [x.strip() for x in line.split('|')]
    w(f'| {c.split("-")[0]} | {n} | {jr} KB | {jg} KB |')
w('\nO módulo de cores (`ColorPage` + `ColorSystem`) tem ≈12 KB, mas a rota exige 1,12 MB porque o `PromptButton` puxa o motor e todos os catálogos (TE-14).\n')

# 5.3 carga a frio
for tag, label in [('desktop', 'desktop 1440×900, 5 execuções'), ('mobile', 'viewport 390×844 sem limitação de CPU/rede, 3 execuções')]:
    d = J(f'perf-carga-{tag}.json')
    w(f'### 5.3{"a" if tag=="desktop" else "b"} Carga a frio por rota — {label} (mediana; `dados/perf-carga-{tag}.json`)\n')
    w('| Rota | FCP | LCP (mín–máx) | Conteúdo pronto¹ | TBT | Long tasks | CLS | JS baixado | Fontes | Nós DOM | Heap |')
    w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
    for k, v in d['summary'].items():
        w(f"| `{k}` | {v['fcp']:.0f} ms | {v['lcp']:.0f} ms ({v['lcpMin']}–{v['lcpMax']}) | {v['ready']:.0f} ms | {v['tbt']:.0f} ms | {v['longTasks']:.0f} | {v['cls']:.2f} | {v['jsKB']} KB / {v['jsFiles']:.0f} arq. | {v['fontKB']} KB | {v['domNodes']:.0f} | {v['heapMB']:.1f} MB |")
    la = [v['loadavgMedian'] for v in d['summary'].values()]
    w(f'\nLoad average durante a série: mediana {sorted(la)[len(la)//2]:.1f} (4 CPUs). ¹ “Conteúdo pronto” = primeiro quadro com o `h1` do módulo dentro de `#conteudo` e sem o fallback “Carregando…”.\n')

# 5.4 Lighthouse
p = os.path.join(D, 'lighthouse-resumo.json')
if os.path.exists(p):
    d = J('lighthouse-resumo.json')
    w('### 5.4 Lighthouse 13 — desempenho (3 execuções por linha, mediana; throttling simulado padrão; `dados/lighthouse/`)\n')
    w('| URL · perfil | Nota (3 execuções) | FCP | LCP | TBT | Speed Index | CLS | Bytes | JS não usado | Trabalho na thread principal |')
    w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
    for k in sorted(d):
        v = d[k]
        w(f"| {k} | {v['score']} ({', '.join(map(str, v['scores']))}) | {v['fcp_ms']/1000:.1f} s | {v['lcp_ms']/1000:.1f} s | {v['tbt_ms']:.0f} ms | {v['si_ms']/1000:.1f} s | {v['cls']:.2f} | {v['bytes_KB']} KB | {v['unusedJs_KB']} KB | {v['mainthread_ms']/1000:.1f} s |")
    w('\nAtenção: o servidor do build não comprime (HTTP/1.0); com gzip/brotli na hospedagem real os bytes de JS caem ≈70 % (home: 874 → 267 KB), o que reduz sobretudo o LCP do perfil mobile, dominado pela rede lenta simulada (≈1,6 Mbit/s). TBT e trabalho na thread principal não dependem da compressão: são o custo real de renderizar as galerias (CPU simulada 4× mais lenta). O Lighthouse avisou em parte das execuções que a CPU estava mais lenta que o esperado (interferência dos outros agentes); as notas de desktop variaram até 20 pontos entre execuções.\n')

# 5.5 troca de rota e memória
d = J('perf-memoria.json')
w('### 5.5 Troca de rota dentro do app (`dados/perf-memoria.json`, 3 rodadas; mediana)\n')
w('| Rota | 1ª visita (inclui baixar o chunk) | Visitas seguintes | Nós DOM |')
w('| --- | --- | --- | --- |')
for k, v in d['routeSummary'].items():
    w(f"| `{k}` | {v['primeiraVisitaMs']} ms | {v['visitaEmCacheMs']} ms | {v['nosDom']:.0f} |")
w('\nMemória (heap JS após coleta de lixo forçada, mediana de 3 rodadas):\n')
w('| Momento | Heap | Nós | Listeners |')
w('| --- | --- | --- | --- |')
for m in d['memSummary']:
    w(f"| {m['etapa']} | {m['heapMB']} MB | {m['nodes']:.0f} | {m['listeners']:.0f} |")
w('')

# 5.6 galerias
p = os.path.join(D, 'perf-galerias.json')
if os.path.exists(p):
    d = J('perf-galerias.json')
    r = J('perf-galerias-react.json') if os.path.exists(os.path.join(D, 'perf-galerias-react.json')) else {'summary': {}}
    w('### 5.6 Latência ao clicar miniaturas (Event Timing API — duração do clique até o próximo quadro, base do INP; `dados/perf-galerias*.json`)\n')
    w('| Galeria | Itens | INP mediano² | Pior clique | Long tasks por 10 cliques | Mutações de DOM por clique | Componentes React renderizados por clique³ | Nós DOM |')
    w('| --- | --- | --- | --- | --- | --- | --- | --- |')
    for k, v in d['summary'].items():
        if 'error' in v:
            w(f'| {k} | — | erro: {v["error"]} | | | | | |'); continue
        rv = r['summary'].get(k, {})
        w(f"| {k} | {v['items']} | {v['inpMedianaDasMedianas']:.0f} ms | {v['inpPior']:.0f} ms | {v['longTasksPorRodada']:.0f} | {v['mutacoesPorClique']:.0f} | {rv.get('componentesRenderizadosPorClique', '—')} | {v['nosDom']:.0f} |")
    w('\n² mediana, entre 3 rodadas, da mediana de 10 cliques distribuídos pela galeria; limite “bom” do INP = 200 ms. ³ medido numa rodada separada com um gancho mínimo do React DevTools (`perf-lib.cjs → REACT_HOOK`): conta componentes cujas props ou estado mudaram em cada commit.\n')
print('\n'.join(out))
