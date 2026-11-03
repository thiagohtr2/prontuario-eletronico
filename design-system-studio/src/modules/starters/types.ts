import type { EntryFlow, NavChoice, PageKind, ProjectType, PropValue, StoriesScope, WideBehavior } from '@/core/project'
import type { Geometry, TokenKey, Typography } from '@/core/types'

/**
 * Manifesto de um modelo de site completo (a “Galeria de inspiração” como biblioteca de projetos).
 *
 * Um modelo não traz componentes próprios: ele aponta para os catálogos que o Studio já tem
 * (layouts, header, sidebar, páginas de entrada, paletas, famílias visuais e categorias de
 * componentes) e define o conteúdo de demonstração de cada instância. Aplicar um modelo gera um
 * projeto comum — a prévia, os editores, o JSON e o Master Prompt leem os mesmos dados.
 */

export type StarterGroup = 'sistemas' | 'ecommerce' | 'institucional' | 'produtos' | 'landing' | 'especializadas'

export const STARTER_GROUPS: { id: StarterGroup; name: string; description: string }[] = [
  { id: 'sistemas', name: 'Sistemas e dashboards', description: 'Áreas logadas para trabalhar: gestão, agenda, finanças, operações.' },
  { id: 'ecommerce', name: 'E-commerce', description: 'Lojas com vitrine, produto, carrinho e checkout.' },
  { id: 'institucional', name: 'Sites institucionais', description: 'Empresas e serviços que se apresentam e convertem contatos.' },
  { id: 'produtos', name: 'Produtos digitais', description: 'Plataformas, ferramentas e comunidades usadas todos os dias.' },
  { id: 'landing', name: 'Landing pages', description: 'Uma página que apresenta e converte.' },
  { id: 'especializadas', name: 'Interfaces especializadas', description: 'One Screen, painéis operacionais, quiosques e monitoramento.' },
]

/** Instância de componente do modelo (vira uma `ComponentInstance` do projeto ao aplicar). */
export interface StarterComponent {
  /** Id estável dentro do modelo (ex.: 'kpi-leitos'). */
  id: string
  categoryId: string
  /** Família visual; sem ela vale a família padrão do modelo. */
  familyId?: string
  /** Nome que aparece no editor e no prompt (ex.: “Leitos ocupados”). */
  label: string
  props: Record<string, PropValue>
  tokenOverrides?: Partial<Record<TokenKey, string>>
}

export interface StarterPage {
  id: string
  name: string
  kind: PageKind
  purpose: string
  /** Item do menu que abre a página; vazio = página secundária. */
  navItem: string
  blocks: { component: string; span: number; height?: number }[]
  /** Conteúdo do painel lateral do layout (quando o layout desktop tem região de painel/detalhes). */
  aside?: { component: string; span: number; height?: number }[]
}

/** Uma das combinações de cores curadas para o modelo (a primeira é a original). */
export interface StarterPalette {
  id: string
  name: string
  /** Paleta do catálogo do Studio (todos os tokens: base, estados, semânticos e navegação). */
  paletteId: string
  /** Ajustes pontuais sobre a paleta (cores de base recalculam os estados). */
  overrides?: Partial<Record<TokenKey, string>>
}

export interface SiteStarter {
  id: string
  /** Versão do manifesto: projetos guardam a versão usada (o catálogo pode evoluir depois). */
  version: number
  name: string
  /** Marca fictícia do modelo (vira o nome do projeto, editável). */
  brand: string
  group: StarterGroup
  sector: string
  description: string
  /** Direção de arte em uma frase: o que torna este modelo diferente dos outros. */
  artDirection: string
  tags: string[]
  projectType: ProjectType
  objective: string
  audience: string
  features: string[]
  navItems: string[]
  tech?: string
  entry: { flow: EntryFlow; landingId: string | null; loginId: string | null; signupId: string | null; noSignup: boolean }
  layout: { desktopId: string; mobileId: string; wide: WideBehavior; storiesScope: StoriesScope | null }
  navigation: { header: NavChoice | null; sidebar: NavChoice | null }
  /** Decisões de prioridade já tomadas para combinações do modelo (id do conflito → opção). */
  conflictResolutions?: Record<string, string>
  typography: Typography
  geometry: Geometry
  /** Família visual padrão dos componentes do modelo. */
  family: string
  palettes: StarterPalette[]
  components: StarterComponent[]
  pages: StarterPage[]
}
