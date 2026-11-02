import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import {
  BarChart3,
  BatteryFull,
  Bell,
  Bookmark,
  Calendar,
  ChevronDown,
  ChevronRight,
  Command,
  Compass,
  CreditCard,
  FileText,
  Folder,
  HelpCircle,
  Home,
  LayoutGrid,
  Lightbulb,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Signal,
  Star,
  Ticket,
  Upload,
  User,
  Users,
  Wallet,
  Wifi,
  X,
  type LucideIcon,
} from 'lucide-react'
import { isHex, withAlpha } from '@/core/color'
import { surfaceStyle } from '@/core/tokens'
import type { ResolvedTheme } from '@/core/types'
import type { MobileBottom, MobileConfig, MobileLayout, MobileOverlay, MobileTop } from './types'
import './layouts.css'

/* -------------------------------------------------------------------------- */
/* Tipos públicos                                                              */
/* -------------------------------------------------------------------------- */

export interface PhonePreviewProps {
  layout: MobileLayout
  theme: ResolvedTheme
  showLegends: boolean
  /** Largura da tela do celular em px (altura = 2 × largura). */
  width?: number
  interactive?: boolean
  /** 'full' (padrão) ou 'thumb': miniatura simplificada, com barras no lugar dos textos. */
  detail?: 'full' | 'thumb'
  /** Moldura do aparelho (padrão: true). */
  frame?: boolean
  /** Começa com o menu aberto (útil em miniaturas de drawers e menus de tela cheia). */
  initialOpen?: boolean
  /** data-testid da raiz (padrão: "phone-preview"). */
  testId?: string
  className?: string
}

/* -------------------------------------------------------------------------- */
/* Medidas de referência (tela de 360 × 720)                                   */
/* -------------------------------------------------------------------------- */

const BW = 360
const BH = 720
const STATUS = 32
const HOME = 20

const TOP_H: Record<MobileTop, number> = {
  none: 0,
  topbar: 56,
  'topbar-hamburger': 56,
  'topbar-tabs': 100,
  'topbar-search': 104,
  'topbar-profile': 64,
  'topbar-large-title': 96,
  'scroll-tabs': 96,
  floating: 0,
  island: 0,
  'topbar-brand': 56,
  'topbar-compact': 48,
}

const FLOAT_TOP: Partial<Record<MobileTop, number>> = { floating: 68, island: 56 }

const BOTTOM_FLOW: Partial<Record<MobileBottom, number>> = {
  'bottom-nav': 64,
  'bottom-nav-5': 64,
  'bottom-fab': 64,
  'bottom-minimal': 56,
  'sheet-peek': 64,
}

const BOTTOM_FLOAT: Partial<Record<MobileBottom, number>> = {
  dock: 64,
  'dock-transparent': 64,
  'dock-pill': 56,
  'pill-label': 60,
  'dock-compact': 52,
  fab: 56,
}

const SIDE_W: Partial<Record<MobileConfig['side'], number>> = { 'mini-sidebar': 72, rail: 56, 'rail-expand': 56 }

type MenuKind = 'drawer-left' | 'drawer-right' | 'drawer-push' | 'rail-expand' | Exclude<MobileOverlay, 'none'>
type Trigger = 'top-left' | 'top-right' | 'avatar' | 'search' | 'bottom-more' | 'fab' | 'peek' | 'rail'

const MORE_BOTTOMS = new Set<MobileBottom>(['bottom-nav', 'bottom-nav-5', 'bottom-minimal', 'dock', 'dock-transparent', 'dock-compact'])

/** Qual menu a configuração abre e onde fica o gatilho. */
export function phoneMenu(config: MobileConfig): { kind: MenuKind; trigger: Trigger } | null {
  if (config.side === 'drawer-left' || config.side === 'drawer-push') return { kind: config.side, trigger: 'top-left' }
  if (config.side === 'drawer-right') return { kind: 'drawer-right', trigger: 'top-right' }
  if (config.side === 'rail-expand') return { kind: 'rail-expand', trigger: 'rail' }
  switch (config.overlay) {
    case 'none':
      return null
    case 'profile-menu':
      return { kind: 'profile-menu', trigger: 'avatar' }
    case 'command':
      return { kind: 'command', trigger: 'search' }
    case 'speed-dial':
      return { kind: 'speed-dial', trigger: 'fab' }
    case 'bottom-sheet':
      return {
        kind: 'bottom-sheet',
        trigger: config.bottom === 'sheet-peek' ? 'peek' : MORE_BOTTOMS.has(config.bottom) ? 'bottom-more' : 'top-left',
      }
    case 'dropdown':
    case 'fullscreen-editorial':
    case 'app-grid':
      return { kind: config.overlay, trigger: 'top-right' }
    default:
      return { kind: config.overlay, trigger: 'top-left' }
  }
}

const THUMB_OPEN = new Set([
  'topbar-flutuante-compacta',
  'topbar-flutuante-drawer-esquerdo',
  'topbar-flutuante-drawer-direito',
  'menu-flutuante-compacto',
  'topbar-hamburguer',
  'header-menu-perfil',
  'sidebar-fina-expansivel',
])

/** Miniaturas que ficam mais claras com o menu aberto (drawers, menus de tela cheia…). */
export function thumbShowsMenu(layout: MobileLayout): boolean {
  if (!phoneMenu(layout.config)) return false
  return layout.group === 'drawers' || layout.group === 'tela-cheia' || THUMB_OPEN.has(layout.id)
}

const OVERLAY_LABEL: Record<MenuKind, string> = {
  'drawer-left': 'DRAWER',
  'drawer-right': 'DRAWER',
  'drawer-push': 'DRAWER',
  'rail-expand': 'RAIL EXPANDIDO',
  'bottom-sheet': 'BOTTOM SHEET',
  'grouped-sheet': 'MENU EM GRUPOS',
  fullscreen: 'MENU TELA CHEIA',
  'fullscreen-editorial': 'MENU TELA CHEIA',
  'app-grid': 'GRADE DE APPS',
  command: 'COMANDOS',
  'profile-menu': 'MENU DE PERFIL',
  dropdown: 'MENU SUSPENSO',
  'top-sheet': 'MENU SUPERIOR',
  'speed-dial': 'AÇÕES RÁPIDAS',
}

/* -------------------------------------------------------------------------- */
/* Primitivas                                                                  */
/* -------------------------------------------------------------------------- */

interface PhCtxValue {
  thumb: boolean
  interactive: boolean
}
const PhCtx = createContext<PhCtxValue>({ thumb: false, interactive: false })

/** Texto que vira barra na miniatura. */
function T({
  children,
  size = 14,
  weight = 400,
  color,
  head,
  w,
  style,
}: {
  children: string
  size?: number
  weight?: number
  color?: string
  head?: boolean
  w?: number | string
  style?: CSSProperties
}) {
  const { thumb } = useContext(PhCtx)
  if (thumb) {
    return (
      <span
        className="lay-ph-tb"
        style={{
          width: w ?? Math.min(240, Math.round(children.length * size * 0.5)),
          height: Math.max(3, size * 0.6),
          background: color ?? 'currentColor',
          opacity: weight >= 600 || head ? 0.7 : 0.32,
          ...style,
        }}
      />
    )
  }
  return (
    <span
      className="lay-ph-t"
      style={{
        fontSize: size,
        fontWeight: head ? 'var(--ph-head-w)' : weight,
        fontFamily: head ? 'var(--ph-head)' : undefined,
        color,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

function Ic({ i: Icon, size = 22, color, style }: { i: LucideIcon; size?: number; color?: string; style?: CSSProperties }) {
  const { thumb } = useContext(PhCtx)
  if (thumb) {
    return <span className="lay-ph-ib" style={{ width: size * 0.82, height: size * 0.82, borderRadius: size * 0.26, background: color ?? 'currentColor', ...style }} />
  }
  return <Icon size={size} strokeWidth={1.9} color={color} aria-hidden="true" style={{ flex: 'none', ...style }} />
}

interface TapProps {
  onClick?: () => void
  label?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
  pressed?: boolean
  current?: boolean
  expanded?: boolean
  haspopup?: 'menu' | 'dialog'
  testId?: string
  btnRef?: MutableRefObject<HTMLButtonElement | null>
  autoFocusTarget?: boolean
}

/** Botão real no modo interativo; elemento estático nas miniaturas (que já ficam dentro de um botão). */
function Tap({ onClick, label, className, style, children, pressed, current, expanded, haspopup, testId, btnRef, autoFocusTarget }: TapProps) {
  const { interactive } = useContext(PhCtx)
  if (!interactive) {
    return (
      <span className={className} style={style}>
        {children}
      </span>
    )
  }
  return (
    <button
      ref={btnRef}
      type="button"
      className={className}
      style={style}
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      aria-current={current ? 'page' : undefined}
      aria-expanded={expanded}
      aria-haspopup={haspopup}
      data-testid={testId}
      data-autofocus={autoFocusTarget ? '' : undefined}
    >
      {children}
    </button>
  )
}

function Avatar({ size = 36, text = 'MA', tone = 0 }: { size?: number; text?: string; tone?: number }) {
  const { thumb } = useContext(PhCtx)
  const bg = ['var(--ph-primary-soft)', 'var(--ph-surface-alt)', 'var(--ph-selected)'][tone % 3]
  return (
    <span className="lay-ph-avatar" style={{ width: size, height: size, background: bg, color: 'var(--ph-selected-text)', fontSize: size * 0.36 }}>
      {thumb ? null : text}
    </span>
  )
}

function Spark({ height = 56, area = true }: { height?: number; area?: boolean }) {
  const pts = '0,40 14,34 28,37 42,24 56,28 70,16 84,20 100,8'
  return (
    <svg className="lay-ph-svg" viewBox="0 0 100 48" preserveAspectRatio="none" style={{ height }} aria-hidden="true">
      {area && <polygon points={`0,48 ${pts} 100,48`} fill="var(--ph-primary-soft)" />}
      <polyline points={pts} fill="none" stroke="var(--ph-primary)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function MiniBars({ n = 6 }: { n?: number }) {
  const hs = [40, 64, 48, 82, 58, 72, 36, 90]
  return (
    <span className="lay-ph-bars">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} style={{ height: `${hs[i % hs.length]}%`, background: i === 3 ? 'var(--ph-primary)' : 'var(--ph-primary-soft)' }} />
      ))}
    </span>
  )
}

function Progress({ pct = 72 }: { pct?: number }) {
  return (
    <span className="lay-ph-progress">
      <i style={{ width: `${pct}%` }} />
    </span>
  )
}

function Chip({ label, color, style }: { label: string; color: string; style: CSSProperties }) {
  return (
    <span className="lay-chip lay-ph-chip" style={{ background: color, ...style }} aria-hidden="true">
      {label}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Dados fictícios                                                             */
/* -------------------------------------------------------------------------- */

interface NavItem {
  label: string
  icon: LucideIcon
  more?: boolean
  badge?: number
}

const NAV4: NavItem[] = [
  { label: 'Início', icon: Home },
  { label: 'Buscar', icon: Search },
  { label: 'Agenda', icon: Calendar },
  { label: 'Perfil', icon: User },
]
const NAV5: NavItem[] = [
  { label: 'Início', icon: Home },
  { label: 'Buscar', icon: Search },
  { label: 'Categorias', icon: LayoutGrid },
  { label: 'Carrinho', icon: ShoppingBag, badge: 2 },
  { label: 'Conta', icon: User },
]
const DOCK: NavItem[] = [
  { label: 'Início', icon: Home },
  { label: 'Explorar', icon: Compass },
  { label: 'Salvos', icon: Bookmark },
  { label: 'Perfil', icon: User },
]
const MORE: NavItem = { label: 'Mais', icon: MoreHorizontal, more: true }

const RAIL_ITEMS: NavItem[] = [
  { label: 'Início', icon: Home },
  { label: 'Buscar', icon: Search },
  { label: 'Agenda', icon: Calendar },
  { label: 'Equipe', icon: Users },
  { label: 'Ajustes', icon: Settings },
]

const LIST = [
  { t: 'Pedido #1042', s: 'Confirmado há 5 min', v: 'R$ 289', a: 'P1' },
  { t: 'Marina Alves', s: 'Nova cliente', v: 'Hoje', a: 'MA' },
  { t: 'Relatório semanal', s: 'Pronto para baixar', v: 'PDF', a: 'RS' },
  { t: 'Reunião de equipe', s: 'Amanhã, 9h', v: '9:00', a: 'RE' },
  { t: 'Pagamento recebido', s: 'Cartão final 4821', v: 'R$ 1.200', a: 'PG' },
  { t: 'Estoque atualizado', s: '12 itens repostos', v: '+12', a: 'ES' },
]

const DRAWER_ITEMS: NavItem[] = [
  { label: 'Início', icon: Home },
  { label: 'Pedidos', icon: Package },
  { label: 'Clientes', icon: Users },
  { label: 'Relatórios', icon: BarChart3 },
  { label: 'Agenda', icon: Calendar },
]

/* -------------------------------------------------------------------------- */
/* Componente                                                                  */
/* -------------------------------------------------------------------------- */

function themeVars(theme: ResolvedTheme): CSSProperties {
  const t = theme.tokens
  const m = theme.metrics
  const r = (n: number) => `${Math.min(n, 28)}px`
  return {
    '--ph-bg': t.bg,
    '--ph-bg-alt': t.bgAlt,
    '--ph-surface': t.surface,
    '--ph-surface-alt': t.surfaceAlt,
    '--ph-text': t.text,
    '--ph-muted': t.textMuted,
    '--ph-border': t.border,
    '--ph-primary': t.primary,
    '--ph-on-primary': t.onPrimary,
    '--ph-primary-soft': t.primarySoft,
    '--ph-accent': t.accent,
    '--ph-nav-bg': t.navBg,
    '--ph-nav-text': t.navText,
    '--ph-nav-active': t.navActive,
    '--ph-nav-active-text': t.navActiveText,
    '--ph-success': t.success,
    '--ph-success-bg': t.successBg,
    '--ph-error': t.error,
    '--ph-selected': t.selected,
    '--ph-selected-text': t.selectedText,
    '--ph-icon': t.icon,
    '--ph-glass': isHex(t.surface) ? withAlpha(t.surface, 0.62) : t.surface,
    '--ph-scrim': 'rgba(12, 12, 18, 0.46)',
    '--ph-r-sm': r(m.radiusSm),
    '--ph-r-md': r(m.radiusMd),
    '--ph-r-lg': r(m.radiusLg),
    '--ph-font': m.bodyFont,
    '--ph-head': m.headingFont,
    '--ph-head-w': String(theme.typography.headingWeight),
    '--ph-bw': `${Math.max(1, m.borderWidth)}px`,
  } as CSSProperties
}

function trapTab(e: ReactKeyboardEvent, root: HTMLElement | null) {
  if (!root) return
  const els = root.querySelectorAll<HTMLElement>('button:not([disabled]), input, [href], [tabindex]:not([tabindex="-1"])')
  if (els.length === 0) return
  const first = els[0]
  const last = els[els.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus({ preventScroll: true })
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus({ preventScroll: true })
  }
}

/**
 * Celular composicional: monta a tela a partir de `layout.config` (barra superior,
 * stories, conteúdo, barra inferior/dock, trilhos laterais e menus sobrepostos).
 * Desenhado em 360 × 720 e escalado para a largura pedida.
 */
export const PhonePreview = memo(function PhonePreview({
  layout,
  theme,
  showLegends,
  width = 360,
  interactive = false,
  detail = 'full',
  frame = true,
  initialOpen = false,
  testId = 'phone-preview',
  className,
}: PhonePreviewProps) {
  const cfg = layout.config
  const menu = phoneMenu(cfg)
  const thumb = detail === 'thumb'
  const [open, setOpen] = useState(Boolean(initialOpen && menu))
  const [nav, setNav] = useState(0)
  const [tab, setTab] = useState(0)
  const [chipSel, setChipSel] = useState(0)
  const [query, setQuery] = useState('')
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  // Trocar de layout reinicia apenas o estado interno (sem remontar o componente).
  useEffect(() => {
    setOpen(Boolean(initialOpen && phoneMenu(layout.config)))
    setNav(0)
    setTab(0)
    setChipSel(0)
    setQuery('')
    if (contentRef.current) contentRef.current.scrollTop = 0
  }, [layout.id, layout.config, initialOpen])

  useEffect(() => {
    if (!interactive || !open) return
    const id = requestAnimationFrame(() => {
      const target = overlayRef.current?.querySelector<HTMLElement>('[data-autofocus]') ?? overlayRef.current?.querySelector<HTMLElement>('button, input')
      target?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(id)
  }, [open, interactive])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }))
  }, [])
  const toggle = useCallback(() => (open ? close() : setOpen(true)), [open, close])

  const onOverlayKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      close()
    } else if (e.key === 'Tab') trapTab(e, overlayRef.current)
  }

  const vars = useMemo(() => themeVars(theme), [theme])
  const card = useMemo<CSSProperties>(() => ({ ...surfaceStyle(theme), borderRadius: 'var(--ph-r-lg)' }), [theme])

  // ----- medidas -----
  const topH = TOP_H[cfg.top]
  const floatTop = FLOAT_TOP[cfg.top] ?? 0
  const storiesH = cfg.stories ? (cfg.storiesStyle === 'categories' ? 56 : 92) : 0
  const flowBottom = BOTTOM_FLOW[cfg.bottom] ?? 0
  const floatBottom = BOTTOM_FLOAT[cfg.bottom] ?? 0
  const sideL = SIDE_W[cfg.side] ?? 0
  const sideR = cfg.side === 'rail-right' ? 64 : 0
  const bottomBlock = flowBottom ? flowBottom + HOME : 0
  const contentPadBottom = floatBottom ? floatBottom + HOME + 28 : flowBottom ? 16 : HOME + 12
  const middleTop = STATUS + topH + storiesH
  const middleBottom = BH - bottomBlock

  const scale = width / BW
  const W = Math.round(width)
  const H = Math.round(width * 2)
  const bezel = frame ? Math.max(3, Math.round(10 * scale)) : 0

  const pushOpen = open && menu?.kind === 'drawer-push'
  const hideBody = open && menu && !['dropdown', 'top-sheet', 'speed-dial', 'profile-menu', 'rail-expand'].includes(menu.kind)

  const ctxValue = useMemo(() => ({ thumb, interactive }), [thumb, interactive])

  // ----- gatilho do menu -----
  const triggerProps = (place: Trigger): Partial<TapProps> | null =>
    menu && menu.trigger === place
      ? {
          onClick: toggle,
          expanded: open,
          haspopup: menu.kind === 'profile-menu' ? 'menu' : 'dialog',
          testId: interactive ? 'phone-menu-trigger' : undefined,
          btnRef: triggerRef,
          label: open ? 'Fechar menu' : 'Abrir menu',
        }
      : null

  const menuIcon = (place: 'top-left' | 'top-right') => {
    const p = triggerProps(place)
    if (!p) return null
    const icon = menu?.kind === 'app-grid' ? LayoutGrid : Menu
    return (
      <Tap className="lay-ph-icon-btn" {...p}>
        <Ic i={icon} size={24} />
      </Tap>
    )
  }

  /* ------------------------------ Barra superior ------------------------------ */

  const brand = (
    <span className="lay-ph-brand">
      <span className="lay-ph-logo" />
      <T size={17} head>
        Orla
      </T>
    </span>
  )

  const iconBtn = (icon: LucideIcon, label: string, badge = false) => (
    <Tap className="lay-ph-icon-btn" label={label}>
      <Ic i={icon} size={22} />
      {badge && <span className="lay-ph-badge" />}
    </Tap>
  )

  const titleText = cfg.oneScreen ? 'Painel' : 'Início'

  const searchField = (command: boolean) => {
    const p = command ? triggerProps('search') : null
    return (
      <Tap className="lay-ph-search" {...(p ?? { label: 'Buscar' })}>
        <Ic i={Search} size={18} />
        <T size={14} color="var(--ph-muted)">
          {command ? 'Buscar ou executar…' : 'Buscar produtos e pedidos'}
        </T>
        {command && !thumb && (
          <span className="lay-ph-kbd">
            <Command size={12} aria-hidden="true" />K
          </span>
        )}
      </Tap>
    )
  }

  const tabsRow = (labels: string[]) => (
    <div className="lay-ph-tabs" role={interactive ? 'tablist' : undefined}>
      {labels.map((l, i) => (
        <Tap key={l} className="lay-ph-tab" pressed={interactive ? i === tab : undefined} onClick={() => setTab(i)} style={{ color: i === tab ? 'var(--ph-primary)' : 'var(--ph-muted)' }}>
          <T size={14} weight={i === tab ? 650 : 500}>
            {l}
          </T>
          {i === tab && <i className="lay-ph-tab-ind" />}
        </Tap>
      ))}
    </div>
  )

  let topBar: ReactNode = null
  switch (cfg.top) {
    case 'topbar':
    case 'topbar-hamburger':
      topBar = (
        <div className="lay-ph-top" style={{ height: 56 }}>
          {menuIcon('top-left')}
          {cfg.top === 'topbar-hamburger' && !triggerProps('top-left') ? brand : null}
          {cfg.top === 'topbar' ? (
            <T size={18} head w={90}>
              {titleText}
            </T>
          ) : triggerProps('top-left') ? (
            brand
          ) : null}
          <span className="lay-ph-grow" />
          {cfg.top === 'topbar' && !menu && iconBtn(Bell, 'Notificações', true)}
          {cfg.top === 'topbar' && menu && menu.trigger !== 'top-right' && iconBtn(Search, 'Buscar')}
          {cfg.top === 'topbar-hamburger' && menu?.trigger === 'top-left' && iconBtn(Search, 'Buscar')}
          {menuIcon('top-right')}
        </div>
      )
      break
    case 'topbar-brand':
      topBar = (
        <div className="lay-ph-top" style={{ height: 56 }}>
          {menuIcon('top-left')}
          {brand}
          <span className="lay-ph-grow" />
          {iconBtn(Search, 'Buscar')}
          {iconBtn(Bell, 'Notificações', true)}
          <Avatar size={30} />
        </div>
      )
      break
    case 'topbar-compact':
      topBar = (
        <div className="lay-ph-top" style={{ height: 48, gap: 10 }}>
          <Avatar size={32} />
          <T size={14} weight={600}>
            Marina Alves
          </T>
          <span className="lay-ph-grow" />
          {iconBtn(Bell, 'Notificações', true)}
        </div>
      )
      break
    case 'topbar-profile': {
      const p = triggerProps('avatar')
      topBar = (
        <div className="lay-ph-top" style={{ height: 64 }}>
          <span className="lay-ph-stack">
            <T size={12.5} color="var(--ph-muted)">
              Bom dia,
            </T>
            <T size={19} head>
              Marina
            </T>
          </span>
          <span className="lay-ph-grow" />
          {iconBtn(Bell, 'Notificações', true)}
          <Tap className="lay-ph-avatar-btn" {...(p ?? { label: 'Perfil' })}>
            <Avatar size={40} />
          </Tap>
        </div>
      )
      break
    }
    case 'topbar-large-title':
      topBar = (
        <div className="lay-ph-top lay-ph-top--large">
          <div className="lay-ph-row" style={{ height: 44 }}>
            {menuIcon('top-left')}
            <span className="lay-ph-grow" />
            {iconBtn(Search, 'Buscar')}
            {iconBtn(Plus, 'Adicionar')}
          </div>
          <T size={30} head w={130} style={{ lineHeight: '44px' }}>
            {titleText}
          </T>
        </div>
      )
      break
    case 'topbar-tabs':
      topBar = (
        <div className="lay-ph-top lay-ph-top--stack">
          <div className="lay-ph-row" style={{ height: 56 }}>
            {menuIcon('top-left')}
            <T size={18} head>
              {cfg.oneScreen ? 'Painel' : 'Projetos'}
            </T>
            <span className="lay-ph-grow" />
            {iconBtn(Search, 'Buscar')}
            {menuIcon('top-right')}
          </div>
          {tabsRow(cfg.oneScreen ? ['Hoje', 'Semana', 'Mês'] : ['Todos', 'Recentes', 'Favoritos'])}
        </div>
      )
      break
    case 'topbar-search':
      topBar = (
        <div className="lay-ph-top lay-ph-top--stack">
          <div className="lay-ph-row" style={{ height: 52 }}>
            {menuIcon('top-left')}
            {brand}
            <span className="lay-ph-grow" />
            {iconBtn(Bell, 'Notificações', true)}
            {menuIcon('top-right')}
          </div>
          <div style={{ padding: '0 16px 8px' }}>{searchField(menu?.trigger === 'search')}</div>
        </div>
      )
      break
    case 'scroll-tabs':
      topBar = (
        <div className="lay-ph-top lay-ph-top--stack">
          <div className="lay-ph-row" style={{ height: 52 }}>
            {menuIcon('top-left')}
            <T size={20} head>
              Jornal Orla
            </T>
            <span className="lay-ph-grow" />
            {iconBtn(Search, 'Buscar')}
          </div>
          <div className="lay-ph-chiprow" style={{ height: 44 }}>
            {['Destaques', 'Economia', 'Tecnologia', 'Cultura', 'Esportes', 'Saúde'].map((l, i) => (
              <Tap key={l} className="lay-ph-pill" pressed={interactive ? i === chipSel : undefined} onClick={() => setChipSel(i)} style={i === chipSel ? { background: 'var(--ph-text)', color: 'var(--ph-bg)', borderColor: 'transparent' } : undefined}>
                <T size={13.5} weight={i === chipSel ? 600 : 500}>
                  {l}
                </T>
              </Tap>
            ))}
          </div>
        </div>
      )
      break
    default:
      topBar = null
  }

  let floatingTop: ReactNode = null
  if (cfg.top === 'floating') {
    floatingTop = (
      <div className="lay-ph-float-top" style={{ ...card, borderRadius: 18 }}>
        {menuIcon('top-left')}
        {brand}
        <span className="lay-ph-grow" />
        {menu?.kind === 'dropdown' && (
          <span className="lay-ph-cta">
            <T size={13} weight={600} color="var(--ph-on-primary)">
              Começar
            </T>
          </span>
        )}
        {!menu && iconBtn(Bell, 'Notificações', true)}
        {menu?.trigger === 'top-left' && iconBtn(Search, 'Buscar')}
        {menuIcon('top-right')}
      </div>
    )
  } else if (cfg.top === 'island') {
    floatingTop = (
      <div className="lay-ph-island" style={{ ...card, borderRadius: 999 }}>
        <span className="lay-ph-logo" style={{ width: 20, height: 20 }} />
        <T size={14} weight={600}>
          Para você
        </T>
        <Ic i={ChevronDown} size={16} />
      </div>
    )
  }

  /* --------------------------------- Stories --------------------------------- */

  const stories = cfg.stories ? (
    cfg.storiesStyle === 'categories' ? (
      <div className="lay-ph-chiprow lay-ph-cats" style={{ height: 56 }}>
        {[
          { l: 'Tudo', i: LayoutGrid },
          { l: 'Mercado', i: ShoppingBag },
          { l: 'Farmácia', i: Shield },
          { l: 'Casa', i: Home },
          { l: 'Pets', i: Star },
          { l: 'Moda', i: Ticket },
        ].map((c, i) => (
          <Tap key={c.l} className="lay-ph-pill lay-ph-pill--cat" pressed={interactive ? i === chipSel : undefined} onClick={() => setChipSel(i)} style={i === chipSel ? { background: 'var(--ph-primary)', color: 'var(--ph-on-primary)', borderColor: 'transparent' } : undefined}>
            <Ic i={c.i} size={16} />
            <T size={13.5} weight={i === chipSel ? 600 : 500}>
              {c.l}
            </T>
          </Tap>
        ))}
      </div>
    ) : (
      <div className="lay-ph-stories" style={{ height: 92 }}>
        {['Você', 'Novidades', 'Ofertas', 'Equipe', 'Eventos', 'Dicas'].map((l, i) => (
          <Tap key={l} className="lay-ph-story" label={i === 0 ? 'Seu destaque' : `Destaque: ${l}`}>
            <span className="lay-ph-story-ring" style={i === 0 ? { background: 'var(--ph-border)' } : undefined}>
              <span className="lay-ph-story-in" style={{ background: ['var(--ph-surface-alt)', 'var(--ph-primary-soft)', 'var(--ph-selected)'][i % 3] }}>
                {i === 0 && <Ic i={Plus} size={18} color="var(--ph-primary)" />}
              </span>
            </span>
            <T size={12} w={40}>
              {l}
            </T>
          </Tap>
        ))}
      </div>
    )
  ) : null

  /* --------------------------------- Conteúdo -------------------------------- */

  const largeTitleInContent = cfg.largeTitle && cfg.top === 'none'

  let content: ReactNode
  if (cfg.oneScreen && cfg.content === 'kiosk') {
    content = (
      <div className="lay-ph-one" style={{ paddingBottom: contentPadBottom }}>
        <div className="lay-ph-stack" style={{ gap: 4 }}>
          <T size={24} head>
            Bem-vindo!
          </T>
          <T size={15} color="var(--ph-muted)">
            O que você deseja fazer?
          </T>
        </div>
        <div className="lay-ph-grid2 lay-ph-fill" style={{ gridTemplateRows: 'repeat(2, minmax(0, 1fr))' }}>
          {[
            { l: 'Fazer pedido', i: ShoppingBag },
            { l: 'Retirar', i: Package },
            { l: 'Pagamento', i: CreditCard },
            { l: 'Ajuda', i: HelpCircle },
          ].map((b, i) => (
            <Tap
              key={b.l}
              className="lay-ph-kiosk-btn"
              style={i === 0 ? { background: 'var(--ph-primary)', color: 'var(--ph-on-primary)', borderRadius: 'var(--ph-r-lg)', border: 'none' } : { ...card, color: 'var(--ph-text)' }}
            >
              <Ic i={b.i} size={36} />
              <T size={17} weight={650}>
                {b.l}
              </T>
            </Tap>
          ))}
        </div>
      </div>
    )
  } else if (cfg.oneScreen) {
    const tiles = [
      { l: 'Vendas', v: ['R$ 8,4 mil', 'R$ 52 mil', 'R$ 214 mil'][tab] ?? 'R$ 8,4 mil', viz: <Spark height={30} /> },
      { l: 'Pedidos', v: ['128', '864', '3.420'][tab] ?? '128', viz: <MiniBars /> },
      { l: 'Meta', v: ['72%', '64%', '81%'][tab] ?? '72%', viz: <Progress pct={[72, 64, 81][tab] ?? 72} /> },
      { l: 'Clientes', v: ['64', '312', '1.180'][tab] ?? '64', viz: <Spark height={30} area={false} /> },
      { l: 'Chamados', v: ['12', '58', '240'][tab] ?? '12', viz: <MiniBars n={5} /> },
      { l: 'Satisfação', v: '4,8', viz: <Progress pct={92} /> },
    ]
    const tabsMode = cfg.content === 'tabs'
    content = (
      <div className="lay-ph-one" style={{ paddingBottom: contentPadBottom }}>
        {tabsMode ? (
          <div className="lay-ph-card lay-ph-highlight" style={{ background: 'var(--ph-primary)', color: 'var(--ph-on-primary)', borderRadius: 'var(--ph-r-lg)' }}>
            <T size={13} color="currentColor">
              {['Receita de hoje', 'Receita da semana', 'Receita do mês'][tab] ?? 'Receita'}
            </T>
            <T size={28} head color="currentColor">
              {['R$ 8.420', 'R$ 52.180', 'R$ 214.900'][tab] ?? 'R$ 8.420'}
            </T>
          </div>
        ) : (
          <div className="lay-ph-row" style={{ justifyContent: 'space-between' }}>
            <T size={20} head>
              Visão geral
            </T>
            <span className="lay-ph-tag">
              <T size={12.5} weight={600}>
                Hoje
              </T>
            </span>
          </div>
        )}
        <div className="lay-ph-grid2 lay-ph-fill" style={{ gridTemplateRows: `repeat(${tabsMode ? 2 : 3}, minmax(0, 1fr))` }}>
          {tiles.slice(0, tabsMode ? 4 : 6).map((x) => (
            <div key={x.l} className="lay-ph-tile" style={card}>
              <T size={12.5} color="var(--ph-muted)">
                {x.l}
              </T>
              <T size={21} head>
                {x.v}
              </T>
              <span className="lay-ph-grow lay-ph-tile-viz">{x.viz}</span>
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    content = (
      <div className="lay-ph-content-inner" style={{ paddingTop: floatTop ? floatTop + 8 : 14, paddingBottom: contentPadBottom }}>
        {largeTitleInContent && (
          <div className="lay-ph-stack" style={{ gap: 2, padding: '6px 2px 4px' }}>
            <T size={13} color="var(--ph-muted)">
              Segunda, 2 de novembro
            </T>
            <T size={30} head>
              Início
            </T>
          </div>
        )}
        <div className="lay-ph-card" style={card}>
          <div className="lay-ph-row" style={{ justifyContent: 'space-between' }}>
            <T size={13} color="var(--ph-muted)">
              Saldo do mês
            </T>
            <span className="lay-ph-tag lay-ph-tag--ok">
              <T size={12} weight={600}>
                +8,2%
              </T>
            </span>
          </div>
          <T size={26} head>
            R$ 12.480
          </T>
          <Spark height={52} />
        </div>
        <div className="lay-ph-grid2">
          {[
            { l: 'Pedidos', v: '128', i: Package },
            { l: 'Clientes', v: '64', i: Users },
          ].map((x) => (
            <div key={x.l} className="lay-ph-card lay-ph-card--sm" style={card}>
              <span className="lay-ph-ic-soft">
                <Ic i={x.i} size={18} color="var(--ph-primary)" />
              </span>
              <T size={12.5} color="var(--ph-muted)">
                {x.l}
              </T>
              <T size={20} head>
                {x.v}
              </T>
            </div>
          ))}
        </div>
        <div className="lay-ph-row" style={{ justifyContent: 'space-between', padding: '4px 2px 0' }}>
          <T size={15.5} weight={650}>
            Atividade recente
          </T>
          <T size={13} weight={600} color="var(--ph-primary)">
            Ver tudo
          </T>
        </div>
        <div className="lay-ph-list" style={card}>
          {LIST.map((r, i) => (
            <div key={r.t} className="lay-ph-li" style={i ? { borderTop: '1px solid var(--ph-border)' } : undefined}>
              <Avatar size={36} text={r.a} tone={i} />
              <span className="lay-ph-stack lay-ph-grow">
                <T size={14} weight={600}>
                  {r.t}
                </T>
                <T size={12.5} color="var(--ph-muted)">
                  {r.s}
                </T>
              </span>
              <T size={13} weight={600}>
                {r.v}
              </T>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ------------------------------ Trilhos laterais ----------------------------- */

  const railItems = (withLabels: boolean, items = RAIL_ITEMS) =>
    items.map((it, i) => (
      <Tap
        key={it.label}
        className={withLabels ? 'lay-ph-rail-item' : 'lay-ph-rail-item lay-ph-rail-item--icon'}
        label={withLabels ? undefined : it.label}
        current={interactive ? i === nav : undefined}
        onClick={() => setNav(i)}
        style={{ color: i === nav ? 'var(--ph-nav-active-text)' : 'var(--ph-nav-text)' }}
      >
        <span className="lay-ph-nav-ic" style={i === nav ? { background: 'var(--ph-nav-active)' } : undefined}>
          <Ic i={it.icon} size={22} />
        </span>
        {withLabels && (
          <T size={12} weight={i === nav ? 650 : 500}>
            {it.label}
          </T>
        )}
      </Tap>
    ))

  let sideLeft: ReactNode = null
  if (cfg.side === 'mini-sidebar') sideLeft = <nav className="lay-ph-rail" style={{ width: 72 }}>{railItems(true)}</nav>
  if (cfg.side === 'rail')
    sideLeft = (
      <nav className="lay-ph-rail" style={{ width: 56 }}>
        {railItems(false, [
          { label: 'Visão geral', icon: LayoutGrid },
          { label: 'Gráficos', icon: BarChart3 },
          { label: 'Documentos', icon: FileText },
          { label: 'Favoritos', icon: Star },
        ])}
      </nav>
    )
  if (cfg.side === 'rail-expand') {
    const p = triggerProps('rail')
    sideLeft = (
      <nav className="lay-ph-rail" style={{ width: 56 }}>
        <Tap className="lay-ph-rail-item lay-ph-rail-item--icon" {...(p ?? {})}>
          <span className="lay-ph-nav-ic">
            <Ic i={PanelLeftOpen} size={22} />
          </span>
        </Tap>
        <span className="lay-ph-rail-sep" />
        {railItems(false)}
      </nav>
    )
  }
  const sideRight = cfg.side === 'rail-right' ? <nav className="lay-ph-rail lay-ph-rail--right" style={{ width: 64 }}>{railItems(true)}</nav> : null

  /* ----------------------------- Barra inferior ------------------------------ */

  const navButton = (it: NavItem, i: number, opts: { labels: boolean; dot?: boolean; activeColor?: string; color?: string }) => {
    if (it.more) {
      const p = triggerProps('bottom-more')
      return (
        <Tap key={it.label} className="lay-ph-nav-item" {...(p ?? {})} label={opts.labels ? undefined : it.label} style={{ color: open ? opts.activeColor : opts.color }}>
          <span className="lay-ph-nav-ic" style={open ? { background: 'var(--ph-nav-active)' } : undefined}>
            <Ic i={it.icon} size={22} />
          </span>
          {opts.labels && (
            <T size={12} weight={500}>
              {it.label}
            </T>
          )}
        </Tap>
      )
    }
    const active = i === nav
    return (
      <Tap
        key={it.label}
        className="lay-ph-nav-item"
        label={opts.labels ? undefined : it.label}
        current={interactive ? active : undefined}
        onClick={() => setNav(i)}
        style={{ color: active ? opts.activeColor : opts.color }}
      >
        <span className="lay-ph-nav-ic" style={active && !opts.dot ? { background: 'var(--ph-nav-active)' } : undefined}>
          <Ic i={it.icon} size={22} />
          {it.badge && <span className="lay-ph-count">{thumb ? null : it.badge}</span>}
        </span>
        {opts.labels && (
          <T size={12} weight={active ? 650 : 500}>
            {it.label}
          </T>
        )}
        {opts.dot && <i className="lay-ph-dot" style={{ opacity: active ? 1 : 0 }} />}
      </Tap>
    )
  }

  const navColors = { activeColor: 'var(--ph-nav-active-text)', color: 'var(--ph-nav-text)' }
  const surfaceColors = { activeColor: 'var(--ph-primary)', color: 'var(--ph-muted)' }
  const withMore = (items: NavItem[]) => (menu?.trigger === 'bottom-more' ? [...items.slice(0, items.length - 1), MORE] : items)

  let bottomFlow: ReactNode = null
  let bottomFloat: ReactNode = null
  switch (cfg.bottom) {
    case 'bottom-nav':
    case 'bottom-nav-5':
      bottomFlow = (
        <nav className="lay-ph-bottom" style={{ height: 64 + HOME }}>
          {withMore(cfg.bottom === 'bottom-nav-5' ? NAV5 : NAV4).map((it, i) => navButton(it, i, { labels: true, ...navColors }))}
        </nav>
      )
      break
    case 'bottom-fab':
      bottomFlow = (
        <nav className="lay-ph-bottom" style={{ height: 64 + HOME }}>
          {navButton(NAV4[0], 0, { labels: true, ...navColors })}
          {navButton(NAV4[1], 1, { labels: true, ...navColors })}
          <span className="lay-ph-nav-item">
            <Tap className="lay-ph-fab lay-ph-fab--raised" label="Criar novo">
              <Ic i={Plus} size={28} />
            </Tap>
          </span>
          {navButton({ label: 'Mensagens', icon: MessageCircle }, 2, { labels: true, ...navColors })}
          {navButton(NAV4[3], 3, { labels: true, ...navColors })}
        </nav>
      )
      break
    case 'bottom-minimal':
      bottomFlow = (
        <nav className="lay-ph-bottom lay-ph-bottom--minimal" style={{ height: 56 + HOME }}>
          {withMore(NAV4).map((it, i) => navButton(it, i, { labels: false, dot: true, ...navColors }))}
        </nav>
      )
      break
    case 'sheet-peek': {
      const p = triggerProps('peek')
      bottomFlow = (
        <div className="lay-ph-peek-wrap" style={{ height: 64 + HOME }}>
          <Tap className="lay-ph-peek" {...(p ?? {})} label={undefined}>
            <i className="lay-ph-handle" />
            <span className="lay-ph-row" style={{ width: '100%', gap: 12 }}>
              <Ic i={Menu} size={20} />
              <T size={15} weight={650}>
                Menu
              </T>
              <span className="lay-ph-grow" />
              <Ic i={Home} size={20} color="var(--ph-primary)" />
              <Ic i={Search} size={20} />
              <Ic i={Calendar} size={20} />
            </span>
          </Tap>
        </div>
      )
      break
    }
    case 'dock':
    case 'dock-transparent':
      bottomFloat = (
        <nav className={cfg.bottom === 'dock' ? 'lay-ph-dock' : 'lay-ph-dock lay-ph-dock--glass'} style={cfg.bottom === 'dock' ? { ...card, borderRadius: 24 } : undefined}>
          {withMore(DOCK).map((it, i) => navButton(it, i, { labels: true, ...surfaceColors }))}
        </nav>
      )
      break
    case 'dock-pill':
      bottomFloat = (
        <nav className="lay-ph-dock lay-ph-dock--pill" style={{ ...card, borderRadius: 999 }}>
          {DOCK.map((it, i) => (
            <Tap key={it.label} className="lay-ph-pill-item" label={it.label} current={interactive ? i === nav : undefined} onClick={() => setNav(i)} style={i === nav ? { background: 'var(--ph-primary)', color: 'var(--ph-on-primary)' } : { color: 'var(--ph-muted)' }}>
              <Ic i={it.icon} size={22} />
            </Tap>
          ))}
        </nav>
      )
      break
    case 'pill-label':
      bottomFloat = (
        <nav className="lay-ph-dock lay-ph-dock--label" style={{ ...card, borderRadius: 999 }}>
          {DOCK.map((it, i) => (
            <Tap
              key={it.label}
              className={i === nav ? 'lay-ph-pill-item lay-ph-pill-item--on' : 'lay-ph-pill-item'}
              label={i === nav ? undefined : it.label}
              current={interactive ? i === nav : undefined}
              onClick={() => setNav(i)}
              style={i === nav ? { background: 'var(--ph-primary-soft)', color: 'var(--ph-selected-text)' } : { color: 'var(--ph-muted)' }}
            >
              <Ic i={it.icon} size={22} />
              {i === nav && (
                <T size={13} weight={650}>
                  {it.label}
                </T>
              )}
            </Tap>
          ))}
        </nav>
      )
      break
    case 'dock-compact':
      bottomFloat = (
        <nav className="lay-ph-dock lay-ph-dock--compact" style={{ ...card, borderRadius: 999 }}>
          {DOCK.slice(0, 3).map((it, i) => (
            <Tap key={it.label} className="lay-ph-pill-item" label={it.label} current={interactive ? i === nav : undefined} onClick={() => setNav(i)} style={{ color: i === nav ? 'var(--ph-primary)' : 'var(--ph-muted)' }}>
              <Ic i={it.icon} size={22} />
            </Tap>
          ))}
          <span className="lay-ph-vsep" />
          <Tap className="lay-ph-pill-item" {...(triggerProps('bottom-more') ?? {})} label="Mais opções" style={{ color: open ? 'var(--ph-primary)' : 'var(--ph-muted)' }}>
            <Ic i={LayoutGrid} size={22} />
          </Tap>
        </nav>
      )
      break
    case 'fab': {
      const p = triggerProps('fab')
      bottomFloat = (
        <Tap className={open ? 'lay-ph-fab lay-ph-fab--corner lay-ph-fab--open' : 'lay-ph-fab lay-ph-fab--corner'} {...(p ?? { label: 'Criar' })} label={open ? 'Fechar ações rápidas' : 'Abrir ações rápidas'}>
          <Ic i={Plus} size={28} />
        </Tap>
      )
      break
    }
    default:
      break
  }

  /* --------------------------------- Menus ----------------------------------- */

  const closeBtn = (dark = false) => (
    <Tap className="lay-ph-icon-btn" label="Fechar menu" onClick={close} autoFocusTarget style={dark ? { color: 'var(--ph-bg)' } : undefined}>
      <Ic i={X} size={24} />
    </Tap>
  )

  const overlayProps = (cls: string, label: string, style?: CSSProperties) => ({
    ref: overlayRef,
    className: cls,
    style,
    role: interactive ? 'dialog' : undefined,
    'aria-modal': interactive ? true : undefined,
    'aria-label': interactive ? label : undefined,
    'data-testid': interactive ? 'phone-overlay' : undefined,
    onKeyDown: interactive ? onOverlayKey : undefined,
  })

  const scrim = (style?: CSSProperties, light = false) => (
    <div className={light ? 'lay-ph-scrim lay-ph-scrim--light' : 'lay-ph-scrim'} style={style} onClick={interactive ? close : undefined} aria-hidden="true" />
  )

  const overlayChip = (style: CSSProperties) =>
    showLegends && menu ? <Chip label={OVERLAY_LABEL[menu.kind]} color="var(--legend-detail)" style={style} /> : null

  const drawerBody = (
    <>
      <div className="lay-ph-drawer-head">
        <Avatar size={44} />
        <span className="lay-ph-stack lay-ph-grow">
          <T size={15} weight={650}>
            Marina Alves
          </T>
          <T size={12.5} color="var(--ph-muted)">
            marina@orla.app
          </T>
        </span>
        {closeBtn()}
      </div>
      <div className="lay-ph-drawer-list">
        {DRAWER_ITEMS.map((it, i) => (
          <Tap key={it.label} className="lay-ph-drawer-item" current={interactive ? i === nav : undefined} onClick={() => setNav(i)} style={i === nav ? { background: 'var(--ph-selected)', color: 'var(--ph-selected-text)' } : undefined}>
            <Ic i={it.icon} size={21} />
            <T size={15} weight={i === nav ? 650 : 500}>
              {it.label}
            </T>
          </Tap>
        ))}
        <span className="lay-ph-hsep" />
        {[
          { l: 'Configurações', i: Settings },
          { l: 'Ajuda', i: HelpCircle },
        ].map((x) => (
          <Tap key={x.l} className="lay-ph-drawer-item">
            <Ic i={x.i} size={21} />
            <T size={15}>{x.l}</T>
          </Tap>
        ))}
      </div>
      <span className="lay-ph-grow" />
      <Tap className="lay-ph-drawer-item" style={{ margin: '0 12px 28px' }}>
        <Ic i={LogOut} size={21} />
        <T size={15}>Sair</T>
      </Tap>
    </>
  )

  let overlay: ReactNode = null
  let underlay: ReactNode = null
  if (open && menu) {
    const belowTop = STATUS + topH
    switch (menu.kind) {
      case 'drawer-left':
      case 'drawer-right': {
        const right = menu.kind === 'drawer-right'
        overlay = (
          <>
            {scrim()}
            <div {...overlayProps(right ? 'lay-ph-drawer lay-ph-drawer--right' : 'lay-ph-drawer', 'Menu de navegação')}>
              {drawerBody}
              {overlayChip({ right: 14, bottom: 34 })}
            </div>
          </>
        )
        break
      }
      case 'drawer-push':
        underlay = (
          <div {...overlayProps('lay-ph-drawer lay-ph-drawer--push', 'Menu de navegação')}>
            {drawerBody}
            {overlayChip({ right: 14, bottom: 34 })}
          </div>
        )
        overlay = scrim({ left: 260, background: 'transparent' })
        break
      case 'rail-expand':
        overlay = (
          <>
            {scrim({ top: belowTop }, true)}
            <div {...overlayProps('lay-ph-rail-panel', 'Menu expandido', { top: belowTop })}>
              <div className="lay-ph-row" style={{ height: 52, padding: '0 6px 0 16px' }}>
                <T size={15} weight={650}>
                  Menu
                </T>
                <span className="lay-ph-grow" />
                <Tap className="lay-ph-icon-btn" label="Recolher menu" onClick={close} autoFocusTarget>
                  <Ic i={PanelLeftClose} size={22} />
                </Tap>
              </div>
              {RAIL_ITEMS.map((it, i) => (
                <Tap key={it.label} className="lay-ph-drawer-item" current={interactive ? i === nav : undefined} onClick={() => setNav(i)} style={i === nav ? { background: 'var(--ph-nav-active)', color: 'var(--ph-nav-active-text)' } : undefined}>
                  <Ic i={it.icon} size={21} />
                  <T size={15} weight={i === nav ? 650 : 500}>
                    {it.label}
                  </T>
                </Tap>
              ))}
              {overlayChip({ left: 16, bottom: 24 })}
            </div>
          </>
        )
        break
      case 'bottom-sheet':
        overlay = (
          <>
            {scrim()}
            <div {...overlayProps('lay-ph-sheet', 'Mais opções')}>
              <i className="lay-ph-handle" />
              <div className="lay-ph-row" style={{ padding: '4px 8px 4px 20px' }}>
                <T size={17} head>
                  Mais opções
                </T>
                <span className="lay-ph-grow" />
                {closeBtn()}
              </div>
              <div className="lay-ph-sheet-grid">
                {[
                  { l: 'Pedidos', i: Package },
                  { l: 'Clientes', i: Users },
                  { l: 'Agenda', i: Calendar },
                  { l: 'Relatórios', i: BarChart3 },
                  { l: 'Estoque', i: Folder },
                  { l: 'Mensagens', i: Mail },
                  { l: 'Carteira', i: Wallet },
                  { l: 'Ideias', i: Lightbulb },
                ].map((x) => (
                  <Tap key={x.l} className="lay-ph-sheet-tile">
                    <span className="lay-ph-ic-soft lay-ph-ic-soft--lg">
                      <Ic i={x.i} size={22} color="var(--ph-primary)" />
                    </span>
                    <T size={12} weight={500}>
                      {x.l}
                    </T>
                  </Tap>
                ))}
              </div>
              {[
                { l: 'Configurações', i: Settings },
                { l: 'Central de ajuda', i: HelpCircle },
              ].map((x) => (
                <Tap key={x.l} className="lay-ph-drawer-item" style={{ margin: '0 12px' }}>
                  <Ic i={x.i} size={21} />
                  <T size={15}>{x.l}</T>
                  <span className="lay-ph-grow" />
                  <Ic i={ChevronRight} size={18} />
                </Tap>
              ))}
              {overlayChip({ right: 60, top: 18 })}
            </div>
          </>
        )
        break
      case 'grouped-sheet':
        overlay = (
          <>
            {scrim()}
            <div {...overlayProps('lay-ph-drawer lay-ph-drawer--wide', 'Menu em grupos')}>
              <div className="lay-ph-row" style={{ height: 56, padding: '0 8px 0 18px' }}>
                {brand}
                <span className="lay-ph-grow" />
                {closeBtn()}
              </div>
              <div style={{ padding: '0 16px 8px' }}>
                <span className="lay-ph-search">
                  <Ic i={Search} size={18} />
                  <T size={14} color="var(--ph-muted)">
                    Buscar no menu
                  </T>
                </span>
              </div>
              {[
                { g: 'Principal', open: true, items: [{ label: 'Início', icon: Home }, { label: 'Pedidos', icon: Package }, { label: 'Clientes', icon: Users }] },
                { g: 'Gestão', open: true, items: [{ label: 'Estoque', icon: Folder }, { label: 'Financeiro', icon: Wallet }, { label: 'Relatórios', icon: BarChart3 }] },
                { g: 'Conta', open: false, items: [] as NavItem[] },
              ].map((grp, gi) => (
                <div key={grp.g} className="lay-ph-group">
                  <Tap className="lay-ph-group-head" expanded={interactive ? grp.open : undefined}>
                    <T size={12.5} weight={650} color="var(--ph-muted)">
                      {grp.g.toUpperCase()}
                    </T>
                    <span className="lay-ph-grow" />
                    <Ic i={grp.open ? ChevronDown : ChevronRight} size={16} color="var(--ph-muted)" />
                  </Tap>
                  {grp.items.map((it, i) => (
                    <Tap key={it.label} className="lay-ph-drawer-item" style={gi === 0 && i === 0 ? { background: 'var(--ph-selected)', color: 'var(--ph-selected-text)' } : undefined}>
                      <Ic i={it.icon} size={20} />
                      <T size={15} weight={gi === 0 && i === 0 ? 650 : 500}>
                        {it.label}
                      </T>
                      {it.label === 'Pedidos' && (
                        <span className="lay-ph-count lay-ph-count--inline">{thumb ? null : 8}</span>
                      )}
                    </Tap>
                  ))}
                </div>
              ))}
              {overlayChip({ right: 14, bottom: 34 })}
            </div>
          </>
        )
        break
      case 'fullscreen':
        overlay = (
          <div {...overlayProps('lay-ph-full', 'Menu')}>
            <div className="lay-ph-row" style={{ height: 56, padding: '0 8px 0 16px' }}>
              {brand}
              <span className="lay-ph-grow" />
              {closeBtn()}
            </div>
            <div className="lay-ph-full-links">
              {['Início', 'Produtos', 'Preços', 'Sobre nós', 'Contato'].map((l, i) => (
                <Tap key={l} className="lay-ph-full-link" current={interactive ? i === 0 : undefined}>
                  <T size={26} head color={i === 0 ? 'var(--ph-primary)' : undefined}>
                    {l}
                  </T>
                  <span className="lay-ph-grow" />
                  <Ic i={ChevronRight} size={22} color="var(--ph-muted)" />
                </Tap>
              ))}
            </div>
            <span className="lay-ph-grow" />
            <div style={{ padding: '0 20px 36px', display: 'grid', gap: 12 }}>
              <Tap className="lay-ph-btn">
                <T size={15} weight={650} color="var(--ph-on-primary)">
                  Começar agora
                </T>
              </Tap>
              <T size={13} color="var(--ph-muted)" style={{ textAlign: 'center' }}>
                Ajuda · Privacidade · Termos
              </T>
            </div>
            {overlayChip({ right: 16, top: 120 })}
          </div>
        )
        break
      case 'fullscreen-editorial':
        overlay = (
          <div {...overlayProps('lay-ph-full lay-ph-full--editorial', 'Menu')}>
            <div className="lay-ph-row" style={{ height: 56, padding: '0 8px 0 20px' }}>
              <T size={17} head color="var(--ph-bg)">
                Estúdio Orla
              </T>
              <span className="lay-ph-grow" />
              {closeBtn(true)}
            </div>
            <div className="lay-ph-full-links" style={{ gap: 4, paddingTop: 36 }}>
              {['Trabalhos', 'Estúdio', 'Processo', 'Contato'].map((l, i) => (
                <Tap key={l} className="lay-ph-ed-link">
                  <T size={13} color="var(--ph-bg)" style={{ opacity: 0.6, width: 28 }}>
                    {`0${i + 1}`}
                  </T>
                  <T size={40} head color="var(--ph-bg)" w={180}>
                    {l}
                  </T>
                </Tap>
              ))}
            </div>
            <span className="lay-ph-grow" />
            <div className="lay-ph-stack" style={{ padding: '0 24px 40px', gap: 6 }}>
              <T size={13} color="var(--ph-bg)" style={{ opacity: 0.7 }}>
                ola@estudio-orla.com
              </T>
              <T size={13} color="var(--ph-bg)" style={{ opacity: 0.7 }}>
                São Paulo — Brasil
              </T>
            </div>
            {overlayChip({ right: 18, top: 100 })}
          </div>
        )
        break
      case 'app-grid':
        overlay = (
          <div {...overlayProps('lay-ph-full', 'Aplicativos')}>
            <div className="lay-ph-row" style={{ height: 56, padding: '0 8px 0 20px' }}>
              <T size={19} head>
                Aplicativos
              </T>
              <span className="lay-ph-grow" />
              {closeBtn()}
            </div>
            <div className="lay-ph-apps">
              {[
                { l: 'Pedidos', i: Package },
                { l: 'Clientes', i: Users },
                { l: 'Agenda', i: Calendar },
                { l: 'Finanças', i: Wallet },
                { l: 'Relatórios', i: BarChart3 },
                { l: 'Arquivos', i: Folder },
                { l: 'Mensagens', i: MessageCircle },
                { l: 'Cupons', i: Ticket },
                { l: 'Notas', i: Pencil },
                { l: 'Segurança', i: Shield },
                { l: 'Ajustes', i: Settings },
                { l: 'Ajuda', i: HelpCircle },
              ].map((a, i) => (
                <Tap key={a.l} className="lay-ph-app">
                  <span className="lay-ph-app-ic" style={i % 3 === 1 ? { background: 'var(--ph-selected)' } : undefined}>
                    <Ic i={a.i} size={26} color="var(--ph-primary)" />
                  </span>
                  <T size={12.5} weight={500}>
                    {a.l}
                  </T>
                </Tap>
              ))}
            </div>
            {overlayChip({ right: 16, bottom: 40 })}
          </div>
        )
        break
      case 'command': {
        const cmds = [
          { g: 'Sugestões', l: 'Novo pedido', i: Plus, k: 'N' },
          { g: 'Sugestões', l: 'Buscar cliente', i: Users, k: 'C' },
          { g: 'Sugestões', l: 'Abrir relatórios', i: BarChart3, k: 'R' },
          { g: 'Navegar', l: 'Ir para Agenda', i: Calendar, k: '' },
          { g: 'Navegar', l: 'Ir para Configurações', i: Settings, k: '' },
          { g: 'Navegar', l: 'Enviar arquivo', i: Upload, k: '' },
        ].filter((c) => c.l.toLowerCase().includes(query.trim().toLowerCase()))
        overlay = (
          <>
            {scrim()}
            <div {...overlayProps('lay-ph-command', 'Menu de comandos', card)}>
              <div className="lay-ph-row lay-ph-command-input">
                <Ic i={Search} size={20} color="var(--ph-muted)" />
                {interactive ? (
                  <input
                    className="lay-ph-input"
                    placeholder="Digite um comando…"
                    aria-label="Digite um comando"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    data-autofocus=""
                  />
                ) : (
                  <T size={15} color="var(--ph-muted)">
                    Digite um comando…
                  </T>
                )}
                {closeBtn()}
              </div>
              {['Sugestões', 'Navegar'].map((g) => {
                const items = cmds.filter((c) => c.g === g)
                if (!items.length) return null
                return (
                  <div key={g} className="lay-ph-stack" style={{ padding: '6px 8px', gap: 0 }}>
                    <T size={12} weight={650} color="var(--ph-muted)" style={{ padding: '6px 10px' }}>
                      {g.toUpperCase()}
                    </T>
                    {items.map((c, i) => (
                      <Tap key={c.l} className="lay-ph-drawer-item" style={g === 'Sugestões' && i === 0 ? { background: 'var(--ph-selected)' } : undefined}>
                        <Ic i={c.i} size={19} />
                        <T size={14.5}>{c.l}</T>
                        <span className="lay-ph-grow" />
                        {c.k && !thumb && <span className="lay-ph-kbd">⌘{c.k}</span>}
                      </Tap>
                    ))}
                  </div>
                )
              })}
              {cmds.length === 0 && (
                <div style={{ padding: '18px 20px' }}>
                  <T size={14} color="var(--ph-muted)">
                    Nenhum comando encontrado.
                  </T>
                </div>
              )}
              {overlayChip({ right: 14, bottom: 14 })}
            </div>
          </>
        )
        break
      }
      case 'profile-menu':
        overlay = (
          <>
            {scrim(undefined, true)}
            <div {...overlayProps('lay-ph-pop', 'Menu de perfil', { ...card, top: STATUS + topH + 4 })}>
              <div className="lay-ph-row" style={{ padding: '12px 6px 10px 14px', gap: 10, borderBottom: '1px solid var(--ph-border)' }}>
                <Avatar size={38} />
                <span className="lay-ph-stack lay-ph-grow">
                  <T size={14} weight={650}>
                    Marina Alves
                  </T>
                  <T size={12} color="var(--ph-muted)">
                    Plano Pro
                  </T>
                </span>
                {closeBtn()}
              </div>
              <div style={{ padding: 6 }}>
                {[
                  { l: 'Minha conta', i: User },
                  { l: 'Assinatura', i: CreditCard },
                  { l: 'Preferências', i: Settings },
                  { l: 'Ajuda', i: HelpCircle },
                ].map((x) => (
                  <Tap key={x.l} className="lay-ph-drawer-item lay-ph-drawer-item--sm">
                    <Ic i={x.i} size={19} />
                    <T size={14.5}>{x.l}</T>
                  </Tap>
                ))}
                <span className="lay-ph-hsep" />
                <Tap className="lay-ph-drawer-item lay-ph-drawer-item--sm" style={{ color: 'var(--ph-error)' }}>
                  <Ic i={LogOut} size={19} />
                  <T size={14.5}>Sair</T>
                </Tap>
              </div>
              {overlayChip({ right: 12, bottom: 12 })}
            </div>
          </>
        )
        break
      case 'dropdown':
        overlay = (
          <>
            {scrim({ top: STATUS + 68 }, true)}
            <div {...overlayProps('lay-ph-pop lay-ph-pop--dropdown', 'Menu', { ...card, top: STATUS + 68 })}>
              <div className="lay-ph-row" style={{ padding: '6px 6px 2px 16px' }}>
                <T size={12.5} weight={650} color="var(--ph-muted)">
                  MENU
                </T>
                <span className="lay-ph-grow" />
                {closeBtn()}
              </div>
              <div style={{ padding: '0 6px 6px' }}>
                {['Produto', 'Recursos', 'Preços', 'Clientes', 'Contato'].map((l) => (
                  <Tap key={l} className="lay-ph-drawer-item lay-ph-drawer-item--sm">
                    <T size={15} weight={500}>
                      {l}
                    </T>
                  </Tap>
                ))}
              </div>
              <div style={{ padding: '4px 12px 14px' }}>
                <Tap className="lay-ph-btn">
                  <T size={14.5} weight={650} color="var(--ph-on-primary)">
                    Começar grátis
                  </T>
                </Tap>
              </div>
              {overlayChip({ right: 52, top: 14 })}
            </div>
          </>
        )
        break
      case 'top-sheet':
        overlay = (
          <>
            {scrim({ top: belowTop })}
            <div {...overlayProps('lay-ph-topsheet', 'Menu', { top: belowTop })}>
              <div className="lay-ph-row" style={{ padding: '8px 8px 4px 20px' }}>
                <T size={12.5} weight={650} color="var(--ph-muted)">
                  NAVEGAÇÃO
                </T>
                <span className="lay-ph-grow" />
                {closeBtn()}
              </div>
              {['Início', 'Soluções', 'Preços', 'Blog', 'Contato'].map((l, i) => (
                <Tap key={l} className="lay-ph-drawer-item" style={{ margin: '0 12px', ...(i === 0 ? { color: 'var(--ph-primary)' } : {}) }}>
                  <T size={16} weight={i === 0 ? 650 : 500}>
                    {l}
                  </T>
                  <span className="lay-ph-grow" />
                  {l === 'Soluções' && <Ic i={ChevronDown} size={18} />}
                </Tap>
              ))}
              <div style={{ padding: '10px 20px 18px' }}>
                <Tap className="lay-ph-btn">
                  <T size={15} weight={650} color="var(--ph-on-primary)">
                    Fale conosco
                  </T>
                </Tap>
              </div>
              {overlayChip({ right: 16, bottom: 74 })}
            </div>
          </>
        )
        break
      case 'speed-dial':
        overlay = (
          <>
            {scrim(undefined, true)}
            <div {...overlayProps('lay-ph-dial', 'Ações rápidas')}>
              {[
                { l: 'Nova tarefa', i: Pencil },
                { l: 'Novo cliente', i: Users },
                { l: 'Anexar arquivo', i: Upload },
              ].map((a, i) => (
                <Tap key={a.l} className="lay-ph-dial-item" autoFocusTarget={i === 0}>
                  <span className="lay-ph-dial-label" style={card}>
                    <T size={14} weight={600}>
                      {a.l}
                    </T>
                  </span>
                  <span className="lay-ph-dial-btn">
                    <Ic i={a.i} size={20} color="var(--ph-primary)" />
                  </span>
                </Tap>
              ))}
              {overlayChip({ right: 0, top: -26 })}
            </div>
          </>
        )
        break
    }
  }

  /* ------------------------------- Legendas ---------------------------------- */

  const legends: ReactNode[] = []
  if (showLegends) {
    const push = (key: string, label: string, color: string, style: CSSProperties) => legends.push(<Chip key={key} label={label} color={color} style={style} />)
    if (topH) push('top', 'HEADER', 'var(--legend-header)', { top: STATUS + topH - 9, right: 10 })
    if (cfg.top === 'floating') push('top', 'HEADER FLUTUANTE', 'var(--legend-header)', { top: STATUS + 8 + 52 - 6, right: 22 })
    if (cfg.top === 'island') push('top', 'ILHA SUPERIOR', 'var(--legend-header)', { top: STATUS + 8 + 11, right: 10 })
    if (storiesH) push('stories', cfg.storiesStyle === 'categories' ? 'CATEGORIAS' : 'STORIES', 'var(--legend-submenu)', { top: middleTop - 9, right: 10 })
    push('content', 'CONTEÚDO', 'var(--legend-content)', { top: middleTop + (middleBottom - middleTop) * 0.46, right: 10 + sideR })
    if (flowBottom) push('bottom', cfg.bottom === 'sheet-peek' ? 'ALÇA DO MENU' : 'MENU INFERIOR', 'var(--legend-sidebar)', { top: BH - bottomBlock - 9, right: 10 })
    if (floatBottom) {
      if (cfg.bottom === 'fab') push('bottom', 'BOTÃO FLUTUANTE', 'var(--legend-sidebar)', { top: BH - HOME - 20 - 37, right: 84 })
      else push('bottom', cfg.bottom === 'dock' || cfg.bottom === 'dock-transparent' ? 'DOCK' : 'MENU FLUTUANTE', 'var(--legend-sidebar)', { top: BH - HOME - 12 - floatBottom - 9, right: 24 })
    }
    if (sideL) push('side', cfg.side === 'mini-sidebar' ? 'MINI MENU' : 'RAIL', 'var(--legend-rail)', { top: middleBottom - 30, left: sideL / 2, transform: 'translateX(-50%)' })
    if (sideR) push('side', 'RAIL', 'var(--legend-rail)', { top: middleBottom - 30, right: sideR / 2, transform: 'translateX(50%)' })
  }

  /* -------------------------------- Montagem --------------------------------- */

  const body = (
    <div className="lay-ph-body" style={pushOpen ? { transform: 'translateX(260px)' } : undefined} aria-hidden={interactive && hideBody ? true : undefined}>
      <div className="lay-ph-status">
        <T size={13} weight={650} w={34}>
          10:24
        </T>
        <span className="lay-ph-camera" />
        <span className="lay-ph-row" style={{ gap: 5 }}>
          <Ic i={Signal} size={14} />
          <Ic i={Wifi} size={14} />
          <Ic i={BatteryFull} size={16} />
        </span>
      </div>
      {topBar}
      {stories}
      <div className="lay-ph-middle">
        {sideLeft}
        <div
          ref={contentRef}
          className={cfg.oneScreen ? 'lay-ph-content lay-ph-content--fit' : 'lay-ph-content'}
          style={{ overflowY: interactive && !cfg.oneScreen ? 'auto' : 'hidden' }}
        >
          {content}
        </div>
        {sideRight}
      </div>
      {bottomFlow}
      {floatingTop}
      {bottomFloat}
    </div>
  )

  const rootStyle: CSSProperties = frame
    ? { width: W + bezel * 2, height: H + bezel * 2, padding: bezel, borderRadius: Math.round(46 * scale) + bezel }
    : { width: W, height: H }

  return (
    <PhCtx.Provider value={ctxValue}>
      <div
        className={['lay-phone', frame && 'lay-phone--frame', className].filter(Boolean).join(' ')}
        data-testid={testId}
        data-layout={layout.id}
        data-open={open ? 'true' : 'false'}
        role={interactive ? 'group' : undefined}
        aria-label={interactive ? `Prévia do celular: ${layout.name}` : undefined}
        aria-hidden={interactive ? undefined : true}
        style={rootStyle}
        onKeyDown={interactive && open ? (e) => e.key === 'Escape' && close() : undefined}
      >
        <div className="lay-phone__screen" style={{ width: W, height: H, borderRadius: frame ? Math.round(38 * scale) : Math.round(14 * scale) }}>
          <div className="lay-ph" data-detail={thumb ? 'thumb' : 'full'} style={{ ...vars, width: BW, height: BH, transform: `scale(${scale})` }}>
            {underlay}
            {body}
            {overlay}
            <i className="lay-ph-home" aria-hidden="true" />
            {legends}
          </div>
        </div>
      </div>
    </PhCtx.Provider>
  )
})

/** Medidas de referência usadas pelo celular (úteis para testes e para a Live Preview). */
export const PHONE_BASE = { width: BW, height: BH, status: STATUS, home: HOME }
