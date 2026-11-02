import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Check, ChevronDown, Cloud, Compass, FileCode2, FolderDown, Menu, Search, Wand2, X } from 'lucide-react'
import { ALL_STEPS, SKELETON_STEPS, type StepId } from '@/core/project'
import { useProject, useStudio } from '@/core/store'
import { Button, IconButton, Modal, Segmented, Toaster, cx } from '@/ui'
import { ALL_ENTRIES, FREE_HOME_ENTRY, HOME_ENTRY, MODULE_GROUPS, STEP_META, type NavEntry } from './nav'
import './shell.css'

const COLLAPSE_KEY = 'atelier-ui:ui:collapsed-groups'

function readCollapsed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(COLLAPSE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg className="shell-brand__mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#4C46DC" />
      <rect x="7" y="7" width="7" height="18" rx="2" fill="#fff" />
      <rect x="16" y="7" width="9" height="7" rx="2" fill="#fff" opacity=".85" />
      <rect x="16" y="16" width="9" height="9" rx="2" fill="#fff" opacity=".6" />
    </svg>
  )
}

function useModeSwitch() {
  const navigate = useNavigate()
  const setMode = useStudio((s) => s.setMode)
  const step = useProject((p) => p.guided.step)
  return (mode: 'guided' | 'free') => {
    setMode(mode)
    navigate(mode === 'guided' ? `/guiado/${step}` : '/livre')
  }
}

function ModeToggle() {
  const mode = useProject((p) => p.mode)
  const switchMode = useModeSwitch()
  return (
    <Segmented
      label="Modo de utilização"
      value={mode}
      onChange={switchMode}
      options={[
        { value: 'guided', label: 'Guiado', icon: <Wand2 />, title: 'Passo a passo, com explicações' },
        { value: 'free', label: 'Livre', icon: <Compass />, title: 'Acesso direto a qualquer módulo' },
      ]}
    />
  )
}

function SkeletonProgress() {
  const completed = useProject((p) => p.guided.completed)
  const done = SKELETON_STEPS.filter((s) => completed.includes(s)).length
  return (
    <span className="shell-progress" title="Progresso do esqueleto">
      Esqueleto {done}/{SKELETON_STEPS.length}
      <span className="shell-progress__bar" aria-hidden="true">
        <span style={{ width: `${(done / SKELETON_STEPS.length) * 100}%` }} />
      </span>
    </span>
  )
}

function StepLink({ step, index, onNavigate }: { step: StepId; index: number; onNavigate: () => void }) {
  const done = useProject((p) => p.guided.completed.includes(step))
  const meta = STEP_META[step]
  return (
    <li>
      <NavLink to={`/guiado/${step}`} className="shell-link" onClick={onNavigate}>
        <span className={cx('shell-step-num', done && 'shell-step-num--done')} aria-hidden="true">
          {done ? <Check /> : index + 1}
        </span>
        <span className="shell-link__text">{meta.short === meta.label ? meta.label : meta.label}</span>
        {done && <span className="sr-only">(concluída)</span>}
      </NavLink>
    </li>
  )
}

function Group({
  id,
  label,
  collapsed,
  onToggle,
  children,
}: {
  id: string
  label: string
  collapsed: boolean
  onToggle: (id: string) => void
  children: ReactNode
}) {
  return (
    <div className="shell-group">
      <button type="button" className="shell-group__toggle" aria-expanded={!collapsed} aria-controls={`grp-${id}`} onClick={() => onToggle(id)}>
        {label}
        <ChevronDown aria-hidden="true" />
      </button>
      {!collapsed && (
        <ul className="shell-group__list" id={`grp-${id}`}>
          {children}
        </ul>
      )}
    </div>
  )
}

function EntryLink({ entry, onNavigate }: { entry: NavEntry; onNavigate: () => void }) {
  const Icon = entry.icon
  return (
    <li>
      <NavLink to={entry.path} end={entry.path === '/'} className="shell-link" onClick={onNavigate}>
        <Icon aria-hidden="true" />
        <span className="shell-link__text">{entry.label}</span>
      </NavLink>
    </li>
  )
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const mode = useProject((p) => p.mode)
  const name = useProject((p) => p.meta.name)
  const [collapsed, setCollapsed] = useState<string[]>(readCollapsed)
  const toggle = (id: string) =>
    setCollapsed((c) => {
      const next = c.includes(id) ? c.filter((x) => x !== id) : [...c, id]
      try {
        localStorage.setItem(COLLAPSE_KEY, JSON.stringify(next))
      } catch {
        /* armazenamento indisponível: preferência só vale nesta sessão */
      }
      return next
    })

  return (
    <aside className="shell-sidebar" data-open={open} aria-label="Navegação do Studio" id="studio-sidebar">
      <div className="shell-sidebar__head">
        <span className="shell-brand__name">Menu</span>
        <IconButton label="Fechar menu" onClick={onClose}>
          <X />
        </IconButton>
      </div>
      <div className="shell-sidebar__scroll">
        <div className="shell-sidebar__mode">
          <ModeToggle />
        </div>
        <ul className="shell-group__list" style={{ marginBottom: 12 }}>
          <EntryLink entry={HOME_ENTRY} onNavigate={onClose} />
          {mode === 'free' && <EntryLink entry={FREE_HOME_ENTRY} onNavigate={onClose} />}
        </ul>
        {mode === 'guided' && (
          <Group id="guiado" label="Construtor guiado" collapsed={collapsed.includes('guiado')} onToggle={toggle}>
            {ALL_STEPS.map((s, i) => (
              <StepLink key={s} step={s} index={i} onNavigate={onClose} />
            ))}
          </Group>
        )}
        {MODULE_GROUPS.map((g) => (
          <Group key={g.id} id={g.id} label={g.label} collapsed={collapsed.includes(g.id)} onToggle={toggle}>
            {g.entries.map((e) => (
              <EntryLink key={e.id} entry={e} onNavigate={onClose} />
            ))}
          </Group>
        ))}
      </div>
      <div className="shell-sidebar__foot">
        <div className="shell-sidebar__project u-truncate">{name || 'Projeto sem nome'}</div>
        <span className="shell-saved">
          <Cloud aria-hidden="true" /> Salvo automaticamente neste navegador
        </span>
      </div>
    </aside>
  )
}

function FeatureSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const entries = useMemo<NavEntry[]>(() => {
    const steps: NavEntry[] = ALL_STEPS.map((s) => ({
      id: `step-${s}`,
      label: `Guiado · ${STEP_META[s].label}`,
      path: `/guiado/${s}`,
      icon: STEP_META[s].icon,
      description: STEP_META[s].description,
      keywords: 'guiado etapa passo',
    }))
    const all = [...ALL_ENTRIES, ...steps]
    const q = query
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim()
    if (!q) return all
    return all.filter((e) =>
      `${e.label} ${e.description} ${e.keywords}`
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .includes(q),
    )
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const go = (e: NavEntry | undefined) => {
    if (!e) return
    navigate(e.path)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Buscar funcionalidades" width={560} testId="feature-search">
      <div className="ui-search">
        <Search aria-hidden="true" />
        <input
          ref={inputRef}
          className="ui-input"
          type="search"
          placeholder="Ex.: drawer, paleta, login, master prompt…"
          aria-label="Buscar funcionalidades"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((a) => Math.min(a + 1, entries.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((a) => Math.max(a - 1, 0))
            } else if (e.key === 'Enter') {
              go(entries[active])
            }
          }}
        />
      </div>
      <ul className="search-list" role="listbox" aria-label="Resultados">
        {entries.map((e, i) => {
          const Icon = e.icon
          return (
            <li key={e.id} role="option" aria-selected={i === active}>
              <button type="button" className="search-item" data-active={i === active} onMouseEnter={() => setActive(i)} onClick={() => go(e)}>
                <Icon aria-hidden="true" />
                <span>
                  <span className="search-item__label">{e.label}</span>
                  <br />
                  <span className="search-item__desc">{e.description}</span>
                </span>
              </button>
            </li>
          )
        })}
        {entries.length === 0 && <li className="u-muted u-small" style={{ padding: 12 }}>Nada encontrado para “{query}”.</li>}
      </ul>
    </Modal>
  )
}

function Breadcrumbs() {
  const { pathname } = useLocation()
  if (pathname === '/') return null
  const crumbs: { label: string; path?: string }[] = [{ label: 'Início', path: '/' }]
  const step = pathname.match(/^\/guiado\/([a-z]+)/)?.[1] as StepId | undefined
  if (step && STEP_META[step]) {
    crumbs.push({ label: 'Construtor guiado' }, { label: STEP_META[step].label })
  } else {
    const group = MODULE_GROUPS.find((g) => g.entries.some((e) => e.path === pathname))
    const entry = ALL_ENTRIES.find((e) => e.path === pathname)
    if (group) crumbs.push({ label: group.label, path: '/livre' })
    if (entry) crumbs.push({ label: entry.label })
  }
  return (
    <nav className="shell-crumbs" aria-label="Você está em">
      <ol>
        {crumbs.map((c, i) => (
          <li key={i}>{c.path && i < crumbs.length - 1 ? <Link to={c.path}>{c.label}</Link> : <span aria-current={i === crumbs.length - 1 ? 'page' : undefined}>{c.label}</span>}</li>
        ))}
      </ol>
    </nav>
  )
}

export function Shell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Ao trocar de rota, começa do topo (navegação entre páginas, não troca de miniaturas).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <div className="shell">
      <a href="#conteudo" className="shell-skip">
        Pular para o conteúdo
      </a>
      <header className="shell-topbar">
        <IconButton label="Abrir menu" className="shell-only-mobile" aria-expanded={menuOpen} aria-controls="studio-sidebar" onClick={() => setMenuOpen(true)}>
          <Menu />
        </IconButton>
        <Link to="/" className="shell-brand" aria-label="Atelier UI — início">
          <BrandMark />
          <span className="shell-brand__text">
            <span className="shell-brand__name">Atelier UI</span>
            <span className="shell-brand__sub">Design System Studio</span>
          </span>
        </Link>
        <div className="shell-mode-toggle">
          <ModeToggle />
        </div>
        <div className="shell-topbar__spacer" />
        <button type="button" className="shell-search-btn" onClick={() => setSearchOpen(true)} aria-label="Buscar funcionalidades (Ctrl+K)">
          <Search aria-hidden="true" />
          <span>Buscar funcionalidades</span>
          <kbd>Ctrl K</kbd>
        </button>
        <SkeletonProgress />
        <IconButton label="Exportar e importar" className="shell-hide-sm" onClick={() => navigate('/exportar')}>
          <FolderDown />
        </IconButton>
        <Button variant="primary" icon={<FileCode2 />} onClick={() => navigate('/prompt')} aria-label="Abrir Master Prompt">
          <span className="shell-hide-sm">Master Prompt</span>
        </Button>
      </header>
      <div className="shell-body">
        <div className="shell-scrim" data-open={menuOpen} onClick={() => setMenuOpen(false)} aria-hidden="true" />
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="shell-main" id="conteudo" tabIndex={-1}>
          <Breadcrumbs />
          <Suspense fallback={<div className="ui-page u-muted">Carregando…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <FeatureSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Toaster />
    </div>
  )
}
