# Rubrica de fidelidade — P1 Atlas Workspace

Escrita **antes** de abrir os sites `dev-1`, `dev-2` e `dev-3` (nenhum `index.html`, `README.md` ou `NOTES.md` foi lido até aqui).
Fontes: briefing do cliente; `fase2-projetos/P1-atlas-workspace/escolhas.md` e `relatorio.md`; `exportados/atlas-workspace-master-prompt.md` (citado como **MP l.N**); `exportados/atlas-workspace-tokens.css`; prévias aprovadas em `capturas/`.

## Convenções

- **Viewports de referência:** desktop 1440×900; tablet 768×1024; celular 390×844 com `isMobile: true`, `hasTouch: true` e `deviceScaleFactor: 2` (Chromium/Playwright 1.63). Varredura de larguras: 320, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px.
- **Medição:** `getBoundingClientRect()` e `getComputedStyle()` no DOM vivo, depois de autenticar com as credenciais de demonstração do README de cada site. Cores comparadas em hexadecimal: "idêntica" quer dizer diferença 0 em cada canal RGB.
- **Tolerância numérica padrão:** ±15 % do valor recomendado. Quando o MP dá dois valores (por exemplo, sidebar 252 × 248 px), vale a união das duas faixas.
- **Nota por requisito:** 100 % = atende; 75 % = atende com desvio pequeno; 50 % = parcial; 25 % = vestígio; 0 % = ausente ou contrário. Requisitos com várias partes recebem a fração das partes atendidas.
- **Requisitos `[J]`** são julgamento de design (avaliação visual minha) e aparecem marcados assim nas matrizes.
- **Escolha internamente contraditória no Studio (origem D):** quando a prévia aprovada e/ou o MP sustentam duas leituras incompatíveis, vale como 100 % qualquer uma delas, desde que aplicada de forma coerente. Aplicar as duas misturadas, ou nenhuma, perde nota.
- **Origem da falha** (preenchida só depois de medir):
  - A = falha do Studio (escolha não registrada ou não exportada);
  - B = falha do Master Prompt (registrada, mas ambígua, incompleta ou contraditória);
  - C = falha do desenvolvedor (instrução clara não respeitada);
  - D = conflito ou limitação da especificação;
  - E = diferença aceitável.
- **Dimensões:**
  - ARQ = arquitetura (fluxo, rotas, destinos, breakpoints);
  - DSK = desktop;
  - CEL = celular;
  - PAL = paleta e identidade;
  - CMP = componentes;
  - INT = interações;
  - RSP = responsividade (varredura).

  A **nota geral** é a média simples de todos os requisitos pontuados. A nota de cada dimensão é a média dos seus requisitos.

## 1. Arquitetura (ARQ)

| ID | Requisito | Fonte | Método de medição | Limiar |
|---|---|---|---|---|
| ARQ-1 | Fluxo "Apenas login": o endereço abre direto na tela de entrar, sem landing | MP l.15–16 | Contexto limpo (sem storage) → `index.html`: a primeira tela tem campos de e-mail e senha; não há página de apresentação | Sim/não |
| ARQ-2 | Cadastro em página/rota própria (/cadastro), com "Criar conta" no login e "Já tem conta? Entrar" de volta | MP l.28, 63–69 | Clicar "Criar conta" → URL ou hash muda e a tela própria aparece; clicar "Entrar" → volta | Dois sentidos = 100 % |
| ARQ-3 | Fluxo de recuperação de senha por e-mail, a partir de "Esqueci minha senha" | MP l.43 | Clicar no link → tela ou painel de recuperação com campo de e-mail e envio | Existe e funciona |
| ARQ-4 | Depois do login, o shell da aplicação abre na página de painel "Visão geral" | MP l.721 | Login válido → título da página inicial | "Visão geral" (ou equivalente com KPIs) |
| ARQ-5 | Destinos da sidebar: grupos Geral (Início, Painel, Projetos 12, Tarefas, Calendário), Equipe (Pessoas, Mensagens 3, Relatórios), Conta (Configurações, Ajuda) | MP l.251 | Texto dos itens e títulos de grupo no DOM | Fração dos 10 itens + 3 grupos + 2 contadores |
| ARQ-6 | Troca de arquitetura em 768 px: ≥ 768 desktop (sidebar), < 768 mobile (bottom nav) | MP l.139, 179 | Medir em 767 e 768 px quais navegações estão visíveis | Troca exatamente em 768 (±1 px) |
| ARQ-7 | 768–1023 px: sidebar em trilho integral de ≈72 px (só ícones, tooltip/aria-label) + botão que expande em sobreposição com scrim | MP l.138, 280 | Largura da sidebar a 768 e 1000 px; rótulos ocultos; abrir a expansão → painel sobreposto + scrim | Largura 61–83 px; expansão sobreposta |
| ARQ-8 | 1024–1279 px: sidebar ≈220 px (layout) ou 248 px (estilo) | MP l.137 × l.279 | Largura a 1024 e 1280 px | 187–285 px |
| ARQ-9 | A marca do shell é "Atlas Workspace" (substitui "Tucano"/"Ipê") e aparece uma vez por região de marca | MP l.8, 111, 201 | Texto da marca na sidebar/header | "Atlas Workspace" visível; sem marcas fictícias |
| ARQ-10 | Mesma hierarquia e mesmos destinos principais nas duas versões (desktop e celular) | MP l.188 | Comparar os destinos da bottom nav com os da sidebar | Destinos da bottom nav existem também no desktop |

## 2. Desktop 1440×900 (DSK)

| ID | Requisito | Fonte | Método | Limiar |
|---|---|---|---|---|
| DSK-1 | Sidebar integral do topo à base: x = 0, y = 0, altura = altura da janela, sem margem, sem raio, sem sombra flutuante | MP l.106, 110, 142, 818 | rect + computed style do `aside`/`nav` lateral, em repouso e após rolar o conteúdo | x = 0, y = 0, h ≥ 98 % de 900, raio 0, box-shadow none |
| DSK-2 | Largura da sidebar ≈252 px (layout) / 248 px (estilo) | MP l.109–110, 249, 263 | `rect.width` | 211–290 px = 100 %; ±30 % = 50 % |
| DSK-3 | O header fica só sobre a coluna principal (gridAreas "sidebar header") e não passa por cima da sidebar | MP l.114, 120 (× l.199 "full width" = C1) | `header.left` ≈ `sidebar.right` (±2 px) | Sim/não |
| DSK-4 | Altura do header ≈64 px (layout) / 56 px (header) | MP l.109, 199 | `rect.height` | 48–74 px |
| DSK-5 | Header sticky no topo, com borda inferior de 1 px no token `border` | MP l.114, 132, 200, 222 | Rolar o conteúdo 600 px → `header.top` continua 0; `border-bottom` | Fixo + 1 px #e6e6e6 |
| DSK-6 | Topo da sidebar com a mesma altura do header, logo + nome do produto, formando linha contínua | MP l.111 | Altura do bloco da marca × altura do header; posição y da linha divisória | Diferença ≤ 4 px |
| DSK-7 | Itens de navegação: títulos de grupo em caixa alta (11 px, 650, 0,08em, textMuted), ícone de linha de 18–20 px + rótulo, altura do item 36–44 px | MP l.112, 252–253, 264–266 | Computed style do título de grupo e do item | Partes atendidas (5) |
| DSK-8 | Item ativo: fundo navActive #e3e3e4, texto navActiveText #18181b, cantos radiusMd (8 px), indicador lateral, aria-current="page" | MP l.112, 272 | Computed style do item ativo + atributo | Partes (5) |
| DSK-9 | Rodapé da sidebar com bloco de perfil (avatar, nome, cargo/e-mail, menu ⋯) e atalho de configurações, separado por borda fina | MP l.113, 254 | DOM + rect: o rodapé encosta na base da janela | Partes (3) |
| DSK-10 | Header com trilha (breadcrumbs) à esquerda, último nível em 600 + aria-current; sino com contador; avatar circular de 32 px | MP l.114, 203–204, 210 | DOM + computed | Partes (3) |
| DSK-11 | Sidebar sticky com rolagem interna; a página rola só na coluna de conteúdo | MP l.131, 276 | `scrollTo` no fim → `sidebar.top` = 0 e altura mantida; `overflow-y` da lista | Sim/não |
| DSK-12 | Área de conteúdo com padding de 24–32 px; grids internos sem cartões < 280 px | MP l.115 | Padding do contêiner de conteúdo; menor largura de cartão a 1440 e 1024 | Padding 24–32 px; cartão ≥ 280 px (KPIs pequenos tolerados ≥ 200 px) |
| DSK-13 `[J]` | Semelhança visual geral com a prévia aprovada (Live Site Preview / prévia integrada, computador) | capturas 34/36 | Composição lado a lado na mesma altura | Julgamento 0–100 |

## 3. Celular 390×844 (CEL)

| ID | Requisito | Fonte | Método | Limiar |
|---|---|---|---|---|
| CEL-1 | Bottom navigation fixa (position: fixed; bottom: 0), visível, altura ≈64 px + safe area, fundo até a borda | MP l.150, 154, 166–167 | Computed `position`, `rect.bottom` = 844, `rect.height` | Fixa + 54–74 px |
| CEL-2 | Exatamente 4 itens de largura igual, ícone de 24 px + rótulo de 12 px | MP l.150, 154 | Quantidade; diferença máxima de largura; ícone; `font-size` do rótulo | 4 itens; Δ ≤ 2 px; ícone 22–26 px; rótulo ≥ 12 px |
| CEL-3 | Destinos da prévia aprovada: Início, Buscar, Agenda, Perfil | captura 11 (não está no MP) | Texto dos rótulos | Fração de 4 |
| CEL-4 | Item ativo com aria-current="page" e indicador além da cor (pílula/ponto/ícone preenchido) | MP l.171 | Atributo + estilo (fundo/pílula/forma) | Partes (2) |
| CEL-5 | Topbar de ≈56 px + safe-area-inset-top, com título da tela e **uma** ação à direita | MP l.153, 166; prévia 11 | rect do header no celular; conteúdo | 48–64 px; título + ação |
| CEL-6 | Sem sidebar/drawer como navegação principal (lateral: none; sobreposição: none); nada de ☰ como navegação primária | MP l.139, 159–161, 286, 802 (× l.230, 281 = C2) | Sidebar oculta; botão ☰ presente/ausente | Sem sidebar visível; ☰ ausente = 100 %; ☰ + drawer que duplica a bottom nav = 50 % |
| CEL-7 | Conteúdo não fica escondido atrás da bottom nav (padding inferior ≥ altura da barra) | MP l.155 | Rolar até o fim: `ultimoElemento.bottom` ≤ `bottomNav.top` | Sim/não |
| CEL-8 | Itens da bottom nav ≥ 48×48 (mínimo 44×44) | MP l.168, 183 | rect dos itens | ≥ 48 = 100 %; 44–47 = 75 % |
| CEL-9 | Safe areas: `env(safe-area-inset-top/bottom)` nas barras fixas e `viewport-fit=cover` | MP l.153–154, 794 | CSS-fonte + meta viewport | Partes (3) |
| CEL-10 | Na horizontal (844×390): barra inferior ≈48 px, barras fixas somadas ≤ 25 % da altura | MP l.178, 795 | Medir em 844×390 móvel | Barra 40–56 px; soma ≤ 97 px |
| CEL-11 | Login no celular: cartão sem borda e sem sombra, largura total com 20 px de margem; inputs com fonte ≥ 16 px e altura ≥ 48 px | MP l.47–48 | rect + computed na tela de login a 390 px | Partes (4) |
| CEL-12 | Cadastro no celular: uma coluna, 20 px de margem, checkbox de termos com área de toque ≥ 44 px, inputs ≥ 16 px | MP l.92, 790 | rect + computed | Partes (4) |
| CEL-13 `[J]` | Semelhança visual com a prévia aprovada do celular (topbar "Início" + sino; KPIs; atividade; bottom nav de 4 itens) | capturas 11/34/37 | Composição lado a lado | Julgamento 0–100 |

## 4. Paleta, tipografia e geometria (PAL)

| ID | Requisito | Fonte | Método | Limiar |
|---|---|---|---|---|
| PAL-1 | `primary` #18181b no botão principal ("Entrar") e texto `onPrimary` #ffffff | MP l.303, 306 | Computed `background-color`/`color` | Idêntica |
| PAL-2 | `text` #18181b no texto do corpo | MP l.316 | `body` computed `color` | Idêntica |
| PAL-3 | `bgAlt` #f6f6f6 de tela cheia no fundo do login | MP l.26, 313 | Computed do contêiner da tela de login | Idêntica |
| PAL-4 | `border` #e6e6e6 nas bordas estruturais (borda inferior do header, borda direita da sidebar) | MP l.200, 250, 320 | Computed | Idêntica |
| PAL-5 | `navActive` #e3e3e4 / `navActiveText` #18181b no item ativo da sidebar | MP l.343–344 | Computed | Idêntica |
| PAL-6 | `textMuted` #707072 em textos secundários (títulos de grupo, subtítulos) | MP l.317 | Computed | Idêntica |
| PAL-7 | `accent` #2563eb só em pequenos marcadores/info, nunca como cor da ação principal | MP l.310, 417 | Busca de usos e da cor do botão principal | Uso restrito |
| PAL-8 | Semânticos: success #117e39 em variação positiva, error #dc2626 em mensagens de erro | MP l.330, 334, 637 | Computed do texto de variação do KPI e da mensagem de erro do login | Idênticas (2 partes) |
| PAL-9 | Família tipográfica Inter (títulos e textos) | MP l.348–361 | `font-family` computed começa por Inter; registrar se a fonte foi de fato carregada (`document.fonts`) | Declarada = 100 %; não declarada = 0 % |
| PAL-10 | Tamanho base 15 px (global) — Swiss impõe 14 px nos componentes (C5) | MP l.362 × 440 | `body` font-size; texto de célula de tabela/KPI | Global 15 px; componentes 14 ou 15 px (D) |
| PAL-11 | Peso dos títulos 650 (global) ou 750/760 (Swiss) | MP l.363 × 416, 437 | `h1`/título de seção computed | 600–800 |
| PAL-12 | Raios: tokens globais (6/8/12 px) fora dos 5 componentes (login, cadastro, inputs, botões globais); 0 px dentro dos componentes Swiss | MP l.382–384 × 431–432 (C5) | Raio do input do login, do cartão do login, do cartão de KPI e da tabela | Leitura coerente (D); 2 partes |
| PAL-13 | Sem sombra em superfícies de conteúdo (cards, KPIs, tabela, sidebar); sombra só em flutuantes | MP l.378, 386, 419 | `box-shadow` dessas superfícies | Todas `none` |
| PAL-14 | Tokens centralizados em variáveis CSS, sem cores fixas espalhadas | MP l.822 | Contar literais hex/rgb fora do arquivo de tokens (CSS + JS) | ≤ 10 literais fora dos tokens = 100 %; ≤ 30 = 50 % |
| PAL-15 | Bordas de 1 px; nos componentes Swiss, borda na cor do texto (#18181b) | MP l.414, 433, 452 | Computed `border` do cartão de KPI / tabela / card | 1 px #18181b |
| PAL-16 | Ícones de contorno (outline), traço ≈1,5 px, 16–20 px na interface | MP l.379, 390, 443 | Atributos dos SVGs (`stroke-width`, `fill`) | Contorno; traço 1,25–2 |
| PAL-17 | Foco visível: contorno de 2 px em focusRing #18181b, afastamento de 2 px | MP l.397, 464 | Tab até um input/botão → computed `outline` | 2–3 px #18181b |

## 5. Componentes (CMP)

| ID | Requisito | Fonte | Método | Limiar |
|---|---|---|---|---|
| CMP-1 | Login "Clássico central": logo + "Atlas Workspace" acima do cartão de ≈400 px (340–460), padding ≈32 px (27–37), título "Entrar na sua conta", subtítulo, labels visíveis, "Lembrar de mim", "Esqueci minha senha" junto da senha, botão "Entrar" em largura total, "Não tem conta? Criar conta", rodapé Termos/Privacidade | MP l.23–36 | DOM + rect a 1440 | Fração das 10 partes |
| CMP-2 | Inputs do login com ≈44 px no desktop | MP l.34 | rect | 40–48 px |
| CMP-3 | Cadastro: mesma composição do login, título "Crie sua conta", 5 campos na ordem (Nome, E-mail, Senha, Confirmar, Aceite), termos com links, "Já tem conta? Entrar", requisitos de senha + força com texto | MP l.63–87 | DOM | Fração das 6 partes |
| CMP-4 | Dashboard: cabeçalho da página (título "Visão geral", período, ações) → KPIs → gráfico de barras (≈2/3) + atividades (≈1/3) | MP l.707–725 | DOM + rect a 1440: razão de largura gráfico/(gráfico+atividades) | Partes (4); razão 0,55–0,75 |
| CMP-5 | Quantidade de KPIs do Dashboard = 3 | MP l.722 (a prévia integrada mostra 4) | Contagem | 3 = 100 %; 4 = 50 % |
| CMP-6 | Anatomia do KPI: rótulo + ícone → valor grande tabular-nums → variação (seta + %) colorida → comparativo → sparkline ("Receita mensal", "R$ 48,2 mil", "+12,4%", "vs. mês anterior") | MP l.636–653 | DOM + computed `font-variant-numeric` | Fração das 6 partes |
| CMP-7 | KPI no estilo Swiss: raio 0, borda de 1 px #18181b, sem sombra, rótulo em caixa alta 0,08em | MP l.638–643, 654–657 | Computed | Partes (4) |
| CMP-8 | Cards: mídia 16/9 → etiqueta → título → texto → rodapé com meta + ação; Swiss: raio 0, borda de 1 px tinta, sobretítulo numerado "01 —", botão em caixa alta | MP l.409–444 | DOM + computed de pelo menos um card | Fração das 6 partes |
| CMP-9 | Tabela "Pedidos recentes": `<table>` semântica (thead, th scope=col), colunas Cliente/Status/Valor/Data, status em badge, valores à direita com tabular-nums, checkbox de seleção, ações por linha, cabeçalho destacado, sem zebra | MP l.484–519 | DOM + computed | Fração das 8 partes |
| CMP-10 | Tabela no estilo Swiss: raio 0, linhas de 1 px, cabeçalho em caixa alta 0,08em | MP l.490–495 | Computed | Partes (3) |
| CMP-11 | Formulário Swiss: campos sublinhados (só linha inferior), rótulos em caixa alta 0,08em, duas colunas no desktop, checkbox de termos, botão primário em caixa alta | MP l.559–592 | Localizar o formulário de conteúdo (fora do login) e medir | Fração das 5 partes |
| CMP-12 | Tipografia Swiss nos componentes: títulos pesados (≥ 700) com letter-spacing negativo; rótulos/botões em caixa alta 0,08em | MP l.416, 437–439 | Computed do título de seção/card | Partes (2) |
| CMP-13 | Header: popover de notificações de 320 px com não lidas e "Ver todas"; menu de perfil com nome, e-mail, Meu perfil, Configurações, Ajuda, Sair | MP l.203, 223–224 | Abrir e medir | Partes (2) |
| CMP-14 | Estados de carregando, vazio e erro na tabela (e em listas) | MP l.489, 821 | Procurar no DOM/JS estados acionáveis (skeleton, "Nenhum…", erro + tentar de novo) | Fração dos 3 |
| CMP-15 `[J]` | Semelhança visual dos componentes com as prévias Swiss Minimal aprovadas (capturas 25-*) | capturas 25 | Composição lado a lado | Julgamento 0–100 |

## 6. Interações (INT)

| ID | Requisito | Fonte | Método | Limiar |
|---|---|---|---|---|
| INT-1 | Login vazio → erro abaixo de cada campo (aria-invalid + aria-describedby) + resumo no topo com role="alert" | MP l.41 | Enviar vazio; inspecionar atributos | Partes (3) |
| INT-2 | Validação ao sair do campo (e-mail inválido no blur) | MP l.41 | Digitar "abc", Tab → mensagem | Sim/não |
| INT-3 | Credenciais erradas → mensagem genérica "E-mail ou senha incorretos" | MP l.42 | Senha errada | Texto genérico |
| INT-4 | Mostrar/ocultar senha dentro do campo, aria-label alternando "Mostrar senha"/"Ocultar senha" + aria-pressed | MP l.40 | Clicar; ler `type`, `aria-label`, `aria-pressed` | Partes (3) |
| INT-5 | Botão com estado "Entrando…" e desabilitado durante o envio | MP l.44 | Observar logo após o clique | Partes (2) |
| INT-6 | Recuperação com mensagem neutra ("Se o e-mail existir, enviaremos um link") | MP l.43 | Enviar e-mail na recuperação | Texto neutro |
| INT-7 | Cadastro: validação no blur; "As senhas não coincidem"; força da senha com texto; toggles independentes; termos obrigatórios; e-mail existente com mensagem neutra que oferece Entrar/Recuperar; nada apagado; autocomplete name/email/new-password | MP l.80–89 | Roteiro de testes | Fração das 8 partes |
| INT-8 | Cadastro válido conclui (entra no app ou volta ao login com aviso) | MP l.63 | Enviar válido | Sim/não |
| INT-9 | Botão "Recolher menu"/"Expandir menu" alterna 248 ↔ 72 px, rótulos viram tooltip e o estado é lembrado (localStorage) | MP l.273 | Clicar; medir; recarregar | Partes (4) |
| INT-10 | Clique em item da sidebar marca ativo (aria-current) e troca o conteúdo/título | MP l.272 | Clicar em "Projetos" | Sim/não |
| INT-11 | Popover de notificações e menu de perfil: abrem por clique, fecham com Esc e clique fora, ficam dentro da viewport | MP l.223–224, 232, 294 | Abrir, Esc, clicar fora, medir a 1440 e a 390 | Partes (3) |
| INT-12 | Menu ⋯ do perfil na sidebar abre para cima (Meu perfil, Preferências, Sair) | MP l.275 | Abrir; `menu.bottom` ≤ `gatilho.top` | Sim/não |
| INT-13 | Sair encerra a sessão e volta ao login | MP l.224 | Clicar "Sair" | Sim/não |
| INT-14 | Header ganha sombra suave depois de 8 px de rolagem | MP l.222 | Rolar 20 px → `box-shadow` ≠ none | Sim/não |
| INT-15 | Tablet: o trilho expande em sobreposição com scrim; fecha com Esc e clique fora | MP l.138, 280 | 900×1024: clicar no botão; Esc | Partes (3) |
| INT-16 | Bottom nav: tocar troca o destino (título e conteúdo); tocar no ativo rola ao topo; cada destino preserva a rolagem | MP l.171–173 | Toques em 390×844 | Partes (3) |
| INT-17 | Tabela: selecionar todos (indeterminado), ordenar pelo cabeçalho com aria-sort, menu de ações por linha | MP l.506, 537 | Cliques | Partes (3) |
| INT-18 | Formulário de conteúdo: validação no blur/envio, resumo com links, "Enviando…" desabilitado, valores preservados | MP l.610–611 | Roteiro | Partes (4) |
| INT-19 | Filtro de período do dashboard atualiza todos os blocos (com estado de carregando) | MP l.757 | Trocar o período; comparar valores | Sim/parcial/não |
| INT-20 | Teclado: foco visível, Esc fecha menus e o foco volta ao gatilho; drawers/menus prendem o foco | MP l.287, 294–295, 797 | Tab/Enter/Esc no menu de perfil | Partes (3) |

## 7. Responsividade (RSP)

| ID | Requisito | Fonte | Método | Limiar |
|---|---|---|---|---|
| RSP-1 | Sem overflow horizontal no app em 14 larguras (320–1920) | MP l.786 | `documentElement.scrollWidth` ≤ `clientWidth` + 1 | Fração das larguras sem overflow |
| RSP-2 | Sem overflow horizontal no login e no cadastro em 14 larguras | MP l.50, 94 | Idem | Fração |
| RSP-3 | Nenhum texto cortado e nenhuma sobreposição indevida (barras fixas × conteúdo, texto truncado com reticências não intencional) | MP l.787–788 | Heurística: elementos de texto com `scrollWidth` > `clientWidth` e `overflow` ≠ visible; interseção da bottom nav com elementos interativos; inspeção das capturas | 0 casos = 100 %; ≤ 2 = 75 %; ≤ 5 = 50 % |
| RSP-4 | Alvos de toque ≥ 44×44 no celular (≤ 480 px) | MP l.789 | Todos os `a`, `button`, `input`, `[role=button]` visíveis a 390 px no app e no login | % conformes: ≥ 95 % = 100; ≥ 85 % = 75; ≥ 70 % = 50 |
| RSP-5 | Tabela no celular com rolagem local (overflow-x no contêiner) ou cartões | MP l.547 | 390 px: contêiner da tabela com `overflow-x: auto`/`scroll`, ou layout de cartões | Sim/não |
| RSP-6 | Grade de KPIs reduz colunas (4/3 → 2 → 1) sem cortar valores | MP l.695, 767 | Contar colunas a 1440, 820 e 390 | Redução progressiva |
| RSP-7 | Inputs com fonte ≥ 16 px no celular | MP l.48, 790 | Computed a 390 px no login, no cadastro e no formulário | Todos ≥ 16 px |
| RSP-8 | `100dvh` (com fallback) e `prefers-reduced-motion` no CSS | MP l.796, 798 | Busca no CSS-fonte | Partes (2) |

## Requisitos não pontuados (registrados para comparação)

- **Três links de navegação no header (Projetos, Equipe, Ajustes)** (MP l.202): contradiz a composição A, cuja prévia mostra só a trilha (C7). Qualquer leitura é aceitável (E). Só registro.
- **Grupos da sidebar recolhíveis (accordion)**: o MP diz "podem recolher" (l.133). É facultativo; registro, sem nota.
- **Busca no header e na sidebar**: o layout pede busca (l.114), e a busca da sidebar pertence à composição B, que não foi escolhida (l.254, 274). Registro.
- **Backend real de autenticação** (MP l.55–57, 100): fora do escopo de um protótipo estático. Não pontuado.

## Contagem

- ARQ 10, DSK 13, CEL 13, PAL 17, CMP 15, INT 20, RSP 8.
- **Total: 96 requisitos por site**, dos quais 3 são de julgamento (`[J]`).
