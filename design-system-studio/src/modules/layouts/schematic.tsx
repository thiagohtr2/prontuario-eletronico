import { memo, useMemo, type CSSProperties, type ReactNode } from 'react'
import { isDark, isHex, mix, withAlpha } from '@/core/color'
import type { ResolvedTheme } from '@/core/types'
import { computeGeometry, scaleCss, type Edges, type Rect } from './geometry'
import { REGION_LEGEND, type DesktopLayout, type LayoutRegion, type RegionKind } from './types'
import './layouts.css'

/* -------------------------------------------------------------------------- */
/* Tipos públicos                                                              */
/* -------------------------------------------------------------------------- */

/** Informações entregues a `renderRegion`: escala do desenho e tamanho real da região em px. */
export interface RegionSize {
  scale: number
  width: number
  height: number
}

export interface DesktopSchematicProps {
  layout: DesktopLayout
  /** Largura em px em que o desenho é renderizado (as medidas do grid são escaladas a partir de 1280). */
  width: number
  /** Altura em px (padrão: proporção 16:10). */
  height?: number
  showLegends: boolean
  /** Tema opcional; sem tema, usa a estética neutra de esquema. */
  theme?: ResolvedTheme
  /**
   * Permite à Live Preview preencher cada região com conteúdo real. Devolva `null`/`undefined`
   * para manter o desenho padrão naquela região.
   */
  renderRegion?: (region: LayoutRegion, size: RegionSize) => ReactNode
  /** Nível de detalhe: 'auto' (padrão) usa miniatura abaixo de 420 px. */
  detail?: 'auto' | 'thumb' | 'full'
  /** Borda e cantos arredondados em volta do canvas (padrão: true). */
  frame?: boolean
  className?: string
}

/* -------------------------------------------------------------------------- */
/* Paleta                                                                      */
/* -------------------------------------------------------------------------- */

type Tone =
  | 'canvas'
  | 'surface'
  | 'nav'
  | 'nav-alt'
  | 'nav-line'
  | 'nav-strong'
  | 'nav-active'
  | 'nav-active-line'
  | 'border'
  | 'line'
  | 'strong'
  | 'card'
  | 'card-border'
  | 'accent'
  | 'accent-soft'
  | 'on-accent'
  | 'media'
  | 'media-2'
  | 'dark'
  | 'dark-2'
  | 'dark-3'
  | 'success'
  | 'success-soft'
  | 'warning'
  | 'error'
  | 'error-soft'
  | 'white'

type Palette = Record<Exclude<Tone, 'white'>, string>

const NEUTRAL: Palette = {
  canvas: '#f3f4f7',
  surface: '#ffffff',
  nav: '#ffffff',
  'nav-alt': '#fafafc',
  'nav-line': '#dcdfe5',
  'nav-strong': '#bcc1cb',
  'nav-active': '#eceafd',
  'nav-active-line': '#6c66e3',
  border: '#e2e4e9',
  line: '#e3e5ea',
  strong: '#c4c8d1',
  card: '#ffffff',
  'card-border': '#e5e7ec',
  accent: '#6c66e3',
  'accent-soft': '#eceafd',
  'on-accent': '#ffffff',
  media: '#e6e8f1',
  'media-2': '#cfd4e2',
  dark: '#363b48',
  'dark-2': '#575e6d',
  'dark-3': '#868d9c',
  success: '#34a874',
  'success-soft': '#e3f4ec',
  warning: '#e0a23a',
  error: '#df6159',
  'error-soft': '#fbe9e8',
}

const alpha = (c: string, a: number) => (isHex(c) ? withAlpha(c, a) : c)
const blend = (a: string, b: string, t: number) => (isHex(a) && isHex(b) ? mix(a, b, t) : a)

function themePalette(theme: ResolvedTheme): Palette {
  const t = theme.tokens
  const navDark = isHex(t.navBg) && isDark(t.navBg)
  return {
    canvas: t.bg,
    surface: t.surface,
    nav: t.navBg,
    'nav-alt': blend(t.navBg, navDark ? '#ffffff' : t.text, navDark ? 0.05 : 0.025),
    'nav-line': alpha(t.navText, 0.26),
    'nav-strong': alpha(t.navText, 0.5),
    'nav-active': t.navActive,
    'nav-active-line': t.navActiveText,
    border: t.border,
    line: alpha(t.text, 0.11),
    strong: alpha(t.text, 0.3),
    card: t.surface,
    'card-border': t.border,
    accent: t.primary,
    'accent-soft': t.primarySoft,
    'on-accent': t.onPrimary,
    media: blend(t.primary, t.surface, 0.84),
    'media-2': blend(t.primary, t.surface, 0.64),
    dark: blend(t.text, t.primary, 0.22),
    'dark-2': blend(t.text, t.primary, 0.42),
    'dark-3': blend(t.primary, t.surface, 0.35),
    success: t.success,
    'success-soft': t.successBg,
    warning: t.warning,
    error: t.error,
    'error-soft': t.errorBg,
  }
}

const tone = (t: Tone) => (t === 'white' ? 'rgba(255,255,255,.88)' : `var(--ds-${t})`)

/* -------------------------------------------------------------------------- */
/* Contexto de desenho                                                         */
/* -------------------------------------------------------------------------- */

interface Ctx {
  s: number
  full: boolean
  /** Converte px de referência (1280) em px reais, com mínimo opcional. */
  k: (n: number, min?: number) => number
  rect: Rect
  /** Tamanho da região em px de referência. */
  ref: { w: number; h: number }
  region: LayoutRegion
  layout: DesktopLayout
  /** Região encostada no topo do canvas. */
  top: boolean
  /** Região encostada na borda esquerda do canvas. */
  left: boolean
  /** O layout tem navegação lateral (sidebar/rail/submenu) que já mostra o logo. */
  sideLogo: boolean
  radius: number
}

const bar = (c: Ctx, w: number | string, h = 8, t: Tone = 'line', extra?: CSSProperties): CSSProperties => ({
  width: typeof w === 'number' ? c.k(w, 2) : w,
  height: c.k(h, 2),
  background: tone(t),
  borderRadius: 999,
  flex: 'none',
  ...extra,
})

const dot = (c: Ctx, d: number, t: Tone = 'line', extra?: CSSProperties): CSSProperties => ({
  width: c.k(d, 3),
  height: c.k(d, 3),
  background: tone(t),
  borderRadius: 999,
  flex: 'none',
  ...extra,
})

const sq = (c: Ctx, d: number, t: Tone = 'line', r = 5, extra?: CSSProperties): CSSProperties => ({
  width: c.k(d, 3),
  height: c.k(d, 3),
  background: tone(t),
  borderRadius: c.k(r, 1),
  flex: 'none',
  ...extra,
})

const card = (c: Ctx, extra?: CSSProperties): CSSProperties => ({
  background: tone('card'),
  border: `1px solid ${tone('card-border')}`,
  borderRadius: c.k(c.radius, 2),
  padding: c.k(14, 2),
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: c.k(8, 1),
  ...extra,
})

const pill = (c: Ctx, w: number | string, h: number, t: Tone, outline = false): CSSProperties => ({
  width: typeof w === 'number' ? c.k(w, 4) : w,
  height: c.k(h, 3),
  borderRadius: 999,
  flex: 'none',
  background: outline ? 'transparent' : tone(t),
  border: outline ? `1px solid ${tone(t)}` : undefined,
})

const col = (c: Ctx, gap: number, extra?: CSSProperties): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap: c.k(gap, 1),
  minWidth: 0,
  minHeight: 0,
  ...extra,
})

const row = (c: Ctx, gap: number, extra?: CSSProperties): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: c.k(gap, 1),
  minWidth: 0,
  ...extra,
})

const B = ({ s }: { s: CSSProperties }) => <i className="lay-ds-b" style={s} />

const range = (n: number) => Array.from({ length: Math.max(0, n) }, (_, i) => i)
const W = [72, 58, 84, 64, 76, 52, 68, 80, 60]

function Spark({ c, area = false, t = 'accent', points }: { c: Ctx; area?: boolean; t?: Tone; points?: string }) {
  const pts = points ?? '0,30 12,24 24,27 36,16 48,19 60,10 72,14 84,6 100,9'
  return (
    <svg className="lay-ds-svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      {area && <polygon points={`0,40 ${pts} 100,40`} fill={tone('accent-soft')} />}
      <polyline points={pts} fill="none" stroke={tone(t)} strokeWidth={c.k(2.4, 1.1)} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function Bars({ c, n = 7, t = 'accent' }: { c: Ctx; n?: number; t?: Tone }) {
  const hs = [46, 70, 54, 88, 62, 78, 40, 66, 92, 58]
  return (
    <div style={{ ...row(c, 6), alignItems: 'flex-end', flex: 1, minHeight: 0, height: '100%' }}>
      {range(n).map((i) => (
        <i key={i} className="lay-ds-b" style={{ flex: 1, height: `${hs[i % hs.length]}%`, background: tone(i === 3 ? t : 'media-2'), borderRadius: c.k(3, 1) }} />
      ))}
    </div>
  )
}

function Ring({ c, d, pct = 68 }: { c: Ctx; d: number; pct?: number }) {
  const size = c.k(d, 8)
  return (
    <div
      className="lay-ds-b"
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: 999,
        background: `conic-gradient(${tone('accent')} 0 ${pct}%, ${tone('media')} 0)`,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <i className="lay-ds-b" style={{ width: '64%', height: '64%', borderRadius: 999, background: tone('card') }} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Desenhos por tipo de região                                                 */
/* -------------------------------------------------------------------------- */

const NO_SIDEBAR_FAMILIES = new Set(['sem-sidebar', 'editorial'])

function Header({ c }: { c: Ctx }) {
  const overlayDark = c.region.fill === 'transparent' && Boolean(c.region.overlay)
  const transparentPage = c.region.fill === 'transparent' && !c.region.overlay
  const links = NO_SIDEBAR_FAMILIES.has(c.layout.family) || Boolean(c.region.overlay)
  const logo = (c.left && !c.sideLogo) || Boolean(c.region.overlay)
  const pad = c.k(c.region.floating ? 18 : 22, 3)
  const lt: Tone = overlayDark ? 'white' : 'strong'

  if (transparentPage) {
    return (
      <div style={{ ...row(c, 14), height: '100%', padding: `0 ${c.k(6, 1)}px` }}>
        <div style={col(c, 6)}>
          {c.full && <B s={bar(c, 70, 6, 'line')} />}
          <B s={bar(c, 150, 12, 'strong')} />
        </div>
        <span style={{ flex: 1 }} />
        <B s={pill(c, 88, 30, 'strong', true)} />
        <B s={pill(c, 96, 30, 'accent')} />
      </div>
    )
  }

  return (
    <div style={{ ...row(c, 18), height: '100%', padding: `0 ${pad}px` }}>
      {logo ? (
        <div style={row(c, 10)}>
          <B s={dot(c, 22, overlayDark ? 'white' : 'accent')} />
          <B s={bar(c, 78, 10, lt)} />
        </div>
      ) : (
        <B s={bar(c, 120, 11, 'strong')} />
      )}
      {links && (
        <div style={{ ...row(c, 20), marginLeft: c.k(c.region.overlay ? 8 : 26) }}>
          {[58, 66, 50, 62].slice(0, c.region.overlay && !overlayDark ? 3 : 4).map((w, i) => (
            <B key={i} s={bar(c, w, 8, overlayDark ? 'white' : i === 0 ? 'accent' : 'strong')} />
          ))}
        </div>
      )}
      <span style={{ flex: 1 }} />
      {!links && (
        <div
          className="lay-ds-b"
          style={{
            ...row(c, 8),
            width: '30%',
            maxWidth: c.k(340),
            height: c.k(30, 5),
            border: `1px solid ${tone('border')}`,
            borderRadius: c.k(8, 2),
            padding: `0 ${c.k(10, 2)}px`,
            flex: 'none',
          }}
        >
          <B s={dot(c, 10, 'strong')} />
          {c.full && <B s={bar(c, '45%', 6, 'line')} />}
        </div>
      )}
      {links ? (
        overlayDark ? (
          <B s={pill(c, 86, 28, 'white', true)} />
        ) : (
          <B s={pill(c, 96, 30, 'accent')} />
        )
      ) : (
        <div style={row(c, 12)}>
          <B s={dot(c, 18, 'line')} />
          <B s={dot(c, 28, 'media-2')} />
        </div>
      )}
    </div>
  )
}

function Sidebar({ c }: { c: Ctx }) {
  const wide = c.ref.w >= 270
  const logoH = c.top ? 52 : 0
  const avatar = c.ref.h > 430
  const avail = c.ref.h - 28 - logoH - (avatar ? 60 : 0) - (wide ? 48 : 0)
  const g1 = Math.max(2, Math.min(6, Math.floor((avail - 24) / 40)))
  const g2 = Math.max(0, Math.min(3, Math.floor((avail - 24 - g1 * 40 - 34) / 40)))
  const item = (i: number, active: boolean, key: string) => (
    <div
      key={key}
      style={{
        ...row(c, 10),
        height: c.k(36, 6),
        padding: `0 ${c.k(10, 2)}px`,
        borderRadius: c.k(8, 2),
        background: active ? tone('nav-active') : 'transparent',
        flex: 'none',
      }}
    >
      <B s={sq(c, 16, active ? 'nav-active-line' : 'nav-strong', 4)} />
      <B s={bar(c, W[i % W.length], 8, active ? 'nav-active-line' : 'nav-strong')} />
    </div>
  )
  return (
    <div style={{ ...col(c, 4), height: '100%', padding: c.k(12, 2) }}>
      {c.top && (
        <div style={{ ...row(c, 10), height: c.k(40, 6), padding: `0 ${c.k(8, 1)}px`, marginBottom: c.k(12, 1), flex: 'none' }}>
          <B s={sq(c, 24, 'accent', 7)} />
          <B s={bar(c, 84, 10, 'strong')} />
        </div>
      )}
      {wide && (
        <div
          className="lay-ds-b"
          style={{ ...row(c, 8), height: c.k(34, 5), border: `1px solid ${tone('border')}`, borderRadius: c.k(8, 2), padding: `0 ${c.k(10, 2)}px`, marginBottom: c.k(12, 1), flex: 'none' }}
        >
          <B s={dot(c, 10, 'nav-strong')} />
          <B s={bar(c, '40%', 6, 'nav-line')} />
        </div>
      )}
      {c.full && <B s={bar(c, 46, 6, 'nav-line', { margin: `${c.k(4)}px ${c.k(10)}px ${c.k(6)}px` })} />}
      {range(g1).map((i) => item(i, i === 1, `a${i}`))}
      {g2 > 0 && <B s={bar(c, 40, 6, 'nav-line', { margin: `${c.k(16)}px ${c.k(10)}px ${c.k(6)}px` })} />}
      {range(g2).map((i) => item(i + 4, false, `b${i}`))}
      <span style={{ flex: 1 }} />
      {avatar && (
        <div style={{ ...row(c, 10), padding: `${c.k(10)}px ${c.k(8)}px`, borderTop: `1px solid ${tone('border')}`, flex: 'none' }}>
          <B s={dot(c, 30, 'media-2')} />
          <div style={col(c, 6)}>
            <B s={bar(c, 76, 7, 'nav-strong')} />
            {c.full && <B s={bar(c, 54, 6, 'nav-line')} />}
          </div>
        </div>
      )}
    </div>
  )
}

function Rail({ c }: { c: Ctx }) {
  const avail = c.ref.h - 24 - (c.top ? 60 : 0) - 56
  const n = Math.max(2, Math.min(6, Math.floor(avail / 54)))
  return (
    <div style={{ ...col(c, 10), height: '100%', alignItems: 'center', padding: `${c.k(14, 2)}px 0` }}>
      {c.top && <B s={sq(c, 34, 'accent', 10, { marginBottom: c.k(14) })} />}
      {range(n).map((i) => (
        <div
          key={i}
          style={{ width: c.k(44, 6), height: c.k(44, 6), display: 'grid', placeItems: 'center', borderRadius: c.k(12, 2), background: i === 1 ? tone('nav-active') : 'transparent', flex: 'none' }}
        >
          <B s={sq(c, 20, i === 1 ? 'nav-active-line' : 'nav-strong', 5)} />
        </div>
      ))}
      <span style={{ flex: 1 }} />
      {c.ref.h > 360 && <B s={dot(c, 30, 'media-2')} />}
    </div>
  )
}

function Submenu({ c }: { c: Ctx }) {
  const horizontal = c.ref.w > c.ref.h * 3
  if (horizontal) {
    return (
      <div style={{ ...row(c, 30), height: '100%', padding: `0 ${c.k(28, 3)}px`, overflow: 'hidden' }}>
        {[64, 82, 58, 74, 66, 90, 54, 70, 62].map((w, i) => (
          <div key={i} style={{ ...col(c, 0), position: 'relative', height: '100%', justifyContent: 'center' }}>
            <B s={bar(c, w, 8, i === 1 ? 'accent' : 'nav-strong')} />
            {i === 1 && <B s={bar(c, '100%', 3, 'accent', { position: 'absolute', left: 0, bottom: 0, borderRadius: 2 })} />}
          </div>
        ))}
      </div>
    )
  }
  if (c.region.fill === 'filters') return <Filters c={c} />
  if (c.region.fill === 'index') {
    return (
      <div style={{ ...col(c, 4), height: '100%', padding: `${c.k(28, 3)}px ${c.k(20, 2)}px` }}>
        <B s={bar(c, 90, 7, 'nav-strong', { marginBottom: c.k(12) })} />
        {range(9).map((i) => (
          <div
            key={i}
            style={{
              ...row(c, 0),
              height: c.k(30, 5),
              paddingLeft: c.k(i % 3 === 2 ? 26 : 12, 2),
              borderLeft: `${c.k(2, 1)}px solid ${tone(i === 2 ? 'accent' : 'nav-line')}`,
              flex: 'none',
            }}
          >
            <B s={bar(c, W[(i + 2) % W.length] + 30, 7, i === 2 ? 'accent' : 'nav-strong')} />
          </div>
        ))}
      </div>
    )
  }
  const avail = c.ref.h - 24 - (c.top ? 52 : 0)
  const n = Math.max(3, Math.min(9, Math.floor(avail / 38)))
  return (
    <div style={{ ...col(c, 3), height: '100%', padding: c.k(12, 2) }}>
      <div style={{ ...row(c, 8), height: c.k(40, 6), padding: `0 ${c.k(8)}px`, marginBottom: c.k(12, 1), flex: 'none' }}>
        <B s={bar(c, 104, 11, 'strong')} />
        <span style={{ flex: 1 }} />
        <B s={sq(c, 14, 'nav-line', 4)} />
      </div>
      {range(n).map((i) =>
        i === 4 ? (
          <B key={i} s={bar(c, 44, 6, 'nav-line', { margin: `${c.k(14)}px ${c.k(10)}px ${c.k(6)}px` })} />
        ) : (
          <div
            key={i}
            style={{ ...row(c, 8), height: c.k(34, 5), padding: `0 ${c.k(10, 2)}px`, borderRadius: c.k(8, 2), background: i === 2 ? tone('nav-active') : 'transparent', flex: 'none' }}
          >
            <B s={bar(c, W[(i + 3) % W.length] + 20, 8, i === 2 ? 'nav-active-line' : 'nav-strong')} />
          </div>
        ),
      )}
    </div>
  )
}

function Filters({ c }: { c: Ctx }) {
  if (c.ref.w > c.ref.h * 3) {
    return (
      <div style={{ ...row(c, 10), height: '100%', padding: `0 ${c.k(24, 3)}px` }}>
        {[96, 80, 108, 72].map((w, i) => (
          <div
            key={i}
            className="lay-ds-b"
            style={{
              ...row(c, 6),
              height: c.k(28, 5),
              padding: `0 ${c.k(12, 2)}px`,
              borderRadius: 999,
              border: `1px solid ${tone(i === 0 ? 'accent' : 'border')}`,
              background: i === 0 ? tone('accent-soft') : 'transparent',
              flex: 'none',
            }}
          >
            <B s={bar(c, w - 30, 7, i === 0 ? 'accent' : 'strong')} />
          </div>
        ))}
        <span style={{ flex: 1 }} />
        <B s={pill(c, 120, 30, 'border', true)} />
        <B s={sq(c, 30, 'line', 8)} />
      </div>
    )
  }
  return (
    <div style={{ ...col(c, 10), height: '100%', padding: c.k(16, 2) }}>
      <div className="lay-ds-b" style={{ ...row(c, 8), height: c.k(34, 5), border: `1px solid ${tone('border')}`, borderRadius: c.k(8, 2), padding: `0 ${c.k(10)}px`, flex: 'none' }}>
        <B s={dot(c, 10, 'nav-strong')} />
        <B s={bar(c, '40%', 6, 'nav-line')} />
      </div>
      {range(3).map((g) => (
        <div key={g} style={col(c, 8)}>
          <B s={bar(c, 60, 7, 'nav-strong', { marginTop: c.k(8) })} />
          {range(3).map((i) => (
            <div key={i} style={row(c, 8)}>
              <B s={sq(c, 14, g === 0 && i === 0 ? 'accent' : 'nav-line', 3)} />
              <B s={bar(c, W[(i + g) % W.length] + 10, 7, 'nav-strong')} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function Panel({ c }: { c: Ctx }) {
  const f = c.region.fill ?? (c.region.kind === 'detail' ? 'props' : c.region.kind === 'chat' ? 'chat' : 'stats')
  const pad = c.k(18, 2)
  const title = (
    <div style={{ ...row(c, 8), flex: 'none' }}>
      <B s={bar(c, 110, 11, 'strong')} />
      <span style={{ flex: 1 }} />
      <B s={dot(c, 14, 'line')} />
    </div>
  )
  switch (f) {
    case 'props':
      return (
        <div style={{ ...col(c, 12), height: '100%', padding: pad }}>
          {title}
          {range(3).map((g) => (
            <div key={g} style={{ ...col(c, 10), paddingTop: c.k(10), borderTop: g ? `1px solid ${tone('border')}` : undefined }}>
              <B s={bar(c, 64, 6, 'strong')} />
              {range(g === 1 ? 2 : 3).map((i) => (
                <div key={i} style={{ ...row(c, 10), justifyContent: 'space-between' }}>
                  <B s={bar(c, '32%', 7, 'line')} />
                  <div className="lay-ds-b" style={{ ...row(c, 6), width: '52%', height: c.k(26, 4), border: `1px solid ${tone('border')}`, borderRadius: c.k(6, 2), padding: `0 ${c.k(8)}px` }}>
                    {g === 1 && <B s={sq(c, 12, i ? 'media-2' : 'accent', 3)} />}
                    <B s={bar(c, '50%', 6, 'strong')} />
                  </div>
                </div>
              ))}
            </div>
          ))}
          <span style={{ flex: 1 }} />
          <B s={pill(c, '100%', 34, 'accent')} />
        </div>
      )
    case 'activity':
      return (
        <div style={{ ...col(c, 14), height: '100%', padding: pad }}>
          {title}
          <div style={{ ...col(c, 16), borderLeft: `${c.k(2, 1)}px solid ${tone('line')}`, marginLeft: c.k(5), paddingLeft: c.k(14) }}>
            {range(6).map((i) => (
              <div key={i} style={{ ...row(c, 10), alignItems: 'flex-start', position: 'relative' }}>
                <B s={dot(c, 10, i === 0 ? 'accent' : i === 2 ? 'error' : 'strong', { position: 'absolute', left: -c.k(20, 4), top: 0 })} />
                <div style={col(c, 6)}>
                  <B s={bar(c, W[i % W.length] + 60, 8, 'strong')} />
                  <B s={bar(c, W[(i + 3) % W.length] + 30, 6, 'line')} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    case 'list':
      return (
        <div style={{ ...col(c, 0), height: '100%' }}>
          <div style={{ padding: `${pad}px ${pad}px ${c.k(10)}px`, flex: 'none' }}>
            <div className="lay-ds-b" style={{ ...row(c, 8), height: c.k(32, 5), border: `1px solid ${tone('border')}`, borderRadius: c.k(8, 2), padding: `0 ${c.k(10)}px` }}>
              <B s={dot(c, 10, 'strong')} />
              <B s={bar(c, '35%', 6, 'line')} />
            </div>
          </div>
          {range(9).map((i) => (
            <div
              key={i}
              style={{
                ...row(c, 10),
                padding: `${c.k(10, 1)}px ${pad}px`,
                background: i === 1 && c.region.label === 'LISTA' ? tone('accent-soft') : 'transparent',
                borderBottom: `1px solid ${tone('border')}`,
                flex: 'none',
              }}
            >
              <B s={dot(c, 30, i % 3 === 0 ? 'media-2' : 'media')} />
              <div style={{ ...col(c, 6), flex: 1 }}>
                <B s={bar(c, '58%', 8, i === 1 && c.region.label === 'LISTA' ? 'accent' : 'strong')} />
                <B s={bar(c, '86%', 6, 'line')} />
              </div>
              {c.full && <B s={bar(c, 26, 6, 'line')} />}
            </div>
          ))}
        </div>
      )
    case 'console':
      return (
        <div style={{ ...col(c, 0), height: '100%' }}>
          <div style={{ ...row(c, 20), height: c.k(34, 5), padding: `0 ${pad}px`, borderBottom: `1px solid ${tone('border')}`, flex: 'none' }}>
            {[60, 52, 70].map((w, i) => (
              <B key={i} s={bar(c, w, 7, i === 0 ? 'accent' : 'strong')} />
            ))}
          </div>
          <div style={{ ...col(c, 9), padding: pad }}>
            {range(6).map((i) => (
              <div key={i} style={row(c, 12)}>
                <B s={bar(c, 14, 6, 'line')} />
                <B s={bar(c, W[i % W.length] * 3, 6, i === 2 ? 'success' : i === 4 ? 'error' : 'strong')} />
              </div>
            ))}
          </div>
        </div>
      )
    case 'kpis':
      return <Kpis c={c} />
    case 'filters':
      return <Filters c={c} />
    case 'chat':
      return <Chat c={c} />
    default:
      return (
        <div style={{ ...col(c, 14), height: '100%', padding: pad }}>
          {title}
          <div style={row(c, 10)}>
            {range(2).map((i) => (
              <div key={i} style={card(c, { flex: 1, padding: c.k(12, 2) })}>
                <B s={bar(c, '55%', 6, 'line')} />
                <B s={bar(c, '75%', 14, 'strong')} />
                <B s={bar(c, '35%', 6, i ? 'error' : 'success')} />
              </div>
            ))}
          </div>
          <div style={{ ...card(c), ...row(c, 14), flexDirection: 'row' }}>
            <Ring c={c} d={64} />
            <div style={{ ...col(c, 8), flex: 1 }}>
              {range(3).map((i) => (
                <div key={i} style={row(c, 6)}>
                  <B s={dot(c, 8, i === 0 ? 'accent' : 'media-2')} />
                  <B s={bar(c, '70%', 6, 'line')} />
                </div>
              ))}
            </div>
          </div>
          {range(5).map((i) => (
            <div key={i} style={row(c, 10)}>
              <B s={dot(c, 22, 'media')} />
              <div style={{ ...col(c, 5), flex: 1 }}>
                <B s={bar(c, '62%', 7, 'strong')} />
                <B s={bar(c, '40%', 6, 'line')} />
              </div>
            </div>
          ))}
        </div>
      )
  }
}

function Kpis({ c }: { c: Ctx }) {
  if (c.ref.h < 72) {
    // Faixa de contexto compacta (ex.: dados do paciente).
    return (
      <div style={{ ...row(c, 16), height: '100%', padding: `0 ${c.k(20, 2)}px` }}>
        <B s={dot(c, 28, 'media-2')} />
        <B s={bar(c, 130, 10, 'strong')} />
        <B s={bar(c, 54, 7, 'line')} />
        <B s={bar(c, 72, 7, 'line')} />
        <span style={{ flex: 1 }} />
        <div className="lay-ds-b" style={{ ...row(c, 6), height: c.k(24, 4), padding: `0 ${c.k(10)}px`, borderRadius: 999, background: tone('error-soft'), flex: 'none' }}>
          <B s={dot(c, 8, 'error')} />
          <B s={bar(c, 64, 6, 'error')} />
        </div>
        {c.full && (
          <div className="lay-ds-b" style={{ ...row(c, 6), height: c.k(24, 4), padding: `0 ${c.k(10)}px`, borderRadius: 999, border: `1px solid ${tone('border')}`, flex: 'none' }}>
            <B s={bar(c, 54, 6, 'strong')} />
          </div>
        )}
      </div>
    )
  }
  const n = c.ref.w > 820 ? 4 : 3
  return (
    <div style={{ ...row(c, 14), height: '100%', padding: `${c.k(16, 2)}px ${c.k(22, 2)}px`, alignItems: 'stretch' }}>
      {range(n).map((i) => (
        <div key={i} style={card(c, { flex: 1 })}>
          <B s={bar(c, '45%', 7, 'line')} />
          <B s={bar(c, '65%', 16, 'strong')} />
          <div style={{ ...row(c, 8), flex: 1, minHeight: 0 }}>
            <B s={bar(c, '22%', 6, i === 2 ? 'error' : 'success')} />
            <div style={{ flex: 1, height: '100%', minHeight: c.k(10, 3) }}>
              <Spark c={c} t={i === 2 ? 'error' : 'accent'} points={i % 2 ? '0,12 20,18 40,14 60,24 80,20 100,30' : undefined} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Chat({ c }: { c: Ctx }) {
  const pad = c.k(16, 2)
  return (
    <div style={{ ...col(c, 0), height: '100%' }}>
      <div style={{ ...row(c, 10), height: c.k(56, 8), padding: `0 ${pad}px`, borderBottom: `1px solid ${tone('border')}`, flex: 'none' }}>
        <B s={dot(c, 26, 'accent')} />
        <B s={bar(c, 96, 10, 'strong')} />
        <span style={{ flex: 1 }} />
        <B s={dot(c, 14, 'line')} />
      </div>
      <div style={{ ...col(c, 12), flex: 1, padding: pad, justifyContent: 'flex-end', overflow: 'hidden' }}>
        {[0, 1, 0, 1, 0].map((mine, i) => (
          <div
            key={i}
            className="lay-ds-b"
            style={{
              ...col(c, 6),
              alignSelf: mine ? 'flex-end' : 'flex-start',
              width: mine ? '62%' : '74%',
              padding: c.k(10, 2),
              borderRadius: c.k(12, 2),
              background: tone(mine ? 'accent-soft' : 'canvas'),
              flex: 'none',
            }}
          >
            <B s={bar(c, '90%', 6, mine ? 'accent' : 'strong')} />
            {i % 2 === 0 && <B s={bar(c, '60%', 6, 'line')} />}
          </div>
        ))}
      </div>
      <div style={{ padding: `0 ${pad}px ${pad}px`, flex: 'none' }}>
        <div className="lay-ds-b" style={{ ...row(c, 8), height: c.k(44, 6), border: `1px solid ${tone('border')}`, borderRadius: c.k(12, 2), padding: `0 ${c.k(8)}px 0 ${c.k(12)}px` }}>
          <B s={bar(c, '45%', 7, 'line')} />
          <span style={{ flex: 1 }} />
          <B s={dot(c, 28, 'accent')} />
        </div>
      </div>
    </div>
  )
}

function Toolbar({ c }: { c: Ctx }) {
  if (c.region.fill === 'kpis') return <Kpis c={c} />
  if (c.region.fill === 'filters') return <Filters c={c} />
  if (c.region.overlay) {
    return (
      <div style={{ ...row(c, 12), height: '100%', padding: `0 ${c.k(18, 2)}px` }}>
        <B s={dot(c, 16, 'strong')} />
        <B s={bar(c, '42%', 9, 'line')} />
        <span style={{ flex: 1 }} />
        <B s={sq(c, 24, 'line', 6)} />
        <B s={sq(c, 24, 'line', 6)} />
      </div>
    )
  }
  if (c.region.fill === 'tabs') {
    return (
      <div style={{ ...row(c, 12), height: '100%', padding: `0 ${c.k(20, 2)}px` }}>
        <B s={bar(c, 46, 7, 'line')} />
        <B s={bar(c, 6, 7, 'line')} />
        <B s={bar(c, 84, 8, 'strong')} />
        <i className="lay-ds-b" style={{ width: 1, height: '45%', background: tone('border'), margin: `0 ${c.k(8)}px` }} />
        {range(c.full ? 6 : 4).map((i) => (
          <B key={i} s={sq(c, 16, i === 1 ? 'accent' : 'strong', 4)} />
        ))}
        <span style={{ flex: 1 }} />
        <B s={dot(c, 22, 'media-2')} />
        <B s={pill(c, 92, 28, 'accent')} />
      </div>
    )
  }
  return (
    <div style={{ ...row(c, 12), height: '100%', padding: `0 ${c.k(32, 3)}px` }}>
      <div style={col(c, 8)}>
        {c.ref.h >= 64 && <B s={bar(c, 90, 6, 'line')} />}
        <B s={bar(c, 170, 13, 'strong')} />
      </div>
      <span style={{ flex: 1 }} />
      <B s={pill(c, 92, 30, 'strong', true)} />
      <B s={pill(c, 110, 30, 'accent')} />
    </div>
  )
}

function Footer({ c }: { c: Ctx }) {
  if (c.ref.h >= 56) {
    return (
      <div style={{ ...row(c, 16), height: '100%', padding: `0 ${c.k(32, 3)}px` }}>
        <div className="lay-ds-b" style={{ ...row(c, 8), height: c.k(30, 5), padding: `0 ${c.k(14)}px`, borderRadius: 999, background: tone('accent-soft'), flex: 'none' }}>
          <B s={dot(c, 10, 'accent')} />
          <B s={bar(c, 70, 8, 'accent')} />
        </div>
        <B s={bar(c, '45%', 10, 'line')} />
        <span style={{ flex: 1 }} />
        <B s={bar(c, 80, 10, 'strong')} />
      </div>
    )
  }
  return (
    <div style={{ ...row(c, 14), height: '100%', padding: `0 ${c.k(22, 2)}px` }}>
      <B s={dot(c, 8, 'success')} />
      <B s={bar(c, 96, 6, 'line')} />
      <span style={{ flex: 1 }} />
      {range(3).map((i) => (
        <B key={i} s={bar(c, 52, 6, 'line')} />
      ))}
    </div>
  )
}

/* ------------------------------- Conteúdos -------------------------------- */

function PageTitle({ c, actions = true }: { c: Ctx; actions?: boolean }) {
  return (
    <div style={{ ...row(c, 12), flex: 'none' }}>
      <div style={col(c, 8)}>
        <B s={bar(c, 190, 14, 'strong')} />
        {c.full && <B s={bar(c, 270, 7, 'line')} />}
      </div>
      <span style={{ flex: 1 }} />
      {actions && <B s={pill(c, 88, 30, 'strong', true)} />}
      {actions && <B s={pill(c, 100, 30, 'accent')} />}
    </div>
  )
}

function Content({ c }: { c: Ctx }) {
  const pad = c.k(c.region.floating ? 20 : 26, 3)
  const f = c.region.fill ?? 'cards'
  const wrap = (children: ReactNode, extra?: CSSProperties) => (
    <div style={{ ...col(c, 16), height: '100%', padding: pad, ...extra }}>{children}</div>
  )
  const maxW = (n: number): CSSProperties => ({ width: '100%', maxWidth: c.k(n), margin: '0 auto' })

  switch (f) {
    case 'dashboard': {
      const n = c.ref.w > 760 ? 4 : 3
      return wrap(
        <>
          <PageTitle c={c} />
          <div style={{ ...row(c, 14), alignItems: 'stretch', flex: 'none' }}>
            {range(n).map((i) => (
              <div key={i} style={card(c, { flex: 1 })}>
                <B s={bar(c, '48%', 7, 'line')} />
                <B s={bar(c, '62%', 16, 'strong')} />
                <B s={bar(c, '30%', 6, i === 2 ? 'error' : 'success')} />
              </div>
            ))}
          </div>
          <div style={{ ...row(c, 14), alignItems: 'stretch', flex: 'none', height: c.k(200, 20) }}>
            <div style={card(c, { flex: 2 })}>
              <div style={row(c, 10)}>
                <B s={bar(c, 120, 9, 'strong')} />
                <span style={{ flex: 1 }} />
                {c.full && <B s={bar(c, 60, 6, 'line')} />}
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <Spark c={c} area />
              </div>
            </div>
            {c.ref.w > 560 && (
              <div style={card(c, { flex: 1 })}>
                <B s={bar(c, 90, 9, 'strong')} />
                <Bars c={c} n={6} />
              </div>
            )}
          </div>
          <div style={card(c, { flex: 'none', gap: 0, padding: 0 })}>
            {range(5).map((i) => (
              <div key={i} style={{ ...row(c, 18), padding: `${c.k(11, 2)}px ${c.k(14, 2)}px`, borderTop: i ? `1px solid ${tone('border')}` : undefined }}>
                <B s={bar(c, '22%', i ? 7 : 6, i ? 'strong' : 'line')} />
                <B s={bar(c, '16%', 7, 'line')} />
                <B s={bar(c, '12%', 7, 'line')} />
                <span style={{ flex: 1 }} />
                <B s={bar(c, '8%', 7, i ? 'strong' : 'line')} />
              </div>
            ))}
          </div>
        </>,
      )
    }
    case 'cards': {
      const n = c.ref.w > 640 ? 3 : 2
      return wrap(
        <div style={{ ...col(c, 18), ...(c.layout.measurements.contentMax ? maxW(c.layout.measurements.contentMax) : {}) }}>
          <PageTitle c={c} />
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, gap: c.k(16, 2) }}>
            {range(n * 2).map((i) => (
              <div key={i} style={card(c, { padding: 0, gap: 0 })}>
                <i className="lay-ds-b" style={{ height: c.k(110, 12), background: tone(i % 3 === 1 ? 'media-2' : 'media') }} />
                <div style={{ ...col(c, 7), padding: c.k(12, 2) }}>
                  <B s={bar(c, '70%', 9, 'strong')} />
                  <B s={bar(c, '92%', 6, 'line')} />
                  {c.full && <B s={bar(c, '54%', 6, 'line')} />}
                </div>
              </div>
            ))}
          </div>
        </div>,
      )
    }
    case 'products': {
      const n = c.ref.w > 900 ? 5 : 4
      return wrap(
        <div style={{ ...col(c, 20), ...maxW(c.layout.measurements.contentMax ?? 1200) }}>
          <div className="lay-ds-b" style={{ ...row(c, 18), height: c.k(170, 20), borderRadius: c.k(c.radius + 4, 2), background: tone('media'), padding: `0 ${c.k(40, 4)}px`, flex: 'none' }}>
            <div style={col(c, 10)}>
              <B s={bar(c, 70, 7, 'accent')} />
              <B s={bar(c, 300, 22, 'strong')} />
              <B s={bar(c, 220, 22, 'strong')} />
              <B s={pill(c, 120, 34, 'accent', false)} />
            </div>
            <span style={{ flex: 1 }} />
            <B s={sq(c, 128, 'media-2', 16)} />
          </div>
          <div style={row(c, 10)}>
            <B s={bar(c, 160, 12, 'strong')} />
            <span style={{ flex: 1 }} />
            <B s={bar(c, 60, 7, 'accent')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, gap: c.k(16, 2) }}>
            {range(n * 2).map((i) => (
              <div key={i} style={col(c, 8)}>
                <i className="lay-ds-b" style={{ aspectRatio: '1', background: tone(i % 4 === 1 ? 'media-2' : 'media'), borderRadius: c.k(c.radius, 2) }} />
                <B s={bar(c, '82%', 8, 'strong')} />
                <B s={bar(c, '40%', 8, 'accent')} />
              </div>
            ))}
          </div>
        </div>,
      )
    }
    case 'table':
      return wrap(
        <div style={{ ...col(c, 16), ...(c.layout.measurements.contentMax ? maxW(c.layout.measurements.contentMax) : {}) }}>
          {c.layout.regions.some((r) => r.label === 'TÍTULO E AÇÕES') ? null : <PageTitle c={c} />}
          <div style={{ ...row(c, 10), flex: 'none' }}>
            <div className="lay-ds-b" style={{ ...row(c, 8), width: '32%', height: c.k(32, 5), border: `1px solid ${tone('border')}`, borderRadius: c.k(8, 2), padding: `0 ${c.k(10)}px` }}>
              <B s={dot(c, 10, 'strong')} />
              <B s={bar(c, '40%', 6, 'line')} />
            </div>
            {range(3).map((i) => (
              <B key={i} s={pill(c, 80, 30, 'border', true)} />
            ))}
          </div>
          <div style={card(c, { gap: 0, padding: 0 })}>
            {range(10).map((i) => (
              <div
                key={i}
                style={{
                  ...row(c, 16),
                  padding: `${c.k(i ? 11 : 9, 2)}px ${c.k(16, 2)}px`,
                  background: i ? 'transparent' : tone('canvas'),
                  borderTop: i ? `1px solid ${tone('border')}` : undefined,
                }}
              >
                {i ? <B s={dot(c, 22, i % 3 ? 'media' : 'media-2')} /> : <B s={sq(c, 22, 'line', 4, { opacity: 0 })} />}
                <B s={bar(c, '20%', i ? 8 : 6, i ? 'strong' : 'line')} />
                <B s={bar(c, '15%', 7, 'line')} />
                {i ? (
                  <div className="lay-ds-b" style={{ ...row(c, 0), height: c.k(20, 4), width: c.k(64, 10), borderRadius: 999, background: tone(i % 4 === 2 ? 'error-soft' : 'success-soft'), justifyContent: 'center', flex: 'none' }}>
                    <B s={bar(c, '55%', 5, i % 4 === 2 ? 'error' : 'success')} />
                  </div>
                ) : (
                  <B s={bar(c, 64, 6, 'line')} />
                )}
                {c.full && <B s={bar(c, '10%', 7, 'line')} />}
                <span style={{ flex: 1 }} />
                <B s={bar(c, 40, 7, i ? 'strong' : 'line')} />
              </div>
            ))}
          </div>
        </div>,
      )
    case 'list': {
      const command = c.layout.regions.some((r) => r.overlay && r.kind === 'toolbar')
      return wrap(
        <div style={{ ...col(c, 0), ...maxW(820), paddingTop: command ? c.k(150) : 0 }}>
          <B s={bar(c, 140, 12, 'strong', { marginBottom: c.k(14) })} />
          {range(9).map((i) => (
            <div key={i} style={{ ...row(c, 12), padding: `${c.k(12, 2)}px 0`, borderBottom: `1px solid ${tone('border')}`, flex: 'none' }}>
              <B s={sq(c, 30, i % 3 ? 'media' : 'media-2', 8)} />
              <div style={{ ...col(c, 6), flex: 1 }}>
                <B s={bar(c, `${36 + ((i * 13) % 30)}%`, 8, 'strong')} />
                <B s={bar(c, `${55 + ((i * 7) % 25)}%`, 6, 'line')} />
              </div>
              <B s={bar(c, 42, 6, 'line')} />
            </div>
          ))}
        </div>,
      )
    }
    case 'record':
      return wrap(
        <>
          <div style={{ ...row(c, 16), flex: 'none' }}>
            <B s={dot(c, 56, 'media-2')} />
            <div style={col(c, 9)}>
              <B s={bar(c, 200, 15, 'strong')} />
              <div style={row(c, 8)}>
                <div className="lay-ds-b" style={{ height: c.k(18, 4), width: c.k(60, 10), borderRadius: 999, background: tone('success-soft') }} />
                <B s={bar(c, 90, 7, 'line')} />
              </div>
            </div>
            <span style={{ flex: 1 }} />
            <B s={pill(c, 84, 30, 'strong', true)} />
            <B s={pill(c, 96, 30, 'accent')} />
          </div>
          <div style={{ ...row(c, 24), borderBottom: `1px solid ${tone('border')}`, paddingBottom: c.k(10, 2), flex: 'none' }}>
            {[70, 60, 84, 56].map((w, i) => (
              <B key={i} s={bar(c, w, 8, i === 0 ? 'accent' : 'strong')} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: `${c.k(14, 2)}px ${c.k(20, 2)}px`, flex: 'none' }}>
            {range(6).map((i) => (
              <div key={i} style={col(c, 7)}>
                <B s={bar(c, '34%', 6, 'line')} />
                <div className="lay-ds-b" style={{ ...row(c, 0), height: c.k(34, 6), border: `1px solid ${tone('border')}`, borderRadius: c.k(8, 2), padding: `0 ${c.k(10)}px` }}>
                  <B s={bar(c, `${40 + ((i * 17) % 40)}%`, 7, 'strong')} />
                </div>
              </div>
            ))}
          </div>
          <div style={card(c)}>
            {range(4).map((i) => (
              <B key={i} s={bar(c, i === 3 ? '58%' : `${92 - i * 4}%`, 7, 'line')} />
            ))}
          </div>
        </>,
      )
    case 'hero': {
      const top = c.layout.regions.some((r) => r.overlay && r.kind === 'header') ? 120 : 70
      return (
        <div style={{ ...col(c, 14), height: '100%', alignItems: 'center', padding: `${c.k(top, 6)}px ${pad}px 0`, textAlign: 'center' }}>
          <div className="lay-ds-b" style={{ height: c.k(24, 4), width: c.k(140, 20), borderRadius: 999, background: tone('accent-soft'), display: 'grid', placeItems: 'center', flex: 'none' }}>
            <B s={bar(c, '60%', 6, 'accent')} />
          </div>
          <B s={bar(c, '60%', 34, 'strong')} />
          <B s={bar(c, '44%', 34, 'strong')} />
          <B s={bar(c, '46%', 8, 'line', { marginTop: c.k(6) })} />
          {c.full && <B s={bar(c, '34%', 8, 'line')} />}
          <div style={{ ...row(c, 12), marginTop: c.k(8) }}>
            <B s={pill(c, 150, 44, 'accent')} />
            <B s={pill(c, 130, 44, 'strong', true)} />
          </div>
          <i className="lay-ds-b" style={{ width: '78%', height: c.k(300, 30), marginTop: c.k(26), borderRadius: c.k(c.radius + 6, 3), background: tone('media'), border: `1px solid ${tone('card-border')}`, flex: 'none' }} />
        </div>
      )
    }
    case 'editorial': {
      const narrow = c.ref.w < 960
      return (
        <div style={{ ...col(c, 24), height: '100%', padding: `${c.k(48, 4)}px ${c.k(narrow ? 36 : 64, 4)}px` }}>
          <div style={{ ...row(c, 40), alignItems: 'stretch', flex: 'none', height: c.k(narrow ? 420 : 330, 40) }}>
            <div style={{ ...col(c, 12), flex: 1.1, justifyContent: 'center' }}>
              <B s={bar(c, '26%', 7, 'accent')} />
              <B s={bar(c, '96%', 38, 'strong')} />
              <B s={bar(c, '84%', 38, 'strong')} />
              {!narrow && <B s={bar(c, '58%', 38, 'strong')} />}
              <B s={bar(c, '90%', 8, 'line', { marginTop: c.k(8) })} />
              <B s={bar(c, '76%', 8, 'line')} />
              <B s={pill(c, 140, 42, 'accent', false)} />
            </div>
            {!narrow && <i className="lay-ds-b" style={{ flex: 1, borderRadius: c.k(c.radius + 6, 3), background: tone('media') }} />}
          </div>
          {narrow && <i className="lay-ds-b" style={{ height: c.k(260, 20), borderRadius: c.k(c.radius + 6, 3), background: tone('media'), flex: 'none' }} />}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${narrow ? 2 : 3}, minmax(0, 1fr))`, gap: c.k(28, 3) }}>
            {range(narrow ? 2 : 3).map((i) => (
              <div key={i} style={col(c, 8)}>
                <B s={dot(c, 28, i === 0 ? 'accent-soft' : 'media')} />
                <B s={bar(c, '60%', 10, 'strong')} />
                <B s={bar(c, '92%', 7, 'line')} />
                <B s={bar(c, '74%', 7, 'line')} />
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'article':
      return (
        <div style={{ height: '100%', padding: `${c.k(48, 4)}px ${pad}px` }}>
          <div style={{ ...col(c, 11), ...maxW(c.layout.measurements.contentMax ?? 720), margin: c.region.kind === 'content' && c.layout.family === 'sem-sidebar' && c.layout.id === 'sidebar-direita-compacta' ? 0 : undefined }}>
            <B s={bar(c, '22%', 7, 'accent')} />
            <B s={bar(c, '94%', 26, 'strong')} />
            <B s={bar(c, '68%', 26, 'strong')} />
            <div style={{ ...row(c, 10), margin: `${c.k(6)}px 0` }}>
              <B s={dot(c, 24, 'media-2')} />
              <B s={bar(c, 120, 7, 'line')} />
            </div>
            {[100, 97, 99, 62].map((w, i) => (
              <B key={i} s={bar(c, `${w}%`, 8, 'line')} />
            ))}
            <i className="lay-ds-b" style={{ height: c.k(210, 20), margin: `${c.k(10)}px 0`, borderRadius: c.k(c.radius, 2), background: tone('media'), flex: 'none' }} />
            <B s={bar(c, '40%', 13, 'strong')} />
            {[98, 100, 94, 70].map((w, i) => (
              <B key={i} s={bar(c, `${w}%`, 8, 'line')} />
            ))}
          </div>
        </div>
      )
    case 'gallery':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gridTemplateRows: '1fr 1fr', gap: c.k(6, 1), height: '100%' }}>
          {(['dark', 'dark-2', 'dark-3'] as Tone[]).map((t, i) => (
            <div key={t} className="lay-ds-b" style={{ background: tone(t), gridRow: i === 0 ? 'span 2' : undefined, position: 'relative', overflow: 'hidden' }}>
              <div style={{ ...col(c, 8), position: 'absolute', left: c.k(28, 3), bottom: c.k(28, 3), width: '60%' }}>
                <B s={bar(c, i === 0 ? '80%' : '60%', i === 0 ? 22 : 12, 'white')} />
                {c.full && <B s={bar(c, '45%', 7, 'white', { opacity: 0.7 })} />}
              </div>
            </div>
          ))}
        </div>
      )
    case 'kanban':
      return wrap(
        <>
          <PageTitle c={c} />
          <div style={{ ...row(c, 14), alignItems: 'flex-start', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {[3, 2, 4, 1].map((n, colIdx) => (
              <div key={colIdx} className="lay-ds-b" style={{ ...col(c, 10), width: c.k(268, 30), flex: 'none', padding: c.k(10, 2), borderRadius: c.k(c.radius, 2), background: tone('media') }}>
                <div style={row(c, 8)}>
                  <B s={dot(c, 8, (['strong', 'accent', 'warning', 'success'] as Tone[])[colIdx])} />
                  <B s={bar(c, 80, 8, 'strong')} />
                  <span style={{ flex: 1 }} />
                  <B s={bar(c, 18, 7, 'line')} />
                </div>
                {range(n).map((i) => (
                  <div key={i} style={card(c, { padding: c.k(12, 2) })}>
                    <B s={bar(c, `${70 + ((i * 11) % 25)}%`, 8, 'strong')} />
                    <B s={bar(c, '55%', 6, 'line')} />
                    <div style={row(c, 6)}>
                      <div className="lay-ds-b" style={{ height: c.k(14, 3), width: c.k(46, 8), borderRadius: 999, background: tone(i % 2 ? 'success-soft' : 'accent-soft') }} />
                      <span style={{ flex: 1 }} />
                      <B s={dot(c, 18, 'media-2')} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>,
      )
    case 'document':
      return (
        <div style={{ height: '100%', padding: `${c.k(28, 3)}px ${pad}px 0` }}>
          <div style={{ ...card(c, { padding: c.k(44, 4), gap: c.k(12, 1), height: '100%', borderRadius: `${c.k(c.radius, 2)}px ${c.k(c.radius, 2)}px 0 0` }), ...maxW(760) }}>
            <B s={bar(c, '52%', 22, 'strong')} />
            <B s={bar(c, '28%', 7, 'line')} />
            {[100, 96, 98, 58].map((w, i) => (
              <B key={i} s={bar(c, `${w}%`, 8, 'line', i === 0 ? { marginTop: c.k(12) } : undefined)} />
            ))}
            <B s={bar(c, '34%', 13, 'strong', { marginTop: c.k(14) })} />
            {range(3).map((i) => (
              <div key={i} style={row(c, 10)}>
                <B s={sq(c, 14, i === 0 ? 'accent' : 'line', 4)} />
                <B s={bar(c, `${60 - i * 10}%`, 8, 'line')} />
              </div>
            ))}
            {[94, 100, 72].map((w, i) => (
              <B key={i} s={bar(c, `${w}%`, 8, 'line')} />
            ))}
          </div>
        </div>
      )
    case 'analytics': {
      const two = c.ref.w > 620
      return wrap(
        <>
          {c.layout.regions.some((r) => r.kind === 'toolbar' || r.label === 'INDICADORES') ? null : <PageTitle c={c} />}
          <div style={{ ...row(c, 14), alignItems: 'stretch', flex: 'none', height: c.k(230, 24) }}>
            <div style={card(c, { flex: 2 })}>
              <div style={row(c, 10)}>
                <B s={bar(c, 130, 9, 'strong')} />
                <span style={{ flex: 1 }} />
                <B s={dot(c, 8, 'accent')} />
                <B s={bar(c, 40, 6, 'line')} />
                <B s={dot(c, 8, 'media-2')} />
                <B s={bar(c, 40, 6, 'line')} />
              </div>
              <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                {c.full &&
                  range(4).map((i) => (
                    <i key={i} className="lay-ds-b" style={{ position: 'absolute', left: 0, right: 0, top: `${i * 33}%`, height: 1, background: tone('border') }} />
                  ))}
                <Spark c={c} area />
                <div style={{ position: 'absolute', inset: 0 }}>
                  <Spark c={c} t="media-2" points="0,34 14,30 28,32 42,26 56,28 70,22 84,24 100,18" />
                </div>
              </div>
            </div>
            {two && (
              <div style={card(c, { flex: 1, alignItems: 'center' })}>
                <B s={bar(c, '60%', 9, 'strong', { alignSelf: 'flex-start' })} />
                <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
                  <Ring c={c} d={120} pct={62} />
                </div>
              </div>
            )}
          </div>
          <div style={{ ...row(c, 14), alignItems: 'stretch', flex: 'none', height: c.k(190, 20) }}>
            <div style={card(c, { flex: 1 })}>
              <B s={bar(c, 100, 9, 'strong')} />
              <Bars c={c} n={8} />
            </div>
            {two && (
              <div style={card(c, { flex: 1, gap: c.k(12) })}>
                <B s={bar(c, 100, 9, 'strong')} />
                {range(4).map((i) => (
                  <div key={i} style={row(c, 10)}>
                    <B s={bar(c, '34%', 7, 'line')} />
                    <span style={{ flex: 1 }} />
                    <B s={bar(c, `${30 - i * 5}%`, 7, i === 0 ? 'accent' : 'media-2')} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>,
      )
    }
    case 'tiles': {
      const cols3 = c.ref.w > 720
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols3 ? 3 : 2}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${cols3 ? 2 : 3}, minmax(0, 1fr))`,
            gap: c.k(14, 2),
            height: '100%',
            padding: c.k(18, 2),
          }}
        >
          {range(6).map((i) => (
            <div key={i} style={card(c)}>
              <div style={row(c, 8)}>
                <B s={bar(c, '42%', 7, 'line')} />
                <span style={{ flex: 1 }} />
                <B s={dot(c, 10, i === 1 ? 'error' : i === 4 ? 'warning' : 'success')} />
              </div>
              <B s={bar(c, '48%', 18, 'strong')} />
              <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'flex-end' }}>
                {i % 3 === 0 ? <Spark c={c} area /> : i % 3 === 1 ? <Bars c={c} n={6} /> : <Ring c={c} d={58} pct={44 + i * 6} />}
              </div>
            </div>
          ))}
        </div>
      )
    }
    case 'kiosk':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gridTemplateRows: '1fr 1fr', gap: c.k(22, 2), height: '100%', padding: c.k(30, 3) }}>
          <div style={card(c, { gridRow: 'span 2', background: tone('accent'), border: 'none', justifyContent: 'center', padding: c.k(36, 3), gap: c.k(16, 2) })}>
            <B s={bar(c, '34%', 12, 'white')} />
            <B s={bar(c, '58%', 72, 'white')} />
            <B s={bar(c, '46%', 12, 'white', { opacity: 0.7 })} />
          </div>
          {range(2).map((i) => (
            <div key={i} style={{ ...card(c, { padding: c.k(26, 3), gap: c.k(14, 1) }), ...row(c, 18), flexDirection: 'row' }}>
              <B s={dot(c, 64, i ? 'media-2' : 'accent-soft')} />
              <div style={{ ...col(c, 12), flex: 1 }}>
                <B s={bar(c, '72%', 22, 'strong')} />
                <B s={bar(c, '48%', 10, 'line')} />
              </div>
            </div>
          ))}
        </div>
      )
    case 'focus':
      return (
        <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: pad }}>
          <div style={{ ...card(c, { padding: c.k(36, 3), gap: c.k(14, 2), alignItems: 'center' }), width: '100%', maxWidth: c.k(c.layout.measurements.contentMax ?? 520) }}>
            <B s={dot(c, 52, 'accent-soft')} />
            <B s={bar(c, '58%', 40, 'strong')} />
            <B s={bar(c, '72%', 8, 'line')} />
            <B s={bar(c, '50%', 8, 'line')} />
            <B s={pill(c, '64%', 44, 'accent')} />
          </div>
        </div>
      )
    case 'controls': {
      const cols3 = c.ref.w > 640
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols3 ? 3 : 2}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${cols3 ? 2 : 3}, minmax(0, 1fr))`,
            gap: c.k(14, 2),
            height: '100%',
            padding: c.k(20, 2),
          }}
        >
          {range(6).map((i) => {
            const on = i === 0 || i === 3 || i === 4
            return (
              <div key={i} style={card(c, { background: tone(i === 0 ? 'accent-soft' : 'card'), border: `1px solid ${tone(i === 0 ? 'accent' : 'card-border')}` })}>
                <div style={row(c, 8)}>
                  <B s={dot(c, 34, on ? 'accent' : 'media')} />
                  <span style={{ flex: 1 }} />
                  <div className="lay-ds-b" style={{ width: c.k(40, 8), height: c.k(22, 5), borderRadius: 999, background: tone(on ? 'accent' : 'media-2'), display: 'flex', alignItems: 'center', justifyContent: on ? 'flex-end' : 'flex-start', padding: c.k(3, 1), flex: 'none' }}>
                    <i className="lay-ds-b" style={{ width: c.k(16, 3), height: c.k(16, 3), borderRadius: 999, background: '#fff' }} />
                  </div>
                </div>
                <span style={{ flex: 1 }} />
                <B s={bar(c, '60%', 10, 'strong')} />
                <B s={bar(c, '38%', 7, 'line')} />
              </div>
            )
          })}
        </div>
      )
    }
    case 'editor':
      return (
        <div style={{ ...col(c, 0), height: '100%' }}>
          <div style={{ ...row(c, 4), height: c.k(36, 5), padding: `0 ${c.k(10)}px`, borderBottom: `1px solid ${tone('border')}`, flex: 'none' }}>
            {range(3).map((i) => (
              <div key={i} className="lay-ds-b" style={{ ...row(c, 6), height: '72%', padding: `0 ${c.k(12)}px`, borderRadius: c.k(6, 1), background: i === 0 ? tone('surface') : 'transparent', border: i === 0 ? `1px solid ${tone('border')}` : undefined }}>
                <B s={bar(c, 54, 6, i === 0 ? 'strong' : 'line')} />
              </div>
            ))}
          </div>
          <div style={{ ...col(c, 10), padding: c.k(18, 2) }}>
            {[0, 1, 2, 2, 1, 2, 3, 3, 2, 1, 0, 0, 1, 2].map((ind, i) => (
              <div key={i} style={row(c, 12)}>
                <B s={bar(c, 14, 6, 'line')} />
                <span style={{ width: c.k(ind * 18), flex: 'none' }} />
                <B s={bar(c, W[i % W.length] + 40 + ((i * 23) % 90), 7, i % 5 === 1 ? 'accent' : i % 4 === 3 ? 'success' : 'strong')} />
                {i % 3 === 0 && <B s={bar(c, 50, 7, 'line')} />}
              </div>
            ))}
          </div>
        </div>
      )
    case 'preview':
      return (
        <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: c.k(32, 3), background: tone('canvas') }}>
          <div style={{ ...card(c, { padding: 0, gap: 0 }), width: '82%', height: '86%' }}>
            <div style={{ ...row(c, 6), height: c.k(28, 5), padding: `0 ${c.k(10)}px`, borderBottom: `1px solid ${tone('border')}`, flex: 'none' }}>
              {range(3).map((i) => (
                <B key={i} s={dot(c, 8, 'line')} />
              ))}
              <B s={bar(c, '40%', 10, 'line', { marginLeft: c.k(10), opacity: 0.7 })} />
            </div>
            <div style={{ ...col(c, 10), padding: c.k(20, 2), flex: 1 }}>
              <B s={bar(c, '46%', 14, 'strong')} />
              <B s={bar(c, '70%', 7, 'line')} />
              <i className="lay-ds-b" style={{ flex: 1, minHeight: c.k(40, 6), borderRadius: c.k(c.radius, 2), background: tone('media') }} />
              <div style={row(c, 10)}>
                {range(3).map((i) => (
                  <i key={i} className="lay-ds-b" style={{ flex: 1, height: c.k(46, 6), borderRadius: c.k(c.radius, 2), background: tone(i === 1 ? 'accent-soft' : 'media') }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    default:
      return <Panel c={c} />
  }
}

function Drawing({ c }: { c: Ctx }) {
  switch (c.region.kind as RegionKind) {
    case 'header':
      return <Header c={c} />
    case 'sidebar':
      return <Sidebar c={c} />
    case 'rail':
      return <Rail c={c} />
    case 'submenu':
      return <Submenu c={c} />
    case 'toolbar':
      return <Toolbar c={c} />
    case 'footer':
      return <Footer c={c} />
    case 'content':
      return <Content c={c} />
    default:
      return <Panel c={c} />
  }
}

/* -------------------------------------------------------------------------- */
/* Legendas                                                                    */
/* -------------------------------------------------------------------------- */

interface ChipSpec {
  h: number
  fs: number
  px: number
  inset: number
}

function chipSpec(full: boolean, width: number): ChipSpec {
  if (!full) return { h: 13, fs: width < 250 ? 7 : 7.5, px: 3.5, inset: 2 }
  return width >= 900 ? { h: 20, fs: 11, px: 7, inset: 8 } : { h: 18, fs: 10, px: 6, inset: 6 }
}

type ChipPlace = 'top' | 'end' | 'vertical'

function chipPlacement(label: string, rect: Rect, cs: ChipSpec): { place: ChipPlace; textW: number } {
  const textW = Math.ceil(label.length * cs.fs * 0.64 + cs.px * 2)
  if (rect.w < textW + cs.inset * 2) return { place: 'vertical', textW }
  if (rect.h < cs.h * 2.5 + cs.inset * 2) return { place: 'end', textW }
  return { place: 'top', textW }
}

/* -------------------------------------------------------------------------- */
/* Região                                                                      */
/* -------------------------------------------------------------------------- */

interface RegionViewProps {
  region: LayoutRegion
  rect: Rect
  edges: Edges
  layout: DesktopLayout
  s: number
  full: boolean
  pad: number
  sideLogo: boolean
  showLegends: boolean
  chip: ChipSpec
  radius: number
  cardRadius: number
  shadow: string
  /** Retângulos das regiões sobrepostas (para a etiqueta não ficar embaixo delas). */
  overlays: Rect[]
  renderRegion?: DesktopSchematicProps['renderRegion']
}

const intersects = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

function RegionView(p: RegionViewProps) {
  const { region, rect, edges, layout, s, full, chip } = p
  const k = (n: number, min = 0) => Math.max(min, n * s)
  const gap = layout.grid.gap > 0
  const transparent = region.fill === 'transparent'
  const floating = Boolean(region.floating)
  const kind = region.kind

  const bgTone: Tone =
    kind === 'content' ? (floating ? 'surface' : 'canvas') : kind === 'sidebar' || kind === 'rail' ? 'nav' : kind === 'submenu' ? 'nav-alt' : 'surface'
  const background = transparent || (gap && !floating) ? 'transparent' : tone(bgTone)

  const lines: string[] = []
  if (!gap && !floating && !transparent) {
    const b = tone('border')
    if (edges.right) lines.push(`inset -1px 0 0 ${b}`)
    if (edges.bottom) lines.push(`inset 0 -1px 0 ${b}`)
    if (edges.left) lines.push(`inset 1px 0 0 ${b}`)
    if (edges.top) lines.push(`inset 0 1px 0 ${b}`)
  }

  const style: CSSProperties = region.overlay
    ? { position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: 3 }
    : { gridArea: region.id }
  Object.assign(style, {
    background,
    borderRadius: floating ? k(p.radius, 3) : undefined,
    border: floating ? `1px solid ${tone('border')}` : undefined,
    boxShadow: floating ? p.shadow : lines.join(', ') || undefined,
  } satisfies CSSProperties)

  const legend = REGION_LEGEND[kind]
  const label = region.label ?? legend.label
  const custom = p.renderRegion?.(region, { scale: s, width: rect.w, height: rect.h })
  const hasCustom = custom !== null && custom !== undefined && custom !== false

  const placement = p.showLegends ? chipPlacement(label, rect, chip) : null
  // Etiqueta no topo que ficaria sob uma região sobreposta (ex.: header flutuante): desce para logo abaixo dela.
  let chipTop = chip.inset
  if (placement && !region.overlay && (placement.place === 'top' || hasCustom)) {
    const m = Math.max(8, chip.inset * 3)
    const box = { x: rect.x + chip.inset - m, y: rect.y + chip.inset - m, w: placement.textW * 1.2 + m * 2, h: chip.h + m * 2 }
    for (const o of p.overlays) if (intersects(box, o)) chipTop = Math.max(chipTop, o.y + o.h - rect.y + chip.inset)
  }
  const inner: CSSProperties = { position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }
  // Header e sidebar reais (prévia integrada): menus e popovers podem sair da região sem serem cortados.
  if (hasCustom && (kind === 'header' || kind === 'sidebar')) {
    inner.overflow = 'visible'
    style.zIndex = Math.max(Number(style.zIndex ?? 0), kind === 'header' ? 6 : 5)
    style.position = style.position ?? 'relative'
  }
  if (placement && !hasCustom) {
    if (placement.place === 'top' && chipTop === chip.inset) inner.paddingTop = chip.h + chip.inset
    if (placement.place === 'end') inner.paddingRight = placement.textW + chip.inset * 2
    if (placement.place === 'vertical') inner.paddingBottom = placement.textW + chip.inset * 2
  }

  const ctx: Ctx = {
    s,
    full,
    k,
    rect,
    ref: { w: rect.w / s, h: rect.h / s },
    region,
    layout,
    top: rect.y <= p.pad + 0.5,
    left: rect.x <= p.pad + 0.5,
    sideLogo: p.sideLogo,
    radius: p.cardRadius,
  }

  const chipStyle: CSSProperties = {
    background: legend.color,
    height: chip.h,
    fontSize: chip.fs,
    padding: `0 ${chip.px}px`,
  }
  if (placement?.place === 'top' || hasCustom) Object.assign(chipStyle, { top: chipTop, left: chip.inset })
  if (placement?.place === 'end' && !hasCustom) Object.assign(chipStyle, { top: '50%', right: chip.inset, transform: 'translateY(-50%)' })
  if (placement?.place === 'vertical' && !hasCustom)
    Object.assign(chipStyle, {
      bottom: chip.inset,
      left: '50%',
      width: chip.h,
      height: placement.textW,
      padding: `${chip.px}px 0`,
      writingMode: 'vertical-rl',
      transform: 'translateX(-50%) rotate(180deg)',
    })

  return (
    <div className="lay-ds-region" data-region={region.id} data-kind={kind} style={style}>
      <div className={hasCustom ? 'lay-ds-custom' : 'lay-ds-draw'} style={inner}>
        {hasCustom ? custom : <Drawing c={ctx} />}
      </div>
      {region.scroll && full && !hasCustom && <i className="lay-ds-scroll" style={{ right: Math.max(2, k(5)), width: Math.max(2, k(4)) }} aria-hidden="true" />}
      {placement && (
        <span className="lay-chip" style={chipStyle} aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Componente                                                                  */
/* -------------------------------------------------------------------------- */

const FLOAT_SHADOW = '0 1px 2px rgba(20,22,30,.05), 0 6px 18px rgba(20,22,30,.06)'

/**
 * Desenho esquemático de um layout desktop. Renderiza o grid real na largura pedida,
 * escalando trilhas em px, gap e padding por largura / 1280 (fr continua fr).
 */
export const DesktopSchematic = memo(function DesktopSchematic({
  layout,
  width,
  height,
  showLegends,
  theme,
  renderRegion,
  detail = 'auto',
  frame = true,
  className,
}: DesktopSchematicProps) {
  const w = Math.max(80, Math.round(width))
  const h = Math.max(50, Math.round(height ?? (w * 10) / 16))
  const s = w / 1280
  const full = detail === 'full' || (detail === 'auto' && w >= 420)
  const geo = useMemo(() => computeGeometry(layout, w, h), [layout, w, h])
  const palette = useMemo(() => (theme ? themePalette(theme) : NEUTRAL), [theme])
  const vars = useMemo(() => Object.fromEntries(Object.entries(palette).map(([key, v]) => [`--ds-${key}`, v])) as CSSProperties, [palette])

  const radius = theme ? Math.min(theme.metrics.radiusLg, 28) : 14
  const cardRadius = theme ? Math.min(theme.metrics.radiusMd, 20) : 10
  const shadow = theme && theme.metrics.shadow !== 'none' ? theme.metrics.shadow : FLOAT_SHADOW
  const chip = chipSpec(full, w)
  const pad = layout.grid.padding * s
  const sideLogo = layout.regions.some((r) => {
    const rect = geo.rects[r.id]
    return (r.kind === 'sidebar' || r.kind === 'rail' || r.kind === 'submenu') && rect && rect.x <= pad + 0.5 && rect.y <= pad + 0.5
  })

  const style: CSSProperties = {
    ...vars,
    width: w,
    height: h,
    gridTemplateColumns: scaleCss(layout.grid.columns, s).replace(/(\d*\.?\d+)fr/g, 'minmax(0, $1fr)'),
    gridTemplateRows: scaleCss(layout.grid.rows, s).replace(/(\d*\.?\d+)fr/g, 'minmax(0, $1fr)'),
    gridTemplateAreas: layout.grid.areas.map((a) => `"${a}"`).join(' '),
    gap: layout.grid.gap * s,
    padding: pad,
    fontFamily: theme?.metrics.bodyFont,
  }

  const overlays = layout.regions.filter((r) => r.overlay && geo.rects[r.id]).map((r) => geo.rects[r.id])
  const regionProps = { layout, s, full, pad, sideLogo, showLegends, chip, radius, cardRadius, shadow, overlays, renderRegion }

  return (
    <div
      className={['lay-ds', frame && 'lay-ds--frame', className].filter(Boolean).join(' ')}
      data-detail={full ? 'full' : 'thumb'}
      data-layout={layout.id}
      role={renderRegion ? undefined : 'img'}
      aria-label={renderRegion ? undefined : `Desenho do layout ${layout.name}`}
      style={style}
    >
      {layout.regions.map((region) => {
        const rect = geo.rects[region.id]
        if (!rect) return null
        return <RegionView key={region.id} region={region} rect={rect} edges={geo.edges[region.id]} {...regionProps} />
      })}
    </div>
  )
})
