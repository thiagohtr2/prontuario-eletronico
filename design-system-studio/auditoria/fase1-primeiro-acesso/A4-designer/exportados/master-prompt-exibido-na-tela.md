# Master Prompt — Lumen

> Especificação gerada pelo Atelier UI (Design System Studio) em 02/11/2026, 18:37:51.
> Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração.

## A. Informações do projeto

- Nome: Lumen
- Tipo de aplicação: Aplicativo ou SaaS
- Objetivo: Dar clareza sobre saldo, gastos e metas financeiras pessoais
- Descrição: App web de finanças pessoais com painel de saldo, gastos por categoria, metas de economia e lista de transações. Versão desktop e mobile.
- Público-alvo: Adultos 25-45 anos que querem controlar o próprio dinheiro
- Finalidade principal: Ver quanto pode gastar hoje sem comprometer as metas
- Funcionalidades previstas: Painel de saldo; Gastos por categoria; Metas de economia; Transações
- Tecnologia desejada: React + TypeScript

## B. Arquitetura geral

- Fluxo de entrada: **Landing page com chamada para login** — Página pública de apresentação e um botão “Entrar” que leva ao login do sistema.
- Landing: Nexa Finance · Login: Produto em destaque · Cadastro: Página própria de cadastro
- Layout desktop: Painel financeiro com rail · Layout mobile: Topbar com Bottom Navigation

### Landing page: Nexa Finance — Plataforma financeira

`id: nexa-finance` · origem: módulo “landing”

Landing de fintech com hero centralizado e mockup de dashboard financeiro (saldo, receitas, gráfico de linha e lançamentos), integrações e planos.

**Estrutura**
- Ordem das seções: Header com Entrar → Hero centralizado → Mockup do dashboard em moldura de navegador → Recursos com minigráficos → Integrações → Planos e preços → Rodapé.
- Header: logotipo “Nexa”, navegação com “Produtos”, “Empresas”, “Preços”, “Ajuda”, ação “Entrar” (leva ao login) e CTA “Abrir conta grátis”.
- Mockup com 4 indicadores (saldo, receita, pagamentos agendados, gastos com cartões), gráfico de linha de fluxo de caixa e lista de últimos lançamentos.
- Hero centralizado com selo “Finanças da empresa em tempo real” e CTAs “Abrir conta grátis” e “Falar com vendas”.
- Selo de segurança (“Dados protegidos e criptografados”) abaixo dos CTAs.
- Header com navegação, “Entrar” e CTA de teste grátis.
- Hero com título e CTA seguido imediatamente por um mockup grande da interface em moldura de navegador.
- O mockup mostra barra lateral, indicadores (KPIs), gráfico principal e lista/tabela com dados fictícios realistas.
- Recursos em 3 colunas, cada um com um minigráfico.
- Grade de integrações com logotipos fictícios.
- Planos e preços em 3 colunas, com o plano do meio destacado.

**Propriedades**
- arquitetura: dashboard
- secoes: Header com Entrar → Hero centralizado → Mockup do dashboard em moldura de navegador → Recursos com minigráficos → Integrações → Planos e preços → Rodapé

**Medidas recomendadas (adaptáveis)**
- larguraMockup: ≈1040 px
- alturaMockup: ≈520 px
- larguraMaxConteudo: ≈1160 px

**Comportamento e estados**
- O mockup é uma composição estática (não interativa) com texto alternativo descritivo.
- Alternância mensal/anual nos preços (opcional), com aria-pressed.

**Responsividade deste item**
- A versão mobile do mockup mostra saldo em destaque, 2 indicadores e o gráfico de linha.
- No celular o mockup é trocado por uma versão mobile: indicadores em grade 2 × 2 e um gráfico, sem barra lateral.
- Planos empilham em 1 coluna, com o plano destacado primeiro.
- Integrações passam de 4 para 2 colunas; navegação em hambúrguer abaixo de 768 px.
- Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis.
- Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.

**Observações**
- Demonstração original: fundo #f6f8fb, texto #0e1a2b, primária #0f62fe, destaque #14b88a; títulos em Inter. Por padrão a landing herda a paleta global do projeto.
- Marca, textos e números são fictícios: substitua pelo conteúdo real mantendo a hierarquia e a composição.
- Ilustrações da demonstração são placeholders vetoriais; use imagens reais otimizadas com texto alternativo.
- Números financeiros fictícios: na implementação, formate moeda com Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).

### Login: Produto em destaque — Tela do produto ao lado do formulário

`id: produto-destaque` · origem: módulo “login”

Login com coluna visual (≈58%) em primarySoft com título curto e mockup do aplicativo, e coluna de formulário (≈42%).

**Estrutura**
- Coluna visual com fundo primarySoft, título de marketing curto e mockup do aplicativo com dados fictícios.
- Coluna de formulário em superfície, com logotipo acima do título.
- Textos da demonstração: título “Entre no seu espaço”, subtítulo “Seus painéis estão esperando por você.”.

**Medidas recomendadas (adaptáveis)**
- larguraFormulario: ≈360–400 px
- alturaInputs: ≈44 px (desktop) / 48 px (celular)
- colunaVisual: ≈58%
- colunaFormulario: ≈42%

**Comportamento e estados**
- Labels visíveis associados aos campos (label for/id). E-mail com type="email", inputMode="email" e autoComplete="username" (ou "email"); senha com autoComplete="current-password".
- Botão de mostrar/ocultar senha dentro do campo, com aria-label alternando “Mostrar senha”/“Ocultar senha” e aria-pressed.
- Validação ao enviar e ao sair do campo: mensagem abaixo do campo (aria-invalid + aria-describedby) e resumo no topo do formulário com role="alert".
- Erro de credenciais genérico (“E-mail ou senha incorretos”), sem revelar qual dos dois está errado.
- Link “Esqueci minha senha” perto do campo de senha, levando ao fluxo de recuperação por e-mail com mensagem neutra (“Se o e-mail existir, enviaremos um link”).
- Botão principal com estado de carregamento (“Entrando…”) e desabilitado durante o envio para evitar duplo clique.

**Responsividade deste item**
- No celular o mockup é ocultado; resta uma faixa de ≈120 px com o título de marketing no topo.
- Inputs com font-size ≥ 16 px e altura ≥ 48 px no celular (evita o zoom automático do iOS e facilita o toque).
- Com o teclado virtual aberto, o campo focado e o botão “Entrar” continuam visíveis (use 100dvh, sem height: 100vh fixo, e scroll-padding).
- Funciona a partir de 320 px de largura sem rolagem horizontal.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).
- Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.

**Observações**
- Esta tela é uma demonstração de interface. A autenticação real deve ser implementada pela IA com backend seguro: senhas com hash (Argon2id ou bcrypt), limitação de tentativas, sessão em cookie httpOnly + Secure + SameSite, proteção CSRF e HTTPS obrigatório.
- Cores, fontes, cantos e superfícies vêm da identidade global do projeto (tokens).
- A tela é uma demonstração de interface. Implemente a autenticação real com backend seguro (hash de senha, rate limit, tokens httpOnly, proteção CSRF).

### Cadastro: Página própria de cadastro — pagina-propria

`id: pagina-propria` · origem: módulo “cadastro”

Cadastro em página dedicada com nome, e-mail, senha, confirmação de senha, aceite dos termos e link de volta para o login.

**Estrutura**
- Página própria (rota /cadastro) com a mesma composição visual do login.
- Título “Crie sua conta”, subtítulo curto e campos em uma coluna.
- Checkbox obrigatório de aceite dos termos com links para Termos e Privacidade.
- Rodapé do formulário: “Já tem conta? Entrar”.
- Campos, na ordem: Nome completo, E-mail, Senha, Confirmar senha, Aceite dos termos.

**Propriedades**
- campos: Nome completo, E-mail, Senha, Confirmar senha, Aceite dos termos

**Medidas recomendadas (adaptáveis)**
- alturaInputs: ≈44 px (desktop) / 48 px (celular)
- espacoEntreCampos: ≈16 px

**Comportamento e estados**
- Validação ao sair de cada campo; “Confirmar senha” mostra erro “As senhas não coincidem” em tempo real após o primeiro envio.
- Indicador de força da senha (fraca/média/forte) com texto, não só cor.
- Botões mostrar/ocultar independentes nos dois campos de senha.
- Se o e-mail já existir, a mensagem é neutra e oferece “Entrar” ou “Recuperar senha”.
- Autocomplete: name, email, new-password (nos dois campos de senha).
- Estados de erro por campo, com mensagem clara abaixo do campo e resumo no topo em caso de envio inválido.
- Validação ao sair do campo e no envio; nunca apague o que a pessoa digitou.
- Botão para mostrar/ocultar senha e indicação dos requisitos de senha.
- Link de recuperação de senha visível na tela de login.
- Labels acessíveis (label for/id), autocomplete adequado (name, email, new-password, current-password, one-time-code).

**Responsividade deste item**
- No celular, uma coluna com 20 px de margem; o checkbox de termos tem área de toque de 44 px.
- O formulário rola normalmente com o teclado aberto; o campo focado fica visível (scroll-margin ≈ 96 px).
- Funciona a partir de 320 px sem rolagem horizontal.
- Layout adaptado ao teclado virtual: o campo focado e o botão de envio permanecem visíveis.
- Funciona em telas a partir de 320 px, com uma coluna no celular.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).

**Observações**
- Demonstração de interface: a criação de conta real deve ser feita pela IA com backend seguro — hash de senha (Argon2id/bcrypt), verificação de e-mail, limitação de tentativas, proteção contra bots (sem expor se um e-mail já existe), sessão em cookie httpOnly/Secure/SameSite e HTTPS.

### Layout desktop: Painel financeiro com rail — Múltiplas colunas e aplicações

`id: painel-financeiro-rail` · origem: módulo “desktop”

Rail integral com header, faixa fixa de indicadores financeiros e área de gráficos/lançamentos.

**Estrutura**
- grid-template-columns: 76px minmax(0, 1fr); grid-template-rows: 64px 112px minmax(0, 1fr).
- Rail integral de ≈76 px (ícones com tooltip).
- Faixa de indicadores de ≈112 px: 3–4 cartões de KPI (saldo, receitas, despesas, investimentos) com variação percentual e ícone de tendência.
- Conteúdo: gráfico de fluxo de caixa e tabela de lançamentos com valores alinhados à direita e fonte tabular (font-variant-numeric: tabular-nums).

**Propriedades**
- gridColumns: 76px 1fr
- gridRows: 64px 112px 1fr
- gridAreas: "rail header" "rail kpis" "rail content"
- gap: 0px
- padding: 0px
- regioes: rail (rail), header (header), kpis (panel), content (content)
- oneScreen: não

**Medidas recomendadas (adaptáveis)**
- rail: ≈76 px
- header: ≈64 px
- faixaDeIndicadores: ≈112 px

**Comportamento e estados**
- A faixa de indicadores permanece visível (sticky) enquanto os lançamentos rolam.
- Valores sensíveis podem ser ocultados por botão (olho), com aria-pressed.

**Responsividade deste item**
- 1024 px ou mais: rail de ≈76 px sempre visível, com ícones de 22–24 px, rótulo em tooltip e item ativo destacado.
- 1024–1279 px: indicadores em 3 cartões; o quarto vai para a área de conteúdo.
- 768–1023 px: o rail é mantido (≈64 px); painéis secundários recolhem e passam a abrir em sobreposição a partir de um botão no header.
- Abaixo de 768 px vale a arquitetura mobile escolhida separadamente no Studio: não converta a navegação desktop em drawer, rail ou bottom navigation por conta própria.

**Observações**
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
- No computador, use “Painel financeiro com rail”. No celular, use “Topbar com Bottom Navigation”. São decisões independentes: não derive uma da outra.
- Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (sidebar recolhida em rail ou menus colapsados); caso contrário, use a estrutura mobile.
- As regiões (header, sidebar, conteúdo, painéis) mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões.

## C. Navegação

### Header: Painel de Trabalho — Abas à esquerda, busca à direita

`id: painel-trabalho` · origem: módulo “navegacao”

Header de aplicação de 60 px com abas sublinhadas, campo de busca, notificações com popover e menu de perfil.

**Estrutura**
- Barra principal com 60 px de altura, largura total da janela (full width), padding horizontal de 24–32 px.
- Superfície: fundo navBg com borda inferior de 1 px (token border).
- Logo: símbolo quadrado de 28 px na cor primária + nome da marca em peso 700 (marca fictícia “Jacarandá” na prévia — substitua pela marca real).
- Navegação principal com 4 itens (Visão geral, Projetos, Tarefas, Relatórios): links com sublinhado de 2 px na cor primária sob o item ativo, encostado na base da barra; espaço entre itens de 20–24 px.
- Campo de busca compacto (≈ 220 px × 36 px) com ícone de lupa à esquerda e placeholder “Buscar…”.
- Ações: ícone de ajuda; sino de notificações com contador e popover; avatar circular de 32 px com menu de perfil.
- Disposição conforme a composição escolhida (ver “composicao”): A “Abas à esquerda, busca à direita” = logo e navegação juntos à esquerda; busca e ações empurradas para a direita; B “Busca no centro” = busca larga no centro como protagonista; navegação recolhida em um botão de menu ao lado do logo.

**Propriedades**
- flutuante: não
- fixo: sim
- composicao: Abas à esquerda, busca à direita: Logo + abas sublinhadas à esquerda; à direita, campo de busca compacto (≈ 220 px), ajuda, sino com contador e avatar.

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

**Observações**
- Todas as cores vêm dos tokens da identidade global (navBg, navText, navActive, primary, border…); nada de cores fixas.
- Use <header> com <nav aria-label="Principal"> e lista de links; o item da página atual recebe aria-current="page".

### Sidebar: Trilho de Ícones — Ícones no topo

`id: trilho-icones` · origem: módulo “navegacao”

Trilho escuro de 72 px só com ícones em quadros arredondados, tooltips com o rótulo e avatar no rodapé.

**Estrutura**
- Formato trilho compacto de 72 px, só ícones.
- Superfície: faixa escura invertida (derivada da cor de texto principal) com texto claro.
- Itens: Início, Busca, Projetos, Mensagens (2) | Relatórios, Configurações.
- Ícones: ícones de linha de 18 px (estilo de ícone do tema) antes do rótulo; itens de 36 px de altura com padding horizontal de 12 px.
- Títulos de grupo: sem títulos; grupos separados por fios de 1 px.
- Composição A: apenas o símbolo da marca no topo; bloco de perfil no rodapé (avatar, nome, cargo e menu ⋯ que abre para cima). Composição B: apenas o símbolo da marca no topo; alternador de tema claro/escuro no rodapé.

**Propriedades**
- formato: rail
- flutuante: não
- largura: ≈72 px
- composicao: Ícones no topo: Símbolo da marca no topo, ícones alinhados em cima com tooltips e avatar no rodapé.

**Medidas recomendadas (adaptáveis)**
- largura: 72 px
- altura dos itens: 36 px (44 px no celular)
- padding interno: 12 px
- ícones: 18–20 px
- raio dos itens: radiusMd do tema
- drawer no celular: min(85vw, 280 px)
- largura recolhida: 72 px

**Comportamento e estados**
- Item ativo: item ativo com o ícone dentro de um quadrado arredondado preenchido com primarySoft/primary. Clique marca o item como ativo (aria-current="page"); hover com fundo hover; foco visível com anel focusRing de 2 px.
- Trilho só com ícones: cada botão tem aria-label e mostra tooltip com o rótulo à direita (atraso de 300 ms no hover, imediato no foco).
- Menu do perfil abre para cima, dentro da altura da janela: Meu perfil, Preferências, Sair.
- Fixa: position: sticky; top: 0; height: 100dvh; a lista rola internamente (overflow-y: auto) quando não couber, mantendo topo e rodapé visíveis.

**Responsividade deste item**
- Desktop (≥ 1024 px): trilho compacto de 72 px, só ícones.
- De 768 a 1023 px: mantém o trilho de 72 px.
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

Paleta global: **Oceano Profundo**. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas.

| Grupo | Token | Nome | Valor |
| --- | --- | --- | --- |
| Marca | Cor primária | `primary` | #0b6e4f |
| Marca | Primária — hover | `primaryHover` | #035f91 |
| Marca | Primária — active | `primaryActive` | #025481 |
| Marca | Texto sobre primária | `onPrimary` | #ffffff |
| Marca | Primária suave | `primarySoft` | #e1edf4 |
| Marca | Cor secundária | `secondary` | #0e7490 |
| Marca | Texto sobre secundária | `onSecondary` | #ffffff |
| Marca | Cor de destaque | `accent` | #06b6d4 |
| Marca | Texto sobre destaque | `onAccent` | #111114 |
| Fundos e superfícies | Fundo principal | `bg` | #f0f9ff |
| Fundos e superfícies | Fundo secundário | `bgAlt` | #e8f0f6 |
| Fundos e superfícies | Superfície | `surface` | #ffffff |
| Fundos e superfícies | Superfície alternativa | `surfaceAlt` | #f5f5f5 |
| Texto | Texto principal | `text` | #0c1a2b |
| Texto | Texto secundário | `textMuted` | #636f7c |
| Texto | Texto desabilitado | `textDisabled` | #99a4ae |
| Texto | Placeholder | `placeholder` | #7e8a95 |
| Bordas e foco | Borda | `border` | #e6e6e6 |
| Bordas e foco | Borda forte | `borderStrong` | #c7c7c7 |
| Bordas e foco | Borda de foco (focus-visible) | `focusRing` | #0369a1 |
| Estados | Hover | `hover` | #f4f4f4 |
| Estados | Active | `active` | #ebebeb |
| Estados | Pressed | `pressed` | #e0e0e0 |
| Estados | Selected — fundo | `selected` | #e1edf4 |
| Estados | Selected — texto | `selectedText` | #0369a1 |
| Estados | Disabled — fundo | `disabled` | #f0f0f0 |
| Estados | Disabled — texto | `disabledText` | #9298a0 |
| Semânticos | Success | `success` | #117e39 |
| Semânticos | Success — fundo | `successBg` | #e3f4e9 |
| Semânticos | Warning | `warning` | #a85c04 |
| Semânticos | Warning — fundo | `warningBg` | #faefe1 |
| Semânticos | Error | `error` | #dc2626 |
| Semânticos | Error — fundo | `errorBg` | #fbe5e5 |
| Semânticos | Info | `info` | #2563eb |
| Semânticos | Info — fundo | `infoBg` | #e5ecfd |
| Links, ícones e navegação | Link | `link` | #0369a1 |
| Links, ícones e navegação | Link — hover | `linkHover` | #035989 |
| Links, ícones e navegação | Ícones | `icon` | #455260 |
| Links, ícones e navegação | Navegação — fundo | `navBg` | #0c4a6e |
| Links, ícones e navegação | Navegação — texto | `navText` | #cad7df |
| Links, ícones e navegação | Navegação — item ativo | `navActive` | #2e6382 |
| Links, ícones e navegação | Navegação — texto ativo | `navActiveText` | #ffffff |
| Gradiente | Gradiente — início | `gradientFrom` | #0369a1 |
| Gradiente | Gradiente — fim | `gradientTo` | #1fbdd8 |

Tokens ajustados manualmente pelo usuário: `primary` = #0b6e4f.

### Tipografia: Space Grotesk + Inter

`id: identity.typography` · origem: módulo “cores”

Títulos em Space Grotesk (peso 600) e textos em Inter (peso 400), tamanho base 16 px.

**Estrutura**
- Escala sugerida: 14 / 16 / 19 / 24 / 32 / 42 px.
- Altura de linha de 1.5 para textos e 1.2–1.3 para títulos.
- Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px.

**Propriedades**
- fonteTitulos: Space Grotesk
- fonteTexto: Inter
- tamanhoBase: 16
- pesoTitulos: 600
- pesoTexto: 400

**Responsividade deste item**
- Títulos grandes reduzem proporcionalmente no celular (use clamp()).
- Inputs com 16 px no celular para evitar zoom automático.

### Geometria e superfícies: Grandes (14 px) · Elevada (sombras)

`id: identity.geometry` · origem: módulo “cores”

Cantos grandes (14 px), bordas de 1 px, sombra sutil, superfícies elevada (sombras), densidade confortável.

**Estrutura**
- Escala de espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 20, 24, 32, 40.
- Sombras apenas no nível escolhido; elementos de conteúdo não devem parecer menus flutuantes.
- Ícones no estilo contorno (outline), tamanho consistente (16–20 px em interfaces).

**Propriedades**
- raioPequeno: 10px
- raioMedio: 14px
- raioGrande: 20px
- borda: 1px
- sombra: 0 1px 2px rgba(16,16,24,.06), 0 1px 3px rgba(16,16,24,.05)
- superficie: elevated
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

### Componente: Botões — Apple Precision

`id: botoes` · origem: módulo “componentes”

Botões na família visual Apple Precision. Botões com variantes (primário, secundário, fantasma, perigo), tamanhos, ícone opcional e estados completos. Estilo: Fonte do sistema, raio de 10 px, linhas finíssimas (1 px a baixa opacidade), fundo agrupado em cinza claro e superfícies brancas com sombra mínima.

**Estrutura**
- Conteúdo: [ícone] texto [ícone]; gap de 8 px; ícone de 16–18 px.
- Hierarquia: um primário por área; secundário ao lado com menos peso.
- Sempre <button> (ou <a> para navegação) com type correto.
- Fundo do contexto na cor de fundo secundária; listas e cards brancos agrupados com raio de 14 px.
- Campos tonais com raio de 10 px; controles com 38 px de altura.
- Controles segmentados com pílula branca elevada sobre trilho cinza.
- Ícones em ladrilhos coloridos (estilo ajustes do sistema) com ícone branco.
- Composição: Grupos inseridos (inset grouped), linhas com divisórias recuadas, hierarquia por peso.
- Acabamento: Linhas hairline, sombra mínima, materiais translúcidos apenas em barras.

**Propriedades**
- Família visual: 8. Apple Precision
- Texto do botão: Começar agora
- Ícone: Seta direita (lucide: ArrowRight)
- Posição do ícone: À direita
- Variante: Primário
- Mostrar botão secundário ao lado: sim
- Texto do secundário: Saiba mais
- Tamanho: Médio
- Largura total: não
- Carregando: não
- Raio dos controles: 10 px
- Raio dos contêineres: 14 px
- Borda: 1 px sólida (border)
- Sombra: sombra mínima (hairline) de 1 px
- Superfície: superfície = token surface
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Fonte do sistema 650
- Fonte de texto: Fonte do sistema
- Caixa de rótulos e botões: normal (sentence case)
- Tamanho base: 14 px
- Altura de controles: 38 px (mínimo 44 px de área de toque no celular)
- Densidade: confortável
- Ícones: lucide, traço 1.75 px, tratamento app-tile
- Indicador de ativo: pill

**Cores**
- Ação principal (fundo): #0b6e4f
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #0c1a2b
- Texto secundário: #636f7c
- Borda: #e6e6e6
- Destaque: #048da5
- Foco: #0369a1

**Medidas recomendadas (adaptáveis)**
- alturaSm: 32–36 px
- alturaMd: 40–44 px
- alturaLg: 48–52 px
- alturaDeControle: 38 px
- raio: 10 px / 14 px
- paddingInterno: 13 px

**Comportamento e estados**
- Hover: fundo primária-hover; active: primária-active + leve pressão; focus-visible com estilo de foco da família.
- Disabled: fundo/texto desabilitados, sem sombra; carregando: spinner no lugar do ícone e aria-busy.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover sutil (fundo +4%); active com opacidade 0,7.
- Foco com anel de 4 px na primária a 30%.
- Movimento: Preciso (200 ms) com curvas de mola discretas.

**Responsividade deste item**
- Altura mínima de 44 px no celular; em grupos, empilham com largura total quando não cabem lado a lado.
- No celular, listas ocupam a largura com margens de 16 px e cantos de 12 px; títulos grandes recolhem ao rolar.
- Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.

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
