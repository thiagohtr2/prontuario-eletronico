import type { Project } from '@/core/project'
import { siteById } from '@/modules/inspiration/catalog'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import type { MobileLayout } from '@/modules/layouts/types'
import { headerById, headerFitForLayout, headerLookFor, sidebarById, sidebarLookFor } from '@/modules/navigation/catalog'
import { templateById } from '@/modules/templates/catalog'
import type { PromptItem } from './items'

/**
 * Modelo de fatos único do Master Prompt.
 *
 * Cada catálogo descreve o próprio modelo isoladamente (altura do header, largura da sidebar,
 * comportamento no celular, menus e marcas de demonstração). Combinados, esses textos se
 * contradizem. Este módulo aplica uma precedência fixa e reescreve os itens para que cada fato
 * tenha um único valor:
 *
 * 1. O layout desktop define estrutura e medidas (altura do header, largura da sidebar).
 * 2. O modelo de header/sidebar define apenas a aparência interna.
 * 3. O layout mobile define toda a navegação no celular; o tablet usa o desktop compactado.
 * 4. A identidade global define cor, fonte e raio, salvo exceção explícita.
 * 5. O conteúdo do projeto (nome, itens de menu) substitui o conteúdo de exemplo dos modelos.
 *
 * Toda reescrita gera uma `AutoResolution`, exibida no Master Prompt e na Central de Prompts.
 */

export interface AutoResolution {
  id: string
  title: string
  instruction: string
}

/** Linhas que descrevem o comportamento no celular (substituídas pelo layout mobile). */
const MOBILE_RE = /celular|mobile|☰|hamb[uú]rguer|drawer|abaixo de 768|<\s?768|bottom (sheet|nav)|painel do menu/i
/** Linhas que descrevem a faixa de tablet. */
const TABLET_RE = /768\s?(a|–|-|e)\s?1023|tablet/i

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

type TextFn = (line: string) => string | null

/** Aplica `fn` a todos os textos descritivos de um item (nome e observações do usuário ficam intactos). */
function mapItemText(item: PromptItem, fn: TextFn, opts: { responsive?: boolean } = {}) {
  const list = (lines: string[]) => lines.map(fn).filter((l): l is string => l !== null && l !== '')
  item.summary = fn(item.summary) ?? ''
  item.structure = list(item.structure)
  item.behavior = list(item.behavior)
  if (opts.responsive !== false) item.responsive = list(item.responsive)
  item.notes = list(item.notes)
  for (const [k, v] of Object.entries(item.measurements)) {
    const r = fn(v)
    if (r === null) delete item.measurements[k]
    else item.measurements[k] = r
  }
  for (const [k, v] of Object.entries(item.properties)) {
    if (typeof v !== 'string') continue
    const r = fn(v)
    if (r === null) delete item.properties[k]
    else item.properties[k] = r
  }
}

/** Quantidade de destinos que a navegação inferior do layout mobile comporta. */
export function mobileSlots(mobile: MobileLayout | undefined): number | null {
  if (!mobile) return null
  const b = mobile.config.bottom
  if (b === 'none' || b === 'fab' || b === 'sheet-peek') return null
  return b === 'bottom-nav-5' ? 5 : 4
}

/** Descrição em uma frase de como a navegação funciona no celular, a partir do layout mobile. */
export function mobileNavSummary(project: Project): string {
  const mobile = mobileById(project.layout.mobileId)
  if (!mobile) return 'Layout mobile ainda não escolhido.'
  const slots = mobileSlots(mobile)
  const c = mobile.config
  const parts: string[] = []
  if (slots) parts.push(`navegação inferior com ${slots} destinos (os ${slots} primeiros itens do menu; se houver mais, o último vira “Mais” e abre os restantes)`)
  if (c.side.startsWith('drawer') || c.top === 'topbar-hamburger') parts.push('menu lateral (drawer) aberto pelo botão ☰ com todos os itens do menu')
  if (c.side.startsWith('rail') || c.side === 'mini-sidebar') parts.push('trilho lateral de ícones com os itens do menu')
  if (c.overlay === 'fullscreen' || c.overlay === 'fullscreen-editorial') parts.push('menu de tela cheia com todos os itens')
  if (c.overlay === 'bottom-sheet' || c.overlay === 'grouped-sheet') parts.push('bottom sheet com os itens secundários')
  if (c.top === 'topbar-tabs' || c.top === 'scroll-tabs') parts.push('abas no topo com os itens principais')
  if (!parts.length) parts.push('estrutura descrita no item “Layout mobile”')
  return `No celular (até 767 px), siga o layout mobile “${mobile.name}”: ${parts.join('; ')}.`
}

/** Marcas fictícias usadas nas prévias dos modelos escolhidos. */
function demoBrands(project: Project): string[] {
  const out = new Set<string>()
  const h = project.navigation.header
  const hm = h ? headerById(h.id) : undefined
  if (hm && h) {
    out.add(hm.look.brand)
    out.add(headerLookFor(hm, h.variant).brand)
  }
  const s = project.navigation.sidebar
  const sm = s ? sidebarById(s.id) : undefined
  if (sm && s) {
    out.add(sm.look.brand)
    out.add(sidebarLookFor(sm, s.variant).brand)
  }
  const site = project.inspiration ? siteById(project.inspiration.siteId) : undefined
  if (site) out.add(site.brand)
  const tpl = project.template ? templateById(project.template.id) : undefined
  if (tpl) out.add(tpl.brand)
  const own = project.meta.name.trim().toLowerCase()
  return [...out].filter((b) => b && b.trim().length >= 3 && b.trim().toLowerCase() !== own)
}

/** Reescreve os itens (no lugar) aplicando a precedência e devolve as decisões automáticas. */
export function resolvePromptItems(items: PromptItem[], project: Project): AutoResolution[] {
  const out: AutoResolution[] = []
  const byKind = (k: PromptItem['kind']) => items.find((i) => i.kind === k)
  const desktop = desktopById(project.layout.desktopId)
  const mobile = mobileById(project.layout.mobileId)
  const brandName = project.meta.name.trim()
  const brandRef = brandName ? `“${brandName}”` : 'a marca real do projeto'
  const navItems = project.meta.navItems.map((s) => s.trim()).filter(Boolean)
  const navTxt = navItems.join(', ')

  const header = byKind('header')
  const sidebar = byKind('sidebar')
  const headerModel = project.navigation.header ? headerById(project.navigation.header.id) : undefined
  const sidebarModel = project.navigation.sidebar ? sidebarById(project.navigation.sidebar.id) : undefined

  /* 1. Altura e largura do header: o layout desktop manda. */
  const headerRegion = desktop?.regions.find((r) => r.kind === 'header')
  if (header && headerModel && desktop && headerRegion) {
    // A especificação de cada composição descreve a altura da própria composição.
    const height = headerLookFor(headerModel, project.navigation.header!.variant).height
    const target = desktop.measurements.header
    if (target && height !== target) {
      const re = new RegExp(`\\b${height}\\s?px`, 'g')
      const fix: TextFn = (l) => l.replace(re, `${target} px`)
      header.summary = fix(header.summary) ?? header.summary
      header.structure = header.structure.map((l) => fix(l)!)
      header.behavior = header.behavior.map((l) => fix(l)!)
      if (header.measurements['altura (desktop)']) header.measurements['altura (desktop)'] = fix(header.measurements['altura (desktop)'])!
      out.push({
        id: 'header-altura',
        title: 'Altura do header',
        instruction: `O header tem ${target} px de altura no desktop, como define o layout “${desktop.name}”. O modelo “${headerModel.name}” só define a aparência interna.`,
      })
    }
    // Header × arquitetura: com faixas extras (ex.: editorias abaixo do logo), a linha do layout cresce.
    const sideNavForFit = desktop.regions.some((r) => r.kind === 'sidebar' || r.kind === 'rail')
    const fit = headerFitForLayout(headerModel, project.navigation.header!.variant, target, sideNavForFit)
    if (fit.grows && target) {
      const row = desktop.grid.areas.findIndex((r) => r.split(/\s+/).includes(headerRegion.id))
      const desk = byKind('desktop')
      if (desk && row === 0) desk.structure = desk.structure.map((l) => l.replace(/grid-template-rows: (\d+)px/, (m, v) => (Number(v) === target ? `grid-template-rows: ${fit.total}px` : m)))
      out.push({
        id: 'header-faixas',
        title: 'Header × layout',
        instruction: `O header ocupa ${fit.total} px (barra de ${target} px + faixas extras): a linha do header no layout passa a ${fit.total} px.`,
      })
    }
    const rows = desktop.grid.areas.map((r) => r.trim().split(/\s+/))
    const spansAll = rows.some((cells) => cells.includes(headerRegion.id) && cells.every((c) => c === headerRegion.id))
    if (!spansAll) {
      const fix: TextFn = (l) =>
        l
          .replace(/largura total da janela \(full width\)/g, 'largura da coluna de conteúdo (ao lado da sidebar, como no layout desktop)')
          .replace(/fundo em largura total/g, 'fundo na largura da coluna de conteúdo')
      header.structure = header.structure.map((l) => fix(l)!)
      header.summary = fix(header.summary)!
      out.push({
        id: 'header-largura',
        title: 'Largura do header',
        instruction: `No layout “${desktop.name}” o header ocupa só a coluna ao lado da sidebar; ele não atravessa a sidebar.`,
      })
    }
  }

  /* 2. Largura da sidebar: o layout desktop manda. */
  if (sidebar && sidebarModel && desktop && sidebarModel.shape !== 'dupla') {
    const target = sidebarModel.shape === 'rail' ? desktop.measurements.rail : desktop.measurements.sidebar
    if (target && target !== sidebarModel.width) {
      const re = new RegExp(`\\b${sidebarModel.width}\\s?px`, 'g')
      mapItemText(sidebar, (l) => l.replace(re, `${target} px`), { responsive: false })
      out.push({
        id: 'sidebar-largura',
        title: 'Largura da sidebar',
        instruction: `A sidebar tem ${target} px de largura, como define o layout “${desktop.name}”. O modelo “${sidebarModel.name}” só define a aparência interna.`,
      })
    }
  }

  /* 3. Celular e tablet: o layout mobile e o desktop compactado mandam. */
  if (mobile) {
    // Frase curta nos itens; a descrição completa fica uma vez só em “Conteúdo do projeto”.
    const pointer = `No celular (até 767 px), siga o layout mobile “${mobile.name}” (navegação móvel descrita em “Conteúdo do projeto”).`
    const tablet = 'De 768 a 1023 px: use a estrutura desktop compactada (sidebar recolhida em trilho de ícones, itens excedentes em “Mais ▾”); não introduza ☰ ou drawer que não existam no layout mobile.'
    for (const item of [header, sidebar]) {
      if (!item) continue
      item.responsive = [...item.responsive.filter((l) => !MOBILE_RE.test(l) && !TABLET_RE.test(l)), tablet, pointer]
      for (const k of Object.keys(item.measurements)) if (MOBILE_RE.test(k)) delete item.measurements[k]
    }
    const desk = byKind('desktop')
    if (desk) desk.responsive = [...desk.responsive.filter((l) => !MOBILE_RE.test(l)), pointer]
    if (header || sidebar || desk)
      out.push({
        id: 'navegacao-mobile',
        title: 'Navegação no celular',
        instruction: `No celular vale só o layout mobile “${mobile.name}”; header, sidebar e layout desktop não definem a navegação móvel. Entre 768 e 1023 px vale o desktop compactado.`,
      })
  }

  /* 4. Conteúdo do projeto no lugar do conteúdo de exemplo. */
  const navLine = navItems.length
    ? `os ${navItems.length} itens do menu do projeto, nesta ordem (${navTxt})`
    : 'os itens do menu do projeto (ainda não definidos — veja Pendências; os rótulos do modelo eram só exemplo)'
  // Com sidebar no layout, o menu fica nela: o header não repete os mesmos links (preview e prompt iguais).
  const sideNav = Boolean(desktop?.regions.some((r) => r.kind === 'sidebar' || r.kind === 'rail'))
  if (header && sideNav) {
    header.structure = header.structure.map((l) =>
      /^Navegação principal com \d+ itens/.test(l) ? 'Sem links de navegação no header: o menu principal fica na sidebar; o header traz busca, ações e perfil.' : l,
    )
    out.push({
      id: 'header-sem-menu',
      title: 'Menu no header × sidebar',
      instruction: 'Com sidebar no layout, os itens do menu ficam só na sidebar; o header não repete os mesmos links.',
    })
  }
  if (header) {
    header.structure = header.structure.map((l) =>
      l
        .replace(/Navegação principal com \d+ itens \(.*?\): /, `Navegação principal com ${navLine}: `)
        .replace(/\(marca fictícia “[^”]*” na prévia — substitua pela marca real\)/, `(marca ${brandRef})`)
        .replace(/Breadcrumbs “[^”]*”/, 'Breadcrumbs com o caminho da página atual')
        .replace(/Saudação personalizada “[^”]*”/, 'Saudação personalizada com o nome da pessoa logada'),
    )
    header.responsive = header.responsive.map((l) => l.replace(/os \d+ itens de navegação/, 'os itens de navegação'))
    header.notes.push('Textos entre aspas (anúncio, CTA, placeholders, links utilitários) são exemplos do modelo: use os textos reais do projeto.')
  }
  if (sidebar) {
    sidebar.structure = sidebar.structure.map((l) => {
      if (l.startsWith('Itens: ')) return `Itens: ${navLine}. Agrupe-os conforme o conteúdo real.`
      if (l.startsWith('Painel de segundo nível com: ')) return 'Painel de segundo nível com os subitens da área ativa (defina-os conforme o conteúdo real; os da prévia são exemplos).'
      if (l.startsWith('Áreas que trocam a lista: ')) return 'Áreas que trocam a lista: definidas pelo conteúdo real do projeto (as da prévia são exemplos).'
      return l
    })
    sidebar.behavior = sidebar.behavior.map((l) => l.replace(/^Submenus \(.*?\): /, 'Submenus (itens com subníveis): '))
    // Texto do botão de criar definido no projeto (no lugar do exemplo do modelo).
    const cta = project.navigation.sidebar?.cta?.trim()
    const ctaModel = sidebarModel?.compositions[project.navigation.sidebar!.variant]?.arrangement.cta
    if (cta && ctaModel && ctaModel !== '+') {
      const re = new RegExp(`“${escapeRe(ctaModel)}”`, 'g')
      mapItemText(sidebar, (l) => l.replace(re, `“${cta}”`))
      out.push({ id: 'sidebar-cta', title: 'Botão de criar da sidebar', instruction: `O botão de criar da sidebar diz “${cta}” (o “${ctaModel}” do modelo era exemplo).` })
    }
    sidebar.notes.push('Contadores, nomes de espaço de trabalho, perfil e textos entre aspas são exemplos do modelo: use os dados reais do projeto.')
  }
  if (header || sidebar)
    out.push({
      id: 'conteudo-menu',
      title: 'Itens do menu',
      instruction: navItems.length
        ? `Header, sidebar e navegação móvel usam os mesmos itens, nesta ordem: ${navTxt}. Os menus de exemplo dos modelos não entram no produto.`
        : 'Os itens do menu ainda não foram definidos. Não copie os menus de exemplo dos modelos: pergunte ao usuário.',
    })

  /* 5. Marcas fictícias das prévias. */
  const brands = demoBrands(project)
  if (brands.length) {
    const res = brands.map((b) => new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(b)}(?![\\p{L}\\p{N}])`, 'gu'))
    const replacement = brandName || 'a marca do projeto'
    const fix: TextFn = (l) => res.reduce((acc, re) => acc.replace(re, replacement), l)
    for (const item of items) mapItemText(item, fix)
    out.push({
      id: 'marca',
      title: 'Marca',
      instruction: `A marca do produto é ${brandRef}. Nomes de marca que aparecem nas prévias dos modelos são fictícios e não entram no produto.`,
    })
  }

  /* 5b. Trechos de CSS válidos: “calc(100dvh − 56 px)” → `calc(100dvh - 56px)` (A3, item 8). */
  const cssFn: TextFn = (l) =>
    l.replace(/\b(calc|min|max|clamp)\(((?:[^()]|\([^()]*\))*)\)/g, (_m, fn: string, inner: string) => {
      const fixed = inner.replace(/−/g, '-').replace(/(\d)\s+(px|vw|vh|dvh|svh|rem|em|%)/g, '$1$2')
      return `${fn}(${fixed})`
    })
  for (const item of items) mapItemText(item, cssFn)

  /* 6. Breakpoints únicos (celular até 767, tablet 768–1023, desktop a partir de 1024). */
  const bp: TextFn = (l) => l.replace(/\b600\s?(e|a)\s?1023\b/g, '768 e 1023').replace(/\b600\s?[–-]\s?1023\b/g, '768–1023')
  for (const item of items) mapItemText(item, bp)

  /* 7. Textos de demonstração nas páginas de entrada e referências. */
  for (const item of items) {
    if (['landing', 'login', 'signup', 'inspiration', 'template'].includes(item.kind))
      item.notes.push('Títulos, slogans, depoimentos, nomes de planos, números e logos da prévia são conteúdo de exemplo: mantenha a estrutura e escreva o conteúdo real do projeto.')
  }

  /* 8. Referências visuais: o que já foi decidido em outro lugar sai da referência. */
  const refs = items.filter((i) => i.kind === 'inspiration' || i.kind === 'template')
  for (const ref of refs) {
    const conflictId = ref.kind === 'inspiration' ? 'cores-inspiracao' : 'cores-template'
    if (project.prompt.conflictResolutions[conflictId] === 'global') {
      ref.colors = {}
      ref.structure = ref.structure.filter((l) => !l.startsWith('Cores: '))
      ref.notes.push('Cores: use a paleta global (decisão do usuário); desta referência valem composição, tipografia e atmosfera.')
    }
    if (mobile) {
      const before = ref.responsive.length
      ref.responsive = ref.responsive.filter((l) => !/hamb[uú]rguer|drawer|☰|bottom sheet/i.test(l))
      if (ref.responsive.length < before)
        ref.responsive.push(`No celular (até 767 px), siga o layout mobile “${mobile.name}” (navegação móvel descrita em “Conteúdo do projeto”).`)
    }
  }

  /* 9. Componentes: raio e tipografia vêm da identidade global. */
  if (items.some((i) => i.kind === 'component'))
    out.push({
      id: 'componentes-identidade',
      title: 'Componentes × identidade',
      instruction: 'Raio dos cantos, fontes e tamanho base dos componentes seguem a identidade global (seção D). A família visual de cada componente define superfície, sombra, preenchimento, bordas e estados.',
    })

  return out
}
