# Master Prompt — Orbita PM

> Especificação gerada pelo Atelier UI (Design System Studio) em 02/11/2026, 18:24:50.
> Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração.

## A. Informações do projeto

- Nome: Orbita PM
- Tipo de aplicação: Aplicativo ou SaaS
- Objetivo: Gestão de projetos B2B multiempresa (multi-tenant) com papéis e permissões
- Descrição: SaaS onde cada organização (tenant) gerencia projetos em quadros kanban, convida equipes com papéis (Owner, Admin, Membro, Convidado), acompanha relatórios e gerencia assinatura/faturamento.
- Público-alvo: Empresas de 10 a 500 pessoas: PMOs, líderes de equipe e times de produto
- Finalidade principal: Mover tarefas no kanban e ver o status do projeto em segundos
- Funcionalidades previstas: Quadro kanban (drag-and-drop); Papéis e permissões (RBAC); Relatórios e burndown; Faturamento e planos; Configurações da organização; Convites de equipe; Troca de organização (multi-tenant)
- Tecnologia desejada: React 18 + TypeScript + Vite + Tailwind CSS

## B. Arquitetura geral

- Fluxo de entrada: **Landing page com chamada para login** — Página pública de apresentação e um botão “Entrar” que leva ao login do sistema.
- Landing: Aurora Flow · Login: Acesso corporativo · Cadastro: Cadastro em etapas progressivas
- Layout desktop: Sidebar integral com header global · Layout mobile: Topbar com Bottom Navigation

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

### Login: Acesso corporativo — Login corporativo com SSO e aviso de segurança

`id: acesso-corporativo` · origem: módulo “login”

Login corporativo com header institucional, botão “Entrar com SSO da empresa” em destaque, alternativa por e-mail e aviso de segurança.

**Estrutura**
- Header fino com logotipo da organização à esquerda e link “Suporte de TI” à direita.
- Cartão central: botão “Entrar com SSO da empresa”, divisor “ou”, e-mail corporativo e senha.
- Aviso de segurança no rodapé: “Acesso monitorado. Uso restrito a colaboradores autorizados.”
- Textos da demonstração: título “Acesso corporativo”, subtítulo “Entre com a conta da sua organização.”.

**Medidas recomendadas (adaptáveis)**
- larguraFormulario: ≈360–400 px
- alturaInputs: ≈44 px (desktop) / 48 px (celular)

**Comportamento e estados**
- Labels visíveis associados aos campos (label for/id). E-mail com type="email", inputMode="email" e autoComplete="username" (ou "email"); senha com autoComplete="current-password".
- Botão de mostrar/ocultar senha dentro do campo, com aria-label alternando “Mostrar senha”/“Ocultar senha” e aria-pressed.
- Validação ao enviar e ao sair do campo: mensagem abaixo do campo (aria-invalid + aria-describedby) e resumo no topo do formulário com role="alert".
- Erro de credenciais genérico (“E-mail ou senha incorretos”), sem revelar qual dos dois está errado.
- Link “Esqueci minha senha” perto do campo de senha, levando ao fluxo de recuperação por e-mail com mensagem neutra (“Se o e-mail existir, enviaremos um link”).
- Botão principal com estado de carregamento (“Entrando…”) e desabilitado durante o envio para evitar duplo clique.

**Responsividade deste item**
- No celular o header fino se mantém (56 px) e o cartão ocupa a largura total.
- Inputs com font-size ≥ 16 px e altura ≥ 48 px no celular (evita o zoom automático do iOS e facilita o toque).
- Com o teclado virtual aberto, o campo focado e o botão “Entrar” continuam visíveis (use 100dvh, sem height: 100vh fixo, e scroll-padding).
- Funciona a partir de 320 px de largura sem rolagem horizontal.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).
- Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.

**Observações**
- SSO real exige integração com o provedor de identidade da organização (SAML 2.0 ou OpenID Connect).
- Esta tela é uma demonstração de interface. A autenticação real deve ser implementada pela IA com backend seguro: senhas com hash (Argon2id ou bcrypt), limitação de tentativas, sessão em cookie httpOnly + Secure + SameSite, proteção CSRF e HTTPS obrigatório.
- Cores, fontes, cantos e superfícies vêm da identidade global do projeto (tokens).
- A tela é uma demonstração de interface. Implemente a autenticação real com backend seguro (hash de senha, rate limit, tokens httpOnly, proteção CSRF).

### Cadastro: Cadastro em etapas progressivas — etapas

`id: etapas` · origem: módulo “cadastro”

Cadastro progressivo em 3 etapas (Conta → Perfil → Preferências) com indicador de passos e navegação Voltar/Continuar.

**Estrutura**
- Indicador de etapas no topo: 3 círculos numerados ligados por linhas, com nomes; etapa atual destacada, concluídas com ícone de verificação.
- Etapa 1 — Conta: e-mail e senha. Etapa 2 — Perfil: nome, empresa e cargo. Etapa 3 — Preferências: interesses em chips selecionáveis.
- Botões “Voltar” (secundário) e “Continuar” (principal); na última etapa o principal vira “Concluir cadastro”.
- Campos, na ordem: E-mail, Senha, Nome, Empresa, Cargo, Interesses.

**Propriedades**
- campos: E-mail, Senha, Nome, Empresa, Cargo, Interesses

**Medidas recomendadas (adaptáveis)**
- alturaInputs: ≈44 px (desktop) / 48 px (celular)
- espacoEntreCampos: ≈16 px
- indicadorEtapas: ≈28 px por círculo
- alturaBotoes: ≈44 px (desktop) / 48 px (celular)

**Comportamento e estados**
- “Continuar” valida apenas os campos da etapa atual e mostra os erros abaixo de cada campo, com foco no primeiro inválido.
- Dados das etapas anteriores são preservados ao voltar; a conta é criada na etapa 1 e o restante pode ser pulado (“Pular por agora”).
- Senha com mostrar/ocultar e requisitos visíveis; login com “Esqueci minha senha” na tela de entrar.
- O indicador usa aria-current="step" e texto “Etapa 2 de 3” para leitores de tela.
- Autocomplete: email, new-password, name, organization, organization-title.
- Estados de erro por campo, com mensagem clara abaixo do campo e resumo no topo em caso de envio inválido.
- Validação ao sair do campo e no envio; nunca apague o que a pessoa digitou.
- Botão para mostrar/ocultar senha e indicação dos requisitos de senha.
- Link de recuperação de senha visível na tela de login.
- Labels acessíveis (label for/id), autocomplete adequado (name, email, new-password, current-password, one-time-code).

**Responsividade deste item**
- No celular o indicador mostra só os círculos e o nome da etapa atual (“2 de 3 · Perfil”).
- Botões Voltar/Continuar lado a lado na base do formulário; acima do teclado virtual quando ele estiver aberto.
- Chips de interesses quebram em várias linhas, sem rolagem horizontal, a partir de 320 px.
- Layout adaptado ao teclado virtual: o campo focado e o botão de envio permanecem visíveis.
- Funciona em telas a partir de 320 px, com uma coluna no celular.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).

**Observações**
- Demonstração de interface: a criação de conta real deve ser feita pela IA com backend seguro — hash de senha (Argon2id/bcrypt), verificação de e-mail, limitação de tentativas, proteção contra bots (sem expor se um e-mail já existe), sessão em cookie httpOnly/Secure/SameSite e HTTPS.

### Layout desktop: Sidebar integral com header global — Sidebar integral

`id: sidebar-integral-header-global` · origem: módulo “desktop”

Header global de largura total no topo e sidebar integral abaixo dele, da base do header até a base da janela.

**Estrutura**
- grid-template-columns: 252px minmax(0, 1fr); grid-template-rows: 64px minmax(0, 1fr); o header ocupa as duas colunas (grid-column: 1 / -1).
- Header global de ≈64 px: logo à esquerda (alinhado à largura da sidebar), busca global ao centro (até ≈560 px), ações e avatar à direita.
- Sidebar integral de ≈252 px abaixo do header: encostada na borda esquerda, ocupa toda a altura restante (calc(100dvh − 64 px)), sem margem nem cantos arredondados.
- Itens de navegação com 40–44 px de altura, ícone de 20 px + rótulo, agrupados por seções com título discreto; o item ativo tem fundo de seleção, cor de texto ativa e indicador lateral.
- Área de conteúdo com padding de 24–32 px, largura fluida e grids internos com minmax(0, 1fr); nenhum cartão encolhe abaixo de ≈280 px — reduza colunas antes.

**Propriedades**
- gridColumns: 252px 1fr
- gridRows: 64px 1fr
- gridAreas: "header header" "sidebar content"
- gap: 0px
- padding: 0px
- regioes: header (header), sidebar (sidebar), content (content)
- oneScreen: não

**Medidas recomendadas (adaptáveis)**
- sidebar: ≈252 px
- header: ≈64 px

**Comportamento e estados**
- Header fixo no topo da janela (sticky; top: 0); a sidebar é sticky em top: 64 px com altura calc(100dvh − 64 px) e rolagem interna.
- A busca global abre resultados em painel suspenso acessível por teclado (setas, Enter, Esc).

**Responsividade deste item**
- 1280 px ou mais: sidebar esquerda com ≈252 px e rótulos completos.
- 1024–1279 px: a sidebar reduz para ≈220 px; o conteúdo reduz colunas antes de comprimir cartões ou tabelas.
- 768–1023 px: a sidebar recolhe para rail de ≈72 px abaixo do header; a busca global vira ícone que expande o campo sobre o header.
- Abaixo de 768 px vale a arquitetura mobile escolhida separadamente no Studio: não converta a navegação desktop em drawer, rail ou bottom navigation por conta própria.

**Observações**
- O logo pertence ao header (não à sidebar) neste modelo.
- One Page, não One Screen: a página pode rolar verticalmente; não force o conteúdo a caber em 100dvh nem esconda seções para evitar rolagem.
- As medidas são recomendações para 1280 × 800; adapte à tela e ao conteúdo preservando a estrutura escolhida.

### Layout mobile: Topbar com Bottom Navigation — Layouts híbridos

`id: topbar-bottom-nav` · origem: módulo “mobile”

Topbar com marca e ações globais combinada com Bottom Navigation de 4 destinos.

**Estrutura**
- Topbar de ≈56 px: logo à esquerda; busca, notificações (com badge) e avatar à direita. A barra superior soma env(safe-area-inset-top) à própria altura, para não colidir com o entalhe da câmera.
- Bottom Navigation com 4 destinos rotulados. Altura de ≈64 px + env(safe-area-inset-bottom); o fundo da barra se estende até a borda inferior, atrás da barra de gestos.
- O conteúdo rola por baixo das barras fixas e recebe padding (topo e base) igual à altura delas, para que nada fique escondido.

**Propriedades**
- topo: topbar-brand
- inferior: bottom-nav
- lateral: none
- sobreposicao: none
- stories: não
- oneScreen: não

**Medidas recomendadas (adaptáveis)**
- topbar: ≈56 px
- bottomNav: ≈64 px + safe area

**Comportamento e estados**
- Ações da topbar são globais (iguais em todos os destinos); a navegação principal fica só embaixo.
- Item ativo identificável por cor primária, ícone preenchido e indicador (pílula ou ponto) — nunca apenas pela cor; aria-current="page".
- Destinos principais no terço inferior da tela, na zona de alcance do polegar.

**Responsividade deste item**
- 320–359 px: rótulos curtos (até ≈10 caracteres) e ícones de 22 px; a fonte nunca fica abaixo de 12 px.
- Na horizontal (altura < 500 px), a barra inferior reduz para ≈48 px com rótulos ao lado dos ícones; barras fixas somadas nunca passam de 25% da altura.
- A partir de 768 px passa a valer a arquitetura desktop escolhida no Studio; não estique este layout para tablet ou computador.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Observações**
- Alvos de toque de no mínimo 44 × 44 px (48 px recomendado) e pelo menos 8 px entre alvos vizinhos.

### Relação entre desktop e celular
- No computador, use “Sidebar integral com header global”. No celular, use “Topbar com Bottom Navigation”. São decisões independentes: não derive uma da outra.
- Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (sidebar recolhida em rail ou menus colapsados); caso contrário, use a estrutura mobile.
- As regiões (header, sidebar, conteúdo, painéis) mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões.

## C. Navegação

### Header: Trilha de Contexto — Menu + trilha embaixo

`id: trilha-contexto` · origem: módulo “navegacao”

Header de aplicação de 56 px com breadcrumbs (na barra ou numa faixa própria), notificações e perfil.

**Estrutura**
- Barra principal com 56 px de altura, largura total da janela (full width), padding horizontal de 24–32 px.
- Superfície: fundo navBg com borda inferior de 1 px (token border).
- Logo: símbolo quadrado de 28 px na cor primária + nome da marca em peso 700 (marca fictícia “Tucano” na prévia — substitua pela marca real).
- Navegação principal com 3 itens (Projetos, Equipe, Ajustes): links de texto simples; o ativo usa a cor de texto principal e peso 600, os demais textMuted; espaço entre itens de 20–24 px.
- Ações: sino de notificações com contador e popover; avatar circular de 32 px com menu de perfil.
- Breadcrumbs “Projetos / Site institucional / Página inicial” dentro da barra, logo após o logo; separador “/” em textMuted e o último nível em peso 600 (aria-current="page").
- Disposição conforme a composição escolhida (ver “composicao”): A “Trilha na barra principal” = logo e navegação juntos à esquerda; busca e ações empurradas para a direita; B “Menu + trilha embaixo” = logo e navegação juntos à esquerda; busca e ações empurradas para a direita.

**Propriedades**
- flutuante: não
- fixo: sim
- composicao: Menu + trilha embaixo: Linha superior com logo, links (Projetos, Equipe, Ajustes), notificações e perfil; linha inferior de 40 px com a trilha e uma ação contextual “Compartilhar”.

**Medidas recomendadas (adaptáveis)**
- altura (desktop): 56 px
- altura (celular): 56 px
- padding horizontal: 24–32 px (16 px no celular)
- espaço entre itens: 20–24 px
- logo: ≈ 28 px de altura
- área de toque mínima: 44 × 44 px no celular

**Comportamento e estados**
- Item ativo: links de texto simples; o ativo usa a cor de texto principal e peso 600, os demais textMuted. Hover com transição de 120 ms; foco visível com anel de 2 px na cor focusRing.
- Fixo no topo: position: sticky; top: 0; z-index: 40. Após 8 px de rolagem ganha sombra suave.
- Notificações: o sino abre um popover de 320 px com as últimas notificações, marcador de não lidas e link “Ver todas”.
- Perfil: o avatar abre um menu com nome e e-mail, “Meu perfil”, “Configurações”, “Ajuda” e “Sair”, alinhado à borda direita.

**Responsividade deste item**
- Desktop largo (≥ 1280 px): composição completa, como na prévia.
- De 1024 a 1279 px: o espaço entre itens cai para 16 px.
- De 768 a 1023 px: a navegação recolhe para o botão ☰; continuam visíveis o logo e a ação principal.
- Abaixo de 768 px: barra única de 56 px com logo, avatar, botão de menu ☰ (44 × 44 px). Vão para o painel do menu: os 3 itens de navegação.
- Painel do menu: desliza logo abaixo do header em largura total, altura máxima calc(100dvh − 56 px) com rolagem interna; trava a rolagem do corpo e fecha com ✕, Esc, toque fora ou ao escolher um item.
- Popovers (perfil, notificações, menus) são reposicionados para caber na viewport: largura máxima calc(100vw − 16 px), alinhados à borda mais próxima; nenhum overflow horizontal de 320 a 1920 px.
- No celular os breadcrumbs viram um único link “‹ Site institucional” para o nível anterior.
- Continua fixo no celular; recomendado esconder ao rolar para baixo e reaparecer ao rolar para cima para ganhar área útil.
- Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis.
- Dropdowns e popovers: reposicione automaticamente para não sair da viewport; no celular podem virar bottom sheet.

**Observações**
- Todas as cores vêm dos tokens da identidade global (navBg, navText, navActive, primary, border…); nada de cores fixas.
- Use <header> com <nav aria-label="Principal"> e lista de links; o item da página atual recebe aria-current="page".

### Sidebar: Seletor de Espaços — Espaço no topo

`id: seletor-espacos` · origem: módulo “navegacao”

Sidebar de 260 px com seletor de espaço de trabalho, grupos de espaços com bolinhas de cor e perfil.

**Estrutura**
- Formato integral: ocupa toda a altura, encostada na borda esquerda, com 260 px de largura.
- Superfície: fundo navBg com borda direita de 1 px (token border).
- Itens: Caixa de entrada (4), Minhas tarefas, Calendário | “Espaços”: Marketing, Produto, Design.
- Ícones: ícones de linha de 18 px (estilo de ícone do tema) antes do rótulo; itens de 36 px de altura com padding horizontal de 12 px.
- Títulos de grupo: texto de 12,5 px em textMuted, sem caixa alta.
- Composição A: seletor de espaço de trabalho (avatar quadrado + nome + ▾) no topo; bloco de perfil no rodapé (avatar, nome, cargo e menu ⋯ que abre para cima). Composição B: campo de busca no topo que filtra os itens; seletor de espaço de trabalho no rodapé (menu abre para cima).

**Propriedades**
- formato: integral
- flutuante: não
- largura: ≈260 px
- composicao: Espaço no topo: Seletor de espaço no topo (menu com os espaços e “Criar espaço”); perfil no rodapé.

**Medidas recomendadas (adaptáveis)**
- largura: 260 px
- altura dos itens: 36 px (44 px no celular)
- padding interno: 12 px
- ícones: 18–20 px
- raio dos itens: radiusMd do tema
- drawer no celular: min(85vw, 280 px)

**Comportamento e estados**
- Item ativo: item ativo com fundo navActive e texto navActiveText em cantos radiusMd. Clique marca o item como ativo (aria-current="page"); hover com fundo hover; foco visível com anel focusRing de 2 px.
- A busca filtra os itens enquanto a pessoa digita (sem diferenciar maiúsculas e acentos) e mostra “Nada encontrado” quando não há resultados.
- Seletor de espaço de trabalho: abre um menu com os espaços (o atual marcado com ✓) e “Criar espaço”; Esc ou clique fora fecham.
- Menu do perfil abre para cima, dentro da altura da janela: Meu perfil, Preferências, Sair.
- Fixa: position: sticky; top: 0; height: 100dvh; a lista rola internamente (overflow-y: auto) quando não couber, mantendo topo e rodapé visíveis.

**Responsividade deste item**
- Desktop (≥ 1024 px): integral: ocupa toda a altura, encostada na borda esquerda, com 260 px de largura.
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
| Marca | Cor primária | `primary` | #4f46e5 |
| Marca | Primária — hover | `primaryHover` | #4338ca |
| Marca | Primária — active | `primaryActive` | #3730a3 |
| Marca | Texto sobre primária | `onPrimary` | #ffffff |
| Marca | Primária suave | `primarySoft` | #eef2ff |
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
| Bordas e foco | Borda de foco (focus-visible) | `focusRing` | #4f46e5 |
| Estados | Hover | `hover` | #f4f4f4 |
| Estados | Active | `active` | #ebebeb |
| Estados | Pressed | `pressed` | #e0e0e0 |
| Estados | Selected — fundo | `selected` | #eef2ff |
| Estados | Selected — texto | `selectedText` | #4338ca |
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
| Links, ícones e navegação | Link | `link` | #4338ca |
| Links, ícones e navegação | Link — hover | `linkHover` | #3730a3 |
| Links, ícones e navegação | Ícones | `icon` | #49505f |
| Links, ícones e navegação | Navegação — fundo | `navBg` | #0f1f4d |
| Links, ícones e navegação | Navegação — texto | `navText` | #caced8 |
| Links, ícones e navegação | Navegação — item ativo | `navActive` | #313e66 |
| Links, ícones e navegação | Navegação — texto ativo | `navActiveText` | #ffffff |
| Gradiente | Gradiente — início | `gradientFrom` | #4f46e5 |
| Gradiente | Gradiente — fim | `gradientTo` | #26aeeb |

Tokens ajustados manualmente pelo usuário: `primary` = #4f46e5, `primaryHover` = #4338ca, `primaryActive` = #3730a3, `primarySoft` = #eef2ff, `focusRing` = #4f46e5, `selected` = #eef2ff, `selectedText` = #4338ca, `link` = #4338ca, `linkHover` = #3730a3, `gradientFrom` = #4f46e5.

### Tipografia: Inter + Inter

`id: identity.typography` · origem: módulo “cores”

Títulos em Inter (peso 600) e textos em Inter (peso 400), tamanho base 14 px.

**Estrutura**
- Escala sugerida: 12 / 14 / 17 / 21 / 28 / 36 px.
- Altura de linha de 1.5 para textos e 1.2–1.3 para títulos.
- Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px.

**Propriedades**
- fonteTitulos: Inter
- fonteTexto: Inter
- tamanhoBase: 14
- pesoTitulos: 600
- pesoTexto: 400

**Responsividade deste item**
- Títulos grandes reduzem proporcionalmente no celular (use clamp()).
- Inputs com 16 px no celular para evitar zoom automático.

### Geometria e superfícies: Médios (8 px) · Contornada (bordas finas)

`id: identity.geometry` · origem: módulo “cores”

Cantos médios (8 px), bordas de 1 px, sombra sutil, superfícies contornada (bordas finas), densidade compacta.

**Estrutura**
- Escala de espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 20, 24, 32, 40.
- Sombras apenas no nível escolhido; elementos de conteúdo não devem parecer menus flutuantes.
- Ícones no estilo contorno (outline), tamanho consistente (16–20 px em interfaces).

**Propriedades**
- raioPequeno: 6px
- raioMedio: 8px
- raioGrande: 12px
- borda: 1px
- sombra: 0 1px 2px rgba(16,16,24,.06), 0 1px 3px rgba(16,16,24,.05)
- superficie: outlined
- densidade: compact
- unidadeDeEspaco: 6px
- ícones: outline

**Responsividade deste item**
- A geometria se mantém em todas as larguras; no celular aumente apenas as áreas de toque.

### Estados visuais
- hover: fundo `hover` ou primária `primaryHover`; active/pressed: `active`/`pressed`/`primaryActive`.
- focus-visible: anel de 2–3 px na cor `focusRing`, sempre visível ao navegar por teclado.
- selected: fundo `selected` com texto `selectedText`; disabled: fundo `disabled`, texto `disabledText`, sem hover.
- Mensagens: success/warning/error/info com os fundos semânticos correspondentes.

## E. Componentes

6 componente(s) aprovados. Cada instância tem configuração própria; alterar uma não altera as outras.

### Componente: Botões — Compact Pro

`id: botoes` · origem: módulo “componentes”

Botões na família visual Compact Pro. Botões com variantes (primário, secundário, fantasma, perigo), tamanhos, ícone opcional e estados completos. Estilo: Alta densidade: controles de 30 px, texto base de 13 px, raio de 4 px, bordas de 1 px sutis, sem sombras e números tabulares.

**Estrutura**
- Conteúdo: [ícone] texto [ícone]; gap de 8 px; ícone de 16–18 px.
- Hierarquia: um primário por área; secundário ao lado com menos peso.
- Sempre <button> (ou <a> para navegação) com type correto.
- Altura de controles 30 px (44 px de área de toque no celular); padding reduzido em 25%.
- Texto base 13 px, rótulos 12 px; números com font-variant-numeric: tabular-nums.
- Raio de 4 px em controles e 6 px em contêineres; bordas de 1 px sutis.
- Item ativo marcado por sublinhado de 2 px; ícones de 14–16 px sem fundo.
- Composição: Informação densa em linhas e colunas alinhadas; barras de ferramentas compactas.
- Acabamento: Neutro e funcional; cor apenas para estado e ação.

**Propriedades**
- Família visual: 13. Compact Pro
- Texto do botão: Começar agora
- Ícone: Seta direita (lucide: ArrowRight)
- Posição do ícone: À direita
- Variante: Primário
- Mostrar botão secundário ao lado: sim
- Texto do secundário: Saiba mais
- Tamanho: Médio
- Largura total: não
- Carregando: não
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
- Ação principal (fundo): #4f46e5
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #0f172a
- Texto secundário: #686d7a
- Borda: #e6e6e6
- Destaque: #0c91cd
- Foco: #4f46e5

**Medidas recomendadas (adaptáveis)**
- alturaSm: 32–36 px
- alturaMd: 40–44 px
- alturaLg: 48–52 px
- alturaDeControle: 30 px
- raio: 4 px / 6 px
- paddingInterno: 11 px

**Comportamento e estados**
- Hover: fundo primária-hover; active: primária-active + leve pressão; focus-visible com estilo de foco da família.
- Disabled: fundo/texto desabilitados, sem sombra; carregando: spinner no lugar do ícone e aria-busy.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover com fundo de hover; atalhos de teclado visíveis.
- Foco com anel de 2 px.
- Movimento: Rápido (100 ms).

**Responsividade deste item**
- Altura mínima de 44 px no celular; em grupos, empilham com largura total quando não cabem lado a lado.
- No celular, aumente as áreas de toque para 44 px sem aumentar a fonte além de 16 px nos campos; tabelas viram cartões.
- Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

### Componente: Quadros Kanban — Compact Pro

`id: quadros-kanban` · origem: módulo “componentes”

Quadros Kanban na família visual Compact Pro. Quadro de colunas com cartões arrastáveis, contadores e ação de adicionar. Estilo: Alta densidade: controles de 30 px, texto base de 13 px, raio de 4 px, bordas de 1 px sutis, sem sombras e números tabulares.

**Estrutura**
- Colunas lado a lado (largura fixa 260–300 px) com título, contador e "+"; cartões com etiqueta, título, avatar e data.
- Altura de controles 30 px (44 px de área de toque no celular); padding reduzido em 25%.
- Texto base 13 px, rótulos 12 px; números com font-variant-numeric: tabular-nums.
- Raio de 4 px em controles e 6 px em contêineres; bordas de 1 px sutis.
- Item ativo marcado por sublinhado de 2 px; ícones de 14–16 px sem fundo.
- Composição: Informação densa em linhas e colunas alinhadas; barras de ferramentas compactas.
- Acabamento: Neutro e funcional; cor apenas para estado e ação.

**Propriedades**
- Família visual: 13. Compact Pro
- Colunas (uma por linha): Backlog | A fazer | Em andamento | Em revisão | Concluído
- Cartões por coluna: 3
- Contadores: sim
- Etiquetas nos cartões: sim
- Avatares nos cartões: sim
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
- Ação principal (fundo): #4f46e5
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #0f172a
- Texto secundário: #686d7a
- Borda: #e6e6e6
- Destaque: #0c91cd
- Foco: #4f46e5

**Medidas recomendadas (adaptáveis)**
- alturaDeControle: 30 px
- raio: 4 px / 6 px
- paddingInterno: 11 px

**Comportamento e estados**
- Arrastar e soltar entre colunas com alternativa por teclado (mover para…); placeholder durante o arraste.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover com fundo de hover; atalhos de teclado visíveis.
- Foco com anel de 2 px.
- Movimento: Rápido (100 ms).

**Responsividade deste item**
- No celular, colunas rolam horizontalmente com scroll-snap (uma por vez) ou abas por coluna.
- No celular, aumente as áreas de toque para 44 px sem aumentar a fonte além de 16 px nos campos; tabelas viram cartões.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

### Componente: Tabelas — Compact Pro

`id: tabelas` · origem: módulo “componentes”

Tabelas na família visual Compact Pro. Tabela de dados com cabeçalho, linhas com status em badge, valores alinhados à direita e ações por linha. Estilo: Alta densidade: controles de 30 px, texto base de 13 px, raio de 4 px, bordas de 1 px sutis, sem sombras e números tabulares.

**Estrutura**
- Título + ações da tabela → <table> semântica (<thead>, <th scope="col">) → linhas.
- Números alinhados à direita com tabular-nums; status como badge; ações no fim.
- Estados de carregando (skeleton), vazio e erro.
- Altura de controles 30 px (44 px de área de toque no celular); padding reduzido em 25%.
- Texto base 13 px, rótulos 12 px; números com font-variant-numeric: tabular-nums.
- Raio de 4 px em controles e 6 px em contêineres; bordas de 1 px sutis.
- Item ativo marcado por sublinhado de 2 px; ícones de 14–16 px sem fundo.
- Composição: Informação densa em linhas e colunas alinhadas; barras de ferramentas compactas.
- Acabamento: Neutro e funcional; cor apenas para estado e ação.

**Propriedades**
- Família visual: 13. Compact Pro
- Título: Pedidos recentes
- Colunas (uma por linha): Cliente | Status | Valor | Data
- Linhas de exemplo: 4
- Densidade: compacta
- Linhas zebradas: não
- Estilo do cabeçalho: Destacado
- Seleção com checkbox: sim
- Ações por linha: sim
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
- Ícones: lucide, traço 1.75 px, tratamento plain
- Indicador de ativo: underline

**Cores**
- Ação principal (fundo): #4f46e5
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #0f172a
- Texto secundário: #686d7a
- Borda: #e6e6e6
- Destaque: #0c91cd
- Foco: #4f46e5

**Medidas recomendadas (adaptáveis)**
- alturaDeControle: 30 px
- raio: 4 px / 6 px
- paddingInterno: 11 px

**Comportamento e estados**
- Hover na linha; seleção com checkbox no cabeçalho (todos/indeterminado); ordenação por clique no cabeçalho com aria-sort.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover com fundo de hover; atalhos de teclado visíveis.
- Foco com anel de 2 px.
- Movimento: Rápido (100 ms).

**Responsividade deste item**
- No celular: rolagem horizontal local dentro do contêiner (overflow-x: auto) com a primeira coluna fixa, ou representação em cartões (cada linha vira um cartão rótulo: valor).
- No celular, aumente as áreas de toque para 44 px sem aumentar a fonte além de 16 px nos campos; tabelas viram cartões.
- Tabelas: rolagem horizontal local dentro do próprio contêiner ou representação alternativa em cartões no celular; cabeçalho legível.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

### Componente: Text inputs — Compact Pro

`id: text-inputs` · origem: módulo “componentes”

Text inputs na família visual Compact Pro. Campo de texto com rótulo visível, placeholder, ícone opcional, texto de ajuda e estado de erro. Estilo: Alta densidade: controles de 30 px, texto base de 13 px, raio de 4 px, bordas de 1 px sutis, sem sombras e números tabulares.

**Estrutura**
- Rótulo acima (label for/id) → campo → ajuda ou erro abaixo.
- Ícone dentro do campo à esquerda ou à direita.
- Asterisco de obrigatório com texto acessível.
- Altura de controles 30 px (44 px de área de toque no celular); padding reduzido em 25%.
- Texto base 13 px, rótulos 12 px; números com font-variant-numeric: tabular-nums.
- Raio de 4 px em controles e 6 px em contêineres; bordas de 1 px sutis.
- Item ativo marcado por sublinhado de 2 px; ícones de 14–16 px sem fundo.
- Composição: Informação densa em linhas e colunas alinhadas; barras de ferramentas compactas.
- Acabamento: Neutro e funcional; cor apenas para estado e ação.

**Propriedades**
- Família visual: 13. Compact Pro
- Rótulo: E-mail
- Placeholder: voce@empresa.com
- Texto de ajuda: Usaremos para enviar o recibo.
- Ícone: E-mail (lucide: Mail)
- Posição do ícone: À esquerda
- Campo obrigatório (*): sim
- Tamanho: Médio
- Mostrar erro: não
- Mensagem de erro: Informe um e-mail válido.
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
- Ação principal (fundo): #4f46e5
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #0f172a
- Texto secundário: #686d7a
- Borda: #e6e6e6
- Destaque: #0c91cd
- Foco: #4f46e5

**Medidas recomendadas (adaptáveis)**
- altura: 40–44 px
- espacoRotulo: 6 px
- alturaDeControle: 30 px
- raio: 4 px / 6 px
- paddingInterno: 11 px

**Comportamento e estados**
- Hover reforça a borda; focus-visible aplica o anel/estilo de foco da família.
- Erro: borda e mensagem na cor de erro, aria-invalid e aria-describedby apontando a mensagem.
- Disabled: fundo desabilitado e cursor not-allowed.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover com fundo de hover; atalhos de teclado visíveis.
- Foco com anel de 2 px.
- Movimento: Rápido (100 ms).

**Responsividade deste item**
- Largura 100% do contêiner; fonte 16 px no celular; o campo focado permanece visível com o teclado aberto.
- No celular, aumente as áreas de toque para 44 px sem aumentar a fonte além de 16 px nos campos; tabelas viram cartões.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

### Componente: Modais — Compact Pro

`id: modais` · origem: módulo “componentes”

Modais na família visual Compact Pro. Diálogo modal com overlay, ícone, título, texto, ações e botão fechar. Estilo: Alta densidade: controles de 30 px, texto base de 13 px, raio de 4 px, bordas de 1 px sutis, sem sombras e números tabulares.

**Estrutura**
- Overlay (45%) + painel centralizado: cabeçalho (ícone, título, ×) → corpo → rodapé com ações (secundária, primária).
- role="dialog" aria-modal="true" aria-labelledby.
- Altura de controles 30 px (44 px de área de toque no celular); padding reduzido em 25%.
- Texto base 13 px, rótulos 12 px; números com font-variant-numeric: tabular-nums.
- Raio de 4 px em controles e 6 px em contêineres; bordas de 1 px sutis.
- Item ativo marcado por sublinhado de 2 px; ícones de 14–16 px sem fundo.
- Composição: Informação densa em linhas e colunas alinhadas; barras de ferramentas compactas.
- Acabamento: Neutro e funcional; cor apenas para estado e ação.

**Propriedades**
- Família visual: 13. Compact Pro
- Título: Excluir projeto?
- Texto: Esta ação não pode ser desfeita. Todos os arquivos do projeto serão removidos.
- Botão principal: Excluir projeto
- Botão secundário: Cancelar
- Tipo: Ação perigosa
- Ícone: Atenção (lucide: TriangleAlert)
- Botão fechar (×): sim
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
- Ação principal (fundo): #4f46e5
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #0f172a
- Texto secundário: #686d7a
- Borda: #e6e6e6
- Destaque: #0c91cd
- Foco: #4f46e5

**Medidas recomendadas (adaptáveis)**
- largura: 420–560 px
- alturaDeControle: 30 px
- raio: 4 px / 6 px
- paddingInterno: 11 px

**Comportamento e estados**
- Foco vai para o painel e fica preso; Esc e clique no overlay fecham (exceto em ações críticas); foco volta ao gatilho.
- Ação perigosa em vermelho; animação de entrada 160 ms.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover com fundo de hover; atalhos de teclado visíveis.
- Foco com anel de 2 px.
- Movimento: Rápido (100 ms).

**Responsividade deste item**
- Altura máxima de 90dvh com rolagem interna; ações sempre visíveis; no celular vira bottom sheet ou tela cheia.
- No celular, aumente as áreas de toque para 44 px sem aumentar a fonte além de 16 px nos campos; tabelas viram cartões.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

### Componente: Badges e tags — Compact Pro

`id: badges-tags` · origem: módulo “componentes”

Badges e tags na família visual Compact Pro. Etiquetas compactas para status semânticos e categorias, com variantes suave, sólida, contorno e ponto. Estilo: Alta densidade: controles de 30 px, texto base de 13 px, raio de 4 px, bordas de 1 px sutis, sem sombras e números tabulares.

**Estrutura**
- Altura 22–26 px, texto 12 px peso 600, padding horizontal 8–10 px.
- Cores semânticas: sucesso, aviso, erro, neutro; nunca só cor — o texto diz o status.
- Altura de controles 30 px (44 px de área de toque no celular); padding reduzido em 25%.
- Texto base 13 px, rótulos 12 px; números com font-variant-numeric: tabular-nums.
- Raio de 4 px em controles e 6 px em contêineres; bordas de 1 px sutis.
- Item ativo marcado por sublinhado de 2 px; ícones de 14–16 px sem fundo.
- Composição: Informação densa em linhas e colunas alinhadas; barras de ferramentas compactas.
- Acabamento: Neutro e funcional; cor apenas para estado e ação.

**Propriedades**
- Família visual: 13. Compact Pro
- Etiquetas (uma por linha): Ativo | Pendente | Erro | Rascunho
- Estilo: Suave
- Formato: Da família
- Removível (×): não
- Cor personalizada da 1ª etiqueta: herda da paleta global
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
- Ação principal (fundo): #4f46e5
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #0f172a
- Texto secundário: #686d7a
- Borda: #e6e6e6
- Destaque: #0c91cd
- Foco: #4f46e5

**Medidas recomendadas (adaptáveis)**
- alturaDeControle: 30 px
- raio: 4 px / 6 px
- paddingInterno: 11 px

**Comportamento e estados**
- Tags removíveis têm botão × com aria-label "Remover <tag>".
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover com fundo de hover; atalhos de teclado visíveis.
- Foco com anel de 2 px.
- Movimento: Rápido (100 ms).

**Responsividade deste item**
- Grupos de tags quebram linha; textos longos truncam com reticências e title completo.
- No celular, aumente as áreas de toque para 44 px sem aumentar a fonte além de 16 px nos campos; tabelas viram cartões.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
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
