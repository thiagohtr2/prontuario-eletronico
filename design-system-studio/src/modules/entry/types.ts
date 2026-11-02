import type { CatalogItem } from '@/core/types'

export type LandingArchitecture =
  | 'hero-centralizado'
  | 'hero-dividido'
  | 'assimetrica'
  | 'produto'
  | 'editorial'
  | 'cinematografica'
  | 'bento'
  | 'poster'
  | 'tipografia-monumental'
  | 'dashboard'
  | 'minimalista'
  | 'narrativa'

export const LANDING_ARCHITECTURES: { id: LandingArchitecture; name: string; description: string }[] = [
  { id: 'hero-centralizado', name: 'Hero centralizado', description: 'Título, texto e botão alinhados ao centro, no topo da página.' },
  { id: 'hero-dividido', name: 'Hero dividido', description: 'Texto de um lado e imagem ou produto do outro.' },
  { id: 'assimetrica', name: 'Composição assimétrica', description: 'Blocos de tamanhos diferentes, desalinhados de propósito.' },
  { id: 'produto', name: 'Apresentação de produto', description: 'O produto é o protagonista, com detalhes e especificações.' },
  { id: 'editorial', name: 'Layout editorial', description: 'Inspirado em revistas: colunas, tipografia e imagens grandes.' },
  { id: 'cinematografica', name: 'Página cinematográfica', description: 'Imagens de tela cheia e texto sobreposto, como um filme.' },
  { id: 'bento', name: 'Bento grid', description: 'Grade de cartões de tamanhos variados, como uma marmita japonesa.' },
  { id: 'poster', name: 'Composição em pôster', description: 'Uma única ideia visual forte, como um cartaz.' },
  { id: 'tipografia-monumental', name: 'Tipografia monumental', description: 'Letras enormes dominam a primeira dobra.' },
  { id: 'dashboard', name: 'Apresentação com dashboard', description: 'Mostra a interface do produto logo no hero.' },
  { id: 'minimalista', name: 'Página minimalista', description: 'Pouquíssimos elementos e muito espaço em branco.' },
  { id: 'narrativa', name: 'Landing com seções narrativas', description: 'Conta uma história em capítulos ao rolar a página.' },
]

export const architectureName = (id: LandingArchitecture) => LANDING_ARCHITECTURES.find((a) => a.id === id)?.name ?? id

/** Cores próprias da demonstração (usadas quando a prévia mostra as cores originais do modelo). */
export interface DemoColors {
  bg: string
  surface: string
  text: string
  muted: string
  primary: string
  onPrimary: string
  accent: string
}

/** Ilustrações vetoriais disponíveis para as demonstrações (desenhadas em SVG inline). */
export type Motif =
  | 'app'
  | 'leaf'
  | 'car'
  | 'house'
  | 'card'
  | 'ant'
  | 'shapes'
  | 'fridge'
  | 'planet'
  | 'cup'
  | 'heart'
  | 'gamepad'
  | 'mountain'
  | 'letter'
  | 'plate'
  | 'book'
  | 'headphones'
  | 'horizon'
  | 'bars'
  | 'dress'
  | 'jar'
  | 'pulse'
  | 'people'
  | 'frame'
  | 'envelope'
  | 'shield'

/** Textos da marca fictícia usados pela demonstração. Mesmo layout, conteúdos diferentes. */
export interface LandingContent {
  /** Nome exibido como logotipo. */
  logo: string
  nav: string[]
  /** A landing tem acesso à área restrita (botão “Entrar” no header). */
  login: boolean
  cta: string
  ctaAlt: string
  eyebrow: string
  title: string
  subtitle: string
  stats: { value: string; label: string }[]
  features: { title: string; text: string }[]
  quote: { text: string; author: string }
  closing: { title: string; text: string }
  footer: string[]
  motif: Motif
  /** Lista auxiliar usada conforme a arquitetura (manchetes, capítulos, produtos, itens do cardápio...). */
  items: string[]
  /** Segunda leitura da mesma arquitetura (detalhes de composição diferentes). */
  variant: 0 | 1
}

export interface LandingModel extends CatalogItem {
  /** Segmento/tema da marca fictícia, ex.: "SaaS e produtividade". */
  segment: string
  architecture: LandingArchitecture
  /** Ordem das seções, ex.: ['Header', 'Hero', 'Logos de clientes', ...]. */
  sections: string[]
  demo: DemoColors
  /** Id de FONT_OPTIONS usado nos títulos da demonstração. */
  headingFont: string
  /** Id de FONT_OPTIONS usado nos textos da demonstração (padrão: inter). */
  bodyFont?: string
  /** Raio de canto da demonstração em px. */
  radius: number
  content: LandingContent
}

/** Composições de login (uma por modelo). */
export type LoginLayout =
  | 'classico-central'
  | 'divisao-ilustrada'
  | 'divisao-invertida'
  | 'editorial-claro'
  | 'acesso-escuro'
  | 'produto-destaque'
  | 'cartao-elevado'
  | 'tela-cheia-clean'
  | 'marca-lateral'
  | 'acesso-corporativo'
  | 'bem-vindo-de-volta'
  | 'foto-editorial'
  | 'gradiente-discreto'
  | 'acesso-beneficios'
  | 'janela-compacta'
  | 'formulario-horizontal'
  | 'perfil-equipe'
  | 'acesso-etapas'
  | 'link-magico'
  | 'organizacao-equipe'
  | 'dividida-solida'
  | 'acesso-acolhedor'
  | 'login-qr'
  | 'acesso-responsivo'

export type LoginGroup = 'central' | 'dividida' | 'equipe' | 'especial'

export const LOGIN_GROUPS: { id: LoginGroup; name: string; description: string }[] = [
  { id: 'central', name: 'Centralizados', description: 'O formulário fica no meio da tela, com a marca por perto.' },
  { id: 'dividida', name: 'Divididos com visual', description: 'Metade da tela com imagem, cor ou mensagem; a outra metade com o formulário.' },
  { id: 'equipe', name: 'Empresas e equipes', description: 'Para sistemas usados por organizações, com espaços de trabalho e perfis.' },
  { id: 'especial', name: 'Fluxos especiais', description: 'Entrada por etapas, link por e-mail, QR code e outras formas de acesso.' },
]

export interface LoginModel extends CatalogItem {
  /** Tipo de composição, legível, ex.: "Formulário central com marca acima". */
  composition: string
  layout: LoginLayout
  group: LoginGroup
  /** Título e subtítulo exibidos na demonstração. */
  headline: string
  subline: string
}

export type SignupFlow =
  | 'mesma-tela'
  | 'pagina-propria'
  | 'etapas'
  | 'convite'
  | 'sem-senha'
  | 'social-sso'
  | 'perfil'
  | 'simplificado'

export interface SignupModel extends CatalogItem {
  flow: SignupFlow
  /** Campos solicitados, na ordem. */
  fields: string[]
  /** Título da tela de criação de conta na demonstração. */
  headline: string
  /** Texto do botão principal. */
  cta: string
  /** Etapas, quando o fluxo é dividido. */
  steps?: string[]
}
