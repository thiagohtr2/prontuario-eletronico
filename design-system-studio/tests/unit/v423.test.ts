import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import type { Project } from '@/core/project'
import { parseProjectFile } from '@/core/schema'
import { buildProjectCss } from '@/prompt/css'
import { buildDesignTokens, buildTailwindConfig, buildTailwindV4, buildTokensTs } from '@/prompt/devexport'
import { buildProjectSpec } from '@/prompt/spec'
import { renderMasterPrompt } from '@/prompt/text'

/** Versão 4.23: exportações para desenvolvedores (B-15). */

const load = (path: string): Project => {
  const parsed = parseProjectFile(JSON.parse(readFileSync(resolve(__dirname, '../../auditoria/fase2-projetos', path), 'utf8')))
  if (!parsed.ok) throw new Error(parsed.errors.join('\n'))
  return parsed.project
}
const P1 = load('P1-atlas-workspace/exportados/atlas-workspace-backup.json')

describe('B-15 — JSON consumível por código', () => {
  const spec = buildProjectSpec(P1)

  it('fatos com chaves em inglês e valores tipados ({ value, unit })', () => {
    expect(spec.facts.layout.header?.height).toEqual({ value: 64, unit: 'px' })
    expect(spec.facts.layout.header?.spansSidebar).toBe(false)
    expect(spec.facts.layout.sidebar?.width).toEqual({ value: 252, unit: 'px' })
    expect(spec.facts.breakpoints).toEqual({ mobile: { min: 0, max: 767 }, tablet: { min: 768, max: 1023 }, desktop: { min: 1024, max: 1439 }, wide: { min: 1440, max: null } })
    expect(spec.facts.mobileNavigation?.bottomSlots).toBe(4)
    expect(typeof spec.facts.identity.typography.baseSize.value).toBe('number')
  })

  it('tokens DTCG com $type/$value', () => {
    const t = buildDesignTokens(P1) as Record<string, Record<string, { $type: string; $value: unknown }>>
    expect(t.color.primary).toMatchObject({ $type: 'color' })
    expect(String(t.color.primary.$value)).toMatch(/^#/)
    expect(t.radius.md.$type).toBe('dimension')
    expect(t.breakpoint.tablet.$value).toBe('768px')
  })
})

describe('B-15 — CSS, Tailwind e TypeScript', () => {
  it('CSS sem breakpoint divergente e sem 44 px em checkbox/radio', () => {
    const css = buildProjectCss(P1)
    expect(css).not.toContain('599px')
    expect(css).toContain('@media (max-width: 767px)')
    expect(css).toContain('input:where(:not([type=checkbox], [type=radio]')
    expect(css).not.toContain('--space-unit')
    expect(css).toContain('--control-h-md: 40px')
  })

  it('Tailwind 3 e 4 usam os tokens e os breakpoints do projeto', () => {
    const v3 = buildTailwindConfig(P1)
    expect(v3).toContain("'primary': 'var(--color-primary)'")
    expect(v3).toContain("tablet: '768px'")
    expect(v3).toContain("desktop: '1024px'")
    expect(buildTailwindV4(P1)).toMatch(/@theme \{[\s\S]*--color-primary: #[0-9a-f]{6};[\s\S]*--breakpoint-tablet: 768px;/i)
  })

  it('tokens.ts é TypeScript válido', () => {
    const out = ts.transpileModule(buildTokensTs(P1), { reportDiagnostics: true, compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } })
    expect(out.diagnostics ?? []).toEqual([])
    expect(out.outputText).toContain('export const facts')
  })

  it('trechos de CSS do prompt são válidos (sem “−” nem “64 px” dentro de calc/min/max)', () => {
    const prompt = renderMasterPrompt(buildProjectSpec(P1))
    const fns = prompt.match(/\b(calc|min|max|clamp)\([^)]*\)/g) ?? []
    for (const f of fns) {
      expect(f).not.toContain('−')
      expect(f).not.toMatch(/\d\s+px/)
    }
  })
})
