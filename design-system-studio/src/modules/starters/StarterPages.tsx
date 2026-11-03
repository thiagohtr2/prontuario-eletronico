import { useMemo, useRef, useState, useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Compass, LayoutTemplate } from 'lucide-react'
import { useStudio } from '@/core/store'
import { projectTheme } from '@/core/theme'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { Button, Callout, EmptyState, FilterChips, Modal, PageHeader, SearchInput, toast, useNoTabStops } from '@/ui'
import { instantiateStarter, type ApplyMode } from './apply'
import { starterById, starters } from './catalog'
import { PaletteDots, SiteViewer } from './SiteViewer'
import { SitePreview } from './SitePreview'
import { STARTER_GROUPS, type SiteStarter } from './types'
import './starters.css'

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Miniatura viva do site (primeira página do app), montada só perto da tela e fora do Tab. */
function StarterThumb({ starter }: { starter: SiteStarter }) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined')
  const [w, setW] = useState(0)
  useNoTabStops(ref)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    setW(el.clientWidth)
    if (near) return () => ro.disconnect()
    const io = new IntersectionObserver((e) => e.some((x) => x.isIntersecting) && setNear(true), { rootMargin: '400px' })
    io.observe(el)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [near])
  const project = useMemo(() => instantiateStarter(starter, 'original', 'new'), [starter])
  const theme = useMemo(() => projectTheme(project), [project])
  const first = project.pages.find((p) => p.kind === 'app') ?? project.pages[0]
  return (
    <div ref={ref} className="st-thumb" aria-hidden="true" {...({ inert: '' } as Record<string, string>)}>
      {near && w > 0 && first && <SitePreview project={project} theme={theme} pageId={first.id} device="desktop" available={w} />}
    </div>
  )
}

/** Galeria de modelos de site completos (o caminho mais rápido para um resultado profissional). */
export function StartersGalleryPage() {
  const [group, setGroup] = useState<string>('todos')
  const [query, setQuery] = useState('')
  const visible = starters.filter((s) => (group === 'todos' || s.group === group) && (!query.trim() || norm(`${s.name} ${s.brand} ${s.sector} ${s.description} ${s.tags.join(' ')}`).includes(norm(query.trim()))))
  const options = [
    { id: 'todos', label: 'Todos', count: starters.length },
    ...STARTER_GROUPS.map((g) => ({ id: g.id, label: g.name, count: starters.filter((s) => s.group === g.id).length })).filter((o) => o.count > 0),
  ]
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Comece por um modelo"
        title="Galeria de inspiração"
        description="Sites completos e prontos para usar como ponto de partida: páginas, navegação, celular, cores e componentes já combinados. Escolha um, ajuste o que quiser e gere o Master Prompt."
      />
      <div className="st-filters">
        <FilterChips label="Categorias de modelos" options={options} value={group} onChange={setGroup} />
        <div style={{ maxWidth: 360 }}>
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar por setor ou estilo (ex.: saúde, loja, escuro)" label="Buscar modelos" />
        </div>
      </div>
      {visible.length === 0 ? (
        <EmptyState title="Nenhum modelo encontrado">Tente outra palavra ou outra categoria.</EmptyState>
      ) : (
        <ul className="st-grid" data-testid="starter-grid">
          {visible.map((s) => {
            const desktop = desktopById(s.layout.desktopId)
            const mobile = mobileById(s.layout.mobileId)
            return (
              <li key={s.id} className="st-card" data-testid={`starter-${s.id}`}>
                <Link to={`/modelos/${s.id}`} className="st-card__link" aria-label={`Ver o site completo: ${s.name} (${s.brand})`}>
                  <StarterThumb starter={s} />
                  <div className="st-card__body">
                    <span className="ui-eyebrow">{STARTER_GROUPS.find((g) => g.id === s.group)?.name} · {s.sector}</span>
                    <strong className="st-card__title">{s.name}</strong>
                    <span className="u-muted u-small">{s.brand} — {s.artDirection}</span>
                    <span className="st-card__meta">
                      {s.pages.length} páginas · {desktop?.name} · celular: {mobile?.name}
                    </span>
                    <span className="st-card__foot">
                      <PaletteDots palette={s.palettes[0]} />
                      <span className="u-subtle u-small">{s.palettes.length} paletas</span>
                      <span className="st-card__cta">
                        Ver site <ArrowRight aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/** Escolha de como aplicar o modelo (nunca sobrescreve o projeto atual em silêncio). */
function UseStarterModal({ starter, paletteVariant, reason, onClose }: { starter: SiteStarter; paletteVariant: string; reason?: string; onClose: () => void }) {
  const navigate = useNavigate()
  const current = useStudio((s) => s.project)
  const hasWork = Boolean(current.meta.name.trim() || current.meta.projectType || current.layout.desktopId || current.layout.mobileId || current.components.length)
  const [mode, setMode] = useState<ApplyMode>('new')
  const options: { id: ApplyMode; title: string; text: string }[] = [
    { id: 'new', title: 'Criar um projeto novo com este modelo', text: hasWork ? `“${current.meta.name || 'Projeto sem nome'}” fica guardado em “Seus projetos”, sem mudanças.` : 'O modelo vira o seu projeto, com tudo editável.' },
    ...(hasWork
      ? ([
          { id: 'replace', title: 'Substituir o projeto atual', text: 'O projeto aberto é trocado pelo modelo. Uma versão de segurança é salva antes.' },
          { id: 'identity', title: 'Trazer só a identidade visual', text: 'Mantém estrutura, páginas e componentes; troca cores, fontes e formas pelas do modelo.' },
          { id: 'architecture', title: 'Trazer só a arquitetura', text: 'Mantém cores, fontes e formas; traz layouts, navegação, menu, páginas e componentes do modelo.' },
        ] as { id: ApplyMode; title: string; text: string }[])
      : []),
  ]
  const apply = () => {
    const project = instantiateStarter(starter, paletteVariant, mode, current)
    useStudio.getState().applyStarterProject(project, mode, starter.name)
    toast.success(mode === 'identity' ? 'Identidade do modelo aplicada.' : mode === 'architecture' ? 'Arquitetura do modelo aplicada.' : `“${starter.brand}” agora é o seu projeto. Ajuste o que quiser.`)
    onClose()
    navigate('/site')
  }
  return (
    <Modal
      open
      onClose={onClose}
      width={600}
      title={`Usar “${starter.name}”`}
      subtitle={reason ?? 'O modelo vira uma cópia independente: mudanças futuras na galeria não alteram o seu projeto.'}
      testId="use-starter-modal"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant={mode === 'replace' ? 'danger' : 'primary'} onClick={apply} data-testid="confirm-use-starter">
            {mode === 'replace' ? 'Substituir o projeto atual' : 'Usar este modelo'}
          </Button>
        </>
      }
    >
      <div className="st-apply" role="radiogroup" aria-label="Como aplicar o modelo">
        {options.map((o) => (
          <label key={o.id} className="st-apply__opt" data-checked={mode === o.id}>
            <input type="radio" name="apply-mode" value={o.id} checked={mode === o.id} onChange={() => setMode(o.id)} />
            <span>
              <strong>{o.title}</strong>
              <span className="u-muted u-small">{o.text}</span>
            </span>
          </label>
        ))}
      </div>
    </Modal>
  )
}

/** Página de um modelo: o site inteiro, as paletas, os componentes e “Usar este modelo”. */
export function StarterDetailPage() {
  const { id } = useParams()
  const starter = starterById(id)
  const [variant, setVariant] = useState('original')
  const [useOpen, setUseOpen] = useState<{ reason?: string } | null>(null)
  const draft = useMemo(() => (starter ? instantiateStarter(starter, variant, 'new') : null), [starter, variant])
  if (!starter || !draft) return <Navigate to="/modelos" replace />
  return (
    <div className="ui-page">
      <p className="u-small" style={{ margin: '0 0 8px' }}>
        <Link to="/modelos">← Todos os modelos</Link>
      </p>
      <SiteViewer project={draft} mode="template" starter={starter} paletteVariant={variant} onPaletteVariant={setVariant} onUse={(reason) => setUseOpen({ reason })} />
      {useOpen && <UseStarterModal starter={starter} paletteVariant={variant} reason={useOpen.reason} onClose={() => setUseOpen(null)} />}
    </div>
  )
}

/** “Seu site”: o projeto aberto no mesmo visualizador, com edição contextual. */
export function MySitePage() {
  const project = useStudio((s) => s.project)
  const starter = starterById(project.origin?.templateId)
  if (!project.pages.length)
    return (
      <div className="ui-page">
        <PageHeader eyebrow="Seu site" title="Páginas e componentes" description="Aqui você vê e edita o site inteiro, página por página, clicando nos elementos." />
        <Callout title="Este projeto ainda não tem páginas.">
          Projetos criados a partir de um modelo trazem páginas prontas (painel, agenda, catálogo…) com componentes editáveis. Projetos montados etapa por etapa usam a{' '}
          <Link to="/modulos/preview">Prévia integrada</Link>.
        </Callout>
        <div className="ui-actions" style={{ marginTop: 16 }}>
          <Link className="ui-btn ui-btn--primary" to="/modelos">
            <LayoutTemplate aria-hidden="true" /> Escolher um modelo
          </Link>
          <Link className="ui-btn ui-btn--secondary" to="/modulos/preview">
            <Compass aria-hidden="true" /> Abrir a Prévia integrada
          </Link>
        </div>
      </div>
    )
  return (
    <div className="ui-page">
      <SiteViewer project={project} mode="site" starter={starter} />
    </div>
  )
}
