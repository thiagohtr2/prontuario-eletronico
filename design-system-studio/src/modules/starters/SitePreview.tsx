import { type CSSProperties, type ReactNode } from 'react'
import { activeEntry, type ComponentInstance, type PageBlock, type Project, type ProjectPage, type PropValue } from '@/core/project'
import { applyOverrides } from '@/core/tokens'
import type { Device, ResolvedTheme } from '@/core/types'
import { ComponentPreview } from '@/modules/components/ComponentPreview'
import { AuthPreview, LandingPreview } from '@/modules/entry'
import { landingById, loginById, signupById } from '@/modules/entry/catalog'
import { PhonePreview } from '@/modules/layouts'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { AppFrame, DEVICE_SIZE, ScaledFrame } from '@/modules/preview/SiteFrame'
import { EmptyState } from '@/ui'

/** O que a pessoa clicou na prévia, no modo de edição. */
export type PickTarget =
  | { kind: 'component'; id: string }
  | { kind: 'header' | 'sidebar' | 'desktop' | 'mobile' | 'landing' | 'login' | 'signup' }

/** Itens de menu do projeto (ou, sem menu definido, as funcionalidades previstas). */
export const projectNav = (p: Project) => {
  const nav = p.meta.navItems.map((s) => s.trim()).filter(Boolean)
  return nav.length ? nav : p.meta.features.map((s) => s.trim()).filter(Boolean)
}

/** Altura de referência do bloco no celular (mais baixa que no computador, sem cortar o essencial). */
const mobileHeight = (h: number) => Math.max(96, Math.round(h * 0.86))

/** Estado demonstrado na página: dados normais, vazio, carregando ou erro. */
export type PageState = 'normal' | 'vazio' | 'carregando' | 'erro'

/**
 * Sobreposições: não entram na grade da página. Aparecem por cima do conteúdo quando a pessoa as
 * abre na barra do visualizador (modal centralizado com véu; toast no canto inferior).
 */
export const OVERLAY_CATEGORIES = new Set(['modais', 'toasts'])

/** Instâncias de sobreposição usadas numa página (na ordem dos blocos). */
export function pageOverlays(project: Project, page: ProjectPage | undefined): ComponentInstance[] {
  if (!page) return []
  const ids = [...page.blocks, ...(page.aside ?? [])].map((b) => b.component)
  return ids
    .map((id) => project.components.find((c) => c.id === id))
    .filter((c): c is ComponentInstance => Boolean(c && OVERLAY_CATEGORIES.has(c.categoryId)))
}

/** Categorias que mostram dados (as que ganham estado vazio/carregando). */
const DATA_CATEGORIES = new Set(['tabelas', 'grids-de-dados', 'listas', 'graficos', 'calendarios', 'quadros-kanban', 'cards', 'timelines', 'kpis-stat-cards', 'notificacoes'])

/**
 * Bloco no estado pedido. Vazio e carregando usam os próprios componentes da biblioteca
 * (estado vazio e skeleton), com o nome do bloco — nada é desenhado à parte.
 */
function stateBlock(state: PageState, inst: ComponentInstance): { categoryId: string; props: Record<string, PropValue> } {
  if (state === 'normal' || !DATA_CATEGORIES.has(inst.categoryId)) return { categoryId: inst.categoryId, props: inst.props }
  if (state === 'carregando') return { categoryId: 'skeleton-loaders', props: {} }
  if (state === 'vazio') return { categoryId: 'empty-states', props: { titulo: `Nada em “${inst.label}” ainda`, texto: 'Quando houver dados, eles aparecem aqui.', botao: 'Adicionar', secundaria: false } }
  return { categoryId: inst.categoryId, props: inst.props }
}

/**
 * Conteúdo de uma página do app: os blocos (instâncias de componentes do projeto) numa grade de 12
 * colunas no computador e em coluna única no celular. Cada bloco é o mesmo componente da biblioteca,
 * com a família, as propriedades e as exceções de cor da instância.
 */
export function PageContent({
  project,
  page,
  theme,
  mobile = false,
  padBottom = 0,
  editMode = false,
  onPick,
  state = 'normal',
  blocks,
  bare = false,
  rowHeight,
  overlay = null,
}: {
  project: Project
  page: ProjectPage
  theme: ResolvedTheme
  mobile?: boolean
  padBottom?: number
  editMode?: boolean
  onPick?: (t: PickTarget) => void
  state?: PageState
  /** Blocos a mostrar (padrão: os da página). O painel lateral usa `page.aside`. */
  blocks?: PageBlock[]
  /** Sem título da página (painel lateral e celular, onde a barra superior já mostra o título). */
  bare?: boolean
  /** Faixa horizontal (ex.: faixa de indicadores do layout): blocos lado a lado nesta altura. */
  rowHeight?: number
  /** Sobreposição aberta (id da instância), desenhada por cima do conteúdo. */
  overlay?: string | null
}) {
  const list = (blocks ?? page.blocks).filter((b) => {
    const inst = project.components.find((c) => c.id === b.component)
    return !inst || !OVERLAY_CATEGORIES.has(inst.categoryId)
  })
  const t = theme.tokens
  const over = overlay ? project.components.find((c) => c.id === overlay) : undefined
  const root: CSSProperties = {
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    background: t.bg,
    color: t.text,
    fontFamily: theme.metrics.bodyFont,
    padding: rowHeight ? '10px 24px' : bare && !mobile ? '14px 12px' : mobile ? `12px 12px ${padBottom + 12}px` : '22px 24px 32px',
  }
  const single = mobile || bare
  const overlayNode = over && (
    <div
      className="sp-overlay"
      data-component-id={over.id}
      data-overlay={over.categoryId}
      data-editable={editMode || undefined}
      style={
        over.categoryId === 'toasts'
          ? { position: 'absolute', right: mobile ? 10 : 20, left: mobile ? 10 : 'auto', bottom: mobile ? padBottom + 10 : 20, width: mobile ? 'auto' : 380, zIndex: 6 }
          : { position: 'absolute', inset: 0, zIndex: 6 }
      }
      onClickCapture={
        editMode
          ? (e) => {
              e.preventDefault()
              e.stopPropagation()
              onPick?.({ kind: 'component', id: over.id })
            }
          : undefined
      }
    >
      <ComponentPreview
        categoryId={over.categoryId}
        familyId={over.familyId}
        theme={Object.keys(over.tokenOverrides).length ? { ...theme, tokens: applyOverrides(theme.tokens, over.tokenOverrides) } : theme}
        props={over.props}
        height={over.categoryId === 'toasts' ? 96 : 400}
        inPage
        className={over.categoryId === 'toasts' ? 'sp-fit sp-grow' : 'sp-fit'}
        style={{ background: 'transparent', height: over.categoryId === 'toasts' ? 'auto' : '100%', minHeight: over.categoryId === 'toasts' ? 80 : undefined }}
      />
    </div>
  )
  const body = (
    <div style={root} className="sp-page" data-page={page.id} data-testid={bare && !mobile ? 'site-aside' : 'site-page'} data-state={state}>
      {!bare && !mobile && (
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontFamily: theme.metrics.headingFont, fontWeight: theme.typography.headingWeight, fontSize: 26, lineHeight: 1.2, color: t.text }}>{page.name}</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: t.textMuted, maxWidth: 720 }}>{page.purpose}</p>
        </div>
      )}
      {state === 'erro' && !bare && (
        <div style={{ marginBottom: single ? 10 : 16 }}>
          <ComponentPreview categoryId="alertas" familyId={project.components[0]?.familyId ?? 'swiss-minimal'} theme={theme} props={{ titulo: 'Não foi possível carregar os dados', texto: 'Verifique a conexão e tente de novo. Se o problema continuar, fale com o suporte.', acao: 'Tentar de novo', tipo: 'erro', estilo: 'suave', fechavel: false }} height={single ? 130 : 104} inPage className="sp-fit" style={{ background: 'transparent' }} />
        </div>
      )}
      <div
        style={
          rowHeight
            ? { display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0, 1fr)', gap: 16 }
            : { display: 'grid', gridTemplateColumns: single ? 'minmax(0, 1fr)' : 'repeat(12, minmax(0, 1fr))', gap: single ? 10 : 16 }
        }
      >
        {list.map((b, i) => {
          const inst = project.components.find((c) => c.id === b.component)
          if (!inst) return null
          const shown = stateBlock(state, inst)
          const own = Object.keys(inst.tokenOverrides).length ? { ...theme, tokens: applyOverrides(theme.tokens, inst.tokenOverrides) } : theme
          const height = rowHeight ?? b.height ?? 240
          return (
            <div
              key={`${b.component}-${i}`}
              className="sp-block"
              data-component-id={inst.id}
              data-category={inst.categoryId}
              data-editable={editMode || undefined}
              title={editMode ? `Editar: ${inst.label}` : undefined}
              style={{ gridColumn: rowHeight ? undefined : single ? '1 / -1' : `span ${b.span}`, minWidth: 0, position: 'relative' }}
              onClickCapture={
                editMode
                  ? (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onPick?.({ kind: 'component', id: inst.id })
                    }
                  : undefined
              }
            >
              <ComponentPreview
                categoryId={shown.categoryId}
                familyId={inst.familyId}
                theme={own}
                props={shown.props}
                height={mobile ? mobileHeight(height) : height}
                inPage
                compact={Boolean(rowHeight)}
                // Fora das faixas, a altura declarada é o mínimo: o bloco cresce com o conteúdo (nada cortado).
                className={rowHeight ? 'sp-fit' : 'sp-fit sp-grow'}
                style={{ background: 'transparent', borderRadius: theme.metrics.radiusLg, minHeight: rowHeight ? undefined : mobile ? mobileHeight(height) : height }}
              />
              {editMode && <span className="sp-block__tag">{inst.label}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
  if (!overlayNode) return body
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {body}
      {overlayNode}
    </div>
  )
}

/**
 * Prévia de uma página de um site (modelo da galeria ou o projeto da pessoa). Usa os mesmos
 * renderizadores do Studio: layout desktop/mobile, header, sidebar, landing, login e cadastro.
 */
export function SitePreview({
  project,
  theme,
  pageId,
  device,
  available,
  maxH,
  editMode = false,
  onPick,
  onNavigate,
  state = 'normal',
  overlay = null,
}: {
  project: Project
  theme: ResolvedTheme
  pageId: string
  device: Device
  available: number
  maxH?: number
  editMode?: boolean
  onPick?: (t: PickTarget) => void
  /** Navegação pelos menus da prévia: recebe o rótulo do item clicado. */
  onNavigate?: (label: string) => void
  state?: PageState
  /** Sobreposição aberta na página (modal/toast), ou nenhuma. */
  overlay?: string | null
}) {
  const page = project.pages.find((p) => p.id === pageId) ?? project.pages[0]
  const name = project.meta.name.trim() || 'Seu projeto'
  const nav = projectNav(project)
  const entry = activeEntry(project.entry)
  if (!page) return <EmptyState title="Este projeto ainda não tem páginas">Use um modelo da galeria ou monte as páginas no modo livre.</EmptyState>

  const pickEntry = (kind: 'landing' | 'login' | 'signup', node: ReactNode) =>
    editMode ? (
      <div
        className="sp-pick"
        data-pick={kind}
        onClickCapture={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onPick?.({ kind })
        }}
      >
        {node}
      </div>
    ) : (
      node
    )

  const phone = (node: ReactNode) => (
    <div className="lp-phone lp-phone--scroll">
      <div className="lp-phone__screen">{node}</div>
    </div>
  )

  if (page.kind === 'landing') {
    const landing = landingById(entry.landingId)
    if (!landing) return <EmptyState title="Sem landing page">O fluxo deste projeto não tem página de apresentação.</EmptyState>
    const model = { ...landing, content: { ...landing.content, logo: name } }
    const node = (d: 'desktop' | 'mobile') => <LandingPreview model={model} device={d} theme={theme} />
    if (device === 'mobile') return pickEntry('landing', phone(node('mobile')))
    const size = DEVICE_SIZE[device]
    return pickEntry(
      'landing',
      <ScaledFrame w={size.w} h={size.h} available={available} maxH={maxH} label={`Página ${page.name}`}>
        <div className="lp-scroll">{node('desktop')}</div>
      </ScaledFrame>,
    )
  }

  if (page.kind === 'login' || page.kind === 'signup') {
    const login = loginById(entry.loginId)
    const signup = signupById(entry.signupId)
    if (!login) return <EmptyState title="Sem login">O fluxo deste projeto não tem área restrita.</EmptyState>
    const view = page.kind === 'login' ? 'login' : 'signup'
    const node = (d: 'desktop' | 'mobile') => <AuthPreview login={login} signup={signup} view={view} device={d} theme={theme} projectName={name} />
    if (device === 'mobile') return pickEntry(page.kind, phone(node('mobile')))
    const size = DEVICE_SIZE[device]
    return pickEntry(
      page.kind,
      <ScaledFrame w={size.w} h={size.h} available={available} maxH={maxH} label={`Página ${page.name}`}>
        <div className="lp-scroll">{node('desktop')}</div>
      </ScaledFrame>,
    )
  }

  const content = (mobile: boolean, padBottom = 0) => <PageContent project={project} page={page} theme={theme} mobile={mobile} padBottom={padBottom} editMode={editMode} onPick={onPick} state={state} overlay={overlay} />
  // No celular o painel lateral vira o fim da página (não existe coluna lateral).
  const mobilePage = page.aside?.length ? { ...page, blocks: [...page.blocks, ...page.aside] } : page

  if (device === 'mobile') {
    const mobileLayout = mobileById(project.layout.mobileId)
    if (!mobileLayout) return <EmptyState title="Sem arquitetura do celular">Escolha como o site funciona no celular.</EmptyState>
    return (
      <div className="lp-phone" data-testid="site-phone">
        <PhonePreview
          layout={mobileLayout}
          theme={theme}
          showLegends={false}
          width={Math.min(380, Math.max(300, available - 32))}
          interactive
          content={{ brand: name, nav }}
          renderContent={(pad) => <PageContent project={project} page={mobilePage} theme={theme} mobile padBottom={pad} editMode={editMode} onPick={onPick} state={state} overlay={overlay} />}
          onNavigate={onNavigate}
          screenTitle={page.name}
        />
      </div>
    )
  }

  const desktop = desktopById(project.layout.desktopId)
  if (!desktop) return <EmptyState title="Sem arquitetura do computador">Escolha como o site se organiza em telas grandes.</EmptyState>
  const size = DEVICE_SIZE[device]
  return (
    <ScaledFrame w={size.w} h={size.h} available={available} maxH={maxH} label={`Página ${page.name}`}>
      <AppFrame
        layout={desktop}
        theme={theme}
        name={name}
        nav={nav}
        header={project.navigation.header}
        sidebar={project.navigation.sidebar}
        w={size.w}
        h={size.h}
        content={content(false)}
        aside={
          page.aside?.length
            ? (sz: { width: number; height: number }) => (
                // Região larga e baixa (faixa de indicadores): blocos lado a lado; coluna lateral: um embaixo do outro.
                <PageContent project={project} page={page} theme={theme} blocks={page.aside} bare editMode={editMode} onPick={onPick} state={state} rowHeight={sz.width > sz.height * 2.5 ? Math.max(60, Math.round(sz.height - 20)) : undefined} />
              )
            : undefined
        }
        onNavigate={onNavigate}
        activeNav={page.navItem || undefined}
        onRegionPick={editMode ? (kind) => onPick?.({ kind }) : undefined}
      />
    </ScaledFrame>
  )
}
