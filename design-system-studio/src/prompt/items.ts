import { describeCatalogItem, type ItemDescription } from '@/core/describe'
import { activeEntry, DEFAULT_PALETTE_ID, ENTRY_FLOWS, PROJECT_TYPES, type Project, type PropValue } from '@/core/project'
import { projectTheme } from '@/core/theme'
import { DEFAULT_GEOMETRY, DEFAULT_TYPOGRAPHY, DENSITY_SPACING, deriveTokens, fontName, RADIUS_VALUES, SHADOW_VALUES, SURFACE_LABEL, TOKEN_LABEL } from '@/core/tokens'
import type { ResolvedTheme, TokenKey } from '@/core/types'
import { categoryById, familyById } from '@/modules/components/catalog'
import { describeComponent } from '@/modules/components/describe'
import { paletteById, PALETTE_CATEGORIES } from '@/modules/color/catalog'
import { landingById, loginById, signupById } from '@/modules/entry/catalog'
import { siteById } from '@/modules/inspiration/catalog'
import { describeInspiration } from '@/modules/inspiration/describe'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { DESKTOP_FAMILIES, MOBILE_GROUPS } from '@/modules/layouts/types'
import { headerById, sidebarById } from '@/modules/navigation/catalog'
import { describeTemplate } from '@/modules/templates/describe'
import { templateById } from '@/modules/templates/catalog'
import { resolvePromptItems, type AutoResolution } from './resolve'

export type PromptKind =
  | 'entry-flow'
  | 'landing'
  | 'login'
  | 'signup'
  | 'desktop'
  | 'mobile'
  | 'palette'
  | 'typography'
  | 'geometry'
  | 'header'
  | 'sidebar'
  | 'component'
  | 'inspiration'
  | 'template'

export type PromptSection = 'architecture' | 'navigation' | 'identity' | 'components' | 'references'

/** Registro de um item no Master Prompt: identificador, tipo, variante, propriedades e regras. */
export interface PromptItem {
  key: string
  kind: PromptKind
  section: PromptSection
  /** Módulo do Studio onde a escolha foi feita (rota). */
  source: string
  catalogId: string | null
  name: string
  variant: string | null
  summary: string
  properties: Record<string, PropValue>
  colors: Record<string, string>
  structure: string[]
  behavior: string[]
  responsive: string[]
  /**
   * Tipos de regra responsiva por componente que valem para o item (ver COMPONENT_RESPONSIVE_RULES).
   * No Master Prompt essas regras aparecem uma vez na seção F; no prompt individual, junto do item.
   */
  responsiveKinds: string[]
  measurements: Record<string, string>
  exceptions: string[]
  notes: string[]
  included: boolean
  /** Valor padrão do Studio que o usuário não alterou (não deve ser tratado como decisão aprovada). */
  isDefault?: boolean
}

export const KIND_LABEL: Record<PromptKind, string> = {
  'entry-flow': 'Fluxo de entrada',
  landing: 'Landing page',
  login: 'Login',
  signup: 'Cadastro',
  desktop: 'Layout desktop',
  mobile: 'Layout mobile',
  palette: 'Paleta e tokens',
  typography: 'Tipografia',
  geometry: 'Geometria e superfícies',
  header: 'Header',
  sidebar: 'Sidebar',
  component: 'Componente',
  inspiration: 'Inspiração visual',
  template: 'Template',
}

function toItem(
  key: string,
  kind: PromptKind,
  section: PromptSection,
  source: string,
  catalogId: string | null,
  d: ItemDescription,
  project: Project,
  extraResponsiveKinds: string[] = [],
): PromptItem {
  const note = project.prompt.notes[key]
  return {
    key,
    kind,
    section,
    source,
    catalogId,
    name: d.name,
    variant: d.variant ?? null,
    summary: d.summary,
    // Cópias: o resolvedor reescreve os itens, e os arrays/objetos vêm dos catálogos (compartilhados).
    properties: { ...(d.properties ?? {}) },
    colors: { ...(d.colors ?? {}) },
    structure: [...d.structure],
    behavior: [...(d.behavior ?? [])],
    responsive: [...d.responsive],
    responsiveKinds: [...extraResponsiveKinds],
    measurements: { ...(d.measurements ?? {}) },
    exceptions: [...(d.exceptions ?? []), ...(note ? [`Observação do usuário: ${note}`] : [])],
    notes: [...(d.notes ?? [])],
    included: !project.prompt.excluded.includes(key),
  }
}

/** Heurística para escolher regras responsivas específicas de uma categoria de componente. */
export function responsiveKindsForCategory(categoryId: string): string[] {
  const id = categoryId.toLowerCase()
  const kinds: string[] = []
  if (/tabela|grid|table/.test(id)) kinds.push('table')
  if (/modal|dialog/.test(id)) kinds.push('modal')
  if (/grafic|chart/.test(id)) kinds.push('chart')
  if (/botao|botoes|button/.test(id)) kinds.push('button')
  if (/card|kpi|stat/.test(id)) kinds.push('card')
  if (/form|input|campo|textarea|senha|upload|cadastro|login/.test(id)) kinds.push('form')
  if (/calend|date|data/.test(id)) kinds.push('calendar')
  if (/select|dropdown|combobox|popover|menu|tooltip/.test(id)) kinds.push('dropdown')
  if (/header|topbar/.test(id)) kinds.push('header')
  if (/sidebar/.test(id)) kinds.push('sidebar')
  if (/drawer|tabs|navega|paginac|breadcrumb|step|mobile/.test(id)) kinds.push('navigation')
  return kinds
}

export function describeEntryFlow(project: Project): ItemDescription | null {
  const flow = ENTRY_FLOWS.find((f) => f.id === project.entry.flow)
  if (!flow) return null
  return {
    name: flow.name,
    summary: flow.description,
    structure: [
      flow.needsLanding ? 'Existe uma página pública de apresentação (landing).' : 'Não existe landing page.',
      flow.needsLogin ? 'Existe uma área restrita acessada pela tela de login.' : 'Não existe login.',
      flow.needsLogin && project.entry.noSignup ? 'Não existe cadastro público: as contas são criadas por convite ou por um administrador. Não coloque “Criar conta” no login.' : '',
      flow.id === 'landing-login' ? 'O header da landing tem uma ação “Entrar” que leva ao login, e um CTA para criar conta quando houver cadastro.' : '',
      flow.id === 'app-direct' ? 'A rota inicial abre direto a tela principal da aplicação.' : '',
    ].filter(Boolean),
    responsive: ['As páginas de entrada seguem as mesmas regras de responsividade globais.'],
  }
}

export function describePalette(project: Project, theme: ResolvedTheme): ItemDescription {
  const palette = paletteById(project.identity.paletteId)
  const overrides = Object.entries(project.identity.overrides) as [TokenKey, string][]
  const colors: Record<string, string> = {}
  for (const [k, label] of Object.entries(TOKEN_LABEL)) colors[label] = String(theme.tokens[k as TokenKey])
  // O texto do catálogo cita as cores originais da paleta; com alterações do usuário, cada cor
  // original (base e derivadas) é trocada pelo valor efetivo recalculado.
  let effective = (l: string) => l
  if (palette && overrides.length) {
    const original = deriveTokens(palette.base) as unknown as Record<string, unknown>
    const swaps: [RegExp, string][] = []
    for (const [k, v] of Object.entries(theme.tokens as unknown as Record<string, unknown>)) {
      const o = original[k]
      if (typeof o === 'string' && typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(o) && o.toLowerCase() !== v.toLowerCase())
        swaps.push([new RegExp(o.replace('#', '#?'), 'gi'), v])
    }
    effective = (l: string) => swaps.reduce((acc, [re, v]) => acc.replace(re, v), l)
  }
  return {
    name: palette?.name ?? project.identity.paletteId,
    variant: PALETTE_CATEGORIES.find((c) => c.id === palette?.category)?.name,
    summary: `${effective(palette?.spec.summary ?? 'Paleta personalizada.')} Todos os componentes herdam estes tokens por padrão.`,
    colors,
    structure: (palette?.spec.structure ?? []).map(effective),
    behavior: (palette?.spec.behavior ?? []).map(effective),
    responsive: ['A identidade é a mesma em todas as larguras de tela.'],
    exceptions: overrides.map(([k, v]) => `Token alterado pelo usuário: ${TOKEN_LABEL[k]} = ${v}.`),
  }
}

export function describeTypography(project: Project): ItemDescription {
  const t = project.identity.typography
  return {
    name: `${fontName(t.heading)} + ${fontName(t.body)}`,
    summary: `Títulos em ${fontName(t.heading)} (peso ${t.headingWeight}) e textos em ${fontName(t.body)} (peso ${t.bodyWeight}), tamanho base ${t.baseSize} px.`,
    properties: { fonteTitulos: fontName(t.heading), fonteTexto: fontName(t.body), tamanhoBase: t.baseSize, pesoTitulos: t.headingWeight, pesoTexto: t.bodyWeight },
    structure: [
      `Escala sugerida: ${Math.round(t.baseSize * 0.87)} / ${t.baseSize} / ${Math.round(t.baseSize * 1.2)} / ${Math.round(t.baseSize * 1.5)} / ${Math.round(t.baseSize * 2)} / ${Math.round(t.baseSize * 2.6)} px.`,
      'Altura de linha de 1.5 para textos e 1.2–1.3 para títulos.',
      'Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px.',
    ],
    responsive: [
      'Títulos grandes reduzem proporcionalmente no celular (use clamp()).',
      'Inputs com 16 px no celular para evitar zoom automático.',
    ],
  }
}

export function describeGeometry(project: Project): ItemDescription {
  const g = project.identity.geometry
  const r = RADIUS_VALUES[g.radius]
  return {
    name: `${r.label} · ${SURFACE_LABEL[g.surface]}`,
    summary: `Cantos ${r.label.toLowerCase()}, bordas de ${g.borderWidth} px, sombra ${SHADOW_VALUES[g.shadow].label.toLowerCase()}, superfícies ${SURFACE_LABEL[g.surface].toLowerCase()}, densidade ${DENSITY_SPACING[g.density].label.toLowerCase()}.`,
    properties: {
      raioPequeno: `${r.sm}px`,
      raioMedio: `${r.md}px`,
      raioGrande: `${r.lg}px`,
      borda: `${g.borderWidth}px`,
      sombra: SHADOW_VALUES[g.shadow].css,
      superficie: g.surface,
      densidade: g.density,
      unidadeDeEspaco: `${DENSITY_SPACING[g.density].unit}px`,
      ícones: g.iconStyle,
    },
    structure: [
      'Escala de espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 20, 24, 32, 40.',
      g.shadow === 'none' ? 'Sem sombras em superfícies de conteúdo. Apenas elementos realmente flutuantes (modais, popovers, menus) podem ter elevação.' : 'Sombras apenas no nível escolhido; elementos de conteúdo não devem parecer menus flutuantes.',
      g.surface === 'glass' ? 'Vidro fosco: fundo translúcido com backdrop-filter; garanta contraste AA sobre qualquer fundo.' : '',
      `Ícones no estilo ${g.iconStyle === 'outline' ? 'contorno (outline)' : g.iconStyle === 'filled' ? 'preenchido' : 'duotone'}, tamanho consistente (16–20 px em interfaces).`,
    ].filter(Boolean),
    responsive: ['A geometria se mantém em todas as larguras; no celular aumente apenas as áreas de toque.'],
  }
}

/**
 * Monta os itens a partir do estado do projeto (fonte única da verdade) e aplica o modelo de
 * fatos único (`resolvePromptItems`), devolvendo também as decisões automáticas de prioridade.
 */
export function collectPromptData(project: Project): { items: PromptItem[]; resolutions: AutoResolution[] } {
  const theme = projectTheme(project)
  const items: PromptItem[] = []

  const flow = describeEntryFlow(project)
  if (flow) items.push(toItem('entry.flow', 'entry-flow', 'architecture', 'entrada', project.entry.flow, flow, project))

  // Só as páginas que existem no fluxo escolhido (seleções antigas ficam guardadas, mas inativas).
  const entry = activeEntry(project.entry)
  const landing = landingById(entry.landingId)
  if (landing) {
    const d = describeCatalogItem(landing, {
      variant: landing.segment,
      properties: { arquitetura: landing.architecture, secoes: landing.sections.join(' → ') },
      colors: project.entry.landingUsesOriginalColors ? { ...landing.demo } : {},
      exceptions: project.entry.landingUsesOriginalColors
        ? ['Exceção explícita: a landing usa as cores originais do modelo, não a paleta global.']
        : [],
      notes: landing.spec.notes ?? [],
    })
    items.push(toItem('entry.landing', 'landing', 'architecture', 'landing', landing.id, d, project, ['header', 'button']))
  }
  const login = loginById(entry.loginId)
  if (login) {
    const d = describeCatalogItem(login, {
      variant: login.composition,
      notes: [
        ...(login.spec.notes ?? []),
        'A tela é uma demonstração de interface. Implemente a autenticação real com backend seguro (hash de senha, rate limit, tokens httpOnly, proteção CSRF).',
      ],
    })
    items.push(toItem('entry.login', 'login', 'architecture', 'login', login.id, d, project, ['form', 'button']))
  }
  const signup = signupById(entry.signupId)
  if (signup) {
    const d = describeCatalogItem(signup, {
      variant: signup.flow,
      properties: { campos: signup.fields.join(', ') },
      behavior: [
        ...(signup.spec.behavior ?? []),
        'Estados de erro por campo, com mensagem clara abaixo do campo e resumo no topo em caso de envio inválido.',
        'Validação ao sair do campo e no envio; nunca apague o que a pessoa digitou.',
        'Botão para mostrar/ocultar senha e indicação dos requisitos de senha.',
        'Link de recuperação de senha visível na tela de login.',
        'Labels acessíveis (label for/id), autocomplete adequado (name, email, new-password, current-password, one-time-code).',
      ],
      responsive: [
        ...signup.spec.responsive,
        'Layout adaptado ao teclado virtual: o campo focado e o botão de envio permanecem visíveis.',
        'Funciona em telas a partir de 320 px, com uma coluna no celular.',
      ],
    })
    items.push(toItem('entry.signup', 'signup', 'architecture', 'cadastro', signup.id, d, project, ['form']))
  }

  const desktop = desktopById(project.layout.desktopId)
  if (desktop) {
    const d = describeCatalogItem(desktop, {
      variant: DESKTOP_FAMILIES.find((f) => f.id === desktop.family)?.name,
      properties: {
        gridColumns: desktop.grid.columns,
        gridRows: desktop.grid.rows,
        gridAreas: desktop.grid.areas.map((a) => `"${a}"`).join(' '),
        gap: `${desktop.grid.gap}px`,
        padding: `${desktop.grid.padding}px`,
        regioes: desktop.regions.map((r) => `${r.id} (${r.kind}${r.floating ? ', flutuante' : ''}${r.overlay ? ', sobreposta' : ''})`).join(', '),
        oneScreen: Boolean(desktop.oneScreen),
      },
      measurements: {
        ...Object.fromEntries(Object.entries(desktop.measurements).map(([k, v]) => [k, `≈${v} px`])),
        ...(desktop.spec.measurements ?? {}),
      },
      notes: [
        ...(desktop.spec.notes ?? []),
        'As medidas são recomendações para 1280 × 800; adapte à tela e ao conteúdo preservando a estrutura escolhida.',
      ],
    })
    items.push(toItem('layout.desktop', 'desktop', 'architecture', 'desktop', desktop.id, d, project))
  }

  const mobile = mobileById(project.layout.mobileId)
  if (mobile) {
    const d = describeCatalogItem(mobile, {
      variant: MOBILE_GROUPS.find((g) => g.id === mobile.group)?.name,
      properties: {
        topo: mobile.config.top,
        inferior: mobile.config.bottom,
        lateral: mobile.config.side,
        sobreposicao: mobile.config.overlay,
        stories: Boolean(mobile.config.stories),
        oneScreen: Boolean(mobile.config.oneScreen),
      },
    })
    items.push(toItem('layout.mobile', 'mobile', 'architecture', 'mobile', mobile.id, d, project, ['navigation']))
  }

  const header = project.navigation.header ? headerById(project.navigation.header.id) : undefined
  if (header && project.navigation.header) {
    const comp = header.compositions[project.navigation.header.variant]
    // Cada composição tem a própria especificação (medidas, logo, busca, disposição).
    const d = describeCatalogItem({ ...header, spec: header.specs[project.navigation.header.variant] }, {
      variant: comp?.name,
      properties: { flutuante: header.floating, fixo: header.sticky, composicao: comp ? `${comp.name}: ${comp.description}` : '' },
    })
    items.push(toItem('navigation.header', 'header', 'navigation', 'navegacao', header.id, d, project, ['header', 'dropdown']))
  }
  const sidebar = project.navigation.sidebar ? sidebarById(project.navigation.sidebar.id) : undefined
  if (sidebar && project.navigation.sidebar) {
    const comp = sidebar.compositions[project.navigation.sidebar.variant]
    const d = describeCatalogItem({ ...sidebar, spec: sidebar.specs[project.navigation.sidebar.variant] }, {
      variant: comp?.name,
      properties: { formato: sidebar.shape, flutuante: sidebar.floating, largura: `≈${sidebar.width} px`, composicao: comp ? `${comp.name}: ${comp.description}` : '' },
    })
    items.push(toItem('navigation.sidebar', 'sidebar', 'navigation', 'navegacao', sidebar.id, d, project, ['sidebar', 'navigation']))
  }

  const palItem = toItem('identity.palette', 'palette', 'identity', 'cores', project.identity.paletteId, describePalette(project, theme), project)
  palItem.isDefault = isDefaultPalette(project)
  const typoItem = toItem('identity.typography', 'typography', 'identity', 'cores', null, describeTypography(project), project)
  typoItem.isDefault = isDefaultTypography(project)
  const geoItem = toItem('identity.geometry', 'geometry', 'identity', 'cores', null, describeGeometry(project), project)
  geoItem.isDefault = isDefaultGeometry(project)
  items.push(palItem, typoItem, geoItem)

  for (const instance of project.components) {
    const d = describeComponent(instance, theme)
    items.push(
      toItem(`component:${instance.id}`, 'component', 'components', 'componentes', instance.categoryId, d, project, responsiveKindsForCategory(instance.categoryId)),
    )
  }

  if (project.inspiration) {
    const d = describeInspiration(project.inspiration)
    if (d) items.push(toItem('inspiration', 'inspiration', 'references', 'inspiracao', project.inspiration.siteId, d, project))
  }
  if (project.template) {
    const d = describeTemplate(project.template)
    if (d) items.push(toItem('template', 'template', 'references', 'templates', project.template.id, d, project))
  }

  return { items, resolutions: resolvePromptItems(items, project) }
}

/** Monta a lista completa de itens a partir do estado do projeto (fonte única da verdade). */
export function collectPromptItems(project: Project): PromptItem[] {
  return collectPromptData(project).items
}

const sameObject = (a: object, b: object) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort())

/** A identidade ainda é a do Studio, sem nenhuma alteração do usuário. */
export const isDefaultPalette = (p: Project) => p.identity.paletteId === DEFAULT_PALETTE_ID && Object.keys(p.identity.overrides).length === 0
export const isDefaultTypography = (p: Project) => sameObject(p.identity.typography, DEFAULT_TYPOGRAPHY)
export const isDefaultGeometry = (p: Project) => sameObject(p.identity.geometry, DEFAULT_GEOMETRY)
export const isDefaultIdentity = (p: Project) => isDefaultPalette(p) && isDefaultTypography(p) && isDefaultGeometry(p)

/* -------------------------------------------------------------------------- */
/* Alvos de prompt individual                                                  */
/* -------------------------------------------------------------------------- */

export type PromptTarget =
  | { kind: 'landing' | 'login' | 'signup' | 'desktop' | 'mobile' | 'palette'; id: string }
  | { kind: 'header' | 'sidebar'; id: string; variant: 0 | 1 }
  | { kind: 'component'; instanceId: string }
  | { kind: 'component-model'; categoryId: string; familyId: string }
  | { kind: 'inspiration'; siteId: string; paletteId: string; overrides?: { bg?: string; text?: string; accent?: string } }
  | { kind: 'template'; id: string; overrides?: Record<string, string>; sections?: string[] }
  | { kind: 'identity' }
  | { kind: 'item'; key: string }

/**
 * Resolve um alvo em um item de prompt, mesmo que ainda não esteja selecionado no
 * projeto (ex.: a pessoa quer o prompt de um layout que está só visualizando).
 */
export function itemForTarget(target: PromptTarget, project: Project): PromptItem | null {
  // Simula a escolha em uma cópia do projeto e reaproveita a mesma lógica do Master Prompt.
  const p: Project = structuredClone(project)
  p.prompt.excluded = []
  let key: string
  switch (target.kind) {
    case 'landing':
      p.entry.flow = null
      p.entry.landingId = target.id
      key = 'entry.landing'
      break
    case 'login':
      p.entry.flow = null
      p.entry.loginId = target.id
      key = 'entry.login'
      break
    case 'signup':
      p.entry.flow = null
      p.entry.noSignup = false
      p.entry.signupId = target.id
      key = 'entry.signup'
      break
    case 'desktop':
      p.layout.desktopId = target.id
      key = 'layout.desktop'
      break
    case 'mobile':
      p.layout.mobileId = target.id
      key = 'layout.mobile'
      break
    case 'palette':
      if (target.id !== p.identity.paletteId) p.identity.overrides = {}
      p.identity.paletteId = target.id
      key = 'identity.palette'
      break
    case 'identity':
      key = 'identity.palette'
      break
    case 'header':
      p.navigation.header = { id: target.id, variant: target.variant }
      key = 'navigation.header'
      break
    case 'sidebar':
      p.navigation.sidebar = { id: target.id, variant: target.variant }
      key = 'navigation.sidebar'
      break
    case 'component':
      key = `component:${target.instanceId}`
      break
    case 'component-model': {
      const id = 'preview'
      p.components = [
        ...p.components,
        { id, categoryId: target.categoryId, familyId: target.familyId, label: '', props: {}, tokenOverrides: {}, createdAt: new Date().toISOString() },
      ]
      key = `component:${id}`
      break
    }
    case 'inspiration':
      p.inspiration = { siteId: target.siteId, paletteId: target.paletteId, overrides: target.overrides ?? {} }
      key = 'inspiration'
      break
    case 'template':
      p.template = { id: target.id, overrides: target.overrides ?? {}, sections: target.sections ?? [] }
      key = 'template'
      break
    case 'item':
      key = target.key
      break
  }
  return collectPromptItems(p).find((i) => i.key === key) ?? null
}

/** Nome legível de um alvo, para títulos de modais. */
export function targetTitle(target: PromptTarget): string {
  switch (target.kind) {
    case 'landing':
      return landingById(target.id)?.name ?? 'Landing'
    case 'login':
      return loginById(target.id)?.name ?? 'Login'
    case 'signup':
      return signupById(target.id)?.name ?? 'Cadastro'
    case 'desktop':
      return desktopById(target.id)?.name ?? 'Layout desktop'
    case 'mobile':
      return mobileById(target.id)?.name ?? 'Layout mobile'
    case 'palette':
      return paletteById(target.id)?.name ?? 'Paleta'
    case 'header':
      return headerById(target.id)?.name ?? 'Header'
    case 'sidebar':
      return sidebarById(target.id)?.name ?? 'Sidebar'
    case 'component-model':
      return `${categoryById(target.categoryId)?.name ?? target.categoryId} · ${familyById(target.familyId)?.name ?? target.familyId}`
    case 'inspiration':
      return siteById(target.siteId)?.brand ?? 'Inspiração'
    case 'template':
      return templateById(target.id)?.name ?? 'Template'
    case 'identity':
      return 'Identidade visual'
    default:
      return 'Elemento'
  }
}

export function projectTypeLabel(project: Project): string {
  if (project.meta.projectType === 'outro') return project.meta.projectTypeOther || 'Outro'
  return PROJECT_TYPES.find((t) => t.id === project.meta.projectType)?.name ?? 'Não definido'
}
