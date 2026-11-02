import type { ReactElement } from 'react'
import type { ComponentValues, PreviewState } from './types'

/** Props de todo renderizador de categoria. O "look" (família + paleta) vem do contexto. */
export interface RP {
  v: ComponentValues
  /** Estado aplicado ao elemento interativo principal. */
  st: PreviewState
  /** Prévia grande (editor). */
  large?: boolean
}

export interface RendererDef {
  render: (p: RP) => ReactElement | null
  /** center = centralizado com respiro; top = alinhado ao topo (menus que abrem); fill = ocupa o palco (páginas). */
  frame?: 'center' | 'top' | 'fill'
}

export type RendererMap = Record<string, RendererDef>
