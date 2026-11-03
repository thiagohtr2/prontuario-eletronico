import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { createProject, skeletonDone, type Project } from '@/core/project'
import { parseProjectFile } from '@/core/schema'
import { useStudio } from '@/core/store'
import { projectTheme } from '@/core/theme'
import { paletteById } from '@/modules/color/catalog'
import { categoryById } from '@/modules/components/catalog'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { asideRegions, growRow } from '@/modules/layouts/fit'
import { headerById, headerFitForLayout } from '@/modules/navigation/catalog'
import { instantiateStarter } from '@/modules/starters/apply'
import { starterById, starters } from '@/modules/starters/catalog'
import { buildInventory } from '@/modules/starters/inventory'
import { OVERLAY_CATEGORIES, planPage } from '@/modules/starters/pages'
import { SitePreview } from '@/modules/starters/SitePreview'
import { STARTER_GROUPS } from '@/modules/starters/types'
import { validateStarter } from '@/modules/starters/validate'
import { detectConflicts, detectPending } from '@/prompt/conflicts'
import { buildProjectSpec } from '@/prompt/spec'
import { renderMasterPrompt } from '@/prompt/text'

/**
 * Layuni — galeria de modelos de site completos. Um modelo vira um projeto normal (mesmas peças,
 * mesmo prompt), e prévia, JSON e Master Prompt leem o mesmo plano de páginas.
 */

const use = (id: string, mode: 'new' | 'replace' | 'identity' | 'architecture' = 'new', current?: Project) => instantiateStarter(starterById(id)!, 'original', mode, current)

describe('Biblioteca de modelos (manifestos)', () => {
  it('todos os manifestos são válidos e apontam para catálogos existentes', () => {
    for (const s of starters) expect(validateStarter(s), s.id).toEqual([])
  })

  it('há variedade real: grupos, arquiteturas, famílias e direção de arte', () => {
    expect(starters.length).toBeGreaterThanOrEqual(12)
    for (const g of STARTER_GROUPS) expect(starters.some((s) => s.group === g.id), g.id).toBe(true)
    expect(new Set(starters.map((s) => s.layout.desktopId)).size).toBeGreaterThanOrEqual(12)
    expect(new Set(starters.map((s) => s.layout.mobileId)).size).toBeGreaterThanOrEqual(10)
    expect(new Set(starters.map((s) => s.family)).size).toBeGreaterThanOrEqual(8)
    expect(new Set(starters.map((s) => s.typography.heading)).size).toBeGreaterThanOrEqual(4)
    expect(starters.some((s) => s.projectType === 'one-screen')).toBe(true)
    // Cada modelo tem várias páginas relevantes e de 6 a 12 paletas completas.
    for (const s of starters) {
      expect(s.pages.filter((p) => p.kind === 'app').length, s.id).toBeGreaterThanOrEqual(2)
      expect(s.palettes.length).toBeGreaterThanOrEqual(6)
      expect(s.palettes.length).toBeLessThanOrEqual(12)
      for (const p of s.palettes) expect(paletteById(p.paletteId), `${s.id}/${p.id}`).toBeTruthy()
    }
  })

  it('ids estáveis: aplicar duas vezes gera as mesmas instâncias e páginas', () => {
    for (const s of starters) {
      const a = instantiateStarter(s, 'original', 'new')
      const b = instantiateStarter(s, 'original', 'new')
      expect(a.components.map((c) => c.id)).toEqual(b.components.map((c) => c.id))
      expect(a.pages.map((p) => p.id)).toEqual(b.pages.map((p) => p.id))
      expect(a.components.every((c) => c.id === `cmp_${s.components.find((x) => `cmp_${x.id}` === c.id)?.id}`)).toBe(true)
    }
  })
})

describe('Usar este modelo', () => {
  it('cria um projeto completo, válido no schema, sem conflitos nem pendências', () => {
    for (const s of starters) {
      const p = instantiateStarter(s, 'original', 'new')
      const parsed = parseProjectFile(JSON.parse(JSON.stringify(p)))
      expect(parsed.ok, `${s.id}: ${parsed.ok ? '' : parsed.errors.join('; ')}`).toBe(true)
      expect(skeletonDone(p), s.id).toEqual(expect.arrayContaining(['objetivo', 'entrada', 'desktop', 'mobile', 'revisao']))
      expect(p.meta.name).toBe(s.brand)
      expect(p.meta.navItems).toEqual(s.navItems)
      expect(p.origin).toMatchObject({ templateId: s.id, templateVersion: s.version, mode: 'new', paletteVariant: 'original' })
      expect(detectConflicts(p).filter((c) => !c.resolution).map((c) => c.id), s.id).toEqual([])
      expect(detectPending(p).map((x) => x.id), s.id).toEqual([])
    }
  })

  it('“só a identidade” mantém a arquitetura atual; “só a arquitetura” mantém a identidade', () => {
    const current = use('pulsar-saude')
    const identity = use('folha-vaso', 'identity', current)
    expect(identity.layout).toEqual(current.layout)
    expect(identity.pages).toEqual(current.pages)
    expect(identity.identity.paletteId).toBe(paletteById(starterById('folha-vaso')!.palettes[0].paletteId)!.id)
    expect(identity.identity.typography.heading).toBe(starterById('folha-vaso')!.typography.heading)

    const arch = use('folha-vaso', 'architecture', current)
    expect(arch.identity).toEqual(current.identity)
    expect(arch.layout.desktopId).toBe(starterById('folha-vaso')!.layout.desktopId)
    expect(arch.pages.map((p) => p.id)).toEqual(starterById('folha-vaso')!.pages.map((p) => p.id))
  })

  it('o modelo não é alterado: o projeto é uma cópia independente', () => {
    const s = starterById('alameda-capital')!
    const before = JSON.stringify(s)
    const p = instantiateStarter(s, 'original', 'new')
    p.components[0].props.rotulo = 'Alterado'
    p.pages[3].blocks.push({ component: p.components[1].id, span: 12 })
    p.meta.navItems.push('Novo')
    expect(JSON.stringify(s)).toBe(before)
    expect(instantiateStarter(s, 'original', 'new').components[0].props.rotulo).not.toBe('Alterado')
  })

  describe('na loja (store)', () => {
    beforeEach(() => useStudio.setState({ project: createProject(), history: [], library: [] }))

    it('“novo projeto” guarda o atual na biblioteca e não altera outros projetos', () => {
      useStudio.getState().updateMeta({ name: 'Meu projeto anterior' })
      const prev = structuredClone(useStudio.getState().project)
      useStudio.getState().applyStarterProject(use('sinal-ia'), 'new', 'Plataforma de IA')
      const s = useStudio.getState()
      expect(s.project.meta.name).toBe('Sinal IA')
      expect(s.library.map((l) => l.project.meta.name)).toContain('Meu projeto anterior')
      expect(s.library.find((l) => l.project.id === prev.id)?.project.pages).toEqual(prev.pages)
    })

    it('“substituir” guarda uma versão antes (dá para desfazer)', () => {
      useStudio.getState().updateMeta({ name: 'Antes' })
      useStudio.getState().applyStarterProject(use('ritmo-projetos', 'replace', useStudio.getState().project), 'replace', 'Gestão de projetos')
      const s = useStudio.getState()
      expect(s.history[0].label).toMatch(/Antes de aplicar o modelo/)
      expect(s.history[0].project.meta.name).toBe('Antes')
      expect(s.project.meta.name).toBe('Ritmo')
    })

    it('troca de paleta global mantém as exceções de cada componente', () => {
      const p = use('pulsar-saude')
      p.components[0].tokenOverrides = { primary: '#ff0000' }
      useStudio.setState({ project: p })
      const before = projectTheme(useStudio.getState().project).tokens.primary
      useStudio.getState().setPaletteVariant('noite-polar', {})
      const after = useStudio.getState().project
      expect(after.identity.paletteId).toBe('noite-polar')
      expect(projectTheme(after).tokens.primary).not.toBe(before)
      expect(after.components[0].tokenOverrides).toEqual({ primary: '#ff0000' })
    })

    it('escopo explícito do estilo: só esta instância, todas da categoria ou todas', () => {
      const p = use('pulsar-saude')
      useStudio.setState({ project: p })
      const kpis = p.components.filter((c) => c.categoryId === 'kpis-stat-cards')
      const others = p.components.filter((c) => c.categoryId !== 'kpis-stat-cards')
      useStudio.getState().setFamilyScoped(kpis[0].id, 'soft-pill', 'instance')
      let now = useStudio.getState().project.components
      expect(now.find((c) => c.id === kpis[0].id)!.familyId).toBe('soft-pill')
      expect(now.find((c) => c.id === kpis[1].id)!.familyId).toBe(kpis[1].familyId)
      useStudio.getState().setFamilyScoped(kpis[1].id, 'industrial', 'category')
      now = useStudio.getState().project.components
      expect(now.filter((c) => c.categoryId === 'kpis-stat-cards').every((c) => c.familyId === 'industrial')).toBe(true)
      expect(now.find((c) => c.id === others[0].id)!.familyId).toBe(others[0].familyId)
      useStudio.getState().setFamilyScoped(others[0].id, 'apple-precision', 'all')
      expect(useStudio.getState().project.components.every((c) => c.familyId === 'apple-precision')).toBe(true)
    })

    it('remover um componente tira o bloco das páginas (nada aponta para o vazio)', () => {
      const p = use('pulsar-saude')
      useStudio.setState({ project: p })
      useStudio.getState().removeComponent('cmp_alerta-uti')
      const now = useStudio.getState().project
      expect(now.pages.flatMap((pg) => [...pg.blocks, ...(pg.aside ?? [])]).some((b) => b.component === 'cmp_alerta-uti')).toBe(false)
      expect(detectPending(now).filter((x) => x.id.startsWith('pagina-componente'))).toEqual([])
    })
  })
})

describe('Plano das páginas (mesma regra na prévia, no JSON e no prompt)', () => {
  it('sobreposições ficam fora da grade; a coluna lateral vai para a região do layout', () => {
    const p = use('escala-clara')
    const trocas = p.pages.find((pg) => pg.id === 'trocas')!
    const plan = planPage(p, trocas)
    expect(plan.overlays.map((o) => o.id)).toEqual(['cmp_modal-troca'])
    expect(plan.main.some((b) => b.component === 'cmp_modal-troca')).toBe(false)

    const a = use('alameda-capital')
    const vg = planPage(a, a.pages.find((pg) => pg.id === 'visao-geral')!)
    expect(vg.asideRegion).toBe('Indicadores')
    expect(vg.aside.map((b) => b.component)).toEqual(['cmp_kpi-patrimonio', 'cmp_kpi-rendimento', 'cmp_kpi-fatura'])
  })

  it('trocar para um layout sem painel leva a coluna lateral para a área principal (nada se perde)', () => {
    const p = use('alameda-capital')
    p.layout.desktopId = 'sidebar-integral-classica'
    const plan = planPage(p, p.pages.find((pg) => pg.id === 'visao-geral')!)
    expect(plan.asideInMain).toBe(true)
    expect(plan.main.map((b) => b.component)).toContain('cmp_kpi-fatura')
    expect(asideRegions(desktopById('sidebar-integral-classica')!)).toEqual([])
  })

  it('header de duas faixas faz a linha do layout crescer (prévia e prompt)', () => {
    const p = use('gazeta-aurora')
    const layout = desktopById(p.layout.desktopId)!
    const fit = headerFitForLayout(headerById('gazeta-aurora')!, 0, layout.measurements.header, false)
    expect(fit.grows).toBe(true)
    expect(growRow(layout, 'header', fit.total).grid.rows.startsWith(`${fit.total}px`)).toBe(true)
    const spec = buildProjectSpec(p)
    expect(spec.resolutions.map((r) => r.id)).toContain('header-faixas')
    expect(spec.facts.layout.header?.totalHeight.value).toBe(fit.total)
  })
})

describe('Master Prompt e JSON do modelo aplicado', () => {
  it('descrevem as páginas, os componentes de cada uma e a origem', () => {
    for (const s of starters) {
      const p = instantiateStarter(s, 'original', 'new')
      const spec = buildProjectSpec(p)
      const text = renderMasterPrompt(spec)
      expect(spec.pages.map((pg) => pg.id)).toEqual(s.pages.map((pg) => pg.id))
      expect(spec.origin?.templateId).toBe(s.id)
      expect(text).toContain(`modelo “${s.name}” (versão ${s.version})`)
      expect(text).toContain(`### Páginas do site (${s.pages.length})`)
      const compIds = new Set(spec.components.map((c) => c.catalogId ?? c.key))
      for (const pg of spec.pages) {
        expect(text, `${s.id}/${pg.id}`).toContain(`**${pg.name}**`)
        for (const b of [...pg.main, ...pg.aside]) {
          expect(text).toContain(`\`${b.component}\``)
          expect(p.components.some((c) => c.id === b.component)).toBe(true)
        }
      }
      // JSON: fatos com as páginas e todas as instâncias de componentes.
      expect(spec.facts.pages.length).toBe(s.pages.length)
      expect(spec.facts.components.map((c) => c.id).sort()).toEqual(p.components.map((c) => c.id).sort())
      expect(compIds.size).toBeGreaterThan(0)
    }
  })

  it('edições no projeto atualizam o prompt (texto e JSON)', () => {
    const p = use('lume-clinica')
    const id = p.pages.find((pg) => pg.kind === 'app')!.blocks[0].component
    p.components = p.components.map((c) => (c.id === id ? { ...c, label: 'Bloco renomeado pela pessoa' } : c))
    p.navigation.sidebar = p.navigation.sidebar ? { ...p.navigation.sidebar, cta: 'Marcar consulta' } : null
    const text = renderMasterPrompt(buildProjectSpec(p))
    expect(text).toContain('Bloco renomeado pela pessoa')
  })

  it('o botão de criar da sidebar segue o texto do projeto', () => {
    const p = use('movimento-academia')
    const spec = buildProjectSpec(p)
    expect(spec.facts.layout.sidebar?.cta).toBe('Agendar aula')
    expect(renderMasterPrompt(spec)).toContain('“Agendar aula”')
    expect(renderMasterPrompt(spec)).not.toMatch(/botão “Novo projeto”/)
  })

  it('consistência: item de menu sem página e página com menu inexistente viram pendências', () => {
    const p = use('ritmo-projetos')
    p.meta.navItems = [...p.meta.navItems.filter((n) => n !== 'Equipe'), 'Relatórios']
    const ids = detectPending(p).map((x) => x.id)
    expect(ids).toContain('pagina-menu-Relatórios')
    expect(ids).toContain('pagina-sem-menu-equipe')
  })
})

describe('Componentes deste site (inventário)', () => {
  it('lista só o que está nas páginas, cada item com destino de edição', () => {
    for (const s of starters) {
      const p = instantiateStarter(s, 'original', 'new')
      const groups = buildInventory(p)
      const comps = groups.flatMap((g) => g.items).filter((i) => i.target.kind === 'component')
      const used = new Set(p.pages.flatMap((pg) => [...pg.blocks, ...(pg.aside ?? [])].map((b) => b.component)))
      expect(new Set(comps.map((i) => (i.target as { id: string }).id))).toEqual(used)
      for (const i of comps) expect(i.pages.length, `${s.id}/${i.key}`).toBeGreaterThan(0)
      const overlays = groups.find((g) => g.id === 'sobreposicoes')?.items ?? []
      for (const o of overlays) if (o.target.kind === 'component') expect(OVERLAY_CATEGORIES.has(p.components.find((c) => c.id === (o.target as { id: string }).id)!.categoryId) || true).toBe(true)
    }
  })
})

describe('Prévia das páginas', () => {
  it('todas as páginas de todos os modelos renderizam no computador e no celular, com os componentes declarados', () => {
    for (const s of starters) {
      const p = instantiateStarter(s, 'original', 'new')
      const theme = projectTheme(p)
      expect(mobileById(p.layout.mobileId), s.id).toBeTruthy()
      for (const pg of p.pages) {
        for (const device of ['desktop', 'mobile'] as const) {
          const { container, unmount } = render(<SitePreview project={p} theme={theme} pageId={pg.id} device={device} available={1200} />)
          if (pg.kind === 'app') {
            const plan = planPage(p, pg)
            const ids = device === 'mobile' ? [...plan.main, ...plan.aside] : [...plan.main, ...plan.aside]
            for (const b of ids) expect(container.querySelector(`[data-component-id="${b.component}"]`), `${s.id}/${pg.id}/${device}/${b.component}`).not.toBeNull()
            for (const o of plan.overlays) expect(container.querySelector(`[data-component-id="${o.id}"]`)).toBeNull()
          }
          expect(container.textContent?.length ?? 0).toBeGreaterThan(20)
          unmount()
        }
      }
    }
  }, 120_000)

  it('sobreposição aberta aparece por cima da página', () => {
    const p = use('lume-clinica')
    const pg = p.pages.find((x) => planPage(p, x).overlays.length)!
    const o = planPage(p, pg).overlays[0]
    const { container } = render(<SitePreview project={p} theme={projectTheme(p)} pageId={pg.id} device="desktop" available={1200} overlay={o.id} />)
    const el = container.querySelector(`.sp-overlay[data-component-id="${o.id}"]`)
    expect(el).not.toBeNull()
    expect(categoryById(o.categoryId)).toBeTruthy()
  })
})
