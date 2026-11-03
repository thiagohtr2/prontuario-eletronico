import { activeEntry, STORIES_OPTIONS, WIDE_OPTIONS, type Project } from '@/core/project'
import { fontName, RADIUS_VALUES, SURFACE_LABEL, DENSITY_SPACING } from '@/core/tokens'
import { paletteById } from '@/modules/color/catalog'
import { categoryById, familyById } from '@/modules/components/catalog'
import { landingById, loginById, signupById } from '@/modules/entry/catalog'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { headerById, sidebarById } from '@/modules/navigation/catalog'

/**
 * “Componentes deste site”: o inventário gerado a partir do que o projeto realmente usa —
 * estrutura, identidade, navegação, campos, dados, sobreposições e páginas. Nada é inventado:
 * só entram os itens presentes no projeto (e, para componentes, os usados em alguma página).
 */

export type InventoryTarget =
  | { kind: 'component'; id: string }
  | { kind: 'header' | 'sidebar' | 'desktop' | 'mobile' | 'landing' | 'login' | 'signup' | 'identity' | 'scope' }
  | { kind: 'page'; id: string }

export interface InventoryItem {
  key: string
  label: string
  detail: string
  target: InventoryTarget
  /** Páginas onde o item aparece (nomes). */
  pages: string[]
}

export interface InventoryGroup {
  id: 'estrutura' | 'identidade' | 'navegacao' | 'campos' | 'dados' | 'sobreposicoes' | 'paginas-blocos' | 'paginas'
  title: string
  items: InventoryItem[]
}

const GROUP_OF: Record<string, InventoryGroup['id']> = {
  fundamentos: 'identidade',
  campos: 'campos',
  navegacao: 'navegacao',
  dados: 'dados',
  sobreposicoes: 'sobreposicoes',
  paginas: 'paginas-blocos',
}

export function buildInventory(p: Project): InventoryGroup[] {
  const desktop = desktopById(p.layout.desktopId)
  const mobile = mobileById(p.layout.mobileId)
  const header = p.navigation.header ? headerById(p.navigation.header.id) : undefined
  const sidebar = p.navigation.sidebar ? sidebarById(p.navigation.sidebar.id) : undefined
  const entry = activeEntry(p.entry)
  const appPages = p.pages.filter((pg) => pg.kind === 'app').map((pg) => pg.name)
  const variant = (v: 0 | 1) => (v === 0 ? 'composição A' : 'composição B')

  const estrutura: InventoryItem[] = []
  if (desktop)
    estrutura.push({ key: 'desktop', label: 'Layout do computador', detail: `${desktop.name} · colunas ${desktop.grid.columns}`, target: { kind: 'desktop' }, pages: appPages })
  if (mobile) {
    const c = mobile.config
    const navKind = c.bottom !== 'none' ? 'navegação inferior' : c.side.startsWith('drawer') || c.top === 'topbar-hamburger' ? 'menu lateral (drawer)' : c.top.includes('tabs') ? 'abas no topo' : 'barra superior'
    estrutura.push({ key: 'mobile', label: 'Layout do celular', detail: `${mobile.name} · ${navKind}`, target: { kind: 'mobile' }, pages: appPages })
  }
  if (desktop || p.layout.wide)
    estrutura.push({
      key: 'scope',
      label: 'Monitores grandes e stories',
      detail: `${WIDE_OPTIONS.find((o) => o.id === (p.layout.wide ?? 'centered'))!.name}${mobile?.config.stories ? ` · stories: ${STORIES_OPTIONS.find((o) => o.id === (p.layout.storiesScope ?? 'home'))!.name.toLowerCase()}` : ''}`,
      target: { kind: 'scope' },
      pages: [],
    })

  const navegacao: InventoryItem[] = []
  if (header) navegacao.push({ key: 'header', label: 'Header', detail: `${header.name} · ${variant(p.navigation.header!.variant)}`, target: { kind: 'header' }, pages: appPages })
  if (sidebar) navegacao.push({ key: 'sidebar', label: 'Sidebar', detail: `${sidebar.name} · ${variant(p.navigation.sidebar!.variant)} · ${sidebar.width} px`, target: { kind: 'sidebar' }, pages: appPages })

  const palette = paletteById(p.identity.paletteId)
  const t = p.identity.typography
  const g = p.identity.geometry
  const identidade: InventoryItem[] = [
    { key: 'palette', label: 'Paleta', detail: `${palette?.name ?? p.identity.paletteId}${Object.keys(p.identity.overrides).length ? ` · ${Object.keys(p.identity.overrides).length} cor(es) ajustada(s)` : ''}`, target: { kind: 'identity' }, pages: [] },
    { key: 'typography', label: 'Tipografia', detail: `${fontName(t.heading)} ${t.headingWeight} + ${fontName(t.body)} · base ${t.baseSize} px`, target: { kind: 'identity' }, pages: [] },
    { key: 'geometry', label: 'Geometria e superfícies', detail: `${RADIUS_VALUES[g.radius].label} · ${SURFACE_LABEL[g.surface]} · borda ${g.borderWidth} px`, target: { kind: 'identity' }, pages: [] },
    { key: 'spacing', label: 'Espaçamentos e ícones', detail: `Densidade ${DENSITY_SPACING[g.density].label.toLowerCase()} · ícones ${g.iconStyle === 'outline' ? 'em contorno' : g.iconStyle === 'filled' ? 'preenchidos' : 'duotone'}`, target: { kind: 'identity' }, pages: [] },
  ]

  const byGroup: Record<string, InventoryItem[]> = { campos: [], navegacao: navegacao, dados: [], sobreposicoes: [], 'paginas-blocos': [], identidade: identidade }
  for (const c of p.components) {
    // Área principal, coluna lateral e sobreposições: tudo o que a página realmente usa.
    const pagesUsing = p.pages.filter((pg) => [...pg.blocks, ...(pg.aside ?? [])].some((b) => b.component === c.id)).map((pg) => pg.name)
    if (p.pages.length && pagesUsing.length === 0) continue
    const cat = categoryById(c.categoryId)
    const fam = familyById(c.familyId)
    const group = GROUP_OF[cat?.group ?? 'dados'] ?? 'dados'
    byGroup[group].push({
      key: `component:${c.id}`,
      label: c.label || cat?.name || c.categoryId,
      detail: `${cat?.name ?? c.categoryId} · ${fam?.name ?? c.familyId}${Object.keys(c.tokenOverrides).length ? ' · cores próprias' : ''}`,
      target: { kind: 'component', id: c.id },
      pages: pagesUsing,
    })
  }

  const paginas: InventoryItem[] = p.pages.map((pg) => {
    const model =
      pg.kind === 'landing' ? landingById(entry.landingId)?.name : pg.kind === 'login' ? loginById(entry.loginId)?.name : pg.kind === 'signup' ? signupById(entry.signupId)?.name : undefined
    const kindLabel = pg.kind === 'app' ? `${pg.blocks.length + (pg.aside?.length ?? 0)} bloco(s)` : pg.kind === 'landing' ? 'Landing page' : pg.kind === 'login' ? 'Login' : 'Cadastro'
    return { key: `page:${pg.id}`, label: pg.name, detail: model ? `${kindLabel} · ${model}` : kindLabel, target: { kind: 'page', id: pg.id }, pages: [] }
  })

  const groups: InventoryGroup[] = [
    { id: 'estrutura', title: 'Estrutura', items: estrutura },
    { id: 'identidade', title: 'Identidade visual (global)', items: byGroup.identidade },
    { id: 'navegacao', title: 'Navegação', items: byGroup.navegacao },
    { id: 'campos', title: 'Formulários e campos', items: byGroup.campos },
    { id: 'dados', title: 'Dados e visualização', items: byGroup.dados },
    { id: 'sobreposicoes', title: 'Sobreposições e alertas', items: byGroup.sobreposicoes },
    { id: 'paginas-blocos', title: 'Seções de página', items: byGroup['paginas-blocos'] },
    { id: 'paginas', title: 'Páginas', items: paginas },
  ]
  return groups.filter((g) => g.items.length)
}
