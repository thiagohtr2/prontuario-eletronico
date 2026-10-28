import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronsLeft, ChevronsRight, LogOut, Plus, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { initials } from '../lib/format'
import { cn } from '../lib/cn'
import { breadcrumbsFor, HOME_PATH, navItems } from '../lib/navigation'
import type { NavItem } from '../lib/navigation'
import { Breadcrumbs } from './ui/Breadcrumbs'
import { Menu } from './ui/Menu'
import type { MenuItem } from './ui/Menu'
import { Logo, LogoMark } from './Logo'

const COLLAPSED_KEY = 'singulare:sidebar-recolhida'

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Detecta o teclado virtual aberto: a área visível encolhe sem zoom. Nesse
 * caso o dock some, para não cobrir o campo em edição.
 */
function useVirtualKeyboardOpen(): boolean {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const update = () => setOpen(viewport.scale < 1.05 && window.innerHeight - viewport.height > 150)
    viewport.addEventListener('resize', update)
    update()
    return () => viewport.removeEventListener('resize', update)
  }, [])
  return open
}

const dateFormat = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

/** "Quarta-feira, 28 de outubro": só a primeira letra em maiúscula. */
function todayLabel(): string {
  const text = dateFormat.format(new Date())
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Layout autenticado.
 *
 * - A partir de 1024 px: Sidebar flutuante compacta (224 px), afastada do topo
 *   e da borda, com header flutuante de 64 px. Pode ser recolhida para o rail.
 * - De 768 a 1023 px: a mesma topologia com o rail de ícones e rótulos.
 * - Abaixo de 768 px: header simples no topo e Dock flutuante na base.
 */
export function AppLayout() {
  const { doctor, session, signOut } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const keyboardOpen = useVirtualKeyboardOpen()

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0')
    } catch {
      // Sem armazenamento local: a preferência vale só nesta visita.
    }
  }, [collapsed])

  // Os avisos (toasts) sobem para cima do dock enquanto este layout existe.
  useEffect(() => {
    document.documentElement.classList.add('has-dock')
    return () => document.documentElement.classList.remove('has-dock')
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  const nome = doctor?.nome?.trim() || session?.user.email || 'Médica'
  const especialidade = doctor?.especialidade?.trim() || 'Especialidade não informada'
  const crumbs = breadcrumbsFor(location.pathname)

  const userMenuItems: MenuItem[] = [
    // No desktop, Configurações já está na sidebar; no celular, só aqui.
    { label: 'Configurações', icon: <Settings size={18} />, to: '/configuracoes', className: 'md:hidden' },
    { label: 'Sair', icon: <LogOut size={18} />, onSelect: () => void signOut(), tone: 'danger' },
  ]

  const userMenuHeader = (
    <div className="min-w-0">
      <p className="break-words text-sm font-semibold text-ink">{nome}</p>
      <p className="mt-0.5 break-words text-xs text-muted">{especialidade}</p>
    </div>
  )

  const avatar = (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-primary-soft text-sm font-semibold text-primary">
      {initials(nome)}
    </span>
  )

  return (
    <div
      className={cn(
        'app-shell min-h-[100dvh] md:grid md:gap-x-4 md:px-4',
        collapsed
          ? 'md:grid-cols-[var(--layout-rail-width)_minmax(0,1fr)]'
          : 'md:grid-cols-[var(--layout-rail-width)_minmax(0,1fr)] lg:grid-cols-[var(--layout-sidebar-width)_minmax(0,1fr)]',
      )}
    >
      <a
        href="#conteudo"
        className="sr-only z-toast rounded-pill bg-primary text-sm font-medium text-primary-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:px-5 focus:py-3"
      >
        Pular para o conteúdo
      </a>

      {/* Sidebar flutuante (md+) */}
      <aside className="app-sidebar sticky top-4 z-sidebar my-4 hidden h-[calc(100dvh-32px)] md:block">
        <div className="flex h-full flex-col overflow-y-auto overscroll-contain rounded-sidebar bg-surface shadow-sidebar">
          <div className={cn('flex items-center px-4 pb-4 pt-5', collapsed ? 'justify-center' : 'justify-center lg:justify-start')}>
            <span className={cn(!collapsed && 'lg:hidden')}>
              <LogoMark size={44} />
            </span>
            {!collapsed && <Logo className="hidden lg:inline-flex" tagline="Prontuário eletrônico" />}
          </div>

          <nav aria-label="Principal" className={cn('flex-1 px-1.5 py-2', !collapsed && 'lg:px-3')}>
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <SidebarLink item={item} collapsed={collapsed} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden p-3 lg:block">
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
              aria-expanded={!collapsed}
              className={cn(
                'flex min-h-touch w-full items-center gap-3 rounded-pill px-4 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-ink',
                collapsed && 'justify-center px-0',
              )}
            >
              {collapsed ? <ChevronsRight size={18} aria-hidden /> : <ChevronsLeft size={18} aria-hidden />}
              {!collapsed && <span>Recolher menu</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Header flutuante (md+) */}
        <div className="sticky top-0 z-header hidden bg-canvas pt-4 md:block">
          <header className="app-header flex h-header min-w-0 items-center justify-between gap-4 rounded-header border border-line bg-surface pl-3 pr-2 shadow-header">
            <Breadcrumbs items={crumbs} className="flex-1" />
            <div className="flex shrink-0 items-center gap-3">
              <p className="hidden text-sm text-muted xl:block">{todayLabel()}</p>
              <Menu
                label={`${nome}, menu da conta`}
                header={userMenuHeader}
                items={userMenuItems}
                buttonClassName="flex min-h-touch items-center gap-3 rounded-pill py-1 pl-1 pr-1 transition-colors hover:bg-surface-hover lg:pr-3"
                buttonContent={
                  <>
                    {avatar}
                    <span className="hidden min-w-0 max-w-[200px] text-left lg:block">
                      <span className="block truncate text-sm font-semibold text-ink">{nome}</span>
                      <span className="block truncate text-xs text-muted">{especialidade}</span>
                    </span>
                    <ChevronDown size={16} className="hidden text-icon lg:block" aria-hidden />
                  </>
                }
              />
            </div>
          </header>
        </div>

        {/* Header do celular (< 768 px) */}
        <header
          className="sticky top-0 z-header flex items-center justify-between gap-3 border-b border-line bg-surface px-4 md:hidden"
          style={{ paddingTop: 'env(safe-area-inset-top)', minHeight: 'calc(64px + env(safe-area-inset-top))' }}
        >
          <NavLink to={HOME_PATH} className="flex min-h-touch min-w-0 items-center rounded-pill" aria-label="Singulare, ir para o início">
            <Logo />
          </NavLink>
          <Menu
            label={`${nome}, menu da conta`}
            header={userMenuHeader}
            items={userMenuItems}
            buttonClassName="flex h-11 w-11 items-center justify-center rounded-pill"
            buttonContent={avatar}
          />
        </header>

        <main
          id="conteudo"
          tabIndex={-1}
          className="app-main px-4 pt-5 focus:outline-none md:px-0 md:pt-8"
          style={{ paddingBottom: 'var(--main-bottom-space)' }}
        >
          <div className="mx-auto w-full max-w-content">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Dock flutuante (< 768 px) */}
      <nav
        aria-label="Principal"
        className={cn(
          'app-dock fixed z-dock md:hidden',
          keyboardOpen && 'invisible',
        )}
        style={{
          left: 'max(var(--dock-offset), env(safe-area-inset-left))',
          right: 'max(var(--dock-offset), env(safe-area-inset-right))',
          bottom: 'calc(var(--dock-offset) + env(safe-area-inset-bottom))',
        }}
      >
        <ul className="grid h-dock grid-cols-[repeat(5,minmax(max-content,1fr))] items-stretch gap-2 rounded-sidebar bg-surface p-1 shadow-sidebar">
          <li className="min-w-0">
            <DockLink item={navItems[0]} />
          </li>
          <li className="min-w-0">
            <DockLink item={navItems[1]} />
          </li>
          <li className="min-w-0">
            <NavLink
              to="/atendimentos/novo"
              aria-label="Novo atendimento"
              className="group flex h-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-[16px] text-[11px] font-semibold leading-none text-primary"
            >
              <span className="flex h-8 w-12 items-center justify-center rounded-pill bg-primary text-primary-fg transition-colors group-hover:bg-primary-hover group-active:bg-primary-pressed">
                <Plus size={20} aria-hidden />
              </span>
              <span aria-hidden>Novo</span>
            </NavLink>
          </li>
          <li className="min-w-0">
            <DockLink item={navItems[2]} />
          </li>
          <li className="min-w-0">
            <DockLink item={navItems[3]} />
          </li>
        </ul>
      </nav>
    </div>
  )
}

function SidebarLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const { to, label, icon: Icon, end } = item
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'group flex min-h-touch flex-col items-center justify-center gap-1 rounded-[14px] px-0 py-2 text-center text-[11px] font-medium leading-tight transition-colors',
          !collapsed && 'lg:flex-row lg:justify-start lg:gap-3 lg:rounded-pill lg:px-4 lg:py-0 lg:text-left lg:text-sm',
          isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-surface-hover hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            className={cn('shrink-0', isActive ? 'text-primary' : 'text-icon group-hover:text-icon-hover')}
            aria-hidden
          />
          <span className="whitespace-nowrap">{label}</span>
        </>
      )}
    </NavLink>
  )
}

function DockLink({ item }: { item: NavItem }) {
  const { to, shortLabel, icon: Icon, end } = item
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'group flex h-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-[16px] text-[11px] font-medium leading-none transition-colors',
          isActive ? 'text-primary' : 'text-muted hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'flex h-8 w-12 items-center justify-center rounded-pill transition-colors',
              isActive ? 'bg-primary-soft' : 'group-hover:bg-surface-hover',
            )}
          >
            <Icon size={20} className={isActive ? 'text-primary' : 'text-icon'} aria-hidden />
          </span>
          <span className="whitespace-nowrap">{shortLabel}</span>
        </>
      )}
    </NavLink>
  )
}
