import { DEFAULT_GEOMETRY, DEFAULT_TYPOGRAPHY } from './tokens'
import type { Geometry, TokenKey, Typography } from './types'

/**
 * O objeto de projeto é a fonte única da verdade do Studio. Os modos Guiado e Livre,
 * todas as prévias, o Master Prompt e as exportações leem daqui. Nenhum módulo guarda
 * escolhas do projeto em outro lugar.
 */

export type ProjectType = 'saas' | 'dashboard' | 'loja' | 'landing' | 'portfolio' | 'one-screen' | 'outro'

export type EntryFlow = 'landing-login' | 'landing-only' | 'login-only' | 'app-direct' | 'institutional'

/** Etapas do construtor guiado. As cinco primeiras formam o esqueleto. */
export type StepId =
  | 'objetivo'
  | 'entrada'
  | 'desktop'
  | 'mobile'
  | 'revisao'
  | 'preview'
  | 'identidade'
  | 'navegacao'
  | 'componentes'
  | 'entrega'

export const SKELETON_STEPS: StepId[] = ['objetivo', 'entrada', 'desktop', 'mobile', 'revisao']
export const FINISH_STEPS: StepId[] = ['preview', 'identidade', 'navegacao', 'componentes', 'entrega']
export const ALL_STEPS: StepId[] = [...SKELETON_STEPS, ...FINISH_STEPS]

export interface ProjectMeta {
  name: string
  objective: string
  description: string
  audience: string
  purpose: string
  projectType: ProjectType | null
  projectTypeOther: string
  features: string[]
  tech: string
}

export type PropValue = string | number | boolean

/** Uma instância de componente adicionada ao projeto. */
export interface ComponentInstance {
  id: string
  categoryId: string
  familyId: string
  /** Nome dado pelo usuário, ex.: "Botão principal do checkout". */
  label: string
  /** Configuração da instância (textos, ícones, tamanhos, cores próprias...). */
  props: Record<string, PropValue>
  /** Exceções individuais à paleta global. Vazio = herda tudo. */
  tokenOverrides: Partial<Record<TokenKey, string>>
  createdAt: string
}

export interface NavChoice {
  id: string
  /** Proposta de composição: cada modelo tem duas (0 ou 1). */
  variant: 0 | 1
}

export interface InspirationChoice {
  siteId: string
  /** Uma das oito propostas de paleta do conceito. */
  paletteId: string
  overrides: { bg?: string; text?: string; accent?: string }
}

export interface TemplateChoice {
  id: string
  overrides: {
    primary?: string
    bg?: string
    text?: string
    headingFont?: string
    bodyFont?: string
    radius?: Geometry['radius']
  }
  /** Partes do template marcadas para edição/geração de prompt. */
  sections: string[]
}

export interface ValidationConfig {
  url: string
  routes: string[]
  widths: number[]
  manualLogin: boolean
  waitMs: number
  checks: {
    horizontalOverflow: boolean
    offscreen: boolean
    tapTargets: boolean
    inputFontSize: boolean
  }
  minTapTarget: number
}

export interface ValidationIssue {
  page: string
  width: number
  type: string
  severity: 'alta' | 'media' | 'baixa'
  element: string
  description: string
  suggestion: string
}

export interface ValidationReport {
  tool: string
  generatedAt: string
  baseUrl: string
  widths: number[]
  pages: string[]
  issues: ValidationIssue[]
}

export interface Project {
  schema: 'atelier-ui/project'
  version: 1
  id: string
  createdAt: string
  updatedAt: string
  meta: ProjectMeta
  mode: 'guided' | 'free'
  depth: 'essential' | 'advanced'
  prefs: {
    /** Etiquetas HEADER/SIDEBAR/CONTEÚDO nos desenhos (compartilhado desktop + mobile). */
    showLegends: boolean
    /** Explicações para leigos. */
    showHints: boolean
  }
  guided: {
    step: StepId
    completed: StepId[]
    skeletonApproved: boolean
  }
  entry: {
    flow: EntryFlow | null
    landingId: string | null
    loginId: string | null
    signupId: string | null
    /** Exceção explícita: a landing mantém as cores originais do modelo em vez da paleta global. */
    landingUsesOriginalColors: boolean
  }
  layout: {
    desktopId: string | null
    mobileId: string | null
  }
  identity: {
    paletteId: string
    /** Alterações individuais de tokens sobre a paleta escolhida. */
    overrides: Partial<Record<TokenKey, string>>
    typography: Typography
    geometry: Geometry
  }
  navigation: {
    header: NavChoice | null
    sidebar: NavChoice | null
  }
  components: ComponentInstance[]
  inspiration: InspirationChoice | null
  template: TemplateChoice | null
  prompt: {
    /** Chaves de itens que o usuário retirou do Master Prompt (a seleção continua salva). */
    excluded: string[]
    /** Observações/exceções escritas pelo usuário por item. */
    notes: Record<string, string>
    /** Decisões sobre contradições detectadas: id do conflito → opção escolhida. */
    conflictResolutions: Record<string, string>
  }
  validation: {
    config: ValidationConfig
    report: ValidationReport | null
  }
}

export const DEFAULT_PALETTE_ID = 'neutro-essencial'

export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  url: '',
  routes: ['/'],
  widths: [320, 360, 375, 390, 412, 430, 768, 1024, 1280, 1440],
  manualLogin: false,
  waitMs: 800,
  checks: { horizontalOverflow: true, offscreen: true, tapTargets: true, inputFontSize: true },
  minTapTarget: 44,
}

export function uid(prefix = 'id'): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}_${rand}`
}

export function createProject(): Project {
  const now = new Date().toISOString()
  return {
    schema: 'atelier-ui/project',
    version: 1,
    id: uid('prj'),
    createdAt: now,
    updatedAt: now,
    meta: {
      name: '',
      objective: '',
      description: '',
      audience: '',
      purpose: '',
      projectType: null,
      projectTypeOther: '',
      features: [],
      tech: '',
    },
    mode: 'guided',
    depth: 'essential',
    prefs: { showLegends: true, showHints: true },
    guided: { step: 'objetivo', completed: [], skeletonApproved: false },
    entry: { flow: null, landingId: null, loginId: null, signupId: null, landingUsesOriginalColors: false },
    layout: { desktopId: null, mobileId: null },
    identity: {
      paletteId: DEFAULT_PALETTE_ID,
      overrides: {},
      typography: { ...DEFAULT_TYPOGRAPHY },
      geometry: { ...DEFAULT_GEOMETRY },
    },
    navigation: { header: null, sidebar: null },
    components: [],
    inspiration: null,
    template: null,
    prompt: { excluded: [], notes: {}, conflictResolutions: {} },
    validation: { config: { ...DEFAULT_VALIDATION_CONFIG, checks: { ...DEFAULT_VALIDATION_CONFIG.checks } }, report: null },
  }
}

export const PROJECT_TYPES: { id: ProjectType; name: string; description: string }[] = [
  { id: 'saas', name: 'Aplicativo ou SaaS', description: 'Sistema com login, onde as pessoas trabalham, cadastram e acompanham informações.' },
  { id: 'dashboard', name: 'Dashboard', description: 'Painel com indicadores, gráficos e tabelas para acompanhar números.' },
  { id: 'loja', name: 'Loja ou catálogo', description: 'Vitrine de produtos com categorias, detalhes e carrinho ou contato.' },
  { id: 'landing', name: 'Landing page', description: 'Página que apresenta um produto ou serviço e convida a pessoa a agir.' },
  { id: 'portfolio', name: 'Portfólio', description: 'Apresentação de trabalhos, projetos ou de uma marca pessoal.' },
  { id: 'one-screen', name: 'One Screen', description: 'Interface que cabe inteira em uma única tela, sem rolagem principal: painéis, quiosques, TVs.' },
  { id: 'outro', name: 'Outro tipo', description: 'Descreva com suas palavras o que pretende construir.' },
]

export const ENTRY_FLOWS: { id: EntryFlow; name: string; description: string; needsLanding: boolean; needsLogin: boolean }[] = [
  { id: 'landing-login', name: 'Landing page com chamada para login', description: 'Página pública de apresentação e um botão “Entrar” que leva ao login do sistema.', needsLanding: true, needsLogin: true },
  { id: 'landing-only', name: 'Landing page sem login', description: 'Só a página de apresentação. Não existe área restrita.', needsLanding: true, needsLogin: false },
  { id: 'login-only', name: 'Apenas login', description: 'O endereço abre direto na tela de entrar. Sem página de apresentação.', needsLanding: false, needsLogin: true },
  { id: 'app-direct', name: 'Aplicação diretamente', description: 'O sistema abre direto na tela principal, sem apresentação nem login.', needsLanding: false, needsLogin: false },
  { id: 'institutional', name: 'Página institucional', description: 'Site informativo da empresa ou serviço, com várias seções públicas.', needsLanding: true, needsLogin: false },
]

/** Sugestões de arquitetura por tipo de projeto. São sugestões — nunca obrigatórias. */
export const SUGGESTIONS: Record<ProjectType, { entryFlow: EntryFlow; desktop: string[]; mobile: string[]; note: string }> = {
  saas: { entryFlow: 'landing-login', desktop: ['sidebar-integral-classica', 'sidebar-integral-header-global', 'rail-sidebar-contextual'], mobile: ['bottom-nav-classica', 'topbar-hamburguer', 'topbar-bottom-nav'], note: 'Sistemas costumam usar menu lateral fixo no computador e navegação inferior no celular.' },
  dashboard: { entryFlow: 'login-only', desktop: ['sidebar-integral-classica', 'dashboard-tres-colunas', 'analytics-lateral-direita'], mobile: ['bottom-nav-classica', 'topbar-abas', 'drawer-esquerda'], note: 'Dashboards precisam de espaço horizontal para gráficos: menus compactos ajudam.' },
  loja: { entryFlow: 'landing-login', desktop: ['topbar-integral-fixa', 'topbar-duas-linhas', 'header-central-flutuante'], mobile: ['bottom-nav-cinco', 'header-busca-menu-flutuante', 'topbar-busca'], note: 'Lojas priorizam busca e categorias no topo.' },
  landing: { entryFlow: 'landing-only', desktop: ['landing-editorial-ampla', 'header-central-flutuante', 'minimalista-sem-lateral'], mobile: ['topbar-hamburguer', 'menu-fullscreen', 'topbar-flutuante-compacta'], note: 'Landing pages costumam ter apenas um header e conteúdo em seções.' },
  portfolio: { entryFlow: 'landing-only', desktop: ['portfolio-full-bleed', 'editorial-assimetrica', 'magazine-indice-lateral'], mobile: ['menu-editorial-fullscreen', 'topbar-hamburguer', 'bottom-minimalista'], note: 'Portfólios valorizam imagens grandes e navegação discreta.' },
  'one-screen': { entryFlow: 'app-direct', desktop: ['one-screen-dashboard', 'one-screen-painel-operacional', 'one-screen-kiosk'], mobile: ['one-screen-bottom-nav', 'one-screen-abas', 'one-screen-kiosk'], note: 'One Screen precisa caber na tela sem esconder informação importante.' },
  outro: { entryFlow: 'landing-login', desktop: ['sidebar-integral-classica', 'topbar-integral-fixa'], mobile: ['bottom-nav-classica', 'topbar-hamburguer'], note: 'Escolha livremente a estrutura que fizer sentido.' },
}
