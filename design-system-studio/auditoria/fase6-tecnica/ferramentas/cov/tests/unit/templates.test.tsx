import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { isHex } from '@/core/color'
import { useStudio } from '@/core/store'
import { FONT_OPTIONS, fontName, RADIUS_VALUES } from '@/core/tokens'
import { categoryName, templateById, templates, TEMPLATE_CATEGORIES } from '@/modules/templates/catalog'
import { describeTemplate } from '@/modules/templates/describe'
import { buildTemplateHtml } from '@/modules/templates/exportHtml'
import { buildTemplateCss, buildTemplateSpec } from '@/modules/templates/exports'
import { SECTION_LIBRARY } from '@/modules/templates/sections'
import { SECTION_RENDERERS, TemplateRender } from '@/modules/templates/TemplateRender'
import { minimalOverrides, patchOverrides, resolveTemplateTheme } from '@/modules/templates/theme'
import TemplatesPage from '@/modules/templates/TemplatesPage'

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/
const fontIds = FONT_OPTIONS.map((f) => f.id)

describe('catálogo de templates', () => {
  it('tem exatamente 28 templates com ids únicos em kebab-case', () => {
    expect(templates).toHaveLength(28)
    const ids = templates.map((t) => t.id)
    expect(new Set(ids).size).toBe(28)
    for (const id of ids) expect(id).toMatch(KEBAB)
    expect(templateById('saas-gestao')?.name).toBe('SaaS de gestão')
    expect(templateById('nao-existe')).toBeUndefined()
    expect(templateById(null)).toBeUndefined()
  })

  it('usa de 6 a 10 categorias, todas com templates', () => {
    expect(TEMPLATE_CATEGORIES.length).toBeGreaterThanOrEqual(6)
    expect(TEMPLATE_CATEGORIES.length).toBeLessThanOrEqual(10)
    for (const c of TEMPLATE_CATEGORIES) expect(templates.some((t) => t.category === c.id)).toBe(true)
    for (const t of templates) expect(TEMPLATE_CATEGORIES.map((c) => c.id)).toContain(t.category)
  })

  it('tem cores hexadecimais, fontes e cantos válidos', () => {
    for (const t of templates) {
      for (const [key, value] of Object.entries(t.colors)) expect(isHex(value), `${t.id}.${key} = ${value}`).toBe(true)
      expect(fontIds, t.id).toContain(t.headingFont)
      expect(fontIds, t.id).toContain(t.bodyFont)
      expect(Object.keys(RADIUS_VALUES), t.id).toContain(t.radius)
      expect(t.brand.length).toBeGreaterThan(1)
      expect(t.description.length).toBeGreaterThan(20)
    }
  })

  it('tem pelo menos 4 seções por template, com ids únicos e tipos conhecidos', () => {
    for (const t of templates) {
      expect(t.sections.length, t.id).toBeGreaterThanOrEqual(4)
      const ids = t.sections.map((s) => s.id)
      expect(new Set(ids).size, t.id).toBe(ids.length)
      for (const s of t.sections) {
        expect(s.id).toMatch(KEBAB)
        expect(s.name.length).toBeGreaterThan(1)
        expect(s.description.length).toBeGreaterThan(5)
        expect(SECTION_LIBRARY[s.kind], `${t.id}/${s.id}`).toBeDefined()
        expect(SECTION_RENDERERS[s.kind], `${t.id}/${s.id}`).toBeTypeOf('function')
      }
    }
  })

  it('tem composições diferentes entre si', () => {
    const signatures = new Set(templates.map((t) => t.sections.map((s) => `${s.kind}:${s.variant ?? ''}`).join('|')))
    expect(signatures.size).toBe(28)
    const heroes = new Set(templates.map((t) => t.sections.find((s) => s.kind.startsWith('hero'))?.kind).filter(Boolean))
    expect(heroes.size).toBeGreaterThanOrEqual(8)
  })

  it('tem spec completa com responsividade concreta por seção', () => {
    for (const t of templates) {
      expect(t.spec.summary.length, t.id).toBeGreaterThan(30)
      expect(t.spec.structure.length, t.id).toBeGreaterThan(t.sections.length)
      expect(t.spec.responsive.length, t.id).toBeGreaterThan(0)
      for (const line of t.spec.responsive) expect(line.trim().length).toBeGreaterThan(0)
      for (const s of t.sections) {
        expect(t.spec.responsive.some((r) => r.startsWith(`${s.name}:`)), `${t.id}/${s.id}`).toBe(true)
        expect(t.spec.structure.some((r) => r.includes(s.name)), `${t.id}/${s.id}`).toBe(true)
      }
      expect(t.spec.behavior?.length ?? 0, t.id).toBeGreaterThan(0)
    }
  })
})

describe('personalizações', () => {
  const t = templates[0]

  it('mantém as personalizações mínimas (valores iguais ao padrão são descartados)', () => {
    expect(minimalOverrides(t, { primary: t.colors.primary, bodyFont: t.bodyFont, radius: t.radius })).toEqual({})
    expect(minimalOverrides(t, { primary: '#FF0000', bg: 'nada', headingFont: 'inexistente' })).toEqual({ primary: '#ff0000' })
    const once = patchOverrides(t, {}, 'radius', 'pill')
    expect(once).toEqual({ radius: 'pill' })
    expect(patchOverrides(t, once, 'radius', null)).toEqual({})
    expect(patchOverrides(t, once, 'radius', t.radius)).toEqual({})
  })

  it('deriva superfície e texto secundário quando o fundo muda', () => {
    const base = resolveTemplateTheme(t)
    const dark = resolveTemplateTheme(t, { bg: '#101014', text: '#f5f5f5' })
    expect(dark.dark).toBe(true)
    expect(dark.surface).not.toBe(base.surface)
    expect(dark.muted).not.toBe(base.muted)
    expect(resolveTemplateTheme(t, { radius: 'none' }).rLg).toBe(0)
  })
})

describe('describeTemplate', () => {
  it('devolve null para id desconhecido', () => {
    expect(describeTemplate({ id: 'nao-existe', overrides: {}, sections: [] })).toBeNull()
  })

  it('aplica as personalizações e lista as partes selecionadas na ordem do template', () => {
    const t = templateById('restaurante')!
    const d = describeTemplate({
      id: t.id,
      overrides: { primary: '#123456', headingFont: 'georgia', radius: 'pill', bg: t.colors.bg },
      sections: ['cardapio', 'hero'],
    })!
    expect(d.name).toContain(t.name)
    expect(d.variant).toBe(categoryName(t.category))
    expect(d.colors?.primaria).toBe('#123456')
    expect(d.colors?.fundo).toBe(t.colors.bg)
    expect(d.properties?.fonteTitulos).toBe(fontName('georgia'))
    expect(d.properties?.fonteTexto).toBe(fontName(t.bodyFont))
    expect(d.properties?.cantos).toBe(RADIUS_VALUES.pill.label)
    expect(d.properties?.partesSelecionadas).toBe('Abertura, Cardápio')
    expect(d.summary).toContain('Abertura, Cardápio')
    const starred = d.structure.filter((l) => l.startsWith('★'))
    expect(starred).toHaveLength(2)
    expect(starred[0]).toContain('Abertura')
    expect(starred[1]).toContain('Cardápio')
    // O fundo igual ao padrão não conta como exceção.
    expect(d.exceptions).toHaveLength(3)
    expect(d.exceptions?.join(' ')).toContain('#123456')
    expect(d.responsive.length).toBeGreaterThan(0)
  })

  it('sem partes selecionadas, descreve o template inteiro', () => {
    const d = describeTemplate({ id: 'saas-gestao', overrides: {}, sections: [] })!
    expect(d.structure.some((l) => l.startsWith('★'))).toBe(false)
    expect(d.properties?.partesSelecionadas).toContain('nenhuma')
    expect(d.exceptions).toEqual([])
  })
})

describe('renderização', () => {
  it.each(templates.map((t) => [t.id, t] as const))('%s renderiza no desktop e no celular', (_id, t) => {
    const theme = resolveTemplateTheme(t)
    for (const device of ['desktop', 'mobile'] as const) {
      const { container, unmount } = render(<TemplateRender template={t} theme={theme} device={device} />)
      const root = container.querySelector(`[data-template="${t.id}"]`)
      expect(root).not.toBeNull()
      expect(container.textContent).toContain(t.brand.split(' ')[0])
      expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
      unmount()
    }
  })

  it('marca partes clicáveis no modo editor', () => {
    const t = templateById('saas-gestao')!
    const toggled: string[] = []
    const { container } = render(<TemplateRender template={t} theme={resolveTemplateTheme(t)} device="desktop" selected={['hero']} onToggleSection={(id) => toggled.push(id)} />)
    const parts = container.querySelectorAll('[data-tpl-section]')
    expect(parts).toHaveLength(t.sections.length)
    expect(container.querySelector('[data-tpl-section="hero"]')?.getAttribute('data-selected')).toBe('true')
    fireEvent.click(container.querySelector('[data-tpl-section="precos"]')!)
    expect(toggled).toEqual(['precos'])
  })
})

describe('exportações', () => {
  it('HTML demonstrativo é um documento completo com o nome do template', () => {
    for (const t of [templateById('saas-gestao')!, templateById('dashboard-admin')!, templateById('documentacao')!]) {
      const html = buildTemplateHtml(t, { primary: '#ff0000' })
      expect(html.startsWith('<!doctype html>')).toBe(true)
      expect(html).toContain('<html lang="pt-BR">')
      expect(html).toContain('</html>')
      expect(html).toContain(t.name)
      expect(html).toContain('#ff0000')
      expect(html).toContain('tpl-desktop')
      expect(html).toContain('tpl-mobile')
      // ids de SVG únicos (desktop e celular na mesma árvore)
      const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1])
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('CSS traz variáveis com as personalizações e regras base', () => {
    const t = templateById('cafeteria')!
    const css = buildTemplateCss(t, { primary: '#00aa55', radius: 'none' }, ['cardapio'])
    expect(css).toContain('--color-primary: #00aa55;')
    expect(css).toContain('--radius-lg: 0px;')
    expect(css).toContain('--font-heading:')
    expect(css).toContain('.btn-primary')
    expect(css).toContain('★ 4. .section-cardapio')
    expect(css.split('{').length).toBe(css.split('}').length)
  })

  it('especificação JSON traz template, personalizações mínimas e partes marcadas', () => {
    const t = templateById('conferencia')!
    const spec = buildTemplateSpec(t, { primary: '#abcdef', text: t.colors.text }, ['agenda', 'hero'])
    expect(spec.schema).toBe('atelier-ui/template')
    expect(spec.template.id).toBe(t.id)
    expect(spec.overrides).toEqual({ primary: '#abcdef' })
    expect(spec.selectedSections).toEqual(['hero', 'agenda'])
    expect(spec.sections).toHaveLength(t.sections.length)
    expect(spec.final.colors.primary).toBe('#abcdef')
    expect(() => JSON.parse(JSON.stringify(spec))).not.toThrow()
  })
})

describe('página do Template Studio', () => {
  beforeEach(() => {
    act(() => useStudio.getState().resetProject())
  })

  it('mostra a galeria, abre o editor e adiciona o template ao projeto', () => {
    render(<TemplatesPage />)
    expect(screen.getByText(/Galeria de Inspiração/)).toBeInTheDocument()
    const card = screen.getByTestId('template-option-podcast')
    fireEvent.click(within(card).getByRole('button', { name: /Abrir o template Podcast/ }))
    const editor = screen.getByTestId('template-editor')
    fireEvent.click(within(editor).getByTestId('template-radius-none'))
    fireEvent.click(within(editor).getByTestId('template-part-episodios'))
    fireEvent.click(within(editor).getByTestId('template-use'))
    expect(useStudio.getState().project.template).toEqual({ id: 'podcast', overrides: { radius: 'none' }, sections: ['episodios'] })
    expect(within(editor).getByText('No projeto')).toBeInTheDocument()
    // Com o template no projeto, as alterações vão direto para a store.
    fireEvent.click(within(editor).getByTestId('template-part-hero'))
    expect(useStudio.getState().project.template?.sections).toEqual(['hero', 'episodios'])
    fireEvent.click(within(editor).getByTestId('template-remove'))
    expect(useStudio.getState().project.template).toBeNull()
  })

  it('filtra por categoria e por busca', () => {
    render(<TemplatesPage />)
    expect(screen.getAllByTestId(/^template-option-/)).toHaveLength(28)
    fireEvent.click(screen.getByRole('button', { name: /Sistemas e docs/ }))
    expect(screen.getAllByTestId(/^template-option-/)).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: /^Todos/ }))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar templates' }), { target: { value: 'cardapio' } })
    const ids = screen.getAllByTestId(/^template-option-/).map((el) => el.getAttribute('data-testid'))
    expect(ids).toEqual(expect.arrayContaining(['template-option-restaurante', 'template-option-cafeteria']))
  })
})
