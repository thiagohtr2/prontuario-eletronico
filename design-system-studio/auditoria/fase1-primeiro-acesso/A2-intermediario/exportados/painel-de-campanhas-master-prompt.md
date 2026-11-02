# Master Prompt — Painel de Campanhas

> Especificação gerada pelo Atelier UI (Design System Studio) em 02/11/2026, 18:25:17.
> Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração.

## A. Informações do projeto

- Nome: Painel de Campanhas
- Tipo de aplicação: Dashboard
- Objetivo: acompanhar o desempenho das campanhas de marketing por canal
- Descrição: Dashboard com investimento, cliques, conversões e ROI por canal (Google Ads, Meta Ads, LinkedIn, e-mail). Cards no topo, gráfico de linha da evolução, gráfico de barras por canal e tabela de campanhas.
- Público-alvo: time de marketing e gestores
- Finalidade principal: ver rápido qual canal dá mais retorno
- Funcionalidades previstas: Indicadores (KPIs); Gráficos; Tabelas com filtros; Filtro por período; Exportar relatórios; ROI por canal; Filtro por canal
- Tecnologia desejada: React + TypeScript

## B. Arquitetura geral

- Fluxo de entrada: **Apenas login** — O endereço abre direto na tela de entrar. Sem página de apresentação.
- Landing: nenhuma · Login: Clássico central · Cadastro: Cadastro por convite para equipe
- Layout desktop: Sidebar integral clássica · Layout mobile: Bottom Navigation com cinco destinos

### Login: Clássico central — Cartão central com a marca acima

`id: classico-central` · origem: módulo “login”

Login centralizado: logotipo acima de um cartão de ≈400 px com e-mail, senha, “Lembrar de mim”, recuperação e botão em largura total.

**Estrutura**
- Fundo em bgAlt de tela cheia; logotipo e nome da marca centralizados acima do cartão.
- Cartão central com título, subtítulo, e-mail, senha, linha “Lembrar de mim” + “Esqueci minha senha” e botão “Entrar” em largura total.
- Abaixo do cartão: “Não tem conta? Criar conta”.
- Rodapé discreto com links de Termos e Privacidade.
- Textos da demonstração: título “Entrar na sua conta”, subtítulo “Use seu e-mail e senha para continuar.”.

**Medidas recomendadas (adaptáveis)**
- larguraFormulario: ≈360–400 px
- alturaInputs: ≈44 px (desktop) / 48 px (celular)
- larguraCartao: ≈400 px
- paddingCartao: ≈32 px (desktop) / 20 px (celular)

**Comportamento e estados**
- Labels visíveis associados aos campos (label for/id). E-mail com type="email", inputMode="email" e autoComplete="username" (ou "email"); senha com autoComplete="current-password".
- Botão de mostrar/ocultar senha dentro do campo, com aria-label alternando “Mostrar senha”/“Ocultar senha” e aria-pressed.
- Validação ao enviar e ao sair do campo: mensagem abaixo do campo (aria-invalid + aria-describedby) e resumo no topo do formulário com role="alert".
- Erro de credenciais genérico (“E-mail ou senha incorretos”), sem revelar qual dos dois está errado.
- Link “Esqueci minha senha” perto do campo de senha, levando ao fluxo de recuperação por e-mail com mensagem neutra (“Se o e-mail existir, enviaremos um link”).
- Botão principal com estado de carregamento (“Entrando…”) e desabilitado durante o envio para evitar duplo clique.

**Responsividade deste item**
- No celular o cartão perde borda e sombra e ocupa a largura total com 20 px de margem; a marca fica no topo.
- Inputs com font-size ≥ 16 px e altura ≥ 48 px no celular (evita o zoom automático do iOS e facilita o toque).
- Com o teclado virtual aberto, o campo focado e o botão “Entrar” continuam visíveis (use 100dvh, sem height: 100vh fixo, e scroll-padding).
- Funciona a partir de 320 px de largura sem rolagem horizontal.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).
- Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.

**Observações**
- Esta tela é uma demonstração de interface. A autenticação real deve ser implementada pela IA com backend seguro: senhas com hash (Argon2id ou bcrypt), limitação de tentativas, sessão em cookie httpOnly + Secure + SameSite, proteção CSRF e HTTPS obrigatório.
- Cores, fontes, cantos e superfícies vêm da identidade global do projeto (tokens).
- A tela é uma demonstração de interface. Implemente a autenticação real com backend seguro (hash de senha, rate limit, tokens httpOnly, proteção CSRF).

### Cadastro: Cadastro por convite para equipe — convite

`id: convite` · origem: módulo “cadastro”

Cadastro por convite: faixa com quem convidou e a equipe, e-mail já preenchido e bloqueado, nome e senha.

**Estrutura**
- Faixa de convite no topo do formulário: avatar de quem convidou, texto “Ana Ribeiro convidou você para a equipe Projeto Aurora” e iniciais da equipe.
- E-mail preenchido pelo convite, somente leitura, com ícone de cadeado e texto de ajuda.
- Botão principal “Aceitar convite” e link “Não é você? Recusar convite”.
- Campos, na ordem: E-mail (preenchido pelo convite), Nome, Senha.

**Propriedades**
- campos: E-mail (preenchido pelo convite), Nome, Senha

**Medidas recomendadas (adaptáveis)**
- alturaInputs: ≈44 px (desktop) / 48 px (celular)
- espacoEntreCampos: ≈16 px

**Comportamento e estados**
- O convite expira (ex.: 7 dias); convite expirado mostra estado de erro com opção “Pedir novo convite”.
- Erros por campo com mensagem clara; senha com mostrar/ocultar e requisitos.
- Se a pessoa já tem conta, mostra “Entrar para aceitar” e o link “Esqueci minha senha”.
- O campo somente leitura usa readOnly (não disabled) para continuar legível e enviável; autocomplete username, name e new-password.
- Estados de erro por campo, com mensagem clara abaixo do campo e resumo no topo em caso de envio inválido.
- Validação ao sair do campo e no envio; nunca apague o que a pessoa digitou.
- Botão para mostrar/ocultar senha e indicação dos requisitos de senha.
- Link de recuperação de senha visível na tela de login.
- Labels acessíveis (label for/id), autocomplete adequado (name, email, new-password, current-password, one-time-code).

**Responsividade deste item**
- No celular a faixa de convite empilha avatar e texto; o nome da equipe pode quebrar em duas linhas.
- Com o teclado aberto, o botão “Aceitar convite” continua visível abaixo do campo de senha.
- Uma coluna a partir de 320 px.
- Layout adaptado ao teclado virtual: o campo focado e o botão de envio permanecem visíveis.
- Funciona em telas a partir de 320 px, com uma coluna no celular.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).

**Observações**
- O token do convite deve ser de uso único, com expiração, vinculado ao e-mail convidado e validado no servidor.
- Demonstração de interface: a criação de conta real deve ser feita pela IA com backend seguro — hash de senha (Argon2id/bcrypt), verificação de e-mail, limitação de tentativas, proteção contra bots (sem expor se um e-mail já existe), sessão em cookie httpOnly/Secure/SameSite e HTTPS.

### Layout desktop: Sidebar integral clássica — Sidebar integral

`id: sidebar-integral-classica` · origem: módulo “desktop”

Shell de aplicação com sidebar integral à esquerda (do topo à base) e coluna principal com header fixo e conteúdo rolável.

**Estrutura**
- Grid de duas colunas: grid-template-columns: 252px minmax(0, 1fr); a coluna principal tem grid-template-rows: 64px minmax(0, 1fr) (header + conteúdo).
- Sidebar integral de ≈252 px na borda esquerda: vai do topo à base da janela (height: 100dvh), encostada na borda, sem margem externa, sem cantos arredondados e sem sombra flutuante.
- Topo da sidebar com a mesma altura do header (≈64 px), contendo logo e nome do produto, alinhado ao header para formar uma linha horizontal contínua.
- Itens de navegação com 40–44 px de altura, ícone de 20 px + rótulo, agrupados por seções com título discreto; o item ativo tem fundo de seleção, cor de texto ativa e indicador lateral.
- Rodapé da sidebar com perfil do usuário e atalho de configurações, separado por borda fina.
- Header de ≈64 px: título da página ou breadcrumb à esquerda; busca, notificações e avatar à direita; borda inferior fina de 1 px. O header fica somente sobre a coluna principal — não passa por cima da sidebar.
- Área de conteúdo com padding de 24–32 px, largura fluida e grids internos com minmax(0, 1fr); nenhum cartão encolhe abaixo de ≈280 px — reduza colunas antes.

**Propriedades**
- gridColumns: 252px 1fr
- gridRows: 64px 1fr
- gridAreas: "sidebar header" "sidebar content"
- gap: 0px
- padding: 0px
- regioes: sidebar (sidebar), header (header), content (content)
- oneScreen: não

**Medidas recomendadas (adaptáveis)**
- sidebar: ≈252 px
- header: ≈64 px

**Comportamento e estados**
- A sidebar é fixa (position: sticky; top: 0; height: 100dvh) e tem rolagem interna própria (overflow-y: auto; overscroll-behavior: contain) quando os itens não cabem; a página rola apenas na coluna de conteúdo.
- O header é sticky (position: sticky; top: 0) acima do conteúdo e não rola com ele; z-index superior ao conteúdo e inferior a modais.
- Grupos de navegação podem recolher (accordion) e lembram o estado; hover, focus-visible e item ativo são visualmente distintos.

**Responsividade deste item**
- 1280 px ou mais: sidebar esquerda com ≈252 px e rótulos completos.
- 1024–1279 px: a sidebar reduz para ≈220 px; o conteúdo reduz colunas antes de comprimir cartões ou tabelas.
- 768–1023 px: a sidebar recolhe para um rail integral de ≈72 px (só ícones, com tooltip e aria-label); um botão expande a sidebar completa em sobreposição, com scrim, Esc e clique fora para fechar.
- Abaixo de 768 px vale a arquitetura mobile escolhida separadamente no Studio: não converta a navegação desktop em drawer, rail ou bottom navigation por conta própria.

**Observações**
- Sidebar integral: nunca flutuante, sem margem externa e sem cantos arredondados.
- One Page, não One Screen: a página pode rolar verticalmente; não force o conteúdo a caber em 100dvh nem esconda seções para evitar rolagem.
- As medidas são recomendações para 1280 × 800; adapte à tela e ao conteúdo preservando a estrutura escolhida.

### Layout mobile: Bottom Navigation com cinco destinos — Navegação inferior

`id: bottom-nav-cinco` · origem: módulo “mobile”

Bottom Navigation fixa com exatamente 5 destinos (limite máximo recomendado) e topbar simples.

**Estrutura**
- Topbar de ≈56 px com título e ações (busca, carrinho). A barra superior soma env(safe-area-inset-top) à própria altura, para não colidir com o entalhe da câmera.
- Bottom Navigation com 5 itens de largura igual (20% cada), ícone de 24 px e rótulo de 12 px. Altura de ≈64 px + env(safe-area-inset-bottom); o fundo da barra se estende até a borda inferior, atrás da barra de gestos.
- Indicadores numéricos (badge) em itens como Carrinho, com aria-label que inclui a contagem.
- O conteúdo rola por baixo das barras fixas e recebe padding (topo e base) igual à altura delas, para que nada fique escondido.

**Propriedades**
- topo: topbar
- inferior: bottom-nav-5
- lateral: none
- sobreposicao: none
- stories: não
- oneScreen: não

**Medidas recomendadas (adaptáveis)**
- bottomNav: ≈64 px + safe area
- item: 20% da largura (≥ 64 px)

**Comportamento e estados**
- Item ativo identificável por cor primária, ícone preenchido e indicador (pílula ou ponto) — nunca apenas pela cor; aria-current="page".
- Badges atualizam sem deslocar ícones; o rótulo nunca é truncado com reticências em destinos principais.
- Destinos principais no terço inferior da tela, na zona de alcance do polegar.

**Responsividade deste item**
- 320–359 px: cada item fica com ≈64 px de largura; use rótulos de até 8 caracteres ou mostre o rótulo apenas no item ativo.
- Na horizontal (altura < 500 px), a barra inferior reduz para ≈48 px com rótulos ao lado dos ícones; barras fixas somadas nunca passam de 25% da altura.
- A partir de 768 px passa a valer a arquitetura desktop escolhida no Studio; não estique este layout para tablet ou computador.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Observações**
- Mais de 5 destinos: mova os excedentes para uma aba “Mais” — não adicione um sexto item.
- Alvos de toque de no mínimo 44 × 44 px (48 px recomendado) e pelo menos 8 px entre alvos vizinhos.

### Relação entre desktop e celular
- No computador, use “Sidebar integral clássica”. No celular, use “Bottom Navigation com cinco destinos”. São decisões independentes: não derive uma da outra.
- Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (sidebar recolhida em rail ou menus colapsados); caso contrário, use a estrutura mobile.
- As regiões (header, sidebar, conteúdo, painéis) mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões.

## C. Navegação

### Header: Painel Analítico — Abas e filtros em uma linha

`id: painel-analitico` · origem: módulo “navegacao”

Header de dashboard com abas encaixadas, seletor de período (menu suspenso), exportação e perfil.

**Estrutura**
- Barra principal com 56 px de altura, largura total da janela (full width), padding horizontal de 24–32 px.
- Superfície: fundo navBg com borda inferior de 1 px (token border).
- Logo: símbolo quadrado de 28 px na cor primária + nome da marca em peso 700 (marca fictícia “Seriema” na prévia — substitua pela marca real).
- Navegação principal com 4 itens (Visão geral, Aquisição, Retenção, Receita): abas: o item ativo tem o fundo da página e bordas laterais/superior, “encaixado” na área de conteúdo; espaço entre itens de 20–24 px.
- Ações: seletor de período “Últimos 30 dias ▾”; botão “Exportar”; avatar circular de 32 px com menu de perfil.
- Disposição conforme a composição escolhida (ver “composicao”): A “Abas e filtros em uma linha” = logo e navegação juntos à esquerda; busca e ações empurradas para a direita; B “Filtros em cima, abas embaixo” = duas faixas: logo, busca e ações na primeira; navegação alinhada à esquerda na segunda.

**Propriedades**
- flutuante: não
- fixo: sim
- composicao: Abas e filtros em uma linha: Logo + abas encaixadas à esquerda; seletor de período, “Exportar” e avatar à direita.

**Medidas recomendadas (adaptáveis)**
- altura (desktop): 56 px
- altura (celular): 56 px
- padding horizontal: 24–32 px (16 px no celular)
- espaço entre itens: 20–24 px
- logo: ≈ 28 px de altura
- área de toque mínima: 44 × 44 px no celular

**Comportamento e estados**
- Item ativo: abas: o item ativo tem o fundo da página e bordas laterais/superior, “encaixado” na área de conteúdo. Hover com transição de 120 ms; foco visível com anel de 2 px na cor focusRing.
- Fixo no topo: position: sticky; top: 0; z-index: 40. Após 8 px de rolagem ganha sombra suave.
- Perfil: o avatar abre um menu com nome e e-mail, “Meu perfil”, “Configurações”, “Ajuda” e “Sair”, alinhado à borda direita.

**Responsividade deste item**
- Desktop largo (≥ 1280 px): composição completa, como na prévia.
- De 1024 a 1279 px: o espaço entre itens cai para 16 px.
- De 768 a 1023 px: a navegação recolhe para o botão ☰; continuam visíveis o logo e a ação principal.
- Abaixo de 768 px: barra única de 56 px com logo, avatar, botão de menu ☰ (44 × 44 px). Vão para o painel do menu: os 4 itens de navegação.
- Painel do menu: desliza logo abaixo do header em largura total, altura máxima calc(100dvh − 56 px) com rolagem interna; trava a rolagem do corpo e fecha com ✕, Esc, toque fora ou ao escolher um item.
- Popovers (perfil, notificações, menus) são reposicionados para caber na viewport: largura máxima calc(100vw − 16 px), alinhados à borda mais próxima; nenhum overflow horizontal de 320 a 1920 px.
- Continua fixo no celular; recomendado esconder ao rolar para baixo e reaparecer ao rolar para cima para ganhar área útil.
- Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis.
- Dropdowns e popovers: reposicione automaticamente para não sair da viewport; no celular podem virar bottom sheet.

**Observações**
- Todas as cores vêm dos tokens da identidade global (navBg, navText, navActive, primary, border…); nada de cores fixas.
- Use <header> com <nav aria-label="Principal"> e lista de links; o item da página atual recebe aria-current="page".

### Sidebar: Clássica Integral — Logo, grupos e perfil

`id: classica-integral` · origem: módulo “navegacao”

Sidebar integral de 248 px com grupos titulados, ícones de linha, item ativo em pílula, colapso para trilho e perfil no rodapé.

**Estrutura**
- Formato integral: ocupa toda a altura, encostada na borda esquerda, com 248 px de largura.
- Superfície: fundo navBg com borda direita de 1 px (token border).
- Itens: “Geral”: Início, Painel, Projetos (12), Tarefas, Calendário | “Equipe”: Pessoas, Mensagens (3), Relatórios | “Conta”: Configurações, Ajuda.
- Ícones: ícones de linha de 18 px (estilo de ícone do tema) antes do rótulo; itens de 36 px de altura com padding horizontal de 12 px.
- Títulos de grupo: caixa alta de 11 px, peso 650, espaçamento 0,08em, em textMuted.
- Composição A: logo (símbolo + nome) no topo; bloco de perfil no rodapé (avatar, nome, cargo e menu ⋯ que abre para cima). Composição B: logo no topo e campo de busca logo abaixo; links secundários no rodapé (Configurações, Ajuda, Sair).

**Propriedades**
- formato: integral
- flutuante: não
- largura: ≈248 px
- composicao: Logo, grupos e perfil: Logo no topo com botão de recolher, grupos com títulos em caixa alta e o bloco de perfil fixo no rodapé.

**Medidas recomendadas (adaptáveis)**
- largura: 248 px
- altura dos itens: 36 px (44 px no celular)
- padding interno: 12 px
- ícones: 18–20 px
- raio dos itens: radiusMd do tema
- drawer no celular: min(85vw, 280 px)
- largura recolhida: 72 px

**Comportamento e estados**
- Item ativo: item ativo com fundo navActive e texto navActiveText em cantos radiusMd. Clique marca o item como ativo (aria-current="page"); hover com fundo hover; foco visível com anel focusRing de 2 px.
- Botão de recolher (aria-label “Recolher menu”/“Expandir menu”) alterna entre 248 e 72 px com transição de 180 ms em width; recolhida, os rótulos somem e aparecem como tooltip à direita no hover/foco. O estado é lembrado (localStorage).
- A busca filtra os itens enquanto a pessoa digita (sem diferenciar maiúsculas e acentos) e mostra “Nada encontrado” quando não há resultados.
- Menu do perfil abre para cima, dentro da altura da janela: Meu perfil, Preferências, Sair.
- Fixa: position: sticky; top: 0; height: 100dvh; a lista rola internamente (overflow-y: auto) quando não couber, mantendo topo e rodapé visíveis.

**Responsividade deste item**
- Desktop (≥ 1024 px): integral: ocupa toda a altura, encostada na borda esquerda, com 248 px de largura.
- De 768 a 1023 px: inicia recolhida em trilho de 72 px só com ícones; expande por cima do conteúdo (overlay com sombra) ao tocar no botão de menu.
- Abaixo de 768 px: sai do fluxo e vira um drawer à esquerda com largura min(85vw, 280 px), aberto por um botão ☰ (44 × 44 px) no header; scrim escuro atrás; fecha com ✕, Esc, toque no scrim ou ao escolher um item; trava a rolagem do corpo.
- No drawer os rótulos aparecem sempre (mesmo em modelos de trilho); itens com no mínimo 44 px de altura.
- Menus e tooltips da sidebar ficam dentro da viewport: reposicionados para cima quando faltaria espaço abaixo; nenhum overflow horizontal.
- O rodapé (perfil, medidor ou cartão) fica fixo na base do drawer; a lista rola acima dele.
- Se o app for usado principalmente no celular, ofereça também uma bottom navigation com os 4–5 destinos principais.
- Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria).
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Observações**
- Cores dos tokens da identidade global (navBg, navText, navActive, navActiveText, primary, border); nada de cores fixas.
- Use <nav aria-label="Menu lateral"> com listas; grupos com título usam aria-labelledby; o item atual recebe aria-current="page".

- Item ativo sempre destacado (cor de navegação ativa) e anunciado a leitores de tela (`aria-current="page"`).
- Dropdowns e submenus abrem por clique/toque e por teclado (Enter/Espaço), fecham com Esc e clique fora.
- Drawers, bottom sheets e menus de tela cheia prendem o foco enquanto abertos e devolvem o foco ao botão que os abriu.

## D. Identidade visual

Paleta global: **Azul Institucional**. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas.

| Grupo | Token | Nome | Valor |
| --- | --- | --- | --- |
| Marca | Cor primária | `primary` | #1d4ed8 |
| Marca | Primária — hover | `primaryHover` | #1a46c2 |
| Marca | Primária — active | `primaryActive` | #173ead |
| Marca | Texto sobre primária | `onPrimary` | #ffffff |
| Marca | Primária suave | `primarySoft` | #e4eafa |
| Marca | Cor secundária | `secondary` | #1e3a8a |
| Marca | Texto sobre secundária | `onSecondary` | #ffffff |
| Marca | Cor de destaque | `accent` | #0ea5e9 |
| Marca | Texto sobre destaque | `onAccent` | #111114 |
| Fundos e superfícies | Fundo principal | `bg` | #f8fafc |
| Fundos e superfícies | Fundo secundário | `bgAlt` | #eff1f3 |
| Fundos e superfícies | Superfície | `surface` | #ffffff |
| Fundos e superfícies | Superfície alternativa | `surfaceAlt` | #f5f5f5 |
| Texto | Texto principal | `text` | #0f172a |
| Texto | Texto secundário | `textMuted` | #686d7a |
| Texto | Texto desabilitado | `textDisabled` | #9fa4ac |
| Texto | Placeholder | `placeholder` | #848993 |
| Bordas e foco | Borda | `border` | #e6e6e6 |
| Bordas e foco | Borda forte | `borderStrong` | #c7c7c7 |
| Bordas e foco | Borda de foco (focus-visible) | `focusRing` | #1d4ed8 |
| Estados | Hover | `hover` | #f4f4f4 |
| Estados | Active | `active` | #ebebeb |
| Estados | Pressed | `pressed` | #e0e0e0 |
| Estados | Selected — fundo | `selected` | #e4eafa |
| Estados | Selected — texto | `selectedText` | #1d4ed8 |
| Estados | Disabled — fundo | `disabled` | #f0f0f0 |
| Estados | Disabled — texto | `disabledText` | #93979f |
| Semânticos | Success | `success` | #117e39 |
| Semânticos | Success — fundo | `successBg` | #e3f4e9 |
| Semânticos | Warning | `warning` | #a85c04 |
| Semânticos | Warning — fundo | `warningBg` | #faefe1 |
| Semânticos | Error | `error` | #dc2626 |
| Semânticos | Error — fundo | `errorBg` | #fbe5e5 |
| Semânticos | Info | `info` | #2563eb |
| Semânticos | Info — fundo | `infoBg` | #e5ecfd |
| Links, ícones e navegação | Link | `link` | #1d4ed8 |
| Links, ícones e navegação | Link — hover | `linkHover` | #1942b8 |
| Links, ícones e navegação | Ícones | `icon` | #49505f |
| Links, ícones e navegação | Navegação — fundo | `navBg` | #0f1f4d |
| Links, ícones e navegação | Navegação — texto | `navText` | #caced8 |
| Links, ícones e navegação | Navegação — item ativo | `navActive` | #313e66 |
| Links, ícones e navegação | Navegação — texto ativo | `navActiveText` | #ffffff |
| Gradiente | Gradiente — início | `gradientFrom` | #1d4ed8 |
| Gradiente | Gradiente — fim | `gradientTo` | #26aeeb |

### Tipografia: Inter + Inter

`id: identity.typography` · origem: módulo “cores”

Títulos em Inter (peso 650) e textos em Inter (peso 400), tamanho base 15 px.

**Estrutura**
- Escala sugerida: 13 / 15 / 18 / 23 / 30 / 39 px.
- Altura de linha de 1.5 para textos e 1.2–1.3 para títulos.
- Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px.

**Propriedades**
- fonteTitulos: Inter
- fonteTexto: Inter
- tamanhoBase: 15
- pesoTitulos: 650
- pesoTexto: 400

**Responsividade deste item**
- Títulos grandes reduzem proporcionalmente no celular (use clamp()).
- Inputs com 16 px no celular para evitar zoom automático.

### Geometria e superfícies: Médios (8 px) · Contornada (bordas finas)

`id: identity.geometry` · origem: módulo “cores”

Cantos médios (8 px), bordas de 1 px, sombra sem sombra, superfícies contornada (bordas finas), densidade confortável.

**Estrutura**
- Escala de espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 20, 24, 32, 40.
- Sem sombras em superfícies de conteúdo. Apenas elementos realmente flutuantes (modais, popovers, menus) podem ter elevação.
- Ícones no estilo contorno (outline), tamanho consistente (16–20 px em interfaces).

**Propriedades**
- raioPequeno: 6px
- raioMedio: 8px
- raioGrande: 12px
- borda: 1px
- sombra: none
- superficie: outlined
- densidade: comfortable
- unidadeDeEspaco: 8px
- ícones: outline

**Responsividade deste item**
- A geometria se mantém em todas as larguras; no celular aumente apenas as áreas de toque.

### Estados visuais
- hover: fundo `hover` ou primária `primaryHover`; active/pressed: `active`/`pressed`/`primaryActive`.
- focus-visible: anel de 2–3 px na cor `focusRing`, sempre visível ao navegar por teclado.
- selected: fundo `selected` com texto `selectedText`; disabled: fundo `disabled`, texto `disabledText`, sem hover.
- Mensagens: success/warning/error/info com os fundos semânticos correspondentes.

## E. Componentes

1 componente(s) aprovados. Cada instância tem configuração própria; alterar uma não altera as outras.

### Componente: Gráfico de ROI por canal — Compact Pro

`id: graficos` · origem: módulo “componentes”

Gráficos na família visual Compact Pro. Gráfico com título, eixos, grade discreta, séries nas cores da paleta e legenda. Estilo: Alta densidade: controles de 30 px, texto base de 13 px, raio de 4 px, bordas de 1 px sutis, sem sombras e números tabulares.

**Estrutura**
- Cabeçalho (título + filtro de período) → área do gráfico → legenda.
- Série 1 na primária, série 2 no destaque; grade em borda a 50%.
- Tabela alternativa ou aria-label descritivo para acessibilidade.
- Altura de controles 30 px (44 px de área de toque no celular); padding reduzido em 25%.
- Texto base 13 px, rótulos 12 px; números com font-variant-numeric: tabular-nums.
- Raio de 4 px em controles e 6 px em contêineres; bordas de 1 px sutis.
- Item ativo marcado por sublinhado de 2 px; ícones de 14–16 px sem fundo.
- Composição: Informação densa em linhas e colunas alinhadas; barras de ferramentas compactas.
- Acabamento: Neutro e funcional; cor apenas para estado e ação.

**Propriedades**
- Família visual: 13. Compact Pro
- Título: ROI por canal
- Tipo: Barras
- Séries: 2
- Legenda: sim
- Linhas de grade: sim
- Rótulos de valores: não
- Raio dos controles: 4 px
- Raio dos contêineres: 6 px
- Borda: 1 px sólida (border)
- Sombra: sem sombra em superfícies de conteúdo
- Superfície: superfície = token surface
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Inter 640
- Fonte de texto: Inter
- Caixa de rótulos e botões: normal (sentence case)
- Tamanho base: 13 px
- Altura de controles: 30 px (mínimo 44 px de área de toque no celular)
- Densidade: compacta
- Ícones: lucide, traço 1.75 px, tratamento plain
- Indicador de ativo: underline

**Cores**
- Ação principal (fundo): #1d4ed8
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #0f172a
- Texto secundário: #686d7a
- Borda: #e6e6e6
- Destaque: #0c91cd
- Foco: #1d4ed8

**Medidas recomendadas (adaptáveis)**
- alturaDeControle: 30 px
- raio: 4 px / 6 px
- paddingInterno: 11 px

**Comportamento e estados**
- Tooltip no hover/toque com valores; legenda clicável liga/desliga séries.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover com fundo de hover; atalhos de teclado visíveis.
- Foco com anel de 2 px.
- Movimento: Rápido (100 ms).

**Responsividade deste item**
- No celular: menos rótulos no eixo X (a cada 2–3), legenda abaixo do gráfico, altura mínima de 200 px, valores nunca cortados.
- No celular, aumente as áreas de toque para 44 px sem aumentar a fonte além de 16 px nos campos; tabelas viram cartões.
- Gráficos: adapte eixos, quantidade de rótulos, legendas (abaixo do gráfico no celular) e dimensões; nunca corte valores.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Nome dado pelo usuário: “Gráfico de ROI por canal”.
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

## F. Responsividade

Valide pelo menos nas larguras: 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px, além de larguras intermediárias.

Breakpoints de referência:
- xs: Celulares pequenos (320–359 px)
- sm: Celulares (360–599 px)
- md: Tablets e celulares na horizontal (600–1023 px)
- lg: Notebooks (1024–1439 px)
- xl: Monitores grandes (1440 px ou mais)

**Regras gerais**
- Nenhum overflow horizontal involuntário em nenhuma largura de 320 px a 1920 px (inclusive larguras intermediárias).
- Nenhum texto cortado: use quebra de linha, `min-width: 0` em itens flex/grid e `overflow-wrap: anywhere` em conteúdos longos (e-mails, URLs, códigos).
- Nenhuma sobreposição indevida entre elementos, inclusive com o teclado virtual aberto.
- Alvos de toque com no mínimo 44 × 44 px no celular e espaçamento de pelo menos 8 px entre alvos adjacentes.
- Campos de formulário com fonte de pelo menos 16 px no celular (evita zoom automático no iOS).
- Imagens e mídias responsivas (`max-width: 100%`, `aspect-ratio` definido) sem distorção.
- Grids adaptáveis: reduza colunas progressivamente; nunca comprima cartões abaixo de uma largura legível.
- Suporte a zoom de até 200% e a fonte ampliada do sistema sem perda de conteúdo ou funcionalidade.
- Respeite as safe areas (`env(safe-area-inset-*)`) em barras fixas, docks e menus inferiores.
- Funcione na orientação horizontal do celular: barras fixas não podem ocupar mais de 25% da altura.
- Use `100dvh` (com fallback) em vez de `100vh` para alturas de tela cheia.
- Menus acessíveis por mouse, toque e teclado (Tab, Enter, Espaço, Esc), com foco visível.
- Respeite `prefers-reduced-motion` reduzindo animações.

**Regras por componente**
- Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis.
- Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria).
- Dropdowns e popovers: reposicione automaticamente para não sair da viewport; no celular podem virar bottom sheet.
- Tabelas: rolagem horizontal local dentro do próprio contêiner ou representação alternativa em cartões no celular; cabeçalho legível.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).
- Calendários: no celular, ofereça modo de lista/agenda quando a grade mensal ficar apertada.
- Modais: altura máxima de 90dvh com rolagem interna; botões de ação sempre acessíveis; no celular podem ocupar a tela ou virar bottom sheet.
- Gráficos: adapte eixos, quantidade de rótulos, legendas (abaixo do gráfico no celular) e dimensões; nunca corte valores.
- Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.
- Cards: altura definida pelo conteúdo (sem alturas fixas que cortem texto); grade reduz colunas progressivamente.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

## G. Regras de implementação

- Não modifique escolhas aprovadas nesta especificação sem solicitação explícita do usuário.
- Preserve a identidade global: todos os componentes usam os tokens definidos; exceções só onde estiverem listadas.
- Não adicione decoração por conta própria (sombras, gradientes, vidro, animações, cantos arredondados) além do especificado.
- Respeite a geometria escolhida: se a sidebar é integral, ela vai do topo à base; se é flutuante, tem afastamento das bordas. Não converta uma na outra.
- Evite overflow e colisões; valide em todas as larguras de referência.
- Mantenha consistência de espaçamentos (escala de 4 px), tipografia e estados de interação (hover, focus-visible, active, disabled, selected).
- Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários.
- Use componentes reutilizáveis e tokens centralizados (variáveis CSS ou tema); nada de cores fixas espalhadas pelo código.
- Garanta acessibilidade: HTML semântico, labels, contraste WCAG AA, navegação por teclado e leitores de tela.
- Teste o resultado (visual e funcional) em celular, tablet e desktop antes de concluir.
