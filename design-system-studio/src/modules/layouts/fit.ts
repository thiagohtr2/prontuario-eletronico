import type { DesktopLayout, LayoutRegion } from './types'

/*
 * Regras de encaixe entre o layout desktop e o conteúdo do projeto. Funções puras, usadas pela
 * prévia (AppFrame), pela validação dos modelos e pelo Master Prompt — uma regra, um lugar.
 */

/**
 * Regiões do layout que recebem o conteúdo lateral da página (`aside`): painéis e detalhes; sem eles,
 * a coluna de submenu ao lado de uma sidebar/trilho (ex.: filtros do kanban). Regra única da prévia e da
 * validação dos modelos.
 */
export function asideRegions(layout: DesktopLayout): LayoutRegion[] {
  const panels = layout.regions.filter((r) => r.kind === 'panel' || r.kind === 'detail')
  if (panels.length) return panels
  const sideNav = layout.regions.some((r) => r.kind === 'sidebar' || r.kind === 'rail')
  return sideNav ? layout.regions.filter((r) => r.kind === 'submenu') : []
}

/** Divide a definição de linhas/colunas do grid respeitando parênteses (ex.: `minmax(0, 1fr)`). */
function splitTracks(def: string): string[] {
  const out: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of def.trim()) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (/\s/.test(ch) && depth === 0) {
      if (cur) out.push(cur)
      cur = ''
    } else cur += ch
  }
  if (cur) out.push(cur)
  return out
}

/** Layout com a linha da região `id` na altura `px` (só se a linha for uma medida fixa em px). */
export function growRow(layout: DesktopLayout, id: string, px: number): DesktopLayout {
  const rows = splitTracks(layout.grid.rows)
  const idx = layout.grid.areas.findIndex((r) => r.split(/\s+/).includes(id))
  if (idx < 0 || !/^\d+(\.\d+)?px$/.test(rows[idx] ?? '')) return layout
  rows[idx] = `${Math.round(px)}px`
  return { ...layout, grid: { ...layout.grid, rows: rows.join(' ') }, measurements: { ...layout.measurements, header: Math.round(px) } }
}
