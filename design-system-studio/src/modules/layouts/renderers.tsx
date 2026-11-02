/**
 * Renderizadores dos layouts (sem dados de catálogo aqui).
 *
 * - `DesktopSchematic`: desenha o grid real de um layout desktop em qualquer largura.
 *   Para a Live Preview, passe `theme` e `renderRegion(region, { scale, width, height })`
 *   para preencher cada região com interface real; devolver `null` mantém o desenho padrão.
 * - `PhonePreview`: celular composicional montado a partir de `layout.config`, herdando o tema.
 */
export { DesktopSchematic } from './schematic'
export type { DesktopSchematicProps, RegionSize } from './schematic'
export { PhonePreview, phoneMenu, thumbShowsMenu, PHONE_BASE } from './phone'
export type { PhonePreviewProps } from './phone'
export { computeRegionRects, computeGeometry } from './geometry'
export type { Rect } from './geometry'
