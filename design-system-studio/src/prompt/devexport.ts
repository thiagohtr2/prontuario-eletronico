import { activeEntry, type Project } from '@/core/project'
import { projectTheme } from '@/core/theme'
import { fontName, TOKEN_GROUPS, TOKEN_KEYS } from '@/core/tokens'
import type { ResolvedTheme, TokenKey } from '@/core/types'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { headerById, headerLookFor, sidebarById } from '@/modules/navigation/catalog'
import { isDefaultIdentity } from './items'
import { mobileSlots } from './resolve'
import { BREAKPOINTS } from './responsive'

/**
 * Exportações para desenvolvedores (B-15): o mesmo conteúdo do Master Prompt em formatos que o
 * código consome sem reconciliação manual — chaves técnicas em inglês, números com unidade
 * separada, tokens no formato DTCG (Design Tokens Community Group), Tailwind e TypeScript.
 */

export interface Dimension {
  value: number
  unit: 'px'
}
const px = (value: number): Dimension => ({ value, unit: 'px' })
const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
const isColor = (v: unknown): v is string => typeof v === 'string' && /^#|^rgba?\(/.test(v)
/** Nome do projeto seguro dentro de comentários de código (`*` + `/` ou quebra de linha não escapam). */
const commentSafe = (s: string) => s.replace(/\*\//g, '* /').replace(/[\r\n]+/g, ' ')

/** Breakpoints únicos do projeto (os mesmos do Master Prompt e do CSS). */
export const BREAKPOINT_PX = Object.fromEntries(BREAKPOINTS.map((b) => [b.name, { min: b.min, max: b.max }])) as Record<string, { min: number; max: number | null }>

/* -------------------------------------------------------------------------- */
/* Tokens DTCG                                                                 */
/* -------------------------------------------------------------------------- */

type DtcgToken = { $type: string; $value: unknown; $description?: string }
type DtcgGroup = { [key: string]: DtcgToken | DtcgGroup | string | undefined; $description?: string }

/** Tokens no formato DTCG (`$type`/`$value`), prontos para Style Dictionary, Tokens Studio etc. */
export function buildDesignTokens(project: Project, theme: ResolvedTheme = projectTheme(project)): DtcgGroup {
  const color: DtcgGroup = {}
  for (const g of TOKEN_GROUPS)
    for (const k of g.keys) {
      const v = theme.tokens[k.key]
      if (isColor(v)) color[k.key] = { $type: 'color', $value: v, $description: k.label }
    }
  const m = theme.metrics
  const t = theme.typography
  return {
    $description: `Tokens de ${project.meta.name || 'projeto'} — gerados pelo Atelier UI.`,
    color,
    radius: { sm: { $type: 'dimension', $value: `${m.radiusSm}px` }, md: { $type: 'dimension', $value: `${m.radiusMd}px` }, lg: { $type: 'dimension', $value: `${m.radiusLg}px` } },
    space: Object.fromEntries([4, 8, 12, 16, 20, 24, 32, 40].map((n, i) => [String(i + 1), { $type: 'dimension', $value: `${n}px` }])),
    borderWidth: { default: { $type: 'dimension', $value: `${m.borderWidth}px` } },
    shadow: { surface: { $type: 'shadow', $value: m.shadow, $description: 'box-shadow CSS das superfícies' } },
    fontFamily: { heading: { $type: 'fontFamily', $value: m.headingFont }, body: { $type: 'fontFamily', $value: m.bodyFont } },
    fontWeight: { heading: { $type: 'fontWeight', $value: t.headingWeight }, body: { $type: 'fontWeight', $value: t.bodyWeight } },
    fontSize: { base: { $type: 'dimension', $value: `${t.baseSize}px` } },
    controlHeight: { sm: { $type: 'dimension', $value: '32px' }, md: { $type: 'dimension', $value: '40px' }, lg: { $type: 'dimension', $value: '48px' }, touch: { $type: 'dimension', $value: '44px' } },
    breakpoint: Object.fromEntries(BREAKPOINTS.map((b) => [b.name, { $type: 'dimension', $value: `${b.min}px`, $description: b.description }])),
  }
}

/* -------------------------------------------------------------------------- */
/* Fatos tipados                                                               */
/* -------------------------------------------------------------------------- */

/** Fatos do projeto com chaves técnicas e valores tipados (o “modelo de fatos único” em JSON). */
export function buildFacts(project: Project) {
  const theme = projectTheme(project)
  const desktop = desktopById(project.layout.desktopId)
  const mobile = mobileById(project.layout.mobileId)
  const header = project.navigation.header ? headerById(project.navigation.header.id) : undefined
  const sidebar = project.navigation.sidebar ? sidebarById(project.navigation.sidebar.id) : undefined
  const hasHeaderRegion = Boolean(desktop?.regions.some((r) => r.kind === 'header'))
  const headerHeight = hasHeaderRegion && desktop?.measurements.header ? desktop.measurements.header : header ? headerLookFor(header, project.navigation.header!.variant).height : null
  const sidebarWidth = sidebar
    ? sidebar.shape === 'rail'
      ? (desktop?.measurements.rail ?? sidebar.width)
      : sidebar.shape === 'dupla'
        ? sidebar.width
        : (desktop?.measurements.sidebar ?? sidebar.width)
    : (desktop?.measurements.sidebar ?? null)
  const entry = activeEntry(project.entry)
  const c = mobile?.config
  const navItems = project.meta.navItems.map((s) => s.trim()).filter(Boolean)
  return {
    brand: project.meta.name.trim() || null,
    navItems,
    breakpoints: BREAKPOINT_PX,
    entry: {
      flow: project.entry.flow,
      landing: entry.landingId,
      login: entry.loginId,
      signup: entry.signupId,
      signupEnabled: Boolean(entry.signupId),
    },
    layout: {
      desktop: desktop?.id ?? null,
      mobile: mobile?.id ?? null,
      header: headerHeight ? { model: header?.id ?? null, variant: project.navigation.header?.variant ?? null, height: px(headerHeight), spansSidebar: null as boolean | null } : null,
      sidebar: sidebarWidth ? { model: sidebar?.id ?? null, variant: project.navigation.sidebar?.variant ?? null, width: px(sidebarWidth) } : null,
      wideScreen: project.layout.wide ?? 'centered',
      wideScreenReviewed: project.layout.wide !== null,
      contentMaxWidth: desktop?.measurements.contentMax ? px(desktop.measurements.contentMax) : px(1440),
    },
    mobileNavigation: mobile
      ? {
          layout: mobile.id,
          bottomSlots: mobileSlots(mobile),
          drawer: Boolean(c && (c.side.startsWith('drawer') || c.top === 'topbar-hamburger')),
          rail: Boolean(c && (c.side.startsWith('rail') || c.side === 'mini-sidebar')),
          fullscreenMenu: Boolean(c && (c.overlay === 'fullscreen' || c.overlay === 'fullscreen-editorial')),
          stories: Boolean(c?.stories),
          storiesScope: c?.stories ? (project.layout.storiesScope ?? 'home') : null,
        }
      : null,
    identity: {
      palette: project.identity.paletteId,
      reviewed: !isDefaultIdentity(project),
      colorScheme: theme.tokens.mode,
      typography: {
        headingFamily: fontName(project.identity.typography.heading),
        bodyFamily: fontName(project.identity.typography.body),
        baseSize: px(project.identity.typography.baseSize),
        headingWeight: project.identity.typography.headingWeight,
        bodyWeight: project.identity.typography.bodyWeight,
      },
      radius: { sm: px(theme.metrics.radiusSm), md: px(theme.metrics.radiusMd), lg: px(theme.metrics.radiusLg) },
      borderWidth: px(theme.metrics.borderWidth),
      shadow: theme.metrics.shadow,
      density: project.identity.geometry.density,
      iconStyle: project.identity.geometry.iconStyle,
    },
    components: project.components.map((i) => ({ id: i.id, category: i.categoryId, family: i.familyId, label: i.label || null, props: { ...i.props }, tokenOverrides: { ...i.tokenOverrides } })),
  }
}

/** Corrige `spansSidebar` com a grade do layout (o header atravessa a coluna da sidebar?). */
export function withGridFacts(facts: ReturnType<typeof buildFacts>, project: Project) {
  const desktop = desktopById(project.layout.desktopId)
  const region = desktop?.regions.find((r) => r.kind === 'header')
  if (facts.layout.header && desktop && region) {
    const rows = desktop.grid.areas.map((r) => r.trim().split(/\s+/))
    facts.layout.header.spansSidebar = rows.some((cells) => cells.includes(region.id) && cells.every((x) => x === region.id))
  }
  return facts
}

/* -------------------------------------------------------------------------- */
/* Tailwind e TypeScript                                                       */
/* -------------------------------------------------------------------------- */

const colorKeys = (theme: ResolvedTheme) => TOKEN_KEYS.filter((k) => isColor(theme.tokens[k]))

/** tailwind.config.js (Tailwind 3): utilitários apontando para as variáveis CSS exportadas. */
export function buildTailwindConfig(project: Project): string {
  const theme = projectTheme(project)
  const colors = colorKeys(theme)
    .map((k) => `        '${kebab(k)}': 'var(--color-${kebab(k)})',`)
    .join('\n')
  const screens = BREAKPOINTS.filter((b) => b.min > 0)
    .map((b) => `      ${b.name}: '${b.min}px',`)
    .join('\n')
  return `/** @type {import('tailwindcss').Config} */
// ${commentSafe(project.meta.name || 'Projeto')} — gerado pelo Atelier UI. Use junto com o CSS de referência (variáveis --color-*, --radius-*...).
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,vue,svelte,html}'],
  theme: {
    screens: {
${screens}
    },
    extend: {
      colors: {
${colors}
      },
      borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)' },
      fontFamily: { heading: 'var(--font-heading)', body: 'var(--font-body)' },
      fontSize: { base: 'var(--font-size-base)' },
      boxShadow: { surface: 'var(--shadow-surface)' },
      borderWidth: { DEFAULT: 'var(--border-width)' },
      height: { 'control-sm': 'var(--control-h-sm)', 'control-md': 'var(--control-h-md)', 'control-lg': 'var(--control-h-lg)' },
      minHeight: { touch: '44px' },
    },
  },
}
`
}

/** Tailwind 4: bloco `@theme` com os valores dos tokens (sem arquivo de configuração). */
export function buildTailwindV4(project: Project): string {
  const theme = projectTheme(project)
  const m = theme.metrics
  const lines = [
    ...colorKeys(theme).map((k) => `  --color-${kebab(k)}: ${theme.tokens[k as TokenKey]};`),
    `  --font-heading: ${m.headingFont};`,
    `  --font-body: ${m.bodyFont};`,
    `  --radius-sm: ${m.radiusSm}px;`,
    `  --radius-md: ${m.radiusMd}px;`,
    `  --radius-lg: ${m.radiusLg}px;`,
    `  --shadow-surface: ${m.shadow};`,
    ...BREAKPOINTS.filter((b) => b.min > 0).map((b) => `  --breakpoint-${b.name}: ${b.min}px;`),
  ]
  return `/* ${commentSafe(project.meta.name || 'Projeto')} — Tailwind CSS 4, gerado pelo Atelier UI. */
@import "tailwindcss";

@theme {
${lines.join('\n')}
}
`
}

/** Módulo TypeScript com tokens e fatos tipados (`as const`). */
export function buildTokensTs(project: Project): string {
  const theme = projectTheme(project)
  const tokens = Object.fromEntries(colorKeys(theme).map((k) => [k, theme.tokens[k]]))
  const facts = withGridFacts(buildFacts(project), project)
  return `// ${commentSafe(project.meta.name || 'Projeto')} — gerado pelo Atelier UI. Não edite à mão: gere de novo pelo Studio.
export const colors = ${JSON.stringify(tokens, null, 2)} as const

export const radius = { sm: ${theme.metrics.radiusSm}, md: ${theme.metrics.radiusMd}, lg: ${theme.metrics.radiusLg} } as const
export const space = [4, 8, 12, 16, 20, 24, 32, 40] as const
export const breakpoints = ${JSON.stringify(BREAKPOINT_PX, null, 2)} as const

export const facts = ${JSON.stringify(facts, null, 2)} as const

export type ColorToken = keyof typeof colors
`
}
