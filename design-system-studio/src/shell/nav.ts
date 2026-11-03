import type { LucideIcon } from 'lucide-react'
import {
  Blocks,
  BookOpenCheck,
  Compass,
  Download,
  Eye,
  FileCode2,
  FolderCog,
  Home,
  KeyRound,
  LayoutTemplate,
  Monitor,
  Navigation,
  Palette,
  PanelsTopLeft,
  ScanSearch,
  Smartphone,
  Sparkles,
  Target,
  UserPlus,
} from 'lucide-react'
import type { StepId } from '@/core/project'

export interface NavEntry {
  id: string
  label: string
  path: string
  icon: LucideIcon
  description: string
  keywords: string
}

export interface NavGroup {
  id: string
  label: string
  entries: NavEntry[]
}

export const STEP_META: Record<StepId, { label: string; short: string; description: string; icon: LucideIcon }> = {
  objetivo: { label: 'Objetivo do projeto', short: 'Objetivo', description: 'O que você vai construir e para quem.', icon: Target },
  entrada: { label: 'Landing, login e cadastro', short: 'Entrada', description: 'Como as pessoas chegam e entram no site.', icon: KeyRound },
  desktop: { label: 'Arquitetura do computador', short: 'Computador', description: 'Onde ficam header, sidebar e conteúdo na tela grande.', icon: Monitor },
  mobile: { label: 'Arquitetura do celular', short: 'Celular', description: 'Como os menus funcionam no celular.', icon: Smartphone },
  revisao: { label: 'Revisão do esqueleto', short: 'Revisão', description: 'Confira e aprove a estrutura antes do acabamento.', icon: BookOpenCheck },
  preview: { label: 'Prévia integrada', short: 'Prévia', description: 'Veja todas as escolhas juntas.', icon: Eye },
  identidade: { label: 'Identidade visual', short: 'Cores', description: 'Paleta, tipografia e geometria.', icon: Palette },
  navegacao: { label: 'Headers e sidebars', short: 'Navegação', description: 'A aparência dos menus.', icon: Navigation },
  componentes: { label: 'Componentes', short: 'Componentes', description: 'Botões, campos, cards, tabelas e mais.', icon: Blocks },
  entrega: { label: 'Master Prompt', short: 'Entrega', description: 'Gere a especificação para a IA.', icon: FileCode2 },
}

export const MODULE_GROUPS: NavGroup[] = [
  {
    id: 'estrutura',
    label: 'Estrutura',
    entries: [
      { id: 'objetivo', label: 'Objetivo do projeto', path: '/modulos/objetivo', icon: Target, description: 'Nome, tipo, público e funcionalidades.', keywords: 'nome tipo público objetivo saas dashboard loja portfolio' },
      { id: 'landing', label: 'Landing pages', path: '/modulos/landing', icon: LayoutTemplate, description: '24 conceitos de página de apresentação.', keywords: 'landing hero página pública apresentação' },
      { id: 'login', label: 'Login', path: '/modulos/login', icon: KeyRound, description: '24 composições de tela de entrar.', keywords: 'login entrar autenticação acesso' },
      { id: 'cadastro', label: 'Cadastro', path: '/modulos/cadastro', icon: UserPlus, description: '8 fluxos de criação de conta.', keywords: 'cadastro criar conta signup onboarding' },
      { id: 'desktop', label: 'Arquitetura do computador', path: '/modulos/desktop', icon: Monitor, description: '42 arquiteturas para o computador.', keywords: 'layout desktop sidebar header grid colunas rail' },
      { id: 'mobile', label: 'Arquitetura do celular', path: '/modulos/mobile', icon: Smartphone, description: '44 arquiteturas para o celular.', keywords: 'mobile celular drawer bottom navigation dock' },
      { id: 'preview', label: 'Prévia integrada', path: '/modulos/preview', icon: Eye, description: 'Todas as escolhas em uma prévia única.', keywords: 'prévia preview live site integrado' },
    ],
  },
  {
    id: 'identidade',
    label: 'Identidade',
    entries: [
      { id: 'cores', label: 'Cores e identidade', path: '/modulos/cores', icon: Palette, description: '60 paletas, tokens, tipografia e geometria.', keywords: 'cores paleta tokens tipografia fonte bordas sombras' },
      { id: 'navegacao', label: 'Header e sidebar (menus)', path: '/modulos/navegacao', icon: Navigation, description: '36 headers e 36 sidebars.', keywords: 'header sidebar navegação menu topbar' },
      { id: 'componentes', label: 'Componentes', path: '/modulos/componentes', icon: Blocks, description: '66 categorias em 16 famílias visuais.', keywords: 'componentes botões inputs cards tabelas editor' },
    ],
  },
  {
    id: 'inspiracao',
    label: 'Inspiração',
    entries: [
      { id: 'inspiracao', label: 'Galeria de inspiração', path: '/modulos/inspiracao', icon: Sparkles, description: '20 sites fictícios completos.', keywords: 'inspiração galeria sites exemplos identidade' },
      { id: 'templates', label: 'Modelos de página', path: '/modulos/templates', icon: PanelsTopLeft, description: 'Modelos reutilizáveis de páginas.', keywords: 'templates modelos páginas' },
    ],
  },
  {
    id: 'entrega',
    label: 'Entrega',
    entries: [
      { id: 'prompt', label: 'Central de Prompts', path: '/prompt', icon: FileCode2, description: 'Master Prompt e prompts individuais.', keywords: 'prompt master especificação ia claude cursor' },
      { id: 'exportar', label: 'Exportar e importar', path: '/exportar', icon: Download, description: 'JSON, CSS, HTML, backup e importação.', keywords: 'exportar importar json css html backup' },
    ],
  },
  {
    id: 'ferramentas',
    label: 'Ferramentas',
    entries: [
      { id: 'validacao', label: 'Validação responsiva', path: '/validacao', icon: ScanSearch, description: 'Teste sites reais e gere prompts de correção.', keywords: 'validação responsividade playwright overflow teste' },
      { id: 'projeto', label: 'Projeto e versões', path: '/projeto', icon: FolderCog, description: 'Histórico, versões e limpar projeto.', keywords: 'projeto versões histórico reset limpar' },
    ],
  },
]

export const HOME_ENTRY: NavEntry = { id: 'inicio', label: 'Início', path: '/', icon: Home, description: 'Escolha entre modo guiado e livre.', keywords: 'início home começar' }
export const FREE_HOME_ENTRY: NavEntry = { id: 'livre', label: 'Todos os módulos', path: '/livre', icon: Compass, description: 'Acesso direto a qualquer módulo.', keywords: 'livre módulos todos' }

export const ALL_ENTRIES: NavEntry[] = [HOME_ENTRY, FREE_HOME_ENTRY, ...MODULE_GROUPS.flatMap((g) => g.entries)]
