import type { CSSProperties } from 'react'
import { contrast, darken, ensureContrast, isDark, lighten, mix, readableOn, withAlpha } from './color'
import type { Geometry, ResolvedTheme, ThemeTokens, TokenKey, Typography } from './types'

/** Cores de base que definem uma paleta. Os demais tokens são derivados destas. */
export interface PaletteBase {
  primary: string
  secondary: string
  accent: string
  bg: string
  surface: string
  text: string
  /** Fundo da navegação (sidebar/header). Padrão: superfície. */
  nav?: string
  gradient?: [string, string]
  success?: string
  warning?: string
  error?: string
  info?: string
}

/** Rótulos legíveis de cada token, na ordem em que aparecem no editor e nas exportações. */
export const TOKEN_GROUPS: { title: string; keys: { key: TokenKey; label: string }[] }[] = [
  {
    title: 'Marca',
    keys: [
      { key: 'primary', label: 'Cor primária' },
      { key: 'primaryHover', label: 'Primária — hover' },
      { key: 'primaryActive', label: 'Primária — active' },
      { key: 'onPrimary', label: 'Texto sobre primária' },
      { key: 'primarySoft', label: 'Primária suave' },
      { key: 'secondary', label: 'Cor secundária' },
      { key: 'onSecondary', label: 'Texto sobre secundária' },
      { key: 'accent', label: 'Cor de destaque' },
      { key: 'onAccent', label: 'Texto sobre destaque' },
    ],
  },
  {
    title: 'Fundos e superfícies',
    keys: [
      { key: 'bg', label: 'Fundo principal' },
      { key: 'bgAlt', label: 'Fundo secundário' },
      { key: 'surface', label: 'Superfície' },
      { key: 'surfaceAlt', label: 'Superfície alternativa' },
    ],
  },
  {
    title: 'Texto',
    keys: [
      { key: 'text', label: 'Texto principal' },
      { key: 'textMuted', label: 'Texto secundário' },
      { key: 'textDisabled', label: 'Texto desabilitado' },
      { key: 'placeholder', label: 'Placeholder' },
    ],
  },
  {
    title: 'Bordas e foco',
    keys: [
      { key: 'border', label: 'Borda' },
      { key: 'borderStrong', label: 'Borda forte' },
      { key: 'focusRing', label: 'Borda de foco (focus-visible)' },
    ],
  },
  {
    title: 'Estados',
    keys: [
      { key: 'hover', label: 'Hover' },
      { key: 'active', label: 'Active' },
      { key: 'pressed', label: 'Pressed' },
      { key: 'selected', label: 'Selected — fundo' },
      { key: 'selectedText', label: 'Selected — texto' },
      { key: 'disabled', label: 'Disabled — fundo' },
      { key: 'disabledText', label: 'Disabled — texto' },
    ],
  },
  {
    title: 'Semânticos',
    keys: [
      { key: 'success', label: 'Success' },
      { key: 'successBg', label: 'Success — fundo' },
      { key: 'warning', label: 'Warning' },
      { key: 'warningBg', label: 'Warning — fundo' },
      { key: 'error', label: 'Error' },
      { key: 'errorBg', label: 'Error — fundo' },
      { key: 'info', label: 'Info' },
      { key: 'infoBg', label: 'Info — fundo' },
    ],
  },
  {
    title: 'Links, ícones e navegação',
    keys: [
      { key: 'link', label: 'Link' },
      { key: 'linkHover', label: 'Link — hover' },
      { key: 'icon', label: 'Ícones' },
      { key: 'navBg', label: 'Navegação — fundo' },
      { key: 'navText', label: 'Navegação — texto' },
      { key: 'navActive', label: 'Navegação — item ativo' },
      { key: 'navActiveText', label: 'Navegação — texto ativo' },
    ],
  },
  {
    title: 'Gradiente',
    keys: [
      { key: 'gradientFrom', label: 'Gradiente — início' },
      { key: 'gradientTo', label: 'Gradiente — fim' },
    ],
  },
]

export const TOKEN_KEYS: TokenKey[] = TOKEN_GROUPS.flatMap((g) => g.keys.map((k) => k.key))

export const TOKEN_LABEL: Record<TokenKey, string> = Object.fromEntries(
  TOKEN_GROUPS.flatMap((g) => g.keys.map((k) => [k.key, k.label])),
) as Record<TokenKey, string>

/** Deriva o conjunto completo de tokens semânticos a partir das cores de base. */
export function deriveTokens(base: PaletteBase): ThemeTokens {
  const dark = isDark(base.bg)
  const toward = dark ? '#ffffff' : '#000000'
  const away = dark ? '#000000' : '#ffffff'

  const primary = base.primary
  const onPrimary = readableOn(primary)
  const textMuted = ensureContrast(mix(base.text, base.bg, 0.38), base.bg, 4.5)
  const navBg = base.nav ?? base.surface
  const navText = ensureContrast(mix(readableOn(navBg, '#ffffff', base.text), navBg, 0.22), navBg, 4.5)
  const link = ensureContrast(primary, base.surface, 4.5)

  const semantic = (color: string) => ({
    fg: ensureContrast(color, base.surface, 4.5),
    bg: dark ? mix(base.surface, color, 0.2) : mix('#ffffff', color, 0.12),
  })
  const success = semantic(base.success ?? '#16a34a')
  const warning = semantic(base.warning ?? '#d97706')
  const error = semantic(base.error ?? '#dc2626')
  const info = semantic(base.info ?? '#2563eb')

  const navActive = isDark(navBg) ? mix(navBg, '#ffffff', 0.14) : mix(navBg, primary, 0.12)
  const selected = dark ? mix(base.surface, primary, 0.28) : mix('#ffffff', primary, 0.12)

  return {
    mode: dark ? 'dark' : 'light',
    primary,
    primaryHover: dark ? lighten(primary, 0.1) : darken(primary, 0.1),
    primaryActive: dark ? lighten(primary, 0.18) : darken(primary, 0.2),
    onPrimary,
    primarySoft: dark ? mix(base.surface, primary, 0.24) : mix('#ffffff', primary, 0.12),
    secondary: base.secondary,
    onSecondary: readableOn(base.secondary),
    accent: base.accent,
    onAccent: readableOn(base.accent),
    bg: base.bg,
    bgAlt: mix(base.bg, toward, dark ? 0.06 : 0.035),
    surface: base.surface,
    surfaceAlt: mix(base.surface, toward, dark ? 0.07 : 0.04),
    text: base.text,
    textMuted,
    textDisabled: mix(base.text, base.bg, 0.62),
    placeholder: ensureContrast(mix(base.text, base.bg, 0.5), base.surface, 3),
    border: mix(base.surface, toward, dark ? 0.16 : 0.1),
    borderStrong: mix(base.surface, toward, dark ? 0.3 : 0.22),
    focusRing: contrast(primary, base.bg) >= 3 ? primary : ensureContrast(primary, base.bg, 3),
    hover: mix(base.surface, toward, dark ? 0.08 : 0.045),
    active: mix(base.surface, toward, dark ? 0.14 : 0.08),
    pressed: mix(base.surface, toward, dark ? 0.2 : 0.12),
    selected,
    selectedText: ensureContrast(primary, selected, 4.5),
    disabled: mix(base.surface, toward, dark ? 0.1 : 0.06),
    disabledText: mix(base.text, base.surface, 0.55),
    success: success.fg,
    successBg: success.bg,
    warning: warning.fg,
    warningBg: warning.bg,
    error: error.fg,
    errorBg: error.bg,
    info: info.fg,
    infoBg: info.bg,
    link,
    linkHover: dark ? lighten(link, 0.15) : darken(link, 0.15),
    icon: mix(base.text, base.bg, 0.25),
    navBg,
    navText,
    navActive,
    navActiveText: isDark(navBg) ? '#ffffff' : ensureContrast(primary, navActive, 4.5),
    gradientFrom: base.gradient?.[0] ?? primary,
    gradientTo: base.gradient?.[1] ?? mix(base.accent, away, 0.1),
    gradientEnabled: Boolean(base.gradient),
  }
}

export function applyOverrides(tokens: ThemeTokens, overrides: Partial<Record<TokenKey, string>>): ThemeTokens {
  const next = { ...tokens }
  for (const [k, v] of Object.entries(overrides)) {
    if (v) (next as Record<string, unknown>)[k] = v
  }
  return next
}

/* -------------------------------------------------------------------------- */
/* Tipografia e geometria                                                      */
/* -------------------------------------------------------------------------- */

export interface FontOption {
  id: string
  name: string
  /** Pilha CSS usada nas prévias (fontes empacotadas com o Studio + fallbacks do sistema). */
  stack: string
  kind: 'sans' | 'serif' | 'mono' | 'display'
  description: string
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'inter', name: 'Inter', stack: "'Inter Variable', Inter, system-ui, sans-serif", kind: 'sans', description: 'Sem serifa neutra, ótima para interfaces e dashboards.' },
  { id: 'system', name: 'Fonte do sistema', stack: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", kind: 'sans', description: 'Usa a fonte nativa de cada aparelho. Carrega instantaneamente.' },
  { id: 'space-grotesk', name: 'Space Grotesk', stack: "'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif", kind: 'display', description: 'Geométrica com personalidade tecnológica.' },
  { id: 'fraunces', name: 'Fraunces', stack: "'Fraunces Variable', Fraunces, Georgia, serif", kind: 'serif', description: 'Serifada expressiva, ideal para títulos editoriais.' },
  { id: 'georgia', name: 'Georgia', stack: "Georgia, 'Times New Roman', serif", kind: 'serif', description: 'Serifada clássica, leitura confortável em textos longos.' },
  { id: 'jetbrains-mono', name: 'JetBrains Mono', stack: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace", kind: 'mono', description: 'Monoespaçada, para dados, código e estética técnica.' },
]

export function fontStack(id: string): string {
  return (FONT_OPTIONS.find((f) => f.id === id) ?? FONT_OPTIONS[0]).stack
}

export function fontName(id: string): string {
  return (FONT_OPTIONS.find((f) => f.id === id) ?? FONT_OPTIONS[0]).name
}

export const RADIUS_VALUES: Record<Geometry['radius'], { sm: number; md: number; lg: number; label: string }> = {
  none: { sm: 0, md: 0, lg: 0, label: 'Quadrados (0 px)' },
  small: { sm: 3, md: 4, lg: 6, label: 'Discretos (4 px)' },
  medium: { sm: 6, md: 8, lg: 12, label: 'Médios (8 px)' },
  large: { sm: 10, md: 14, lg: 20, label: 'Grandes (14 px)' },
  pill: { sm: 999, md: 999, lg: 24, label: 'Pílula (totalmente arredondados)' },
}

export const SHADOW_VALUES: Record<Geometry['shadow'], { css: string; label: string }> = {
  none: { css: 'none', label: 'Sem sombra' },
  subtle: { css: '0 1px 2px rgba(16,16,24,.06), 0 1px 3px rgba(16,16,24,.05)', label: 'Sutil' },
  medium: { css: '0 4px 12px rgba(16,16,24,.08), 0 2px 4px rgba(16,16,24,.05)', label: 'Média' },
  strong: { css: '0 12px 32px rgba(16,16,24,.14), 0 4px 8px rgba(16,16,24,.06)', label: 'Forte' },
}

export const DENSITY_SPACING: Record<Geometry['density'], { unit: number; label: string }> = {
  compact: { unit: 6, label: 'Compacta' },
  comfortable: { unit: 8, label: 'Confortável' },
  spacious: { unit: 10, label: 'Espaçosa' },
}

export const SURFACE_LABEL: Record<Geometry['surface'], string> = {
  flat: 'Plana (sem bordas nem sombras)',
  outlined: 'Contornada (bordas finas)',
  elevated: 'Elevada (sombras)',
  glass: 'Vidro fosco (translúcida)',
}

export const DEFAULT_TYPOGRAPHY: Typography = {
  heading: 'inter',
  body: 'inter',
  baseSize: 15,
  headingWeight: 650,
  bodyWeight: 400,
}

/**
 * Padrões propositalmente neutros: superfícies planas com bordas finas, cantos médios e
 * nenhuma sombra. Efeitos são escolhas explícitas do usuário, nunca impostos.
 */
export const DEFAULT_GEOMETRY: Geometry = {
  radius: 'medium',
  borderWidth: 1,
  shadow: 'none',
  surface: 'outlined',
  density: 'comfortable',
  iconStyle: 'outline',
}

export function resolveTheme(tokens: ThemeTokens, typography: Typography, geometry: Geometry): ResolvedTheme {
  const r = RADIUS_VALUES[geometry.radius]
  return {
    tokens,
    typography,
    geometry,
    metrics: {
      radiusSm: r.sm,
      radiusMd: r.md,
      radiusLg: r.lg,
      borderWidth: geometry.borderWidth,
      shadow: SHADOW_VALUES[geometry.shadow].css,
      spacing: DENSITY_SPACING[geometry.density].unit,
      headingFont: fontStack(typography.heading),
      bodyFont: fontStack(typography.body),
    },
  }
}

/** Fundo de superfície conforme o estilo escolhido (usado pelas prévias). */
export function surfaceStyle(theme: ResolvedTheme): CSSProperties {
  const { tokens: t, geometry: g, metrics: m } = theme
  switch (g.surface) {
    case 'flat':
      return { background: t.surface, border: 'none', boxShadow: 'none' }
    case 'elevated':
      return { background: t.surface, border: 'none', boxShadow: m.shadow === 'none' ? SHADOW_VALUES.subtle.css : m.shadow }
    case 'glass':
      return {
        background: withAlpha(t.surface, t.mode === 'dark' ? 0.55 : 0.68),
        border: `${Math.max(1, m.borderWidth)}px solid ${withAlpha(t.mode === 'dark' ? '#ffffff' : '#ffffff', 0.35)}`,
        backdropFilter: 'blur(14px)',
        boxShadow: m.shadow,
      }
    default:
      return { background: t.surface, border: `${Math.max(1, m.borderWidth)}px solid ${t.border}`, boxShadow: m.shadow }
  }
}
