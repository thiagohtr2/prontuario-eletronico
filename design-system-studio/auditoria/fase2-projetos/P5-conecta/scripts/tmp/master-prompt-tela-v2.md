# Master Prompt — Conecta

> Especificação gerada pelo Atelier UI (Design System Studio) em 02/11/2026, 18:33:51.
> Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração.

## A. Informações do projeto

- Nome: Conecta
- Tipo de aplicação: Plataforma social mobile-first
- Objetivo: Plataforma social mobile-first para conectar pessoas por meio de stories, conteúdos e perfis
- Descrição: Plataforma social mobile-first com header superior com stories, menu inferior flutuante arredondado, drawer lateral acessado pelo header, cards de conteúdo e perfil do usuário. A navegação mobile é prioritária e a versão desktop deve ser coerente com ela.
- Funcionalidades previstas: Header superior com stories; Menu inferior flutuante arredondado; Drawer lateral acessado pelo header; Cards de conteúdo (feed); Perfil do usuário
- Tecnologia desejada: HTML + CSS + JavaScript

## B. Arquitetura geral

- Fluxo de entrada: **Apenas login** — O endereço abre direto na tela de entrar. Sem página de apresentação.
- Landing: nenhuma · Login: Acesso responsivo · Cadastro: Cadastro na mesma tela do login
- Layout desktop: Topbar integral fixa · Layout mobile: Stories com dock e drawer lateral

### Login: Acesso responsivo — Pensado primeiro para o celular

`id: acesso-responsivo` · origem: módulo “login”

Login mobile-first com alternância “E-mail | Telefone”, campos de 56 px e botão principal ancorado na base da área do formulário.

**Estrutura**
- Alternância segmentada “E-mail | Telefone” no topo do formulário.
- Campos grandes (56 px) e botão principal ancorado na base da área do formulário.
- No computador, painel central com instruções curtas ao lado.
- Textos da demonstração: título “Entrar”, subtítulo “Escolha como prefere acessar.”.

**Medidas recomendadas (adaptáveis)**
- larguraFormulario: ≈360–400 px
- alturaInputs: ≈56 px

**Comportamento e estados**
- Labels visíveis associados aos campos (label for/id). E-mail com type="email", inputMode="email" e autoComplete="username" (ou "email"); senha com autoComplete="current-password".
- Botão de mostrar/ocultar senha dentro do campo, com aria-label alternando “Mostrar senha”/“Ocultar senha” e aria-pressed.
- Validação ao enviar e ao sair do campo: mensagem abaixo do campo (aria-invalid + aria-describedby) e resumo no topo do formulário com role="alert".
- Erro de credenciais genérico (“E-mail ou senha incorretos”), sem revelar qual dos dois está errado.
- Link “Esqueci minha senha” perto do campo de senha, levando ao fluxo de recuperação por e-mail com mensagem neutra (“Se o e-mail existir, enviaremos um link”).
- Botão principal com estado de carregamento (“Entrando…”) e desabilitado durante o envio para evitar duplo clique.

**Responsividade deste item**
- No celular o botão “Entrar” fica fixo na base, acima do teclado virtual (visualViewport) e respeitando a safe area.
- Telefone com type="tel", inputMode="tel" e autoComplete="tel".
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

### Layout desktop: Topbar integral fixa — Sem sidebar

`id: topbar-integral-fixa` · origem: módulo “desktop”

Header integral fixo no topo (largura total) e conteúdo centralizado com largura máxima, sem navegação lateral.

**Estrutura**
- grid-template-rows: 64px minmax(0, 1fr); o header ocupa 100% da largura, encostado no topo e nas bordas.
- Conteúdo interno do header limitado à largura máxima do site (≈1200 px, centralizado): logo à esquerda, links principais, busca e ações/carrinho à direita.
- Conteúdo em container centralizado de até ≈1200 px com padding lateral de 24–32 px.

**Propriedades**
- gridColumns: 1fr
- gridRows: 64px 1fr
- gridAreas: "header" "content"
- gap: 0px
- padding: 0px
- regioes: header (header), content (content)
- oneScreen: não

**Medidas recomendadas (adaptáveis)**
- header: ≈64 px
- contentMax: ≈1200 px

**Comportamento e estados**
- Header position: sticky; top: 0 com fundo sólido e borda inferior fina; não esconde ao rolar.
- Links com menu suspenso (dropdown ou mega menu) abrem em hover e clique, fecham com Esc e clique fora.

**Responsividade deste item**
- 1280 px ou mais: header de ≈64 px com todos os links visíveis.
- 1024–1279 px: espaçamento entre links diminui; links excedentes vão para um item “Mais” com menu suspenso acessível por teclado.
- 768–1023 px: os links recolhem em um botão “Menu” que abre um painel abaixo do header (largura total, rolagem interna); logo e ação principal continuam visíveis.
- Abaixo de 768 px vale a arquitetura mobile escolhida separadamente no Studio: não converta a navegação desktop em drawer, rail ou bottom navigation por conta própria.

**Observações**
- One Page, não One Screen: a página pode rolar verticalmente; não force o conteúdo a caber em 100dvh nem esconda seções para evitar rolagem.
- As medidas são recomendações para 1280 × 800; adapte à tela e ao conteúdo preservando a estrutura escolhida.

### Layout mobile: Stories com dock e drawer lateral — Layouts híbridos

`id: stories-dock-drawer` · origem: módulo “mobile”

Topbar com hambúrguer, faixa de stories, dock flutuante para destinos principais e drawer esquerdo para opções secundárias.

**Estrutura**
- Topbar de ≈56 px com botão de menu à esquerda. A barra superior soma env(safe-area-inset-top) à própria altura, para não colidir com o entalhe da câmera.
- Faixa de stories de ≈88 px abaixo da topbar, com rolagem horizontal.
- Dock flutuante de ≈64 px com 4 destinos principais.
- Drawer de ≈280 px (máx. 85% da largura) que desliza pela esquerda, ocupando a altura total (inclusive safe areas), com scrim escuro sobre o conteúdo.

**Propriedades**
- topo: topbar-hamburger
- inferior: dock
- lateral: drawer-left
- sobreposicao: none
- stories: sim
- oneScreen: não

**Medidas recomendadas (adaptáveis)**
- stories: ≈88 px
- dock: ≈64 px
- drawer: ≈280 px

**Comportamento e estados**
- Divisão clara: destinos frequentes no dock; configurações, ajuda e conta no drawer.
- Ao abrir: foco vai para o botão Fechar ou o primeiro item (sem rolar a página), o foco fica preso dentro do menu e o conteúdo atrás recebe inert/aria-hidden; Esc, toque no scrim e o botão X fecham; ao fechar, o foco volta ao gatilho.
- Enquanto o menu está aberto, o body não rola (overflow: hidden) e o menu tem rolagem interna própria (overscroll-behavior: contain).

**Responsividade deste item**
- 320–359 px: drawer com 85% da largura.
- Horizontal: stories recolhem; dock com ≈52 px.
- A partir de 768 px passa a valer a arquitetura desktop escolhida no Studio; não estique este layout para tablet ou computador.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Exceções**
- Observação do usuário: Sem botão flutuante (FAB): as recomendações genéricas dos componentes Modern Material sobre “navigation bar inferior com FAB” não se aplicam; o menu inferior é o dock flutuante arredondado deste layout.

### Relação entre desktop e celular
- No computador, use “Topbar integral fixa”. No celular, use “Stories com dock e drawer lateral”. São decisões independentes: não derive uma da outra.
- Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (sidebar recolhida em rail ou menus colapsados); caso contrário, use a estrutura mobile.
- As regiões (header, sidebar, conteúdo, painéis) mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões.

## C. Navegação

### Header: Praça da Comunidade — Ícones no centro

`id: praca-comunidade` · origem: módulo “navegacao”

Header de comunidade com abas de ícone e rótulo, contador de mensagens, busca, botão de criar e perfil.

**Estrutura**
- Barra principal com 60 px de altura, largura total da janela (full width), padding horizontal de 24–32 px.
- Superfície: fundo navBg com borda inferior de 1 px (token border).
- Logo: monograma circular de 32 px com a inicial da marca + nome (marca fictícia “Quero-quero” na prévia — substitua pela marca real).
- Navegação principal com 4 itens (Feed, Grupos, Eventos, Mensagens): links com sublinhado de 2 px na cor primária sob o item ativo, encostado na base da barra; espaço entre itens de 20–24 px.
- Campo de busca compacto (≈ 220 px × 36 px) com ícone de lupa à esquerda e placeholder “Buscar…”.
- Ações: botão “+ Novo”; sino de notificações com contador e popover; avatar circular de 32 px com menu de perfil.
- Disposição conforme a composição escolhida (ver “composicao”): A “Ícones no centro” = logo à esquerda, navegação centralizada na barra e ações à direita (grid 1fr auto 1fr); B “Tudo à direita” = logo à esquerda; navegação, busca e ações agrupadas à direita.

**Propriedades**
- flutuante: não
- fixo: sim
- composicao: Ícones no centro: Logo à esquerda, abas com ícone + rótulo no centro (contador em Mensagens), busca, “+ Novo”, notificações e avatar à direita.

**Medidas recomendadas (adaptáveis)**
- altura (desktop): 60 px
- altura (celular): 56 px
- padding horizontal: 24–32 px (16 px no celular)
- espaço entre itens: 20–24 px
- logo: ≈ 28 px de altura
- área de toque mínima: 44 × 44 px no celular

**Comportamento e estados**
- Item ativo: links com sublinhado de 2 px na cor primária sob o item ativo, encostado na base da barra. Hover com transição de 120 ms; foco visível com anel de 2 px na cor focusRing.
- Fixo no topo: position: sticky; top: 0; z-index: 40. Após 8 px de rolagem ganha sombra suave.
- Campo de busca: ao focar cresce de 220 para 300 px e mostra o anel de foco; Enter envia; Esc limpa e tira o foco.
- Notificações: o sino abre um popover de 320 px com as últimas notificações, marcador de não lidas e link “Ver todas”.
- Perfil: o avatar abre um menu com nome e e-mail, “Meu perfil”, “Configurações”, “Ajuda” e “Sair”, alinhado à borda direita.

**Responsividade deste item**
- Desktop largo (≥ 1280 px): composição completa, como na prévia.
- De 1024 a 1279 px: o espaço entre itens cai para 16 px e o campo de busca encolhe para 180 px.
- De 768 a 1023 px: a navegação recolhe para o botão ☰; continuam visíveis o logo, a busca e a ação principal.
- Abaixo de 768 px: barra única de 56 px com logo, ícone de busca, avatar, botão de menu ☰ (44 × 44 px). Vão para o painel do menu: os 4 itens de navegação.
- Painel do menu: desliza logo abaixo do header em largura total, altura máxima calc(100dvh − 56 px) com rolagem interna; trava a rolagem do corpo e fecha com ✕, Esc, toque fora ou ao escolher um item.
- Popovers (perfil, notificações, menus) são reposicionados para caber na viewport: largura máxima calc(100vw − 16 px), alinhados à borda mais próxima; nenhum overflow horizontal de 320 a 1920 px.
- Continua fixo no celular; recomendado esconder ao rolar para baixo e reaparecer ao rolar para cima para ganhar área útil.
- Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis.
- Dropdowns e popovers: reposicione automaticamente para não sair da viewport; no celular podem virar bottom sheet.

**Exceções**
- Observação do usuário: No celular (abaixo de 768 px) prevalece o layout mobile “Stories com dock e drawer lateral”: o botão de menu (☰) do header abre o drawer lateral esquerdo — não usar o painel de menu em largura total abaixo do header — e a faixa de stories fica logo abaixo do header.

**Observações**
- Todas as cores vêm dos tokens da identidade global (navBg, navText, navActive, primary, border…); nada de cores fixas.
- Use <header> com <nav aria-label="Principal"> e lista de links; o item da página atual recebe aria-current="page".

- Item ativo sempre destacado (cor de navegação ativa) e anunciado a leitores de tela (`aria-current="page"`).
- Dropdowns e submenus abrem por clique/toque e por teclado (Enter/Espaço), fecham com Esc e clique fora.
- Drawers, bottom sheets e menus de tela cheia prendem o foco enquanto abertos e devolvem o foco ao botão que os abriu.

## D. Identidade visual

Paleta global: **Comunidade**. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas.

| Grupo | Token | Nome | Valor |
| --- | --- | --- | --- |
| Marca | Cor primária | `primary` | #d6336c |
| Marca | Primária — hover | `primaryHover` | #c12e61 |
| Marca | Primária — active | `primaryActive` | #ab2956 |
| Marca | Texto sobre primária | `onPrimary` | #ffffff |
| Marca | Primária suave | `primarySoft` | #fae7ed |
| Marca | Cor secundária | `secondary` | #7048e8 |
| Marca | Texto sobre secundária | `onSecondary` | #ffffff |
| Marca | Cor de destaque | `accent` | #f59f00 |
| Marca | Texto sobre destaque | `onAccent` | #111114 |
| Fundos e superfícies | Fundo principal | `bg` | #ffffff |
| Fundos e superfícies | Fundo secundário | `bgAlt` | #f6f6f6 |
| Fundos e superfícies | Superfície | `surface` | #ffffff |
| Fundos e superfícies | Superfície alternativa | `surfaceAlt` | #f5f5f5 |
| Texto | Texto principal | `text` | #1b1b1f |
| Texto | Texto secundário | `textMuted` | #727274 |
| Texto | Texto desabilitado | `textDisabled` | #a8a8aa |
| Texto | Placeholder | `placeholder` | #8d8d8f |
| Bordas e foco | Borda | `border` | #e6e6e6 |
| Bordas e foco | Borda forte | `borderStrong` | #c7c7c7 |
| Bordas e foco | Borda de foco (focus-visible) | `focusRing` | #d6336c |
| Estados | Hover | `hover` | #f4f4f4 |
| Estados | Active | `active` | #ebebeb |
| Estados | Pressed | `pressed` | #e0e0e0 |
| Estados | Selected — fundo | `selected` | #fae7ed |
| Estados | Selected — texto | `selectedText` | #bc2d5f |
| Estados | Disabled — fundo | `disabled` | #f0f0f0 |
| Estados | Disabled — texto | `disabledText` | #98989a |
| Semânticos | Success | `success` | #117e39 |
| Semânticos | Success — fundo | `successBg` | #e3f4e9 |
| Semânticos | Warning | `warning` | #a85c04 |
| Semânticos | Warning — fundo | `warningBg` | #faefe1 |
| Semânticos | Error | `error` | #dc2626 |
| Semânticos | Error — fundo | `errorBg` | #fbe5e5 |
| Semânticos | Info | `info` | #2563eb |
| Semânticos | Info — fundo | `infoBg` | #e5ecfd |
| Links, ícones e navegação | Link | `link` | #d6336c |
| Links, ícones e navegação | Link — hover | `linkHover` | #b62b5c |
| Links, ícones e navegação | Ícones | `icon` | #545457 |
| Links, ícones e navegação | Navegação — fundo | `navBg` | #ffffff |
| Links, ícones e navegação | Navegação — texto | `navText` | #4d4d50 |
| Links, ícones e navegação | Navegação — item ativo | `navActive` | #fae7ed |
| Links, ícones e navegação | Navegação — texto ativo | `navActiveText` | #bc2d5f |
| Gradiente | Gradiente — início | `gradientFrom` | #f59f00 |
| Gradiente | Gradiente — fim | `gradientTo` | #d6336c |

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

4 componente(s) aprovados. Cada instância tem configuração própria; alterar uma não altera as outras.

### Componente: Card de conteúdo do feed — Modern Material

`id: cards` · origem: módulo “componentes”

Cards na família visual Modern Material. Cartão de conteúdo com mídia, etiqueta, título, texto, metadados e ação. Estilo: Superfícies tonais tingidas pela primária, botões em pílula (raio 20 px), campos preenchidos com indicador inferior, elevação tonal e indicadores ativos em pílula tonal.

**Estrutura**
- Mídia (aspect-ratio 16/9) → etiqueta → título → texto (até 3 linhas) → rodapé com meta e ação.
- O cartão inteiro pode ser clicável (link estendido) sem aninhar botões.
- Superfícies "container" = superfície misturada à primária (5–12%).
- Botões com raio de 20 px; variante tonal (primária suave) como secundária; FAB com raio 16 px.
- Campos preenchidos (fundo tonal, cantos superiores de 4 px, linha inferior de 1–2 px).
- Item ativo em pílula tonal; títulos com peso 500; ícones preenchidos em círculos tonais.
- Composição: Hierarquia por cor tonal e elevação; ações flutuantes (FAB) para a tarefa principal.
- Acabamento: Elevação tonal, camadas de estado, cantos arredondados.

**Propriedades**
- Família visual: 16. Modern Material
- Título: Publicação da comunidade
- Texto: Foto ou texto compartilhado por um perfil que você segue.
- Etiqueta: Novo
- Botão: Ver publicação
- Ícone: Avião (lucide: Plane)
- Layout: Vertical
- Mostrar imagem/ilustração: sim
- Mostrar rodapé: sim
- Raio dos controles: 20 px
- Raio dos contêineres: 12 px
- Borda: sem borda
- Sombra: elevação tonal (Material)
- Superfície: superfície tingida pela primária (4–10%)
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Fonte do sistema 500
- Fonte de texto: Fonte do sistema
- Caixa de rótulos e botões: normal (sentence case)
- Tamanho base: 14 px
- Altura de controles: 40 px (mínimo 44 px de área de toque no celular)
- Densidade: confortável
- Ícones: lucide, traço 2 px, tratamento circle
- Indicador de ativo: tonal

**Cores**
- Ação principal (fundo): #d6336c
- Ação principal (texto): #ffffff
- Superfície: #fef8fa
- Texto: #1b1b1f
- Texto secundário: #646466
- Borda: #e6e6e6
- Destaque: #be7b00
- Foco: #d6336c

**Medidas recomendadas (adaptáveis)**
- alturaDeControle: 40 px
- raio: 20 px / 12 px
- paddingInterno: 15 px

**Comportamento e estados**
- Hover conforme a família (elevação, borda ou deslocamento); foco visível no link principal.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover aplica camada de estado (8% da cor do conteúdo); active 12%.
- Foco com anel de 3 px.
- Movimento: Ênfase (250 ms, easing emphasized).

**Responsividade deste item**
- Altura definida pelo conteúdo; grade de cards reduz colunas (3 → 2 → 1); horizontal vira vertical no celular.
- No celular, use navigation bar inferior com pílula ativa e FAB acima dela, respeitando a safe area.
- Cards: altura definida pelo conteúdo (sem alturas fixas que cortem texto); grade reduz colunas progressivamente.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Nome dado pelo usuário: “Card de conteúdo do feed”.
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

### Componente: Perfil do usuário — Modern Material

`id: perfil-usuario` · origem: módulo “componentes”

Perfil de usuário na família visual Modern Material. Página de perfil com capa, avatar sobreposto, nome, cargo, ações, estatísticas e abas. Estilo: Superfícies tonais tingidas pela primária, botões em pílula (raio 20 px), campos preenchidos com indicador inferior, elevação tonal e indicadores ativos em pílula tonal.

**Estrutura**
- Capa → avatar (sobreposto −50%) + nome/cargo + ações → estatísticas → abas → conteúdo.
- Superfícies "container" = superfície misturada à primária (5–12%).
- Botões com raio de 20 px; variante tonal (primária suave) como secundária; FAB com raio 16 px.
- Campos preenchidos (fundo tonal, cantos superiores de 4 px, linha inferior de 1–2 px).
- Item ativo em pílula tonal; títulos com peso 500; ícones preenchidos em círculos tonais.
- Composição: Hierarquia por cor tonal e elevação; ações flutuantes (FAB) para a tarefa principal.
- Acabamento: Elevação tonal, camadas de estado, cantos arredondados.

**Propriedades**
- Família visual: 16. Modern Material
- Nome: Ana Souza
- Cargo: Product Designer
- Botão: Seguir
- Imagem de capa: sim
- Estatísticas: sim
- Abas: sim
- Raio dos controles: 20 px
- Raio dos contêineres: 12 px
- Borda: sem borda
- Sombra: elevação tonal (Material)
- Superfície: superfície tingida pela primária (4–10%)
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Fonte do sistema 500
- Fonte de texto: Fonte do sistema
- Caixa de rótulos e botões: normal (sentence case)
- Tamanho base: 14 px
- Altura de controles: 40 px (mínimo 44 px de área de toque no celular)
- Densidade: confortável
- Ícones: lucide, traço 2 px, tratamento circle
- Indicador de ativo: tonal

**Cores**
- Ação principal (fundo): #d6336c
- Ação principal (texto): #ffffff
- Superfície: #fef8fa
- Texto: #1b1b1f
- Texto secundário: #646466
- Borda: #e6e6e6
- Destaque: #be7b00
- Foco: #d6336c

**Medidas recomendadas (adaptáveis)**
- alturaDeControle: 40 px
- raio: 20 px / 12 px
- paddingInterno: 15 px

**Comportamento e estados**
- Editar perfil abre formulário; abas mudam o conteúdo sem recarregar.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover aplica camada de estado (8% da cor do conteúdo); active 12%.
- Foco com anel de 3 px.
- Movimento: Ênfase (250 ms, easing emphasized).

**Responsividade deste item**
- No celular, avatar e textos centralizados; estatísticas em 3 colunas compactas; ações em largura total.
- No celular, use navigation bar inferior com pílula ativa e FAB acima dela, respeitando a safe area.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Nome dado pelo usuário: “Perfil do usuário”.
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

### Componente: Drawer lateral aberto pelo header — Modern Material

`id: drawers` · origem: módulo “componentes”

Drawers na família visual Modern Material. Painel deslizante modal com cabeçalho, conteúdo rolável e rodapé de ações fixo. Estilo: Superfícies tonais tingidas pela primária, botões em pílula (raio 20 px), campos preenchidos com indicador inferior, elevação tonal e indicadores ativos em pílula tonal.

**Estrutura**
- Overlay + painel ancorado à borda; cabeçalho (título + fechar), corpo rolável, rodapé fixo.
- role="dialog" aria-modal="true".
- Superfícies "container" = superfície misturada à primária (5–12%).
- Botões com raio de 20 px; variante tonal (primária suave) como secundária; FAB com raio 16 px.
- Campos preenchidos (fundo tonal, cantos superiores de 4 px, linha inferior de 1–2 px).
- Item ativo em pílula tonal; títulos com peso 500; ícones preenchidos em círculos tonais.
- Composição: Hierarquia por cor tonal e elevação; ações flutuantes (FAB) para a tarefa principal.
- Acabamento: Elevação tonal, camadas de estado, cantos arredondados.

**Propriedades**
- Família visual: 16. Modern Material
- Título: Menu
- Botão principal: Sair da conta
- Lado: Esquerda
- Rodapé com ações: sim
- Escurecer o fundo: sim
- Raio dos controles: 20 px
- Raio dos contêineres: 12 px
- Borda: sem borda
- Sombra: elevação tonal (Material)
- Superfície: superfície tingida pela primária (4–10%)
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Fonte do sistema 500
- Fonte de texto: Fonte do sistema
- Caixa de rótulos e botões: normal (sentence case)
- Tamanho base: 14 px
- Altura de controles: 40 px (mínimo 44 px de área de toque no celular)
- Densidade: confortável
- Ícones: lucide, traço 2 px, tratamento circle
- Indicador de ativo: tonal

**Cores**
- Ação principal (fundo): #d6336c
- Ação principal (texto): #ffffff
- Superfície: #fef8fa
- Texto: #1b1b1f
- Texto secundário: #646466
- Borda: #e6e6e6
- Destaque: #be7b00
- Foco: #d6336c

**Medidas recomendadas (adaptáveis)**
- largura: 360–420 px
- alturaDeControle: 40 px
- raio: 20 px / 12 px
- paddingInterno: 15 px

**Comportamento e estados**
- Abre com animação de 200–250 ms; Esc, clique no overlay e botão fechar fecham; foco preso e devolvido ao gatilho.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover aplica camada de estado (8% da cor do conteúdo); active 12%.
- Foco com anel de 3 px.
- Movimento: Ênfase (250 ms, easing emphasized).

**Responsividade deste item**
- No celular, largura de até 88vw (lateral) ou bottom sheet com altura máxima de 90dvh e alça de arraste.
- No celular, use navigation bar inferior com pílula ativa e FAB acima dela, respeitando a safe area.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Exceções**
- Observação do usuário: Este é o drawer de navegação do layout mobile: abre pelo botão de menu do header, desliza pela esquerda e tem ≈280 px (máx. 85% da largura), conforme o layout mobile.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Nome dado pelo usuário: “Drawer lateral aberto pelo header”.
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

### Componente: Menu inferior flutuante arredondado (dock) — Modern Material

`id: layouts-mobile` · origem: módulo “componentes”

Layouts mobile na família visual Modern Material. Tela de celular com topbar, conteúdo em cartões e navegação móvel (barra inferior, dock, topbar ou abas). Estilo: Superfícies tonais tingidas pela primária, botões em pílula (raio 20 px), campos preenchidos com indicador inferior, elevação tonal e indicadores ativos em pílula tonal.

**Estrutura**
- Topbar (título, ações) → conteúdo rolável → navegação fixa com 3–5 itens (ícone + rótulo) e FAB opcional.
- Superfícies "container" = superfície misturada à primária (5–12%).
- Botões com raio de 20 px; variante tonal (primária suave) como secundária; FAB com raio 16 px.
- Campos preenchidos (fundo tonal, cantos superiores de 4 px, linha inferior de 1–2 px).
- Item ativo em pílula tonal; títulos com peso 500; ícones preenchidos em círculos tonais.
- Composição: Hierarquia por cor tonal e elevação; ações flutuantes (FAB) para a tarefa principal.
- Acabamento: Elevação tonal, camadas de estado, cantos arredondados.

**Propriedades**
- Família visual: 16. Modern Material
- Título da tela: Início
- Navegação: Dock flutuante
- Itens da navegação (um por linha): Início | Explorar | Salvos | Perfil
- Item ativo: 1
- Botão flutuante (FAB): não
- Raio dos controles: 20 px
- Raio dos contêineres: 12 px
- Borda: sem borda
- Sombra: elevação tonal (Material)
- Superfície: superfície tingida pela primária (4–10%)
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Fonte do sistema 500
- Fonte de texto: Fonte do sistema
- Caixa de rótulos e botões: normal (sentence case)
- Tamanho base: 14 px
- Altura de controles: 40 px (mínimo 44 px de área de toque no celular)
- Densidade: confortável
- Ícones: lucide, traço 2 px, tratamento circle
- Indicador de ativo: tonal

**Cores**
- Ação principal (fundo): #d6336c
- Ação principal (texto): #ffffff
- Superfície: #fef8fa
- Texto: #1b1b1f
- Texto secundário: #646466
- Borda: #e6e6e6
- Destaque: #be7b00
- Foco: #d6336c

**Medidas recomendadas (adaptáveis)**
- alturaDeControle: 40 px
- raio: 20 px / 12 px
- paddingInterno: 15 px

**Comportamento e estados**
- Item ativo com indicador da família; FAB para a ação principal; barras escondem ao rolar (opcional).
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover aplica camada de estado (8% da cor do conteúdo); active 12%.
- Foco com anel de 3 px.
- Movimento: Ênfase (250 ms, easing emphasized).

**Responsividade deste item**
- Respeita safe areas (env(safe-area-inset-bottom)); alvos de 48 px; funciona de 320 a 430 px e na horizontal.
- No celular, use navigation bar inferior com pílula ativa e FAB acima dela, respeitando a safe area.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Nome dado pelo usuário: “Menu inferior flutuante arredondado (dock)”.
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
