# P3 — Nexo Capital · Rubrica de fidelidade (escrita ANTES de abrir os sites)

Escrita em 03/11/2026 a partir de: briefing do cliente, `fase2-projetos/P3-nexo-capital/escolhas.md`, `relatorio.md`,
`exportados/nexo-capital-master-prompt.md` (MP, linhas citadas como `l.N`), `exportados/nexo-capital-tokens.css` e as capturas
aprovadas em `capturas/` (13, 15-*, 16, 16b, 17, 09, 10, 11, 12, 32-*, 05, 06).
Nenhum arquivo dos sites (`dev-1..3`) foi aberto antes desta rubrica.

## 0. Regras gerais de pontuação

- Cada requisito recebe 0–100 %. Crédito parcial segue a regra escrita na própria linha. Sem regra especial:
  100 % = atende ao limiar; 50 % = atende em parte (metade ou mais dos elementos/medidas); 0 % = não atende ou ausente.
- **Dimensões:** A = Arquitetura · D = Desktop · M = Celular · P = Paleta/tokens · C = Componentes (estrutura) ·
  I = Interações. Cada requisito pertence a uma só dimensão.
- **Nota da dimensão** = média simples dos requisitos testados nela. **Nota geral** = média simples de todos os requisitos
  testados (cada requisito pesa igual). Requisito não testável num site é marcado "n/t" e sai da média.
- **Origem de cada desvio:** A = Studio (escolha não registrada/não exportada) · B = Master Prompt (registrado, mas ambíguo,
  incompleto ou contraditório) · C = desenvolvedor (instrução clara não respeitada) · D = conflito/limitação da especificação
  (pedido impossível ou incompatível com o meio, ex.: backend real num site estático) · E = diferença aceitável.
- **Regra de conflito pré-registrado:** onde o MP traz duas instruções incompatíveis (lista K abaixo), qualquer valor dentro
  da faixa coberta por qualquer uma delas ±15 % recebe 100 % e a escolha é registrada como E (interpretação). Fora da faixa: C.
  Quando o conflito força uma solução que contraria a prévia aprovada, o desvio é B.
- **Aspectos subjetivos** (ex.: "aparência corporativa") recebem a etiqueta **[julgamento de design]**.
- Cores: "idêntica ao token" = hex computado igual ao token (tolerância ΔRGB ≤ 2 por canal para arredondamento).
  Cor diferente mas do mesmo papel e família (ex.: outro azul) = 50 %.

## 1. Conflitos pré-registrados no Master Prompt (antes de ver os sites)

| ID | Conflito | Trechos |
|---|---|---|
| K1 | Altura do header: ≈64 px (layout) × 56 px (header Painel Analítico) | l.66, 68, 71, 85 × l.156, 169 |
| K2 | Posição do header: "somente sobre a coluna principal — não passa por cima da sidebar" × "largura total da janela (full width)". As prévias aprovadas (capturas 10, 15-computador) mostram o header só sobre a coluna principal. | l.71 × l.156 |
| K3 | Largura da sidebar: 252 px × 264 px | l.66–67, 84, 93 × l.203, 213, 217, 231 |
| K4 | 1024–1279 px: sidebar ≈220 px × "Desktop (≥ 1024 px): 264 px" | l.94 × l.231 |
| K5 | Início do tablet: 600 px ("estrutura desktop compactada quando couber") × 768 px ("abaixo de 768 px vale a arquitetura mobile") | l.144, 587 × l.95–96, 136 |
| K6 | Menu do celular: painel do header "desliza logo abaixo do header em largura total" × drawer pela esquerda. 768–1023: header "recolhe para ☰" × sidebar em rail de 72 px | l.185–186 × l.107–111, 233; l.184 × l.95, 232 |
| K7 | "ofereça também uma bottom navigation" × `inferior: none` | l.237 × l.117 |
| K8 | Densidade/escala: global confortável, base 15 px, raio 8 px, foco 2–3 px × componentes Compact Pro compactos, base 13 px, raio 4/6 px, foco "3 px a 35 %" e "2 px" | l.326, 340, 314, 335, 349 × l.379, 469, 542, 393, 384–385, 416, 420 |
| K9 | Fundo da sidebar: bgAlt (claro) × "Cores dos tokens … navBg, navText, navActive" (navBg é marinho). Prévias aprovadas: sidebar clara (bgAlt) e header marinho (navBg). | l.204 × l.242 |
| K10 | Topo da sidebar: "logo e nome do produto" (layout) × "seletor de espaço de trabalho" (composição A); header também tem logo (aviso "Logo uma vez só" do Studio não exportado) | l.68 × l.208 × l.158 |
| K11 | Conteúdo do header: "título/breadcrumb à esquerda; busca, notificações e avatar à direita" × "logo + abas à esquerda; período, Exportar e avatar à direita" | l.71 × l.159–160, 166 |
| K12 | Conteúdo de exemplo não financeiro dado como especificação (menus Contratos/Fornecedores/Compras/Folha; abas Aquisição/Retenção; tabela "Pedidos recentes"; gráfico "Vendas por mês") × objetivo "Plataforma financeira". Só a marca do header traz "substitua". | l.205, 159, 376–377, 452 × l.10–11 |
| K13 | "Cadastro: nenhum" × pendência "Escolha um fluxo de cadastro … pergunte ou use a opção mais neutra" | l.18 × l.634–635 |
| K14 | Tabela no celular: "rolagem local … ou cartões" × "tabelas viram cartões" | l.424, 426, 610 × l.425, 500, 573 |
| K15 | Série 2 do gráfico "no destaque": accent #0ea5e9 × "Destaque: #0c91cd" do componente | l.441, 262 × l.405, 481 |
| K16 | Autenticação real com backend seguro × tecnologia HTML + CSS + JavaScript (demonstração estática) | l.55, 57 × l.13 |
| K17 | Altura dos itens da sidebar 40–44 px × 36 px; ícones 20 × 18 × 14–16 px; indicador de ativo "fundo de seleção + indicador lateral" × "barra de 3 px + texto primary" × "sublinhado de 2 px" (componentes) | l.69 × l.206, 218, 225 × l.370 |
| K18 | KPIs "4 → 2 → 1 colunas" com 3 KPIs configurados | l.572 × l.527 |

## 2. Requisitos, método e limiar

Viewports de captura: 1440×900, 768×1024 e 390×844 (390×844 com `isMobile: true`, `hasTouch: true`, DPR 3).
Varredura: 320, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px (altura 900; ≤ 480 com emulação móvel).

### A — Arquitetura

| ID | Requisito (origem) | Método de medição | Limiar / pontuação |
|---|---|---|---|
| A1 | Fluxo "Apenas login": o endereço abre direto na tela de entrar, sem landing (l.17–18) | Abrir `index.html` sem estado; ver a primeira tela | Login é a 1ª tela e não há landing = 100 %; landing antes = 0 % |
| A2 | Sem cadastro (l.18; pendência l.635 → "opção mais neutra") | Procurar links/abas "Criar conta", "Cadastre-se" funcionais | Nenhum fluxo de cadastro = 100 %; link inerte/"solicite ao TI" = 100 % (neutro); fluxo de cadastro = 0 % |
| A3 | Login válido leva ao dashboard (shell com sidebar + header) | Entrar com as credenciais do README | Funciona = 100 % |
| A4 | "Sair" (menu de perfil/sidebar/drawer) volta ao login | Clicar em Sair | Funciona = 100 %; ausente = 0 % |
| A5 | Tecnologia HTML + CSS + JavaScript, executável sem build (l.13) | Abrir por http estático; verificar dependências e erros de console | Abre e funciona sem build e sem erros de console = 100 %; erros não bloqueantes = 50 % |
| A6 | Domínio financeiro do objetivo (l.10–12) refletido no conteúdo (KPIs, gráfico, tabela) [julgamento de design] | Ler os textos dos KPIs, gráfico e tabela | Conteúdo financeiro coerente = 100 %; parcial = 50 %; exemplos genéricos sem finanças = 0 % (origem B se seguir K12 literalmente) |
| A7 | Troca de arquitetura no ponto definido: desktop ≥ 768 px e drawer < 768 px (l.96, 136; K5) | Medir a navegação em 600, 767, 768 | Mobile < 768 e desktop/rail ≥ 768 = 100 %; troca entre 600 e 768 = 100 % (K5, E); fora de 600–768 = 0 % |
| A8 | Mesmos destinos de navegação no desktop e no celular (l.145) | Comparar rótulos da sidebar e do drawer | Iguais = 100 %; ≥ 75 % em comum = 50 % |

### D — Desktop (1440×900, salvo indicação)

| ID | Requisito (origem) | Método | Limiar / pontuação |
|---|---|---|---|
| D1 | Sidebar integral: do topo à base, encostada à esquerda, sem margem, sem raio, sem sombra flutuante (l.67, 99, 203, 624) | `getBoundingClientRect` e estilos computados | top ≤ 1, left ≤ 1, altura ≥ 99 % da janela, radius 0, sem box-shadow = 100 %; cada falha −25 % |
| D2 | Largura da sidebar 252 px (layout) ou 264 px (sidebar) (K3) | Largura medida a 1440 | 214–304 px (±15 % da faixa) = 100 %; ±30 % = 50 % |
| D3 | Sidebar fixa (sticky/fixed, 100dvh) com rolagem interna; só o conteúdo rola (l.88, 228) | Rolar a página 600 px e medir `top` da sidebar; `overflow-y` | Sidebar continua em top 0 e tem overflow-y auto = 100 %; só fixa = 75 % |
| D4 | Altura do header ≈64 ou 56 px (K1) | Altura medida | 48–74 px = 100 %; 40–84 = 50 % |
| D5 | Header só sobre a coluna principal, sem passar por cima da sidebar (l.71; prévias aprovadas; K2) | `header.left` × `sidebar.right` | |Δ| ≤ 4 px = 100 %; header de largura total = 50 % (origem B, K2) |
| D6 | Topo da sidebar alinhado ao header (mesma altura, linha contínua) com logo/nome ou seletor de unidade (l.68, 208; K10) | Altura do bloco do topo da sidebar × altura do header | |Δ| ≤ 4 px = 100 %; ≤ 12 px = 50 % |
| D7 | Header sticky: não rola com o conteúdo (l.89, 178) | Rolar 600 px, medir `header.top` | top = 0 após rolar = 100 % |
| D8 | Header Painel Analítico A: abas encaixadas (4) à esquerda; seletor de período "Últimos 30 dias ▾", "Exportar" e avatar de 32 px à direita (l.158–160, 166; K11) | Inventário no DOM | 4 elementos (abas, período, exportar, avatar) = 100 %; −25 % por elemento ausente; elementos do layout (busca/notificações) aceitos como extra |
| D9 | Fundo do header = navBg #0f1f4d com borda inferior 1 px (l.157) | Cor computada | Idêntica = 100 %; outra cor escura da paleta = 50 %; claro = 0 % |
| D10 | Fundo da sidebar = bgAlt #eff1f3 (l.204; prévias; K9) | Cor computada | bgAlt = 100 %; navBg (marinho) = 50 % (origem B, K9); outra = 0 % |
| D11 | Itens da sidebar: grupos com título em caixa alta (≈11 px, peso 650, espaçamento 0,08em, textMuted); itens com ícone + rótulo, 36–44 px; ativo com barra lateral de 3 px em primary e texto primary / fundo de seleção (l.69, 205–207, 225; K17) | Estilos computados do título de grupo, de um item e do item ativo | 5 sub-itens (caixa alta, 10–12 px, ícone, altura 34–46, indicador lateral) — 20 % cada |
| D12 | Rodapé da sidebar: bloco de perfil com avatar, nome e cargo + menu ⋯ (composição A; l.70, 208) | Inventário | avatar + nome + cargo = 100 %; perfil sem cargo = 75 %; sem perfil = 0 % |
| D13 | Topo da sidebar com seletor de unidade/espaço (composição A) (l.208, 214) | Inventário | presente = 100 %; só logo = 50 % (K10, E) |
| D14 | Área de conteúdo com padding 24–32 px; cartões ≥ 280 px antes de reduzir colunas (l.72) | Padding computado do contêiner de conteúdo; menor cartão a 1024 | padding 20–36 e nenhum cartão < 240 px = 100 %; uma falha = 50 % |
| D15 | 768–1023 px: sidebar em rail integral de ≈72 px (só ícones, tooltip/aria-label) (l.95, 232; K5/K6) | Largura da sidebar a 768, 820 e 1000 | 62–82 px nas três = 100 %; rail em parte da faixa = 50 %; sem rail (drawer/top) = 25 % se coerente com K5/K6 (E/B), 0 % se sidebar completa espremida |
| D16 | 1024–1279 px: sidebar ≈220 px (l.94) ou 264 (l.231) (K4) | Largura a 1024 e 1280 | 187–304 px = 100 % |

### M — Celular (390×844 emulado, salvo indicação)

| ID | Requisito (origem) | Método | Limiar / pontuação |
|---|---|---|---|
| M1 | Topbar ≈56 px com botão de menu à esquerda e título/logo (l.110, 123) | Altura e posição do botão | 48–64 px e ☰ à esquerda = 100 %; uma falha = 50 % |
| M2 | Drawer ≈280 px, máx. 85 % da largura (l.111, 124, 134) | Largura do drawer aberto a 390 e 320 | 390: 238–322 px e ≤ 331 px; 320: ≤ 272 px = 100 %; uma largura falha = 50 % |
| M3 | Drawer pela esquerda, altura total, sobreposto (conteúdo não se move) e com scrim escuro (l.107, 111, 140) | Abrir; medir drawer left=0, height=vh; posição do conteúdo antes/depois; presença de scrim | 4 sub-itens, 25 % cada |
| M4 | Conteúdo do drawer: cabeçalho com avatar, nome e botão Fechar; destinos com ícone + rótulo, itens de 48 px; grupo secundário (configurações, ajuda) e "Sair" no rodapé (l.112, 125) | Inventário e alturas | 4 sub-itens (cabeçalho, ícone+rótulo, itens ≥ 44 px, secundário + Sair) — 25 % cada |
| M5 | Sem bottom navigation (l.117; K7) | Inventário | Ausente = 100 %; presente = 50 % (K7, B) |
| M6 | Topbar com `env(safe-area-inset-top)` (l.110, 600) | Busca no CSS | presente = 100 % |
| M7 | Tabela no celular com rolagem local ou cartões, sem rolagem da página (l.424–426; K14) | A 390 e 320: `scrollWidth` do documento; contêiner com `overflow-x:auto` ou layout de cartões | Sem overflow de página e tabela legível = 100 %; tabela cortada sem rolagem = 0 % |
| M8 | Gráfico no celular: altura ≥ 200 px, legenda abaixo, menos rótulos no eixo X, nada cortado (l.499, 614) | Medir a 390 | 4 sub-itens, 25 % cada |
| M9 | KPIs 4 → 2 → 1 colunas (3 KPIs); gráfico e atividades empilham (l.572) | Contar colunas a 390 e 768; posição do gráfico × atividades | 390: 1–2 colunas sem cartão < 140 px; gráfico e atividades empilhados = 100 % |
| M10 | Alvos de toque ≥ 44×44 px no celular (l.174, 595, 615) | Todos os elementos interativos visíveis no dashboard, drawer e login a 390 | % de alvos ≥ 44×44 (ou 44 px no menor lado com área de toque) → nota proporcional: ≥ 95 % = 100 %; senão = % medido |
| M11 | Nenhum overflow horizontal de 320 a 1920 px (l.592) | `scrollWidth > innerWidth` no login e no dashboard nas 14 larguras | nota = larguras sem overflow / 14 (pior das duas telas) |
| M12 | Campos com fonte ≥ 16 px e altura ≥ 48 px no celular (l.47, 596) | Estilos dos inputs do login a 390 | 2 sub-itens, 50 % cada |
| M13 | Login no celular: header fino de 56 px mantido e cartão na largura total (l.46) | Medir a 390 | 2 sub-itens, 50 % cada |
| M14 | Sem texto cortado nem sobreposição indevida nas larguras móveis (l.593–594) | Inspeção das capturas 320/360/390 + detecção de `scrollWidth > clientWidth` em elementos de texto com `overflow:hidden` | nenhum caso = 100 %; casos menores = 50 %; conteúdo essencial cortado = 0 % |

### P — Paleta e tokens

| ID | Requisito (origem) | Método | Limiar / pontuação |
|---|---|---|---|
| P1 | `primary` #1d4ed8 na ação principal (botão SSO/Entrar, "+ Novo") (l.255, 389) | Cor de fundo computada do botão principal | idêntica = 100 %; outro azul = 50 % |
| P2 | `bg` #f8fafc no fundo da página/conteúdo (l.264) | Fundo computado do body/área de conteúdo | idêntica = 100 % |
| P3 | `surface` #ffffff nos cartões (l.266) | Fundo do cartão KPI | idêntica = 100 % |
| P4 | `text` #0f172a no texto principal (l.268) | Cor do body/título | idêntica = 100 % |
| P5 | `border` #e6e6e6 de 1 px nos cartões e na tabela (l.272, 386) | Borda do cartão | cor e largura idênticas = 100 %; só largura = 50 % |
| P6 | `textMuted` #686d7a no texto secundário (l.269) | Cor de rótulo de KPI/subtítulo | idêntica = 100 % |
| P7 | Semânticos success #117e39 e error #dc2626 em variações/badges/erros (l.282, 286) | Cor de delta positivo/negativo e de mensagem de erro | os dois = 100 %; um = 50 % |
| P8 | `navBg`/`navText`/`navActive` usados na navegação conforme papéis (l.293–296) | Cores do header e dos itens de navegação | papéis coerentes com tokens = 100 % |
| P9 | Fonte Inter em títulos e texto (l.300–316) | `font-family` computada e fonte efetivamente renderizada (`document.fonts.check`) | Inter declarada e carregada = 100 %; declarada mas com fallback por falta de rede/arquivo = 50 % (D se a rede impede) |
| P10 | Tamanho base 15 px (global) ou 13 px (componentes) (K8) | `font-size` do body e da tabela | body 15 e componentes 13–15 = 100 %; fora de 12–16 = 0 % |
| P11 | Peso dos títulos 650/640 (l.315, 390) | `font-weight` do h1/h2 | 600–700 = 100 % |
| P12 | Raios: global 8/6/12 px ou Compact Pro 4 (controles)/6 (contêineres) (K8) | `border-radius` de cartão, botão e input | todos em 4–12 px = 100 %; raios > 16 px ou pílulas em controles = 50 % |
| P13 | Sem sombra em superfícies de conteúdo; só flutuantes (l.330, 338, 623) | `box-shadow` de cartões, sidebar, tabela | nenhum = 100 %; sombra leve em cartões = 50 % |
| P14 | Tokens centralizados em variáveis CSS, sem cores fixas espalhadas (l.628) | Contar `--*` em `:root` com valores dos tokens; contar hex literais fora de `:root` | variáveis com ≥ 80 % dos tokens e ≤ 10 hex soltos = 100 %; parcial = 50 % |
| P15 | Densidade: global confortável × componentes compactos (K8): linhas da tabela 30–48 px e controles ≥ 30 px | Altura de linha da tabela e dos botões do header da tabela a 1440 | 28–52 px = 100 % (registrar a interpretação) |
| P16 | Foco visível: anel 2–3 px na cor `focusRing` #1d4ed8 (l.349, 416, 420) | Tab até botão/link/input; ler `outline`/`box-shadow` | 2–3 px e cor do token (ou com alfa) = 100 %; foco visível noutra cor = 50 %; sem foco = 0 % |
| P17 | Contraste WCAG AA nos pares principais (l.629) | Calcular contraste texto/fundo de texto secundário, navText/navBg, texto sobre primary | todos ≥ 4,5 = 100 %; um < 4,5 = 50 % |

### C — Componentes (estrutura)

| ID | Requisito (origem) | Método | Limiar / pontuação |
|---|---|---|---|
| C1 | Login "Acesso corporativo": header fino com logo à esquerda e "Suporte de TI" à direita; cartão com "Entrar com SSO da empresa", divisor "ou", e-mail corporativo, senha; aviso "Acesso monitorado. Uso restrito a colaboradores autorizados."; título "Acesso corporativo"; subtítulo "Entre com a conta da sua organização." (l.25–31) | Inventário de texto e DOM | 8 elementos, 12,5 % cada |
| C2 | Medidas do login: formulário 360–400 px; inputs ≈44 px no desktop (l.34–35) | Medir a 1440 | formulário 306–460 e inputs 40–48 = 100 %; um = 50 % |
| C3 | Labels visíveis associados (for/id); e-mail `type=email`, `inputmode=email`, `autocomplete=username|email`; senha `autocomplete=current-password` (l.38) | Atributos do DOM | 4 sub-itens, 25 % cada |
| C4 | Dashboard: cabeçalho da página (título "Visão geral", período, ações) → KPIs → gráfico (2/3) + atividades (1/3) (l.515, 526–530) | Inventário; razão de larguras gráfico/(gráfico+atividades) a 1440 | 4 sub-itens: cabeçalho, KPIs, gráfico, lista de atividades ao lado com razão 0,55–0,75 — 25 % cada |
| C5 | 3 KPIs (l.527; K18) | Contagem | 3 = 100 %; 4 = 75 % (E, K18 sugere 4); outro = 50 % |
| C6 | Tabela semântica: `<table>`, `<thead>`, `<th scope="col">`; 4 colunas (Cliente/Status/Valor/Data ou equivalentes financeiros); status em badge; valores à direita com `tabular-nums`; seleção com checkbox; ações por linha; cabeçalho destacado; sem zebra (l.364–386) | DOM e estilos | 8 sub-itens, 12,5 % cada |
| C7 | Gráfico de barras com 2 séries (série 1 primary, série 2 destaque), legenda, grade, sem rótulos de valores, título + filtro de período, alternativa acessível (l.440–458) | DOM/SVG/canvas e cores | 7 sub-itens: barras, 2 séries, cor s1 = primary, cor s2 = accent/destaque (#0ea5e9 ou #0c91cd, K15), legenda, grade, alternativa acessível — 1/7 cada |
| C8 | Abas do header encaixadas: item ativo com fundo da página e bordas laterais/superior; `aria-current`/`aria-selected` (l.159, 177, 194) | Estilo computado da aba ativa | fundo = bg/surface claro sobre header escuro e bordas = 100 %; só destaque de cor = 50 % |
| C9 | Estados de carregando (skeleton), vazio e erro na tabela (l.366, 627) | Procurar e acionar os estados | 3 estados = 100 %; 2 = 66 %; 1 = 33 % |
| C10 | `<header>` com `<nav aria-label="Principal">`; sidebar `<nav aria-label="Menu lateral">`; `aria-current="page"` no item atual (l.194, 243, 245) | DOM | 3 sub-itens, 1/3 cada |

### I — Interações

| ID | Requisito (origem) | Método | Limiar / pontuação |
|---|---|---|---|
| I1 | Validação ao enviar e ao sair do campo: mensagem abaixo do campo com `aria-invalid` + `aria-describedby`; resumo no topo com `role="alert"` (l.40) | Enviar vazio; sair de campo inválido | 4 sub-itens (no envio, no blur, aria nos campos, resumo role=alert) — 25 % cada |
| I2 | Erro genérico "E-mail ou senha incorretos" (l.41) | Enviar credenciais erradas | texto genérico = 100 % |
| I3 | Mostrar/ocultar senha com `aria-label` alternando e `aria-pressed` (l.39) | Clicar no botão | 3 sub-itens (alterna type, aria-label, aria-pressed) |
| I4 | "Esqueci minha senha" → recuperação com mensagem neutra "Se o e-mail existir, enviaremos um link" (l.42) | Clicar e enviar | fluxo com mensagem neutra = 100 %; link sem fluxo = 25 % |
| I5 | Botão "Entrando…" desabilitado durante o envio (l.43) | Observar o botão logo após enviar | texto + disabled = 100 %; um = 50 % |
| I6 | Botão SSO tem comportamento demonstrativo (l.54) | Clicar | alguma resposta explicativa = 100 %; nada = 50 % (D: SSO real impossível) |
| I7 | Drawer: foco vai ao Fechar/1º item ao abrir; foco preso; fundo inert/aria-hidden; fecha com Esc, scrim e X; foco volta ao gatilho; body sem rolagem (l.128–129) | Teclado + cliques a 390 | 6 sub-itens (foco inicial, trap, inert, 3 formas de fechar, retorno do foco, scroll lock) — 1/6 cada |
| I8 | Tocar num destino do drawer navega e fecha o drawer (l.131) | Clicar num item | = 100 % |
| I9 | Animação do drawer 200–250 ms ao abrir, com prefers-reduced-motion (l.130) | `transition-duration` computada; regra de reduced-motion no CSS | 150–300 ms = 50 %; reduced-motion = 50 % |
| I10 | Rail (768–1023): botão expande a sidebar completa em sobreposição com scrim, Esc e clique fora (l.95, 232) | A 820: clicar no botão, testar Esc e clique fora | 4 sub-itens; se não houver rail, n/t (avaliado em D15) |
| I11 | Menu do perfil (avatar): nome e e-mail, Meu perfil, Configurações, Ajuda, Sair; fecha com Esc e clique fora (l.179, 246) | Abrir pelo avatar | itens ≥ 4 dos 5 e fecha com Esc = 100 %; abre sem Esc = 50 % |
| I12 | Seletor de unidade/espaço: menu com o atual marcado (✓) e "Criar espaço"; Esc/clique fora (l.226) | Clicar no seletor | = 100 %; presente sem menu = 25 %; ausente = 0 % |
| I13 | Menu ⋯ do perfil na sidebar abre para cima: Meu perfil, Preferências, Sair (l.227) | Clicar | = 100 %; ausente = 0 % |
| I14 | Seletor de período "Últimos 30 dias ▾" atualiza todos os blocos, com estado de carregando por bloco (l.160, 562) | Trocar o período; observar KPIs/gráfico/tabela | atualiza tudo + loading = 100 %; atualiza parte = 50 % |
| I15 | Abas do header trocam o sub-relatório/estado ativo (l.159, 177) | Clicar em outra aba | troca estado ativo e conteúdo = 100 %; só estado = 50 % |
| I16 | Ordenação da tabela por clique no cabeçalho com `aria-sort` (l.414) | Clicar no cabeçalho "Valor" | ordena + aria-sort = 100 %; só ordena = 50 % |
| I17 | Seleção: checkbox do cabeçalho seleciona todos e mostra indeterminado (l.414) | Marcar uma linha e o cabeçalho | 2 sub-itens |
| I18 | Tooltip do gráfico no hover/toque com valores (l.489) | Hover sobre uma barra | tooltip com valor = 100 % |
| I19 | Legenda clicável liga/desliga séries (l.489) | Clicar na legenda | = 100 % |
| I20 | Header ganha sombra suave após 8 px de rolagem (l.178) | Rolar 20 px; ler `box-shadow` | = 100 % |
| I21 | Botão "Exportar" com alguma ação (l.160) | Clicar | ação/feedback = 100 %; inerte = 50 % |
| I22 | Hover/focus-visible/ativo distintos nos itens de navegação (l.90, 225) | Hover + foco num item da sidebar | 2 sub-itens |

## 3. Composições

Para cada site: `convert` lado a lado (mesma altura) de (a) prévia integrada "Aplicação · Computador" do Studio × dashboard
a 1440; (b) prévia integrada "Aplicação · Celular" (fechado e com drawer) × dashboard a 390; (c) prévia do login "Acesso
corporativo" (computador e celular) × login do site; (d) prévia "Tablet" × site a 768. Diferenças de conteúdo de exemplo
("Orla", "Seriema") são esperadas (bug B4 do Studio) e não contam contra o site.
