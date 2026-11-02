import type { DesktopLayout, LayoutRegion } from './types'

/**
 * Geometria pura dos layouts desktop (sem React). Resolve as trilhas do grid na largura
 * desejada, a partir das medidas de referência (1280 × 800), e calcula o retângulo de
 * cada região. Usada pelo esquema desenhado e disponível para a Live Preview.
 */

export const REF_WIDTH = 1280
export const REF_HEIGHT = 800

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface Edges {
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
}

/** Escala todos os valores em px de uma string CSS (fr e % não mudam). */
export function scaleCss(value: string, scale: number): string {
  return value.replace(/(-?\d*\.?\d+)px/g, (_, n: string) => `${round(parseFloat(n) * scale)}px`)
}

const round = (n: number) => Math.round(n * 100) / 100

interface Track {
  value: number
  unit: 'px' | 'fr'
}

/** Lê uma definição de trilhas simples ("252px 1fr 300px"). Valores desconhecidos contam como 1fr. */
export function parseTracks(def: string): Track[] {
  return def
    .trim()
    .split(/\s+(?![^(]*\))/)
    .filter(Boolean)
    .map((token) => {
      const m = /^(\d*\.?\d+)(px|fr)$/.exec(token)
      if (!m) return { value: 1, unit: 'fr' as const }
      return { value: parseFloat(m[1]), unit: m[2] as 'px' | 'fr' }
    })
}

/** Resolve trilhas em px para um espaço total (já descontados padding e gaps). */
export function solveTracks(def: string, available: number, scale: number): number[] {
  const tracks = parseTracks(def)
  const fixed = tracks.reduce((sum, t) => sum + (t.unit === 'px' ? t.value * scale : 0), 0)
  const frTotal = tracks.reduce((sum, t) => sum + (t.unit === 'fr' ? t.value : 0), 0)
  const rest = Math.max(0, available - fixed)
  return tracks.map((t) => (t.unit === 'px' ? t.value * scale : frTotal ? (rest * t.value) / frTotal : 0))
}

/** Matriz de células a partir de `grid-template-areas`. */
export function areaMatrix(areas: string[]): string[][] {
  return areas.map((row) => row.trim().split(/\s+/))
}

/** Nomes de área usados no grid (sem '.'). */
export function areaNames(areas: string[]): string[] {
  return [...new Set(areaMatrix(areas).flat().filter((n) => n !== '.' && !/^\.+$/.test(n)))]
}

export interface Bounds {
  r0: number
  r1: number
  c0: number
  c1: number
}

/** Limites (linha/coluna inicial inclusiva, final exclusiva) de uma área nomeada. */
export function areaBounds(matrix: string[][], id: string): Bounds | null {
  let r0 = Infinity
  let r1 = -1
  let c0 = Infinity
  let c1 = -1
  matrix.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell !== id) return
      r0 = Math.min(r0, r)
      r1 = Math.max(r1, r + 1)
      c0 = Math.min(c0, c)
      c1 = Math.max(c1, c + 1)
    }),
  )
  return r1 < 0 ? null : { r0, r1, c0, c1 }
}

const isEmpty = (cell: string | undefined) => cell === undefined || /^\.+$/.test(cell)

/**
 * Em layouts sem gap, cada divisa interna recebe uma única linha: a região desenha a borda
 * direita/inferior quando não está na última coluna/linha, e a esquerda/superior apenas
 * quando o vizinho daquele lado é uma célula vazia ('.').
 */
export function areaEdges(matrix: string[][], b: Bounds): Edges {
  const rows = matrix.length
  const cols = matrix[0]?.length ?? 0
  const leftEmpty = b.c0 > 0 && range(b.r0, b.r1).some((r) => isEmpty(matrix[r][b.c0 - 1]))
  const topEmpty = b.r0 > 0 && range(b.c0, b.c1).some((c) => isEmpty(matrix[b.r0 - 1][c]))
  return {
    top: topEmpty,
    left: leftEmpty,
    right: b.c1 < cols,
    bottom: b.r1 < rows,
  }
}

const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i)

/** Avalia valores de posição de overlay: "16px", "50%", "calc(50% - 380px)". */
export function evalLength(value: string | undefined, total: number, scale: number): number | undefined {
  if (value === undefined) return undefined
  const v = value.trim()
  const calc = /^calc\((.+)\)$/.exec(v)
  const expr = calc ? calc[1] : v
  let sum = 0
  let sign = 1
  for (const token of expr.split(/\s+/)) {
    if (token === '+') sign = 1
    else if (token === '-') sign = -1
    else {
      const m = /^(-?\d*\.?\d+)(px|%)?$/.exec(token)
      if (!m) continue
      const n = parseFloat(m[1])
      sum += sign * (m[2] === '%' ? (n / 100) * total : n * scale)
      sign = 1
    }
  }
  return sum
}

/** Retângulo de uma região sobreposta (overlay) dentro do canvas. */
export function overlayRect(region: LayoutRegion, width: number, height: number, scale: number): Rect {
  const o = region.overlay ?? {}
  const left = evalLength(o.left, width, scale)
  const right = evalLength(o.right, width, scale)
  const top = evalLength(o.top, height, scale)
  const bottom = evalLength(o.bottom, height, scale)
  let w = evalLength(o.width, width, scale)
  let h = evalLength(o.height, height, scale)
  if (w === undefined) w = width - (left ?? 0) - (right ?? 0)
  if (h === undefined) h = height - (top ?? 0) - (bottom ?? 0)
  const x = left ?? (right !== undefined ? width - right - w : 0)
  const y = top ?? (bottom !== undefined ? height - bottom - h : 0)
  return { x, y, w, h }
}

export interface LayoutGeometry {
  scale: number
  width: number
  height: number
  columns: number[]
  rows: number[]
  matrix: string[][]
  rects: Record<string, Rect>
  edges: Record<string, Edges>
}

/**
 * Calcula a geometria completa de um layout desktop na largura/altura pedidas.
 * As trilhas em px são escaladas por largura / 1280; fr divide o espaço restante.
 */
export function computeGeometry(layout: DesktopLayout, width: number, height = (width * REF_HEIGHT) / REF_WIDTH): LayoutGeometry {
  const scale = width / REF_WIDTH
  const gap = layout.grid.gap * scale
  const pad = layout.grid.padding * scale
  const matrix = areaMatrix(layout.grid.areas)
  const nCols = matrix[0]?.length ?? 1
  const nRows = matrix.length
  const columns = solveTracks(layout.grid.columns, width - pad * 2 - gap * (nCols - 1), scale)
  const rows = solveTracks(layout.grid.rows, height - pad * 2 - gap * (nRows - 1), scale)
  const colStart = (i: number) => pad + columns.slice(0, i).reduce((a, b) => a + b, 0) + gap * i
  const rowStart = (i: number) => pad + rows.slice(0, i).reduce((a, b) => a + b, 0) + gap * i

  const rects: Record<string, Rect> = {}
  const edges: Record<string, Edges> = {}
  for (const region of layout.regions) {
    if (region.overlay) {
      rects[region.id] = overlayRect(region, width, height, scale)
      edges[region.id] = { top: false, right: false, bottom: false, left: false }
      continue
    }
    const b = areaBounds(matrix, region.id)
    if (!b) continue
    const x = colStart(b.c0)
    const y = rowStart(b.r0)
    rects[region.id] = {
      x,
      y,
      w: colStart(b.c1 - 1) + columns[b.c1 - 1] - x,
      h: rowStart(b.r1 - 1) + rows[b.r1 - 1] - y,
    }
    edges[region.id] = areaEdges(matrix, b)
  }
  return { scale, width, height, columns, rows, matrix, rects, edges }
}

/** Atalho público: retângulos de todas as regiões em px, na largura/altura pedidas. */
export function computeRegionRects(layout: DesktopLayout, width: number, height?: number): Record<string, Rect> {
  return computeGeometry(layout, width, height).rects
}
