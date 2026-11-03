import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileCode2, Maximize2, Minimize2, MousePointerClick, Paintbrush, Wand2 } from 'lucide-react'
import type { Project } from '@/core/project'
import { useStudio } from '@/core/store'
import { projectTheme } from '@/core/theme'
import { deriveTokens } from '@/core/tokens'
import type { Device } from '@/core/types'
import { paletteById } from '@/modules/color/catalog'
import { familyById, visualFamilies } from '@/modules/components/catalog'
import { categoryById } from '@/modules/components/catalog'
import { useWidth } from '@/modules/preview/SiteFrame'
import { Badge, Button, Callout, DeviceToggle, Modal, Segmented, Tabs, toast, useMediaQuery } from '@/ui'
import { buildInventory, type InventoryTarget } from './inventory'
import { SitePreview, type PageState, type PickTarget } from './SitePreview'
import { STARTER_GROUPS, type SiteStarter, type StarterPalette } from './types'
import './starters.css'

// Editores do Studio abertos dentro da mesma experiência (carregados só quando usados).
const ComponentEditor = lazy(() => import('@/modules/components/ComponentEditor').then((m) => ({ default: m.ComponentEditor })))
const NavigationShowcase = lazy(() => import('@/modules/navigation').then((m) => ({ default: m.NavigationShowcase })))
const DesktopGallery = lazy(() => import('@/modules/layouts/galleries').then((m) => ({ default: m.DesktopGallery })))
const MobileStudio = lazy(() => import('@/modules/layouts/galleries').then((m) => ({ default: m.MobileStudio })))
const LandingGallery = lazy(() => import('@/modules/entry').then((m) => ({ default: m.LandingGallery })))
const LoginGallery = lazy(() => import('@/modules/entry').then((m) => ({ default: m.LoginGallery })))
const SignupGallery = lazy(() => import('@/modules/entry').then((m) => ({ default: m.SignupGallery })))
const ColorSystem = lazy(() => import('@/modules/color/ColorSystem').then((m) => ({ default: m.ColorSystem })))
const ScopeOptions = lazy(() => import('@/modules/layouts/ScopeOptions').then((m) => ({ default: m.ScopeOptions })))

type Panel = 'visao' | 'paginas' | 'componentes' | 'cores' | 'personalizar'

/** Amostra de cores de uma paleta (base + destaque), para escolher sem abrir o editor. */
export function PaletteDots({ palette }: { palette: StarterPalette }) {
  const base = paletteById(palette.paletteId)
  if (!base) return null
  const t = deriveTokens({ ...base.base, ...((palette.overrides?.primary ? { primary: palette.overrides.primary } : {}) as object) })
  return (
    <span className="sv-dots" aria-hidden="true">
      {[t.bg, t.surface, t.primary, t.accent, t.text].map((c, i) => (
        <i key={i} style={{ background: c }} />
      ))}
    </span>
  )
}

interface ViewerProps {
  project: Project
  mode: 'template' | 'site'
  starter?: SiteStarter
  /** Variante de paleta ativa (modo modelo). */
  paletteVariant?: string
  onPaletteVariant?: (id: string) => void
  /** “Usar este modelo” (modo modelo). */
  onUse?: (reason?: string) => void
}

/**
 * Visualização de um site completo: prévia grande e interativa (páginas, computador, tablet e
 * celular, tela cheia) e o painel com Visão geral, Páginas, Componentes deste site, Cores e
 * Personalizar. No modo “site” tudo edita o projeto aberto; no modo “modelo” é só exploração.
 */
export function SiteViewer({ project, mode, starter, paletteVariant, onPaletteVariant, onUse }: ViewerProps) {
  const navigate = useNavigate()
  const phone = useMediaQuery('(max-width: 700px)')
  const firstPage = project.pages.find((p) => p.kind === 'app') ?? project.pages[0]
  const [pageId, setPageId] = useState(firstPage?.id ?? '')
  const [device, setDevice] = useState<Device>(phone ? 'mobile' : 'desktop')
  const [full, setFull] = useState(false)
  const [panel, setPanel] = useState<Panel>('visao')
  const [editMode, setEditMode] = useState(false)
  const [editing, setEditing] = useState<InventoryTarget | null>(null)
  const [styleFor, setStyleFor] = useState<string | null>(null)
  const [pageState, setPageState] = useState<PageState>('normal')
  const [ref, available] = useWidth<HTMLDivElement>()
  const theme = useMemo(() => projectTheme(project), [project])
  const inventory = useMemo(() => buildInventory(project), [project])
  const site = mode === 'site'

  // Página inexistente (ex.: trocou de modelo): volta para a primeira.
  useEffect(() => {
    if (!project.pages.some((p) => p.id === pageId)) setPageId(firstPage?.id ?? '')
  }, [project.pages, pageId, firstPage?.id])

  useEffect(() => {
    if (!full) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !editing && setFull(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [full, editing])

  const open = (t: InventoryTarget | PickTarget) => {
    if (t.kind === 'page') {
      setPageId(t.id)
      return
    }
    if (!site) {
      onUse?.('Para alterar este elemento, use o modelo: ele vira o seu projeto e tudo fica editável.')
      return
    }
    setEditing(t as InventoryTarget)
  }
  const onNavigate = (label: string) => {
    const target = project.pages.find((p) => p.navItem === label)
    if (target) setPageId(target.id)
  }

  const page = project.pages.find((p) => p.id === pageId)
  const maxH = full ? Math.max(320, window.innerHeight - 140) : undefined
  const group = starter ? STARTER_GROUPS.find((g) => g.id === starter.group) : undefined
  const exceptions = project.components.filter((c) => Object.keys(c.tokenOverrides).length).length

  const editorTitle: Record<string, string> = {
    header: 'Header',
    sidebar: 'Sidebar',
    desktop: 'Layout do computador',
    mobile: 'Layout do celular',
    landing: 'Landing page',
    login: 'Login',
    signup: 'Cadastro',
    identity: 'Identidade visual (global)',
    scope: 'Monitores grandes e stories',
  }
  let editorBody: ReactNode = null
  if (editing && editing.kind !== 'component' && editing.kind !== 'page') {
    editorBody =
      editing.kind === 'header' || editing.kind === 'sidebar' ? (
        <NavigationShowcase />
      ) : editing.kind === 'desktop' ? (
        <DesktopGallery />
      ) : editing.kind === 'mobile' ? (
        <MobileStudio />
      ) : editing.kind === 'landing' ? (
        <LandingGallery />
      ) : editing.kind === 'login' ? (
        <LoginGallery />
      ) : editing.kind === 'signup' ? (
        <SignupGallery />
      ) : editing.kind === 'scope' ? (
        <ScopeOptions />
      ) : (
        <ColorSystem />
      )
  }

  const styleTarget = styleFor ? project.components.find((c) => c.id === styleFor) : undefined

  return (
    <div className="sv" data-mode={mode}>
      <header className="sv-top">
        <div className="sv-top__title">
          <span className="ui-eyebrow">{site ? 'Seu site' : `${group?.name ?? 'Modelo'} · ${starter?.sector ?? ''}`}</span>
          <h1>{site ? project.meta.name || 'Projeto sem nome' : starter?.name}</h1>
          {!site && starter && <p className="u-muted">{starter.brand} · {starter.artDirection}</p>}
          {site && project.origin && (
            <p className="u-muted u-small">
              Começou do modelo “{project.origin.templateName}” (v{project.origin.templateVersion}) — cópia independente: mudanças na galeria não alteram este projeto.
            </p>
          )}
        </div>
        <div className="sv-top__actions">
          {site ? (
            <>
              <Button variant="secondary" icon={<FileCode2 />} onClick={() => navigate('/prompt')}>
                Gerar Master Prompt
              </Button>
            </>
          ) : (
            <Button variant="primary" icon={<Wand2 />} onClick={() => onUse?.()} data-testid="use-starter">
              Usar este modelo
            </Button>
          )}
        </div>
      </header>

      <div className="sv-body">
        <section className="sv-stage-wrap" data-full={full} role={full ? 'dialog' : undefined} aria-modal={full ? true : undefined} aria-label={full ? 'Prévia em tela cheia' : 'Prévia do site'}>
          <div className="sv-toolbar">
            <div className="sv-pages" role="group" aria-label="Páginas do site">
              {project.pages.map((p) => (
                <button key={p.id} type="button" className="sv-page-chip" aria-pressed={p.id === pageId} onClick={() => setPageId(p.id)} data-testid={`page-tab-${p.id}`}>
                  {p.name}
                </button>
              ))}
            </div>
            <div className="sv-toolbar__right">
              <DeviceToggle value={device} onChange={setDevice} devices={['desktop', 'tablet', 'mobile']} />
              {site && (
                <Button size="sm" variant={editMode ? 'primary' : 'ghost'} icon={<MousePointerClick />} aria-pressed={editMode} onClick={() => setEditMode((v) => !v)} data-testid="edit-mode">
                  {editMode ? 'Editando: clique num elemento' : 'Editar clicando'}
                </Button>
              )}
              <Button size="sm" variant="ghost" icon={full ? <Minimize2 /> : <Maximize2 />} onClick={() => setFull((f) => !f)} data-testid="viewer-fullscreen">
                {full ? 'Sair da tela cheia' : 'Tela cheia'}
              </Button>
            </div>
          </div>
          <div className="sv-toolbar">
            {page && <p className="sv-page-purpose u-subtle u-small">{page.purpose}</p>}
            {page?.kind === 'app' && (
              <div className="sv-states">
                <Segmented
                  label="Estado da página"
                  value={pageState}
                  onChange={setPageState}
                  options={[
                    { value: 'normal', label: 'Com dados' },
                    { value: 'vazio', label: 'Vazio' },
                    { value: 'carregando', label: 'Carregando' },
                    { value: 'erro', label: 'Erro' },
                  ]}
                />
              </div>
            )}
          </div>
          <div ref={ref} className="sv-stage" data-testid="site-viewer-stage">
            {available > 0 && (
              <SitePreview project={project} theme={theme} pageId={pageId} device={device} available={available} maxH={maxH} editMode={site && editMode} onPick={open} onNavigate={onNavigate} state={pageState} />
            )}
          </div>
        </section>

        <aside className="sv-panel" aria-label="Detalhes do site">
          <Tabs
            label="Painel do site"
            value={panel}
            onChange={setPanel}
            tabs={[
              { value: 'visao', label: 'Visão geral' },
              { value: 'paginas', label: `Páginas (${project.pages.length})` },
              { value: 'componentes', label: 'Componentes' },
              { value: 'cores', label: 'Cores' },
              ...(site ? [{ value: 'personalizar' as Panel, label: 'Personalizar' }] : []),
            ]}
          />
          <div className="sv-panel__body">
            {panel === 'visao' && (
              <div className="u-stack">
                <p>{site ? project.meta.description || project.meta.objective : starter?.description}</p>
                <dl className="sv-facts">
                  {inventory
                    .find((g) => g.id === 'estrutura')
                    ?.items.map((i) => (
                      <div key={i.key}>
                        <dt>{i.label}</dt>
                        <dd>{i.detail}</dd>
                      </div>
                    ))}
                  <div>
                    <dt>Páginas</dt>
                    <dd>{project.pages.map((p) => p.name).join(' · ')}</dd>
                  </div>
                  <div>
                    <dt>Componentes</dt>
                    <dd>{project.components.length} instâncias da biblioteca, todas editáveis</dd>
                  </div>
                </dl>
                {!site && starter && (
                  <div className="ui-chips">
                    {starter.tags.map((t) => (
                      <span key={t} className="ui-chip" aria-pressed="false">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {!site && (
                  <Callout title="Como usar:">
                    explore as páginas e as cores; quando gostar, clique em <strong>Usar este modelo</strong>. Ele vira o seu projeto, com tudo editável, e o Master Prompt já sai completo.
                  </Callout>
                )}
              </div>
            )}

            {panel === 'paginas' && (
              <ul className="sv-list">
                {project.pages.map((p) => (
                  <li key={p.id}>
                    <button type="button" className="sv-row" aria-pressed={p.id === pageId} onClick={() => setPageId(p.id)}>
                      <strong>{p.name}</strong>
                      <span className="u-subtle u-small">{p.purpose}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {panel === 'componentes' && (
              <div className="u-stack" data-testid="site-inventory">
                <p className="u-subtle u-small">
                  {site
                    ? 'Tudo o que este site usa. Clique para alterar: o editor abre aqui mesmo e a prévia atualiza na hora.'
                    : 'Tudo o que este site usa, gerado a partir das páginas. Para alterar, use o modelo.'}
                </p>
                {inventory
                  .filter((g) => g.id !== 'paginas')
                  .map((g) => (
                    <section key={g.id} className="sv-inv">
                      <h3>{g.title}</h3>
                      <ul className="sv-list">
                        {g.items.map((i) => (
                          <li key={i.key} className="sv-inv__item" data-testid={`inv-${i.key}`}>
                            <button type="button" className="sv-row" onClick={() => open(i.target)}>
                              <strong>{i.label}</strong>
                              <span className="u-subtle u-small">{i.detail}</span>
                              {i.pages.length > 0 && i.target.kind === 'component' && <span className="u-subtle u-small">Em: {i.pages.join(', ')}</span>}
                            </button>
                            {site && i.target.kind === 'component' && (
                              <Button size="sm" variant="ghost" icon={<Paintbrush />} onClick={() => setStyleFor((i.target as { id: string }).id)} aria-label={`Trocar estilo de ${i.label}`}>
                                Estilo
                              </Button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
              </div>
            )}

            {panel === 'cores' && (
              <div className="u-stack">
                {starter && (
                  <>
                    <p className="u-subtle u-small">Combinações curadas para este modelo. Cada uma define todos os tokens (estados, semânticos e navegação), não só a cor primária.</p>
                    <ul className="sv-palettes" role="group" aria-label="Paletas do modelo">
                      {starter.palettes.map((v) => {
                        const active = site ? project.identity.paletteId === v.paletteId : paletteVariant === v.id
                        return (
                          <li key={v.id}>
                            <button
                              type="button"
                              className="sv-row sv-palette"
                              aria-pressed={active}
                              data-testid={`palette-variant-${v.id}`}
                              onClick={() => {
                                if (site) {
                                  useStudio.getState().setPaletteVariant(v.paletteId, v.overrides ?? {})
                                  toast.success(`Paleta “${v.name}” aplicada a todo o site.`)
                                } else onPaletteVariant?.(v.id)
                              }}
                            >
                              <PaletteDots palette={v} />
                              <span>{v.name}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </>
                )}
                {site && exceptions > 0 && (
                  <Callout tone="warning">
                    {exceptions} componente(s) têm cores próprias (exceções) e continuam com elas. Revise em Componentes se quiser que sigam a paleta.
                  </Callout>
                )}
                {site && (
                  <Button variant="secondary" onClick={() => setEditing({ kind: 'identity' })}>
                    Abrir todas as paletas, tipografia e formas
                  </Button>
                )}
              </div>
            )}

            {panel === 'personalizar' && site && (
              <div className="u-stack">
                <Callout title="Três níveis de alteração">
                  <strong>Só este elemento</strong>: clique num componente (ou em “Editar clicando”). <strong>Todos deste tipo</strong> ou <strong>todos os componentes</strong>: botão “Estilo” em Componentes.{' '}
                  <strong>Global</strong>: cores, fontes e formas em “Identidade visual”.
                </Callout>
                <Button variant="secondary" onClick={() => setEditing({ kind: 'identity' })}>
                  Identidade visual (global)
                </Button>
                <Button variant="secondary" onClick={() => setEditing({ kind: 'desktop' })}>
                  Arquitetura do computador
                </Button>
                <Button variant="secondary" onClick={() => setEditing({ kind: 'mobile' })}>
                  Arquitetura do celular
                </Button>
                <Button variant="secondary" onClick={() => setEditing({ kind: 'header' })}>
                  Header e sidebar
                </Button>
                <p className="u-subtle u-small">
                  Nome, menu e funcionalidades: <Link to="/modulos/objetivo">Objetivo do projeto</Link>. Todos os módulos: <Link to="/livre">modo livre</Link>.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {editing && editing.kind === 'component' && (
        <Suspense fallback={null}>
          <ComponentEditor instanceId={editing.id} onClose={() => setEditing(null)} />
        </Suspense>
      )}
      {editing && editing.kind !== 'component' && editing.kind !== 'page' && (
        <Modal open onClose={() => setEditing(null)} width={1240} title={editorTitle[editing.kind] ?? 'Editar'} subtitle="As mudanças valem para o projeto inteiro e aparecem na prévia na hora." testId="site-editor-modal" footer={<Button variant="primary" onClick={() => setEditing(null)}>Concluir</Button>}>
          <Suspense fallback={<p className="u-muted">Carregando…</p>}>{editorBody}</Suspense>
        </Modal>
      )}
      {styleTarget && (
        <FamilyScopeModal
          key={styleTarget.id}
          instanceId={styleTarget.id}
          label={styleTarget.label || categoryById(styleTarget.categoryId)?.name || 'Componente'}
          categoryName={categoryById(styleTarget.categoryId)?.name ?? 'deste tipo'}
          current={styleTarget.familyId}
          onClose={() => setStyleFor(null)}
        />
      )}
    </div>
  )
}

/** Troca de família visual com escopo explícito (só este, todos do tipo, todos os componentes). */
function FamilyScopeModal({ instanceId, label, categoryName, current, onClose }: { instanceId: string; label: string; categoryName: string; current: string; onClose: () => void }) {
  const [family, setFamily] = useState(current)
  const [scope, setScope] = useState<'instance' | 'category' | 'all'>('instance')
  const apply = () => {
    useStudio.getState().setFamilyScoped(instanceId, family, scope)
    toast.success(scope === 'instance' ? `Estilo aplicado a “${label}”.` : scope === 'category' ? `Estilo aplicado a todos os ${categoryName.toLowerCase()}.` : 'Estilo aplicado a todos os componentes do site.')
    onClose()
  }
  return (
    <Modal
      open
      onClose={onClose}
      width={620}
      title={`Estilo de “${label}”`}
      subtitle="A família visual define superfície, sombra, preenchimento, bordas e estados. Cores, fontes e cantos continuam vindo da identidade global."
      testId="family-scope-modal"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={apply} data-testid="apply-family-scope">
            Aplicar
          </Button>
        </>
      }
    >
      <div className="u-stack">
        <label className="ui-label" htmlFor="fam-select">
          Família visual
        </label>
        <select id="fam-select" className="ui-input" value={family} onChange={(e) => setFamily(e.target.value)}>
          {visualFamilies.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
              {f.id === current ? ' (atual)' : ''}
            </option>
          ))}
        </select>
        <span className="u-subtle u-small">{familyById(family)?.description}</span>
        <Segmented
          label="Aplicar a"
          value={scope}
          onChange={setScope}
          options={[
            { value: 'instance', label: 'Só este elemento' },
            { value: 'category', label: `Todos os ${categoryName.toLowerCase()}` },
            { value: 'all', label: 'Todos os componentes' },
          ]}
        />
        <Badge tone={scope === 'instance' ? undefined : 'warning'}>
          {scope === 'instance' ? 'Só esta instância muda.' : scope === 'category' ? `Todas as instâncias de ${categoryName.toLowerCase()} mudam.` : 'Todas as instâncias do site mudam.'}
        </Badge>
      </div>
    </Modal>
  )
}
