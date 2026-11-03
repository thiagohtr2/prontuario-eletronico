import { z } from 'zod'
import { createProject, type Project } from './project'

/**
 * Validação de arquivos importados. O arquivo é mesclado sobre um projeto padrão antes de
 * validar, então backups antigos ou parciais continuam funcionando, mas valores de tipo
 * errado são rejeitados com mensagens claras.
 */

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'cor hexadecimal no formato #RRGGBB')
const tokenOverrides = z.record(z.string(), hex)
const stepId = z.enum(['objetivo', 'entrada', 'desktop', 'mobile', 'revisao', 'preview', 'identidade', 'navegacao', 'componentes', 'entrega'])
const navChoice = z.object({ id: z.string().min(1), variant: z.union([z.literal(0), z.literal(1)]) })

export const projectSchema = z.object({
  schema: z.literal('atelier-ui/project'),
  version: z.literal(1),
  id: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  meta: z.object({
    name: z.string(),
    objective: z.string(),
    description: z.string(),
    audience: z.string(),
    purpose: z.string(),
    projectType: z.enum(['saas', 'dashboard', 'loja', 'landing', 'portfolio', 'one-screen', 'outro']).nullable(),
    projectTypeOther: z.string(),
    features: z.array(z.string()),
    navItems: z.array(z.string()),
    tech: z.string(),
  }),
  mode: z.enum(['guided', 'free']),
  depth: z.enum(['essential', 'advanced']),
  prefs: z.object({ showLegends: z.boolean(), showHints: z.boolean() }),
  guided: z.object({ step: stepId, completed: z.array(stepId), skeletonApproved: z.boolean() }),
  entry: z.object({
    flow: z.enum(['landing-login', 'landing-only', 'login-only', 'app-direct', 'institutional']).nullable(),
    landingId: z.string().nullable(),
    loginId: z.string().nullable(),
    signupId: z.string().nullable(),
    landingUsesOriginalColors: z.boolean(),
    noSignup: z.boolean(),
  }),
  layout: z.object({
    desktopId: z.string().nullable(),
    mobileId: z.string().nullable(),
    wide: z.enum(['centered', 'fluid', 'extra']).nullable(),
    storiesScope: z.enum(['home', 'main', 'all']).nullable(),
  }),
  identity: z.object({
    paletteId: z.string().min(1),
    overrides: tokenOverrides,
    typography: z.object({
      heading: z.string(),
      body: z.string(),
      baseSize: z.number().min(12).max(22),
      headingWeight: z.number().min(300).max(900),
      bodyWeight: z.number().min(300).max(700),
    }),
    geometry: z.object({
      radius: z.enum(['none', 'small', 'medium', 'large', 'pill']),
      borderWidth: z.union([z.literal(0), z.literal(1), z.literal(2)]),
      shadow: z.enum(['none', 'subtle', 'medium', 'strong']),
      surface: z.enum(['flat', 'outlined', 'elevated', 'glass']),
      density: z.enum(['compact', 'comfortable', 'spacious']),
      iconStyle: z.enum(['outline', 'filled', 'duotone']),
    }),
  }),
  navigation: z.object({ header: navChoice.nullable(), sidebar: navChoice.nullable() }),
  components: z.array(
    z.object({
      id: z.string().min(1),
      categoryId: z.string().min(1),
      familyId: z.string().min(1),
      label: z.string(),
      props: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
      tokenOverrides,
      createdAt: z.string(),
    }),
  ),
  inspiration: z
    .object({
      siteId: z.string().min(1),
      paletteId: z.string().min(1),
      overrides: z.object({ bg: hex.optional(), text: hex.optional(), accent: hex.optional() }),
    })
    .nullable(),
  template: z
    .object({
      id: z.string().min(1),
      overrides: z.object({
        primary: hex.optional(),
        bg: hex.optional(),
        text: hex.optional(),
        headingFont: z.string().optional(),
        bodyFont: z.string().optional(),
        radius: z.enum(['none', 'small', 'medium', 'large', 'pill']).optional(),
      }),
      sections: z.array(z.string()),
    })
    .nullable(),
  prompt: z.object({
    excluded: z.array(z.string()),
    notes: z.record(z.string(), z.string()),
    conflictResolutions: z.record(z.string(), z.string()),
  }),
  validation: z.object({
    config: z.object({
      url: z.string(),
      routes: z.array(z.string()),
      widths: z.array(z.number().int().min(200).max(4000)),
      manualLogin: z.boolean(),
      waitMs: z.number().min(0).max(30000),
      checks: z.object({
        horizontalOverflow: z.boolean(),
        offscreen: z.boolean(),
        tapTargets: z.boolean(),
        inputFontSize: z.boolean(),
      }),
      minTapTarget: z.number().min(16).max(96),
    }),
    report: z.any().nullable(),
  }),
})

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Mescla `patch` sobre `base` recursivamente (apenas objetos simples; arrays são substituídos). */
export function deepMerge<T>(base: T, patch: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(patch)) return (patch === undefined ? base : patch) as T
  const out: Record<string, unknown> = { ...base }
  for (const [k, v] of Object.entries(patch)) {
    const current = (base as Record<string, unknown>)[k]
    out[k] = isPlainObject(current) && isPlainObject(v) && Object.keys(current).length > 0 ? deepMerge(current, v) : v
  }
  return out as T
}

export type ParseResult = { ok: true; project: Project } | { ok: false; errors: string[] }

/** Aceita um projeto puro, um backup completo ({ project, history }) ou a especificação exportada. */
export function parseProjectFile(raw: unknown): ParseResult {
  let candidate: unknown = raw
  if (isPlainObject(raw) && isPlainObject(raw.project) && raw.kind === 'atelier-ui/backup') candidate = raw.project
  if (isPlainObject(raw) && raw.$schema === 'atelier-ui/spec@1' && isPlainObject(raw.source)) candidate = raw.source
  if (!isPlainObject(candidate) || candidate.schema !== 'atelier-ui/project') {
    return { ok: false, errors: ['O arquivo não é um projeto do Atelier UI (campo "schema" ausente ou diferente de "atelier-ui/project").'] }
  }
  const merged = deepMerge(createProject(), candidate)
  const result = projectSchema.safeParse(merged)
  if (!result.success) {
    return {
      ok: false,
      errors: result.error.issues.slice(0, 8).map((i) => `${i.path.join('.') || '(raiz)'}: ${i.message}`),
    }
  }
  return { ok: true, project: result.data as Project }
}

export interface ParsedSnapshot {
  id: string
  label: string
  createdAt: string
  project: Project
}

/**
 * Versões contidas em um backup completo (`kind: 'atelier-ui/backup'`). Cada versão passa pela
 * mesma validação de um projeto importado; versões inválidas são descartadas e contadas.
 */
export function parseBackupHistory(raw: unknown): { snapshots: ParsedSnapshot[]; skipped: number } {
  if (!isPlainObject(raw) || raw.kind !== 'atelier-ui/backup' || !Array.isArray(raw.history)) return { snapshots: [], skipped: 0 }
  const snapshots: ParsedSnapshot[] = []
  let skipped = 0
  for (const entry of raw.history) {
    const parsed = isPlainObject(entry) ? parseProjectFile(entry.project) : null
    if (!parsed?.ok || !isPlainObject(entry)) {
      skipped++
      continue
    }
    snapshots.push({
      id: typeof entry.id === 'string' && entry.id ? entry.id : `snap_import_${snapshots.length}`,
      label: typeof entry.label === 'string' && entry.label ? entry.label : 'Versão importada',
      createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : new Date(0).toISOString(),
      project: parsed.project,
    })
  }
  return { snapshots, skipped }
}
