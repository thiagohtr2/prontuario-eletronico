import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createProject } from '@/core/project'
import { useStudio } from '@/core/store'
import { projectTheme } from '@/core/theme'
import { headerById, headerLookFor, headers, sidebarById, sidebarLookFor, sidebars } from '@/modules/navigation/catalog'
import { HeaderPreview, NavigationShowcase, SidebarPreview } from '@/modules/navigation'
import { HEADER_FILTERS, SIDEBAR_FILTERS } from '@/modules/navigation/types'
import { detectConflicts } from '@/prompt/conflicts'
import { collectPromptItems, itemForTarget } from '@/prompt/items'

const theme = projectTheme(createProject())

function resetStore() {
  useStudio.setState({ project: createProject(), history: [] })
}

beforeEach(resetStore)
afterEach(cleanup)

const HEADER_FILTER_IDS = HEADER_FILTERS.map((f) => f.id).filter((id) => id !== 'todos')
const SIDEBAR_FILTER_IDS = SIDEBAR_FILTERS.map((f) => f.id).filter((id) => id !== 'todos')

describe('catálogo de navegação', () => {
  it('tem 36 headers e 36 sidebars com ids únicos em kebab-case', () => {
    expect(headers).toHaveLength(36)
    expect(sidebars).toHaveLength(36)
    for (const list of [headers, sidebars]) {
      const ids = list.map((m) => m.id)
      expect(new Set(ids).size).toBe(ids.length)
      for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      const names = list.map((m) => m.name)
      expect(new Set(names).size).toBe(names.length)
    }
  })

  it('cada modelo tem exatamente 2 composições, com nome e descrição', () => {
    for (const m of [...headers, ...sidebars]) {
      expect(m.compositions).toHaveLength(2)
      for (const c of m.compositions) {
        expect(c.name.trim().length).toBeGreaterThan(3)
        expect(c.description.trim().length).toBeGreaterThan(20)
      }
      expect(m.compositions[0].name).not.toBe(m.compositions[1].name)
    }
  })

  it('as duas composições são arranjos realmente diferentes (não só cor)', () => {
    for (const h of headers) {
      const [a, b] = h.compositions
      const differs = a.layout !== b.layout || JSON.stringify(a.patch ?? {}) !== JSON.stringify(b.patch ?? {})
      expect(differs, h.id).toBe(true)
    }
    for (const s of sidebars) {
      const [a, b] = s.compositions.map((c) => c.arrangement)
      expect(JSON.stringify(a), s.id).not.toBe(JSON.stringify(b))
      const structural = a.top !== b.top || a.footer !== b.footer || a.body !== b.body || a.labels !== b.labels || a.submenu !== b.submenu || a.expand !== b.expand || a.cards !== b.cards
      expect(structural, s.id).toBe(true)
    }
  })

  it('usa somente ids de filtro válidos', () => {
    for (const h of headers) {
      expect(h.filters.length).toBeGreaterThan(0)
      for (const f of h.filters) expect(HEADER_FILTER_IDS, `${h.id}: ${f}`).toContain(f)
    }
    for (const s of sidebars) {
      expect(s.filters.length).toBeGreaterThan(0)
      for (const f of s.filters) expect(SIDEBAR_FILTER_IDS, `${s.id}: ${f}`).toContain(f)
    }
  })

  it('todo filtro (exceto “todos”) tem pelo menos um modelo', () => {
    for (const f of HEADER_FILTER_IDS) expect(headers.some((h) => h.filters.includes(f)), f).toBe(true)
    for (const f of SIDEBAR_FILTER_IDS) expect(sidebars.some((s) => s.filters.includes(f)), f).toBe(true)
  })

  it('specs são completas e com responsividade não vazia', () => {
    for (const m of [...headers, ...sidebars]) {
      expect(m.description.length).toBeGreaterThan(20)
      expect(m.spec.summary.length).toBeGreaterThan(20)
      expect(m.spec.structure.length).toBeGreaterThan(3)
      expect(m.spec.behavior?.length ?? 0).toBeGreaterThan(1)
      expect(m.spec.responsive.length).toBeGreaterThan(3)
      for (const r of m.spec.responsive) expect(r.trim().length).toBeGreaterThan(10)
      expect(Object.keys(m.spec.measurements ?? {}).length).toBeGreaterThan(3)
    }
  })

  it('flags de flutuante/fixo/formato são coerentes com a receita visual', () => {
    for (const h of headers) {
      const shapes = [h.look.shape, ...h.compositions.map((c) => c.patch?.shape ?? h.look.shape)]
      if (h.floating) expect(shapes.some((s) => s === 'floating' || s === 'islands'), h.id).toBe(true)
      else expect(shapes.every((s) => s !== 'floating' && s !== 'islands'), h.id).toBe(true)
      if (h.filters.includes('flutuantes')) expect(h.floating, h.id).toBe(true)
      if (h.filters.includes('fixos')) expect(h.sticky, h.id).toBe(true)
      if (h.filters.includes('mega-menu')) expect(h.look.nav.some((n) => n.menu === 'mega'), h.id).toBe(true)
      if (h.filters.includes('com-busca')) expect(Boolean(h.look.search), h.id).toBe(true)
    }
    for (const s of sidebars) {
      expect(s.width).toBeGreaterThan(40)
      expect(s.floating, s.id).toBe(s.shape === 'flutuante')
      if (s.filters.includes('flutuantes')) expect(s.floating, s.id).toBe(true)
      if (s.shape === 'rail') expect(s.width, s.id).toBeLessThanOrEqual(96)
      if (s.shape === 'dupla') expect(s.look.panel?.length, s.id).toBeGreaterThan(0)
      if (s.shape === 'contextual') expect(s.look.sections?.length ?? 0, s.id).toBeGreaterThan(1)
      const all = [...s.look.groups, ...(s.look.panel ?? [])].flatMap((g) => g.items)
      if (s.filters.includes('com-submenu')) expect(all.some((i) => i.children?.length), s.id).toBe(true)
    }
  })

  it('cobre as formas de sidebar pedidas', () => {
    const shapes = new Set(sidebars.map((s) => s.shape))
    for (const shape of ['integral', 'flutuante', 'rail', 'dupla', 'expansivel', 'contextual']) expect(shapes.has(shape as never), shape).toBe(true)
    const layouts = new Set(headers.flatMap((h) => h.compositions.map((c) => c.layout)))
    expect(layouts.size).toBeGreaterThanOrEqual(10)
  })

  it('headerById/sidebarById e receitas por composição', () => {
    expect(headerById('ilha-flutuante')?.name).toBe('Ilha Flutuante')
    expect(sidebarById('classica-integral')?.shape).toBe('integral')
    expect(headerById(null)).toBeUndefined()
    const h = headerById('ilha-flutuante')!
    expect(headerLookFor(h, 1).maxWidth).toBe(760)
    const s = sidebarById('acordeao-secoes')!
    expect(sidebarLookFor(s, 1).itemStyle).toBe('pill')
  })
})

describe('integração com o motor de prompts', () => {
  it('gera item de prompt com a composição escolhida', () => {
    const project = createProject()
    const item = itemForTarget({ kind: 'header', id: 'mega-emporio', variant: 1 }, project)
    expect(item?.name).toBe('Mega Empório')
    expect(item?.variant).toBe('Departamentos ao lado do logo')
    expect(item?.responsive.length).toBeGreaterThan(3)
    const side = itemForTarget({ kind: 'sidebar', id: 'dupla-camada', variant: 0 }, project)
    expect(side?.properties.formato).toBe('dupla')
  })

  it('seleção entra no Master Prompt', () => {
    act(() => useStudio.getState().selectHeader({ id: 'linha-essencial', variant: 0 }))
    const items = collectPromptItems(useStudio.getState().project)
    expect(items.find((i) => i.key === 'navigation.header')?.included).toBe(true)
    expect(Array.isArray(detectConflicts(useStudio.getState().project))).toBe(true)
  })
})

describe('HeaderPreview', () => {
  it.each([0, 1] as const)('renderiza todos os headers na composição %s (desktop e celular)', (variant) => {
    for (const h of headers) {
      const { unmount, container } = render(<HeaderPreview model={h} variant={variant} theme={theme} compact={false} />)
      expect(container.querySelector('.nvs-h')).not.toBeNull()
      expect(screen.getAllByRole('button', { name: new RegExp(h.look.brand.slice(0, 4), 'i') }).length).toBeGreaterThan(0)
      unmount()
      const mobile = render(<HeaderPreview model={h} variant={variant} theme={theme} compact />)
      expect(mobile.container.querySelector('[data-compact="true"]')).not.toBeNull()
      mobile.unmount()
    }
  })

  it('abre menu suspenso, marca item ativo e fecha com Esc', () => {
    const h = headerById('ilha-flutuante')!
    const navigated: string[] = []
    render(<HeaderPreview model={h} variant={0} theme={theme} compact={false} onNavigate={(l) => navigated.push(l)} />)
    const trigger = screen.getByRole('button', { name: /Produto/ })
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const menu = screen.getByRole('menu', { name: 'Produto' })
    fireEvent.click(within(menu).getByRole('menuitem', { name: 'Automação' }))
    expect(screen.queryByRole('menu', { name: 'Produto' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Preços' }))
    expect(screen.getByRole('button', { name: 'Preços' })).toHaveAttribute('aria-current', 'page')
    expect(navigated).toContain('Preços')
    fireEvent.click(trigger)
    expect(screen.getByRole('menu', { name: 'Produto' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('menu', { name: 'Produto' })).toBeNull()
  })

  it('perfil, notificações e menu do celular', () => {
    const h = headerById('painel-trabalho')!
    const { rerender } = render(<HeaderPreview model={h} variant={0} theme={theme} compact={false} />)
    fireEvent.click(screen.getByRole('button', { name: /Notificações/ }))
    expect(screen.getByRole('dialog', { name: 'Notificações' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /menu do perfil/ }))
    expect(screen.getByRole('menu', { name: 'Menu do perfil' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Notificações' })).toBeNull()
    rerender(<HeaderPreview model={h} variant={0} theme={theme} compact />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    expect(screen.getByRole('dialog', { name: 'Menu de navegação' })).toBeInTheDocument()
  })

  it('não interativo fica inerte', () => {
    const { container } = render(<HeaderPreview model={headers[0]} variant={0} theme={theme} interactive={false} />)
    expect(container.querySelector('.nvs-h')).toHaveAttribute('inert')
  })
})

describe('SidebarPreview', () => {
  it.each([0, 1] as const)('renderiza todas as sidebars na composição %s (desktop e drawer)', (variant) => {
    for (const s of sidebars) {
      const { unmount, container } = render(<SidebarPreview model={s} variant={variant} theme={theme} />)
      expect(container.querySelector('[role="group"][aria-label="Menu lateral"]')).not.toBeNull()
      unmount()
      const drawer = render(<SidebarPreview model={s} variant={variant} theme={theme} compact onClose={() => {}} />)
      expect(drawer.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument()
      drawer.unmount()
    }
  })

  it('recolhe e expande, com estado controlado', () => {
    const s = sidebarById('classica-integral')!
    const changes: boolean[] = []
    const { container, rerender } = render(<SidebarPreview model={s} variant={0} theme={theme} onCollapsedChange={(c) => changes.push(c)} />)
    expect((container.querySelector('.nvs-s') as HTMLElement).style.width).toBe('248px')
    fireEvent.click(screen.getByRole('button', { name: 'Recolher menu' }))
    expect((container.querySelector('.nvs-s') as HTMLElement).style.width).toBe('72px')
    expect(changes).toEqual([true])
    rerender(<SidebarPreview model={s} variant={0} theme={theme} collapsed={false} />)
    expect((container.querySelector('.nvs-s') as HTMLElement).style.width).toBe('248px')
    rerender(<SidebarPreview model={s} variant={0} theme={theme} collapsed />)
    expect(screen.getByRole('button', { name: 'Expandir menu' })).toBeInTheDocument()
  })

  it('submenu em acordeão, flyout e busca que filtra', () => {
    const acc = render(<SidebarPreview model={sidebarById('acordeao-secoes')!} variant={0} theme={theme} />)
    const clientes = acc.getByRole('button', { name: /Clientes/ })
    fireEvent.click(clientes)
    expect(clientes).toHaveAttribute('aria-expanded', 'true')
    expect(acc.getByRole('button', { name: 'Empresas' })).toBeInTheDocument()
    acc.unmount()

    const fly = render(<SidebarPreview model={sidebarById('submenu-lateral')!} variant={0} theme={theme} />)
    fireEvent.click(fly.getByRole('button', { name: /Pedidos/ }))
    expect(fly.getByRole('menu', { name: 'Pedidos' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(fly.queryByRole('menu', { name: 'Pedidos' })).toBeNull()
    fly.unmount()

    render(<SidebarPreview model={sidebarById('busca-integrada')!} variant={0} theme={theme} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'fatu' } })
    expect(screen.getByRole('button', { name: 'Faturas' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Pedidos' })).toBeNull()
  })

  it('sidebar contextual troca a lista pelas abas', () => {
    render(<SidebarPreview model={sidebarById('painel-contextual')!} variant={0} theme={theme} />)
    expect(screen.getByRole('button', { name: /Pedidos/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: /Marketing/ }))
    expect(screen.getByRole('button', { name: /Segmentos/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Pedidos/ })).toBeNull()
  })
})

describe('NavigationShowcase', () => {
  it('renderiza os cartões, seleciona e persiste a composição', () => {
    render(<NavigationShowcase />)
    expect(screen.getAllByTestId(/^header-option-/)).toHaveLength(36)
    const card = screen.getByTestId('header-option-linha-essencial')
    fireEvent.click(within(card).getByRole('button', { name: 'Composição B' }))
    fireEvent.click(card.querySelector('[data-role="select"]')!)
    expect(useStudio.getState().project.navigation.header).toEqual({ id: 'linha-essencial', variant: 1 })
    expect(card).toHaveAttribute('data-selected', 'true')
    // Trocar a composição do cartão selecionado atualiza a seleção.
    fireEvent.click(within(card).getByRole('button', { name: 'Composição A' }))
    expect(useStudio.getState().project.navigation.header).toEqual({ id: 'linha-essencial', variant: 0 })
  })

  it('abrir um menu da prévia não seleciona o cartão', () => {
    render(<NavigationShowcase />)
    const card = screen.getByTestId('header-option-ilha-flutuante')
    fireEvent.click(within(card).getByRole('button', { name: /Produto/ }))
    expect(useStudio.getState().project.navigation.header).toBeNull()
  })

  it('filtra e alterna para sidebars e combinação; modo guiado tem menos filtros', () => {
    const { unmount } = render(<NavigationShowcase />)
    fireEvent.click(screen.getByRole('button', { name: /^Com mega menu/ }))
    expect(screen.getAllByTestId(/^header-option-/)).toHaveLength(headers.filter((h) => h.filters.includes('mega-menu')).length)
    fireEvent.click(screen.getByRole('tab', { name: /Sidebars/ }))
    expect(screen.getAllByTestId(/^sidebar-option-/)).toHaveLength(36)
    fireEvent.click(screen.getByRole('tab', { name: /Combinação/ }))
    expect(screen.getByTestId('nav-combo-frame')).toBeInTheDocument()
    unmount()
    render(<NavigationShowcase guided />)
    const chips = within(screen.getByRole('group', { name: 'Filtrar headers' })).getAllByRole('button')
    expect(chips.length).toBeLessThan(HEADER_FILTERS.length)
  })
})
