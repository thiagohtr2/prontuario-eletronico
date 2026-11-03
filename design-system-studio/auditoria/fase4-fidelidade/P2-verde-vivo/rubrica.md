# Rubrica de fidelidade: P2 "Verde Vivo"

Esta rubrica foi escrita **antes** de abrir qualquer arquivo dos sites (dev-1, dev-2, dev-3). Ela se apoia em três fontes:

- o briefing do cliente;
- `fase2-projetos/P2-verde-vivo/escolhas.md` e as capturas do Studio;
- o Master Prompt exportado (`exportados/verde-vivo-master-prompt.md`), citado como **MP Lnnn**. O MP é idêntico byte a byte ao `PROMPT.md` entregue aos três desenvolvedores; a conferência foi feita com `cmp`.

## Como pontuar

- Cada requisito vale **0–100 %**. Quando tem subitens, a nota é a fração de subitens atendidos. Quando não tem, a escala é 0 / 50 / 100: ausente, presente com desvio relevante, conforme.
- **Medidas marcadas com "≈"** (o MP as chama de "recomendadas, adaptáveis"):
  - desvio de até ±15 % vale 100 %;
  - de ±15 % a ±30 % vale 50 %;
  - acima de ±30 % vale 0 %.
- **Cores-chave:** o valor computado tem de ser **idêntico** ao token (hex igual). ΔE76 ≤ 2 vale 90 %; acima disso, 0 %.
- **A fidelidade mede o resultado contra a escolha aprovada no Studio**, mesmo quando o MP é ambíguo. A culpa é atribuída à parte, na coluna "Origem":
  - A: Studio;
  - B: Master Prompt;
  - C: desenvolvedor;
  - D: conflito ou limitação da especificação;
  - E: diferença aceitável.
- Além da fidelidade, calculo a **aderência às instruções claras**: a mesma média, mas só com os requisitos em que o MP foi inequívoco (sem B nem D). Ela mostra o que se pode cobrar do desenvolvedor.
- **Dimensões:** ARQ = arquitetura, DSK = desktop, MOB = celular, PAL = paleta/tokens/tipografia/geometria global, CMP = componentes, INT = interações, RSP = responsividade.
  - **Geral** = média simples de todos os requisitos testados. Informo sempre o *n*.
  - Requisitos marcados **[J]** são julgamento de design. Entram na nota, mas vêm sinalizados.
- **Viewports de teste:**
  - 1440×900 (desktop);
  - 390×844 com `isMobile: true`, `hasTouch: true`, DPR 3 (celular);
  - 768×1024 (tablet);
  - varredura em 320, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440 e 1920 px.

## 1. Arquitetura e landing (ARQ)

| ID | Requisito (fonte) | Método de medição | Limiar |
|---|---|---|---|
| ARQ-01 | Fluxo "Landing page sem login": não existe área restrita (MP L17–18) | Procurar no DOM `input[type=password]`, formulários e telas de login/cadastro | Nenhum fluxo de autenticação = 100 %. Avatar ou menu de perfil decorativo não reprova, porque o MP L167/L191 o exige (conflito D). |
| ARQ-02 | Ordem das seções da landing Folha Viva: Header leve → Hero assimétrico → Cartões escalonados → Citação recuada → Texto + imagem sangrando → Chamada final à esquerda → Rodapé (MP L28/L41) | Listar as seções de topo na ordem do DOM e conferir no visual. Seções extras de catálogo intercaladas são aceitas, porque o MP não diz onde fica o catálogo. | Nota = maior subsequência comum na ordem ÷ 7 |
| ARQ-03 | Layout desktop "Navegação superior de duas linhas": header de 2 linhas + conteúdo, sem sidebar (MP L19, L71–85) | Em 1440, existem 2 faixas horizontais distintas no topo (linha 1 e linha 2) e nenhuma sidebar | As duas faixas presentes e nenhuma sidebar = 100 % |
| ARQ-04 | Layout mobile "Header fixo com busca e menu inferior flutuante": header com busca + faixa de categorias + dock flutuante (MP L19, L112–118) | Em 390 com toque, as três regiões estão presentes e visíveis ao carregar e após rolar | 3 de 3 regiões presentes e fixas |
| ARQ-05 | Troca de arquitetura no ponto certo: abaixo de 768 px vale a mobile; a partir de 768 px, a desktop (MP L102, L141). L150 abre exceção para 600–1023 (conflito). | Em 767 e 768, ver qual arquitetura aparece; em 1024+, conferir se o dock sumiu | Dock ausente a partir de 1024 e mobile em ≤ 600 = 100 %. Zona 600–1023 tolerada em qualquer das duas (ambiguidade B). |
| ARQ-06 | Catálogo de produtos presente, com cards, busca e filtros (briefing; MP L11–12) | Contar cards de produto, verificar a busca ligada aos produtos e os controles de filtro | Seção de catálogo com ≥ 8 produtos (a vitrine do template tem 8, MP L635) e busca + filtros ligados a ela |
| ARQ-07 | Partes priorizadas do template "E-commerce de moda": Categorias (4 blocos com imagem e nome sobreposto, 4 colunas) e Vitrine (8 produtos em 4 colunas, selo, nome, preço com parcelamento, filtros/ordenar no topo) (MP L640–642) | DOM e visual em 1440 | Subitens: 4 categorias com nome sobreposto · vitrine em 4 colunas · selo · preço · parcelamento · filtrar/ordenar no topo (6 subitens) |
| ARQ-08 | Conteúdo fictício substituído (MP L64, L164, L702): nenhuma marca de exemplo ("Folha Viva", "Empório Murici", "Linho & Cia", "Orla") e nenhum item de moda ou eletrônicos | Busca textual no DOM renderizado | Zero ocorrências = 100 %. Itens herdados fora do nicho de plantas descontam 25 % cada tipo. |
| ARQ-09 | Marca "Verde Vivo" no logotipo do header e no rodapé | Texto do logotipo | Presente nos dois = 100 % |
| ARQ-10 [J] | Inspiração botânica Verdant Atelier: composição editorial, serifa expressiva, ilustrações vetoriais de plantas (nunca fotos genéricas) e muito respiro. As cores da inspiração **não** devem ser usadas (MP L558–620, L759). | Inspeção visual nas capturas; uso de SVG botânico; ausência dos hexadecimais da inspiração (#f3eee3, #2e5e3e, #c9a27e) | 0/50/100 por julgamento; o uso de cores da inspiração desconta 50 % |

## 2. Desktop: landing, header e mega menu (DSK)

| ID | Requisito (fonte) | Método | Limiar |
|---|---|---|---|
| DSK-01 | Hero assimétrico (MP L30–35, L45–46). Subitens: (a) título em serifa Fraunces nas colunas ~1–8; (b) palavra do título em itálico na cor de destaque `accent` #b07d4f; (c) imagem alta à direita, ≈440 px de altura, começando ≈80 px abaixo do topo do título; (d) imagem menor sobreposta à base do texto; (e) CTA em link com seta, não em botão cheio | Medir o h1 (família computada e largura de até ~66 % do contêiner), a cor do `em`/itálico, o retângulo da imagem e o fundo do CTA | Nota = subitens ÷ 5 (medidas com a tolerância "≈") |
| DSK-02 | Cartões em 3 colunas escalonados verticalmente em 0 / 48 / 96 px (MP L35, L47) | Medir o `top` dos 3 cartões em 1440 | Diferenças de 48 ± 12 e 96 ± 12 = 100 %; escalonamento presente com outros valores = 50 % |
| DSK-03 | Citação recuada em ≈25 % da largura, com o autor alinhado à direita (MP L36) | Distância da citação à borda esquerda do contêiner ÷ largura; `text-align` do autor | Recuo de 18–32 % e autor à direita = 100 %; um dos dois = 50 % |
| DSK-04 | Texto estreito + imagem larga sangrando até a borda direita da página (MP L37) | Borda direita da imagem = largura da viewport (±2 px) em 1440 | Sangra = 100 %; não sangra = 0 |
| DSK-05 | Chamada final alinhada à esquerda, seguida do rodapé (MP L28) | Alinhamento do bloco e do título | À esquerda = 100 % |
| DSK-06 | Faixa de anúncio: 36 px, fundo `primary` e texto `onPrimary`, com link e botão ✕ (MP L168, L183) | Altura, cor de fundo e cor do texto computadas; presença do link e do ✕ | Subitens: altura ≈36 · fundo #2d6a4f · texto #ffffff · link · ✕ (5) |
| DSK-07 | Linha 1 do header ≈64 px (MP L74–75, L162–167). Subitens: (a) altura ≈64; (b) logo com símbolo quadrado de 28 px na cor primária + nome em peso 700; (c) busca larga central (até 560–640 px, altura ≈42 px) com lupa integrada; (d) seletor de endereço de entrega; (e) conta/avatar; (f) carrinho com contador | Medidas no DOM | Subitens ÷ 6 |
| DSK-08 | Linha 2 ≈44 px: "Departamentos" (abre o mega menu) + atalhos de categorias alinhados à esquerda; ativo na cor de texto em peso 600, demais em `textMuted` (MP L76, L165, L174) | Altura, primeiro item e alinhamento | Subitens: altura ≈44 · gatilho "Departamentos" · alinhada à esquerda · estilo do ativo (4) |
| DSK-09 | Header fixo (sticky top 0, z-index ≥ 40) e com sombra suave após 8 px de rolagem (MP L189) | `position` computado; `top` após rolar 600 px; `box-shadow` antes e depois | Fixo + sombra = 100 %; só fixo = 50 % |
| DSK-10 | Largura máxima do conteúdo ≈1280 px (layout, MP L74/L91). O template sugere 1120 (L630): conflito. | Largura do contêiner principal em 1920 | 1088–1312 px = 100 % (as duas referências são aceitas); outros valores = 50 % |
| DSK-11 | Entre 1024 e 1279 px: os itens além do 4º vão para "Mais ▾" ou "Mais categorias" (MP L100, L196) | Linha 2 em 1024 e 1280 | Menu "Mais" presente em 1024, ou todos os itens cabendo sem overflow = 100 %; corte ou quebra = 0 |
| DSK-12 | Entre 768 e 1023 px: estrutura desktop compactada. O MP traz 3 instruções diferentes: faixa rolável (L101), ☰ (L197) e "compactada ou mobile" (L150). | Inspeção em 768 e 820 | Qualquer das três soluções, coerente e sem overflow = 100 % (ambiguidade B registrada) |
| DSK-13 | Vitrine em 4 colunas no desktop (template L635); a grade de cards fala em 3 → 2 → 1 (L390) | Colunas da grade de produtos em 1440 | 4 = 100 %; 3 = 75 % (ambiguidade); outro valor = 0 |

## 3. Celular: arquitetura mobile escolhida (MOB)

| ID | Requisito (fonte) | Método | Limiar |
|---|---|---|---|
| MOB-01 | Header fixo de ≈104 px: linha de marca ≈52 px com logo e ações + busca de ≈44 px em largura total; soma `env(safe-area-inset-top)` (MP L115). O Mega Empório no celular manda 56 + 48 + faixa de 32 (L198–202): conflito. | Altura do bloco fixo do topo, linhas internas e presença de `safe-area-inset-top` no CSS | Subitens: fixo ao rolar · linha de marca com logo · busca em largura total visível (nunca só um ícone) · altura total de 96–140 px · safe-area (5) |
| MOB-02 | Busca mobile com fonte de 16 px; tocar abre a tela de busca com teclado e sugestões (MP L134, L469) | `font-size` computado; toque no campo → painel/tela de sugestões visível | Subitens: 16 px · abre as sugestões · as sugestões ficam na viewport (3) |
| MOB-03 | Faixa de categorias de ≈52 px abaixo do header: pílulas com ícone + rótulo, rolagem horizontal com scroll-snap, categoria ativa destacada (MP L116) | Altura, `overflow-x`, `scroll-snap-type`, SVG + texto em cada pílula, estilo da ativa | Subitens: altura ≈52 · rolagem horizontal · scroll-snap · ícone + rótulo · ativa destacada (5) |
| MOB-04 | Menu inferior flutuante de ≈64 px, margens de 16 px, raio de 22 px, 4 destinos, com safe-area na base (MP L117, L725) | Retângulo do dock (`bottom`, `left`, `right`), `border-radius`, número de itens | Subitens: altura ≈64 · margens 16 ± 4 · raio 22 ± 3 · 4 destinos · safe-area-inset-bottom (5) |
| MOB-05 | Item ativo do dock identificável por cor primária + ícone preenchido + indicador (pílula ou ponto), com `aria-current="page"` e "nunca apenas pela cor" (MP L136) | Estilos e atributos do item ativo | Subitens: cor primária · indicador · ícone preenchido · aria-current (4) |
| MOB-06 | O conteúdo recebe padding igual à altura das barras e nada fica escondido atrás delas (MP L118) | Rolar até o fim e comparar o fundo do último elemento com o topo do dock; o topo do conteúdo não fica sob o header | Nada encoberto = 100 %; encoberto = 0 |
| MOB-07 | A navegação desktop não vira drawer, rail ou bottom nav por conta própria (L102, L733). Folha Viva (L58) e Mega Empório (L198) pedem ☰ abaixo de 768: conflito. | Presença de ☰ e de dock | Dock como navegação principal (☰ complementar aceito) = 100 %; ☰ substituindo o dock = 0 |
| MOB-08 | Faixa de anúncio no celular: 32 px, uma linha com reticências e ✕ com área de toque de 44 px (MP L201) | Medidas | Subitens: ≈32 px · uma linha · ✕ ≥ 44 × 44 (3) |
| MOB-09 | Filtros no celular: botão "Filtrar" abre bottom sheet (L687) ou drawer de até 88vw / sheet de até 90dvh com alça (L543) | Tocar no gatilho e medir o painel | Abre painel com largura ≤ 88vw ou sheet ≤ 90dvh = 100 %; abre, mas cobre a tela fora desses limites = 50 % |
| MOB-10 | Vitrine com 2 colunas compactas no celular (template L687); a grade de cards fala em 3 → 2 → 1 (L390) | Colunas em 390 | 2 = 100 %; 1 = 75 % (ambiguidade) |
| MOB-11 | Hero da landing no celular: uma coluna com assimetria (recuos alternados de 24–40 px); imagem alta com largura menos 40 px de recuo; a imagem menor fica abaixo, recuada (MP L54–57) | Offset esquerdo e largura das imagens do hero em 390 | Subitens: uma coluna · imagem com recuo de 24–48 px · imagem menor abaixo do texto (3) |
| MOB-12 | Os deslocamentos dos cartões são removidos abaixo de 768 px (MP L56) | `top` relativo dos cartões em 390 | Sem buracos de 48/96 px = 100 % |
| MOB-13 | Alvos de toque de no mínimo 44 × 44 px no celular (MP L146, L720) | Em 390, enumerar os elementos interativos visíveis (a, button, input, [role=button], summary, label clicável) e contar os com largura ou altura < 44 | 0 violações = 100 %; nota = 1 − violações/total (piso de 0) |

## 4. Paleta, tipografia e geometria global (PAL)

| ID | Requisito (fonte) | Método | Limiar |
|---|---|---|---|
| PAL-01 | Fundo da página = `bg` #f6faf6 (MP L230) | `background-color` computado do `body`/`main` | Idêntico |
| PAL-02 | Texto principal = `text` #1b2e24 (MP L234) | `color` computado do `body` e dos parágrafos | Idêntico |
| PAL-03 | Primária #2d6a4f nos botões primários, na faixa de anúncio e no botão "Aplicar filtros" (MP L221) | `background-color` computado | Idêntico em todos os pontos medidos |
| PAL-04 | Destaque #b07d4f na palavra em itálico do hero e no contador do carrinho (MP L168/L192, L228) | `color` / `background-color` computados | Idêntico nos 2 pontos |
| PAL-05 | Tokens centralizados em variáveis CSS com os valores exportados; nada de cores fixas espalhadas (MP L208, L753) | Extrair as custom properties de `:root`, comparar com os 46 tokens de `verde-vivo-tokens.css` e contar hex literais fora de `:root` | Nota = 70 % × (fração de tokens presentes com valor idêntico, sobre os 20 tokens-chave) + 30 % × (1 se ≤ 5 hex literais fora dos tokens; 0,5 se ≤ 20; senão 0) |
| PAL-06 | Fontes: títulos em Fraunces, peso ≈650; textos em Inter, peso 400, base 15 px (MP L270–282) | `font-family` e `font-weight` computados de h1/h2/h3 e `body`; `document.fonts.check` e fontes carregadas | Subitens: h1–h3 Fraunces carregada · peso 600–700 · body Inter carregada · base 15 px (±1) (4) |
| PAL-07 | Escala e mínimos tipográficos: nada abaixo de 12 px; filtros e botões com ≥ 14 px (MP L275) | Varrer os elementos de texto visíveis em 1440 e 390 | Sem violações = 100 %; nota = 1 − fração de violações |
| PAL-08 | Geometria global (fora dos 3 componentes): raios 6/8/12, superfícies contornadas com borda de 1 px, **sem sombra** em superfícies de conteúdo; só elementos flutuantes têm elevação (MP L292–308, L748) | `border-radius`, `border` e `box-shadow` de superfícies não-componente (seções, blocos de categoria, campos genéricos) | Subitens: raios na escala 6/8/12 · conteúdo sem sombra · bordas finas (3) |
| PAL-09 | Cores da inspiração não usadas (decisão de prioridade, MP L759) | Busca dos hex da inspiração no CSS computado ou na fonte | Zero = 100 % |
| PAL-10 | Foco visível: anel de 2–3 px na cor `focusRing` #2d6a4f (MP L315) | Navegar com Tab e ler o `outline`/`box-shadow` do elemento focado | Visível e na cor certa = 100 %; visível com outra cor = 50 % |

## 5. Componentes aprovados (CMP)

O Studio aprovou três instâncias da família Soft Pill:

- "Card de produto do catálogo";
- "Busca de produtos (plantas)";
- "Painel de filtros do catálogo".

Para essas três, as propriedades do componente (pílula de 999 px, contêiner de 22 px, sem borda, sombra difusa baixa, títulos Inter 650, base 14 px) contradizem a geometria global (8 px, contornada, sem sombra, Fraunces). A **escolha visual aprovada** nas prévias do Studio é a Soft Pill: cartão de 22 px, botão pílula, sem borda, sombra suave e título sem serifa. É contra ela que meço. Se o resultado divergir por causa dessa contradição, a origem é B.

| ID | Requisito (fonte) | Método | Limiar |
|---|---|---|---|
| CMP-01 | Estrutura do card de produto (MP L330, L341–348): mídia 16/9 → etiqueta ("Novo") → título (nome da planta) → texto de até 3 linhas (descrição, porte, cuidados, preço) → rodapé com meta e ação "Ver produto"; ícone Folha | DOM do primeiro card | Subitens: mídia 16/9 (±5 %) · etiqueta · título · texto com preço · rodapé com botão "Ver produto" · ícone de folha (6). A mídia 4:5 do template conta como ambiguidade B. |
| CMP-02 | Visual Soft Pill do card (MP L349–359): contêiner de 22 px, botão pílula, sem borda, sombra difusa baixa, superfície #fff, ação primária sólida #2d6a4f / #fff, título Inter ≈650 | Estilos computados | Subitens: raio 22 ± 3 · botão de raio ≥ 20 (pílula) · sem borda (ou borda transparente) · sombra difusa presente · fundo #ffffff · botão #2d6a4f com texto #fff · título em Inter (7) |
| CMP-03 | Estados do card (MP L380–387): hover escurece ou eleva; active com scale 0,98; foco visível; transição de ~160 ms | Regras CSS (`:hover`, `:active`, `:focus-visible`) e `transition-duration` computado | Subitens: hover · active 0,98 · focus-visible · transição de 120–250 ms (4) |
| CMP-04 | Componente de busca Soft Pill (MP L405–438): lupa à esquerda, placeholder "Buscar plantas…", atalho ⌘K visível no desktop, sem botão limpar, altura de 40–44, pílula 999, fundo tonal `surfaceAlt` sem borda, painel com grupos "Recentes" e "Sugestões", `role="combobox"` + `aria-expanded` + listbox | DOM e estilos em 1440 | Subitens: lupa à esquerda · placeholder exato · ⌘K visível · altura de 40–44 · raio de pílula · fundo tonal sem borda · grupos Recentes/Sugestões · combobox/listbox (8) |
| CMP-05 | Drawer de filtros Soft Pill (MP L485–531): overlay escurecido; painel à direita de 360–420 px no desktop; `role="dialog"` com `aria-modal`; cabeçalho com título "Filtros" e botão fechar; corpo rolável; rodapé fixo com "Aplicar filtros"; contêiner de 22 px | Abrir em 1440 e medir | Subitens: overlay · lado direito · largura de 360–420 · dialog/aria-modal · título "Filtros" + fechar · rodapé com "Aplicar filtros" · raio ≈22 nos cantos internos (7) |
| CMP-06 | Critérios de filtro adequados a plantas (o briefing pede filtros; o Studio só oferecia critérios genéricos, e o MP não lista os critérios) | Ler as opções do drawer | Critérios de plantas (luz, porte, pet friendly, cuidado, preço, categoria) = 100 %; critérios genéricos copiados (Status/Ativos/Pausados) = 0 |
| CMP-07 | Estados de vazio, carregamento e erro nas listas (MP L752, L459) | Buscar um termo sem resultado e observar; procurar um estado de carregando | Vazio = 60 %; vazio + carregando (spinner no lugar da lupa) = 100 % |

## 6. Interações (INT)

| ID | Requisito (fonte) | Método | Limiar |
|---|---|---|---|
| INT-01 | Mega menu (MP L96, L184, L187): abre por clique (hover opcional) e teclado; painel de até 760 px ancorado abaixo do header; 3 colunas com títulos em caixa alta + cartão de destaque; foco vai para o primeiro link; fecha com Esc e clique fora | Playwright: clicar no gatilho, medir, pressionar Esc, clicar fora, verificar o `activeElement` | Subitens: abre por clique · largura ≤ 760 · 3 colunas + destaque · títulos em caixa alta · foco no 1º link · Esc fecha · clique fora fecha (7) |
| INT-02 | Busca do header (MP L190, L458): ao focar mostra o painel de sugestões e recentes **com a mesma largura do campo**, logo abaixo; Ctrl+K foca; setas navegam; Esc fecha | Focar, medir a largura do painel contra a do campo (±10 %), testar Ctrl+K, ArrowDown e Esc | Subitens: painel ao focar · mesma largura · Ctrl+K · setas · Esc (5) |
| INT-03 | Busca funcional: digitar filtra os produtos ou sugestões | Digitar o nome de uma planta presente no catálogo; contar os cards e sugestões | Os resultados mudam de forma coerente = 100 % |
| INT-04 | Filtros funcionais: aplicar o drawer altera a lista; existe ordenação | Escolher um critério, aplicar, contar os cards; trocar a ordenação | Subitens: filtra · ordena (2) |
| INT-05 | Comportamento do drawer (MP L533, L213): fecha com Esc, overlay e botão; foco preso enquanto aberto e devolvido ao gatilho; animação de 200–250 ms | Playwright: Tab ×15 dentro do painel; Esc; `activeElement` | Subitens: Esc · overlay · botão fechar · foco preso · foco devolvido (5) |
| INT-06 | Linha 2 do header recolhe ao rolar para baixo e reaparece ao rolar para cima (MP L95) | Medir a linha 2 depois de `scrollBy(0, 800)` e `scrollBy(0, -200)` | Recolhe e reaparece = 100 % |
| INT-07 | Faixa de anúncio dispensável pelo ✕ (MP L168) | Clicar no ✕ e verificar se a faixa sumiu sem deixar buraco | Funciona = 100 % |
| INT-08 | Carrinho: contador em bolinha `accent`; adicionar produto incrementa; clicar abre a sacola ou um minicarrinho lateral (MP L192, L675) | Clicar em "Adicionar"/"Ver produto" e no carrinho | Subitens: contador accent · incrementa · abre a sacola (3) |
| INT-09 | Perfil: o avatar abre menu com nome/e-mail, Meu perfil, Configurações, Ajuda e Sair (MP L191). O MP contradiz L17 ("não existe área restrita"). | Clicar no avatar | Menu presente = 100 %; ausência justificada pelo conflito = nota 0 com origem D |
| INT-10 | Celular: tocar em uma categoria da faixa filtra o conteúdo **sem mover a faixa** (MP L135) | Em 390 com toque, rolar a faixa, tocar numa pílula, comparar o `scrollLeft` antes e depois e a lista de produtos | Subitens: filtra · a faixa não se move · a ativa muda (3) |
| INT-11 | Celular: itens do dock mudam o ativo e levam ao destino (MP L117, L136) | Tocar em cada destino | Resposta coerente (navegação ou rolagem até a seção, com o ativo atualizado) = 100 % |
| INT-12 | `prefers-reduced-motion` respeitado (MP L729) | Procurar a media query no CSS | Presente = 100 % |

## 7. Responsividade (RSP)

| ID | Requisito (fonte) | Método | Limiar |
|---|---|---|---|
| RSP-01 | Nenhum overflow horizontal de 320 a 1920 px (MP L717) | `document.documentElement.scrollWidth > innerWidth` nas 14 larguras | Nota = larguras sem overflow ÷ 14 |
| RSP-02 | Nenhum texto cortado nem sobreposição indevida (MP L718–719) | Elementos com `scrollWidth > clientWidth + 1` e `overflow: hidden` sem reticências intencionais; inspeção visual das capturas em 320, 390, 768 e 1440 | Sem ocorrências = 100 %; uma ocorrência relevante = 50 %; várias = 0 |
| RSP-03 | Inputs com ≥ 16 px no celular (MP L721) | `font-size` de todos os inputs visíveis em 390 | Todos ≥ 16 = 100 % |
| RSP-04 | Celular na horizontal: barras fixas ≤ 25 % da altura (MP L140, L726) | Em 844×390 com toque, somar as alturas das barras fixas visíveis | ≤ 25 % (97 px) = 100 %; ≤ 35 % = 50 % |
| RSP-05 | Tablet 768×1024 coerente: sem overflow, sem navegação duplicada ou sobreposta | Captura e DOM em 768 | Coerente = 100 % |

## 8. Composições e evidências

- Para cada site, capturo 1440×900, 390×844 (`isMobile`/`hasTouch`) e 768×1024: dobra e página inteira, além dos estados (mega menu, busca, drawer, dock, faixa).
- As composições lado a lado juntam a captura do Studio e a do site na mesma altura: `convert img1 img2 +append`.
- **Ressalva de independência (DESVIOS-DE-ISOLAMENTO.md):** o dev-2 pode ter visto capturas antigas de módulos do Studio. Por isso, semelhanças visuais finas do dev-2 com as prévias do Studio (por exemplo, layout idêntico ao da Inspiration Gallery) são anotadas com essa ressalva. Não somam nem descontam na nota.
