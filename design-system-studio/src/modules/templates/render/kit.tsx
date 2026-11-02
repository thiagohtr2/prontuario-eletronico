import { useId, type CSSProperties, type ReactNode } from 'react'
import {
  Accessibility,
  Activity,
  Award,
  Baby,
  BarChart3,
  Bath,
  Battery,
  Bed,
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Bus,
  Calendar,
  Camera,
  Car,
  Check,
  CircleParking,
  Clock,
  Cloud,
  Code2,
  Coffee,
  Compass,
  CreditCard,
  Croissant,
  Download,
  Droplet,
  Dumbbell,
  Eye,
  FileText,
  Flame,
  Folder,
  Gavel,
  Gem,
  Gift,
  Globe,
  GraduationCap,
  Handshake,
  Hash,
  Headphones,
  Heart,
  HeartPulse,
  Home,
  Inbox,
  Key,
  Layers,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  Lock,
  Luggage,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Mic,
  Mountain,
  Music,
  Package,
  Palette,
  PenTool,
  Percent,
  PieChart,
  Phone,
  Plane,
  Play,
  Recycle,
  RefreshCw,
  Rocket,
  Ruler,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Smile,
  Sofa,
  Sparkles,
  Sprout,
  Star,
  Stethoscope,
  Sun,
  Tag,
  Target,
  Terminal,
  Ticket,
  Timer,
  TreePine,
  TrendingUp,
  Trophy,
  Truck,
  UtensilsCrossed,
  Users,
  Video,
  Wallet,
  Waves,
  Wifi,
  Wind,
  Wine,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { isDark, mix, readableOn } from '@/core/color'
import type { TplTheme } from '../theme'
import type { ArtKind, IconName, SectionTone, TemplateSection } from '../types'

export type Dev = 'desktop' | 'mobile'

/** Contexto comum de renderização de uma seção. */
export interface RCtx {
  s: TemplateSection
  t: TplTheme
  m: boolean
  brand: string
  index: number
}

/* -------------------------------------------------------------------------- */
/* Ícones                                                                      */
/* -------------------------------------------------------------------------- */

const ICONS: Record<IconName, LucideIcon> = {
  zap: Zap,
  shield: ShieldCheck,
  chart: BarChart3,
  users: Users,
  clock: Clock,
  globe: Globe,
  heart: Heart,
  star: Star,
  check: Check,
  lock: Lock,
  card: CreditCard,
  phone: Phone,
  mail: Mail,
  map: MapPin,
  calendar: Calendar,
  leaf: Leaf,
  truck: Truck,
  refresh: RefreshCw,
  gift: Gift,
  sparkles: Sparkles,
  book: BookOpen,
  play: Play,
  mic: Mic,
  camera: Camera,
  coffee: Coffee,
  utensils: UtensilsCrossed,
  bed: Bed,
  wifi: Wifi,
  car: Car,
  dumbbell: Dumbbell,
  stethoscope: Stethoscope,
  scale: Scale,
  briefcase: Briefcase,
  home: Home,
  search: Search,
  message: MessageCircle,
  code: Code2,
  layers: Layers,
  target: Target,
  award: Award,
  music: Music,
  ticket: Ticket,
  sun: Sun,
  droplet: Droplet,
  battery: Battery,
  smartphone: Smartphone,
  headphones: Headphones,
  pen: PenTool,
  palette: Palette,
  trending: TrendingUp,
  pie: PieChart,
  bell: Bell,
  settings: Settings,
  folder: Folder,
  file: FileText,
  download: Download,
  wallet: Wallet,
  package: Package,
  inbox: Inbox,
  dashboard: LayoutDashboard,
  rocket: Rocket,
  cloud: Cloud,
  terminal: Terminal,
  graduation: GraduationCap,
  trophy: Trophy,
  handshake: Handshake,
  gavel: Gavel,
  building: Building2,
  sprout: Sprout,
  tree: TreePine,
  recycle: Recycle,
  'heart-pulse': HeartPulse,
  brain: Brain,
  baby: Baby,
  eye: Eye,
  smile: Smile,
  activity: Activity,
  timer: Timer,
  waves: Waves,
  mountain: Mountain,
  plane: Plane,
  flame: Flame,
  wind: Wind,
  accessibility: Accessibility,
  parking: CircleParking,
  bus: Bus,
  video: Video,
  hash: Hash,
  lightbulb: Lightbulb,
  megaphone: Megaphone,
  percent: Percent,
  tag: Tag,
  gem: Gem,
  compass: Compass,
  luggage: Luggage,
  key: Key,
  ruler: Ruler,
  bath: Bath,
  sofa: Sofa,
  wine: Wine,
  croissant: Croissant,
}

export function Icon({ name, size = 20, color, strokeWidth = 1.9 }: { name: IconName; size?: number; color?: string; strokeWidth?: number }) {
  const C = ICONS[name] ?? Star
  return <C width={size} height={size} color={color} strokeWidth={strokeWidth} aria-hidden="true" style={{ flex: 'none', display: 'block' }} />
}

/* -------------------------------------------------------------------------- */
/* Cores por tom de seção                                                      */
/* -------------------------------------------------------------------------- */

export interface Tone {
  bg: string
  fg: string
  muted: string
  surface: string
  border: string
  accent: string
  onAccent: string
  soft: string
}

export function toneOf(t: TplTheme, tone: SectionTone = 'bg'): Tone {
  switch (tone) {
    case 'surface':
      return { bg: t.surface, fg: t.text, muted: t.muted, surface: t.bg, border: t.border, accent: t.primary, onAccent: t.onPrimary, soft: t.primarySoft }
    case 'primary': {
      const fg = t.onPrimary
      return {
        bg: t.primary,
        fg,
        muted: mix(fg, t.primary, 0.22),
        surface: mix(t.primary, fg, 0.1),
        border: mix(t.primary, fg, 0.28),
        accent: fg,
        onAccent: t.primary,
        soft: mix(t.primary, fg, 0.16),
      }
    }
    case 'invert':
      return {
        bg: t.text,
        fg: t.bg,
        muted: mix(t.bg, t.text, 0.34),
        surface: mix(t.text, t.bg, 0.08),
        border: mix(t.text, t.bg, 0.2),
        accent: t.primary,
        onAccent: t.onPrimary,
        soft: mix(t.text, t.primary, 0.2),
      }
    default:
      return { bg: t.bg, fg: t.text, muted: t.muted, surface: t.surface, border: t.border, accent: t.primary, onAccent: t.onPrimary, soft: t.primarySoft }
  }
}

/* -------------------------------------------------------------------------- */
/* Estrutura                                                                   */
/* -------------------------------------------------------------------------- */

export const padX = (m: boolean) => (m ? 20 : 48)
export const padY = (m: boolean) => (m ? 56 : 88)

export function Wrap({ m, children, style, narrow }: { m: boolean; children: ReactNode; style?: CSSProperties; narrow?: number }) {
  return (
    <div style={{ width: '100%', maxWidth: (narrow ?? 1120) + padX(m) * 2, margin: '0 auto', padding: `0 ${padX(m)}px`, boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  )
}

export function Block({
  ctx,
  tone,
  children,
  style,
  as = 'section',
  pad,
}: {
  ctx: RCtx
  tone?: SectionTone
  children: ReactNode
  style?: CSSProperties
  as?: 'section' | 'header' | 'footer' | 'div'
  pad?: number
}) {
  const c = toneOf(ctx.t, tone ?? ctx.s.tone)
  const Tag = as
  return (
    <Tag
      style={{
        background: c.bg,
        color: c.fg,
        padding: `${pad ?? padY(ctx.m)}px 0`,
        fontFamily: ctx.t.body,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/* Tipografia                                                                  */
/* -------------------------------------------------------------------------- */

const SERIF = ['fraunces', 'georgia']

export function headingWeight(t: TplTheme) {
  return SERIF.includes(t.headingId) ? 600 : t.headingId === 'jetbrains-mono' ? 600 : 700
}

/** Título com trecho destacado entre *asteriscos*. */
export function Rich({ text, color, italic }: { text: string; color?: string; italic?: boolean }) {
  const parts = text.split('*')
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} style={{ color, fontStyle: italic ? 'italic' : undefined }}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

export const plain = (text = '') => text.replace(/\*/g, '')

export function H({
  ctx,
  level = 2,
  children,
  style,
  size,
}: {
  ctx: RCtx
  level?: 1 | 2 | 3
  children: ReactNode
  style?: CSSProperties
  size?: number
}) {
  const { t, m } = ctx
  const base = level === 1 ? (m ? 36 : 60) : level === 2 ? (m ? 28 : 40) : m ? 17.5 : 19
  const Tag = (`h${level}` as const)
  return (
    <Tag
      style={{
        margin: 0,
        fontFamily: t.heading,
        fontWeight: level === 3 ? Math.min(headingWeight(t), 650) : headingWeight(t),
        fontSize: size ?? base,
        lineHeight: level === 1 ? 1.06 : level === 2 ? 1.14 : 1.3,
        letterSpacing: level === 3 ? '-0.005em' : '-0.022em',
        textWrap: 'balance' as CSSProperties['textWrap'],
        overflowWrap: 'break-word',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}

export function P({ ctx, children, style, size, color }: { ctx: RCtx; children: ReactNode; style?: CSSProperties; size?: number; color?: string }) {
  return (
    <p style={{ margin: 0, fontSize: size ?? (ctx.m ? 15.5 : 17), lineHeight: 1.6, color, overflowWrap: 'break-word', ...style }}>
      {children}
    </p>
  )
}

export function Eyebrow({ ctx, children, color, pill, style }: { ctx: RCtx; children: ReactNode; color?: string; pill?: boolean; style?: CSSProperties }) {
  const c = toneOf(ctx.t, ctx.s.tone)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13.5,
        fontWeight: 600,
        letterSpacing: pill ? 0 : '0.06em',
        textTransform: pill ? 'none' : 'uppercase',
        color: color ?? c.accent,
        ...(pill ? { padding: '6px 14px', borderRadius: ctx.t.rSm === 0 ? 0 : 999, background: c.soft, color: color ?? (ctx.s.tone === 'primary' ? c.fg : ctx.t.dark ? c.fg : c.accent) } : null),
        ...style,
      }}
    >
      {children}
    </span>
  )
}

/** Cabeçalho padrão de seção (selo + título + texto), alinhado à esquerda ou centralizado. */
export function SectionHead({ ctx, center, style, max = 680 }: { ctx: RCtx; center?: boolean; style?: CSSProperties; max?: number }) {
  const { s } = ctx
  const c = toneOf(ctx.t, s.tone)
  if (!s.title && !s.eyebrow && !s.text) return null
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: max, margin: center ? '0 auto' : undefined, textAlign: center ? 'center' : 'left', justifyItems: center ? 'center' : 'start', marginBottom: ctx.m ? 28 : 44, ...style }}>
      {s.eyebrow && <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>}
      {s.title && (
        <H ctx={ctx} level={2}>
          <Rich text={s.title} color={s.tone === 'primary' ? undefined : c.accent} />
        </H>
      )}
      {s.text && <P ctx={ctx} color={c.muted}>{s.text}</P>}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Botões, campos e pequenos elementos                                         */
/* -------------------------------------------------------------------------- */

export function Btn({
  ctx,
  children,
  kind = 'primary',
  block,
  size = 'md',
  icon,
  tone,
  style,
}: {
  ctx: RCtx
  children: ReactNode
  kind?: 'primary' | 'secondary' | 'ghost' | 'light'
  block?: boolean
  size?: 'sm' | 'md' | 'lg'
  icon?: IconName
  tone?: SectionTone
  style?: CSSProperties
}) {
  const { t } = ctx
  const c = toneOf(t, tone ?? ctx.s.tone)
  const h = size === 'sm' ? 38 : size === 'lg' ? 54 : 48
  const colors: CSSProperties =
    kind === 'primary'
      ? { background: c.accent, color: c.onAccent, border: `1.5px solid ${c.accent}` }
      : kind === 'light'
        ? { background: '#ffffff', color: '#111111', border: '1.5px solid #ffffff' }
        : kind === 'secondary'
          ? { background: 'transparent', color: c.fg, border: `1.5px solid ${mix(c.bg, c.fg, 0.32)}` }
          : { background: 'transparent', color: c.fg, border: '1.5px solid transparent' }
  return (
    <span
      style={{
        display: block ? 'flex' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: h,
        padding: `0 ${size === 'sm' ? 16 : size === 'lg' ? 28 : 22}px`,
        borderRadius: t.rMd,
        fontFamily: t.body,
        fontSize: size === 'sm' ? 14 : size === 'lg' ? 16.5 : 15.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        width: block ? '100%' : undefined,
        ...colors,
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={17} />}
      {children}
    </span>
  )
}

/** Grupo de botões: lado a lado no desktop, empilhados em largura total no celular. */
export function BtnRow({ ctx, children, center, style }: { ctx: RCtx; children: ReactNode; center?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: ctx.m ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: center ? 'center' : 'flex-start',
        alignItems: ctx.m ? 'stretch' : 'center',
        width: ctx.m ? '100%' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function FakeInput({ ctx, placeholder, label, tone, style }: { ctx: RCtx; placeholder: string; label?: string; tone?: SectionTone; style?: CSSProperties }) {
  const { t } = ctx
  const c = toneOf(t, tone ?? ctx.s.tone)
  const onDarkPrimary = (tone ?? ctx.s.tone) === 'primary'
  return (
    <div style={{ display: 'grid', gap: 6, minWidth: 0, ...style }}>
      {label && <span style={{ fontSize: 13.5, fontWeight: 600, color: c.fg }}>{label}</span>}
      <div
        style={{
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          borderRadius: t.rMd,
          border: `1.5px solid ${onDarkPrimary ? 'transparent' : mix(c.bg, c.fg, 0.2)}`,
          background: onDarkPrimary ? '#ffffff' : t.dark ? mix(c.bg, '#ffffff', 0.05) : '#ffffff',
          color: onDarkPrimary ? '#6b6b75' : c.muted,
          fontSize: 15,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          boxSizing: 'border-box',
        }}
      >
        {placeholder}
      </div>
    </div>
  )
}

export function Chip({ ctx, children, active, tone, style }: { ctx: RCtx; children: ReactNode; active?: boolean; tone?: SectionTone; style?: CSSProperties }) {
  const c = toneOf(ctx.t, tone ?? ctx.s.tone)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minHeight: 34,
        padding: '0 14px',
        borderRadius: ctx.t.rSm === 0 ? 0 : 999,
        border: `1px solid ${active ? c.accent : c.border}`,
        background: active ? c.accent : 'transparent',
        color: active ? c.onAccent : c.fg,
        fontSize: 14,
        fontWeight: 560,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export function Stars({ color, size = 15 }: { color: string; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }} aria-label="5 de 5 estrelas">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} width={size} height={size} fill={color} color={color} strokeWidth={1.5} aria-hidden="true" />
      ))}
    </span>
  )
}

const AVATAR_TONES = ['#f4a261', '#2a9d8f', '#e76f51', '#8ab17d', '#6d597a', '#e9c46a', '#457b9d', '#b5838d']

export function hashOf(text: string) {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0
  return h
}

export function Avatar({ name, size = 44, ring }: { name: string; size?: number; ring?: string }) {
  const bg = AVATAR_TONES[hashOf(name) % AVATAR_TONES.length]
  const initials = name
    .replace(/^(Dra?\.|Profa?\.)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        color: readableOn(bg),
        fontSize: size * 0.38,
        fontWeight: 650,
        fontFamily: 'system-ui, sans-serif',
        boxShadow: ring ? `0 0 0 3px ${ring}` : undefined,
      }}
    >
      {initials}
    </span>
  )
}

/** Marca fictícia: símbolo simples + nome. */
export function BrandMark({ ctx, color, size = 19, name }: { ctx: RCtx; color?: string; size?: number; name?: string }) {
  const { t } = ctx
  const c = toneOf(t, ctx.s.tone)
  const label = name ?? ctx.brand
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: t.heading, fontWeight: headingWeight(t), fontSize: size, color: color ?? c.fg, letterSpacing: '-0.02em', whiteSpace: 'nowrap', minWidth: 0 }}>
      <span
        aria-hidden="true"
        style={{
          width: size + 9,
          height: size + 9,
          borderRadius: t.radius === 'none' ? 0 : t.radius === 'pill' ? '50%' : Math.min(t.rMd, 10),
          background: c.accent,
          color: c.onAccent,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.78,
          fontWeight: 700,
          flex: 'none',
        }}
      >
        {label.replace(/^(Revista|Instituto|Clínica|Pousada|Estúdio|Escola|Summit|Festival)\s+/i, '').charAt(0)}
      </span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
    </span>
  )
}

/** Logotipo fictício (wordmark) para faixas de clientes/parceiros. */
export function Wordmark({ name, index, color, font }: { name: string; index: number; color: string; font: string }) {
  const shape = index % 4
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color, fontFamily: font, fontWeight: 700, fontSize: 19, letterSpacing: index % 2 ? '0.04em' : '-0.02em', textTransform: index % 3 === 1 ? 'uppercase' : 'none', whiteSpace: 'nowrap' }}>
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" style={{ flex: 'none' }}>
        {shape === 0 && <circle cx="10" cy="10" r="8" fill={color} />}
        {shape === 1 && <rect x="3" y="3" width="14" height="14" rx="3" fill={color} />}
        {shape === 2 && <path d="M10 2 18 17H2Z" fill={color} />}
        {shape === 3 && <path d="M2 10a8 8 0 0 1 16 0h-5a3 3 0 0 0-6 0Z" fill={color} />}
      </svg>
      {name}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Ilustrações (SVG inline)                                                    */
/* -------------------------------------------------------------------------- */

const SKIN = ['#f1c7a5', '#d9a07a', '#a86f4c', '#7a4b2f', '#e8b896', '#c58c62']
const HAIR = ['#2b1d16', '#4a3020', '#1c1c1c', '#7a4a26', '#b98245', '#3b2a22']
const FABRIC = ['#c9a27e', '#7d8f69', '#d8c3a5', '#b85c38', '#4f6d7a', '#e0b1a5', '#8c6a5d', '#2f3e46']

export function Art({
  kind,
  t,
  seed = 0,
  style,
  radius,
  label,
}: {
  kind: ArtKind
  t: TplTheme
  seed?: number
  style?: CSSProperties
  radius?: number
  label?: string
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const id = (n: string) => `${uid}${n}`
  const p = t.primary
  const pd = mix(p, '#000000', 0.35)
  const pl = mix(p, '#ffffff', 0.55)
  const s = Math.abs(seed)
  const ground = t.dark ? mix(t.bg, '#ffffff', 0.08) : mix(t.bg, t.text, 0.06)

  let body: ReactNode
  let viewBox = '0 0 400 300'
  let fit: 'slice' | 'meet' = 'slice'
  let background: string | undefined

  switch (kind) {
    case 'ui': {
      const win = t.dark ? mix(t.bg, '#ffffff', 0.06) : '#ffffff'
      const line = t.dark ? mix(t.bg, '#ffffff', 0.16) : mix('#ffffff', t.text, 0.1)
      const fill = t.dark ? mix(t.bg, '#ffffff', 0.11) : mix('#ffffff', t.text, 0.05)
      background = t.dark ? mix(t.bg, p, 0.1) : mix(t.bg, p, 0.06)
      body = (
        <>
          <rect x="22" y="22" width="356" height="256" rx="10" fill={win} stroke={line} />
          <rect x="22" y="22" width="356" height="26" rx="10" fill={fill} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={38 + i * 12} cy="35" r="4" fill={line} />
          ))}
          <rect x="34" y="60" width="70" height="206" rx="6" fill={fill} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x="44" y={74 + i * 22} width={i === 1 ? 50 : 40} height="8" rx="4" fill={i === 1 ? p : line} />
          ))}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={116 + i * 86} y="60" width="78" height="52" rx="6" fill={fill} />
              <rect x={124 + i * 86} y="70" width="34" height="6" rx="3" fill={line} />
              <rect x={124 + i * 86} y="84" width="48" height="12" rx="4" fill={i === 0 ? p : mix(fill, t.text, 0.25)} />
            </g>
          ))}
          <rect x="116" y="124" width="250" height="142" rx="6" fill={fill} />
          <path d="M128 240 C 160 200, 190 226, 220 190 S 280 170, 310 150 S 346 140, 356 132" fill="none" stroke={p} strokeWidth="3" />
          <path d="M128 240 C 160 200, 190 226, 220 190 S 280 170, 310 150 S 346 140, 356 132 V 256 H 128 Z" fill={p} opacity="0.12" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="128" x2="356" y1={150 + i * 28} y2={150 + i * 28} stroke={line} strokeDasharray="3 4" />
          ))}
        </>
      )
      break
    }
    case 'phone': {
      viewBox = '0 0 220 400'
      fit = 'meet'
      const scr = t.dark ? mix(t.bg, '#ffffff', 0.06) : '#ffffff'
      const line = t.dark ? mix(t.bg, '#ffffff', 0.18) : mix('#ffffff', t.text, 0.1)
      body = (
        <>
          <rect x="20" y="10" width="180" height="380" rx="30" fill="#141418" />
          <rect x="28" y="18" width="164" height="364" rx="24" fill={scr} />
          <rect x="88" y="26" width="44" height="10" rx="5" fill="#141418" />
          <rect x="40" y="52" width="140" height="78" rx="14" fill={p} />
          <rect x="52" y="66" width="50" height="8" rx="4" fill={readableOn(p)} opacity="0.7" />
          <rect x="52" y="84" width="84" height="16" rx="5" fill={readableOn(p)} />
          <rect x="52" y="108" width="40" height="8" rx="4" fill={readableOn(p)} opacity="0.5" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <circle cx="56" cy={160 + i * 44} r="14" fill={i % 2 ? pl : mix(scr, p, 0.18)} />
              <rect x="78" y={152 + i * 44} width={70 - i * 6} height="7" rx="3.5" fill={line} />
              <rect x="78" y={164 + i * 44} width="42" height="6" rx="3" fill={line} opacity="0.6" />
              <rect x="150" y={154 + i * 44} width="28" height="9" rx="4.5" fill={i === 0 ? p : line} />
            </g>
          ))}
          <rect x="40" y="338" width="140" height="30" rx="15" fill={mix(scr, t.text, 0.06)} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={64 + i * 31} cy="353" r="5" fill={i === 0 ? p : line} />
          ))}
        </>
      )
      break
    }
    case 'card': {
      fit = 'meet'
      background = mix(t.bg, p, t.dark ? 0.12 : 0.08)
      body = (
        <>
          <defs>
            <linearGradient id={id('g')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={mix(p, '#ffffff', 0.15)} />
              <stop offset="1" stopColor={pd} />
            </linearGradient>
          </defs>
          <g transform="rotate(-12 200 150)">
            <rect x="70" y="80" width="210" height="132" rx="14" fill={mix(t.text, '#000', 0.2)} opacity="0.9" />
          </g>
          <g transform="rotate(6 200 150)">
            <rect x="110" y="70" width="220" height="140" rx="14" fill={`url(#${id('g')})`} />
            <rect x="132" y="104" width="34" height="26" rx="5" fill="#e9c46a" />
            <path d="M296 92a12 12 0 1 0 0 0.1" fill="none" />
            <circle cx="296" cy="100" r="11" fill="#ffffff" opacity="0.55" />
            <circle cx="308" cy="100" r="11" fill="#ffffff" opacity="0.3" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={132 + i * 44} y="156" width="34" height="8" rx="4" fill="#ffffff" opacity="0.75" />
            ))}
            <rect x="132" y="180" width="80" height="7" rx="3.5" fill="#ffffff" opacity="0.5" />
          </g>
        </>
      )
      break
    }
    case 'chart': {
      background = t.dark ? mix(t.bg, '#ffffff', 0.05) : mix(t.bg, p, 0.05)
      const line = t.dark ? mix(t.bg, '#ffffff', 0.16) : mix('#ffffff', t.text, 0.12)
      const bars = [90, 130, 110, 160, 140, 190, 210]
      body = (
        <>
          <rect x="30" y="30" width="340" height="240" rx="12" fill={t.dark ? mix(t.bg, '#ffffff', 0.07) : '#ffffff'} stroke={line} />
          <rect x="52" y="50" width="90" height="10" rx="5" fill={line} />
          <rect x="52" y="68" width="60" height="18" rx="5" fill={t.text} opacity="0.75" />
          {bars.map((h, i) => (
            <rect key={i} x={60 + i * 42} y={250 - h * 0.7} width="24" height={h * 0.7} rx="4" fill={i === bars.length - 1 ? p : mix(p, t.dark ? t.bg : '#ffffff', 0.62)} />
          ))}
          <path d="M60 210 L 102 196 L 144 204 L 186 170 L 228 178 L 270 142 L 312 120" fill="none" stroke={pd} strokeWidth="3" strokeLinecap="round" />
          <circle cx="312" cy="120" r="6" fill={p} stroke="#fff" strokeWidth="2" />
        </>
      )
      break
    }
    case 'abstract': {
      const a = [p, mix(p, '#ffffff', 0.4), t.dark ? '#f5f5f5' : t.text, mix(p, '#e9c46a', 0.5)]
      background = t.dark ? mix(t.bg, '#ffffff', 0.06) : mix(t.bg, t.text, 0.05)
      body = (
        <>
          <circle cx={120 + (s % 3) * 30} cy="140" r="90" fill={a[0]} />
          <rect x="210" y="40" width="150" height="150" fill={a[2]} opacity="0.9" />
          <path d="M210 190 a 75 75 0 0 1 150 0 Z" fill={a[3]} />
          <rect x="60" y="240" width="300" height="10" fill={a[2]} opacity="0.8" />
          <circle cx="300" cy="115" r="30" fill={a[1]} />
        </>
      )
      break
    }
    case 'blob': {
      background = t.dark ? t.bg : mix(t.bg, p, 0.04)
      body = (
        <>
          <defs>
            <filter id={id('b')} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="28" />
            </filter>
          </defs>
          <g filter={`url(#${id('b')})`}>
            <circle cx="150" cy="150" r="90" fill={p} opacity="0.85" />
            <circle cx="250" cy="120" r="80" fill={mix(p, '#7c3aed', 0.6)} opacity="0.7" />
            <circle cx="230" cy="210" r="70" fill={mix(p, '#06b6d4', 0.6)} opacity="0.6" />
          </g>
        </>
      )
      break
    }
    case 'landscape':
    case 'beach':
    case 'forest': {
      const warm = kind === 'landscape' ? ['#f8c291', '#f6e58d'] : kind === 'beach' ? ['#9ad0ec', '#e6f4fa'] : ['#cfe3d3', '#eef5ec']
      body = (
        <>
          <defs>
            <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={warm[0]} />
              <stop offset="1" stopColor={warm[1]} />
            </linearGradient>
            <linearGradient id={id('sea')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2e86ab" />
              <stop offset="1" stopColor="#1b4965" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill={`url(#${id('sky')})`} />
          {kind !== 'forest' && <circle cx={kind === 'beach' ? 300 : 270} cy={kind === 'beach' ? 70 : 120} r={kind === 'beach' ? 26 : 34} fill={kind === 'beach' ? '#fff3c4' : '#fdf1d6'} />}
          {kind === 'landscape' && (
            <>
              <path d="M0 200 L70 120 L130 170 L210 90 L290 175 L340 130 L400 180 V300 H0Z" fill="#8a6f8f" opacity="0.65" />
              <path d="M0 230 L90 160 L170 215 L250 150 L330 210 L400 170 V300 H0Z" fill="#4f5d75" />
              <path d="M0 260 L120 215 L220 250 L320 222 L400 245 V300 H0Z" fill="#2d3142" />
              <rect y="268" width="400" height="32" fill={mix('#2d3142', p, 0.25)} />
            </>
          )}
          {kind === 'beach' && (
            <>
              <rect y="160" width="400" height="70" fill={`url(#${id('sea')})`} />
              <path d="M0 214 C 80 204, 160 222, 240 212 S 360 206, 400 212 V300 H0Z" fill="#f2dfb6" />
              <path d="M0 226 C 80 218, 160 234, 240 224 S 360 220, 400 226" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.7" />
              <path d="M300 250 C 296 210, 300 180, 318 150" stroke="#6b4f3a" strokeWidth="7" fill="none" strokeLinecap="round" />
              {[-60, -20, 20, 60, 100].map((a, i) => (
                <ellipse key={i} cx="318" cy="150" rx="40" ry="9" fill="#3a7d44" transform={`rotate(${a} 318 150) translate(30 0)`} />
              ))}
            </>
          )}
          {kind === 'forest' && (
            <>
              {[0, 1, 2].map((row) =>
                Array.from({ length: 9 }).map((_, i) => {
                  const x = i * 52 - 20 + row * 18
                  const y = 150 + row * 45
                  const h = 90 + ((i * 37 + row * 13) % 40)
                  const col = row === 0 ? '#7fa58a' : row === 1 ? '#3f7a52' : '#1f4d33'
                  return <path key={`${row}-${i}`} d={`M${x} ${y + 60} L${x + 26} ${y + 60 - h} L${x + 52} ${y + 60}Z`} fill={col} />
                }),
              )}
              <rect y="262" width="400" height="38" fill="#173a27" />
            </>
          )}
        </>
      )
      break
    }
    case 'city': {
      body = (
        <>
          <defs>
            <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3d405b" />
              <stop offset="1" stopColor="#f2a65a" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill={`url(#${id('sky')})`} />
          {[
            [10, 140, 50],
            [62, 100, 40],
            [104, 160, 60],
            [166, 80, 46],
            [214, 130, 58],
            [274, 60, 44],
            [320, 120, 70],
          ].map(([x, y, w], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={300 - y} fill={i % 2 ? '#22223b' : '#2b2d42'} />
              {Array.from({ length: Math.floor((300 - y) / 22) }).map((_, r) =>
                [0, 1].map((cI) => (
                  <rect key={`${r}-${cI}`} x={x + 8 + cI * (w / 2 - 4)} y={y + 10 + r * 22} width={w / 2 - 14} height="8" fill={(r + cI + i) % 3 === 0 ? '#ffd166' : '#3d405b'} />
                )),
              )}
            </g>
          ))}
        </>
      )
      break
    }
    case 'building': {
      const wall = ['#f4efe6', '#e8e2d6', '#d9cfc1'][s % 3]
      body = (
        <>
          <rect width="400" height="300" fill="#bfdbe8" />
          <circle cx="330" cy="60" r="24" fill="#fff4cf" />
          <rect x="90" y="60" width="220" height="220" fill={wall} />
          <rect x="80" y="50" width="240" height="14" fill={mix(wall, '#000', 0.25)} />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2].map((c) => (
              <g key={`${r}-${c}`}>
                <rect x={108 + c * 66} y={80 + r * 46} width="50" height="32" fill="#9cc5d9" stroke={mix(wall, '#000', 0.3)} strokeWidth="3" />
                <rect x={104 + c * 66} y={112 + r * 46} width="58" height="5" fill={mix(wall, '#000', 0.15)} />
              </g>
            )),
          )}
          <rect x="176" y="236" width="48" height="44" fill={pd} />
          <rect y="278" width="400" height="22" fill="#7a9e7e" />
          <circle cx="50" cy="230" r="38" fill="#4f7d5b" />
          <rect x="47" y="240" width="6" height="40" fill="#5b4636" />
          <circle cx="352" cy="240" r="30" fill="#5f8f6a" />
        </>
      )
      break
    }
    case 'room': {
      const wall = ['#efe7dc', '#e3ebe6', '#f1e4dc'][s % 3]
      const sofa = FABRIC[(s + 3) % FABRIC.length]
      body = (
        <>
          <rect width="400" height="300" fill={wall} />
          <rect y="220" width="400" height="80" fill="#c8a98a" />
          <rect x="250" y="40" width="110" height="130" fill="#cfe6f2" stroke="#ffffff" strokeWidth="8" />
          <line x1="305" x2="305" y1="40" y2="170" stroke="#ffffff" strokeWidth="5" />
          <rect x="60" y="60" width="80" height="60" fill={pl} stroke="#8c6a5d" strokeWidth="4" />
          <rect x="40" y="170" width="200" height="60" rx="14" fill={sofa} />
          <rect x="52" y="140" width="176" height="50" rx="14" fill={mix(sofa, '#ffffff', 0.15)} />
          <rect x="70" y="228" width="8" height="18" fill="#5b4636" />
          <rect x="202" y="228" width="8" height="18" fill="#5b4636" />
          <ellipse cx="330" cy="250" rx="60" ry="10" fill="#b08968" opacity="0.6" />
          <rect x="318" y="190" width="24" height="40" rx="4" fill="#d4a373" />
          <path d="M330 190 C 300 150, 300 130, 320 120 M330 190 C 350 150, 365 140, 360 118 M330 190 C 330 150, 330 130, 336 110" stroke="#3a7d44" strokeWidth="9" fill="none" strokeLinecap="round" />
          <line x1="268" x2="268" y1="120" y2="226" stroke="#3c3c3c" strokeWidth="3" />
          <path d="M248 120 h40 l-8 -26 h-24z" fill={p} />
        </>
      )
      break
    }
    case 'food': {
      const table = t.dark ? '#2a1f19' : '#d8c3a5'
      body = (
        <>
          <rect width="400" height="300" fill={table} />
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={i} x1="0" x2="400" y1={i * 48 + 10} y2={i * 48 + 18} stroke={mix(table, '#000', 0.12)} strokeWidth="2" />
          ))}
          <circle cx="200" cy="150" r="112" fill={mix(table, '#000', 0.25)} opacity="0.35" />
          <circle cx="196" cy="146" r="108" fill="#f7f3ee" />
          <circle cx="196" cy="146" r="84" fill="#efe8df" />
          <path d={`M150 130 C 170 ${100 + (s % 3) * 4}, 230 100, 245 135 C 250 160, 220 182, 190 180 C 160 178, 140 160, 150 130 Z`} fill="#8b4a2b" />
          <path d="M160 140 C 180 120, 220 118, 236 140" stroke="#5c2e18" strokeWidth="4" fill="none" />
          <circle cx="240" cy="180" r="16" fill="#e9c46a" />
          <circle cx="150" cy="182" r="12" fill="#e76f51" />
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} cx={170 + i * 14} cy={196 - (i % 2) * 6} rx="9" ry="4" fill="#6a994e" transform={`rotate(${i * 30} ${170 + i * 14} ${196 - (i % 2) * 6})`} />
          ))}
          <circle cx="215" cy="125" r="4" fill="#bc4749" />
          <rect x="330" y="50" width="10" height="200" rx="5" fill="#c0c0c0" />
          <rect x="356" y="50" width="12" height="200" rx="6" fill="#d0d0d0" />
          <circle cx="60" cy="70" r="34" fill="#f2e8cf" opacity="0.9" />
          <circle cx="60" cy="70" r="24" fill="#a7c957" />
        </>
      )
      break
    }
    case 'coffee': {
      const table = t.dark ? '#3b2a20' : '#e9dccb'
      body = (
        <>
          <rect width="400" height="300" fill={table} />
          <circle cx="200" cy="150" r="96" fill="#f8f4ee" />
          <circle cx="200" cy="150" r="70" fill="#ffffff" stroke="#eadfce" strokeWidth="6" />
          <circle cx="200" cy="150" r="56" fill="#7b4a2e" />
          <circle cx="200" cy="150" r="48" fill="#c69c6d" />
          <path d="M200 172 C 172 150, 176 128, 192 130 C 198 131, 200 138, 200 142 C 200 138, 202 131, 208 130 C 224 128, 228 150, 200 172 Z" fill="#f6eadb" />
          <path d="M268 140 h20 a14 14 0 0 1 0 28 h-20" fill="none" stroke="#ffffff" strokeWidth="8" />
          {[
            [60, 60],
            [90, 230],
            [330, 70],
            [340, 240],
            [70, 150],
          ].map(([x, y], i) => (
            <g key={i} transform={`rotate(${i * 40} ${x} ${y})`}>
              <ellipse cx={x} cy={y} rx="12" ry="8" fill="#4a2c1d" />
              <path d={`M${x - 10} ${y} q10 -4 20 0`} stroke="#2b190f" strokeWidth="2" fill="none" />
            </g>
          ))}
        </>
      )
      break
    }
    case 'portrait': {
      const skin = SKIN[s % SKIN.length]
      const hair = HAIR[(s + 2) % HAIR.length]
      const shirt = FABRIC[(s + 1) % FABRIC.length]
      background = [mix(t.bg, p, 0.22), '#e9dfd3', '#d7e3e8', '#efe1d1', '#dde5d6'][s % 5]
      body = (
        <>
          <rect width="400" height="300" fill={background} />
          <circle cx="320" cy="60" r="70" fill="#ffffff" opacity="0.25" />
          <path d="M120 300 C 120 220, 160 196, 200 196 C 240 196, 280 220, 280 300 Z" fill={shirt} />
          <rect x="186" y="164" width="28" height="40" rx="12" fill={mix(skin, '#000', 0.08)} />
          <ellipse cx="200" cy="130" rx="44" ry="52" fill={skin} />
          {s % 3 === 0 ? (
            <path d="M154 130 C 150 80, 180 66, 204 68 C 236 70, 252 94, 246 132 C 240 110, 220 96, 196 98 C 176 100, 160 112, 154 130 Z" fill={hair} />
          ) : s % 3 === 1 ? (
            <path d="M150 150 C 140 80, 180 60, 206 64 C 246 70, 262 110, 252 170 C 248 140, 246 112, 226 100 C 200 110, 176 104, 160 112 C 154 124, 152 140, 150 150 Z" fill={hair} />
          ) : (
            <path d="M158 116 C 160 84, 184 72, 204 74 C 228 76, 244 90, 242 116 C 230 100, 180 98, 158 116 Z" fill={hair} />
          )}
          <circle cx="184" cy="134" r="3.5" fill="#2b1d16" />
          <circle cx="216" cy="134" r="3.5" fill="#2b1d16" />
          <path d="M188 156 q12 9 24 0" stroke="#7a3e2b" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )
      break
    }
    case 'product':
    case 'bottle': {
      fit = 'meet'
      background = mix(t.bg, p, t.dark ? 0.12 : 0.07)
      const tint = seed > 0 ? ['#2d6a4f', '#d8c3a5', '#22223b', '#e76f51', p][seed % 5] : p
      body =
        kind === 'bottle' ? (
          <>
            <ellipse cx="200" cy="268" rx="90" ry="14" fill="#000" opacity="0.12" />
            <ellipse cx="200" cy="262" rx="110" ry="18" fill={mix(background, '#000', 0.08)} />
            <rect x="166" y="70" width="68" height="190" rx="22" fill={tint} />
            <rect x="174" y="52" width="52" height="30" rx="8" fill={mix(tint, '#000', 0.3)} />
            <rect x="184" y="38" width="32" height="18" rx="6" fill={mix(tint, '#000', 0.45)} />
            <rect x="176" y="86" width="10" height="150" rx="5" fill="#ffffff" opacity="0.28" />
            <rect x="166" y="120" width="68" height="4" fill={mix(tint, '#000', 0.15)} />
          </>
        ) : (
          <>
            <ellipse cx="200" cy="262" rx="120" ry="20" fill={mix(background, '#000', 0.1)} />
            <rect x="80" y="226" width="240" height="36" fill={mix(background, '#000', 0.06)} />
            <ellipse cx="200" cy="226" rx="120" ry="20" fill={mix(background, '#ffffff', 0.4)} />
            <rect x="150" y="90" width="100" height="134" rx="26" fill={tint} />
            <circle cx="200" cy="150" r="30" fill={mix(tint, '#000', 0.3)} />
            <circle cx="200" cy="150" r="18" fill={mix(tint, '#ffffff', 0.2)} />
            <rect x="160" y="100" width="10" height="110" rx="5" fill="#ffffff" opacity="0.25" />
          </>
        )
      break
    }
    case 'shoe': {
      fit = 'meet'
      background = ['#efe9e1', '#e6ecef', '#f1e6e1', '#e9efe4'][s % 4]
      const c1 = FABRIC[(s + 5) % FABRIC.length]
      body = (
        <>
          <ellipse cx="200" cy="236" rx="140" ry="12" fill="#000" opacity="0.1" />
          <path d="M80 220 C 80 180, 110 150, 150 140 C 180 132, 200 110, 230 120 C 260 130, 300 170, 330 190 C 345 200, 340 222, 320 224 L 90 228 Z" fill={c1} />
          <path d="M80 222 L 330 222 C 336 230, 330 238, 316 238 L 92 238 C 84 238, 78 230, 80 222 Z" fill="#f4f1ec" stroke="#d6d0c4" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={170 + i * 16} x2={182 + i * 16} y1={140 + i * 6} y2={150 + i * 6} stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          ))}
        </>
      )
      break
    }
    case 'bag': {
      fit = 'meet'
      background = ['#f1ebe3', '#e8ede9', '#efe6e0'][s % 3]
      const c1 = ['#c9a27e', '#8c6a5d', '#d8c3a5', '#b85c38'][s % 4]
      body = (
        <>
          <ellipse cx="200" cy="262" rx="110" ry="10" fill="#000" opacity="0.1" />
          <path d="M150 120 C 150 60, 250 60, 250 120" fill="none" stroke={mix(c1, '#000', 0.3)} strokeWidth="10" />
          <path d="M110 120 H290 L310 256 H90 Z" fill={c1} />
          <path d="M110 120 H290 L294 150 H106Z" fill={mix(c1, '#000', 0.12)} />
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={120 + i * 30} x2={112 + i * 32} y1="156" y2="250" stroke={mix(c1, '#000', 0.1)} strokeWidth="2" />
          ))}
        </>
      )
      break
    }
    case 'garment': {
      fit = 'meet'
      background = ['#efe8df', '#e5e9e4', '#f0e3df', '#e7e4ee'][s % 4]
      const c1 = FABRIC[s % FABRIC.length]
      body = (
        <>
          <path d="M200 40 v14" stroke="#7a6a5a" strokeWidth="4" />
          <path d="M200 40 a10 10 0 1 1 10 -10" stroke="#7a6a5a" strokeWidth="4" fill="none" />
          <path d="M140 74 L200 56 L260 74" stroke="#7a6a5a" strokeWidth="5" fill="none" strokeLinecap="round" />
          {s % 2 === 0 ? (
            <path d="M160 70 C 175 82, 225 82, 240 70 L 252 120 C 240 130, 236 140, 238 150 L 290 280 H 110 L 162 150 C 164 140, 160 130, 148 120 Z" fill={c1} />
          ) : (
            <path d="M150 72 L 176 66 C 186 80, 214 80, 224 66 L 250 72 L 300 110 L 278 140 L 256 126 L 256 270 H 144 L 144 126 L 122 140 L 100 110 Z" fill={c1} />
          )}
          <path d="M200 84 V 270" stroke={mix(c1, '#000', 0.12)} strokeWidth="2" opacity="0.6" />
        </>
      )
      break
    }
    case 'fitness': {
      body = (
        <>
          <defs>
            <linearGradient id={id('g')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1a1a1a" />
              <stop offset="1" stopColor={mix(p, '#000', 0.55)} />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill={`url(#${id('g')})`} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${240 + i * 50} 0 L ${150 + i * 50} 300 L ${180 + i * 50} 300 L ${270 + i * 50} 0Z`} fill="#ffffff" opacity={0.04 + i * 0.02} />
          ))}
          <rect x="70" y="190" width="200" height="14" rx="7" fill="#9a9a9a" />
          <rect x="60" y="160" width="26" height="74" rx="6" fill="#2b2b2b" stroke="#444" />
          <rect x="34" y="170" width="24" height="54" rx="6" fill="#2b2b2b" stroke="#444" />
          <rect x="254" y="160" width="26" height="74" rx="6" fill="#2b2b2b" stroke="#444" />
          <rect x="282" y="170" width="24" height="54" rx="6" fill="#2b2b2b" stroke="#444" />
          <path d="M318 120 a 28 28 0 0 1 56 0" fill="none" stroke="#3a3a3a" strokeWidth="12" />
          <circle cx="346" cy="160" r="40" fill="#2f2f2f" />
          <rect x="0" y="250" width="400" height="50" fill="#111" />
          <rect x="0" y="250" width="400" height="4" fill={p} opacity="0.8" />
        </>
      )
      break
    }
    case 'mic': {
      body = (
        <>
          <defs>
            <linearGradient id={id('g')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={p} />
              <stop offset="1" stopColor={mix(p, '#3b0764', 0.7)} />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill={`url(#${id('g')})`} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx="200" cy="120" r={60 + i * 34} fill="none" stroke="#ffffff" strokeWidth="2" opacity={0.28 - i * 0.06} />
          ))}
          <rect x="172" y="50" width="56" height="110" rx="28" fill="#1f1f24" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1="178" x2="222" y1={64 + i * 12} y2={64 + i * 12} stroke="#3a3a42" strokeWidth="3" />
          ))}
          <path d="M156 120 a 44 44 0 0 0 88 0" fill="none" stroke="#1f1f24" strokeWidth="8" />
          <rect x="196" y="164" width="8" height="70" fill="#1f1f24" />
          <rect x="160" y="232" width="80" height="10" rx="5" fill="#1f1f24" />
        </>
      )
      break
    }
    case 'stage': {
      body = (
        <>
          <rect width="400" height="300" fill="#140f24" />
          {[
            [70, p],
            [200, '#f9c74f'],
            [330, mix(p, '#4cc9f0', 0.6)],
          ].map(([x, col], i) => (
            <path key={i} d={`M${x} 0 L ${Number(x) - 80} 240 L ${Number(x) + 80} 240 Z`} fill={String(col)} opacity="0.28" />
          ))}
          <rect x="40" y="200" width="320" height="16" fill="#2a2140" />
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={i * 30 + 6} cy={262 + (i % 2) * 6} r="18" fill="#08060f" />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={`b${i}`} x={i * 30 - 12} y={272 + (i % 2) * 6} width="36" height="40" rx="14" fill="#08060f" />
          ))}
        </>
      )
      break
    }
    case 'book': {
      background = mix(t.bg, p, t.dark ? 0.14 : 0.1)
      body = (
        <>
          <rect width="400" height="300" fill={background} />
          <ellipse cx="200" cy="246" rx="140" ry="12" fill="#000" opacity="0.08" />
          <path d="M70 90 C 120 70, 170 76, 200 96 V 240 C 170 222, 120 218, 70 236 Z" fill="#ffffff" />
          <path d="M330 90 C 280 70, 230 76, 200 96 V 240 C 230 222, 280 218, 330 236 Z" fill="#f7f3ee" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <line x1="92" x2="180" y1={116 + i * 18} y2={110 + i * 18} stroke={i === 0 ? p : '#d6d0c4'} strokeWidth={i === 0 ? 5 : 3} strokeLinecap="round" />
              <line x1="220" x2="308" y1={110 + i * 18} y2={116 + i * 18} stroke="#d6d0c4" strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
          <path d="M200 96 V 240" stroke="#d6d0c4" strokeWidth="2" />
          <circle cx="330" cy="70" r="26" fill={p} />
          <path d="M320 70 l8 8 l14 -16" stroke={readableOn(p)} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
      break
    }
    case 'camera': {
      fit = 'meet'
      background = mix(t.bg, p, 0.08)
      body = (
        <>
          <rect x="90" y="100" width="220" height="140" rx="18" fill="#1f1f24" />
          <rect x="140" y="80" width="70" height="30" rx="8" fill="#1f1f24" />
          <circle cx="200" cy="170" r="52" fill="#3a3a42" />
          <circle cx="200" cy="170" r="36" fill="#0e0e12" />
          <circle cx="188" cy="158" r="9" fill="#ffffff" opacity="0.35" />
          <rect x="262" y="116" width="28" height="12" rx="4" fill={p} />
        </>
      )
      break
    }
    case 'plant': {
      background = ['#e8efe3', '#efe8dd', '#e3ece9'][s % 3]
      body = (
        <>
          <rect width="400" height="300" fill={background} />
          <circle cx="300" cy="80" r="60" fill="#ffffff" opacity="0.4" />
          <path d="M200 230 C 140 170, 120 120, 150 70 M200 230 C 210 160, 230 110, 270 80 M200 230 C 190 170, 196 120, 206 60 M200 230 C 250 200, 300 190, 320 150 M200 230 C 150 210, 100 200, 84 160" stroke="#3a7d44" strokeWidth="5" fill="none" strokeLinecap="round" />
          {[
            [150, 70, -30],
            [270, 80, 40],
            [206, 60, 0],
            [320, 150, 60],
            [84, 160, -60],
            [170, 140, -20],
            [240, 130, 30],
          ].map(([x, y, a], i) => (
            <ellipse key={i} cx={x} cy={y} rx="28" ry="13" fill={i % 2 ? '#4f9d5b' : '#6aaa64'} transform={`rotate(${a} ${x} ${y})`} />
          ))}
          <path d="M160 230 H240 L228 290 H172 Z" fill={p} />
          <rect x="152" y="222" width="96" height="14" rx="3" fill={mix(p, '#000', 0.2)} />
        </>
      )
      break
    }
  }

  return (
    <div
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: radius, background: background ?? ground, ...style }}
    >
      <svg viewBox={viewBox} preserveAspectRatio={`xMidYMid ${fit}`} width="100%" height="100%" style={{ display: 'block', position: 'absolute', inset: 0 }}>
        {body}
      </svg>
    </div>
  )
}

/** Escolhe a cor de texto sobre imagens escuras (gradiente aplicado por baixo). */
export const onImage = '#ffffff'
export const darkFor = (hex: string) => (isDark(hex) ? hex : mix(hex, '#000000', 0.6))
