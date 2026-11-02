import type { CSSProperties, ReactNode } from 'react'
import { darken, mix, readableOn, withAlpha } from '@/core/color'
import {
  Avatar, Badge, Bar, Btn, Card, Check, Col, Divider, Field, Ico, Kbd, Over, Row, Skel, Tile, Toggle, Txt,
  bool, btnStyle, hexOr, lines, navItemStyle, num, pair, str, textStyle, toneColors, usePart, usePv, withState,
  type Tone,
} from './kit'
import type { Look } from './look'
import { MiniCalendar } from './render-base'
import type { RP, RendererMap } from './render-types'

const NAV_ICONS = ['Home', 'FolderOpen', 'BarChart3', 'Users', 'Settings', 'Inbox', 'Calendar', 'Star']
const fade: CSSProperties = { maskImage: 'linear-gradient(90deg, #000 82%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, #000 82%, transparent)' }

/** Página de contexto (linhas esmaecidas) atrás de componentes de navegação. */
function Ghost({ rows = 3, style }: { rows?: number; style?: CSSProperties }) {
  const { L } = usePv()
  return (
    <Col gap={10} style={{ padding: 14, ...style }}>
      <Skel w="45%" h={12} style={{ animation: 'none' }} />
      {Array.from({ length: rows }, (_, i) => (
        <Skel key={i} w={`${90 - i * 14}%`} h={9} style={{ animation: 'none', opacity: 0.7 }} />
      ))}
      <Row gap={10} style={{ marginTop: 6 }}>
        <span style={{ flex: 1, height: 54, borderRadius: Math.min(L.rLg, 12), background: L.dark ? withAlpha(L.text, 0.06) : mix(L.surfaceSolid, L.text, 0.05) }} />
        <span style={{ flex: 1, height: 54, borderRadius: Math.min(L.rLg, 12), background: L.dark ? withAlpha(L.text, 0.06) : mix(L.surfaceSolid, L.text, 0.05) }} />
      </Row>
    </Col>
  )
}

function iconBtnBox(L: Look, variant: string, shape: string, size: number): CSSProperties {
  const radius = shape === 'circulo' ? '50%' : shape === 'quadrado' ? Math.min(L.r >= 999 ? 10 : L.r, 10) : L.r >= 999 ? '50%' : L.r
  const base: CSSProperties = { width: size, height: size, display: 'inline-grid', placeItems: 'center', borderRadius: radius, boxSizing: 'border-box', position: 'relative', flex: 'none', cursor: 'pointer' }
  switch (variant) {
    case 'solido':
      return { ...base, background: L.fill, color: L.onFill, border: L.btnBorder, boxShadow: L.btnShadow }
    case 'contorno':
      return { ...base, background: 'transparent', color: L.text, border: `${Math.max(1, Math.min(L.bw, 2))}px solid ${L.style.borderTone === 'ink' ? L.text : L.dark ? withAlpha(L.accent, 0.5) : L.borderStrong}` }
    case 'fantasma':
      return { ...base, background: 'transparent', color: L.muted }
    default:
      return { ...base, background: L.soft, color: L.onSoft, boxShadow: L.style.surface === 'neu' ? L.btnShadow : undefined, border: L.style.shadow === 'hard' ? `${Math.min(L.bw, 2)}px solid ${L.text}` : undefined }
  }
}

/* ============================== Botões e navegação ============================== */

function Botoes({ v, st }: RP) {
  const pos = str(v, 'posicaoIcone')
  const kind = ({ primario: 'primary', secundario: 'secondary', fantasma: 'ghost', perigo: 'danger' } as const)[str(v, 'variante') as 'primario'] ?? 'primary'
  const full = bool(v, 'larguraTotal')
  const size = str(v, 'tamanho') as 'sm' | 'md' | 'lg'
  const icon = str(v, 'icone')
  const loading = bool(v, 'carregando')
  return (
    <div style={{ display: 'flex', flexDirection: full ? 'column' : 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'center', width: full ? '100%' : undefined, maxWidth: 320 }}>
      <Btn kind={kind} size={size} full={full} st={st} part="label" iconPart="icon" loading={loading} icon={pos === 'esquerda' || pos === 'somente' ? icon : undefined} iconRight={pos === 'direita' ? icon : undefined}>
        {pos === 'somente' ? undefined : loading ? 'Carregando…' : str(v, 'texto')}
      </Btn>
      {bool(v, 'mostrarSecundario') && (
        <Btn kind={kind === 'primary' ? 'secondary' : 'ghost'} size={size} full={full} part="secondary">
          {str(v, 'textoSecundario')}
        </Btn>
      )}
    </div>
  )
}

function BotoesIcone({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const size = num(v, 'tamanho', 44)
  const variant = str(v, 'variante')
  const shape = str(v, 'formato')
  const active = bool(v, 'ativo')
  const kind = variant === 'solido' ? 'primary' : variant === 'fantasma' ? 'ghost' : 'secondary'
  const main = withState(L, iconBtnBox(L, variant, shape, size), st, kind)
  return (
    <Col gap={14} style={{ alignItems: 'center' }}>
      <Row gap={12}>
        <span {...P('icon')} style={{ ...main, color: active && variant !== 'solido' ? L.error : main.color }} aria-label={str(v, 'rotuloAcessivel')}>
          <Ico name={str(v, 'icone')} size={Math.round(size * 0.45)} filled={active} />
          {bool(v, 'contador') && (
            <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 99, background: L.error, color: readableOn(L.error), fontSize: 11, fontWeight: 700, fontFamily: L.font, display: 'grid', placeItems: 'center', boxSizing: 'border-box', border: `2px solid ${L.surfaceSolid}` }}>3</span>
          )}
        </span>
        {['Share2', 'Bookmark', 'MoreHorizontal'].map((n) => (
          <span key={n} style={iconBtnBox(L, variant, shape, size)}>
            <Ico name={n} size={Math.round(size * 0.45)} />
          </span>
        ))}
      </Row>
      <span {...P('label')} style={{ ...textStyle(L, 'caption'), textTransform: 'none' }}>
        aria-label: “{str(v, 'rotuloAcessivel')}”
      </span>
    </Col>
  )
}

function Header({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const links = lines(v, 'links')
  const active = num(v, 'ativo', 1) - 1
  const h = { compacta: 50, padrao: 60, alta: 72 }[str(v, 'altura') as 'padrao'] ?? 60
  const bar: CSSProperties = {
    ...L.card,
    borderRadius: L.style.surface === 'glass' || L.style.backdrop === 'blobs' ? Math.min(L.rLg, 18) : 0,
    border: 'none',
    borderBottom: L.card.border && L.card.border !== 'none' ? L.card.border : L.divider,
    boxShadow: L.style.shadow === 'hard' ? `0 4px 0 ${L.text}` : L.style.shadow === 'none' ? 'none' : L.shadow,
    height: h,
    padding: '0 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    margin: L.style.surface === 'glass' ? 10 : 0,
  }
  return (
    <div style={{ width: '100%', height: '100%', background: L.stage }}>
      <header style={bar}>
        <Row gap={8} style={{ flex: 'none' }}>
          <span {...P('logo')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Tile name="Sparkles" size={26} treatment={L.style.iconTreatment === 'plain' ? 'app-tile' : undefined} />
            <span style={{ ...textStyle(L, 'h3'), fontSize: L.fs + 1 }}>{str(v, 'logo')}</span>
          </span>
        </Row>
        <nav {...P('links')} style={{ display: 'flex', gap: 2, flex: '1 1 auto', minWidth: 0, overflow: 'hidden', ...fade }}>
          {links.map((l, i) => (
            <span key={l + i} style={{ ...navItemStyle(L, i === active, 'h'), height: 32 }}>
              {l}
            </span>
          ))}
        </nav>
        <Row gap={8} style={{ flex: 'none' }}>
          {bool(v, 'busca') && <Ico name="Search" size={18} color={L.muted} part="search" />}
          {str(v, 'cta') && (
            <Btn size="sm" part="cta" st={st}>
              {str(v, 'cta')}
            </Btn>
          )}
          {bool(v, 'avatar') && <Avatar name="Ana Souza" size={30} />}
        </Row>
      </header>
      <Ghost />
    </div>
  )
}

function Sidebar({ v, st, large }: RP) {
  const { L } = usePv()
  const P = usePart()
  const items = lines(v, 'itens')
  const active = num(v, 'ativo', 1) - 1
  const collapsed = bool(v, 'recolhida')
  const icons = bool(v, 'icones') || collapsed
  const floating = L.style.surface === 'glass' || L.style.backdrop === 'blobs' || L.style.surface === 'aurora'
  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', background: L.stage }}>
      <aside
        style={{
          ...L.card,
          width: collapsed ? 58 : 168,
          flex: 'none',
          borderRadius: floating ? Math.min(L.rLg, 18) : 0,
          margin: floating ? 8 : 0,
          border: 'none',
          borderRight: floating ? undefined : L.card.border && L.card.border !== 'none' ? L.card.border : L.divider,
          boxShadow: L.style.shadow === 'hard' ? `4px 0 0 ${L.text}` : floating ? L.shadow : 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: collapsed ? '12px 8px' : 12,
          boxSizing: 'border-box',
        }}
      >
        <span {...P('logo')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 4px 10px', justifyContent: collapsed ? 'center' : undefined }}>
          <Tile name="Sparkles" size={26} treatment={L.style.iconTreatment === 'plain' ? 'app-tile' : undefined} />
          {!collapsed && <span style={{ ...textStyle(L, 'h3') }}>{str(v, 'marca')}</span>}
        </span>
        {!collapsed && (
          <span {...P('section')} style={{ ...textStyle(L, 'caption'), padding: '4px 8px' }}>
            {str(v, 'secao')}
          </span>
        )}
        <div {...P('items')} style={{ display: 'grid', gap: 3 }}>
          {items.slice(0, large ? 6 : 4).map((it, i) => (
            <span key={it + i} style={{ ...withState(L, { ...navItemStyle(L, i === active, 'v'), height: Math.max(30, Math.round(L.h * 0.78)) }, i === active ? undefined : i === active + 1 ? (st === 'normal' ? undefined : st) : undefined, 'ghost'), justifyContent: collapsed ? 'center' : undefined, padding: collapsed ? 0 : undefined }}>
              {icons && <Ico name={NAV_ICONS[i % NAV_ICONS.length]} size={17} />}
              {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{it}</span>}
              {!collapsed && i === 0 && <span style={{ marginLeft: 'auto' }}><Badge tone="primary">4</Badge></span>}
            </span>
          ))}
        </div>
        {bool(v, 'usuario') && (
          <Row gap={8} style={{ marginTop: 'auto', paddingTop: 10, borderTop: L.divider, justifyContent: collapsed ? 'center' : undefined }}>
            <Avatar name="Ana Souza" size={28} status="online" />
            {!collapsed && (
              <Col gap={0} style={{ minWidth: 0 }}>
                <span style={{ ...textStyle(L, 'body'), fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap' }}>Ana Souza</span>
                <span style={{ ...textStyle(L, 'small'), fontSize: 11.5 }}>Admin</span>
              </Col>
            )}
          </Row>
        )}
      </aside>
      <Ghost style={{ flex: 1, minWidth: 0 }} />
    </div>
  )
}

function tabStyle(L: Look, style: string, active: boolean): CSSProperties {
  if (style === 'familia') return navItemStyle(L, active, 'h')
  const base = navItemStyle(L, false, 'h')
  if (!active) return style === 'cartao' ? { ...base, borderRadius: `${Math.min(L.r, 10)}px ${Math.min(L.r, 10)}px 0 0` } : base
  if (style === 'sublinhado') return { ...base, color: L.text, fontWeight: 650, borderRadius: 0, boxShadow: `inset 0 -2px 0 ${L.dark ? L.accent : L.primary}` }
  if (style === 'pilula') return { ...base, color: L.onFill, background: L.fill, fontWeight: 650, borderRadius: 999 }
  return { ...base, color: L.text, fontWeight: 650, background: L.surfaceSolid, border: `1px solid ${L.dark ? withAlpha(L.text, 0.15) : L.border}`, borderBottomColor: 'transparent', borderRadius: `${Math.min(L.r, 10)}px ${Math.min(L.r, 10)}px 0 0` }
}

function Tabs({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const tabs = lines(v, 'abas')
  const active = num(v, 'ativa', 1) - 1
  const style = str(v, 'estilo')
  const icons = ['LayoutDashboard', 'Activity', 'FolderOpen', 'Settings', 'Users', 'Star']
  return (
    <Col gap={12} style={{ width: '100%', maxWidth: 360 }}>
      <div {...P('tabs')} role="tablist" style={{ display: 'flex', gap: 4, borderBottom: style === 'pilula' ? undefined : L.divider, overflow: 'hidden', paddingBottom: style === 'pilula' ? 0 : 0, ...fade }}>
        {tabs.map((t, i) => (
          <span key={t + i} role="tab" aria-selected={i === active} style={withState(L, tabStyle(L, style, i === active), i === active ? undefined : i === active + 1 ? (st === 'normal' ? undefined : st) : undefined, 'ghost')}>
            {bool(v, 'icones') && <Ico name={icons[i % icons.length]} size={15} />}
            {t}
            {bool(v, 'contador') && i === 1 && <Badge tone={i === active ? 'primary' : 'neutral'}>12</Badge>}
          </span>
        ))}
      </div>
      <Card pad={14}>
        <Col gap={8}>
          <Txt v="h3">{tabs[active] ?? 'Painel'}</Txt>
          <Skel w="92%" h={9} style={{ animation: 'none' }} />
          <Skel w="70%" h={9} style={{ animation: 'none' }} />
        </Col>
      </Card>
    </Col>
  )
}

function segActive(L: Look): CSSProperties {
  if (L.style.surface === 'neu') return { boxShadow: L.btnShadow, color: L.primary, background: L.surfaceSolid }
  if (L.style.indicator === 'block' && L.style.shadow === 'hard') return { background: L.text, color: L.bg }
  if (L.style.fill === 'gradient' || L.style.fill === 'aurora' || L.style.fill === 'metal' || L.style.shadow === 'press') return { background: L.fill, color: L.onFill, boxShadow: L.style.shadow === 'press' ? `0 3px 0 ${darken(L.cycle[0].bg, 0.3)}` : undefined }
  if (L.dark) return { background: withAlpha(L.accent, 0.18), color: L.text, boxShadow: `inset 0 0 0 1px ${withAlpha(L.accent, 0.45)}` }
  if (L.style.borderTone === 'ink') return { background: L.text, color: L.bg }
  return { background: L.style.surface === 'glass' ? withAlpha('#ffffff', 0.85) : L.surfaceSolid, color: L.text, boxShadow: `0 1px 3px ${withAlpha('#000000', 0.12)}, 0 0 0 0.5px ${withAlpha('#000000', 0.05)}` }
}

function Segmented({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const opts = lines(v, 'opcoes')
  const active = num(v, 'ativa', 1) - 1
  const full = bool(v, 'larguraTotal')
  const r = L.r >= 999 ? 999 : L.r
  const icons = ['Sun', 'CalendarDays', 'Calendar', 'LayoutGrid', 'List']
  return (
    <Col gap={14} style={{ width: full ? '100%' : undefined, maxWidth: 320, alignItems: full ? 'stretch' : 'center' }}>
      <div {...P('options')} role="radiogroup" style={{ display: full ? 'flex' : 'inline-flex', padding: 3, gap: 3, borderRadius: r, background: L.style.surface === 'neu' ? L.surfaceSolid : L.dark ? withAlpha(L.text, 0.07) : L.style.borderTone === 'ink' ? 'transparent' : mix(L.surfaceSolid, L.text, 0.06), border: L.style.borderTone === 'ink' ? `${Math.min(L.bw, 2)}px solid ${L.text}` : undefined, boxShadow: L.style.surface === 'neu' ? L.inset : undefined }}>
        {opts.map((o, i) => (
          <span
            key={o + i}
            role="radio"
            aria-checked={i === active}
            style={withState(
              L,
              { flex: full ? 1 : undefined, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: Math.max(28, L.h - 8), padding: '0 14px', borderRadius: r >= 999 ? 999 : Math.max(0, r - 2), fontFamily: L.familyId === 'retro-paper' ? L.labelFont : L.font, fontSize: L.upper ? 11.5 : L.fs - 0.5, fontWeight: i === active ? Math.max(600, L.uw) : 500, letterSpacing: L.upper ? L.track : 0, textTransform: L.upper ? 'uppercase' : 'none', color: L.muted, whiteSpace: 'nowrap', ...(i === active ? segActive(L) : {}) },
              i === active ? st : undefined,
              'plain',
            )}
          >
            {bool(v, 'icones') && <Ico name={icons[i % icons.length]} size={15} />}
            {o}
          </span>
        ))}
      </div>
      <Row gap={6} align="flex-end" style={{ height: 50, justifyContent: 'center' }}>
        {[30, 48, 22, 40, 36, 50, 28].map((hgt, i) => (
          <span key={i} style={{ width: 16, height: hgt, borderRadius: Math.min(L.rSm, 4), background: i === 5 ? (L.style.fill === 'solid' ? L.trackOn : L.fill) : L.dark ? withAlpha(L.text, 0.15) : mix(L.surfaceSolid, L.text, 0.12) }} />
        ))}
      </Row>
    </Col>
  )
}

function Breadcrumbs({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  let path = lines(v, 'caminho')
  if (bool(v, 'recolher') && path.length > 3) path = [path[0], '…', path[path.length - 1]]
  const sep = str(v, 'separador')
  const sepEl = sep === 'barra' ? <span style={{ color: L.faint }}>/</span> : sep === 'ponto' ? <span style={{ color: L.faint }}>·</span> : <Ico name="ChevronRight" size={14} color={L.faint} />
  return (
    <Card style={{ width: '100%', maxWidth: 340 }}>
      <Col gap={10}>
        <nav {...P('path')} aria-label="Trilha" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, fontFamily: L.familyId === 'retro-paper' || L.style.font === 'jetbrains-mono' ? L.labelFont : L.font, fontSize: L.upper ? 11.5 : L.fs - 1, letterSpacing: L.upper ? L.track : 0, textTransform: L.upper ? 'uppercase' : 'none' }}>
          {path.map((p, i) => {
            const last = i === path.length - 1
            return (
              <span key={p + i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {i === 0 && bool(v, 'iconeInicio') && <Ico name="Home" size={14} color={L.muted} />}
                <span style={{ color: last ? L.text : p === '…' ? L.muted : L.dark ? L.accent : L.primary, fontWeight: last ? 650 : 500, textDecoration: !last && p !== '…' && L.style.borderTone === 'ink' ? 'underline' : undefined }} aria-current={last ? 'page' : undefined}>
                  {p}
                </span>
                {!last && sepEl}
              </span>
            )
          })}
        </nav>
        <Txt v="h2">{path[path.length - 1]}</Txt>
        <Skel w="80%" h={9} style={{ animation: 'none' }} />
      </Col>
    </Card>
  )
}

function MenuContextual({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const items = lines(v, 'itens')
  const focus = num(v, 'destacado', 1) - 1
  const icons = ['Pencil', 'Copy', 'Share2', 'Archive', 'Download', 'Pin']
  const keys = ['E', 'D', 'S', 'A', 'B', 'P']
  const row = (label: string, i: number, danger = false) => (
    <Row key={label + i} gap={10} style={withState(L, { height: 34, padding: '0 10px', borderRadius: L.r >= 999 ? 999 : Math.min(L.r, 8), background: i === focus && !danger ? L.rowHover : undefined, color: danger ? L.error : L.text, fontFamily: L.font, fontSize: L.fs - 0.5 }, i === focus && !danger ? st : undefined, 'ghost')}>
      {bool(v, 'icones') && <Ico name={danger ? 'Trash2' : icons[i % icons.length]} size={16} color={danger ? L.error : L.muted} />}
      <span style={{ flex: 1 }}>{label}</span>
      {bool(v, 'atalhos') && !danger && <Kbd>⌘{keys[i % keys.length]}</Kbd>}
    </Row>
  )
  return (
    <Col gap={6} style={{ width: '100%', maxWidth: 240, alignItems: 'flex-end' }}>
      <span style={iconBtnBox(L, 'suave', 'familia', 34)}>
        <Ico name="MoreHorizontal" size={17} />
      </span>
      <Card raised pad={5} part="items" style={{ width: '100%' }}>
        <div {...P('title')} style={{ ...textStyle(L, 'caption'), padding: '6px 10px 4px' }}>
          {str(v, 'titulo')}
        </div>
        {items.slice(0, 5).map((it, i) => row(it, i))}
        {str(v, 'perigo') && (
          <>
            <Divider style={{ margin: '4px 0' }} />
            <span {...P('danger')}>{row(str(v, 'perigo'), 99, true)}</span>
          </>
        )}
      </Card>
    </Col>
  )
}

function MegaMenu({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const cols = Math.max(1, Math.min(3, num(v, 'colunas', 2)))
  const groups = [
    { t: 'Plataforma', items: [['LayoutDashboard', 'Painéis', 'Métricas em tempo real'], ['Zap', 'Automação', 'Fluxos sem código']] },
    { t: 'Recursos', items: [['BookOpen', 'Guias', 'Aprenda passo a passo'], ['LifeBuoy', 'Suporte', 'Ajuda 24 h']] },
    { t: 'Empresa', items: [['Building2', 'Sobre', 'Nossa história'], ['Briefcase', 'Carreiras', 'Vagas abertas']] },
  ].slice(0, cols)
  return (
    <div style={{ width: '100%', height: '100%', background: L.stage }}>
      <div style={{ ...L.card, borderRadius: 0, border: 'none', borderBottom: L.divider, boxShadow: 'none', height: 46, display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px' }}>
        <Tile name="Sparkles" size={22} treatment={L.style.iconTreatment === 'plain' ? 'app-tile' : undefined} />
        <span {...P('trigger')} style={{ ...navItemStyle(L, true, 'h'), height: 30 }}>
          {str(v, 'gatilho')} <Ico name="ChevronUp" size={14} />
        </span>
        <span style={{ ...navItemStyle(L, false, 'h'), height: 30 }}>Preços</span>
      </div>
      <Card raised pad={12} style={{ margin: '8px 10px', display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${bool(v, 'destaque') ? 128 : 120}px, 1fr))`, gap: 12 }}>
        {groups.map((g) => (
          <Col key={g.t} gap={6}>
            <span style={textStyle(L, 'caption')}>{g.t}</span>
            {g.items.map(([ic, t, d]) => (
              <Row key={t} gap={8} align="flex-start">
                <Tile name={ic} size={26} />
                <Col gap={0} style={{ minWidth: 0 }}>
                  <span style={{ ...textStyle(L, 'body'), fontSize: 12.5, fontWeight: 620 }}>{t}</span>
                  <span style={{ ...textStyle(L, 'small'), fontSize: 11.5 }}>{d}</span>
                </Col>
              </Row>
            ))}
          </Col>
        ))}
        {bool(v, 'destaque') && (
          <div {...P('feature')} style={{ borderRadius: Math.min(L.rLg, 14), padding: 10, background: L.style.fill === 'solid' || L.style.fill === 'press' ? L.soft : L.fill, color: L.style.fill === 'solid' || L.style.fill === 'press' ? L.onSoft : L.onFill, display: 'grid', gap: 4, alignContent: 'start', border: L.style.shadow === 'hard' ? `2px solid ${L.text}` : undefined }}>
            <Ico name="Sparkles" size={18} />
            <span style={{ fontFamily: L.headingFont, fontWeight: L.hw, fontSize: 13, lineHeight: 1.25 }}>{str(v, 'tituloDestaque')}</span>
            <span style={{ fontFamily: L.font, fontSize: 11.5, opacity: 0.85 }}>Saiba mais →</span>
          </div>
        )}
      </Card>
    </div>
  )
}

function Paginacao({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const total = Math.max(2, num(v, 'totalPaginas', 12))
  const cur = Math.max(1, Math.min(total, num(v, 'paginaAtual', 3)))
  const style = str(v, 'estilo')
  const size = Math.max(28, Math.round(L.h * 0.78))
  const pageBox = (active: boolean): CSSProperties => ({
    ...btnStyle(L, active ? 'primary' : 'ghost', 'sm', true),
    width: size,
    minWidth: size,
    height: size,
    padding: 0,
    fontSize: L.fs - 1,
    color: active ? L.onFill : L.text,
    ...(active && L.style.indicator === 'underline' ? { background: 'transparent', color: L.text, boxShadow: `inset 0 -2px 0 ${L.dark ? L.accent : L.style.borderTone === 'ink' ? L.text : L.primary}`, borderRadius: 0, border: 'none' } : {}),
  })
  let pages: (number | '…')[] = []
  if (total <= 7) pages = Array.from({ length: total }, (_, i) => i + 1)
  else {
    pages = [1]
    if (cur > 3) pages.push('…')
    for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p)
    if (cur < total - 2) pages.push('…')
    pages.push(total)
  }
  const nav = (icon: string, label: string, disabled: boolean) => (
    <span style={withState(L, { ...btnStyle(L, 'secondary', 'sm', style === 'numeros'), height: size, width: style === 'numeros' ? size : undefined, minWidth: size }, disabled ? 'disabled' : undefined, 'secondary')}>
      {icon === 'ChevronLeft' && <Ico name={icon} size={15} />}
      {style !== 'numeros' && label}
      {icon === 'ChevronRight' && <Ico name={icon} size={15} />}
    </span>
  )
  return (
    <Col gap={12} style={{ alignItems: 'center', width: '100%', maxWidth: 340 }}>
      {bool(v, 'mostrarTotal') && <span style={textStyle(L, 'small')}>Mostrando {(cur - 1) * 10 + 1}–{cur * 10} de {total * 10 - 2}</span>}
      <nav {...P('pages')} aria-label="Paginação" style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {nav('ChevronLeft', 'Anterior', cur === 1)}
        {style === 'numeros' &&
          pages.map((p, i) =>
            p === '…' ? (
              <span key={`e${i}`} style={{ width: 20, textAlign: 'center', color: L.muted, fontFamily: L.font }}>…</span>
            ) : (
              <span key={p} aria-current={p === cur ? 'page' : undefined} style={withState(L, pageBox(p === cur), p === cur ? st : undefined, 'primary')}>
                {p}
              </span>
            ),
          )}
        {style === 'compacta' && (
          <span style={{ ...textStyle(L, 'label'), padding: '0 10px', fontVariantNumeric: 'tabular-nums' }}>
            {cur} de {total}
          </span>
        )}
        {nav('ChevronRight', 'Próxima', cur === total)}
      </nav>
    </Col>
  )
}

function Steps({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const steps = lines(v, 'passos')
  const cur = num(v, 'atual', 1) - 1
  const vertical = str(v, 'orientacao') === 'vertical'
  const fill = L.style.fill === 'solid' || L.style.fill === 'press' ? L.trackOn : L.fill
  const onFill = L.style.fill === 'solid' || L.style.fill === 'press' ? readableOn(L.trackOn) : L.onFill
  const marker = (i: number) => {
    const done = i < cur
    const now = i === cur
    return (
      <span style={{ width: 28, height: 28, flex: 'none', borderRadius: L.r >= 6 ? '50%' : L.rSm, display: 'grid', placeItems: 'center', fontFamily: L.font, fontSize: 12.5, fontWeight: 700, boxSizing: 'border-box', background: done ? fill : now ? (L.dark ? withAlpha(L.accent, 0.15) : L.soft) : 'transparent', color: done ? onFill : now ? (L.dark ? L.accent : L.onSoft) : L.muted, border: done ? (L.style.shadow === 'hard' ? `2px solid ${L.text}` : 'none') : `2px solid ${now ? (L.dark ? L.accent : L.trackOn) : L.dark ? withAlpha(L.text, 0.2) : L.borderStrong}`, boxShadow: now && L.style.focus === 'glow' ? `0 0 14px ${withAlpha(L.focusColor, 0.4)}` : undefined }}>
        {done ? <Ico name="Check" size={15} /> : bool(v, 'numeros') ? i + 1 : <span style={{ width: 7, height: 7, borderRadius: 9, background: 'currentColor' }} />}
      </span>
    )
  }
  const line = (done: boolean): CSSProperties => (vertical ? { width: 2, flex: 1, minHeight: 14, marginLeft: 13, background: done ? fill : L.trackOff } : { height: 2, flex: 1, background: done ? fill : L.trackOff, marginTop: 13 })
  if (vertical)
    return (
      <div {...P('steps')} style={{ display: 'grid', width: '100%', maxWidth: 260 }}>
        {steps.map((s, i) => (
          <div key={s + i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', columnGap: 12 }}>
            {marker(i)}
            <Col gap={0} style={{ paddingTop: 4 }}>
              <span style={{ ...textStyle(L, 'body'), fontWeight: i === cur ? 650 : 500, color: i > cur ? L.muted : L.text }}>{s}</span>
              {i === cur && <span style={textStyle(L, 'small')}>Em andamento</span>}
            </Col>
            {i < steps.length - 1 && <span style={{ ...line(i < cur), gridColumn: 1, height: 18 }} />}
          </div>
        ))}
      </div>
    )
  return (
    <div {...P('steps')} style={{ display: 'flex', width: '100%', maxWidth: 360, alignItems: 'flex-start' }}>
      {steps.map((s, i) => (
        <div key={s + i} style={{ display: 'contents' }}>
          <Col gap={6} style={{ alignItems: 'center', width: 64, flex: 'none' }}>
            {marker(i)}
            <span style={{ ...textStyle(L, 'small'), fontSize: 11.5, textAlign: 'center', color: i > cur ? L.muted : L.text, fontWeight: i === cur ? 650 : 450 }}>{s}</span>
          </Col>
          {i < steps.length - 1 && <span style={{ ...line(i < cur), margin: '13px -14px 0' }} />}
        </div>
      ))}
    </div>
  )
}

function Drawer({ v, st }: RP) {
  const { L } = usePv()
  const side = str(v, 'lado')
  const bottom = side === 'baixo'
  const panel: CSSProperties = {
    ...L.float,
    position: 'absolute',
    ...(bottom ? { left: 0, right: 0, bottom: 0, height: '74%', borderRadius: `${Math.min(L.rLg, 22)}px ${Math.min(L.rLg, 22)}px 0 0` } : { top: 0, bottom: 0, width: '66%', [side === 'esquerda' ? 'left' : 'right']: 0, borderRadius: side === 'esquerda' ? `0 ${Math.min(L.rLg, 18)}px ${Math.min(L.rLg, 18)}px 0` : `${Math.min(L.rLg, 18)}px 0 0 ${Math.min(L.rLg, 18)}px` }),
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    background: L.style.surface === 'glass' || L.style.surface === 'aurora' ? L.raised : L.style.surface === 'neu' || L.dark || L.style.surface === 'paper' ? L.surfaceSolid : (L.float.background as string),
  }
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: L.stage, overflow: 'hidden' }}>
      <Ghost rows={4} />
      {bool(v, 'overlay') && <div style={{ position: 'absolute', inset: 0, background: withAlpha('#000000', L.dark ? 0.5 : 0.32) }} />}
      <aside style={panel}>
        {bottom && <span style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 4, background: L.faint, marginTop: 8 }} />}
        <Row justify="space-between" style={{ padding: '12px 14px', borderBottom: L.divider }}>
          <Txt v="h3" part="title">
            {str(v, 'titulo')}
          </Txt>
          <Ico name="X" size={17} color={L.muted} />
        </Row>
        <Col gap={10} style={{ padding: '12px 14px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <span style={textStyle(L, 'caption')}>Status</span>
          <Row gap={6} wrap>
            <Badge tone="primary">Ativos</Badge>
            <Badge>Pausados</Badge>
          </Row>
          {['Somente favoritos', 'Com anexos'].map((t, i) => (
            <Row key={t} gap={8}>
              <Check on={i === 0} size={16} />
              <span style={{ ...textStyle(L, 'body'), fontSize: L.fs - 1 }}>{t}</span>
            </Row>
          ))}
        </Col>
        {bool(v, 'rodape') && (
          <Row gap={8} justify="flex-end" style={{ padding: '10px 14px', borderTop: L.divider }}>
            <Btn kind="ghost" size="sm">
              Limpar
            </Btn>
            <Btn size="sm" part="button" st={st}>
              {str(v, 'botao')}
            </Btn>
          </Row>
        )}
      </aside>
    </div>
  )
}

/* ============================== Dados e componentes ============================== */

function Media({ icon, height = 92, part }: { icon: string; height?: number; part?: string }) {
  const { L } = usePv()
  const P = usePart()
  const bg = L.style.fill === 'gradient' || L.style.fill === 'aurora' || L.style.fill === 'metal' ? L.fill : L.dark ? `linear-gradient(135deg, ${withAlpha(L.accent, 0.3)}, ${withAlpha(L.primary, 0.12)})` : `linear-gradient(135deg, ${L.soft}, ${mix(L.surfaceSolid, L.accent, 0.22)})`
  return (
    <div {...P(part)} style={{ height, background: bg, display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden', flex: 'none' }}>
      <span style={{ position: 'absolute', width: height * 1.4, height: height * 1.4, borderRadius: '50%', right: -height * 0.5, bottom: -height * 0.8, background: withAlpha('#ffffff', 0.18) }} />
      <Ico name={icon} size={Math.round(height * 0.36)} color={L.style.fill === 'solid' || L.style.fill === 'press' || L.style.fill === 'ivory' ? (L.dark ? L.accent : L.onSoft) : L.onFill} />
    </div>
  )
}

/** Moldura da mídia conforme a composição da família (sangrando, recuada, afundada, emoldurada, faixa técnica). */
function MediaFrame({ children, code = 'A-01', label }: { children: ReactNode; code?: string; label?: string }) {
  const { L } = usePv()
  const inner = Math.max(0, L.rLg - 8)
  switch (L.style.media) {
    case 'inset':
      return <div style={{ margin: '8px 8px 0', borderRadius: inner, overflow: 'hidden' }}>{children}</div>
    case 'sunken':
      return <div style={{ margin: '10px 10px 0', padding: 5, borderRadius: Math.max(0, L.rLg - 6), boxShadow: L.inset }}><div style={{ borderRadius: Math.max(0, L.rLg - 11), overflow: 'hidden' }}>{children}</div></div>
    case 'framed':
      return (
        <div style={{ margin: '10px 10px 0', padding: 4, border: L.style.surface === 'paper' ? `1.5px dashed ${L.text}` : `1px solid ${withAlpha(L.accent, 0.5)}`, borderRadius: Math.max(0, L.rLg - 6) }}>
          <div style={{ borderRadius: Math.max(0, L.rLg - 10), overflow: 'hidden' }}>{children}</div>
        </div>
      )
    case 'strip':
      return (
        <div>
          <Row justify="space-between" style={{ ...L.headBar, height: 24, padding: '0 10px', fontFamily: L.mono, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <span>[{code}]{label ? ` ${label}` : ''}</span>
            <Row gap={4}>
              <span style={{ width: 6, height: 6, borderRadius: 6, background: L.success }} />
              <span style={{ width: 6, height: 6, borderRadius: 6, background: L.accent }} />
            </Row>
          </Row>
          <div style={{ borderBottom: `1px solid ${L.borderStrong}` }}>{children}</div>
          <div aria-hidden="true" style={{ height: 5, background: `repeating-linear-gradient(-45deg, ${L.accent} 0 6px, transparent 6px 12px)`, opacity: 0.8 }} />
        </div>
      )
    default:
      return <div style={{ borderBottom: L.style.shadow === 'hard' ? `${L.bw}px solid ${L.text}` : undefined }}>{children}</div>
  }
}

function Cards({ v, st, large }: RP) {
  const { L } = usePv()
  const horizontal = str(v, 'layout') === 'horizontal'
  const media = bool(v, 'midia')
  const cardSt = withState(L, { ...L.card }, st === 'hover' ? 'hover' : undefined, 'plain')
  const hoverLift: CSSProperties = st === 'hover' ? { transform: L.style.shadow === 'hard' ? 'translate(-2px,-2px)' : 'translateY(-2px)', boxShadow: L.style.shadow === 'hard' ? `6px 6px 0 ${L.text}` : L.shadowFloat } : {}
  const overline = L.style.borderTone === 'ink' && L.style.shadow !== 'hard'
  const tag = str(v, 'etiqueta')
  return (
    <Card pad={0} style={{ ...cardSt, ...hoverLift, width: '100%', maxWidth: horizontal ? 340 : 252, overflow: 'hidden', display: horizontal ? 'flex' : 'block', ...(st === 'focus' ? L.focusFx : {}) }}>
      {media &&
        (horizontal ? (
          <div style={{ width: 104, flex: 'none', display: 'grid' }}>
            <Media icon={str(v, 'icone')} height={150} part="icon" />
          </div>
        ) : (
          <MediaFrame label={tag}>
            <Media icon={str(v, 'icone')} height={large ? 120 : 76} part="icon" />
          </MediaFrame>
        ))}
      <Col gap={5} style={{ padding: L.pad, paddingTop: media && !horizontal && L.style.media !== 'bleed' && L.style.media !== 'strip' ? Math.round(L.pad * 0.8) : L.pad, flex: 1 }}>
        {tag && L.style.media !== 'strip' && (overline ? <Over part="badge">{tag}</Over> : <span><Badge tone="primary" part="badge">{tag}</Badge></span>)}
        <Txt v="h3" part="title">
          {str(v, 'titulo')}
        </Txt>
        <Txt v="small" part="body" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {str(v, 'texto')}
        </Txt>
        {bool(v, 'rodape') && (
          <Row justify="space-between" style={{ marginTop: 4, ...(L.style.borderTone === 'ink' || L.style.media === 'strip' ? { borderTop: L.divider, paddingTop: 8 } : {}) }}>
            <Row gap={4} style={textStyle(L, 'small')}>
              <Ico name="Star" size={13} color={L.warning} filled /> 4,9
            </Row>
            <Btn size="sm" kind={L.style.media === 'inset' && L.style.field === 'tonal' ? 'primary' : 'secondary'} part="button">
              {str(v, 'botao')}
            </Btn>
          </Row>
        )}
      </Col>
    </Card>
  )
}

function Sparkline({ up = true, width = 220, height = 44, color }: { up?: boolean; width?: number; height?: number; color?: string }) {
  const { L } = usePv()
  const pts = up ? [30, 26, 32, 22, 24, 16, 18, 10, 6] : [8, 12, 10, 18, 14, 22, 20, 28, 32]
  const step = width / (pts.length - 1)
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${((p / 36) * height).toFixed(1)}`).join(' ')
  const c = color ?? (L.dark ? L.accent : L.style.fill === 'gradient' || L.style.fill === 'accent' ? L.accent : L.brand)
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block' }}>
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={withAlpha(c, 0.14)} />
      <path d={d} fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function Kpi({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const trend = str(v, 'tendencia')
  const tone: Tone = trend === 'alta' ? 'success' : trend === 'baixa' ? 'error' : 'neutral'
  const tc = toneColors(L, tone)
  return (
    <Card accentTop style={{ width: '100%', maxWidth: 260 }}>
      <Col gap={6}>
        <Row justify="space-between" align="flex-start">
          <Txt v="label" part="label" color={L.muted}>
            {str(v, 'rotulo')}
          </Txt>
          <Tile name={str(v, 'icone')} size={32} part="icon" />
        </Row>
        <Txt v="num" part="value">
          {str(v, 'valor')}
        </Txt>
        <Row gap={8}>
          <span {...P('delta')} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: L.r >= 999 ? 999 : Math.min(L.r, 6), background: tc.bg, color: tc.fg, fontFamily: L.font, fontSize: 12, fontWeight: 650 }}>
            <Ico name={trend === 'alta' ? 'TrendingUp' : trend === 'baixa' ? 'TrendingDown' : 'Minus'} size={13} /> {str(v, 'variacao')}
          </span>
          <Txt v="small" part="help">
            {str(v, 'comparativo')}
          </Txt>
        </Row>
        {bool(v, 'sparkline') && (
          <div style={{ marginTop: 4 }}>
            <Sparkline up={trend !== 'baixa'} color={trend === 'baixa' ? L.error : undefined} />
          </div>
        )}
      </Col>
    </Card>
  )
}

const PEOPLE = ['Ana Souza', 'Bruno Lima', 'Carla Dias', 'Diego Rocha', 'Elisa Prado', 'Fábio Nunes']
const STATUS: [string, Tone][] = [
  ['Pago', 'success'],
  ['Pendente', 'warning'],
  ['Pago', 'success'],
  ['Cancelado', 'error'],
  ['Em análise', 'info'],
  ['Pago', 'success'],
]

function Tabela({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const cols = lines(v, 'colunas').slice(0, 4)
  const rows = Math.max(2, Math.min(6, num(v, 'linhas', 4)))
  const dens = str(v, 'densidade')
  const rowH = dens === 'compacta' ? 32 : dens === 'confortavel' ? 46 : 38
  const head = str(v, 'cabecalho')
  const sel = bool(v, 'selecao')
  const acts = bool(v, 'acoes')
  const headStyle: CSSProperties = head === 'escuro' ? { background: L.dark ? withAlpha('#ffffff', 0.08) : L.text, color: L.dark ? L.text : L.bg } : head === 'destacado' ? { ...L.headBar } : { background: 'transparent', color: L.muted, borderBottom: L.divider }
  const wide = `${sel ? '22px ' : ''}minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 0.9fr)${cols.length > 3 ? ' minmax(0, 0.8fr)' : ''}${acts ? ' 20px' : ''}`
  const narrow = `${sel ? '22px ' : ''}minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 0.9fr)`
  const vars = { '--cols-wide': wide, '--cols-narrow': narrow } as CSSProperties
  const cell: CSSProperties = { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
  return (
    <Card pad={0} style={{ width: '100%', overflow: 'hidden' }}>
      <Row justify="space-between" style={{ padding: '10px 12px' }}>
        <Txt v="h3" part="title">
          {str(v, 'titulo')}
        </Txt>
        <Btn size="sm" kind="secondary" icon="Download">
          <span className="cmp-wide-only">Exportar</span>
        </Btn>
      </Row>
      <div {...P('columns')} role="table" style={{ fontFamily: L.font, fontSize: L.fs - 1 }}>
        <div role="row" className="cmp-trow" style={{ ...vars, display: 'grid', gap: 10, alignItems: 'center', padding: '0 12px', height: 30, ...headStyle, fontFamily: L.labelFont, fontSize: 11.5, fontWeight: 650, textTransform: L.upper ? 'uppercase' : 'none', letterSpacing: L.upper ? L.track : '0.01em' }}>
          {sel && <Check on={false} mixed size={15} />}
          {cols.map((c, i) => (
            <span key={c + i} style={{ ...cell, textAlign: i === 2 ? 'right' : 'left' }} className={i === 3 ? 'cmp-xwide-only' : undefined}>
              {c}
            </span>
          ))}
          {acts && <span className="cmp-xwide-only" />}
        </div>
        {Array.from({ length: rows }, (_, r) => {
          const [status, tone] = STATUS[r % STATUS.length]
          return (
            <div
              key={r}
              role="row"
              className="cmp-trow"
              style={withState(L, { ...vars, display: 'grid', gap: 10, alignItems: 'center', padding: '0 12px', height: rowH, borderTop: r === 0 && head !== 'simples' ? undefined : L.divider, background: bool(v, 'zebra') && r % 2 === 1 ? L.zebra : r === 1 && sel ? L.soft : undefined, color: L.text }, r === 0 ? (st === 'normal' ? undefined : st === 'disabled' ? undefined : 'hover') : undefined, 'ghost')}
            >
              {sel && <Check on={r === 1} size={15} />}
              <Row gap={8} style={cell}>
                <Avatar name={PEOPLE[r]} size={22} index={r} />
                <span style={{ ...cell, fontWeight: 560 }}>{PEOPLE[r]}</span>
              </Row>
              <span style={cell}>
                <Badge tone={tone} variant="soft">
                  {status}
                </Badge>
              </span>
              <span style={{ ...cell, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 560 }}>R$ {(r * 137 + 89).toLocaleString('pt-BR')},00</span>
              {cols.length > 3 && (
                <span style={{ ...cell, color: L.muted }} className="cmp-xwide-only">
                  {String(12 - r).padStart(2, '0')}/03
                </span>
              )}
              {acts && (
                <span className="cmp-xwide-only">
                  <Ico name="MoreHorizontal" size={15} color={L.muted} />
                </span>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function DataGrid({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const dens = str(v, 'densidade')
  const rowH = dens === 'compacta' ? 30 : dens === 'confortavel' ? 44 : 36
  const selRow = num(v, 'linhaSelecionada', 2) - 1
  const grid = '20px minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 0.8fr)'
  const sortIc = (on: boolean) => bool(v, 'ordenacao') && <Ico name={on ? 'ArrowDown' : 'ChevronDown'} size={12} color={on ? L.primary : L.faint} />
  return (
    <Card pad={0} style={{ width: '100%', overflow: 'hidden' }}>
      <Row justify="space-between" gap={8} style={{ padding: '10px 12px' }}>
        <Txt v="h3" part="title">
          {str(v, 'titulo')}
        </Txt>
        <span style={{ ...textStyle(L, 'small'), fontVariantNumeric: 'tabular-nums' }}>248 registros</span>
      </Row>
      {bool(v, 'filtros') && (
        <Row gap={6} style={{ padding: '0 12px 10px' }} wrap>
          <div style={{ flex: '1 1 110px', minWidth: 0 }}>
            <Field placeholder="Buscar…" icon="Search" size="sm" st={st} />
          </div>
          <Badge tone="primary" removable part="filters">
            Ativos
          </Badge>
          <Badge variant="outline">+ Filtro</Badge>
        </Row>
      )}
      <div style={{ fontFamily: L.font, fontSize: L.fs - 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 10, alignItems: 'center', padding: '0 12px', height: 30, ...L.headBar, fontFamily: L.labelFont, fontSize: 11.5, fontWeight: 650, textTransform: L.upper ? 'uppercase' : 'none', letterSpacing: L.upper ? L.track : 0 }}>
          <Check on={false} mixed size={14} />
          <Row gap={4}>Nome {sortIc(true)}</Row>
          <Row gap={4}>Plano {sortIc(false)}</Row>
          <Row gap={4} justify="flex-end">MRR {sortIc(false)}</Row>
        </div>
        {[0, 1, 2, 3].map((r) => (
          <div key={r} {...(r === selRow ? P('row') : {})} style={{ display: 'grid', gridTemplateColumns: grid, gap: 10, alignItems: 'center', padding: '0 12px', height: rowH, borderTop: L.divider, background: r === selRow ? L.soft : undefined, boxShadow: r === selRow ? `inset 3px 0 0 ${L.trackOn}` : undefined, color: L.text }}>
            <Check on={r === selRow} size={14} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 560 }}>{['Lumen Ltda.', 'Orbe Digital', 'Casa Verde', 'Nórdica S.A.'][r]}</span>
            <span style={{ color: L.muted }}>{['Pro', 'Equipe', 'Pro', 'Básico'][r]}</span>
            <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>R$ {[890, 2140, 560, 129][r]}</span>
          </div>
        ))}
      </div>
      {bool(v, 'rodape') && (
        <Row justify="space-between" style={{ padding: '8px 12px', borderTop: L.divider, ...textStyle(L, 'small') }}>
          <span>1–4 de 248</span>
          <Row gap={4}>
            <Ico name="ChevronLeft" size={15} />
            <Ico name="ChevronRight" size={15} />
          </Row>
        </Row>
      )}
    </Card>
  )
}

function Badges({ v }: RP) {
  const { L } = usePv()
  const texts = lines(v, 'textos')
  const tones: Tone[] = ['success', 'warning', 'error', 'neutral', 'info', 'primary']
  const variant = ({ suave: 'soft', solido: 'solid', contorno: 'outline', ponto: 'dot' } as const)[str(v, 'estilo') as 'suave'] ?? 'soft'
  const shape = str(v, 'formato') as 'familia'
  const custom = hexOr(str(v, 'cor'), '')
  return (
    <Col gap={16} style={{ width: '100%', maxWidth: 320, alignItems: 'center' }}>
      <Row gap={8} wrap justify="center">
        {texts.map((t, i) => (
          <Badge key={t + i} tone={tones[i % tones.length]} variant={variant} shape={shape} removable={bool(v, 'removivel')} color={i === 0 ? custom : undefined} part="badges">
            {t}
          </Badge>
        ))}
      </Row>
      <Card pad={0} style={{ width: '100%' }}>
        {['Pedido #1042', 'Pedido #1043'].map((p, i) => (
          <Row key={p} justify="space-between" style={{ padding: '10px 12px', borderTop: i ? L.divider : undefined }}>
            <span style={{ ...textStyle(L, 'body'), fontSize: L.fs - 0.5, fontWeight: 560 }}>{p}</span>
            <Badge tone={tones[i]} variant={variant} shape={shape} color={i === 0 ? custom : undefined}>
              {texts[i] ?? 'Status'}
            </Badge>
          </Row>
        ))}
      </Card>
    </Col>
  )
}

function Listas({ v, st }: RP) {
  const { L } = usePv()
  const items = lines(v, 'itens').slice(0, 4)
  const action = str(v, 'acao')
  return (
    <Card pad={0} style={{ width: '100%', maxWidth: 320, overflow: 'hidden' }}>
      <Row justify="space-between" style={{ padding: '10px 14px' }}>
        <Txt v="h3" part="title">
          {str(v, 'titulo')}
        </Txt>
        <span style={{ ...textStyle(L, 'small'), color: L.primary, fontWeight: 600 }}>Ver todos</span>
      </Row>
      <div data-part="items">
        {items.map((it, i) => {
          const [name, detail] = pair(it)
          return (
            <Row key={it + i} gap={12} style={withState(L, { padding: '9px 14px', borderTop: bool(v, 'divisores') ? L.divider : undefined }, i === 0 && st !== 'normal' ? (st === 'disabled' ? 'disabled' : 'hover') : undefined, 'ghost')}>
              {bool(v, 'avatares') && <Avatar name={name} size={34} index={i} status={i === 0 ? 'online' : undefined} />}
              <Col gap={0} style={{ flex: 1 }}>
                <span style={{ ...textStyle(L, 'body'), fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                <span style={textStyle(L, 'small')}>{detail}</span>
              </Col>
              {action === 'chevron' && <Ico name="ChevronRight" size={16} color={L.faint} />}
              {action === 'switch' && <Toggle on={i !== 1} size="sm" />}
              {action === 'botao' && (
                <Btn size="sm" kind="secondary">
                  Ver
                </Btn>
              )}
            </Row>
          )
        })}
      </div>
    </Card>
  )
}

function Graficos({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const type = str(v, 'tipo')
  const two = num(v, 'series', 2) > 1
  const a = [42, 58, 50, 72, 64, 86]
  const b = [30, 36, 44, 40, 52, 60]
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
  const c1 = L.dark ? L.accent : L.style.fill === 'accent' ? L.accent : L.brand
  const c2 = L.dark ? withAlpha(L.text, 0.45) : L.style.fill === 'accent' ? L.text : c1 === L.accent ? L.primary : L.accent
  const W = 260
  const H = 110
  const x = (i: number) => 14 + i * ((W - 28) / 5)
  const y = (val: number) => H - (val / 100) * (H - 10)
  const path = (s: number[]) => s.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p)}`).join(' ')
  return (
    <Card style={{ width: '100%', maxWidth: 330 }}>
      <Col gap={10}>
        <Row justify="space-between">
          <Txt v="h3" part="title">
            {str(v, 'titulo')}
          </Txt>
          {bool(v, 'legenda') && (
            <Row gap={10} style={textStyle(L, 'small')}>
              <Row gap={4}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c1 }} /> 2025
              </Row>
              {two && type !== 'pizza' && (
                <Row gap={4}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c2 }} /> 2024
                </Row>
              )}
            </Row>
          )}
        </Row>
        {type === 'pizza' ? (
          <Row gap={18} justify="center" {...P('chart')}>
            <svg viewBox="0 0 42 42" width={110} height={110} aria-hidden="true">
              {[
                [45, c1],
                [25, c2],
                [18, L.secondary],
                [12, L.dark ? withAlpha(L.text, 0.25) : L.borderStrong],
              ].reduce<{ off: number; els: ReactNode[] }>(
                (acc, [pct, color], i) => {
                  acc.els.push(<circle key={i} cx="21" cy="21" r="15.9" fill="none" stroke={String(color)} strokeWidth="6" strokeDasharray={`${pct} ${100 - Number(pct)}`} strokeDashoffset={25 - acc.off} />)
                  acc.off += Number(pct)
                  return acc
                },
                { off: 0, els: [] },
              ).els}
              <text x="21" y="23.5" textAnchor="middle" fontSize="7" fontWeight="700" fill={L.text} fontFamily={L.headingFont}>
                45%
              </text>
            </svg>
            <Col gap={6} style={textStyle(L, 'small')}>
              {['Online', 'Lojas', 'Parceiros', 'Outros'].map((n, i) => (
                <Row key={n} gap={6}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: [c1, c2, L.secondary, L.borderStrong][i] }} />
                  {n}
                </Row>
              ))}
            </Col>
          </Row>
        ) : (
          <svg {...P('chart')} viewBox={`0 0 ${W} ${H + 18}`} width="100%" height={H + 18} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
            {bool(v, 'grade') && [0, 1, 2, 3].map((i) => <line key={i} x1={0} x2={W} y1={10 + i * ((H - 10) / 3)} y2={10 + i * ((H - 10) / 3)} stroke={L.dark ? withAlpha(L.text, 0.1) : L.border} strokeDasharray={L.style.surface === 'concrete' ? '3 3' : undefined} />)}
            {type === 'barras' &&
              a.map((val, i) => (
                <g key={i}>
                  <rect x={x(i) - (two ? 11 : 7)} y={y(val)} width={two ? 10 : 14} height={H - y(val)} rx={Math.min(L.rSm, 4)} fill={c1} />
                  {two && <rect x={x(i) + 1} y={y(b[i])} width={10} height={H - y(b[i])} rx={Math.min(L.rSm, 4)} fill={c2} />}
                  {bool(v, 'valores') && <text x={x(i) - (two ? 6 : 0)} y={y(val) - 4} fontSize="9.5" textAnchor="middle" fill={L.muted} fontFamily={L.font}>{val}</text>}
                </g>
              ))}
            {(type === 'linha' || type === 'area') && (
              <>
                {type === 'area' && <path d={`${path(a)} L${x(5)},${H} L${x(0)},${H} Z`} fill={withAlpha(c1, 0.18)} />}
                {two && <path d={path(b)} fill="none" stroke={c2} strokeWidth={2} strokeDasharray="4 3" />}
                <path d={path(a)} fill="none" stroke={c1} strokeWidth={2.5} strokeLinejoin="round" />
                {a.map((val, i) => (
                  <circle key={i} cx={x(i)} cy={y(val)} r={3} fill={L.surfaceSolid} stroke={c1} strokeWidth={2} />
                ))}
              </>
            )}
            {months.map((m, i) => (
              <text key={m} x={x(i)} y={H + 14} fontSize="11" textAnchor="middle" fill={L.muted} fontFamily={L.font}>
                {m}
              </text>
            ))}
          </svg>
        )}
      </Col>
    </Card>
  )
}

function Timelines({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const items = lines(v, 'itens').slice(0, 5)
  const cur = num(v, 'atual', 1) - 1
  const horizontal = str(v, 'orientacao') === 'horizontal'
  const icons = ['ShoppingBag', 'CreditCard', 'Truck', 'Package', 'Check']
  const fill = L.style.fill === 'solid' || L.style.fill === 'press' ? L.trackOn : L.fill
  const dot = (i: number) => {
    const done = i < cur
    const now = i === cur
    return (
      <span style={{ width: 26, height: 26, flex: 'none', borderRadius: L.r >= 6 ? '50%' : L.rSm, display: 'grid', placeItems: 'center', boxSizing: 'border-box', background: done ? fill : now ? L.surfaceSolid : L.dark ? withAlpha(L.text, 0.06) : L.surfaceAlt, color: done ? (L.style.fill === 'solid' ? readableOn(L.trackOn) : L.onFill) : now ? L.primary : L.faint, border: now ? `2px solid ${L.dark ? L.accent : L.trackOn}` : L.style.shadow === 'hard' ? `2px solid ${L.text}` : undefined, boxShadow: now ? `0 0 0 4px ${withAlpha(L.dark ? L.accent : L.trackOn, 0.15)}` : undefined }}>
        {bool(v, 'icones') ? <Ico name={done ? 'Check' : icons[i % icons.length]} size={13} /> : <span style={{ width: 6, height: 6, borderRadius: 6, background: 'currentColor' }} />}
      </span>
    )
  }
  if (horizontal)
    return (
      <div {...P('items')} style={{ display: 'flex', width: '100%', maxWidth: 360 }}>
        {items.map((it, i) => {
          const [t, time] = pair(it)
          return (
            <Col key={it + i} gap={6} style={{ flex: 1, alignItems: 'center', position: 'relative' }}>
              {i < items.length - 1 && <span style={{ position: 'absolute', top: 12, left: '50%', width: '100%', height: 2, background: i < cur ? fill : L.trackOff }} />}
              <span style={{ position: 'relative' }}>{dot(i)}</span>
              <span style={{ ...textStyle(L, 'small'), fontSize: 11.5, textAlign: 'center', color: i > cur ? L.muted : L.text, fontWeight: i === cur ? 650 : 450 }}>{t}</span>
              <span style={{ ...textStyle(L, 'caption'), fontSize: 11 }}>{time}</span>
            </Col>
          )
        })}
      </div>
    )
  return (
    <div {...P('items')} style={{ display: 'grid', width: '100%', maxWidth: 280 }}>
      {items.map((it, i) => {
        const [t, time] = pair(it)
        return (
          <div key={it + i} style={{ display: 'grid', gridTemplateColumns: '26px 1fr auto', columnGap: 12 }}>
            {dot(i)}
            <span style={{ ...textStyle(L, 'body'), fontWeight: i === cur ? 650 : 500, color: i > cur ? L.muted : L.text, paddingTop: 3 }}>{t}</span>
            <span style={{ ...textStyle(L, 'small'), paddingTop: 4, fontVariantNumeric: 'tabular-nums' }}>{time}</span>
            {i < items.length - 1 && <span style={{ width: 2, height: 16, margin: '2px 0 2px 12px', background: i < cur ? fill : L.trackOff, gridColumn: 1 }} />}
          </div>
        )
      })}
    </div>
  )
}

function Accordions({ v, st }: RP) {
  const { L } = usePv()
  const items = lines(v, 'itens').slice(0, 4)
  const open = num(v, 'aberto', 1) - 1
  const sep = bool(v, 'separados')
  const plus = str(v, 'icone') === 'mais'
  const wrap = (children: ReactNode, i: number) =>
    sep ? (
      <Card key={i} pad={0}>
        {children}
      </Card>
    ) : (
      <div key={i} style={{ borderTop: i ? L.divider : undefined }}>
        {children}
      </div>
    )
  const body = (
    <Col gap={sep ? 8 : 0} style={{ width: '100%', maxWidth: 330 }}>
      {items.map((it, i) =>
        wrap(
          <>
            <Row gap={10} justify="space-between" style={withState(L, { padding: `${Math.round(L.pad * 0.8)}px ${L.pad}px`, cursor: 'pointer' }, i === open ? undefined : i === 0 || i === open + 1 ? (st === 'normal' ? undefined : st) : undefined, 'ghost')} {...(i === 0 ? { 'data-part': 'items' } : {})}>
              <span style={{ ...textStyle(L, 'body'), fontWeight: 620 }}>{it}</span>
              <Ico name={plus ? (i === open ? 'Minus' : 'Plus') : i === open ? 'ChevronUp' : 'ChevronDown'} size={16} color={i === open ? L.primary : L.muted} />
            </Row>
            {i === open && (
              <Txt v="small" part="body" as="p" style={{ padding: `0 ${L.pad}px ${L.pad}px`, fontSize: L.fs - 1 }}>
                {str(v, 'resposta')}
              </Txt>
            )}
          </>,
          i,
        ),
      )}
    </Col>
  )
  return sep ? body : <Card pad={0} style={{ width: '100%', maxWidth: 330 }}>{body}</Card>
}

function Avatares({ v }: RP) {
  const { L } = usePv()
  const name = str(v, 'nome')
  const size = num(v, 'tamanho', 52)
  const shape = str(v, 'formato') as 'circulo' | 'quadrado'
  return (
    <Col gap={18} style={{ alignItems: 'center' }}>
      <Row gap={12}>
        <Avatar name={name} size={size} status={str(v, 'status') as 'online'} shape={shape} kind={str(v, 'tipo') as 'iniciais'} color={str(v, 'cor')} part="avatar" />
        <Col gap={0}>
          <Txt v="h3" part="name">
            {name}
          </Txt>
          <Txt v="small">Product Designer</Txt>
        </Col>
      </Row>
      {bool(v, 'grupo') && (
        <Row gap={10}>
          <Row gap={0}>
            {PEOPLE.slice(1, 5).map((p, i) => (
              <span key={p} style={{ marginLeft: i ? -10 : 0 }}>
                <Avatar name={p} size={36} index={i + 1} shape={shape} ring />
              </span>
            ))}
            <span style={{ marginLeft: -10, width: 36, height: 36, borderRadius: shape === 'quadrado' ? 10 : '50%', background: L.dark ? withAlpha(L.text, 0.12) : L.surfaceAlt, color: L.muted, display: 'grid', placeItems: 'center', fontFamily: L.font, fontSize: 12, fontWeight: 650, boxShadow: `0 0 0 2px ${L.surfaceSolid}` }}>+3</span>
          </Row>
          <Txt v="small">7 pessoas no projeto</Txt>
        </Row>
      )}
    </Col>
  )
}

function Calendarios({ v, st }: RP) {
  const { L } = usePv()
  const agenda = str(v, 'visao') === 'agenda'
  const day = num(v, 'diaSelecionado', 14)
  return (
    <Card style={{ width: '100%', maxWidth: 300 }} pad={12}>
      {agenda ? (
        <Col gap={8}>
          <Txt v="h3" part="title">
            {str(v, 'mes')}
          </Txt>
          {[
            ['09:00', 'Reunião de equipe', L.cycle[0].bg],
            ['11:30', 'Entrevista — Design', L.accent],
            ['15:00', 'Revisão do sprint', L.secondary],
          ].map(([t, n, c], i) => (
            <Row key={t} gap={10} style={withState(L, { padding: '8px 10px', borderRadius: Math.min(L.r, 10), background: L.dark ? withAlpha(L.text, 0.05) : L.surfaceAlt, boxShadow: `inset 3px 0 0 ${c}` }, i === 0 ? st : undefined, 'ghost')}>
              <span style={{ ...textStyle(L, 'small'), fontVariantNumeric: 'tabular-nums', width: 40 }}>{t}</span>
              <span style={{ ...textStyle(L, 'body'), fontWeight: 560, fontSize: L.fs - 0.5 }}>{n}</span>
            </Row>
          ))}
        </Col>
      ) : (
        <MiniCalendar selected={day} title={str(v, 'mes')} cell={36} events={bool(v, 'eventos')} startMonday={str(v, 'inicioSemana') === 'seg'} />
      )}
    </Card>
  )
}

function Kanban({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const cols = lines(v, 'colunas').slice(0, 4)
  const n = Math.max(1, Math.min(3, num(v, 'cartoes', 2)))
  const tasks = ['Revisar proposta', 'Ajustar layout', 'Testes de usabilidade', 'Publicar versão', 'Pesquisa com clientes', 'Atualizar docs', 'Corrigir login', 'Novo onboarding', 'Relatório mensal']
  const tags: [string, Tone][] = [
    ['Design', 'primary'],
    ['Bug', 'error'],
    ['Pesquisa', 'info'],
  ]
  return (
    <div {...P('columns')} style={{ display: 'flex', gap: 10, width: '100%', overflow: 'hidden', alignItems: 'flex-start', ...fade }}>
      {cols.map((c, ci) => (
        <div key={c + ci} style={{ width: 150, flex: 'none', borderRadius: Math.min(L.rLg, 14), padding: 8, background: L.dark ? withAlpha(L.text, 0.05) : L.style.surface === 'glass' ? withAlpha('#ffffff', 0.3) : mix(L.surfaceSolid, L.text, 0.04), border: L.style.borderTone === 'ink' ? `1px solid ${L.text}` : undefined, display: 'grid', gap: 8 }}>
          <Row justify="space-between" style={{ padding: '0 2px' }}>
            <span style={{ ...textStyle(L, 'label'), fontSize: 12 }}>{c}</span>
            {bool(v, 'contadores') && <Badge>{n + ci}</Badge>}
          </Row>
          {Array.from({ length: n }, (_, k) => (
            <Card key={k} pad={10} style={{ display: 'grid', gap: 6, ...(ci === 1 && k === 0 ? { transform: 'rotate(-1.5deg)', boxShadow: L.shadowFloat } : {}) }}>
              {bool(v, 'etiquetas') && (
                <span>
                  <Badge tone={tags[(ci + k) % 3][1]}>{tags[(ci + k) % 3][0]}</Badge>
                </span>
              )}
              <span style={{ ...textStyle(L, 'body'), fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>{tasks[(ci * 3 + k) % tasks.length]}</span>
              <Row justify="space-between">
                <Row gap={4} style={{ ...textStyle(L, 'small'), fontSize: 11.5 }}>
                  <Ico name="Calendar" size={12} /> {12 + ci + k} mar
                </Row>
                {bool(v, 'avatares') && <Avatar name={PEOPLE[(ci + k) % 6]} size={20} index={ci + k} />}
              </Row>
            </Card>
          ))}
        </div>
      ))}
    </div>
  )
}

function Progresso({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const val = Math.max(0, Math.min(100, num(v, 'valor', 68)))
  const type = str(v, 'tipo')
  const h = { sm: 5, md: 8, lg: 12 }[str(v, 'tamanho') as 'md'] ?? 8
  const fillC = L.style.fill === 'solid' || L.style.fill === 'press' || L.style.fill === 'ivory' ? L.trackOn : L.dark ? L.accent : L.primary
  return (
    <Col gap={18} style={{ width: '100%', maxWidth: 300 }}>
      {type === 'circular' ? (
        <Row gap={16} justify="center">
          <span {...P('bar')} style={{ position: 'relative', width: 92, height: 92 }}>
            <svg viewBox="0 0 36 36" width={92} height={92} aria-hidden="true" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.5" fill="none" stroke={L.trackOff} strokeWidth={h / 2.5} />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke={fillC} strokeWidth={h / 2.5} strokeDasharray={`${(val / 100) * 97.4} 97.4`} strokeLinecap={L.r >= 6 ? 'round' : 'butt'} />
            </svg>
            {bool(v, 'percentual') && <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', ...textStyle(L, 'h2') }}>{val}%</span>}
          </span>
          <Txt v="label" part="label">
            {str(v, 'rotulo')}
          </Txt>
        </Row>
      ) : (
        <Col gap={8}>
          <Row justify="space-between">
            <Txt v="label" part="label">
              {str(v, 'rotulo')}
            </Txt>
            {bool(v, 'percentual') && <span style={{ ...textStyle(L, 'label'), color: L.primary, fontVariantNumeric: 'tabular-nums' }}>{val}%</span>}
          </Row>
          {type === 'etapas' ? (
            <Row gap={4} {...P('bar')}>
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} style={{ flex: 1, height: h, borderRadius: L.r >= 6 ? 99 : L.rSm, background: (i + 1) * 20 <= val + 10 ? fillC : L.trackOff }} />
              ))}
            </Row>
          ) : (
            <span {...P('bar')}>
              <Bar value={val} height={h} striped={bool(v, 'listrado')} />
            </span>
          )}
          <span style={textStyle(L, 'small')}>3 de 5 arquivos · cerca de 20 s restantes</span>
        </Col>
      )}
      <Card pad={12}>
        <Col gap={6}>
          <Row justify="space-between" style={textStyle(L, 'small')}>
            <span style={{ color: L.text, fontWeight: 560 }}>Armazenamento</span>
            <span>4,2 de 10 GB</span>
          </Row>
          <Bar value={42} height={6} />
        </Col>
      </Card>
    </Col>
  )
}

function EmptyStates({ v }: RP) {
  const { L } = usePv()
  return (
    <Col gap={10} style={{ alignItems: 'center', textAlign: 'center', maxWidth: 280 }}>
      <div style={{ position: 'relative', display: 'grid', placeItems: 'center', width: 84, height: 84 }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: L.dark ? withAlpha(L.accent, 0.1) : mix(L.surfaceSolid, L.primary, 0.06), border: L.style.borderTone === 'ink' ? `1.5px dashed ${L.text}` : undefined }} />
        <Tile name={str(v, 'icone')} size={50} part="icon" />
      </div>
      <Txt v="h2" part="title">
        {str(v, 'titulo')}
      </Txt>
      <Txt v="small" part="body" as="p">
        {str(v, 'texto')}
      </Txt>
      <Row gap={8} style={{ marginTop: 4 }} wrap justify="center">
        <Btn size="sm" icon="Plus" part="button">
          {str(v, 'botao')}
        </Btn>
        {bool(v, 'secundaria') && (
          <Btn size="sm" kind="ghost">
            Ver tutorial
          </Btn>
        )}
      </Row>
    </Col>
  )
}

function Skeletons({ v }: RP) {
  const { L } = usePv()
  const layout = str(v, 'layout')
  const n = Math.max(1, Math.min(5, num(v, 'linhas', 3)))
  const anim = str(v, 'animacao')
  const cls = anim === 'pulso' ? 'cmp-skel--pulse' : anim === 'nenhuma' ? 'cmp-skel--none' : ''
  return (
    <Card style={{ width: '100%', maxWidth: 290 }} part="layout">
      <div className={cls} aria-busy="true">
        {layout === 'cartao' && (
          <Col gap={10}>
            <Skel h={90} r={Math.min(L.rLg, 14)} />
            <Skel w="60%" h={14} />
            {Array.from({ length: n }, (_, i) => (
              <Skel key={i} w={`${95 - i * 15}%`} h={10} />
            ))}
          </Col>
        )}
        {layout === 'lista' && (
          <Col gap={12}>
            {Array.from({ length: n + 1 }, (_, i) => (
              <Row key={i} gap={10}>
                <Skel w={34} h={34} r="50%" style={{ flex: 'none' }} />
                <Col gap={6} style={{ flex: 1 }}>
                  <Skel w="55%" h={11} />
                  <Skel w="80%" h={9} />
                </Col>
              </Row>
            ))}
          </Col>
        )}
        {layout === 'tabela' && (
          <Col gap={10}>
            <Row gap={10}>
              {[40, 25, 20].map((w, i) => (
                <Skel key={i} w={`${w}%`} h={12} />
              ))}
            </Row>
            {Array.from({ length: n + 2 }, (_, i) => (
              <Row key={i} gap={10} style={{ borderTop: L.divider, paddingTop: 10 }}>
                <Skel w="40%" h={10} />
                <Skel w="25%" h={10} />
                <Skel w="20%" h={10} />
              </Row>
            ))}
          </Col>
        )}
        {layout === 'perfil' && (
          <Col gap={10} style={{ alignItems: 'center' }}>
            <Skel w={64} h={64} r="50%" />
            <Skel w="50%" h={14} />
            <Skel w="35%" h={10} />
            {Array.from({ length: n }, (_, i) => (
              <Skel key={i} w={`${90 - i * 10}%`} h={10} />
            ))}
          </Col>
        )}
      </div>
    </Card>
  )
}

export const NAV_DATA_RENDERERS: RendererMap = {
  botoes: { render: Botoes },
  'botoes-icone': { render: BotoesIcone },
  'headers-topbars': { render: Header, frame: 'fill' },
  sidebars: { render: Sidebar, frame: 'fill' },
  tabs: { render: Tabs },
  'segmented-controls': { render: Segmented },
  breadcrumbs: { render: Breadcrumbs },
  'menus-contextuais': { render: MenuContextual, frame: 'top' },
  'mega-menus': { render: MegaMenu, frame: 'fill' },
  paginacao: { render: Paginacao },
  'step-indicators': { render: Steps },
  drawers: { render: Drawer, frame: 'fill' },
  cards: { render: Cards },
  'kpis-stat-cards': { render: Kpi },
  tabelas: { render: Tabela, frame: 'top' },
  'grids-de-dados': { render: DataGrid, frame: 'top' },
  'badges-tags': { render: Badges },
  listas: { render: Listas },
  graficos: { render: Graficos },
  timelines: { render: Timelines },
  accordions: { render: Accordions },
  avatares: { render: Avatares },
  calendarios: { render: Calendarios },
  'quadros-kanban': { render: Kanban },
  'barras-progresso': { render: Progresso },
  'empty-states': { render: EmptyStates },
  'skeleton-loaders': { render: Skeletons },
}

export { Ghost, Media, MediaFrame, Sparkline, iconBtnBox }
