import type { CatalogItem } from '@/core/types'

/** Uma das duas propostas de composição de cada modelo. */
export interface NavComposition {
  name: string
  description: string
}

/* -------------------------------------------------------------------------- */
/* Ícones (nomes neutros; o renderizador converte em componentes lucide)       */
/* -------------------------------------------------------------------------- */

export type NavIcon =
  | 'home'
  | 'grid'
  | 'chart'
  | 'users'
  | 'user'
  | 'folder'
  | 'file'
  | 'inbox'
  | 'calendar'
  | 'settings'
  | 'help'
  | 'bell'
  | 'search'
  | 'star'
  | 'tag'
  | 'cart'
  | 'box'
  | 'card'
  | 'wallet'
  | 'layers'
  | 'code'
  | 'terminal'
  | 'book'
  | 'message'
  | 'clock'
  | 'shield'
  | 'zap'
  | 'globe'
  | 'map'
  | 'heart'
  | 'image'
  | 'mail'
  | 'send'
  | 'archive'
  | 'trash'
  | 'list'
  | 'kanban'
  | 'database'
  | 'cpu'
  | 'graduation'
  | 'store'
  | 'truck'
  | 'receipt'
  | 'pie'
  | 'target'
  | 'flag'
  | 'bookmark'
  | 'compass'
  | 'pen'
  | 'palette'
  | 'puzzle'
  | 'rocket'
  | 'lock'
  | 'building'
  | 'briefcase'
  | 'activity'
  | 'git'
  | 'server'
  | 'cloud'
  | 'check'
  | 'megaphone'
  | 'gauge'
  | 'workflow'
  | 'bot'
  | 'pin'
  | 'history'
  | 'hash'
  | 'award'
  | 'trending'
  | 'plug'
  | 'key'
  | 'sliders'
  | 'newspaper'
  | 'film'
  | 'camera'
  | 'headphones'
  | 'ticket'
  | 'life'

/* -------------------------------------------------------------------------- */
/* Header                                                                      */
/* -------------------------------------------------------------------------- */

export interface HeaderNavEntry {
  label: string
  /** Abre um menu suspenso simples ou um mega menu (painel com colunas). */
  menu?: 'dropdown' | 'mega'
  /** Itens do menu suspenso (quando `menu === 'dropdown'`). */
  items?: string[]
  icon?: NavIcon
  badge?: string
}

/** Ações exibidas no header (normalmente à direita). */
export type HeaderAction =
  | 'cta'
  | 'cta-outline'
  | 'login'
  | 'notif'
  | 'profile'
  | 'profile-chip'
  | 'cart'
  | 'lang'
  | 'help'
  | 'apps'
  | 'theme'
  | 'favorite'
  | 'phone'
  | 'create'
  | 'location'
  | 'period'
  | 'export'
  | 'version'
  | 'status'
  | 'countdown'
  | 'avail'
  | 'segments'
  | 'sales'

export type HeaderLayout =
  /** Logo à esquerda, navegação centralizada, ações à direita. */
  | 'split'
  /** Logo e navegação juntos à esquerda; ações à direita. */
  | 'left'
  /** Logo à esquerda; navegação e ações juntas à direita. */
  | 'right'
  /** Navegação dividida: metade à esquerda, logo no centro, metade + ações à direita. */
  | 'center-logo'
  /** Duas faixas: logo centralizado em cima, navegação centralizada embaixo. */
  | 'stacked'
  /** Duas faixas: logo + busca + ações em cima, navegação alinhada à esquerda embaixo. */
  | 'two-row'
  /** Busca larga no centro como elemento principal. */
  | 'search-center'
  /** Só logo e um botão “Menu” que abre um painel com a navegação. */
  | 'menu-only'
  /** Botão “Menu” à esquerda, logo no centro, ações à direita. */
  | 'menu-left'
  /** Ilhas separadas (logo, navegação, ações) distribuídas na largura. */
  | 'islands'
  /** Logo solto à esquerda; navegação e ações em ilhas vizinhas à direita. */
  | 'islands-right'

export interface HeaderLook {
  /** Marca fictícia mostrada na prévia. */
  brand: string
  logo: 'mark' | 'word' | 'serif' | 'monogram' | 'mono' | 'badge' | 'outline' | 'big'
  /** Altura da barra principal em px. */
  height: number
  surface: 'solid' | 'bordered' | 'transparent' | 'glass' | 'brand' | 'inverse' | 'tinted' | 'gradient' | 'blend'
  shape: 'full' | 'floating' | 'islands' | 'contained'
  navStyle: 'plain' | 'underline' | 'pill' | 'segmented' | 'caps' | 'dot' | 'boxed' | 'numbered' | 'bold' | 'tabs' | 'blocks'
  nav: HeaderNavEntry[]
  density: 'tight' | 'normal' | 'airy'
  search?: 'field' | 'icon' | 'command' | 'wide'
  actions: HeaderAction[]
  cta?: string
  /** Faixa de anúncio acima do header. */
  announcement?: string
  /** Trilha de navegação (breadcrumbs). */
  breadcrumbs?: string[]
  /** Links utilitários de uma faixa superior fina (contato, idioma, área do cliente...). */
  utility?: string[]
  /** Largura máxima da barra flutuante em px (pílula estreita centralizada). */
  maxWidth?: number
  /** Anúncio em faixa acima do header (padrão) ou como selo dentro dele. */
  announceStyle?: 'bar' | 'pill'
  /** Trilha dentro da barra principal ou em uma faixa própria abaixo dela. */
  breadcrumbStyle?: 'inline' | 'row'
  /** Saudação personalizada exibida no lugar da navegação (apps logados). */
  greeting?: string
  /** Altura após rolar a página (header que encolhe). */
  shrink?: number
  /** Contexto da página de exemplo mostrada sob o header. */
  context: 'site' | 'app' | 'editorial' | 'store' | 'docs' | 'hero' | 'luxury' | 'event'
}

export interface HeaderComposition extends NavComposition {
  layout: HeaderLayout
  /** Partes do visual que mudam nesta composição (ex.: busca, ações, estilo da navegação). */
  patch?: Partial<Omit<HeaderLook, 'brand' | 'context'>>
}

export interface HeaderModel extends CatalogItem {
  /** Ids de filtros (ver HEADER_FILTERS). */
  filters: string[]
  compositions: [HeaderComposition, HeaderComposition]
  /** Header flutuante que se sobrepõe ao conteúdo (usado na detecção de contradições). */
  floating: boolean
  /** Header fixo no topo durante a rolagem. */
  sticky: boolean
  /** Receita visual (dados puros) usada pelo renderizador. */
  look: HeaderLook
}

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                     */
/* -------------------------------------------------------------------------- */

export interface SidebarItem {
  label: string
  icon: NavIcon
  badge?: string
  /** Subitens (submenu). */
  children?: string[]
  /** Bolinha colorida no lugar do ícone ou ao lado do rótulo. */
  dot?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'accent'
}

export interface SidebarGroup {
  title?: string
  items: SidebarItem[]
}

export interface SidebarLook {
  brand: string
  surface: 'nav' | 'plain' | 'alt' | 'inverse' | 'brand' | 'glass' | 'gradient' | 'tinted'
  itemStyle: 'pill' | 'bar' | 'block' | 'filled' | 'dot' | 'outline' | 'tile' | 'underline' | 'edge'
  density: 'compact' | 'normal' | 'airy'
  icons: 'line' | 'tile' | 'none' | 'dot'
  groupTitles: 'caps' | 'plain' | 'divider' | 'none'
  groups: SidebarGroup[]
  /** Sidebar dupla: o painel de segundo nível mostra estes grupos para o item ativo do trilho. */
  panel?: SidebarGroup[]
  /** Sidebar contextual: seções que trocam a lista inteira. */
  sections?: { label: string; icon: NavIcon; groups: SidebarGroup[] }[]
  /** Mostra o botão de recolher/expandir. */
  collapsible?: boolean
  /** Largura quando recolhida (px). */
  railWidth?: number
  /** Rótulos em fonte monoespaçada (estética técnica). */
  mono?: boolean
}

export interface SidebarArrangement {
  top: 'logo' | 'logo-search' | 'workspace' | 'search' | 'profile' | 'logo-cta' | 'project' | 'tabs' | 'mark'
  body?: 'groups' | 'flat' | 'tiles' | 'stepper'
  footer: 'profile' | 'profile-card' | 'upgrade' | 'meter' | 'links' | 'none' | 'collapse' | 'theme' | 'help-card' | 'workspace'
  /** Itens alinhados ao topo (padrão) ou centralizados na altura (cápsulas e trilhos). */
  align?: 'top' | 'center'
  /** Rótulos ao lado do ícone, abaixo dele (trilho rotulado) ou ocultos (só ícones). */
  labels?: 'side' | 'below' | 'hidden'
  /** Submenu abre dentro da lista (acordeão) ou ao lado (flyout). */
  submenu?: 'inline' | 'flyout'
  /** Expansão do trilho: por botão ou ao passar o mouse (sobrepondo o conteúdo). */
  expand?: 'toggle' | 'hover'
  /** Botão de ação principal no topo (ex.: “Novo projeto”). */
  cta?: string
  /** Separa a navegação em cartões flutuantes independentes. */
  cards?: boolean
  patch?: Partial<Omit<SidebarLook, 'brand'>>
}

export interface SidebarComposition extends NavComposition {
  arrangement: SidebarArrangement
}

export interface SidebarModel extends CatalogItem {
  filters: string[]
  compositions: [SidebarComposition, SidebarComposition]
  floating: boolean
  /** 'integral' ocupa toda a altura; 'rail' é estreita; 'dupla' tem dois níveis. */
  shape: 'integral' | 'flutuante' | 'rail' | 'dupla' | 'expansivel' | 'contextual'
  /** Largura recomendada em px. */
  width: number
  /** Receita visual (dados puros) usada pelo renderizador. */
  look: SidebarLook
}

export const HEADER_FILTERS: { id: string; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'flutuantes', label: 'Flutuantes' },
  { id: 'fixos', label: 'Fixos' },
  { id: 'minimalistas', label: 'Minimalistas' },
  { id: 'tecnologicos', label: 'Tecnológicos' },
  { id: 'corporativos', label: 'Corporativos' },
  { id: 'saas', label: 'SaaS' },
  { id: 'editoriais', label: 'Editoriais' },
  { id: 'criativos', label: 'Criativos' },
  { id: 'com-busca', label: 'Com busca' },
  { id: 'mega-menu', label: 'Com mega menu' },
  { id: 'compactos', label: 'Compactos' },
]

export const SIDEBAR_FILTERS: { id: string; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'flutuantes', label: 'Flutuantes' },
  { id: 'fixos', label: 'Fixas' },
  { id: 'minimalistas', label: 'Minimalistas' },
  { id: 'tecnologicos', label: 'Tecnológicas' },
  { id: 'corporativos', label: 'Corporativas' },
  { id: 'saas', label: 'SaaS' },
  { id: 'com-grupos', label: 'Com grupos' },
  { id: 'com-icones', label: 'Com ícones' },
  { id: 'compactos', label: 'Compactas' },
  { id: 'com-submenu', label: 'Com submenu' },
  { id: 'com-perfil', label: 'Com perfil' },
]
