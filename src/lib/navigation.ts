import { matchPath } from 'react-router-dom'
import { Building2, ClipboardList, LayoutDashboard, Settings, Users } from 'lucide-react'
import type { Crumb } from '../components/ui/Breadcrumbs'

export const HOME_PATH = '/inicio'

export type NavItem = {
  to: string
  label: string
  /** Rótulo do dock do celular, onde cada item tem cerca de 57 px a 320 px. */
  shortLabel: string
  icon: typeof LayoutDashboard
  end: boolean
}

export const navItems: NavItem[] = [
  { to: HOME_PATH, label: 'Início', shortLabel: 'Início', icon: LayoutDashboard, end: true },
  { to: '/pacientes', label: 'Pacientes', shortLabel: 'Pacientes', icon: Users, end: false },
  { to: '/atendimentos', label: 'Atendimentos', shortLabel: 'Consultas', icon: ClipboardList, end: false },
  { to: '/clinicas', label: 'Clínicas', shortLabel: 'Clínicas', icon: Building2, end: false },
  { to: '/configuracoes', label: 'Configurações', shortLabel: 'Ajustes', icon: Settings, end: false },
]

const home: Crumb = { label: 'Início', to: HOME_PATH }

/** Trilha exibida no header para a rota atual. */
export function breadcrumbsFor(pathname: string): Crumb[] {
  const match = (pattern: string) => matchPath({ path: pattern, end: true }, pathname)

  if (match(HOME_PATH)) return [{ label: 'Início' }]
  if (match('/pacientes')) return [home, { label: 'Pacientes' }]
  if (match('/pacientes/:id')) return [home, { label: 'Pacientes', to: '/pacientes' }, { label: 'Prontuário' }]
  if (match('/atendimentos')) return [home, { label: 'Atendimentos' }]
  if (match('/atendimentos/novo'))
    return [home, { label: 'Atendimentos', to: '/atendimentos' }, { label: 'Nova evolução' }]
  if (match('/atendimentos/:id/editar'))
    return [home, { label: 'Atendimentos', to: '/atendimentos' }, { label: 'Editar atendimento' }]
  if (match('/clinicas')) return [home, { label: 'Clínicas' }]
  if (match('/configuracoes')) return [home, { label: 'Configurações' }]
  return [home]
}
