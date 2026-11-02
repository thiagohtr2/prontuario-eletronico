# Prompt — Layout desktop: Painel operacional

> Gerado pelo Atelier UI para o projeto “Centro Operacional” (One Screen). Este prompt é autossuficiente: implemente somente este elemento, exatamente como descrito.

## Layout desktop: Painel operacional — One Screen

`id: one-screen-painel-operacional` · origem: módulo “desktop”

Painel operacional One Screen com grade de status, coluna de alertas com rolagem interna e barra de status fixa.

**Estrutura**
- O shell ocupa exatamente a viewport (height: 100dvh com fallback 100vh; overflow: hidden no body); as linhas do grid usam fr e minmax(0, 1fr) para dividir a altura disponível.
- grid-template-columns: minmax(0, 1fr) 304px; grid-template-rows: 52px minmax(0, 1fr) 32px.
- Grade central de blocos de status (filas, SLA, equipes) com cores semânticas acompanhadas de ícone e texto.
- Coluna de alertas de ≈304 px: lista cronológica com severidade; barra de status de ≈32 px com relógio, conexão e última atualização.

**Propriedades**
- gridColumns: 1fr 304px
- gridRows: 52px 1fr 32px
- gridAreas: "header header" "content panel" "footer footer"
- gap: 0px
- padding: 0px
- regioes: header (header), content (content), panel (panel), footer (footer)
- oneScreen: sim

**Medidas recomendadas (adaptáveis)**
- header: ≈52 px
- panel: ≈304 px
- footer: ≈32 px

**Comportamento e estados**
- Não há rolagem principal: cada painel com conteúdo variável rola internamente (overflow: auto; overscroll-behavior: contain), com indicação visual de que há mais conteúdo (sombra interna ou fade na borda).
- Conteúdo longo nunca é cortado nem escondido: listas usam rolagem interna ou paginação; textos quebram linha; números grandes usam clamp() para caber.
- Atualização em tempo real sem “pular” o layout: novos alertas entram no topo com animação discreta e aria-live="polite".

**Responsividade deste item**
- 1280 × 800 ou maior: grade + alertas visíveis.
- 1024–1279 px: alertas viram aba alternável com a grade.
- Altura útil menor que ≈640 px (notebook pequeno, janela reduzida ou zoom de 150–200%): o modo One Screen é desativado — o body volta a rolar e os painéis se empilham, sem esconder informação importante.
- Zoom do navegador até 200% e fonte ampliada do sistema: nenhum conteúdo some; prefira reorganizar (menos colunas) a reduzir a fonte.
- Abaixo de 768 px vale a arquitetura mobile escolhida separadamente no Studio: não converta a navegação desktop em drawer, rail ou bottom navigation por conta própria.

**Observações**
- One Screen ≠ One Page: aqui tudo deve caber na viewport sem rolagem da página; em One Page a página rola. Nunca use overflow: hidden para esconder conteúdo que não coube.
- As medidas são recomendações para 1280 × 800; adapte à tela e ao conteúdo preservando a estrutura escolhida.

## Identidade herdada
- Paleta “Neutro Essencial” (clara): primária #18181b (texto #ffffff), secundária #52525b, destaque #2563eb.
- Fundo #ffffff, superfície #ffffff, texto #18181b, texto secundário #707072, borda #e6e6e6.
- Estados: hover #f4f4f4, active #ebebeb, selected #e3e3e4/#18181b, disabled #f0f0f0/#979798, foco #18181b.
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
