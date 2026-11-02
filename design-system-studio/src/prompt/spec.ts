import { ENTRY_FLOWS, type Project } from '@/core/project'
import { projectTheme } from '@/core/theme'
import { fontName } from '@/core/tokens'
import type { ThemeTokens } from '@/core/types'
import { paletteById } from '@/modules/color/catalog'
import { detectConflicts, detectPending, type Conflict, type Pending } from './conflicts'
import { collectPromptItems, projectTypeLabel, type PromptItem } from './items'
import { BREAKPOINTS, COMPONENT_RESPONSIVE_RULES, GLOBAL_RESPONSIVE_RULES, IMPLEMENTATION_RULES, REFERENCE_WIDTHS } from './responsive'

/**
 * Especificação estruturada do projeto — a fonte da verdade das exportações.
 * O Master Prompt em texto é apenas uma representação deste objeto.
 */
export interface ProjectSpec {
  $schema: 'atelier-ui/spec@1'
  generator: string
  generatedAt: string
  project: {
    id: string
    name: string
    type: string
    objective: string
    description: string
    audience: string
    purpose: string
    features: string[]
    tech: string
  }
  architecture: {
    entryFlow: { id: string; name: string; description: string } | null
    landing: PromptItem | null
    login: PromptItem | null
    signup: PromptItem | null
    desktop: PromptItem | null
    mobile: PromptItem | null
    oneScreen: boolean
  }
  navigation: {
    header: PromptItem | null
    sidebar: PromptItem | null
  }
  identity: {
    palette: { id: string; name: string } | null
    tokens: ThemeTokens
    overrides: Record<string, string>
    typography: { heading: string; body: string; baseSize: number; headingWeight: number; bodyWeight: number }
    geometry: Project['identity']['geometry']
    items: PromptItem[]
  }
  components: PromptItem[]
  references: {
    inspiration: PromptItem | null
    template: PromptItem | null
  }
  responsive: {
    referenceWidths: number[]
    breakpoints: typeof BREAKPOINTS
    globalRules: string[]
    componentRules: Record<string, string[]>
  }
  implementationRules: string[]
  conflicts: Conflict[]
  pending: Pending[]
  /** Registro plano de todos os itens, inclusive os retirados do prompt (`included: false`). */
  items: PromptItem[]
  /** Estado completo do projeto, para reimportação. */
  source: Project
}

export function buildProjectSpec(project: Project): ProjectSpec {
  const items = collectPromptItems(project)
  const pick = (key: string) => items.find((i) => i.key === key && i.included) ?? null
  const theme = projectTheme(project)
  const palette = paletteById(project.identity.paletteId)
  const flow = ENTRY_FLOWS.find((f) => f.id === project.entry.flow)
  const desktop = pick('layout.desktop')
  const mobile = pick('layout.mobile')

  return {
    $schema: 'atelier-ui/spec@1',
    generator: 'Atelier UI — Design System Studio',
    generatedAt: new Date().toISOString(),
    project: {
      id: project.id,
      name: project.meta.name || 'Projeto sem nome',
      type: projectTypeLabel(project),
      objective: project.meta.objective,
      description: project.meta.description,
      audience: project.meta.audience,
      purpose: project.meta.purpose,
      features: project.meta.features,
      tech: project.meta.tech,
    },
    architecture: {
      entryFlow: flow ? { id: flow.id, name: flow.name, description: flow.description } : null,
      landing: pick('entry.landing'),
      login: pick('entry.login'),
      signup: pick('entry.signup'),
      desktop,
      mobile,
      oneScreen: Boolean(desktop?.properties.oneScreen || mobile?.properties.oneScreen || project.meta.projectType === 'one-screen'),
    },
    navigation: {
      header: pick('navigation.header'),
      sidebar: pick('navigation.sidebar'),
    },
    identity: {
      palette: palette ? { id: palette.id, name: palette.name } : null,
      tokens: theme.tokens,
      overrides: { ...project.identity.overrides } as Record<string, string>,
      typography: {
        heading: fontName(project.identity.typography.heading),
        body: fontName(project.identity.typography.body),
        baseSize: project.identity.typography.baseSize,
        headingWeight: project.identity.typography.headingWeight,
        bodyWeight: project.identity.typography.bodyWeight,
      },
      geometry: { ...project.identity.geometry },
      items: items.filter((i) => i.section === 'identity' && i.included),
    },
    components: items.filter((i) => i.kind === 'component' && i.included),
    references: {
      inspiration: pick('inspiration'),
      template: pick('template'),
    },
    responsive: {
      referenceWidths: REFERENCE_WIDTHS,
      breakpoints: BREAKPOINTS,
      globalRules: GLOBAL_RESPONSIVE_RULES,
      componentRules: COMPONENT_RESPONSIVE_RULES,
    },
    implementationRules: IMPLEMENTATION_RULES,
    conflicts: detectConflicts(project),
    pending: detectPending(project),
    items,
    source: project,
  }
}
