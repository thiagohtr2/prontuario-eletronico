import type { CatalogItem } from '@/core/types'

/**
 * Tipos de seção da biblioteca reutilizável do Template Studio. Cada tipo tem um
 * renderizador (`render/*.tsx`) que se adapta a desktop e celular, e uma descrição
 * técnica (`sections.ts`) usada para gerar a especificação do template.
 */
export type SectionKind =
  | 'nav'
  | 'hero-split'
  | 'hero-centered'
  | 'hero-image'
  | 'hero-editorial'
  | 'hero-event'
  | 'hero-search'
  | 'hero-product'
  | 'hero-app'
  | 'hero-countdown'
  | 'logos'
  | 'features-grid'
  | 'feature-split'
  | 'steps'
  | 'stats'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'gallery'
  | 'team'
  | 'blog-list'
  | 'product-grid'
  | 'listings'
  | 'menu'
  | 'schedule'
  | 'contact'
  | 'newsletter'
  | 'cta-band'
  | 'donate'
  | 'footer'
  // Regiões de aplicação (layout "dashboard")
  | 'dash-sidebar'
  | 'dash-topbar'
  | 'dash-kpis'
  | 'dash-chart'
  | 'dash-activity'
  | 'dash-table'
  // Regiões de documentação (layout "docs")
  | 'docs-sidebar'
  | 'docs-article'
  | 'docs-toc'
  | 'docs-pager'

/** Ilustrações em SVG inline (o Studio funciona offline: nada de imagens externas). */
export type ArtKind =
  | 'ui'
  | 'phone'
  | 'card'
  | 'chart'
  | 'abstract'
  | 'blob'
  | 'landscape'
  | 'beach'
  | 'forest'
  | 'city'
  | 'building'
  | 'room'
  | 'food'
  | 'pastry'
  | 'coffee'
  | 'portrait'
  | 'product'
  | 'bottle'
  | 'shoe'
  | 'bag'
  | 'garment'
  | 'fitness'
  | 'mic'
  | 'stage'
  | 'book'
  | 'camera'
  | 'plant'

/** Ícones disponíveis nas seções (mapeados para lucide-react no renderizador). */
export type IconName =
  | 'zap'
  | 'shield'
  | 'chart'
  | 'users'
  | 'clock'
  | 'globe'
  | 'heart'
  | 'star'
  | 'check'
  | 'lock'
  | 'card'
  | 'phone'
  | 'mail'
  | 'map'
  | 'calendar'
  | 'leaf'
  | 'truck'
  | 'refresh'
  | 'gift'
  | 'sparkles'
  | 'book'
  | 'play'
  | 'mic'
  | 'camera'
  | 'coffee'
  | 'utensils'
  | 'bed'
  | 'wifi'
  | 'car'
  | 'dumbbell'
  | 'stethoscope'
  | 'scale'
  | 'briefcase'
  | 'home'
  | 'search'
  | 'message'
  | 'code'
  | 'layers'
  | 'target'
  | 'award'
  | 'music'
  | 'ticket'
  | 'sun'
  | 'droplet'
  | 'battery'
  | 'smartphone'
  | 'headphones'
  | 'pen'
  | 'palette'
  | 'trending'
  | 'pie'
  | 'bell'
  | 'settings'
  | 'folder'
  | 'file'
  | 'download'
  | 'wallet'
  | 'package'
  | 'inbox'
  | 'dashboard'
  | 'rocket'
  | 'cloud'
  | 'terminal'
  | 'graduation'
  | 'trophy'
  | 'handshake'
  | 'gavel'
  | 'building'
  | 'sprout'
  | 'tree'
  | 'recycle'
  | 'heart-pulse'
  | 'brain'
  | 'baby'
  | 'eye'
  | 'smile'
  | 'activity'
  | 'timer'
  | 'waves'
  | 'mountain'
  | 'plane'
  | 'flame'
  | 'wind'
  | 'accessibility'
  | 'parking'
  | 'bus'
  | 'video'
  | 'hash'
  | 'lightbulb'
  | 'megaphone'
  | 'percent'
  | 'tag'
  | 'gem'
  | 'compass'
  | 'luggage'
  | 'key'
  | 'ruler'
  | 'bath'
  | 'sofa'
  | 'wine'
  | 'croissant'

/** Item genérico de conteúdo de uma seção. Cada renderizador usa os campos que fizerem sentido. */
export interface SectionItem {
  title: string
  text?: string
  /** Metadado curto: preço, data, cargo, duração... */
  meta?: string
  /** Selo curto: "Novo", "Mais vendido"... */
  tag?: string
  icon?: IconName
  /** Valor numérico de destaque (estatísticas, KPIs, preços). */
  value?: string
  art?: ArtKind
  /** Item em destaque (plano recomendado, prato do chef...). */
  highlight?: boolean
  /** Sublista (benefícios de um plano, aulas de um módulo...). */
  list?: string[]
}

export type SectionTone = 'bg' | 'surface' | 'primary' | 'invert'

export interface TemplateSection {
  /** Identificador estável dentro do template (kebab-case). */
  id: string
  name: string
  description: string
  /** Tipo de seção da biblioteca reutilizável. */
  kind: SectionKind
  /** Variante visual do tipo (ex.: 'cards', 'single', 'masonry'). */
  variant?: string
  /** Fundo da seção. Padrão: fundo do template. */
  tone?: SectionTone
  eyebrow?: string
  title?: string
  text?: string
  cta?: string
  cta2?: string
  /** Linha auxiliar curta: preço, prova social, aviso, data... */
  note?: string
  art?: ArtKind
  items?: SectionItem[]
  /** Links de navegação/rodapé. */
  links?: string[]
}

export interface TemplateCategory {
  id: string
  name: string
  description: string
}

export interface TemplateModel extends CatalogItem {
  /** Id de uma categoria em `TEMPLATE_CATEGORIES`. */
  category: string
  /** Marca fictícia usada no conteúdo de demonstração. */
  brand: string
  /** Composição geral: seções empilhadas (padrão), aplicação com sidebar ou documentação. */
  layout?: 'stack' | 'dashboard' | 'docs'
  /** Cores padrão do template. */
  colors: { primary: string; bg: string; text: string; surface: string; muted: string }
  headingFont: string
  bodyFont: string
  radius: 'none' | 'small' | 'medium' | 'large' | 'pill'
  /** Partes editáveis/selecionáveis do template, na ordem em que aparecem. */
  sections: TemplateSection[]
}
