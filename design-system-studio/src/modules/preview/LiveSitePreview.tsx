import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { ENTRY_FLOWS } from '@/core/project'
import { useProject } from '@/core/store'
import { useResolvedTheme } from '@/core/theme'
import { fontName } from '@/core/tokens'
import type { Device, ResolvedTheme } from '@/core/types'
import { paletteById } from '@/modules/color/catalog'
import { AuthPreview, LandingPreview } from '@/modules/entry'
import { landingById, loginById, signupById } from '@/modules/entry/catalog'
import { DesktopSchematic, PhonePreview } from '@/modules/layouts'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import type { DesktopLayout, LayoutRegion } from '@/modules/layouts/types'
import { HeaderPreview, SidebarPreview } from '@/modules/navigation'
import { headerById, sidebarById } from '@/modules/navigation/catalog'
import { Callout, DeviceToggle, EmptyState, Segmented } from '@/ui'
import { ChatPanel, DashboardContent, DefaultHeader, DefaultSidebar, DetailPanel, FooterBar, Rail, Submenu, Toolbar } from './regions'
import './preview.css'

type PageKind = 'app' | 'landing' | 'login' | 'signup'

const DEVICE_SIZE: Record<Exclude<Device, 'mobile'>, { w: number; h: number }> = {
  desktop: { w: 1280, h: 800 },
  tablet: { w: 834, h: 1040 },
}

/** Mede a largura disponível de um contêiner (para escalar a prévia sem overflow). */
function useWidth<T extends HTMLElement>(): [RefObject<T>, number] {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])
  return [ref, width]
}

/** Moldura que renderiza o conteúdo em tamanho real e o reduz para caber na largura disponível. */
function ScaledFrame({ w, h, available, children, label }: { w: number; h: number; available: number; children: ReactNode; label: string }) {
  const scale = available > 0 ? Math.min(1, available / w) : 0.5
  return (
    <div className="lp-frame" style={{ width: w * scale, height: h * scale }} aria-label={label} role="img">
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  )
}

function AppFrame({ layout, theme, name, w, h }: { layout: DesktopLayout; theme: ResolvedTheme; name: string; w: number; h: number }) {
  const header = useProject((p) => p.navigation.header)
  const sidebar = useProject((p) => p.navigation.sidebar)
  const headerModel = header ? headerById(header.id) : undefined
  const sidebarModel = sidebar ? sidebarById(sidebar.id) : undefined

  const hasHeader = layout.regions.some((r) => r.kind === 'header')
  // Se há um header acima da sidebar, a marca fica no header (não repetimos o logo).
  const touchesTop = (id: string) => (layout.grid.areas[0] ?? '').split(/\s+/).includes(id)

  const navItems = useProject((p) => p.meta.navItems)
  const nav = navItems.map((s) => s.trim()).filter(Boolean)
  const content = { brand: name, nav }

  const renderRegion = (region: LayoutRegion): ReactNode => {
    const hideBrand = hasHeader && !touchesTop(region.id)
    switch (region.kind) {
      case 'header':
        return headerModel && header ? <HeaderPreview model={headerModel} variant={header.variant} theme={theme} interactive content={content} /> : <DefaultHeader theme={theme} name={name} nav={nav} />
      case 'sidebar':
        return sidebarModel && sidebar ? <SidebarPreview model={sidebarModel} variant={sidebar.variant} theme={theme} interactive hideBrand={hideBrand} content={content} /> : <DefaultSidebar theme={theme} name={name} floating={region.floating} hideBrand={hideBrand} nav={nav} />
      case 'rail':
        return <Rail theme={theme} nav={nav} />
      case 'submenu':
        return <Submenu theme={theme} />
      case 'panel':
      case 'detail':
        return <DetailPanel theme={theme} title={region.label ? region.label.charAt(0) + region.label.slice(1).toLowerCase() : 'Detalhes'} />
      case 'chat':
        return <ChatPanel theme={theme} />
      case 'footer':
        return <FooterBar theme={theme} name={name} />
      case 'toolbar':
        return <Toolbar theme={theme} />
      default:
        return <DashboardContent theme={theme} dense={layout.oneScreen} />
    }
  }

  return <DesktopSchematic layout={layout} width={w} height={h} showLegends={false} theme={theme} renderRegion={renderRegion} frame={false} detail="full" />
}

/** Live Site Preview: todas as escolhas estruturais e visuais juntas, em uma prévia coerente. */
export function LiveSitePreview() {
  const theme = useResolvedTheme()
  const name = useProject((p) => p.meta.name) || 'Seu projeto'
  const flowId = useProject((p) => p.entry.flow)
  const desktopId = useProject((p) => p.layout.desktopId)
  const mobileId = useProject((p) => p.layout.mobileId)
  const landingId = useProject((p) => p.entry.landingId)
  const loginId = useProject((p) => p.entry.loginId)
  const signupId = useProject((p) => p.entry.signupId)
  const originalColors = useProject((p) => p.entry.landingUsesOriginalColors)
  const paletteId = useProject((p) => p.identity.paletteId)
  const typography = useProject((p) => p.identity.typography)
  const header = useProject((p) => p.navigation.header)
  const sidebar = useProject((p) => p.navigation.sidebar)
  const [device, setDevice] = useState<Device>('desktop')
  const [page, setPage] = useState<PageKind>('app')
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
    ...(login ? [{ value: 'signup' as PageKind, label: 'Cadastro' }] : []),
  ]
  const current = pages.some((p) => p.value === page) ? page : 'app'

  let stage: ReactNode
  if (current === 'app') {
    if (device === 'mobile') {
      stage = mobile ? (
        <div className="lp-phone">
          <PhonePreview layout={mobile} theme={theme} showLegends={false} width={360} interactive />
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
        <ScaledFrame w={size.w} h={size.h} available={available} label={`Prévia ${device === 'tablet' ? 'do tablet' : 'do computador'}`}>
          <AppFrame layout={desktop} theme={theme} name={name} w={size.w} h={size.h} />
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
    stage =
      device === 'mobile' ? (
        <div className="lp-phone lp-phone--scroll">
          <div className="lp-phone__screen">
            <LandingPreview model={landing} device="mobile" theme={landingTheme} />
          </div>
        </div>
      ) : (
        <ScaledFrame w={DEVICE_SIZE[device].w} h={DEVICE_SIZE[device].h} available={available} label="Prévia da landing page">
          <div className="lp-scroll">
            <LandingPreview model={landing} device="desktop" theme={landingTheme} />
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
        <ScaledFrame w={DEVICE_SIZE[device].w} h={DEVICE_SIZE[device].h} available={available} label="Prévia do login">
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
      <div className="lp-main">
        <div className="lp-toolbar">
          <Segmented label="Página da prévia" value={current} onChange={setPage} options={pages} />
          <DeviceToggle value={device} onChange={setDevice} devices={['desktop', 'tablet', 'mobile']} />
        </div>
        {current === 'app' && device === 'tablet' && (
          <Callout>No tablet, a estrutura do computador é compactada. Se não couber, a IA deve usar a estrutura do celular.</Callout>
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
