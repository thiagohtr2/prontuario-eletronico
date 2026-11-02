import { createContext, useContext, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { darken, ensureContrast, isHex, mix, normalizeHex, readableOn, withAlpha } from '@/core/color'
import { iconByName } from './icons'
import type { Look } from './look'
import type { ComponentValues, FamilyStyle, PreviewState } from './types'

/* -------------------------------------------------------------------------- */
/* Contexto da prévia                                                          */
/* -------------------------------------------------------------------------- */

export interface PreviewCtx {
  L: Look
  state: PreviewState
  onPart?: (part: string) => void
  activePart?: string | null
}

export const PreviewContext = createContext<PreviewCtx | null>(null)

export function usePv(): PreviewCtx {
  const ctx = useContext(PreviewContext)
  if (!ctx) throw new Error('Componente de prévia fora do PreviewContext.')
  return ctx
}

/** Marca uma parte editável (edição por clique). Sem `onPart`, é só um atributo. */
export function usePart() {
  const { onPart, activePart } = usePv()
  return (name?: string) =>
    name
      ? {
          'data-part': name,
          'data-active-part': activePart === name ? 'true' : undefined,
          onClick: onPart
            ? (e: MouseEvent) => {
                e.preventDefault()
                e.stopPropagation()
                onPart(name)
              }
            : undefined,
        }
      : {}
}

/* -------------------------------------------------------------------------- */
/* Leitura de valores                                                          */
/* -------------------------------------------------------------------------- */

export const str = (v: ComponentValues, k: string, fb = '') => (v[k] === undefined || v[k] === null ? fb : String(v[k]))
export const num = (v: ComponentValues, k: string, fb = 0) => {
  const n = Number(v[k])
  return Number.isFinite(n) ? n : fb
}
export const bool = (v: ComponentValues, k: string) => v[k] === true || v[k] === 'true'
export const lines = (v: ComponentValues, k: string) =>
  str(v, k)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
export const pair = (line: string): [string, string] => {
  const [a, ...rest] = line.split(/\s+[—–-]\s+/)
  return [a ?? '', rest.join(' — ')]
}
export const hexOr = (value: string, fb: string) => (value && isHex(value) ? normalizeHex(value) : fb)
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '?'

/* -------------------------------------------------------------------------- */
/* Estados                                                                     */
/* -------------------------------------------------------------------------- */

function joinShadow(a?: string | number, b?: string | number) {
  const parts = [a, b].filter((x) => x && x !== 'none') as string[]
  return parts.length ? parts.join(', ') : 'none'
}

/** Aplica o estado visual (hover/focus/active/disabled) a um estilo base. */
export function withState(L: Look, base: CSSProperties, st: PreviewState | undefined, kind: 'primary' | 'secondary' | 'ghost' | 'danger' | 'field' | 'plain' = 'plain'): CSSProperties {
  if (!st || st === 'normal') return base
  if (st === 'disabled') {
    if (kind === 'field') return { ...base, background: L.disabled.background, color: L.disabled.color, cursor: 'not-allowed', opacity: 0.85 }
    if (kind === 'ghost' || kind === 'plain') return { ...base, opacity: 0.45, cursor: 'not-allowed', transform: 'none' }
    return { ...base, ...L.disabled, border: base.border && base.border !== 'none' ? `1px solid ${String(L.disabled.borderColor)}` : base.border }
  }
  if (kind === 'field') {
    if (st === 'hover') return { ...base, ...L.fieldHover }
    return { ...base, ...L.fieldFocus }
  }
  if (st === 'hover') {
    const bg = kind === 'primary' ? { background: L.fillHover } : kind === 'secondary' ? L.btn2Hover : kind === 'danger' ? { background: darken(L.error, 0.08) } : { background: L.rowHover }
    const hard = L.style.shadow === 'hard' && kind !== 'ghost' ? { boxShadow: `6px 6px 0 ${L.text}` } : {}
    return { ...base, ...bg, ...L.hoverFx, ...hard }
  }
  if (st === 'active') {
    const bg = kind === 'primary' ? { background: L.fillActive } : kind === 'ghost' || kind === 'plain' ? { background: L.rowHover } : kind === 'danger' ? { background: darken(L.error, 0.16) } : {}
    return { ...base, ...bg, ...L.activeFx }
  }
  // focus
  const f = L.focusFx
  if (f.boxShadow && L.style.focus !== 'offset') return { ...base, ...f, boxShadow: joinShadow(f.boxShadow, base.boxShadow) }
  return { ...base, ...f }
}

/* -------------------------------------------------------------------------- */
/* Tipografia                                                                  */
/* -------------------------------------------------------------------------- */

type TextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'label' | 'num' | 'caption'

export function textStyle(L: Look, v: TextVariant): CSSProperties {
  const fs = L.fs
  const heading = (size: number, fill = false): CSSProperties => ({
    fontFamily: L.headingFont,
    fontWeight: L.hw,
    fontSize: size,
    letterSpacing: L.headTrack,
    lineHeight: 1.15,
    color: L.text,
    ...(fill && L.headingFill ? L.headingFill : {}),
  })
  switch (v) {
    case 'display':
      return heading(Math.round(fs * 2.1), true)
    case 'h1':
      return heading(Math.round(fs * 1.55), true)
    case 'h2':
      return heading(Math.round(fs * 1.25))
    case 'h3':
      return { ...heading(Math.round(fs * 1.08)), lineHeight: 1.25 }
    case 'num':
      return { ...heading(Math.round(fs * 1.75)), fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }
    case 'small':
      return { fontFamily: L.font, fontSize: Math.max(11.5, fs - 1.5), color: L.muted, lineHeight: 1.4 }
    case 'caption':
      return { fontFamily: L.labelFont, fontSize: 11.5, color: L.muted, lineHeight: 1.3, textTransform: L.upper ? 'uppercase' : 'none', letterSpacing: L.upper ? L.track : '0.01em', fontWeight: L.upper ? L.uw : 500 }
    case 'label':
      return { fontFamily: L.labelFont, fontSize: L.upper ? 11.5 : Math.max(12, fs - 1), color: L.text, fontWeight: L.uw, textTransform: L.upper ? 'uppercase' : 'none', letterSpacing: L.upper ? L.track : 0, lineHeight: 1.3 }
    default:
      return { fontFamily: L.font, fontSize: fs, color: L.text, lineHeight: 1.5 }
  }
}

export function Txt({ v = 'body', children, part, style, as: As = 'span', color }: { v?: TextVariant; children: ReactNode; part?: string; style?: CSSProperties; as?: 'span' | 'div' | 'p' | 'strong'; color?: string }) {
  const { L } = usePv()
  const P = usePart()
  return (
    <As {...P(part)} style={{ display: As === 'span' ? 'inline-block' : 'block', margin: 0, minWidth: 0, overflowWrap: 'anywhere', ...textStyle(L, v), ...(color ? { color, WebkitTextFillColor: color } : {}), ...style }}>
      {children}
    </As>
  )
}

const OVER_PREFIX: Record<string, string> = {
  'swiss-minimal': '01 — ',
  industrial: '[A-01] ',
  'retro-paper': '№ 01 · ',
  'dark-luxury': '— ',
  'midnight-gold': '✦ ',
}

/** Sobretítulo com o marcador característico da família. */
export function Over({ children, part, color }: { children: ReactNode; part?: string; color?: string }) {
  const { L } = usePv()
  const P = usePart()
  return (
    <span
      {...P(part)}
      style={{
        display: 'inline-block',
        fontFamily: L.labelFont,
        fontSize: 11.5,
        fontWeight: Math.max(600, L.uw),
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: color ?? (L.dark ? L.accent : L.style.borderTone === 'ink' ? L.text : L.primary),
        lineHeight: 1.3,
      }}
    >
      {OVER_PREFIX[L.familyId] ?? ''}
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Ícones                                                                      */
/* -------------------------------------------------------------------------- */

export function Ico({ name, size = 18, color, style, part, filled }: { name: string; size?: number; color?: string; style?: CSSProperties; part?: string; filled?: boolean }) {
  const { L } = usePv()
  const P = usePart()
  const I = iconByName(name)
  const icon = <I size={size} strokeWidth={L.iconStroke} color={color ?? 'currentColor'} fill={filled ? 'currentColor' : 'none'} style={{ flex: 'none', ...style }} aria-hidden="true" />
  return part ? (
    <span {...P(part)} style={{ display: 'inline-flex', flex: 'none' }}>
      {icon}
    </span>
  ) : (
    icon
  )
}

export function tileStyle(L: Look, size: number, index = 0, treatment: FamilyStyle['iconTreatment'] = L.style.iconTreatment): { box: CSSProperties; color: string } {
  const base: CSSProperties = { width: size, height: size, display: 'inline-grid', placeItems: 'center', flex: 'none', boxSizing: 'border-box' }
  const c = L.cycle[index % L.cycle.length]
  switch (treatment) {
    case 'plain':
      return { box: base, color: L.dark ? L.accent : L.primary }
    case 'circle': {
      if (L.style.surface === 'glass') return { box: { ...base, borderRadius: '50%', background: withAlpha('#ffffff', 0.6), border: `1px solid ${withAlpha('#ffffff', 0.9)}` }, color: L.primary }
      if (L.style.surface === 'neu') return { box: { ...base, borderRadius: '50%', background: L.surfaceSolid, boxShadow: L.btnShadow }, color: L.primary }
      if (L.style.surface === 'aurora') return { box: { ...base, borderRadius: '50%', border: '1.5px solid transparent', background: `linear-gradient(${L.surfaceSolid}, ${L.surfaceSolid}) padding-box, ${L.fill} border-box` }, color: L.text }
      if (L.style.surface === 'midnight') return { box: { ...base, borderRadius: '50%', border: `1px solid ${withAlpha(L.metal, 0.7)}`, background: withAlpha(L.metal, 0.08) }, color: L.metal }
      return { box: { ...base, borderRadius: '50%', background: L.soft }, color: L.onSoft }
    }
    case 'square': {
      const bg = index % 2 === 0 ? L.fill : L.soft
      return { box: { ...base, borderRadius: Math.min(L.rSm, 4), background: bg, border: `${Math.min(L.bw, 2)}px solid ${L.text}` }, color: index % 2 === 0 ? L.onFill : L.text }
    }
    case 'soft-tile':
      if (L.style.shadow === 'press') return { box: { ...base, borderRadius: Math.round(size * 0.32), background: c.bg, border: `2px solid ${darken(c.bg, 0.25)}`, boxShadow: `0 3px 0 ${darken(c.bg, 0.3)}` }, color: c.fg }
      return { box: { ...base, borderRadius: Math.round(size * 0.32), background: L.soft }, color: L.onSoft }
    case 'outline-box':
      return { box: { ...base, borderRadius: L.rSm, border: `1px solid ${L.dark ? withAlpha(L.accent, 0.6) : L.borderStrong}` }, color: L.dark ? L.accent : L.text }
    case 'app-tile':
      return { box: { ...base, borderRadius: Math.round(size * 0.26), background: c.bg }, color: c.fg }
    case 'gradient-tile':
      return { box: { ...base, borderRadius: Math.round(size * 0.3), background: L.fill, boxShadow: L.btnShadow }, color: L.onFill }
    case 'stamp':
      return { box: { ...base, borderRadius: '50%', border: `1.5px dashed ${L.text}`, transform: 'rotate(-8deg)' }, color: L.text }
  }
}

export function Tile({ name, size = 36, index = 0, part, color, treatment }: { name: string; size?: number; index?: number; part?: string; color?: string; treatment?: FamilyStyle['iconTreatment'] }) {
  const { L } = usePv()
  const P = usePart()
  const t = tileStyle(L, size, index, treatment)
  return (
    <span {...P(part)} style={t.box}>
      <Ico name={name} size={Math.round(size * 0.52)} color={color || t.color} />
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Botões                                                                      */
/* -------------------------------------------------------------------------- */

export type BtnKind = 'primary' | 'secondary' | 'ghost' | 'danger'

export function btnStyle(L: Look, kind: BtnKind, size: 'sm' | 'md' | 'lg' = 'md', onlyIcon = false, full = false): CSSProperties {
  const h = size === 'sm' ? Math.max(28, Math.round(L.h * 0.84)) : size === 'lg' ? Math.round(L.h * 1.16) : L.h
  const fs = Math.max(12, size === 'sm' ? L.fs - 1 : size === 'lg' ? L.fs + 1 : L.fs)
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: h,
    minWidth: onlyIcon ? h : undefined,
    width: full ? '100%' : onlyIcon ? h : undefined,
    padding: onlyIcon ? 0 : `0 ${Math.round(h * (L.upper ? 0.48 : 0.42))}px`,
    borderRadius: L.r >= 999 ? 999 : L.r,
    fontFamily: L.familyId === 'retro-paper' ? L.labelFont : L.font,
    fontSize: L.upper ? fs - 1.5 : fs,
    fontWeight: L.uw,
    letterSpacing: L.track,
    textTransform: L.upper ? 'uppercase' : 'none',
    whiteSpace: 'nowrap',
    lineHeight: 1,
    boxSizing: 'border-box',
    cursor: 'pointer',
    flex: 'none',
    transition: 'background .15s, box-shadow .15s, transform .15s',
    maxWidth: '100%',
  }
  switch (kind) {
    case 'primary':
      return { ...base, background: L.fill, color: L.onFill, border: L.btnBorder, boxShadow: L.btnShadow }
    case 'secondary':
      return { ...base, ...L.btn2 }
    case 'ghost':
      return { ...base, background: 'transparent', color: L.ghostColor, border: '1px solid transparent' }
    case 'danger':
      return { ...base, background: L.error, color: readableOn(L.error), border: L.btnBorder !== 'none' && L.style.borderTone === 'ink' ? L.btnBorder : 'none', boxShadow: L.style.shadow === 'hard' ? `4px 4px 0 ${L.text}` : 'none' }
  }
}

export function Btn({
  kind = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  full,
  st,
  part,
  iconPart,
  loading,
  style,
}: {
  kind?: BtnKind
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconRight?: string
  children?: ReactNode
  full?: boolean
  st?: PreviewState
  part?: string
  iconPart?: string
  loading?: boolean
  style?: CSSProperties
}) {
  const { L } = usePv()
  const P = usePart()
  const onlyIcon = !children && Boolean(icon || iconRight)
  const s = withState(L, btnStyle(L, kind, size, onlyIcon, full), st, kind)
  const isz = size === 'sm' ? 15 : size === 'lg' ? 19 : 17
  return (
    <span role="button" tabIndex={-1} {...P(part)} style={{ ...s, ...style }} aria-disabled={st === 'disabled' || undefined}>
      {loading ? <Spinner size={isz} color="currentColor" /> : icon && <Ico name={icon} size={isz} part={iconPart} />}
      {children && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</span>}
      {!loading && iconRight && <Ico name={iconRight} size={isz} part={iconPart} />}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Campos                                                                      */
/* -------------------------------------------------------------------------- */

export function Label({ children, part, required }: { children: ReactNode; part?: string; required?: boolean }) {
  const { L } = usePv()
  const P = usePart()
  return (
    <span {...P(part)} style={{ ...textStyle(L, 'label'), display: 'inline-block' }}>
      {children}
      {required && <span style={{ color: L.error }}> *</span>}
    </span>
  )
}

export function fieldBox(L: Look, opts: { multiline?: boolean; rows?: number; size?: 'sm' | 'md' | 'lg' } = {}): CSSProperties {
  const h = opts.size === 'sm' ? Math.max(28, Math.round(L.h * 0.86)) : opts.size === 'lg' ? Math.round(L.h * 1.14) : L.h
  const underline = L.style.field === 'underline'
  const radius = L.field.borderRadius
  return {
    display: 'flex',
    alignItems: opts.multiline ? 'flex-start' : 'center',
    gap: 8,
    height: opts.multiline ? undefined : h,
    minHeight: opts.multiline ? (opts.rows ?? 3) * 20 + 20 : undefined,
    padding: underline ? (opts.multiline ? '8px 2px' : '0 2px') : opts.multiline ? `10px ${Math.round(h * 0.3)}px` : `0 ${Math.round(h * (L.r >= 999 ? 0.42 : 0.3))}px`,
    fontSize: L.fs,
    fontFamily: L.font,
    color: L.text,
    boxSizing: 'border-box',
    width: '100%',
    minWidth: 0,
    ...L.field,
    borderRadius: opts.multiline && typeof radius === 'number' && radius > 18 ? 18 : radius,
  }
}

export function Field({
  label,
  placeholder,
  value,
  icon,
  iconRight,
  trailing,
  help,
  error,
  st,
  part = 'field',
  labelPart = 'label',
  helpPart = 'help',
  iconPart = 'icon',
  required,
  multiline,
  rows,
  size,
  style,
}: {
  label?: ReactNode
  placeholder?: string
  value?: string
  icon?: string
  iconRight?: string
  trailing?: ReactNode
  help?: ReactNode
  error?: ReactNode
  st?: PreviewState
  part?: string
  labelPart?: string
  helpPart?: string
  iconPart?: string
  required?: boolean
  multiline?: boolean
  rows?: number
  size?: 'sm' | 'md' | 'lg'
  style?: CSSProperties
}) {
  const { L } = usePv()
  const P = usePart()
  let box = withState(L, fieldBox(L, { multiline, rows, size }), st, 'field')
  if (error) box = L.style.field === 'underline' || L.style.field === 'filled' ? { ...box, borderBottomColor: L.error } : { ...box, borderColor: L.error }
  const focused = st === 'focus' || st === 'active'
  return (
    <div style={{ display: 'grid', gap: 6, width: '100%', minWidth: 0, ...style }}>
      {label && (
        <Label part={labelPart} required={required}>
          {label}
        </Label>
      )}
      <div {...P(part)} style={box}>
        {icon && <Ico name={icon} size={17} color={focused ? L.primary : L.muted} part={iconPart} style={multiline ? { marginTop: 2 } : undefined} />}
        <span style={{ flex: 1, minWidth: 0, color: value ? L.text : L.faint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: multiline ? 'normal' : 'nowrap', lineHeight: 1.45 }}>
          {value || placeholder}
          {focused && <span style={{ display: 'inline-block', width: 1.5, height: '1.1em', background: L.primary, verticalAlign: 'text-bottom', marginLeft: 1 }} />}
        </span>
        {trailing}
        {iconRight && <Ico name={iconRight} size={17} color={L.muted} part={iconPart} />}
      </div>
      {(error || help) && (
        <span {...P(error ? 'error' : helpPart)} style={{ ...textStyle(L, 'small'), color: error ? L.error : L.muted }}>
          {error || help}
        </span>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Superfícies                                                                 */
/* -------------------------------------------------------------------------- */

export function Card({ children, style, pad, part, accentTop, raised }: { children: ReactNode; style?: CSSProperties; pad?: number | string; part?: string; accentTop?: boolean; raised?: boolean }) {
  const { L } = usePv()
  const P = usePart()
  return (
    <div {...P(part)} style={{ ...(raised ? L.float : L.card), padding: pad ?? L.pad, position: 'relative', minWidth: 0, boxSizing: 'border-box', color: L.text, fontFamily: L.font, ...style }}>
      {accentTop && L.cardAccent && <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 3, background: L.cardAccent, borderRadius: `${L.rLg}px ${L.rLg}px 0 0` }} />}
      {children}
    </div>
  )
}

export function Divider({ style }: { style?: CSSProperties }) {
  const { L } = usePv()
  return <div aria-hidden="true" style={{ borderTop: L.divider, width: '100%', ...style }} />
}

export function Row({ children, gap = 8, style, justify, align = 'center', wrap }: { children: ReactNode; gap?: number; style?: CSSProperties; justify?: CSSProperties['justifyContent']; align?: CSSProperties['alignItems']; wrap?: boolean }) {
  return <div style={{ display: 'flex', alignItems: align, gap, justifyContent: justify, minWidth: 0, flexWrap: wrap ? 'wrap' : undefined, ...style }}>{children}</div>
}

export function Col({ children, gap = 8, style }: { children: ReactNode; gap?: number; style?: CSSProperties }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap, minWidth: 0, ...style }}>{children}</div>
}

/* -------------------------------------------------------------------------- */
/* Badges, chips, toggles                                                      */
/* -------------------------------------------------------------------------- */

export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info'

export function toneColors(L: Look, tone: Tone): { fg: string; bg: string } {
  switch (tone) {
    case 'primary':
      return { fg: L.onSoft, bg: L.soft }
    case 'success':
      return { fg: L.success, bg: L.successBg }
    case 'warning':
      return { fg: L.warning, bg: L.warningBg }
    case 'error':
      return { fg: L.error, bg: L.errorBg }
    case 'info':
      return { fg: L.info, bg: L.infoBg }
    default:
      return { fg: L.muted, bg: L.dark ? withAlpha(L.text, 0.08) : L.surfaceAlt }
  }
}

export function Badge({
  tone = 'neutral',
  variant = 'soft',
  shape = 'familia',
  children,
  part,
  removable,
  color,
  style,
}: {
  tone?: Tone
  variant?: 'soft' | 'solid' | 'outline' | 'dot'
  shape?: 'familia' | 'pilula' | 'quadrado'
  children: ReactNode
  part?: string
  removable?: boolean
  color?: string
  style?: CSSProperties
}) {
  const { L } = usePv()
  const P = usePart()
  let { fg, bg } = toneColors(L, tone)
  if (color && isHex(color)) {
    const c = normalizeHex(color)
    fg = ensureContrast(c, L.surfaceSolid, 4.5)
    bg = withAlpha(c, 0.16)
  }
  const radius = shape === 'pilula' ? 999 : shape === 'quadrado' ? Math.min(4, L.rSm) : L.r >= 999 ? 999 : Math.min(L.r, 8)
  const brut = L.style.shadow === 'hard'
  const v: CSSProperties =
    variant === 'solid'
      ? { background: tone === 'neutral' ? L.muted : fg, color: readableOn(tone === 'neutral' ? L.muted : fg) }
      : variant === 'outline'
        ? { background: 'transparent', color: fg, border: `1px solid ${fg}` }
        : variant === 'dot'
          ? { background: 'transparent', color: L.text, border: `1px solid ${L.dark ? withAlpha(L.text, 0.18) : L.border}` }
          : { background: bg, color: fg }
  return (
    <span
      {...P(part)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: 24,
        padding: '0 9px',
        borderRadius: radius,
        fontFamily: L.labelFont,
        fontSize: L.upper ? 11 : 12,
        fontWeight: 620,
        letterSpacing: L.upper ? '0.05em' : 0,
        textTransform: L.upper ? 'uppercase' : 'none',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        border: brut ? `1.5px solid ${L.text}` : undefined,
        flex: 'none',
        ...v,
        ...style,
      }}
    >
      {variant === 'dot' && <span style={{ width: 7, height: 7, borderRadius: 99, background: fg }} />}
      {children}
      {removable && <Ico name="X" size={12} />}
    </span>
  )
}

export function Toggle({ on, st, size = 'md', part }: { on: boolean; st?: PreviewState; size?: 'sm' | 'md' | 'lg'; part?: string }) {
  const { L } = usePv()
  const P = usePart()
  const [w, h] = size === 'sm' ? [32, 18] : size === 'lg' ? [50, 28] : [40, 23]
  const round = L.r >= 6 ? 999 : L.r
  const ink = L.style.borderTone === 'ink'
  const pad = 3
  const k = h - pad * 2 - (ink ? 2 : 0)
  let track: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: w,
    height: h,
    flex: 'none',
    borderRadius: round,
    background: on ? L.trackOn : L.trackOff,
    border: ink ? `${Math.min(L.bw, 2)}px solid ${L.text}` : L.style.surface === 'glass' ? `1px solid ${withAlpha('#ffffff', 0.8)}` : undefined,
    boxShadow: L.style.surface === 'neu' ? L.inset : undefined,
    boxSizing: 'border-box',
    transition: 'background .15s',
  }
  track = withState(L, track, st, 'plain')
  const thumbBg = ink && !on ? L.text : L.thumb
  return (
    <span {...P(part)} role="switch" aria-checked={on} style={track}>
      <span
        style={{
          position: 'absolute',
          top: ink ? pad - 1 : pad,
          left: on ? w - k - pad - (ink ? 2 : 0) : ink ? pad - 1 : pad,
          width: k,
          height: k,
          borderRadius: round,
          background: L.style.surface === 'neu' && !on ? L.surfaceSolid : thumbBg,
          boxShadow: L.style.surface === 'neu' ? `2px 2px 5px ${withAlpha('#000000', 0.18)}` : L.style.shadow === 'none' || ink ? 'none' : '0 1px 3px rgba(0,0,0,.25)',
          transition: 'left .15s',
        }}
      />
    </span>
  )
}

export function Check({ on, mixed, round, st, size = 18, part }: { on: boolean; mixed?: boolean; round?: boolean; st?: PreviewState; size?: number; part?: string }) {
  const { L } = usePv()
  const P = usePart()
  const filled = on || mixed
  const bwid = L.style.borderTone === 'ink' ? Math.min(Math.max(L.bw, 1.5), 2.5) : 1.5
  const onBg = L.style.fill === 'gradient' || L.style.fill === 'aurora' || L.style.fill === 'metal' ? L.fill : L.trackOn
  let box: CSSProperties = {
    width: size,
    height: size,
    flex: 'none',
    display: 'inline-grid',
    placeItems: 'center',
    boxSizing: 'border-box',
    borderRadius: round ? '50%' : L.r >= 999 ? 6 : Math.min(L.rSm, 6),
    border: `${bwid}px solid ${filled && !round ? 'transparent' : filled ? L.trackOn : L.style.borderTone === 'ink' ? L.text : L.borderStrong}`,
    background: filled && !round ? onBg : L.style.surface === 'neu' ? L.surfaceSolid : L.dark ? 'transparent' : L.style.surface === 'glass' ? withAlpha('#ffffff', 0.6) : typeof L.card.background === 'string' ? L.surfaceSolid : '#fff',
    boxShadow: L.style.surface === 'neu' ? (filled ? L.btnShadow : L.inset) : undefined,
  }
  box = withState(L, box, st, 'plain')
  const fg = L.style.fill === 'ivory' || L.style.fill === 'metal' ? L.bg : readableOn(L.trackOn)
  return (
    <span {...P(part)} style={box} aria-hidden="true">
      {round && on && <span style={{ width: size * 0.45, height: size * 0.45, borderRadius: '50%', background: onBg }} />}
      {!round && mixed && <span style={{ width: size * 0.5, height: 2, background: fg, borderRadius: 2 }} />}
      {!round && on && !mixed && <Ico name="Check" size={Math.round(size * 0.72)} color={fg} />}
    </span>
  )
}

export function Avatar({ name, size = 36, index = 0, status, shape = 'circulo', kind = 'iniciais', color, ring, part }: { name: string; size?: number; index?: number; status?: 'online' | 'ausente' | 'ocupado' | 'nenhum'; shape?: 'circulo' | 'quadrado'; kind?: 'iniciais' | 'ilustracao' | 'icone'; color?: string; ring?: boolean; part?: string }) {
  const { L } = usePv()
  const P = usePart()
  const c = color && isHex(color) ? { bg: normalizeHex(color), fg: readableOn(normalizeHex(color)) } : L.cycle[index % L.cycle.length]
  const radius = shape === 'quadrado' ? Math.round(Math.min(L.rLg * 0.6, size * 0.3)) : '50%'
  const statusColor = status === 'online' ? L.success : status === 'ausente' ? L.warning : status === 'ocupado' ? L.error : null
  return (
    <span {...P(part)} style={{ position: 'relative', display: 'inline-flex', flex: 'none', width: size, height: size }}>
      <span
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: kind === 'ilustracao' ? mix(c.bg, '#ffffff', 0.75) : c.bg,
          color: c.fg,
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          fontFamily: L.headingFont,
          fontWeight: 650,
          fontSize: Math.max(11.5, Math.round(size * 0.38)),
          boxShadow: ring ? `0 0 0 2px ${L.surfaceSolid}` : undefined,
          border: L.style.shadow === 'hard' ? `2px solid ${L.text}` : L.style.surface === 'midnight' ? `1px solid ${withAlpha(L.metal, 0.6)}` : undefined,
          boxSizing: 'border-box',
        }}
      >
        {kind === 'iniciais' && initials(name)}
        {kind === 'icone' && <Ico name="User" size={Math.round(size * 0.5)} />}
        {kind === 'ilustracao' && (
          <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
            <circle cx="20" cy="16" r="7.5" fill={c.bg} />
            <path d="M6 40c1.5-9 7.5-13.5 14-13.5S32.5 31 34 40z" fill={c.bg} />
          </svg>
        )}
      </span>
      {statusColor && <span style={{ position: 'absolute', right: -1, bottom: -1, width: Math.max(9, size * 0.26), height: Math.max(9, size * 0.26), borderRadius: 99, background: statusColor, border: `2px solid ${L.surfaceSolid}` }} />}
    </span>
  )
}

export function Bar({ value, height = 8, striped, color }: { value: number; height?: number; striped?: boolean; color?: string }) {
  const { L } = usePv()
  const round = L.r >= 6 ? 999 : L.r
  const fillBg = color ?? (L.style.fill === 'solid' || L.style.fill === 'press' || L.style.fill === 'ivory' ? L.trackOn : L.fill)
  return (
    <span style={{ display: 'block', width: '100%', height, borderRadius: round, background: L.trackOff, boxShadow: L.style.surface === 'neu' ? L.inset : undefined, overflow: 'hidden', border: L.style.shadow === 'hard' ? `1.5px solid ${L.text}` : undefined, boxSizing: 'border-box' }}>
      <span
        className={striped ? 'cmp-stripes' : undefined}
        style={{ display: 'block', height: '100%', width: `${Math.max(0, Math.min(100, value))}%`, borderRadius: round, background: striped ? `repeating-linear-gradient(45deg, ${withAlpha('#ffffff', 0.28)} 0 6px, transparent 6px 12px), ${fillBg}` : fillBg, transition: 'width .3s' }}
      />
    </span>
  )
}

export function Skel({ w = '100%', h = 12, r, style }: { w?: number | string; h?: number; r?: number | string; style?: CSSProperties }) {
  const { L } = usePv()
  return <span className="cmp-skel" style={{ display: 'block', width: w, height: h, borderRadius: r ?? Math.min(L.rSm, 8), background: L.dark ? withAlpha(L.text, 0.1) : mix(L.surfaceSolid, L.text, 0.08), ...style }} />
}

export function Kbd({ children }: { children: ReactNode }) {
  const { L } = usePv()
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 6px', borderRadius: Math.min(5, L.rSm || 3), border: `1px solid ${L.dark ? withAlpha(L.text, 0.2) : L.border}`, fontFamily: L.mono, fontSize: 11, color: L.muted, flex: 'none', background: L.dark ? withAlpha('#ffffff', 0.04) : 'transparent' }}>
      {children}
    </span>
  )
}

export function Spinner({ size = 20, color }: { size?: number; color?: string }) {
  const { L } = usePv()
  return (
    <svg className="cmp-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx="12" cy="12" r="9" stroke={withAlpha(L.text, 0.15)} strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke={color ?? L.primary} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Navegação: item ativo conforme a família                                    */
/* -------------------------------------------------------------------------- */

export function navItemStyle(L: Look, active: boolean, orientation: 'h' | 'v' = 'v'): CSSProperties {
  const base: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    padding: orientation === 'v' ? `0 ${Math.round(L.pad * 0.75)}px` : `0 ${Math.round(L.pad * 0.8)}px`,
    height: Math.max(30, Math.round(L.h * 0.86)),
    borderRadius: L.r >= 999 ? 999 : Math.min(L.r, 12),
    fontFamily: L.familyId === 'retro-paper' ? L.labelFont : L.font,
    fontSize: L.upper ? 11.5 : Math.max(12.5, L.fs - 0.5),
    fontWeight: active ? Math.max(L.uw, 600) : 500,
    letterSpacing: L.upper ? L.track : 0,
    textTransform: L.upper ? 'uppercase' : 'none',
    color: L.muted,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    flex: 'none',
    cursor: 'pointer',
  }
  if (!active) return base
  const ind = L.style.indicator
  const glowC = L.dark ? L.accent : L.primary
  switch (ind) {
    case 'pill':
      return { ...base, color: L.onSoft, background: L.style.surface === 'glass' ? withAlpha('#ffffff', 0.72) : L.style.surface === 'plain' && L.style.field === 'tonal' && L.r < 999 ? L.surfaceSolid : L.soft, boxShadow: L.style.surface === 'glass' || (L.r < 999 && L.style.field === 'tonal') ? L.shadow : undefined }
    case 'underline': {
      const c = L.dark ? L.accent : L.style.borderTone === 'ink' ? L.text : L.primary
      return { ...base, color: L.text, borderRadius: 0, boxShadow: orientation === 'h' ? `inset 0 -2px 0 ${c}` : `inset 2px 0 0 ${c}` }
    }
    case 'bar':
      return { ...base, color: L.text, background: L.rowHover, borderRadius: Math.min(L.r, 2), boxShadow: orientation === 'h' ? `inset 0 -3px 0 ${L.accent}` : `inset 3px 0 0 ${L.accent}` }
    case 'block':
      if (L.style.shadow === 'press') return { ...base, color: L.cycle[0].fg, background: L.cycle[0].bg, boxShadow: `0 3px 0 ${darken(L.cycle[0].bg, 0.32)}` }
      return { ...base, color: L.bg, background: L.text, borderRadius: Math.min(L.r, 4) }
    case 'inset':
      return { ...base, color: L.primary, boxShadow: L.inset }
    case 'glow':
      return { ...base, color: L.dark ? L.text : L.onSoft, background: L.dark ? withAlpha(L.accent, 0.16) : L.soft, boxShadow: `0 0 18px ${withAlpha(glowC, 0.32)}, inset 0 0 0 1px ${withAlpha(glowC, 0.3)}` }
    case 'tonal':
      return { ...base, color: L.onSoft, background: L.soft }
  }
}
