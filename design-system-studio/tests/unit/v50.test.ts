import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'
import { createProject, type Project } from '@/core/project'
import { parseProjectFile } from '@/core/schema'
import { useStudio } from '@/core/store'
import { diffProjects, diffPrompts } from '@/prompt/diff'
import { buildFixPrompt, buildRunnerConfig, parseReport } from '@/prompt/validation'

/** Versão 5.0: fidelidade no Validation Lab, comparação de versões e projetos nomeados. */

const load = (path: string): Project => {
  const parsed = parseProjectFile(JSON.parse(readFileSync(resolve(__dirname, '../../auditoria/fase2-projetos', path), 'utf8')))
  if (!parsed.ok) throw new Error(parsed.errors.join('\n'))
  return parsed.project
}
const P1 = load('P1-atlas-workspace/exportados/atlas-workspace-backup.json')

describe('Fidelidade à especificação', () => {
  it('a configuração do executor leva os fatos esperados (sem segredos)', () => {
    const p = structuredClone(P1)
    p.meta.navItems = ['Início', 'Projetos', 'Tarefas']
    p.validation.config.url = 'http://localhost:3000'
    const cfg = buildRunnerConfig(p) as { config: { expect?: Record<string, unknown> } }
    expect(cfg.config.expect).toMatchObject({ brand: 'Atlas Workspace', navItems: ['Início', 'Projetos', 'Tarefas'], headerHeight: 64, sidebarWidth: 252, bottomSlots: 4 })
    expect(JSON.stringify(cfg)).not.toMatch(/password|senha|cookie|token/i)
  })

  it('sem a verificação de fidelidade, a configuração não leva expectativas', () => {
    const p = structuredClone(P1)
    p.validation.config.checks.fidelity = false
    expect((buildRunnerConfig(p) as { config: { expect?: unknown } }).config.expect).toBeUndefined()
  })

  it('relatório com fidelidade é aceito e os itens que não conferem entram no prompt de correção', () => {
    const parsed = parseReport({
      tool: 'atelier-ui-validation-runner/1.1',
      generatedAt: new Date().toISOString(),
      baseUrl: 'http://localhost:3000',
      widths: [390, 1280],
      pages: ['/'],
      issues: [],
      fidelity: [
        { id: 'header-height', label: 'Altura do header', width: 1280, expected: '64 px', measured: '72 px', ok: false },
        { id: 'brand', label: 'Marca do projeto visível', width: 1280, expected: '“Atlas”', measured: 'encontrada', ok: true },
      ],
    })
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    const fix = buildFixPrompt(parsed.report, P1)
    expect(fix).toContain('## Fidelidade à especificação')
    expect(fix).toContain('Altura do header** (1280px): esperado 64 px; medido 72 px')
    expect(fix).not.toContain('Marca do projeto visível')
  })

  it('relatórios antigos (sem fidelidade) continuam válidos', () => {
    const parsed = parseReport({ tool: 'x', generatedAt: new Date().toISOString(), baseUrl: 'http://a', widths: [390], pages: ['/'], issues: [] })
    expect(parsed.ok).toBe(true)
  })
})

describe('Comparação entre versões', () => {
  it('lista as decisões que mudaram e quanto o prompt mudou', () => {
    const before = structuredClone(P1)
    const after = structuredClone(P1)
    after.identity.paletteId = 'floresta'
    after.meta.navItems = ['Início', 'Relatórios']
    const changes = diffProjects(before, after)
    expect(changes.map((c) => c.label)).toEqual(expect.arrayContaining(['Paleta', 'Itens do menu']))
    expect(changes.find((c) => c.label === 'Itens do menu')!.after).toBe('Início · Relatórios')
    const delta = diffPrompts(before, after)
    expect(delta.added).toBeGreaterThan(0)
    expect(diffProjects(before, structuredClone(before))).toEqual([])
  })
})

describe('Projetos nomeados', () => {
  beforeEach(() => useStudio.setState({ project: createProject(), history: [], library: [] }))

  it('novo projeto guarda o atual na biblioteca; abrir troca e guarda o outro', () => {
    const st = useStudio.getState()
    st.updateMeta({ name: 'Primeiro' })
    st.saveSnapshot('v1')
    useStudio.getState().newProject()
    let s = useStudio.getState()
    expect(s.project.meta.name).toBe('')
    expect(s.history).toEqual([])
    expect(s.library.map((e) => e.name)).toEqual(['Primeiro'])
    expect(s.library[0].history).toHaveLength(1)
    s.updateMeta({ name: 'Segundo' })
    useStudio.getState().openProject(s.library[0].id)
    s = useStudio.getState()
    expect(s.project.meta.name).toBe('Primeiro')
    expect(s.history.map((h) => h.label)).toEqual(['v1'])
    expect(s.library.map((e) => e.name)).toEqual(['Segundo'])
  })

  it('um projeto vazio não ocupa a biblioteca; duplicar cria uma cópia', () => {
    useStudio.getState().newProject()
    expect(useStudio.getState().library).toEqual([])
    useStudio.getState().updateMeta({ name: 'Base' })
    useStudio.getState().duplicateProject()
    const s = useStudio.getState()
    expect(s.library.map((e) => e.name)).toEqual(['Base (cópia)'])
    expect(s.library[0].id).not.toBe(s.project.id)
  })
})
