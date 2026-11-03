import { useEffect, useMemo, useRef, useState, type CSSProperties, type FocusEvent, type ReactNode } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleHelp,
  LogOut,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Rocket,
  Search,
  Settings,
  Sun,
  User,
  X,
} from 'lucide-react'
import { cx } from '@/ui'
import type { ResolvedTheme } from '@/core/types'
import { sidebarLookFor, withSidebarContent, type NavContent } from './catalog'
import { NavIconView } from './icons'
import { Popover, useInert, useMenus, type MenuApi } from './menu'
import { navVars, sidebarColors, type NavColors } from './palette'
import type { SidebarArrangement, SidebarGroup, SidebarItem, SidebarLook, SidebarModel } from './types'
import './navigation.css'

export interface SidebarPreviewProps {
  model: SidebarModel
  variant: 0 | 1
  theme: ResolvedTheme
  /** Itens, submenus, colapso e menus funcionam (padrão: true). Falso = prévia estática e inerte. */
  interactive?: boolean
  /** Estado recolhido (controlado). Sem a prop, a própria sidebar guarda o estado. */
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** Apresentação de celular (drawer): rótulos sempre visíveis, sem colapso. */
  compact?: boolean
  /** No modo drawer, mostra um botão ✕ que chama esta função. */
  onClose?: () => void
  /** Esconde o logo (quando um header acima já mostra a marca). */
  hideBrand?: boolean
  /** Avisado quando a pessoa escolhe um item. */
  onNavigate?: (label: string) => void
  /** Marca e itens de menu reais do projeto (prévia integrada). */
  content?: NavContent
  className?: string
}

const STEP_DESC = ['Nome, CPF e contato', 'CEP e endereço completo', 'Foto do RG ou da CNH', 'Confira as informações', 'Assinatura digital']

const WORKSPACES = ['Equipe Aurora', 'Estúdio Norte', 'Projetos pessoais']

let uidSeq = 0

function norm(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function filterGroups(groups: SidebarGroup[], q: string): SidebarGroup[] {
  if (!q.trim()) return groups
  const n = norm(q)
  return groups
    .map((g) => ({
      ...g,
      items: g.items
        .filter((i) => norm(i.label).includes(n) || i.children?.some((c) => norm(c).includes(n)))
        .map((i) => (i.children && !norm(i.label).includes(n) ? { ...i, children: i.children.filter((c) => norm(c).includes(n)) } : i)),
    }))
    .filter((g) => g.items.length)
}

interface Ctx {
  look: SidebarLook
  arr: SidebarArrangement
  model: SidebarModel
  theme: ResolvedTheme
  colors: NavColors
  menus: MenuApi
  root: React.RefObject<HTMLDivElement>
  uid: string
  rail: boolean
  labelsBelow: boolean
  compact: boolean
  active: string
  setActive: (label: string) => void
  openSubs: string[]
  toggleSub: (label: string) => void
  showTip: (label: string, el: HTMLElement) => void
  hideTip: () => void
}

/* -------------------------------------------------------------------------- */
/* Peças                                                                       */
/* -------------------------------------------------------------------------- */

function Mark({ look }: { look: SidebarLook }) {
  return (
    <span className="nvs-smark" aria-hidden="true">
      {look.brand.charAt(0)}
    </span>
  )
}

function Brand({ ctx, extra }: { ctx: Ctx; extra?: ReactNode }) {
  if (ctx.rail) {
    return (
      <div className="nvs-stop nvs-stop--mark">
        <Mark look={ctx.look} />
        {extra}
      </div>
    )
  }
  return (
    <div className="nvs-stop nvs-stop--logo">
      <span className="nvs-sbrand">
        <Mark look={ctx.look} />
        <span className="nvs-sbrand__name" style={{ fontFamily: ctx.theme.metrics.headingFont }}>
          {ctx.look.brand}
        </span>
      </span>
      {extra}
    </div>
  )
}

function SearchField({ ctx, value, onChange, placeholder = 'Buscar no menu' }: { ctx: Ctx; value: string; onChange: (v: string) => void; placeholder?: string }) {
  if (ctx.rail)
    return (
      <button type="button" className="nvs-sicon" aria-label="Buscar" onMouseEnter={(e) => ctx.showTip('Buscar', e.currentTarget)} onMouseLeave={ctx.hideTip}>
        <Search size={18} aria-hidden="true" />
      </button>
    )
  return (
    <label className="nvs-ssearch">
      <Search size={15} aria-hidden="true" />
      <input
        type="search"
        aria-label={placeholder}
        placeholder={ctx.look.mono ? 'Ir para…' : placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation()
            onChange('')
          }
        }}
      />
      <kbd>⌘K</kbd>
    </label>
  )
}

function Workspace({ ctx, placement = 'bottom', extra }: { ctx: Ctx; placement?: 'bottom' | 'top'; extra?: ReactNode }) {
  const id = `${ctx.uid}-ws-${placement}`
  const [current, setCurrent] = useState(0)
  const items = ctx.look.mono
    ? ['prod-sa-east', 'homologacao', 'dev-local']
    : ctx.model.id === 'caixa-entrada'
      ? ['contato@sanhaco.com', 'marina@sanhaco.com']
      : ctx.model.filters.includes('corporativos')
        ? ['Matriz — São Paulo', 'Filial — Recife', 'Filial — Curitiba']
        : [ctx.look.brand, ...WORKSPACES.slice(1)]
  const name = items[current] ?? items[0]
  return (
    <div className={cx('nvs-stop', placement === 'top' && 'nvs-sfoot__block')}>
      <div className="nvs-srow">
        <button type="button" className="nvs-ws" aria-label={`Espaço atual: ${name}. Trocar`} {...ctx.menus.trigger(id)}>
          <span className="nvs-ws__avatar" aria-hidden="true">
            {name.charAt(0).toUpperCase()}
          </span>
          {!ctx.rail && (
            <>
              <span className="nvs-ws__text">
                <strong>{name}</strong>
                <span>{ctx.look.mono ? 'Ambiente · operacional' : ctx.model.filters.includes('corporativos') ? 'Unidade' : 'Plano Pro · 8 membros'}</span>
              </span>
              <ChevronsUpDown size={15} aria-hidden="true" className="nvs-ws__chev" />
            </>
          )}
        </button>
        {extra}
      </div>
      <Popover id={id} menus={ctx.menus} root={ctx.root} width={230} placement={placement} label="Trocar espaço">
        <span className="nvs-pop__group">Seus espaços</span>
        <div className="nvs-pop__list">
          {items.map((w, i) => (
            <button
              key={w}
              type="button"
              role="menuitemradio"
              aria-checked={(i === current) as boolean}
              className="nvs-pop__item"
              onClick={() => {
                setCurrent(i)
                ctx.menus.close(true)
              }}
            >
              <span className="nvs-ws__avatar nvs-ws__avatar--sm" aria-hidden="true">
                {w.charAt(0).toUpperCase()}
              </span>
              {w}
              {i === current && <Check size={14} className="nvs-pop__check" aria-hidden="true" />}
            </button>
          ))}
          <button type="button" role="menuitem" className="nvs-pop__item" onClick={() => ctx.menus.close(true)}>
            <Plus size={15} aria-hidden="true" /> Criar espaço
          </button>
        </div>
      </Popover>
    </div>
  )
}

function ProfileMenu({ ctx, id }: { ctx: Ctx; id: string }) {
  const [dark, setDark] = useState(false)
  return (
    <Popover id={id} menus={ctx.menus} root={ctx.root} width={220} placement="top" label="Menu do perfil">
      <div className="nvs-pop__list">
        <button type="button" role="menuitem" className="nvs-pop__item" onClick={() => ctx.menus.close(true)}>
          <User size={15} aria-hidden="true" /> Meu perfil
        </button>
        <button type="button" role="menuitem" className="nvs-pop__item" onClick={() => ctx.menus.close(true)}>
          <Settings size={15} aria-hidden="true" /> Preferências
        </button>
        <button type="button" role="menuitem" className="nvs-pop__item" aria-pressed={dark} onClick={() => setDark((d) => !d)}>
          {dark ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />} Tema {dark ? 'claro' : 'escuro'}
        </button>
        <button type="button" role="menuitem" className="nvs-pop__item" onClick={() => ctx.menus.close(true)}>
          <LogOut size={15} aria-hidden="true" /> Sair
        </button>
      </div>
    </Popover>
  )
}

function ProjectTop({ ctx, sections, section, setSection }: { ctx: Ctx; sections?: SidebarLook['sections']; section: number; setSection: (i: number) => void }) {
  const { model, look, arr } = ctx
  if (ctx.rail) return <Brand ctx={ctx} />
  if (sections?.length) {
    const id = `${ctx.uid}-section`
    const current = sections[section]
    return (
      <div className="nvs-stop">
        <button type="button" className="nvs-sback">
          <ArrowLeft size={14} aria-hidden="true" /> {model.id === 'contexto-projeto' ? 'Todos os projetos' : 'Início'}
        </button>
        <button type="button" className="nvs-ws" {...ctx.menus.trigger(id)}>
          <span className="nvs-ws__avatar" aria-hidden="true">
            <NavIconView name={current.icon} size={16} />
          </span>
          <span className="nvs-ws__text">
            <strong>{model.id === 'contexto-projeto' && section === 0 ? 'Projeto Aurora' : current.label}</strong>
            <span>Trocar área</span>
          </span>
          <ChevronDown size={15} aria-hidden="true" className="nvs-ws__chev" />
        </button>
        <Popover id={id} menus={ctx.menus} root={ctx.root} width={220} label="Trocar área">
          <div className="nvs-pop__list">
            {sections.map((s, i) => (
              <button
                key={s.label}
                type="button"
                role="menuitemradio"
                aria-checked={(i === section) as boolean}
                className="nvs-pop__item"
                onClick={() => {
                  setSection(i)
                  ctx.menus.close(true)
                }}
              >
                <NavIconView name={s.icon} size={15} /> {s.label}
                {i === section && <Check size={14} className="nvs-pop__check" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </Popover>
      </div>
    )
  }
  if (arr.body === 'stepper') {
    const items = look.groups[0]?.items ?? []
    const course = items.some((i) => i.children?.length)
    return (
      <div className="nvs-stop nvs-sprogress">
        <span className="nvs-sprogress__kicker">{course ? 'Curso' : look.brand}</span>
        <strong>{course ? 'Design de Interfaces' : `Etapa 3 de ${items.length}`}</strong>
        <span className="nvs-meter" aria-hidden="true">
          <span style={{ width: course ? '45%' : `${(2 / items.length) * 100}%` }} />
        </span>
        <span className="nvs-sprogress__muted">{course ? '45% concluído · 9 de 20 aulas' : 'Faltam cerca de 4 minutos'}</span>
      </div>
    )
  }
  if (look.mono) return <Workspace ctx={ctx} />
  return (
    <div className="nvs-stop">
      <button type="button" className="nvs-sback">
        <ArrowLeft size={14} aria-hidden="true" /> Voltar ao app
      </button>
      <strong className="nvs-stitle" style={{ fontFamily: ctx.theme.metrics.headingFont }}>
        Configurações
      </strong>
    </div>
  )
}

function ItemIcon({ ctx, item }: { ctx: Ctx; item: SidebarItem }) {
  const { look } = ctx
  if (item.dot && !ctx.rail) return <span className="nvs-sdot" data-tone={item.dot} aria-hidden="true" />
  if (look.icons === 'none' && !ctx.rail) return null
  if (look.icons === 'dot' && !ctx.rail) return <span className="nvs-sdot" data-tone="primary" aria-hidden="true" />
  if (look.icons === 'tile' || look.itemStyle === 'tile')
    return (
      <span className="nvs-stile" aria-hidden="true">
        <NavIconView name={item.icon} size={16} filled={ctx.theme.geometry.iconStyle !== 'outline'} />
      </span>
    )
  return (
    <span className="nvs-sico" aria-hidden="true">
      <NavIconView name={item.icon} size={18} filled={ctx.theme.geometry.iconStyle !== 'outline'} />
    </span>
  )
}

function Item({ ctx, item }: { ctx: Ctx; item: SidebarItem }) {
  const current = ctx.active === item.label || Boolean(item.children?.includes(ctx.active))
  const hasKids = Boolean(item.children?.length)
  const flyout = hasKids && ctx.arr.submenu === 'flyout' && !ctx.compact
  const subOpen = ctx.openSubs.includes(item.label)
  const flyId = `${ctx.uid}-fly-${item.label}`
  const tipProps = ctx.rail
    ? {
        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => ctx.menus.open !== flyId && ctx.showTip(item.label, e.currentTarget),
        onMouseLeave: ctx.hideTip,
        onFocus: (e: FocusEvent<HTMLElement>) => ctx.showTip(item.label, e.currentTarget),
        onBlur: ctx.hideTip,
      }
    : {}
  const body = (
    <>
      <ItemIcon ctx={ctx} item={item} />
      {!ctx.rail && <span className="nvs-si__label">{item.label}</span>}
      {ctx.labelsBelow && <span className="nvs-si__below">{item.label}</span>}
      {item.badge && (ctx.rail ? <span className="nvs-si__pip" aria-label={`${item.badge} novos`} /> : <span className="nvs-si__badge">{item.badge}</span>)}
      {hasKids && !ctx.rail && (flyout ? <ChevronRight size={15} className="nvs-si__chev" aria-hidden="true" /> : <ChevronDown size={15} className="nvs-si__chev" data-open={subOpen} aria-hidden="true" />)}
    </>
  )
  return (
    <li>
      {flyout ? (
        <>
          <button
            type="button"
            className="nvs-si"
            aria-current={current ? 'page' : undefined}
            aria-label={ctx.rail ? item.label : undefined}
            {...ctx.menus.trigger(flyId)}
            onClick={(e) => {
              ctx.hideTip()
              ctx.menus.toggle(flyId, e)
            }}
            {...tipProps}
          >
            {body}
          </button>
          <Popover id={flyId} menus={ctx.menus} root={ctx.root} width={220} placement="right" label={item.label} className="nvs-fly">
            <span className="nvs-pop__group">{item.label}</span>
            <div className="nvs-pop__list">
              {item.children!.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="menuitem"
                  className="nvs-pop__item"
                  aria-current={ctx.active === c ? 'page' : undefined}
                  onClick={() => {
                    ctx.setActive(c)
                    ctx.menus.close(true)
                  }}
                >
                  {c}
                  {ctx.active === c && <Check size={14} className="nvs-pop__check" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </Popover>
        </>
      ) : (
        <button
          type="button"
          className="nvs-si"
          aria-current={current && !hasKids ? 'page' : undefined}
          data-parent-active={current && hasKids ? 'true' : undefined}
          aria-expanded={hasKids ? subOpen : undefined}
          aria-label={ctx.rail ? item.label : undefined}
          onClick={() => (hasKids ? ctx.toggleSub(item.label) : ctx.setActive(item.label))}
          {...tipProps}
        >
          {body}
        </button>
      )}
      {hasKids && !flyout && subOpen && !ctx.rail && (
        <ul className="nvs-ssub">
          {item.children!.map((c) => (
            <li key={c}>
              <button type="button" className="nvs-ssi" aria-current={ctx.active === c ? 'page' : undefined} onClick={() => ctx.setActive(c)}>
                {c}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function GroupList({ ctx, groups, flat }: { ctx: Ctx; groups: SidebarGroup[]; flat?: boolean }) {
  const titles = flat ? 'divider' : ctx.look.groupTitles
  return (
    <>
      {groups.map((g, gi) => (
        <div key={(g.title ?? '') + gi} className="nvs-sgroup" data-titles={ctx.rail ? 'divider' : titles} data-first={gi === 0}>
          {g.title && titles !== 'none' && titles !== 'divider' && !ctx.rail && (
            <span className="nvs-sgroup__title" id={`${ctx.uid}-g${gi}`}>
              {g.title}
            </span>
          )}
          <ul className="nvs-slist" aria-labelledby={g.title && titles !== 'none' && titles !== 'divider' && !ctx.rail ? `${ctx.uid}-g${gi}` : undefined}>
            {g.items.map((it) => (
              <Item key={it.label} ctx={ctx} item={it} />
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

function Tiles({ ctx, groups }: { ctx: Ctx; groups: SidebarGroup[] }) {
  return (
    <>
      {groups.map((g, gi) => (
        <div key={(g.title ?? '') + gi} className="nvs-sgroup" data-titles={ctx.look.groupTitles} data-first={gi === 0}>
          {g.title && <span className="nvs-sgroup__title">{g.title}</span>}
          <ul className="nvs-stiles">
            {g.items.map((it) => (
              <li key={it.label}>
                <button type="button" className="nvs-stilebtn" aria-current={ctx.active === it.label ? 'page' : undefined} onClick={() => ctx.setActive(it.label)}>
                  <span className="nvs-stile nvs-stile--lg" aria-hidden="true">
                    <NavIconView name={it.icon} size={18} />
                  </span>
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

function Stepper({ ctx, groups }: { ctx: Ctx; groups: SidebarGroup[] }) {
  const items = groups.flatMap((g) => g.items)
  const activeIdx = Math.max(
    0,
    items.findIndex((i) => i.label === ctx.active || i.children?.includes(ctx.active)),
  )
  return (
    <ol className="nvs-steps">
      {items.map((it, i) => {
        const state = i < activeIdx ? 'done' : i === activeIdx ? 'current' : 'todo'
        return (
          <li key={it.label} data-state={state}>
            <button type="button" className="nvs-step" aria-current={state === 'current' ? 'step' : undefined} onClick={() => ctx.setActive(it.label)}>
              <span className="nvs-step__dot" aria-hidden="true">
                {state === 'done' ? <Check size={13} /> : i + 1}
              </span>
              <span className="nvs-step__text">
                <strong>{it.label}</strong>
                <span>{it.children ? `${it.children.length} aulas` : STEP_DESC[i] ?? ''}</span>
              </span>
            </button>
            {state === 'current' && it.children && (
              <ul className="nvs-ssub nvs-ssub--steps">
                {it.children.map((c, k) => (
                  <li key={c}>
                    <button type="button" className="nvs-ssi" aria-current={k === 0 ? 'page' : undefined}>
                      {k === 0 ? <Check size={12} aria-hidden="true" /> : <span className="nvs-step__mini" aria-hidden="true" />}
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function Footer({ ctx, kind, collapseBtn }: { ctx: Ctx; kind: SidebarArrangement['footer']; collapseBtn: ReactNode }) {
  const profId = `${ctx.uid}-prof`
  const [dark, setDark] = useState(false)
  switch (kind) {
    case 'none':
      return null
    case 'collapse':
      return <div className="nvs-sfoot">{collapseBtn}</div>
    case 'profile':
      return (
        <div className="nvs-sfoot">
          <button type="button" className="nvs-sprof" aria-label="Abrir menu do perfil" {...ctx.menus.trigger(profId)}>
            <span className="nvs-avatar" aria-hidden="true">
              MA
              {ctx.model.id === 'rodape-pessoal' && <span className="nvs-avatar__status" />}
            </span>
            {!ctx.rail && (
              <>
                <span className="nvs-sprof__text">
                  <strong>Marina Alves</strong>
                  <span>{ctx.model.id === 'rodape-pessoal' ? 'Disponível' : ctx.model.filters.includes('corporativos') ? 'Gerente de compras' : 'marina@exemplo.com'}</span>
                </span>
                <MoreHorizontal size={16} aria-hidden="true" />
              </>
            )}
          </button>
          <ProfileMenu ctx={ctx} id={profId} />
        </div>
      )
    case 'profile-card':
      return (
        <div className="nvs-sfoot">
          <div className="nvs-scard nvs-scard--profile">
            <span className="nvs-avatar nvs-avatar--lg" aria-hidden="true">
              MA
              <span className="nvs-avatar__status" />
            </span>
            {!ctx.rail && (
              <span className="nvs-sprof__text">
                <strong>Marina Alves</strong>
                <span className="nvs-statuspill">● Disponível</span>
              </span>
            )}
            <button type="button" className="nvs-sicon nvs-sicon--sm" aria-label="Abrir menu do perfil" {...ctx.menus.trigger(profId)}>
              <MoreHorizontal size={16} aria-hidden="true" />
            </button>
          </div>
          <ProfileMenu ctx={ctx} id={profId} />
        </div>
      )
    case 'upgrade':
      if (ctx.rail)
        return (
          <div className="nvs-sfoot">
            <button type="button" className="nvs-sicon" aria-label="Fazer upgrade">
              <Rocket size={18} aria-hidden="true" />
            </button>
          </div>
        )
      return (
        <div className="nvs-sfoot">
          <div className="nvs-scard">
            <strong>Plano Essencial</strong>
            <span className="nvs-scard__muted">Você usou 80% dos contatos do mês.</span>
            <span className="nvs-meter" aria-hidden="true">
              <span style={{ width: '80%' }} />
            </span>
            <button type="button" className="nvs-sbtn nvs-sbtn--primary">
              <Rocket size={15} aria-hidden="true" /> Fazer upgrade
            </button>
          </div>
        </div>
      )
    case 'meter':
      if (ctx.rail) return null
      return (
        <div className="nvs-sfoot">
          <div className="nvs-smeter">
            <span className="nvs-smeter__row">
              <span>{ctx.look.mono ? 'cpu' : ctx.model.id === 'gradiente-tech' ? 'Créditos' : ctx.model.id === 'cartao-upgrade' ? 'Contatos' : 'Armazenamento'}</span>
              <strong>{ctx.look.mono ? '62%' : ctx.model.id === 'gradiente-tech' ? '1.240 / 2.000' : ctx.model.id === 'cartao-upgrade' ? '8.000 / 10.000' : '7,2 de 15 GB'}</strong>
            </span>
            <span className="nvs-meter" aria-hidden="true">
              <span style={{ width: ctx.look.mono ? '62%' : '48%' }} />
            </span>
          </div>
        </div>
      )
    case 'links':
      return (
        <div className="nvs-sfoot">
          <ul className="nvs-slist nvs-slist--foot">
            {[
              { label: 'Configurações', icon: <Settings size={16} aria-hidden="true" /> },
              { label: 'Ajuda', icon: <CircleHelp size={16} aria-hidden="true" /> },
              { label: 'Sair', icon: <LogOut size={16} aria-hidden="true" /> },
            ].map((l) => (
              <li key={l.label}>
                <button
                  type="button"
                  className="nvs-si nvs-si--foot"
                  aria-label={ctx.rail ? l.label : undefined}
                  onMouseEnter={ctx.rail ? (e) => ctx.showTip(l.label, e.currentTarget) : undefined}
                  onMouseLeave={ctx.rail ? ctx.hideTip : undefined}
                >
                  {ctx.look.icons !== 'none' || ctx.rail ? <span className="nvs-sico">{l.icon}</span> : null}
                  {!ctx.rail && <span className="nvs-si__label">{l.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )
    case 'theme':
      return (
        <div className="nvs-sfoot">
          <button type="button" className={cx('nvs-stheme', ctx.rail && 'nvs-stheme--icon')} role="switch" aria-checked={dark} aria-label="Tema escuro" onClick={() => setDark((d) => !d)}>
            {dark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
            {!ctx.rail && (
              <>
                <span>Tema escuro</span>
                <span className="nvs-stheme__track" data-on={dark} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      )
    case 'help-card':
      if (ctx.rail) return null
      return (
        <div className="nvs-sfoot">
          <div className="nvs-scard nvs-scard--help">
            <CircleHelp size={18} aria-hidden="true" />
            <strong>Precisa de ajuda?</strong>
            <span className="nvs-scard__muted">Nossa equipe responde em minutos.</span>
            <button type="button" className="nvs-slink">
              Falar com a gente <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      )
    case 'workspace':
      return (
        <div className="nvs-sfoot">
          <Workspace ctx={ctx} placement="top" />
        </div>
      )
    default:
      return null
  }
}

/* -------------------------------------------------------------------------- */
/* Componente principal                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Sidebar de navegação renderizada a partir da receita do catálogo. Ocupa 100% da altura do
 * contêiner; a largura vem do modelo (ou do trilho, quando recolhida). Flyouts e tooltips
 * abrem à direita e ficam dentro da moldura `[data-nv-frame]` mais próxima.
 */
export function SidebarPreview({
  model,
  variant,
  theme,
  interactive = true,
  collapsed,
  onCollapsedChange,
  compact = false,
  onClose,
  hideBrand,
  onNavigate,
  content,
  className,
}: SidebarPreviewProps) {
  const arr = model.compositions[variant].arrangement
  const look = withSidebarContent(sidebarLookFor(model, variant), content)
  const colors = sidebarColors(theme, look.surface)
  const rootRef = useRef<HTMLDivElement>(null)
  const menus = useMenus(interactive)
  const uidRef = useRef<string>()
  if (!uidRef.current) uidRef.current = `nvs${++uidSeq}`
  const uid = uidRef.current
  useInert(rootRef, !interactive)

  const [section, setSection] = useState(0)
  const [railIdx, setRailIdx] = useState(0)
  const [query, setQuery] = useState('')
  const [hovered, setHovered] = useState(false)
  const [tip, setTip] = useState<{ label: string; top: number; left: number } | null>(null)
  const [collapsedState, setCollapsedState] = useState(Boolean(collapsed))
  useEffect(() => {
    if (collapsed !== undefined) setCollapsedState(collapsed)
  }, [collapsed])

  const isDupla = model.shape === 'dupla'
  const sections = look.sections
  const groups = sections?.length ? sections[Math.min(section, sections.length - 1)].groups : isDupla ? look.panel ?? [] : look.groups
  const allItems = useMemo(() => [...look.groups, ...(look.panel ?? []), ...(sections ?? []).flatMap((s) => s.groups)].flatMap((g) => g.items), [look, sections])
  const firstLabel = (() => {
    const items = groups.flatMap((g) => g.items)
    if (arr.body === 'stepper') return items[Math.min(2, items.length - 1)]?.label ?? ''
    const first = items[0]
    return first?.children?.length ? first.children[0] : first?.label ?? ''
  })()
  const [active, setActiveState] = useState(content?.active || firstLabel)
  // A página aberta na prévia manda no destaque (navegação pelas abas de páginas).
  useEffect(() => {
    if (content?.active) setActiveState(content.active)
  }, [content?.active])
  const [openSubs, setOpenSubs] = useState<string[]>(() => {
    const first = allItems.find((i) => i.children?.length)
    return first && arr.submenu !== 'flyout' ? [first.label] : []
  })

  const { close } = menus
  useEffect(() => {
    close()
    setTip(null)
    setActiveState(firstLabel)
    if (firstLabel) onNavigate?.(firstLabel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, section, compact])

  const canCollapse = !compact && (Boolean(look.collapsible) || model.shape === 'expansivel') && arr.labels !== 'hidden' && arr.labels !== 'below'
  const hoverExpand = arr.expand === 'hover' && !compact
  const collapsedEff = canCollapse && (hoverExpand ? !hovered : collapsedState)
  const railStatic = !compact && (model.shape === 'rail' || arr.labels === 'hidden' || arr.labels === 'below')
  // Coluna estreita do layout (trilho): a sidebar escolhida aparece recolhida, só com ícones.
  const forcedRail = Boolean(content?.rail) && !compact && !railStatic
  const rail = railStatic || forcedRail || (collapsedEff && !isDupla)
  const labelsBelow = !compact && arr.labels === 'below'
  // Largura do layout (quando informada) no lugar da largura do modelo: a prévia cabe na coluna.
  const modelWidth = content?.width && model.shape !== 'dupla' ? content.width : model.width
  const railW = look.railWidth ?? (arr.labels === 'hidden' && model.shape !== 'rail' && modelWidth > 100 ? 76 : 72)

  let width = modelWidth
  if (compact) width = Math.min(Math.max(modelWidth, 272), 304)
  else if (isDupla) width = collapsedEff ? 64 : modelWidth
  else if (railStatic) width = model.shape === 'rail' || modelWidth < 100 ? modelWidth : railW
  else if (hoverExpand) width = railW
  else if (collapsedEff) width = railW
  if (forcedRail) width = content?.width ?? railW
  const panelWidth = hoverExpand && !compact ? (hovered ? modelWidth : railW) : width

  const toggleCollapse = () => {
    const next = !collapsedState
    setCollapsedState(next)
    setTip(null)
    onCollapsedChange?.(next)
  }
  const setActive = (label: string) => {
    setActiveState(label)
    onNavigate?.(label)
  }
  const toggleSub = (label: string) => {
    setOpenSubs((list) => (list.includes(label) ? list.filter((l) => l !== label) : isDupla ? [...list, label] : [label]))
  }
  useEffect(() => setTip(null), [hovered, collapsedState])
  const showTip = (label: string, el: HTMLElement) => {
    // No trilho que expande com o mouse, o próprio hover já revela os rótulos.
    if (hoverExpand && !isDupla) return
    const r = rootRef.current?.getBoundingClientRect()
    const b = el.getBoundingClientRect()
    if (!r) return
    setTip({ label, top: b.top - r.top + b.height / 2, left: b.right - r.left + 10 })
  }
  const hideTip = () => setTip(null)

  const ctx: Ctx = {
    look,
    arr,
    model,
    theme,
    colors,
    menus,
    root: rootRef,
    uid,
    rail,
    labelsBelow,
    compact,
    active,
    setActive,
    openSubs,
    toggleSub,
    showTip,
    hideTip,
  }

  const filtered = filterGroups(groups, query)

  const collapseBtn = canCollapse && !hoverExpand ? (
    <button
      type="button"
      className={cx('nvs-scollapse', arr.footer === 'collapse' && !rail && 'nvs-scollapse--wide')}
      aria-label={collapsedEff ? 'Expandir menu' : 'Recolher menu'}
      aria-expanded={!collapsedEff}
      title={collapsedEff ? 'Expandir menu' : 'Recolher menu'}
      onClick={toggleCollapse}
    >
      {collapsedEff ? <PanelLeftOpen size={17} aria-hidden="true" /> : <PanelLeftClose size={17} aria-hidden="true" />}
      {arr.footer === 'collapse' && !rail && <span>Recolher menu</span>}
    </button>
  ) : null
  const topCollapse = arr.footer === 'collapse' ? null : collapseBtn
  const closeBtn = compact && onClose ? (
    <button type="button" className="nvs-sicon nvs-sicon--sm" aria-label="Fechar menu" onClick={onClose}>
      <X size={17} aria-hidden="true" />
    </button>
  ) : null

  const ctaLabel = arr.cta && arr.cta !== '+' && content?.cta?.trim() ? content.cta.trim() : arr.cta
  const cta = arr.cta ? (
    arr.cta === '+' || rail ? (
      <div className="nvs-scta nvs-scta--round">
        <button type="button" className="nvs-sbtn nvs-sbtn--round" aria-label={arr.cta === '+' ? 'Criar' : ctaLabel}>
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
    ) : (
      <div className="nvs-scta">
        <button type="button" className="nvs-sbtn nvs-sbtn--primary nvs-sbtn--block">
          <Plus size={16} aria-hidden="true" /> {ctaLabel}
        </button>
      </div>
    )
  ) : null

  const top: ReactNode = (() => {
    const extra = <>{topCollapse}</>
    switch (arr.top) {
      case 'logo':
        return hideBrand ? (topCollapse ? <div className="nvs-stop nvs-stop--tools">{extra}</div> : null) : <Brand ctx={ctx} extra={extra} />
      case 'mark':
        return hideBrand && !rail ? null : <Brand ctx={{ ...ctx, rail: true }} extra={extra} />
      case 'logo-search':
        return (
          <>
            {!hideBrand && <Brand ctx={ctx} extra={extra} />}
            <div className="nvs-stop nvs-stop--tight">
              <SearchField ctx={ctx} value={query} onChange={setQuery} />
            </div>
          </>
        )
      case 'search':
        return (
          <div className="nvs-stop">
            <div className="nvs-srow">
              <SearchField ctx={ctx} value={query} onChange={setQuery} placeholder={model.id === 'lista-ajustes' ? 'Buscar ajuste' : 'Buscar no menu'} />
              {extra}
            </div>
          </div>
        )
      case 'workspace':
        return <Workspace ctx={ctx} extra={extra} />
      case 'profile':
        return rail ? (
          <Brand ctx={ctx} extra={extra} />
        ) : (
          <div className="nvs-stop">
            <div className="nvs-sprofile">
              <span className="nvs-avatar nvs-avatar--lg" aria-hidden="true">
                MA
              </span>
              <span className="nvs-sprof__text">
                <strong>Marina Alves</strong>
                <span>{model.filters.includes('corporativos') ? 'Conta corrente · Ag. 0001' : model.filters.includes('minimalistas') ? 'marina@exemplo.com' : 'Plano Pro'}</span>
              </span>
              {extra}
            </div>
            {model.id === 'cartao-perfil' && (
              <div className="nvs-sgoal">
                <span className="nvs-smeter__row">
                  <span>Meta do mês</span>
                  <strong>62%</strong>
                </span>
                <span className="nvs-meter" aria-hidden="true">
                  <span style={{ width: '62%' }} />
                </span>
              </div>
            )}
          </div>
        )
      case 'logo-cta':
        return hideBrand ? null : <Brand ctx={ctx} extra={extra} />
      case 'project':
        return <ProjectTop ctx={ctx} sections={sections} section={section} setSection={setSection} />
      case 'tabs':
        if (!sections?.length) return <Brand ctx={ctx} extra={extra} />
        return rail ? (
          <Brand ctx={ctx} />
        ) : (
          <div className="nvs-stop">
            <div className="nvs-stabs" role="tablist" aria-label="Áreas">
              {sections.map((s, i) => (
                <button key={s.label} type="button" role="tab" aria-selected={i === section} onClick={() => setSection(i)}>
                  {sections.length <= 2 && <NavIconView name={s.icon} size={15} />}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  })()

  const body = (
    <div className="nvs-sbody" onScroll={hideTip}>
      {filtered.length === 0 ? (
        <p className="nvs-sempty">Nada encontrado para “{query}”.</p>
      ) : arr.body === 'tiles' && !rail ? (
        <Tiles ctx={ctx} groups={filtered} />
      ) : arr.body === 'stepper' && !rail ? (
        <Stepper ctx={ctx} groups={filtered} />
      ) : (
        <GroupList ctx={ctx} groups={filtered} flat={arr.body === 'flat'} />
      )}
    </div>
  )
  const footer = <Footer ctx={ctx} kind={arr.footer} collapseBtn={collapseBtn} />

  /* Sidebar dupla: trilho + painel */
  let panelContent: ReactNode
  if (isDupla && !compact) {
    const railItems = look.groups[0]?.items ?? []
    const railCtx: Ctx = { ...ctx, rail: true }
    const railColors = colors
    const panelColors = sidebarColors(theme, look.surface === 'nav' ? 'plain' : 'nav')
    panelContent = (
      <div className="nvs-sdupla">
        <div className="nvs-srail" style={navVars(theme, railColors)}>
          <div className="nvs-stop nvs-stop--mark">
            <Mark look={look} />
          </div>
          <ul className="nvs-slist nvs-slist--rail">
            {railItems.map((it, i) => (
              <li key={it.label}>
                <button
                  type="button"
                  className="nvs-si"
                  aria-label={it.label}
                  aria-current={railIdx === i ? 'page' : undefined}
                  onClick={() => {
                    setRailIdx(i)
                    onNavigate?.(it.label)
                    if (collapsedEff) toggleCollapse()
                  }}
                  onMouseEnter={(e) => showTip(it.label, e.currentTarget)}
                  onMouseLeave={hideTip}
                  onFocus={(e) => showTip(it.label, e.currentTarget)}
                  onBlur={hideTip}
                >
                  <ItemIcon ctx={railCtx} item={it} />
                </button>
              </li>
            ))}
          </ul>
          {arr.footer === 'profile' && <Footer ctx={railCtx} kind="profile" collapseBtn={null} />}
        </div>
        {!collapsedEff && (
          <div className="nvs-spanel2" style={navVars(theme, panelColors)}>
            <div className="nvs-stop nvs-stop--logo">
              <strong className="nvs-stitle" style={{ fontFamily: theme.metrics.headingFont }}>
                {railItems[railIdx]?.label ?? look.brand}
              </strong>
              {collapseBtn}
            </div>
            {(arr.top === 'search' || arr.top === 'logo-search') && (
              <div className="nvs-stop nvs-stop--tight">
                <SearchField ctx={ctx} value={query} onChange={setQuery} placeholder={look.mono ? 'Buscar arquivos' : 'Buscar'} />
              </div>
            )}
            {cta}
            {body}
            {arr.footer !== 'profile' && footer}
          </div>
        )}
      </div>
    )
  } else if (arr.cards && !compact) {
    const [first, ...rest] = filtered
    panelContent = (
      <div className="nvs-scards">
        <div className="nvs-scardbox">
          {top}
          <div className="nvs-sbody nvs-sbody--auto">{first && <GroupList ctx={ctx} groups={[first]} />}</div>
        </div>
        {rest.length > 0 && (
          <div className="nvs-scardbox nvs-scardbox--grow">
            <div className="nvs-sbody">
              <GroupList ctx={ctx} groups={rest} />
            </div>
          </div>
        )}
        <div className="nvs-scardbox">{footer}</div>
      </div>
    )
  } else {
    panelContent = (
      <>
        {closeBtn && (
          <div className="nvs-sdrawerbar">
            <span>Menu</span>
            {closeBtn}
          </div>
        )}
        {top}
        {cta}
        {body}
        {footer}
      </>
    )
  }

  const floating = model.floating && !compact
  const rootStyle: CSSProperties = {
    ...navVars(theme, colors),
    fontFamily: look.mono ? "'JetBrains Mono Variable', ui-monospace, monospace" : theme.metrics.bodyFont,
    width: floating ? width + 12 : width,
    ['--nv-item-h' as string]: `${compact ? 42 : look.density === 'compact' ? 30 : look.density === 'airy' ? 42 : 36}px`,
  }

  const onFocusIn = () => hoverExpand && setHovered(true)
  const onFocusOut = (e: FocusEvent<HTMLDivElement>) => {
    if (hoverExpand && !e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false)
  }

  return (
    <div
      ref={rootRef}
      className={cx('nvs-s', className)}
      data-shape={model.shape}
      data-surface={look.surface}
      data-floating={floating}
      data-rail={rail}
      data-below={labelsBelow}
      data-compact={compact}
      data-cards={Boolean(arr.cards) && !compact}
      data-align={arr.align ?? 'top'}
      data-item={look.itemStyle}
      data-mono={Boolean(look.mono)}
      data-dupla={isDupla && !compact}
      style={rootStyle}
      onMouseEnter={hoverExpand ? () => setHovered(true) : undefined}
      onMouseLeave={hoverExpand ? () => setHovered(false) : undefined}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
    >
      <div
        role="group"
        aria-label="Menu lateral"
        className="nvs-spanel"
        data-hover-open={hoverExpand && hovered}
        style={{ width: panelWidth, position: hoverExpand ? 'absolute' : undefined }}
      >
        {panelContent}
      </div>
      {tip && (
        <span role="tooltip" className="nvs-tip" style={{ top: tip.top, left: tip.left }}>
          {tip.label}
        </span>
      )}
    </div>
  )
}
