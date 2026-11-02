import { useMemo, useState } from 'react'
import { LayoutTemplate, Palette, PanelsTopLeft, SearchX, SlidersHorizontal } from 'lucide-react'
import { useProject, useStudio } from '@/core/store'
import { fontName } from '@/core/tokens'
import { Badge, Button, EmptyState, FilterChips, keepScroll, OptionCard, PageHeader, SearchInput, toast } from '@/ui'
import { categoryName, templateById, templates, TEMPLATE_CATEGORIES } from './catalog'
import { TemplateEditor } from './TemplateEditor'
import { TemplateThumb } from './frames'
import { RADIUS_SHORT, resolveTemplateTheme, type TemplateOverrides } from './theme'
import type { TemplateModel } from './types'
import './templates.css'

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

function matches(t: TemplateModel, query: string): boolean {
  const q = normalize(query.trim())
  if (!q) return true
  const hay = normalize([t.name, t.brand, t.description, categoryName(t.category), ...(t.tags ?? []), ...t.sections.map((s) => s.name)].join(' '))
  return q.split(/\s+/).every((word) => hay.includes(word))
}

export default function TemplatesPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Modelos reutilizáveis"
        title="Template Studio"
        description="28 modelos de página prontos para reaproveitar. Escolha um, ajuste cores, fontes e cantos, marque as partes que quer detalhar e leve tudo para o Master Prompt."
      />
      <TemplateGallery />
    </div>
  )
}

/** Galeria de templates com filtros, miniaturas vivas e editor. `guided` simplifica a interface. */
export function TemplateGallery({ guided = false }: { guided?: boolean }) {
  const [category, setCategory] = useState('todos')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const projectTemplate = useProject((p) => p.template)
  const showHints = useProject((p) => p.prefs.showHints)
  const setTemplate = useStudio((s) => s.setTemplate)

  const filters = useMemo(
    () => [
      { id: 'todos', label: 'Todos', count: templates.length },
      ...TEMPLATE_CATEGORIES.map((c) => ({ id: c.id, label: c.name, count: templates.filter((t) => t.category === c.id).length })),
    ],
    [],
  )
  const visible = useMemo(() => templates.filter((t) => (category === 'todos' || t.category === category) && matches(t, query)), [category, query])
  const current = projectTemplate ? templateById(projectTemplate.id) : undefined
  const open = openId ? templateById(openId) : undefined

  return (
    <div className="tpl-page">
      <section className="tpl-explain" aria-label="Diferença entre templates e inspirações">
        <div className="tpl-explain__item">
          <span className="tpl-explain__icon" aria-hidden="true">
            <PanelsTopLeft />
          </span>
          <div>
            <h2 className="tpl-explain__title">Template Studio (você está aqui)</h2>
            <p>
              Modelos de página para <strong>reaproveitar como molde</strong>: a estrutura (quais partes e em que ordem) vem pronta. Você troca cores, fontes e cantos, e a IA monta essa mesma página no seu projeto.
            </p>
          </div>
        </div>
        <div className="tpl-explain__item">
          <span className="tpl-explain__icon tpl-explain__icon--alt" aria-hidden="true">
            <Palette />
          </span>
          <div>
            <h2 className="tpl-explain__title">Galeria de Inspiração</h2>
            <p>
              Sites fictícios completos para você <strong>se inspirar na identidade</strong> — clima, cores e tipografia. Servem de referência visual, não de molde.{' '}
              <a className="tpl-explain__link" href="#/modulos/inspiracao">
                Abrir a galeria
              </a>
            </p>
          </div>
        </div>
      </section>

      {current && projectTemplate && (
        <div className="tpl-current" data-testid="template-current">
          <div className="tpl-current__text">
            <Badge tone="success">No projeto</Badge>
            <strong>{current.name}</strong>
            <span className="tpl-current__meta">
              {summaryOf(current, projectTemplate.overrides)}
              {projectTemplate.sections.length > 0 ? ` · ${projectTemplate.sections.length} partes marcadas` : ''}
            </span>
          </div>
          <div className="tpl-current__actions">
            <Button size="sm" variant="secondary" icon={<SlidersHorizontal />} onClick={() => setOpenId(current.id)}>
              Abrir editor
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setTemplate(null)
                toast.info('Template removido do projeto.')
              }}
            >
              Remover
            </Button>
          </div>
        </div>
      )}

      <div className="tpl-toolbar">
        <FilterChips label="Categorias de template" options={filters} value={category} onChange={(id) => keepScroll(() => setCategory(id))} />
        {!guided && (
          <div className="tpl-toolbar__search">
            <SearchInput label="Buscar templates" placeholder="Buscar: restaurante, preços, podcast…" value={query} onChange={(v) => keepScroll(() => setQuery(v))} />
          </div>
        )}
      </div>

      {showHints && (
        <p className="tpl-hint">
          <LayoutTemplate aria-hidden="true" />
          Clique em um modelo para abrir o editor com a prévia grande, no computador e no celular.
        </p>
      )}

      {visible.length === 0 ? (
        <EmptyState icon={<SearchX />} title="Nenhum template encontrado" action={<Button onClick={() => keepScroll(() => { setQuery(''); setCategory('todos') })}>Limpar filtros</Button>}>
          Tente outra palavra ou escolha “Todos”.
        </EmptyState>
      ) : (
        <div className="ui-grid tpl-grid" style={{ ['--min' as string]: '296px' }}>
          {visible.map((t) => {
            const inProject = projectTemplate?.id === t.id
            return (
              <OptionCard
                key={t.id}
                testId={`template-option-${t.id}`}
                selected={inProject}
                selectedLabel="No projeto"
                onSelect={() => setOpenId(t.id)}
                ariaLabel={`Abrir o template ${t.name}`}
                media={<TemplateThumb template={t} overrides={inProject ? projectTemplate?.overrides : undefined} />}
                title={t.name}
                meta={
                  <span className="tpl-card-meta">
                    <Swatches t={t} overrides={inProject ? projectTemplate?.overrides : undefined} />
                    {categoryName(t.category)} · {t.sections.length} partes
                  </span>
                }
                description={t.description}
              />
            )
          })}
        </div>
      )}

      {open && <TemplateEditor key={open.id} template={open} onClose={() => setOpenId(null)} />}
    </div>
  )
}

function Swatches({ t, overrides }: { t: TemplateModel; overrides?: TemplateOverrides }) {
  const theme = resolveTemplateTheme(t, overrides)
  return (
    <span className="tpl-swatches" aria-hidden="true">
      {[theme.primary, theme.bg, theme.text].map((c, i) => (
        <span key={i} style={{ background: c }} />
      ))}
    </span>
  )
}

function summaryOf(t: TemplateModel, overrides: TemplateOverrides) {
  const theme = resolveTemplateTheme(t, overrides)
  const changed = Object.keys(overrides ?? {}).length
  return `${fontName(theme.headingId)} + ${fontName(theme.bodyId)} · cantos ${RADIUS_SHORT[theme.radius].toLowerCase()}${changed ? ` · ${changed} ${changed === 1 ? 'ajuste' : 'ajustes'}` : ''}`
}
