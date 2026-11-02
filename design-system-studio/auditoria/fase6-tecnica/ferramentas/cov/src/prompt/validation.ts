import { z } from 'zod'
import type { Project, ValidationReport } from '@/core/project'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { GLOBAL_RESPONSIVE_RULES, IMPLEMENTATION_RULES } from './responsive'

const issueSchema = z.object({
  page: z.string(),
  width: z.number(),
  type: z.string(),
  severity: z.enum(['alta', 'media', 'baixa']).catch('media'),
  element: z.string(),
  description: z.string(),
  suggestion: z.string().catch(''),
})

export const reportSchema = z.object({
  tool: z.string().catch('desconhecido'),
  generatedAt: z.string().catch(() => new Date().toISOString()),
  baseUrl: z.string(),
  widths: z.array(z.number()),
  pages: z.array(z.string()),
  issues: z.array(issueSchema),
})

const SENSITIVE = /(cookie|token|authorization|password|senha|bearer)/i

export function parseReport(raw: unknown): { ok: true; report: ValidationReport } | { ok: false; errors: string[] } {
  const result = reportSchema.safeParse(raw)
  if (!result.success) return { ok: false, errors: result.error.issues.slice(0, 6).map((i) => `${i.path.join('.') || '(raiz)'}: ${i.message}`) }
  // Defesa extra: nunca guardar campos que pareçam credenciais.
  const issues = result.data.issues.map((i) => ({ ...i, element: SENSITIVE.test(i.element) ? '[removido: possível dado sensível]' : i.element }))
  return { ok: true, report: { ...result.data, issues } }
}

/** Configuração do executor local. Nunca contém senhas, cookies ou tokens. */
export function buildRunnerConfig(project: Project) {
  const c = project.validation.config
  return {
    kind: 'atelier-ui/validation-config',
    version: 1,
    generatedAt: new Date().toISOString(),
    config: {
      url: c.url.trim(),
      routes: c.routes.filter(Boolean),
      widths: [...c.widths].sort((a, b) => a - b),
      manualLogin: c.manualLogin,
      waitMs: c.waitMs,
      checks: c.checks,
      minTapTarget: c.minTapTarget,
    },
  }
}

/** Prompt de correção para a IA, preservando as decisões aprovadas no Studio. */
export function buildFixPrompt(report: ValidationReport, project: Project): string {
  const desktop = desktopById(project.layout.desktopId)
  const mobile = mobileById(project.layout.mobileId)
  const byPage = new Map<string, typeof report.issues>()
  for (const issue of report.issues) {
    const list = byPage.get(issue.page) ?? []
    list.push(issue)
    byPage.set(issue.page, list)
  }
  const out: string[] = []
  out.push(`# Correção de responsividade — ${project.meta.name || report.baseUrl}`)
  out.push(
    `> Relatório do Atelier UI Validation Runner (${new Date(report.generatedAt).toLocaleString('pt-BR')}), site ${report.baseUrl}, larguras testadas: ${report.widths.join(', ')} px. ${report.issues.length} ocorrência(s).`,
  )
  out.push(
    `## Regras desta correção\n${[
      'Corrija somente os problemas listados, sem alterar a estrutura, a identidade visual ou os componentes aprovados.',
      desktop ? `Preserve a arquitetura desktop aprovada: “${desktop.name}”.` : '',
      mobile ? `Preserve a arquitetura mobile aprovada: “${mobile.name}”.` : '',
      'Prefira corrigir a causa (larguras fixas, min-width ausente em flex/grid, textos sem quebra) em vez de esconder conteúdo ou usar overflow: hidden no body.',
      'Depois de corrigir, valide novamente em todas as larguras listadas.',
    ]
      .filter(Boolean)
      .map((l) => `- ${l}`)
      .join('\n')}`,
  )
  for (const [page, issues] of byPage) {
    out.push(`## Página \`${page}\``)
    const sorted = [...issues].sort((a, b) => a.width - b.width)
    out.push(
      sorted
        .map((i) => `- **${i.width}px · ${i.type}** (${i.severity}) — \`${i.element}\`\n  - Problema: ${i.description}\n  - Sugestão: ${i.suggestion}`)
        .join('\n'),
    )
  }
  if (report.issues.length === 0) out.push('Nenhum problema encontrado. Mantenha as regras abaixo em novas alterações.')
  out.push(`## Regras gerais de responsividade\n${GLOBAL_RESPONSIVE_RULES.map((r) => `- ${r}`).join('\n')}`)
  out.push(`## Regras de implementação\n${IMPLEMENTATION_RULES.map((r) => `- ${r}`).join('\n')}`)
  return out.join('\n\n') + '\n'
}
