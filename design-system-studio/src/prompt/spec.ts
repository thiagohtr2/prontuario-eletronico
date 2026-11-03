import { ENTRY_FLOWS, type Project } from '@/core/project'
import { projectTheme } from '@/core/theme'
import { fontName } from '@/core/tokens'
import type { ThemeTokens } from '@/core/types'
import { paletteById } from '@/modules/color/catalog'
import { detectConflicts, detectPending, type Conflict, type Pending } from './conflicts'
import { collectPromptData, projectTypeLabel, type PromptItem } from './items'
import { buildDesignTokens, buildFacts, withGridFacts } from './devexport'
import { mobileNavSummary, type AutoResolution } from './resolve'
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
  /** Conteúdo real do projeto: substitui o conteúdo de exemplo dos modelos. */
  content: {
    brand: string
    navItems: string[]
    mobileNav: string
    rules: string[]
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
  /** Decisões aplicadas automaticamente pelo modelo de fatos único (precedência fixa). */
  resolutions: AutoResolution[]
  pending: Pending[]
  /** Fatos com chaves técnicas e valores tipados ({ value, unit }), para consumo por código. */
  facts: ReturnType<typeof buildFacts>
  /** Tokens no formato DTCG ($type/$value). */
  designTokens: ReturnType<typeof buildDesignTokens>
  /** Registro plano de todos os itens, inclusive os retirados do prompt (`included: false`). */
  items: PromptItem[]
  /** Estado completo do projeto, para reimportação. */
  source: Project
}

export function buildProjectSpec(project: Project): ProjectSpec {
  const { items, resolutions } = collectPromptData(project)
  const navItems = project.meta.navItems.map((s) => s.trim()).filter(Boolean)
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
    content: {
      brand: project.meta.name.trim(),
      navItems,
      mobileNav: mobileNavSummary(project),
      rules: [
        'Os modelos escolhidos no Studio definem estrutura e aparência. Marcas, menus, textos, números e pessoas que aparecem nas prévias são exemplos e não entram no produto.',
        navItems.length
          ? 'Header, sidebar e navegação móvel usam exatamente estes itens de menu, nesta ordem.'
          : 'Os itens do menu ainda não foram definidos: pergunte ao usuário antes de criar a navegação.',
      ],
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
      // Só as regras dos tipos de elemento presentes no projeto (nada de regras de tabela sem tabela).
      componentRules: Object.fromEntries(
        Object.entries(COMPONENT_RESPONSIVE_RULES).filter(([kind]) => items.some((i) => i.included && i.responsiveKinds.includes(kind))),
      ),
    },
    implementationRules: IMPLEMENTATION_RULES,
    facts: withGridFacts(buildFacts(project), project),
    designTokens: buildDesignTokens(project, theme),
    conflicts: detectConflicts(project),
    resolutions,
    pending: detectPending(project),
    items,
    source: project,
  }
}
