import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createProject } from '@/core/project'
import { useStudio } from '@/core/store'
import { projectTheme } from '@/core/theme'
import { FONT_OPTIONS } from '@/core/tokens'
import { categoryById, componentCategories, familyById, resolveValues, visualFamilies } from '@/modules/components/catalog'
import { ComponentLibrary } from '@/modules/components/ComponentLibrary'
import { ComponentPreview } from '@/modules/components/ComponentPreview'
import { describeComponent } from '@/modules/components/describe'
import { ICON_LIBRARY, iconByName, searchIcons } from '@/modules/components/icons'
import { resolveLook } from '@/modules/components/look'
import { RENDERERS } from '@/modules/components/renderers'
import { COMPONENT_GROUPS, PARAM_GROUPS } from '@/modules/components/types'
import { itemForTarget } from '@/prompt/items'

const GROUP_RANGES: Record<string, [number, number]> = {
  fundamentos: [1, 7],
  campos: [8, 22],
  navegacao: [23, 34],
  dados: [35, 49],
  sobreposicoes: [50, 57],
  paginas: [58, 66],
}

const FAMILY_NAMES = [
  'Soft Pill', 'Swiss Minimal', 'Dark Luxury', 'Glassmorphism', 'Gradient Glow', 'Neo Brutalist', 'Soft Neumorphic', 'Apple Precision',
  'Bento Soft', 'Aurora', 'Industrial', 'Playful', 'Compact Pro', 'Midnight Gold', 'Retro Paper', 'Modern Material',
]

const theme = projectTheme(createProject())

function resetStore() {
  useStudio.setState({ project: createProject(), history: [] })
}

beforeEach(resetStore)
afterEach(cleanup)

describe('catálogo de componentes', () => {
  it('tem 66 categorias numeradas de 1 a 66, na ordem, com ids únicos', () => {
    expect(componentCategories).toHaveLength(66)
    componentCategories.forEach((c, i) => expect(c.number).toBe(i + 1))
    expect(new Set(componentCategories.map((c) => c.id)).size).toBe(66)
    for (const c of componentCategories) expect(c.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('distribui as categorias nos 6 grupos corretos', () => {
    expect(COMPONENT_GROUPS.map((g) => g.id)).toEqual(Object.keys(GROUP_RANGES))
    for (const c of componentCategories) {
      const [min, max] = GROUP_RANGES[c.group]
      expect(c.number, `${c.id} no grupo ${c.group}`).toBeGreaterThanOrEqual(min)
      expect(c.number, `${c.id} no grupo ${c.group}`).toBeLessThanOrEqual(max)
    }
  })

  it('mantém os nomes e os ids em português usados pelo motor de prompts', () => {
    const names: Record<number, string> = { 1: 'Tipografia', 8: 'Campos de busca', 22: 'Formulários', 23: 'Botões', 34: 'Drawers', 37: 'Tabelas', 41: 'Gráficos', 50: 'Modais', 57: 'Command palette', 58: 'Dashboard', 66: 'Pricing e planos' }
    for (const [n, name] of Object.entries(names)) expect(componentCategories[Number(n) - 1].name).toBe(name)
    for (const id of ['tabelas', 'modais', 'graficos', 'botoes', 'cards', 'formularios', 'calendarios', 'selects-dropdowns']) expect(categoryById(id), id).toBeDefined()
  })

  it('tem 16 famílias visuais com ids únicos, na ordem da especificação', () => {
    expect(visualFamilies.map((f) => f.name)).toEqual(FAMILY_NAMES)
    expect(new Set(visualFamilies.map((f) => f.id)).size).toBe(16)
    visualFamilies.forEach((f, i) => expect(f.number).toBe(i + 1))
    expect(familyById('swiss-minimal')?.name).toBe('Swiss Minimal')
  })

  it('famílias diferem de verdade (geometria, bordas, sombra, superfície, tipografia)', () => {
    const signatures = visualFamilies.map((f) => {
      const s = f.style
      return [s.radius, s.radiusCard, s.borderWidth, s.shadow, s.surface, s.headingFont, s.textCase, s.controlHeight, s.fill].join('|')
    })
    expect(new Set(signatures).size).toBe(16)
    const fontIds = FONT_OPTIONS.map((o) => o.id)
    for (const f of visualFamilies) {
      expect(fontIds).toContain(f.style.font)
      expect(fontIds).toContain(f.style.headingFont)
      expect(f.spec.responsive.length).toBeGreaterThan(0)
    }
  })

  it('toda categoria tem parâmetros contextuais válidos, spec completa e renderizador', () => {
    for (const c of componentCategories) {
      expect(c.params.length, c.id).toBeGreaterThanOrEqual(1)
      expect(new Set(c.params.map((p) => p.key)).size, `${c.id}: chaves únicas`).toBe(c.params.length)
      for (const p of c.params) {
        expect(PARAM_GROUPS).toContain(p.group)
        if (p.type === 'select') expect(p.options?.map((o) => o.value), `${c.id}.${p.key}`).toContain(p.default)
        if (p.type === 'number') expect(Number(p.default)).toBeGreaterThanOrEqual(p.min ?? -Infinity)
        if (p.type === 'icon') expect(ICON_LIBRARY.some((e) => e.name === p.default) || p.default === 'AlertTriangle', `${c.id}.${p.key}`).toBe(true)
      }
      expect(c.description.length).toBeGreaterThan(10)
      expect(c.spec.summary.length).toBeGreaterThan(10)
      expect(c.spec.structure.length).toBeGreaterThan(0)
      expect(c.spec.responsive.length, `${c.id}: responsive`).toBeGreaterThan(0)
      expect(c.spec.responsive.every((r) => r.trim().length > 0)).toBe(true)
      expect(RENDERERS[c.id], `${c.id}: renderizador`).toBeDefined()
    }
    expect(Object.keys(RENDERERS)).toHaveLength(66)
  })

  it('biblioteca de ícones tem ~150+ ícones e busca em português', () => {
    expect(ICON_LIBRARY.length).toBeGreaterThanOrEqual(150)
    expect(new Set(ICON_LIBRARY.map((e) => e.name)).size).toBe(ICON_LIBRARY.length)
    expect(searchIcons('carrinho').some((e) => e.name === 'ShoppingCart')).toBe(true)
    expect(iconByName('nao-existe')).toBeDefined()
  })
})

describe('look (paleta global × família)', () => {
  it('usa a paleta global por padrão e respeita exceções individuais', () => {
    const soft = resolveLook(theme, familyById('soft-pill')!)
    expect(soft.fill).toBe(theme.tokens.primary)
    const custom = { ...theme, tokens: { ...theme.tokens, primary: '#e11d48' } }
    expect(resolveLook(custom, familyById('soft-pill')!).fill).toBe('#e11d48')
    expect(resolveLook(theme, familyById('gradient-glow')!).fill).toContain('linear-gradient')
    expect(resolveLook(theme, familyById('dark-luxury')!).dark).toBe(true)
  })
})

describe('describeComponent', () => {
  it('descreve propriedades, família, estados e exceções individuais', () => {
    const d = describeComponent(
      {
        id: 'cmp_x',
        categoryId: 'botoes',
        familyId: 'neo-brutalist',
        label: 'Botão do checkout',
        props: { texto: 'Pagar agora', icone: 'CreditCard' },
        tokenOverrides: { primary: '#ff0055' },
        createdAt: new Date().toISOString(),
      },
      theme,
    )
    expect(d.name).toBe('Botão do checkout')
    expect(d.variant).toBe('Neo Brutalist')
    expect(d.properties?.['Texto do botão']).toBe('Pagar agora')
    expect(String(d.properties?.['Ícone'])).toContain('CreditCard')
    expect(d.properties?.['Raio dos controles']).toBeDefined()
    expect(d.exceptions?.join(' ')).toContain('#ff0055')
    expect(d.exceptions?.join(' ')).toContain('Cor primária')
    expect(d.behavior?.some((b) => b.startsWith('Focus-visible'))).toBe(true)
    expect(d.responsive.length).toBeGreaterThan(0)
  })

  it('funciona para todas as categorias e famílias sem exceções', () => {
    for (const c of componentCategories) {
      const f = visualFamilies[c.number % 16]
      const d = describeComponent({ id: 'x', categoryId: c.id, familyId: f.id, label: '', props: {}, tokenOverrides: {}, createdAt: '' }, theme)
      expect(d.name).toBe(c.name)
      expect(d.exceptions).toEqual([])
      expect(d.responsive.length).toBeGreaterThan(0)
    }
  })

  it('alimenta o prompt individual de um modelo (component-model)', () => {
    const item = itemForTarget({ kind: 'component-model', categoryId: 'tabelas', familyId: 'swiss-minimal' }, createProject())
    expect(item?.name).toBe('Tabelas')
    expect(item?.variant).toBe('Swiss Minimal')
    expect(item?.responsive.join(' ')).toMatch(/rolagem horizontal|cartões/)
  })
})

describe('renderizadores', () => {
  it('renderizam todas as categorias em 2 famílias sem erro', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    for (const c of componentCategories) {
      const families = [visualFamilies[(c.number * 2) % 16], visualFamilies[(c.number * 2 + 1) % 16]]
      for (const f of families) {
        const { container, unmount } = render(<ComponentPreview categoryId={c.id} familyId={f.id} theme={theme} />)
        expect(container.querySelector('.cmp-pv__error'), `${c.id} × ${f.id}`).toBeNull()
        expect(container.querySelector('.cmp-pv__inner')?.childElementCount, `${c.id} × ${f.id}`).toBeGreaterThan(0)
        unmount()
      }
    }
    expect(warn).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
    warn.mockRestore()
    error.mockRestore()
  })

  it('aplica a configuração da instância e permite edição por clique', () => {
    const onPart = vi.fn()
    const { container } = render(<ComponentPreview categoryId="botoes" familyId="soft-pill" theme={theme} props={{ texto: 'Comprar já' }} onPartClick={onPart} />)
    expect(container.textContent).toContain('Comprar já')
    const label = container.querySelector('[data-part="label"]') as HTMLElement
    fireEvent.click(label)
    expect(onPart).toHaveBeenCalledWith('label')
  })

  it('valores efetivos = padrões da categoria + instância', () => {
    const v = resolveValues(categoryById('botoes'), { texto: 'Oi' })
    expect(v.texto).toBe('Oi')
    expect(v.variante).toBe('primario')
  })
})

describe('store: instâncias independentes', () => {
  it('editar uma instância não altera outra', () => {
    const s = useStudio.getState()
    const a = s.addComponent('botoes', 'soft-pill')
    const b = s.addComponent('botoes', 'soft-pill')
    useStudio.getState().setComponentProp(a, 'texto', 'Só no A')
    useStudio.getState().setComponentTokenOverride(a, 'primary', '#123456')
    const dup = useStudio.getState().duplicateComponent(a)!
    useStudio.getState().setComponentProp(dup, 'texto', 'Só na cópia')
    useStudio.getState().updateComponent(b, { familyId: 'swiss-minimal' })
    const list = useStudio.getState().project.components
    const A = list.find((c) => c.id === a)!
    const B = list.find((c) => c.id === b)!
    const D = list.find((c) => c.id === dup)!
    expect(A.props.texto).toBe('Só no A')
    expect(A.familyId).toBe('soft-pill')
    expect(B.props.texto).toBeUndefined()
    expect(B.tokenOverrides).toEqual({})
    expect(B.familyId).toBe('swiss-minimal')
    expect(D.props.texto).toBe('Só na cópia')
    expect(D.tokenOverrides.primary).toBe('#123456')
  })
})

describe('biblioteca (UI)', () => {
  it('troca de categoria, mostra as 16 famílias e adiciona ao projeto abrindo o editor', () => {
    render(<ComponentLibrary />)
    act(() => {
      fireEvent.click(screen.getByTestId('component-category-tabelas'))
    })
    expect(screen.getByRole('heading', { level: 2, name: 'Tabelas' })).toBeInTheDocument()
    for (const f of visualFamilies) expect(screen.getByTestId(`family-option-${f.id}`)).toBeInTheDocument()
    act(() => {
      fireEvent.click(screen.getByTestId('add-component-swiss-minimal'))
    })
    const comps = useStudio.getState().project.components
    expect(comps).toHaveLength(1)
    expect(comps[0]).toMatchObject({ categoryId: 'tabelas', familyId: 'swiss-minimal' })
    expect(screen.getByTestId('component-editor')).toBeInTheDocument()
  })

  it('modo guiado começa pelas categorias essenciais', () => {
    render(<ComponentLibrary guided />)
    expect(screen.getByTestId('component-category-botoes')).toBeInTheDocument()
    expect(screen.queryByTestId('component-category-mega-menus')).toBeNull()
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Ver todas as 66 categorias/ }))
    })
    expect(screen.getByTestId('component-category-mega-menus')).toBeInTheDocument()
  })
})
