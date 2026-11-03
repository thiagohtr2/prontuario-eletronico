import type { Project, ProjectOrigin } from '@/core/project'
import { categoryById } from '@/modules/components/catalog'
import { planPage, spanLabel } from '@/modules/starters/pages'

/*
 * Páginas do site no Master Prompt e no JSON: derivadas do mesmo plano da prévia (`planPage`),
 * para que o texto descreva exatamente o que o visualizador mostra.
 */

export interface SpecBlock {
  /** Id da instância (o mesmo da seção “Componentes”). */
  component: string
  label: string
  category: string
  span: number
  width: string
}

export interface SpecPage {
  id: string
  name: string
  kind: string
  purpose: string
  navItem: string | null
  main: SpecBlock[]
  aside: SpecBlock[]
  /** Região do layout que recebe a coluna lateral (ex.: “Indicadores”). */
  asideRegion: string | null
  overlays: { component: string; label: string; category: string }[]
}

export interface SpecOrigin extends ProjectOrigin {
  /** Frase pronta para o prompt. */
  note: string
}

const MODE_LABEL: Record<ProjectOrigin['mode'], string> = {
  new: 'projeto novo criado a partir do modelo',
  replace: 'projeto atual substituído pelo modelo',
  identity: 'só a identidade visual do modelo (cores, fontes, geometria)',
  architecture: 'só a arquitetura do modelo (layouts, navegação, páginas e componentes)',
}

export function buildSpecPages(project: Project): SpecPage[] {
  const block = (id: string, span: number): SpecBlock | null => {
    const c = project.components.find((x) => x.id === id)
    if (!c) return null
    return { component: c.id, label: c.label || categoryById(c.categoryId)?.name || c.categoryId, category: categoryById(c.categoryId)?.name ?? c.categoryId, span, width: spanLabel(span) }
  }
  return project.pages.map((page) => {
    const plan = planPage(project, page)
    return {
      id: page.id,
      name: page.name,
      kind: page.kind,
      purpose: page.purpose,
      navItem: page.navItem || null,
      main: plan.main.map((b) => block(b.component, b.span)).filter((b): b is SpecBlock => Boolean(b)),
      aside: plan.aside.map((b) => block(b.component, 12)).filter((b): b is SpecBlock => Boolean(b)),
      asideRegion: plan.aside.length ? plan.asideRegion : null,
      overlays: plan.overlays.map((c) => ({ component: c.id, label: c.label, category: categoryById(c.categoryId)?.name ?? c.categoryId })),
    }
  })
}

export function buildSpecOrigin(project: Project): SpecOrigin | null {
  const o = project.origin
  if (!o) return null
  return {
    ...o,
    note: `Ponto de partida: modelo “${o.templateName}” (versão ${o.templateVersion}) da galeria de modelos — ${MODE_LABEL[o.mode]}. É uma cópia independente: as decisões abaixo (inclusive as alterações feitas depois) valem sobre o modelo original.`,
  }
}

const KIND_TEXT: Record<string, string> = { landing: 'página de apresentação (landing descrita na seção B)', login: 'página de login (descrita na seção B)', signup: 'página de cadastro (descrita na seção B)' }

/** Seção “Páginas do site” do Master Prompt. */
export function renderPagesSection(pages: SpecPage[], inline: (s: string) => string): string {
  if (!pages.length) return ''
  const lines: string[] = [
    `### Páginas do site (${pages.length})`,
    'Cada bloco é uma instância da seção E (mesmo nome e id). No computador, a área principal usa uma grade de 12 colunas e a largura indicada; no celular, tudo vira uma coluna única, na ordem abaixo, com a coluna lateral no fim da página.',
  ]
  for (const p of pages) {
    const head = `- **${inline(p.name)}**${p.navItem ? ` (menu “${inline(p.navItem)}”)` : ''} — ${KIND_TEXT[p.kind] ?? inline(p.purpose)}`
    lines.push(head)
    if (p.kind !== 'app') {
      if (p.purpose) lines.push(`  - Objetivo: ${inline(p.purpose)}`)
      continue
    }
    if (p.main.length) lines.push(`  - Área principal: ${p.main.map((b) => `${inline(b.label)} (${b.category}, ${b.width}, \`${b.component}\`)`).join(' · ')}`)
    if (p.aside.length) lines.push(`  - ${p.asideRegion ? `Região “${inline(p.asideRegion)}” do layout` : 'Coluna lateral'}: ${p.aside.map((b) => `${inline(b.label)} (${b.category}, \`${b.component}\`)`).join(' · ')}`)
    if (p.overlays.length) lines.push(`  - Sobreposições (abrem por cima da página, não ocupam espaço na grade): ${p.overlays.map((o) => `${inline(o.label)} (${o.category}, \`${o.component}\`)`).join(' · ')}`)
  }
  return lines.join('\n')
}
