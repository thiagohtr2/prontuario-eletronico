import type { ItemDescription } from '@/core/describe'
import type { ComponentInstance } from '@/core/project'
import type { ResolvedTheme } from '@/core/types'
import { categoryById, familyById } from './catalog'

/** Descreve uma instância de componente para o motor de prompts. (Refinado pelo módulo de componentes.) */
export function describeComponent(instance: ComponentInstance, _theme: ResolvedTheme): ItemDescription {
  const category = categoryById(instance.categoryId)
  const family = familyById(instance.familyId)
  return {
    name: instance.label || category?.name || instance.categoryId,
    variant: family?.name ?? instance.familyId,
    summary: category?.spec.summary ?? `Componente ${instance.categoryId}.`,
    properties: instance.props,
    structure: category?.spec.structure ?? [],
    behavior: category?.spec.behavior ?? [],
    responsive: category?.spec.responsive ?? ['Adapte o componente a telas a partir de 320 px sem overflow horizontal.'],
    exceptions: Object.entries(instance.tokenOverrides).map(([k, v]) => `Exceção individual: ${k} = ${v} (não herda a paleta global).`),
  }
}
