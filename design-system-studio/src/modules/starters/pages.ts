import type { ComponentInstance, PageBlock, Project, ProjectPage } from '@/core/project'
import { desktopById } from '@/modules/layouts/catalog'
import { asideRegions } from '@/modules/layouts/fit'

/*
 * Como cada página do projeto se distribui nas regiões do layout. Funções puras: a prévia, o
 * inventário, as pendências e o Master Prompt leem o mesmo plano (o que se vê é o que se pede).
 */

/**
 * Sobreposições: não entram na grade da página. Aparecem por cima do conteúdo quando abertas
 * (modal centralizado com véu; toast no canto inferior).
 */
export const OVERLAY_CATEGORIES = new Set(['modais', 'toasts'])

export const isOverlay = (c: ComponentInstance | undefined) => Boolean(c && OVERLAY_CATEGORIES.has(c.categoryId))

export interface PagePlan {
  /** Blocos da área principal (sem sobreposições). */
  main: PageBlock[]
  /** Blocos da coluna/painel lateral do layout (vazio se o layout não tem essa região). */
  aside: PageBlock[]
  /** Sobreposições usadas na página (modais e toasts), na ordem dos blocos. */
  overlays: ComponentInstance[]
  /** Nome da região do layout que recebe `aside` (ex.: “Indicadores”), ou null. */
  asideRegion: string | null
  /** O layout não tem região lateral: o conteúdo lateral foi para o fim da área principal. */
  asideInMain: boolean
}

const regionName = (label: string | undefined, id: string) => (label ? label.charAt(0) + label.slice(1).toLowerCase() : id)

export function planPage(project: Project, page: ProjectPage): PagePlan {
  const comp = (id: string) => project.components.find((c) => c.id === id)
  const desk = desktopById(project.layout.desktopId)
  const regions = desk ? asideRegions(desk) : []
  const keep = (b: PageBlock) => {
    const c = comp(b.component)
    return Boolean(c) && !isOverlay(c)
  }
  const main = page.blocks.filter(keep)
  const aside = (page.aside ?? []).filter(keep)
  const seen = new Set<string>()
  const overlays: ComponentInstance[] = []
  for (const b of [...page.blocks, ...(page.aside ?? [])]) {
    const c = comp(b.component)
    if (c && isOverlay(c) && !seen.has(c.id)) {
      seen.add(c.id)
      overlays.push(c)
    }
  }
  const asideInMain = aside.length > 0 && regions.length === 0
  return {
    main: asideInMain ? [...main, ...aside] : main,
    aside: asideInMain ? [] : aside,
    overlays,
    asideRegion: regions[0] ? regionName(regions[0].label, regions[0].id) : null,
    asideInMain,
  }
}

/** Fração da largura de um bloco na grade de 12 colunas, em texto (“largura total”, “1/2”…). */
export function spanLabel(span: number): string {
  const map: Record<number, string> = { 12: 'largura total', 6: '1/2 da largura', 4: '1/3 da largura', 3: '1/4 da largura', 8: '2/3 da largura', 9: '3/4 da largura' }
  return map[span] ?? `${span}/12 da largura`
}
