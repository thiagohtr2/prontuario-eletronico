import type { CSSProperties } from 'react'
import { mix, withAlpha } from '@/core/color'
import {
  Badge, Bar, Btn, Card, Check, Col, Divider, Field, Ico, Kbd, Label, Over, Row, Spinner, Tile, Toggle, Txt,
  bool, fieldBox, hexOr, lines, num, str, textStyle, usePart, usePv, withState,
} from './kit'
import type { RP, RendererMap } from './render-types'

/* ============================== Estilo e fundamentos ============================== */

function Tipografia({ v }: RP) {
  const { L } = usePv()
  const ratio = ({ compacta: 1.2, equilibrada: 1.25, expressiva: 1.333 } as Record<string, number>)[str(v, 'escala')] ?? 1.25
  const center = str(v, 'alinhamento') === 'centro'
  const sizes = [0, 1, 2, 3].map((i) => Math.round(L.fs * ratio ** i))
  return (
    <Col gap={8} style={{ textAlign: center ? 'center' : 'left', alignItems: center ? 'center' : 'flex-start', maxWidth: 320 }}>
      <Over part="overline">{str(v, 'sobretitulo')}</Over>
      <Txt v="h1" part="title" as="div" style={{ fontSize: Math.min(30, sizes[3]) }}>
        {str(v, 'titulo')}
      </Txt>
      <Txt v="body" part="body" as="p" color={L.muted} style={{ fontSize: Math.max(12.5, L.fs - 0.5) }}>
        {str(v, 'texto')}
      </Txt>
      {bool(v, 'mostrarEscala') && (
        <Row gap={14} align="baseline" justify={center ? 'center' : 'flex-start'} style={{ borderTop: L.divider, paddingTop: 10, width: '100%' }}>
          {[...sizes].reverse().map((s, i) => (
            <span key={i} style={{ fontFamily: i < 2 ? L.headingFont : L.font, fontWeight: i < 2 ? L.hw : 450, fontSize: s, color: L.text, lineHeight: 1 }}>
              Aa<span style={{ ...textStyle(L, 'caption'), marginLeft: 3 }}>{s}</span>
            </span>
          ))}
        </Row>
      )}
    </Col>
  )
}

function Paletas({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const fmt = str(v, 'formato')
  const names = bool(v, 'mostrarNomes')
  const brand = [
    { n: 'Primária', c: L.fill },
    { n: 'Destaque', c: L.accent },
    { n: 'Secundária', c: L.secondary },
    { n: 'Superfície', c: L.surfaceSolid },
    { n: 'Texto', c: L.text },
  ]
  const sw = (c: string, i: number): CSSProperties =>
    fmt === 'circulos'
      ? { width: 40, height: 40, borderRadius: '50%', background: c, boxShadow: `inset 0 0 0 1px ${withAlpha(L.text, 0.12)}` }
      : fmt === 'cartoes'
        ? { width: '100%', height: 38, borderRadius: Math.min(L.rLg, 10), background: c, boxShadow: `inset 0 0 0 1px ${withAlpha(L.text, 0.1)}` }
        : { flex: 1, height: 64, background: c, borderRadius: i === 0 ? `${Math.min(L.rLg, 12)}px 0 0 ${Math.min(L.rLg, 12)}px` : i === 4 ? `0 ${Math.min(L.rLg, 12)}px ${Math.min(L.rLg, 12)}px 0` : 0 }
  return (
    <Col gap={12} style={{ width: '100%', maxWidth: 320 }}>
      <Txt v="h3" part="title">
        {str(v, 'titulo')}
      </Txt>
      {fmt === 'faixas' ? (
        <div>
          <div style={{ display: 'flex', boxShadow: `0 0 0 1px ${withAlpha(L.text, 0.1)}`, borderRadius: Math.min(L.rLg, 12) }}>
            {brand.map((b, i) => (
              <span key={b.n} {...P('swatch')} style={sw(b.c, i)} />
            ))}
          </div>
          {names && (
            <div style={{ display: 'flex', marginTop: 6 }}>
              {brand.map((b) => (
                <span key={b.n} style={{ flex: 1, ...textStyle(L, 'caption'), textAlign: 'center' }}>
                  {b.n}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(5, minmax(0, 1fr))`, gap: 8, justifyItems: 'center' }}>
          {brand.map((b, i) => (
            <div key={b.n} style={{ display: 'grid', gap: 5, justifyItems: 'center', width: '100%' }}>
              <span {...P('swatch')} style={sw(b.c, i)} />
              {names && <span style={{ ...textStyle(L, 'caption'), fontSize: 11 }}>{b.n}</span>}
            </div>
          ))}
        </div>
      )}
      {bool(v, 'mostrarSemanticas') && (
        <Row gap={6} wrap>
          {['Sucesso', 'Aviso', 'Erro', 'Info'].map((n, i) => (
            <Badge key={n} tone={(['success', 'warning', 'error', 'info'] as const)[i]} variant="dot">
              {n}
            </Badge>
          ))}
        </Row>
      )}
    </Col>
  )
}

function Espacamentos({ v }: RP) {
  const { L } = usePv()
  const base = Number(str(v, 'base')) || 4
  const scale = base === 8 ? [8, 16, 24, 32, 40, 48] : [4, 8, 12, 16, 24, 32]
  const color = L.style.fill === 'solid' || L.style.fill === 'ivory' || L.style.fill === 'press' ? L.trackOn : L.fill
  return (
    <Row gap={18} align="center" style={{ width: '100%', maxWidth: 330 }}>
      <Col gap={7} style={{ flex: 1 }}>
        <Txt v="h3" part="title">
          {str(v, 'titulo')}
        </Txt>
        {scale.map((s) => (
          <Row key={s} gap={8}>
            {bool(v, 'mostrarValores') && <span style={{ ...textStyle(L, 'caption'), width: 22, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{s}</span>}
            <span style={{ height: 9, width: s * (base === 8 ? 2 : 3), background: color, borderRadius: Math.min(L.rSm, 3), opacity: 0.35 + s / (scale[5] * 1.6) }} />
          </Row>
        ))}
      </Col>
      {bool(v, 'mostrarExemplo') && (
        <div style={{ position: 'relative', flex: 'none' }}>
          <Card pad={16} style={{ width: 110 }}>
            <div style={{ position: 'absolute', inset: 6, border: `1px dashed ${withAlpha(L.accent, 0.7)}`, borderRadius: Math.max(0, L.rLg - 6), pointerEvents: 'none' }} />
            <Col gap={8}>
              <span style={{ height: 10, width: '70%', background: L.text, opacity: 0.8, borderRadius: 3 }} />
              <span style={{ height: 8, width: '90%', background: L.faint, borderRadius: 3 }} />
              <span style={{ height: 8, width: '60%', background: L.faint, borderRadius: 3 }} />
            </Col>
          </Card>
          <span style={{ ...textStyle(L, 'caption'), display: 'block', textAlign: 'center', marginTop: 6 }}>padding 16</span>
        </div>
      )}
    </Row>
  )
}

function BordasSombras({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const el = str(v, 'elevacao')
  const floatShadow = el === 'nenhuma' ? 'none' : el === 'baixa' ? L.shadow : el === 'alta' ? `${L.shadowFloat}, ${L.shadowFloat}` : L.shadowFloat
  const label = (t: string) => bool(v, 'mostrarRotulos') && <span style={{ ...textStyle(L, 'caption'), textAlign: 'center' }}>{t}</span>
  return (
    <Col gap={14} style={{ width: '100%', maxWidth: 320 }}>
      <Txt v="h3" part="title">
        {str(v, 'titulo')}
      </Txt>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, alignItems: 'end' }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <span {...P('control')} style={{ height: 40, ...fieldBox(L), padding: 0 }} />
          {label(`Controle · ${L.r >= 999 ? 'pílula' : `${L.r}px`}`)}
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <span {...P('card')} style={{ height: 64, ...L.card }} />
          {label(`Contêiner · ${L.rLg}px`)}
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <span {...P('float')} style={{ height: 64, ...L.float, boxShadow: floatShadow }} />
          {label('Flutuante')}
        </div>
      </div>
    </Col>
  )
}

function Icones({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const tr = str(v, 'tratamento')
  const treatment = tr === 'sem-fundo' ? 'plain' : tr === 'circulo' ? 'circle' : tr === 'quadrado' ? 'soft-tile' : L.style.iconTreatment
  const size = num(v, 'tamanho', 24)
  const color = hexOr(str(v, 'cor'), '')
  const others = ['Home', 'Search', 'Bell', 'Settings', 'Heart', 'Calendar', 'Mail', 'User']
  return (
    <Row gap={18} style={{ width: '100%', maxWidth: 330 }}>
      <Col gap={8} style={{ alignItems: 'center', flex: 'none' }}>
        <Tile name={str(v, 'icone')} size={Math.round(size * 2.2)} part="icon" color={color} treatment={treatment} />
        <Txt v="label" part="label">
          {str(v, 'legenda')}
        </Txt>
      </Col>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, flex: 1 }}>
        {others.map((n, i) => (
          <span key={n} {...P('icon')} style={{ display: 'grid', placeItems: 'center' }}>
            <Tile name={n} size={34} index={i} treatment={treatment} color={color} />
          </span>
        ))}
      </div>
    </Row>
  )
}

function Fundos({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const levels = Math.max(2, Math.min(4, num(v, 'niveis', 3)))
  const tint = hexOr(str(v, 'tinta'), '')
  const labels = bool(v, 'mostrarRotulos')
  const tag = (t: string) => labels && <span style={{ ...textStyle(L, 'caption'), position: 'absolute', top: 8, left: 10 }}>{t}</span>
  return (
    <div {...P('background')} style={{ position: 'relative', width: '100%', maxWidth: 320, height: 200, borderRadius: L.rLg, background: tint ? mix(L.bg, tint, 0.25) : L.stage, boxShadow: `inset 0 0 0 1px ${withAlpha(L.text, 0.1)}`, overflow: 'hidden' }}>
      {tag('Fundo')}
      <Card style={{ position: 'absolute', left: 22, top: 34, right: 22, bottom: 18 }} pad={0}>
        {tag('Superfície')}
        {levels >= 3 && (
          <Card raised style={{ position: 'absolute', right: 16, top: 34, width: 130, height: 70 }} pad={0}>
            {tag('Elevada')}
          </Card>
        )}
      </Card>
      {levels >= 4 && (
        <div style={{ position: 'absolute', inset: 0, background: withAlpha('#000000', 0.32), display: 'grid', placeItems: 'end start', padding: 10 }}>
          {labels && <span style={{ ...textStyle(L, 'caption'), color: '#fff' }}>Sobreposição</span>}
        </div>
      )}
    </div>
  )
}

function Separadores({ v }: RP) {
  const { L } = usePv()
  const P = usePart()
  const style = str(v, 'estilo')
  const w = num(v, 'espessura', 1)
  const color = hexOr(str(v, 'cor'), L.dark ? withAlpha(L.text, 0.18) : L.style.borderTone === 'ink' ? L.text : L.border)
  const line: CSSProperties = style === 'espaco' ? { height: 12 } : { borderTop: `${w}px ${style === 'tracejado' ? 'dashed' : 'solid'} ${color}`, flex: 1 }
  const item = (t: string, i: number) => (
    <Row gap={10} style={{ padding: '4px 0' }}>
      <Tile name={['FileText', 'Image', 'Music'][i]} size={30} index={i} />
      <Col gap={2}>
        <Txt v="h3" style={{ fontSize: L.fs }}>{t}</Txt>
        <Txt v="small">Atualizado há {i + 2} dias</Txt>
      </Col>
    </Row>
  )
  return (
    <Card style={{ width: '100%', maxWidth: 300 }}>
      <Col gap={8}>
        {item('Relatório anual', 0)}
        <div {...P('line')} style={{ display: 'flex' }}>
          <span style={line} />
        </div>
        {item('Fotos do evento', 1)}
        <Row gap={10} style={{ marginTop: 4 }}>
          {style !== 'espaco' && <span {...P('line')} style={line} />}
          <Txt v="caption" part="label">
            {str(v, 'rotulo')}
          </Txt>
          {style !== 'espaco' && <span {...P('line')} style={line} />}
        </Row>
      </Col>
    </Card>
  )
}

/* ============================== Campos e controles ============================== */

function Busca({ v, st }: RP) {
  const { L } = usePv()
  const loading = bool(v, 'carregando')
  const trailing = (
    <Row gap={6}>
      {bool(v, 'botaoLimpar') && <Ico name="X" size={15} color={L.muted} />}
      {bool(v, 'atalho') && <Kbd>⌘K</Kbd>}
    </Row>
  )
  const size = str(v, 'tamanho') as 'sm' | 'md' | 'lg'
  return (
    <Col gap={8} style={{ width: '100%', maxWidth: 320 }}>
      {loading ? (
        <Field placeholder={str(v, 'placeholder')} value="relatório" st={st === 'normal' ? 'focus' : st} size={size} trailing={<Spinner size={16} />} />
      ) : (
        <Field placeholder={str(v, 'placeholder')} icon={str(v, 'icone')} st={st} trailing={trailing} size={size} />
      )}
      {bool(v, 'sugestoes') && (
        <Card raised pad={6} part="suggestions">
          <div style={{ ...textStyle(L, 'caption'), padding: '4px 8px' }}>Recentes</div>
          {['Pedido #1042', 'Relatório de vendas', 'Clientes ativos'].map((t, i) => (
            <Row key={t} gap={10} style={{ height: 32, padding: '0 8px', borderRadius: Math.min(L.r, 8), background: i === 0 ? L.rowHover : undefined, fontSize: L.fs - 0.5, fontFamily: L.font, color: L.text }}>
              <Ico name={i === 0 ? 'Clock' : 'Search'} size={15} color={L.muted} />
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t}</span>
              {i === 0 && <Ico name="ArrowUpRight" size={14} color={L.muted} />}
            </Row>
          ))}
        </Card>
      )}
    </Col>
  )
}

function TextInput({ v, st }: RP) {
  const pos = str(v, 'posicaoIcone')
  const err = bool(v, 'erro')
  return (
    <div style={{ width: '100%', maxWidth: 300 }}>
      <Field
        label={str(v, 'rotulo')}
        placeholder={str(v, 'placeholder')}
        help={str(v, 'ajuda')}
        error={err ? str(v, 'mensagemErro') : undefined}
        icon={pos === 'esquerda' ? str(v, 'icone') : undefined}
        iconRight={pos === 'direita' ? (err ? 'XCircle' : str(v, 'icone')) : undefined}
        required={bool(v, 'obrigatorio')}
        size={str(v, 'tamanho') as 'sm' | 'md' | 'lg'}
        value={err ? 'ana@empresa' : st === 'focus' || st === 'active' ? 'ana@' : ''}
        st={st}
      />
    </div>
  )
}

function Textarea({ v, st }: RP) {
  const { L } = usePv()
  const limit = num(v, 'limite', 280)
  const text = 'Gostaria de entender como funciona a migração dos dados atuais.'
  const err = bool(v, 'erro')
  const count = err ? limit + 12 : text.length
  return (
    <Col gap={6} style={{ width: '100%', maxWidth: 300 }}>
      <Label part="label">{str(v, 'rotulo')}</Label>
      <Field multiline rows={num(v, 'linhas', 4)} placeholder={str(v, 'placeholder')} value={st === 'normal' && !err ? '' : text} st={st} error={err ? ' ' : undefined} style={{ gap: 0 }} />
      <Row justify="space-between">
        <span style={{ ...textStyle(L, 'small'), color: err ? L.error : L.muted }}>{err ? 'Texto acima do limite.' : 'Seja breve e específico.'}</span>
        {bool(v, 'contador') && <span style={{ ...textStyle(L, 'small'), fontVariantNumeric: 'tabular-nums', color: err ? L.error : count > limit * 0.9 ? L.warning : L.muted }}>{count}/{limit}</span>}
      </Row>
    </Col>
  )
}

function OptionList({ options, selected, focused, check = true, avatars, highlight }: { options: string[]; selected?: number; focused?: number; check?: boolean; avatars?: boolean; highlight?: string }) {
  const { L } = usePv()
  return (
    <>
      {options.map((o, i) => {
        const idx = highlight ? o.toLowerCase().indexOf(highlight.toLowerCase()) : -1
        return (
          <Row key={o + i} gap={10} style={{ height: 34, padding: '0 10px', borderRadius: L.r >= 999 ? 999 : Math.min(L.r, 8), background: i === focused ? L.rowHover : i === selected ? L.soft : undefined, color: i === selected ? L.onSoft : L.text, fontFamily: L.font, fontSize: L.fs - 0.5 }}>
            {avatars && <AvatarDot name={o} index={i} />}
            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: i === selected ? 600 : 400 }}>
              {idx >= 0 && highlight ? (
                <>
                  {o.slice(0, idx)}
                  <strong style={{ fontWeight: 750 }}>{o.slice(idx, idx + highlight.length)}</strong>
                  {o.slice(idx + highlight.length)}
                </>
              ) : (
                o
              )}
            </span>
            {check && i === selected && <Ico name="Check" size={15} />}
          </Row>
        )
      })}
    </>
  )
}

function AvatarDot({ name, index }: { name: string; index: number }) {
  const { L } = usePv()
  const c = L.cycle[index % L.cycle.length]
  return <span style={{ width: 22, height: 22, flex: 'none', borderRadius: '50%', background: c.bg, color: c.fg, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, fontFamily: L.font }}>{name[0]}</span>
}

function SelectR({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const opts = lines(v, 'opcoes')
  const value = str(v, 'valor')
  const open = bool(v, 'aberto')
  const sel = Math.max(0, opts.indexOf(value))
  return (
    <Col gap={6} style={{ width: '100%', maxWidth: 280 }}>
      <Label part="label">{str(v, 'rotulo')}</Label>
      <div {...P('field')} style={withState(L, { ...fieldBox(L, { size: str(v, 'tamanho') as 'md' }), cursor: 'pointer' }, open && st === 'normal' ? 'focus' : st, 'field')}>
        <Ico name={str(v, 'icone')} size={17} color={L.muted} part="icon" />
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <Ico name={open ? 'ChevronUp' : 'ChevronDown'} size={17} color={L.muted} />
      </div>
      {open && (
        <Card raised pad={5} part="options">
          {bool(v, 'comBusca') && (
            <Row gap={8} style={{ height: 32, padding: '0 10px', borderBottom: L.divider, marginBottom: 4, ...textStyle(L, 'small') }}>
              <Ico name="Search" size={14} /> Buscar…
            </Row>
          )}
          <OptionList options={opts.slice(0, 4)} selected={sel} focused={sel === 1 ? 2 : 1} />
        </Card>
      )}
    </Col>
  )
}

function Combobox({ v, st }: RP) {
  const { L } = usePv()
  const typed = str(v, 'digitado')
  const opts = lines(v, 'opcoes').filter((o) => !typed || o.toLowerCase().includes(typed.toLowerCase()))
  return (
    <Col gap={6} style={{ width: '100%', maxWidth: 280 }}>
      <Label part="label">{str(v, 'rotulo')}</Label>
      <Field value={typed} placeholder="Digite um nome…" icon="Search" st={st === 'normal' ? 'focus' : st} trailing={<Ico name="ChevronDown" size={16} color={L.muted} />} />
      {bool(v, 'aberto') && (
        <Card raised pad={5} part="options">
          {opts.length ? <OptionList options={opts.slice(0, 3)} focused={0} check={false} avatars={bool(v, 'avatares')} highlight={typed} /> : <div style={{ ...textStyle(L, 'small'), padding: 10 }}>Nenhum resultado</div>}
          {bool(v, 'criarNovo') && (
            <Row gap={10} style={{ height: 34, padding: '0 10px', borderTop: L.divider, marginTop: 4, color: L.primary, fontFamily: L.font, fontSize: L.fs - 0.5, fontWeight: 600 }}>
              <Ico name="Plus" size={15} /> Criar “{typed}”
            </Row>
          )}
        </Card>
      )}
    </Col>
  )
}

function MultiSelect({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const chosen = lines(v, 'selecionados')
  const limit = num(v, 'limiteVisivel', 3)
  const more = chosen.length - limit
  const open = bool(v, 'aberto')
  const box = withState(L, { ...fieldBox(L), height: 'auto', minHeight: L.h, flexWrap: 'wrap', padding: `6px ${L.style.field === 'underline' ? 2 : 8}px`, gap: 6 }, open && st === 'normal' ? 'focus' : st, 'field')
  return (
    <Col gap={6} style={{ width: '100%', maxWidth: 290 }}>
      <Label part="label">{str(v, 'rotulo')}</Label>
      <div {...P('chips')} style={box}>
        {chosen.slice(0, limit).map((c) => (
          <Badge key={c} tone="primary" removable>
            {c}
          </Badge>
        ))}
        {more > 0 && <Badge>+{more}</Badge>}
        <span style={{ flex: 1 }} />
        <Ico name="ChevronDown" size={16} color={L.muted} />
      </div>
      {open && (
        <Card raised pad={5} part="options">
          {[...chosen.slice(0, 2), ...lines(v, 'opcoes').slice(0, 2)].map((o, i) => (
            <Row key={o} gap={10} style={{ height: 32, padding: '0 10px', fontFamily: L.font, fontSize: L.fs - 0.5, color: L.text }}>
              <Check on={i < 2} size={16} /> {o}
            </Row>
          ))}
        </Card>
      )}
    </Col>
  )
}

function CheckboxR({ v, st }: RP) {
  const { L } = usePv()
  const on = bool(v, 'marcado')
  const mixed = bool(v, 'indeterminado')
  const card = str(v, 'layout') === 'cartao'
  const main = (
    <Row gap={12} align="flex-start">
      <Check on={on} mixed={mixed} st={st} part="control" size={20} />
      <Col gap={2}>
        <Txt v="body" part="label" style={{ fontWeight: 560 }}>
          {str(v, 'rotulo')}
        </Txt>
        <Txt v="small" part="help">
          {str(v, 'descricao')}
        </Txt>
      </Col>
    </Row>
  )
  return (
    <Col gap={14} style={{ width: '100%', maxWidth: 300 }}>
      {card ? (
        <Card style={{ borderColor: on ? L.trackOn : undefined, boxShadow: on ? `${L.shadow === 'none' ? '' : `${L.shadow}, `}0 0 0 1px ${L.trackOn}` : L.shadow }}>{main}</Card>
      ) : (
        main
      )}
      <Row gap={12} style={card ? { padding: `0 ${L.pad}px` } : undefined}>
        <Check on={false} size={20} />
        <Txt v="body">Receber novidades por e-mail</Txt>
      </Row>
      <Row gap={12} style={{ opacity: 0.5, ...(card ? { padding: `0 ${L.pad}px` } : {}) }}>
        <Check on size={20} st="disabled" />
        <Txt v="body">Opção bloqueada</Txt>
      </Row>
    </Col>
  )
}

function Radios({ v, st }: RP) {
  const { L } = usePv()
  const opts = lines(v, 'opcoes')
  const sel = num(v, 'selecionado', 1) - 1
  const cards = str(v, 'layout') === 'cartoes'
  return (
    <Col gap={cards ? 8 : 12} style={{ width: '100%', maxWidth: 300 }}>
      <Txt v="label" part="title">
        {str(v, 'titulo')}
      </Txt>
      {opts.slice(0, 4).map((o, i) => {
        const [a, b] = o.split(/\s+[—–-]\s+/)
        const row = (
          <Row gap={12}>
            <Check round on={i === sel} st={i === sel ? st : undefined} size={20} part="options" />
            <span style={{ flex: 1, minWidth: 0, ...textStyle(L, 'body'), fontWeight: i === sel ? 600 : 450 }}>{a}</span>
            {b && <span style={textStyle(L, 'small')}>{b}</span>}
          </Row>
        )
        return cards ? (
          <Card key={o} pad={`${Math.round(L.pad * 0.75)}px ${L.pad}px`} style={i === sel ? { borderColor: L.trackOn, boxShadow: `0 0 0 1px ${L.trackOn}` } : undefined}>
            {row}
          </Card>
        ) : (
          <div key={o}>{row}</div>
        )
      })}
    </Col>
  )
}

function Switches({ v, st }: RP) {
  const { L } = usePv()
  const left = str(v, 'posicao') === 'esquerda'
  const row = (label: string, desc: string, on: boolean, s?: typeof st, main = false) => (
    <Row gap={14} style={{ flexDirection: left ? 'row-reverse' : 'row', justifyContent: left ? 'flex-end' : undefined }}>
      <Col gap={2} style={{ flex: 1 }}>
        <Txt v="body" part={main ? 'label' : undefined} style={{ fontWeight: 560 }}>
          {label}
        </Txt>
        {desc && (
          <Txt v="small" part={main ? 'help' : undefined}>
            {desc}
          </Txt>
        )}
      </Col>
      <Toggle on={on} st={s} size={str(v, 'tamanho') as 'md'} part={main ? 'control' : undefined} />
    </Row>
  )
  return (
    <Card style={{ width: '100%', maxWidth: 310 }}>
      <Col gap={12}>
        {row(str(v, 'rotulo'), str(v, 'descricao'), bool(v, 'ligado'), st, true)}
        <Divider />
        {row('Modo escuro', '', !bool(v, 'ligado'))}
        <Divider />
        {row('Sons do sistema', '', false, 'disabled')}
      </Col>
    </Card>
  )
}

function Sliders({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const val = Math.max(0, Math.min(100, num(v, 'valor', 60)))
  const range = bool(v, 'faixa')
  const lo = range ? Math.round(val * 0.35) : 0
  const prefix = str(v, 'prefixo')
  const fmt = (n: number) => `${prefix ? `${prefix} ` : ''}${Math.round(n * 20)}`
  const thumb = (pos: number, main: boolean) => {
    let s: CSSProperties = {
      position: 'absolute',
      left: `calc(${pos}% - 11px)`,
      top: -7,
      width: 22,
      height: 22,
      borderRadius: L.r >= 6 ? '50%' : L.rSm,
      background: L.style.surface === 'neu' ? L.surfaceSolid : L.thumb,
      border: L.style.borderTone === 'ink' ? `2px solid ${L.text}` : `2px solid ${L.trackOn}`,
      boxShadow: L.style.surface === 'neu' ? L.btnShadow : L.style.shadow === 'hard' ? `2px 2px 0 ${L.text}` : '0 1px 4px rgba(0,0,0,.2)',
      boxSizing: 'border-box',
    }
    if (main) s = withState(L, s, st, 'plain')
    return <span {...P('thumb')} style={s} />
  }
  const fillBg = L.style.fill === 'solid' || L.style.fill === 'press' || L.style.fill === 'ivory' ? L.trackOn : L.fill
  return (
    <Col gap={18} style={{ width: '100%', maxWidth: 300 }}>
      <Row justify="space-between">
        <Label part="label">{str(v, 'rotulo')}</Label>
        {bool(v, 'mostrarValor') && (
          <span {...P('value')} style={{ ...textStyle(L, 'label'), color: L.primary, fontVariantNumeric: 'tabular-nums' }}>
            {range ? `${fmt(lo)} – ${fmt(val)}` : fmt(val)}
          </span>
        )}
      </Row>
      <div style={{ position: 'relative', height: 8, margin: '0 11px' }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: 99, background: L.trackOff, boxShadow: L.style.surface === 'neu' ? L.inset : undefined, border: L.style.shadow === 'hard' ? `1.5px solid ${L.text}` : undefined }} />
        <span style={{ position: 'absolute', top: 0, bottom: 0, left: `${lo}%`, width: `${val - lo}%`, borderRadius: 99, background: fillBg }} />
        {range && thumb(lo, false)}
        {thumb(val, true)}
      </div>
      {bool(v, 'marcas') && (
        <Row justify="space-between" style={{ padding: '0 4px' }}>
          {[0, 25, 50, 75, 100].map((m) => (
            <span key={m} style={{ ...textStyle(L, 'caption'), fontVariantNumeric: 'tabular-nums' }}>{fmt(m)}</span>
          ))}
        </Row>
      )}
    </Col>
  )
}

export function MiniCalendar({ selected, range, title, cell = 26, events = false, startMonday = false }: { selected: number; range?: boolean; title: string; cell?: number; events?: boolean; startMonday?: boolean }) {
  const { L } = usePv()
  const P = usePart()
  const offset = startMonday ? 5 : 6
  const days = Array.from({ length: 35 }, (_, i) => i - offset + 1)
  const wk = startMonday ? ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'] : ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
  const fill = L.style.fill === 'solid' || L.style.fill === 'press' ? L.trackOn : L.fill
  const onFill = L.style.fill === 'solid' || L.style.fill === 'press' ? (L.trackOn === L.fill ? L.onFill : '#fff') : L.onFill
  const rr = L.r >= 999 ? 999 : Math.min(L.r, 8)
  return (
    <div style={{ display: 'grid', gap: 4 }}>
      <Row justify="space-between" style={{ marginBottom: 2 }}>
        <Ico name="ChevronLeft" size={15} color={L.muted} />
        <span {...P('title')} style={{ ...textStyle(L, 'label'), fontWeight: 650 }}>
          {title}
        </span>
        <Ico name="ChevronRight" size={15} color={L.muted} />
      </Row>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cell}px)`, gap: 2, justifyContent: 'center' }}>
        {wk.map((d, i) => (
          <span key={i} style={{ ...textStyle(L, 'caption'), textAlign: 'center', fontSize: 11 }}>{d}</span>
        ))}
        {days.map((d, i) => {
          const valid = d >= 1 && d <= 31
          const isSel = d === selected || (range && d === selected + 4)
          const inRange = range && d > selected && d < selected + 4
          const today = d === 6
          return (
            <span
              key={i}
              style={{
                height: cell - 4,
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
                fontFamily: L.font,
                fontSize: 11.5,
                fontVariantNumeric: 'tabular-nums',
                color: !valid ? 'transparent' : isSel ? onFill : L.text,
                background: isSel ? fill : inRange ? L.soft : undefined,
                borderRadius: inRange ? 0 : rr,
                boxShadow: today && !isSel ? `inset 0 0 0 1px ${L.borderStrong}` : undefined,
                fontWeight: isSel ? 700 : 450,
              }}
            >
              {valid ? d : ''}
              {events && valid && [3, 11, 19, 24].includes(d) && !isSel && <span style={{ position: 'absolute', bottom: 2, width: 4, height: 4, borderRadius: 4, background: L.accent }} />}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function DatePicker({ v, st }: RP) {
  const open = bool(v, 'aberto')
  const value = str(v, 'valor')
  const day = Number(value.slice(0, 2)) || 14
  return (
    <Col gap={6} style={{ width: '100%', maxWidth: 260 }}>
      {!open && <Label part="label">{str(v, 'rotulo')}</Label>}
      <Field value={bool(v, 'intervalo') ? `${value} – ${String(day + 4).padStart(2, '0')}${value.slice(2)}` : value} icon="Calendar" st={open && st === 'normal' ? 'focus' : st} />
      {open && (
        <Card raised pad={8} part="calendar">
          <MiniCalendar selected={day} range={bool(v, 'intervalo')} title={str(v, 'mes')} cell={30} />
        </Card>
      )}
    </Col>
  )
}

function TimePicker({ v, st }: RP) {
  const { L } = usePv()
  const value = str(v, 'valor')
  const [hh, mm] = value.split(':')
  const step = Number(str(v, 'intervalo')) || 30
  const mins = step === 15 ? ['00', '15', '30', '45'] : step === 30 ? ['00', '30'] : ['00']
  const h12 = str(v, 'formato') === '12h'
  const hours = ['13', '14', '15', '16'].map((h) => (h12 ? String(Number(h) - 12).padStart(2, '0') : h))
  const cur = h12 ? String(Number(hh) - 12).padStart(2, '0') : hh
  const fill = L.style.fill === 'solid' || L.style.fill === 'press' ? L.trackOn : L.fill
  const col = (items: string[], sel: string) => (
    <Col gap={3} style={{ flex: 1 }}>
      {items.map((x) => (
        <span key={x} style={{ height: 28, display: 'grid', placeItems: 'center', borderRadius: L.r >= 999 ? 999 : Math.min(L.r, 8), fontFamily: L.font, fontSize: L.fs - 0.5, fontVariantNumeric: 'tabular-nums', background: x === sel ? fill : undefined, color: x === sel ? L.onFill : L.text, fontWeight: x === sel ? 700 : 450 }}>
          {x}
        </span>
      ))}
    </Col>
  )
  return (
    <Col gap={6} style={{ width: '100%', maxWidth: 240 }}>
      <Label part="label">{str(v, 'rotulo')}</Label>
      <Field value={h12 ? `${cur}:${mm} PM` : value} icon="Clock" st={bool(v, 'aberto') && st === 'normal' ? 'focus' : st} />
      {bool(v, 'aberto') && (
        <Card raised pad={6} part="options">
          <Row gap={4} align="flex-start">
            {col(hours, cur)}
            <span style={{ alignSelf: 'stretch', borderLeft: L.divider }} />
            {col(mins, mm)}
            {h12 && (
              <>
                <span style={{ alignSelf: 'stretch', borderLeft: L.divider }} />
                {col(['AM', 'PM'], 'PM')}
              </>
            )}
          </Row>
        </Card>
      )}
    </Col>
  )
}

function Upload({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const drag = bool(v, 'arrastando') || st === 'hover'
  const zone: CSSProperties = {
    display: 'grid',
    justifyItems: 'center',
    gap: 6,
    padding: `${Math.round(L.pad * 1.1)}px ${L.pad}px`,
    textAlign: 'center',
    borderRadius: L.rLg,
    border: `${Math.max(1.5, Math.min(L.bw, 2))}px dashed ${drag ? L.trackOn : L.dark ? withAlpha(L.text, 0.3) : L.style.borderTone === 'ink' ? L.text : L.borderStrong}`,
    background: drag ? L.soft : L.style.surface === 'glass' || L.style.surface === 'aurora' ? L.surface : L.dark ? withAlpha('#ffffff', 0.02) : L.surfaceSolid,
    boxShadow: L.style.surface === 'neu' ? L.inset : undefined,
  }
  return (
    <Col gap={10} style={{ width: '100%', maxWidth: 300 }}>
      <div {...P('zone')} style={withState(L, zone, st === 'hover' ? undefined : st, 'plain')}>
        <Tile name={str(v, 'icone')} size={38} part="icon" />
        <Txt v="h3" part="title">
          {str(v, 'titulo')}
        </Txt>
        <Txt v="small" part="help">
          {str(v, 'subtitulo')}
        </Txt>
        <Btn kind="secondary" size="sm" part="button" style={{ marginTop: 4 }}>
          {str(v, 'botao')}
        </Btn>
      </div>
      {bool(v, 'mostrarArquivo') && (
        <Row gap={10}>
          <Tile name="FileText" size={30} index={1} />
          <Col gap={4} style={{ flex: 1 }}>
            <Row justify="space-between">
              <span style={{ ...textStyle(L, 'body'), fontSize: L.fs - 1, fontWeight: 560, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>proposta-2025.pdf</span>
              <span style={{ ...textStyle(L, 'small'), fontVariantNumeric: 'tabular-nums' }}>{num(v, 'progresso')}%</span>
            </Row>
            <Bar value={num(v, 'progresso')} height={6} />
          </Col>
          <Ico name="X" size={15} color={L.muted} />
        </Row>
      )}
    </Col>
  )
}

function Senha({ v, st }: RP) {
  const { L } = usePv()
  const P = usePart()
  const force = str(v, 'forca')
  const level = force === 'fraca' ? 1 : force === 'media' ? 2 : 4
  const color = level === 1 ? L.error : level === 2 ? L.warning : L.success
  const visible = bool(v, 'visivel')
  const reqs: [string, boolean][] = [
    ['8 ou mais caracteres', true],
    ['Uma letra maiúscula', level >= 2],
    ['Um número ou símbolo', level >= 4],
  ]
  return (
    <Col gap={8} style={{ width: '100%', maxWidth: 290 }}>
      <Row justify="space-between">
        <Label part="label">{str(v, 'rotulo')}</Label>
        {bool(v, 'linkEsqueci') && <span style={{ ...textStyle(L, 'small'), color: L.primary, fontWeight: 600 }}>Esqueci minha senha</span>}
      </Row>
      <Field value={visible ? 'Sol2025praia' : '••••••••••'} icon="Lock" st={st} trailing={<Ico name={visible ? 'EyeOff' : 'Eye'} size={17} color={L.muted} part="eye" />} />
      <Row gap={4}>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} {...P('meter')} style={{ flex: 1, height: 5, borderRadius: 4, background: i <= level ? color : L.trackOff }} />
        ))}
      </Row>
      <span style={{ ...textStyle(L, 'small'), color }}>Força: {force === 'media' ? 'média' : force}</span>
      {bool(v, 'requisitos') &&
        reqs.map(([t, ok]) => (
          <Row key={t} gap={7} style={{ ...textStyle(L, 'small'), color: ok ? L.text : L.muted }}>
            <Ico name={ok ? 'CheckCircle2' : 'Circle'} size={14} color={ok ? L.success : L.faint} /> {t}
          </Row>
        ))}
    </Col>
  )
}

function Formularios({ v, st }: RP) {
  const { L } = usePv()
  const two = str(v, 'colunas') === '2'
  const sending = bool(v, 'enviando')
  return (
    <Card accentTop style={{ width: '100%', maxWidth: 330 }}>
      <Col gap={10}>
        <Col gap={2}>
          <Txt v="h2" part="title">
            {str(v, 'titulo')}
          </Txt>
          {two && (
            <Txt v="small" part="body">
              {str(v, 'descricao')}
            </Txt>
          )}
        </Col>
        <div className="cmp-form-grid" style={{ display: 'grid', gridTemplateColumns: two ? 'repeat(2, minmax(0, 1fr))' : '1fr', gap: 10 }}>
          <Field label="Nome" placeholder="Ana Souza" size="sm" value="Ana Souza" />
          <Field label="E-mail" placeholder="ana@empresa.com" size="sm" st={st === 'normal' ? undefined : st} />
        </div>
        {bool(v, 'termos') && (
          <Row gap={8}>
            <Check on size={16} />
            <span style={{ ...textStyle(L, 'small'), color: L.text }}>Li e aceito a política de privacidade</span>
          </Row>
        )}
        <Btn full={!two} part="button" loading={sending} style={two ? { alignSelf: 'flex-end' } : undefined} st={sending ? 'disabled' : undefined}>
          {sending ? 'Enviando…' : str(v, 'botao')}
        </Btn>
      </Col>
    </Card>
  )
}

export const BASE_RENDERERS: RendererMap = {
  tipografia: { render: Tipografia },
  'paletas-cores': { render: Paletas },
  espacamentos: { render: Espacamentos },
  'bordas-sombras': { render: BordasSombras },
  icones: { render: Icones },
  'fundos-superficies': { render: Fundos },
  separadores: { render: Separadores },
  'campos-busca': { render: Busca, frame: 'top' },
  'text-inputs': { render: TextInput },
  textareas: { render: Textarea },
  'selects-dropdowns': { render: SelectR, frame: 'top' },
  combobox: { render: Combobox, frame: 'top' },
  'multi-select': { render: MultiSelect, frame: 'top' },
  checkbox: { render: CheckboxR },
  radios: { render: Radios },
  switches: { render: Switches },
  sliders: { render: Sliders },
  'date-pickers': { render: DatePicker, frame: 'top' },
  'time-pickers': { render: TimePicker, frame: 'top' },
  'upload-dropzone': { render: Upload },
  'campos-senha': { render: Senha },
  formularios: { render: Formularios },
}
