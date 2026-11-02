# Rubrica de fidelidade — P4 "Centro Operacional"

Escrita **antes** de abrir os sites (dev-1, dev-2, dev-3). Até este ponto, li apenas as evidências da Fase 2 (`escolhas.md`, `relatorio.md`, `exportados/`, `capturas/`) e a lista de arquivos das pastas dos sites, para confirmar que os três `PROMPT.md` são byte a byte iguais ao Master Prompt exportado (`cmp` sem diferenças).

Fontes dos requisitos:
- **[BR]** briefing do cliente;
- **[ES]** `escolhas.md` e capturas aprovadas no Studio;
- **[MP Lnn]** linha do `centro-operacional-master-prompt.md`;
- **[TK]** `centro-operacional-tokens.css` e JSON. Atenção: os desenvolvedores **não** receberam esses arquivos. Os valores coincidem com a tabela da seção D do prompt.

## 1. Regras de pontuação

- Cada requisito recebe uma nota de 0 a 100%. Quando o requisito tem subitens ou vários viewports, a nota é a média deles.
- **Nota de dimensão** = média simples dos requisitos testados na dimensão. Sempre informo quantos requisitos foram testados (n).
- **Nota geral** = média simples de todos os requisitos testados. Todos têm o mesmo peso.
- **Requisito não aplicável** (por exemplo, o site não tem o elemento e o prompt não o exige) sai do denominador e fica registrado como "N/A".
- **Fidelidade** é medida contra a **escolha do Studio**, ou seja, o que o usuário aprovou. A **origem** (A–E) explica a causa do desvio:
  - **A**: o Studio não registrou ou não exportou a escolha.
  - **B**: o Master Prompt está ambíguo, incompleto ou contraditório.
  - **C**: a instrução era clara e o desenvolvedor não a cumpriu.
  - **D**: há conflito ou limitação da própria especificação.
  - **E**: a diferença é aceitável.
- Quando o prompt admite mais de uma leitura compatível com a escolha, qualquer leitura compatível vale 100% (E).
- Itens subjetivos são marcados com **[JD]** (julgamento de design). Nesses casos, registro o critério usado.
- **Tolerâncias:**
  - Dimensões recomendadas ("≈"): ±15% do valor recomendado.
  - Cor-chave: igual ao token, comparando o hex do valor computado `rgb()`. Diferenças de canal ≤ 2, por arredondamento de opacidade, contam como iguais.
  - Rolagem vertical do documento: `document.scrollingElement.scrollHeight − innerHeight ≤ 1`.
  - Overflow horizontal: `scrollWidth − innerWidth ≤ 1`.
  - Texto cortado: elemento com texto próprio, com `overflow` hidden/clip/ellipsis e `scrollWidth > clientWidth + 1` ou `scrollHeight > clientHeight + 1`.
  - Sobreposição: interseção > 2 px entre irmãos visíveis de regiões diferentes (header/conteúdo/painel/rodapé/abas).
  - Alvo de toque: `getBoundingClientRect` ≥ 44×44 px em 390×844, emulação `isMobile`/`hasTouch`.

## 2. Viewports e ferramentas

- **Capturas:**
  - 1440×900 e 1920×1080 (desktop);
  - 768×1024 (tablet);
  - 390×844 (`isMobile: true`, `hasTouch: true`, `deviceScaleFactor: 2`, depois reduzido a 1× para composição).
- **Viewports extras de medição:**
  - 1280×800 (referência das medidas);
  - 1024×768 e 1180×800 (faixa "alertas viram aba");
  - 1280×600 (altura < 640);
  - 2560×1440 (monitor grande);
  - 390×500 e 740×360/844×390 (altura < 560 e paisagem);
  - 360×780, 375×667, 412×915, 430×932 (celulares).
- **Varredura de larguras:** 320, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px.
  - Altura de 900 px para larguras ≥ 1024 e de 844 px para larguras menores. Para 768 e 820, uso 1024 e 1180 px.
  - Larguras < 768 rodam com emulação móvel.
- **Ferramentas:** Playwright 1.63 (Chromium), servidores `python3 -m http.server` nas portas 4541–4543, ImageMagick e Pillow.

## 3. Requisitos

### 3.1 Arquitetura (ARQ) — 7 requisitos

| ID | Requisito | Fonte | Método | Limiar |
| --- | --- | --- | --- | --- |
| ARQ1 | Abre direto na aplicação, sem landing, login nem cadastro | [ES] [MP L17–18] | Carregar `index.html` e verificar se a primeira tela é a tela operacional, sem formulário de login nem hero | Binário |
| ARQ2 | Regiões do "Painel operacional": header, conteúdo (grade de status), painel de alertas e barra de status | [ES] [MP L26–40] | DOM: localizar as 4 regiões em 1440×900 | Nota = regiões / 4 |
| ARQ3 | O celular usa a arquitetura própria "One Screen com painel em abas" e não deriva do desktop (sem drawer, rail ou bottom nav) | [ES] [MP L58, L71, L80–83, L105] | 390×844: abas no topo; ausência de nav inferior, drawer e rail | Binário |
| ARQ4 | Nenhum modelo de header ou sidebar adicionado; sem menu lateral | [MP L111] | DOM/visual em 1440 | Binário |
| ARQ5 | HTML + CSS + JavaScript puros (abre por file:// ou servidor estático, sem framework nem build) | [MP L13] | Inspecionar `index.html` e os recursos carregados | Binário |
| ARQ6 | HTML semântico com landmarks (header, main, aside/complementary, footer) e hierarquia de títulos | [MP L425] | DOM | Nota = landmarks presentes / 4 |
| ARQ7 | Os 2 componentes aprovados ("Indicadores" e "Dados operacionais") estão na tela principal | [ES] [MP L223] | DOM em 1440 e 390 | Nota = presentes / 2 (média dos dois viewports) |

### 3.2 Desktop (DSK) — 15 requisitos

| ID | Requisito | Fonte | Método | Limiar |
| --- | --- | --- | --- | --- |
| DSK1 | One Screen: sem rolagem vertical do documento | [BR] [MP L20, L29] | Medir em 1280×800, 1440×900 e 1920×1080 | Nota = viewports aprovados / 3 |
| DSK2 | Grade de 2 colunas (conteúdo + alertas à direita), com os alertas entre o header e o rodapé | [ES] [MP L30, L37] | `getBoundingClientRect` em 1440 | Binário |
| DSK3 | Header ≈ 52 px | [MP L30, L44] | Altura em 1440×900 | 44,2–59,8 px |
| DSK4 | Painel de alertas ≈ 304 px | [MP L30, L45] | Largura em 1280 e 1440 | 258–350 px. Nota = média dos dois viewports |
| DSK5 | Barra de status ≈ 32 px, fixa na base, com relógio, conexão e última atualização | [MP L30, L32, L46] | Altura (40%), base = innerHeight (20%), 3 conteúdos (40%) | 27–37 px |
| DSK6 | Shell com `gap: 0` e `padding: 0` (regiões encostadas e separadas por borda) | [MP L38–39] | Arestas adjacentes das regiões em 1440 | Diferença ≤ 1 px |
| DSK7 | Grade central de blocos de status (filas, SLA, equipes), com cor semântica acompanhada de ícone e texto | [ES] [MP L31] | DOM/visual. Subitens: filas, SLA, equipes, semântica com ícone e texto | Nota = subitens / 4 |
| DSK8 | Alertas: lista cronológica, severidade, rolagem interna (`overflow` auto + `overscroll-behavior: contain`) e indicação de que há mais conteúdo (fade ou sombra) | [MP L32, L49] | DOM e CSS computado | Nota = subitens / 4 |
| DSK9 | Rolagem local nos painéis variáveis, sem conteúdo cortado nem escondido | [MP L49–50, L64] | Detector de texto cortado em 1280×800 e 1440×900. Painéis com `overflow` auto | Nota = 100% se não houver corte. −25% por ocorrência relevante |
| DSK10 | De 1024 a 1279 px, os alertas viram uma aba alternável com a grade | [MP L55] | 1024×768 e 1180×800: alertas ocultos + controle que alterna e funciona | Nota = média dos dois viewports |
| DSK11 | De 768 a 1023 px vale a arquitetura desktop (compactada), não as abas móveis | [MP L58, L98] (conflito com L106: "600 e 1023") | 768×1024 e 820×1180 | Desktop derivado = 100%; abas móveis = 50% (B) |
| DSK12 | Altura útil < 640 px: One Screen desativado (o body rola, painéis empilhados, nada escondido) | [MP L56] | 1280×600 | Binário (+ verificação de corte) |
| DSK13 | Adaptação para monitores grandes **[JD]** | [BR] [MP L11, L61] | 1920×1080 e 2560×1440: sem rolagem nem overflow. Procurar regra explícita (media query ≥ 1440/1920/2560, `clamp`, mais colunas ou escala) e efeito visível; medir a ocupação útil | Regra explícita com efeito visível = 100%; só esticamento fluido sem quebra = 60%; quebra = 0 |
| DSK14 | Varredura de 768 a 1920 px sem overflow horizontal, sobreposição nem texto cortado | [MP L388–390] | 768, 820, 1024, 1280, 1440, 1920 | Nota = larguras aprovadas / 6 |
| DSK15 | Shell em `100dvh` com fallback `100vh`, e `overflow: hidden` no body só no modo One Screen | [MP L29, L398] | CSS-fonte e valores computados | Nota = dvh + fallback (50%) + overflow condicionado (50%) |

### 3.3 Celular (MOB) — 12 requisitos

| ID | Requisito | Fonte | Método | Limiar |
| --- | --- | --- | --- | --- |
| MOB1 | Topbar e abas fixas no topo; sem bottom nav, drawer nem rail em retrato | [ES] [MP L71, L80–83] | 390×844 (`isMobile`) | Binário |
| MOB2 | Topbar ≈ 56 px e abas ≈ 44 px | [MP L74, L88] | Alturas medidas | Topbar 47,6–64,4 px (50%). Abas 44–50,6 px (50%; ≥ 44 obrigatório pela regra de toque) |
| MOB3 | Sem rolagem principal com altura ≥ 560 px | [BR] [MP L75] | 390×844, 360×780, 375×667, 412×915, 430×932 | Nota = aprovados / 5 |
| MOB4 | Abas funcionais: o clique troca o painel, sem mudar a altura nem gerar rolagem | [MP L71, L92] | Clicar em cada aba e medir scrollHeight e altura do shell antes e depois | Troca (50%) + estabilidade (50%) |
| MOB5 | ARIA das abas: `role="tablist"`/`tab`, `aria-selected` atualizado, setas ←/→ trocam | [MP L91] | DOM + teclado | Nota = subitens / 3 |
| MOB6 | Cada painel tem um destaque principal no topo e uma grade de blocos menores ocupando o resto da altura **[JD]** | [MP L77] e captura 12 | DOM/visual | 100 / 50 / 0 |
| MOB7 | Safe area: a topbar soma `env(safe-area-inset-top)` | [MP L74, L396] | CSS-fonte | Binário |
| MOB8 | Altura < 560 px: a tela volta a rolar com blocos empilhados. Na horizontal, abas viram rail vertical à esquerda | [MP L95, L97] | 390×500 (50%); 740×360 (50%). 844×390 fica registrado à parte, por conflito com L98 | Binário por subitem |
| MOB9 | Alvos de toque ≥ 44×44 px | [MP L234, L391] | Todos os interativos visíveis em 390×844 | Nota = % conformes |
| MOB10 | Tabela no celular: rolagem horizontal local com primeira coluna fixa, ou cartões | [MP L367–369] | 390×844 | Uma das duas formas completa = 100%; rolagem sem coluna fixa = 70% |
| MOB11 | KPIs no celular: 1 coluna ou 2 colunas compactas, com o valor sem corte | [MP L291] | 390×844 | Binário + corte |
| MOB12 | Varredura de 320 a 600 px sem overflow, sobreposição, texto cortado ou conteúdo atrás de barras fixas | [MP L388–391] | 320, 360, 375, 390, 412, 430, 480, 600 (emulação móvel) | Nota = larguras aprovadas / 8 |

### 3.4 Paleta, tipografia e tokens (PAL) — 13 requisitos

| ID | Requisito | Fonte | Método | Limiar |
| --- | --- | --- | --- | --- |
| PAL1 | Fundo `bg` #ffffff (body/shell) e superfícies `surface` #ffffff | [MP L132–134] | `background-color` computado | Idêntico |
| PAL2 | Texto principal `text` #18181b | [MP L136] | `color` do body e dos títulos | Idêntico |
| PAL3 | Texto secundário `textMuted` #707072 nos rótulos e metadados | [MP L137] | `color` de rótulos | Idêntico |
| PAL4 | Borda `border` #e6e6e6 em cartões, painéis e tabela | [MP L140] | `border-color` computado | Idêntico (nota = % de amostras) |
| PAL5 | Semânticos success/warning/error/info e respectivos fundos | [MP L150–157] | Badges e alertas: comparar os pares usados | Nota = pares idênticos / pares usados |
| PAL6 | Estados e ação: primary #18181b, hover #f4f4f4, selected/navActive #e3e3e4, focusRing #18181b | [MP L123, L143–147, L163] | Computado após hover/seleção | Nota = tokens corretos / usados |
| PAL7 | Fonte Inter efetivamente usada (títulos e textos) | [MP L168–181] | `font-family` computado + `document.fonts` + forma de carregar (Inter está instalada no sistema da auditoria; registro se o site depende disso) | Inter primeiro na pilha = 100%. Ausente = 0 |
| PAL8 | Escala tipográfica: base 15 px (global) ou 13 px (componentes Compact Pro); nada abaixo de 12 px; títulos com peso 640–650 | [MP L172–184, L235, L259] | Amostragem de tamanhos e pesos | Nota = subitens / 3 |
| PAL9 | Raios: contêineres de 6 px (Compact Pro) ou 8/12 px (global); controles de 4 px (Compact Pro) ou 6/8 px | [MP L194, L202–204, L236] | `border-radius` de cartões, painéis e controles | Nota = % de amostras no conjunto aceito |
| PAL10 | Sem sombra em superfícies de conteúdo e sem gradientes | [MP L198, L253, L419] | `box-shadow` e `background-image` computados | Nota = % de superfícies sem sombra (gradiente desconta 50%) |
| PAL11 | Superfície contornada: borda de 1 px em cartões e painéis | [MP L194, L205–207] | `border-width` | Nota = % de amostras |
| PAL12 | Tokens centralizados em variáveis CSS, sem cores fixas espalhadas | [MP L424] | Contar literais hex/rgb fora das declarações de `:root`, no CSS e no JS | ≤ 3 = 100%; 4–15 = 50%; > 15 = 0 |
| PAL13 | Espaçamento em múltiplos de 4 px | [MP L197, L422] | Amostrar padding e gap dos contêineres principais | Nota = % de valores múltiplos de 4 |

### 3.5 Componentes (CMP) — 12 requisitos

| ID | Requisito | Fonte | Método | Limiar |
| --- | --- | --- | --- | --- |
| CMP1 | KPI com rótulo, ícone, valor grande, variação com seta e %, comparativo e sparkline | [MP L229, L232] | DOM do cartão | Nota = elementos / 6 |
| CMP2 | Cor da variação: positiva em success, negativa em error, neutra em textMuted | [MP L233] | `color` computado | Nota = casos corretos / casos presentes |
| CMP3 | Números do KPI com `tabular-nums` | [MP L232, L235] | `font-variant-numeric` | Binário |
| CMP4 | KPI Compact Pro: texto 13 px, rótulos 12 px, contêiner com raio de 6 px, borda de 1 px, sem sombra | [MP L235–236, L250–253, L259] | Computado | Nota = subitens / 4 |
| CMP5 | Instância aprovada do KPI: "Receita mensal", "R$ 48,2 mil", "+12,4%", "vs. mês anterior", ícone Wallet, tendência alta | [MP L243–249] | Busca textual e visual | Nota = propriedades / 6 (a escolha é literal; o conflito de domínio está pré-registrado como possível B/D) |
| CMP6 | Grade de KPIs com 4 colunas no desktop (4 → 2 → 1) | [MP L291] | Colunas em 1440 | 4 = 100%; 3 ou 5 = 50% |
| CMP7 | Tabela semântica: `<table>`, `<thead>`, `<th scope="col">` | [MP L307] | DOM | Nota = subitens / 3 |
| CMP8 | Instância aprovada da tabela: título "Pedidos recentes", colunas Cliente/Status/Valor/Data, ≥ 4 linhas | [MP L319–321] | DOM | Nota = subitens / 3 (colunas proporcionais) |
| CMP9 | Status em badge semântico; valores à direita com `tabular-nums` | [MP L308, L311] | Computado | Nota = subitens / 2 |
| CMP10 | Cabeçalho "Destacado" (fundo diferente do corpo) e sem zebra | [MP L323–324] | Computado | Nota = subitens / 2 |
| CMP11 | Checkbox de seleção (cabeçalho e linhas) e ações por linha | [MP L325–326] | DOM | Nota = subitens / 2 |
| CMP12 | Densidade compacta: linhas de ≈ 30–40 px, texto de 13 px, contêiner com raio de 6 px | [MP L310–312, L322] | Computado | Nota = subitens / 3 |

### 3.6 Interações (INT) — 12 requisitos

| ID | Requisito | Fonte | Método | Limiar |
| --- | --- | --- | --- | --- |
| INT1 | Checkbox do cabeçalho: marca todos e mostra estado indeterminado | [MP L357] | Clicar em 1 linha → cabeçalho `indeterminate`; clicar no cabeçalho → todas marcadas | Nota = subitens / 2 |
| INT2 | Ordenação por clique no cabeçalho, com `aria-sort` | [MP L357] | Clicar em "Valor" e "Cliente": ordem das linhas + `aria-sort` asc/desc | Nota = (reordena 50% + aria-sort 50%) |
| INT3 | Hover na linha da tabela usa o fundo `hover` (#f4f4f4) | [MP L357, L143] | `page.hover` + computado | Muda = 50%; token idêntico = +50% |
| INT4 | Estados de carregando (skeleton), vazio e erro | [MP L309, L423] | Procurar no DOM/JS e acionar, se houver controle | Nota = estados implementados / 3 |
| INT5 | As ações por linha funcionam; menus fecham com Esc e clique fora e devolvem o foco | [MP L326, L99, L114–115] | Clicar na ação da 1ª linha | Abre (50%), Esc (25%), foco devolvido (25%) |
| INT6 | Tooltip no sparkline do KPI com valores | [MP L281] | Hover/focus no sparkline | Binário |
| INT7 | Clique no KPI abre o relatório detalhado (fecha com Esc e devolve o foco) | [MP L281] | Clicar no KPI | Abre (60%), Esc + foco (40%) |
| INT8 | Tempo real: alertas novos entram no topo com animação discreta e `aria-live="polite"`, sem "pular" o layout | [MP L51] | Esperar até 20 s ou acionar; medir o shell antes e depois; verificar `aria-live` | Nota = subitens / 3 |
| INT9 | O relógio da barra de status atualiza e há "última atualização" | [MP L32] | Ler o texto, esperar 2–61 s, ler de novo | Nota = subitens / 2 |
| INT10 | Focus-visible: anel de 2–3 px em `focusRing` (#18181b) ao navegar com Tab | [MP L217, L283] | Tab em 6 elementos, `outline` ou `box-shadow` computado | Nota = % conformes (largura 2–3 px e cor do token; 35% de opacidade aceito) |
| INT11 | `prefers-reduced-motion` respeitado | [MP L400] | CSS-fonte + emulação `reducedMotion: 'reduce'` | Binário |
| INT12 | Hover e active dos controles usam os tokens (`hover` em neutros, `primaryHover` na ação primária) | [MP L216, L282] | Hover em 2 controles | Nota = % corretos |

**Total previsto: 71 requisitos** (ARQ 7, DSK 15, MOB 12, PAL 13, CMP 12, INT 12).

## 4. Ambiguidades pré-registradas no prompt

Hipóteses levantadas **antes** de ver os sites. Se os desenvolvedores divergirem nesses pontos, é evidência de falha B/D.

1. **Faixa do tablet**: L106 ("Entre 600 e 1023 px … estrutura desktop compactada … sidebar recolhida em rail") contra L58/L98 ("Abaixo de 768 px vale a arquitetura mobile" / "A partir de 768 px passa a valer a arquitetura desktop"). L106 também cita uma sidebar que não existe. O comportamento entre 768 e 1023 px não é definido além de "desktop": L55 cobre só 1024–1279.
2. **Monitores grandes**: só aparece "Requisito do cliente: adaptação para monitores grandes" (L61), sem regra concreta. Lacuna do Studio (A), registrada como texto livre.
3. **Domínio do conteúdo**: L31 ("filas, SLA, equipes") contra as propriedades de exemplo de vendas em L243–249 ("Receita mensal R$ 48,2 mil") e L319–320 ("Pedidos recentes … Cliente | Status | Valor | Data").
4. **Posição dos componentes**: o prompt não diz onde ficam os KPIs e a tabela dentro de "content" (grade de status) nem como eles se relacionam com os "blocos de status".
5. **Conteúdo das abas móveis**: o prompt não diz quais são as abas. A prévia aprovada mostra "Hoje / Semana / Mês" (por período), enquanto L107 sugere manter "os mesmos destinos" das regiões do desktop.
6. **Densidade e geometria**: o global define "densidade confortável", raio de 8 px e texto de 15 px (L194, L172). Os componentes Compact Pro definem densidade compacta, 13 px e raios de 4/6 px (L235–236, L259–261). O KPI pede peso 640 (L256) e o global, 650 (L183).
7. **Anel de foco**: "2–3 px" (L217), "3 px … a 35%" (L283) e "anel de 2 px" (L287) aparecem no mesmo bloco.
8. **Paisagem no celular**: "abas viram rail vertical" (L97) contra "a partir de 768 px vale a arquitetura desktop" (L98). Um celular em paisagem tem 844 px de largura.
9. **Tabela no celular**: "rolagem horizontal … ou cartões" (L367) contra "tabelas viram cartões" (L368).
10. **Carregamento da fonte**: o prompt diz só "Inter", sem indicar a fonte do arquivo (CDN, arquivo local ou sistema).
11. **Valores "aprovados" que eram exemplo**: "Atualização em tempo real" (L51) e "clique abre o relatório detalhado" (L281) são comportamentos padrão do catálogo. O cliente não os pediu, mas o prompt os apresenta como aprovados.
