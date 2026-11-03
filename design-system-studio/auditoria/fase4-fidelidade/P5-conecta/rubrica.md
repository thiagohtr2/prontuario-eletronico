# Rubrica de fidelidade: P5 "Conecta" (plataforma social mobile-first)

Escrita **antes** de abrir os sites `dev-1`, `dev-2` e `dev-3`. Fontes usadas:

- briefing do cliente;
- `fase2-projetos/P5-conecta/escolhas.md` e `relatorio.md`;
- `exportados/conecta-master-prompt.md` (citado como "MP", com o número da linha);
- `exportados/conecta-tokens.css`;
- capturas aprovadas no Studio (`capturas/04-*`, `06-*`, `08-*`, `09-*`).

Também medi no DOM a prévia do layout mobile no próprio Studio, em navegador limpo e contexto descartável (`scripts/studio-modelo.js`).

## 0. Modelo medido no Studio (referência visual aprovada)

Prévia do layout mobile "Stories com dock e drawer lateral". A tela do aparelho tem 380 × 760 px, com barra de status/safe area de 34 px:

| Elemento | Medida no Studio |
|---|---|
| Topbar | 59 px de altura logo abaixo da safe area; botão ☰ de 46 × 46 px à esquerda (x = 6 px), marca e busca |
| Faixa de stories | 97 px, colada à topbar (y = 104 px = topo + 59 px), círculos com rótulo e rolagem horizontal |
| Dock | `nav` de 346 × 68 px, a 17 px da borda esquerda e 17 px da direita, 33 px acima da base (inclui o indicador home); `border-radius: 24px`; sombra `0 10px 28px rgba(16,16,24,.14)`; fundo branco; item ativo em pílula tonal (#fae7ed / texto primário) |
| Drawer | 300 px de largura (79 % de 380), altura total de 760 px a partir de y = 0 (cobre a safe area e o dock), sem raio, com scrim; cabeçalho com avatar + nome + ✕ e itens com ícone; "Sair" no rodapé |
| Prévia de login no celular | marca "Conecta", título "Entrar", subtítulo "Escolha como prefere acessar.", segmento "E-mail \| Telefone", campos altos, link "Esqueci minha senha" |
| Desktop | topbar integral (Praça da Comunidade A): logo à esquerda, abas com ícone no centro (Feed ativo com sublinhado primário, Grupos, Eventos, Mensagens com contador), busca, "+ Novo", sino com contador, avatar |

## 1. Escala de pontuação

| Nota | Significado |
|---|---|
| 100 % | Atende ao requisito dentro do limiar |
| 75 % | Atende com desvio pequeno (fora do limiar ideal, mas dentro do tolerável) |
| 50 % | Atende parcialmente (parte dos elementos ou só em algumas larguras) |
| 25 % | Indício mínimo |
| 0 % | Não atende ou ausente |
| N/T | Não testável; fica fora da média e é justificado |

A nota de uma dimensão é a média simples dos requisitos testados nela. A nota geral é a média de todos os requisitos testados, ou seja, cada requisito tem o mesmo peso. Cada requisito pertence a uma única dimensão.

**Origem da falha** (só para notas < 100 %):

| Código | Origem |
|---|---|
| A | Studio: a escolha não foi registrada nem exportada |
| B | Master Prompt: a escolha foi registrada, mas o texto é ambíguo, incompleto ou contraditório |
| C | Desenvolvedor: instrução clara não respeitada |
| D | Conflito ou limitação da especificação (exigências incompatíveis entre si) |
| E | Diferença aceitável |

Regra de justiça: quando o desenvolvedor registrou no `NOTES.md` uma ambiguidade real e escolheu uma interpretação defensável, a falha vai para **B/D**, não para C.

**Requisitos só do briefing** (não exportados pelo Studio, como stories no desktop e prioridade mobile): ficam numa tabela à parte, fora da nota dos sites. Medem a perda do Studio (origem A), não o trabalho do desenvolvedor.

## 2. Configuração de medição

- Playwright 1.63 + Chromium, um contexto limpo por teste, servidor `python3 -m http.server` nas portas 4551/4552/4553.
- **Celular:** 390 × 844 e 360 × 800 com `isMobile: true`, `hasTouch: true`, `deviceScaleFactor: 3`. Paisagem: 844 × 390 (móvel).
- **Tablet:** 768 × 1024. **Desktop:** 1440 × 900.
- **Varredura de larguras:** 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440 e 1920 px. Altura de 844 px até 600 px de largura e de 900 px a partir daí. Cada largura é medida na tela de login e na tela principal após entrar.
- Login com as credenciais de demonstração do README de cada site (o README é lido só para isso).
- "Celular" = largura < 768 px, "desktop" = ≥ 1024 px e "tablet" = 768–1023 px. Os cortes seguem as linhas MP 133, 172 e 224.

## 3. Requisitos

### 3.1 Arquitetura (ARQ)

| ID | Requisito (origem no MP) | Método | Limiar |
|---|---|---|---|
| ARQ-01 | Fluxo "Apenas login": o endereço abre direto na tela de entrar, sem landing (MP 17) | Carregar `index.html` em contexto limpo e verificar o primeiro conteúdo visível | Formulário de login visível sem rolagem = 100; landing antes do login = 0 |
| ARQ-02 | Celular: topbar fixa no topo com botão de menu (☰) à esquerda (MP 143, 146, 152) | A 390 px: `position` fixed/sticky, `top` = 0; continua visível após rolar 1200 px; ☰ é o primeiro controle à esquerda (x < 25 % da largura) | Fixa + ☰ à esquerda = 100; ☰ fora da esquerda = 50; sem ☰ ou topbar não fixa = 25/0 |
| ARQ-03 | Celular: faixa de stories logo abaixo da topbar, com rolagem horizontal (MP 147, 156, 232) | Distância entre o topo da faixa e a base da topbar; `overflow-x` auto/scroll e `scrollWidth > clientWidth` | Distância ≤ 8 px e rolagem horizontal = 100; faixa em outro ponto do topo = 50; ausente = 0 |
| ARQ-04 | Celular: dock flutuante com 4 destinos "Início, Explorar, Salvos, Perfil" e sem FAB (MP 148, 153, 176, 594–596) | Elemento fixo na base; rótulos dos itens; procurar FAB | 4 rótulos exatos e sem FAB = 100; rótulos diferentes = 75; 3 ou 5 itens = 50; sem dock = 0 |
| ARQ-05 | Celular: o drawer abre pelo ☰ **da topbar** e fica à esquerda, não como painel de largura total abaixo do header (MP 149, 154, 232, 568) | Clicar no ☰ e medir a posição do painel | Drawer à esquerda pelo ☰ = 100; painel de largura total = 25; outro gatilho = 50 |
| ARQ-06 | Celular: não trocar o dock por bottom navigation tradicional encostada nas bordas (MP 176) | Gaps do dock até as bordas (ver CEL-05) e aparência | Dock destacado das bordas = 100; barra encostada nas bordas = 0 (trocar a arquitetura sem justificativa é falha) |
| ARQ-07 | Desktop (≥ 1024 px): topbar integral fixa de largura total, sem sidebar, conteúdo centralizado com até ≈1200 px (MP 105–118, 126) | A 1440 px: largura do header = viewport, top = 0, sticky/fixed; nenhuma navegação lateral persistente; largura do container de conteúdo | Tudo = 100; largura máxima entre 1100 e 1320 px = 100, entre 900 e 1440 px = 75; com sidebar = 25 |
| ARQ-08 | Desktop: header "Praça da Comunidade" na composição A: logo à esquerda; Feed, Grupos, Eventos e Mensagens no centro (ícone + rótulo, contador em Mensagens); busca, "+ Novo", sino com contador e avatar à direita (MP 192–203) | Inventário do DOM + captura a 1440 px; centro da nav ≈ centro do header (±80 px) | Cada um dos 7 elementos vale 1/7; nav não centralizada = −15 |
| ARQ-09 | Corte de arquitetura: < 768 px usa o layout mobile e ≥ 768 px o desktop; não esticar o dock/stories para tablet (MP 133, 172, 224) | Larguras 767, 768, 820, 1024: presença do dock e do header desktop | Corte em 768 px = 100; corte em 600 px ou 1024 px = 50 (conflito MP 180, origem D); dock esticado no desktop = 0 |
| ARQ-10 | Mesmos destinos de navegação nas duas versões (MP 181) | Comparar os destinos alcançáveis no desktop (header + menus) com os do celular (dock + drawer + topbar) | Todos os destinos alcançáveis nos dois = 100; cada destino que só existe em uma versão = −15 (o MP é contraditório aqui, C4) |
| ARQ-11 | Marca do projeto "Conecta" (e não "Quero-quero"/"Orla") no header e no login (MP 8, 194) | Texto da marca | "Conecta" = 100; marca fictícia = 0 |

### 3.2 Celular: medidas, safe areas e responsividade (CEL)

| ID | Requisito | Método | Limiar |
|---|---|---|---|
| CEL-01 | Topbar com ≈56 px de altura além da safe area (MP 146, 207) | `getBoundingClientRect().height` a 390 px (sem notch, inset = 0) | 48–64 = 100; 44–72 = 75; fora disso = 25 |
| CEL-02 | A topbar soma `env(safe-area-inset-top)` (MP 146) | CSS da topbar (folhas de estilo) | Usa = 100; não usa = 0 |
| CEL-03 | Faixa de stories com ≈88 px (MP 147, 160) | Altura do contêiner da faixa | 76–104 = 100; 64–120 = 75; fora disso = 25 |
| CEL-04 | Dock com ≈64 px (MP 148, 161) | Altura do contêiner visível do dock | 56–72 = 100; 48–80 = 75; fora disso = 25 |
| CEL-05 | Dock **flutuante**: afastado das bordas esquerda, direita e inferior (MP 143, 148; Studio: 17/17/33 px) | Gaps medidos a 390 e 360 px | Os três gaps ≥ 8 px = 100; um gap entre 1 e 7 px = 50; algum gap = 0 = 0 |
| CEL-06 | Dock **arredondado** (briefing; família MM com controles de 20 px e pílula; Studio com 24 px) | `border-radius` computado do dock | ≥ 20 px = 100; 16–19 = 75; 12–15 = 50; < 12 = 0 |
| CEL-07 | O dock respeita `env(safe-area-inset-bottom)` (MP 638, 667) | CSS do dock (`bottom`/`padding`/`margin`) | Usa = 100; não usa = 0 |
| CEL-08 | Item ativo do dock identificável: pílula tonal (fundo `navActive`/`selected` #fae7ed, texto #bc2d5f ou primária) + `aria-current` (MP 173, 389, 586) | Estilo computado do item ativo e dos inativos; atributo | Pílula tonal + aria = 100; destaque visível sem pílula = 75; sem aria = −25 |
| CEL-09 | Drawer com ≈280 px e no máximo 85 % da largura; 85 % entre 320 e 359 px (MP 149, 170, 568) | Largura do painel a 390, 360 e 320 px | 390: 256–304 px; 320: ≤ 272 px (todos) = 100; um caso fora = 50; drawer de 360–420 px (texto do componente) = 50 (D) |
| CEL-10 | Drawer desliza da esquerda, ocupa a altura total (inclusive safe areas), fica **sobre** a topbar e o dock e tem scrim escuro (MP 149, 520) | Painel com x = 0, top = 0 e altura = viewport; `elementFromPoint` sobre a área da topbar e do dock retorna o drawer/scrim; scrim com fundo escuro | 4/4 = 100; cada item faltando = −25 |
| CEL-11 | Conteúdo não fica escondido atrás do dock: o último item do feed pode rolar até acima do dock (MP 661, 667) | Rolar até o fim e comparar a base do último elemento de conteúdo com o topo do dock | Base ≤ topo do dock = 100; até 16 px coberto = 50; mais que isso = 0 |
| CEL-12 | Sem overflow horizontal de 320 a 767 px, no login e na tela principal (MP 50, 659) | `document.documentElement.scrollWidth > innerWidth` em 320, 344, 360, 375, 390, 412, 430, 480 e 600 px | Nenhum = 100; uma largura = 50; mais = 0 |
| CEL-13 | Alvos de toque ≥ 44 × 44 px no celular (☰, busca, itens do dock, stories, ações dos cards, itens do drawer) (MP 211, 607, 662) | Inventário de botões/links visíveis a 390 px; contar os < 44 px em qualquer dimensão | 0 alvos pequenos = 100; até 3 = 75; até 8 = 50; mais = 25 |
| CEL-14 | Paisagem: os stories recolhem e o dock fica com ≈52 px (MP 171) | 844 × 390 móvel: altura dos stories e do dock | Stories recolhidos e dock entre 44 e 60 px = 100; um dos dois = 50; nenhum = 0 |
| CEL-15 | Paisagem: as barras fixas ocupam no máximo 25 % da altura (MP 668) | Soma das alturas de topbar + dock a 844 × 390 (≤ 97 px) | Soma ≤ 25 % = 100; cada barra sozinha ≤ 25 % = 75; mais = 25 |
| CEL-16 | Sem texto cortado nem sobreposição indevida a 320/360/390 px (MP 660–661) | Inspeção das capturas + elementos com `scrollWidth > clientWidth` e `overflow: hidden` em textos | Nenhum caso = 100; casos menores = 75/50 |
| CEL-17 | Inputs com ≥ 16 px e altura ≥ 48 px no celular (MP 48, 663) | `font-size` e altura computados dos inputs do login a 390 px | Os dois = 100; um = 50 |

### 3.3 Desktop e tablet (DESK)

| ID | Requisito | Método | Limiar |
|---|---|---|---|
| DESK-01 | Header com 60 px (componente) a ≈64 px (layout) (MP 108, 192, 206) | Altura a 1440 px | 56–68 = 100; 48–76 = 75 |
| DESK-02 | Header sticky top 0, fundo `navBg` (#fff), borda inferior de 1 px `border` (#e6e6e6) (MP 126, 193, 215) | Estilo computado | 3/3 = 100 |
| DESK-03 | Sombra suave após 8 px de rolagem (MP 215) | `box-shadow` antes e depois de rolar 50 px | Muda = 100; não muda = 0 |
| DESK-04 | Item ativo com sublinhado de 2 px na cor primária, encostado na base da barra, e `aria-current="page"` (MP 195, 214, 236) | Estilo do item ativo (border-bottom/box-shadow/pseudo-elemento) e atributo | Sublinhado + aria = 100; um dos dois = 50 |
| DESK-05 | Busca compacta ≈220 × 36 px com lupa e placeholder "Buscar…"; cresce para 300 px ao focar (MP 196, 216) | Medir antes e depois do foco | Tamanho ±20 px + placeholder + cresce = 100; cada item faltando = −33 |
| DESK-06 | Logo: monograma circular de 32 px com a inicial + nome (MP 194) | Medir | Circular de 28–36 px + nome = 100; outro formato = 50 |
| DESK-07 | 1024–1279 px: espaço entre itens de 16 px e busca de 180 px; todos os links visíveis (MP 130–131, 222) | Medir a 1024 e 1280 px | Links visíveis sem overflow = 75; com a busca reduzida = 100 |
| DESK-08 | 768–1023 px: navegação recolhida em ☰/"Menu" que abre painel abaixo do header (largura total); logo, busca e ação principal continuam visíveis (MP 132, 223) | A 768 e 820 px | Painel de largura total abaixo do header + logo/busca/ação visíveis = 100; drawer lateral = 50 (o MP mistura as duas coisas); links transbordando = 0 |
| DESK-09 | Sem overflow horizontal de 768 a 1920 px, no login e no app (MP 659) | `scrollWidth` em 768, 820, 1024, 1280, 1440 e 1920 px | Nenhum = 100; um = 50; mais = 0 |
| DESK-10 | Grade de cards reduz colunas progressivamente; cards com altura definida pelo conteúdo (MP 417, 419) | Colunas da grade/feed a 1440, 1024 e 768 px; altura fixa | Reduz ou mantém coluna única legível = 100. Feed social em coluna única centralizada = 100 (E) |

### 3.4 Paleta, tipografia e tokens (PAL)

| ID | Requisito | Método | Limiar |
|---|---|---|---|
| PAL-01 | Tokens do `conecta-tokens.css` declarados com os valores exportados (MP 246–291, 695) | Comparar as variáveis de `:root` com os 49 valores exportados (por valor de cor) | ≥ 95 % dos valores-chave presentes = 100; ≥ 80 % = 75; ≥ 50 % = 50 |
| PAL-02 | Cor primária #d6336c nas ações principais (botão Entrar, "+ Novo", Seguir, Sair da conta) (MP 248, 381) | `background-color` computado | Todas = 100; parcial = 50 |
| PAL-03 | Fundo #ffffff/#f6f6f6 e texto principal #1b1b1f (MP 257–261) | `body` computado | Os dois = 100 |
| PAL-04 | Navegação: `navBg` #fff, `navText` #4d4d50, `navActive` #fae7ed e `navActiveText` #bc2d5f no header e no dock (MP 286–289) | Estilos computados dos itens inativos e ativos | 4/4 = 100; cada um faltando = −25 |
| PAL-05 | Tipografia Inter (títulos 650, texto 400, base 15 px) (MP 297–309). Conflito: os componentes MM pedem "Fonte do sistema 500, 14 px" (MP 382–385, C6) | `font-family`, peso e tamanho computados no body, h1/h2 e título do card | Inter + 15 px + títulos ≥ 600 = 100; um desvio = 75; system-ui só nos componentes = 75 (D) |
| PAL-06 | Raios: global 6/8/12 px; componentes MM com controles de 20 px (pílula) e contêineres de 12 px (MP 327–329, 376–377) | Raio computado de botões, inputs, cards e drawer | Botões dos componentes em pílula/20 px e cards com 12 px = 100; parcial = 50 |
| PAL-07 | Sombra e borda: superfícies de conteúdo sem sombra e com borda de 1 px (global, MP 319, 323) **versus** componentes MM sem borda e com elevação tonal (MP 378–379). Elementos flutuantes (dock, drawer, popovers) podem ter elevação | `box-shadow`/`border` dos cards e do dock | Qualquer uma das duas leituras aplicada de forma consistente = 100 (conflito D); decoração sem base (vidro, gradientes extras) = −25 |
| PAL-08 | Superfície dos componentes tingida pela primária (#fef8fa, 4–10 %) (MP 380, 394) | `background-color` dos cards/drawer/dock | Tingida = 100; branca = 75 (a regra G permite a leitura global) |
| PAL-09 | Foco visível: anel de 2–3 px na cor `focusRing` #d6336c (MP 214, 342, 409) | Tab até um botão; `outline` computado | Anel na cor certa com 2–3 px = 100; outra cor = 50; ausente = 0 |
| PAL-10 | Sem cores fixas espalhadas (MP 235, 695) | Contar literais hexadecimais/rgb nos CSS/JS fora de `:root` | ≤ 5 = 100; ≤ 20 = 75; ≤ 50 = 50; mais = 25 |

### 3.5 Componentes e telas (COMP)

| ID | Requisito | Método | Limiar |
|---|---|---|---|
| COMP-01 | Card de conteúdo: mídia 16/9 → etiqueta → título → texto (até 3 linhas) → rodapé com meta e ação (MP 357) | Inspecionar o primeiro card do feed e a razão de aspecto da mídia | 5/5 partes = 100; cada parte faltando = −20 |
| COMP-02 | Card na família MM: contêiner de 12 px, ação "Ver publicação" (ou equivalente) em pílula na primária (MP 371, 376–381) | Estilo computado | Os dois = 100 |
| COMP-03 | Card clicável como link estendido, sem botões aninhados (MP 358) | DOM: `a` com `::after` estendido ou card clicável; nenhum `button` dentro de `a` | Atende = 100; botões aninhados = 0 |
| COMP-04 | Perfil: capa → avatar sobreposto (−50 %) → nome/cargo → ação → estatísticas (3) → abas → conteúdo (MP 433, 446–448) | Abrir o Perfil pelo dock; inventário e sobreposição do avatar | 7/7 = 100; cada parte faltando = −14 |
| COMP-05 | Perfil no celular: avatar e textos centralizados; estatísticas em 3 colunas; ações em largura total (MP 490) | Medir a 390 px | 3/3 = 100 |
| COMP-06 | Drawer: `role="dialog"` + `aria-modal="true"`; cabeçalho com título "Menu" e botão fechar; corpo rolável; rodapé fixo com "Sair da conta" em pílula primária (MP 505–506, 516–519) | DOM e estilos | 5/5 = 100; cada item faltando = −20 |
| COMP-07 | Divisão: destinos frequentes no dock; configurações, ajuda e conta no drawer (MP 165) | Inventário dos itens do drawer | Configurações + Ajuda + conta = 100; parcial = 50 |
| COMP-08 | Dock na família MM: ícone + rótulo, pílula tonal, contêiner arredondado com elevação (MP 582, 586, 597–599) | Estilo/captura | Atende = 100 |
| COMP-09 | Login "Acesso responsivo": título "Entrar", subtítulo "Escolha como prefere acessar.", segmento "E-mail \| Telefone", campos de ≈56 px, "Esqueci minha senha" perto da senha (MP 25–31, 34–35, 42) | DOM a 390 e 1440 px | 5/5 = 100; cada item faltando = −20 |
| COMP-10 | Login no celular: botão "Entrar" fixo/ancorado na base, com safe area; no desktop, painel central com instruções curtas ao lado (MP 29–30, 46) | A 390 px, posição do botão (perto da base da área do formulário/viewport); a 1440 px, painel de duas colunas | Os dois = 100; um = 50 |
| COMP-11 | Cadastro na mesma tela: abas "Entrar \| Criar conta" (`role="tablist"`) com sublinhado primário; campos Nome, E-mail, Senha nessa ordem; checklist de requisitos; aceite dos termos com links (MP 63–72) | DOM | 5/5 = 100; cada item faltando = −20 |
| COMP-12 | Topbar do celular com marca, ação de busca e ☰ (MP 146, 224; Studio: ☰ + logo + busca) | Inventário a 390 px | ☰ + marca + busca = 100; parcial = 50 |

### 3.6 Interações (INT)

| ID | Requisito | Método | Limiar |
|---|---|---|---|
| INT-01 | Ao abrir o drawer pelo ☰, o foco vai para "Fechar" ou para o primeiro item, sem rolar a página (MP 166) | `document.activeElement` após o clique; `scrollY` antes e depois | Atende = 100; foco em outro ponto dentro do drawer = 75; fora = 0 |
| INT-02 | Fecha com Esc, toque no scrim e ✕; o foco volta ao ☰ (MP 166, 553) | Testar os três meios; `activeElement` após fechar | 3 meios + retorno do foco = 100; cada falha = −25 |
| INT-03 | Foco preso no drawer; conteúdo atrás com `inert`/`aria-hidden` (MP 166, 240) | Tab 15× e Shift+Tab 5×: o foco não sai do painel; atributos no conteúdo | Os dois = 100; só o foco preso = 75; nenhum = 0 |
| INT-04 | Com o drawer aberto o body não rola (`overflow: hidden`) e o painel tem `overscroll-behavior: contain` (MP 167) | Estilos computados | Os dois = 100; um = 50 |
| INT-05 | O dock troca o destino e o item ativo (`aria-current` acompanha) (MP 173) | Clicar em cada um dos 4 itens; verificar a troca de conteúdo e o ativo | 4/4 = 100; parcial proporcional |
| INT-06 | Stories com rolagem horizontal funcional por toque/teclado; itens focáveis (MP 147) | `scrollLeft` após rolagem programática/teclado; itens com foco | Atende = 100. Abrir visualizador = extra (E) |
| INT-07 | Card: estados hover/focus-visible; o link principal recebe foco visível (MP 407–409) | Tab até o card e ler o `outline` | Atende = 100 |
| INT-08 | Perfil: as abas trocam o conteúdo sem recarregar (`role="tab"`) (MP 480) | Clicar nas abas | Atende = 100 |
| INT-09 | Login: validação ao sair do campo e ao enviar (aria-invalid + aria-describedby + resumo `role="alert"`), erro genérico "E-mail ou senha incorretos", mostrar/ocultar senha com `aria-pressed`, "Entrando…" com o botão desabilitado (MP 38–43) | Enviar vazio, enviar credenciais erradas, alternar a senha, enviar as corretas | 5 comportamentos; cada um = 20 |
| INT-10 | Cadastro: trocar de aba mantém o e-mail e atualiza `?aba=cadastro`; checklist marca as regras ao digitar (MP 79, 81) | Digitar o e-mail em Entrar, trocar de aba e ler o campo e a URL; digitar a senha | 3/3 = 100 |
| INT-11 | Desktop: sino abre popover de ≈320 px com "Ver todas"; avatar abre menu com nome, e-mail, Meu perfil, Configurações, Ajuda e Sair; fecham com Esc e clique fora (MP 217–218, 239) | Testar a 1440 px | 4 verificações; cada uma = 25 |
| INT-12 | Busca do desktop: Esc limpa e tira o foco (MP 216) | Digitar e pressionar Esc | Atende = 100 |
| INT-13 | Login com credenciais de demonstração entra no app; "Sair" volta ao login | Fluxo completo | Atende = 100 |
| INT-14 | `prefers-reduced-motion` respeitado (MP 671) | Regra `@media (prefers-reduced-motion)` nos CSS | Presente = 100 |

## 4. Itens do briefing fora da nota dos sites

| ID | Item do briefing | Situação na cadeia | Como será registrado |
|---|---|---|---|
| BR-01 | Header superior com stories **também no desktop** | Nenhum layout ou header desktop do Studio tem stories (LACUNA, `escolhas.md`) | Medir se o site oferece stories no desktop. Origem A se não houver; não penaliza o site |
| BR-02 | Navegação mobile prioritária (mobile-first) | Só em texto livre (MP 9, 11) | Verificar se a CSS é mobile-first e se o celular é a experiência mais completa (julgamento) |
| BR-03 | Versão desktop coerente | Regra genérica (MP 181) contradita pelos destinos (C4) | Avaliado em ARQ-10 e no julgamento de design |
| BR-04 | Drawer acessível pelo header no desktop | Não existe no layout/header desktop escolhido | Registrar o que cada site fez |

## 5. Julgamento de design (subjetivo, marcado como tal)

Fica fora das notas numéricas: semelhança visual geral com as prévias aprovadas (composições lado a lado), hierarquia visual, sensação de "app social" e coerência visual entre desktop e celular.
