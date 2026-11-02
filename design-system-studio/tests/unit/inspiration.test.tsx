import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { contrast, isHex } from '@/core/color'
import { useStudio } from '@/core/store'
import { FONT_OPTIONS } from '@/core/tokens'
import { inspirationSites, siteById } from '@/modules/inspiration/catalog'
import { describeInspiration } from '@/modules/inspiration/describe'
import { buildReferenceCss, buildSiteJson } from '@/modules/inspiration/exporters'
import { buildDemoHtml } from '@/modules/inspiration/exportHtml'
import { InspirationGallery } from '@/modules/inspiration/InspirationGallery'
import { applyOverrides, PALETTE_IDS, resolvePalette } from '@/modules/inspiration/palette'
import { SITE_COMPONENTS } from '@/modules/inspiration/sites/registry'
import { collectPromptItems, itemForTarget } from '@/prompt/items'
import { renderItemPrompt } from '@/prompt/text'

const COLOR_KEYS = ['bg', 'surface', 'text', 'muted', 'accent', 'onAccent', 'secondary'] as const
const FONT_IDS = FONT_OPTIONS.map((f) => f.id)

describe('catálogo de inspiração', () => {
  it('tem 20 sites com ids únicos', () => {
    expect(inspirationSites).toHaveLength(20)
    const ids = inspirationSites.map((s) => s.id)
    expect(new Set(ids).size).toBe(20)
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/))
    expect(siteById('verdant-atelier')?.brand).toBe('Verdant Atelier')
    expect(siteById('nao-existe')).toBeUndefined()
  })

  it('cada site tem exatamente as 8 paletas, com cores hex válidas e contraste legível', () => {
    for (const site of inspirationSites) {
      expect(site.palettes.map((p) => p.id)).toEqual(PALETTE_IDS)
      for (const p of site.palettes) {
        for (const key of COLOR_KEYS) expect(isHex(p[key]), `${site.id}/${p.id}/${key}=${p[key]}`).toBe(true)
        expect(contrast(p.text, p.bg), `${site.id}/${p.id} texto`).toBeGreaterThanOrEqual(4.5)
        expect(contrast(p.muted, p.bg), `${site.id}/${p.id} texto secundário`).toBeGreaterThanOrEqual(4.5)
        expect(contrast(p.onAccent, p.accent), `${site.id}/${p.id} destaque`).toBeGreaterThanOrEqual(3)
      }
    }
  })

  it('cada site tem spec completa, seções, fontes válidas e renderizador', () => {
    for (const site of inspirationSites) {
      expect(site.spec.summary.length).toBeGreaterThan(40)
      expect(site.spec.structure.length).toBeGreaterThanOrEqual(5)
      expect(site.spec.responsive.length).toBeGreaterThanOrEqual(5)
      site.spec.responsive.forEach((r) => expect(r.trim().length).toBeGreaterThan(10))
      expect(site.spec.behavior?.length ?? 0).toBeGreaterThan(0)
      expect(site.spec.notes?.some((n) => /não copiar/i.test(n))).toBe(true)
      expect(site.sections.length).toBeGreaterThanOrEqual(6)
      expect(site.composition.length).toBeGreaterThan(10)
      expect(FONT_IDS).toContain(site.headingFont)
      expect(FONT_IDS).toContain(site.bodyFont)
      expect(SITE_COMPONENTS[site.id], `renderizador de ${site.id}`).toBeTypeOf('function')
    }
  })
})

describe('paletas e descrição', () => {
  const site = inspirationSites[0]

  it('applyOverrides troca fundo, texto e destaque e recalcula cores dependentes', () => {
    const base = site.palettes[0]
    const out = applyOverrides(base, { bg: '#101010', text: '#FAFAFA', accent: '#ffcc00' })
    expect(out.bg).toBe('#101010')
    expect(out.text).toBe('#fafafa')
    expect(out.accent).toBe('#ffcc00')
    expect(out.onAccent).toBe('#111114')
    expect(contrast(out.muted, out.bg)).toBeGreaterThanOrEqual(4.5)
    expect(applyOverrides(base, {})).toBe(base)
    expect(applyOverrides(base, { bg: 'xyz' }).bg).toBe(base.bg)
  })

  it('describeInspiration aplica os overrides e descreve paleta, fontes, composição e seções', () => {
    const d = describeInspiration({ siteId: site.id, paletteId: 'escura', overrides: { accent: '#ff0000' } })!
    expect(d).not.toBeNull()
    expect(d.name).toBe(site.brand)
    expect(d.variant).toContain('Escura premium')
    expect(d.variant).toContain('ajustada')
    expect(d.colors?.destaque).toBe('#ff0000')
    expect(d.colors?.fundo).toBe(site.palettes.find((p) => p.id === 'escura')!.bg)
    expect(d.properties?.paleta).toBe('Escura premium')
    expect(d.properties?.composicao).toBe(site.composition)
    expect(String(d.properties?.fonteTitulos)).toBe('Fraunces')
    expect(d.structure.join(' ')).toContain(site.sections[2])
    expect(d.exceptions?.[0]).toContain('#ff0000')
    expect(d.responsive.length).toBeGreaterThan(0)
  })

  it('describeInspiration devolve null para conceito inexistente e usa a original para paleta inválida', () => {
    expect(describeInspiration({ siteId: 'nada', paletteId: 'original', overrides: {} })).toBeNull()
    const d = describeInspiration({ siteId: site.id, paletteId: 'inexistente', overrides: {} })!
    expect(d.variant).toBe('Original')
  })
})

describe('integração com o motor de prompts', () => {
  it('o conceito aprovado entra no Master Prompt e o prompt individual traz cores e seções', () => {
    const project = structuredClone(useStudio.getState().project)
    project.inspiration = { siteId: 'tide-resort', paletteId: 'arenito', overrides: { bg: '#fff8ee' } }
    const item = collectPromptItems(project).find((i) => i.kind === 'inspiration')!
    expect(item.name).toBe('TIDE RESORT')
    expect(item.colors.fundo).toBe('#fff8ee')
    const single = itemForTarget({ kind: 'inspiration', siteId: 'pixel-play', paletteId: 'escura', overrides: {} }, project)!
    const text = renderItemPrompt(single, project)
    expect(text).toContain('PIXEL PLAY')
    expect(text).toContain('Escura premium')
    expect(text).toContain('Ranking semanal')
  })
})

describe('exportações', () => {
  const site = siteById('volt-motors')!

  it('CSS de referência traz variáveis da paleta com ajustes e fontes', () => {
    const css = buildReferenceCss(site, { paletteId: 'minimalista', overrides: { bg: '#eeeeee' } })
    expect(css).toContain('--color-bg: #eeeeee;')
    expect(css).toContain('--font-heading:')
    expect(css).toContain('Space Grotesk')
    expect(css).toContain(':root {')
    expect(css.split('{').length).toBe(css.split('}').length)
  })

  it('JSON traz conceito, paleta final e ajustes, e é serializável', () => {
    const data = buildSiteJson(site, { paletteId: 'criativa', overrides: { text: '#ffffff' } })
    const parsed = JSON.parse(JSON.stringify(data))
    expect(parsed.conceito.marca).toBe('VOLT / MOTORS')
    expect(parsed.paleta.id).toBe('criativa')
    expect(parsed.paleta.final.text).toBe('#ffffff')
    expect(parsed.ajustes).toEqual({ text: '#ffffff' })
    expect(parsed.conceito.secoes.length).toBe(site.sections.length)
  })

  it('HTML demonstrativo é um documento completo com a marca', () => {
    for (const s of [site, siteById('verdant-atelier')!, siteById('pixel-play')!]) {
      const html = buildDemoHtml(s, resolvePalette(s, 'original'))
      expect(html.startsWith('<!doctype html>')).toBe(true)
      expect(html).toContain('<html lang="pt-BR">')
      expect(html).toContain('</html>')
      expect(html).toContain(s.brand)
      expect(html).toContain('.ia-site')
      expect(html).toContain('ia-demo-mobile')
    }
  })
})

describe('renderização dos sites', () => {
  it.each(inspirationSites.map((s) => [s.id]))('%s renderiza no desktop e no celular', (id) => {
    const site = siteById(id)!
    const Site = SITE_COMPONENTS[id]
    for (const device of ['desktop', 'mobile'] as const) {
      const palette = resolvePalette(site, device === 'desktop' ? 'original' : 'escura', device === 'mobile' ? { accent: '#3366ff' } : {})
      const { container, unmount } = render(<Site palette={palette} device={device} />)
      const root = container.querySelector('.ia-site') as HTMLElement
      expect(root).not.toBeNull()
      expect(root.textContent?.length ?? 0).toBeGreaterThan(400)
      unmount()
    }
  })
})

describe('galeria', () => {
  it('mostra os 20 conceitos, abre o visualizador e aprova o conceito no projeto', () => {
    useStudio.getState().setInspiration(null)
    render(<InspirationGallery />)
    for (const s of inspirationSites) expect(screen.getByTestId(`inspiration-option-${s.id}`)).toBeInTheDocument()

    fireEvent.click(within(screen.getByTestId('inspiration-option-crema-club')).getByRole('button', { name: /CREMA CLUB/ }))
    const viewer = screen.getByTestId('inspiration-viewer')
    fireEvent.click(within(viewer).getByTestId('inspiration-palette-natural'))
    fireEvent.click(within(viewer).getByTestId('inspiration-approve'))

    const approved = useStudio.getState().project.inspiration
    expect(approved).toEqual({ siteId: 'crema-club', paletteId: 'natural', overrides: {} })
    expect(within(viewer).getByTestId('inspiration-approved-state')).toBeInTheDocument()

    fireEvent.click(within(viewer).getByTestId('inspiration-unapprove'))
    expect(useStudio.getState().project.inspiration).toBeNull()
  })
})
