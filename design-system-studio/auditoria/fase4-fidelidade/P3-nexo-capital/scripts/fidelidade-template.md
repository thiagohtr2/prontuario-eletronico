# P3 — Nexo Capital · Fidelidade: escolhas no Studio → Master Prompt → sites construídos

Auditoria independente, fase 4. Data: 03/11/2026. Sites com rótulos cegos (dev-1, dev-2, dev-3), avaliados só com evidências
registradas e medições próprias. A rubrica (`rubrica.md`) foi escrita antes de abrir qualquer arquivo dos sites; itens
identificados depois disso estão marcados como **(pós-abertura)**.

## 0. Resumo

{{NOTAS}}

Nota geral = média simples dos 87 requisitos (cada um pesa igual); nota da dimensão = média dos requisitos da dimensão.
Os três sites passaram nos 87 requisitos testáveis (nenhum "n/t").

**Contagem de desvios por origem** (requisito × site; "E" = conflito do prompt resolvido de forma aceitável, com nota 100 %):

{{CONTAGEM}}

Além dos desvios medidos nos sites, a cadeia Studio → prompt tem **8 falhas de tipo A** (Studio) e **25 conflitos ou lacunas de
tipo B/D** no texto do Master Prompt (seção 2). A maioria não virou desvio porque os três desenvolvedores perceberam os
conflitos e os resolveram de forma defensável (77 resoluções "E", registradas nos três `NOTES.md`). Os conflitos custaram
trabalho de interpretação. Em seis deles os sites divergiram entre si (K9, K19, K20, K22, K24, K25) e em outros quatro
divergiram em parte (K6, K10, K11, K17).

**As 5 falhas mais importantes**

1. **Sidebar marinho em vez de clara no dev-3 (B, K9).** O prompt diz "Superfície: … (bgAlt)" (l.204) e, no mesmo bloco,
   "Cores dos tokens … (navBg, navText, navActive…)" (l.242). As prévias aprovadas mostram sidebar clara com header
   marinho. dev-3 seguiu os tokens nav e pintou a sidebar de #0f1f4d. É o desvio visual mais evidente frente às capturas do Studio.
2. **Navegação e conteúdo não financeiros nos três sites (A).** Os itens da sidebar (Contratos, Fornecedores, Compras,
   Colaboradores, Folha…) e as abas (Aquisição, Retenção) são exemplos fixos e não editáveis do Studio, exportados como
   especificação (l.159, l.205). Os três sites os mantiveram ao pé da letra, como o prompt manda. O cliente pediu uma
   plataforma financeira, e o Studio não tem onde registrar esse domínio (dev-3 também escolheu KPIs comerciais).
3. **Período e Exportar em lugares diferentes (B, K19, pós-abertura).** O prompt pede o filtro de período em três lugares
   (header l.160, cabeçalho da página l.515, cabeçalho do gráfico l.440). dev-1 atendeu aos três, dev-2 deixou o
   cabeçalho da página sem período no desktop, e dev-3 tirou período e Exportar do header (composição A aprovada).
4. **Defeitos de implementação no shell do dev-3 (C).** A marca "Nexo Capital" fica invisível no topo da sidebar (#0f172a
   sobre #0f1f4d, 1,13:1). A lista da sidebar não rola e, com altura abaixo de ~720 px, invade o rodapé, sobrepondo
   texto (captura `capturas/dev-3/sidebar-janela-baixa-1280x560.png`). "Configurações" aparece duplicado no drawer.
5. **Alvos de toque menores que 44 × 44 px (C).** Atendem 80 % dos alvos no dev-3 (avatar 32×32, checkboxes 20×20,
   grupos do drawer com 41 px) e 89 % no dev-1 (link da marca com 28 px de altura, checkboxes com 28 px de largura). A
   regra é explícita (l.174, 595, 615).

## 1. Método e evidências

- **Escolhas:** `fase2-projetos/P3-nexo-capital/escolhas.md` e `relatorio.md`. **Prompt:** `exportados/nexo-capital-master-prompt.md`
  (idêntico, byte a byte, ao `PROMPT.md` dos três sites; conferido com `cmp`). **Tokens:** `exportados/nexo-capital-tokens.css`.
- **Prévias aprovadas usadas na comparação:** 13, 15-* (prévia integrada computador/tablet/celular), 16/16b/17 (login), 10/11/12
  (header e sidebar), 32-* (componentes), 05/06 (drawer).
- **Sites:** servidos com `python3 -m http.server` em 127.0.0.1:4531–4533 (servidores iniciados e encerrados por mim).
  Chromium do Playwright 1.63, contexto novo por medição. 1440×900 e 768×1024 sem emulação. 390×844 e larguras ≤ 480 com
  `isMobile`/`hasTouch`. Credenciais dos READMEs.
- **Scripts** (`scripts/`): `01` capturas principais · `02` sondagem do DOM · `03` medições de desktop e larguras da sidebar ·
  `04` celular, drawer e alvos de toque · `05/05b` login · `06/06b` interações do app e do trilho · `07` varredura de 14
  larguras · `08/08b/08c` títulos de grupo, marca, rolagem da sidebar, estados, tokens estáticos e cores semânticas ·
  `09` composições · `10-matriz.py` matriz e notas (gera este arquivo a partir de `fidelidade-template.md`). As saídas brutas
  ficam em `scripts/out-*.json`.
- **Limitações:** a fonte Inter está instalada no sistema, então dev-1 e dev-3 (que a carregam do Google Fonts) renderizam
  Inter aqui mesmo que a CDN falhe. O teclado virtual real e os leitores de tela não foram testados. A sobreposição da sidebar
  do dev-3 depende da altura da janela (testada em 1280×560; não ocorre em 1366×768 ou 1280×800 de viewport).

## 2. Cadeia Studio → Master Prompt

### 2.1 Por característica do briefing

| # | Característica do briefing | Escolhida no Studio? | Chegou ao Master Prompt? | Clareza (trechos) |
|---|---|---|---|---|
| 1 | Login profissional | Sim: "Apenas login" + login "Acesso corporativo" (SSO, Suporte de TI e aviso vêm do modelo) | Sim, l.17–57, com estrutura, medidas, estados e responsividade | **Alta.** Lacunas: K13 (cadastro "nenhum" × pendência, l.18 × l.635); K16 (autenticação real "com backend seguro", l.55/57, num site estático); K22 (estilo do botão "Entrar" não descrito; a prévia mostra contorno). |
| 2 | Dashboard financeiro | Parcial: tipo "Dashboard" + componente "Dashboard" Compact Pro chamado "Dashboard financeiro", com padrões (3 KPIs, barras, atividades) | Sim, l.508–578, mas "financeiro" só aparece no nome e no objetivo (l.10, 577) | **Média.** KPIs sem nome; K18 ("KPIs 4 → 2 → 1" com 3 KPIs); K19 (período em três lugares); sem domínio configurável (A-1). |
| 3 | Tabelas de dados | Sim: "Tabelas" Compact Pro chamado "Tabelas de dados" | Sim, l.357–431 | **Média-alta.** Conteúdo de exemplo "Pedidos recentes" (l.376–377, K12); densidade "compacta" exportada contra "Padrão" no editor (A-4) e "confortável" global (l.326, K8); celular "rolagem local ou cartões" × "viram cartões" (K14). |
| 4 | Gráficos | Sim: "Gráficos" Compact Pro (barras, 2 séries, legenda, grade) | Sim, l.433–506 | **Média-alta.** "Vendas por mês" com período de 30 dias (K24); série 2 "no destaque" com dois valores possíveis (K15); filtro do gráfico duplica o do header (K19). |
| 5 | Sidebar | Sim: layout "Sidebar integral clássica" + sidebar "Sóbria Corporativa · A" | Sim, l.59–101 e l.196–247 | **Média.** K3 (252 × 264 px), K4 (220 × 264), K9 (bgAlt × navBg), K10 (logo × seletor de unidade), K17 (36 × 40–44 px; indicadores), K7 (bottom nav), K12 (itens não financeiros e não editáveis). |
| 6 | Header | Sim: barra do layout + header "Painel Analítico · A" | Sim, l.149–194 | **Baixa-média.** K1 (64 × 56 px), K2 ("só sobre a coluna principal" × "largura total da janela"), K6 (painel abaixo do header × drawer; ☰ × trilho), K11 (dois conjuntos de ações), K19. O aviso do Studio "Navegação nos dois lugares / Logo uma vez só" não foi exportado (A-3). |
| 7 | Design corporativo | Sim: paleta "Azul Institucional"; tipografia e formas ficaram no padrão (sem escolha ativa) | Sim, l.249–351 (tabela completa de tokens) | **Alta para a cor, média para a geometria.** K8 (global 15 px/8 px/confortável × Compact Pro 13 px/4–6 px/compacta). Limitações D: pares semânticos do próprio token abaixo de AA (error/errorBg ≈ 4,0:1); focusRing sobre navBg = 2,37:1; accent sobre branco = 2,77:1. |
| 8 | Responsividade em telas pequenas | Sim: "Drawer pela esquerda" + regras automáticas | Sim, l.103–145 e l.580–617 | **Média.** K5 (tablet a partir de 600 × 768), K6, K7, K14, K21 (paisagem "drawer ≈320 px" × "≥ 768 px vale o desktop"), K23 (cor da topbar do celular não definida; a prévia do Studio é um modelo genérico "Orla" com topbar branca). |

### 2.2 Falhas da cadeia do tipo A (Studio: escolha não registrável ou não exportada)

| ID | Falha | Efeito observado nos sites |
|---|---|---|
| A-1 | Não há configuração de domínio. Nomes de KPIs, colunas, títulos, itens da sidebar e abas do header são exemplos fixos ("Gestão: Painel, Contratos, Fornecedores, Compras…"; "Visão geral, Aquisição, Retenção, Receita"; "Pedidos recentes"; "Vendas por mês"), exportados como especificação (relatório B3). | Os três sites mantiveram os rótulos (NOTES dev-1 §22, dev-2 §8, dev-3 §6) e só preencheram com dados financeiros. dev-3 nomeou KPIs comerciais (Clientes ativos, Ticket médio): A6 = 50 %. |
| A-2 | Não existe "confirmar que não haverá cadastro". A pendência contraditória vai ao prompt (K13). | Sem desvio: os três escolheram "sem cadastro". |
| A-3 | Os avisos da aba Combinação ("Navegação nos dois lugares", "Logo uma vez só") não entram no prompt. | Cada desenvolvedor reconstruiu a regra sozinho (logo só na sidebar nos três). |
| A-4 | A densidade aparece como "Padrão" no editor, mas sai como "compacta" no prompt e no JSON (relatório B10). | Linhas de 38–39 px nos três (dentro da faixa). |
| A-5 | As prévias do celular usam um modelo genérico ("Orla", topbar branca) não combinado com o header escolhido (relatório B4). | Os três usam topbar marinho (navBg, como o header pede), diferente da prévia aprovada do celular (observação O1). |
| A-6 | A restrição "sem etapa de build" não tem campo e não é exportada. | Sem efeito (os três são estáticos). |
| A-7 | O detector de contradições diz "0" com K1–K7 no texto (relatório B2). | Deixou chegar ao prompt os conflitos da seção 2.3. |
| A-8 | Os destinos da sidebar (Contratos… Permissões) não têm especificação de página. | Divergência: dev-1 criou páginas completas de tabela; dev-2, telas vazias "fora do escopo"; dev-3, listas com estados vazio/erro. |

### 2.3 Conflitos e lacunas do texto (B/D) e como cada site os resolveu

K1–K18 foram pré-registrados na rubrica. K19–K25 são **(pós-abertura)**.

| K | Conflito (trechos) | dev-1 | dev-2 | dev-3 | Divergiram? |
|---|---|---|---|---|---|
| K1 | Header 64 px (l.66, 71) × 56 px (l.156) | 64 / 56 no celular | 64 / 56 | 64 / 56 | Não |
| K2 | "somente sobre a coluna principal" (l.71) × "largura total da janela" (l.156) | coluna principal | coluna principal | coluna principal | Não |
| K3 | Sidebar 252 (l.66) × 264 px (l.203) | 252 | 252 | 252 | Não |
| K4 | 1024–1279: 220 (l.94) × 264 (l.231) | 220 | 220 | 220 | Não |
| K5 | Tablet a partir de 600 (l.144) × 768 (l.96) | 768 | 768 | 768 | Não |
| K6 | Painel do header (l.185–186) × drawer; ☰ (l.184) × trilho (l.95) | drawer; botão do trilho | drawer; ☰ no header abre a sidebar | drawer; botão do trilho + menu "Seções" no header | Parcial (tablet) |
| K7 | "ofereça bottom navigation" (l.237) × `inferior: none` (l.117) | sem | sem | sem | Não |
| K8 | Global 15 px/8 px/confortável × Compact Pro 13 px/4–6 px/compacta | login global, app compacto | idem | idem | Não |
| K9 | bgAlt (l.204) × "navBg, navText…" (l.242) | bgAlt | bgAlt | **navBg** | **Sim** |
| K10 | Logo no topo da sidebar (l.68) × seletor de unidade (l.208) × logo no header (l.158) | botão único logo + unidade | botão único | logo e seletor em linhas separadas | Parcial |
| K11 | Ações do header do layout (l.71) × do Painel Analítico (l.160) | união | união | união sem período/Exportar | Parcial |
| K12 | Exemplos não financeiros (l.159, 205, 376, 452) × objetivo financeiro (l.10) | rótulos mantidos | mantidos | mantidos | Não |
| K13 | "Cadastro: nenhum" (l.18) × pendência (l.635) | sem cadastro | sem cadastro | sem cadastro | Não |
| K14 | "rolagem local ou cartões" (l.424) × "viram cartões" (l.425) | cartões | cartões | cartões | Não |
| K15 | Série 2 em accent #0ea5e9 (l.262) × "Destaque #0c91cd" (l.405) | #0c91cd | #0c91cd | #0c91cd | Não |
| K16 | Backend seguro real (l.55, 57) × HTML/CSS/JS (l.13) — **D** | demonstração | demonstração | demonstração | Não |
| K17 | Itens 40–44 (l.69) × 36 px (l.206); indicadores l.69 × l.225 × l.370 | 40 px; grupo 12 px | 40 px; grupo 12 px | 40 px; grupo 11 px; barra accent | Parcial |
| K18 | "KPIs 4 → 2 → 1" (l.572) × 3 KPIs (l.527) | 3 → 2+1 → 1 | idem | idem | Não |
| K19 | Período no header (l.160), no cabeçalho da página (l.515) e no gráfico (l.440) | header + intervalo no cabeçalho da página | só header (desktop) | **só cabeçalho da página** | **Sim** |
| K20 | "unidade da empresa" (l.214) × "Criar espaço" (l.226) | "Criar unidade" | "Criar espaço" | "Criar unidade" | Sim (menor) |
| K21 | Paisagem "drawer ≈320 px" (l.135) × "≥ 768 px vale o desktop" (l.136) | trilho a 844×390 | trilho | trilho | Não |
| K22 | Estilo do "Entrar" não descrito (l.43); prévia em contorno | contorno | contorno | **primário sólido** | **Sim** |
| K23 | Cor da topbar do celular não definida; header navBg (l.157) × prévia branca | navBg | navBg | navBg | Não (todos ≠ prévia) |
| K24 | "Vendas por mês" (l.452) × "Últimos 30 dias" (l.160) | 12 meses com faixa destacando o período | 6 meses | 6 meses (2026 × 2025) | **Sim** |
| K25 | Tokens semânticos sobre o próprio fundo < 4,5:1 e focusRing sobre navBg 2,37:1 × "contraste WCAG AA" (l.629) — **D** | tokens exatos; anel branco + azul | tons derivados; anel branco | tons derivados nos badges; anel branco | **Sim** |

## 3. Notas por dimensão

Ver tabela da seção 0. Leitura por dimensão:

- **Arquitetura (8):** os três implementam "Apenas login", sem cadastro, login → painel, Sair, troca em 768 px e destinos
  iguais. A única perda é o conteúdo comercial do dev-3 (A6 = 50 %, origem A, julgamento de design).
- **Desktop (16):** dev-1 e dev-2 reproduzem a geometria aprovada (sidebar integral de 252 px em bgAlt, header marinho de
  64 px só sobre a coluna principal, abas encaixadas, seletor de unidade, perfil com cargo, trilho de 72 px, 220 px em
  1024–1279). dev-3 perde em D10 (sidebar marinho, B), D8 (header sem período/Exportar, B) e D3 (lista sem rolagem interna, C).
- **Celular (14):** os três têm a topbar de 56 px, um drawer de 280/272 px com scrim e cartões no lugar da tabela, sem overflow
  em 14 larguras. As perdas vêm dos alvos de toque (dev-1 89 %, dev-3 80 %) e do gráfico (dev-2 não reduz os rótulos;
  dev-3 tem 191 px de altura).
- **Paleta (17):** as cores-chave são idênticas aos tokens nos três sites. dev-2 e dev-3 trocam o texto semântico por tons
  derivados e usam anel de foco branco no header escuro. É conflito da especificação (D): os próprios pares de tokens não
  atingem AA. dev-3 tem a marca invisível (C).
- **Componentes (10):** login, tabela e gráfico completos nos três. dev-2 perde meio sub-item em C4 (K19).
- **Interações (22):** praticamente completas nos três (validação, "Entrando…", recuperação neutra, drawer acessível,
  trilho, menus, período, abas, ordenação, seleção, tooltip, legenda, exportar). Só o dev-2 perde no I1: quando o Tab sai do
  e-mail para o link "Esqueci minha senha", o campo não é validado.

## 4. Matrizes de fidelidade

Colunas: requisito da rubrica, o que foi escolhido no Studio, onde está no Master Prompt (`l.` = linha), o que foi
medido no site, a nota e a origem ("—" = sem desvio; "E" = conflito resolvido de forma aceitável; A/B/C/D = origem do desvio).

### 4.1 dev-1

{{MATRIZ_dev-1}}

### 4.2 dev-2

{{MATRIZ_dev-2}}

### 4.3 dev-3

{{MATRIZ_dev-3}}

## 5. Comparação entre os três sites

**O que os três acertaram (instrução clara ou conflito com pista suficiente):** fluxo "Apenas login" sem cadastro; os 8
elementos do login corporativo e todos os seus estados; sidebar integral de 252 px (220 em 1024–1279, trilho de 72 em
768–1023); header de 64 px só sobre a coluna principal, em navBg, com quatro abas encaixadas; seletor de unidade no topo
e perfil com cargo no rodapé, com menu ⋯ abrindo para cima; troca para o drawer em 768 px; drawer de 280 px (85 % a 320 px) com
foco preso, inert, Esc/scrim/X, retorno do foco e trava de rolagem; sem bottom nav; 3 KPIs em 3 → 2+1 → 1 colunas; gráfico
2/3 + atividades 1/3 com a tabela abaixo; tabela semântica completa; cartões no celular; série 2 em #0c91cd; tokens
centralizados; nenhum overflow de 320 a 1920 px. Também concordaram em pôr as quatro abas do header como subitens de "Painel"
no drawer. Nada no prompt pede isso; é uma solução convergente para K6.

**O que foi interpretado de forma diferente (indício de ambiguidade do prompt):**

| Decisão | dev-1 | dev-2 | dev-3 | Causa no prompt |
|---|---|---|---|---|
| Fundo da sidebar | bgAlt (claro) | bgAlt | navBg (marinho) | K9, l.204 × l.242 |
| Onde fica o seletor de período / Exportar | header (+ intervalo na página) | header | cabeçalho da página | K19, l.160 × l.515 × l.440 |
| Janela do gráfico "Vendas por mês" | 12 meses + faixa do período | 6 meses | 6 meses, séries 2026 × 2025 | K24, l.452 × l.160; "Séries: 2" sem nomes |
| Estilo do botão "Entrar" | contorno | contorno | primário sólido | K22 (lacuna) |
| Cores semânticas de texto | tokens exatos | derivadas (+escuras) | derivadas nos badges; deltas sem cor | K25 (D) |
| Anel de foco no header escuro | branco + azul | branco | marinho + branco | K25 (D) |
| Título de grupo da sidebar | 12 px | 12 px | 11 px | l.207 × l.309 ("nunca < 12 px") |
| Logo/unidade no topo da sidebar | botão único | botão único | duas linhas | K10 |
| Menu de navegação no tablet | botão do trilho | ☰ no header | botão do trilho + "Seções" | K6 |
| Páginas sem especificação | tabelas completas | estado vazio "fora do escopo" | listas e estados | A-8 |
| "Criar espaço" × "Criar unidade" | unidade | espaço | unidade | K20 |
| KPIs | Receita líquida, Despesas, Resultado | Receita líquida, Despesas, Saldo em caixa | Receita líquida, Clientes ativos, Ticket médio | A-1 |

## 6. Falhas por tipo (A–E)

### 6.1 Tipo A (Studio) — 1 desvio medido + 8 falhas de cadeia (seção 2.2)

| Site | Req. | Trecho do prompt | Falha |
|---|---|---|---|
| dev-3 | A6 | "Objetivo: Plataforma financeira…" (l.10) e "Quantidade de KPIs: 3" (l.527), sem nomes | Sem campo para registrar o conteúdo financeiro, o desenvolvedor escolheu KPIs comerciais. |

### 6.2 Tipo B (Master Prompt) — 3 desvios medidos

| Site | Req. | Trecho do prompt | Redação corrigida sugerida |
|---|---|---|---|
| dev-3 | D10 (K9) | "Superfície: fundo levemente diferente da página (bgAlt), sem sombra." (l.204) × "Cores dos tokens da identidade global (navBg, navText, navActive, navActiveText, primary, border); nada de cores fixas." (l.242) | "Superfície da sidebar: **bgAlt** (#eff1f3). Textos em `text`/`textMuted`; item ativo com fundo `selected`, texto `selectedText` e barra de 3 px em `primary`. Os tokens `navBg/navText/navActive` são do **header**, não desta sidebar." |
| dev-3 | D8 (K19) | "Ações: seletor de período 'Últimos 30 dias ▾'; botão 'Exportar'; avatar…" (l.160) × "Cabeçalho da página (título, período, ações)" (l.515) × "Cabeçalho (título + filtro de período)" (l.440) | "Há **um único** seletor de período, no header (composição A, à direita, junto com 'Exportar' e o avatar). O cabeçalho da página mostra só o título e o intervalo aplicado, e o gráfico mostra só o período vigente. Abaixo de 768 px, o seletor e 'Exportar' vão para o cabeçalho da página." |
| dev-2 | C4 (K19) | idem | idem |

Os conflitos K1–K7, K10, K11, K14, K17, K18 e K20–K24 não reduziram a nota de nenhum site, mas exigiram interpretação
(registrada nos NOTES). Redação corrigida sugerida para cada um:

| K | Redação corrigida sugerida |
|---|---|
| K1/K2 | "Header de **64 px** no desktop/tablet e 56 px no celular, **só sobre a coluna principal** (a sidebar integral vai do topo à base). Ignore 'largura total da janela' do modelo de header: ela vale só para layouts sem sidebar integral." |
| K3/K4 | "Sidebar: 252 px (≥ 1280), 220 px (1024–1279), trilho de 72 px (768–1023). Os 264 px do modelo 'Sóbria Corporativa' não se aplicam." |
| K5/K21 | "Abaixo de 768 px vale o drawer (inclusive de 600 a 767 px e com o celular na horizontal); a partir de 768 px vale a estrutura desktop compactada." |
| K6 | "No celular a navegação é só o drawer pela esquerda; o painel que 'desliza abaixo do header' não se aplica. As 4 abas do header entram no drawer como subitens de 'Painel'. No tablet, um único botão ☰ no topo do trilho abre a sidebar completa em sobreposição." |
| K7 | Remover "Se o app for usado principalmente no celular, ofereça também uma bottom navigation" quando o layout mobile tiver `inferior: none`. |
| K8/K17 | "Login e shell usam a escala global (15 px, raios 8/12 px). Componentes Compact Pro (tabela, gráfico, KPIs) usam 13 px, controles de 30 px e raios 4/6 px. Itens da sidebar: 40 px, ícone de 20 px, título de grupo de 12 px." |
| K10/K11 | "Logo uma vez só: no topo da sidebar, dentro do seletor de unidade (símbolo + nome + unidade + ▾). O header não repete o logo; à direita ficam período, Exportar, busca, notificações e avatar." |
| K12 | Rotular os exemplos: "Itens de exemplo — substitua por destinos do domínio do projeto (Plataforma financeira)", como já é feito com a marca "Seriema". |
| K13 | "Cadastro: **não haverá** (confirmado). Não crie link nem rota de cadastro." (e remover a pendência) |
| K14 | "No celular (< 768 px), cada linha da tabela vira cartão rótulo: valor." (uma opção só) |
| K15 | "Série 2: #0c91cd (derivado de accent para contraste ≥ 3:1)." |
| K18 | "KPIs: 3 → 2 (o terceiro ocupa a linha) → 1 coluna." |
| K20 | Usar um termo só: "Seletor de **unidade** … 'Criar unidade'". |
| K22 | "'Entrar com SSO da empresa' é o botão primário sólido; 'Entrar' (e-mail/senha) é secundário, em contorno." |
| K23 | "Topbar do celular: fundo `navBg`, ícones e texto em `navActiveText`" (ou o que a prévia aprovada mostrar, gerada já com o header escolhido). |
| K24 | "O gráfico mostra os 12 últimos meses e destaca os meses do período selecionado" (ou outra regra explícita). |

### 6.3 Tipo C (desenvolvedor) — 8 desvios

| Site | Req. | Trecho claro do prompt | Desvio |
|---|---|---|---|
| dev-1 | M10 | "Alvos de toque com no mínimo 44 × 44 px no celular" (l.595) | Link da marca na topbar e no login com 28 px de altura; checkboxes da lista em cartões com 28 px de largura (89 % dos alvos). |
| dev-2 | M8 | "No celular: menos rótulos no eixo X (a cada 2–3)" (l.499) | Mantém os 6 rótulos do desktop. |
| dev-2 | I1 | "Validação ao enviar e ao sair do campo" (l.40) | O blur do e-mail é ignorado quando o foco vai para o link "Esqueci minha senha" (o próximo no Tab). |
| dev-3 | D3 | "a sidebar … tem rolagem interna própria (overflow-y: auto …)" (l.88); "a lista rola internamente … mantendo topo e rodapé visíveis" (l.228) | Sem rolagem interna; com menos de ~720 px de altura, os itens passam por baixo do rodapé com texto sobreposto. |
| dev-3 | M4 | "itens de 48 px" (l.112); "itens com no mínimo 44 px de altura" (l.234) | Cabeçalhos de grupo com 41 px, "Configurações" com 40 px e duplicado no drawer (elemento `only-desktop` visível). |
| dev-3 | M8 | "altura mínima de 200 px" (l.499) | Gráfico com 191 px a 390 px de largura. |
| dev-3 | M10 | l.174, 595, 615 | Avatar 32×32, checkboxes 20×20, ⋯ 36×36 e grupos do drawer com 41 px (80 % dos alvos). |
| dev-3 | P17 | "contraste WCAG AA" (l.629) | Nome "Nexo Capital" em #0f172a sobre navBg (1,13:1) no topo da sidebar: invisível. Consequência da troca de fundo (K9) sem ajustar o texto. |

### 6.4 Tipo D (conflito/limitação da especificação) — 4 desvios

| Site | Req. | Conflito | O que o site fez |
|---|---|---|---|
| dev-2 | P7 | Os pares de tokens error/errorBg (≈ 4,0:1), warning/warningBg (4,41:1) e info/infoBg ficam abaixo de AA, que o prompt também exige (l.629). | Derivou tons mais escuros para todo o texto semântico, inclusive onde o token passaria (delta sobre branco). |
| dev-3 | P7 | idem | Derivou o texto dos badges; deltas dos KPIs sem cor semântica. |
| dev-2 | P16 | focusRing #1d4ed8 sobre navBg = 2,37:1 (< 3:1, WCAG 1.4.11). | Anel branco no header. |
| dev-3 | P16 | idem | Anel marinho + branco no header e na sidebar. |

Também é D, sem perda de nota: K16 (autenticação real exigida num site estático). Os três fizeram demonstração e documentaram.

### 6.5 Tipo E (diferenças aceitáveis) — 77 ocorrências

São resoluções defensáveis de conflitos do prompt (K1–K18), sempre documentadas no NOTES de cada site. Exemplos: 64 × 56 px,
252 × 264 px, 220 px, corte em 768, cartões no celular, #0c91cd, 3 → 2+1 → 1 KPIs, logo só na sidebar, união das ações do
header, sem cadastro, Inter via CDN (dev-1, dev-3), estados demonstrados em outras páginas (dev-3). A lista por site está nas
matrizes (origem "E").

## 7. Observações fora da rubrica (não pontuadas)

- **O1 — Topbar do celular (A-5/K23):** a prévia aprovada do celular tem topbar branca; os três sites usam navBg, coerentes
  com o header do prompt. A diferença vem da prévia genérica do Studio, não dos desenvolvedores.
- **O2 — Logo no header:** a prévia integrada do computador mostra o logo ("Seriema") no header. Os três o deixaram só na
  sidebar (K10, aviso "Logo uma vez só" do Studio). E.
- **O3 — dev-3:** o cargo "Gerente de Controladoria" aparece cortado com reticências no rodapé da sidebar em todas as larguras
  de desktop. A borda inferior do header usa #313e66 em vez do token `border`.
- **O4 — dev-1:** o toast "Bem-vinda, Ana." cobre por ~3 s o rodapé do drawer e o canto da tela logo após o login.
- **O5 — Extras não pedidos (E):** busca com atalho "/" e botão "Atualizar [R]" (dev-1), notificações (todos), credenciais da
  demonstração visíveis no cartão (dev-1) ou em `<details>` (dev-2), menu "Seções" no tablet (dev-3). Nenhum contradiz o prompt.

## 8. Capturas e composições

- `capturas/dev-N/`: login e painel em 1440/768/390 (+ página inteira), drawer em 390 e 320, paisagem 844×390, menus, tooltip,
  trilho a 820 (tooltip e expandido), estados carregando/vazio/erro, erros do login, recuperação, aba "Receita", período
  carregando, sidebar em janela baixa e varredura (`varredura-*` em 14 larguras).
- `composicoes/dev-N-a…e`: prévia do Studio × site na mesma altura. (a) aplicação no computador; (b) celular com drawer
  fechado e aberto; (c1/c2) login no computador e no celular; (d) tablet; (e) estados de erro do login.
  `composicoes/tres-sites-*`: os três sites lado a lado (painel 1440/768/390, drawer, login). Nomes fictícios das prévias
  ("Seriema", "Orla") são o bug B4 do Studio e não contam contra os sites.
