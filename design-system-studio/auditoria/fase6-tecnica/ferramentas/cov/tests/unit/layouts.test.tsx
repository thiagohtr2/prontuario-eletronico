import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createProject, SUGGESTIONS } from '@/core/project'
import { projectTheme } from '@/core/theme'
import { desktopById, desktopLayouts, mobileById, mobileLayouts } from '@/modules/layouts/catalog'
import { areaMatrix, areaNames, computeGeometry, parseTracks } from '@/modules/layouts/geometry'
import { DesktopSchematic, PhonePreview, phoneMenu } from '@/modules/layouts/renderers'
import { DESKTOP_FAMILIES, MOBILE_GROUPS } from '@/modules/layouts/types'

const theme = projectTheme(createProject())

const REQUIRED_DESKTOP = [
  'sidebar-integral-classica',
  'sidebar-integral-header-global',
  'rail-sidebar-contextual',
  'dashboard-tres-colunas',
  'analytics-lateral-direita',
  'topbar-integral-fixa',
  'topbar-duas-linhas',
  'header-central-flutuante',
  'landing-editorial-ampla',
  'minimalista-sem-lateral',
  'portfolio-full-bleed',
  'editorial-assimetrica',
  'magazine-indice-lateral',
  'one-screen-dashboard',
  'one-screen-painel-operacional',
  'one-screen-kiosk',
]

const REQUIRED_MOBILE = [
  'bottom-nav-classica',
  'bottom-nav-cinco',
  'bottom-minimalista',
  'topbar-flutuante-compacta',
  'header-busca-menu-flutuante',
  'topbar-bottom-nav',
  'topbar-hamburguer',
  'topbar-abas',
  'topbar-busca',
  'drawer-esquerda',
  'menu-fullscreen',
  'menu-editorial-fullscreen',
  'one-screen-bottom-nav',
  'one-screen-abas',
  'one-screen-kiosk',
]

const FAMILY_COUNTS: Record<string, number> = {
  'sidebar-integral': 5,
  'sidebar-flutuante': 4,
  'rail-dupla': 4,
  direita: 3,
  'sem-sidebar': 5,
  editorial: 4,
  multicoluna: 11,
  'one-screen': 6,
}

const GROUP_COUNTS: Record<string, number> = {
  inferior: 6,
  flutuantes: 8,
  hibridos: 9,
  superior: 5,
  drawers: 5,
  'lateral-compacta': 3,
  'tela-cheia': 4,
  'one-screen': 4,
}

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/

describe('catálogo desktop', () => {
  it('tem 42 layouts com ids únicos em kebab-case', () => {
    expect(desktopLayouts).toHaveLength(42)
    const ids = desktopLayouts.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(KEBAB)
  })

  it('respeita a quantidade por família', () => {
    expect(DESKTOP_FAMILIES.map((f) => f.id).sort()).toEqual(Object.keys(FAMILY_COUNTS).sort())
    for (const [family, n] of Object.entries(FAMILY_COUNTS)) {
      expect(desktopLayouts.filter((l) => l.family === family), family).toHaveLength(n)
    }
  })

  it('contém os ids exigidos pelo núcleo e por todas as sugestões', () => {
    for (const id of REQUIRED_DESKTOP) expect(desktopById(id), id).toBeDefined()
    for (const s of Object.values(SUGGESTIONS)) for (const id of s.desktop) expect(desktopById(id), id).toBeDefined()
    expect(desktopById(null)).toBeUndefined()
  })

  it.each(desktopLayouts.map((l) => [l.id, l] as const))('%s: grid coerente com as regiões', (_id, l) => {
    const names = areaNames(l.grid.areas)
    const matrix = areaMatrix(l.grid.areas)
    const gridRegions = l.regions.filter((r) => !r.overlay)
    // Toda região (exceto sobrepostas) aparece nas áreas; toda área tem região.
    for (const r of gridRegions) expect(names, `região ${r.id}`).toContain(r.id)
    for (const n of names) expect(gridRegions.map((r) => r.id), `área ${n}`).toContain(n)
    for (const r of l.regions.filter((x) => x.overlay)) expect(names).not.toContain(r.id)
    // Matriz retangular, com tantas colunas/linhas quanto as trilhas.
    const cols = parseTracks(l.grid.columns).length
    expect(matrix.every((row) => row.length === cols)).toBe(true)
    expect(matrix).toHaveLength(parseTracks(l.grid.rows).length)
    // Trilhas somente em px/fr.
    expect(`${l.grid.columns} ${l.grid.rows}`).toMatch(/^(\s*\d*\.?\d+(px|fr))+\s*$/)
    expect(new Set(l.regions.map((r) => r.id)).size).toBe(l.regions.length)
  })

  it('cada item tem descrição, spec técnica e responsividade não vazia', () => {
    for (const l of desktopLayouts) {
      expect(l.description.length, l.id).toBeGreaterThan(40)
      expect(l.spec.summary.length, l.id).toBeGreaterThan(20)
      expect(l.spec.structure.length, l.id).toBeGreaterThan(1)
      expect(l.spec.responsive.length, l.id).toBeGreaterThan(1)
      expect(l.spec.responsive.every((r) => r.trim().length > 0)).toBe(true)
      expect(Object.keys(l.measurements).length, l.id).toBeGreaterThan(0)
    }
  })

  it('marca oneScreen exatamente na família One Screen', () => {
    for (const l of desktopLayouts) expect(Boolean(l.oneScreen), l.id).toBe(l.family === 'one-screen')
  })

  it('sidebars integrais nunca flutuam; flutuantes têm afastamento', () => {
    for (const l of desktopLayouts.filter((x) => x.family === 'sidebar-integral')) {
      expect(l.grid.gap).toBe(0)
      expect(l.grid.padding).toBe(0)
      expect(l.regions.find((r) => r.kind === 'sidebar')?.floating).toBeFalsy()
    }
    for (const l of desktopLayouts.filter((x) => x.family === 'sidebar-flutuante')) {
      expect(l.grid.gap).toBeGreaterThan(0)
      expect(l.grid.padding).toBeGreaterThan(0)
      expect(l.regions.some((r) => r.floating)).toBe(true)
    }
    expect(desktopById('header-central-flutuante')?.regions.find((r) => r.kind === 'header')?.overlay).toBeDefined()
  })

  it('resolve a geometria escalando px e mantendo fr', () => {
    const l = desktopById('sidebar-integral-classica')!
    const full = computeGeometry(l, 1280)
    expect(full.rects.sidebar).toMatchObject({ x: 0, y: 0, w: 252, h: 800 })
    expect(full.rects.header).toMatchObject({ x: 252, y: 0, w: 1028, h: 64 })
    const half = computeGeometry(l, 640)
    expect(half.rects.sidebar.w).toBeCloseTo(126)
    expect(half.rects.content.h).toBeCloseTo(400 - 32)
    const floating = computeGeometry(desktopById('sidebar-flutuante-compacta')!, 1280)
    expect(floating.rects.sidebar).toMatchObject({ x: 16, y: 16, w: 224 })
    const overlay = computeGeometry(desktopById('header-central-flutuante')!, 1280)
    expect(overlay.rects.header).toMatchObject({ x: 260, y: 16, w: 760, h: 56 })
  })
})

describe('catálogo mobile', () => {
  it('tem 44 layouts com ids únicos em kebab-case', () => {
    expect(mobileLayouts).toHaveLength(44)
    const ids = mobileLayouts.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(KEBAB)
  })

  it('respeita a quantidade por grupo', () => {
    expect(MOBILE_GROUPS.map((g) => g.id).sort()).toEqual(Object.keys(GROUP_COUNTS).sort())
    for (const [group, n] of Object.entries(GROUP_COUNTS)) {
      expect(mobileLayouts.filter((l) => l.group === group), group).toHaveLength(n)
    }
  })

  it('contém os ids exigidos pelo núcleo e por todas as sugestões', () => {
    for (const id of REQUIRED_MOBILE) expect(mobileById(id), id).toBeDefined()
    for (const s of Object.values(SUGGESTIONS)) for (const id of s.mobile) expect(mobileById(id), id).toBeDefined()
  })

  it('cada item tem config completa, spec e responsividade não vazia', () => {
    for (const l of mobileLayouts) {
      expect(l.config.top, l.id).toBeTruthy()
      expect(l.config.bottom, l.id).toBeTruthy()
      expect(l.config.side, l.id).toBeTruthy()
      expect(l.config.overlay, l.id).toBeTruthy()
      expect(l.description.length, l.id).toBeGreaterThan(40)
      expect(l.spec.structure.length, l.id).toBeGreaterThan(0)
      expect(l.spec.responsive.length, l.id).toBeGreaterThan(1)
    }
  })

  it('marca oneScreen exatamente no grupo One Screen', () => {
    for (const l of mobileLayouts) expect(Boolean(l.config.oneScreen), l.id).toBe(l.group === 'one-screen')
  })

  it('todo drawer/menu sobreposto tem gatilho, e grupos de drawers/tela cheia sempre têm menu', () => {
    for (const l of mobileLayouts) {
      const hasMenu = l.config.overlay !== 'none' || ['drawer-left', 'drawer-right', 'drawer-push', 'rail-expand'].includes(l.config.side)
      expect(Boolean(phoneMenu(l.config)), l.id).toBe(hasMenu)
      if (l.group === 'drawers' || l.group === 'tela-cheia') expect(hasMenu, l.id).toBe(true)
    }
  })
})

describe('DesktopSchematic', () => {
  const layout = desktopById('dashboard-tres-colunas')!

  it('desenha todas as regiões com legendas', () => {
    const { container } = render(<DesktopSchematic layout={layout} width={640} showLegends />)
    const root = container.querySelector('.lay-ds') as HTMLElement
    expect(root.style.width).toBe('640px')
    expect(root.style.height).toBe('400px')
    expect(root.style.gridTemplateColumns).toContain('120px')
    expect(container.querySelectorAll('.lay-ds-region')).toHaveLength(layout.regions.length)
    expect(screen.getByText('SIDEBAR')).toBeInTheDocument()
    expect(screen.getByText('CONTEÚDO')).toBeInTheDocument()
    expect(screen.getByText('PAINEL')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Dashboard de três colunas/ })).toBeInTheDocument()
  })

  it('oculta as legendas quando desligadas e aceita tema', () => {
    const { container } = render(<DesktopSchematic layout={layout} width={300} showLegends={false} theme={theme} />)
    expect(container.querySelectorAll('.lay-chip')).toHaveLength(0)
    const root = container.querySelector('.lay-ds') as HTMLElement
    expect(root.getAttribute('data-detail')).toBe('thumb')
    expect(root.style.getPropertyValue('--ds-accent')).toBe(theme.tokens.primary)
  })

  it('posiciona regiões sobrepostas e usa renderRegion quando fornecido', () => {
    const l = desktopById('header-central-flutuante')!
    const sizes: number[] = []
    const { container } = render(
      <DesktopSchematic
        layout={l}
        width={1280}
        showLegends={false}
        theme={theme}
        renderRegion={(region, size) => {
          sizes.push(size.scale)
          return region.kind === 'header' ? <span>Menu real</span> : null
        }}
      />,
    )
    const header = container.querySelector('[data-region="header"]') as HTMLElement
    expect(header.style.position).toBe('absolute')
    expect(within(header).getByText('Menu real')).toBeInTheDocument()
    // Região com retorno null mantém o desenho padrão.
    expect(container.querySelector('[data-region="content"] .lay-ds-draw')).not.toBeNull()
    expect(sizes.every((s) => s === 1)).toBe(true)
  })

  it('renderiza os 42 layouts sem erro em miniatura e em tamanho grande', () => {
    for (const l of desktopLayouts) {
      const a = render(<DesktopSchematic layout={l} width={280} showLegends />)
      const b = render(<DesktopSchematic layout={l} width={720} showLegends theme={theme} />)
      expect(a.container.querySelectorAll('.lay-ds-region').length, l.id).toBe(l.regions.length)
      a.unmount()
      b.unmount()
    }
  })
})

describe('PhonePreview', () => {
  it('monta a tela com legendas e respeita o desligamento', () => {
    const layout = mobileById('header-busca-menu-flutuante')!
    const { rerender } = render(<PhonePreview layout={layout} theme={theme} showLegends interactive />)
    const phone = screen.getByTestId('phone-preview')
    expect(within(phone).getByText('HEADER')).toBeInTheDocument()
    expect(within(phone).getByText('CATEGORIAS')).toBeInTheDocument()
    expect(within(phone).getByText('CONTEÚDO')).toBeInTheDocument()
    expect(within(phone).getByText('DOCK')).toBeInTheDocument()
    rerender(<PhonePreview layout={layout} theme={theme} showLegends={false} interactive />)
    expect(phone.querySelectorAll('.lay-chip')).toHaveLength(0)
  })

  it('abre o drawer pelo gatilho e fecha pelo X e pelo Esc', () => {
    render(<PhonePreview layout={mobileById('drawer-esquerda')!} theme={theme} showLegends interactive />)
    expect(screen.queryByTestId('phone-overlay')).toBeNull()
    const trigger = screen.getByTestId('phone-menu-trigger')
    fireEvent.click(trigger)
    const overlay = screen.getByTestId('phone-overlay')
    expect(overlay).toHaveAttribute('role', 'dialog')
    expect(within(overlay).getByText('DRAWER')).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(within(overlay).getByRole('button', { name: 'Fechar menu' }))
    expect(screen.queryByTestId('phone-overlay')).toBeNull()
    fireEvent.click(trigger)
    fireEvent.keyDown(screen.getByTestId('phone-overlay'), { key: 'Escape' })
    expect(screen.queryByTestId('phone-overlay')).toBeNull()
  })

  it('abre o menu de todos os layouts que têm menu', () => {
    for (const l of mobileLayouts.filter((x) => phoneMenu(x.config))) {
      const { unmount } = render(<PhonePreview layout={l} theme={theme} showLegends={false} interactive />)
      fireEvent.click(screen.getByTestId('phone-menu-trigger'))
      expect(screen.getByTestId('phone-overlay'), l.id).toBeInTheDocument()
      unmount()
    }
  })

  it('marca o item tocado da navegação inferior como ativo', () => {
    render(<PhonePreview layout={mobileById('bottom-nav-classica')!} theme={theme} showLegends={false} interactive />)
    const agenda = screen.getByRole('button', { name: 'Agenda' })
    expect(agenda).not.toHaveAttribute('aria-current')
    fireEvent.click(agenda)
    expect(agenda).toHaveAttribute('aria-current', 'page')
  })

  it('miniatura não interativa não contém botões e tem a altura de 2 × largura', () => {
    const { container } = render(<PhonePreview layout={mobileById('menu-fullscreen')!} theme={theme} showLegends={false} width={104} detail="thumb" initialOpen frame={false} testId="phone-thumb" />)
    const root = screen.getByTestId('phone-thumb')
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('button')).toHaveLength(0)
    expect(root.style.width).toBe('104px')
    expect(root.style.height).toBe('208px')
  })

  it('renderiza os 44 layouts sem erro', () => {
    for (const l of mobileLayouts) {
      const { unmount } = render(<PhonePreview layout={l} theme={theme} showLegends interactive width={320} />)
      expect(screen.getByTestId('phone-preview'), l.id).toBeInTheDocument()
      unmount()
    }
  })
})
