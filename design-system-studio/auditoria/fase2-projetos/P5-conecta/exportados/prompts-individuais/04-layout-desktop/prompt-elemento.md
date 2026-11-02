# Prompt — Layout desktop: Topbar integral fixa

> Gerado pelo Atelier UI para o projeto “Conecta” (Plataforma social mobile-first). Este prompt é autossuficiente: implemente somente este elemento, exatamente como descrito.

## Layout desktop: Topbar integral fixa — Sem sidebar

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
