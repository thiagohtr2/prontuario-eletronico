import { ArrowDownRight, ArrowUpRight, Bell, ChevronDown, ChevronLeft, ChevronRight, Copy, Info, Menu, Plus, Search } from 'lucide-react'
import { mix } from '@/core/color'
import { Avatar, BrandMark, Btn, H, Icon, P, type RCtx } from './kit'
import type { IconName } from '../types'

/* Regiões de aplicação (dashboard) e de documentação. Cada uma é uma "parte editável". */

const card = (ctx: RCtx) => ({
  background: ctx.t.surface,
  border: `1px solid ${ctx.t.border}`,
  borderRadius: ctx.t.rLg,
})

const STATUS: Record<string, { fg: string; bg: string }> = {
  Pago: { fg: '#15803d', bg: '#e8f6ec' },
  Enviado: { fg: '#1d4ed8', bg: '#e8efff' },
  Pendente: { fg: '#a16207', bg: '#fdf4dc' },
  Cancelado: { fg: '#b91c1c', bg: '#fdeaea' },
}

const NAV_ICONS: IconName[] = ['dashboard', 'inbox', 'users', 'tag', 'chart', 'settings']

export function DashSidebar({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const links = s.links ?? []
  const bg = t.dark ? mix(t.bg, '#000000', 0.3) : mix(t.text, t.primary, 0.08)
  const fg = '#ffffff'
  if (m) {
    return (
      <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', background: t.surface, borderTop: `1px solid ${t.border}`, padding: '6px 4px 10px', fontFamily: t.body }}>
        {links.slice(0, 4).map((l, i) => (
          <span key={l} style={{ display: 'grid', justifyItems: 'center', gap: 4, padding: '6px 0', fontSize: 11.5, fontWeight: 600, color: i === 0 ? t.primary : t.muted }}>
            <Icon name={NAV_ICONS[i]} size={22} />
            {l}
          </span>
        ))}
      </nav>
    )
  }
  return (
    <aside style={{ background: bg, color: fg, height: '100%', minHeight: 820, display: 'flex', flexDirection: 'column', padding: '20px 14px', fontFamily: t.body, boxSizing: 'border-box' }}>
      <div style={{ padding: '4px 8px 22px' }}>
        <BrandMark ctx={{ ...ctx, s: { ...s, tone: 'bg' } }} color={fg} size={18} />
      </div>
      <span style={{ padding: '0 10px 8px', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.5 }}>Menu</span>
      <div style={{ display: 'grid', gap: 2 }}>
        {links.map((l, i) => (
          <span
            key={l}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minHeight: 42,
              padding: '0 12px',
              borderRadius: t.rMd === 999 ? 999 : Math.min(t.rMd, 10),
              background: i === 0 ? mix(bg, '#ffffff', 0.12) : 'transparent',
              color: i === 0 ? '#ffffff' : 'rgba(255,255,255,.72)',
              fontSize: 14.5,
              fontWeight: i === 0 ? 620 : 500,
              boxShadow: i === 0 ? `inset 3px 0 0 ${t.primary}` : undefined,
            }}
          >
            <Icon name={NAV_ICONS[i % NAV_ICONS.length]} size={18} />
            {l}
            {i === 1 && <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, padding: '1px 8px', borderRadius: 999, background: t.primary, color: t.onPrimary }}>12</span>}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: Math.min(t.rLg, 14), background: mix(bg, '#ffffff', 0.07) }}>
        <Avatar name="Júlia Campos" size={36} />
        <span style={{ display: 'grid', minWidth: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Júlia Campos</span>
          <span style={{ fontSize: 12.5, opacity: 0.65 }}>Administradora</span>
        </span>
      </div>
    </aside>
  )
}

export function DashTopbar({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: m ? 10 : 16, minHeight: m ? 60 : 68, padding: m ? '0 16px' : '0 28px', background: t.surface, borderBottom: `1px solid ${t.border}`, fontFamily: t.body, color: t.text }}>
      {m && <Menu width={22} height={22} />}
      <div style={{ display: 'grid', minWidth: 0 }}>
        <H ctx={ctx} level={2} size={m ? 18 : 22}>
          {s.title}
        </H>
        {m && <span style={{ fontSize: 12.5, color: t.muted }}>{ctx.brand} · {s.note}</span>}
      </div>
      {!m && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', borderRadius: t.rMd, border: `1px solid ${t.border}`, fontSize: 13.5, color: t.muted }}>
          {s.note} <ChevronDown width={15} height={15} />
        </span>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: m ? 12 : 16 }}>
        {!m ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: 240, height: 38, padding: '0 12px', borderRadius: t.rMd, border: `1px solid ${t.border}`, color: t.muted, fontSize: 14, background: t.bg }}>
            <Search width={16} height={16} /> Buscar pedidos, clientes…
          </span>
        ) : (
          <Search width={21} height={21} />
        )}
        <span style={{ position: 'relative', display: 'inline-flex' }}>
          <Bell width={21} height={21} />
          <span style={{ position: 'absolute', top: -1, right: -1, width: 8, height: 8, borderRadius: 4, background: '#ef4444', boxShadow: `0 0 0 2px ${t.surface}` }} />
        </span>
        {!m && s.cta && (
          <Btn ctx={{ ...ctx, s: { ...s, tone: 'bg' } }} size="sm">
            <Plus width={16} height={16} /> {s.cta}
          </Btn>
        )}
        {m && (
          <span style={{ width: 36, height: 36, borderRadius: 18, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label={s.cta}>
            <Plus width={18} height={18} />
          </span>
        )}
      </div>
    </div>
  )
}

function Spark({ up, color }: { up: boolean; color: string }) {
  const d = up ? 'M0 26 L12 22 L24 24 L36 14 L48 16 L60 6 L72 8' : 'M0 8 L12 10 L24 6 L36 16 L48 14 L60 22 L72 20'
  return (
    <svg width="72" height="30" viewBox="0 0 72 30" aria-hidden="true" style={{ display: 'block' }}>
      <path d={d} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DashKpis({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${m ? 2 : (s.items ?? []).length}, minmax(0, 1fr))`, gap: m ? 10 : 16, fontFamily: t.body, color: t.text }}>
      {(s.items ?? []).map((k) => {
        const up = !(k.meta ?? '').startsWith('−')
        const tone = up ? '#15803d' : '#b91c1c'
        return (
          <div key={k.title} style={{ ...card(ctx), padding: m ? 14 : 20, display: 'grid', gap: m ? 6 : 10 }}>
            <span style={{ fontSize: 13.5, color: t.muted, fontWeight: 560 }}>{k.title}</span>
            <span style={{ fontFamily: t.heading, fontWeight: 700, fontSize: m ? 20 : 27, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.value}</span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 650, color: tone, background: up ? '#e8f6ec' : '#fdeaea', padding: '2px 8px', borderRadius: 999 }}>
                {up ? <ArrowUpRight width={14} height={14} /> : <ArrowDownRight width={14} height={14} />}
                {k.meta}
              </span>
              {!m && <Spark up={up} color={up ? t.primary : '#ef4444'} />}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function DashChart({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const pts = [42, 48, 45, 60, 58, 66, 61, 74, 70, 82, 78, 90, 86, 96, 92, 104]
  const prev = [38, 40, 44, 42, 50, 48, 55, 52, 58, 60, 57, 63, 66, 64, 70, 72]
  const w = 600
  const h = 220
  const x = (i: number) => (i / (pts.length - 1)) * w
  const y = (v: number) => h - (v / 120) * h
  const line = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  return (
    <div style={{ ...card(ctx), padding: m ? 16 : 22, display: 'grid', gap: 16, fontFamily: t.body, color: t.text, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 2 }}>
          <span style={{ fontWeight: 650, fontSize: 16 }}>{s.title}</span>
          <span style={{ fontSize: 13, color: t.muted }}>R$ 184,2 mil no período · +12,4%</span>
        </div>
        <span style={{ display: 'inline-flex', padding: 3, borderRadius: t.rMd, border: `1px solid ${t.border}`, fontSize: 13 }}>
          {['7d', '30d', '90d'].map((p, i) => (
            <span key={p} style={{ padding: '4px 10px', borderRadius: Math.max(0, t.rMd - 3), background: i === 1 ? mix(t.surface, t.primary, 0.14) : 'transparent', color: i === 1 ? t.primary : t.muted, fontWeight: 600 }}>
              {p}
            </span>
          ))}
        </span>
      </div>
      <div style={{ height: m ? 180 : 250 }}>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height="100%" aria-label="Gráfico de receita por dia" role="img" style={{ display: 'block', overflow: 'visible' }}>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="0" x2={w} y1={(h / 4) * i + 1} y2={(h / 4) * i + 1} stroke={t.border} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={`${line(pts)} L${w} ${h} L0 ${h} Z`} fill={t.primary} opacity="0.12" />
          <path d={line(prev)} fill="none" stroke={t.muted} strokeWidth="2" strokeDasharray="5 5" opacity="0.6" vectorEffect="non-scaling-stroke" />
          <path d={line(pts)} fill="none" stroke={t.primary} strokeWidth="2.6" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 18, fontSize: 13, color: t.muted, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 3, borderRadius: 2, background: t.primary }} /> Este período
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 0, borderTop: `2px dashed ${t.muted}` }} /> Período anterior
        </span>
      </div>
    </div>
  )
}

export function DashActivity({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const list = (s.items ?? []).slice(0, m ? 4 : 5)
  return (
    <div style={{ ...card(ctx), padding: m ? 16 : 22, display: 'grid', gap: 14, alignContent: 'start', fontFamily: t.body, color: t.text, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 650, fontSize: 16 }}>{s.title}</span>
        <span style={{ fontSize: 13.5, color: t.primary, fontWeight: 600 }}>Ver tudo</span>
      </div>
      {list.map((a, i) => (
        <div key={a.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Avatar name={['Júlia Campos', 'Padaria Sol', 'Estoque', 'Pedro Alves', 'Financeiro'][i % 5]} size={32} />
          <span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 14, lineHeight: 1.4 }}>{a.title}</span>
            <span style={{ fontSize: 12.5, color: t.muted }}>{a.meta}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export function DashTable({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const rows = s.items ?? []
  const head = ['Pedido', 'Cliente', 'Status', 'Data', 'Valor']
  const badge = (status = '') => {
    const st = STATUS[status] ?? { fg: t.muted, bg: t.bg }
    return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: st.bg, color: st.fg, fontSize: 12.5, fontWeight: 650, whiteSpace: 'nowrap' }}>● {status}</span>
  }
  return (
    <div style={{ ...card(ctx), fontFamily: t.body, color: t.text, overflow: 'hidden', minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: m ? 16 : '18px 22px', borderBottom: `1px solid ${t.border}`, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 650, fontSize: 16 }}>{s.title}</span>
        <span style={{ display: 'flex', gap: 8 }}>
          {['Todos', 'Pagos', 'Pendentes'].map((f, i) => (
            <span key={f} style={{ padding: '5px 12px', borderRadius: 999, border: `1px solid ${i === 0 ? t.primary : t.border}`, color: i === 0 ? t.primary : t.muted, fontSize: 13, fontWeight: 600 }}>
              {f}
            </span>
          ))}
        </span>
      </div>
      {m ? (
        <div>
          {rows.map((r, i) => (
            <div key={r.title} style={{ display: 'grid', gap: 8, padding: 16, borderTop: i ? `1px solid ${t.border}` : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <strong style={{ fontSize: 15 }}>{r.title}</strong>
                <strong style={{ fontSize: 15 }}>{r.value}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: t.muted }}>
                  {r.text} · {r.meta}
                </span>
                {badge(r.tag)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div role="table" style={{ display: 'grid' }}>
          <div role="row" style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.6fr 1fr 0.8fr 1fr', padding: '10px 22px', background: t.bg, fontSize: 12.5, fontWeight: 650, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {head.map((hd, i) => (
              <span key={hd} role="columnheader" style={{ textAlign: i === 4 ? 'right' : 'left' }}>
                {hd}
              </span>
            ))}
          </div>
          {rows.map((r) => (
            <div key={r.title} role="row" style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.6fr 1fr 0.8fr 1fr', alignItems: 'center', padding: '14px 22px', borderTop: `1px solid ${t.border}`, fontSize: 14.5 }}>
              <span role="cell" style={{ fontWeight: 600, color: t.primary }}>{r.title}</span>
              <span role="cell">{r.text}</span>
              <span role="cell">{badge(r.tag)}</span>
              <span role="cell" style={{ color: t.muted }}>{r.meta}</span>
              <span role="cell" style={{ textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 22px', borderTop: `1px solid ${t.border}`, fontSize: 13.5, color: t.muted }}>
            <span>Mostrando 1–5 de 2.931</span>
            <span style={{ display: 'flex', gap: 6 }}>
              <ChevronLeft width={18} height={18} />
              <ChevronRight width={18} height={18} />
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================================ Documentação ================================ */

export function DocsSidebar({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  if (m) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: `1px solid ${t.border}`, fontFamily: t.body, color: t.text, fontSize: 14.5, fontWeight: 600, background: t.bg }}>
        <Menu width={18} height={18} /> Menu da documentação
        <span style={{ marginLeft: 'auto', color: t.muted, fontWeight: 500 }}>Autenticação</span>
      </div>
    )
  }
  return (
    <aside style={{ padding: '28px 16px', borderRight: `1px solid ${t.border}`, height: '100%', boxSizing: 'border-box', fontFamily: t.body, color: t.text, display: 'grid', gap: 22, alignContent: 'start', background: t.bg }}>
      {(s.items ?? []).map((g) => (
        <div key={g.title} style={{ display: 'grid', gap: 2 }}>
          <span style={{ padding: '0 10px 6px', fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: t.muted }}>{g.title}</span>
          {(g.list ?? []).map((l) => {
            const active = l === 'Autenticação'
            return (
              <span key={l} style={{ padding: '7px 10px', borderRadius: Math.min(t.rMd, 8), fontSize: 14.5, background: active ? t.primarySoft : 'transparent', color: active ? mix(t.primary, t.text, 0.25) : t.text, fontWeight: active ? 620 : 450, boxShadow: active ? `inset 2px 0 0 ${t.primary}` : undefined }}>
                {l}
              </span>
            )
          })}
        </div>
      ))}
    </aside>
  )
}

function Code({ ctx }: { ctx: RCtx }) {
  const { t, m } = ctx
  const k = '#7dd3fc'
  const str = '#86efac'
  const muted = '#94a3b8'
  return (
    <div style={{ borderRadius: Math.min(t.rLg, 12), overflow: 'hidden', border: '1px solid #1e293b', background: '#0f172a', color: '#e2e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px 0 4px', borderBottom: '1px solid #1e293b', fontSize: 13, fontFamily: t.body }}>
        {['cURL', 'JavaScript', 'Python'].map((l, i) => (
          <span key={l} style={{ padding: '10px 10px', color: i === 1 ? '#ffffff' : muted, boxShadow: i === 1 ? `inset 0 -2px 0 ${t.primary}` : undefined, fontWeight: 600 }}>
            {l}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, color: muted }}>
          <Copy width={14} height={14} /> Copiar
        </span>
      </div>
      <pre style={{ margin: 0, padding: m ? 14 : 18, fontFamily: t.mono, fontSize: m ? 12.5 : 13.5, lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre' }}>
        <span style={{ color: k }}>import</span> {'{ Ponte }'} <span style={{ color: k }}>from</span> <span style={{ color: str }}>'@kitponte/sdk'</span>
        {'\n\n'}
        <span style={{ color: k }}>const</span> ponte = <span style={{ color: k }}>new</span> Ponte(process.env.<span style={{ color: '#fca5a5' }}>PONTE_SECRET_KEY</span>)
        {'\n'}
        <span style={{ color: k }}>const</span> cliente = <span style={{ color: k }}>await</span> ponte.clientes.criar({'{'}
        {'\n  '}nome: <span style={{ color: str }}>'Ana Souza'</span>,{'\n  '}email: <span style={{ color: str }}>'ana@exemplo.com'</span>
        {'\n'}
        {'})'}
      </pre>
    </div>
  )
}

export function DocsArticle({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const subs = s.items ?? []
  return (
    <article style={{ display: 'grid', gap: 18, padding: m ? '24px 16px' : '40px 48px 24px', fontFamily: t.body, color: t.text, maxWidth: 800, minWidth: 0 }}>
      <span style={{ fontSize: 13.5, color: t.muted }}>
        Documentação / {s.eyebrow} / <span style={{ color: t.text }}>{s.title}</span>
      </span>
      <H ctx={ctx} level={1} size={m ? 30 : 40}>
        {s.title}
      </H>
      <P ctx={ctx} color={t.muted} size={m ? 16 : 17.5} style={{ lineHeight: 1.7 }}>
        {s.text}
      </P>
      {s.note && (
        <div style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: Math.min(t.rMd, 10), border: '1px solid #f5d48a', borderLeft: '4px solid #d97706', background: t.dark ? '#3a2e12' : '#fffaeb', fontSize: 15, color: t.dark ? '#fde68a' : '#7a4a03' }}>
          <Info width={18} height={18} style={{ flex: 'none', marginTop: 2 }} />
          <span>{s.note}</span>
        </div>
      )}
      {subs[0] && (
        <H ctx={ctx} level={2} size={m ? 22 : 26} style={{ marginTop: 10 }}>
          {subs[0].title}
        </H>
      )}
      <P ctx={ctx} size={m ? 15.5 : 16.5} style={{ lineHeight: 1.7 }}>
        Instale o SDK e inicialize o cliente com a chave secreta guardada em uma variável de ambiente. A chave começa com <code style={{ fontFamily: t.mono, fontSize: '0.9em', padding: '2px 6px', borderRadius: 4, background: t.surface, border: `1px solid ${t.border}` }}>sk_live_</code> em produção.
      </P>
      <Code ctx={ctx} />
      {subs[1] && (
        <H ctx={ctx} level={2} size={m ? 22 : 26} style={{ marginTop: 10 }}>
          {subs[1].title}
        </H>
      )}
      <P ctx={ctx} size={m ? 15.5 : 16.5} style={{ lineHeight: 1.7 }}>
        Use as chaves de teste para simular pagamentos sem movimentar dinheiro. Elas funcionam com os mesmos endpoints e retornam dados fictícios.
      </P>
    </article>
  )
}

export function DocsToc({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const list = s.items ?? []
  if (m) {
    return (
      <div style={{ margin: '16px 16px 0', padding: '12px 14px', borderRadius: Math.min(t.rMd, 10), border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: t.body, color: t.text, fontSize: 14.5, fontWeight: 600 }}>
        Nesta página <ChevronDown width={18} height={18} />
      </div>
    )
  }
  return (
    <nav style={{ padding: '40px 20px 24px 8px', fontFamily: t.body, color: t.text, display: 'grid', gap: 4, alignContent: 'start' }}>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: t.muted, marginBottom: 8 }}>Nesta página</span>
      {list.map((it, i) => (
        <span key={it.title} style={{ padding: '5px 12px', borderLeft: `2px solid ${i === 1 ? t.primary : t.border}`, fontSize: 14, color: i === 1 ? t.primary : t.muted, fontWeight: i === 1 ? 600 : 450 }}>
          {it.title}
        </span>
      ))}
    </nav>
  )
}

export function DocsPager({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const list = s.items ?? []
  return (
    <div style={{ display: 'grid', gap: 18, padding: m ? '8px 16px 32px' : '8px 48px 48px', fontFamily: t.body, color: t.text, maxWidth: 800 }}>
      <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: 12 }}>
        {list.map((it, i) => (
          <div key={it.title} style={{ padding: '14px 18px', borderRadius: Math.min(t.rLg, 12), border: `1px solid ${t.border}`, textAlign: i === 1 && !m ? 'right' : 'left', display: 'grid', gap: 4 }}>
            <span style={{ fontSize: 13, color: t.muted }}>{i === 0 ? '← ' : ''}{it.meta}{i === 1 ? ' →' : ''}</span>
            <span style={{ fontWeight: 620, color: t.primary }}>{it.title}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center', fontSize: 14, color: t.muted, borderTop: `1px solid ${t.border}`, paddingTop: 16 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          Esta página ajudou?
          {['Sim', 'Não'].map((l) => (
            <span key={l} style={{ padding: '4px 12px', borderRadius: 999, border: `1px solid ${t.border}`, color: t.text }}>
              {l}
            </span>
          ))}
        </span>
        <span>Editar esta página</span>
      </div>
    </div>
  )
}
