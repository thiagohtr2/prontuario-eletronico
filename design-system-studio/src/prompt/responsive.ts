/** Regras de responsividade obrigatórias, incluídas no Master Prompt e em todo prompt individual. */

export const REFERENCE_WIDTHS = [320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920]

/**
 * Breakpoints únicos do projeto. Todos os textos do prompt usam estes limites: celular até 767 px
 * (layout mobile), tablet de 768 a 1023 px (desktop compactado), desktop a partir de 1024 px.
 */
export const BREAKPOINTS = [
  { name: 'mobile', min: 0, max: 767, description: 'Celulares (até 767 px): layout mobile escolhido. Teste também 320–359 px.' },
  { name: 'tablet', min: 768, max: 1023, description: 'Tablets (768–1023 px): layout desktop compactado (sidebar em trilho, menus recolhidos em “Mais”).' },
  { name: 'desktop', min: 1024, max: 1439, description: 'Notebooks (1024–1439 px): layout desktop completo.' },
  { name: 'wide', min: 1440, max: null, description: 'Monitores grandes (1440 px ou mais): layout desktop com largura máxima de conteúdo.' },
]

export const GLOBAL_RESPONSIVE_RULES: string[] = [
  'Nenhum overflow horizontal involuntário em nenhuma largura de 320 px a 1920 px (inclusive larguras intermediárias).',
  'Nenhum texto cortado: use quebra de linha, `min-width: 0` em itens flex/grid e `overflow-wrap: anywhere` em conteúdos longos (e-mails, URLs, códigos).',
  'Nenhuma sobreposição indevida entre elementos, inclusive com o teclado virtual aberto.',
  'Alvos de toque com no mínimo 44 × 44 px no celular e espaçamento de pelo menos 8 px entre alvos adjacentes.',
  'Campos de formulário com fonte de pelo menos 16 px no celular (evita zoom automático no iOS).',
  'Imagens e mídias responsivas (`max-width: 100%`, `aspect-ratio` definido) sem distorção.',
  'Grids adaptáveis: reduza colunas progressivamente; nunca comprima cartões abaixo de uma largura legível.',
  'Suporte a zoom de até 200% e a fonte ampliada do sistema sem perda de conteúdo ou funcionalidade.',
  'Respeite as safe areas (`env(safe-area-inset-*)`) em barras fixas, docks e menus inferiores.',
  'Funcione na orientação horizontal do celular: barras fixas devem ocupar o mínimo da altura (referência: até ~25% somadas); se não couber, esconda-as ao rolar.',
  'Use `100dvh` (com fallback) em vez de `100vh` para alturas de tela cheia.',
  'Menus acessíveis por mouse, toque e teclado (Tab, Enter, Espaço, Esc), com foco visível.',
  'Respeite `prefers-reduced-motion` reduzindo animações.',
]

/** Regras por tipo de componente (seção 23.3 da especificação). */
export const COMPONENT_RESPONSIVE_RULES: Record<string, string[]> = {
  header: [
    'Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis.',
  ],
  sidebar: ['Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria).'],
  dropdown: ['Dropdowns e popovers: reposicione automaticamente para não sair da viewport; no celular podem virar bottom sheet.'],
  table: ['Tabelas: rolagem horizontal local dentro do próprio contêiner ou representação alternativa em cartões no celular; cabeçalho legível.'],
  form: ['Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).'],
  calendar: ['Calendários: no celular, ofereça modo de lista/agenda quando a grade mensal ficar apertada.'],
  modal: ['Modais: altura máxima de 90dvh com rolagem interna; botões de ação sempre acessíveis; no celular podem ocupar a tela ou virar bottom sheet.'],
  chart: ['Gráficos: adapte eixos, quantidade de rótulos, legendas (abaixo do gráfico no celular) e dimensões; nunca corte valores.'],
  button: ['Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.'],
  card: ['Cards: altura definida pelo conteúdo (sem alturas fixas que cortem texto); grade reduz colunas progressivamente.'],
  navigation: ['Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.'],
}

export const IMPLEMENTATION_RULES: string[] = [
  'Não modifique escolhas aprovadas nesta especificação sem solicitação explícita do usuário.',
  'Preserve a identidade global: todos os componentes usam os tokens definidos; exceções só onde estiverem listadas.',
  'Não adicione decoração por conta própria (sombras, gradientes, vidro, animações, cantos arredondados) além do especificado.',
  'Respeite a geometria escolhida: se a sidebar é integral, ela vai do topo à base; se é flutuante, tem afastamento das bordas. Não converta uma na outra.',
  'Evite overflow e colisões; valide em todas as larguras de referência.',
  'Mantenha consistência de espaçamentos (escala de 4 px), tipografia e estados de interação (hover, focus-visible, active, disabled, selected).',
  'Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários.',
  'Use componentes reutilizáveis e tokens centralizados (variáveis CSS ou tema); nada de cores fixas espalhadas pelo código.',
  'Garanta acessibilidade: HTML semântico, labels, contraste WCAG AA, navegação por teclado e leitores de tela.',
  'Teste o resultado (visual e funcional) em celular, tablet e desktop antes de concluir.',
]

/** Escolhe as regras específicas pertinentes a um item. */
export function rulesFor(kinds: string[]): string[] {
  const out = new Set<string>()
  for (const k of kinds) for (const r of COMPONENT_RESPONSIVE_RULES[k] ?? []) out.add(r)
  return [...out]
}
