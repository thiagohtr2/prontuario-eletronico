import type { PropValue } from './project'
import type { CatalogItem } from './types'

/**
 * Descrição de um item escolhido, no formato que o motor de prompts entende.
 * Módulos com itens configuráveis (componentes, inspiração, templates) exportam
 * funções `describe…` puras (sem JSX) que devolvem este formato.
 */
export interface ItemDescription {
  name: string
  variant?: string
  summary: string
  properties?: Record<string, PropValue>
  colors?: Record<string, string>
  structure: string[]
  behavior?: string[]
  responsive: string[]
  measurements?: Record<string, string>
  exceptions?: string[]
  notes?: string[]
}

/** Converte um item de catálogo simples em descrição. */
export function describeCatalogItem(item: CatalogItem, extra: Partial<ItemDescription> = {}): ItemDescription {
  return {
    name: item.name,
    summary: item.spec.summary,
    structure: item.spec.structure,
    behavior: item.spec.behavior ?? [],
    responsive: item.spec.responsive,
    measurements: item.spec.measurements ?? {},
    notes: item.spec.notes ?? [],
    ...extra,
  }
}
