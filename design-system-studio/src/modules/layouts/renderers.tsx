import type { ReactNode } from 'react'
import type { ResolvedTheme } from '@/core/types'
import type { DesktopLayout, LayoutRegion, MobileLayout } from './types'

export interface DesktopSchematicProps {
  layout: DesktopLayout
  /** Largura em px em que o desenho é renderizado (as medidas do grid são escaladas a partir de 1280). */
  width: number
  /** Altura em px (padrão: proporção 16:10). */
  height?: number
  showLegends: boolean
  /** Tema opcional; sem tema, usa a estética neutra de esquema. */
  theme?: ResolvedTheme
  /** Permite à Live Preview preencher cada região com conteúdo real. */
  renderRegion?: (region: LayoutRegion, size: { scale: number }) => ReactNode
}

export function DesktopSchematic(_props: DesktopSchematicProps) {
  return null
}

export interface PhonePreviewProps {
  layout: MobileLayout
  theme: ResolvedTheme
  showLegends: boolean
  /** Largura da tela do celular em px (altura = 2 × largura). */
  width?: number
  interactive?: boolean
}

export function PhonePreview(_props: PhonePreviewProps) {
  return null
}
