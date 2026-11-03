import { useMemo, useState } from 'react'
import { ArrowDown, ChevronDown, Copy, LayoutGrid, Plus, SlidersHorizontal, Trash2 } from 'lucide-react'
import type { ComponentInstance } from '@/core/project'
import { studio, useProject } from '@/core/store'
import { useResolvedTheme } from '@/core/theme'
import type { ResolvedTheme } from '@/core/types'
import { PromptButton } from '@/prompt/PromptButton'
import { Badge, Button, Callout, EmptyState, FilterChips, IconButton, Input, OptionCard, SearchInput, Select, cx, keepScroll, toast } from '@/ui'
import { categoryById, componentCategories, ESSENTIAL_CATEGORY_IDS, familyById, visualFamilies } from './catalog'
import { ComponentEditor } from './ComponentEditor'
import { ComponentPreview } from './ComponentPreview'
import { FAMILY_TAGS } from './families'
import { COMPONENT_GROUPS, type ComponentCategory } from './types'
import './components.css'

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Biblioteca de 66 categorias × 16 famílias, com editor paramétrico. */
export function ComponentLibrary({ guided = false }: { guided?: boolean }) {
  const showHints = useProject((p) => p.prefs.showHints)
  const instances = useProject((p) => p.components)
  const theme = useResolvedTheme()

  const [categoryId, setCategoryId] = useState('botoes')
  const [showAll, setShowAll] = useState(!guided)
  const [catQuery, setCatQuery] = useState('')
  const [famQuery, setFamQuery] = useState('')
  const [famTag, setFamTag] = useState('all')
  const [chosen, setChosen] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [navOpen, setNavOpen] = useState(false)

  const category = categoryById(categoryId) ?? componentCategories[0]
  const groupName = COMPONENT_GROUPS.find((g) => g.id === category.group)?.name ?? ''

  const visibleCats = useMemo(() => {
    const base = showAll ? componentCategories : componentCategories.filter((c) => ESSENTIAL_CATEGORY_IDS.includes(c.id))
    const q = norm(catQuery.trim())
    if (!q) return base
    return componentCategories.filter((c) => norm(`${c.number} ${c.name} ${c.description} ${c.id}`).includes(q))
  }, [showAll, catQuery])

  const families = useMemo(() => {
    const q = norm(famQuery.trim())
    return visualFamilies.filter((f) => (famTag === 'all' || f.tags.includes(famTag)) && (!q || norm(`${f.name} ${f.description} ${f.tags.join(' ')}`).includes(q)))
  }, [famQuery, famTag])

  const countFor = (familyId: string) => instances.filter((i) => i.categoryId === category.id && i.familyId === familyId).length
  const inCategory = instances.filter((i) => i.categoryId === category.id).length
  const lastFamily = [...instances].reverse().find((i) => i.categoryId === category.id)?.familyId
  const chosenFamily = chosen[category.id] ?? lastFamily ?? null

  const selectCategory = (id: string) =>
    keepScroll(() => {
      setCategoryId(id)
      setNavOpen(false)
    })

  const add = (familyId: string) => {
    const id = studio().addComponent(category.id, familyId)
    setChosen((c) => ({ ...c, [category.id]: familyId }))
    setEditingId(id)
    toast.success(`${category.name} · ${familyById(familyId)?.name} adicionado ao projeto e ao Master Prompt.`)
  }

  const navList = (
    <div className={cx('cmp-nav__list', navOpen && 'cmp-nav__list--open')}>
      {COMPONENT_GROUPS.map((g) => {
        const cats = visibleCats.filter((c) => c.group === g.id)
        if (!cats.length) return null
        return (
          <div key={g.id} className="cmp-nav__group" role="group" aria-label={g.name}>
            <span className="cmp-nav__gtitle">{g.name}</span>
            {cats.map((c) => (
              <CategoryButton key={c.id} category={c} active={c.id === category.id} count={instances.filter((i) => i.categoryId === c.id).length} onSelect={() => selectCategory(c.id)} />
            ))}
          </div>
        )
      })}
      {!visibleCats.length && <p className="cmp-nav__empty">Nenhuma categoria encontrada.</p>}
      {guided && (
        <Button size="sm" variant="ghost" className="cmp-nav__toggle" icon={<LayoutGrid />} onClick={() => keepScroll(() => setShowAll((s) => !s))}>
          {showAll ? 'Mostrar só as essenciais' : 'Ver todas as 66 categorias'}
        </Button>
      )}
    </div>
  )

  return (
    <div className="cmp-lib" data-testid="component-library">
      {showHints && (
        <Callout title={guided ? 'Escolha pelos olhos.' : 'Como funciona:'}>
          Escolha um tipo de componente à esquerda e compare-o nas 16 famílias visuais. Todos usam a paleta global aprovada.
          Clique em <strong>Adicionar ao projeto</strong> para incluí-lo no Master Prompt e personalizar textos, ícones e tamanhos.
        </Callout>
      )}

      <div className="cmp-layout">
        <aside className="cmp-nav" aria-label="Categorias de componentes">
          <div className="cmp-nav__mobile">
            <label className="ui-label" htmlFor="cmp-cat-select">
              Categoria
            </label>
            <Select id="cmp-cat-select" value={category.id} onChange={(e) => selectCategory(e.target.value)}>
              {COMPONENT_GROUPS.map((g) => (
                <optgroup key={g.id} label={g.name}>
                  {componentCategories
                    .filter((c) => c.group === g.id && (showAll || ESSENTIAL_CATEGORY_IDS.includes(c.id) || c.id === category.id))
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </Select>
            <Button size="sm" variant="ghost" iconRight={<ChevronDown className={cx(navOpen && 'cmp-rot')} />} aria-expanded={navOpen} onClick={() => setNavOpen((o) => !o)}>
              {navOpen ? 'Fechar lista' : 'Lista completa'}
            </Button>
          </div>
          <div className="cmp-nav__search">
            <SearchInput value={catQuery} onChange={setCatQuery} label="Buscar categoria" placeholder="Buscar categoria…" />
          </div>
          {guided && !showAll && !catQuery && showHints && <p className="cmp-nav__note">Começamos pelos componentes essenciais. Você pode ver todos quando quiser.</p>}
          {navList}
        </aside>

        <div className="cmp-main">
          <header className="cmp-cat">
            <span className="ui-eyebrow">
              {groupName} · {category.number} de 66
            </span>
            <h2 className="cmp-cat__title">{category.name}</h2>
            <p className="cmp-cat__desc">{category.description}</p>
            {inCategory > 0 && (
              <a className="cmp-cat__inproject" href="#cmp-projeto" onClick={(e) => { e.preventDefault(); document.getElementById('cmp-projeto')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
                <ArrowDown aria-hidden="true" /> {inCategory} no projeto
              </a>
            )}
          </header>

          <div className="ui-toolbar cmp-toolbar">
            <div className="ui-toolbar__grow">
              <SearchInput value={famQuery} onChange={setFamQuery} label="Buscar família visual" placeholder="Buscar família (ex.: escuro, vidro, compacto)…" />
            </div>
            {!guided && <FilterChips label="Filtrar famílias" value={famTag} onChange={(id) => keepScroll(() => setFamTag(id))} options={FAMILY_TAGS.map((t) => ({ id: t.id, label: t.label, count: t.id === 'all' ? visualFamilies.length : visualFamilies.filter((f) => f.tags.includes(t.id)).length }))} />}
          </div>

          {families.length ? (
            <div className="cmp-grid">
              {families.map((f) => {
                const count = countFor(f.id)
                return (
                  <OptionCard
                    key={f.id}
                    testId={`family-option-${f.id}`}
                    selected={chosenFamily === f.id}
                    selectedLabel="Escolhido"
                    ariaLabel={`Escolher a família ${f.name} para ${category.name}`}
                    onSelect={() => setChosen((c) => ({ ...c, [category.id]: f.id }))}
                    media={<FamilyPreview categoryId={category.id} familyId={f.id} theme={theme} />}
                    title={`${f.number}. ${f.name}`}
                    meta={count > 0 ? `No projeto: ${count}` : undefined}
                    description={f.description}
                    footer={
                      <>
                        <Button size="sm" variant="primary" icon={<Plus />} onClick={() => add(f.id)} data-testid={`add-component-${f.id}`}>
                          Adicionar ao projeto
                        </Button>
                        <PromptButton target={{ kind: 'component-model', categoryId: category.id, familyId: f.id }} />
                      </>
                    }
                  />
                )
              })}
            </div>
          ) : (
            <EmptyState title="Nenhuma família encontrada" action={<Button size="sm" onClick={() => { setFamQuery(''); setFamTag('all') }}>Limpar filtros</Button>}>
              Tente outra palavra ou remova o filtro.
            </EmptyState>
          )}

          <InstancesPanel instances={instances} onEdit={setEditingId} />
        </div>
      </div>

      {editingId && <ComponentEditor instanceId={editingId} onClose={() => setEditingId(null)} />}
    </div>
  )
}

function CategoryButton({ category, active, count, onSelect }: { category: ComponentCategory; active: boolean; count: number; onSelect: () => void }) {
  return (
    <button type="button" className="cmp-nav__item" aria-pressed={active} data-testid={`component-category-${category.id}`} onClick={onSelect}>
      <span className="cmp-nav__num">{category.number}</span>
      <span className="cmp-nav__name">{category.name}</span>
      {count > 0 && <span className="cmp-nav__count" aria-label={`${count} no projeto`}>{count}</span>}
    </button>
  )
}

/** Prévia da galeria: decorativa (o cartão inteiro é o botão). */
function FamilyPreview({ categoryId, familyId, theme }: { categoryId: string; familyId: string; theme: ResolvedTheme }) {
  return (
    <div aria-hidden="true" className="cmp-fam-media">
      <ComponentPreview categoryId={categoryId} familyId={familyId} theme={theme} height={280} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* No projeto                                                                  */
/* -------------------------------------------------------------------------- */

function InstancesPanel({ instances, onEdit }: { instances: ComponentInstance[]; onEdit: (id: string) => void }) {
  return (
    <section className="cmp-proj" id="cmp-projeto" aria-labelledby="cmp-proj-title" data-testid="component-instances">
      <div className="cmp-proj__head">
        <h2 id="cmp-proj-title" className="ui-section__title">
          No projeto <Badge tone={instances.length ? 'accent' : undefined}>{instances.length}</Badge>
        </h2>
        <p className="ui-section__desc">Cada componente adicionado entra no Master Prompt com sua família, configuração e exceções.</p>
      </div>
      {instances.length === 0 ? (
        <EmptyState icon={<LayoutGrid />} title="Nenhum componente adicionado ainda">
          Escolha uma família acima e clique em “Adicionar ao projeto”.
        </EmptyState>
      ) : (
        <ul className="cmp-proj__list">
          {instances.map((inst) => (
            <InstanceRow key={inst.id} instance={inst} onEdit={() => onEdit(inst.id)} />
          ))}
        </ul>
      )}
    </section>
  )
}

function InstanceRow({ instance, onEdit }: { instance: ComponentInstance; onEdit: () => void }) {
  const [confirm, setConfirm] = useState(false)
  const category = categoryById(instance.categoryId)
  const family = familyById(instance.familyId)
  const overrides = Object.keys(instance.tokenOverrides).length
  const changed = Object.keys(instance.props).length
  return (
    <li className="cmp-inst" data-testid={`component-instance-${instance.id}`}>
      <span className="cmp-inst__num" aria-hidden="true">
        {category?.number ?? '?'}
      </span>
      <div className="cmp-inst__main">
        <Input aria-label="Nome do componente no projeto" value={instance.label} placeholder={category?.name ?? instance.categoryId} onChange={(e) => studio().updateComponent(instance.id, { label: e.target.value })} />
        <span className="cmp-inst__meta">
          {category?.name ?? instance.categoryId} · {family?.name ?? instance.familyId}
          {changed > 0 && ` · ${changed} ajuste(s)`}
          {overrides > 0 && <Badge tone="warning">{overrides} exceção(ões)</Badge>}
        </span>
      </div>
      <div className="cmp-inst__actions">
        {confirm ? (
          <>
            <span className="cmp-inst__confirm">Remover do projeto?</span>
            <Button size="sm" variant="ghost" onClick={() => setConfirm(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="danger"
              icon={<Trash2 />}
              onClick={() => {
                studio().removeComponent(instance.id)
                toast.info('Componente removido do projeto.')
              }}
            >
              Remover
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="secondary" icon={<SlidersHorizontal />} onClick={onEdit}>
              Personalizar
            </Button>
            <IconButton
              label="Duplicar"
              size="sm"
              onClick={() => {
                studio().duplicateComponent(instance.id)
                toast.success('Cópia criada.')
              }}
            >
              <Copy />
            </IconButton>
            <IconButton label="Remover" size="sm" onClick={() => setConfirm(true)}>
              <Trash2 />
            </IconButton>
            <PromptButton target={{ kind: 'component', instanceId: instance.id }} />
          </>
        )}
      </div>
    </li>
  )
}
