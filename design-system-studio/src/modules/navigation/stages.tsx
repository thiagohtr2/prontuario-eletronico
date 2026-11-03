import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowRight, Menu, Plus, Search, Star } from 'lucide-react'
import { mix, withAlpha } from '@/core/color'
import { fontStack, surfaceStyle } from '@/core/tokens'
import type { ResolvedTheme } from '@/core/types'
import { cx } from '@/ui'
import { headerLookFor, headerTotalHeight, sidebarLookFor } from './catalog'
import { HeaderPreview } from './HeaderPreview'
import { useWidth } from './menu'
import { heroColors } from './palette'
import { SidebarPreview } from './SidebarPreview'
import type { HeaderLook, HeaderModel, SidebarModel } from './types'

export type StageDevice = 'auto' | 'desktop' | 'mobile'

/* -------------------------------------------------------------------------- */
/* Fragmentos de página sob o header                                           */
/* -------------------------------------------------------------------------- */

function Btn({ theme, kind = 'primary', children }: { theme: ResolvedTheme; kind?: 'primary' | 'ghost' | 'light'; children: ReactNode }) {
  const t = theme.tokens
  const style: CSSProperties =
    kind === 'primary'
      ? { background: t.primary, color: t.onPrimary }
      : kind === 'light'
        ? { background: '#ffffff', color: '#111114' }
        : { background: 'transparent', color: t.text, boxShadow: `inset 0 0 0 1px ${t.borderStrong}` }
  return (
    <span className="nvs-f-btn" style={{ ...style, borderRadius: theme.metrics.radiusMd }}>
      {children}
    </span>
  )
}

function serif(theme: ResolvedTheme) {
  return ['fraunces', 'georgia'].includes(theme.typography.heading) ? theme.metrics.headingFont : fontStack('fraunces')
}

function Img({ theme, tone = 0, className, style, children }: { theme: ResolvedTheme; tone?: number; className?: string; style?: CSSProperties; children?: ReactNode }) {
  const t = theme.tokens
  const pairs: [string, string][] = [
    [mix(t.primary, t.bg, 0.55), mix(t.accent, t.bg, 0.35)],
    [mix(t.accent, t.bg, 0.5), mix(t.secondary, t.bg, 0.4)],
    [mix(t.secondary, t.bg, 0.55), mix(t.primary, t.bg, 0.3)],
    [mix(t.gradientFrom, t.bg, 0.3), mix(t.gradientTo, t.bg, 0.25)],
  ]
  const [a, b] = pairs[tone % pairs.length]
  return (
    <div className={cx('nvs-f-img', className)} style={{ background: `linear-gradient(135deg, ${a}, ${b})`, borderRadius: theme.metrics.radiusMd, ...style }}>
      {children}
    </div>
  )
}

function Lines({ theme, n = 3, w = [100, 92, 64] }: { theme: ResolvedTheme; n?: number; w?: number[] }) {
  return (
    <span className="nvs-f-lines" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} style={{ width: `${w[i % w.length]}%`, background: theme.tokens.border }} />
      ))}
    </span>
  )
}

function MoreSections({ theme }: { theme: ResolvedTheme }) {
  const t = theme.tokens
  return (
    <section className="nvs-f-more" style={{ background: t.bg }}>
      <h4 style={{ fontFamily: theme.metrics.headingFont, color: t.text }}>Role a página para ver o header em ação</h4>
      <div className="nvs-f-cards">
        {['Planeje', 'Acompanhe', 'Entregue'].map((x, i) => (
          <div key={x} className="nvs-f-card" style={{ ...surfaceStyle(theme), borderRadius: theme.metrics.radiusLg }}>
            <Img theme={theme} tone={i} style={{ height: 90 }} />
            <strong style={{ color: t.text }}>{x}</strong>
            <Lines theme={theme} n={2} />
          </div>
        ))}
      </div>
      <div className="nvs-f-cards">
        {[0, 1].map((i) => (
          <div key={i} className="nvs-f-card" style={{ ...surfaceStyle(theme), borderRadius: theme.metrics.radiusLg }}>
            <Lines theme={theme} n={4} w={[90, 100, 76, 50]} />
          </div>
        ))}
      </div>
    </section>
  )
}

export function PageFragment({
  look,
  theme,
  compact,
  padTop,
  active,
  long,
}: {
  look: HeaderLook
  theme: ResolvedTheme
  compact: boolean
  padTop: number
  active: string
  long?: boolean
}) {
  const t = theme.tokens
  const head = theme.metrics.headingFont
  const pad: CSSProperties = { paddingTop: padTop + (compact ? 16 : 24) }
  let node: ReactNode
  switch (look.context) {
    case 'app':
      node = (
        <section className="nvs-f nvs-f-app" style={{ ...pad, background: t.bgAlt }}>
          <div className="nvs-f-app__head">
            <span>
              <span className="nvs-f-kicker" style={{ color: t.textMuted }}>
                {active === 'Início' ? 'Bom dia, Marina' : `Início / ${active}`}
              </span>
              <strong style={{ fontFamily: head, color: t.text }}>{active}</strong>
            </span>
            {!compact && <Btn theme={theme}>+ Novo</Btn>}
          </div>
          <div className="nvs-f-kpis">
            {[
              ['Receita', 'R$ 48,2 mil', '+12%'],
              ['Pedidos', '1.284', '+4%'],
              ['Clientes', '312', '−2%'],
            ].map(([k, v, d], i) => (
              <div key={k} className="nvs-f-kpi" style={{ ...surfaceStyle(theme), borderRadius: theme.metrics.radiusLg }}>
                <span style={{ color: t.textMuted }}>{k}</span>
                <strong style={{ color: t.text, fontFamily: head }}>{v}</strong>
                <span style={{ color: i === 2 ? t.error : t.success }}>{d}</span>
              </div>
            ))}
          </div>
          <div className="nvs-f-chart" style={{ ...surfaceStyle(theme), borderRadius: theme.metrics.radiusLg }}>
            {[42, 58, 36, 70, 52, 80, 64, 90, 72, 60, 84, 76].map((h, i) => (
              <span key={i} style={{ height: `${h}%`, background: i === 7 ? t.primary : mix(t.primary, t.surface, 0.72), borderRadius: theme.metrics.radiusSm }} />
            ))}
          </div>
        </section>
      )
      break
    case 'editorial':
      node = (
        <section className="nvs-f nvs-f-edit" style={{ ...pad, background: t.bg }}>
          <div className="nvs-f-edit__main">
            <span className="nvs-f-kicker" style={{ color: t.accent }}>
              {active.toUpperCase()}
            </span>
            <strong style={{ fontFamily: serif(theme), color: t.text }}>A cidade que aprendeu a ouvir os próprios rios</strong>
            <span style={{ color: t.textMuted }}>Uma reportagem sobre bairros que transformaram enchentes em parques.</span>
          </div>
          <Img theme={theme} tone={3} className="nvs-f-edit__img" />
          {!compact && (
            <div className="nvs-f-edit__side">
              {['Economia circular ganha força no interior', 'O retorno das livrarias de bairro'].map((h) => (
                <div key={h} style={{ borderTop: `1px solid ${t.border}` }}>
                  <strong style={{ fontFamily: serif(theme), color: t.text }}>{h}</strong>
                  <Lines theme={theme} n={2} />
                </div>
              ))}
            </div>
          )}
        </section>
      )
      break
    case 'store':
      node = (
        <section className="nvs-f nvs-f-store" style={{ ...pad, background: t.bg }}>
          <div className="nvs-f-banner" style={{ background: `linear-gradient(110deg, ${mix(t.primary, t.bg, 0.15)}, ${mix(t.accent, t.bg, 0.25)})`, borderRadius: theme.metrics.radiusLg, color: '#fff' }}>
            <span>
              <span className="nvs-f-kicker">Coleção de verão</span>
              <strong style={{ fontFamily: head }}>Leve, fresca e feita para durar</strong>
            </span>
            {!compact && <Btn theme={theme} kind="light">Ver coleção</Btn>}
          </div>
          <div className="nvs-f-products">
            {[
              ['Vaso de cerâmica', 'R$ 129'],
              ['Luminária Brisa', 'R$ 249'],
              ['Manta de linho', 'R$ 189'],
              ['Caneca esmaltada', 'R$ 59'],
            ].map(([n, p], i) => (
              <div key={n} className="nvs-f-product">
                <Img theme={theme} tone={i} className="nvs-f-product__img">
                  <span className="nvs-f-fav" style={{ background: t.surface, color: t.text }}>
                    <Star size={12} aria-hidden="true" />
                  </span>
                </Img>
                <span style={{ color: t.text }}>{n}</span>
                <strong style={{ color: t.text }}>{p}</strong>
              </div>
            ))}
          </div>
        </section>
      )
      break
    case 'docs':
      node = (
        <section className="nvs-f nvs-f-docs" style={{ ...pad, background: t.bg }}>
          {!compact && (
            <div className="nvs-f-docs__toc" style={{ borderRight: `1px solid ${t.border}` }}>
              {['Introdução', 'Instalação', 'Autenticação', 'Primeira chamada', 'Erros comuns'].map((x, i) => (
                <span key={x} style={{ color: i === 2 ? t.primary : t.textMuted, fontWeight: i === 2 ? 600 : 400 }}>
                  {x}
                </span>
              ))}
            </div>
          )}
          <div className="nvs-f-docs__main">
            <span className="nvs-f-kicker" style={{ color: t.textMuted }}>
              {active}
            </span>
            <strong style={{ fontFamily: head, color: t.text }}>Autenticação com chaves de API</strong>
            <Lines theme={theme} n={2} w={[100, 78]} />
            <pre className="nvs-f-code" style={{ background: t.mode === 'dark' ? t.surfaceAlt : mix(t.text, '#000000', 0.2), color: '#e9e9ef', borderRadius: theme.metrics.radiusMd }}>
              {'curl https://api.exemplo.dev/v1/projetos \\\n  -H "Authorization: Bearer $CHAVE"'}
            </pre>
          </div>
        </section>
      )
      break
    case 'luxury':
      node = (
        <section className="nvs-f nvs-f-lux" style={{ ...pad, background: t.bg }}>
          <span className="nvs-f-kicker" style={{ color: t.textMuted, letterSpacing: '0.24em' }}>
            NOVA COLEÇÃO
          </span>
          <strong style={{ fontFamily: serif(theme), color: t.text }}>Lumière d’Automne</strong>
          <span className="nvs-f-rule" style={{ background: t.borderStrong }} />
          <div className="nvs-f-lux__row">
            <Img theme={theme} tone={2} className="nvs-f-lux__img" />
            {!compact && <Img theme={theme} tone={1} className="nvs-f-lux__img" />}
            {!compact && <Img theme={theme} tone={0} className="nvs-f-lux__img" />}
          </div>
        </section>
      )
      break
    case 'hero':
    case 'event': {
      const hero = heroColors(theme)
      node = (
        <section
          className="nvs-f nvs-f-hero"
          data-event={look.context === 'event'}
          style={{ paddingTop: padTop + (compact ? 28 : 44), background: `linear-gradient(135deg, ${hero.from}, ${hero.to})`, color: hero.text }}
        >
          <span className="nvs-f-orb nvs-f-orb--a" style={{ background: withAlpha(t.accent, 0.55) }} />
          <span className="nvs-f-orb nvs-f-orb--b" style={{ background: withAlpha(t.gradientTo, 0.6) }} />
          <span className="nvs-f-kicker">{look.context === 'event' ? '14 — 16 de março · Parque das Águas' : 'Temporada 2027'}</span>
          <strong style={{ fontFamily: head }}>{look.context === 'event' ? 'Três dias de música à beira do lago' : 'Viagens que começam pelo silêncio'}</strong>
          <span className="nvs-f-hero__sub">{look.context === 'event' ? '40 artistas, 3 palcos e acampamento' : 'Roteiros autorais por paisagens pouco conhecidas do Brasil.'}</span>
          <span className="nvs-f-hero__ctas">
            <Btn theme={theme} kind="light">
              {look.context === 'event' ? 'Ver line-up' : 'Explorar destinos'} <ArrowRight size={14} aria-hidden="true" />
            </Btn>
          </span>
        </section>
      )
      break
    }
    default:
      node = (
        <section className="nvs-f nvs-f-site" style={{ ...pad, background: t.bg }}>
          <div className="nvs-f-site__copy">
            <span className="nvs-f-pill" style={{ background: t.primarySoft, color: t.selectedText, borderRadius: 999 }}>
              Novo · versão 2.0
            </span>
            <strong style={{ fontFamily: head, color: t.text }}>Organize o trabalho da equipe em um só lugar</strong>
            <span style={{ color: t.textMuted }}>Planeje, acompanhe e entregue projetos com clareza, sem planilhas soltas.</span>
            <span className="nvs-f-site__ctas">
              <Btn theme={theme}>Começar agora</Btn>
              {!compact && <Btn theme={theme} kind="ghost">Ver demonstração</Btn>}
            </span>
          </div>
          {!compact && (
            <div className="nvs-f-mock" style={{ ...surfaceStyle(theme), borderRadius: theme.metrics.radiusLg }}>
              <div className="nvs-f-mock__bar">
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ background: t.border }} />
                ))}
              </div>
              <div className="nvs-f-mock__chart">
                {[40, 64, 48, 82, 58, 74].map((h, i) => (
                  <span key={i} style={{ height: `${h}%`, background: i === 3 ? t.primary : mix(t.primary, t.surface, 0.75), borderRadius: theme.metrics.radiusSm }} />
                ))}
              </div>
              <Lines theme={theme} n={2} />
            </div>
          )}
        </section>
      )
  }
  return (
    <>
      {node}
      {long && <MoreSections theme={theme} />}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Palco do header                                                             */
/* -------------------------------------------------------------------------- */


/** Header sobre um trecho de página realista, numa moldura de tamanho fixo. */
export function HeaderStage({
  model,
  variant,
  theme,
  height,
  device = 'auto',
  scrollable = false,
  interactive = true,
}: {
  model: HeaderModel
  variant: 0 | 1
  theme: ResolvedTheme
  height: number
  device?: StageDevice
  /** Permite rolar a página de exemplo (header fixo, encolhimento, transparente → sólido). */
  scrollable?: boolean
  interactive?: boolean
}) {
  const look = headerLookFor(model, variant)
  const layout = model.compositions[variant].layout
  const frameRef = useRef<HTMLDivElement>(null)
  const w = useWidth(frameRef)
  const compact = device === 'mobile' ? true : device === 'desktop' ? false : w > 0 && w < 640
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(look.nav[0]?.label ?? 'Visão geral')
  useEffect(() => {
    setActive(look.nav[0]?.label ?? 'Visão geral')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant])
  const overlay = look.shape === 'floating' || look.shape === 'islands' || look.surface === 'transparent'
  const offset = overlay ? headerTotalHeight(look, layout, compact) : 0
  const t = theme.tokens
  return (
    <div ref={frameRef} className="nvs-stage" data-nv-frame style={{ height, background: t.bg, color: t.text }}>
      <div
        className="nvs-stage__scroll"
        data-scrollable={scrollable}
        tabIndex={scrollable ? 0 : undefined}
        aria-label={scrollable ? 'Página de exemplo (role para ver o comportamento do header)' : undefined}
        onScroll={scrollable ? (e) => setScrolled(e.currentTarget.scrollTop > 8) : undefined}
      >
        <div className={cx('nvs-stage__head', overlay && 'nvs-stage__head--overlay', scrollable && model.sticky && 'nvs-stage__head--sticky')}>
          <HeaderPreview model={model} variant={variant} theme={theme} compact={compact} scrolled={scrolled} onNavigate={setActive} interactive={interactive} />
        </div>
        <PageFragment look={look} theme={theme} compact={compact} padTop={offset} active={active} long={scrollable} />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Conteúdo de aplicação ao lado da sidebar                                     */
/* -------------------------------------------------------------------------- */

export function AppContent({
  theme,
  title,
  narrow,
  glass,
  topPad = 0,
  skeleton,
}: {
  theme: ResolvedTheme
  title: string
  narrow?: boolean
  glass?: boolean
  topPad?: number
  /** Área muito estreita: mostra só blocos (sem texto), para não parecer quebrado. */
  skeleton?: boolean
}) {
  const t = theme.tokens
  const card: CSSProperties = glass
    ? { background: withAlpha(t.surface, 0.72), border: `1px solid ${withAlpha('#ffffff', 0.5)}`, backdropFilter: 'blur(10px)', borderRadius: theme.metrics.radiusLg }
    : { ...surfaceStyle(theme), borderRadius: theme.metrics.radiusLg }
  if (skeleton)
    return (
      <div className="nvs-app nvs-app--skeleton" aria-hidden="true">
        <span className="nvs-app__sk" style={{ width: '70%', height: 14, background: glass ? withAlpha('#ffffff', 0.6) : t.borderStrong }} />
        {[64, 64, 120].map((h, i) => (
          <span key={i} className="nvs-app__sk" style={{ ...card, height: h }} />
        ))}
      </div>
    )
  return (
    <div className="nvs-app" data-narrow={narrow} style={{ paddingTop: topPad + (narrow ? 14 : 20) }}>
      <div className="nvs-app__head">
        <span>
          <span className="nvs-f-kicker" style={{ color: glass ? withAlpha('#ffffff', 0.85) : t.textMuted }}>
            {title === 'Início' ? 'Bom dia, Marina' : `Início / ${title}`}
          </span>
          <strong style={{ fontFamily: theme.metrics.headingFont, color: glass ? '#ffffff' : t.text }}>{title}</strong>
        </span>
        {!narrow && (
          <span className="nvs-app__btns">
            <span className="nvs-f-btn nvs-f-btn--sm" style={{ boxShadow: `inset 0 0 0 1px ${t.borderStrong}`, color: t.text, background: t.surface, borderRadius: theme.metrics.radiusMd }}>
              <Search size={13} aria-hidden="true" /> Filtrar
            </span>
            <span className="nvs-f-btn nvs-f-btn--sm" style={{ background: t.primary, color: t.onPrimary, borderRadius: theme.metrics.radiusMd }}>
              <Plus size={13} aria-hidden="true" /> Novo
            </span>
          </span>
        )}
      </div>
      <div className="nvs-app__kpis">
        {[
          ['Em andamento', '18'],
          ['Concluídos', '64'],
          ['Atrasados', '3'],
        ].map(([k, v], i) => (
          <div key={k} className="nvs-app__kpi" style={card}>
            <span style={{ color: t.textMuted }}>{k}</span>
            <strong style={{ color: i === 2 ? t.error : t.text, fontFamily: theme.metrics.headingFont }}>{v}</strong>
          </div>
        ))}
      </div>
      <div className="nvs-app__table" style={card}>
        {['Revisar proposta comercial', 'Atualizar página de preços', 'Entrevista com cliente', 'Planejar sprint 14'].map((row, i) => (
          <div key={row} className="nvs-app__row" style={{ borderTop: i ? `1px solid ${t.border}` : undefined }}>
            <span className="nvs-app__check" style={{ borderColor: t.borderStrong, background: i === 2 ? t.primary : 'transparent' }} />
            <span style={{ color: t.text }}>{row}</span>
            <span className="nvs-app__tag" style={{ background: [t.infoBg, t.warningBg, t.successBg, t.surfaceAlt][i], color: [t.info, t.warning, t.success, t.textMuted][i] }}>
              {['Hoje', 'Amanhã', 'Feito', 'Sex'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Palco da sidebar                                                            */
/* -------------------------------------------------------------------------- */

function stageBackground(theme: ResolvedTheme, model: SidebarModel, variant: 0 | 1) {
  const t = theme.tokens
  const look = sidebarLookFor(model, variant)
  if (look.surface === 'glass') {
    const hero = heroColors(theme)
    return `radial-gradient(circle at 20% 20%, ${withAlpha(t.accent, 0.65)}, transparent 45%), radial-gradient(circle at 80% 70%, ${withAlpha(t.gradientTo, 0.7)}, transparent 50%), linear-gradient(135deg, ${hero.from}, ${hero.to})`
  }
  return model.floating ? t.bgAlt : t.bg
}

/** Sidebar em altura total ao lado de uma área de conteúdo. */
export function SidebarStage({
  model,
  variant,
  theme,
  height,
  device = 'auto',
  interactive = true,
}: {
  model: SidebarModel
  variant: 0 | 1
  theme: ResolvedTheme
  height: number
  device?: StageDevice
  interactive?: boolean
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const w = useWidth(frameRef)
  const look = sidebarLookFor(model, variant)
  const first = (look.sections?.[0]?.groups ?? (model.shape === 'dupla' ? look.groups : look.groups)).flatMap((g) => g.items)[0]?.label ?? 'Início'
  const [active, setActive] = useState(first)
  useEffect(() => setActive(first), [first])
  if (device === 'mobile') return <PhoneSidebar model={model} variant={variant} theme={theme} height={height} />
  const glass = look.surface === 'glass'
  return (
    <div ref={frameRef} className="nvs-stage nvs-stage--side" data-nv-frame style={{ height, background: stageBackground(theme, model, variant) }}>
      <SidebarPreview model={model} variant={variant} theme={theme} onNavigate={setActive} interactive={interactive} />
      <AppContent theme={theme} title={active} narrow={w > 0 && w - model.width < 360} skeleton={w > 0 && w - model.width < 170} glass={glass} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Celular                                                                     */
/* -------------------------------------------------------------------------- */

function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      onEscape()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [active, onEscape])
}

/** Moldura de celular (375 px) para mostrar como a navegação se adapta. */
export function PhoneFrame({ height, children, label }: { height: number; children: ReactNode; label: string }) {
  return (
    <div className="nvs-phone" style={{ height }} role="group" aria-label={label}>
      <div className="nvs-phone__screen">{children}</div>
    </div>
  )
}

function Drawer({
  open,
  onClose,
  model,
  variant,
  theme,
}: {
  open: boolean
  onClose: () => void
  model: SidebarModel
  variant: 0 | 1
  theme: ResolvedTheme
}) {
  useEscape(open, onClose)
  return (
    <>
      <div className="nvs-scrim" data-open={open} onClick={onClose} aria-hidden="true" />
      <div className="nvs-drawer" data-open={open} role="dialog" aria-modal="false" aria-label="Menu lateral" aria-hidden={!open}>
        {open && <SidebarPreview model={model} variant={variant} theme={theme} compact onClose={onClose} />}
      </div>
    </>
  )
}

export function PhoneSidebar({ model, variant, theme, height }: { model: SidebarModel; variant: 0 | 1; theme: ResolvedTheme; height: number }) {
  const [open, setOpen] = useState(true)
  const t = theme.tokens
  const look = sidebarLookFor(model, variant)
  return (
    <PhoneFrame height={height} label="Prévia no celular">
      <div className="nvs-stage nvs-stage--phone" data-nv-frame style={{ background: t.bg }}>
        <div className="nvs-mbar" style={{ background: t.navBg, borderBottom: `1px solid ${t.border}`, color: t.text }}>
          <button type="button" className="nvs-mbar__btn" aria-label="Abrir menu lateral" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={20} aria-hidden="true" />
          </button>
          <strong style={{ fontFamily: theme.metrics.headingFont }}>{look.brand}</strong>
          <span className="nvs-avatar" aria-hidden="true" style={{ marginLeft: 'auto' }}>
            MA
          </span>
        </div>
        <AppContent theme={theme} title="Início" narrow />
        <Drawer open={open} onClose={() => setOpen(false)} model={model} variant={variant} theme={theme} />
      </div>
    </PhoneFrame>
  )
}

/* -------------------------------------------------------------------------- */
/* Combinação header + sidebar                                                 */
/* -------------------------------------------------------------------------- */

export function ComboStage({
  header,
  headerVariant,
  sidebar,
  sidebarVariant,
  theme,
  arrangement,
  height,
}: {
  header: HeaderModel
  headerVariant: 0 | 1
  sidebar: SidebarModel
  sidebarVariant: 0 | 1
  theme: ResolvedTheme
  arrangement: 'header-top' | 'sidebar-full'
  height: number
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const w = useWidth(frameRef)
  const narrow = w > 0 && w < 720
  const [title, setTitle] = useState('Início')
  const [drawer, setDrawer] = useState(false)
  const t = theme.tokens
  const look = headerLookFor(header, headerVariant)
  const layout = header.compositions[headerVariant].layout
  const overlay = look.shape === 'floating' || look.shape === 'islands'
  // Em telas de sistema, o header transparente aparece no estado “rolado” (sólido).
  const solid = look.surface === 'transparent'
  const headerNode = (
    <HeaderPreview model={header} variant={headerVariant} theme={theme} compact={narrow} scrolled={solid} onNavigate={setTitle} />
  )
  const offset = overlay ? headerTotalHeight(look, layout, narrow) : 0

  if (narrow) {
    return (
      <div ref={frameRef} className="nvs-stage nvs-combo nvs-combo--narrow" data-nv-frame style={{ height, background: t.bgAlt }}>
        <div className={cx('nvs-combo__header', overlay && 'nvs-combo__header--overlay')}>{headerNode}</div>
        <div className="nvs-combo__main">
          <button type="button" className="nvs-combo__drawer-btn" style={{ background: t.surface, color: t.text, borderColor: t.borderStrong }} onClick={() => setDrawer(true)}>
            <Menu size={16} aria-hidden="true" /> Abrir menu lateral
          </button>
          <AppContent theme={theme} title={title} narrow topPad={offset} />
        </div>
        <Drawer open={drawer} onClose={() => setDrawer(false)} model={sidebar} variant={sidebarVariant} theme={theme} />
      </div>
    )
  }

  if (arrangement === 'sidebar-full') {
    return (
      <div ref={frameRef} className="nvs-stage nvs-combo nvs-combo--side" data-nv-frame style={{ height, background: stageBackground(theme, sidebar, sidebarVariant) }}>
        <SidebarPreview model={sidebar} variant={sidebarVariant} theme={theme} onNavigate={setTitle} />
        <div className="nvs-combo__col">
          <div className={cx('nvs-combo__header', overlay && 'nvs-combo__header--overlay')}>{headerNode}</div>
          <AppContent theme={theme} title={title} topPad={offset} narrow={w - sidebar.width < 520} />
        </div>
      </div>
    )
  }
  return (
    <div ref={frameRef} className="nvs-stage nvs-combo" data-nv-frame style={{ height, background: stageBackground(theme, sidebar, sidebarVariant) }}>
      <div className={cx('nvs-combo__header', overlay && 'nvs-combo__header--overlay')}>{headerNode}</div>
      <div className="nvs-combo__body" style={{ paddingTop: offset }}>
        <SidebarPreview model={sidebar} variant={sidebarVariant} theme={theme} hideBrand onNavigate={setTitle} />
        <AppContent theme={theme} title={title} narrow={w - sidebar.width < 520} />
      </div>
    </div>
  )
}

/** Celular com o header compacto sobre a página. */
export function PhoneHeader({ model, variant, theme, height }: { model: HeaderModel; variant: 0 | 1; theme: ResolvedTheme; height: number }) {
  return (
    <PhoneFrame height={height} label="Prévia no celular">
      <HeaderStage model={model} variant={variant} theme={theme} height={height - 24} device="mobile" scrollable />
    </PhoneFrame>
  )
}

