# Prompt — Header: Praça da Comunidade

> Gerado pelo Atelier UI para o projeto “Conecta” (Plataforma social mobile-first). Este prompt é autossuficiente: implemente somente este elemento, exatamente como descrito.

## Header: Praça da Comunidade — Ícones no centro

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

## Identidade herdada
- Paleta “Comunidade” (clara): primária #d6336c (texto #ffffff), secundária #7048e8, destaque #f59f00.
- Fundo #ffffff, superfície #ffffff, texto #1b1b1f, texto secundário #727274, borda #e6e6e6.
- Estados: hover #f4f4f4, active #ebebeb, selected #fae7ed/#bc2d5f, disabled #f0f0f0/#98989a, foco #d6336c.
- Semânticos: success #117e39, warning #a85c04, error #dc2626, info #2563eb.
- Tipografia: títulos Inter 650, textos Inter 400, base 15 px.
- Geometria: cantos “medium”, borda 1 px, sombra “none”, superfícies “outlined”, densidade “comfortable”.

## Responsividade obrigatória
Valide em 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px.
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

## Regras de implementação
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
