import type { CatalogItem } from '@/core/types'

/** Uma das oito propostas de paleta de cada conceito. */
export interface SitePalette {
  id: 'original' | 'minimalista' | 'escura' | 'editorial' | 'tecnologica' | 'natural' | 'criativa' | 'arenito'
  name: string
  bg: string
  surface: string
  text: string
  muted: string
  accent: string
  onAccent: string
  /** Cor de apoio usada em ilustrações e blocos. */
  secondary: string
}

export type PaletteId = SitePalette['id']

/** Grupo usado no filtro da galeria. */
export type InspirationCategory = 'produtos' | 'servicos' | 'tecnologia' | 'editorial'

export interface InspirationSite extends CatalogItem {
  /** Marca fictícia, ex.: "Verdant Atelier". */
  brand: string
  segment: string
  /** Arquitetura/composição dominante, ex.: 'hero cinematográfico com produto monumental'. */
  composition: string
  /** Seções na ordem em que aparecem. */
  sections: string[]
  headingFont: string
  bodyFont: string
  palettes: SitePalette[]
  /** Grupo do filtro da galeria. */
  category: InspirationCategory
  /** Clima da paleta original. */
  mood: 'claro' | 'escuro'
  /** Endereço fictício exibido na barra do navegador da prévia. */
  domain: string
}

/** Dispositivo em que um site de inspiração é desenhado. */
export type SiteDevice = 'desktop' | 'mobile'

/** Propriedades que todo site de inspiração recebe. */
export interface SiteProps {
  /** Paleta já com os ajustes (overrides) aplicados. */
  palette: SitePalette
  device: SiteDevice
}
