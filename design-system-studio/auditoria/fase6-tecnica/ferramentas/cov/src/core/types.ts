/**
 * Contratos compartilhados entre todos os módulos do Studio.
 *
 * Regra de arquitetura: os catálogos (`catalog.ts` de cada módulo) contêm apenas dados —
 * nada de JSX. Os renderizadores ficam em arquivos `.tsx` separados. Assim o motor de
 * prompts e os testes conseguem ler os catálogos sem renderizar nada.
 */

/** Descrição técnica de um item, consumida pelo motor de prompts. */
export interface ItemSpec {
  /** Uma frase que resume a escolha, em linguagem técnica. */
  summary: string
  /** Como o item é organizado: regiões, ordem, hierarquia, composição. */
  structure: string[]
  /** Interações e estados: abertura de menus, hover, foco, seleção, colapso... */
  behavior?: string[]
  /** Regras próprias de responsividade. Obrigatório: nenhum item funciona só no desktop. */
  responsive: string[]
  /** Medidas recomendadas (não fixas), ex.: { sidebar: '≈252 px' }. */
  measurements?: Record<string, string>
  /** Observações adicionais para a IA desenvolvedora. */
  notes?: string[]
}

/** Base comum de qualquer item de catálogo. */
export interface CatalogItem {
  /** Identificador estável, kebab-case, único dentro do catálogo. */
  id: string
  name: string
  /** Explicação curta para leigos (1–2 frases). */
  description: string
  tags?: string[]
  spec: ItemSpec
}

/* -------------------------------------------------------------------------- */
/* Identidade visual                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Tokens semânticos completos de uma identidade visual. Toda prévia que respeita a
 * herança global recebe este objeto. Nunca use cores fixas em componentes que deveriam
 * herdar a paleta do projeto.
 */
export interface ThemeTokens {
  mode: 'light' | 'dark'
  // Marca
  primary: string
  primaryHover: string
  primaryActive: string
  onPrimary: string
  primarySoft: string
  secondary: string
  onSecondary: string
  accent: string
  onAccent: string
  // Fundos e superfícies
  bg: string
  bgAlt: string
  surface: string
  surfaceAlt: string
  // Texto
  text: string
  textMuted: string
  textDisabled: string
  placeholder: string
  // Bordas e foco
  border: string
  borderStrong: string
  focusRing: string
  // Estados interativos
  hover: string
  active: string
  pressed: string
  selected: string
  selectedText: string
  disabled: string
  disabledText: string
  // Semânticos
  success: string
  successBg: string
  warning: string
  warningBg: string
  error: string
  errorBg: string
  info: string
  infoBg: string
  // Links, ícones e navegação
  link: string
  linkHover: string
  icon: string
  navBg: string
  navText: string
  navActive: string
  navActiveText: string
  // Gradiente (opcional)
  gradientFrom: string
  gradientTo: string
  gradientEnabled: boolean
}

export type TokenKey = Exclude<keyof ThemeTokens, 'mode' | 'gradientEnabled'>

export interface Typography {
  /** Id de uma família em `FONT_OPTIONS`. */
  heading: string
  body: string
  /** Escala base em px (14–18). */
  baseSize: number
  headingWeight: number
  bodyWeight: number
}

export type RadiusScale = 'none' | 'small' | 'medium' | 'large' | 'pill'
export type ShadowLevel = 'none' | 'subtle' | 'medium' | 'strong'
export type SurfaceStyle = 'flat' | 'outlined' | 'elevated' | 'glass'
export type Density = 'compact' | 'comfortable' | 'spacious'

export interface Geometry {
  radius: RadiusScale
  borderWidth: 0 | 1 | 2
  shadow: ShadowLevel
  surface: SurfaceStyle
  density: Density
  iconStyle: 'outline' | 'filled' | 'duotone'
}

/** Tokens resolvidos + tipografia + geometria: tudo que uma prévia precisa para herdar a identidade. */
export interface ResolvedTheme {
  tokens: ThemeTokens
  typography: Typography
  geometry: Geometry
  /** Valores numéricos derivados da geometria, prontos para uso em estilos inline. */
  metrics: {
    radiusSm: number
    radiusMd: number
    radiusLg: number
    borderWidth: number
    shadow: string
    spacing: number
    headingFont: string
    bodyFont: string
  }
}

/* -------------------------------------------------------------------------- */
/* Dispositivos                                                                */
/* -------------------------------------------------------------------------- */

export type Device = 'desktop' | 'tablet' | 'mobile'
