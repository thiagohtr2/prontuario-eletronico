import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Maximize2, Minimize2, Pencil } from 'lucide-react'
import { activeEntry, ENTRY_FLOWS } from '@/core/project'
import { useProject } from '@/core/store'
import { useResolvedTheme } from '@/core/theme'
import { fontName } from '@/core/tokens'
import type { Device, ResolvedTheme } from '@/core/types'
import { paletteById } from '@/modules/color/catalog'
import { AuthPreview, LandingPreview } from '@/modules/entry'
import { landingById, loginById, signupById } from '@/modules/entry/catalog'
import { PhonePreview } from '@/modules/layouts'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import type { DesktopLayout } from '@/modules/layouts/types'
import { headerById, sidebarById } from '@/modules/navigation/catalog'
import { Button, Callout, DeviceToggle, EmptyState, Segmented } from '@/ui'
import { AppFrame, DEVICE_SIZE, ScaledFrame, useWidth } from './SiteFrame'
import './preview.css'

type PageKind = 'app' | 'landing' | 'login' | 'signup'

/** Quadro do app da Prévia integrada: o mesmo `AppFrame` da galeria de modelos, lido do projeto. */
function StoreAppFrame({ layout, theme, name, w, h }: { layout: DesktopLayout; theme: ResolvedTheme; name: string; w: number; h: number }) {
  const header = useProject((p) => p.navigation.header)
  const sidebar = useProject((p) => p.navigation.sidebar)
  const nav = useProjectNav()
  return <AppFrame layout={layout} theme={theme} name={name} nav={nav} header={header} sidebar={sidebar} w={w} h={h} />
}

/**
 * Itens de menu usados nas prévias: os do projeto; se ainda não foram definidos, as funcionalidades
 * previstas (são os módulos do sistema) — nunca o menu de exemplo de um modelo.
 */
function useProjectNav(): string[] {
  const navItems = useProject((p) => p.meta.navItems)
  const features = useProject((p) => p.meta.features)
  const nav = navItems.map((s) => s.trim()).filter(Boolean)
  return nav.length ? nav : features.map((s) => s.trim()).filter(Boolean)
}

/** Prévia integrada: todas as escolhas estruturais e visuais juntas, em uma prévia coerente. */
export function LiveSitePreview() {
  const theme = useResolvedTheme()
  const name = useProject((p) => p.meta.name) || 'Seu projeto'
  const flowId = useProject((p) => p.entry.flow)
  const desktopId = useProject((p) => p.layout.desktopId)
  const mobileId = useProject((p) => p.layout.mobileId)
  // Só as páginas do fluxo escolhido; sem cadastro escolhido, não há página “Cadastro”.
  const entry = useProject((p) => p.entry)
  const { landingId, loginId, signupId } = activeEntry(entry)
  const originalColors = useProject((p) => p.entry.landingUsesOriginalColors)
  const paletteId = useProject((p) => p.identity.paletteId)
  const typography = useProject((p) => p.identity.typography)
  const header = useProject((p) => p.navigation.header)
  const sidebar = useProject((p) => p.navigation.sidebar)
  // Em tela de celular a prévia abre no modo Celular (no modo Computador o texto ficaria ilegível).
  const [device, setDevice] = useState<Device>(() => (typeof window !== 'undefined' && window.matchMedia?.('(max-width: 700px)').matches ? 'mobile' : 'desktop'))
  const [page, setPage] = useState<PageKind>('app')
  const [full, setFull] = useState(false)
  const nav = useProjectNav()
  const phoneContent = { brand: name, nav }

  useEffect(() => {
    if (!full) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFull(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [full])
  const maxH = full ? Math.max(320, window.innerHeight - 120) : undefined
  const [ref, available] = useWidth<HTMLDivElement>()

  const flow = ENTRY_FLOWS.find((f) => f.id === flowId)
  const desktop = desktopById(desktopId)
  const mobile = mobileById(mobileId)
  const landing = landingById(landingId)
  const login = loginById(loginId)
  const signup = signupById(signupId)

  const pages: { value: PageKind; label: string }[] = [
    { value: 'app', label: 'Aplicação' },
    ...(landing ? [{ value: 'landing' as PageKind, label: 'Landing' }] : []),
    ...(login ? [{ value: 'login' as PageKind, label: 'Login' }] : []),
    ...(login && signup ? [{ value: 'signup' as PageKind, label: 'Cadastro' }] : []),
  ]
  const current = pages.some((p) => p.value === page) ? page : 'app'

  let stage: ReactNode
  if (current === 'app') {
    if (device === 'mobile') {
      stage = mobile ? (
        <div className="lp-phone">
          <PhonePreview layout={mobile} theme={theme} showLegends={false} width={360} interactive content={phoneContent} />
        </div>
      ) : (
        <EmptyState
          title="Nenhum layout mobile escolhido"
          action={
            <Link className="ui-btn ui-btn--secondary" to="/modulos/mobile">
              Escolher arquitetura do celular
            </Link>
          }
        />
      )
    } else {
      const size = DEVICE_SIZE[device]
      stage = desktop ? (
        <ScaledFrame w={size.w} h={size.h} available={available} maxH={maxH} label={`Prévia ${device === 'tablet' ? 'do tablet' : 'do computador'}`}>
          <StoreAppFrame layout={desktop} theme={theme} name={name} w={size.w} h={size.h} />
        </ScaledFrame>
      ) : (
        <EmptyState
          title="Nenhum layout desktop escolhido"
          action={
            <Link className="ui-btn ui-btn--secondary" to="/modulos/desktop">
              Escolher arquitetura do computador
            </Link>
          }
        />
      )
    }
  } else if (current === 'landing' && landing) {
    const landingTheme = originalColors ? null : theme
    // A landing mostra o nome do projeto no lugar da marca fictícia do modelo.
    const landingModel = { ...landing, content: { ...landing.content, logo: name } }
    stage =
      device === 'mobile' ? (
        <div className="lp-phone lp-phone--scroll">
          <div className="lp-phone__screen">
            <LandingPreview model={landingModel} device="mobile" theme={landingTheme} />
          </div>
        </div>
      ) : (
        <ScaledFrame w={DEVICE_SIZE[device].w} h={DEVICE_SIZE[device].h} available={available} maxH={maxH} label="Prévia da landing page">
          <div className="lp-scroll">
            <LandingPreview model={landingModel} device="desktop" theme={landingTheme} />
          </div>
        </ScaledFrame>
      )
  } else if ((current === 'login' || current === 'signup') && login) {
    const view = current === 'login' ? 'login' : 'signup'
    stage =
      device === 'mobile' ? (
        <div className="lp-phone lp-phone--scroll">
          <div className="lp-phone__screen">
            <AuthPreview login={login} signup={signup} view={view} device="mobile" theme={theme} onViewChange={(v: 'login' | 'signup') => setPage(v === 'login' ? 'login' : 'signup')} />
          </div>
        </div>
      ) : (
        <ScaledFrame w={DEVICE_SIZE[device].w} h={DEVICE_SIZE[device].h} available={available} maxH={maxH} label="Prévia do login">
          <div className="lp-scroll">
            <AuthPreview login={login} signup={signup} view={view} device="desktop" theme={theme} onViewChange={(v: 'login' | 'signup') => setPage(v === 'login' ? 'login' : 'signup')} />
          </div>
        </ScaledFrame>
      )
  }

  const choices: { label: string; value: string | undefined; to: string }[] = [
    { label: 'Fluxo de entrada', value: flow?.name, to: '/guiado/entrada' },
    { label: 'Layout desktop', value: desktop?.name, to: '/modulos/desktop' },
    { label: 'Layout mobile', value: mobile?.name, to: '/modulos/mobile' },
    { label: 'Header', value: header ? `${headerById(header.id)?.name ?? header.id} · composição ${header.variant === 0 ? 'A' : 'B'}` : 'Padrão da identidade', to: '/modulos/navegacao' },
    { label: 'Sidebar', value: sidebar ? `${sidebarById(sidebar.id)?.name ?? sidebar.id} · composição ${sidebar.variant === 0 ? 'A' : 'B'}` : 'Padrão da identidade', to: '/modulos/navegacao' },
    { label: 'Paleta', value: paletteById(paletteId)?.name, to: '/modulos/cores' },
    { label: 'Tipografia', value: `${fontName(typography.heading)} + ${fontName(typography.body)}`, to: '/modulos/cores' },
    ...(flow?.needsLanding ? [{ label: 'Landing', value: landing?.name, to: '/modulos/landing' }] : []),
    ...(flow?.needsLogin ? [{ label: 'Login', value: login?.name, to: '/modulos/login' }, { label: 'Cadastro', value: signup?.name, to: '/modulos/cadastro' }] : []),
  ]

  return (
    <div className="lp-layout">
      <div className="lp-main" data-full={full} role={full ? 'dialog' : undefined} aria-modal={full ? true : undefined} aria-label={full ? 'Prévia integrada em tela cheia' : undefined}>
        <div className="lp-toolbar">
          <Segmented label="Página da prévia" value={current} onChange={setPage} options={pages} />
          <DeviceToggle value={device} onChange={setDevice} devices={['desktop', 'tablet', 'mobile']} />
          <Button size="sm" variant="ghost" icon={full ? <Minimize2 /> : <Maximize2 />} onClick={() => setFull((f) => !f)} data-testid="preview-fullscreen">
            {full ? 'Sair da tela cheia' : 'Tela cheia'}
          </Button>
        </div>
        {current === 'app' && device === 'tablet' && (
          <Callout>No tablet (768–1023 px) vale a estrutura do computador compactada: sidebar recolhida em trilho de ícones e menus excedentes em “Mais”.</Callout>
        )}
        <div ref={ref} className="lp-stage" data-testid="live-preview">
          {stage}
        </div>
      </div>
      <aside className="lp-aside" aria-label="Escolhas nesta prévia">
        <strong>Escolhas nesta prévia</strong>
        <dl className="lp-choices">
          {choices.map((c) => (
            <div key={c.label}>
              <dt>{c.label}</dt>
              <dd>
                <span className={c.value ? undefined : 'u-subtle'}>{c.value ?? 'Não escolhido'}</span>
                <Link to={c.to} aria-label={`Alterar ${c.label}`}>
                  <Pencil aria-hidden="true" />
                </Link>
              </dd>
            </div>
          ))}
        </dl>
        <p className="u-subtle u-small">Qualquer alteração em outro módulo aparece aqui imediatamente.</p>
      </aside>
    </div>
  )
}
