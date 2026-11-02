# Prompt — Layout mobile: Drawer pela esquerda

> Gerado pelo Atelier UI para o projeto “Nexo Capital” (Dashboard). Este prompt é autossuficiente: implemente somente este elemento, exatamente como descrito.

## Layout mobile: Drawer pela esquerda — Drawers e menus laterais

`id: drawer-esquerda` · origem: módulo “mobile”

Topbar com hambúrguer à esquerda que abre drawer lateral esquerdo sobreposto ao conteúdo, com scrim.

**Estrutura**
- Topbar de ≈56 px com botão de menu à esquerda e título. A barra superior soma env(safe-area-inset-top) à própria altura, para não colidir com o entalhe da câmera.
- Drawer de ≈280 px (máx. 85% da largura) que desliza pela esquerda, ocupando a altura total (inclusive safe areas), com scrim escuro sobre o conteúdo.
- Conteúdo do drawer: cabeçalho com avatar, nome e botão Fechar; lista de destinos com ícone + rótulo (itens de 48 px); grupo secundário (configurações, ajuda) e “Sair” no rodapé.

**Propriedades**
- topo: topbar-hamburger
- inferior: none
- lateral: drawer-left
- sobreposicao: none
- stories: não
- oneScreen: não

**Medidas recomendadas (adaptáveis)**
- topbar: ≈56 px
- drawer: ≈280 px (máx. 85%)
- itens: 48 px

**Comportamento e estados**
- Ao abrir: foco vai para o botão Fechar ou o primeiro item (sem rolar a página), o foco fica preso dentro do menu e o conteúdo atrás recebe inert/aria-hidden; Esc, toque no scrim e o botão X fecham; ao fechar, o foco volta ao gatilho.
- Enquanto o menu está aberto, o body não rola (overflow: hidden) e o menu tem rolagem interna própria (overscroll-behavior: contain).
- Animação de 200–250 ms (ease-out) ao abrir e 150–200 ms ao fechar; com prefers-reduced-motion, apenas fade.
- Tocar em um destino navega e fecha o drawer.

**Responsividade deste item**
- 320–359 px: drawer com 85% da largura.
- Horizontal: drawer com ≈320 px e rolagem interna.
- A partir de 768 px passa a valer a arquitetura desktop escolhida no Studio; não estique este layout para tablet ou computador.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Observações**
- O drawer é sobreposto: o conteúdo não se move.

## Identidade herdada
- Paleta “Azul Institucional” (clara): primária #1d4ed8 (texto #ffffff), secundária #1e3a8a, destaque #0ea5e9.
- Fundo #f8fafc, superfície #ffffff, texto #0f172a, texto secundário #686d7a, borda #e6e6e6.
- Estados: hover #f4f4f4, active #ebebeb, selected #e4eafa/#1d4ed8, disabled #f0f0f0/#93979f, foco #1d4ed8.
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
