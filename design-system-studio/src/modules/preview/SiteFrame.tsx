import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import type { NavChoice } from '@/core/project'
import type { ResolvedTheme } from '@/core/types'
import { DesktopSchematic } from '@/modules/layouts'
import { asideRegions, growRow } from '@/modules/layouts/fit'
import type { DesktopLayout, LayoutRegion } from '@/modules/layouts/types'
import { HeaderPreview, SidebarPreview } from '@/modules/navigation'
import { headerById, headerFitForLayout, sidebarById } from '@/modules/navigation/catalog'
import { ChatPanel, DashboardContent, DefaultHeader, DefaultSidebar, DetailPanel, FooterBar, Rail, Submenu, Toolbar } from './regions'
// Moldura do celular e rolagem das prévias de página inteira (usadas também fora da Prévia integrada).
import './preview.css'

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
  /**
   * Conteúdo das regiões de painel/detalhes do layout (nó ou função do tamanho da região). Sem ele:
   * numa página real (`content` presente) a região fica vazia; na vitrine, um painel de exemplo.
   */
  aside?: ReactNode | ((size: { width: number; height: number }) => ReactNode)
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

  const asideIds = new Set(asideRegions(layout).map((r) => r.id))
  const sidebarNode = (size?: { width: number }, hideBrand = false, rail = false) =>
    sidebarModel && sidebar ? (
      <SidebarPreview model={sidebarModel} variant={sidebar.variant} theme={theme} interactive hideBrand={hideBrand} content={{ ...navContent, width: size?.width ? Math.round(size.width) : undefined, rail, cta: sidebar.cta }} onNavigate={onNavigate} />
    ) : null

  const renderRegion = (region: LayoutRegion, size?: { width: number; height: number }): ReactNode => {
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
        return pickable('sidebar', sidebarNode(size, hideBrand) ?? <DefaultSidebar theme={theme} name={name} floating={region.floating} hideBrand={hideBrand} nav={nav} />)
      case 'rail':
        // O trilho é a sidebar escolhida na largura do layout (ex.: “Trilho de ícones”).
        return pickable('sidebar', sidebarNode(size, hideBrand, true) ?? <Rail theme={theme} nav={nav} />)
      case 'submenu':
        if (!content) return <Submenu theme={theme} />
        // Sem sidebar, o submenu é o índice do site (seções, navegando entre páginas). Com sidebar, recebe o
        // conteúdo da página para esta coluna (filtros, pastas…), como um painel.
        if (!hasSideNav) return <Submenu theme={theme} title={region.label ? region.label.charAt(0) + region.label.slice(1).toLowerCase() : 'Seções'} items={nav} active={activeNav} onPick={onNavigate} />
        if (!asideIds.has(region.id)) return <div data-empty-region={region.id} style={{ width: '100%', height: '100%', background: theme.tokens.surface }} />
      // falls through
      case 'panel':
      case 'detail':
        if (typeof aside === 'function') return aside({ width: size?.width ?? 320, height: size?.height ?? 200 })
        if (aside) return aside
        // Página real sem conteúdo para esta região: superfície vazia (nada de dados de exemplo).
        if (content) return <div data-empty-region={region.id} style={{ width: '100%', height: '100%', background: theme.tokens.surface }} />
        return <DetailPanel theme={theme} title={region.label ? region.label.charAt(0) + region.label.slice(1).toLowerCase() : 'Detalhes'} />
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

  // Header com faixas extras (ex.: masthead com editorias embaixo) maior que a linha do layout: a linha cresce.
  const headerRegion = layout.regions.find((r) => r.kind === 'header')
  const fit = headerModel && header ? headerFitForLayout(headerModel, header.variant, layout.measurements.header, hasSideNav) : null
  const frameLayout = headerRegion && fit?.grows ? growRow(layout, headerRegion.id, fit.total) : layout

  return <DesktopSchematic layout={frameLayout} width={w} height={h} showLegends={false} theme={theme} renderRegion={renderRegion} frame={false} detail="full" />
}
