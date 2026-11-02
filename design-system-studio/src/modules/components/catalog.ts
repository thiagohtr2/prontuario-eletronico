import type { PropValue } from '@/core/project'
import { componentCategoriesData, defaultValues } from './categories'
import { visualFamilies as families } from './families'
import type { ComponentCategory, ComponentGroup, ComponentValues, VisualFamily } from './types'

/** 66 categorias, na ordem da especificação (dados puros, sem JSX). */
export const componentCategories: ComponentCategory[] = componentCategoriesData
/** 16 famílias visuais. */
export const visualFamilies: VisualFamily[] = families

export const categoryById = (id: string | null | undefined) => componentCategories.find((c) => c.id === id)
export const familyById = (id: string | null | undefined) => visualFamilies.find((f) => f.id === id)

export const categoriesByGroup = (group: ComponentGroup) => componentCategories.filter((c) => c.group === group)

/** Categorias essenciais mostradas primeiro no modo guiado. */
export const ESSENTIAL_CATEGORY_IDS = [
  'botoes',
  'text-inputs',
  'cards',
  'tabelas',
  'modais',
  'tabs',
  'headers-topbars',
  'formularios',
  'alertas',
  'badges-tags',
]

/** Valores efetivos de uma instância: padrões da categoria sobrepostos pela configuração da instância. */
export function resolveValues(category: ComponentCategory | undefined, props: Record<string, PropValue> = {}): ComponentValues {
  return { ...(category ? defaultValues(category.params) : {}), ...props }
}
