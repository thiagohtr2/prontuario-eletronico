# Prompt — Componente: Cards

> Gerado pelo Atelier UI para o projeto “Atlas Workspace” (Aplicativo ou SaaS). Este prompt é autossuficiente: implemente somente este elemento, exatamente como descrito.

## Componente: Cards — Swiss Minimal

`id: cards` · origem: módulo “componentes”

Cards na família visual Swiss Minimal. Cartão de conteúdo com mídia, etiqueta, título, texto, metadados e ação. Estilo: Estilo tipográfico internacional: geometria reta (0 px), linhas de 1 px na cor do texto, nenhuma sombra e hierarquia feita só com tamanho, peso e caixa alta.

**Estrutura**
- Mídia (aspect-ratio 16/9) → etiqueta → título → texto (até 3 linhas) → rodapé com meta e ação.
- O cartão inteiro pode ser clicável (link estendido) sem aninhar botões.
- Raio 0 em tudo. Bordas de 1 px na cor do texto (tinta) para controles; divisórias de 1 px.
- Campos sublinhados (apenas linha inferior); rótulos em caixa alta com espaçamento de 0,08 em.
- Títulos pesados (750) com espaçamento negativo; sobretítulos numerados (01 —).
- Item ativo marcado por sublinhado de 2 px. Cor de destaque usada só em pequenos marcadores quadrados.
- Composição: Grid rígido alinhado à esquerda, muito espaço em branco, numeração e réguas de 1 px separando blocos.
- Acabamento: Sem sombras, sem gradientes, sem arredondamento. Contraste puro de tipografia.

**Propriedades**
- Família visual: 2. Swiss Minimal
- Título: Viagem a Lisboa
- Texto: 7 dias com roteiro guiado, hospedagem e passeios inclusos.
- Etiqueta: Novo
- Botão: Ver detalhes
- Ícone: Avião (lucide: Plane)
- Layout: Vertical
- Mostrar imagem/ilustração: sim
- Mostrar rodapé: sim
- Raio dos controles: 0 px
- Raio dos contêineres: 0 px
- Borda: 1 px sólida (cor do texto)
- Sombra: sem sombra em superfícies de conteúdo
- Superfície: superfície = token surface
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Inter 760
- Fonte de texto: Inter
- Caixa de rótulos e botões: caixa alta, espaçamento 0.08 em
- Tamanho base: 14 px
- Altura de controles: 40 px (mínimo 44 px de área de toque no celular)
- Densidade: confortável
- Ícones: lucide, traço 1.5 px, tratamento plain
- Indicador de ativo: underline

**Cores**
- Ação principal (fundo): #18181b
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #18181b
- Texto secundário: #707072
- Borda: #18181b
- Destaque: #2563eb
- Foco: #18181b

**Medidas recomendadas (adaptáveis)**
- alturaDeControle: 40 px
- raio: 0 px / 0 px
- paddingInterno: 14 px

**Comportamento e estados**
- Hover conforme a família (elevação, borda ou deslocamento); foco visível no link principal.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: contorno de 2 px em Texto principal (text) com afastamento de 2 px. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover inverte botões secundários (fundo tinta, texto claro).
- Foco com contorno de 2 px na cor do texto e afastamento de 2 px.
- Movimento: Mínimo: trocas instantâneas de cor (80 ms).

**Responsividade deste item**
- Altura definida pelo conteúdo; grade de cards reduz colunas (3 → 2 → 1); horizontal vira vertical no celular.
- No celular, reduza a escala tipográfica com clamp() mantendo o contraste de pesos; o grid vira uma coluna alinhada à esquerda.
- Cards: altura definida pelo conteúdo (sem alturas fixas que cortem texto); grade reduz colunas progressivamente.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

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
