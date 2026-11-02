import { Fragment, type CSSProperties, type ReactElement } from 'react'
import { Check, Plus } from 'lucide-react'
import type { TplTheme } from './theme'
import type { SectionKind, TemplateModel, TemplateSection } from './types'
import type { RCtx } from './render/kit'
import {
  BlogList,
  ContactSection,
  CtaBand,
  DonateSection,
  FaqSection,
  FeatureSplit,
  FeaturesGrid,
  FooterSection,
  GallerySection,
  HeroApp,
  HeroCentered,
  HeroCountdown,
  HeroEditorial,
  HeroEvent,
  HeroImage,
  HeroProduct,
  HeroSearch,
  HeroSplit,
  ListingsSection,
  LogosSection,
  MenuSection,
  NavSection,
  NewsletterSection,
  PricingSection,
  ProductGrid,
  ScheduleSection,
  StatsSection,
  StepsSection,
  TeamSection,
  TestimonialsSection,
} from './render/sections'
import { DashActivity, DashChart, DashKpis, DashSidebar, DashTable, DashTopbar, DocsArticle, DocsPager, DocsSidebar, DocsToc } from './render/apps'

type Renderer = (props: { ctx: RCtx }) => ReactElement | null

/** Um renderizador por tipo de seção da biblioteca. */
export const SECTION_RENDERERS: Record<SectionKind, Renderer> = {
  nav: NavSection,
  'hero-split': HeroSplit,
  'hero-centered': HeroCentered,
  'hero-image': HeroImage,
  'hero-editorial': HeroEditorial,
  'hero-event': HeroEvent,
  'hero-search': HeroSearch,
  'hero-product': HeroProduct,
  'hero-app': HeroApp,
  'hero-countdown': HeroCountdown,
  logos: LogosSection,
  'features-grid': FeaturesGrid,
  'feature-split': FeatureSplit,
  steps: StepsSection,
  stats: StatsSection,
  testimonials: TestimonialsSection,
  pricing: PricingSection,
  faq: FaqSection,
  gallery: GallerySection,
  team: TeamSection,
  'blog-list': BlogList,
  'product-grid': ProductGrid,
  listings: ListingsSection,
  menu: MenuSection,
  schedule: ScheduleSection,
  contact: ContactSection,
  newsletter: NewsletterSection,
  'cta-band': CtaBand,
  donate: DonateSection,
  footer: FooterSection,
  'dash-sidebar': DashSidebar,
  'dash-topbar': DashTopbar,
  'dash-kpis': DashKpis,
  'dash-chart': DashChart,
  'dash-activity': DashActivity,
  'dash-table': DashTable,
  'docs-sidebar': DocsSidebar,
  'docs-article': DocsArticle,
  'docs-toc': DocsToc,
  'docs-pager': DocsPager,
}

export interface TemplateRenderProps {
  template: TemplateModel
  theme: TplTheme
  device: 'desktop' | 'mobile'
  /** Quantidade máxima de seções empilhadas (miniaturas). */
  limit?: number
  /** Partes marcadas (contorno na prévia do editor). */
  selected?: string[]
  /** Quando presente, cada parte vira clicável para marcar/desmarcar. */
  onToggleSection?: (id: string) => void
}

/**
 * Renderiza um template inteiro com estilos inline (funciona na prévia, nas miniaturas e
 * no HTML exportado). Sem media queries: a adaptação vem de `device`.
 */
export function TemplateRender({ template, theme, device, limit, selected = [], onToggleSection }: TemplateRenderProps) {
  const m = device === 'mobile'
  const interactive = Boolean(onToggleSection)

  const part = (s: TemplateSection | undefined, style?: CSSProperties) => {
    if (!s) return null
    const index = template.sections.indexOf(s)
    const ctx: RCtx = { s, t: theme, m, brand: template.brand, index }
    const R = SECTION_RENDERERS[s.kind]
    const node = <R ctx={ctx} />
    if (!interactive) {
      return style ? (
        <div key={s.id} style={style}>
          {node}
        </div>
      ) : (
        <Fragment key={s.id}>{node}</Fragment>
      )
    }
    const isSel = selected.includes(s.id)
    return (
      <div
        key={s.id}
        className="tpl-sec"
        data-tpl-section={s.id}
        data-selected={isSel ? 'true' : undefined}
        title={isSel ? `“${s.name}” marcada — clique para desmarcar` : `Clique para marcar “${s.name}”`}
        style={style}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onToggleSection?.(s.id)
        }}
      >
        {node}
        <span className="tpl-sec__tag" aria-hidden="true">
          {isSel ? <Check /> : <Plus />}
          {s.name}
        </span>
      </div>
    )
  }

  const by = (kind: SectionKind) => template.sections.find((s) => s.kind === kind)
  const root: CSSProperties = { background: theme.bg, color: theme.text, fontFamily: theme.body, width: '100%', textAlign: 'left', lineHeight: 1.5, WebkitFontSmoothing: 'antialiased' }

  if (template.layout === 'dashboard') {
    if (m) {
      return (
        <div data-template={template.id} style={{ ...root, display: 'flex', flexDirection: 'column', minHeight: 780 }}>
          {part(by('dash-topbar'))}
          <div style={{ padding: 16, display: 'grid', gap: 14 }}>
            {part(by('dash-kpis'))}
            {part(by('dash-chart'))}
            {part(by('dash-activity'))}
            {part(by('dash-table'))}
          </div>
          {part(by('dash-sidebar'), { position: 'sticky', bottom: 0, marginTop: 'auto', zIndex: 2 })}
        </div>
      )
    }
    return (
      <div data-template={template.id} style={{ ...root, display: 'grid', gridTemplateColumns: '248px minmax(0, 1fr)', minHeight: 860 }}>
        {part(by('dash-sidebar'), { height: '100%' })}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {part(by('dash-topbar'))}
          <div style={{ padding: 28, display: 'grid', gap: 20 }}>
            {part(by('dash-kpis'))}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 20 }}>
              {part(by('dash-chart'))}
              {part(by('dash-activity'))}
            </div>
            {part(by('dash-table'))}
          </div>
        </div>
      </div>
    )
  }

  if (template.layout === 'docs') {
    if (m) {
      return (
        <div data-template={template.id} style={{ ...root, minHeight: 780 }}>
          {part(by('nav'))}
          {part(by('docs-sidebar'))}
          {part(by('docs-toc'))}
          {part(by('docs-article'))}
          {part(by('docs-pager'))}
        </div>
      )
    }
    return (
      <div data-template={template.id} style={root}>
        {part(by('nav'))}
        <div style={{ display: 'grid', gridTemplateColumns: '256px minmax(0, 1fr) 220px', minHeight: 780 }}>
          {part(by('docs-sidebar'), { height: '100%' })}
          <div style={{ minWidth: 0 }}>
            {part(by('docs-article'))}
            {part(by('docs-pager'))}
          </div>
          {part(by('docs-toc'))}
        </div>
      </div>
    )
  }

  const list = limit ? template.sections.slice(0, limit) : template.sections
  return (
    <div data-template={template.id} style={root}>
      {list.map((s) => part(s))}
    </div>
  )
}
