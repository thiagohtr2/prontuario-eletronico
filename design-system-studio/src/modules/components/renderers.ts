import { BASE_RENDERERS } from './render-base'
import { NAV_DATA_RENDERERS } from './render-nav-data'
import { PAGE_RENDERERS } from './render-pages'
import type { RendererDef, RendererMap } from './render-types'

/** Um renderizador por categoria (66), indexado pelo id da categoria. */
export const RENDERERS: RendererMap = { ...BASE_RENDERERS, ...NAV_DATA_RENDERERS, ...PAGE_RENDERERS }

export const rendererFor = (categoryId: string): RendererDef | undefined => RENDERERS[categoryId]
