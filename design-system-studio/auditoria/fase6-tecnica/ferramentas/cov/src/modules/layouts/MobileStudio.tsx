import { memo, useCallback, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Check, Eye, Hand } from 'lucide-react'
import { SUGGESTIONS } from '@/core/project'
import { useProject, useStudio } from '@/core/store'
import { useResolvedTheme } from '@/core/theme'
import type { ResolvedTheme } from '@/core/types'
import { Badge, Button, Callout, keepScroll, OptionCard } from '@/ui'
import { PromptButton } from '@/prompt/PromptButton'
import { mobileById, mobileLayouts } from './catalog'
import { MOBILE_GROUP_GUIDE } from './guide'
import { PhonePreview, thumbShowsMenu } from './phone'
import { ChipRow, LegendKey, LegendsSwitch, useElementWidth, useViewportHeight } from './shared'
import { MOBILE_GROUPS, type MobileGroup, type MobileLayout } from './types'
import './layouts.css'

type GroupFilter = 'todos' | MobileGroup
type Mode = 'wide' | 'medium' | 'narrow'

const groupName = (id: MobileGroup) => MOBILE_GROUPS.find((g) => g.id === id)?.name ?? id
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
const TOPBAR = 60
const THUMB_W = 104

const MobileCard = memo(function MobileCard({
  layout,
  selected,
  suggested,
  theme,
  onSelect,
}: {
  layout: MobileLayout
  selected: boolean
  suggested: boolean
  theme: ResolvedTheme
  onSelect: (id: string) => void
}) {
  return (
    <div className="lay-mob-card">
      <OptionCard
        testId={`mobile-option-${layout.id}`}
        selected={selected}
        onSelect={() => onSelect(layout.id)}
        selectedLabel="Escolhido"
        ariaLabel={`${layout.name}. ${layout.description}`}
        media={
          <div className="lay-mob-media">
            <PhonePreview layout={layout} theme={theme} showLegends={false} width={THUMB_W} detail="thumb" initialOpen={thumbShowsMenu(layout)} testId="phone-thumb" />
          </div>
        }
        title={layout.name}
        meta={suggested ? <span className="lay-suggested">Sugerido</span> : undefined}
      />
    </div>
  )
})

function MobileInfo({ layout, isSelected, guided, onChoose }: { layout: MobileLayout; isSelected: boolean; guided: boolean; onChoose: () => void }) {
  return (
    <div className="lay-mob-info" aria-label="Modelo em destaque">
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
        <Badge>{groupName(layout.group)}</Badge>
        {layout.config.oneScreen && <Badge tone="accent">One Screen</Badge>}
      </div>
      <p className="lay-detail__desc">{layout.description}</p>
      <p className="lay-detail__tags" title={layout.tags?.join(', ')}>
        <strong>Combina com:</strong> {layout.tags?.join(' · ')}
      </p>
      <div className="lay-detail__actions">
        {!isSelected && (
          <Button variant="primary" size="sm" icon={<Check />} onClick={() => keepScroll(onChoose)}>
            Escolher este modelo
          </Button>
        )}
        <PromptButton target={{ kind: 'mobile', id: layout.id }} />
      </div>
      {!guided && (
        <details className="lay-tech-details">
          <summary>Detalhes técnicos: comportamento e adaptações</summary>
        <div className="lay-tech" tabIndex={0} aria-label="Como funciona e como se adapta">
          <h3>Como funciona</h3>
          <ul>
            {(layout.spec.behavior ?? []).slice(0, 4).map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <h3>Adaptações</h3>
          <ul>
            {layout.spec.responsive.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        </details>
      )}
    </div>
  )
}

/** 44 arquiteturas mobile: miniaturas + celular grande interativo. */
export function MobileStudio({ guided = false }: { guided?: boolean }) {
  const mobileId = useProject((p) => p.layout.mobileId)
  const showLegends = useProject((p) => p.prefs.showLegends)
  const showHints = useProject((p) => p.prefs.showHints)
  const projectType = useProject((p) => p.meta.projectType)
  const selectMobile = useStudio((s) => s.selectMobile)
  const theme = useResolvedTheme()
  const [group, setGroup] = useState<GroupFilter>('todos')
  const rootRef = useRef<HTMLDivElement>(null)
  const rootWidth = useElementWidth(rootRef, 1100)
  const vh = useViewportHeight()

  const mode: Mode = rootWidth >= 940 ? 'wide' : rootWidth >= 620 ? 'medium' : 'narrow'
  const infoW = clamp(Math.round(rootWidth * 0.24), 210, 280)
  const phoneW =
    mode === 'wide'
      ? clamp(Math.floor((vh - TOPBAR - 44) / 2.06), 280, 380)
      : mode === 'medium'
        ? clamp(Math.floor((vh - TOPBAR - 44 - 168) / 2.06), 240, 340)
        : clamp(rootWidth - 22, 240, 360)

  const suggested = useMemo(() => new Set(projectType ? SUGGESTIONS[projectType].mobile : []), [projectType])
  const selected = mobileById(mobileId)
  const shown = selected ?? mobileById([...suggested][0]) ?? mobileLayouts[0]
  const onSelect = useCallback((id: string) => selectMobile(id), [selectMobile])

  const options = [
    { id: 'todos', label: 'Todos', count: mobileLayouts.length },
    ...MOBILE_GROUPS.map((g) => ({ id: g.id, label: g.name, count: mobileLayouts.filter((l) => l.group === g.id).length })),
  ]
  const groups = MOBILE_GROUPS.filter((g) => group === 'todos' || g.id === group).map((g) => ({ group: g, items: mobileLayouts.filter((l) => l.group === g.id) }))

  const card = (l: MobileLayout) => (
    <MobileCard key={l.id} layout={l} selected={l.id === mobileId} suggested={suggested.has(l.id)} theme={theme} onSelect={onSelect} />
  )

  const info = <MobileInfo layout={shown} isSelected={Boolean(selected)} guided={guided} onChoose={() => selectMobile(shown.id)} />
  const phone = (
    <div className="lay-mob-phone">
      <PhonePreview layout={shown} theme={theme} showLegends={showLegends} width={phoneW} interactive />
      {showHints && (
        <p className="lay-mob-hint">
          <Hand size={13} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> Toque nos botões do celular: menus abrem e fecham como no site de verdade.
        </p>
      )}
    </div>
  )

  return (
    <div className="lay-gal">
      <div className="lay-gal-top">
        <LegendsSwitch />
        {showHints && <LegendKey mobile />}
      </div>

      <Callout title="O celular tem arquitetura própria.">
        Escolha aqui como o site funciona no celular. O menu lateral do computador não vira automaticamente um drawer: o que valer no celular é
        o que você escolher nesta página.
      </Callout>

      <div className="lay-mob-filters">
        <ChipRow label="Grupos de navegação móvel" options={options} value={group} onChange={(id) => setGroup(id as GroupFilter)} />
        <p className="lay-family-note">
          {group === 'todos'
            ? `${mobileLayouts.length} modelos em ${MOBILE_GROUPS.length} grupos. ${guided ? 'Toque em um modelo para ver no celular grande.' : 'Clique em um modelo para vê-lo no celular grande e testar os menus.'}`
            : MOBILE_GROUP_GUIDE[group]}
        </p>
      </div>

      <div ref={rootRef} className="lay-mob" data-mode={mode} style={{ '--lay-info-w': `${infoW}px` } as CSSProperties}>
        <div className="lay-mob-list">
          {mode === 'narrow' ? (
            <div className="lay-mob-grid" role="group" aria-label="Modelos de navegação móvel">
              {groups.flatMap(({ items }) => items).map(card)}
            </div>
          ) : (
            groups.map(({ group: g, items }) => (
              <section key={g.id} className="lay-section" aria-label={g.name}>
                {group === 'todos' && (
                  <header className="lay-section__head">
                    <h3 className="lay-section__title">
                      {g.name} <span className="lay-section__count">{items.length} modelos</span>
                    </h3>
                    <p className="lay-section__desc">{guided ? MOBILE_GROUP_GUIDE[g.id] : g.description}</p>
                  </header>
                )}
                <div className="lay-mob-grid">{items.map(card)}</div>
              </section>
            ))
          )}
        </div>
        <div className="lay-mob-stage">
          {info}
          {phone}
        </div>
      </div>
    </div>
  )
}
