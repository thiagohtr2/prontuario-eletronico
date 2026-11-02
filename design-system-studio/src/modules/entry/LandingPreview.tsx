import { createContext, useContext, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Clock,
  Layers,
  Menu,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { contrast, isDark, isHex, mix, normalizeHex, readableOn, withAlpha } from '@/core/color'
import { FONT_OPTIONS, fontStack } from '@/core/tokens'
import type { ResolvedTheme } from '@/core/types'
import { Motif } from './motifs'
import type { LandingArchitecture, LandingContent, LandingModel, Motif as MotifKind } from './types'
import './entry.css'

/* ========================================================================== */
/* Paleta da demonstração                                                      */
/* ========================================================================== */

export interface LandingPalette {
  dark: boolean
  bg: string
  alt: string
  surface: string
  text: string
  muted: string
  primary: string
  onPrimary: string
  accent: string
  onAccent: string
  border: string
  borderStrong: string
  /** Fundo de "cena" escura (imagens de tela cheia, faixas), sempre com contraste para texto branco. */
  scene: string
  heading: string
  body: string
  hw: number
  /** Raio pequeno/médio e grande em px; `pill` = botões totalmente arredondados. */
  r: number
  rl: number
  pill: boolean
}

const hex = (v: string | undefined, fallback: string) => (v && isHex(v) ? normalizeHex(v) : fallback)

function sceneFrom(base: string): string {
  let s = base
  for (let i = 0; i < 14 && contrast(s, '#ffffff') < 8; i++) s = mix(s, '#000000', 0.2)
  return s
}

function weightFor(fontId: string): number {
  const kind = FONT_OPTIONS.find((f) => f.id === fontId)?.kind
  return kind === 'serif' ? 600 : kind === 'mono' ? 600 : 700
}

/** Sem tema = cores originais do modelo; com tema = herda a identidade global do projeto. */
export function landingPalette(model: LandingModel, theme?: ResolvedTheme | null): LandingPalette {
  if (!theme) {
    const d = model.demo
    const dark = isDark(d.bg)
    const toward = dark ? '#ffffff' : '#000000'
    return {
      dark,
      bg: d.bg,
      alt: mix(d.bg, toward, dark ? 0.05 : 0.03),
      surface: d.surface,
      text: d.text,
      muted: d.muted,
      primary: d.primary,
      onPrimary: d.onPrimary,
      accent: d.accent,
      onAccent: readableOn(d.accent),
      border: mix(d.surface, d.text, dark ? 0.16 : 0.12),
      borderStrong: mix(d.surface, d.text, 0.3),
      scene: sceneFrom(dark ? d.bg : mix(d.text, d.primary, 0.22)),
      heading: fontStack(model.headingFont),
      body: fontStack(model.bodyFont ?? 'inter'),
      hw: weightFor(model.headingFont),
      r: model.radius,
      rl: Math.round(model.radius * 1.5),
      pill: model.radius >= 18,
    }
  }
  const t = theme.tokens
  const mt = theme.metrics
  const bg = hex(t.bg, '#ffffff')
  const text = hex(t.text, '#111111')
  const surface = hex(t.surface, bg)
  const primary = hex(t.primary, '#333333')
  const accent = hex(t.accent, primary)
  const dark = t.mode === 'dark'
  return {
    dark,
    bg,
    alt: hex(t.bgAlt, bg),
    surface,
    text,
    muted: hex(t.textMuted, mix(text, bg, 0.4)),
    primary,
    onPrimary: hex(t.onPrimary, readableOn(primary)),
    accent,
    onAccent: hex(t.onAccent, readableOn(accent)),
    border: hex(t.border, mix(surface, text, 0.12)),
    borderStrong: hex(t.borderStrong, mix(surface, text, 0.3)),
    scene: sceneFrom(dark ? bg : mix(text, primary, 0.22)),
    heading: mt.headingFont,
    body: mt.bodyFont,
    hw: theme.typography.headingWeight,
    r: Math.min(mt.radiusMd, 16),
    rl: Math.min(mt.radiusLg, 24),
    pill: theme.geometry.radius === 'pill',
  }
}

/* ========================================================================== */
/* Contexto e primitivas                                                       */
/* ========================================================================== */

interface Ctx {
  P: LandingPalette
  m: boolean
  c: LandingContent
  live: boolean
  compact: boolean
}

const LCtx = createContext<Ctx | null>(null)
const useL = () => useContext(LCtx) as Ctx

const FEATURE_ICONS: LucideIcon[] = [Sparkles, Zap, BarChart3, ShieldCheck, Layers, Clock]
const FOOTER_LINKS = [
  ['Visão geral', 'Novidades', 'Preços'],
  ['Sobre', 'Carreiras', 'Contato'],
  ['Ajuda', 'Guias', 'Comunidade'],
  ['Privacidade', 'Termos', 'Cookies'],
]

function h(P: LandingPalette, size: number, extra?: CSSProperties): CSSProperties {
  return {
    fontFamily: P.heading,
    fontWeight: P.hw,
    fontSize: size,
    lineHeight: size >= 64 ? 1 : size >= 36 ? 1.08 : 1.22,
    letterSpacing: size >= 44 ? '-0.03em' : size >= 26 ? '-0.015em' : '-0.005em',
    margin: 0,
    color: 'inherit',
    ...extra,
  }
}

function Wrap({ children, style, wide }: { children: ReactNode; style?: CSSProperties; wide?: boolean }) {
  const { m } = useL()
  const pad = m ? 20 : 56
  return <div style={{ maxWidth: (wide ? 1280 : 1160) + pad * 2, margin: '0 auto', padding: `0 ${pad}px`, width: '100%', ...style }}>{children}</div>
}

type BtnKind = 'primary' | 'secondary' | 'accent' | 'light' | 'ghostLight' | 'link' | 'inverse'

function Btn({
  kind = 'primary',
  size = 'md',
  block,
  children,
  style,
  label,
}: {
  kind?: BtnKind
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  children: ReactNode
  style?: CSSProperties
  label?: string
}) {
  const { P, live } = useL()
  const height = size === 'lg' ? 52 : size === 'sm' ? 38 : 46
  const base: CSSProperties = {
    display: block ? 'flex' : 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height,
    padding: `0 ${size === 'lg' ? 24 : size === 'sm' ? 14 : 18}px`,
    borderRadius: P.pill ? 999 : Math.min(P.r, 12),
    border: '1px solid transparent',
    fontFamily: P.body,
    fontSize: size === 'sm' ? 14 : 15.5,
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    width: block ? '100%' : undefined,
    cursor: live ? 'pointer' : undefined,
    textDecoration: 'none',
  }
  const kinds: Record<BtnKind, CSSProperties> = {
    primary: { background: P.primary, color: P.onPrimary },
    secondary: { background: 'transparent', color: P.text, borderColor: P.borderStrong },
    accent: { background: P.accent, color: P.onAccent },
    light: { background: '#ffffff', color: '#121214' },
    ghostLight: { background: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,.55)' },
    inverse: { background: P.onPrimary, color: P.primary },
    link: { background: 'transparent', color: 'inherit', padding: 0, height: 'auto', textDecoration: 'underline', textUnderlineOffset: 5, borderRadius: 0 },
  }
  const s = { ...base, ...kinds[kind], ...style }
  return live ? (
    <button type="button" style={s} aria-label={label}>
      {children}
    </button>
  ) : (
    <span style={s}>{children}</span>
  )
}

function Pill({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const { P } = useL()
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        width: 'fit-content',
        padding: '6px 14px',
        borderRadius: 999,
        border: `1px solid ${P.border}`,
        background: P.surface,
        color: P.text,
        fontSize: 13.5,
        fontWeight: 560,
        ...style,
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: 9, background: P.accent, flex: 'none' }} />
      {children}
    </span>
  )
}

function Logo({ color, mark = true, size = 19 }: { color?: string; mark?: boolean; size?: number }) {
  const { P, c } = useL()
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, color: color ?? P.text, fontFamily: P.heading, fontWeight: 700, fontSize: size, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
      {mark && (
        <span style={{ width: size + 5, height: size + 5, borderRadius: Math.min(P.r, 8), background: P.primary, display: 'grid', placeItems: 'center', flex: 'none' }}>
          <span style={{ width: (size + 5) * 0.42, height: (size + 5) * 0.42, borderRadius: 99, background: P.onPrimary }} />
        </span>
      )}
      {c.logo}
    </span>
  )
}

/** Imagem ilustrativa: degradê derivado da paleta + ilustração vetorial. */
function Pic({
  h: height,
  tone = 0,
  motif,
  radius,
  style,
  children,
  motifSize = '68%',
}: {
  h: number | string
  tone?: number
  motif?: MotifKind
  radius?: number
  style?: CSSProperties
  children?: ReactNode
  motifSize?: string
}) {
  const { P, c } = useL()
  const tones: [string, string][] = [
    [mix(P.primary, P.bg, 0.78), mix(P.accent, P.bg, 0.6)],
    [mix(P.accent, P.bg, 0.55), mix(P.primary, P.bg, 0.72)],
    [mix(P.primary, P.bg, 0.6), mix(P.primary, P.bg, 0.86)],
    [mix(P.text, P.bg, 0.88), mix(P.accent, P.bg, 0.72)],
  ]
  const [from, to] = tones[tone % tones.length]
  return (
    <div
      style={{
        position: 'relative',
        height,
        borderRadius: radius ?? P.r,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <Motif kind={motif ?? c.motif} a={P.primary} b={P.accent} c={P.surface} d={P.text} style={{ width: motifSize, height: '78%' }} />
      {children}
    </div>
  )
}

function Hamburger({ color, open, onToggle }: { color: string; open: boolean; onToggle: () => void }) {
  const { live } = useL()
  const icon = open ? <X size={22} /> : <Menu size={22} />
  const s: CSSProperties = { display: 'inline-grid', placeItems: 'center', width: 42, height: 42, border: 0, background: 'transparent', color, padding: 0, cursor: live ? 'pointer' : undefined }
  return live ? (
    <button type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={onToggle} style={s}>
      {icon}
    </button>
  ) : (
    <span style={s}>{icon}</span>
  )
}

function Header({
  fg,
  bg = 'transparent',
  border = true,
  navAlign = 'center',
  showCta = true,
  absolute = false,
  mark = true,
  ctaKind = 'primary',
  ctaLabel,
  mobileCta = false,
}: {
  fg?: string
  bg?: string
  border?: boolean
  navAlign?: 'center' | 'right'
  showCta?: boolean
  absolute?: boolean
  mark?: boolean
  ctaKind?: BtnKind
  ctaLabel?: string
  mobileCta?: boolean
}) {
  const { P, m, c } = useL()
  const [open, setOpen] = useState(false)
  const color = fg ?? P.text
  const navColor = fg ? withAlpha(normalizeHex(fg), 0.82) : P.muted
  const wrap: CSSProperties = {
    position: absolute ? 'absolute' : 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    background: bg,
    borderBottom: border ? `1px solid ${fg ? 'rgba(255,255,255,.14)' : P.border}` : 'none',
    color,
  }
  return (
    <header style={wrap}>
      <Wrap style={{ display: 'flex', alignItems: 'center', gap: 24, height: m ? 60 : 72 }}>
        <Logo color={color} mark={mark} size={m ? 17 : 19} />
        {!m && (
          <nav style={{ display: 'flex', gap: 28, flex: 1, justifyContent: navAlign === 'center' ? 'center' : 'flex-end', fontSize: 15, color: navColor, fontWeight: 500 }}>
            {c.nav.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
        )}
        {m && <span style={{ flex: 1 }} />}
        {!m && (c.login || showCta) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {c.login && <span style={{ fontSize: 15, fontWeight: 600 }}>Entrar</span>}
            {showCta && (
              <Btn size="sm" kind={ctaKind}>
                {ctaLabel ?? c.cta}
              </Btn>
            )}
          </div>
        )}
        {m && mobileCta && showCta && (
          <Btn size="sm" kind={ctaKind} style={{ height: 36, padding: '0 12px', fontSize: 13.5 }}>
            {ctaLabel ?? c.cta.split(' ')[0]}
          </Btn>
        )}
        {m && <Hamburger color={color} open={open} onToggle={() => setOpen((o) => !o)} />}
      </Wrap>
      {m && open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: P.surface, color: P.text, borderBottom: `1px solid ${P.border}`, padding: '8px 20px 20px', boxShadow: '0 18px 30px -18px rgba(0,0,0,.35)' }}>
          {c.nav.map((n) => (
            <div key={n} style={{ padding: '14px 0', borderBottom: `1px solid ${P.border}`, fontSize: 17, fontWeight: 560 }}>
              {n}
            </div>
          ))}
          <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
            {c.login && (
              <Btn kind="secondary" block>
                Entrar
              </Btn>
            )}
            <Btn block>{c.cta}</Btn>
          </div>
        </div>
      )}
    </header>
  )
}

function Footer({ simple = false, dark = false }: { simple?: boolean; dark?: boolean }) {
  const { P, m, c } = useL()
  const fg = dark ? '#ffffff' : P.text
  const muted = dark ? 'rgba(255,255,255,.62)' : P.muted
  const line = dark ? 'rgba(255,255,255,.12)' : P.border
  const bg = dark ? mix(P.scene, '#000000', 0.35) : P.bg
  if (simple) {
    return (
      <footer style={{ background: bg, color: muted, borderTop: `1px solid ${line}`, fontSize: 14 }}>
        <Wrap style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, padding: m ? '22px 20px' : '28px 56px' }}>
          <span>© 2026 {c.logo}</span>
          <span style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {c.footer.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </span>
        </Wrap>
      </footer>
    )
  }
  return (
    <footer style={{ background: bg, color: fg, borderTop: `1px solid ${line}` }}>
      <Wrap style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : `1.6fr repeat(${c.footer.length}, minmax(0, 1fr))`, gap: m ? 28 : 40, padding: m ? '40px 20px 28px' : '64px 56px 40px' }}>
        <div style={{ gridColumn: m ? '1 / -1' : undefined, display: 'grid', gap: 12, alignContent: 'start' }}>
          <Logo color={fg} size={18} />
          <p style={{ color: muted, fontSize: 14, maxWidth: 280 }}>{c.closing.text}</p>
        </div>
        {c.footer.map((title, i) => (
          <div key={title} style={{ display: 'grid', gap: 10, alignContent: 'start', fontSize: 14 }}>
            <strong style={{ fontWeight: 650 }}>{title}</strong>
            {FOOTER_LINKS[i % FOOTER_LINKS.length].map((l) => (
              <span key={l} style={{ color: muted }}>
                {l}
              </span>
            ))}
          </div>
        ))}
      </Wrap>
      <Wrap style={{ borderTop: `1px solid ${line}`, padding: m ? '16px 20px 24px' : '20px 56px 28px', color: muted, fontSize: 13 }}>
        © 2026 {c.logo}. Marca fictícia criada para demonstração.
      </Wrap>
    </footer>
  )
}

function SectionTitle({ eyebrow, title, center, text }: { eyebrow?: string; title: string; center?: boolean; text?: string }) {
  const { P, m } = useL()
  return (
    <div style={{ display: 'grid', gap: 12, textAlign: center ? 'center' : 'left', justifyItems: center ? 'center' : 'start', marginBottom: m ? 28 : 44 }}>
      {eyebrow && <span style={{ fontSize: 13, fontWeight: 650, letterSpacing: '.08em', textTransform: 'uppercase', color: P.primary }}>{eyebrow}</span>}
      <h2 style={h(P, m ? 28 : 40, { maxWidth: '22ch' })}>{title}</h2>
      {text && <p style={{ color: P.muted, maxWidth: 560, fontSize: m ? 15.5 : 17 }}>{text}</p>}
    </div>
  )
}

function FeatureGrid({ title, cols = 3, boxed = true }: { title?: string; cols?: number; boxed?: boolean }) {
  const { P, m, c } = useL()
  return (
    <section style={{ padding: m ? '56px 0' : '96px 0' }}>
      <Wrap>
        <SectionTitle eyebrow="Recursos" title={title ?? `Por que escolher ${c.logo}`} center />
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : `repeat(${cols}, minmax(0, 1fr))`, gap: m ? 14 : 24 }}>
          {c.features.slice(0, cols === 4 ? 4 : 3).map((f, i) => {
            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length]
            return (
              <div key={f.title} style={{ padding: boxed ? (m ? 20 : 28) : 0, borderRadius: P.rl, background: boxed ? P.surface : 'transparent', border: boxed ? `1px solid ${P.border}` : 'none', display: 'grid', gap: 10, alignContent: 'start' }}>
                <span style={{ width: 44, height: 44, borderRadius: Math.min(P.r, 12), background: withAlpha(P.primary, 0.12), color: P.primary, display: 'grid', placeItems: 'center' }}>
                  <Icon size={21} />
                </span>
                <h3 style={h(P, 19, { marginTop: 6 })}>{f.title}</h3>
                <p style={{ color: P.muted, fontSize: 15 }}>{f.text}</p>
              </div>
            )
          })}
        </div>
      </Wrap>
    </section>
  )
}

function QuoteBlock({ align = 'center', serif = false }: { align?: 'center' | 'left'; serif?: boolean }) {
  const { P, m, c } = useL()
  const initials = c.quote.author
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return (
    <section style={{ padding: m ? '48px 0' : '88px 0', background: P.alt }}>
      <Wrap style={{ display: 'grid', justifyItems: align === 'center' ? 'center' : 'start', textAlign: align, gap: 22 }}>
        <div style={{ display: 'flex', gap: 3, color: P.accent }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        <blockquote style={{ ...h(P, m ? 22 : 32, { fontWeight: serif ? 500 : P.hw, fontStyle: serif ? 'italic' : 'normal', maxWidth: '30ch' }), margin: 0 }}>“{c.quote.text}”</blockquote>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14.5 }}>
          <span style={{ width: 40, height: 40, borderRadius: 99, background: withAlpha(P.primary, 0.16), color: P.primary, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14 }}>{initials}</span>
          <span style={{ color: P.muted, textAlign: 'left' }}>{c.quote.author}</span>
        </div>
      </Wrap>
    </section>
  )
}

function ClosingBand() {
  const { P, m, c } = useL()
  return (
    <section style={{ background: P.primary, color: P.onPrimary, padding: m ? '56px 0' : '88px 0' }}>
      <Wrap style={{ display: 'grid', justifyItems: 'center', textAlign: 'center', gap: 16 }}>
        <h2 style={h(P, m ? 28 : 44, { maxWidth: '20ch' })}>{c.closing.title}</h2>
        <p style={{ opacity: 0.85, fontSize: m ? 15.5 : 18 }}>{c.closing.text}</p>
        <div style={{ marginTop: 10, width: m ? '100%' : undefined }}>
          <Btn kind="inverse" size="lg" block={m}>
            {c.cta}
            <ArrowRight size={18} />
          </Btn>
        </div>
      </Wrap>
    </section>
  )
}

function StatsRow({ cols = 4, onScene = false }: { cols?: number; onScene?: boolean }) {
  const { P, m, c } = useL()
  const stats = c.stats.slice(0, cols)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : `repeat(${stats.length}, minmax(0, 1fr))`, gap: m ? 20 : 0 }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{ padding: m ? '4px 0' : '0 28px', borderLeft: !m && i > 0 ? `1px solid ${onScene ? 'rgba(255,255,255,.16)' : P.border}` : 'none', display: 'grid', gap: 4 }}>
          <span style={h(P, m ? 28 : 40, { color: onScene ? '#ffffff' : P.primary })}>{s.value}</span>
          <span style={{ fontSize: 13.5, color: onScene ? 'rgba(255,255,255,.66)' : P.muted, textTransform: onScene ? 'uppercase' : 'none', letterSpacing: onScene ? '.06em' : 0 }}>{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function Avatars({ n = 4, size = 32, ring }: { n?: number; size?: number; ring?: string }) {
  const { P } = useL()
  const colors = [P.primary, P.accent, mix(P.primary, P.accent, 0.5), mix(P.text, P.bg, 0.45), mix(P.accent, P.bg, 0.3)]
  return (
    <span style={{ display: 'inline-flex' }}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} style={{ width: size, height: size, borderRadius: 99, background: colors[i % colors.length], border: `2px solid ${ring ?? P.surface}`, marginLeft: i ? -size * 0.3 : 0 }} />
      ))}
    </span>
  )
}

function LineChart({ data, w = 400, h: ht = 140, color, fillColor, grid }: { data: number[]; w?: number; h?: number; color: string; fillColor?: string; grid?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, ht - 8 - ((v - min) / (max - min || 1)) * (ht - 24)])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${ht}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true">
      {grid && [0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={w} y1={ht * g} y2={ht * g} stroke={grid} strokeWidth="1" />)}
      {fillColor && <path d={`${line} L${w} ${ht} L0 ${ht} Z`} fill={fillColor} />}
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  )
}

/** Sequência pseudoaleatória determinística (mesma renderização sempre). */
function seeded(seed: number, n: number): number[] {
  const out: number[] = []
  let s = seed
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280
    out.push(s / 233280)
  }
  return out
}

/* ========================================================================== */
/* 1. Hero centralizado                                                        */
/* ========================================================================== */

function AppMock() {
  const { P, m } = useL()
  const cols = m ? ['A fazer', 'Em andamento'] : ['A fazer', 'Em andamento', 'Concluído']
  const tags = [P.primary, P.accent, mix(P.primary, P.accent, 0.5)]
  return (
    <div style={{ margin: m ? '36px 0 -40px' : '56px auto -96px', maxWidth: 980, position: 'relative', zIndex: 2, background: P.surface, border: `1px solid ${P.border}`, borderRadius: P.rl, boxShadow: '0 40px 80px -40px rgba(20,20,50,.45)', overflow: 'hidden', textAlign: 'left' }}>
      <div style={{ height: 38, display: 'flex', alignItems: 'center', gap: 7, padding: '0 14px', borderBottom: `1px solid ${P.border}`, background: P.alt }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: 9, background: P.borderStrong }} />
        ))}
        <span style={{ marginLeft: 14, height: 20, flex: m ? 1 : 'none', width: m ? undefined : 260, borderRadius: 6, background: P.surface, border: `1px solid ${P.border}` }} />
      </div>
      <div style={{ display: 'flex', height: m ? 250 : 400 }}>
        {!m && (
          <aside style={{ width: 196, borderRight: `1px solid ${P.border}`, padding: 16, display: 'grid', alignContent: 'start', gap: 6, background: P.alt }}>
            {['Início', 'Meus projetos', 'Quadro', 'Calendário', 'Relatórios', 'Equipe'].map((l, i) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 13.5, background: i === 2 ? withAlpha(P.primary, 0.12) : 'transparent', color: i === 2 ? P.primary : P.muted, fontWeight: i === 2 ? 650 : 500 }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: 'currentColor', opacity: 0.5 }} />
                {l}
              </span>
            ))}
          </aside>
        )}
        <div style={{ flex: 1, padding: m ? 14 : 22, display: 'grid', gridTemplateRows: 'auto 1fr', gap: 14, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ fontSize: m ? 15 : 17 }}>Sprint 14</strong>
            <Avatars n={3} size={24} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))`, gap: 12, minHeight: 0 }}>
            {cols.map((col, ci) => (
              <div key={col} style={{ background: P.alt, borderRadius: 10, padding: 10, display: 'grid', alignContent: 'start', gap: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 650, color: P.muted }}>
                  {col} · {3 - ci}
                </span>
                {Array.from({ length: 3 - ci }, (_, i) => (
                  <div key={i} style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 8, padding: 10, display: 'grid', gap: 7 }}>
                    <span style={{ width: 36, height: 6, borderRadius: 3, background: tags[(ci + i) % 3] }} />
                    <span style={{ height: 6, borderRadius: 3, background: P.border, width: `${80 - i * 12}%` }} />
                    <span style={{ height: 6, borderRadius: 3, background: P.border, width: '50%' }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseCards() {
  const { P, m, c } = useL()
  const list = c.items.slice(0, m ? 2 : 3)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 14 : 24, margin: m ? '36px 0 0' : '64px auto 0', maxWidth: 1000, textAlign: 'left', alignItems: 'end' }}>
      {list.map((name, i) => (
        <div key={name} style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: P.rl, padding: 12, display: 'grid', gap: 10, transform: !m && i === 1 ? 'translateY(-24px)' : undefined, boxShadow: i === 1 ? '0 24px 48px -28px rgba(20,30,70,.4)' : 'none' }}>
          <Pic h={m ? 110 : 140} tone={i} motif={i === 1 ? 'shapes' : 'book'} />
          <strong style={{ fontSize: 15.5 }}>{name}</strong>
          <span style={{ fontSize: 13, color: P.muted }}>{24 - i * 6} aulas · {8 - i * 2} h · certificado</span>
          <span style={{ height: 6, borderRadius: 3, background: P.border, overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${[64, 38, 82][i]}%`, background: P.primary }} />
          </span>
        </div>
      ))}
    </div>
  )
}

function HeroCentered() {
  const { P, m, c, compact } = useL()
  const v0 = c.variant === 0
  return (
    <>
      <Header />
      <section style={{ textAlign: 'center', padding: m ? '44px 0 0' : '84px 0 0', background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${withAlpha(P.primary, 0.13)}, transparent 70%)` }}>
        <Wrap>
          <Pill>{c.eyebrow}</Pill>
          <h1 style={h(P, m ? 34 : 64, { maxWidth: m ? undefined : '15ch', margin: '22px auto 0' })}>{c.title}</h1>
          <p style={{ color: P.muted, fontSize: m ? 16 : 19, maxWidth: 580, margin: '18px auto 0' }}>{c.subtitle}</p>
          <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 12, justifyContent: 'center', marginTop: 30 }}>
            <Btn size="lg" block={m}>
              {c.cta}
              <ArrowRight size={18} />
            </Btn>
            <Btn size="lg" kind="secondary" block={m}>
              <Play size={16} />
              {c.ctaAlt}
            </Btn>
          </div>
          <p style={{ fontSize: 13.5, color: P.muted, marginTop: 14 }}>
            {c.stats[0].value} {c.stats[0].label} · sem cartão de crédito
          </p>
          {v0 ? <AppMock /> : <CourseCards />}
        </Wrap>
        {!v0 && <div style={{ height: m ? 48 : 80 }} />}
      </section>
      {!compact && (
        <>
          {v0 ? (
            <section style={{ padding: m ? '72px 0 24px' : '150px 0 32px', textAlign: 'center' }}>
              <Wrap>
                <p style={{ fontSize: 14, color: P.muted, marginBottom: 22 }}>Equipes que já trabalham no fluxo</p>
                <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(3, minmax(0, 1fr))' : `repeat(${c.items.length}, minmax(0, 1fr))`, gap: m ? 18 : 24, alignItems: 'center' }}>
                  {c.items.map((n, i) => (
                    <span key={n} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: P.heading, fontWeight: 700, fontSize: m ? 16 : 20, color: P.muted, opacity: 0.8 }}>
                      <span style={{ width: 16, height: 16, borderRadius: i % 2 ? 99 : 4, background: P.muted, opacity: 0.6 }} />
                      {n}
                    </span>
                  ))}
                </div>
              </Wrap>
            </section>
          ) : (
            <section style={{ padding: m ? '40px 0' : '56px 0', borderTop: `1px solid ${P.border}`, borderBottom: `1px solid ${P.border}` }}>
              <Wrap>
                <StatsRow />
              </Wrap>
            </section>
          )}
          <FeatureGrid />
          <QuoteBlock />
          <ClosingBand />
          <Footer />
        </>
      )}
    </>
  )
}

/* ========================================================================== */
/* 2. Hero dividido                                                            */
/* ========================================================================== */

function SplitVisualCards() {
  const { P, m, c } = useL()
  return (
    <div style={{ position: 'relative', height: m ? 280 : 470, borderRadius: P.rl * 1.4, background: `linear-gradient(160deg, ${mix(P.primary, P.bg, 0.82)}, ${mix(P.accent, P.bg, 0.78)})`, overflow: 'hidden' }}>
      <Motif kind={c.motif} a={P.primary} b={P.accent} c={P.surface} d={P.text} style={{ position: 'absolute', inset: '14% 10% 6%', width: '80%', height: '80%' }} />
      <div style={{ position: 'absolute', left: m ? 14 : 28, top: m ? 16 : 40, background: P.surface, borderRadius: P.r, padding: m ? '10px 12px' : '14px 16px', display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 18px 40px -22px rgba(0,0,0,.45)', maxWidth: '75%' }}>
        <span style={{ width: 34, height: 34, borderRadius: 99, background: withAlpha(P.primary, 0.14), color: P.primary, display: 'grid', placeItems: 'center', flex: 'none' }}>
          <Check size={18} />
        </span>
        <span style={{ display: 'grid', fontSize: 13.5, lineHeight: 1.3 }}>
          <strong>{c.items[0]}</strong>
          <span style={{ color: P.muted }}>{c.items[1]}</span>
        </span>
      </div>
      <div style={{ position: 'absolute', right: m ? 14 : 28, bottom: m ? 16 : 36, background: P.surface, borderRadius: P.r, padding: m ? '10px 12px' : '14px 16px', display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 18px 40px -22px rgba(0,0,0,.45)' }}>
        <Avatars n={1} size={34} />
        <span style={{ display: 'grid', fontSize: 13.5, lineHeight: 1.3 }}>
          <strong>{c.items[2] ?? c.logo}</strong>
          <span style={{ color: P.accent, display: 'flex', gap: 2 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
            ))}
          </span>
        </span>
      </div>
    </div>
  )
}

function HeroSplit() {
  const { P, m, c, compact } = useL()
  const v1 = c.variant === 1
  const text = (
    <div style={{ display: 'grid', gap: 18, alignContent: 'center', order: m && v1 ? 2 : 1, padding: m && v1 ? '0 20px' : 0 }}>
      <span style={{ fontSize: 14, fontWeight: 650, color: P.primary }}>{c.eyebrow}</span>
      <h1 style={h(P, m ? 34 : 58, { maxWidth: '13ch' })}>{c.title}</h1>
      <p style={{ color: P.muted, fontSize: m ? 16 : 18.5, maxWidth: 500 }}>{c.subtitle}</p>
      <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 12, marginTop: 6 }}>
        <Btn size="lg" block={m}>
          {c.cta}
        </Btn>
        <Btn size="lg" kind="secondary" block={m}>
          {c.ctaAlt}
        </Btn>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 14, color: P.muted }}>
        <Avatars n={4} size={30} ring={P.bg} />
        <span>
          <strong style={{ color: P.text }}>{c.stats[0].value}</strong> {c.stats[0].label} · {c.stats[1].value} {c.stats[1].label}
        </span>
      </div>
    </div>
  )
  const bleed = (
    <div style={{ order: m ? 1 : 2, position: 'relative' }}>
      <Pic h={m ? 260 : 520} tone={1} radius={0} motifSize="56%" style={{ borderRadius: m ? 0 : `${P.rl * 1.4}px 0 0 ${P.rl * 1.4}px` }} />
      <div style={{ position: 'absolute', left: m ? 16 : -28, bottom: m ? 16 : 48, background: P.surface, padding: '12px 16px', borderRadius: P.r, boxShadow: '0 18px 40px -22px rgba(0,0,0,.45)', display: 'grid', fontSize: 13.5 }}>
        <strong>{c.items[0].split(' — ')[0]}</strong>
        <span style={{ color: P.primary, fontWeight: 650 }}>{c.items[0].split(' — ')[1]}</span>
      </div>
    </div>
  )
  return (
    <>
      <Header mobileCta />
      {v1 ? (
        <section style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1.05fr) minmax(0, 1fr)', gap: m ? 28 : 64, alignItems: 'center', padding: m ? '0 0 48px' : '56px 0 88px', paddingLeft: m ? 0 : 'max(56px, calc((100% - 1160px) / 2))' }}>
          {text}
          {bleed}
        </section>
      ) : (
        <section style={{ padding: m ? '28px 0 48px' : '72px 0 96px' }}>
          <Wrap style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1.05fr) minmax(0, 1fr)', gap: m ? 32 : 56, alignItems: 'center' }}>
            {text}
            <div style={{ order: 2 }}>
              <SplitVisualCards />
            </div>
          </Wrap>
        </section>
      )}
      {!compact && (
        <>
          <section style={{ padding: m ? '56px 0' : '88px 0', background: P.alt }}>
            <Wrap>
              <SectionTitle eyebrow="Como funciona" title="Três passos e pronto" />
              <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 0 : 32, position: 'relative' }}>
                {c.features.slice(0, 3).map((f, i) => (
                  <div key={f.title} style={{ display: 'grid', gridTemplateColumns: m ? '44px 1fr' : '1fr', gap: m ? 16 : 14, position: 'relative', paddingBottom: m ? 26 : 0 }}>
                    <span style={{ width: 44, height: 44, borderRadius: 99, background: P.primary, color: P.onPrimary, display: 'grid', placeItems: 'center', fontWeight: 700, position: 'relative', zIndex: 1 }}>{i + 1}</span>
                    {!m && i < 2 && <span style={{ position: 'absolute', top: 22, left: 60, right: -20, height: 2, background: P.border }} />}
                    {m && i < 2 && <span style={{ position: 'absolute', left: 21, top: 48, bottom: 4, width: 2, background: P.border }} />}
                    <div style={{ display: 'grid', gap: 6 }}>
                      <h3 style={h(P, 19)}>{f.title}</h3>
                      <p style={{ color: P.muted, fontSize: 15 }}>{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Wrap>
          </section>
          <section style={{ padding: m ? '56px 0' : '96px 0' }}>
            <Wrap style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: m ? 28 : 64, alignItems: 'center' }}>
              <Pic h={m ? 240 : 400} tone={2} radius={P.rl} />
              <div style={{ display: 'grid', gap: 18 }}>
                <h2 style={h(P, m ? 28 : 40)}>Tudo o que você precisa, sem complicação</h2>
                {c.features.map((f) => (
                  <div key={f.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ width: 26, height: 26, borderRadius: 99, background: withAlpha(P.primary, 0.14), color: P.primary, display: 'grid', placeItems: 'center', flex: 'none', marginTop: 2 }}>
                      <Check size={15} />
                    </span>
                    <span style={{ fontSize: 15.5 }}>
                      <strong>{f.title}.</strong> <span style={{ color: P.muted }}>{f.text}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Wrap>
          </section>
          {v1 ? (
            <QuoteBlock serif />
          ) : (
            <section style={{ padding: m ? '40px 0' : '64px 0', borderTop: `1px solid ${P.border}` }}>
              <Wrap>
                <StatsRow cols={3} />
              </Wrap>
            </section>
          )}
          <section style={{ padding: m ? '40px 0 56px' : '64px 0 96px' }}>
            <Wrap>
              <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: m ? 'stretch' : 'center', justifyContent: 'space-between', gap: 24, padding: m ? 24 : 44, borderRadius: P.rl * 1.3, background: withAlpha(P.primary, 0.09), border: `1px solid ${withAlpha(P.primary, 0.2)}` }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <h2 style={h(P, m ? 24 : 32)}>{c.closing.title}</h2>
                  <p style={{ color: P.muted }}>{c.closing.text}</p>
                </div>
                <Btn size="lg" block={m}>
                  {c.cta}
                </Btn>
              </div>
            </Wrap>
          </section>
          <Footer />
        </>
      )}
    </>
  )
}

/* ========================================================================== */
/* 3. Composição assimétrica                                                   */
/* ========================================================================== */

function Highlighted({ title, mode }: { title: string; mode: 'italic' | 'underline' }) {
  const { P } = useL()
  const words = title.split(' ')
  const k = Math.min(2, words.length - 1)
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          {i === k ? (
            mode === 'italic' ? (
              <em style={{ fontStyle: 'italic', color: P.accent === P.bg ? P.primary : mix(P.accent, P.text, 0.25), fontWeight: 500 }}>{w}</em>
            ) : (
              <span style={{ boxShadow: `inset 0 -0.22em 0 ${P.primary}` }}>{w}</span>
            )
          ) : (
            w
          )}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}

function Asymmetric() {
  const { P, m, c, compact } = useL()
  const v1 = c.variant === 1
  const shapes = v1 && (
    <>
      <span style={{ position: 'absolute', width: m ? 120 : 220, height: m ? 120 : 220, borderRadius: 999, background: P.primary, top: m ? -24 : -40, right: m ? -24 : -60 }} />
      <span style={{ position: 'absolute', width: m ? 90 : 150, height: m ? 90 : 150, background: P.accent, bottom: m ? -20 : -36, left: m ? -14 : -44 }} />
    </>
  )
  const tall = (
    <div style={{ position: 'relative' }}>
      {shapes}
      <Pic h={m ? 320 : 460} tone={v1 ? 3 : 2} radius={P.r} style={{ position: 'relative' }} />
    </div>
  )
  const cards = c.features.slice(0, 3)
  const stagger = (
    <section style={{ padding: m ? '56px 0' : '120px 0 200px' }}>
      <Wrap>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 28 : 32 }}>
          {cards.map((f, i) => (
            <article key={f.title} style={{ display: 'grid', gap: 12, transform: m ? undefined : `translateY(${i * 48}px)`, marginLeft: m && i % 2 ? 40 : 0, marginRight: m && i % 2 === 0 ? 24 : 0 }}>
              <Pic h={m ? 200 : 260} tone={i + 1} radius={P.r} motifSize="52%" />
              <span style={{ fontSize: 13, color: P.muted }}>0{i + 1}</span>
              <h3 style={h(P, 24)}>{f.title}</h3>
              <p style={{ color: P.muted, fontSize: 15 }}>{f.text}</p>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  )
  const quote = (
    <section style={{ padding: m ? '40px 0' : '64px 0 96px' }}>
      <Wrap>
        <div style={{ marginLeft: m ? 0 : '25%', paddingLeft: m ? 18 : 0, borderLeft: m ? `3px solid ${P.accent}` : 'none', display: 'grid', gap: 18 }}>
          <blockquote style={{ ...h(P, m ? 24 : 40, { fontWeight: 500, maxWidth: '24ch' }), margin: 0 }}>“{c.quote.text}”</blockquote>
          <span style={{ justifySelf: 'end', color: P.muted, fontSize: 15 }}>— {c.quote.author}</span>
        </div>
      </Wrap>
    </section>
  )
  const bleed = (
    <section style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 0.8fr) minmax(0, 1.4fr)', gap: m ? 24 : 64, alignItems: 'center', padding: m ? '40px 0' : '64px 0', paddingLeft: m ? 0 : 'max(56px, calc((100% - 1160px) / 2))' }}>
      <div style={{ display: 'grid', gap: 18, padding: m ? '0 20px' : 0 }}>
        <h2 style={h(P, m ? 28 : 40)}>{v1 ? 'Um processo em três atos' : 'Cuidado do vaso à janela'}</h2>
        {c.stats.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 12, borderTop: `1px solid ${P.border}`, paddingTop: 12 }}>
            <strong style={h(P, 26, { color: P.primary })}>{s.value}</strong>
            <span style={{ color: P.muted }}>{s.label}</span>
          </div>
        ))}
      </div>
      <Pic h={m ? 260 : 440} tone={0} radius={0} style={{ marginLeft: m ? 40 : 0 }} />
    </section>
  )
  return (
    <>
      <Header border={false} navAlign="right" mark={v1} ctaKind={v1 ? 'primary' : 'secondary'} showCta={v1} />
      <section style={{ padding: m ? '20px 0 40px' : '40px 0 120px', overflow: 'hidden' }}>
        <Wrap>
          {m ? (
            <div style={{ display: 'grid', gap: 22 }}>
              <span style={{ fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: P.muted }}>{c.eyebrow}</span>
              <h1 style={h(P, 42)}>
                <Highlighted title={c.title} mode={v1 ? 'underline' : 'italic'} />
              </h1>
              <div style={{ marginLeft: 40 }}>{tall}</div>
              <div style={{ marginRight: 24, display: 'grid', gap: 14 }}>
                <p style={{ color: P.muted, fontSize: 16 }}>{c.subtitle}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 650, color: P.primary }}>
                  {c.cta} <ArrowRight size={17} />
                </span>
              </div>
              <Pic h={150} tone={1} motif={v1 ? 'shapes' : 'leaf'} radius={P.r} style={{ width: '62%', marginLeft: 'auto' }} motifSize="50%" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', columnGap: 24, position: 'relative' }}>
              <div style={{ gridColumn: '1 / 9', gridRow: 1, paddingTop: 48, display: 'grid', gap: 22, alignContent: 'start' }}>
                <span style={{ fontSize: 13.5, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted }}>{c.eyebrow}</span>
                <h1 style={h(P, 92, { lineHeight: 0.96 })}>
                  <Highlighted title={c.title} mode={v1 ? 'underline' : 'italic'} />
                </h1>
              </div>
              <div style={{ gridColumn: '9 / 13', gridRow: '1 / 3', marginTop: 96 }}>{tall}</div>
              <div style={{ gridColumn: '2 / 6', gridRow: 2, marginTop: 36, display: 'grid', gap: 18, alignContent: 'start' }}>
                <p style={{ color: P.muted, fontSize: 18 }}>{c.subtitle}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 650, color: P.primary, fontSize: 16 }}>
                  {c.cta} <ArrowRight size={18} />
                </span>
              </div>
              <div style={{ gridColumn: '6 / 9', gridRow: 2, marginTop: 60, position: 'relative', zIndex: 1 }}>
                <Pic h={200} tone={1} motif={v1 ? 'shapes' : 'leaf'} radius={P.r} motifSize="46%" style={{ transform: 'translateY(40px)', boxShadow: `0 0 0 10px ${P.bg}` }} />
              </div>
            </div>
          )}
        </Wrap>
      </section>
      {!compact && (
        <>
          {stagger}
          {v1 ? (
            <>
              {bleed}
              {quote}
            </>
          ) : (
            <>
              {quote}
              {bleed}
            </>
          )}
          <section style={{ padding: m ? '48px 0 64px' : '96px 0 120px' }}>
            <Wrap style={{ display: 'grid', gap: 20 }}>
              <h2 style={h(P, m ? 34 : 72, { maxWidth: '16ch' })}>{c.closing.title}</h2>
              <p style={{ color: P.muted, fontSize: m ? 16 : 18, maxWidth: 520 }}>{c.closing.text}</p>
              <div>
                <Btn size="lg" block={m}>
                  {c.cta}
                  <ArrowRight size={18} />
                </Btn>
              </div>
            </Wrap>
          </section>
          <Footer simple />
        </>
      )}
    </>
  )
}

/* ========================================================================== */
/* 4. Apresentação de produto                                                  */
/* ========================================================================== */

function Stage({ height, children }: { height: number; children?: ReactNode }) {
  const { P, c } = useL()
  return (
    <div style={{ position: 'relative', height, display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', width: height * 0.92, height: height * 0.92, maxWidth: '100%', borderRadius: 999, background: `radial-gradient(circle, ${withAlpha(P.accent, P.dark ? 0.32 : 0.45)} 0%, ${withAlpha(P.primary, 0.1)} 55%, transparent 72%)` }} />
      <Motif kind={c.motif} a={P.dark ? mix(P.primary, P.surface, 0.1) : P.primary} b={P.accent} c={P.surface} d={P.text} style={{ position: 'relative', width: '86%', height: '86%' }} />
      {children}
    </div>
  )
}

function Swatches() {
  const { P } = useL()
  const list = [P.primary, P.text, mix(P.accent, P.bg, 0.3)]
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {list.map((col, i) => (
        <span key={i} style={{ width: 28, height: 28, borderRadius: 99, background: col, boxShadow: i === 0 ? `0 0 0 2px ${P.bg}, 0 0 0 4px ${P.primary}` : `inset 0 0 0 1px ${P.border}` }} />
      ))}
    </div>
  )
}

function Product() {
  const { P, m, c, compact } = useL()
  const v1 = c.variant === 1
  const price = c.closing.title.match(/R\$ ?[\d.]+/)?.[0] ?? ''
  const callouts = (
    <section style={{ padding: m ? '48px 0' : '96px 0', background: P.alt }}>
      <Wrap>
        <SectionTitle eyebrow="Destaques" title={`Cada detalhe do ${c.title}`} center />
        {m ? (
          <div style={{ display: 'grid', gap: 18 }}>
            <Stage height={240} />
            {c.features.map((f, i) => (
              <div key={f.title} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 12 }}>
                <span style={{ width: 28, height: 28, borderRadius: 99, background: P.primary, color: P.onPrimary, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 }}>{i + 1}</span>
                <span>
                  <strong>{f.title}</strong>
                  <span style={{ display: 'block', color: P.muted, fontSize: 14.5 }}>{f.text}</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 1fr)', alignItems: 'center', gap: 24 }}>
            {[0, 1].map((side) => (
              <div key={side} style={{ display: 'grid', gap: 64, order: side === 0 ? 1 : 3, textAlign: side === 0 ? 'right' : 'left' }}>
                {c.features.slice(side * 2, side * 2 + 2).map((f) => (
                  <div key={f.title} style={{ display: 'grid', gap: 6, position: 'relative' }}>
                    <strong style={{ fontSize: 17 }}>{f.title}</strong>
                    <span style={{ color: P.muted, fontSize: 14.5 }}>{f.text}</span>
                    <span style={{ position: 'absolute', top: 10, [side === 0 ? 'right' : 'left']: -88, width: 72, borderTop: `1px dashed ${P.borderStrong}` }} />
                    <span style={{ position: 'absolute', top: 6, [side === 0 ? 'right' : 'left']: -96, width: 9, height: 9, borderRadius: 9, background: P.primary }} />
                  </div>
                ))}
              </div>
            ))}
            <div style={{ order: 2 }}>
              <Stage height={420} />
            </div>
          </div>
        )}
      </Wrap>
    </section>
  )
  const specs = (
    <section style={{ padding: m ? '48px 0' : '88px 0' }}>
      <Wrap>
        <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 24 : 32 }}>
          {c.stats.map((s) => (
            <div key={s.label} style={{ borderTop: `2px solid ${P.text}`, paddingTop: 16, display: 'grid', gap: 4 }}>
              <span style={h(P, m ? 32 : 52)}>{s.value}</span>
              <span style={{ color: P.muted, fontSize: 14.5 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
  return (
    <div style={{ position: 'relative' }}>
      <Header ctaLabel="Comprar" />
      <div style={{ borderBottom: `1px solid ${P.border}`, background: P.surface }}>
        <Wrap style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52, gap: 12 }}>
          <strong style={{ fontSize: 16 }}>{c.title}</strong>
          <span style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, color: P.muted }}>
            <span>A partir de {price}</span>
            {!m && (
              <Btn size="sm" style={{ height: 32 }}>
                {c.cta}
              </Btn>
            )}
          </span>
        </Wrap>
      </div>
      {v1 ? (
        <section style={{ padding: m ? '20px 0 40px' : '48px 0 80px' }}>
          <Wrap style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: m ? 18 : 56, alignItems: 'center' }}>
            <Stage height={m ? 300 : 540} />
            <div style={{ display: 'grid', gap: 16 }}>
              <span style={{ fontSize: 14, color: P.primary, fontWeight: 650, letterSpacing: '.06em', textTransform: 'uppercase' }}>{c.eyebrow}</span>
              <h1 style={h(P, m ? 44 : 72)}>{c.title}</h1>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: P.muted }}>
                <span style={{ display: 'flex', color: P.primary }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                4,8 · 1.284 avaliações
              </span>
              <p style={{ color: P.muted, fontSize: m ? 15.5 : 17 }}>{c.subtitle}</p>
              <strong style={h(P, m ? 28 : 34)}>{price}</strong>
              <span style={{ fontSize: 14, color: P.muted }}>Cor: dourado</span>
              <Swatches />
              <div style={{ display: 'grid', gap: 10, marginTop: 6 }}>
                <Btn size="lg" block>
                  {c.cta}
                </Btn>
                <Btn size="lg" kind="secondary" block>
                  <Play size={16} /> {c.ctaAlt}
                </Btn>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: P.muted }}>
                <Truck size={16} /> Frete grátis e 30 dias para devolver
              </span>
            </div>
          </Wrap>
        </section>
      ) : (
        <section style={{ padding: m ? '36px 0 24px' : '64px 0 40px', textAlign: 'center' }}>
          <Wrap style={{ display: 'grid', justifyItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 14, color: P.primary, fontWeight: 650 }}>{c.eyebrow}</span>
            <h1 style={h(P, m ? 46 : 84)}>{c.title}</h1>
            <p style={{ color: P.muted, fontSize: m ? 16 : 19, maxWidth: 560 }}>{c.subtitle}</p>
            <span style={{ fontSize: 15 }}>
              A partir de <strong>{price}</strong> ou 12x sem juros
            </span>
            <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: 'center', gap: m ? 14 : 22, marginTop: 6, width: m ? '100%' : undefined }}>
              <Btn size="lg" block={m}>
                {c.cta}
              </Btn>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: P.primary, fontWeight: 600 }}>
                {c.ctaAlt} <ArrowRight size={16} />
              </span>
            </div>
            <div style={{ width: '100%', maxWidth: 640 }}>
              <Stage height={m ? 300 : 440} />
            </div>
            <Swatches />
            <span style={{ fontSize: 13.5, color: P.muted }}>Inox escovado · Grafite · Branco</span>
          </Wrap>
        </section>
      )}
      {!compact && (
        <>
          {v1 ? (
            <>
              {specs}
              {callouts}
            </>
          ) : (
            <>
              {callouts}
              {specs}
            </>
          )}
          <section style={{ padding: m ? '48px 0' : '88px 0', background: P.alt }}>
            <Wrap>
              <SectionTitle eyebrow="Compare" title="Escolha o modelo ideal" center />
              <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 14 : 24 }}>
                {c.items.map((it, i) => {
                  const [name, value] = it.split(' — ')
                  return (
                    <div key={it} style={{ background: P.surface, border: `1px solid ${i === 0 ? P.primary : P.border}`, borderRadius: P.rl, padding: m ? 20 : 28, display: 'grid', gap: 12, justifyItems: 'center', textAlign: 'center' }}>
                      <div style={{ width: '100%', height: m ? 120 : 160 }}>
                        <Motif kind={c.motif} a={P.dark ? mix(P.primary, P.surface, 0.1) : P.primary} b={P.accent} c={P.surface} d={P.text} style={{ width: '100%', height: '100%' }} />
                      </div>
                      <strong style={{ fontSize: 18 }}>{name}</strong>
                      <span style={{ color: P.muted }}>{value}</span>
                      <div style={{ display: 'grid', gap: 6, fontSize: 14, color: P.muted }}>
                        {c.stats.slice(0, 3 - (i === 2 ? 1 : 0)).map((s) => (
                          <span key={s.label}>
                            {s.value} {s.label}
                          </span>
                        ))}
                      </div>
                      <Btn kind={i === 0 ? 'primary' : 'secondary'} size="sm">
                        Comprar
                      </Btn>
                    </div>
                  )
                })}
              </div>
            </Wrap>
          </section>
          <section style={{ padding: m ? '56px 0' : '96px 0', textAlign: 'center' }}>
            <Wrap style={{ display: 'grid', justifyItems: 'center', gap: 14 }}>
              <h2 style={h(P, m ? 28 : 44)}>{c.closing.title}</h2>
              <p style={{ color: P.muted }}>{c.closing.text}</p>
              <Btn size="lg">{c.cta}</Btn>
            </Wrap>
          </section>
          <Footer />
          {m && (
            <div style={{ position: 'sticky', bottom: 0, zIndex: 6, background: P.surface, borderTop: `1px solid ${P.border}`, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ display: 'grid', lineHeight: 1.2 }}>
                <strong>{price}</strong>
                <span style={{ fontSize: 12.5, color: P.muted }}>{c.title}</span>
              </span>
              <Btn>{c.cta}</Btn>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ========================================================================== */
/* 5. Layout editorial                                                         */
/* ========================================================================== */

function Editorial() {
  const { P, m, c, compact, live } = useL()
  const [open, setOpen] = useState(false)
  const v1 = c.variant === 1
  const rule = withAlpha(P.text, 0.18)
  const kicker: CSSProperties = { fontSize: 12.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: P.accent === P.bg ? P.primary : mix(P.accent, P.text, 0.15) }
  return (
    <>
      <header style={{ position: 'relative', borderBottom: `1px solid ${P.text}` }}>
        <Wrap>
          {m ? (
            <div style={{ display: 'grid', gridTemplateColumns: '42px 1fr auto', alignItems: 'center', height: 64 }}>
              <Hamburger color={P.text} open={open} onToggle={() => setOpen((o) => !o)} />
              <span style={h(P, 30, { textAlign: 'center', letterSpacing: '-0.02em' })}>{c.logo}</span>
              <Btn size="sm" kind="primary" style={{ height: 34, padding: '0 12px', fontSize: 13 }}>
                Assinar
              </Btn>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 44, fontSize: 13, color: P.muted, borderBottom: `1px solid ${rule}` }}>
                <span style={{ letterSpacing: '.08em', textTransform: 'uppercase' }}>{v1 ? 'Sexta-feira · receitas novas toda semana' : c.eyebrow}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Search size={16} />
                  <Btn size="sm" style={{ height: 32 }}>
                    Assinar
                  </Btn>
                </span>
              </div>
              <div style={{ textAlign: 'center', padding: '26px 0 22px' }}>
                <span style={h(P, 68, { letterSpacing: '-0.03em' })}>{c.logo}</span>
              </div>
            </>
          )}
        </Wrap>
        <div style={{ borderTop: `1px solid ${rule}` }}>
          <Wrap>
            <nav className="ent-hscroll" style={{ display: 'flex', justifyContent: m ? 'flex-start' : 'center', gap: m ? 20 : 34, height: 46, alignItems: 'center', overflowX: m && live ? 'auto' : 'hidden', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 650, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              {c.nav.map((n, i) => (
                <span key={n} style={{ borderBottom: i === 0 ? `2px solid ${P.text}` : '2px solid transparent', paddingBottom: 3 }}>
                  {n}
                </span>
              ))}
            </nav>
          </Wrap>
        </div>
        {m && open && (
          <div style={{ position: 'absolute', top: 64, left: 0, right: 0, zIndex: 5, background: P.surface, borderBottom: `1px solid ${P.border}`, padding: '12px 20px 20px', display: 'grid', gap: 12 }}>
            <span style={{ fontSize: 13, color: P.muted }}>{c.eyebrow}</span>
            {['Edição atual', 'Arquivo', 'Newsletter', 'Sobre'].map((x) => (
              <span key={x} style={{ fontSize: 17, padding: '8px 0', borderBottom: `1px solid ${P.border}` }}>
                {x}
              </span>
            ))}
          </div>
        )}
      </header>
      <section style={{ padding: m ? '24px 0 40px' : '44px 0 64px' }}>
        <Wrap style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 2fr) minmax(0, 1fr)', gap: m ? 28 : 0 }}>
          <article style={{ display: 'grid', gap: 14, paddingRight: m ? 0 : 40, borderRight: m ? 'none' : `1px solid ${rule}` }}>
            <Pic h={m ? 230 : 400} tone={v1 ? 1 : 3} radius={P.r} motifSize={v1 ? '48%' : '40%'} />
            {v1 && <span style={{ fontSize: 13, fontStyle: 'italic', color: P.muted }}>Foto: moqueca servida na panela de barro.</span>}
            <span style={kicker}>{v1 ? c.eyebrow : 'Capa · Cidades'}</span>
            <h1 style={h(P, m ? 30 : 46, { maxWidth: '22ch' })}>{c.title}</h1>
            <p style={{ fontSize: m ? 17 : 19, color: P.muted, maxWidth: '60ch' }}>{c.subtitle}</p>
            <span style={{ fontSize: 13.5, color: P.muted }}>{v1 ? 'Por Dora Assunção · 50 min' : 'Por Lia Monteiro · 12 min de leitura'}</span>
          </article>
          <aside style={{ paddingLeft: m ? 0 : 36, display: 'grid', alignContent: 'start', gap: 0 }}>
            {v1 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', borderTop: `2px solid ${P.text}`, borderBottom: `1px solid ${rule}`, padding: '14px 0', marginBottom: 18 }}>
                  {c.stats.map((s) => (
                    <span key={s.label} style={{ display: 'grid', textAlign: 'center' }}>
                      <strong style={h(P, 22)}>{s.value}</strong>
                      <span style={{ fontSize: 12.5, color: P.muted }}>{s.label}</span>
                    </span>
                  ))}
                </div>
                <h2 style={h(P, 22, { marginBottom: 10 })}>Ingredientes</h2>
                {c.items.map((it) => (
                  <span key={it} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: `1px solid ${rule}`, fontSize: 15.5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 9, background: P.primary, marginTop: 9, flex: 'none' }} />
                    {it}
                  </span>
                ))}
                <div style={{ marginTop: 18 }}>
                  <Btn kind="secondary" block>
                    Ver modo de preparo
                  </Btn>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ ...kicker, color: P.text, borderTop: `2px solid ${P.text}`, paddingTop: 12, marginBottom: 6 }}>Mais lidas</h2>
                {c.items.map((it, i) => (
                  <div key={it} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 10, padding: '16px 0', borderBottom: `1px solid ${rule}` }}>
                    <span style={h(P, 30, { color: kicker.color })}>{i + 1}</span>
                    <span style={h(P, 18, { fontWeight: 560 })}>{it}</span>
                  </div>
                ))}
              </>
            )}
          </aside>
        </Wrap>
      </section>
      {!compact && (
        <>
          <section style={{ padding: m ? '8px 0 40px' : '8px 0 72px' }}>
            <Wrap>
              <div style={{ borderTop: `2px solid ${P.text}`, paddingTop: 14, marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h2 style={h(P, m ? 22 : 26)}>{v1 ? 'Para ler com fome' : 'Nesta edição'}</h2>
                <span style={{ fontSize: 13.5, color: P.muted }}>Ver tudo →</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))' }}>
                {c.features.map((f, i) => (
                  <article key={f.text} style={{ display: 'grid', gap: 10, padding: m ? '18px 0' : `0 ${i === 2 ? 0 : 28}px 0 ${i === 0 ? 0 : 28}px`, borderLeft: !m && i > 0 ? `1px solid ${rule}` : 'none', borderTop: m && i > 0 ? `1px solid ${rule}` : 'none' }}>
                    <Pic h={m ? 180 : 170} tone={i} radius={P.r} motif={i === 0 ? (v1 ? 'plate' : 'shapes') : i === 1 ? (v1 ? 'jar' : 'house') : v1 ? 'cup' : 'envelope'} motifSize="44%" />
                    <span style={kicker}>{f.title}</span>
                    <h3 style={h(P, 22, { fontWeight: 600 })}>{f.text}</h3>
                    <span style={{ fontSize: 14, color: P.muted }}>Leitura de {6 + i * 3} minutos</span>
                  </article>
                ))}
              </div>
            </Wrap>
          </section>
          <section style={{ padding: m ? '8px 0 40px' : '16px 0 72px' }}>
            <Wrap>
              <figure style={{ margin: 0, borderTop: `1px solid ${P.text}`, borderBottom: `1px solid ${P.text}`, padding: m ? '28px 0' : '48px 0', textAlign: 'center', display: 'grid', gap: 16 }}>
                <blockquote style={{ ...h(P, m ? 24 : 42, { fontStyle: 'italic', fontWeight: 500, maxWidth: '26ch', margin: '0 auto' }) }}>“{c.quote.text}”</blockquote>
                <figcaption style={{ fontSize: 14, color: P.muted, letterSpacing: '.06em', textTransform: 'uppercase' }}>{c.quote.author}</figcaption>
              </figure>
            </Wrap>
          </section>
          <section style={{ padding: m ? '0 0 48px' : '0 0 88px' }}>
            <Wrap>
              <div style={{ border: `1px solid ${P.text}`, borderRadius: P.r, padding: m ? 22 : 36, display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20, alignItems: 'center' }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <h2 style={h(P, m ? 24 : 30)}>{c.closing.title}</h2>
                  <p style={{ color: P.muted }}>{c.closing.text}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 10 }}>
                  <span style={{ flex: 1, height: 46, borderRadius: Math.min(P.r, 10), border: `1px solid ${P.borderStrong}`, display: 'flex', alignItems: 'center', padding: '0 14px', color: P.muted, fontSize: 15, background: P.surface }}>seu@email.com</span>
                  <Btn>{c.cta.split(' ')[0]}</Btn>
                </div>
              </div>
            </Wrap>
          </section>
          <Footer />
        </>
      )}
    </>
  )
}

/* ========================================================================== */
/* 6. Página cinematográfica                                                   */
/* ========================================================================== */

function Stars({ seed, n }: { seed: number; n: number }) {
  const r = seeded(seed, n * 3)
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} style={{ position: 'absolute', left: `${r[i * 3] * 100}%`, top: `${r[i * 3 + 1] * 100}%`, width: r[i * 3 + 2] > 0.8 ? 3 : 2, height: r[i * 3 + 2] > 0.8 ? 3 : 2, borderRadius: 9, background: '#ffffff', opacity: 0.35 + r[i * 3 + 2] * 0.6 }} />
      ))}
    </>
  )
}

function Scene({ height, tone = 0, children, motif, motifStyle, align = 'left' }: { height: number; tone?: number; children?: ReactNode; motif?: MotifKind; motifStyle?: CSSProperties; align?: 'left' | 'right' | 'center' }) {
  const { P, c } = useL()
  const s = P.scene
  const bgs = [
    `linear-gradient(180deg, ${mix(s, P.accent, 0.28)} 0%, ${s} 62%)`,
    `radial-gradient(ellipse at 70% 30%, ${mix(s, P.primary, 0.4)} 0%, ${s} 70%)`,
    `linear-gradient(120deg, ${s} 20%, ${mix(s, P.accent, 0.35)} 100%)`,
    `radial-gradient(circle at 30% 70%, ${mix(s, P.primary, 0.3)} 0%, ${mix(s, '#000000', 0.2)} 65%)`,
  ]
  const shade = align === 'right' ? 'linear-gradient(270deg, rgba(0,0,0,.6), transparent 65%)' : align === 'left' ? 'linear-gradient(90deg, rgba(0,0,0,.6), transparent 65%)' : 'radial-gradient(ellipse at center, rgba(0,0,0,.45), transparent 70%)'
  return (
    <div style={{ position: 'relative', height, background: bgs[tone % bgs.length], overflow: 'hidden', color: '#ffffff' }}>
      <Motif kind={motif ?? c.motif} a={mix(P.primary, '#ffffff', 0.15)} b={P.accent} c="#ffffff" d={mix(s, '#000000', 0.5)} style={{ position: 'absolute', ...motifStyle }} />
      <div style={{ position: 'absolute', inset: 0, background: shade }} />
      {children}
    </div>
  )
}

function Cinematic() {
  const { P, m, c, compact } = useL()
  const v1 = c.variant === 1
  const heroH = m ? 660 : 740
  return (
    <div style={{ background: P.scene, color: '#ffffff' }}>
      <div style={{ position: 'relative' }}>
        <Scene
          height={heroH}
          tone={v1 ? 3 : 0}
          align={v1 ? 'center' : 'left'}
          motifStyle={
            v1
              ? { width: m ? '150%' : '80%', height: m ? 420 : 620, left: m ? '-25%' : '10%', bottom: m ? -210 : -250 }
              : m
                ? { width: '100%', height: 200, right: '-10%', top: 56 }
                : { width: '72%', height: 520, right: '-4%', bottom: 40 }
          }
        >
          {v1 && <Stars seed={7} n={m ? 40 : 90} />}
          {!v1 && <div style={{ position: 'absolute', left: 0, right: 0, ...(m ? { top: 220 } : { bottom: 30 }), height: 2, background: 'rgba(255,255,255,.18)' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,.72) 0%, transparent 55%)' }} />
        </Scene>
        <Header absolute fg="#ffffff" border={false} ctaKind="ghostLight" />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: v1 ? 'auto' : m ? 36 : 88, top: v1 ? (m ? 96 : 200) : 'auto' }}>
          <Wrap style={{ display: 'grid', gap: m ? 14 : 20, justifyItems: v1 ? 'center' : 'start', textAlign: v1 ? 'center' : 'left' }}>
            <span style={{ fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: P.accent === '#ffffff' ? P.primary : mix(P.accent, '#ffffff', 0.25), fontWeight: 650 }}>{c.eyebrow}</span>
            <h1 style={h(P, m ? 40 : 84, { maxWidth: v1 ? '16ch' : '12ch', textTransform: v1 ? 'none' : 'uppercase', color: '#ffffff' })}>{c.title}</h1>
            <p style={{ color: 'rgba(255,255,255,.8)', fontSize: m ? 15.5 : 18.5, maxWidth: 540 }}>{c.subtitle}</p>
            <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 12, marginTop: 8, width: m ? '100%' : undefined }}>
              <Btn size="lg" block={m}>
                {c.cta}
              </Btn>
              <Btn size="lg" kind="ghostLight" block={m}>
                {v1 && <Play size={16} />}
                {c.ctaAlt}
              </Btn>
            </div>
          </Wrap>
        </div>
        {!m && (
          <span style={{ position: 'absolute', right: 56, bottom: 40, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>
            Role para explorar <ArrowDown size={15} />
          </span>
        )}
      </div>
      {!compact && (
        <>
          <section style={{ background: mix(P.scene, '#000000', 0.3), padding: m ? '36px 0' : '48px 0', borderTop: '1px solid rgba(255,255,255,.08)' }}>
            <Wrap>
              <StatsRow onScene />
            </Wrap>
          </section>
          <section>
            {m ? (
              <>
                <Scene height={280} tone={1} motif={v1 ? 'planet' : 'app'} motifStyle={{ width: '80%', height: '80%', left: '10%', top: '10%' }} align="center" />
                <Wrap style={{ padding: '28px 20px 40px', display: 'grid', gap: 12 }}>
                  <span style={{ fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>{c.nav[1]}</span>
                  <h2 style={h(P, 30)}>{c.features[0].title}</h2>
                  <p style={{ color: 'rgba(255,255,255,.75)' }}>{c.features[0].text}</p>
                </Wrap>
              </>
            ) : (
              <Scene height={560} tone={1} motif={v1 ? 'planet' : 'app'} align={v1 ? 'left' : 'right'} motifStyle={v1 ? { width: '50%', height: '80%', right: '4%', top: '10%' } : { width: '46%', height: '70%', left: '6%', top: '15%' }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [v1 ? 'left' : 'right']: 'max(56px, calc((100% - 1160px) / 2))', width: 440, display: 'grid', gap: 14 }}>
                  <span style={{ fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>{c.nav[1]}</span>
                  <h2 style={h(P, 44)}>{c.features[0].title}</h2>
                  <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 17 }}>{c.features[0].text}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    Saiba mais <ArrowRight size={16} />
                  </span>
                </div>
              </Scene>
            )}
          </section>
          <section style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 2 }}>
            {c.features.slice(1, 3).map((f, i) => (
              <Scene key={f.title} height={m ? 300 : 440} tone={i + 2} motif={i === 0 ? (v1 ? 'shield' : 'bars') : v1 ? 'bars' : 'shield'} align="left" motifStyle={{ width: '50%', height: '50%', right: '8%', top: '12%' }}>
                <div style={{ position: 'absolute', left: m ? 20 : 40, right: m ? 20 : 40, bottom: m ? 24 : 40, display: 'grid', gap: 8 }}>
                  <h3 style={h(P, m ? 24 : 30)}>{f.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,.75)', maxWidth: 380 }}>{f.text}</p>
                </div>
              </Scene>
            ))}
          </section>
          <Scene height={m ? 440 : 520} tone={v1 ? 0 : 3} align="center" motifStyle={{ width: m ? '120%' : '60%', height: '70%', left: m ? '-10%' : '20%', bottom: '-20%', opacity: 0.45 }}>
            {v1 && <Stars seed={3} n={m ? 30 : 60} />}
            <Wrap style={{ position: 'relative', height: '100%', display: 'grid', placeContent: 'center', justifyItems: 'center', textAlign: 'center', gap: 16 }}>
              <h2 style={h(P, m ? 34 : 60)}>{c.closing.title}</h2>
              <p style={{ color: 'rgba(255,255,255,.78)', fontSize: m ? 15.5 : 18 }}>{c.closing.text}</p>
              <div style={{ marginTop: 8, width: m ? '100%' : undefined }}>
                <Btn size="lg" block={m}>
                  {c.cta}
                </Btn>
              </div>
            </Wrap>
          </Scene>
          <Footer dark />
        </>
      )}
    </div>
  )
}

/* ========================================================================== */
/* 7. Bento grid                                                               */
/* ========================================================================== */

function BentoCard({ children, style, place, mplace, tint }: { children: ReactNode; style?: CSSProperties; place?: CSSProperties; mplace?: CSSProperties; tint?: string }) {
  const { P, m } = useL()
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: Math.max(P.rl, 14), background: tint ?? P.surface, border: `1px solid ${P.border}`, padding: m ? 16 : 22, display: 'flex', flexDirection: 'column', minWidth: 0, ...style, ...(m ? mplace : place) }}>
      {children}
    </div>
  )
}

function Bento() {
  const { P, m, c, compact } = useL()
  const v1 = c.variant === 1
  const tint = (col: string, k: number) => (v1 ? mix(P.surface, col, k) : P.surface)
  return (
    <>
      <Header />
      <section style={{ padding: m ? '32px 0 24px' : '64px 0 40px' }}>
        <Wrap>
          {v1 && !m ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 56, alignItems: 'end' }}>
              <div style={{ display: 'grid', gap: 18 }}>
                <Pill>{c.eyebrow}</Pill>
                <h1 style={h(P, 60, { maxWidth: '14ch' })}>{c.title}</h1>
              </div>
              <div style={{ display: 'grid', gap: 20 }}>
                <p style={{ color: P.muted, fontSize: 18 }}>{c.subtitle}</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Btn size="lg">{c.cta}</Btn>
                  <Btn size="lg" kind="secondary">
                    {c.ctaAlt}
                  </Btn>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 18 }}>
              <Pill>{c.eyebrow}</Pill>
              <h1 style={h(P, m ? 36 : 64, { maxWidth: '16ch' })}>{c.title}</h1>
              <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: m ? 'stretch' : 'center', gap: m ? 18 : 40, justifyContent: 'space-between' }}>
                <p style={{ color: P.muted, fontSize: m ? 16 : 18, maxWidth: 560 }}>{c.subtitle}</p>
                <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 12 }}>
                  <Btn size="lg" block={m}>
                    {c.cta}
                  </Btn>
                  <Btn size="lg" kind="secondary" block={m}>
                    {c.ctaAlt}
                  </Btn>
                </div>
              </div>
            </div>
          )}
        </Wrap>
      </section>
      <section style={{ padding: m ? '8px 0 48px' : '8px 0 80px' }}>
        <Wrap>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gridAutoRows: m ? 150 : 184, gap: m ? 12 : 16 }}>
            <BentoCard place={{ gridColumn: '1 / 3', gridRow: '1 / 3' }} mplace={{ gridColumn: 'span 2', gridRow: 'span 2' }} style={{ padding: 0 }}>
              <Pic h="100%" tone={0} radius={0} motifSize="58%" style={{ position: 'absolute', inset: 0 }} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: m ? 16 : 24, background: `linear-gradient(0deg, ${withAlpha(P.dark ? '#000000' : P.text, 0.7)}, transparent)`, color: '#ffffff', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'grid', gap: 4 }}>
                  <span style={{ fontSize: 12.5, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.8 }}>{v1 ? 'Grupo em destaque' : 'Jogo da semana'}</span>
                  <strong style={h(P, m ? 22 : 30, { color: '#ffffff' })}>{v1 ? c.features[1].title : c.items[0]}</strong>
                </div>
                <Btn size="sm">{v1 ? 'Participar' : 'Jogar'}</Btn>
              </div>
            </BentoCard>
            <BentoCard place={{ gridColumn: '3', gridRow: '1' }} tint={tint(P.primary, 0.12)}>
              <span style={{ fontSize: 13.5, color: P.muted }}>{c.stats[0].label}</span>
              <span style={h(P, m ? 34 : 48, { color: P.primary, marginTop: 'auto' })}>{c.stats[0].value}</span>
            </BentoCard>
            <BentoCard place={{ gridColumn: '3', gridRow: '2' }} tint={tint(P.accent, 0.18)} style={{ alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Motif kind={c.motif} a={P.primary} b={P.accent} c={P.surface} d={P.text} style={{ width: '70%', height: m ? 70 : 96 }} />
              <span style={{ fontSize: 13.5, fontWeight: 600, textAlign: 'center' }}>{c.features[3]?.title ?? c.features[0].title}</span>
            </BentoCard>
            <BentoCard place={{ gridColumn: '4', gridRow: '1 / 3' }} mplace={{ gridColumn: 'span 2' }} style={{ gap: 10 }}>
              <strong style={{ fontSize: 15 }}>{v1 ? 'Conversas de hoje' : 'Ranking da semana'}</strong>
              {(v1 ? ['Ana: alguém para a trilha?', 'Léo: livro novo chegou!', 'Bia: mudas de manjericão', 'Caio: mutirão sábado'] : ['1. NovaByte — 9.820', '2. Kiwi_77 — 9.410', '3. Ruiva — 8.990', '4. Tanque — 8.540'])
                .slice(0, m ? 2 : 4)
                .map((row, i) => (
                  <span key={row} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, padding: '8px 10px', borderRadius: 10, background: i === 0 ? withAlpha(P.primary, 0.12) : P.alt }}>
                    <Avatars n={1} size={22} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row}</span>
                  </span>
                ))}
            </BentoCard>
            <BentoCard place={{ gridColumn: '1 / 3', gridRow: '3' }} mplace={{ gridColumn: 'span 2' }} style={{ gap: 8 }} tint={tint(P.primary, 0.06)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 650, color: P.accent === P.surface ? P.primary : mix(P.accent, P.text, P.dark ? 0 : 0.35), textTransform: 'uppercase', letterSpacing: '.08em' }}>
                <span style={{ width: 8, height: 8, borderRadius: 9, background: P.accent }} /> {v1 ? 'Próximo encontro' : 'Ao vivo'}
              </span>
              <strong style={h(P, m ? 19 : 24)}>{v1 ? c.features[0].title : c.features[0].title}</strong>
              <span style={{ color: P.muted, fontSize: 14 }}>{c.features[0].text}</span>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: P.muted }}>
                <Avatars n={5} size={26} /> +{v1 ? 34 : 128} {v1 ? 'confirmados' : 'inscritos'}
              </div>
            </BentoCard>
            <BentoCard place={{ gridColumn: '3', gridRow: '3' }} tint={tint(P.accent, 0.1)}>
              <span style={{ fontSize: 13.5, color: P.muted }}>{c.stats[1].label}</span>
              <span style={h(P, m ? 30 : 42, { marginTop: 'auto' })}>{c.stats[1].value}</span>
            </BentoCard>
            <BentoCard place={{ gridColumn: '4', gridRow: '3' }} tint={tint(P.primary, 0.16)} style={{ gap: 8 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: P.primary, color: P.onPrimary, display: 'grid', placeItems: 'center' }}>
                <Zap size={18} />
              </span>
              <strong style={{ fontSize: 15, marginTop: 'auto' }}>{c.features[1].title}</strong>
              <span style={{ fontSize: 13, color: P.muted }}>{c.features[1].text}</span>
            </BentoCard>
          </div>
        </Wrap>
      </section>
      {!compact && (
        <>
          {v1 ? (
            <QuoteBlock />
          ) : (
            <section style={{ padding: m ? '8px 0 48px' : '0 0 80px' }}>
              <Wrap>
                <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 12 : 16 }}>
                  {c.features.slice(1, 4).map((f, i) => {
                    const Icon = FEATURE_ICONS[(i + 2) % FEATURE_ICONS.length]
                    return (
                      <BentoCard key={f.title} style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                        <span style={{ width: 42, height: 42, borderRadius: 12, background: withAlpha(P.accent, 0.18), color: P.accent, display: 'grid', placeItems: 'center', flex: 'none' }}>
                          <Icon size={20} />
                        </span>
                        <span style={{ display: 'grid' }}>
                          <strong style={{ fontSize: 15 }}>{f.title}</strong>
                          <span style={{ fontSize: 13.5, color: P.muted }}>{f.text}</span>
                        </span>
                      </BentoCard>
                    )
                  })}
                </div>
              </Wrap>
            </section>
          )}
          <section style={{ padding: m ? '0 0 56px' : '40px 0 96px' }}>
            <Wrap>
              <div style={{ borderRadius: Math.max(P.rl, 18), background: P.primary, color: P.onPrimary, padding: m ? 26 : 56, display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: m ? 'stretch' : 'center', justifyContent: 'space-between', gap: 22 }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <h2 style={h(P, m ? 26 : 40)}>{c.closing.title}</h2>
                  <p style={{ opacity: 0.85 }}>{c.closing.text}</p>
                </div>
                <Btn kind="inverse" size="lg" block={m}>
                  {c.cta}
                </Btn>
              </div>
            </Wrap>
          </section>
          <Footer />
        </>
      )}
    </>
  )
}

/* ========================================================================== */
/* 8. Composição em pôster                                                     */
/* ========================================================================== */

function Poster() {
  const { P, m, c, compact } = useL()
  const v1 = c.variant === 1
  const posterBg = v1 ? (P.dark ? P.bg : P.scene) : P.primary
  const posterFg = v1 ? '#ffffff' : P.onPrimary
  const words = c.title.split(' ')
  const last = words.pop()
  const sticker = (
    <span
      style={{
        position: 'relative',
        width: m ? 86 : 128,
        height: m ? 86 : 128,
        borderRadius: 999,
        background: v1 ? P.accent : P.accent,
        color: v1 ? P.onAccent : P.onAccent,
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        fontFamily: P.heading,
        fontWeight: 700,
        fontSize: m ? 12.5 : 16,
        lineHeight: 1.1,
        textTransform: 'uppercase',
        transform: 'rotate(-12deg)',
        padding: 10,
        boxShadow: '0 12px 30px -12px rgba(0,0,0,.4)',
        zIndex: 2,
      }}
    >
      {v1 ? '1ª aula grátis' : c.eyebrow.split(' · ')[0]}
    </span>
  )
  return (
    <>
      <section style={{ position: 'relative', background: posterBg, color: posterFg, minHeight: m ? 640 : 700, overflow: 'hidden' }}>
        <Header fg={posterFg} border={false} ctaKind={v1 ? 'primary' : 'light'} mark={false} />
        <Wrap style={{ position: 'relative', display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: m ? 10 : 24, alignItems: 'center', padding: m ? '16px 20px 28px' : '32px 56px 40px' }}>
          <div style={{ display: 'grid', gap: m ? 16 : 24, position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: 13, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.85, fontWeight: 650 }}>{c.eyebrow}</span>
            <h1 style={h(P, m ? 62 : 132, { textTransform: 'uppercase', lineHeight: 0.86, letterSpacing: '-0.04em', transform: v1 && !m ? 'rotate(-6deg)' : undefined, transformOrigin: 'left center', margin: v1 && !m ? '20px 0' : 0 })}>
              {words.join(' ')} <span style={{ color: v1 ? P.primary : P.accent === P.primary ? posterFg : P.accent }}>{last}</span>
            </h1>
            <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 12, alignItems: m ? 'stretch' : 'center' }}>
              <Btn size="lg" kind={v1 ? 'primary' : 'light'} block={m}>
                {c.cta}
              </Btn>
            </div>
          </div>
          <div style={{ position: 'relative', height: m ? 230 : 480 }}>
            <div style={{ position: 'absolute', inset: m ? '0 10%' : '4% 2%', borderRadius: 999, background: v1 ? withAlpha(P.primary, 0.12) : withAlpha(posterFg, 0.12) }} />
            <Motif kind={c.motif} a={v1 ? P.primary : posterFg} b={v1 ? P.accent : P.accent} c={posterBg} d={v1 ? '#ffffff' : mix(posterBg, '#000000', 0.45)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: m ? -6 : 10, right: m ? '6%' : 0 }}>{sticker}</div>
          </div>
        </Wrap>
        <Wrap style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 6 : 24, padding: m ? '0 20px 28px' : '0 56px 40px', fontSize: 13.5 }}>
          {c.stats.map((s) => (
            <span key={s.label} style={{ borderTop: m ? 'none' : `1px solid ${withAlpha(normalizeHex(posterFg), 0.35)}`, paddingTop: m ? 0 : 12, display: 'flex', gap: 8, opacity: 0.9 }}>
              <strong>{s.value}</strong> {s.label}
            </span>
          ))}
        </Wrap>
      </section>
      <div style={{ background: v1 ? P.primary : P.text, color: v1 ? P.onPrimary : P.bg, height: m ? 48 : 60, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div className="ent-marquee" style={{ display: 'flex', gap: 28, whiteSpace: 'nowrap', fontFamily: P.heading, fontWeight: 700, fontSize: m ? 18 : 24, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
          {[...c.items, ...c.items, ...c.items].map((it, i) => (
            <span key={i} style={{ display: 'inline-flex', gap: 28 }}>
              {it.split(' — ')[0].replace(/^\d\d:\d\d · /, '')}
              <span aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
      </div>
      {!compact && (
        <>
          <section style={{ padding: m ? '48px 0' : '96px 0' }}>
            <Wrap>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: m ? 18 : 28, gap: 12 }}>
                <h2 style={h(P, m ? 32 : 56, { textTransform: 'uppercase' })}>{v1 ? 'Aulas de hoje' : 'Cardápio'}</h2>
                <span style={{ color: P.muted, fontSize: 14 }}>{v1 ? 'Unidade Centro' : 'Atualizado toda segunda'}</span>
              </div>
              {c.items.map((it) => {
                const [name, value] = it.split(' — ')
                return (
                  <div key={it} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: m ? '16px 0' : '22px 0', borderTop: `1px solid ${P.border}` }}>
                    <span style={h(P, m ? 19 : 28, { fontWeight: 600 })}>
                      {v1 ? (
                        <>
                          <span style={{ fontFamily: fontStack('jetbrains-mono'), fontSize: '0.75em', color: P.muted, marginRight: 12 }}>{name.split(' · ')[0]}</span>
                          {name.split(' · ')[1]}
                        </>
                      ) : (
                        name
                      )}
                    </span>
                    <span style={{ fontSize: m ? 15 : 18, color: P.muted, whiteSpace: 'nowrap' }}>{value}</span>
                  </div>
                )
              })}
            </Wrap>
          </section>
          <section style={{ padding: m ? '0 0 56px' : '0 0 96px' }}>
            <Wrap style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 14 : 24 }}>
              {c.features.map((f, i) => (
                <div key={f.title} style={{ padding: m ? 20 : 28, borderRadius: P.rl, background: i === 1 ? (v1 ? P.primary : P.accent) : P.surface, color: i === 1 ? (v1 ? P.onPrimary : P.onAccent) : P.text, border: `1px solid ${P.border}`, display: 'grid', gap: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', opacity: 0.75 }}>{f.title}</span>
                  <span style={h(P, m ? 19 : 22, { fontWeight: 600 })}>{f.text}</span>
                </div>
              ))}
            </Wrap>
          </section>
          <Footer simple />
        </>
      )}
    </>
  )
}

/* ========================================================================== */
/* 9. Tipografia monumental                                                    */
/* ========================================================================== */

function Monumental() {
  const { P, m, c, compact } = useL()
  const v1 = c.variant === 1
  const [w1, w2] = c.title.split(' ')
  const giant = m ? (v1 ? 74 : 122) : v1 ? 210 : 398
  return (
    <>
      <header style={{ borderBottom: `1px solid ${P.text}` }}>
        <Wrap style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: m ? 52 : 60, fontSize: m ? 13 : 14, gap: 12 }}>
          <strong style={{ letterSpacing: '.06em' }}>{c.logo}</strong>
          <nav style={{ display: 'flex', gap: m ? 14 : 28 }}>
            {c.nav.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
        </Wrap>
      </header>
      <section style={{ padding: m ? '20px 0 24px' : '24px 0 40px', overflow: 'hidden' }}>
        <Wrap>
          {v1 ? (
            <h1 style={h(P, giant, { lineHeight: 0.84, letterSpacing: '-0.05em', textTransform: 'uppercase' })}>
              <span style={{ display: 'flex', alignItems: 'center', gap: m ? 12 : 28 }}>
                {w1}
                {!m && <Pic h={giant * 0.74} tone={1} radius={0} motifSize="40%" style={{ flex: 1, background: `linear-gradient(135deg, ${mix(P.accent, P.bg, 0.15)}, ${mix(P.accent, P.bg, 0.55)})` }} />}
              </span>
              <span style={{ display: 'block' }}>{w2}</span>
            </h1>
          ) : (
            <h1 style={h(P, giant, { lineHeight: 0.86, letterSpacing: '-0.06em', whiteSpace: 'nowrap' })}>{c.title}</h1>
          )}
          {v1 && m && <Pic h={300} tone={1} radius={0} motifSize="46%" style={{ marginTop: 16, background: `linear-gradient(135deg, ${mix(P.accent, P.bg, 0.15)}, ${mix(P.accent, P.bg, 0.55)})` }} />}
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? '16px 12px' : 24, marginTop: m ? 20 : 28 }}>
            {c.stats.map((s, i) => (
              <span key={s.label} style={{ borderTop: `1px solid ${P.text}`, paddingTop: 10, fontSize: m ? 13 : 14, display: 'grid' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {i === 3 && <span style={{ width: 8, height: 8, borderRadius: 9, background: P.accent }} />}
                  {s.value}
                </strong>
                <span style={{ color: P.muted }}>{s.label}</span>
              </span>
            ))}
          </div>
        </Wrap>
      </section>
      {!compact && (
        <>
          <section style={{ padding: m ? '32px 0' : '72px 0' }}>
            <Wrap>
              <span style={{ display: 'block', fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 14 }}>{v1 ? 'Coleções' : 'Trabalhos selecionados'}</span>
              {c.items.map((it, i) => (
                <div key={it} style={{ display: 'grid', gridTemplateColumns: m ? '34px minmax(0, 1fr) 22px' : '64px minmax(0, 1fr) 200px 80px 40px', alignItems: 'center', gap: m ? 10 : 20, padding: m ? '16px 0' : '22px 0', borderTop: `1px solid ${P.text}`, background: i === 1 && !m ? withAlpha(P.text, 0.04) : undefined }}>
                  <span style={{ fontFamily: fontStack('jetbrains-mono'), fontSize: 13, color: P.muted }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ display: 'grid', minWidth: 0 }}>
                    <span style={h(P, m ? 26 : 54, { letterSpacing: '-0.035em' })}>{it}</span>
                    {m && (
                      <span style={{ fontSize: 13, color: P.muted }}>
                        {c.features[i % c.features.length].title} · {c.features[i % c.features.length].text}
                      </span>
                    )}
                  </span>
                  {!m && <span style={{ color: P.muted, fontSize: 15 }}>{c.features[i % c.features.length].title}</span>}
                  {!m && <span style={{ color: P.muted, fontSize: 15 }}>{c.features[i % c.features.length].text}</span>}
                  <ArrowUpRight size={m ? 20 : 28} style={{ color: i === 1 ? P.accent : P.text }} />
                </div>
              ))}
            </Wrap>
          </section>
          <section style={{ padding: m ? '24px 0 40px' : '48px 0 96px' }}>
            <Wrap>
              <p style={h(P, m ? 23 : 40, { fontWeight: 400, maxWidth: '30ch', letterSpacing: '-0.02em', lineHeight: 1.2 })}>
                {c.subtitle.split(' ').slice(0, 3).join(' ')} <span style={{ color: P.muted }}>{c.subtitle.split(' ').slice(3).join(' ')}</span>
              </p>
            </Wrap>
          </section>
          <section style={{ padding: m ? '24px 0 48px' : '40px 0 96px', borderTop: `1px solid ${P.text}` }}>
            <Wrap style={{ display: 'grid', gap: 12 }}>
              <span style={{ fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted }}>Contato</span>
              <span style={h(P, m ? 34 : 104, { letterSpacing: '-0.045em', textDecoration: 'underline', textDecorationThickness: m ? 2 : 4, textUnderlineOffset: m ? 6 : 14, overflowWrap: 'anywhere' })}>{c.closing.title}</span>
              <span style={{ color: P.muted }}>{c.closing.text}</span>
            </Wrap>
          </section>
          <Footer simple />
        </>
      )}
    </>
  )
}

/* ========================================================================== */
/* 10. Apresentação com dashboard                                              */
/* ========================================================================== */

function DashMock() {
  const { P, m, c } = useL()
  const v1 = c.variant === 1
  const line = [22, 28, 25, 34, 31, 42, 38, 47, 44, 56, 52, 63]
  const bars = [38, 52, 44, 66, 58, 74, 62, 81, 70, 88]
  const kpis = c.stats.slice(0, m ? 2 : 4)
  const chartCard = (
    <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 12, padding: 14, display: 'grid', gridTemplateRows: 'auto 1fr', gap: 10, minWidth: 0, minHeight: 0 }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <strong>{v1 ? 'Usuários ativos por dia' : 'Fluxo de caixa'}</strong>
        <span style={{ color: P.muted }}>30 dias</span>
      </span>
      {v1 ? (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: m ? 5 : 8, height: '100%', minHeight: 0 }}>
          {bars.map((b, i) => (
            <span key={i} style={{ flex: 1, height: `${b}%`, borderRadius: '4px 4px 0 0', background: i % 3 === 2 ? P.accent : P.primary, opacity: i === bars.length - 1 ? 1 : 0.75 }} />
          ))}
        </div>
      ) : (
        <div style={{ minHeight: 0 }}>
          <LineChart data={line} color={P.primary} fillColor={withAlpha(P.primary, 0.14)} grid={P.border} />
        </div>
      )}
    </div>
  )
  return (
    <div style={{ margin: m ? '32px 0 0' : '56px auto 0', maxWidth: 1060, background: P.surface, border: `1px solid ${P.border}`, borderRadius: P.rl, overflow: 'hidden', boxShadow: '0 40px 80px -40px rgba(10,20,40,.5)', textAlign: 'left' }}>
      <div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 7, padding: '0 14px', borderBottom: `1px solid ${P.border}`, background: P.alt }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: 9, background: P.borderStrong }} />
        ))}
        <span style={{ margin: '0 auto', fontSize: 12, color: P.muted, padding: '2px 14px', borderRadius: 6, background: P.surface, border: `1px solid ${P.border}` }}>app.{c.logo.toLowerCase().replace(/\s+/g, '')}.com/painel</span>
      </div>
      <div style={{ display: 'flex', height: m ? 330 : 500, background: P.alt }}>
        {!m && (
          <aside style={{ width: 200, background: P.surface, borderRight: `1px solid ${P.border}`, padding: 16, display: 'grid', alignContent: 'start', gap: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{c.logo}</span>
            {['Visão geral', v1 ? 'Funis' : 'Contas', v1 ? 'Retenção' : 'Cartões', v1 ? 'Eventos' : 'Pagamentos', 'Relatórios', 'Ajustes'].map((l, i) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 13.5, background: i === 0 ? withAlpha(P.primary, 0.14) : 'transparent', color: i === 0 ? P.primary : P.muted, fontWeight: i === 0 ? 650 : 500 }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: 'currentColor', opacity: 0.55 }} />
                {l}
              </span>
            ))}
          </aside>
        )}
        <div style={{ flex: 1, padding: m ? 12 : 20, display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: m ? 10 : 14, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ fontSize: m ? 15 : 18 }}>Visão geral</strong>
            <span style={{ fontSize: 12, color: P.muted, padding: '4px 10px', border: `1px solid ${P.border}`, borderRadius: 99, background: P.surface }}>Últimos 30 dias</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${kpis.length}, minmax(0, 1fr))`, gap: m ? 8 : 12 }}>
            {kpis.map((k, i) => (
              <div key={k.label} style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 12, padding: m ? 10 : 14, display: 'grid', gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: 12, color: P.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.label}</span>
                <strong style={{ fontSize: m ? 17 : 22, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{k.value}</strong>
                <span style={{ fontSize: 11.5, color: i === 3 ? P.muted : P.accent }}>{i === 3 ? '— estável' : `▲ ${4 + i * 3},${i}%`}</span>
              </div>
            ))}
          </div>
          {m ? (
            chartCard
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)', gap: 12, minHeight: 0 }}>
              {chartCard}
              <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 12, padding: 14, display: 'grid', alignContent: 'start', gap: 10, minWidth: 0 }}>
                <strong style={{ fontSize: 13 }}>{v1 ? 'Funil de assinatura' : 'Últimos lançamentos'}</strong>
                {v1
                  ? [100, 68, 44, 31].map((p, i) => (
                      <span key={i} style={{ display: 'grid', gap: 4, fontSize: 12 }}>
                        <span style={{ display: 'flex', justifyContent: 'space-between', color: P.muted }}>
                          <span>{['Visitou', 'Criou conta', 'Testou', 'Assinou'][i]}</span>
                          <span>{p}%</span>
                        </span>
                        <span style={{ height: 10, borderRadius: 5, background: P.alt }}>
                          <span style={{ display: 'block', height: '100%', width: `${p}%`, borderRadius: 5, background: i === 3 ? P.accent : P.primary }} />
                        </span>
                      </span>
                    ))
                  : [
                      ['Recebimento · Trevo Log', '+ R$ 18.400'],
                      ['Fornecedor · Papelaria Sul', '− R$ 1.230'],
                      ['Cartão · Equipe vendas', '− R$ 640'],
                      ['Recebimento · Kora', '+ R$ 7.900'],
                      ['Impostos do mês', '− R$ 3.120'],
                    ].map(([label, value]) => (
                      <span key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12.5, paddingBottom: 8, borderBottom: `1px solid ${P.border}` }}>
                        <span style={{ color: P.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
                        <strong style={{ color: value.startsWith('+') ? P.accent : P.text, whiteSpace: 'nowrap' }}>{value}</strong>
                      </span>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DashboardLanding() {
  const { P, m, c, compact } = useL()
  const v1 = c.variant === 1
  const plans = [
    { name: 'Essencial', price: 'R$ 0', note: 'para começar', items: ['1 usuário', 'Relatórios básicos', 'Suporte por e-mail'] },
    { name: 'Profissional', price: 'R$ 89', note: 'por mês', items: ['Até 10 usuários', 'Automações', 'Suporte prioritário'] },
    { name: 'Empresa', price: 'Sob consulta', note: 'volume e SSO', items: ['Usuários ilimitados', 'SSO e auditoria', 'Gerente de conta'] },
  ]
  const ordered = m ? [plans[1], plans[0], plans[2]] : plans
  return (
    <>
      <Header />
      <section style={{ padding: m ? '36px 0 48px' : '72px 0 88px', background: `linear-gradient(180deg, ${withAlpha(P.primary, 0.08)}, transparent 60%)` }}>
        <Wrap>
          {v1 ? (
            <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: m ? 18 : 48, alignItems: 'end' }}>
              <div style={{ display: 'grid', gap: 18 }}>
                <span style={{ fontSize: 14, color: P.primary, fontWeight: 650 }}>{c.eyebrow}</span>
                <h1 style={h(P, m ? 34 : 60, { maxWidth: '16ch' })}>{c.title}</h1>
              </div>
              <div style={{ display: 'grid', gap: 18 }}>
                <p style={{ color: P.muted, fontSize: m ? 16 : 18 }}>{c.subtitle}</p>
                <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 12 }}>
                  <Btn size="lg" block={m}>
                    {c.cta}
                  </Btn>
                  <Btn size="lg" kind="secondary" block={m}>
                    {c.ctaAlt}
                  </Btn>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', justifyItems: 'center', textAlign: 'center', gap: 18 }}>
              <Pill>{c.eyebrow}</Pill>
              <h1 style={h(P, m ? 34 : 62, { maxWidth: '17ch' })}>{c.title}</h1>
              <p style={{ color: P.muted, fontSize: m ? 16 : 19, maxWidth: 580 }}>{c.subtitle}</p>
              <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 12, width: m ? '100%' : undefined }}>
                <Btn size="lg" block={m}>
                  {c.cta}
                </Btn>
                <Btn size="lg" kind="secondary" block={m}>
                  {c.ctaAlt}
                </Btn>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: P.muted }}>
                <ShieldCheck size={16} /> Dados protegidos e criptografados
              </span>
            </div>
          )}
          <DashMock />
        </Wrap>
      </section>
      {!compact && (
        <>
          <section style={{ padding: m ? '48px 0' : '88px 0' }}>
            <Wrap>
              <SectionTitle eyebrow="Recursos" title="Feito para decisões rápidas" />
              <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 14 : 24 }}>
                {c.features.map((f, i) => (
                  <div key={f.title} style={{ border: `1px solid ${P.border}`, borderRadius: P.rl, padding: m ? 18 : 24, background: P.surface, display: 'grid', gap: 10 }}>
                    <div style={{ height: 64 }}>
                      <LineChart data={seeded(i + 4, 10).map((x, j) => x * 20 + j * (i + 2))} color={i === 1 ? P.accent : P.primary} fillColor={withAlpha(i === 1 ? P.accent : P.primary, 0.12)} />
                    </div>
                    <h3 style={h(P, 18)}>{f.title}</h3>
                    <p style={{ color: P.muted, fontSize: 15 }}>{f.text}</p>
                  </div>
                ))}
              </div>
            </Wrap>
          </section>
          <section style={{ padding: m ? '40px 0' : '72px 0', background: P.alt }}>
            <Wrap>
              <SectionTitle title="Conecta com o que você já usa" center />
              <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
                {c.items.map((it, i) => (
                  <span key={it} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: P.surface, border: `1px solid ${P.border}`, borderRadius: P.r, fontWeight: 600, fontSize: 14.5 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 8, background: i % 2 ? withAlpha(P.accent, 0.2) : withAlpha(P.primary, 0.16), color: i % 2 ? P.accent : P.primary, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13 }}>{it[0]}</span>
                    {it}
                  </span>
                ))}
              </div>
            </Wrap>
          </section>
          <section style={{ padding: m ? '48px 0' : '96px 0' }}>
            <Wrap>
              <SectionTitle eyebrow="Planos" title="Preços simples, sem surpresas" center />
              <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 14 : 20, alignItems: 'stretch' }}>
                {ordered.map((p) => {
                  const hl = p.name === 'Profissional'
                  return (
                    <div key={p.name} style={{ position: 'relative', border: `${hl ? 2 : 1}px solid ${hl ? P.primary : P.border}`, borderRadius: P.rl, padding: m ? 22 : 28, background: P.surface, display: 'grid', gap: 12, alignContent: 'start' }}>
                      {hl && <span style={{ position: 'absolute', top: -12, left: 24, background: P.primary, color: P.onPrimary, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>Mais escolhido</span>}
                      <strong style={{ fontSize: 16 }}>{p.name}</strong>
                      <span style={h(P, 36)}>{p.price}</span>
                      <span style={{ color: P.muted, fontSize: 14, marginTop: -8 }}>{p.note}</span>
                      {p.items.map((it) => (
                        <span key={it} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14.5 }}>
                          <Check size={16} style={{ color: P.primary }} /> {it}
                        </span>
                      ))}
                      <div style={{ marginTop: 8 }}>
                        <Btn kind={hl ? 'primary' : 'secondary'} block>
                          {hl ? c.cta : 'Escolher'}
                        </Btn>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Wrap>
          </section>
          <Footer />
        </>
      )}
    </>
  )
}

/* ========================================================================== */
/* 11. Página minimalista                                                      */
/* ========================================================================== */

function Minimal() {
  const { P, m, c, compact } = useL()
  const v1 = c.variant === 1
  const facts = (
    <section style={{ padding: m ? '40px 0' : '72px 0' }}>
      <Wrap style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 22 : 40 }}>
        {c.stats.map((s) => (
          <div key={s.label} style={{ borderTop: `1px solid ${withAlpha(P.text, 0.2)}`, paddingTop: 16, display: 'grid', gap: 4 }}>
            <span style={h(P, m ? 26 : 32, { fontWeight: 400 })}>{s.value}</span>
            <span style={{ color: P.muted, fontSize: 14.5 }}>{s.label}</span>
          </div>
        ))}
      </Wrap>
    </section>
  )
  const text = (
    <section style={{ padding: m ? '32px 0' : '72px 0' }}>
      <Wrap style={{ display: 'grid', justifyItems: 'center', textAlign: 'center', gap: 16 }}>
        <p style={h(P, m ? 21 : 28, { fontWeight: 400, maxWidth: '30ch', lineHeight: 1.35 })}>{c.quote.text}</p>
        <span style={{ fontSize: 14, color: P.muted }}>{c.quote.author}</span>
      </Wrap>
    </section>
  )
  return (
    <>
      <header>
        <Wrap style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: m ? 64 : 84 }}>
          <span style={{ fontFamily: v1 ? P.heading : P.body, fontSize: v1 ? 22 : 17, fontWeight: v1 ? 500 : 560, letterSpacing: v1 ? '-0.01em' : '0' }}>{c.logo}</span>
          {v1 ? (
            <Btn kind="secondary" size="sm" style={{ borderRadius: 999 }}>
              {c.nav[0]}
            </Btn>
          ) : (
            <span style={{ fontSize: 15, textDecoration: 'underline', textUnderlineOffset: 5 }}>{c.nav[0]}</span>
          )}
        </Wrap>
      </header>
      <section style={{ padding: m ? '84px 0 56px' : '150px 0 104px' }}>
        <Wrap style={{ display: 'grid', gap: m ? 18 : 24 }}>
          <span style={{ fontSize: 14, color: P.muted }}>{c.eyebrow}</span>
          <h1 style={h(P, m ? 31 : 50, { fontWeight: 400, maxWidth: '20ch', lineHeight: 1.15, letterSpacing: '-0.02em' })}>{c.title}</h1>
          <p style={{ color: P.muted, fontSize: m ? 16 : 18, maxWidth: 520 }}>{c.subtitle}</p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 16, textDecoration: 'underline', textUnderlineOffset: 6 }}>
            {c.cta} <ArrowRight size={16} />
          </span>
        </Wrap>
      </section>
      <section>
        <Wrap>
          <Pic h={m ? 260 : 480} tone={3} radius={v1 ? Math.max(P.rl, 16) : 0} motifSize="46%" style={{ background: `linear-gradient(180deg, ${mix(P.accent, P.bg, 0.78)}, ${mix(P.primary, P.bg, 0.86)})` }} />
          <span style={{ display: 'block', textAlign: m ? 'left' : 'right', fontSize: 13, color: P.muted, marginTop: 10 }}>{v1 ? 'Amanhecer na serra, junho.' : `${c.items[0]}, 2024`}</span>
        </Wrap>
      </section>
      {!compact && (
        <>
          {v1 ? (
            <>
              {text}
              {facts}
            </>
          ) : (
            <>
              {facts}
              {text}
            </>
          )}
          <section style={{ padding: m ? '32px 0 56px' : '56px 0 104px' }}>
            <Wrap style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontSize: 14, color: P.muted }}>{v1 ? 'Reservas' : 'Contato'}</span>
              <span style={h(P, m ? 21 : 30, { fontWeight: 400, overflowWrap: 'anywhere' })}>{c.closing.title}</span>
              <span style={{ color: P.muted }}>{c.closing.text}</span>
            </Wrap>
          </section>
          <Footer simple />
        </>
      )}
    </>
  )
}

/* ========================================================================== */
/* 12. Seções narrativas                                                       */
/* ========================================================================== */

function Narrative() {
  const { P, m, c, compact, live } = useL()
  const [open, setOpen] = useState(false)
  const v1 = c.variant === 1
  const chapterLabel = (i: number) => (v1 ? `Dia ${i + 1}` : `Capítulo ${i + 1}`)
  const progress = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} style={{ width: m ? undefined : 44, flex: m ? 1 : 'none', height: 4, borderRadius: 4, background: i === 0 ? P.primary : P.border }} />
      ))}
    </div>
  )
  return (
    <>
      <header style={{ position: 'relative', borderBottom: `1px solid ${P.border}`, background: P.bg }}>
        <Wrap style={{ display: 'flex', alignItems: 'center', gap: 20, height: m ? 60 : 72 }}>
          <Logo size={m ? 17 : 19} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            {!m && (
              <div style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
                {progress}
                <span style={{ fontSize: 12.5, color: P.muted }}>{chapterLabel(0)} de 4</span>
              </div>
            )}
          </div>
          {!m && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {c.login && <span style={{ fontWeight: 600, fontSize: 15 }}>Entrar</span>}
              <Btn size="sm">{c.cta}</Btn>
            </span>
          )}
          {m && <Hamburger color={P.text} open={open} onToggle={() => setOpen((o) => !o)} />}
        </Wrap>
        {m && <div style={{ padding: '0 20px 10px' }}>{progress}</div>}
        {m && open && live && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5, background: P.surface, borderBottom: `1px solid ${P.border}`, padding: '8px 20px 20px', display: 'grid', gap: 4 }}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{ padding: '12px 0', borderBottom: `1px solid ${P.border}`, fontSize: 16 }}>
                <span style={{ color: P.muted, marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>
                {c.features[i].title}
              </span>
            ))}
            <div style={{ marginTop: 12 }}>
              <Btn block>{c.cta}</Btn>
            </div>
          </div>
        )}
      </header>
      <section style={{ padding: m ? '44px 0 48px' : '100px 0 96px', textAlign: m ? 'left' : 'center' }}>
        <Wrap style={{ display: 'grid', gap: 20, justifyItems: m ? 'start' : 'center' }}>
          <span style={{ fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: P.accent === P.bg ? P.primary : mix(P.accent, P.text, 0.2), fontWeight: 700 }}>{c.eyebrow}</span>
          <h1 style={h(P, m ? 36 : 66, { maxWidth: '17ch' })}>{c.title}</h1>
          <p style={{ color: P.muted, fontSize: m ? 16 : 19, maxWidth: 600 }}>{c.subtitle}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: m ? 10 : 40, marginTop: 8, width: m ? '100%' : undefined }}>
            {c.stats.map((s) => (
              <span key={s.label} style={{ display: 'grid', gap: 2, textAlign: m ? 'left' : 'center' }}>
                <strong style={h(P, m ? 20 : 30, { color: P.primary })}>{s.value}</strong>
                <span style={{ fontSize: m ? 12.5 : 14, color: P.muted }}>{s.label}</span>
              </span>
            ))}
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 14, color: P.muted }}>
            Role para começar <ChevronDown size={16} />
          </span>
        </Wrap>
      </section>
      {!compact && (
        <>
          <section style={{ position: 'relative', padding: m ? '8px 0 32px' : '24px 0 64px' }}>
            <Wrap style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: 0, bottom: 0, left: m ? 28 : '50%', width: 2, background: P.border, transform: m ? undefined : 'translateX(-1px)' }} />
              {c.features.slice(0, 4).map((f, i) => {
                const flip = i % 2 === 1
                return (
                  <article key={f.title} style={{ position: 'relative', display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: m ? 16 : 120, alignItems: 'center', padding: m ? '0 0 56px 44px' : '0 0 120px' }}>
                    <span style={{ position: 'absolute', left: m ? 21 : '50%', top: m ? 6 : '50%', width: 16, height: 16, borderRadius: 99, border: `3px solid ${P.primary}`, background: i === 0 ? P.primary : P.bg, transform: m ? undefined : 'translate(-50%, -50%)' }} />
                    <div style={{ order: m ? 2 : flip ? 2 : 1, display: 'grid', gap: 12 }}>
                      {v1 ? (
                        <span style={{ justifySelf: 'start', padding: '4px 12px', borderRadius: 99, background: withAlpha(P.accent, 0.16), color: mix(P.accent, P.text, 0.3), fontWeight: 700, fontSize: 13.5 }}>{chapterLabel(i)}</span>
                      ) : (
                        <span style={h(P, m ? 58 : 120, { color: 'transparent', WebkitTextStroke: `2px ${P.primary}`, lineHeight: 0.9 })}>{String(i + 1).padStart(2, '0')}</span>
                      )}
                      <h2 style={h(P, m ? 25 : 38)}>{f.title}</h2>
                      <p style={{ color: P.muted, fontSize: m ? 15.5 : 17, maxWidth: 460 }}>{f.text}</p>
                    </div>
                    <div style={{ order: m ? 1 : flip ? 1 : 2 }}>
                      <Pic h={m ? 210 : 320} tone={i} radius={P.rl} motif={(v1 ? (['mountain', 'leaf', 'house', 'horizon'] as const) : (['ant', 'shapes', 'ant', 'leaf'] as const))[i % 4]} motifSize={v1 ? '64%' : '56%'} />
                    </div>
                  </article>
                )
              })}
            </Wrap>
          </section>
          <section style={{ padding: m ? '0 0 56px' : '0 0 112px' }}>
            <Wrap>
              <div style={{ borderRadius: P.rl * 1.4, background: P.primary, color: P.onPrimary, padding: m ? 26 : 64, display: 'grid', justifyItems: m ? 'start' : 'center', textAlign: m ? 'left' : 'center', gap: 14 }}>
                <span style={{ fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', opacity: 0.8 }}>{v1 ? 'Sua vez' : 'Capítulo final'}</span>
                <h2 style={h(P, m ? 28 : 48)}>{c.closing.title}</h2>
                <p style={{ opacity: 0.85, maxWidth: 520 }}>{c.closing.text}</p>
                <div style={{ marginTop: 6, width: m ? '100%' : undefined }}>
                  <Btn kind="inverse" size="lg" block={m}>
                    {c.cta}
                  </Btn>
                </div>
              </div>
            </Wrap>
          </section>
          <Footer />
        </>
      )}
    </>
  )
}

/* ========================================================================== */
/* Componente público                                                          */
/* ========================================================================== */

const RENDERERS: Record<LandingArchitecture, () => JSX.Element> = {
  'hero-centralizado': HeroCentered,
  'hero-dividido': HeroSplit,
  assimetrica: Asymmetric,
  produto: Product,
  editorial: Editorial,
  cinematografica: Cinematic,
  bento: Bento,
  poster: Poster,
  'tipografia-monumental': Monumental,
  dashboard: DashboardLanding,
  minimalista: Minimal,
  narrativa: Narrative,
}

export interface LandingPreviewProps {
  model: LandingModel
  device: 'desktop' | 'mobile'
  /** null/undefined = cores originais do modelo; um tema = herda a identidade global. */
  theme?: ResolvedTheme | null
  /** false = miniatura estática (sem botões nem campos), segura dentro de cartões clicáveis. */
  interactive?: boolean
  /** Renderiza só o header e o hero (miniaturas). */
  compact?: boolean
}

/**
 * Demonstração completa de uma landing page. A composição muda por arquitetura e o
 * layout é derivado do dispositivo (não de media queries), para funcionar dentro de
 * molduras e miniaturas escaladas.
 */
export function LandingPreview({ model, device, theme, interactive = true, compact = false }: LandingPreviewProps) {
  const P = useMemo(() => landingPalette(model, theme), [model, theme])
  const ctx = useMemo<Ctx>(() => ({ P, m: device === 'mobile', c: model.content, live: interactive, compact }), [P, device, model, interactive, compact])
  const Renderer = RENDERERS[model.architecture]
  return (
    <LCtx.Provider value={ctx}>
      <div
        className="ent-lp"
        data-architecture={model.architecture}
        data-device={device}
        data-testid="landing-preview"
        style={{ background: P.bg, color: P.text, fontFamily: P.body, fontSize: device === 'mobile' ? 15 : 16, lineHeight: 1.55 }}
      >
        <Renderer />
      </div>
    </LCtx.Provider>
  )
}
