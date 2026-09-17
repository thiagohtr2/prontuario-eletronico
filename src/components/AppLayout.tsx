import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Building2,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Stethoscope,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { initials } from '../lib/format'
import { cn } from '../lib/cn'

const navItems = [
  { to: '/', label: 'Início', icon: LayoutDashboard, end: true },
  { to: '/pacientes', label: 'Pacientes', icon: Users, end: false },
  { to: '/atendimentos', label: 'Atendimentos', icon: ClipboardList, end: false },
  { to: '/clinicas', label: 'Clínicas', icon: Building2, end: false },
  { to: '/configuracoes', label: 'Configurações', icon: Settings, end: false },
]

export function AppLayout() {
  const { doctor, session, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar:collapsed') === '1')
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    localStorage.setItem('sidebar:collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  const nome = doctor?.nome?.trim() || session?.user.email || 'Médico'
  const especialidade = doctor?.especialidade?.trim() || 'Especialidade não informada'

  const sidebar = (
    <div className="flex h-full flex-col bg-primary text-slate-200">
      <div className={cn('flex items-center gap-3 px-5 py-5', collapsed && 'lg:justify-center lg:px-3')}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
          <Stethoscope size={19} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-md font-semibold text-white">Prontuário</p>
            <p className="truncate text-xs text-slate-400">Histórico centralizado</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Fechar menu"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                collapsed && 'lg:justify-center lg:px-0',
                isActive ? 'bg-white/12 text-white' : 'text-slate-300 hover:bg-white/8 hover:text-white',
              )
            }
          >
            <Icon size={19} className="shrink-0" aria-hidden />
            <span className={cn(collapsed && 'lg:hidden')}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className={cn('flex items-center gap-3 rounded-md px-2 py-2', collapsed && 'lg:justify-center lg:px-0')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
            {initials(nome)}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{nome}</p>
              <p className="truncate text-xs text-slate-400">{especialidade}</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          title={collapsed ? 'Sair' : undefined}
          className={cn(
            'mt-1 flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/8 hover:text-white',
            collapsed && 'lg:justify-center lg:px-0',
          )}
        >
          <LogOut size={19} className="shrink-0" aria-hidden />
          <span className={cn(collapsed && 'lg:hidden')}>Sair</span>
        </button>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className={cn(
            'mt-1 hidden h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-slate-400 transition-colors hover:bg-white/8 hover:text-white lg:flex',
            collapsed && 'lg:justify-center lg:px-0',
          )}
        >
          {collapsed ? <ChevronsRight size={18} aria-hidden /> : <ChevronsLeft size={18} aria-hidden />}
          <span className={cn(collapsed && 'lg:hidden')}>Recolher menu</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-full bg-canvas">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden shrink-0 transition-[width] duration-200 lg:block',
          collapsed ? 'w-[76px]' : 'w-[248px]',
        )}
      >
        {sidebar}
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-[#2B2430]/45 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[264px] lg:hidden">{sidebar}</aside>
        </>
      )}

      <div className={cn('flex min-w-0 flex-1 flex-col', collapsed ? 'lg:pl-[76px]' : 'lg:pl-[248px]')}>
        <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink"
          >
            <Menu size={19} />
          </button>
          <span className="text-md font-semibold text-ink">Prontuário</span>
        </div>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
