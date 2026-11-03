import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Download,
  Globe,
  Heart,
  LayoutGrid,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Phone,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Sun,
  User,
  X,
} from 'lucide-react'
import { cx } from '@/ui'
import { fontStack } from '@/core/tokens'
import type { ResolvedTheme } from '@/core/types'
import { headerLookFor, withHeaderContent, type NavContent } from './catalog'
import { NavIconView } from './icons'
import { Popover, useInert, useMenus, useWidth, type MenuApi } from './menu'
import { headerColors, heroColors, navVars, type NavColors } from './palette'
import type { HeaderAction, HeaderLook, HeaderModel, HeaderNavEntry, NavIcon } from './types'
import './navigation.css'

export interface HeaderPreviewProps {
  model: HeaderModel
  variant: 0 | 1
  theme: ResolvedTheme
  /** Menus, busca e estados ativos funcionam (padrão: true). Falso = prévia estática e inerte. */
  interactive?: boolean
  /** Força a versão de celular. Sem a prop, compacta sozinho quando a largura disponível é menor que 640 px. */
  compact?: boolean
  /** Simula a página rolada (sombra, encolhimento, header transparente que fica sólido). */
  scrolled?: boolean
  /** Avisado quando a pessoa clica em um item de navegação. */
  onNavigate?: (label: string) => void
  /** Marca e itens de menu reais do projeto (prévia integrada). */
  content?: NavContent
  className?: string
}

/* -------------------------------------------------------------------------- */
/* Conteúdo de exemplo dos menus                                               */
/* -------------------------------------------------------------------------- */

const BLOCK_DESC: Record<string, string> = {
  Criar: 'Páginas e posts',
  Publicar: 'Agende em um clique',
  Medir: 'Resultados ao vivo',
  Automatizar: 'Fluxos sem código',
}

interface MegaContent {
  cols: { title: string; links: string[] }[]
  feature: { kicker: string; title: string; cta: string }
}

const MEGA: Record<'store' | 'edu' | 'edu2' | 'corp' | 'corp2', MegaContent> = {
  store: {
    cols: [
      { title: 'Casa', links: ['Cozinha', 'Banho', 'Decoração', 'Organização'] },
      { title: 'Eletrônicos', links: ['Celulares', 'Notebooks', 'Áudio', 'Games'] },
      { title: 'Moda', links: ['Feminino', 'Masculino', 'Infantil', 'Calçados'] },
    ],
    feature: { kicker: 'Semana da Casa', title: 'Até 40% off em utilidades', cta: 'Ver ofertas' },
  },
  edu: {
    cols: [
      { title: 'Áreas', links: ['Tecnologia', 'Saúde', 'Negócios', 'Artes e design'] },
      { title: 'Formatos', links: ['Graduação', 'Pós-graduação', 'Extensão', 'Cursos livres'] },
      { title: 'Para você', links: ['Bolsas', 'Calendário', 'Vestibular', 'Ex-alunos'] },
    ],
    feature: { kicker: 'Inscrições abertas', title: 'Vestibular 2027 com nota do Enem', cta: 'Inscreva-se' },
  },
  edu2: {
    cols: [
      { title: 'Bacharelados', links: ['Administração', 'Direito', 'Engenharia civil', 'Psicologia'] },
      { title: 'Licenciaturas', links: ['Letras', 'Matemática', 'História', 'Pedagogia'] },
      { title: 'Tecnólogos', links: ['Análise de sistemas', 'Gastronomia', 'Logística', 'Design gráfico'] },
    ],
    feature: { kicker: 'Novo campus', title: 'Aulas presenciais e híbridas', cta: 'Conhecer' },
  },
  corp: {
    cols: [
      { title: 'Por necessidade', links: ['Gestão financeira', 'Atendimento', 'Logística', 'Segurança'] },
      { title: 'Por porte', links: ['Pequenas empresas', 'Médias empresas', 'Grandes contas'] },
      { title: 'Recursos', links: ['Casos de sucesso', 'Webinars', 'Guias práticos', 'Central de ajuda'] },
    ],
    feature: { kicker: 'Relatório 2026', title: 'Tendências de gestão no Brasil', cta: 'Baixar grátis' },
  },
  corp2: {
    cols: [
      { title: 'Indústria', links: ['Alimentos', 'Automotivo', 'Química', 'Têxtil'] },
      { title: 'Serviços', links: ['Saúde', 'Educação', 'Varejo', 'Financeiro'] },
      { title: 'Setor público', links: ['Prefeituras', 'Autarquias', 'Hospitais públicos'] },
    ],
    feature: { kicker: 'Caso de sucesso', title: 'Como a Rede Ingá cortou 30% dos custos', cta: 'Ler o caso' },
  },
}

function megaFor(entry: HeaderNavEntry, look: HeaderLook): MegaContent {
  if (look.context === 'store') return MEGA.store
  if (/curso/i.test(entry.label)) return MEGA.edu
  if (/gradua/i.test(entry.label)) return MEGA.edu2
  if (/setor/i.test(entry.label)) return MEGA.corp2
  return MEGA.corp
}

const NOTIFICATIONS = [
  { who: 'Ana Ribeiro', what: 'comentou em “Projeto Aurora”', when: 'há 2 min', unread: true },
  { who: 'Relatório mensal', what: 'está pronto para download', when: 'há 1 h', unread: true },
  { who: 'Caio Mendes', what: 'entrou na equipe', when: 'ontem', unread: false },
]

const APPS: { label: string; icon: NavIcon }[] = [
  { label: 'Documentos', icon: 'file' },
  { label: 'Planilhas', icon: 'grid' },
  { label: 'Agenda', icon: 'calendar' },
  { label: 'Arquivos', icon: 'folder' },
  { label: 'Conversas', icon: 'message' },
  { label: 'Formulários', icon: 'list' },
]

const WIDE_PLACEHOLDER: Partial<Record<HeaderLook['context'], string>> = {
  store: 'Buscar produtos, marcas e lojas',
  docs: 'Buscar artigos, dúvidas e guias',
  app: 'Buscar projetos, tarefas e pessoas',
  site: 'Buscar soluções, conteúdos e serviços',
}

const SIMPLE_MENUS: Partial<Record<HeaderAction, { label: string; items: string[] }>> = {
  lang: { label: 'Idioma', items: ['Português (Brasil)', 'English', 'Español'] },
  period: { label: 'Período', items: ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Este trimestre', 'Personalizado…'] },
  version: { label: 'Versão', items: ['v3.2 (atual)', 'v3.1', 'v2.x (legado)'] },
  location: { label: 'Endereço de entrega', items: ['Rua das Flores, 120 — Centro', 'Av. Brasil, 2000 — Jardins', '+ Adicionar endereço'] },
  create: { label: 'Criar', items: ['Novo projeto', 'Nova tarefa', 'Novo documento'] },
}

/* -------------------------------------------------------------------------- */
/* Contexto interno                                                            */
/* -------------------------------------------------------------------------- */

interface Ctx {
  look: HeaderLook
  theme: ResolvedTheme
  colors: NavColors
  menus: MenuApi
  root: RefObject<HTMLDivElement>
  active: number
  select: (i: number) => void
  compact: boolean
  /** Prefixo único (várias prévias na mesma página). */
  uid: string
}

let uidSeq = 0
function useUid() {
  const ref = useRef<string>()
  if (!ref.current) ref.current = `nvh${++uidSeq}`
  return ref.current
}

/* -------------------------------------------------------------------------- */
/* Logo                                                                        */
/* -------------------------------------------------------------------------- */

const GLYPHS = [
  'M4 15 10 4l6 11Z',
  'M10 3.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 3.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z',
  'M4 4h4v12H4zM12 8h4v8h-4z',
  'M10 3 17 10 10 17 3 10Z',
]

function serifStack(theme: ResolvedTheme) {
  return ['fraunces', 'georgia'].includes(theme.typography.heading) ? theme.metrics.headingFont : fontStack('fraunces')
}

export function HeaderLogo({ look, theme, size = 'md' }: { look: HeaderLook; theme: ResolvedTheme; size?: 'sm' | 'md' | 'lg' }) {
  const glyph = GLYPHS[look.brand.charCodeAt(0) % GLYPHS.length]
  const word = (
    <span className="nvs-logo__word" style={{ fontFamily: theme.metrics.headingFont }}>
      {look.brand}
    </span>
  )
  switch (look.logo) {
    case 'word':
      return (
        <span className="nvs-logo nvs-logo--word" data-size={size}>
          {word}
        </span>
      )
    case 'serif':
      return (
        <span className="nvs-logo nvs-logo--serif" data-size={size} style={{ fontFamily: serifStack(theme) }}>
          {look.brand}
        </span>
      )
    case 'big':
      return (
        <span className="nvs-logo nvs-logo--big" data-size={size} style={{ fontFamily: serifStack(theme) }}>
          {look.brand}
        </span>
      )
    case 'monogram':
      return (
        <span className="nvs-logo" data-size={size}>
          <span className="nvs-logo__mono-circle" aria-hidden="true">
            {look.brand.charAt(0)}
          </span>
          {word}
        </span>
      )
    case 'mono':
      return (
        <span className="nvs-logo nvs-logo--code" data-size={size}>
          <span className="nvs-logo__prompt" aria-hidden="true">
            &gt;_
          </span>
          {look.brand}
        </span>
      )
    case 'badge':
      return (
        <span className="nvs-logo" data-size={size}>
          <span className="nvs-logo__mark" aria-hidden="true">
            <svg viewBox="0 0 20 20">
              <path d={glyph} fill="currentColor" fillRule="evenodd" />
            </svg>
          </span>
          {word}
          <span className="nvs-logo__badge">{look.logoBadge ?? 'Docs'}</span>
        </span>
      )
    case 'outline':
      return (
        <span className="nvs-logo" data-size={size}>
          <svg className="nvs-logo__outline" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8 16 12 12 16 8 12Z" fill="currentColor" />
          </svg>
          {word}
        </span>
      )
    default:
      return (
        <span className="nvs-logo" data-size={size}>
          <span className="nvs-logo__mark" aria-hidden="true">
            <svg viewBox="0 0 20 20">
              <path d={glyph} fill="currentColor" fillRule="evenodd" />
            </svg>
          </span>
          {word}
        </span>
      )
  }
}

/* -------------------------------------------------------------------------- */
/* Navegação                                                                   */
/* -------------------------------------------------------------------------- */

function DropdownPanel({ ctx, id, entry, index }: { ctx: Ctx; id: string; entry: HeaderNavEntry; index: number }) {
  const items = entry.items ?? ['Visão geral', 'Recursos', 'Novidades', 'Ajuda']
  return (
    <Popover id={id} menus={ctx.menus} root={ctx.root} width={230} label={entry.label}>
      <div className="nvs-pop__list">
        {items.map((it) => (
          <button
            key={it}
            type="button"
            role="menuitem"
            className="nvs-pop__item"
            onClick={() => {
              ctx.select(index)
              ctx.menus.close(true)
            }}
          >
            {it}
          </button>
        ))}
      </div>
    </Popover>
  )
}

function MegaPanel({ ctx, id, entry, index }: { ctx: Ctx; id: string; entry: HeaderNavEntry; index: number }) {
  const mega = megaFor(entry, ctx.look)
  return (
    <Popover id={id} menus={ctx.menus} root={ctx.root} width={760} align="center" label={entry.label} className="nvs-mega">
      <div className="nvs-mega__grid">
        {mega.cols.map((col) => (
          <div key={col.title} className="nvs-mega__col">
            <span className="nvs-mega__title">{col.title}</span>
            {col.links.map((l) => (
              <button
                key={l}
                type="button"
                role="menuitem"
                className="nvs-pop__item nvs-mega__link"
                onClick={() => {
                  ctx.select(index)
                  ctx.menus.close(true)
                }}
              >
                {l}
              </button>
            ))}
          </div>
        ))}
        <div className="nvs-mega__feature">
          <span className="nvs-mega__kicker">{mega.feature.kicker}</span>
          <strong>{mega.feature.title}</strong>
          <button type="button" role="menuitem" className="nvs-mega__cta" onClick={() => ctx.menus.close(true)}>
            {mega.feature.cta} <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </Popover>
  )
}

function NavLinks({ ctx, from = 0, to, label = 'Principal', style: navStyle }: { ctx: Ctx; from?: number; to?: number; label?: string; style?: HeaderLook['navStyle'] }) {
  const { look } = ctx
  const ns = navStyle ?? look.navStyle
  const entries = look.nav.slice(from, to)
  if (!entries.length) return null
  const list = (
    <ul className="nvs-hn" data-ns={ns} data-density={look.density}>
      {entries.map((entry, k) => {
        const i = from + k
        const current = ctx.active === i
        const id = `${ctx.uid}-nav${i}`
        const content = (
          <>
            {ns === 'numbered' && <span className="nvs-hl__num">{String(i + 1).padStart(2, '0')}</span>}
            {ns === 'blocks' && entry.icon && (
              <span className="nvs-hl__tile">
                <NavIconView name={entry.icon} size={16} />
              </span>
            )}
            {ns !== 'blocks' && entry.icon && <NavIconView name={entry.icon} size={16} />}
            {ns === 'blocks' ? (
              <span className="nvs-hl__stack">
                <span>{entry.label}</span>
                <span className="nvs-hl__desc">{BLOCK_DESC[entry.label] ?? 'Saiba mais'}</span>
              </span>
            ) : (
              <span className="nvs-hl__label">{entry.label}</span>
            )}
            {entry.badge && <span className="nvs-hl__badge">{entry.badge}</span>}
            {entry.menu && <ChevronDown className="nvs-hl__chev" size={14} aria-hidden="true" />}
          </>
        )
        return (
          <li key={entry.label}>
            {entry.menu ? (
              <>
                <button type="button" className="nvs-hl" aria-current={current ? 'page' : undefined} {...ctx.menus.trigger(id)}>
                  {content}
                </button>
                {entry.menu === 'mega' ? <MegaPanel ctx={ctx} id={id} entry={entry} index={i} /> : <DropdownPanel ctx={ctx} id={id} entry={entry} index={i} />}
              </>
            ) : (
              <button type="button" className="nvs-hl" aria-current={current ? 'page' : undefined} onClick={() => ctx.select(i)}>
                {content}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
  return (
    <nav aria-label={label} className="nvs-hnav">
      {list}
    </nav>
  )
}

/** Botão “Navegar ▾” (ou o item de mega menu) usado quando a busca ocupa o centro. */
function NavCollapsed({ ctx }: { ctx: Ctx }) {
  const megaIndex = ctx.look.nav.findIndex((n) => n.menu === 'mega')
  if (megaIndex >= 0) {
    const entry = ctx.look.nav[megaIndex]
    const id = `${ctx.uid}-nav${megaIndex}`
    return (
      <>
        <button type="button" className="nvs-hb nvs-hb--soft" {...ctx.menus.trigger(id)}>
          <Menu size={16} aria-hidden="true" />
          {entry.label}
        </button>
        <MegaPanel ctx={ctx} id={id} entry={entry} index={megaIndex} />
      </>
    )
  }
  if (!ctx.look.nav.length) return null
  const id = `${ctx.uid}-navigate`
  return (
    <>
      <button type="button" className="nvs-hb nvs-hb--ghost nvs-p-md" {...ctx.menus.trigger(id)}>
        Navegar <ChevronDown size={14} aria-hidden="true" />
      </button>
      <Popover id={id} menus={ctx.menus} root={ctx.root} width={220} label="Navegar">
        <div className="nvs-pop__list">
          {ctx.look.nav.map((n, i) => (
            <button
              key={n.label}
              type="button"
              role="menuitem"
              className="nvs-pop__item"
              aria-current={ctx.active === i ? 'page' : undefined}
              onClick={() => {
                ctx.select(i)
                ctx.menus.close(true)
              }}
            >
              {n.icon && <NavIconView name={n.icon} size={16} />}
              {n.label}
              {ctx.active === i && <Check size={14} className="nvs-pop__check" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </Popover>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Busca                                                                       */
/* -------------------------------------------------------------------------- */

function SearchArea({ ctx, kind }: { ctx: Ctx; kind: HeaderLook['search'] }) {
  const [expanded, setExpanded] = useState(false)
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (expanded) inputRef.current?.focus({ preventScroll: true })
  }, [expanded])

  if (!kind) return null
  if (kind === 'field') {
    return (
      <label className="nvs-hs-field nvs-p-md">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          placeholder="Buscar…"
          aria-label="Buscar"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation()
              setQ('')
              e.currentTarget.blur()
            }
          }}
        />
      </label>
    )
  }
  if (kind === 'icon') {
    return (
      <div className="nvs-hs-exp" data-open={expanded}>
        {expanded ? (
          <input
            ref={inputRef}
            type="search"
            className="nvs-hs-exp__input"
            placeholder="O que você procura?"
            aria-label="Buscar"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={() => !q && setExpanded(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation()
                setQ('')
                setExpanded(false)
              }
            }}
          />
        ) : (
          <button type="button" className="nvs-hi" aria-label="Abrir busca" title="Buscar" onClick={() => setExpanded(true)}>
            <Search size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    )
  }
  if (kind === 'command') {
    const id = `${ctx.uid}-cmd`
    const pages = ctx.look.nav.map((n) => n.label)
    const actions = ['Criar projeto', 'Convidar pessoa', 'Alternar tema']
    const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    const match = (s: string) => norm(s).includes(norm(q))
    return (
      <>
        <button type="button" className="nvs-hs-cmd" {...ctx.menus.trigger(id, 'dialog')}>
          <Search size={15} aria-hidden="true" />
          <span className="nvs-hs-cmd__ph">Buscar…</span>
          <kbd>⌘K</kbd>
        </button>
        <Popover id={id} menus={ctx.menus} root={ctx.root} width={420} align="end" role="dialog" label="Paleta de comandos" focusInput className="nvs-cmd">
          <label className="nvs-cmd__field">
            <Search size={16} aria-hidden="true" />
            <input type="search" placeholder="Digite um comando ou página…" aria-label="Comando" value={q} onChange={(e) => setQ(e.target.value)} />
            <kbd>Esc</kbd>
          </label>
          <div className="nvs-pop__list">
            {[
              { title: 'Páginas', items: pages.filter(match) },
              { title: 'Ações', items: actions.filter(match) },
            ]
              .filter((g) => g.items.length)
              .map((g) => (
                <div key={g.title} className="nvs-pop__list">
                  <span className="nvs-pop__group">{g.title}</span>
                  {g.items.map((p) => (
                    <button key={p} type="button" role="menuitem" className="nvs-pop__item" onClick={() => ctx.menus.close(true)}>
                      {p}
                    </button>
                  ))}
                </div>
              ))}
            {!pages.some(match) && !actions.some(match) && <span className="nvs-pop__muted nvs-pop__empty">Nada encontrado para “{q}”.</span>}
          </div>
        </Popover>
      </>
    )
  }
  // wide
  const id = `${ctx.uid}-suggest`
  const trig = ctx.menus.trigger(id, 'listbox')
  return (
    <>
      <div className="nvs-hs-wide" ref={trig.ref as (el: HTMLDivElement | null) => void} data-nv-trigger={id}>
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          placeholder={WIDE_PLACEHOLDER[ctx.look.context] ?? 'Buscar no site…'}
          aria-label="Buscar"
          aria-expanded={trig['aria-expanded']}
          aria-haspopup="listbox"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => ctx.menus.show(id)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && ctx.menus.open !== id) {
              setQ('')
              e.currentTarget.blur()
            }
          }}
        />
        <span className="nvs-hs-wide__btn" aria-hidden="true">
          <Search size={15} />
        </span>
      </div>
      <Popover id={id} menus={ctx.menus} root={ctx.root} width="anchor" role="listbox" label="Sugestões">
        <div className="nvs-pop__list">
          <span className="nvs-pop__group">{q ? `Sugestões para “${q}”` : 'Buscas recentes'}</span>
          {(ctx.look.context === 'store' ? ['fone sem fio', 'cafeteira', 'tênis de corrida'] : ['alterar forma de pagamento', 'exportar relatório', 'conectar integração']).map((s) => (
            <button key={s} type="button" role="option" aria-selected={false} className="nvs-pop__item" onClick={() => ctx.menus.close()}>
              <Search size={14} aria-hidden="true" />
              {q ? `${q} ${s}` : s}
            </button>
          ))}
        </div>
      </Popover>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Ações                                                                       */
/* -------------------------------------------------------------------------- */

function ProfileMenu({ ctx, id }: { ctx: Ctx; id: string }) {
  return (
    <Popover id={id} menus={ctx.menus} root={ctx.root} width={240} align="end" label="Menu do perfil">
      <div className="nvs-pop__head">
        <span className="nvs-avatar nvs-avatar--lg" aria-hidden="true">
          MA
        </span>
        <span>
          <strong>Marina Alves</strong>
          <span className="nvs-pop__muted">marina@exemplo.com</span>
        </span>
      </div>
      <div className="nvs-pop__list">
        {[
          { label: 'Meu perfil', icon: <User size={15} aria-hidden="true" /> },
          { label: 'Configurações', icon: <Settings size={15} aria-hidden="true" /> },
          { label: 'Ajuda', icon: <CircleHelp size={15} aria-hidden="true" /> },
          { label: 'Sair', icon: <LogOut size={15} aria-hidden="true" /> },
        ].map((it) => (
          <button key={it.label} type="button" role="menuitem" className="nvs-pop__item" onClick={() => ctx.menus.close(true)}>
            {it.icon}
            {it.label}
          </button>
        ))}
      </div>
    </Popover>
  )
}

function ActionItem({ ctx, action }: { ctx: Ctx; action: HeaderAction }) {
  const { look, menus } = ctx
  const [themeDark, setThemeDark] = useState(false)
  const [segment, setSegment] = useState(0)
  const id = `${ctx.uid}-${action}`
  switch (action) {
    case 'cta':
      return (
        <button type="button" className="nvs-hb nvs-hb--primary">
          {look.cta ?? 'Começar'}
        </button>
      )
    case 'cta-outline':
      return (
        <button type="button" className="nvs-hb nvs-hb--outline">
          {look.cta ?? 'Começar'}
        </button>
      )
    case 'login':
      return (
        <button type="button" className="nvs-hb nvs-hb--ghost nvs-p-md">
          Entrar
        </button>
      )
    case 'sales':
      return (
        <button type="button" className="nvs-hb nvs-hb--ghost nvs-p-lg">
          Falar com vendas
        </button>
      )
    case 'notif':
      return (
        <>
          <button type="button" className="nvs-hi" aria-label="Notificações (2 novas)" title="Notificações" {...menus.trigger(id, 'dialog')}>
            <Bell size={18} aria-hidden="true" />
            <span className="nvs-hi__dot" aria-hidden="true">
              2
            </span>
          </button>
          <Popover id={id} menus={menus} root={ctx.root} width={320} align="end" role="dialog" label="Notificações">
            <div className="nvs-pop__title">
              <strong>Notificações</strong>
              <span className="nvs-pop__muted">2 novas</span>
            </div>
            <div className="nvs-pop__list">
              {NOTIFICATIONS.map((n) => (
                <button key={n.who} type="button" role="menuitem" className="nvs-pop__item nvs-notif" onClick={() => menus.close(true)}>
                  {n.unread && <span className="nvs-notif__dot" aria-label="Não lida" />}
                  <span>
                    <strong>{n.who}</strong> {n.what}
                    <span className="nvs-pop__muted">{n.when}</span>
                  </span>
                </button>
              ))}
            </div>
            <button type="button" className="nvs-pop__foot" onClick={() => menus.close(true)}>
              Ver todas
            </button>
          </Popover>
        </>
      )
    case 'profile':
      return (
        <>
          <button type="button" className="nvs-avatar-btn" aria-label="Abrir menu do perfil" title="Marina Alves" {...menus.trigger(id)}>
            <span className="nvs-avatar" aria-hidden="true">
              MA
            </span>
          </button>
          <ProfileMenu ctx={ctx} id={id} />
        </>
      )
    case 'profile-chip':
      return (
        <>
          <button type="button" className="nvs-chip" aria-label="Abrir menu do perfil" {...menus.trigger(id)}>
            <span className="nvs-avatar" aria-hidden="true">
              MA
            </span>
            <span className="nvs-chip__text nvs-p-md">
              <strong>Marina Alves</strong>
              <span>Plano Pro</span>
            </span>
            <ChevronDown size={14} aria-hidden="true" />
          </button>
          <ProfileMenu ctx={ctx} id={id} />
        </>
      )
    case 'cart':
      return (
        <button type="button" className="nvs-hi" aria-label="Sacola (3 itens)" title="Sacola">
          <ShoppingBag size={18} aria-hidden="true" />
          <span className="nvs-hi__dot" aria-hidden="true">
            3
          </span>
        </button>
      )
    case 'favorite':
      return (
        <button type="button" className="nvs-hi nvs-p-lg" aria-label="Favoritos" title="Favoritos">
          <Heart size={18} aria-hidden="true" />
        </button>
      )
    case 'help':
      return (
        <button type="button" className="nvs-hi nvs-p-lg" aria-label="Ajuda" title="Ajuda">
          <CircleHelp size={18} aria-hidden="true" />
        </button>
      )
    case 'theme':
      return (
        <button type="button" className="nvs-hi" aria-label={themeDark ? 'Usar tema claro' : 'Usar tema escuro'} aria-pressed={themeDark} onClick={() => setThemeDark((v) => !v)}>
          {themeDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
      )
    case 'phone':
      return (
        <span className="nvs-htext nvs-p-lg">
          <Phone size={15} aria-hidden="true" /> (11) 4000-1234
        </span>
      )
    case 'status':
      return (
        <span className="nvs-htext nvs-p-lg">
          <span className="nvs-status" aria-hidden="true" /> Operacional
        </span>
      )
    case 'countdown':
      return (
        <span className="nvs-count nvs-p-md" aria-label="Faltam 12 dias e 8 horas">
          <span>12d</span>
          <span>08h</span>
          <span>41m</span>
        </span>
      )
    case 'avail':
      return (
        <span className="nvs-avail">
          <span className="nvs-avail__dot" aria-hidden="true" />
          <span className="nvs-p-md">Disponível para projetos</span>
        </span>
      )
    case 'segments':
      return (
        <span className="nvs-seg nvs-p-md" role="group" aria-label="Público">
          {['Para você', 'Para empresas'].map((s, i) => (
            <button key={s} type="button" aria-pressed={segment === i} onClick={() => setSegment(i)}>
              {s}
            </button>
          ))}
        </span>
      )
    case 'export':
      return (
        <button type="button" className="nvs-hb nvs-hb--outline nvs-p-md">
          <Download size={15} aria-hidden="true" /> Exportar
        </button>
      )
    case 'apps':
      return (
        <>
          <button type="button" className="nvs-hi" aria-label="Aplicativos" title="Aplicativos" {...menus.trigger(id, 'dialog')}>
            <LayoutGrid size={18} aria-hidden="true" />
          </button>
          <Popover id={id} menus={menus} root={ctx.root} width={288} align="end" role="dialog" label="Aplicativos">
            <div className="nvs-apps">
              {APPS.map((a) => (
                <button key={a.label} type="button" role="menuitem" className="nvs-apps__item" onClick={() => menus.close(true)}>
                  <span className="nvs-apps__icon">
                    <NavIconView name={a.icon} size={18} />
                  </span>
                  {a.label}
                </button>
              ))}
            </div>
          </Popover>
        </>
      )
    case 'lang':
    case 'period':
    case 'version':
    case 'location':
    case 'create': {
      const menu = SIMPLE_MENUS[action]!
      const label =
        action === 'lang' ? (
          <>
            <Globe size={15} aria-hidden="true" /> PT
          </>
        ) : action === 'period' ? (
          'Últimos 30 dias'
        ) : action === 'version' ? (
          'v3.2'
        ) : action === 'location' ? (
          <>
            <MapPin size={15} aria-hidden="true" />
            <span className="nvs-loc">
              <span>Entregar em</span>
              <strong>Rua das Flores, 120</strong>
            </span>
          </>
        ) : (
          <>
            <Plus size={15} aria-hidden="true" /> Novo
          </>
        )
      const cls =
        action === 'create' ? 'nvs-hb nvs-hb--soft' : action === 'period' ? 'nvs-hb nvs-hb--outline' : action === 'lang' ? 'nvs-hb nvs-hb--ghost nvs-p-lg' : 'nvs-hb nvs-hb--ghost nvs-p-md'
      return (
        <>
          <button type="button" className={cls} {...menus.trigger(id)}>
            {label}
            {action !== 'create' && <ChevronDown size={14} aria-hidden="true" />}
          </button>
          <Popover id={id} menus={menus} root={ctx.root} width={action === 'location' ? 280 : 210} align="end" label={menu.label}>
            <div className="nvs-pop__list">
              {menu.items.map((it, k) => (
                <button key={it} type="button" role="menuitem" className="nvs-pop__item" onClick={() => menus.close(true)}>
                  {it}
                  {k === (action === 'period' ? 2 : 0) && action !== 'create' && <Check size={14} className="nvs-pop__check" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </Popover>
        </>
      )
    }
    default:
      return null
  }
}

function ActionsArea({ ctx, actions }: { ctx: Ctx; actions?: HeaderAction[] }) {
  const list = actions ?? ctx.look.actions
  if (!list.length) return null
  return (
    <div className="nvs-hacts">
      {list.map((a) => (
        <ActionItem key={a} ctx={ctx} action={a} />
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Menus de painel (Menu / celular)                                             */
/* -------------------------------------------------------------------------- */

function SheetMenu({ ctx, id, big }: { ctx: Ctx; id: string; big?: boolean }) {
  const { look } = ctx
  const [openSub, setOpenSub] = useState<number | null>(null)
  return (
    <Popover id={id} menus={ctx.menus} root={ctx.root} width={0} placement="sheet" role="dialog" label="Menu de navegação" className={cx('nvs-sheet', big && 'nvs-sheet--big')}>
      <div className="nvs-sheet__list">
        {look.nav.map((n, i) => {
          const sub = n.menu === 'mega' ? megaFor(n, look).cols.flatMap((c) => c.links).slice(0, 6) : n.items
          const subOpen = openSub === i
          return (
            <div key={n.label} className="nvs-sheet__group">
              <button
                type="button"
                role="menuitem"
                className="nvs-sheet__item"
                aria-current={ctx.active === i ? 'page' : undefined}
                aria-expanded={n.menu ? subOpen : undefined}
                onClick={() => {
                  if (n.menu) setOpenSub(subOpen ? null : i)
                  else {
                    ctx.select(i)
                    ctx.menus.close(true)
                  }
                }}
              >
                {big && <span className="nvs-sheet__num">{String(i + 1).padStart(2, '0')}</span>}
                {n.icon && <NavIconView name={n.icon} size={18} />}
                <span>{n.label}</span>
                {n.menu && <ChevronDown size={16} className="nvs-sheet__chev" data-open={subOpen} aria-hidden="true" />}
              </button>
              {n.menu && subOpen && sub && (
                <div className="nvs-sheet__sub">
                  {sub.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="menuitem"
                      className="nvs-sheet__subitem"
                      onClick={() => {
                        ctx.select(i)
                        ctx.menus.close(true)
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
        {!!look.utility?.length && (
          <div className="nvs-sheet__utility">
            {look.utility.map((u) => (
              <span key={u}>{u}</span>
            ))}
          </div>
        )}
      </div>
      {(look.actions.includes('login') || look.actions.includes('cta') || look.actions.includes('cta-outline')) && (
        <div className="nvs-sheet__actions">
          {look.actions.includes('login') && (
            <button type="button" className="nvs-hb nvs-hb--outline nvs-hb--block">
              Entrar
            </button>
          )}
          {(look.actions.includes('cta') || look.actions.includes('cta-outline')) && (
            <button type="button" className="nvs-hb nvs-hb--primary nvs-hb--block">
              {look.cta ?? 'Começar'}
            </button>
          )}
        </div>
      )}
    </Popover>
  )
}

function MenuButton({ ctx, id, label = 'Menu', text }: { ctx: Ctx; id: string; label?: string; text?: boolean }) {
  const open = ctx.menus.open === id
  return (
    <button type="button" className={text ? 'nvs-hb nvs-hb--ghost nvs-menu-btn' : 'nvs-hi nvs-menu-btn'} aria-label={open ? 'Fechar menu' : 'Abrir menu'} {...ctx.menus.trigger(id, 'dialog')}>
      {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      {text && <span>{open ? 'Fechar' : label}</span>}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Faixas extras                                                               */
/* -------------------------------------------------------------------------- */

function Breadcrumbs({ ctx }: { ctx: Ctx }) {
  const crumbs = ctx.look.breadcrumbs ?? []
  return (
    <nav aria-label="Você está em" className="nvs-crumbs">
      <ol>
        {crumbs.map((c, i) => (
          <li key={c}>
            {i > 0 && (
              <span className="nvs-crumbs__sep" aria-hidden="true">
                /
              </span>
            )}
            <button type="button" className="nvs-crumbs__item" aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
              {c}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function Announcement({ look, compact, onClose }: { look: HeaderLook; compact: boolean; onClose: () => void }) {
  return (
    <div className="nvs-announce" data-compact={compact}>
      <span className="nvs-announce__text">
        {look.announcement}
        <span className="nvs-announce__link">
          Saiba mais <ArrowRight size={13} aria-hidden="true" />
        </span>
      </span>
      <button type="button" className="nvs-announce__close" aria-label="Dispensar anúncio" onClick={onClose}>
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Componente principal                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Header de navegação renderizado a partir da receita do catálogo. Ocupa 100% da largura
 * disponível; a altura vem do modelo. Menus e popovers ficam dentro da moldura mais próxima
 * marcada com `data-nv-frame` (ou dentro da janela).
 */
export function HeaderPreview({ model, variant, theme, interactive = true, compact, scrolled = false, onNavigate, content, className }: HeaderPreviewProps) {
  const comp = model.compositions[variant]
  const look = withHeaderContent(headerLookFor(model, variant), content)
  const rootRef = useRef<HTMLDivElement>(null)
  const width = useWidth(rootRef)
  const isCompact = compact ?? (width > 0 && width < 640)
  const surface = look.surface === 'transparent' && scrolled ? 'solid' : look.surface
  const colors = headerColors(theme, surface)
  const menus = useMenus(interactive)
  const [active, setActive] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const uid = useUid()
  useInert(rootRef, !interactive)

  const { close } = menus
  useEffect(() => {
    close()
  }, [variant, isCompact, close])

  const select = (i: number) => {
    setActive(i)
    const label = look.nav[i]?.label
    if (label) onNavigate?.(label)
  }

  const ctx: Ctx = { look, theme, colors, menus, root: rootRef, active, select, compact: isCompact, uid }
  const layout = comp.layout
  const shrunk = scrolled && look.shrink && !isCompact
  const h = isCompact ? 56 : shrunk ? look.shrink! : look.height
  const floating = look.shape === 'floating' || (look.shape === 'islands' && isCompact)
  const islands = look.shape === 'islands' && !isCompact
  const twoRowColors = (layout === 'two-row' || look.breadcrumbStyle === 'row') && (surface === 'brand' || surface === 'inverse' || surface === 'gradient') ? headerColors(theme, 'solid') : null

  const rootStyle: CSSProperties = {
    ...navVars(theme, colors),
    fontFamily: theme.metrics.bodyFont,
    ['--nv-h' as string]: `${h}px`,
    ['--nv-maxw' as string]: look.maxWidth && !isCompact ? `${look.maxWidth}px` : 'none',
  }

  // Logo solto (sem ilha) sobre o hero escuro: usa a cor de texto legível sobre a imagem.
  const overHero = look.context === 'hero' || look.context === 'event'
  const hero = heroColors(theme)
  const heroVars = { ['--nv-text' as string]: hero.text, ['--nv-base' as string]: hero.from } as CSSProperties
  const showAnnouncement = look.announcement && look.announceStyle !== 'pill' && !dismissed
  const announcementPill = look.announcement && look.announceStyle === 'pill' && !isCompact
  const logoSize = look.logo === 'big' && (layout === 'stacked' || layout === 'right') ? 'lg' : 'md'
  const logo = <HeaderLogo look={look} theme={theme} size={isCompact ? 'sm' : logoSize} />
  const brandBtn = (
    <button type="button" className="nvs-brand" aria-label={`${look.brand} — página inicial`} onClick={() => select(0)}>
      {logo}
    </button>
  )
  const pill = announcementPill ? (
    <span className="nvs-newpill nvs-p-md">
      <span>Novo</span>
      {look.announcement!.replace(/^Novo\s*·\s*/, '')}
      <ArrowRight size={13} aria-hidden="true" />
    </span>
  ) : null
  const greeting = look.greeting ? (
    <span className="nvs-greet nvs-p-md">
      <strong>{look.greeting}</strong>
      <span>Terça-feira, 3 de novembro</span>
    </span>
  ) : null
  const crumbsInline = look.breadcrumbs?.length && look.breadcrumbStyle !== 'row' ? <Breadcrumbs ctx={ctx} /> : null
  const search = <SearchArea ctx={ctx} kind={look.search} />
  const actions = <ActionsArea ctx={ctx} />

  let main: ReactNode
  let second: ReactNode = null

  if (isCompact) {
    const menuId = `${uid}-mobile`
    const hasMenu = look.nav.length > 0 || look.actions.some((a) => a === 'cta' || a === 'cta-outline' || a === 'login')
    const leftMenu = layout === 'menu-left'
    main = (
      <div className="nvs-hrow nvs-hrow--mobile">
        {leftMenu && hasMenu && <MenuButton ctx={ctx} id={menuId} />}
        <div className={cx('nvs-hrow__brand', leftMenu && 'nvs-hrow__brand--center')}>{brandBtn}</div>
        <div className="nvs-hrow__end">
          {look.search && look.search !== 'wide' && (
            <button type="button" className="nvs-hi" aria-label="Buscar">
              <Search size={19} aria-hidden="true" />
            </button>
          )}
          {look.actions.includes('cart') && <ActionItem ctx={ctx} action="cart" />}
          {look.actions.includes('notif') && !look.actions.includes('cart') && <ActionItem ctx={ctx} action="notif" />}
          {(look.actions.includes('profile') || look.actions.includes('profile-chip')) && <ActionItem ctx={ctx} action="profile" />}
          {!leftMenu && hasMenu && <MenuButton ctx={ctx} id={menuId} />}
        </div>
        {hasMenu && <SheetMenu ctx={ctx} id={menuId} />}
      </div>
    )
    if (look.search === 'wide')
      second = (
        <div className="nvs-hrow2 nvs-hrow2--search">
          <SearchArea ctx={ctx} kind="wide" />
        </div>
      )
    else if (look.breadcrumbs?.length)
      second = (
        <div className="nvs-hrow2 nvs-hrow2--crumb">
          <button type="button" className="nvs-crumbs__back">
            ‹ {look.breadcrumbs[look.breadcrumbs.length - 2] ?? 'Voltar'}
          </button>
        </div>
      )
  } else {
    switch (layout) {
      case 'split':
        main = (
          <div className="nvs-hrow nvs-hrow--split">
            <div className="nvs-hrow__start">
              {brandBtn}
              {pill}
            </div>
            <div className="nvs-hrow__center">
              <NavLinks ctx={ctx} />
            </div>
            <div className="nvs-hrow__end">
              {search}
              {actions}
            </div>
          </div>
        )
        break
      case 'left':
        main = (
          <div className="nvs-hrow">
            <div className="nvs-hrow__start nvs-hrow__start--grow">
              {brandBtn}
              {pill}
              {greeting}
              {crumbsInline}
              <NavLinks ctx={ctx} />
            </div>
            <div className="nvs-hrow__end">
              {search}
              {actions}
            </div>
          </div>
        )
        break
      case 'right':
        main = (
          <div className="nvs-hrow">
            <div className="nvs-hrow__start nvs-hrow__start--grow">
              {brandBtn}
              {pill}
            </div>
            <div className="nvs-hrow__end">
              <NavLinks ctx={ctx} />
              {search}
              {actions}
            </div>
          </div>
        )
        break
      case 'center-logo': {
        const half = Math.ceil(look.nav.length / 2)
        main = (
          <div className="nvs-hrow nvs-hrow--split">
            <div className="nvs-hrow__start">
              <NavLinks ctx={ctx} from={0} to={half} label="Principal, primeira parte" />
            </div>
            <div className="nvs-hrow__center">{brandBtn}</div>
            <div className="nvs-hrow__end">
              <NavLinks ctx={ctx} from={half} label="Principal, segunda parte" />
              {search}
              {actions}
            </div>
          </div>
        )
        break
      }
      case 'stacked':
        main = (
          <div className="nvs-hrow nvs-hrow--split nvs-hrow--stacked">
            <div className="nvs-hrow__start">
              {look.utility?.[0] && <span className="nvs-htext nvs-htext--muted nvs-p-md">{look.utility[0]}</span>}
              {search}
            </div>
            <div className="nvs-hrow__center">{brandBtn}</div>
            <div className="nvs-hrow__end">{actions}</div>
          </div>
        )
        second = (
          <div className="nvs-hrow2 nvs-hrow2--center" data-rule={look.navStyle === 'caps'}>
            <NavLinks ctx={ctx} />
          </div>
        )
        break
      case 'two-row':
        main = (
          <div className="nvs-hrow">
            <div className="nvs-hrow__start">{brandBtn}</div>
            {look.search === 'wide' || look.search === 'field' ? <div className="nvs-hrow__grow">{search}</div> : <div className="nvs-hrow__spacer" />}
            <div className="nvs-hrow__end">
              {look.search && look.search !== 'wide' && look.search !== 'field' && search}
              {actions}
            </div>
          </div>
        )
        second = (
          <div className="nvs-hrow2" style={twoRowColors ? navVars(theme, twoRowColors) : undefined} data-own={Boolean(twoRowColors)}>
            <NavLinks ctx={ctx} />
            {look.navStyle === 'blocks' ? null : look.actions.includes('phone') ? null : look.utility?.length ? (
              <span className="nvs-htext nvs-htext--muted nvs-p-md">{look.utility.join(' · ')}</span>
            ) : null}
          </div>
        )
        break
      case 'search-center':
        main = (
          <div className="nvs-hrow">
            <div className="nvs-hrow__start">
              {brandBtn}
              <NavCollapsed ctx={ctx} />
            </div>
            <div className="nvs-hrow__grow nvs-hrow__grow--center">
              <SearchArea ctx={ctx} kind={look.search === 'command' ? 'command' : 'wide'} />
            </div>
            <div className="nvs-hrow__end">{actions}</div>
          </div>
        )
        break
      case 'menu-only': {
        const id = `${uid}-full`
        main = (
          <div className="nvs-hrow">
            <div className="nvs-hrow__start nvs-hrow__start--grow">{brandBtn}</div>
            <div className="nvs-hrow__end">
              {actions}
              <MenuButton ctx={ctx} id={id} text />
            </div>
            <SheetMenu ctx={ctx} id={id} big />
          </div>
        )
        break
      }
      case 'menu-left': {
        const id = `${uid}-full`
        main = (
          <div className="nvs-hrow nvs-hrow--split">
            <div className="nvs-hrow__start">
              <MenuButton ctx={ctx} id={id} text />
            </div>
            <div className="nvs-hrow__center">{brandBtn}</div>
            <div className="nvs-hrow__end">
              {search}
              {actions}
            </div>
            <SheetMenu ctx={ctx} id={id} big={look.navStyle === 'bold'} />
          </div>
        )
        break
      }
      case 'islands':
        main = (
          <div className="nvs-hrow nvs-hrow--islands">
            <div className="nvs-island">{brandBtn}</div>
            <div className="nvs-island nvs-island--nav">
              <NavLinks ctx={ctx} />
            </div>
            <div className="nvs-island">
              {search}
              {actions}
            </div>
          </div>
        )
        break
      case 'islands-right':
        main = (
          <div className="nvs-hrow nvs-hrow--islands">
            <div className="nvs-island nvs-island--bare" style={overHero ? heroVars : undefined}>
              {brandBtn}
            </div>
            <div className="nvs-hrow__end">
              <div className="nvs-island nvs-island--nav">
                <NavLinks ctx={ctx} />
              </div>
              <div className="nvs-island">
                {search}
                {actions}
              </div>
            </div>
          </div>
        )
        break
    }
    if (look.breadcrumbs?.length && look.breadcrumbStyle === 'row') {
      second = (
        <div className="nvs-hrow2 nvs-hrow2--crumb" style={twoRowColors ? navVars(theme, twoRowColors) : undefined}>
          <Breadcrumbs ctx={ctx} />
          <button type="button" className="nvs-hb nvs-hb--outline nvs-hb--sm">
            Compartilhar
          </button>
        </div>
      )
    }
  }

  return (
    <div
      ref={rootRef}
      className={cx('nvs-h', className)}
      data-shape={look.shape}
      data-surface={surface}
      data-compact={isCompact}
      data-floating={floating}
      data-islands={islands}
      data-scrolled={scrolled}
      data-layout={layout}
      data-navstyle={look.navStyle}
      style={rootStyle}
    >
      {showAnnouncement && <Announcement look={look} compact={isCompact} onClose={() => setDismissed(true)} />}
      {!!look.utility?.length && !isCompact && layout !== 'stacked' && layout !== 'two-row' && (
        <div className="nvs-hutil">
          <div className="nvs-hutil__in">
            {look.actions.includes('segments') || look.utility.includes('Para você') ? (
              <span className="nvs-hutil__group">
                {look.utility.map((u, i) => (
                  <span key={u} className={cx(i === 0 && 'nvs-hutil__on')}>
                    {u}
                  </span>
                ))}
              </span>
            ) : (
              <>
                <span className="nvs-hutil__group">{look.utility.slice(0, -1).map((u) => <span key={u}>{u}</span>)}</span>
                <span className="nvs-hutil__group">
                  <Phone size={13} aria-hidden="true" /> {look.utility[look.utility.length - 1]}
                </span>
              </>
            )}
          </div>
        </div>
      )}
      <header className="nvs-hbar" aria-label={`Header ${model.name}`}>
        <div className="nvs-hbar__in">
          {main}
          {second}
        </div>
      </header>
    </div>
  )
}
