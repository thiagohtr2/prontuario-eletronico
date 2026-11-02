import { ensureContrast, isDark, isHex, mix, normalizeHex, readableOn } from '@/core/color'
import type { InspirationChoice } from '@/core/project'
import type { InspirationSite, PaletteId, SitePalette } from './types'

/** Ordem fixa das oito propostas de paleta de cada conceito. */
export const PALETTE_IDS: PaletteId[] = ['original', 'minimalista', 'escura', 'editorial', 'tecnologica', 'natural', 'criativa', 'arenito']

export const PALETTE_NAMES: Record<PaletteId, string> = {
  original: 'Original',
  minimalista: 'Minimalista neutra',
  escura: 'Escura premium',
  editorial: 'Editorial quente',
  tecnologica: 'Tecnológica azul',
  natural: 'Natural verde',
  criativa: 'Criativa',
  arenito: 'Arenito',
}

export const PALETTE_HINTS: Record<PaletteId, string> = {
  original: 'A identidade pensada para este conceito.',
  minimalista: 'Neutros, muito respiro e uma cor de ação discreta.',
  escura: 'Fundo escuro, contraste alto e um destaque nobre.',
  editorial: 'Creme, tinta escura e terracota, como uma revista.',
  tecnologica: 'Azuis precisos, cara de produto digital.',
  natural: 'Verdes e tons de terra, calmos e orgânicos.',
  criativa: 'Cores ousadas e combinações inesperadas.',
  arenito: 'Areia, argila e marrons quentes.',
}

export type OverrideKey = keyof InspirationChoice['overrides']

/**
 * Monta as oito paletas de um conceito a partir de linhas compactas
 * "fundo superfície texto texto-secundário destaque apoio" (hex sem #), na ordem de `PALETTE_IDS`.
 * Garante contraste mínimo do texto e calcula a cor de texto sobre o destaque.
 */
export function buildPalettes(rows: string[]): SitePalette[] {
  if (rows.length !== PALETTE_IDS.length) throw new Error(`Esperadas ${PALETTE_IDS.length} paletas, recebidas ${rows.length}.`)
  return PALETTE_IDS.map((id, i) => {
    const parts = rows[i].trim().split(/\s+/).map((h) => normalizeHex(h))
    if (parts.length !== 6 || parts.some((h) => !isHex(h))) throw new Error(`Paleta inválida: ${rows[i]}`)
    const [bg, surface, text, muted, accent, secondary] = parts
    const safeText = ensureContrast(text, bg, 7)
    return {
      id,
      name: PALETTE_NAMES[id],
      bg,
      surface,
      text: safeText,
      muted: ensureContrast(ensureContrast(muted, bg, 4.6), surface, 4.5),
      accent,
      onAccent: readableOn(accent, '#ffffff', '#111114'),
      secondary,
    }
  })
}

/** Normaliza um valor de override; devolve `undefined` se não for um hex válido. */
export function cleanHex(value: string | undefined): string | undefined {
  if (!value || !isHex(value)) return undefined
  return normalizeHex(value)
}

/**
 * Aplica os ajustes individuais (fundo, texto, destaque) sobre uma paleta e recalcula
 * as cores dependentes (superfície, texto secundário, texto sobre o destaque).
 */
export function applyOverrides(palette: SitePalette, overrides: InspirationChoice['overrides'] = {}): SitePalette {
  const bg = cleanHex(overrides.bg) ?? palette.bg
  const text = cleanHex(overrides.text) ?? palette.text
  const accent = cleanHex(overrides.accent) ?? palette.accent
  const bgChanged = bg !== palette.bg
  const textChanged = text !== palette.text
  const accentChanged = accent !== palette.accent
  if (!bgChanged && !textChanged && !accentChanged) return palette
  const surface = bgChanged ? (isDark(bg) ? mix(bg, '#ffffff', 0.07) : mix(bg, '#ffffff', 0.6)) : palette.surface
  const muted = bgChanged || textChanged ? ensureContrast(mix(text, bg, 0.36), bg, 4.5) : palette.muted
  const secondary = bgChanged && isDark(bg) !== isDark(palette.bg) ? mix(palette.secondary, bg, 0.35) : palette.secondary
  return {
    ...palette,
    bg,
    surface,
    text,
    muted,
    accent,
    onAccent: accentChanged ? readableOn(accent, '#ffffff', '#111114') : palette.onAccent,
    secondary,
  }
}

/** Paleta escolhida de um conceito (ou a original, se o id não existir). */
export function paletteOf(site: InspirationSite, paletteId: string | null | undefined): SitePalette {
  return site.palettes.find((p) => p.id === paletteId) ?? site.palettes[0]
}

/** Paleta final de uma escolha: proposta escolhida + ajustes. */
export function resolvePalette(site: InspirationSite, paletteId: string | null | undefined, overrides: InspirationChoice['overrides'] = {}): SitePalette {
  return applyOverrides(paletteOf(site, paletteId), overrides)
}

/** Remove chaves vazias/ inválidas dos overrides. */
export function cleanOverrides(overrides: InspirationChoice['overrides']): InspirationChoice['overrides'] {
  const out: InspirationChoice['overrides'] = {}
  for (const key of ['bg', 'text', 'accent'] as OverrideKey[]) {
    const v = cleanHex(overrides[key])
    if (v) out[key] = v
  }
  return out
}

export function sameOverrides(a: InspirationChoice['overrides'], b: InspirationChoice['overrides']): boolean {
  const x = cleanOverrides(a)
  const y = cleanOverrides(b)
  return x.bg === y.bg && x.text === y.text && x.accent === y.accent
}
