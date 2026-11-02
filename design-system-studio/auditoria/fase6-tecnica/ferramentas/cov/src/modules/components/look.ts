import type { CSSProperties } from 'react'
import { contrast, darken, ensureContrast, hexToRgb, isDark, isHex, lighten, luminance, mix, normalizeHex, readableOn, withAlpha } from '@/core/color'
import { fontStack } from '@/core/tokens'
import type { ResolvedTheme } from '@/core/types'
import type { FamilyStyle, VisualFamily } from './types'

/**
 * "Look" = a paleta global aprovada transformada pela família visual. Função pura (sem JSX):
 * usada pelos renderizadores e pela descrição do Master Prompt. Nenhuma cor fixa de marca:
 * tudo deriva dos tokens (as poucas misturas com branco/preto/areia são efeitos da família).
 */
export interface Look {
  familyId: string
  style: FamilyStyle
  dark: boolean
  /** Fundo do palco (CSS background, pode ter gradientes). */
  stage: string
  /** Fundo sólido de referência. */
  bg: string
  /** Superfície (pode ser rgba no vidro). */
  surface: string
  /** Superfície sólida equivalente (para cálculos de contraste). */
  surfaceSolid: string
  surfaceAlt: string
  raised: string
  text: string
  muted: string
  faint: string
  border: string
  borderStrong: string
  divider: string
  primary: string
  accent: string
  secondary: string
  metal: string
  /** Cor de origem dos tingimentos (primária ou destaque). */
  brand: string
  soft: string
  onSoft: string
  success: string
  successBg: string
  warning: string
  warningBg: string
  error: string
  errorBg: string
  info: string
  infoBg: string
  focusColor: string
  /** Paleta alternada (gráficos, avatares, ladrilhos). */
  cycle: { bg: string; fg: string }[]
  font: string
  headingFont: string
  labelFont: string
  mono: string
  fs: number
  hw: number
  uw: number
  upper: boolean
  track: string
  headTrack: string
  r: number
  rLg: number
  rSm: number
  h: number
  pad: number
  gap: number
  bw: number
  iconStroke: number
  blur?: string
  shadow: string
  shadowFloat: string
  fill: string
  onFill: string
  fillHover: string
  fillActive: string
  btnShadow: string
  btnBorder: string
  headingFill?: CSSProperties
  card: CSSProperties
  float: CSSProperties
  field: CSSProperties
  fieldHover: CSSProperties
  fieldFocus: CSSProperties
  btn2: CSSProperties
  btn2Hover: CSSProperties
  ghostColor: string
  focusFx: CSSProperties
  hoverFx: CSSProperties
  activeFx: CSSProperties
  disabled: CSSProperties
  trackOff: string
  trackOn: string
  thumb: string
  rowHover: string
  zebra: string
  headBar: CSSProperties
  cardAccent?: string
  /** Sombra de elementos afundados (neumórfico). */
  inset: string
}

const hx = (v: string | undefined, fb: string) => (v && isHex(v) ? normalizeHex(v) : fb)

/** Saturação HSL (0–1). */
function saturation(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const max = Math.max(r, g, b) / 255
  const min = Math.min(r, g, b) / 255
  if (max === min) return 0
  const l = (max + min) / 2
  const d = max - min
  return l > 0.5 ? d / (2 - max - min) : d / (max + min)
}

export function resolveLook(theme: ResolvedTheme, family: VisualFamily): Look {
  const t = theme.tokens
  const s = family.style

  const T = {
    primary: hx(t.primary, '#18181b'),
    primaryHover: hx(t.primaryHover, '#27272a'),
    primaryActive: hx(t.primaryActive, '#3f3f46'),
    onPrimary: hx(t.onPrimary, '#ffffff'),
    primarySoft: hx(t.primarySoft, '#f1f1f3'),
    selectedText: hx(t.selectedText, '#18181b'),
    secondary: hx(t.secondary, '#52525b'),
    accent: hx(t.accent, '#2563eb'),
    onAccent: hx(t.onAccent, '#ffffff'),
    bg: hx(t.bg, '#ffffff'),
    bgAlt: hx(t.bgAlt, '#f6f6f7'),
    surface: hx(t.surface, '#ffffff'),
    surfaceAlt: hx(t.surfaceAlt, '#f4f4f5'),
    text: hx(t.text, '#18181b'),
    muted: hx(t.textMuted, '#71717a'),
    border: hx(t.border, '#e4e4e7'),
    borderStrong: hx(t.borderStrong, '#c8c8ce'),
    focus: hx(t.focusRing, '#18181b'),
    disabled: hx(t.disabled, '#f1f1f2'),
    disabledText: hx(t.disabledText, '#a1a1aa'),
    success: hx(t.success, '#15803d'),
    successBg: hx(t.successBg, '#e8f6ec'),
    warning: hx(t.warning, '#b45309'),
    warningBg: hx(t.warningBg, '#fdf3e2'),
    error: hx(t.error, '#b91c1c'),
    errorBg: hx(t.errorBg, '#fdecec'),
    info: hx(t.info, '#1d4ed8'),
    infoBg: hx(t.infoBg, '#e8effd'),
    gradFrom: hx(t.gradientFrom, hx(t.primary, '#18181b')),
    gradTo: hx(t.gradientTo, hx(t.accent, '#2563eb')),
  }
  const paletteDark = isDark(T.bg)
  /** Cor de origem para tingimentos tonais: a primária, ou o destaque quando a primária é neutra (preto/cinza). */
  const brand = saturation(T.primary) >= 0.2 ? T.primary : T.accent
  const tonalBrand = (s.backdrop === 'tint' && s.fill !== 'accent') || s.surface === 'tonal' || s.fill === 'gradient'

  /* ------------------------------ Superfícies ------------------------------ */
  let bg = T.bg
  let surface = T.surface
  let surfaceCss = T.surface
  let surfaceAlt = T.surfaceAlt
  let text = T.text
  let dark = paletteDark
  let blur: string | undefined
  let neuDark = ''
  let neuLight = ''

  const goDark = (base: string) => {
    bg = base
    surface = mix(base, '#ffffff', 0.05)
    surfaceCss = surface
    surfaceAlt = mix(base, '#ffffff', 0.09)
    text = ensureContrast(paletteDark ? T.text : mix(T.bg, '#ffffff', 0.4), surface, 12)
    dark = true
  }

  switch (s.surface) {
    case 'tint':
      surface = mix(T.surface, brand, paletteDark ? 0.08 : 0.035)
      surfaceCss = surface
      surfaceAlt = mix(T.surface, brand, paletteDark ? 0.16 : 0.09)
      break
    case 'tonal':
      surface = mix(T.surface, T.text, paletteDark ? 0.07 : 0.04)
      surfaceCss = surface
      surfaceAlt = mix(T.surface, brand, paletteDark ? 0.2 : 0.12)
      break
    case 'glass':
      surfaceCss = withAlpha(T.surface, paletteDark ? 0.42 : 0.58)
      blur = 'blur(16px) saturate(1.4)'
      surfaceAlt = mix(T.surface, T.primary, 0.06)
      break
    case 'dark': {
      if (paletteDark) goDark(T.bg)
      else goDark(mix(mix(T.text, '#000000', 0.5), T.primary, 0.05))
      break
    }
    case 'midnight': {
      let base = paletteDark ? mix(T.bg, T.primary, 0.12) : darken(mix(T.primary, T.accent, 0.45), 0.8)
      for (let i = 0; i < 6 && luminance(base) > 0.025; i++) base = darken(base, 0.25)
      goDark(base)
      break
    }
    case 'aurora': {
      let base = paletteDark ? T.bg : darken(mix(T.primary, T.secondary, 0.5), 0.84)
      for (let i = 0; i < 6 && luminance(base) > 0.02; i++) base = darken(base, 0.25)
      goDark(base)
      surfaceCss = withAlpha(mix(base, '#ffffff', 0.1), 0.62)
      blur = 'blur(14px)'
      break
    }
    case 'paper': {
      const paper = paletteDark ? mix(T.surface, '#6b5232', 0.28) : mix(T.bg, '#f3e5c4', 0.72)
      bg = paper
      surface = paletteDark ? mix(paper, '#ffffff', 0.05) : mix(paper, '#ffffff', 0.42)
      surfaceCss = surface
      surfaceAlt = mix(paper, paletteDark ? '#ffffff' : '#5a3d1a', 0.06)
      text = paletteDark ? T.text : ensureContrast(mix(T.text, '#2a1d10', 0.4), surface, 10)
      break
    }
    case 'neu': {
      const base = paletteDark ? mix(T.surface, '#000000', 0.1) : mix(mix(T.bg, T.primary, 0.035), '#000000', 0.075)
      bg = base
      surface = base
      surfaceCss = base
      surfaceAlt = darken(base, 0.035)
      neuDark = withAlpha(darken(base, paletteDark ? 0.5 : 0.22), paletteDark ? 0.9 : 0.75)
      neuLight = withAlpha(paletteDark ? lighten(base, 0.07) : '#ffffff', paletteDark ? 0.6 : 0.9)
      break
    }
    case 'concrete':
      surfaceAlt = mix(T.surface, T.text, 0.06)
      break
    default:
      break
  }

  const muted = ensureContrast(dark ? mix(text, surface, 0.4) : s.surface === 'paper' ? mix(text, surface, 0.38) : T.muted, surface, 4.6)
  const faint = mix(text, surface, 0.62)
  const primary = ensureContrast(T.primary, surface, dark ? 4.5 : 3)
  const accent = ensureContrast(T.accent, surface, 3.2)
  const secondary = ensureContrast(T.secondary, surface, 3)
  const metal = ensureContrast(lighten(mix(T.warning, T.accent, 0.2), 0.18), bg, 6)
  const detail = s.surface === 'midnight' ? metal : dark ? ensureContrast(lighten(T.accent, 0.1), surface, 4.5) : accent

  /* ------------------------------ Bordas ------------------------------ */
  const subtle = dark ? withAlpha(text, 0.13) : s.surface === 'concrete' ? mix(T.surface, T.text, 0.18) : s.surface === 'paper' ? withAlpha(text, 0.25) : T.border
  const strongB = dark ? withAlpha(text, 0.28) : s.surface === 'concrete' ? mix(T.surface, T.text, 0.38) : T.borderStrong
  const lightB = dark ? withAlpha('#ffffff', 0.15) : withAlpha('#ffffff', 0.75)
  const border = { subtle, strong: strongB, ink: text, light: lightB, accent: withAlpha(detail, 0.38) }[s.borderTone]
  const borderStrong = s.borderTone === 'ink' ? text : s.borderTone === 'accent' ? withAlpha(detail, 0.65) : strongB
  const bw = s.borderWidth
  const bLine = bw > 0 && s.borderStyle !== 'none' ? `${bw}px ${s.borderStyle} ${border}` : 'none'
  const divider = s.surface === 'concrete' ? `1px dashed ${strongB}` : s.surface === 'paper' ? `1px solid ${withAlpha(text, 0.3)}` : s.borderTone === 'ink' && s.shadow !== 'hard' ? `1px solid ${text}` : `1px solid ${dark ? withAlpha(text, 0.1) : subtle}`

  /* ------------------------------ Soft / semânticos ------------------------------ */
  const brandSoft = mix(T.surface, brand, paletteDark ? 0.24 : 0.14)
  const soft = dark ? withAlpha(s.surface === 'midnight' ? metal : primary, 0.16) : tonalBrand ? brandSoft : s.surface === 'glass' ? withAlpha(T.primary, 0.12) : s.surface === 'paper' ? mix(surface, T.accent, 0.14) : T.primarySoft
  const onSoft = dark ? (s.surface === 'midnight' ? metal : primary) : tonalBrand ? ensureContrast(brand, brandSoft, 4.5) : s.surface === 'paper' ? ensureContrast(T.accent, mix(surface, T.accent, 0.14), 4.5) : ensureContrast(T.selectedText, T.primarySoft, 4.5)
  const sem = (fg: string, bgc: string) => (dark ? { fg: ensureContrast(lighten(fg, 0.2), surface, 4.5), bg: withAlpha(fg, 0.18) } : { fg: ensureContrast(fg, surface, 4.5), bg: bgc })
  const success = sem(T.success, T.successBg)
  const warning = sem(T.warning, T.warningBg)
  const error = sem(T.error, T.errorBg)
  const info = sem(T.info, T.infoBg)
  const focusColor = dark ? detail : s.focus === 'outline' ? text : T.focus

  /* ------------------------------ Preenchimento da ação ------------------------------ */
  const ink = dark ? '#000000' : mix(T.text, T.primary, 0.25)
  let fill = T.primary
  let onFill = T.onPrimary
  let fillHover = T.primaryHover
  let fillActive = T.primaryActive
  let btnShadow = 'none'
  let btnBorder = 'none'
  const solidOnDark = contrast(T.primary, bg) < 2.2 ? primary : T.primary
  switch (s.fill) {
    case 'solid': {
      const f = dark ? solidOnDark : T.primary
      fill = f
      onFill = readableOn(f)
      fillHover = dark ? lighten(f, 0.1) : T.primaryHover
      fillActive = dark ? lighten(f, 0.18) : T.primaryActive
      break
    }
    case 'gradient': {
      const a = t.gradientEnabled ? T.gradFrom : T.primary
      const b = t.gradientEnabled ? T.gradTo : T.accent
      fill = `linear-gradient(135deg, ${a}, ${b})`
      onFill = readableOn(mix(a, b, 0.5))
      fillHover = `linear-gradient(135deg, ${darken(a, 0.08)}, ${darken(b, 0.04)})`
      fillActive = `linear-gradient(135deg, ${darken(a, 0.16)}, ${darken(b, 0.12)})`
      btnShadow = `0 8px 22px ${withAlpha(mix(a, b, 0.5), 0.38)}`
      break
    }
    case 'metal':
      fill = `linear-gradient(135deg, ${lighten(metal, 0.38)} 0%, ${metal} 45%, ${darken(metal, 0.24)} 100%)`
      onFill = readableOn(metal, '#ffffff', bg)
      fillHover = `linear-gradient(135deg, ${lighten(metal, 0.5)} 0%, ${lighten(metal, 0.1)} 45%, ${darken(metal, 0.14)} 100%)`
      fillActive = `linear-gradient(135deg, ${lighten(metal, 0.2)} 0%, ${darken(metal, 0.08)} 50%, ${darken(metal, 0.3)} 100%)`
      btnShadow = `0 6px 20px ${withAlpha(metal, 0.3)}`
      break
    case 'ivory':
      fill = text
      onFill = bg
      fillHover = mix(text, detail, 0.25)
      fillActive = mix(text, bg, 0.15)
      break
    case 'accent':
      fill = T.accent
      onFill = T.onAccent
      fillHover = darken(T.accent, 0.08)
      fillActive = darken(T.accent, 0.16)
      btnBorder = `${bw}px solid ${text}`
      btnShadow = `4px 4px 0 ${text}`
      break
    case 'press':
      fill = T.primary
      onFill = T.onPrimary
      fillHover = lighten(T.primary, 0.06)
      fillActive = T.primary
      btnBorder = `2px solid ${darken(T.primary, 0.3)}`
      btnShadow = `0 4px 0 ${darken(T.primary, 0.35)}`
      break
    case 'aurora': {
      const a = ensureContrast(T.primary, bg, 3)
      fill = `linear-gradient(120deg, ${a}, ${T.accent}, ${ensureContrast(T.secondary, bg, 3)})`
      onFill = readableOn(mix(a, T.accent, 0.5))
      fillHover = `linear-gradient(120deg, ${lighten(a, 0.1)}, ${lighten(T.accent, 0.1)}, ${lighten(T.secondary, 0.1)})`
      fillActive = `linear-gradient(120deg, ${darken(a, 0.1)}, ${darken(T.accent, 0.1)}, ${darken(T.secondary, 0.1)})`
      btnShadow = `0 8px 28px ${withAlpha(T.accent, 0.4)}`
      break
    }
  }
  if (s.surface === 'paper') btnShadow = `3px 3px 0 ${withAlpha(T.accent, 0.5)}`
  if (s.surface === 'paper' || s.borderTone === 'ink') btnBorder = btnBorder === 'none' ? `${Math.max(1, bw)}px solid ${text}` : btnBorder
  if (s.surface === 'neu') btnShadow = `5px 5px 12px ${neuDark}, -5px -5px 12px ${neuLight}`
  if (s.shadow === 'glow' && s.fill === 'solid') btnShadow = `0 6px 20px ${withAlpha(fill, 0.35)}`

  /* ------------------------------ Sombras ------------------------------ */
  const glowColor = s.surface === 'midnight' ? metal : s.surface === 'aurora' ? T.accent : t.gradientEnabled ? T.gradFrom : mix(T.primary, T.accent, 0.5)
  const shadows: Record<FamilyStyle['shadow'], [string, string]> = {
    none: ['none', `0 12px 32px ${withAlpha(ink, 0.14)}`],
    hairline: [`0 1px 2px ${withAlpha(ink, 0.06)}, 0 0 0 0.5px ${withAlpha(ink, 0.06)}`, `0 12px 34px ${withAlpha(ink, 0.15)}, 0 0 0 0.5px ${withAlpha(ink, 0.1)}`],
    soft: [`0 1px 2px ${withAlpha(ink, 0.05)}, 0 6px 18px ${withAlpha(ink, 0.07)}`, `0 18px 44px ${withAlpha(ink, 0.16)}`],
    float: [`0 8px 30px ${withAlpha(T.primary, 0.13)}`, `0 18px 50px ${withAlpha(T.primary, 0.22)}`],
    hard: [`4px 4px 0 ${text}`, `6px 6px 0 ${text}`],
    neu: [`7px 7px 16px ${neuDark}, -7px -7px 16px ${neuLight}`, `10px 10px 24px ${neuDark}, -8px -8px 20px ${neuLight}`],
    glow: [`0 10px 30px ${withAlpha(glowColor, dark ? 0.22 : 0.16)}`, `0 22px 54px ${withAlpha(glowColor, dark ? 0.32 : 0.26)}`],
    deep: ['0 24px 48px rgba(0, 0, 0, 0.45)', '0 30px 70px rgba(0, 0, 0, 0.6)'],
    tonal: [`0 1px 2px ${withAlpha(ink, 0.16)}, 0 1px 3px 1px ${withAlpha(ink, 0.07)}`, `0 4px 8px 3px ${withAlpha(ink, 0.1)}, 0 1px 3px ${withAlpha(ink, 0.18)}`],
    print: [`3px 3px 0 ${withAlpha(T.accent, 0.45)}`, `5px 5px 0 ${withAlpha(T.accent, 0.45)}`],
    press: [`0 4px 0 ${strongB}`, `0 6px 0 ${strongB}, 0 18px 34px ${withAlpha(ink, 0.12)}`],
  }
  const [shadow, shadowFloat] = shadows[s.shadow]

  /* ------------------------------ Métricas ------------------------------ */
  const r = s.radius
  const rLg = s.radiusCard
  const rSm = r >= 999 ? 999 : Math.max(0, Math.round(r * 0.6))
  const h = s.controlHeight
  const pad = Math.round(14 * s.density)
  const gap = Math.round(10 * s.density)

  /* ------------------------------ Receitas ------------------------------ */
  const card: CSSProperties = {
    background: surfaceCss,
    border: bLine,
    borderRadius: rLg,
    boxShadow: shadow,
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
  }
  const raised = s.surface === 'glass' ? withAlpha(T.surface, paletteDark ? 0.7 : 0.82) : s.surface === 'aurora' ? withAlpha(mix(bg, '#ffffff', 0.12), 0.9) : dark ? mix(bg, '#ffffff', 0.08) : s.surface === 'neu' ? surface : s.surface === 'paper' ? surface : T.surface
  const float: CSSProperties = {
    background: raised,
    border: bLine === 'none' ? (s.surface === 'neu' ? 'none' : `1px solid ${dark ? withAlpha(text, 0.1) : withAlpha(ink, 0.08)}`) : bLine,
    borderRadius: Math.min(rLg, 18),
    boxShadow: shadowFloat,
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
  }

  const inset = s.surface === 'neu' ? `inset 3px 3px 7px ${neuDark}, inset -3px -3px 7px ${neuLight}` : 'none'
  const fbw = Math.max(1, bw)
  let field: CSSProperties
  switch (s.field) {
    case 'tonal':
      field = { background: dark ? withAlpha('#ffffff', 0.06) : mix(T.surface, T.text, 0.055), border: '1px solid transparent', borderRadius: r }
      break
    case 'underline':
      field = { background: 'transparent', border: 'none', borderBottom: `${fbw}px ${s.surface === 'paper' ? 'dashed' : 'solid'} ${s.borderTone === 'accent' ? withAlpha(detail, 0.55) : text}`, borderRadius: 0 }
      break
    case 'inset':
      field = { background: surface, border: '1px solid transparent', borderRadius: r, boxShadow: inset }
      break
    case 'glass':
      field = { background: withAlpha('#ffffff', dark ? 0.06 : 0.5), border: `1px solid ${dark ? withAlpha('#ffffff', 0.16) : withAlpha('#ffffff', 0.85)}`, borderRadius: r, backdropFilter: 'blur(10px)' }
      break
    case 'filled':
      field = { background: mix(T.surface, brand, paletteDark ? 0.14 : 0.07), border: 'none', borderBottom: `1.5px solid ${muted}`, borderRadius: '4px 4px 0 0' }
      break
    default:
      field = {
        background: dark ? withAlpha('#ffffff', 0.03) : s.surface === 'concrete' ? T.surface : surfaceCss,
        border: `${s.shadow === 'hard' ? bw : s.shadow === 'press' ? 2 : fbw}px solid ${s.borderTone === 'ink' || s.shadow === 'hard' ? text : s.borderTone === 'accent' ? withAlpha(detail, 0.45) : strongB}`,
        borderRadius: r,
        boxShadow: s.shadow === 'hard' ? `3px 3px 0 ${text}` : undefined,
      }
  }
  const fieldHover: CSSProperties = s.field === 'underline' || s.field === 'filled' ? { borderBottomColor: s.field === 'filled' ? text : detail } : { borderColor: dark ? withAlpha(text, 0.45) : s.borderTone === 'ink' ? text : mix(strongB, T.text, 0.3) }

  const focusFx: CSSProperties =
    s.focus === 'outline'
      ? { outline: `2px solid ${focusColor}`, outlineOffset: 2 }
      : s.focus === 'dashed'
        ? { outline: `2px dashed ${s.surface === 'paper' ? text : accent}`, outlineOffset: 2 }
        : s.focus === 'glow'
          ? { boxShadow: `0 0 0 1px ${focusColor}, 0 0 0 5px ${withAlpha(focusColor, 0.25)}, 0 0 26px ${withAlpha(focusColor, 0.4)}` }
          : s.focus === 'offset'
            ? { boxShadow: `6px 6px 0 ${text}`, transform: 'translate(-2px, -2px)' }
            : { boxShadow: `0 0 0 ${s.surface === 'neu' ? 3 : 3}px ${withAlpha(focusColor, 0.35)}` }
  const fieldFocus: CSSProperties =
    s.field === 'underline' || s.field === 'filled'
      ? { borderBottom: `2px solid ${s.surface === 'midnight' || s.borderTone === 'accent' ? detail : primary}`, ...(s.focus === 'outline' || s.focus === 'dashed' ? focusFx : {}) }
      : { borderColor: s.focus === 'offset' ? text : focusColor, ...focusFx, ...(s.surface === 'neu' ? { boxShadow: `${inset}, 0 0 0 3px ${withAlpha(focusColor, 0.3)}` } : {}) }

  let btn2: CSSProperties
  if (s.surface === 'glass' || s.surface === 'aurora') btn2 = { background: withAlpha('#ffffff', dark ? 0.08 : 0.55), color: text, border: `1px solid ${lightB}`, backdropFilter: 'blur(10px)' }
  else if (s.surface === 'neu') btn2 = { background: surface, color: primary, border: 'none', boxShadow: `5px 5px 12px ${neuDark}, -5px -5px 12px ${neuLight}` }
  else if (s.shadow === 'hard') btn2 = { background: T.surface, color: text, border: `${bw}px solid ${text}`, boxShadow: `3px 3px 0 ${text}` }
  else if (s.shadow === 'press') btn2 = { background: T.surface, color: text, border: `2px solid ${strongB}`, boxShadow: `0 4px 0 ${strongB}` }
  else if (dark) btn2 = { background: 'transparent', color: text, border: `1px solid ${withAlpha(detail, 0.55)}` }
  else if (s.surface === 'paper') btn2 = { background: surface, color: text, border: `${fbw}px solid ${text}` }
  else if (s.field === 'tonal' || s.field === 'filled') btn2 = { background: soft, color: onSoft, border: '1px solid transparent' }
  else btn2 = { background: s.borderTone === 'ink' ? 'transparent' : T.surface, color: text, border: `${fbw}px solid ${s.borderTone === 'ink' ? text : strongB}` }

  const btn2Hover: CSSProperties =
    s.borderTone === 'ink' && s.shadow === 'none'
      ? { background: text, color: bg }
      : dark
        ? { background: withAlpha(detail, 0.12) }
        : s.field === 'tonal' || s.field === 'filled'
          ? { background: tonalBrand ? mix(brandSoft, brand, 0.1) : mix(T.primarySoft, T.primary, 0.08) }
          : { background: s.surface === 'glass' ? withAlpha('#ffffff', 0.75) : mix(T.surface, T.text, 0.05) }

  const hoverFx: CSSProperties = s.shadow === 'hard' ? { transform: 'translate(-2px, -2px)' } : s.shadow === 'press' ? { transform: 'translateY(-1px)' } : {}
  const activeFx: CSSProperties =
    s.shadow === 'hard'
      ? { transform: 'translate(4px, 4px)', boxShadow: 'none' }
      : s.shadow === 'press'
        ? { transform: 'translateY(4px)', boxShadow: 'none' }
        : s.surface === 'neu'
          ? { boxShadow: inset }
          : s.radius >= 999
            ? { transform: 'scale(0.98)' }
            : {}
  const disabled: CSSProperties = {
    background: dark ? withAlpha('#ffffff', 0.08) : s.surface === 'neu' ? surface : T.disabled,
    color: dark ? withAlpha(text, 0.4) : T.disabledText,
    boxShadow: 'none',
    borderColor: dark ? withAlpha(text, 0.12) : T.border,
    cursor: 'not-allowed',
    transform: 'none',
  }

  const headingFill: CSSProperties | undefined =
    s.fill === 'gradient' || s.fill === 'aurora'
      ? {
          background: s.fill === 'aurora' ? `linear-gradient(100deg, ${text}, ${lighten(T.accent, 0.25)})` : `linear-gradient(100deg, ${t.gradientEnabled ? T.gradFrom : T.primary}, ${t.gradientEnabled ? T.gradTo : T.accent})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
        }
      : undefined

  /* ------------------------------ Palco ------------------------------ */
  const tintSrc = s.fill === 'accent' ? T.accent : brand
  const stage = (() => {
    switch (s.backdrop) {
      case 'alt':
        return dark ? mix(bg, '#ffffff', 0.03) : T.bgAlt === T.bg ? mix(T.bg, T.text, 0.035) : T.bgAlt
      case 'tint':
        return mix(T.bg, tintSrc, paletteDark ? 0.1 : s.fill === 'accent' ? 0.2 : 0.06)
      case 'blobs':
        return `radial-gradient(circle at 16% 20%, ${withAlpha(T.accent, 0.42)}, transparent 44%), radial-gradient(circle at 86% 28%, ${withAlpha(t.gradientEnabled ? T.gradTo : T.primary, 0.3)}, transparent 46%), radial-gradient(circle at 55% 100%, ${withAlpha(T.secondary, 0.34)}, transparent 48%), ${mix(T.bg, T.accent, 0.06)}`
      case 'aurora':
        return `radial-gradient(70% 80% at 12% 0%, ${withAlpha(ensureContrast(T.primary, bg, 2.5), 0.5)}, transparent 62%), radial-gradient(55% 70% at 92% 18%, ${withAlpha(T.accent, 0.45)}, transparent 62%), radial-gradient(60% 60% at 50% 115%, ${withAlpha(ensureContrast(T.secondary, bg, 2.5), 0.4)}, transparent 62%), ${bg}`
      case 'grid':
        return `linear-gradient(${withAlpha(T.text, 0.06)} 1px, transparent 1px) 0 0 / 16px 16px, linear-gradient(90deg, ${withAlpha(T.text, 0.06)} 1px, transparent 1px) 0 0 / 16px 16px, ${mix(T.bg, T.text, paletteDark ? 0.04 : 0.03)}`
      case 'paper':
        return `repeating-linear-gradient(0deg, transparent 0 23px, ${withAlpha(T.accent, 0.09)} 23px 24px), ${mix(bg, paletteDark ? '#000000' : '#c9a66b', 0.08)}`
      case 'dark':
        return s.surface === 'midnight'
          ? `radial-gradient(60% 55% at 85% 0%, ${withAlpha(metal, 0.14)}, transparent 70%), radial-gradient(120% 90% at 50% 0%, ${mix(bg, '#ffffff', 0.05)}, ${bg})`
          : `radial-gradient(120% 90% at 50% 0%, ${mix(bg, '#ffffff', 0.06)}, ${bg})`
      case 'dots':
        return `radial-gradient(${withAlpha(brand, 0.28)} 1.4px, transparent 1.6px) 0 0 / 14px 14px, ${mix(T.bg, brand, 0.05)}`
      case 'wash':
        return `linear-gradient(160deg, ${mix(T.bg, t.gradientEnabled ? T.gradFrom : T.primary, 0.07)}, ${T.bg} 55%, ${mix(T.bg, t.gradientEnabled ? T.gradTo : T.accent, 0.09)})`
      case 'neu':
        return bg
      default:
        return T.bg
    }
  })()

  /* ------------------------------ Diversos ------------------------------ */
  const cyc = (c: string) => ({ bg: c, fg: readableOn(c) })
  const cycle = [cyc(dark ? solidOnDark : T.primary), cyc(T.accent), cyc(T.secondary), cyc(T.success), cyc(T.warning)]
  const headBar: CSSProperties =
    s.surface === 'concrete'
      ? { background: T.text, color: readableOn(T.text) }
      : s.borderTone === 'ink'
        ? { background: 'transparent', color: text, borderBottom: `${s.shadow === 'hard' ? bw : 1}px solid ${text}` }
        : dark
          ? { background: withAlpha('#ffffff', 0.03), color: muted, borderBottom: `1px solid ${withAlpha(detail, 0.3)}` }
          : { background: s.surface === 'glass' ? withAlpha('#ffffff', 0.35) : surfaceAlt, color: muted }

  return {
    familyId: family.id,
    style: s,
    dark,
    stage,
    bg,
    surface: surfaceCss,
    surfaceSolid: surface,
    surfaceAlt,
    raised,
    text,
    muted,
    faint,
    border,
    borderStrong,
    divider,
    primary,
    accent: detail === metal ? metal : accent,
    secondary,
    metal,
    brand,
    soft,
    onSoft,
    success: success.fg,
    successBg: success.bg,
    warning: warning.fg,
    warningBg: warning.bg,
    error: error.fg,
    errorBg: error.bg,
    info: info.fg,
    infoBg: info.bg,
    focusColor,
    cycle,
    font: fontStack(s.font),
    headingFont: fontStack(s.headingFont),
    labelFont: s.surface === 'paper' ? fontStack('jetbrains-mono') : fontStack(s.font),
    mono: fontStack('jetbrains-mono'),
    fs: s.fontSize,
    hw: s.headingWeight,
    uw: s.uiWeight,
    upper: s.textCase === 'uppercase',
    track: `${s.tracking}em`,
    headTrack: `${s.headingTracking}em`,
    r,
    rLg,
    rSm,
    h,
    pad,
    gap,
    bw,
    iconStroke: s.iconStroke,
    blur,
    shadow,
    shadowFloat,
    fill,
    onFill,
    fillHover,
    fillActive,
    btnShadow,
    btnBorder,
    headingFill,
    card,
    float,
    field,
    fieldHover,
    fieldFocus,
    btn2,
    btn2Hover,
    ghostColor: dark ? text : primary,
    focusFx,
    hoverFx,
    activeFx,
    disabled,
    trackOff: s.surface === 'neu' ? darken(surface, 0.06) : dark ? withAlpha(text, 0.18) : s.borderTone === 'ink' ? T.surface : mix(T.surface, T.text, 0.16),
    trackOn: s.fill === 'accent' ? T.accent : s.fill === 'metal' ? metal : s.fill === 'ivory' ? detail : dark ? solidOnDark : T.primary,
    thumb: s.fill === 'ivory' || s.fill === 'metal' ? bg : '#ffffff',
    rowHover: dark ? withAlpha('#ffffff', 0.04) : mix(T.surface, T.text, 0.035),
    zebra: dark ? withAlpha('#ffffff', 0.025) : mix(T.surface, T.text, 0.022),
    headBar,
    cardAccent: s.fill === 'gradient' ? fill : s.fill === 'metal' ? `linear-gradient(90deg, transparent, ${metal}, transparent)` : undefined,
    inset,
  }
}
