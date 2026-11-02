import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Check, Eye, Sparkles } from 'lucide-react'
import { SUGGESTIONS, PROJECT_TYPES } from '@/core/project'
import { useProject, useStudio } from '@/core/store'
import { Badge, Button, Callout, keepScroll, OptionCard, Term } from '@/ui'
import { PromptButton } from '@/prompt/PromptButton'
import { desktopById, desktopLayouts } from './catalog'
import { desktopMeasureFacts, DESKTOP_FAMILY_GUIDE } from './guide'
import { ChipRow, FitSchematic, LegendKey, LegendsSwitch, useElementWidth } from './shared'
import { DESKTOP_FAMILIES, type DesktopFamily, type DesktopLayout } from './types'
import './layouts.css'

type FamilyFilter = 'todos' | DesktopFamily

const familyName = (id: DesktopFamily) => DESKTOP_FAMILIES.find((f) => f.id === id)?.name ?? id

function shortMeasures(l: DesktopLayout): string {
  const m = l.measurements
  const parts: string[] = []
  if (m.sidebar) parts.push(`Sidebar ${m.sidebar}`)
  if (m.rail) parts.push(`Rail ${m.rail}`)
  if (m.header) parts.push(`Header ${m.header}`)
  if (m.submenu) parts.push(`Submenu ${m.submenu}`)
  if (m.panel) parts.push(`Painel ${m.panel}`)
  if (m.detail) parts.push(`Detalhes ${m.detail}`)
  return parts.slice(0, 2).join(' · ') + (parts.length ? ' px' : '')
}

const DesktopCard = memo(function DesktopCard({
  layout,
  selected,
  suggested,
  showLegends,
  guided,
  onSelect,
}: {
  layout: DesktopLayout
  selected: boolean
  suggested: boolean
  showLegends: boolean
  guided: boolean
  onSelect: (id: string) => void
}) {
  const meta = (
    <>
      {suggested && <span className="lay-suggested">Sugerido · </span>}
      {guided ? layout.tags?.[0] : layout.oneScreen ? `One Screen · ${shortMeasures(layout)}` : shortMeasures(layout)}
    </>
  )
  return (
    <OptionCard
      testId={`desktop-option-${layout.id}`}
      selected={selected}
      onSelect={() => onSelect(layout.id)}
      selectedLabel="Escolhido"
      ariaLabel={`${layout.name}. ${layout.description}`}
      media={
        <div className="lay-desk-media">
          <FitSchematic layout={layout} showLegends={showLegends} detail="thumb" />
        </div>
      }
      title={layout.name}
      meta={meta}
      description={<span className="lay-card-desc">{layout.description}</span>}
    />
  )
})

function DetailPanel({ layout, isSelected, guided, onChoose }: { layout: DesktopLayout; isSelected: boolean; guided: boolean; onChoose: () => void }) {
  const showLegends = useProject((p) => p.prefs.showLegends)
  const projectType = useProject((p) => p.meta.projectType)
  const selectDesktop = useStudio((s) => s.selectDesktop)
  const facts = desktopMeasureFacts(layout)
  const suggestions = projectType ? SUGGESTIONS[projectType].desktop.map((id) => desktopById(id)).filter(Boolean) as DesktopLayout[] : []
  const typeName = PROJECT_TYPES.find((t) => t.id === projectType)?.name

  return (
    <div className="lay-detail" aria-label="Modelo em destaque">
      <div className="lay-detail__preview">
        <FitSchematic layout={layout} showLegends={showLegends} detail="full" />
      </div>
      <div className="lay-detail__status" data-selected={isSelected}>
        {isSelected ? (
          <>
            <Check aria-hidden="true" /> Escolhido para o seu projeto
          </>
        ) : (
          <>
            <Eye aria-hidden="true" /> Exemplo · ainda não escolhido
          </>
        )}
      </div>
      <div className="lay-detail__title">
        <h2 title={layout.name}>{layout.name}</h2>
      </div>
      <div className="lay-detail__badges">
        <Badge>{familyName(layout.family)}</Badge>
        {layout.oneScreen && <Badge tone="accent">One Screen</Badge>}
      </div>
      <p className="lay-detail__desc">{layout.description}</p>
      <p className="lay-detail__tags" title={layout.tags?.join(', ')}>
        <strong>Combina com:</strong> {layout.tags?.join(' · ')}
      </p>
      <div className="lay-facts">
        <span className="lay-facts__label">Medidas recomendadas (referência 1280 × 800 — não são fixas)</span>
        <ul className="lay-facts__strip" aria-label="Medidas recomendadas">
          {facts.map((f) => (
            <li key={f.label} className="lay-fact">
              {f.label} <b>{f.value}</b>
            </li>
          ))}
        </ul>
      </div>
      <div className="lay-detail__actions">
        {!isSelected && (
          <Button variant="primary" size="sm" icon={<Check />} onClick={() => keepScroll(onChoose)}>
            Escolher este modelo
          </Button>
        )}
        <PromptButton target={{ kind: 'desktop', id: layout.id }} />
      </div>
      {!guided && (
        <details className="lay-tech-details">
          <summary>Detalhes técnicos: comportamento, telas menores e grid</summary>
        <div className="lay-tech" tabIndex={0} aria-label="Como funciona e como se adapta">
          <h3>Como funciona</h3>
          <ul>
            {(layout.spec.behavior ?? []).slice(0, 4).map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <h3>Em telas menores</h3>
          <ul>
            {layout.spec.responsive.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <h3>Grid de referência</h3>
          <ul>
            <li>
              Colunas: <code>{layout.grid.columns}</code> · Linhas: <code>{layout.grid.rows}</code>
              {layout.grid.gap ? ` · Espaço ${layout.grid.gap} px` : ''}
            </li>
          </ul>
        </div>
        </details>
      )}
      {!guided && (
        <div className="lay-suggest">
          <span className="lay-suggest__title">
            <Sparkles size={13} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> Sugeridos para seu tipo de projeto
            {typeName ? ` (${typeName})` : ''}
          </span>
          {suggestions.length ? (
            <div className="ui-chips">
              {suggestions.map((s) => (
                <button key={s.id} type="button" className="ui-chip" aria-pressed={s.id === layout.id && isSelected} onClick={() => keepScroll(() => selectDesktop(s.id))}>
                  {s.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="lay-note">Defina o tipo de projeto em “Objetivo” para ver sugestões. São apenas sugestões — a escolha é sua.</p>
          )}
        </div>
      )}
    </div>
  )
}

/** Galeria de 42 arquiteturas desktop com miniaturas didáticas. */
export function DesktopGallery({ guided = false }: { guided?: boolean }) {
  const desktopId = useProject((p) => p.layout.desktopId)
  const showLegends = useProject((p) => p.prefs.showLegends)
  const showHints = useProject((p) => p.prefs.showHints)
  const projectType = useProject((p) => p.meta.projectType)
  const selectDesktop = useStudio((s) => s.selectDesktop)
  const [family, setFamily] = useState<FamilyFilter>('todos')
  const rootRef = useRef<HTMLDivElement>(null)
  const rootWidth = useElementWidth(rootRef, 1200)
  const wide = rootWidth >= 880

  const suggested = useMemo(() => new Set(projectType ? SUGGESTIONS[projectType].desktop : []), [projectType])
  const selected = desktopById(desktopId)
  const shown = selected ?? desktopById([...suggested][0]) ?? desktopLayouts[0]
  const onSelect = useCallback((id: string) => selectDesktop(id), [selectDesktop])

  const options = [
    { id: 'todos', label: 'Todos', count: desktopLayouts.length },
    ...DESKTOP_FAMILIES.map((f) => ({ id: f.id, label: f.name, count: desktopLayouts.filter((l) => l.family === f.id).length })),
  ]
  const groups = DESKTOP_FAMILIES.filter((f) => family === 'todos' || f.id === family).map((f) => ({
    family: f,
    items: desktopLayouts.filter((l) => l.family === f.id),
  }))

  return (
    <div className="lay-gal">
      <div className="lay-gal-top">
        <LegendsSwitch />
        {showHints && <LegendKey />}
      </div>

      {guided && showHints && (
        <Callout title="Primeiro o esqueleto.">
          Escolha como as partes do site se organizam no computador: onde fica o menu, a barra superior e o conteúdo. Cores e estilo vêm
          depois. Clique em um desenho para escolher — dá para trocar quando quiser.
        </Callout>
      )}

      <div ref={rootRef} className="lay-desk" data-wide={wide}>
        <div className="lay-desk-list">
          <ChipRow label="Famílias de layout" options={options} value={family} onChange={(id) => setFamily(id as FamilyFilter)} />
          <p className="lay-family-note">
            {family === 'todos' ? (
              <>
                {desktopLayouts.length} modelos em {DESKTOP_FAMILIES.length} famílias. Uma <Term id="sidebar">sidebar</Term> integral vai do topo à base,
                encostada na borda; uma flutuante fica afastada, como um cartão.
              </>
            ) : (
              DESKTOP_FAMILY_GUIDE[family]
            )}
          </p>
          {groups.map(({ family: f, items }) => (
            <section key={f.id} className="lay-section" aria-labelledby={`lay-fam-${f.id}`}>
              {family === 'todos' && (
                <header className="lay-section__head">
                  <h3 className="lay-section__title" id={`lay-fam-${f.id}`}>
                    {f.name} <span className="lay-section__count">{items.length} modelos</span>
                  </h3>
                  <p className="lay-section__desc">{guided ? DESKTOP_FAMILY_GUIDE[f.id] : f.description}</p>
                </header>
              )}
              {family !== 'todos' && (
                <h3 className="sr-only" id={`lay-fam-${f.id}`} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                  {f.name}
                </h3>
              )}
              <div className="lay-desk-grid">
                {items.map((l) => (
                  <DesktopCard
                    key={l.id}
                    layout={l}
                    selected={l.id === desktopId}
                    suggested={suggested.has(l.id)}
                    showLegends={showLegends}
                    guided={guided}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="lay-desk-detail" aria-label="Detalhes do layout">
          <DetailPanel layout={shown} isSelected={Boolean(selected)} guided={guided} onChoose={() => selectDesktop(shown.id)} />
        </aside>
      </div>
    </div>
  )
}
