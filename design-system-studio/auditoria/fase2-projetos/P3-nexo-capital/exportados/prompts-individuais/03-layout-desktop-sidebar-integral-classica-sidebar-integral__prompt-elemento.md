# Prompt — Layout desktop: Sidebar integral clássica

> Gerado pelo Atelier UI para o projeto “Nexo Capital” (Dashboard). Este prompt é autossuficiente: implemente somente este elemento, exatamente como descrito.

## Layout desktop: Sidebar integral clássica — Sidebar integral

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
