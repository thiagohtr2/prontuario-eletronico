# Master Prompt — Projeto sem nome

> Especificação gerada pelo Atelier UI (Design System Studio) em 02/11/2026, 18:22:09.
> Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração.

## A. Informações do projeto

- Nome: Projeto sem nome
- Tipo de aplicação: Aplicativo ou SaaS

## B. Arquitetura geral

- Fluxo de entrada: **Landing page com chamada para login** — Página pública de apresentação e um botão “Entrar” que leva ao login do sistema.
- Landing: Aurora Flow · Login: Clássico central · Cadastro: Cadastro na mesma tela do login
- Layout desktop: Sidebar integral clássica · Layout mobile: Bottom Navigation clássica

### Landing page: Aurora Flow — SaaS e produtividade

`id: aurora-flow` · origem: módulo “landing”

Landing de SaaS com hero centralizado, mockup do aplicativo sob os CTAs, faixa de logos de clientes e recursos em 3 colunas.

**Estrutura**
- Ordem das seções: Header → Hero centralizado com mockup do aplicativo → Faixa de logos de clientes → Recursos em 3 colunas → Depoimento → Chamada final em faixa colorida → Rodapé em colunas.
- Header: logotipo “Aurora Flow”, navegação com “Produto”, “Soluções”, “Preços”, “Recursos”, ação “Entrar” (leva ao login) e CTA “Começar grátis”.
- Mockup do aplicativo (quadro kanban com barra lateral) centralizado sob os CTAs, com largura ≈960 px e moldura de janela.
- Microtexto sob os CTAs: “14 dias de teste grátis · sem cartão de crédito”.
- Faixa de 6 logos de clientes em tons neutros, centralizada, com legenda “Equipes que já trabalham no fluxo”.
- Header horizontal no topo: logotipo à esquerda, navegação centralizada e ações à direita.
- Hero com todo o conteúdo centralizado em uma coluna: selo (eyebrow), título em 2–3 linhas, subtítulo, par de CTAs lado a lado e microtexto de confiança.
- Abaixo dos CTAs, uma peça visual centralizada ocupa a largura do conteúdo e avança levemente sobre a seção seguinte.
- Seções seguintes com títulos centralizados e grades de 3 colunas.
- Chamada final em faixa de largura total na cor primária, com título e CTA centralizados.

**Propriedades**
- arquitetura: hero-centralizado
- secoes: Header → Hero centralizado com mockup do aplicativo → Faixa de logos de clientes → Recursos em 3 colunas → Depoimento → Chamada final em faixa colorida → Rodapé em colunas

**Medidas recomendadas (adaptáveis)**
- alturaHeader: ≈68 px (desktop) / 56 px (celular)
- paddingTopoHero: ≈96 px (desktop) / 48 px (celular)
- larguraMaxConteudo: ≈1120 px
- larguraMaxTitulo: ≈16ch

**Comportamento e estados**
- Header transparente no topo; ao rolar ganha fundo sólido e borda inferior fina (position: sticky).
- CTA principal com hover em primaryHover e foco visível; CTA secundário em contorno.
- Links da navegação rolam suavemente até as âncoras das seções (scroll-behavior: smooth, desativado com prefers-reduced-motion).

**Responsividade deste item**
- No celular o mockup mostra apenas as colunas do quadro, sem barra lateral, com rolagem horizontal interna desativada (as colunas encolhem).
- Abaixo de 768 px a navegação vira um botão hambúrguer à direita, que abre um painel de largura total com os links e o “Entrar”.
- Título reduz para ≈34 px com clamp(), mantendo a centralização; subtítulo com no máximo ≈60 caracteres por linha.
- Os dois CTAs empilham em largura total (principal primeiro) com 12 px entre eles.
- Grade de recursos passa de 3 colunas para 1; a peça visual do hero é simplificada e ocupa 100% da largura.
- Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis.
- Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.

**Observações**
- Demonstração original: fundo #fbfaff, texto #16132b, primária #5b4cf0, destaque #ff8a5b; títulos em Inter. Por padrão a landing herda a paleta global do projeto.
- Marca, textos e números são fictícios: substitua pelo conteúdo real mantendo a hierarquia e a composição.
- Ilustrações da demonstração são placeholders vetoriais; use imagens reais otimizadas com texto alternativo.

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

### Cadastro: Cadastro na mesma tela do login — mesma-tela

`id: mesma-tela` · origem: módulo “cadastro”

Cadastro integrado ao login por abas “Entrar | Criar conta” no topo do formulário, sem trocar de página.

**Estrutura**
- Abas “Entrar | Criar conta” (role="tablist") no topo do formulário, com a aba ativa sublinhada na cor primária.
- A aba “Criar conta” mostra nome, e-mail, senha com requisitos e o botão “Criar conta”.
- Texto de aceite dos termos abaixo do botão, com links.
- Campos, na ordem: Nome, E-mail, Senha.

**Propriedades**
- campos: Nome, E-mail, Senha

**Medidas recomendadas (adaptáveis)**
- alturaInputs: ≈44 px (desktop) / 48 px (celular)
- espacoEntreCampos: ≈16 px

**Comportamento e estados**
- Trocar de aba mantém o e-mail já digitado e atualiza a URL (?aba=cadastro) para permitir link direto.
- Erros por campo com mensagem abaixo (ex.: “Use pelo menos 8 caracteres”) e resumo com role="alert" quando o envio falhar.
- Senha com botão mostrar/ocultar e checklist de requisitos que marca cada regra cumprida enquanto a pessoa digita.
- Na aba Entrar, o link “Esqueci minha senha” leva à recuperação por e-mail.
- Labels associados; autocomplete name, email e new-password no cadastro e current-password no login.
- Estados de erro por campo, com mensagem clara abaixo do campo e resumo no topo em caso de envio inválido.
- Validação ao sair do campo e no envio; nunca apague o que a pessoa digitou.
- Botão para mostrar/ocultar senha e indicação dos requisitos de senha.
- Link de recuperação de senha visível na tela de login.
- Labels acessíveis (label for/id), autocomplete adequado (name, email, new-password, current-password, one-time-code).

**Responsividade deste item**
- No celular as abas ocupam a largura total (50% cada) com altura ≥ 44 px.
- Com o teclado virtual aberto, o botão “Criar conta” permanece visível logo abaixo do último campo (sem position: fixed sobre o teclado).
- Em telas de 320 px os requisitos de senha quebram em lista vertical.
- Layout adaptado ao teclado virtual: o campo focado e o botão de envio permanecem visíveis.
- Funciona em telas a partir de 320 px, com uma coluna no celular.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).

**Observações**
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

### Layout mobile: Bottom Navigation clássica — Navegação inferior

`id: bottom-nav-classica` · origem: módulo “mobile”

Topbar simples e Bottom Navigation fixa com 4 destinos rotulados de largura igual.

**Estrutura**
- Topbar de ≈56 px com título da tela e uma ação à direita. A barra superior soma env(safe-area-inset-top) à própria altura, para não colidir com o entalhe da câmera.
- Bottom Navigation fixa (position: fixed; bottom: 0) com 4 itens de largura igual: ícone de 24 px + rótulo de 12 px. Altura de ≈64 px + env(safe-area-inset-bottom); o fundo da barra se estende até a borda inferior, atrás da barra de gestos.
- O conteúdo rola por baixo das barras fixas e recebe padding (topo e base) igual à altura delas, para que nada fique escondido.

**Propriedades**
- topo: topbar
- inferior: bottom-nav
- lateral: none
- sobreposicao: none
- stories: não
- oneScreen: não

**Medidas recomendadas (adaptáveis)**
- topbar: ≈56 px
- bottomNav: ≈64 px + safe area
- item: ≥ 48 × 48 px

**Comportamento e estados**
- Item ativo identificável por cor primária, ícone preenchido e indicador (pílula ou ponto) — nunca apenas pela cor; aria-current="page".
- Tocar no destino ativo rola a tela daquele destino para o topo.
- Cada destino preserva a própria posição de rolagem e pilha de navegação.
- Destinos principais no terço inferior da tela, na zona de alcance do polegar.

**Responsividade deste item**
- 320–359 px: rótulos curtos (até ≈10 caracteres) e ícones de 22 px; a fonte nunca fica abaixo de 12 px.
- Na horizontal (altura < 500 px), a barra inferior reduz para ≈48 px com rótulos ao lado dos ícones; barras fixas somadas nunca passam de 25% da altura.
- A partir de 768 px passa a valer a arquitetura desktop escolhida no Studio; não estique este layout para tablet ou computador.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Observações**
- Alvos de toque de no mínimo 44 × 44 px (48 px recomendado) e pelo menos 8 px entre alvos vizinhos.

### Relação entre desktop e celular
- No computador, use “Sidebar integral clássica”. No celular, use “Bottom Navigation clássica”. São decisões independentes: não derive uma da outra.
- Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (sidebar recolhida em rail ou menus colapsados); caso contrário, use a estrutura mobile.
- As regiões (header, sidebar, conteúdo, painéis) mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões.

## C. Navegação

Nenhum modelo específico de header ou sidebar foi escolhido no Navigation Showcase. Use a estrutura do layout desktop/mobile com aparência derivada da identidade visual, sem decoração extra.

- Item ativo sempre destacado (cor de navegação ativa) e anunciado a leitores de tela (`aria-current="page"`).
- Dropdowns e submenus abrem por clique/toque e por teclado (Enter/Espaço), fecham com Esc e clique fora.
- Drawers, bottom sheets e menus de tela cheia prendem o foco enquanto abertos e devolvem o foco ao botão que os abriu.

## D. Identidade visual

Paleta global: **Neutro Essencial**. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas.

| Grupo | Token | Nome | Valor |
| --- | --- | --- | --- |
| Marca | Cor primária | `primary` | #18181b |
| Marca | Primária — hover | `primaryHover` | #161618 |
| Marca | Primária — active | `primaryActive` | #131316 |
| Marca | Texto sobre primária | `onPrimary` | #ffffff |
| Marca | Primária suave | `primarySoft` | #e3e3e4 |
| Marca | Cor secundária | `secondary` | #52525b |
| Marca | Texto sobre secundária | `onSecondary` | #ffffff |
| Marca | Cor de destaque | `accent` | #2563eb |
| Marca | Texto sobre destaque | `onAccent` | #ffffff |
| Fundos e superfícies | Fundo principal | `bg` | #ffffff |
| Fundos e superfícies | Fundo secundário | `bgAlt` | #f6f6f6 |
| Fundos e superfícies | Superfície | `surface` | #ffffff |
| Fundos e superfícies | Superfície alternativa | `surfaceAlt` | #f5f5f5 |
| Texto | Texto principal | `text` | #18181b |
| Texto | Texto secundário | `textMuted` | #707072 |
| Texto | Texto desabilitado | `textDisabled` | #a7a7a8 |
| Texto | Placeholder | `placeholder` | #8c8c8d |
| Bordas e foco | Borda | `border` | #e6e6e6 |
| Bordas e foco | Borda forte | `borderStrong` | #c7c7c7 |
| Bordas e foco | Borda de foco (focus-visible) | `focusRing` | #18181b |
| Estados | Hover | `hover` | #f4f4f4 |
| Estados | Active | `active` | #ebebeb |
| Estados | Pressed | `pressed` | #e0e0e0 |
| Estados | Selected — fundo | `selected` | #e3e3e4 |
| Estados | Selected — texto | `selectedText` | #18181b |
| Estados | Disabled — fundo | `disabled` | #f0f0f0 |
| Estados | Disabled — texto | `disabledText` | #979798 |
| Semânticos | Success | `success` | #117e39 |
| Semânticos | Success — fundo | `successBg` | #e3f4e9 |
| Semânticos | Warning | `warning` | #a85c04 |
| Semânticos | Warning — fundo | `warningBg` | #faefe1 |
| Semânticos | Error | `error` | #dc2626 |
| Semânticos | Error — fundo | `errorBg` | #fbe5e5 |
| Semânticos | Info | `info` | #2563eb |
| Semânticos | Info — fundo | `infoBg` | #e5ecfd |
| Links, ícones e navegação | Link | `link` | #18181b |
| Links, ícones e navegação | Link — hover | `linkHover` | #141417 |
| Links, ícones e navegação | Ícones | `icon` | #525254 |
| Links, ícones e navegação | Navegação — fundo | `navBg` | #ffffff |
| Links, ícones e navegação | Navegação — texto | `navText` | #4b4b4d |
| Links, ícones e navegação | Navegação — item ativo | `navActive` | #e3e3e4 |
| Links, ícones e navegação | Navegação — texto ativo | `navActiveText` | #18181b |
| Gradiente | Gradiente — início | `gradientFrom` | #18181b |
| Gradiente | Gradiente — fim | `gradientTo` | #3b73ed |

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

Nenhum componente foi personalizado na biblioteca. Crie os componentes necessários usando os tokens e a geometria da seção D.

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

## Pendências

Decisões que o usuário ainda não tomou. Não invente: pergunte ou use a opção mais neutra.
- Dê um nome ao projeto.
