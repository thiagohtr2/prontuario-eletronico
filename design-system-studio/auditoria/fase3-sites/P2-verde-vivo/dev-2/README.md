# Verde Vivo — demonstração visual da loja de plantas

Landing page + catálogo de produtos de uma floricultura fictícia, implementados exatamente a partir do `PROMPT.md`
(identidade "Floresta", família visual Soft Pill nos três componentes aprovados, navegação desktop de duas linhas
e navegação mobile com header fixo, faixa de categorias e menu inferior flutuante).

Não há backend: os produtos, o carrinho, os favoritos, o CEP e as buscas recentes são dados fictícios no próprio front-end
(o carrinho, os favoritos, o CEP e as buscas recentes ficam em `localStorage`, com fallback em memória se o navegador bloquear).

## Tecnologias

HTML + CSS + JavaScript puro (sem framework, sem build, sem dependências em tempo de execução).
Por isso **não existe pasta `dist/`**: a raiz da pasta já é a entrega.

- Fontes Fraunces (títulos) e Inter (textos) auto-hospedadas em `assets/fonts/` (variáveis, subconjunto latino, licença OFL),
  então o site funciona offline.
- Ícones: [lucide](https://lucide.dev) (ISC), embutidos como sprite SVG em `js/icons.js`.
- Ilustrações: SVG autorais geradas por `js/art.js` (nenhuma foto de banco; cores sempre ligadas aos tokens).

## Como abrir

Opção 1 — direto do disco: dê dois cliques em `index.html` (funciona via `file://`, os scripts são clássicos, sem módulos nem `fetch`).

Opção 2 — servidor estático qualquer:

```bash
python3 -m http.server 4422
# abra http://localhost:4422/
```

## Rotas (por hash, funcionam em `file://`)

| URL | O que mostra |
| --- | --- |
| `#/` | Landing |
| `#/cuidados`, `#/atelie` | Landing, rolando até a seção |
| `#/catalogo` | Catálogo. Filtros na query: `cat`, `q`, `luz`, `porte`, `cuid`, `pet=1`, `estoque=1`, `fav=1`, `max`, `sort` |
| `#/produto/p21` | Catálogo + detalhe do produto (deep link) |
| `#/catalogo?estado=carregando` / `vazio` / `erro` | Demonstra os estados de carregamento, vazio e erro (também há links no rodapé do catálogo) |

## O que dá para testar

- Desktop (≥ 768 px): faixa de anúncio dispensável, header de duas linhas (linha 2 recolhe ao rolar para baixo e volta ao subir),
  mega menu "Departamentos" (hover com atraso de 150 ms, clique, teclado, Esc), "Mais categorias" entre 1024 e 1279 px,
  faixa rolável com indicação de continuidade entre 768 e 1023 px, busca com combobox (Ctrl/⌘ + K, setas, Enter, Esc),
  endereço de entrega (CEP com validação), menu da conta, sacola com minicarrinho.
- Celular (< 768 px): header fixo com busca em tela cheia, faixa de pílulas (rolagem com snap, recolhe ao rolar),
  menu inferior flutuante com 4 destinos, painel de filtros como bottom sheet com alça de arraste.
- Catálogo: grade 3 → 2 → 1 colunas, cards Soft Pill (segunda imagem e "Adicionar à sacola" no hover; sempre visível no toque),
  filtros em drawer (Aplicar / Limpar), ordenação, chips de filtros ativos, favoritos, detalhe do produto, produto esgotado (ação desabilitada).
- Acessibilidade: HTML semântico, foco visível, `aria-current`, focos presos e devolvidos nos overlays, `prefers-reduced-motion`
  (desliga parallax, fades e transições), contraste AA nos textos (verificado por script).

## Estrutura de arquivos

```
index.html            Estrutura única: faixa de anúncio, header, landing, container do catálogo, rodapé, dock, overlays
css/
  tokens.css          Única fonte de cores/tipografia/geometria/movimento (paleta Floresta como variáveis --color-*)
  base.css            Reset, tipografia, foco, botões, chips, campos, estados (vazio/erro/skeleton), reduced-motion
  shell.css           Faixa de anúncio, header (2 linhas / celular), mega menu, pílulas, dock, rodapé
  components.css      Soft Pill: busca (combobox), overlays (drawer/sheet/modal), card de produto, carrinho, toasts, ilustrações
  landing.css         Landing assimétrica (grade de 12 colunas desalinhada de propósito)
  catalog.css         Cabeçalho do catálogo, barra de ferramentas, grade, skeleton
js/
  icons.js            Sprite SVG (gerado por tools/build-icons.js a partir do lucide-static)
  data.js             Categorias e 22 produtos fictícios
  ui.js               Utilitários, estado (carrinho/favoritos/recentes/CEP), overlays modais, popovers, toasts
  art.js              Gerador das ilustrações botânicas em SVG
  search.js           Combobox de busca
  shell.js            Header, mega menu, rolagem, popovers, sacola, rodapé
  catalog.js          Filtros, ordenação, cards, drawer de filtros, detalhe do produto, estados
  landing.js          Ilustrações da landing, revelação ao rolar, parallax, scrollspy
  app.js              Roteador por hash
assets/fonts/         Fraunces e Inter (woff2) + licenças; assets/LICENSE-lucide-icons-ISC.txt
tools/                Scripts de apoio (não fazem parte da entrega visual)
  build-icons.js      Regenera js/icons.js
  test.js             Sem overflow horizontal (320–1920 px) e sem erros de console, nas 3 rotas
  test-interactions.js, test-forms.js, test-a11y.js   Testes de interação, formulários/rotas e contraste
  shot.js             Capturas de tela (Playwright)
NOTES.md              Ambiguidades, lacunas e contradições da especificação e as decisões tomadas
```

## Testes automatizados (opcional)

Requer Node e Playwright (`require('playwright')`). Não há `npm install` nem servidor: os scripts abrem o `index.html` via `file://`.

```bash
node tools/test.js
node tools/test-interactions.js
node tools/test-forms.js
node tools/test-a11y.js
```

Larguras verificadas sem overflow: 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 900, 1024, 1150, 1280, 1440 e 1920 px.
