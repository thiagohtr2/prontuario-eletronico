# Prompt — Componente: Dashboard financeiro

> Gerado pelo Atelier UI para o projeto “Nexo Capital” (Dashboard). Este prompt é autossuficiente: implemente somente este elemento, exatamente como descrito.

## Componente: Dashboard financeiro — Compact Pro

`id: dashboard` · origem: módulo “componentes”

Dashboard na família visual Compact Pro. Página de painel com cabeçalho, linha de KPIs, gráfico principal e lista/tabela de atividades. Estilo: Alta densidade: controles de 30 px, texto base de 13 px, raio de 4 px, bordas de 1 px sutis, sem sombras e números tabulares.

**Estrutura**
- Cabeçalho da página (título, período, ações) → KPIs → gráfico (2/3) + atividades (1/3).
- Usa a arquitetura desktop/mobile aprovada para a navegação.
- Altura de controles 30 px (44 px de área de toque no celular); padding reduzido em 25%.
- Texto base 13 px, rótulos 12 px; números com font-variant-numeric: tabular-nums.
- Raio de 4 px em controles e 6 px em contêineres; bordas de 1 px sutis.
- Item ativo marcado por sublinhado de 2 px; ícones de 14–16 px sem fundo.
- Composição: Informação densa em linhas e colunas alinhadas; barras de ferramentas compactas.
- Acabamento: Neutro e funcional; cor apenas para estado e ação.

**Propriedades**
- Família visual: 13. Compact Pro
- Título: Visão geral
- Quantidade de KPIs: 3
- Gráfico principal: Barras
- Mostrar menu lateral: sim
- Mostrar lista de atividades: sim
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
- Filtro de período atualiza todos os blocos; estados de carregando por bloco.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover com fundo de hover; atalhos de teclado visíveis.
- Foco com anel de 2 px.
- Movimento: Rápido (100 ms).

**Responsividade deste item**
- KPIs 4 → 2 → 1 colunas; gráfico e lista empilham; nada de overflow horizontal.
- No celular, aumente as áreas de toque para 44 px sem aumentar a fonte além de 16 px nos campos; tabelas viram cartões.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Nome dado pelo usuário: “Dashboard financeiro”.
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

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
