import type { CSSProperties, ReactNode } from 'react'
import { mix, readableOn, withAlpha } from '@/core/color'
import {
  Avatar, Badge, Bar, Btn, Card, Check, Col, Divider, Field, Ico, Kbd, Over, Row, Skel, Spinner, Tile, Toggle, Txt,
  bool, lines, navItemStyle, num, str, textStyle, toneColors, usePart, usePv, withState,
  type Tone,
} from './kit'
import { Ghost, Media, Sparkline, iconBtnBox } from './render-nav-data'
import type { RP, RendererMap } from './render-types'

const TONE_ICON: Record<string, string> = { sucesso: 'CheckCircle2', erro: 'XCircle', info: 'Info', aviso: 'TriangleAlert' }
const TONE_OF: Record<string, Tone> = { sucesso: 'success', erro: 'error', info: 'info', aviso: 'warning' }

function Dim({ children, opacity = 0.38 }: { children?: ReactNode; opacity?: number }) {
  const { L } = usePv()
  return <div style={{ position: 'absolute', inset: 0, background: withAlpha('#000000', L.dark ? opacity + 0.15 : opacity), display: 'grid', placeItems: 'center', padding: 14 }}>{children}</div>
}

/* ============================== Sobreposições e alertas ============================== */

function Modais({ v, st }: RP) {
  const { L } = usePv()
  const type = str(v, 'tipo')
  const tone: Tone = type === 'perigo' ? 'error' : type === 'informativo' ? 'info' : 'primary'
  const tc = toneColors(L, tone)
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: L.stage, overflow: 'hidden' }}>
      <Ghost rows={4} />
      <Dim>
        <Card raised pad={16} style={{ width: '100%', maxWidth: 330, background: L.style.surface === 'glass' || L.style.surface === 'aurora' ? L.raised : L.dark || L.style.surface === 'neu' || L.style.surface === 'paper' ? L.surfaceSolid : (L.float.background as string), boxShadow: L.shadowFloat }}>
          <Col gap={10}>
            <Row gap={12} align="flex-start">
              <span style={{ width: 36, height: 36, flex: 'none', borderRadius: L.r >= 999 ? '50%' : Math.min(L.r, 10), background: tc.bg, color: tc.fg, display: 'grid', placeItems: 'center', border: L.style.shadow === 'hard' ? `2px solid ${L.text}` : undefined }}>
                <Ico name={str(v, 'icone')} size={18} part="icon" />
              </span>
              <Col gap={4} style={{ flex: 1 }}>
                <Txt v="h3" part="title">
                  {str(v, 'titulo')}
                </Txt>
                <Txt v="small" part="body" as="p">
                  {str(v, 'texto')}
                </Txt>
              </Col>
              {bool(v, 'fechar') && <Ico name="X" size={17} color={L.muted} />}
            </Row>
            {type === 'formulario' && <Field placeholder="Digite o nome do projeto" size="sm" st="focus" />}
            <Row gap={8} justify="flex-end" wrap>
              <Btn kind="secondary" size="sm" part="secondary">
                {str(v, 'botaoSecundario')}
              </Btn>
              <Btn kind={type === 'perigo' ? 'danger' : 'primary'} size="sm" part="primary" st={st}>
                {str(v, 'botaoPrimario')}
              </Btn>
            </Row>
          </Col>
        </Card>
      </Dim>
    </div>
  )
}

function Popovers({ v, st }: RP) {
  const { L } = usePv()
  const up = str(v, 'posicao') === 'cima'
  const arrow = bool(v, 'seta') && (
    <span style={{ position: 'absolute', [up ? 'bottom' : 'top']: -6, left: 28, width: 12, height: 12, background: L.style.surface === 'glass' || L.style.surface === 'aurora' ? L.raised : L.dark || L.style.surface === 'neu' || L.style.surface === 'paper' ? L.surfaceSolid : (L.float.background as string), transform: 'rotate(45deg)', borderLeft: up ? undefined : (L.float.border as string), borderTop: up ? undefined : (L.float.border as string), borderRight: up ? (L.float.border as string) : undefined, borderBottom: up ? (L.float.border as string) : undefined }} />
  )
  const panel = (
    <Card raised pad={14} style={{ width: 250, position: 'relative', overflow: 'visible', background: L.style.surface === 'glass' || L.style.surface === 'aurora' ? L.raised : L.dark || L.style.surface === 'neu' || L.style.surface === 'paper' ? L.surfaceSolid : (L.float.background as string) }}>
      {arrow}
      <Col gap={8}>
        <Txt v="h3" part="title">
          {str(v, 'titulo')}
        </Txt>
        <Txt v="small" part="body" as="p">
          {str(v, 'texto')}
        </Txt>
        <Field value="nimbo.app/p/8f2k" size="sm" icon="Link" />
        <Btn size="sm" full part="button" icon="Copy" st={st}>
          {str(v, 'botao')}
        </Btn>
      </Col>
    </Card>
  )
  return (
    <Col gap={10} style={{ alignItems: 'flex-start', width: 250 }}>
      {up && panel}
      <Btn kind="secondary" size="sm" icon="Share2" part="trigger" style={{ marginLeft: 6 }}>
        {str(v, 'gatilho')}
      </Btn>
      {!up && panel}
    </Col>
  )
}

function Tooltips({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const up = str(v, 'posicao') !== 'baixo'
  const trig = str(v, 'gatilho')
  const bg = L.dark ? L.text : L.style.surface === 'paper' ? L.text : mix(L.text, '#000000', 0.15)
  const fg = readableOn(bg)
  const tip = (
    <span {...P('tip')} role="tooltip" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: L.r >= 999 ? 999 : Math.min(L.r, 8), background: bg, color: fg, fontFamily: L.font, fontSize: 12.5, fontWeight: 560, whiteSpace: 'nowrap', boxShadow: L.style.shadow === 'hard' ? `3px 3px 0 ${L.accent}` : '0 6px 18px rgba(0,0,0,.18)' }}>
      {str(v, 'texto')}
      {str(v, 'atalho') && <span style={{ fontFamily: L.mono, fontSize: 11, opacity: 0.75 }}>{str(v, 'atalho')}</span>}
      {bool(v, 'seta') && <span style={{ position: 'absolute', left: '50%', [up ? 'bottom' : 'top']: -4, width: 9, height: 9, marginLeft: -4.5, background: bg, transform: 'rotate(45deg)' }} />}
    </span>
  )
  const trigger =
    trig === 'botao' ? (
      <Btn kind="secondary" size="sm" icon="Link" st={st}>
        Compartilhar
      </Btn>
    ) : trig === 'texto' ? (
      <span style={{ ...textStyle(L, 'body'), borderBottom: `1px dashed ${L.muted}` }}>link do projeto</span>
    ) : (
      <span style={withState(L, iconBtnBox(L, 'suave', 'familia', 40), st, 'secondary')}>
        <Ico name="Link" size={18} />
      </span>
    )
  return (
    <Col gap={10} style={{ alignItems: 'center' }}>
      {up && tip}
      {trigger}
      {!up && tip}
    </Col>
  )
}

function Toasts({ v, st }: RP) {
  const { L } = usePv()
  const type = str(v, 'tipo')
  const tone = TONE_OF[type] ?? 'success'
  const tc = toneColors(L, tone)
  const top = str(v, 'posicao') === 'topo'
  const toast = (ghost = false) => (
    <Card raised pad={12} style={{ width: '100%', maxWidth: 320, overflow: 'hidden', ...(ghost ? { transform: `scale(.94) translateY(${top ? 10 : -10}px)`, opacity: 0.55, position: 'absolute', [top ? 'top' : 'bottom']: -14, left: 0, right: 0, margin: '0 auto', zIndex: 0 } : { position: 'relative', zIndex: 1 }), background: L.style.surface === 'glass' || L.style.surface === 'aurora' ? L.raised : L.dark || L.style.surface === 'neu' || L.style.surface === 'paper' ? L.surfaceSolid : (L.float.background as string) }}>
      <Row gap={10} align="flex-start">
        <Ico name={TONE_ICON[type] ?? 'CheckCircle2'} size={19} color={tc.fg} />
        <Col gap={2} style={{ flex: 1 }}>
          <Txt v="body" part={ghost ? undefined : 'title'} style={{ fontWeight: 650 }}>
            {str(v, 'titulo')}
          </Txt>
          <Txt v="small" part={ghost ? undefined : 'body'}>
            {str(v, 'texto')}
          </Txt>
        </Col>
        {str(v, 'acao') && (
          <Btn kind="ghost" size="sm" part={ghost ? undefined : 'action'} st={ghost ? undefined : st} style={{ height: 28, padding: '0 8px' }}>
            {str(v, 'acao')}
          </Btn>
        )}
        {bool(v, 'fechar') && <Ico name="X" size={15} color={L.muted} />}
      </Row>
      {bool(v, 'progresso') && !ghost && <span style={{ position: 'absolute', left: 0, bottom: 0, height: 3, width: '62%', background: tc.fg }} />}
    </Card>
  )
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 320, marginTop: top ? 0 : 14, marginBottom: top ? 14 : 0 }}>
      {toast(true)}
      {toast()}
    </div>
  )
}

function Alertas({ v, st }: RP) {
  const { L } = usePv()
  const type = str(v, 'tipo')
  const tone = TONE_OF[type] ?? 'info'
  const tc = toneColors(L, tone)
  const style = str(v, 'estilo')
  const box: CSSProperties =
    style === 'solido'
      ? { background: tc.fg, color: readableOn(tc.fg), border: 'none' }
      : style === 'contorno'
        ? { background: L.surfaceSolid, color: L.text, border: `1px solid ${tc.fg}` }
        : style === 'barra'
          ? { background: L.surfaceSolid, color: L.text, border: L.card.border, boxShadow: `inset 4px 0 0 ${tc.fg}` }
          : { background: tc.bg, color: L.text, border: 'none' }
  const solid = style === 'solido'
  return (
    <Col gap={10} style={{ width: '100%', maxWidth: 340 }}>
      <div role="alert" style={{ ...box, borderRadius: Math.min(L.rLg, 14), padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start', ...(L.style.shadow === 'hard' ? { border: `2px solid ${L.text}`, boxShadow: `4px 4px 0 ${L.text}${style === 'barra' ? `, inset 4px 0 0 ${tc.fg}` : ''}` } : {}) }}>
        <Ico name={TONE_ICON[type] ?? 'Info'} size={19} color={solid ? 'currentColor' : tc.fg} />
        <Col gap={3} style={{ flex: 1 }}>
          <Txt v="body" part="title" color={solid ? readableOn(tc.fg) : undefined} style={{ fontWeight: 650 }}>
            {str(v, 'titulo')}
          </Txt>
          <Txt v="small" part="body" color={solid ? readableOn(tc.fg) : undefined}>
            {str(v, 'texto')}
          </Txt>
          {str(v, 'acao') && (
            <span data-part="action" style={withState(L, { ...textStyle(L, 'small'), color: solid ? readableOn(tc.fg) : tc.fg, fontWeight: 700, textDecoration: 'underline', marginTop: 4, alignSelf: 'flex-start' }, st, 'plain')}>
              {str(v, 'acao')} →
            </span>
          )}
        </Col>
        {bool(v, 'fechavel') && <Ico name="X" size={15} color={solid ? 'currentColor' : L.muted} />}
      </div>
      <Ghost rows={1} style={{ padding: 0, opacity: 0.6 }} />
    </Col>
  )
}

function Notificacoes({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const unread = num(v, 'naoLidas', 3)
  const items = [
    ['Ana Souza', 'comentou em Proposta Q2', '2 min'],
    ['Bruno Lima', 'atribuiu uma tarefa a você', '1 h'],
    ['Sistema', 'Backup concluído com sucesso', 'ontem'],
  ]
  return (
    <Col gap={8} style={{ width: '100%', maxWidth: 300, alignItems: 'flex-end' }}>
      <span {...P('bell')} style={{ ...iconBtnBox(L, 'suave', 'familia', 36) }}>
        <Ico name="Bell" size={18} />
        {unread > 0 && <span style={{ position: 'absolute', top: -3, right: -3, minWidth: 17, height: 17, borderRadius: 99, background: L.error, color: readableOn(L.error), fontSize: 10.5, fontWeight: 700, display: 'grid', placeItems: 'center', border: `2px solid ${L.surfaceSolid}`, fontFamily: L.font, boxSizing: 'content-box' }}>{unread}</span>}
      </span>
      <Card raised pad={0} style={{ width: '100%', overflow: 'hidden', background: L.style.surface === 'glass' || L.style.surface === 'aurora' ? L.raised : L.dark || L.style.surface === 'neu' || L.style.surface === 'paper' ? L.surfaceSolid : (L.float.background as string) }}>
        <Row justify="space-between" style={{ padding: '10px 12px' }}>
          <Txt v="h3" part="title">
            {str(v, 'titulo')}
          </Txt>
          <span {...P('action')} style={{ ...textStyle(L, 'small'), color: L.primary, fontWeight: 600, fontSize: 11.5 }}>
            {str(v, 'marcarTodas')}
          </span>
        </Row>
        {bool(v, 'abas') && (
          <Row gap={2} style={{ padding: '0 8px', borderBottom: L.divider }}>
            <span style={{ ...navItemStyle(L, true, 'h'), height: 30 }}>Todas</span>
            <span style={{ ...navItemStyle(L, false, 'h'), height: 30 }}>Não lidas {unread > 0 && <Badge tone="primary">{unread}</Badge>}</span>
          </Row>
        )}
        {items.map(([who, what, when], i) => (
          <Row key={who} gap={10} align="flex-start" style={{ padding: '9px 12px', background: i < unread ? (L.dark ? withAlpha(L.accent, 0.07) : mix(L.surfaceSolid, L.primary, 0.04)) : undefined, borderTop: i ? L.divider : undefined }}>
            {bool(v, 'avatares') ? <Avatar name={who} size={28} index={i} /> : <Tile name="Bell" size={28} />}
            <span style={{ flex: 1, ...textStyle(L, 'small'), color: L.text, fontSize: 12.5 }}>
              <strong style={{ fontWeight: 650 }}>{who}</strong> {what}
              <span style={{ display: 'block', color: L.muted, fontSize: 11.5 }}>{when}</span>
            </span>
            {i < unread && <span style={{ width: 8, height: 8, borderRadius: 8, background: L.dark ? L.accent : L.primary, marginTop: 5 }} />}
          </Row>
        ))}
      </Card>
    </Col>
  )
}

function Dots({ size }: { size: number }) {
  const { L } = usePv()
  return (
    <Row gap={size / 3}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="cmp-dot" style={{ width: size / 2.4, height: size / 2.4, borderRadius: L.r >= 4 ? '50%' : 1, background: L.dark ? L.accent : L.primary, animationDelay: `${i * 0.15}s` }} />
      ))}
    </Row>
  )
}

function Carregamentos({ v }: RP) {
  const { L } = usePv()
  const type = str(v, 'tipo')
  const size = { sm: 20, md: 30, lg: 42 }[str(v, 'tamanho') as 'md'] ?? 30
  const indicator =
    type === 'pontos' ? (
      <Dots size={size} />
    ) : type === 'barra' ? (
      <span style={{ display: 'block', width: 180, height: 6, borderRadius: 99, background: L.trackOff, overflow: 'hidden', position: 'relative' }}>
        <span className="cmp-indet" style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', borderRadius: 99, background: L.style.fill === 'solid' ? L.trackOn : L.fill }} />
      </span>
    ) : (
      <Spinner size={size} />
    )
  const label = (
    <Txt v="small" part="label">
      {str(v, 'texto')}
    </Txt>
  )
  if (type === 'pagina')
    return (
      <Col gap={14} style={{ alignItems: 'center' }}>
        <Tile name="Sparkles" size={48} treatment={L.style.iconTreatment === 'plain' ? 'app-tile' : undefined} />
        <Spinner size={size} />
        {label}
      </Col>
    )
  if (bool(v, 'overlay'))
    return (
      <Card style={{ width: '100%', maxWidth: 280, height: 170, position: 'relative', overflow: 'hidden' }}>
        <Ghost rows={3} style={{ padding: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: withAlpha(L.surfaceSolid, 0.75), display: 'grid', placeItems: 'center', alignContent: 'center', gap: 10, backdropFilter: 'blur(2px)' }}>
          {indicator}
          {label}
        </div>
      </Card>
    )
  return (
    <Col gap={14} style={{ alignItems: 'center' }}>
      {indicator}
      {label}
    </Col>
  )
}

function CommandPalette({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const focus = num(v, 'destacado', 1) - 1
  const groups: [string, [string, string, string][]][] = [
    ['Navegação', [['LayoutDashboard', 'Ir para o painel', 'G D'], ['FolderOpen', 'Abrir projetos', 'G P']]],
    ['Ações', [['Plus', 'Criar tarefa', 'C'], ['UserPlus', 'Convidar pessoa', 'I'], ['Moon', 'Alternar tema', '⇧T']]],
  ]
  let idx = -1
  return (
    <Card raised pad={0} style={{ width: '100%', maxWidth: 340, overflow: 'hidden', background: L.style.surface === 'glass' || L.style.surface === 'aurora' ? L.raised : L.dark || L.style.surface === 'neu' || L.style.surface === 'paper' ? L.surfaceSolid : (L.float.background as string) }}>
      <Row {...P('field')} gap={10} style={{ padding: '0 14px', height: 46, borderBottom: L.divider }}>
        <Ico name="Search" size={17} color={L.muted} />
        <span style={{ flex: 1, ...textStyle(L, 'body'), color: L.faint, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{str(v, 'placeholder')}</span>
        <Kbd>Esc</Kbd>
      </Row>
      <div style={{ padding: 6 }}>
        {groups.map(([g, items]) => (
          <div key={g}>
            {bool(v, 'grupos') && <div style={{ ...textStyle(L, 'caption'), padding: '6px 10px 4px' }}>{g}</div>}
            {items.map(([ic, label, key]) => {
              idx += 1
              const on = idx === focus
              return (
                <Row key={label} gap={10} style={withState(L, { height: 32, padding: '0 10px', borderRadius: L.r >= 999 ? 999 : Math.min(L.r, 8), background: on ? L.soft : undefined, color: on ? L.onSoft : L.text, fontFamily: L.font, fontSize: L.fs - 0.5 }, on ? st : undefined, 'ghost')}>
                  <Ico name={ic} size={16} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {bool(v, 'atalhos') && <Kbd>{key}</Kbd>}
                </Row>
              )
            })}
          </div>
        ))}
      </div>
      {bool(v, 'rodape') && (
        <Row gap={12} style={{ padding: '8px 14px', borderTop: L.divider, ...textStyle(L, 'caption'), textTransform: 'none' }}>
          <Row gap={4}>
            <Kbd>↑↓</Kbd> navegar
          </Row>
          <Row gap={4}>
            <Kbd>↵</Kbd> abrir
          </Row>
        </Row>
      )}
    </Card>
  )
}

/* ============================== Páginas e experiências ============================== */

function Dashboard({ v, st }: RP) {
  const { L } = usePv()
  const n = Math.max(2, Math.min(4, num(v, 'kpis', 3)))
  const kpis = [
    ['Receita', 'R$ 48 mil', '+12%'],
    ['Pedidos', '1.284', '+8%'],
    ['Clientes', '312', '+3%'],
    ['Ticket', 'R$ 37', '−2%'],
  ].slice(0, n)
  const bars = [40, 62, 48, 74, 58, 86, 66]
  const c1 = L.style.fill === 'solid' || L.style.fill === 'press' ? L.trackOn : L.dark ? L.accent : L.fill
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: L.style.backdrop === 'plain' ? (L.dark ? L.bg : mix(L.bg, L.text, 0.025)) : L.stage }}>
      {bool(v, 'sidebar') && (
        <aside style={{ width: 46, flex: 'none', ...L.card, borderRadius: 0, border: 'none', borderRight: L.divider, boxShadow: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 0' }}>
          <Tile name="Sparkles" size={26} treatment={L.style.iconTreatment === 'plain' ? 'app-tile' : undefined} />
          {['LayoutDashboard', 'BarChart3', 'Users', 'Settings'].map((ic, i) => (
            <span key={ic} style={{ ...navItemStyle(L, i === 0, 'v'), width: 34, height: 34, padding: 0, justifyContent: 'center' }}>
              <Ico name={ic} size={17} />
            </span>
          ))}
        </aside>
      )}
      <Col gap={10} style={{ flex: 1, padding: 12, overflow: 'hidden' }}>
        <Row justify="space-between">
          <Txt v="h2" part="title">
            {str(v, 'titulo')}
          </Txt>
          <Btn size="sm" kind="secondary" icon="Calendar" st={st}>
            <span className="cmp-wide-only">Março</span>
          </Btn>
        </Row>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, gap: 8 }}>
          {kpis.map(([l, val, d], i) => (
            <Card key={l} pad={9} style={{ minWidth: 0 }}>
              <span style={{ ...textStyle(L, 'caption'), display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l}</span>
              <span style={{ ...textStyle(L, 'h3'), display: 'block', fontSize: L.fs + 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontVariantNumeric: 'tabular-nums' }}>{val}</span>
              <span style={{ fontFamily: L.font, fontSize: 11.5, fontWeight: 650, color: d.startsWith('−') ? L.error : L.success }}>{d}</span>
              {i === 0 && <span style={{ display: 'none' }} />}
            </Card>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: bool(v, 'lista') ? 'minmax(0, 1.6fr) minmax(0, 1fr)' : '1fr', gap: 8, flex: 1, minHeight: 0 }} className="cmp-dash-grid">
          <Card pad={10} style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>
            <span style={{ ...textStyle(L, 'label'), fontSize: 12 }}>Vendas</span>
            {str(v, 'grafico') === 'linha' ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                <Sparkline height={70} width={240} />
              </div>
            ) : (
              <Row gap={5} align="flex-end" style={{ flex: 1, minHeight: 50 }}>
                {bars.map((b, i) => (
                  <span key={i} style={{ flex: 1, height: `${b}%`, borderRadius: Math.min(L.rSm, 4), background: i === 5 ? c1 : L.dark ? withAlpha(L.text, 0.15) : mix(L.surfaceSolid, L.text, 0.1) }} />
                ))}
              </Row>
            )}
          </Card>
          {bool(v, 'lista') && (
            <Card pad={10} style={{ display: 'grid', gap: 7, alignContent: 'start' }} >
              <span style={{ ...textStyle(L, 'label'), fontSize: 12 }}>Atividade</span>
              {['Ana', 'Bruno', 'Carla'].map((p, i) => (
                <Row key={p} gap={6}>
                  <Avatar name={p} size={20} index={i} />
                  <Skel w="70%" h={8} style={{ animation: 'none' }} />
                </Row>
              ))}
            </Card>
          )}
        </div>
      </Col>
    </div>
  )
}

function Login({ v, st }: RP) {
  const { L } = usePv()
  const split = str(v, 'layout') === 'dividido'
  const form = (
    <Col gap={9} style={{ width: '100%' }}>
      <Row gap={8} data-part="logo">
        <Tile name="Sparkles" size={24} treatment={L.style.iconTreatment === 'plain' ? 'app-tile' : undefined} />
        <span style={{ ...textStyle(L, 'h3'), fontSize: L.fs }}>{str(v, 'marca')}</span>
      </Row>
      <Txt v="h2" part="title">
        {str(v, 'titulo')}
      </Txt>
      <Field placeholder="E-mail" icon="Mail" size="sm" value="ana@empresa.com" />
      <Field placeholder="Senha" icon="Lock" size="sm" value="••••••••" st={st === 'normal' ? undefined : st === 'disabled' ? undefined : st} trailing={<Ico name="Eye" size={15} color={L.muted} />} />
      {bool(v, 'lembrar') && (
        <Row justify="space-between" style={{ ...textStyle(L, 'small'), fontSize: 11.5 }}>
          <Row gap={6}>
            <Check on size={14} /> Lembrar
          </Row>
          <span style={{ color: L.primary, fontWeight: 600 }}>Esqueci a senha</span>
        </Row>
      )}
      <Btn full size="sm" part="button" st={st === 'disabled' ? 'disabled' : undefined}>
        {str(v, 'botao')}
      </Btn>
      {bool(v, 'social') && (
        <Row gap={8}>
          <Btn kind="secondary" size="sm" style={{ flex: 1 }}>
            <span style={{ fontWeight: 800 }}>G</span>&nbsp;Google
          </Btn>
          <Btn kind="secondary" size="sm" style={{ flex: 1 }} icon="Smartphone">
            Apple
          </Btn>
        </Row>
      )}
    </Col>
  )
  return (
    <div style={{ width: '100%', height: '100%', background: L.stage, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: split ? 0 : 10, boxSizing: 'border-box' }}>
      {split ? (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          <div className="cmp-wide-only" style={{ flex: '0 0 42%', background: L.style.fill === 'solid' || L.style.fill === 'press' ? L.trackOn : L.fill, color: L.onFill, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6 }}>
            <Ico name="Sparkles" size={22} />
            <span style={{ fontFamily: L.headingFont, fontWeight: L.hw, fontSize: 17, lineHeight: 1.2 }}>Tudo da sua equipe, em um só lugar.</span>
          </div>
          <div style={{ flex: 1, background: L.dark ? L.bg : L.surfaceSolid, padding: 16, display: 'flex', alignItems: 'center', minWidth: 0 }}>{form}</div>
        </div>
      ) : (
        <Card pad={16} style={{ width: '100%', maxWidth: 270 }}>
          {form}
        </Card>
      )}
    </div>
  )
}

function Onboarding({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const total = Math.max(2, num(v, 'totalPassos', 3))
  const step = Math.max(1, Math.min(total, num(v, 'passo', 2)))
  const opts: [string, string][] = [
    ['User', 'Só eu'],
    ['Users', '2 a 10'],
    ['Building2', '11 a 50'],
    ['Globe', 'Mais de 50'],
  ]
  return (
    <div style={{ width: '100%', height: '100%', background: L.stage, display: 'grid', placeItems: 'center', padding: 10, boxSizing: 'border-box' }}>
      <Card pad={16} style={{ width: '100%', maxWidth: 320 }}>
        <Col gap={10}>
          {bool(v, 'progresso') && (
            <Col gap={6}>
              <Over>
                Etapa {step} de {total}
              </Over>
              <Bar value={(step / total) * 100} height={5} />
            </Col>
          )}
          <Txt v="h2" part="title">
            {str(v, 'titulo')}
          </Txt>
          <div {...P('options')} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
            {opts.map(([ic, t], i) => (
              <div key={t} style={{ ...L.card, borderRadius: Math.min(L.rLg, 14), padding: 10, display: 'flex', alignItems: 'center', gap: 8, boxShadow: i === 1 ? `0 0 0 2px ${L.dark ? L.accent : L.trackOn}` : L.style.shadow === 'neu' ? L.shadow : 'none', background: i === 1 ? L.soft : L.card.background }}>
                <Ico name={ic} size={16} color={i === 1 ? L.onSoft : L.muted} />
                <span style={{ ...textStyle(L, 'body'), fontSize: 12.5, fontWeight: i === 1 ? 650 : 500, color: i === 1 ? L.onSoft : L.text }}>{t}</span>
              </div>
            ))}
          </div>
          <Row justify="space-between" style={{ marginTop: 2 }}>
            <Btn kind="ghost" size="sm" icon="ArrowLeft">
              Voltar
            </Btn>
            <Btn size="sm" iconRight="ArrowRight" part="button" st={st}>
              {str(v, 'botao')}
            </Btn>
          </Row>
        </Col>
      </Card>
    </div>
  )
}

function Detalhes({ v, st }: RP) {
  const { L } = usePv()
  return (
    <div style={{ width: '100%', height: '100%', background: L.dark ? L.bg : L.style.backdrop === 'plain' ? L.surfaceSolid : L.stage, padding: 12, boxSizing: 'border-box', overflow: 'hidden' }}>
      <Row gap={4} style={{ ...textStyle(L, 'small'), fontSize: 11.5, marginBottom: 8 }}>
        Loja <Ico name="ChevronRight" size={12} /> Corrida <Ico name="ChevronRight" size={12} /> <span style={{ color: L.text }}>Tênis</span>
      </Row>
      <div className="cmp-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: 12 }}>
        <Col gap={6}>
          <div style={{ borderRadius: Math.min(L.rLg, 16), overflow: 'hidden', border: L.card.border }}>
            <Media icon="ShoppingBag" height={104} />
          </div>
          {bool(v, 'galeria') && (
            <Row gap={5}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ flex: 1, height: 26, borderRadius: Math.min(L.rSm, 6), background: i === 0 ? L.soft : L.dark ? withAlpha(L.text, 0.08) : L.surfaceAlt, boxShadow: i === 0 ? `0 0 0 1.5px ${L.trackOn}` : undefined }} />
              ))}
            </Row>
          )}
        </Col>
        <Col gap={6}>
          <span>
            <Badge tone="success" part="badge">
              {str(v, 'status')}
            </Badge>
          </span>
          <Txt v="h3" part="title" style={{ fontSize: L.fs + 1 }}>
            {str(v, 'titulo')}
          </Txt>
          <Row gap={2}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Ico key={i} name="Star" size={12} color={L.warning} filled={i < 4} />
            ))}
            <span style={{ ...textStyle(L, 'small'), fontSize: 11.5, marginLeft: 4 }}>128</span>
          </Row>
          <Txt v="h2" part="price" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {str(v, 'preco')}
          </Txt>
          <Btn size="sm" full part="button" icon="ShoppingCart" st={st}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{str(v, 'botao')}</span>
          </Btn>
        </Col>
      </div>
      {bool(v, 'abas') && (
        <Row gap={2} style={{ marginTop: 10, borderBottom: L.divider }}>
          {['Descrição', 'Medidas', 'Avaliações'].map((t, i) => (
            <span key={t} style={{ ...navItemStyle(L, i === 0, 'h'), height: 28 }}>
              {t}
            </span>
          ))}
        </Row>
      )}
    </div>
  )
}

function Perfil({ v, st }: RP) {
  const { L } = usePv()
  const coverBg = L.style.fill === 'gradient' || L.style.fill === 'aurora' || L.style.fill === 'metal' ? L.fill : L.dark ? `linear-gradient(120deg, ${withAlpha(L.accent, 0.35)}, ${withAlpha(L.primary, 0.15)})` : `linear-gradient(120deg, ${L.soft}, ${mix(L.surfaceSolid, L.accent, 0.3)})`
  return (
    <div style={{ width: '100%', height: '100%', background: L.stage, padding: 10, boxSizing: 'border-box' }}>
      <Card pad={0} style={{ overflow: 'hidden' }}>
        {bool(v, 'capa') && <div style={{ height: 58, background: coverBg }} />}
        <Col gap={8} style={{ padding: '0 14px 12px' }}>
          <Row justify="space-between" align="flex-end" style={{ marginTop: bool(v, 'capa') ? -24 : 12 }}>
            <span style={{ borderRadius: '50%', boxShadow: `0 0 0 3px ${L.surfaceSolid}`, display: 'inline-flex' }}>
              <Avatar name={str(v, 'nome')} size={52} part="avatar" />
            </span>
            <Btn size="sm" part="button" icon="UserPlus" st={st}>
              {str(v, 'botao')}
            </Btn>
          </Row>
          <Col gap={0}>
            <Txt v="h3" part="name">
              {str(v, 'nome')}
            </Txt>
            <Txt v="small" part="role">
              {str(v, 'cargo')}
            </Txt>
          </Col>
          {bool(v, 'estatisticas') && (
            <Row gap={0} style={{ borderTop: L.divider, borderBottom: bool(v, 'abas') ? undefined : L.divider, padding: '8px 0' }}>
              {[
                ['128', 'Projetos'],
                ['4,2 mil', 'Seguidores'],
                ['312', 'Seguindo'],
              ].map(([n, l]) => (
                <Col key={l} gap={0} style={{ flex: 1, alignItems: 'center' }}>
                  <span style={{ ...textStyle(L, 'h3'), fontVariantNumeric: 'tabular-nums' }}>{n}</span>
                  <span style={{ ...textStyle(L, 'small'), fontSize: 11.5 }}>{l}</span>
                </Col>
              ))}
            </Row>
          )}
          {bool(v, 'abas') && (
            <Row gap={2} style={{ borderBottom: L.divider }}>
              {['Projetos', 'Atividade', 'Sobre'].map((t, i) => (
                <span key={t} style={{ ...navItemStyle(L, i === 0, 'h'), height: 28 }}>
                  {t}
                </span>
              ))}
            </Row>
          )}
        </Col>
      </Card>
    </div>
  )
}

function Configuracoes({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const secs = lines(v, 'secoes')
  const active = num(v, 'ativa', 1) - 1
  const side = str(v, 'layout') === 'lateral'
  const nav = side ? (
    <Col gap={3} style={{ width: 104, flex: 'none' }}>
      {secs.slice(0, 5).map((s, i) => (
        <span key={s + i} style={{ ...navItemStyle(L, i === active, 'v'), height: 30 }}>
          {s}
        </span>
      ))}
    </Col>
  ) : (
    <Row gap={2} style={{ borderBottom: L.divider, overflow: 'hidden' }}>
      {secs.slice(0, 4).map((s, i) => (
        <span key={s + i} style={{ ...navItemStyle(L, i === active, 'h'), height: 30 }}>
          {s}
        </span>
      ))}
    </Row>
  )
  const rows: [string, string, boolean][] = [
    ['E-mails de resumo', 'Toda segunda-feira', true],
    ['Alertas no celular', 'Menções e prazos', false],
  ]
  return (
    <div style={{ width: '100%', height: '100%', background: L.dark ? L.bg : L.stage, padding: 12, boxSizing: 'border-box', overflow: 'hidden' }}>
      <Txt v="h2" part="title" style={{ marginBottom: 10, display: 'block' }}>
        {str(v, 'titulo')}
      </Txt>
      <div {...P('sections')} style={{ display: 'flex', flexDirection: side ? 'row' : 'column', gap: 10 }}>
        {nav}
        <Col gap={8} style={{ flex: 1 }}>
          <Card pad={10}>
            <Col gap={8}>
              {rows.map(([t, d, on], i) => (
                <div key={t}>
                  {i > 0 && <Divider style={{ marginBottom: 8 }} />}
                  <Row gap={8} justify="space-between">
                    <Col gap={0} style={{ minWidth: 0 }}>
                      <span style={{ ...textStyle(L, 'body'), fontSize: 12.5, fontWeight: 600 }}>{t}</span>
                      <span style={{ ...textStyle(L, 'small'), fontSize: 11.5 }}>{d}</span>
                    </Col>
                    <Toggle on={on} size="sm" st={i === 0 ? st : undefined} />
                  </Row>
                </div>
              ))}
            </Col>
          </Card>
          {bool(v, 'perigo') && (
            <div style={{ borderRadius: Math.min(L.rLg, 14), border: `1px solid ${withAlpha(L.error, 0.5)}`, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: L.dark ? withAlpha(L.error, 0.06) : mix(L.surfaceSolid, L.error, 0.03) }}>
              <span style={{ ...textStyle(L, 'small'), color: L.error, fontWeight: 650, fontSize: 12 }}>Excluir conta</span>
              <Btn kind="danger" size="sm" style={{ height: 28 }}>
                Excluir
              </Btn>
            </div>
          )}
        </Col>
      </div>
    </div>
  )
}

function LayoutsMobile({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const navType = str(v, 'navegacao')
  const items = lines(v, 'itens').slice(0, 5)
  const active = num(v, 'ativa', 1) - 1
  const icons = ['Home', 'Search', 'ShoppingBag', 'User', 'Settings']
  const phoneBg = L.dark ? L.bg : L.style.surface === 'neu' ? L.surfaceSolid : L.style.surface === 'paper' ? L.bg : mix(L.bg, L.text, L.style.backdrop === 'alt' ? 0.035 : 0.015)
  const navItem = (it: string, i: number) => {
    const on = i === active
    const ind = L.style.indicator
    return (
      <span key={it + i} style={{ flex: 1, display: 'grid', justifyItems: 'center', gap: 2, color: on ? (L.dark ? L.accent : L.primary) : L.muted, fontFamily: L.font, fontSize: 11, fontWeight: on ? 650 : 500 }}>
        <span style={withState(L, { display: 'grid', placeItems: 'center', width: 40, height: 26, borderRadius: 99, ...(on && (ind === 'tonal' || ind === 'pill' || ind === 'glow') ? { background: L.soft, color: L.onSoft } : on && ind === 'block' ? { background: L.text, color: L.bg, borderRadius: 6 } : on && ind === 'inset' ? { boxShadow: L.inset } : {}) }, on ? st : undefined, 'plain')}>
          <Ico name={icons[i % icons.length]} size={17} filled={on && L.style.iconTreatment === 'circle'} />
        </span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', whiteSpace: 'nowrap' }}>{it}</span>
        {on && ind === 'underline' && <span style={{ width: 16, height: 2, background: 'currentColor', borderRadius: 2 }} />}
      </span>
    )
  }
  return (
    <div style={{ width: '100%', height: '100%', background: L.style.backdrop === 'plain' ? mix(L.bg, L.text, 0.04) : L.stage, display: 'grid', placeItems: 'center', padding: '10px 0', boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: 200, height: 262, borderRadius: 28, background: phoneBg, border: `5px solid ${L.dark ? mix(L.bg, '#ffffff', 0.15) : '#1b1b20'}`, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,.18)', display: 'flex', flexDirection: 'column' }}>
        <Row justify="space-between" style={{ padding: '6px 14px 0', fontFamily: L.font, fontSize: 11, fontWeight: 650, color: L.text }}>
          <span>9:41</span>
          <span style={{ width: 40, height: 10, borderRadius: 8, background: L.dark ? mix(L.bg, '#ffffff', 0.15) : '#1b1b20' }} />
          <Ico name="Wifi" size={11} />
        </Row>
        <Row justify="space-between" style={{ padding: '8px 12px' }}>
          {navType === 'topbar' && <Ico name="Menu" size={17} color={L.text} />}
          <Txt v="h3" part="title" style={{ fontSize: L.fs + 1 }}>
            {str(v, 'titulo')}
          </Txt>
          <Ico name="Bell" size={16} color={L.muted} />
        </Row>
        {navType === 'abas' && (
          <Row gap={0} style={{ padding: '0 8px', borderBottom: L.divider }} {...P('nav')}>
            {items.slice(0, 3).map((it, i) => (
              <span key={it} style={{ ...navItemStyle(L, i === active, 'h'), height: 28, padding: '0 8px', fontSize: 11.5 }}>
                {it}
              </span>
            ))}
          </Row>
        )}
        <Col gap={8} style={{ padding: '4px 12px', flex: 1, minHeight: 0 }}>
          <Card pad={10} style={{ display: 'grid', gap: 6 }}>
            <Skel w="60%" h={9} style={{ animation: 'none' }} />
            <Skel w="85%" h={7} style={{ animation: 'none' }} />
          </Card>
          <Row gap={8}>
            <Card pad={10} style={{ flex: 1, height: 44 }}>
              <Skel w="70%" h={7} style={{ animation: 'none' }} />
            </Card>
            <Card pad={10} style={{ flex: 1, height: 44 }}>
              <Skel w="50%" h={7} style={{ animation: 'none' }} />
            </Card>
          </Row>
        </Col>
        {bool(v, 'fab') && (
          <span style={{ position: 'absolute', right: 12, bottom: navType === 'bottom-nav' || navType === 'dock' ? 66 : 14, width: 40, height: 40, borderRadius: L.familyId === 'modern-material' ? 12 : L.r >= 10 ? '50%' : L.r, background: L.fill, color: L.onFill, display: 'grid', placeItems: 'center', boxShadow: L.btnShadow !== 'none' ? L.btnShadow : '0 6px 14px rgba(0,0,0,.2)', border: L.btnBorder }}>
            <Ico name="Plus" size={19} />
          </span>
        )}
        {navType === 'bottom-nav' && (
          <Row {...P('nav')} gap={0} style={{ padding: '6px 4px 10px', borderTop: L.divider, background: L.dark ? mix(L.bg, '#ffffff', 0.04) : L.style.surface === 'glass' ? withAlpha('#ffffff', 0.7) : L.surfaceSolid }}>
            {items.map(navItem)}
          </Row>
        )}
        {navType === 'dock' && (
          <Row {...P('nav')} gap={0} style={{ margin: '0 10px 10px', padding: '6px 2px', borderRadius: Math.min(L.rLg, 22), ...L.float }}>
            {items.map(navItem)}
          </Row>
        )}
      </div>
    </div>
  )
}

function Hero({ v, st }: RP) {
  const { L } = usePv()
  const split = str(v, 'layout') === 'dividido'
  const media = bool(v, 'midia')
  const text = (
    <Col gap={10} style={{ alignItems: split ? 'flex-start' : 'center', textAlign: split ? 'left' : 'center', flex: 1, minWidth: 0 }}>
      {str(v, 'selo') && (
        <span>
          <Badge tone="primary" part="badge">
            {str(v, 'selo')}
          </Badge>
        </span>
      )}
      <Txt v="display" part="title" as="div" style={{ fontSize: split ? 24 : 27, lineHeight: 1.08 }}>
        {str(v, 'titulo')}
      </Txt>
      <Txt v="small" part="body" as="p" style={{ fontSize: L.fs - 0.5, maxWidth: 300 }}>
        {str(v, 'subtitulo')}
      </Txt>
      <Row gap={8} wrap justify={split ? 'flex-start' : 'center'}>
        <Btn size="sm" part="cta" st={st} iconRight="ArrowRight">
          {str(v, 'cta')}
        </Btn>
        {str(v, 'ctaSecundario') && (
          <Btn size="sm" kind="secondary" part="secondary" icon="Play">
            {str(v, 'ctaSecundario')}
          </Btn>
        )}
      </Row>
    </Col>
  )
  const mock = media && (
    <div style={{ ...L.card, borderRadius: Math.min(L.rLg, 14), overflow: 'hidden', width: split ? 130 : '86%', flex: 'none', alignSelf: split ? 'center' : undefined, boxShadow: L.shadowFloat }} className={split ? 'cmp-wide-only' : undefined}>
      <Row gap={4} style={{ padding: '6px 8px', borderBottom: L.divider }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 6, height: 6, borderRadius: 6, background: L.faint }} />
        ))}
      </Row>
      <Media icon="LayoutDashboard" height={split ? 92 : 70} />
    </div>
  )
  return (
    <div style={{ width: '100%', height: '100%', background: L.stage, padding: '18px 16px 0', boxSizing: 'border-box', overflow: 'hidden', display: 'flex', flexDirection: split ? 'row' : 'column', alignItems: split ? 'center' : 'center', gap: 14 }}>
      {text}
      {mock}
    </div>
  )
}

function Pricing({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const n = Math.max(2, Math.min(3, num(v, 'planos', 3)))
  const hi = num(v, 'destaque', 2) - 1
  const annual = str(v, 'periodo') === 'anual'
  const plans: [string, number, string[]][] = [
    ['Básico', 29, ['3 projetos', 'Suporte por e-mail']],
    ['Pro', 79, ['Projetos ilimitados', 'Relatórios']],
    ['Equipe', 149, ['Tudo do Pro', 'SSO e auditoria']],
  ]
  return (
    <div style={{ width: '100%', height: '100%', background: L.stage, padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ display: 'inline-flex', padding: 3, borderRadius: L.r >= 999 ? 999 : L.r, background: L.dark ? withAlpha(L.text, 0.08) : mix(L.surfaceSolid, L.text, 0.06), gap: 2 }}>
        {['Mensal', 'Anual −20%'].map((t, i) => (
          <span key={t} style={{ padding: '4px 10px', borderRadius: L.r >= 999 ? 999 : Math.max(0, L.r - 2), fontFamily: L.font, fontSize: 11.5, fontWeight: 600, color: (i === 1) === annual ? L.text : L.muted, background: (i === 1) === annual ? (L.dark ? withAlpha(L.accent, 0.2) : L.surfaceSolid) : undefined, boxShadow: (i === 1) === annual && !L.dark ? '0 1px 2px rgba(0,0,0,.12)' : undefined }}>
            {t}
          </span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, gap: 8, width: '100%', alignItems: 'stretch' }}>
        {plans.slice(0, n).map(([name, price, feats], i) => {
          const on = i === hi
          return (
            <Card key={name} pad={10} style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', overflow: 'visible', ...(on ? { boxShadow: `${L.shadow !== 'none' ? `${L.shadow}, ` : ''}0 0 0 2px ${L.dark ? L.accent : L.trackOn}` } : {}) }}>
              {on && (
                <span {...P('badge')} style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                  <Badge tone="primary" variant="solid" shape="pilula" style={{ height: 19, fontSize: 10.5, padding: '0 7px', background: L.dark ? L.accent : L.trackOn, color: readableOn(L.dark ? L.accent : L.trackOn) }}>
                    {str(v, 'seloDestaque')}
                  </Badge>
                </span>
              )}
              <span style={{ ...textStyle(L, 'label'), fontSize: 12, marginTop: on ? 4 : 0 }}>{name}</span>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 2, whiteSpace: 'nowrap', minWidth: 0 }}>
                <span style={{ ...textStyle(L, 'small'), fontSize: 11 }}>R$</span>
                <span style={{ ...textStyle(L, 'h2'), fontVariantNumeric: 'tabular-nums' }}>{annual ? Math.round(price * 0.8) : price}</span>
                <span style={{ ...textStyle(L, 'small'), fontSize: 11 }}>/mês</span>
              </span>
              {bool(v, 'recursos') &&
                feats.map((f) => (
                  <Row key={f} gap={4} align="flex-start" style={{ ...textStyle(L, 'small'), fontSize: 11.5, color: L.text, lineHeight: 1.3 }}>
                    <Ico name="Check" size={12} color={L.success} style={{ marginTop: 1 }} /> {f}
                  </Row>
                ))}
              <Btn size="sm" kind={on ? 'primary' : 'secondary'} full part="button" st={on ? st : undefined} style={{ marginTop: 'auto', height: 30, padding: '0 6px', fontSize: L.upper ? 10.5 : 12, letterSpacing: L.upper ? '0.03em' : undefined }}>
                {str(v, 'botao')}
              </Btn>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export const PAGE_RENDERERS: RendererMap = {
  modais: { render: Modais, frame: 'fill' },
  popovers: { render: Popovers },
  tooltips: { render: Tooltips },
  toasts: { render: Toasts },
  alertas: { render: Alertas },
  notificacoes: { render: Notificacoes, frame: 'top' },
  carregamentos: { render: Carregamentos },
  'command-palette': { render: CommandPalette },
  dashboard: { render: Dashboard, frame: 'fill' },
  login: { render: Login, frame: 'fill' },
  'cadastro-onboarding': { render: Onboarding, frame: 'fill' },
  'paginas-detalhes': { render: Detalhes, frame: 'fill' },
  'perfil-usuario': { render: Perfil, frame: 'fill' },
  configuracoes: { render: Configuracoes, frame: 'fill' },
  'layouts-mobile': { render: LayoutsMobile, frame: 'fill' },
  'hero-sections': { render: Hero, frame: 'fill' },
  'pricing-planos': { render: Pricing, frame: 'fill' },
}
