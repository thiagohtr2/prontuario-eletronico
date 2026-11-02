import type { CatalogItem } from '@/core/types'

/* -------------------------------------------------------------------------- */
/* Desktop                                                                     */
/* -------------------------------------------------------------------------- */

export type RegionKind =
  | 'header'
  | 'sidebar'
  | 'content'
  | 'panel'
  | 'submenu'
  | 'rail'
  | 'detail'
  | 'footer'
  | 'toolbar'
  | 'chat'

/** Rótulo didático exibido dentro dos desenhos (pode ser ocultado pelo usuário). */
export const REGION_LEGEND: Record<RegionKind, { label: string; color: string }> = {
  header: { label: 'HEADER', color: 'var(--legend-header)' },
  sidebar: { label: 'SIDEBAR', color: 'var(--legend-sidebar)' },
  content: { label: 'CONTEÚDO', color: 'var(--legend-content)' },
  panel: { label: 'PAINEL', color: 'var(--legend-panel)' },
  submenu: { label: 'SUBMENU', color: 'var(--legend-submenu)' },
  rail: { label: 'RAIL', color: 'var(--legend-rail)' },
  detail: { label: 'DETALHES', color: 'var(--legend-detail)' },
  footer: { label: 'RODAPÉ', color: 'var(--legend-footer)' },
  toolbar: { label: 'BARRA', color: 'var(--legend-header)' },
  chat: { label: 'CHAT', color: 'var(--legend-panel)' },
}

export type DesktopFamily =
  | 'sidebar-integral'
  | 'sidebar-flutuante'
  | 'rail-dupla'
  | 'direita'
  | 'sem-sidebar'
  | 'editorial'
  | 'multicoluna'
  | 'one-screen'

export const DESKTOP_FAMILIES: { id: DesktopFamily; name: string; description: string }[] = [
  { id: 'sidebar-integral', name: 'Sidebar integral', description: 'Menu lateral que ocupa toda a altura da aplicação, encostado na borda.' },
  { id: 'sidebar-flutuante', name: 'Sidebars flutuantes', description: 'Menus afastados das bordas, como ilhas, com espaço ao redor.' },
  { id: 'rail-dupla', name: 'Rail e navegação dupla', description: 'Trilho estreito de ícones, às vezes combinado com um segundo menu.' },
  { id: 'direita', name: 'Navegação à direita', description: 'Menus ou painéis posicionados no lado direito.' },
  { id: 'sem-sidebar', name: 'Sem sidebar', description: 'Toda a navegação fica no topo da página.' },
  { id: 'editorial', name: 'Editoriais', description: 'Composições de revista, portfólio e conteúdo de leitura.' },
  { id: 'multicoluna', name: 'Múltiplas colunas e aplicações', description: 'Dashboards, CRMs e ferramentas com vários painéis.' },
  { id: 'one-screen', name: 'One Screen', description: 'Tudo cabe em uma única tela, sem rolagem principal.' },
]

/**
 * Desenho de preenchimento usado pelo esquema didático dentro de uma região
 * (apenas visual; não altera a especificação). Sem `fill`, o desenho segue o `kind`.
 */
export type RegionFill =
  | 'dashboard'
  | 'cards'
  | 'products'
  | 'table'
  | 'list'
  | 'record'
  | 'hero'
  | 'editorial'
  | 'article'
  | 'gallery'
  | 'kanban'
  | 'document'
  | 'analytics'
  | 'tiles'
  | 'kiosk'
  | 'focus'
  | 'controls'
  | 'editor'
  | 'preview'
  | 'chat'
  | 'stats'
  | 'props'
  | 'activity'
  | 'filters'
  | 'console'
  | 'kpis'
  | 'tabs'
  | 'index'
  | 'transparent'

/**
 * Uma região do layout. A posição vem do grid do layout (`grid-template-areas`): o `id`
 * da região é o nome da área. Regiões com `overlay` são posicionadas por cima do grid
 * (ex.: header central flutuante sobre o conteúdo).
 */
export interface LayoutRegion {
  id: string
  kind: RegionKind
  /** Texto alternativo para a etiqueta (padrão: REGION_LEGEND[kind].label). */
  label?: string
  /** Visualmente separado das bordas, com cantos próprios. */
  floating?: boolean
  /** Rola de forma independente do restante da página. */
  scroll?: boolean
  /** Posicionamento absoluto sobre o grid (valores CSS em px ou %). */
  overlay?: { top?: string; right?: string; bottom?: string; left?: string; width?: string; height?: string }
  /** Desenho de preenchimento do esquema (opcional, apenas visual). */
  fill?: RegionFill
}

export interface DesktopGrid {
  /** `grid-template-columns` em px/fr, medido na referência de 1280 × 800. Ex.: '252px 1fr'. */
  columns: string
  /** `grid-template-rows`. Ex.: '64px 1fr'. */
  rows: string
  /** Linhas de `grid-template-areas`; cada nome é o `id` de uma região. Use '.' para vazio. */
  areas: string[]
  /** Espaço entre regiões em px (layouts flutuantes > 0). */
  gap: number
  /** Margem interna do canvas em px (layouts flutuantes > 0). */
  padding: number
}

export interface DesktopLayout extends CatalogItem {
  family: DesktopFamily
  grid: DesktopGrid
  regions: LayoutRegion[]
  /** Medidas recomendadas em px (não fixas). Ex.: { sidebar: 252, header: 64 }. */
  measurements: Partial<Record<'sidebar' | 'header' | 'rail' | 'panel' | 'submenu' | 'detail' | 'gap' | 'contentMax' | 'footer', number>>
  oneScreen?: boolean
}

/* -------------------------------------------------------------------------- */
/* Mobile                                                                      */
/* -------------------------------------------------------------------------- */

export type MobileGroup =
  | 'inferior'
  | 'flutuantes'
  | 'hibridos'
  | 'superior'
  | 'drawers'
  | 'lateral-compacta'
  | 'tela-cheia'
  | 'one-screen'

export const MOBILE_GROUPS: { id: MobileGroup; name: string; description: string }[] = [
  { id: 'inferior', name: 'Navegação inferior', description: 'Menu fixo embaixo, ao alcance do polegar.' },
  { id: 'flutuantes', name: 'Headers e menus flutuantes', description: 'Barras afastadas das bordas, como ilhas.' },
  { id: 'hibridos', name: 'Layouts híbridos', description: 'Combinações de header, stories, dock e drawer.' },
  { id: 'superior', name: 'Navegação superior', description: 'Menus e abas concentrados no topo.' },
  { id: 'drawers', name: 'Drawers e menus laterais', description: 'Menus escondidos que deslizam para dentro da tela.' },
  { id: 'lateral-compacta', name: 'Navegação lateral compacta', description: 'Trilhos finos sempre visíveis na lateral.' },
  { id: 'tela-cheia', name: 'Menus de tela cheia', description: 'O menu ocupa a tela inteira quando aberto.' },
  { id: 'one-screen', name: 'One Screen móvel', description: 'Tudo cabe na tela do celular, sem rolagem principal.' },
]

export type MobileTop =
  | 'none'
  | 'topbar'
  | 'topbar-hamburger'
  | 'topbar-tabs'
  | 'topbar-search'
  | 'topbar-profile'
  | 'topbar-large-title'
  | 'scroll-tabs'
  | 'floating'
  | 'island'
  | 'topbar-brand'
  | 'topbar-compact'

export type MobileBottom =
  | 'none'
  | 'bottom-nav'
  | 'bottom-nav-5'
  | 'bottom-fab'
  | 'bottom-minimal'
  | 'dock'
  | 'dock-pill'
  | 'dock-transparent'
  | 'dock-compact'
  | 'pill-label'
  | 'fab'
  | 'sheet-peek'

export type MobileSide =
  | 'none'
  | 'drawer-left'
  | 'drawer-right'
  | 'drawer-push'
  | 'mini-sidebar'
  | 'rail'
  | 'rail-expand'
  | 'rail-right'

export type MobileOverlay =
  | 'none'
  | 'bottom-sheet'
  | 'grouped-sheet'
  | 'fullscreen'
  | 'fullscreen-editorial'
  | 'app-grid'
  | 'command'
  | 'profile-menu'
  | 'dropdown'
  | 'top-sheet'
  | 'speed-dial'

/** Configuração composicional: o renderizador do celular monta a tela a partir destas peças. */
export interface MobileConfig {
  top: MobileTop
  bottom: MobileBottom
  side: MobileSide
  overlay: MobileOverlay
  /** Faixa horizontal de stories/categorias logo abaixo do header. */
  stories?: boolean
  /** Sem rolagem principal: o conteúdo é organizado para caber na viewport. */
  oneScreen?: boolean
  /** Título grande acima do conteúdo. */
  largeTitle?: boolean
  /** Formato da faixa horizontal: círculos (stories) ou pílulas de categorias. */
  storiesStyle?: 'circles' | 'categories'
  /** Organização do conteúdo da prévia (padrão: aplicativo com cartões e lista). */
  content?: 'default' | 'kiosk' | 'tabs'
}

export interface MobileLayout extends CatalogItem {
  group: MobileGroup
  config: MobileConfig
}
