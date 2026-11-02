import type { PropValue } from '@/core/project'
import type { CatalogItem } from '@/core/types'

export type ComponentGroup = 'fundamentos' | 'campos' | 'navegacao' | 'dados' | 'sobreposicoes' | 'paginas'

export const COMPONENT_GROUPS: { id: ComponentGroup; name: string }[] = [
  { id: 'fundamentos', name: 'Estilo e fundamentos' },
  { id: 'campos', name: 'Campos e controles' },
  { id: 'navegacao', name: 'Botões e navegação' },
  { id: 'dados', name: 'Dados e componentes' },
  { id: 'sobreposicoes', name: 'Sobreposições e alertas' },
  { id: 'paginas', name: 'Páginas e experiências' },
]

/** Parâmetro editável de um componente (o editor mostra só os parâmetros da categoria). */
export interface ParamDef {
  key: string
  label: string
  type: 'text' | 'textarea' | 'icon' | 'color' | 'number' | 'select' | 'boolean'
  default: PropValue
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  unit?: string
  /** Agrupamento no editor. */
  group: 'Conteúdo' | 'Aparência' | 'Tamanho' | 'Estados'
  /** Nome da parte da prévia que, ao ser clicada, abre este parâmetro (edição por clique). */
  part?: string
  help?: string
}

export const PARAM_GROUPS: ParamDef['group'][] = ['Conteúdo', 'Aparência', 'Tamanho', 'Estados']

export interface ComponentCategory extends CatalogItem {
  group: ComponentGroup
  /** Número de 1 a 66, na ordem da especificação. */
  number: number
  params: ParamDef[]
}

/**
 * Parâmetros de estilo de uma família visual. São dados (sem cores fixas): as cores vêm
 * sempre da paleta global e a família apenas as transforma (gradiente, superfície escura
 * derivada, papel, vidro...). Todos os valores são `PropValue`, então o tipo continua
 * compatível com `Record<string, PropValue>`.
 */
export type FamilyStyle = {
  /** Raio de controles (botões, campos, chips) em px. 999 = pílula. */
  radius: number
  /** Raio de contêineres (cards, modais, painéis) em px. */
  radiusCard: number
  borderWidth: number
  borderStyle: 'solid' | 'dashed' | 'none'
  /** De onde vem a cor da borda: sutil, forte, tinta (cor do texto), clara (vidro) ou destaque. */
  borderTone: 'subtle' | 'strong' | 'ink' | 'light' | 'accent'
  shadow: 'none' | 'hairline' | 'soft' | 'float' | 'hard' | 'neu' | 'glow' | 'deep' | 'tonal' | 'print' | 'press'
  /** Como as superfícies são derivadas dos tokens globais. */
  surface: 'plain' | 'tint' | 'glass' | 'dark' | 'midnight' | 'paper' | 'neu' | 'aurora' | 'concrete' | 'tonal'
  /** Fundo do palco da prévia (contexto em que o componente vive). */
  backdrop: 'plain' | 'alt' | 'tint' | 'blobs' | 'aurora' | 'grid' | 'paper' | 'dark' | 'dots' | 'wash' | 'neu'
  /** Preenchimento da ação principal. */
  fill: 'solid' | 'gradient' | 'metal' | 'ivory' | 'accent' | 'press' | 'aurora'
  /** Estilo dos campos de formulário. */
  field: 'tonal' | 'outline' | 'underline' | 'inset' | 'glass' | 'filled'
  /** Id em `FONT_OPTIONS` para textos. */
  font: string
  /** Id em `FONT_OPTIONS` para títulos. */
  headingFont: string
  headingWeight: number
  /** Peso de botões, abas e rótulos de interface. */
  uiWeight: number
  /** Caixa de botões, rótulos e sobretítulos. */
  textCase: 'none' | 'uppercase'
  /** Espaçamento entre letras de rótulos (em). */
  tracking: number
  /** Espaçamento entre letras de títulos (em). */
  headingTracking: number
  /** Tamanho base do texto da interface (px). */
  fontSize: number
  /** Escala de espaçamento interno (1 = confortável). */
  density: number
  /** Altura de botões e campos (px). */
  controlHeight: number
  iconStroke: number
  iconTreatment: 'plain' | 'circle' | 'square' | 'soft-tile' | 'outline-box' | 'app-tile' | 'gradient-tile' | 'stamp'
  /** Como o item ativo (abas, menus, navegação) é marcado. */
  indicator: 'pill' | 'underline' | 'bar' | 'block' | 'inset' | 'glow' | 'tonal'
  focus: 'ring' | 'outline' | 'glow' | 'offset' | 'dashed'
  /** Como mídias/ilustrações entram nos cartões: sangrando, recuadas, afundadas, emolduradas ou com faixa técnica. */
  media: 'bleed' | 'inset' | 'sunken' | 'framed' | 'strip'
  /** Composição e organização interna, em linguagem técnica. */
  composition: string
  /** Acabamento e detalhes. */
  finish: string
  /** Movimento e resposta a interações. */
  motion: string
}

/** Uma linguagem visual aplicada a todas as categorias (16 famílias). */
export interface VisualFamily extends CatalogItem {
  /** Número de 1 a 16. */
  number: number
  /** Etiquetas de filtro (claras, escuras, expressivas, sóbrias, compactas). */
  tags: string[]
  /** Parâmetros de estilo que diferenciam a família de verdade (geometria, bordas, densidade...). */
  style: FamilyStyle
}

/** Estados que o editor permite visualizar. */
export type PreviewState = 'normal' | 'hover' | 'focus' | 'active' | 'disabled'

export const PREVIEW_STATES: { id: PreviewState; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'hover', label: 'Hover' },
  { id: 'focus', label: 'Focus' },
  { id: 'active', label: 'Active' },
  { id: 'disabled', label: 'Disabled' },
]

/** Valores efetivos de uma instância (padrões da categoria + configuração da instância). */
export type ComponentValues = Record<string, PropValue>
