/**
 * Blocos pequenos compartilhados pelos 20 sites de inspiração.
 * Cada site continua com composição própria: aqui ficam só utilitários neutros
 * (contêiner, ícones de linha, hambúrguer, ids de SVG).
 */
import { useId, type CSSProperties, type ReactNode } from 'react'
import { isDark, withAlpha } from '@/core/color'
import { fontStack } from '@/core/tokens'
import type { SitePalette, SiteProps } from '../types'

export type { SiteProps }

export const ff = fontStack

/** Escolhe o valor do desktop ou do celular. */
export const r = <T,>(mobile: boolean, desktop: T, phone: T): T => (mobile ? phone : desktop)

/** Linha fina derivada do texto (funciona em paletas claras e escuras). */
export const hair = (p: SitePalette, alpha = 0.14) => withAlpha(p.text, alpha)

/**
 * Faixa “invertida” (fundo na cor do texto). Em paletas escuras, usa a superfície para que
 * o destaque continue legível sobre ela.
 */
export function band(p: SitePalette): { bg: string; fg: string } {
  return isDark(p.bg) ? { bg: p.surface, fg: p.text } : { bg: p.text, fg: p.bg }
}

/** Ids únicos para gradientes/máscaras SVG — evita colisão entre miniaturas e prévia. */
export function useSvgId(prefix: string) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (name: string) => `${prefix}-${id}-${name}`
}

/** Raiz de todo site: fundo, texto e fonte da paleta. */
export function SiteRoot({
  p,
  font,
  children,
  style,
  name,
}: {
  p: SitePalette
  font: string
  children: ReactNode
  style?: CSSProperties
  name: string
}) {
  return (
    <div
      className="ia-site"
      data-site={name}
      style={{
        background: p.bg,
        color: p.text,
        fontFamily: font,
        fontSize: 16,
        lineHeight: 1.55,
        width: '100%',
        minHeight: '100%',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Contêiner centralizado com respiro lateral. */
export function Wrap({ m, max = 1200, children, style }: { m: boolean; max?: number; children: ReactNode; style?: CSSProperties }) {
  return <div style={{ maxWidth: max, margin: '0 auto', padding: m ? '0 20px' : '0 48px', width: '100%', ...style }}>{children}</div>
}

export function Burger({ color, size = 22, weight = 2 }: { color: string; size?: number; weight?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flex: 'none' }}>
      <path d="M3 7h18M3 12h18M3 17h18" stroke={color} strokeWidth={weight} strokeLinecap="round" fill="none" />
    </svg>
  )
}

const ICONS: Record<string, string> = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowUp: 'M7 17 17 7M8 7h9v9',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  search: 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-3.6-3.6',
  bag: 'M6 8h12l-1 12H7L6 8zM9 8a3 3 0 0 1 6 0',
  user: 'M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  users: 'M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6 6 0 0 1 3.5 6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  leaf: 'M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l8-8',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  sun: 'M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  snow: 'M12 2v20M4 7l16 10M4 17 20 7M9 3.5l3 2 3-2M9 20.5l3-2 3 2',
  wifi: 'M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01',
  pin: 'M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  clock: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM12 7v5l3 2',
  chevron: 'M6 9l6 6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  globe: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',
  chat: 'M4 5h16v11H9l-5 4z',
  pulse: 'M3 12h4l2-5 4 10 2-5h6',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  wave: 'M2 12c2.5-4 5-4 7.5 0s5 4 7.5 0 3.5-3 5-1',
  truck: 'M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3zM17 19.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  chart: 'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3',
  thermo: 'M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z',
  waves: 'M2 9c2 0 2-1.5 4-1.5S8 9 10 9s2-1.5 4-1.5S16 9 18 9s2-1.5 4-1.5M2 15c2 0 2-1.5 4-1.5S8 15 10 15s2-1.5 4-1.5S16 15 18 15s2-1.5 4-1.5',
  cup: 'M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3v2M11 3v2',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6',
  gamepad: 'M6 9h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 0 1 2 14v-1a4 4 0 0 1 4-4zM7 11v3M5.5 12.5h3M16 12h.01M18 13.5h.01',
  cpu: 'M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6z',
  play: 'M8 5l11 7-11 7z',
  bed: 'M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 12a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3z',
  phone: 'M7 3h10v18H7zM11 18h2',
  battery: 'M3 8h15v8H3zM21 11v2M6 11h7',
  route: 'M6 19a2 2 0 1 0 0-4a2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4a2 2 0 0 0 0 4zM8 17h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7',
  filter: 'M4 5h16l-6 8v5l-4 2v-7z',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M16 4v4M10 10v4M18 16v4',
}

export type IconName = keyof typeof ICONS

/** Ícone de linha simples (24×24). */
export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  stroke = 1.8,
  fill,
  style,
}: {
  name: IconName
  size?: number
  color?: string
  stroke?: number
  fill?: string
  style?: CSSProperties
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flex: 'none', ...style }}>
      <path d={ICONS[name]} fill={fill ?? 'none'} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Círculos de texto ilustrativos (avatar abstrato). */
export function Avatar({ size = 40, bg, fg, label, ring }: { size?: number; bg: string; fg: string; label: string; ring?: string }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color: fg,
        display: 'inline-grid',
        placeItems: 'center',
        fontSize: size * 0.36,
        fontWeight: 650,
        flex: 'none',
        boxShadow: ring ? `0 0 0 3px ${ring}` : undefined,
        letterSpacing: 0,
      }}
    >
      {label}
    </span>
  )
}
