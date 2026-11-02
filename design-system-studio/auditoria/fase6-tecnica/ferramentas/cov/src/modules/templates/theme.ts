import { ensureContrast, isDark, isHex, mix, normalizeHex, readableOn } from '@/core/color'
import type { TemplateChoice } from '@/core/project'
import { FONT_OPTIONS, fontName, fontStack, RADIUS_VALUES } from '@/core/tokens'
import type { RadiusScale } from '@/core/types'
import type { TemplateModel } from './types'

export type TemplateOverrides = TemplateChoice['overrides']

/** Tema final de um template (padrões + personalizações), pronto para estilos inline. */
export interface TplTheme {
  primary: string
  onPrimary: string
  primarySoft: string
  bg: string
  surface: string
  text: string
  muted: string
  border: string
  dark: boolean
  headingId: string
  bodyId: string
  heading: string
  body: string
  mono: string
  radius: RadiusScale
  /** Raio de selos e chips. */
  rSm: number
  /** Raio de botões e campos. */
  rMd: number
  /** Raio de cartões, imagens e blocos. */
  rLg: number
}

export const RADIUS_ORDER: RadiusScale[] = ['none', 'small', 'medium', 'large', 'pill']

export const RADIUS_SHORT: Record<RadiusScale, string> = {
  none: 'Retos',
  small: 'Leves',
  medium: 'Médios',
  large: 'Grandes',
  pill: 'Pílula',
}

export const COLOR_FIELDS = [
  { key: 'primary', label: 'Cor principal', help: 'Botões, links e destaques.' },
  { key: 'bg', label: 'Fundo', help: 'Cor de fundo das páginas.' },
  { key: 'text', label: 'Texto', help: 'Títulos e textos corridos.' },
] as const

export type ColorKey = (typeof COLOR_FIELDS)[number]['key']

const norm = (hex: string) => normalizeHex(hex)

/** Resolve as cores, fontes e cantos finais de um template. */
export function resolveTemplateTheme(t: TemplateModel, overrides: TemplateOverrides = {}): TplTheme {
  const primary = norm(validHex(overrides.primary) ?? t.colors.primary)
  const bg = norm(validHex(overrides.bg) ?? t.colors.bg)
  const text = norm(validHex(overrides.text) ?? t.colors.text)
  const bgChanged = bg !== norm(t.colors.bg)
  const textChanged = text !== norm(t.colors.text)
  const dark = isDark(bg)

  // Superfície e texto secundário acompanham o fundo/texto quando a pessoa os altera.
  const surface = bgChanged ? mix(bg, dark ? '#ffffff' : text, dark ? 0.07 : 0.045) : norm(t.colors.surface)
  const muted =
    bgChanged || textChanged ? ensureContrast(mix(text, bg, 0.36), bg, 4.5) : ensureContrast(norm(t.colors.muted), bg, 4.5)

  const headingId = validFont(overrides.headingFont) ?? t.headingFont
  const bodyId = validFont(overrides.bodyFont) ?? t.bodyFont
  const radius = overrides.radius && overrides.radius in RADIUS_VALUES ? overrides.radius : t.radius
  const r = RADIUS_VALUES[radius]

  return {
    primary,
    onPrimary: readableOn(primary),
    primarySoft: mix(bg, primary, dark ? 0.2 : 0.1),
    bg,
    surface,
    text,
    muted,
    border: mix(bg, text, dark ? 0.16 : 0.11),
    dark,
    headingId,
    bodyId,
    heading: fontStack(headingId),
    body: fontStack(bodyId),
    mono: fontStack('jetbrains-mono'),
    radius,
    rSm: radius === 'pill' ? 999 : r.sm,
    rMd: r.md,
    rLg: r.lg,
  }
}

function validHex(value: string | undefined): string | undefined {
  return value && isHex(value) ? value : undefined
}

function validFont(id: string | undefined): string | undefined {
  return id && FONT_OPTIONS.some((f) => f.id === id) ? id : undefined
}

/** Valores padrão de cada campo editável, para comparar e manter as personalizações mínimas. */
export function defaultsOf(t: TemplateModel): Required<TemplateOverrides> {
  return {
    primary: norm(t.colors.primary),
    bg: norm(t.colors.bg),
    text: norm(t.colors.text),
    headingFont: t.headingFont,
    bodyFont: t.bodyFont,
    radius: t.radius,
  }
}

/**
 * Aplica uma alteração e devolve personalizações mínimas: valores iguais ao padrão do
 * template (ou inválidos) são removidos.
 */
export function patchOverrides<K extends keyof TemplateOverrides>(
  t: TemplateModel,
  current: TemplateOverrides,
  key: K,
  value: TemplateOverrides[K] | null,
): TemplateOverrides {
  return minimalOverrides(t, { ...current, [key]: value ?? undefined })
}

export function minimalOverrides(t: TemplateModel, overrides: TemplateOverrides): TemplateOverrides {
  const d = defaultsOf(t)
  const out: TemplateOverrides = {}
  for (const key of ['primary', 'bg', 'text'] as const) {
    const v = overrides[key]
    if (v && isHex(v) && norm(v) !== d[key]) out[key] = norm(v)
  }
  for (const key of ['headingFont', 'bodyFont'] as const) {
    const v = overrides[key]
    if (v && FONT_OPTIONS.some((f) => f.id === v) && v !== d[key]) out[key] = v
  }
  if (overrides.radius && overrides.radius in RADIUS_VALUES && overrides.radius !== d.radius) out.radius = overrides.radius
  return out
}

/** Lista legível das personalizações (para o Master Prompt e a interface). */
export function describeOverrides(t: TemplateModel, overrides: TemplateOverrides): string[] {
  const d = defaultsOf(t)
  const out: string[] = []
  const labels: Record<ColorKey, string> = { primary: 'Cor principal', bg: 'Fundo', text: 'Texto' }
  for (const key of ['primary', 'bg', 'text'] as const) {
    if (overrides[key]) out.push(`${labels[key]} alterada pelo usuário: ${overrides[key]} (padrão do template: ${d[key]}).`)
  }
  if (overrides.headingFont) out.push(`Fonte dos títulos alterada: ${fontName(overrides.headingFont)} (padrão: ${fontName(d.headingFont)}).`)
  if (overrides.bodyFont) out.push(`Fonte dos textos alterada: ${fontName(overrides.bodyFont)} (padrão: ${fontName(d.bodyFont)}).`)
  if (overrides.radius)
    out.push(`Cantos alterados: ${RADIUS_VALUES[overrides.radius].label} (padrão: ${RADIUS_VALUES[d.radius].label}).`)
  return out
}
