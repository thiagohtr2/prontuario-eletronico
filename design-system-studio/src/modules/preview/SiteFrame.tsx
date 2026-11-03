import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import type { NavChoice } from '@/core/project'
import type { ResolvedTheme } from '@/core/types'
import { DesktopSchematic } from '@/modules/layouts'
import type { DesktopLayout, LayoutRegion } from '@/modules/layouts/types'
import { HeaderPreview, SidebarPreview } from '@/modules/navigation'
import { headerById, sidebarById } from '@/modules/navigation/catalog'
import { ChatPanel, DashboardContent, DefaultHeader, DefaultSidebar, DetailPanel, FooterBar, Rail, Submenu, Toolbar } from './regions'

/**
 * Peças compartilhadas pelas prévias de site inteiro: a Prévia integrada e a Galeria de modelos
 * usam exatamente o mesmo quadro do app (layout desktop + header + sidebar + conteúdo).
 */

export const DEVICE_SIZE = {
  desktop: { w: 1280, h: 800 },
  tablet: { w: 834, h: 1040 },
} as const

/** Mede a largura disponível de um contêiner (para escalar a prévia sem overflow). */
export function useWidth<T extends HTMLElement>(): [RefObject<T>, number] {
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

/** Renderiza o conteúdo em tamanho real e o reduz para caber na largura (e, em tela cheia, na altura). */
export function ScaledFrame({ w, h, available, maxH, children, label }: { w: number; h: number; available: number; maxH?: number; children: ReactNode; label: string }) {
  const byWidth = available > 0 ? Math.min(1, available / w) : 0.5
  const scale = maxH ? Math.min(byWidth, maxH / h) : byWidth
  return (
    <div className="lp-frame" style={{ width: w * scale, height: h * scale }} aria-label={label} role="group">
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  )
}

export interface AppFrameProps {
  layout: DesktopLayout
  theme: ResolvedTheme
  /** Nome do projeto (marca no header/sidebar). */
  name: string
  /** Itens do menu do projeto. */
  nav: string[]
  header: NavChoice | null
  sidebar: NavChoice | null
  w: number
  h: number
  /** Conteúdo da região principal; sem ele, um painel de exemplo. */
  content?: ReactNode
  /** Conteúdo das regiões de painel/detalhes do layout; sem ele, um painel de exemplo. */
  aside?: ReactNode
  /** Clique num item do header/sidebar (navegação entre páginas da prévia). */
  onNavigate?: (label: string) => void
  /** Item do menu da página aberta. */
  activeNav?: string
  /** Região que a pessoa clicou no modo de edição. */
  onRegionPick?: (kind: 'header' | 'sidebar') => void
}

/** Quadro do app no computador/tablet: regiões do layout desktop com o header e a sidebar escolhidos. */
export function AppFrame({ layout, theme, name, nav, header, sidebar, w, h, content, aside, onNavigate, onRegionPick, activeNav }: AppFrameProps) {
  const headerModel = header ? headerById(header.id) : undefined
  const sidebarModel = sidebar ? sidebarById(sidebar.id) : undefined
  const hasHeader = layout.regions.some((r) => r.kind === 'header')
  // Se há um header acima da sidebar, a marca fica no header (não repetimos o logo).
  const touchesTop = (id: string) => (layout.grid.areas[0] ?? '').split(/\s+/).includes(id)
  const navContent = { brand: name, nav, active: activeNav }
  // Com sidebar, o menu fica nela: o header não repete os mesmos itens (regra também do Master Prompt).
  const hasSideNav = layout.regions.some((r) => r.kind === 'sidebar' || r.kind === 'rail')
  // Dentro do app: header na altura do layout (a mesma do Master Prompt) e sem botões de site de marketing.
  const headerContent = { ...navContent, height: layout.measurements.header, inApp: true, hideNav: hasSideNav }

  // No modo de edição, um clique no header/sidebar abre o editor (em vez de usar o menu).
  const pickable = (kind: 'header' | 'sidebar', node: ReactNode) =>
    onRegionPick ? (
      <div
        className="sp-pick"
        data-pick={kind}
        style={{ width: '100%', height: '100%' }}
        onClickCapture={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onRegionPick(kind)
        }}
      >
        {node}
      </div>
    ) : (
      node
    )

  const renderRegion = (region: LayoutRegion, size?: { width: number }): ReactNode => {
    const hideBrand = hasHeader && !touchesTop(region.id)
    switch (region.kind) {
      case 'header':
        return pickable(
          'header',
          headerModel && header ? (
            <HeaderPreview model={headerModel} variant={header.variant} theme={theme} interactive content={headerContent} onNavigate={onNavigate} />
          ) : (
            <DefaultHeader theme={theme} name={name} nav={nav} />
          ),
        )
      case 'sidebar':
        return pickable(
          'sidebar',
          sidebarModel && sidebar ? (
            <SidebarPreview model={sidebarModel} variant={sidebar.variant} theme={theme} interactive hideBrand={hideBrand} content={{ ...navContent, width: size?.width ? Math.round(size.width) : undefined }} onNavigate={onNavigate} />
          ) : (
            <DefaultSidebar theme={theme} name={name} floating={region.floating} hideBrand={hideBrand} nav={nav} />
          ),
        )
      case 'rail':
        return <Rail theme={theme} nav={nav} />
      case 'submenu':
        return <Submenu theme={theme} />
      case 'panel':
      case 'detail':
        return aside ?? <DetailPanel theme={theme} title={region.label ? region.label.charAt(0) + region.label.slice(1).toLowerCase() : 'Detalhes'} />
      case 'chat':
        return <ChatPanel theme={theme} />
      case 'footer':
        return <FooterBar theme={theme} name={name} />
      case 'toolbar':
        return <Toolbar theme={theme} />
      default:
        return content ?? <DashboardContent theme={theme} dense={layout.oneScreen} />
    }
  }

  return <DesktopSchematic layout={layout} width={w} height={h} showLegends={false} theme={theme} renderRegion={renderRegion} frame={false} detail="full" />
}
