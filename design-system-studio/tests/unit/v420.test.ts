import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createProject, type Project } from '@/core/project'
import { parseBackupHistory, parseProjectFile } from '@/core/schema'
import { useStudio } from '@/core/store'
import { headerLookFor, headers, sidebars } from '@/modules/navigation/catalog'
import { collectPromptItems } from '@/prompt/items'
import { COMPONENT_RESPONSIVE_RULES } from '@/prompt/responsive'
import { buildProjectSpec } from '@/prompt/spec'
import { renderItemPrompt, renderMasterPrompt } from '@/prompt/text'

/** Restante da versão 4.20 do plano da auditoria: B-09, B-14 e B-23. */

const BACKUPS: Record<string, { path: string; budget: number }> = {
  // Orçamento = 80% do tamanho antes da B-14 (−20% de caracteres, critério da TE-13).
  P1: { path: 'P1-atlas-workspace/exportados/atlas-workspace-backup.json', budget: 40651 },
  P2: { path: 'P2-verde-vivo/exportados/verde-vivo-backup.json', budget: 37674 },
  P3: { path: 'P3-nexo-capital/exportados/nexo-capital-backup.json', budget: 31014 },
  P4: { path: 'P4-centro-operacional/exportados/centro-operacional-backup.json', budget: 20469 },
  P5: { path: 'P5-conecta/exportados/conecta-backup.json', budget: 33653 },
}
const read = (path: string) => JSON.parse(readFileSync(resolve(__dirname, '../../auditoria/fase2-projetos', path), 'utf8'))
function load(path: string): Project {
  const parsed = parseProjectFile(read(path))
  if (!parsed.ok) throw new Error(parsed.errors.join('\n'))
  return parsed.project
}

describe('B-09 — cada composição exporta a própria especificação', () => {
  it.each(headers.flatMap((h) => [0, 1].map((v) => [h.id, v as 0 | 1] as const)))('header %s, composição %i', (id, variant) => {
    const p = createProject()
    p.navigation.header = { id, variant }
    const item = collectPromptItems(p).find((i) => i.kind === 'header')!
    const model = headers.find((h) => h.id === id)!
    const look = headerLookFor(model, variant)
    expect(item.measurements['altura (desktop)']).toMatch(new RegExp(`^${look.height} px`))
    expect(item.structure.join('\n')).toContain(`Barra principal com ${look.height} px`)
    expect(item.structure.join('\n')).toContain(`Disposição da composição “${model.compositions[variant].name}”`)
    const other = model.compositions[variant === 0 ? 1 : 0].name
    if (other !== model.compositions[variant].name) expect(item.structure.join('\n')).not.toContain(`“${other}”`)
  })

  it.each(sidebars.flatMap((s) => [0, 1].map((v) => [s.id, v as 0 | 1] as const)))('sidebar %s, composição %i', (id, variant) => {
    const p = createProject()
    p.navigation.sidebar = { id, variant }
    const item = collectPromptItems(p).find((i) => i.kind === 'sidebar')!
    const model = sidebars.find((s) => s.id === id)!
    expect(item.structure.join('\n')).toContain(`Composição “${model.compositions[variant].name}”`)
    expect(item.structure.join('\n')).not.toMatch(/Composição A: .* Composição B: /)
  })

  it('composições com densidade diferente exportam alturas de item diferentes', () => {
    const differing = sidebars.filter((s) => s.specs[0].measurements?.['altura dos itens'] !== s.specs[1].measurements?.['altura dos itens'])
    for (const s of differing) {
      const look = (v: 0 | 1) => ({ ...s.look, ...(s.compositions[v].arrangement.patch ?? {}) }).density
      expect(look(0)).not.toBe(look(1))
    }
  })
})

describe('B-23 — observação da paleta e versões do backup', () => {
  it('a observação escrita no item da paleta aparece no Master Prompt', () => {
    const p = createProject()
    p.prompt.notes['identity.palette'] = 'Use o verde só em ações de confirmação.'
    expect(renderMasterPrompt(buildProjectSpec(p))).toContain('Use o verde só em ações de confirmação.')
  })

  it('backup completo traz as versões validadas e descarta as inválidas', () => {
    const raw = read(BACKUPS.P2.path)
    const good = { id: 'snap_a', label: 'Antes da paleta', createdAt: '2026-11-01T10:00:00.000Z', project: raw.project }
    raw.history = [good, { id: 'snap_b', label: 'quebrada', createdAt: '2026-11-01T11:00:00.000Z', project: { schema: 'outro' } }]
    const { snapshots, skipped } = parseBackupHistory(raw)
    expect(snapshots.map((s) => s.label)).toEqual(['Antes da paleta'])
    expect(skipped).toBe(1)
  })

  it('importar um backup restaura as versões junto com o projeto', () => {
    const raw = read(BACKUPS.P1.path)
    raw.history = [
      { id: 'snap_x1', label: 'Versão 1', createdAt: '2026-10-30T10:00:00.000Z', project: raw.project },
      { id: 'snap_x2', label: 'Versão 2', createdAt: '2026-10-31T10:00:00.000Z', project: raw.project },
    ]
    useStudio.setState({ project: createProject(), history: [] })
    const result = useStudio.getState().importProject(raw)
    expect(result).toMatchObject({ ok: true, versions: 2, skipped: 0 })
    const labels = useStudio.getState().history.map((h) => h.label)
    expect(labels).toEqual(['Antes de importar um arquivo', 'Versão 2', 'Versão 1'])
    expect(useStudio.getState().project.meta.name).toBe(raw.project.meta.name)
  })
})

describe.each(Object.entries(BACKUPS))('B-14 — prompt enxuto (%s)', (_id, { path, budget }) => {
  const project = load(path)
  const spec = buildProjectSpec(project)
  const prompt = renderMasterPrompt(spec)

  it('fica pelo menos 20% menor que antes', () => {
    expect(prompt.length).toBeLessThanOrEqual(budget)
  })

  it('nenhuma linha de conteúdo com 25+ caracteres se repete', () => {
    const counts = new Map<string, number>()
    for (const raw of prompt.split('\n')) {
      const l = raw.trim().replace(/^- /, '')
      if (l.length < 25 || l.startsWith('#') || /^\*\*.*\*\*$/.test(l) || l.startsWith('_Também valem aqui')) continue
      counts.set(l, (counts.get(l) ?? 0) + 1)
    }
    expect([...counts].filter(([, n]) => n > 1).map(([l]) => l)).toEqual([])
  })

  it('não perde fatos: todos os tokens e todas as regras dos tipos presentes', () => {
    for (const [k, v] of Object.entries(spec.identity.tokens)) if (typeof v === 'string' && v.startsWith('#')) expect(prompt, k).toContain(`\`${k}\` ${v}`)
    for (const rules of Object.values(spec.responsive.componentRules)) for (const r of rules) expect(prompt).toContain(r)
  })

  it('regras de tipos ausentes não entram', () => {
    const kinds = new Set(spec.items.filter((i) => i.included).flatMap((i) => i.responsiveKinds))
    for (const [kind, rules] of Object.entries(COMPONENT_RESPONSIVE_RULES)) if (!kinds.has(kind)) for (const r of rules) expect(prompt).not.toContain(r)
  })

  it('o prompt individual continua autossuficiente (regras do tipo junto do item)', () => {
    for (const item of spec.items.filter((i) => i.responsiveKinds.length)) {
      const single = renderItemPrompt(item, project)
      for (const kind of item.responsiveKinds) for (const r of COMPONENT_RESPONSIVE_RULES[kind] ?? []) expect(single).toContain(r)
    }
  })
})

describe('B-22 — escopo estruturado (4.22)', () => {
  it('sem escolha, monitores grandes saem com o padrão marcado como não revisado', () => {
    const p = createProject()
    p.layout.desktopId = 'sidebar-integral-classica'
    const desk = collectPromptItems(p).find((i) => i.kind === 'desktop')!
    expect(desk.responsive.join('\n')).toMatch(/1440 px.*centralizado.*não revisado/)
  })
  it('escolhas de monitores grandes e stories entram nos itens', () => {
    const p = createProject()
    p.layout = { desktopId: 'sidebar-integral-classica', mobileId: 'stories-dock-flutuante', wide: 'extra', storiesScope: 'all' }
    const items = collectPromptItems(p)
    expect(items.find((i) => i.kind === 'desktop')!.responsive.join('\n')).toContain('painel fixo à direita')
    expect(items.find((i) => i.kind === 'mobile')!.structure.join('\n')).toContain('aparece em todas as telas')
  })
})
