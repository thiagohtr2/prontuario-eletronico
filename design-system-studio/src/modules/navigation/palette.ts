import type { CSSProperties } from 'react'
import { contrast, ensureContrast, isDark, mix, readableOn, withAlpha } from '@/core/color'
import { SHADOW_VALUES } from '@/core/tokens'
import type { ResolvedTheme } from '@/core/types'
import type { HeaderLook, SidebarLook } from './types'

/**
 * Cores de uma superfície de navegação, sempre derivadas dos tokens da identidade global.
 * O renderizador expõe estes valores como variáveis CSS (`--nv-*`) para que estados de
 * hover/foco/ativo sejam escritos no CSS do módulo.
 */
export interface NavColors {
  /** Fundo (pode ser um gradiente). */
  bg: string
  /** Cor sólida representativa do fundo (para cálculos de contraste e painéis). */
  base: string
  text: string
  muted: string
  border: string
  hover: string
  activeBg: string
  activeText: string
  /** Cor de destaque (sublinhados, pontos, CTA). */
  accent: string
  onAccent: string
  /** Fundo de campos (busca) sobre esta superfície. */
  field: string
  /** Traço/realce secundário (badges). */
  badge: string
  onBadge: string
  dark: boolean
}

/** Cor da imagem do hero de exemplo (para headers transparentes). */
export function heroColors(theme: ResolvedTheme) {
  const t = theme.tokens
  const from = mix(t.gradientFrom, '#000000', 0.38)
  const to = mix(t.gradientTo, '#000000', 0.12)
  return { from, to, text: readableOn(mix(from, to, 0.5)) }
}

function inverseBase(theme: ResolvedTheme) {
  const t = theme.tokens
  return t.mode === 'light' ? mix(t.text, '#000000', 0.25) : mix(t.bg, '#000000', 0.45)
}

function onColor(base: string, theme: ResolvedTheme, gradient?: string): NavColors {
  const t = theme.tokens
  const text = readableOn(base, '#ffffff', t.mode === 'dark' ? t.bg : t.text)
  const accentOk = contrast(t.primary, base) >= 3
  const accent = accentOk && !isDark(t.primary) !== !isDark(base) ? t.primary : contrast(t.accent, base) >= 3 ? t.accent : text
  const accentIsText = accent === text
  return {
    bg: gradient ?? base,
    base,
    text,
    muted: withAlpha(text, 0.74),
    border: withAlpha(text, 0.16),
    hover: withAlpha(text, 0.1),
    activeBg: withAlpha(text, 0.16),
    activeText: text,
    accent,
    onAccent: accentIsText ? base : readableOn(accent),
    field: withAlpha(text, 0.1),
    badge: contrast(t.accent, base) >= 3 ? t.accent : text,
    onBadge: contrast(t.accent, base) >= 3 ? readableOn(t.accent) : base,
    dark: isDark(base),
  }
}

function onSurface(base: string, theme: ResolvedTheme, bg?: string): NavColors {
  const t = theme.tokens
  const dark = isDark(base)
  const text = ensureContrast(t.text, base, 7)
  return {
    bg: bg ?? base,
    base,
    text,
    muted: ensureContrast(mix(text, base, 0.36), base, 4.5),
    border: t.border,
    hover: dark ? withAlpha('#ffffff', 0.07) : t.hover,
    activeBg: t.navActive,
    activeText: t.navActiveText,
    accent: t.primary,
    onAccent: t.onPrimary,
    field: dark ? withAlpha('#ffffff', 0.07) : t.surfaceAlt,
    badge: t.accent,
    onBadge: t.onAccent,
    dark,
  }
}

export function headerColors(theme: ResolvedTheme, surface: HeaderLook['surface']): NavColors {
  const t = theme.tokens
  switch (surface) {
    case 'transparent': {
      const hero = heroColors(theme)
      const c = onColor(mix(hero.from, hero.to, 0.5), theme)
      return { ...c, bg: 'transparent', accent: c.text, onAccent: mix(hero.from, '#000000', 0.2) }
    }
    case 'glass':
      return { ...onSurface(t.surface, theme, withAlpha(t.surface, t.mode === 'dark' ? 0.55 : 0.62)), border: withAlpha('#ffffff', 0.45) }
    case 'brand': {
      const c = onColor(t.primary, theme)
      return { ...c, accent: c.text, onAccent: t.primary }
    }
    case 'inverse':
      return onColor(inverseBase(theme), theme)
    case 'gradient':
      return onColor(mix(t.gradientFrom, t.gradientTo, 0.5), theme, `linear-gradient(120deg, ${t.gradientFrom}, ${t.gradientTo})`)
    case 'tinted':
      return { ...onSurface(t.primarySoft, theme), activeBg: t.surface, activeText: t.selectedText, field: t.surface }
    case 'blend':
      return { ...onSurface(t.bg, theme), activeBg: t.selected, activeText: t.selectedText }
    default:
      return onSurface(t.navBg, theme)
  }
}

export function sidebarColors(theme: ResolvedTheme, surface: SidebarLook['surface']): NavColors {
  const t = theme.tokens
  switch (surface) {
    case 'plain':
      return { ...onSurface(t.bg, theme), activeBg: t.selected, activeText: t.selectedText }
    case 'alt':
      return { ...onSurface(t.bgAlt, theme), activeBg: t.surface, activeText: t.text, field: t.surface }
    case 'inverse':
      return onColor(inverseBase(theme), theme)
    case 'brand': {
      const c = onColor(t.primary, theme)
      return { ...c, accent: c.text, onAccent: t.primary }
    }
    case 'glass':
      return { ...onSurface(t.surface, theme, withAlpha(t.surface, t.mode === 'dark' ? 0.5 : 0.6)), border: withAlpha('#ffffff', 0.5) }
    case 'gradient':
      return onColor(mix(t.gradientFrom, t.gradientTo, 0.5), theme, `linear-gradient(180deg, ${t.gradientFrom}, ${t.gradientTo})`)
    case 'tinted':
      return { ...onSurface(t.primarySoft, theme), activeBg: t.surface, activeText: t.selectedText, field: t.surface }
    default:
      return onSurface(t.navBg, theme)
  }
}

/** Sombra para elementos flutuantes: usa a do tema ou, se o tema não tiver, uma média. */
export function floatShadow(theme: ResolvedTheme): string {
  return theme.metrics.shadow === 'none' ? SHADOW_VALUES.medium.css : theme.metrics.shadow
}

/** Variáveis CSS comuns a qualquer prévia de navegação. */
export function navVars(theme: ResolvedTheme, c: NavColors): CSSProperties {
  const t = theme.tokens
  const m = theme.metrics
  return {
    ['--nv-bg' as string]: c.bg,
    ['--nv-base' as string]: c.base,
    ['--nv-text' as string]: c.text,
    ['--nv-muted' as string]: c.muted,
    ['--nv-border' as string]: c.border,
    ['--nv-hover' as string]: c.hover,
    ['--nv-active-bg' as string]: c.activeBg,
    ['--nv-active-text' as string]: c.activeText,
    ['--nv-accent' as string]: c.accent,
    ['--nv-on-accent' as string]: c.onAccent,
    ['--nv-field' as string]: c.field,
    ['--nv-badge' as string]: c.badge,
    ['--nv-on-badge' as string]: c.onBadge,
    ['--nv-focus' as string]: c.dark ? '#ffffff' : t.focusRing,
    ['--nv-r-sm' as string]: `${m.radiusSm}px`,
    ['--nv-r-md' as string]: `${m.radiusMd}px`,
    ['--nv-r-lg' as string]: `${m.radiusLg}px`,
    ['--nv-r-float' as string]: theme.geometry.radius === 'pill' ? '999px' : `${m.radiusLg}px`,
    ['--nv-page' as string]: t.bgAlt,
    ['--nv-head' as string]: m.headingFont,
    ['--nv-body' as string]: m.bodyFont,
    ['--nv-head-w' as string]: String(theme.typography.headingWeight),
    ['--nv-shadow' as string]: floatShadow(theme),
    // Painéis (menus, popovers) usam sempre a superfície do tema.
    ['--nv-panel' as string]: t.surface,
    ['--nv-panel-text' as string]: t.text,
    ['--nv-panel-muted' as string]: t.textMuted,
    ['--nv-panel-border' as string]: t.border,
    ['--nv-panel-hover' as string]: t.hover,
    ['--nv-panel-sel' as string]: t.selected,
    ['--nv-panel-sel-text' as string]: t.selectedText,
    ['--nv-primary' as string]: t.primary,
    ['--nv-on-primary' as string]: t.onPrimary,
    ['--nv-primary-soft' as string]: t.primarySoft,
    ['--nv-success' as string]: t.success,
    ['--nv-warning' as string]: t.warning,
    ['--nv-error' as string]: t.error,
    ['--nv-info' as string]: t.info,
  } as CSSProperties
}
