import { createProject, SKELETON_STEPS, type ComponentInstance, type Project, type ProjectOrigin } from '@/core/project'
import type { SiteStarter, StarterPalette } from './types'

export type ApplyMode = ProjectOrigin['mode']

/** Prefixo estável dos ids de instância criados a partir de um modelo. */
const instanceId = (componentId: string) => `cmp_${componentId}`

function originOf(s: SiteStarter, palette: StarterPalette, mode: ApplyMode): ProjectOrigin {
  return { templateId: s.id, templateName: s.name, templateVersion: s.version, paletteVariant: palette.id, appliedAt: new Date().toISOString(), mode }
}

/** Partes de identidade de um modelo (paleta escolhida, tipografia e geometria). */
function identityOf(s: SiteStarter, palette: StarterPalette): Project['identity'] {
  return {
    paletteId: palette.paletteId,
    overrides: { ...(palette.overrides ?? {}) },
    typography: { ...s.typography },
    geometry: { ...s.geometry },
  }
}

/** Componentes e páginas do modelo, com ids de instância do projeto. */
function contentOf(s: SiteStarter): Pick<Project, 'components' | 'pages'> {
  const now = new Date().toISOString()
  const components: ComponentInstance[] = s.components.map((c) => ({
    id: instanceId(c.id),
    categoryId: c.categoryId,
    familyId: c.familyId ?? s.family,
    label: c.label,
    props: { ...c.props },
    tokenOverrides: { ...(c.tokenOverrides ?? {}) },
    createdAt: now,
  }))
  const pages = s.pages.map((p) => ({
    ...p,
    blocks: p.blocks.map((b) => ({ ...b, component: instanceId(b.component) })),
    ...(p.aside ? { aside: p.aside.map((b) => ({ ...b, component: instanceId(b.component) })) } : {}),
  }))
  return { components, pages }
}

/** Arquitetura do modelo: entrada, layouts, navegação, menu e escopo. */
function architectureOf(s: SiteStarter): Pick<Project, 'entry' | 'layout' | 'navigation'> {
  return {
    entry: { flow: s.entry.flow, landingId: s.entry.landingId, loginId: s.entry.loginId, signupId: s.entry.signupId, noSignup: s.entry.noSignup, landingUsesOriginalColors: false },
    layout: { desktopId: s.layout.desktopId, mobileId: s.layout.mobileId, wide: s.layout.wide, storiesScope: s.layout.storiesScope },
    navigation: { header: s.navigation.header ? { ...s.navigation.header } : null, sidebar: s.navigation.sidebar ? { ...s.navigation.sidebar } : null },
  }
}

/**
 * Instancia um modelo como projeto completo (cópia independente do catálogo).
 * - `new` / `replace`: projeto inteiro do modelo (esqueleto aprovado, pronto para personalizar e exportar).
 * - `identity`: mantém o projeto atual e troca só cores, tipografia e geometria.
 * - `architecture`: mantém a identidade atual e traz entrada, layouts, navegação, menu, páginas e componentes.
 */
export function instantiateStarter(s: SiteStarter, paletteId: string, mode: ApplyMode, current?: Project): Project {
  const palette = s.palettes.find((p) => p.id === paletteId) ?? s.palettes[0]
  const origin = originOf(s, palette, mode)
  const now = new Date().toISOString()

  if (mode === 'identity' && current) return { ...structuredClone(current), identity: identityOf(s, palette), origin, updatedAt: now }

  if (mode === 'architecture' && current) {
    const base = structuredClone(current)
    return {
      ...base,
      ...architectureOf(s),
      ...contentOf(s),
      meta: { ...base.meta, navItems: [...s.navItems], projectType: base.meta.projectType ?? s.projectType },
      prompt: { ...base.prompt, conflictResolutions: { ...base.prompt.conflictResolutions, ...(s.conflictResolutions ?? {}) } },
      origin,
      updatedAt: now,
    }
  }

  const p = createProject()
  return {
    ...p,
    mode: current?.mode ?? 'free',
    prefs: current ? { ...current.prefs } : p.prefs,
    meta: {
      ...p.meta,
      name: s.brand,
      objective: s.objective,
      description: s.description,
      audience: s.audience,
      purpose: s.objective,
      projectType: s.projectType,
      features: [...s.features],
      navItems: [...s.navItems],
      tech: s.tech ?? '',
    },
    // O esqueleto já vem decidido pelo modelo: as etapas de acabamento ficam liberadas.
    guided: { step: 'preview', completed: [...SKELETON_STEPS], skeletonApproved: true },
    ...architectureOf(s),
    identity: identityOf(s, palette),
    ...contentOf(s),
    prompt: { excluded: [], notes: {}, conflictResolutions: { ...(s.conflictResolutions ?? {}) } },
    origin,
  }
}
