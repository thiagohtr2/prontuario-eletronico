/** Utilitários de cor sem dependências. Todas as funções aceitam e devolvem hexadecimal. */

export interface RGB {
  r: number
  g: number
  b: number
}

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

export function isHex(value: string): boolean {
  return HEX_RE.test(value.trim())
}

export function normalizeHex(value: string): string {
  const v = value.trim().replace('#', '').toLowerCase()
  if (v.length === 3) return `#${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`
  return `#${v}`
}

export function hexToRgb(hex: string): RGB {
  const v = normalizeHex(hex).slice(1)
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  }
}

const clamp = (n: number, min = 0, max = 255) => Math.min(max, Math.max(min, n))

export function rgbToHex({ r, g, b }: RGB): string {
  return `#${[r, g, b].map((n) => Math.round(clamp(n)).toString(16).padStart(2, '0')).join('')}`
}

/** Mistura `a` com `b`. `amount` = 0 devolve `a`, 1 devolve `b`. */
export function mix(a: string, b: string, amount: number): string {
  const A = hexToRgb(a)
  const B = hexToRgb(b)
  return rgbToHex({
    r: A.r + (B.r - A.r) * amount,
    g: A.g + (B.g - A.g) * amount,
    b: A.b + (B.b - A.b) * amount,
  })
}

export const lighten = (hex: string, amount: number) => mix(hex, '#ffffff', amount)
export const darken = (hex: string, amount: number) => mix(hex, '#000000', amount)

export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function channel(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** Razão de contraste WCAG entre duas cores (1–21). */
export function contrast(a: string, b: string): number {
  const L1 = luminance(a)
  const L2 = luminance(b)
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1]
  return (hi + 0.05) / (lo + 0.05)
}

export const isDark = (hex: string) => luminance(hex) < 0.4

/** Escolhe entre claro e escuro a cor de texto mais legível sobre `bg`. */
export function readableOn(bg: string, light = '#ffffff', dark = '#111114'): string {
  return contrast(bg, light) >= contrast(bg, dark) ? light : dark
}

/**
 * Escurece (fundo claro) ou clareia (fundo escuro) `fg` até atingir o contraste mínimo
 * sobre `bg`. Usado para garantir que texto secundário e links continuem legíveis.
 */
export function ensureContrast(fg: string, bg: string, min = 4.5): string {
  let color = fg
  const towards = isDark(bg) ? '#ffffff' : '#000000'
  for (let i = 0; i < 20 && contrast(color, bg) < min; i++) {
    color = mix(color, towards, 0.12)
  }
  return color
}
