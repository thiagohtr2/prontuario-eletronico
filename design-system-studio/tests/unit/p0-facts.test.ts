import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createProject, type Project } from '@/core/project'
import { parseProjectFile } from '@/core/schema'
import { projectTokens } from '@/core/theme'
import { RADIUS_VALUES } from '@/core/tokens'
import { siteById } from '@/modules/inspiration/catalog'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { headerById, headerLookFor, sidebarById, sidebarLookFor } from '@/modules/navigation/catalog'
import { templateById } from '@/modules/templates/catalog'
import { detectPending } from '@/prompt/conflicts'
import { collectPromptItems } from '@/prompt/items'
import { BREAKPOINTS } from '@/prompt/responsive'
import { buildProjectSpec } from '@/prompt/spec'
import { renderMasterPrompt } from '@/prompt/text'

/**
 * P0 da auditoria (B-01 a B-04): os Master Prompts dos cinco projetos auditados não podem ter
 * fatos com dois valores (altura do header, largura da sidebar, breakpoints, navegação móvel,
 * raio e fontes), conteúdo de demonstração nem padrões apresentados como decisões aprovadas.
 */

const BACKUPS = {
  P1: 'auditoria/fase2-projetos/P1-atlas-workspace/exportados/atlas-workspace-backup.json',
  P2: 'auditoria/fase2-projetos/P2-verde-vivo/exportados/verde-vivo-backup.json',
  P3: 'auditoria/fase2-projetos/P3-nexo-capital/exportados/nexo-capital-backup.json',
  P4: 'auditoria/fase2-projetos/P4-centro-operacional/exportados/centro-operacional-backup.json',
  P5: 'auditoria/fase2-projetos/P5-conecta/exportados/conecta-backup.json',
}

function load(path: string): Project {
  const parsed = parseProjectFile(JSON.parse(readFileSync(resolve(__dirname, '../..', path), 'utf8')))
  if (!parsed.ok) throw new Error(parsed.errors.join('\n'))
  return parsed.project
}

const mobileTexts = (lines: string[]) => lines.filter((l) => /☰|drawer|hamb[uú]rguer/i.test(l))

describe.each(Object.entries(BACKUPS))('P0 — %s', (_id, path) => {
  const project = load(path)
  const items = collectPromptItems(project)
  const prompt = renderMasterPrompt(buildProjectSpec(project))
  const desktop = desktopById(project.layout.desktopId)
  const mobile = mobileById(project.layout.mobileId)

  it('não contém o breakpoint antigo de 600 px', () => {
    expect(prompt).not.toMatch(/600\s?(e|a|–|-)\s?1023/)
  })

  it('não contém as marcas fictícias dos modelos de header e sidebar', () => {
    const brands: string[] = []
    const h = project.navigation.header
    const hm = h ? headerById(h.id) : undefined
    if (hm && h) brands.push(hm.look.brand, headerLookFor(hm, h.variant).brand)
    const s = project.navigation.sidebar
    const sm = s ? sidebarById(s.id) : undefined
    if (sm && s) brands.push(sm.look.brand, sidebarLookFor(sm, s.variant).brand)
    expect(prompt).not.toMatch(/marca fictícia/)
    for (const b of brands.filter((b) => b.toLowerCase() !== project.meta.name.toLowerCase())) {
      expect(prompt, b).not.toMatch(new RegExp(`(?<![\\p{L}])${b}(?![\\p{L}])`, 'u'))
    }
  })

  it('marcas de inspiração e template só aparecem como nome do item de referência', () => {
    const brands = [project.inspiration && siteById(project.inspiration.siteId)?.brand, project.template && templateById(project.template.id)?.brand].filter(
      (b): b is string => Boolean(b) && b!.toLowerCase() !== project.meta.name.toLowerCase(),
    )
    for (const item of items) {
      const text = [item.summary, ...item.structure, ...item.behavior, ...item.responsive, ...item.notes].join('\n')
      for (const b of brands) expect(text, `${item.key}: ${b}`).not.toMatch(new RegExp(`(?<![\\p{L}])${b}(?![\\p{L}])`, 'u'))
    }
  })

  it('o header tem uma única altura: a do layout desktop', () => {
    const header = items.find((i) => i.kind === 'header')
    const target = desktop?.measurements.header
    if (!header || !target || !desktop?.regions.some((r) => r.kind === 'header')) return
    const heights = new Set([header.summary, ...header.structure].join('\n').match(/Barra principal com (\d+) px/g) ?? [])
    expect([...heights]).toEqual([`Barra principal com ${target} px`])
    expect(header.measurements['altura (desktop)']).toMatch(new RegExp(`^${target} px`))
  })

  it('a sidebar tem uma única largura: a do layout desktop', () => {
    const sidebar = items.find((i) => i.kind === 'sidebar')
    const model = project.navigation.sidebar ? sidebarById(project.navigation.sidebar.id) : undefined
    if (!sidebar || !model || !desktop || model.shape === 'dupla') return
    const target = model.shape === 'rail' ? desktop.measurements.rail : desktop.measurements.sidebar
    if (!target) return
    expect(sidebar.measurements.largura).toBe(`${target} px`)
    if (target !== model.width) expect(sidebar.structure.join('\n')).not.toContain(`${model.width} px`)
  })

  it('header e sidebar não definem a navegação móvel quando há layout mobile', () => {
    if (!mobile) return
    for (const item of items.filter((i) => i.kind === 'header' || i.kind === 'sidebar')) {
      const own = item.responsive.filter((l) => !l.startsWith('No celular (até 767 px), siga o layout mobile') && !l.startsWith('De 768 a 1023 px: use a estrutura desktop compactada'))
      expect(mobileTexts(own), item.key).toEqual([])
      expect(item.responsive.some((l) => l.includes(`layout mobile “${mobile.name}”`))).toBe(true)
    }
  })

  it('componentes herdam raio e fontes da identidade global', () => {
    const r = RADIUS_VALUES[project.identity.geometry.radius]
    for (const c of items.filter((i) => i.kind === 'component')) {
      expect(c.properties['Raio dos controles']).toMatch(new RegExp(`^${r.sm} px`))
      expect(c.properties['Raio dos contêineres']).toMatch(new RegExp(`^${r.lg} px`))
      expect(c.structure.join('\n')).not.toMatch(/\braio (de|total)\b/i)
    }
  })

  it('usa os quatro breakpoints únicos', () => {
    expect(BREAKPOINTS.map((b) => [b.min, b.max])).toEqual([
      [0, 767],
      [768, 1023],
      [1024, 1439],
      [1440, null],
    ])
    expect(prompt).toContain('Entre 768 e 1023 px (tablet)')
  })

  it('registra as decisões automáticas de prioridade', () => {
    expect(prompt).toContain('## Decisões de prioridade')
    expect(prompt).toContain('Precedência fixa')
  })
})

describe('P0 — conteúdo do projeto (B-02)', () => {
  function withNav(): Project {
    const p = load(BACKUPS.P1)
    p.meta.navItems = ['Visão geral', 'Projetos', 'Tarefas', 'Equipe', 'Relatórios']
    return p
  }

  it('itens de menu do projeto entram no header/sidebar e na seção de conteúdo', () => {
    const p = withNav()
    const prompt = renderMasterPrompt(buildProjectSpec(p))
    expect(prompt).toContain('### Conteúdo do projeto')
    expect(prompt).toContain('Visão geral · Projetos · Tarefas · Equipe · Relatórios')
    const items = collectPromptItems(p)
    const nav = items.filter((i) => i.kind === 'header' || i.kind === 'sidebar')
    for (const item of nav) expect(item.structure.join('\n')).toContain('Visão geral, Projetos, Tarefas, Equipe, Relatórios')
  })

  it('sem itens de menu, gera pendência e não copia o menu de exemplo', () => {
    const p = load(BACKUPS.P1)
    p.meta.navItems = []
    expect(detectPending(p).some((x) => x.id === 'menu')).toBe(true)
    const header = collectPromptItems(p).find((i) => i.kind === 'header')
    const model = p.navigation.header ? headerById(p.navigation.header.id) : undefined
    if (header && model && model.look.nav.length) {
      const line = header.structure.find((l) => l.startsWith('Navegação principal'))!
      for (const n of model.look.nav) expect(line).not.toContain(`${n.label},`)
    }
  })

  it('importa backups antigos sem navItems', () => {
    const raw = JSON.parse(readFileSync(resolve(__dirname, '../..', BACKUPS.P2), 'utf8'))
    delete raw.project.meta.navItems
    const parsed = parseProjectFile(raw)
    expect(parsed.ok && parsed.project.meta.navItems).toEqual([])
  })
})

describe('P0 — tokens derivados (B-03)', () => {
  it('trocar a primária recalcula hover, active, foco, link e navegação ativa', () => {
    const p = createProject()
    const before = projectTokens(p)
    p.identity.overrides = { primary: '#C2185B' }
    const after = projectTokens(p)
    expect(after.primary.toLowerCase()).toBe('#c2185b')
    for (const k of ['primaryHover', 'primaryActive', 'focusRing', 'link'] as const) {
      expect(after[k], k).not.toBe(before[k])
    }
  })

  it('um token derivado editado explicitamente continua valendo', () => {
    const p = createProject()
    p.identity.overrides = { primary: '#C2185B', primaryHover: '#000000' }
    expect(projectTokens(p).primaryHover).toBe('#000000')
  })

  it('a descrição da paleta no prompt não cita a primária antiga', () => {
    const p = createProject()
    const old = projectTokens(p).primary
    p.identity.overrides = { primary: '#C2185B' }
    const palette = collectPromptItems(p).find((i) => i.kind === 'palette')!
    expect([palette.summary, ...palette.structure, ...palette.behavior].join('\n').toLowerCase()).not.toContain(old.toLowerCase())
  })
})

describe('P0 — padrões não revisados (B-04)', () => {
  it('identidade padrão é marcada como “padrão do Studio (não revisado)”', () => {
    const p = createProject()
    p.meta.name = 'Teste'
    const items = collectPromptItems(p)
    for (const k of ['palette', 'typography', 'geometry'] as const) expect(items.find((i) => i.kind === k)!.isDefault, k).toBe(true)
    const prompt = renderMasterPrompt(buildProjectSpec(p))
    expect(prompt).toContain('padrão do Studio — não revisado')
    expect(prompt).not.toContain('foram visualizadas e aprovadas pelo usuário')
  })

  it('identidade alterada deixa de ser padrão', () => {
    const p = createProject()
    p.identity.geometry = { ...p.identity.geometry, radius: 'pill' }
    p.identity.overrides = { primary: '#C2185B' }
    const items = collectPromptItems(p)
    expect(items.find((i) => i.kind === 'palette')!.isDefault).toBe(false)
    expect(items.find((i) => i.kind === 'geometry')!.isDefault).toBe(false)
  })

  it('pede revisão da identidade quando o esqueleto foi aprovado sem mexer nela', () => {
    const p = createProject()
    p.guided.skeletonApproved = true
    expect(detectPending(p).some((x) => x.id === 'identidade')).toBe(true)
  })
})
