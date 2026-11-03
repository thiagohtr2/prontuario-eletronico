import { STORIES_OPTIONS, WIDE_OPTIONS, type StoriesScope, type WideBehavior } from '@/core/project'
import { useProject, useStudio } from '@/core/store'
import { keepScroll, Section, Segmented } from '@/ui'
import { mobileById } from './catalog'

/**
 * Decisões de escopo que a auditoria mostrou serem interpretadas de jeitos diferentes pelas IAs
 * (B-22): comportamento em monitores grandes e em quais telas aparecem os stories.
 */
export function ScopeOptions({ show = 'both' }: { show?: 'desktop' | 'mobile' | 'both' }) {
  const wide = useProject((p) => p.layout.wide)
  const storiesScope = useProject((p) => p.layout.storiesScope)
  const desktopId = useProject((p) => p.layout.desktopId)
  const mobile = mobileById(useProject((p) => p.layout.mobileId))
  const setLayoutScope = useStudio((s) => s.setLayoutScope)
  const showDesktop = show !== 'mobile' && Boolean(desktopId)
  const showStories = show !== 'desktop' && Boolean(mobile?.config.stories)
  if (!showDesktop && !showStories) return null
  return (
    <Section id="escopo" title="Detalhes de escopo" description="Pontos que a IA costuma decidir de jeitos diferentes quando não estão escritos. Sem escolha, vale o padrão marcado como não revisado.">
      <div className="u-stack">
        {showDesktop && (
          <div className="u-stack-sm" data-testid="scope-wide">
            <strong>Em monitores grandes (1440 px ou mais)</strong>
            <Segmented<WideBehavior>
              label="Comportamento em monitores grandes"
              value={wide ?? ('' as WideBehavior)}
              onChange={(v) => keepScroll(() => setLayoutScope({ wide: v }))}
              options={WIDE_OPTIONS.map((o) => ({ value: o.id, label: o.name, title: o.description }))}
            />
            <span className="u-subtle u-small">{WIDE_OPTIONS.find((o) => o.id === (wide ?? 'centered'))!.description}{wide ? '' : ' (padrão do Studio)'}</span>
          </div>
        )}
        {showStories && (
          <div className="u-stack-sm" data-testid="scope-stories">
            <strong>Onde aparecem os stories/categorias do celular</strong>
            <Segmented<StoriesScope>
              label="Telas com stories"
              value={storiesScope ?? ('' as StoriesScope)}
              onChange={(v) => keepScroll(() => setLayoutScope({ storiesScope: v }))}
              options={STORIES_OPTIONS.map((o) => ({ value: o.id, label: o.name, title: o.instruction }))}
            />
          </div>
        )}
      </div>
    </Section>
  )
}
