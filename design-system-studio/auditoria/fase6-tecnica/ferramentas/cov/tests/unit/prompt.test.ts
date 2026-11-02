import { beforeEach, describe, expect, it } from 'vitest'
import { createProject, type Project } from '@/core/project'
import { parseProjectFile } from '@/core/schema'
import { componentCategories, visualFamilies } from '@/modules/components/catalog'
import { landings, logins, signups } from '@/modules/entry/catalog'
import { desktopLayouts, mobileLayouts } from '@/modules/layouts/catalog'
import { headers, sidebars } from '@/modules/navigation/catalog'
import { buildProjectCss } from '@/prompt/css'
import { detectConflicts, detectPending } from '@/prompt/conflicts'
import { collectPromptItems, itemForTarget } from '@/prompt/items'
import { GLOBAL_RESPONSIVE_RULES, REFERENCE_WIDTHS } from '@/prompt/responsive'
import { buildProjectSpec } from '@/prompt/spec'
import { renderItemPrompt, renderMasterPrompt } from '@/prompt/text'
import { buildFixPrompt, buildRunnerConfig, parseReport } from '@/prompt/validation'

let project: Project

/** Projeto completo usando o primeiro item de cada catálogo. */
function fullProject(): Project {
  const p = createProject()
  p.meta = { ...p.meta, name: 'Agenda Viva', projectType: 'saas', objective: 'Organizar agendamentos', features: ['Agenda', 'Clientes'] }
  p.entry = { flow: 'landing-login', landingId: landings[0]?.id ?? null, loginId: logins[0]?.id ?? null, signupId: signups[0]?.id ?? null, landingUsesOriginalColors: false }
  p.layout = { desktopId: desktopLayouts[0]?.id ?? null, mobileId: mobileLayouts[0]?.id ?? null }
  p.navigation = { header: headers[0] ? { id: headers[0].id, variant: 1 } : null, sidebar: sidebars[0] ? { id: sidebars[0].id, variant: 0 } : null }
  if (componentCategories[0] && visualFamilies[0]) {
    p.components = [
      { id: 'cmp_a', categoryId: componentCategories[0].id, familyId: visualFamilies[0].id, label: 'Instância A', props: { label: 'Salvar' }, tokenOverrides: { primary: '#123456' }, createdAt: '' },
    ]
  }
  return p
}

beforeEach(() => {
  project = fullProject()
})

describe('Master Prompt', () => {
  it('inclui as seções A–G e o nome do projeto', () => {
    const text = renderMasterPrompt(buildProjectSpec(project))
    for (const h of ['## A. Informações do projeto', '## B. Arquitetura geral', '## C. Navegação', '## D. Identidade visual', '## E. Componentes', '## F. Responsividade', '## G. Regras de implementação']) {
      expect(text).toContain(h)
    }
    expect(text).toContain('Agenda Viva')
    expect(text).toContain('Agenda; Clientes')
  })

  it('inclui todas as decisões aprovadas', () => {
    const spec = buildProjectSpec(project)
    const text = renderMasterPrompt(spec)
    for (const item of spec.items.filter((i) => i.included)) expect(text, item.key).toContain(item.name)
  })

  it('inclui as larguras de referência e as regras gerais de responsividade', () => {
    const text = renderMasterPrompt(buildProjectSpec(project))
    expect(text).toContain(REFERENCE_WIDTHS.join(', '))
    for (const rule of GLOBAL_RESPONSIVE_RULES) expect(text).toContain(rule)
  })

  it('retira itens excluídos do texto, mas mantém no JSON com included=false', () => {
    project.prompt.excluded = ['identity.typography']
    const spec = buildProjectSpec(project)
    expect(spec.items.find((i) => i.key === 'identity.typography')?.included).toBe(false)
    expect(spec.identity.items.some((i) => i.key === 'identity.typography')).toBe(false)
  })

  it('registra observações do usuário como exceções', () => {
    project.prompt.notes['identity.palette'] = 'Usar o roxo só em botões'
    const item = collectPromptItems(project).find((i) => i.key === 'identity.palette')!
    expect(item.exceptions.join(' ')).toContain('Usar o roxo só em botões')
  })

  it('cada item registra identificador, tipo, origem e regras responsivas', () => {
    for (const item of collectPromptItems(project)) {
      expect(item.key).toBeTruthy()
      expect(item.kind).toBeTruthy()
      expect(item.source).toBeTruthy()
      expect(item.responsive.length, item.key).toBeGreaterThan(0)
    }
  })
})

describe('Especificação JSON', () => {
  it('é JSON válido, representa o projeto e pode ser reimportada', () => {
    const spec = buildProjectSpec(project)
    const roundtrip = JSON.parse(JSON.stringify(spec))
    expect(roundtrip.$schema).toBe('atelier-ui/spec@1')
    expect(roundtrip.source.layout.desktopId).toBe(project.layout.desktopId)
    const parsed = parseProjectFile(roundtrip)
    expect(parsed.ok).toBe(true)
    if (parsed.ok) expect(parsed.project.entry).toEqual(project.entry)
  })
  it('expõe tokens completos da identidade', () => {
    const spec = buildProjectSpec(project)
    expect(spec.identity.tokens.primary).toMatch(/^#/)
    expect(Object.keys(spec.identity.tokens).length).toBeGreaterThanOrEqual(32)
  })
})

describe('Prompts individuais', () => {
  it('são autossuficientes: identidade herdada + responsividade + regras', () => {
    const item = itemForTarget({ kind: 'palette', id: 'floresta' }, project)!
    const text = renderItemPrompt(item, project)
    expect(text).toContain('Floresta')
    expect(text).toContain('## Responsividade obrigatória')
    expect(text).toContain('## Regras de implementação')
  })
  it('funcionam para itens ainda não selecionados', () => {
    const p = createProject()
    const item = itemForTarget({ kind: 'palette', id: 'terracota' }, p)
    expect(item?.name).toBe('Terracota')
    if (desktopLayouts[1]) {
      const d = itemForTarget({ kind: 'desktop', id: desktopLayouts[1].id }, p)
      expect(d?.name).toBe(desktopLayouts[1].name)
      expect(p.layout.desktopId).toBeNull()
    }
  })
  it('incluem exceções individuais de componentes', () => {
    if (!project.components.length) return
    const item = itemForTarget({ kind: 'component', instanceId: 'cmp_a' }, project)!
    expect(item.exceptions.join(' ')).toMatch(/123456/)
  })
})

describe('Contradições e pendências', () => {
  it('lista pendências de um projeto vazio', () => {
    const ids = detectPending(createProject()).map((p) => p.id)
    expect(ids).toEqual(expect.arrayContaining(['tipo', 'nome', 'fluxo', 'desktop', 'mobile']))
  })
  it('detecta login escolhido em fluxo sem login e registra a decisão do usuário', () => {
    project.entry.flow = 'landing-only'
    project.entry.loginId = 'qualquer'
    let c = detectConflicts(project).find((x) => x.id === 'login-sem-fluxo')
    expect(c).toBeTruthy()
    expect(c!.resolution).toBeNull()
    project.prompt.conflictResolutions['login-sem-fluxo'] = 'fluxo'
    c = detectConflicts(project).find((x) => x.id === 'login-sem-fluxo')
    expect(c!.resolution?.id).toBe('fluxo')
    expect(renderMasterPrompt(buildProjectSpec(project))).toContain(c!.resolution!.instruction)
  })
  it('detecta header flutuante sobre layout com header integral', () => {
    const floating = headers.find((h) => h.floating)
    const layout = desktopLayouts.find((l) => l.regions.some((r) => r.kind === 'header' && !r.floating && !r.overlay))
    if (!floating || !layout) return
    project.navigation.header = { id: floating.id, variant: 0 }
    project.layout.desktopId = layout.id
    expect(detectConflicts(project).some((c) => c.id === 'header-flutuante-vs-integral')).toBe(true)
  })
})

describe('Exportações', () => {
  it('CSS de referência contém as variáveis dos tokens', () => {
    const css = buildProjectCss(project)
    expect(css).toContain('--color-primary:')
    expect(css).toContain('--radius-md:')
    expect(css).toContain('--font-heading:')
    expect((css.match(/{/g) ?? []).length).toBe((css.match(/}/g) ?? []).length)
  })
})

describe('Validação responsiva', () => {
  it('gera configuração sem segredos e prompt de correção a partir do relatório', () => {
    project.validation.config.url = 'https://staging.exemplo.com'
    const cfg = buildRunnerConfig(project)
    expect(JSON.stringify(cfg)).not.toMatch(/password|senha|cookie|token/i)
    const parsed = parseReport({
      tool: 't',
      generatedAt: new Date().toISOString(),
      baseUrl: 'https://staging.exemplo.com',
      widths: [360],
      pages: ['/'],
      issues: [{ page: '/', width: 360, type: 'overflow-horizontal', severity: 'alta', element: 'div.hero', description: 'x', suggestion: 'y' }],
    })
    expect(parsed.ok).toBe(true)
    if (parsed.ok) {
      const text = buildFixPrompt(parsed.report, project)
      expect(text).toContain('overflow-horizontal')
      expect(text).toContain('div.hero')
    }
  })
  it('rejeita relatórios malformados', () => {
    expect(parseReport({ issues: 'x' }).ok).toBe(false)
  })
})
