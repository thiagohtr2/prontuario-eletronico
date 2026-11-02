import { useId, type CSSProperties, type ReactNode } from 'react'
import { ArrowRight, Bath, BedDouble, Check, ChevronDown, Heart, Lock, MapPin, Menu, MessageCircle, Minus, Play, Plus, Quote, Ruler, Search, ShoppingBag, Smartphone, User } from 'lucide-react'
import { mix } from '@/core/color'
import {
  Art,
  Avatar,
  Block,
  BrandMark,
  Btn,
  BtnRow,
  Chip,
  Eyebrow,
  FakeInput,
  H,
  headingWeight,
  Icon,
  P,
  Rich,
  SectionHead,
  Stars,
  toneOf,
  Wordmark,
  Wrap,
  type RCtx,
} from './kit'

const sz = (n: number) => ({ width: n, height: n, flex: 'none' as const })
const grid = (cols: number, gap = 24): CSSProperties => ({ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap })
const colsFor = (n: number) => (n === 4 || n === 8 ? 4 : n === 2 ? 2 : n === 1 ? 1 : 3)
const items = (ctx: RCtx) => ctx.s.items ?? []
/** Bordas sempre em propriedades longas (evita conflito de shorthand ao trocar de dispositivo). */
const sides = (all: string, left?: string): CSSProperties => ({ borderTop: all, borderRight: all, borderBottom: all, borderLeft: left ?? all })
const WHITE_OUTLINE: CSSProperties = { color: '#ffffff', borderColor: 'rgba(255,255,255,.7)' }

/* ================================== Cabeçalho ================================== */

function MenuButton({ color }: { color: string }) {
  return (
    <span style={{ ...sz(40), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color }} aria-label="Abrir menu">
      <Menu width={24} height={24} />
    </span>
  )
}

function NavLinks({ ctx, links, gap = 32, style }: { ctx: RCtx; links: string[]; gap?: number; style?: CSSProperties }) {
  const c = toneOf(ctx.t, ctx.s.tone)
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap, fontSize: 15, fontWeight: 520, color: c.muted, minWidth: 0, ...style }}>
      {links.map((l, i) => (
        <span key={l} style={{ whiteSpace: 'nowrap', color: i === 0 ? c.fg : undefined }}>
          {l}
        </span>
      ))}
    </nav>
  )
}

export function NavSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const v = s.variant ?? 'split'
  const links = s.links ?? []
  const bar: CSSProperties = { display: 'flex', alignItems: 'center', gap: 24, minHeight: m ? 64 : 76 }

  if (v === 'store') {
    return (
      <Block ctx={ctx} as="header" pad={0} style={{ borderBottom: `1px solid ${c.border}` }}>
        {s.note && (
          <div style={{ background: t.text, color: t.bg, fontSize: 13, fontWeight: 520, textAlign: 'center', padding: '9px 16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {s.note}
          </div>
        )}
        <Wrap m={m} style={{ ...bar, gap: m ? 8 : 28 }}>
          {m && <MenuButton color={c.fg} />}
          <BrandMark ctx={ctx} size={m ? 17 : 20} />
          {!m && <NavLinks ctx={ctx} links={links} gap={26} />}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: m ? 6 : 18, color: c.fg }}>
            {!m && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 230, height: 42, padding: '0 14px', borderRadius: t.rMd, border: `1px solid ${c.border}`, color: c.muted, fontSize: 14 }}>
                <Search width={17} height={17} /> Buscar produtos
              </div>
            )}
            {m && <Search width={22} height={22} />}
            {!m && <User width={22} height={22} />}
            {!m && <Heart width={22} height={22} />}
            <span style={{ position: 'relative', display: 'inline-flex', padding: 6 }}>
              <ShoppingBag width={22} height={22} />
              <span style={{ position: 'absolute', top: 0, right: 0, ...sz(18), borderRadius: 9, background: t.primary, color: t.onPrimary, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
            </span>
          </div>
        </Wrap>
      </Block>
    )
  }

  if (v === 'masthead') {
    return (
      <Block ctx={ctx} as="header" pad={0}>
        <Wrap m={m} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, minHeight: 52, fontSize: 13.5, color: c.muted }}>
          {m ? <MenuButton color={c.fg} /> : <span>{s.note}</span>}
          {!m && <span style={{ letterSpacing: '0.04em' }}>Edição digital · Nº 214</span>}
          <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {m ? <Search width={21} height={21} color={c.fg} /> : <span style={{ color: c.fg, fontWeight: 560 }}>Entrar</span>}
            {!m && s.cta && <Btn ctx={ctx} size="sm">{s.cta}</Btn>}
          </span>
        </Wrap>
        <Wrap m={m} style={{ textAlign: 'center', paddingTop: m ? 4 : 6, paddingBottom: m ? 14 : 22 }}>
          <div style={{ fontFamily: t.heading, fontWeight: 700, fontSize: m ? 34 : 76, lineHeight: 1, letterSpacing: '-0.035em', color: c.fg }}>{ctx.brand}</div>
        </Wrap>
        <Wrap m={m}>
          <div style={{ borderTop: `1px solid ${c.fg}`, borderBottom: `1px solid ${c.border}`, display: 'flex', justifyContent: m ? 'flex-start' : 'center', gap: m ? 20 : 34, padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: m ? 14 : 15, fontWeight: 560 }}>
            {links.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </Wrap>
      </Block>
    )
  }

  if (v === 'docs') {
    return (
      <Block ctx={ctx} as="header" pad={0} style={{ borderBottom: `1px solid ${c.border}` }}>
        <div style={{ ...bar, minHeight: 64, padding: `0 ${m ? 16 : 24}px` }}>
          <BrandMark ctx={ctx} size={17} />
          {s.note && <span style={{ fontSize: 12.5, fontWeight: 600, padding: '3px 8px', borderRadius: t.rSm, border: `1px solid ${c.border}`, color: c.muted }}>{s.note}</span>}
          {!m && (
            <div style={{ flex: '0 1 380px', marginLeft: 24, display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px', borderRadius: t.rMd, border: `1px solid ${c.border}`, background: c.surface, color: c.muted, fontSize: 14 }}>
              <Search width={16} height={16} />
              <span style={{ flex: 1 }}>Buscar na documentação…</span>
              <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 4, border: `1px solid ${c.border}`, fontFamily: t.mono }}>⌘K</span>
            </div>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: m ? 4 : 24 }}>
            {!m && <NavLinks ctx={ctx} links={links} gap={22} style={{ fontSize: 14.5 }} />}
            {m && <Search width={21} height={21} color={c.fg} />}
            {m && <MenuButton color={c.fg} />}
          </div>
        </div>
      </Block>
    )
  }

  if (v === 'centered' && !m) {
    const half = Math.ceil(links.length / 2)
    return (
      <Block ctx={ctx} as="header" pad={0} style={{ borderBottom: `1px solid ${c.border}` }}>
        <Wrap m={m} style={{ ...bar, display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}>
          <NavLinks ctx={ctx} links={links.slice(0, half)} />
          <BrandMark ctx={ctx} size={21} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 32 }}>
            <NavLinks ctx={ctx} links={links.slice(half)} />
            {s.cta && <Btn ctx={ctx} size="sm">{s.cta}</Btn>}
          </div>
        </Wrap>
      </Block>
    )
  }

  if (v === 'minimal') {
    return (
      <Block ctx={ctx} as="header" pad={0}>
        <Wrap m={m} style={bar}>
          <BrandMark ctx={ctx} size={m ? 17 : 20} />
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 28 }}>
            {!m && links.length > 0 && <NavLinks ctx={ctx} links={links} gap={28} />}
            {s.cta && (
              <Btn ctx={ctx} size="sm" kind={ctx.t.dark ? 'primary' : 'secondary'}>
                {m && s.cta.length > 16 ? s.cta.split(' ')[0] : s.cta}
              </Btn>
            )}
          </div>
        </Wrap>
      </Block>
    )
  }

  // split (padrão) e centered no celular
  return (
    <Block ctx={ctx} as="header" pad={0} style={{ borderBottom: `1px solid ${c.border}` }}>
      <Wrap m={m} style={bar}>
        <BrandMark ctx={ctx} size={m ? 17 : 20} />
        {!m && <NavLinks ctx={ctx} links={links} style={{ flex: 1, justifyContent: 'center' }} />}
        {!m && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {s.cta2 && (
              <Btn ctx={ctx} kind="ghost" size="sm">
                {s.cta2}
              </Btn>
            )}
            {s.cta && <Btn ctx={ctx} size="sm">{s.cta}</Btn>}
          </div>
        )}
        {m && (
          <div style={{ marginLeft: 'auto' }}>
            <MenuButton color={c.fg} />
          </div>
        )}
      </Wrap>
    </Block>
  )
}

/* ==================================== Heros ==================================== */

function NoteLine({ ctx, text, icon = 'check', color }: { ctx: RCtx; text: string; icon?: 'check' | 'star'; color?: string }) {
  const c = toneOf(ctx.t, ctx.s.tone)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: color ?? c.muted }}>
      {icon === 'star' ? <Stars color="#f5b301" size={14} /> : <Check width={16} height={16} color={c.accent} strokeWidth={2.4} />}
      {text}
    </span>
  )
}

export function HeroSplit({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const reverse = s.variant === 'reverse'
  const art = (
    <div style={{ height: m ? 300 : 480, minWidth: 0 }}>
      <Art kind={s.art ?? 'abstract'} t={t} seed={ctx.index} radius={t.rLg} />
    </div>
  )
  return (
    <Block ctx={ctx} pad={m ? 40 : 80}>
      <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : reverse ? '1fr 1.08fr' : '1.08fr 1fr', gap: m ? 36 : 64, alignItems: 'center' }}>
        {reverse && !m && art}
        <div style={{ display: 'grid', gap: m ? 18 : 22, justifyItems: 'start', minWidth: 0 }}>
          {s.eyebrow && (
            <Eyebrow ctx={ctx} pill>
              {s.eyebrow}
            </Eyebrow>
          )}
          <H ctx={ctx} level={1} size={m ? 36 : 58}>
            <Rich text={s.title ?? ''} color={c.accent} />
          </H>
          {s.text && (
            <P ctx={ctx} color={c.muted} size={m ? 16 : 18.5} style={{ maxWidth: 540 }}>
              {s.text}
            </P>
          )}
          <BtnRow ctx={ctx} style={{ marginTop: 6 }}>
            {s.cta && <Btn ctx={ctx} size="lg">{s.cta}</Btn>}
            {s.cta2 && (
              <Btn ctx={ctx} size="lg" kind="secondary">
                {s.cta2}
              </Btn>
            )}
          </BtnRow>
          {s.note && <NoteLine ctx={ctx} text={s.note} icon={/★/.test(s.note) ? 'star' : 'check'} />}
        </div>
        {(!reverse || m) && art}
      </Wrap>
    </Block>
  )
}

export function HeroCentered({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const avatars = s.variant === 'avatars'
  const names = ['Ana Lima', 'Bruno Sá', 'Carla Dias', 'Davi Rocha', 'Eva Nunes', 'Fábio Leal', 'Gabi Prado', 'Hugo Reis']
  return (
    <Block
      ctx={ctx}
      pad={m ? 56 : 96}
      style={{
        paddingBottom: avatars ? undefined : 0,
        background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${t.primarySoft}, ${c.bg} 70%)`,
      }}
    >
      <Wrap m={m} narrow={840} style={{ display: 'grid', gap: m ? 18 : 22, justifyItems: 'center', textAlign: 'center' }}>
        {s.eyebrow && (
          <Eyebrow ctx={ctx} pill>
            {avatars ? null : <span style={{ ...sz(7), borderRadius: 4, background: c.accent }} />}
            {s.eyebrow}
          </Eyebrow>
        )}
        <H ctx={ctx} level={1} size={m ? 36 : 66}>
          <Rich text={s.title ?? ''} color={c.accent} />
        </H>
        {s.text && (
          <P ctx={ctx} color={c.muted} size={m ? 16 : 19} style={{ maxWidth: 640 }}>
            {s.text}
          </P>
        )}
        <BtnRow ctx={ctx} center style={{ marginTop: 6 }}>
          {s.cta && <Btn ctx={ctx} size="lg">{s.cta}</Btn>}
          {s.cta2 && (
            <Btn ctx={ctx} size="lg" kind="secondary">
              {s.cta2}
            </Btn>
          )}
        </BtnRow>
        {avatars ? (
          <div style={{ display: 'grid', justifyItems: 'center', gap: 12, marginTop: 18 }}>
            <div style={{ display: 'flex' }}>
              {names.slice(0, m ? 6 : 8).map((n, i) => (
                <span key={n} style={{ marginLeft: i ? -12 : 0 }}>
                  <Avatar name={n} size={m ? 42 : 52} ring={c.bg} />
                </span>
              ))}
            </div>
            {s.note && <span style={{ fontSize: 15, color: c.muted, fontWeight: 520 }}>{s.note}</span>}
          </div>
        ) : (
          s.note && <span style={{ fontSize: 14, color: c.muted }}>{s.note}</span>
        )}
      </Wrap>
      {!avatars && (
        <Wrap m={m} narrow={1080} style={{ marginTop: m ? 40 : 64 }}>
          <div style={{ height: m ? 240 : 500, borderRadius: `${t.rLg}px ${t.rLg}px 0 0`, overflow: 'hidden', borderTop: `1px solid ${c.border}`, borderLeft: `1px solid ${c.border}`, borderRight: `1px solid ${c.border}`, boxShadow: '0 -8px 40px rgba(20,20,40,.08)' }}>
            <Art kind={s.art ?? 'ui'} t={t} style={{ minWidth: m ? 520 : undefined }} />
          </div>
        </Wrap>
      )}
    </Block>
  )
}

export function HeroImage({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const v = s.variant ?? 'left'
  const center = v === 'center'
  const booking = v === 'booking'
  const fields = items(ctx)
  const bookingBar = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: m ? '1fr' : `repeat(${fields.length}, minmax(0, 1fr)) auto`,
        gap: m ? 10 : 0,
        alignItems: 'stretch',
        background: m ? t.surface : '#ffffff',
        color: m ? t.text : '#1b1b1f',
        borderRadius: t.rLg,
        padding: m ? 16 : 10,
        boxShadow: '0 16px 40px rgba(0,0,0,.18)',
        border: m ? `1px solid ${t.border}` : undefined,
      }}
    >
      {fields.map((f, i) => (
        <div key={f.title} style={{ padding: m ? '10px 14px' : '8px 20px', ...sides(m ? `1px solid ${t.border}` : 'none', !m && i ? '1px solid #e6e6ea' : undefined), borderRadius: m ? t.rMd : 0, background: m ? t.bg : undefined }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>{f.title}</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{f.meta}</div>
        </div>
      ))}
      {s.cta && (
        <Btn ctx={ctx} size="lg" block={m} tone="bg" style={{ alignSelf: 'center' }}>
          {s.cta}
        </Btn>
      )}
    </div>
  )
  return (
    <Block ctx={ctx} pad={0} style={{ background: t.bg }}>
      <div style={{ position: 'relative', minHeight: m ? (booking ? 440 : 520) : 640, display: 'flex', alignItems: center ? 'center' : 'flex-end' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Art kind={s.art ?? 'landscape'} t={t} seed={ctx.index} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: center ? 'rgba(10,10,14,.46)' : 'linear-gradient(180deg, rgba(10,10,14,.08) 15%, rgba(10,10,14,.78) 100%)',
          }}
        />
        <Wrap m={m} style={{ position: 'relative', color: '#ffffff', paddingTop: m ? 48 : 80, paddingBottom: m ? 40 : booking ? 150 : 80 }}>
          <div style={{ display: 'grid', gap: m ? 16 : 20, maxWidth: center ? 760 : 640, margin: center ? '0 auto' : undefined, textAlign: center ? 'center' : 'left', justifyItems: center ? 'center' : 'start' }}>
            {s.eyebrow && <Eyebrow ctx={ctx} color="rgba(255,255,255,.88)">{s.eyebrow}</Eyebrow>}
            <H ctx={ctx} level={1} size={m ? 36 : center ? 68 : 62} style={{ color: '#ffffff' }}>
              <Rich text={s.title ?? ''} color={mix(t.primary, '#ffffff', 0.15)} />
            </H>
            {s.text && (
              <P ctx={ctx} size={m ? 16 : 19} color="rgba(255,255,255,.86)" style={{ maxWidth: 560 }}>
                {s.text}
              </P>
            )}
            {!booking && (s.cta || s.cta2) && (
              <BtnRow ctx={ctx} center={center} style={{ marginTop: 6 }}>
                {s.cta && (
                  <Btn ctx={ctx} size="lg" tone="bg">
                    {s.cta}
                  </Btn>
                )}
                {s.cta2 && (
                  <Btn ctx={ctx} size="lg" kind="secondary" style={WHITE_OUTLINE}>
                    {s.cta2}
                  </Btn>
                )}
              </BtnRow>
            )}
          </div>
        </Wrap>
        {booking && !m && (
          <Wrap m={m} style={{ position: 'absolute', left: 0, right: 0, bottom: 40 }}>
            {bookingBar}
          </Wrap>
        )}
      </div>
      {booking && m && (
        <Wrap m={m} style={{ marginTop: -24, position: 'relative', paddingBottom: 32 }}>
          {bookingBar}
        </Wrap>
      )}
    </Block>
  )
}

export function HeroEditorial({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const v = s.variant ?? 'statement'

  if (v === 'name') {
    const size = m ? 60 : Math.min(168, 1100 / Math.max(6, (s.title ?? '').length * 0.52))
    return (
      <Block ctx={ctx} pad={m ? 40 : 72}>
        <Wrap m={m} style={{ display: 'grid', gap: m ? 24 : 36 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, fontSize: 14, color: c.muted, borderBottom: `1px solid ${c.border}`, paddingBottom: 16 }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{s.eyebrow}</span>
            {s.note && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ ...sz(9), borderRadius: 5, background: '#22c55e' }} />
                {s.note}
              </span>
            )}
          </div>
          <div style={{ fontFamily: t.heading, fontWeight: headingWeight(t), fontSize: size, lineHeight: 0.92, letterSpacing: '-0.045em', overflowWrap: 'break-word' }}>
            <Rich text={s.title ?? ''} color={c.accent} />
            <span style={{ color: c.accent }}>.</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1.2fr 1fr', gap: m ? 24 : 64, alignItems: 'end' }}>
            <P ctx={ctx} size={m ? 17 : 22} style={{ maxWidth: 560, lineHeight: 1.5 }}>
              {s.text}
            </P>
            <div style={{ height: m ? 180 : 220 }}>
              <Art kind={s.art ?? 'abstract'} t={t} seed={ctx.index} radius={t.rLg} />
            </div>
          </div>
        </Wrap>
      </Block>
    )
  }

  if (v === 'classic') {
    return (
      <Block ctx={ctx} pad={m ? 48 : 88}>
        <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1.25fr 1fr', gap: m ? 36 : 72, alignItems: 'center' }}>
          <div style={{ display: 'grid', gap: m ? 18 : 24, justifyItems: 'start' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.accent, fontWeight: 600 }}>
              <span style={{ width: 36, height: 1, background: c.accent }} />
              {s.eyebrow}
            </span>
            <H ctx={ctx} level={1} size={m ? 34 : 56} style={{ fontWeight: 500 }}>
              <Rich text={s.title ?? ''} color={c.accent} italic />
            </H>
            <div style={{ width: '100%', height: 1, background: c.border }} />
            <P ctx={ctx} color={c.muted} size={m ? 16 : 18.5} style={{ maxWidth: 540 }}>
              {s.text}
            </P>
            <BtnRow ctx={ctx}>
              {s.cta && <Btn ctx={ctx} size="lg">{s.cta}</Btn>}
              <Btn ctx={ctx} size="lg" kind="ghost" style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}>
                Conheça o escritório
              </Btn>
            </BtnRow>
          </div>
          <div style={{ padding: 12, border: `1px solid ${c.border}`, height: m ? 320 : 500 }}>
            <Art kind={s.art ?? 'portrait'} t={t} seed={ctx.index + 2} radius={t.rLg} />
          </div>
        </Wrap>
      </Block>
    )
  }

  // statement
  const glow = s.art === 'blob'
  return (
    <Block ctx={ctx} pad={m ? 56 : 112}>
      {glow && (
        <div style={{ position: 'absolute', right: m ? -120 : -60, top: m ? -40 : -80, width: m ? 360 : 720, height: m ? 300 : 600, opacity: 0.75 }}>
          <Art kind="blob" t={t} style={{ background: 'transparent' }} />
        </div>
      )}
      <Wrap m={m} style={{ position: 'relative', display: 'grid', gap: m ? 20 : 28, justifyItems: 'start' }}>
        {s.eyebrow && (
          <Eyebrow ctx={ctx} pill>
            <span style={{ ...sz(7), borderRadius: 4, background: c.accent }} />
            {s.eyebrow}
          </Eyebrow>
        )}
        <H ctx={ctx} level={1} size={m ? 44 : 92} style={{ maxWidth: 1000, lineHeight: 0.98, letterSpacing: '-0.04em' }}>
          <Rich text={s.title ?? ''} color={c.accent} />
        </H>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr auto', gap: m ? 24 : 48, alignItems: 'end', width: '100%' }}>
          <P ctx={ctx} color={c.muted} size={m ? 16.5 : 19} style={{ maxWidth: 560 }}>
            {s.text}
          </P>
          <BtnRow ctx={ctx}>
            {s.cta && (
              <Btn ctx={ctx} size="lg" icon={undefined}>
                {s.cta} <ArrowRight width={18} height={18} />
              </Btn>
            )}
            {s.cta2 && (
              <Btn ctx={ctx} size="lg" kind="secondary">
                {s.cta2}
              </Btn>
            )}
          </BtnRow>
        </div>
        {!glow && (
          <div style={{ position: 'relative', width: '100%', height: m ? 220 : 400, marginTop: m ? 16 : 32 }}>
            <Art kind={s.art ?? 'abstract'} t={t} seed={ctx.index} radius={t.rLg} />
            <span style={{ position: 'absolute', left: m ? 16 : 32, bottom: m ? 16 : 32, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px 10px 10px', borderRadius: 999, background: c.accent, color: c.onAccent, fontWeight: 600, fontSize: 15 }}>
              <span style={{ ...sz(34), borderRadius: 17, background: c.onAccent, color: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play width={16} height={16} fill="currentColor" />
              </span>
              Showreel 2027
            </span>
          </div>
        )}
      </Wrap>
    </Block>
  )
}

function Countdown({ ctx, center }: { ctx: RCtx; center?: boolean }) {
  const { t, m } = ctx
  const c = toneOf(t, ctx.s.tone)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: m ? 8 : 14, maxWidth: m ? '100%' : 460, width: '100%', margin: center ? '0 auto' : undefined }}>
      {items(ctx).map((it) => (
        <div key={it.title} style={{ padding: m ? '12px 4px' : '16px 8px', borderRadius: t.rLg, border: `1px solid ${c.border}`, background: t.dark ? mix(c.bg, '#ffffff', 0.05) : '#ffffff', textAlign: 'center' }}>
          <div style={{ fontFamily: t.heading, fontWeight: 700, fontSize: m ? 26 : 38, lineHeight: 1, color: c.fg, fontVariantNumeric: 'tabular-nums' }}>{it.value}</div>
          <div style={{ fontSize: 12.5, marginTop: 6, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{it.title}</div>
        </div>
      ))}
    </div>
  )
}

export function HeroEvent({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const patternId = `tpl-grid-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const c = toneOf(t, s.tone)
  const chips = s.links ?? []

  if (s.variant === 'poster') {
    const lineup = items(ctx)
    return (
      <Block ctx={ctx} pad={m ? 48 : 80}>
        <svg aria-hidden="true" viewBox="0 0 1280 700" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <circle cx="1120" cy="120" r="200" fill={t.primary} />
          <path d="M-40 700 A 260 260 0 0 1 480 700 Z" fill={t.text} opacity="0.92" />
          <rect x="860" y="430" width="260" height="260" fill={mix(t.primary, '#f4a261', 0.5)} transform="rotate(14 990 560)" />
          <circle cx="760" cy="640" r="60" fill="none" stroke={t.text} strokeWidth="14" />
        </svg>
        <Wrap m={m} style={{ position: 'relative', display: 'grid', gap: m ? 18 : 26, justifyItems: 'start' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {chips.map((ch, i) => (
              <span key={ch} style={{ padding: '8px 16px', borderRadius: t.rSm === 0 ? 0 : 999, border: `2px solid ${c.fg}`, fontWeight: 650, fontSize: m ? 13.5 : 15, background: i === 0 ? c.fg : 'transparent', color: i === 0 ? c.bg : c.fg }}>
                {ch}
              </span>
            ))}
          </div>
          <div style={{ fontFamily: t.heading, fontWeight: 800, fontStyle: 'italic', fontSize: m ? 64 : 152, lineHeight: 0.86, letterSpacing: '-0.05em', maxWidth: 900, color: c.fg }}>{s.title}</div>
          <P ctx={ctx} size={m ? 17 : 21} style={{ maxWidth: 520, fontWeight: 500 }}>
            {s.text}
          </P>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: m ? '4px 12px' : '6px 18px', fontFamily: t.heading, fontWeight: 700, fontSize: m ? 19 : 28, maxWidth: 820 }}>
            {lineup.map((l, i) => (
              <span key={l.title} style={{ color: i === 0 ? t.primary : c.fg }}>
                {l.title}
                {i < lineup.length - 1 && <span style={{ color: t.primary, marginLeft: m ? 12 : 18 }}>✦</span>}
              </span>
            ))}
          </div>
          <BtnRow ctx={ctx} style={{ marginTop: 8 }}>
            {s.cta && <Btn ctx={ctx} size="lg">{s.cta}</Btn>}
            {s.cta2 && (
              <Btn ctx={ctx} size="lg" kind="secondary" style={{ background: c.bg }}>
                {s.cta2}
              </Btn>
            )}
          </BtnRow>
        </Wrap>
      </Block>
    )
  }

  return (
    <Block ctx={ctx} pad={m ? 56 : 104} style={{ background: `radial-gradient(ellipse 60% 70% at 50% 0%, ${mix(c.bg, t.primary, 0.28)}, ${c.bg} 72%)` }}>
      <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }}>
        <defs>
          <pattern id={patternId} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke={mix(c.bg, c.fg, 0.25)} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <Wrap m={m} narrow={900} style={{ position: 'relative', display: 'grid', gap: m ? 18 : 24, justifyItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
          {chips.map((ch, i) => (
            <Chip key={ch} ctx={ctx} style={{ background: mix(c.bg, '#ffffff', 0.06) }}>
              <Icon name={i === 0 ? 'calendar' : 'map'} size={15} color={t.primary} />
              {ch}
            </Chip>
          ))}
        </div>
        <H ctx={ctx} level={1} size={m ? 40 : 80} style={{ letterSpacing: '-0.035em' }}>
          <Rich text={s.title ?? ''} color={t.primary} />
        </H>
        <P ctx={ctx} color={c.muted} size={m ? 16 : 19} style={{ maxWidth: 620 }}>
          {s.text}
        </P>
        <Countdown ctx={ctx} center />
        <BtnRow ctx={ctx} center style={{ marginTop: 6 }}>
          {s.cta && <Btn ctx={ctx} size="lg">{s.cta}</Btn>}
          {s.cta2 && (
            <Btn ctx={ctx} size="lg" kind="secondary">
              {s.cta2}
            </Btn>
          )}
        </BtnRow>
      </Wrap>
    </Block>
  )
}

export function HeroSearch({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const fields = items(ctx)

  if (s.variant === 'split') {
    const tabs = s.links ?? []
    const card = (
      <div style={{ display: 'grid', gap: 14, padding: m ? 16 : 22, borderRadius: t.rLg, background: t.dark ? c.surface : '#ffffff', border: `1px solid ${c.border}`, boxShadow: '0 18px 40px rgba(20,20,40,.08)' }}>
        {tabs.length > 0 && (
          <div style={{ display: 'flex', gap: 6 }}>
            {tabs.map((tab, i) => (
              <Chip key={tab} ctx={ctx} active={i === 0}>
                {tab}
              </Chip>
            ))}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: 12 }}>
          {fields.map((f, i) => (
            <FakeInput key={f.title} ctx={ctx} label={f.title} placeholder={f.meta ?? ''} style={!m && i === 0 ? { gridColumn: '1 / -1' } : undefined} />
          ))}
        </div>
        {s.cta && (
          <Btn ctx={ctx} size="lg" block icon="search">
            {s.cta}
          </Btn>
        )}
      </div>
    )
    return (
      <Block ctx={ctx} pad={m ? 0 : 64} style={{ paddingBottom: m ? 40 : undefined }}>
        {m && (
          <div style={{ height: 220 }}>
            <Art kind={s.art ?? 'building'} t={t} seed={ctx.index} />
          </div>
        )}
        <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 24 : 56, alignItems: 'center', marginTop: m ? 28 : 0 }}>
          <div style={{ display: 'grid', gap: m ? 16 : 22 }}>
            <H ctx={ctx} level={1} size={m ? 34 : 54}>
              <Rich text={s.title ?? ''} color={c.accent} />
            </H>
            {s.text && (
              <P ctx={ctx} color={c.muted} size={m ? 16 : 18}>
                {s.text}
              </P>
            )}
            {card}
          </div>
          {!m && (
            <div style={{ height: 560 }}>
              <Art kind={s.art ?? 'building'} t={t} seed={ctx.index} radius={t.rLg} />
            </div>
          )}
        </Wrap>
      </Block>
    )
  }

  return (
    <Block ctx={ctx} pad={0}>
      <div style={{ position: 'relative', minHeight: m ? 520 : 600, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Art kind={s.art ?? 'landscape'} t={t} seed={ctx.index} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,14,30,.25), rgba(10,14,30,.6))' }} />
        <Wrap m={m} style={{ position: 'relative', display: 'grid', gap: m ? 16 : 22, justifyItems: 'center', textAlign: 'center', color: '#ffffff', paddingTop: m ? 40 : 72, paddingBottom: m ? 40 : 72 }}>
          <H ctx={ctx} level={1} size={m ? 38 : 72} style={{ color: '#ffffff' }}>
            <Rich text={s.title ?? ''} />
          </H>
          {s.text && (
            <P ctx={ctx} size={m ? 16 : 19} color="rgba(255,255,255,.88)">
              {s.text}
            </P>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: m ? '1fr' : `repeat(${fields.length}, minmax(0, 1fr)) auto`,
              gap: m ? 10 : 0,
              width: '100%',
              maxWidth: 900,
              marginTop: 12,
              padding: m ? 14 : 8,
              background: '#ffffff',
              color: '#1b1b1f',
              borderRadius: m ? t.rLg : Math.max(t.rLg, Math.min(t.rMd, 40)),
              boxShadow: '0 20px 50px rgba(0,0,0,.25)',
              textAlign: 'left',
            }}
          >
            {fields.map((f, i) => (
              <div key={f.title} style={{ padding: m ? '10px 12px' : '8px 22px', ...sides(m ? '1px solid #e6e6ea' : 'none', !m && i ? '1px solid #e6e6ea' : undefined), borderRadius: m ? t.rMd : 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 650, color: '#6b6b75' }}>{f.title}</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{f.meta}</div>
              </div>
            ))}
            {s.cta && (
              <Btn ctx={ctx} size="lg" icon="search" block={m} tone="bg" style={{ alignSelf: 'center' }}>
                {s.cta}
              </Btn>
            )}
          </div>
        </Wrap>
      </div>
    </Block>
  )
}

export function HeroProduct({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const specs = items(ctx)
  const spec = (i: number, align: 'left' | 'right' | 'center') =>
    specs[i] && (
      <div key={i} style={{ textAlign: align, padding: m ? '14px 8px' : '0', borderTop: m ? `1px solid ${c.border}` : undefined }}>
        <div style={{ fontFamily: t.heading, fontWeight: 700, fontSize: m ? 26 : 40, lineHeight: 1, color: c.fg }}>{specs[i].value}</div>
        <div style={{ fontSize: 14.5, color: c.muted, marginTop: 6 }}>{specs[i].title}</div>
      </div>
    )
  return (
    <Block ctx={ctx} pad={m ? 40 : 72} style={{ background: `radial-gradient(ellipse 50% 55% at 50% 62%, ${t.primarySoft}, ${c.bg} 70%)` }}>
      <Wrap m={m} style={{ display: 'grid', gap: m ? 16 : 20, justifyItems: 'center', textAlign: 'center' }}>
        {s.eyebrow && (
          <Eyebrow ctx={ctx} pill>
            {s.eyebrow}
          </Eyebrow>
        )}
        <H ctx={ctx} level={1} size={m ? 34 : 60} style={{ maxWidth: 820 }}>
          <Rich text={s.title ?? ''} color={c.accent} />
        </H>
        {s.text && (
          <P ctx={ctx} color={c.muted} size={m ? 16 : 18.5} style={{ maxWidth: 560 }}>
            {s.text}
          </P>
        )}
        {m ? (
          <>
            <div style={{ height: 280, width: '100%' }}>
              <Art kind={s.art ?? 'bottle'} t={t} style={{ background: 'transparent' }} />
            </div>
            <div style={{ ...grid(2, 0), width: '100%' }}>{[0, 1, 2, 3].map((i) => spec(i, 'center'))}</div>
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', alignItems: 'center', gap: 40, width: '100%', marginTop: 8 }}>
            <div style={{ display: 'grid', gap: 48 }}>{[0, 1].map((i) => spec(i, 'right'))}</div>
            <div style={{ height: 420 }}>
              <Art kind={s.art ?? 'bottle'} t={t} style={{ background: 'transparent' }} />
            </div>
            <div style={{ display: 'grid', gap: 48 }}>{[2, 3].map((i) => spec(i, 'left'))}</div>
          </div>
        )}
        {s.note && <div style={{ fontSize: m ? 16 : 18, fontWeight: 600, marginTop: 4 }}>{s.note}</div>}
        <BtnRow ctx={ctx} center>
          {s.cta && <Btn ctx={ctx} size="lg">{s.cta}</Btn>}
          {s.cta2 && (
            <Btn ctx={ctx} size="lg" kind="secondary">
              {s.cta2}
            </Btn>
          )}
        </BtnRow>
      </Wrap>
    </Block>
  )
}

function StoreBadge({ ctx, store }: { ctx: RCtx; store: 'apple' | 'google' }) {
  const { t } = ctx
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minHeight: 54, padding: '0 18px', borderRadius: Math.min(t.rMd, 14) === 999 ? 999 : Math.max(10, Math.min(t.rMd, 14)), background: '#111114', color: '#ffffff', flex: '1 1 0', maxWidth: 200 }}>
      {store === 'apple' ? <Smartphone width={22} height={22} /> : <Play width={22} height={22} fill="#ffffff" />}
      <span style={{ display: 'grid', lineHeight: 1.1, textAlign: 'left' }}>
        <span style={{ fontSize: 11, opacity: 0.8 }}>{store === 'apple' ? 'Baixar na' : 'Disponível no'}</span>
        <span style={{ fontSize: 17, fontWeight: 650 }}>{store === 'apple' ? 'App Store' : 'Google Play'}</span>
      </span>
    </span>
  )
}

export function HeroApp({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  return (
    <Block ctx={ctx} pad={m ? 44 : 72}>
      <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1.1fr 1fr', gap: m ? 32 : 56, alignItems: 'center' }}>
        <div style={{ display: 'grid', gap: m ? 18 : 24, justifyItems: m ? 'center' : 'start', textAlign: m ? 'center' : 'left' }}>
          <H ctx={ctx} level={1} size={m ? 38 : 64}>
            <Rich text={s.title ?? ''} color={c.accent} />
          </H>
          <P ctx={ctx} color={c.muted} size={m ? 16 : 19} style={{ maxWidth: 520 }}>
            {s.text}
          </P>
          <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: m ? 'center' : 'flex-start' }}>
            <StoreBadge ctx={ctx} store="apple" />
            <StoreBadge ctx={ctx} store="google" />
          </div>
          {s.note && <NoteLine ctx={ctx} text={s.note.replace('★', '').trim()} icon="star" />}
        </div>
        <div style={{ position: 'relative', height: m ? 380 : 540 }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: m ? 300 : 460, height: m ? 300 : 460, transform: 'translate(-50%, -50%)', borderRadius: '50%', background: t.primarySoft }} />
          {!m && (
            <div style={{ position: 'absolute', left: '8%', top: 40, width: '46%', height: 460, transform: 'rotate(-8deg)' }}>
              <Art kind="phone" t={t} seed={2} style={{ background: 'transparent' }} />
            </div>
          )}
          <div style={{ position: 'absolute', left: m ? '50%' : '44%', top: m ? 0 : 20, width: m ? 200 : '50%', height: m ? 380 : 500, transform: m ? 'translateX(-50%)' : undefined }}>
            <Art kind="phone" t={t} seed={1} style={{ background: 'transparent' }} />
          </div>
        </div>
      </Wrap>
    </Block>
  )
}

export function HeroCountdown({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  return (
    <Block ctx={ctx} pad={m ? 56 : 104} style={{ background: `radial-gradient(ellipse 60% 70% at 50% 10%, ${mix(c.bg, t.primary, 0.14)}, ${c.bg} 70%)` }}>
      <Wrap m={m} narrow={760} style={{ display: 'grid', gap: m ? 18 : 24, justifyItems: 'center', textAlign: 'center' }}>
        {s.eyebrow && (
          <Eyebrow ctx={ctx} pill>
            <span style={{ ...sz(7), borderRadius: 4, background: c.accent }} />
            {s.eyebrow}
          </Eyebrow>
        )}
        <H ctx={ctx} level={1} size={m ? 38 : 70}>
          <Rich text={s.title ?? ''} color={c.accent} italic />
        </H>
        <P ctx={ctx} color={c.muted} size={m ? 16 : 18.5} style={{ maxWidth: 560 }}>
          {s.text}
        </P>
        <Countdown ctx={ctx} center />
        <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 10, width: '100%', maxWidth: 520, marginTop: 8 }}>
          <FakeInput ctx={ctx} placeholder="seu@email.com" style={{ flex: 1 }} />
          {s.cta && (
            <Btn ctx={ctx} size="lg" block={m}>
              {s.cta}
            </Btn>
          )}
        </div>
        {s.note && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14.5, color: c.muted }}>
            <span style={{ display: 'flex' }}>
              {['Lia Prado', 'Rui Gomes', 'Ana Vaz', 'Téo Luz'].map((n, i) => (
                <span key={n} style={{ marginLeft: i ? -10 : 0 }}>
                  <Avatar name={n} size={32} ring={c.bg} />
                </span>
              ))}
            </span>
            {s.note}
          </div>
        )}
      </Wrap>
    </Block>
  )
}

/* =============================== Seções de conteúdo =============================== */

export function LogosSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)
  const color = mix(c.fg, c.bg, 0.45)
  return (
    <Block ctx={ctx} pad={m ? 40 : 56} style={{ borderTop: s.tone ? undefined : `1px solid ${c.border}`, borderBottom: s.tone ? undefined : `1px solid ${c.border}` }}>
      <Wrap m={m}>
        {s.title && <p style={{ margin: `0 0 ${m ? 22 : 28}px`, textAlign: 'center', fontSize: 14.5, color: c.muted, fontWeight: 520 }}>{s.title}</p>}
        <div style={m ? { ...grid(3, 20), justifyItems: 'center' } : { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', gap: 40 }}>
          {list.map((l, i) => (
            <span key={l.title} style={{ transform: m ? 'scale(.8)' : undefined, maxWidth: '100%' }}>
              <Wordmark name={l.title} index={i} color={color} font={t.heading} />
            </span>
          ))}
        </div>
      </Wrap>
    </Block>
  )
}

export function FeaturesGrid({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)
  const v = s.variant ?? 'cards'
  const cols = m ? 1 : colsFor(list.length)

  if (v === 'inline') {
    return (
      <Block ctx={ctx} pad={m ? 28 : 32}>
        <Wrap m={m} style={m ? grid(2, 20) : { display: 'flex', justifyContent: 'space-between', gap: 24 }}>
          {list.map((it) => (
            <div key={it.title} style={{ display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: m ? 'flex-start' : 'center', gap: m ? 8 : 14, minWidth: 0 }}>
              {it.icon && <Icon name={it.icon} size={26} color={c.accent} />}
              <div>
                <div style={{ fontWeight: 650, fontSize: 15.5 }}>{it.title}</div>
                {it.text && <div style={{ fontSize: 14, color: c.muted }}>{it.text}</div>}
              </div>
            </div>
          ))}
        </Wrap>
      </Block>
    )
  }

  return (
    <Block ctx={ctx}>
      <Wrap m={m}>
        <SectionHead ctx={ctx} center={v === 'icons' || v === 'cards'} />
        {v === 'numbered' && (
          <div style={grid(m ? 1 : list.length === 4 ? 2 : cols, m ? 0 : 40)}>
            {list.map((it, i) => (
              <div key={it.title} style={{ borderTop: `1px solid ${mix(c.bg, c.fg, 0.5)}`, padding: m ? '20px 0' : '24px 0 8px', display: 'grid', gridTemplateColumns: m ? '56px 1fr' : list.length === 4 ? '72px 1fr' : '1fr', gap: m ? 12 : 16 }}>
                <span style={{ fontFamily: t.heading, fontWeight: headingWeight(t), fontSize: m ? 28 : 40, lineHeight: 1, color: c.accent }}>{String(i + 1).padStart(2, '0')}</span>
                <div style={{ display: 'grid', gap: 8 }}>
                  <H ctx={ctx} level={3} size={m ? 19 : 22}>
                    {it.title}
                  </H>
                  {it.text && (
                    <P ctx={ctx} color={c.muted} size={15.5}>
                      {it.text}
                    </P>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {v === 'bordered' && (
          <div style={{ ...grid(cols, 0), borderTop: `1px solid ${c.border}`, borderLeft: `1px solid ${c.border}`, borderRadius: t.rLg, overflow: 'hidden' }}>
            {list.map((it) => (
              <div key={it.title} style={{ padding: m ? 24 : 36, borderRight: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}`, display: 'grid', gap: 12, alignContent: 'start' }}>
                {it.icon && <Icon name={it.icon} size={26} color={c.accent} />}
                <H ctx={ctx} level={3}>
                  {it.title}
                </H>
                {it.text && (
                  <P ctx={ctx} color={c.muted} size={15.5}>
                    {it.text}
                  </P>
                )}
              </div>
            ))}
          </div>
        )}
        {(v === 'cards' || v === 'icons') && (
          <div style={grid(cols, m ? 14 : v === 'icons' ? 40 : 20)}>
            {list.map((it) => (
              <div
                key={it.title}
                style={
                  v === 'cards'
                    ? { padding: m ? 22 : 28, borderRadius: t.rLg, border: `1px solid ${c.border}`, background: s.tone === 'surface' ? c.surface : t.dark ? c.surface : mix(c.bg, c.surface, 0.6), display: 'grid', gap: 12, alignContent: 'start' }
                    : { display: 'grid', gap: 12, alignContent: 'start', justifyItems: m ? 'start' : 'center', textAlign: m ? 'left' : 'center' }
                }
              >
                {it.icon && (
                  <span style={{ ...sz(v === 'icons' ? 56 : 46), borderRadius: v === 'icons' ? (t.rSm === 0 ? 0 : 999) : Math.min(t.rMd, 14), background: c.soft, color: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={it.icon} size={v === 'icons' ? 26 : 22} />
                  </span>
                )}
                <H ctx={ctx} level={3}>
                  {it.title}
                </H>
                {it.text && (
                  <P ctx={ctx} color={c.muted} size={15.5}>
                    {it.text}
                  </P>
                )}
              </div>
            ))}
          </div>
        )}
      </Wrap>
    </Block>
  )
}

function CheckList({ ctx, list, color }: { ctx: RCtx; list: string[]; color?: string }) {
  const c = toneOf(ctx.t, ctx.s.tone)
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
      {list.map((li) => (
        <li key={li} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15.5 }}>
          <Check width={18} height={18} color={color ?? c.accent} strokeWidth={2.5} style={{ flex: 'none', marginTop: 3 }} />
          <span>{li}</span>
        </li>
      ))}
    </ul>
  )
}

export function FeatureSplit({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  return (
    <Block ctx={ctx}>
      <Wrap m={m} style={{ display: 'grid', gap: m ? 48 : 96 }}>
        <SectionHead ctx={ctx} center style={{ marginBottom: 0 }} />
        {items(ctx).map((it, i) => {
          const art = (
            <div style={{ height: m ? 240 : 420, minWidth: 0 }}>
              <Art kind={it.art ?? 'abstract'} t={t} seed={ctx.index + i} radius={t.rLg} />
            </div>
          )
          const flip = !m && i % 2 === 1
          return (
            <div key={it.title} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 24 : 72, alignItems: 'center' }}>
              {!flip && art}
              <div style={{ display: 'grid', gap: m ? 14 : 18, minWidth: 0 }}>
                <H ctx={ctx} level={2} size={m ? 26 : 36}>
                  {it.title}
                </H>
                {it.text && (
                  <P ctx={ctx} color={c.muted}>
                    {it.text}
                  </P>
                )}
                {it.list && <CheckList ctx={ctx} list={it.list} />}
              </div>
              {flip && art}
            </div>
          )
        })}
      </Wrap>
    </Block>
  )
}

export function StepsSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)
  const circle = (i: number) => (
    <span style={{ ...sz(48), borderRadius: t.rSm === 0 ? 0 : 999, background: c.accent, color: c.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.heading, fontWeight: 700, fontSize: 19, position: 'relative', zIndex: 1 }}>
      {i + 1}
    </span>
  )
  return (
    <Block ctx={ctx}>
      <Wrap m={m}>
        <SectionHead ctx={ctx} center />
        {m ? (
          <div style={{ display: 'grid', gap: 0 }}>
            {list.map((it, i) => (
              <div key={it.title} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 16, position: 'relative', paddingBottom: i < list.length - 1 ? 28 : 0 }}>
                {i < list.length - 1 && <span style={{ position: 'absolute', left: 23, top: 48, bottom: 0, width: 2, background: c.border }} />}
                {circle(i)}
                <div style={{ display: 'grid', gap: 6, paddingTop: 10 }}>
                  <H ctx={ctx} level={3}>
                    {it.title}
                  </H>
                  {it.text && (
                    <P ctx={ctx} color={c.muted} size={15}>
                      {it.text}
                    </P>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ ...grid(list.length, 32), position: 'relative' }}>
            <span style={{ position: 'absolute', left: `${50 / list.length}%`, right: `${50 / list.length}%`, top: 23, height: 2, background: c.border }} />
            {list.map((it, i) => (
              <div key={it.title} style={{ display: 'grid', gap: 14, justifyItems: 'center', textAlign: 'center' }}>
                {circle(i)}
                <H ctx={ctx} level={3}>
                  {it.title}
                </H>
                {it.text && (
                  <P ctx={ctx} color={c.muted} size={15.5} style={{ maxWidth: 280 }}>
                    {it.text}
                  </P>
                )}
              </div>
            ))}
          </div>
        )}
      </Wrap>
    </Block>
  )
}

export function StatsSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)
  const cols = m ? 2 : list.length
  return (
    <Block ctx={ctx} pad={m ? 44 : 72}>
      <Wrap m={m}>
        <SectionHead ctx={ctx} center />
        <div style={grid(cols, 0)}>
          {list.map((it, i) => (
            <div
              key={it.title}
              style={{
                padding: m ? '18px 10px' : '8px 28px',
                borderLeft: !m && i ? `1px solid ${c.border}` : m && i % 2 ? `1px solid ${c.border}` : undefined,
                borderTop: m && i > 1 ? `1px solid ${c.border}` : undefined,
                textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: t.heading, fontWeight: 700, fontSize: m ? 32 : 54, lineHeight: 1, letterSpacing: '-0.03em', color: s.tone === 'primary' ? c.fg : c.accent === t.primary && !t.dark ? c.fg : c.accent }}>
                {it.value}
              </div>
              <div style={{ marginTop: 10, fontSize: m ? 14 : 15.5, color: c.muted }}>{it.title}</div>
            </div>
          ))}
        </div>
      </Wrap>
    </Block>
  )
}

function Scroller({ ctx, children, cols, gap = 20 }: { ctx: RCtx; children: ReactNode; cols: number; gap?: number }) {
  if (!ctx.m) return <div style={grid(cols, gap)}>{children}</div>
  return (
    <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '84%', gap: 14, overflowX: 'auto', scrollSnapType: 'x mandatory', margin: '0 -20px', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
      {children}
    </div>
  )
}

export function TestimonialsSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)

  if (s.variant === 'single') {
    const it = list[0]
    if (!it) return null
    return (
      <Block ctx={ctx} pad={m ? 56 : 104}>
        <Wrap m={m} narrow={880} style={{ display: 'grid', gap: m ? 20 : 28, justifyItems: m ? 'start' : 'center', textAlign: m ? 'left' : 'center' }}>
          <Quote width={m ? 36 : 48} height={m ? 36 : 48} color={c.accent} fill={c.accent} strokeWidth={0} />
          <blockquote style={{ margin: 0, fontFamily: t.heading, fontWeight: Math.min(headingWeight(t), 560), fontSize: m ? 23 : 34, lineHeight: 1.32, letterSpacing: '-0.015em' }}>“{it.text}”</blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar name={it.title} size={52} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 650 }}>{it.title}</div>
              <div style={{ fontSize: 14.5, color: c.muted }}>{it.meta}</div>
            </div>
          </div>
        </Wrap>
      </Block>
    )
  }

  const ratings = s.variant === 'ratings'
  const cardBg = s.tone === 'surface' ? c.surface : t.dark ? c.surface : mix(c.bg, t.surface, 0.7)
  return (
    <Block ctx={ctx}>
      <Wrap m={m}>
        <SectionHead ctx={ctx} center={ratings} />
        <Scroller ctx={ctx} cols={m ? 1 : colsFor(list.length)}>
          {list.map((it) => (
            <figure key={it.title} style={{ margin: 0, padding: m ? 22 : 28, borderRadius: t.rLg, border: `1px solid ${c.border}`, background: cardBg, display: 'grid', gap: 16, alignContent: 'space-between', scrollSnapAlign: 'start' }}>
              <div style={{ display: 'grid', gap: 12 }}>
                {ratings ? <Stars color="#f5b301" /> : <Quote width={28} height={28} color={c.accent} fill={c.accent} strokeWidth={0} />}
                {ratings && <div style={{ fontWeight: 650, fontSize: 17 }}>{it.title}</div>}
                <blockquote style={{ margin: 0, fontSize: m ? 15.5 : 16.5, lineHeight: 1.6 }}>{it.text}</blockquote>
              </div>
              {ratings ? (
                <figcaption style={{ fontSize: 14, color: c.muted }}>{it.meta}</figcaption>
              ) : (
                <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={it.title} size={44} />
                  <span style={{ display: 'grid' }}>
                    <span style={{ fontWeight: 650, fontSize: 15.5 }}>{it.title}</span>
                    <span style={{ fontSize: 14, color: c.muted }}>{it.meta}</span>
                  </span>
                </figcaption>
              )}
            </figure>
          ))}
        </Scroller>
      </Wrap>
    </Block>
  )
}

export function PricingSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)
  const cardBg = t.dark ? c.surface : s.tone === 'surface' ? c.surface : '#ffffff'

  if (s.variant === 'single') {
    const it = list[0]
    if (!it) return null
    return (
      <Block ctx={ctx}>
        <Wrap m={m} narrow={640}>
          <SectionHead ctx={ctx} center />
          <div style={{ position: 'relative', padding: m ? 24 : 40, borderRadius: t.rLg, border: `2px solid ${c.accent}`, background: cardBg, display: 'grid', gap: 18, textAlign: 'center', justifyItems: 'center' }}>
            {it.tag && <Eyebrow ctx={ctx} pill>{it.tag}</Eyebrow>}
            <div style={{ fontWeight: 600, fontSize: 18 }}>{it.title}</div>
            <div style={{ fontFamily: t.heading, fontWeight: 700, fontSize: m ? 44 : 60, lineHeight: 1, letterSpacing: '-0.03em' }}>{it.value}</div>
            <div style={{ color: c.muted, fontSize: 15.5 }}>{it.meta}</div>
            <div style={{ width: '100%', height: 1, background: c.border }} />
            <div style={{ textAlign: 'left', width: '100%', display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: 10 }}>
              {(it.list ?? []).map((li) => (
                <span key={li} style={{ display: 'flex', gap: 10, fontSize: 15.5 }}>
                  <Check width={18} height={18} color={c.accent} strokeWidth={2.5} style={{ flex: 'none', marginTop: 3 }} />
                  {li}
                </span>
              ))}
            </div>
            <Btn ctx={ctx} size="lg" block>
              Garantir minha vaga
            </Btn>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: c.muted }}>
              <Lock width={14} height={14} /> Pagamento seguro · acesso imediato
            </span>
          </div>
        </Wrap>
      </Block>
    )
  }

  if (s.variant === 'list') {
    return (
      <Block ctx={ctx}>
        <Wrap m={m} narrow={980}>
          <SectionHead ctx={ctx} />
          <div style={{ display: 'grid', gap: m ? 14 : 0, borderTop: m ? undefined : `1px solid ${c.border}` }}>
            {list.map((it) => (
              <div
                key={it.title}
                style={{
                  display: 'grid',
                  gridTemplateColumns: m ? '1fr' : '1.1fr 1.4fr auto',
                  gap: m ? 12 : 32,
                  alignItems: 'center',
                  padding: m ? 20 : '28px 20px',
                  ...(m ? sides(`1px solid ${it.highlight ? c.accent : c.border}`) : { ...sides('none'), borderBottom: `1px solid ${c.border}` }),
                  borderRadius: m ? t.rLg : 0,
                  background: it.highlight ? c.soft : undefined,
                }}
              >
                <div>
                  <H ctx={ctx} level={3} size={m ? 20 : 23}>
                    {it.title}
                  </H>
                  <div style={{ fontSize: 14.5, color: c.muted, marginTop: 4 }}>{it.text}</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', fontSize: 15 }}>
                  {(it.list ?? []).map((li) => (
                    <span key={li} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                      <Check width={16} height={16} color={c.accent} strokeWidth={2.5} />
                      {li}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: m ? 'space-between' : 'flex-end' }}>
                  <span style={{ fontFamily: t.heading, fontWeight: 700, fontSize: 24, whiteSpace: 'nowrap' }}>{it.value}</span>
                  <Btn ctx={ctx} size="sm" kind={it.highlight ? 'primary' : 'secondary'}>
                    Reservar
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </Block>
    )
  }

  const ordered = m ? [...list].sort((a, b) => Number(Boolean(b.highlight)) - Number(Boolean(a.highlight))) : list
  return (
    <Block ctx={ctx}>
      <Wrap m={m} narrow={list.length === 2 ? 820 : 1120}>
        <SectionHead ctx={ctx} center />
        <div style={{ ...grid(m ? 1 : list.length, 20), alignItems: 'stretch' }}>
          {ordered.map((it) => (
            <div
              key={it.title}
              style={{
                position: 'relative',
                padding: m ? 24 : 32,
                borderRadius: t.rLg,
                border: it.highlight ? `2px solid ${c.accent}` : `1px solid ${c.border}`,
                background: cardBg,
                display: 'grid',
                gap: 16,
                alignContent: 'start',
              }}
            >
              {it.tag && (
                <span style={{ position: 'absolute', top: -13, left: 24, padding: '4px 12px', borderRadius: t.rSm === 0 ? 0 : 999, background: c.accent, color: c.onAccent, fontSize: 12.5, fontWeight: 650 }}>{it.tag}</span>
              )}
              <div style={{ fontWeight: 650, fontSize: 18 }}>{it.title}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: t.heading, fontWeight: 700, fontSize: m ? 36 : 44, lineHeight: 1, letterSpacing: '-0.03em' }}>{it.value}</span>
                <span style={{ fontSize: 14.5, color: c.muted }}>{it.meta}</span>
              </div>
              {it.text && <div style={{ fontSize: 15, color: c.muted }}>{it.text}</div>}
              <div style={{ height: 1, background: c.border }} />
              {it.list && <CheckList ctx={ctx} list={it.list} />}
              <Btn ctx={ctx} block kind={it.highlight ? 'primary' : 'secondary'} style={{ marginTop: 8 }}>
                {it.value === 'Sob consulta' ? 'Falar com vendas' : 'Escolher plano'}
              </Btn>
            </div>
          ))}
        </div>
      </Wrap>
    </Block>
  )
}

export function FaqSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const split = s.variant === 'split' && !m
  const list = (
    <div style={{ borderTop: `1px solid ${c.border}` }}>
      {items(ctx).map((it, i) => (
        <div key={it.title} style={{ borderBottom: `1px solid ${c.border}`, padding: m ? '18px 0' : '22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, minHeight: 28 }}>
            <span style={{ fontWeight: 620, fontSize: m ? 16 : 17.5 }}>{it.title}</span>
            <span style={{ ...sz(32), borderRadius: t.rSm === 0 ? 0 : 999, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? c.accent : c.fg }}>
              {i === 0 ? <Minus width={16} height={16} /> : <Plus width={16} height={16} />}
            </span>
          </div>
          {i === 0 && it.text && (
            <P ctx={ctx} color={c.muted} size={15.5} style={{ marginTop: 10, maxWidth: 640 }}>
              {it.text}
            </P>
          )}
        </div>
      ))}
    </div>
  )
  return (
    <Block ctx={ctx}>
      <Wrap m={m} narrow={split ? 1120 : 780} style={split ? { display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 72, alignItems: 'start' } : undefined}>
        <SectionHead ctx={ctx} center={!split} />
        {list}
      </Wrap>
    </Block>
  )
}

export function GallerySection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)
  const v = s.variant ?? 'grid'

  let content: ReactNode
  if (v === 'masonry') {
    const ncols = m ? 2 : 3
    const heights = m ? [200, 150, 230, 170, 140, 210, 180, 160, 220] : [340, 260, 400, 300, 360, 240, 320, 280, 380]
    const columns = Array.from({ length: ncols }, (_, ci) => list.map((it, i) => ({ it, i })).filter(({ i }) => i % ncols === ci))
    content = (
      <div style={grid(ncols, m ? 10 : 16)}>
        {columns.map((colItems, ci) => (
          <div key={ci} style={{ display: 'grid', gap: m ? 10 : 16, alignContent: 'start' }}>
            {colItems.map(({ it, i }) => (
              <div key={it.title} style={{ height: heights[i % heights.length] }}>
                <Art kind={it.art ?? 'landscape'} t={t} seed={i} radius={t.rLg} label={it.title} />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  } else if (v === 'projects') {
    content = (
      <div style={grid(m ? 1 : 2, m ? 32 : 40)}>
        {list.map((it, i) => (
          <div key={it.title} style={{ display: 'grid', gap: 14, marginTop: !m && i % 2 === 1 ? 64 : 0 }}>
            <div style={{ height: m ? 250 : 440 }}>
              <Art kind={it.art ?? 'abstract'} t={t} seed={i + 1} radius={t.rLg} label={it.title} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <H ctx={ctx} level={3} size={m ? 19 : 22}>
                {it.title}
              </H>
              <span style={{ fontSize: 14.5, color: c.muted }}>{it.meta}</span>
            </div>
          </div>
        ))}
      </div>
    )
  } else if (v === 'phones') {
    content = m ? (
      <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '62%', gap: 16, overflowX: 'auto', margin: '0 -20px', padding: '0 20px', scrollbarWidth: 'none' }}>
        {list.map((it, i) => (
          <div key={it.title} style={{ display: 'grid', gap: 10, justifyItems: 'center' }}>
            <div style={{ height: 380, width: '100%' }}>
              <Art kind="phone" t={t} seed={i} style={{ background: 'transparent' }} />
            </div>
            <span style={{ fontWeight: 600 }}>{it.title}</span>
          </div>
        ))}
      </div>
    ) : (
      <div style={grid(list.length, 24)}>
        {list.map((it, i) => (
          <div key={it.title} style={{ display: 'grid', gap: 14, justifyItems: 'center', marginTop: i % 2 ? 40 : 0 }}>
            <div style={{ height: 440, width: '100%' }}>
              <Art kind="phone" t={t} seed={i} style={{ background: 'transparent' }} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 16 }}>{it.title}</span>
          </div>
        ))}
      </div>
    )
  } else if (v === 'categories') {
    content = (
      <div style={grid(m ? 2 : colsFor(list.length), m ? 12 : 20)}>
        {list.map((it, i) => (
          <div key={it.title} style={{ position: 'relative', aspectRatio: '3 / 4', borderRadius: t.rLg, overflow: 'hidden' }}>
            <Art kind={it.art ?? 'garment'} t={t} seed={i} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,.55))' }} />
            <span style={{ position: 'absolute', left: m ? 12 : 20, bottom: m ? 12 : 18, color: '#ffffff', fontFamily: t.heading, fontWeight: headingWeight(t), fontSize: m ? 18 : 24, display: 'flex', alignItems: 'center', gap: 6 }}>
              {it.title} <ArrowRight width={18} height={18} />
            </span>
          </div>
        ))}
      </div>
    )
  } else if (v === 'colors') {
    content = (
      <div style={grid(m ? 2 : colsFor(list.length), m ? 12 : 20)}>
        {list.map((it, i) => (
          <div key={it.title} style={{ display: 'grid', gap: 12, padding: m ? 12 : 20, borderRadius: t.rLg, border: `1px solid ${i === 0 ? c.accent : c.border}`, background: t.dark ? c.surface : '#ffffff', justifyItems: 'center' }}>
            <div style={{ height: m ? 160 : 240, width: '100%' }}>
              <Art kind="bottle" t={t} seed={i + 1} style={{ background: 'transparent' }} />
            </div>
            <span style={{ fontWeight: 600 }}>{it.title}</span>
          </div>
        ))}
      </div>
    )
  } else {
    content = (
      <div style={grid(m ? 2 : colsFor(list.length), m ? 10 : 16)}>
        {list.map((it, i) => (
          <div key={it.title} style={{ aspectRatio: '1 / 1' }}>
            <Art kind={it.art ?? 'landscape'} t={t} seed={i} radius={t.rLg} label={it.title} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <Block ctx={ctx}>
      <Wrap m={m}>
        <SectionHead ctx={ctx} center={v === 'phones' || v === 'colors'} />
        {content}
      </Wrap>
    </Block>
  )
}

export function TeamSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)

  if (s.variant === 'single') {
    const it = list[0]
    if (!it) return null
    return (
      <Block ctx={ctx}>
        <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '0.9fr 1.1fr', gap: m ? 28 : 64, alignItems: 'center' }}>
          <div style={{ height: m ? 320 : 460 }}>
            <Art kind="portrait" t={t} seed={ctx.index + 1} radius={t.rLg} label={it.title} />
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {s.title && <Eyebrow ctx={ctx}>{s.title}</Eyebrow>}
            <H ctx={ctx} level={2} size={m ? 30 : 44}>
              {it.title}
            </H>
            <span style={{ color: c.accent, fontWeight: 600 }}>{it.meta}</span>
            {it.text && <P ctx={ctx} color={c.muted}>{it.text}</P>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
              {(it.list ?? []).map((li) => (
                <Chip key={li} ctx={ctx}>
                  {li}
                </Chip>
              ))}
            </div>
          </div>
        </Wrap>
      </Block>
    )
  }

  if (s.variant === 'speakers') {
    return (
      <Block ctx={ctx}>
        <Wrap m={m}>
          <SectionHead ctx={ctx} center />
          <div style={grid(m ? 2 : 4, m ? 20 : 32)}>
            {list.map((it, i) => (
              <div key={it.title} style={{ display: 'grid', gap: 10, justifyItems: 'center', textAlign: 'center' }}>
                <div style={{ width: m ? 120 : 168, height: m ? 120 : 168, borderRadius: '50%', overflow: 'hidden', boxShadow: `0 0 0 4px ${c.bg}, 0 0 0 6px ${i % 3 === 0 ? t.primary : c.border}` }}>
                  <Art kind="portrait" t={t} seed={i} />
                </div>
                <span style={{ fontWeight: 650, fontSize: 16.5, marginTop: 6 }}>{it.title}</span>
                <span style={{ fontSize: 14, color: c.muted }}>{it.meta}</span>
              </div>
            ))}
          </div>
        </Wrap>
      </Block>
    )
  }

  const cols = m ? 2 : colsFor(list.length)
  return (
    <Block ctx={ctx}>
      <Wrap m={m} narrow={list.length <= 3 ? 960 : 1120}>
        <SectionHead ctx={ctx} />
        <div style={grid(cols, m ? 14 : 24)}>
          {list.map((it, i) => (
            <div key={it.title} style={{ display: 'grid', gap: 10 }}>
              <div style={{ aspectRatio: '4 / 5' }}>
                <Art kind="portrait" t={t} seed={i + ctx.index} radius={t.rLg} label={it.title} />
              </div>
              <span style={{ fontWeight: 650, fontSize: m ? 15.5 : 17, marginTop: 4 }}>{it.title}</span>
              <span style={{ fontSize: m ? 13.5 : 14.5, color: c.muted, marginTop: -6 }}>{it.meta}</span>
            </div>
          ))}
        </div>
      </Wrap>
    </Block>
  )
}

export function BlogList({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)
  const v = s.variant ?? 'cards'
  const kicker = (text?: string) => text && <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.accent }}>{text}</span>

  if (v === 'lead') {
    const [lead, ...rest] = list
    if (!lead) return null
    return (
      <Block ctx={ctx} pad={m ? 32 : 56}>
        <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1.7fr 1fr', gap: m ? 28 : 48 }}>
          <article style={{ display: 'grid', gap: 14 }}>
            <div style={{ height: m ? 220 : 420 }}>
              <Art kind={lead.art ?? 'city'} t={t} seed={1} radius={t.rLg} label={lead.title} />
            </div>
            {kicker(lead.meta)}
            <H ctx={ctx} level={1} size={m ? 28 : 46} style={{ lineHeight: 1.08 }}>
              {lead.title}
            </H>
            <P ctx={ctx} color={c.muted} size={m ? 16 : 19}>
              {lead.text}
            </P>
          </article>
          <div style={{ display: 'grid', alignContent: 'start' }}>
            {rest.map((it, i) => (
              <article key={it.title} style={{ padding: '20px 0', borderTop: `1px solid ${i === 0 ? c.fg : c.border}`, display: 'grid', gap: 8 }}>
                {kicker(it.meta)}
                <H ctx={ctx} level={3} size={m ? 19 : 22}>
                  {it.title}
                </H>
              </article>
            ))}
          </div>
        </Wrap>
      </Block>
    )
  }

  if (v === 'list') {
    return (
      <Block ctx={ctx} pad={m ? 44 : 64}>
        <Wrap m={m}>
          {s.title && (
            <div style={{ borderTop: `3px solid ${c.fg}`, paddingTop: 14, marginBottom: m ? 16 : 28 }}>
              <H ctx={ctx} level={2} size={m ? 24 : 30}>
                {s.title}
              </H>
            </div>
          )}
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, ...grid(m ? 1 : list.length, m ? 0 : 28) }}>
            {list.map((it, i) => (
              <li key={it.title} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 12, padding: m ? '14px 0' : 0, borderBottom: m ? `1px solid ${c.border}` : undefined }}>
                <span style={{ fontFamily: t.heading, fontWeight: 700, fontSize: 40, lineHeight: 1, color: c.accent }}>{i + 1}</span>
                <span style={{ display: 'grid', gap: 6 }}>
                  {kicker(it.meta)}
                  <span style={{ fontFamily: t.heading, fontWeight: 600, fontSize: 18, lineHeight: 1.3 }}>{it.title}</span>
                </span>
              </li>
            ))}
          </ol>
        </Wrap>
      </Block>
    )
  }

  if (v === 'episodes') {
    return (
      <Block ctx={ctx}>
        <Wrap m={m} narrow={960}>
          <SectionHead ctx={ctx} />
          <div style={{ display: 'grid', gap: 12 }}>
            {list.map((it, i) => (
              <div key={it.title} style={{ display: 'grid', gridTemplateColumns: m ? '56px 1fr 44px' : '72px 1fr auto 52px', gap: m ? 14 : 20, alignItems: 'center', padding: m ? 12 : 16, borderRadius: t.rLg, background: c.surface, border: `1px solid ${c.border}` }}>
                <div style={{ height: m ? 56 : 72 }}>
                  <Art kind="mic" t={t} seed={i} radius={Math.min(t.rMd, 14)} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 650, fontSize: m ? 15.5 : 17, whiteSpace: m ? 'normal' : 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
                  {!m && <div style={{ fontSize: 14.5, color: c.muted, marginTop: 2 }}>{it.text}</div>}
                  {m && <div style={{ fontSize: 13.5, color: c.muted, marginTop: 2 }}>{it.meta}</div>}
                </div>
                {!m && <span style={{ fontSize: 14, color: c.muted, fontVariantNumeric: 'tabular-nums' }}>{it.meta}</span>}
                <span style={{ ...sz(m ? 44 : 52), borderRadius: '50%', background: c.accent, color: c.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Ouvir">
                  <Play width={20} height={20} fill="currentColor" />
                </span>
              </div>
            ))}
          </div>
        </Wrap>
      </Block>
    )
  }

  if (v === 'threads') {
    return (
      <Block ctx={ctx}>
        <Wrap m={m} narrow={960}>
          <SectionHead ctx={ctx} />
          <div style={{ border: `1px solid ${c.border}`, borderRadius: t.rLg, overflow: 'hidden', background: t.dark ? c.surface : '#ffffff' }}>
            {list.map((it, i) => {
              const [replies, when] = (it.meta ?? '').split(' · ')
              return (
                <div key={it.title} style={{ display: 'grid', gridTemplateColumns: m ? '40px 1fr' : '44px 1fr auto', gap: m ? 12 : 16, alignItems: 'center', padding: m ? 14 : '18px 22px', borderTop: i ? `1px solid ${c.border}` : undefined }}>
                  <Avatar name={['Mel Andrade', 'Tito Nakamura', 'Rosa Lima', 'Caio Prado', 'Lena Dias'][i % 5]} size={m ? 40 : 44} />
                  <div style={{ minWidth: 0, display: 'grid', gap: 6 }}>
                    <span style={{ fontWeight: 620, fontSize: m ? 15 : 16.5 }}>{it.title}</span>
                    <span style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', fontSize: 13.5, color: c.muted }}>
                      {it.tag && <span style={{ padding: '2px 10px', borderRadius: t.rSm === 0 ? 0 : 999, background: c.soft, color: t.dark ? c.fg : mix(c.accent, '#000', 0.35), fontWeight: 600 }}>{it.tag}</span>}
                      {m ? it.meta : when}
                    </span>
                  </div>
                  {!m && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: c.muted }}>
                      <MessageCircle width={16} height={16} /> {replies}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </Wrap>
      </Block>
    )
  }

  return (
    <Block ctx={ctx}>
      <Wrap m={m}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
          <SectionHead ctx={ctx} />
          {!m && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, color: c.accent, marginBottom: 44 }}>Ver todas <ArrowRight width={16} height={16} /></span>}
        </div>
        <div style={grid(m ? 1 : colsFor(list.length), m ? 28 : 28)}>
          {list.map((it, i) => (
            <article key={it.title} style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
              <div style={{ aspectRatio: '16 / 10' }}>
                <Art kind={it.art ?? 'landscape'} t={t} seed={i} radius={t.rLg} label={it.title} />
              </div>
              {kicker(it.meta?.split(' · ')[0])}
              <H ctx={ctx} level={3} size={m ? 19 : 21}>
                {it.title}
              </H>
              {it.text && (
                <P ctx={ctx} color={c.muted} size={15.5}>
                  {it.text}
                </P>
              )}
              {it.meta?.includes(' · ') && <span style={{ fontSize: 13.5, color: c.muted }}>{it.meta.split(' · ')[1]}</span>}
            </article>
          ))}
        </div>
      </Wrap>
    </Block>
  )
}

export function ProductGrid({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)
  const swatches = ['#d8c3a5', '#2f3e46', '#b85c38']
  return (
    <Block ctx={ctx}>
      <Wrap m={m}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: m ? 20 : 32 }}>
          <H ctx={ctx} level={2} size={m ? 26 : 36}>
            {s.title}
          </H>
          {m ? (
            <Chip ctx={ctx}>
              <Icon name="settings" size={15} /> Filtrar
            </Chip>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Chip ctx={ctx} active>
                Todos
              </Chip>
              <Chip ctx={ctx}>Vestidos</Chip>
              <Chip ctx={ctx}>Calçados</Chip>
              <Chip ctx={ctx}>
                Ordenar <ChevronDown width={15} height={15} />
              </Chip>
            </div>
          )}
        </div>
        <div style={grid(m ? 2 : 4, m ? 12 : 24)}>
          {list.map((it, i) => (
            <div key={it.title} style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
              <div style={{ position: 'relative', aspectRatio: '4 / 5', borderRadius: t.rLg, overflow: 'hidden' }}>
                <Art kind={it.art ?? 'garment'} t={t} seed={i} label={it.title} />
                {it.tag && (
                  <span style={{ position: 'absolute', top: 10, left: 10, padding: '3px 10px', borderRadius: t.rSm, background: it.tag.startsWith('−') ? t.primary : '#ffffff', color: it.tag.startsWith('−') ? t.onPrimary : '#141414', fontSize: 12.5, fontWeight: 650 }}>{it.tag}</span>
                )}
                <span style={{ position: 'absolute', top: 8, right: 8, ...sz(34), borderRadius: 17, background: 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#141414' }}>
                  <Heart width={16} height={16} />
                </span>
              </div>
              <span style={{ fontSize: m ? 14 : 15.5, marginTop: 4 }}>{it.title}</span>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <strong style={{ fontSize: m ? 15 : 16.5 }}>{it.value}</strong>
                <span style={{ fontSize: 13, color: c.muted }}>{it.meta}</span>
              </span>
              <span style={{ display: 'flex', gap: 6 }}>
                {swatches.map((sw, si) => (
                  <span key={sw} style={{ ...sz(14), borderRadius: 7, background: si === 0 ? mix(sw, t.primary, (i % 3) * 0.3) : sw, boxShadow: `0 0 0 1px ${c.border}` }} />
                ))}
              </span>
            </div>
          ))}
        </div>
      </Wrap>
    </Block>
  )
}

export function ListingsSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)
  const v = s.variant ?? 'property'
  const cardBg = t.dark ? c.surface : '#ffffff'
  return (
    <Block ctx={ctx}>
      <Wrap m={m}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
          <SectionHead ctx={ctx} />
          {!m && s.cta && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, color: c.accent, marginBottom: 44, whiteSpace: 'nowrap' }}>{s.cta} <ArrowRight width={16} height={16} /></span>}
        </div>
        <div style={grid(m ? 1 : 3, m ? 18 : 24)}>
          {list.map((it, i) => {
            const parts = (it.meta ?? '').split(' · ')
            return (
              <article key={it.title} style={{ borderRadius: t.rLg, overflow: 'hidden', border: `1px solid ${c.border}`, background: cardBg, display: 'grid' }}>
                <div style={{ position: 'relative', aspectRatio: v === 'property' ? '16 / 10' : '4 / 3' }}>
                  <Art kind={it.art ?? 'building'} t={t} seed={i} label={it.title} />
                  {it.tag && (
                    <span style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: t.rSm, background: v === 'trips' ? 'rgba(17,17,20,.72)' : t.primary, color: v === 'trips' ? '#ffffff' : t.onPrimary, fontSize: 12.5, fontWeight: 650 }}>{it.tag}</span>
                  )}
                  {v === 'property' && (
                    <span style={{ position: 'absolute', top: 10, right: 10, ...sz(34), borderRadius: 17, background: 'rgba(255,255,255,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#141414' }}>
                      <Heart width={16} height={16} />
                    </span>
                  )}
                </div>
                <div style={{ padding: m ? 16 : 20, display: 'grid', gap: 8 }}>
                  {v === 'property' ? (
                    <>
                      <span style={{ fontFamily: t.heading, fontWeight: 700, fontSize: 23, color: c.fg }}>{it.value}</span>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{it.title}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: c.muted }}>
                        <MapPin width={15} height={15} /> {parts[0]}
                      </span>
                      <span style={{ display: 'flex', gap: 16, fontSize: 14, color: c.muted, borderTop: `1px solid ${c.border}`, paddingTop: 12, marginTop: 4, flexWrap: 'wrap' }}>
                        {parts.slice(1).map((p, pi) => (
                          <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            {pi === 0 ? <BedDouble width={16} height={16} /> : pi === 1 ? <Bath width={16} height={16} /> : <Ruler width={16} height={16} />}
                            {p}
                          </span>
                        ))}
                      </span>
                    </>
                  ) : v === 'rooms' ? (
                    <>
                      <H ctx={ctx} level={3} size={20}>
                        {it.title}
                      </H>
                      <span style={{ fontSize: 14.5, color: c.muted }}>{it.meta}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 8 }}>
                        <span>
                          <strong style={{ fontSize: 20 }}>{it.value}</strong> <span style={{ fontSize: 14, color: c.muted }}>/ noite</span>
                        </span>
                        <Btn ctx={ctx} size="sm">
                          Reservar
                        </Btn>
                      </div>
                    </>
                  ) : (
                    <>
                      <H ctx={ctx} level={3} size={20}>
                        {it.title}
                      </H>
                      <span style={{ fontSize: 14.5, color: c.muted }}>{it.meta}</span>
                      <span style={{ fontSize: 14, color: c.muted, marginTop: 6 }}>
                        a partir de <strong style={{ fontSize: 20, color: c.fg }}>{it.value}</strong> por pessoa
                      </span>
                    </>
                  )}
                </div>
              </article>
            )
          })}
        </div>
        {m && s.cta && (
          <Btn ctx={ctx} kind="secondary" block style={{ marginTop: 20 }}>
            {s.cta}
          </Btn>
        )}
      </Wrap>
    </Block>
  )
}

export function MenuSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)
  const tabs = s.links ?? []

  if (s.variant === 'cards') {
    return (
      <Block ctx={ctx}>
        <Wrap m={m}>
          <SectionHead ctx={ctx} center />
          <div style={grid(m ? 1 : 3, m ? 14 : 20)}>
            {list.map((it, i) => (
              <div key={it.title} style={{ display: 'grid', gridTemplateColumns: m ? '88px 1fr' : '1fr', gap: m ? 14 : 0, alignItems: 'center', borderRadius: t.rLg, overflow: 'hidden', border: `1px solid ${c.border}`, background: t.dark ? c.surface : t.surface }}>
                <div style={{ height: m ? 88 : 170, position: 'relative' }}>
                  <Art kind={it.art ?? 'coffee'} t={t} seed={i} />
                  {it.tag && !m && <span style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', borderRadius: t.rSm, background: t.primary, color: t.onPrimary, fontSize: 12.5, fontWeight: 650 }}>{it.tag}</span>}
                </div>
                <div style={{ padding: m ? '10px 14px 10px 0' : 20, display: 'grid', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: t.heading, fontWeight: headingWeight(t), fontSize: m ? 17 : 19 }}>{it.title}</span>
                    <strong style={{ color: t.dark ? c.fg : c.accent, whiteSpace: 'nowrap' }}>{it.meta}</strong>
                  </div>
                  <span style={{ fontSize: 14.5, color: c.muted }}>{it.text}</span>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </Block>
    )
  }

  return (
    <Block ctx={ctx}>
      <Wrap m={m} narrow={1000}>
        <SectionHead ctx={ctx} center />
        {tabs.length > 0 && (
          <div style={{ display: 'flex', justifyContent: m ? 'flex-start' : 'center', gap: 8, marginBottom: m ? 24 : 40, overflow: 'hidden', flexWrap: m ? 'nowrap' : 'wrap' }}>
            {tabs.map((tab, i) => (
              <Chip key={tab} ctx={ctx} active={i === 1}>
                {tab}
              </Chip>
            ))}
          </div>
        )}
        <div style={grid(m ? 1 : 2, m ? 22 : 30)}>
          {list.map((it) => (
            <div key={it.title} style={{ display: 'grid', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: t.heading, fontWeight: headingWeight(t), fontSize: m ? 18 : 20, color: it.highlight ? c.accent : c.fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</span>
                {it.tag && <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 8px', borderRadius: t.rSm, border: `1px solid ${c.accent}`, color: c.accent, whiteSpace: 'nowrap' }}>{it.tag}</span>}
                <span style={{ flex: 1, borderBottom: `2px dotted ${c.border}`, minWidth: 20, transform: 'translateY(-4px)' }} />
                <span style={{ fontWeight: 650, fontSize: m ? 16 : 17, whiteSpace: 'nowrap' }}>{it.meta}</span>
              </div>
              <span style={{ fontSize: 15, color: c.muted }}>{it.text}</span>
            </div>
          ))}
        </div>
      </Wrap>
    </Block>
  )
}

export function ScheduleSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const list = items(ctx)
  const tabs = s.links ?? []
  const v = s.variant ?? 'agenda'
  const tabRow = tabs.length > 0 && (
    <div style={{ display: 'flex', gap: 8, marginBottom: m ? 18 : 28, overflow: 'hidden' }}>
      {tabs.map((tab, i) => (
        <Chip key={tab} ctx={ctx} active={i === 0}>
          {tab}
        </Chip>
      ))}
    </div>
  )

  if (v === 'weekly') {
    const days = tabs
    if (m) {
      return (
        <Block ctx={ctx}>
          <Wrap m={m}>
            <SectionHead ctx={ctx} />
            {tabRow}
            <div style={{ display: 'grid', gap: 10 }}>
              {list.map((row) => (
                <div key={row.title} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 14, borderRadius: t.rLg, border: `1px solid ${c.border}`, background: c.surface }}>
                  <span style={{ fontFamily: t.heading, fontWeight: 700, fontSize: 18, minWidth: 56 }}>{row.title}</span>
                  <span style={{ fontWeight: 600 }}>{row.list?.[0]}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 13.5, color: c.muted }}>50 min</span>
                </div>
              ))}
            </div>
          </Wrap>
        </Block>
      )
    }
    return (
      <Block ctx={ctx}>
        <Wrap m={m}>
          <SectionHead ctx={ctx} />
          <div style={{ border: `1px solid ${c.border}`, borderRadius: t.rLg, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${days.length}, minmax(0, 1fr))`, background: c.surface, fontWeight: 650, fontSize: 14.5 }}>
              <span style={{ padding: 14 }} />
              {days.map((d) => (
                <span key={d} style={{ padding: 14, borderLeft: `1px solid ${c.border}` }}>
                  {d}
                </span>
              ))}
            </div>
            {list.map((row) => (
              <div key={row.title} style={{ display: 'grid', gridTemplateColumns: `100px repeat(${days.length}, minmax(0, 1fr))`, borderTop: `1px solid ${c.border}` }}>
                <span style={{ padding: 14, fontFamily: t.heading, fontWeight: 700 }}>{row.title}</span>
                {(row.list ?? []).map((cls, ci) => (
                  <span key={ci} style={{ padding: 10, borderLeft: `1px solid ${c.border}` }}>
                    {cls === '—' ? (
                      <span style={{ color: c.muted }}>—</span>
                    ) : (
                      <span style={{ display: 'block', padding: '8px 10px', borderRadius: t.rSm === 999 ? 10 : t.rSm, background: cls === 'Spinning' || cls === 'Cross' ? c.accent : c.surface, color: cls === 'Spinning' || cls === 'Cross' ? c.onAccent : c.fg, fontSize: 14, fontWeight: 600 }}>{cls}</span>
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Wrap>
      </Block>
    )
  }

  if (v === 'modules') {
    return (
      <Block ctx={ctx}>
        <Wrap m={m} narrow={860}>
          <SectionHead ctx={ctx} center />
          <div style={{ display: 'grid', gap: 12 }}>
            {list.map((it, i) => (
              <div key={it.title} style={{ borderRadius: t.rLg, border: `1px solid ${i === 0 ? c.accent : c.border}`, background: t.dark ? c.surface : '#ffffff', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: m ? 16 : '18px 22px' }}>
                  <span style={{ ...sz(36), borderRadius: Math.min(t.rMd, 12), background: i === 0 ? c.accent : c.soft, color: i === 0 ? c.onAccent : c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{i + 1}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 650, fontSize: m ? 15.5 : 17 }}>{it.title}</span>
                    <span style={{ fontSize: 13.5, color: c.muted }}>{it.meta}</span>
                  </span>
                  {i === 0 ? <Minus width={18} height={18} /> : <Plus width={18} height={18} />}
                </div>
                {i === 0 && it.list && (
                  <div style={{ borderTop: `1px solid ${c.border}`, padding: m ? '8px 16px' : '8px 22px' }}>
                    {it.list.map((li) => (
                      <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', fontSize: 15 }}>
                        <Play width={14} height={14} color={c.accent} fill={c.accent} />
                        <span style={{ flex: 1 }}>{li}</span>
                        <span style={{ fontSize: 13.5, color: c.muted }}>8 min</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Wrap>
      </Block>
    )
  }

  if (v === 'events') {
    return (
      <Block ctx={ctx}>
        <Wrap m={m} narrow={960}>
          <SectionHead ctx={ctx} />
          <div style={{ display: 'grid', gap: 12 }}>
            {list.map((it) => {
              const [day, month] = (it.meta ?? '').split(' ')
              return (
                <div key={it.title} style={{ display: 'grid', gridTemplateColumns: m ? '64px 1fr' : '76px 1fr auto', gap: m ? 14 : 22, alignItems: 'center', padding: m ? 14 : 18, borderRadius: t.rLg, border: `1px solid ${c.border}` }}>
                  <span style={{ display: 'grid', justifyItems: 'center', padding: '10px 0', borderRadius: Math.min(t.rMd, 14), background: c.soft, color: t.dark ? c.fg : mix(c.accent, '#000', 0.35) }}>
                    <strong style={{ fontFamily: t.heading, fontSize: 26, lineHeight: 1 }}>{day}</strong>
                    <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.08em' }}>{month}</span>
                  </span>
                  <span style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                    <span style={{ fontWeight: 650, fontSize: m ? 16 : 18 }}>{it.title}</span>
                    <span style={{ fontSize: 14, color: c.muted }}>{it.text}</span>
                    {m && (
                      <Btn ctx={ctx} size="sm" kind="secondary" style={{ justifySelf: 'start', marginTop: 4 }}>
                        Participar
                      </Btn>
                    )}
                  </span>
                  {!m && (
                    <Btn ctx={ctx} size="sm" kind="secondary">
                      Participar
                    </Btn>
                  )}
                </div>
              )
            })}
          </div>
        </Wrap>
      </Block>
    )
  }

  if (v === 'lineup') {
    return (
      <Block ctx={ctx}>
        <Wrap m={m} narrow={960}>
          <SectionHead ctx={ctx} />
          {tabRow}
          <div style={{ borderTop: `2px solid ${c.fg}` }}>
            {list.map((it) => (
              <div key={it.title} style={{ display: 'grid', gridTemplateColumns: m ? '64px 1fr' : '110px 1fr auto', gap: m ? 12 : 24, alignItems: 'center', padding: m ? '16px 0' : '20px 0', borderBottom: `1px solid ${c.border}` }}>
                <span style={{ fontFamily: t.heading, fontWeight: 700, fontSize: m ? 17 : 22, fontVariantNumeric: 'tabular-nums' }}>{it.meta}</span>
                <span style={{ display: 'grid', gap: 2 }}>
                  <span style={{ fontFamily: t.heading, fontWeight: 800, fontSize: m ? (it.highlight ? 24 : 20) : it.highlight ? 38 : 28, letterSpacing: '-0.02em', color: it.highlight ? t.primary : c.fg, lineHeight: 1.1 }}>{it.title}</span>
                  {m && <span style={{ fontSize: 13.5, color: c.muted }}>{it.text}</span>}
                </span>
                {!m && <span style={{ fontSize: 14.5, fontWeight: 600, color: c.muted }}>{it.text}</span>}
              </div>
            ))}
          </div>
        </Wrap>
      </Block>
    )
  }

  // agenda
  return (
    <Block ctx={ctx}>
      <Wrap m={m} narrow={980}>
        <SectionHead ctx={ctx} />
        {tabRow}
        <div style={{ display: 'grid', gap: m ? 10 : 0, borderTop: m ? undefined : `1px solid ${c.border}` }}>
          {list.map((it) => (
            <div
              key={it.title}
              style={{
                display: 'grid',
                gridTemplateColumns: m ? '1fr' : '100px 1fr auto',
                gap: m ? 6 : 24,
                alignItems: 'center',
                padding: m ? 16 : '20px 16px',
                ...(m ? sides(`1px solid ${it.highlight ? t.primary : c.border}`) : { ...sides('none'), borderBottom: `1px solid ${c.border}` }),
                borderRadius: m ? t.rLg : 0,
                background: it.highlight ? mix(c.bg, t.primary, 0.12) : undefined,
              }}
            >
              <span style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 15, color: it.highlight ? t.primary : c.muted }}>{it.meta}</span>
              <span style={{ fontWeight: 650, fontSize: m ? 16.5 : 18 }}>{it.title}</span>
              <span style={{ fontSize: 14, color: c.muted }}>{it.text}</span>
            </div>
          ))}
        </div>
      </Wrap>
    </Block>
  )
}

function MapArt({ ctx }: { ctx: RCtx }) {
  const { t } = ctx
  const land = t.dark ? mix(t.bg, '#ffffff', 0.08) : '#eef0ea'
  const road = t.dark ? mix(t.bg, '#ffffff', 0.18) : '#ffffff'
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-label="Mapa ilustrativo" role="img" style={{ display: 'block', borderRadius: t.rLg }}>
      <rect width="400" height="300" fill={land} />
      <rect x="250" y="30" width="110" height="80" rx="8" fill={t.dark ? '#24402f' : '#cfe3c9'} />
      <path d="M0 230 C 80 210, 140 260, 220 240 S 340 200, 400 214 V 300 H 0 Z" fill={t.dark ? '#1d3a4f' : '#bcd8e8'} />
      {[60, 140, 220, 320].map((x) => (
        <rect key={x} x={x} y="0" width="12" height="300" fill={road} />
      ))}
      {[50, 130, 190].map((y) => (
        <rect key={y} x="0" y={y} width="400" height="12" fill={road} />
      ))}
      <path d="M0 20 L 400 160" stroke={t.dark ? mix(t.bg, '#ffffff', 0.28) : '#ffe7a3'} strokeWidth="14" />
      <circle cx="206" cy="146" r="34" fill={t.primary} opacity="0.18" />
      <path d="M206 108 c -16 0 -26 12 -26 26 c 0 20 26 42 26 42 s 26 -22 26 -42 c 0 -14 -10 -26 -26 -26 z" fill={t.primary} />
      <circle cx="206" cy="134" r="9" fill={t.onPrimary} />
    </svg>
  )
}

export function ContactSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const info = items(ctx)
  const infoList = (
    <div style={{ display: 'grid', gap: 18 }}>
      {info.map((it) => (
        <div key={it.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {it.icon && (
            <span style={{ ...sz(42), borderRadius: Math.min(t.rMd, 14), background: c.soft, color: t.dark ? c.fg : c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={it.icon} size={19} />
            </span>
          )}
          <span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 13.5, color: c.muted, fontWeight: 600 }}>{it.title}</span>
            <span style={{ fontSize: 16, fontWeight: 560, overflowWrap: 'anywhere' }}>{it.meta}</span>
          </span>
        </div>
      ))}
    </div>
  )

  if (s.variant === 'simple') {
    return (
      <Block ctx={ctx} pad={m ? 64 : 120}>
        <Wrap m={m} style={{ display: 'grid', gap: m ? 20 : 28, justifyItems: 'center', textAlign: 'center' }}>
          <H ctx={ctx} level={2} size={m ? 36 : 72} style={{ letterSpacing: '-0.035em' }}>
            <Rich text={s.title ?? ''} color={c.accent} />
          </H>
          {s.cta && (
            <span style={{ fontFamily: t.heading, fontSize: m ? 21 : 34, fontWeight: 560, color: c.accent, textDecoration: 'underline', textUnderlineOffset: 8, textDecorationThickness: 2, overflowWrap: 'anywhere' }}>{s.cta}</span>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 8 }}>
            {(s.links ?? []).map((l) => (
              <Chip key={l} ctx={ctx}>
                {l} <ArrowRight width={14} height={14} style={{ transform: 'rotate(-45deg)' }} />
              </Chip>
            ))}
          </div>
        </Wrap>
      </Block>
    )
  }

  if (s.variant === 'location') {
    return (
      <Block ctx={ctx}>
        <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1.2fr 1fr', gap: m ? 28 : 64, alignItems: 'center' }}>
          <div style={{ height: m ? 240 : 400, order: m ? 2 : 0 }}>
            <MapArt ctx={ctx} />
          </div>
          <div style={{ display: 'grid', gap: m ? 20 : 26 }}>
            <H ctx={ctx} level={2} size={m ? 28 : 40}>
              {s.title}
            </H>
            {infoList}
            {s.cta && (
              <Btn ctx={ctx} size="lg" block={m} style={{ justifySelf: 'start' }}>
                {s.cta}
              </Btn>
            )}
          </div>
        </Wrap>
      </Block>
    )
  }

  return (
    <Block ctx={ctx}>
      <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1.15fr', gap: m ? 32 : 72, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 24 }}>
          <SectionHead ctx={ctx} style={{ marginBottom: 0 }} />
          {infoList}
        </div>
        <div style={{ display: 'grid', gap: 14, padding: m ? 20 : 32, borderRadius: t.rLg, border: `1px solid ${c.border}`, background: t.dark ? c.surface : s.tone === 'surface' ? c.surface : '#ffffff' }}>
          <div style={grid(m ? 1 : 2, 14)}>
            <FakeInput ctx={ctx} label="Nome" placeholder="Seu nome completo" />
            <FakeInput ctx={ctx} label="E-mail" placeholder="voce@email.com" />
          </div>
          <FakeInput ctx={ctx} label="Telefone" placeholder="(00) 00000-0000" />
          <div style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>Mensagem</span>
            <div style={{ height: 120, borderRadius: t.rMd === 999 ? 20 : t.rMd, border: `1.5px solid ${mix(c.bg, c.fg, 0.2)}`, background: t.dark ? mix(c.bg, '#ffffff', 0.05) : '#ffffff', padding: '12px 16px', color: c.muted, fontSize: 15 }}>Conte um pouco sobre o que você precisa…</div>
          </div>
          {s.cta && (
            <Btn ctx={ctx} size="lg" block>
              {s.cta}
            </Btn>
          )}
        </div>
      </Wrap>
    </Block>
  )
}

export function NewsletterSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  return (
    <Block ctx={ctx} pad={m ? 48 : 72}>
      <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1.1fr 1fr', gap: m ? 20 : 56, alignItems: 'center' }}>
        <div style={{ display: 'grid', gap: 10 }}>
          <H ctx={ctx} level={2} size={m ? 26 : 34}>
            <Rich text={s.title ?? ''} color={c.accent} />
          </H>
          {s.text && (
            <P ctx={ctx} color={c.muted}>
              {s.text}
            </P>
          )}
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 10 }}>
            <FakeInput ctx={ctx} placeholder="seu@email.com" style={{ flex: 1 }} />
            {s.cta && (
              <Btn ctx={ctx} size="lg" block={m}>
                {s.cta}
              </Btn>
            )}
          </div>
          {s.note && <span style={{ fontSize: 13.5, color: c.muted }}>{s.note}</span>}
        </div>
      </Wrap>
    </Block>
  )
}

export function CtaBand({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const inner = (
    <div style={{ display: 'grid', gap: m ? 16 : 20, justifyItems: 'center', textAlign: 'center', position: 'relative' }}>
      <H ctx={ctx} level={2} size={m ? 30 : 50} style={{ maxWidth: 800 }}>
        <Rich text={s.title ?? ''} color={s.tone === 'primary' ? undefined : c.accent} />
      </H>
      {s.text && (
        <P ctx={ctx} color={c.muted} size={m ? 16 : 18.5} style={{ maxWidth: 560 }}>
          {s.text}
        </P>
      )}
      <BtnRow ctx={ctx} center style={{ marginTop: 8 }}>
        {s.cta && <Btn ctx={ctx} size="lg">{s.cta}</Btn>}
        {s.cta2 && (
          <Btn ctx={ctx} size="lg" kind="secondary">
            {s.cta2}
          </Btn>
        )}
      </BtnRow>
    </div>
  )
  if (s.tone === 'primary') {
    return (
      <Block ctx={ctx} pad={m ? 56 : 96}>
        <Wrap m={m}>{inner}</Wrap>
      </Block>
    )
  }
  return (
    <Block ctx={ctx} pad={m ? 40 : 72}>
      <Wrap m={m}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: m ? '40px 20px' : '72px 48px',
            borderRadius: t.rLg,
            border: `1px solid ${c.border}`,
            background: t.dark
              ? `radial-gradient(ellipse 60% 90% at 50% 0%, ${mix(c.bg, t.primary, 0.22)}, ${c.surface} 75%)`
              : `radial-gradient(ellipse 70% 100% at 50% 0%, ${t.primarySoft}, ${s.tone === 'surface' ? t.bg : t.surface} 75%)`,
          }}
        >
          {inner}
        </div>
      </Wrap>
    </Block>
  )
}

export function DonateSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const amounts = items(ctx)
  const card = (
    <div style={{ display: 'grid', gap: 16, padding: m ? 20 : 32, borderRadius: t.rLg, background: t.dark ? c.surface : '#ffffff', border: `1px solid ${c.border}`, boxShadow: '0 18px 40px rgba(20,30,20,.08)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 4, borderRadius: t.rMd, background: c.surface === '#ffffff' ? t.surface : mix(t.bg, t.text, 0.05) }}>
        {['Doação única', 'Mensal'].map((l, i) => (
          <span key={l} style={{ textAlign: 'center', padding: '10px 8px', borderRadius: t.rMd, background: i === 1 ? '#ffffff' : 'transparent', boxShadow: i === 1 ? '0 1px 3px rgba(0,0,0,.12)' : undefined, fontWeight: 600, fontSize: 14.5, color: '#1d2b1f' }}>
            {l}
          </span>
        ))}
      </div>
      <div style={grid(m ? 2 : 4, 10)}>
        {amounts.map((a) => (
          <span key={a.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 52, borderRadius: t.rMd, border: `1.5px solid ${a.highlight ? t.primary : c.border}`, background: a.highlight ? t.primary : 'transparent', color: a.highlight ? t.onPrimary : c.fg, fontWeight: 700, fontSize: 17 }}>
            {a.title}
          </span>
        ))}
      </div>
      <FakeInput ctx={ctx} placeholder="Outro valor (R$)" tone="bg" />
      {s.cta && (
        <Btn ctx={ctx} size="lg" block tone="bg" icon="heart">
          {s.cta}
        </Btn>
      )}
      {s.note && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: 13, color: c.muted, textAlign: 'center' }}>
          <Lock width={13} height={13} /> {s.note}
        </span>
      )}
    </div>
  )
  return (
    <Block ctx={ctx}>
      <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 28 : 72, alignItems: 'center' }}>
        {m && card}
        <div style={{ display: 'grid', gap: 18 }}>
          <H ctx={ctx} level={2} size={m ? 28 : 44}>
            <Rich text={s.title ?? ''} color={c.accent} />
          </H>
          {s.text && <P ctx={ctx} color={c.muted}>{s.text}</P>}
          <CheckList ctx={ctx} list={['Mudas nativas plantadas e acompanhadas', 'Relatório anual de impacto', 'Cancele a doação mensal quando quiser']} />
        </div>
        {!m && card}
      </Wrap>
    </Block>
  )
}

export function FooterSection({ ctx }: { ctx: RCtx }) {
  const { s, t, m } = ctx
  const c = toneOf(t, s.tone)
  const cols = items(ctx)
  const legal = s.links ?? []
  const year = `© 2027 ${ctx.brand}`

  if (s.variant === 'simple') {
    return (
      <Block ctx={ctx} as="footer" pad={m ? 32 : 40} style={{ borderTop: `1px solid ${c.border}` }}>
        <Wrap m={m} style={{ display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: m ? 16 : 24, textAlign: m ? 'center' : 'left' }}>
          <BrandMark ctx={ctx} size={17} />
          <span style={{ fontSize: 14, color: c.muted }}>{s.text}</span>
          <span style={{ display: 'flex', gap: 20, fontSize: 14, color: c.muted }}>
            {legal.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </span>
        </Wrap>
      </Block>
    )
  }

  const big = s.variant === 'big'
  const bigSize = Math.min(m ? 72 : 210, (m ? 350 : 1180) / Math.max(4, ctx.brand.length * 0.58))
  return (
    <Block ctx={ctx} as="footer" pad={m ? 44 : 64} style={{ borderTop: `1px solid ${c.border}`, paddingBottom: big ? 0 : undefined }}>
      <Wrap m={m}>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : `1.5fr repeat(${cols.length}, minmax(0, 1fr))`, gap: m ? '28px 20px' : 40 }}>
          <div style={{ display: 'grid', gap: 14, alignContent: 'start', gridColumn: m ? '1 / -1' : undefined }}>
            <BrandMark ctx={ctx} size={18} />
            <span style={{ fontSize: 14.5, color: c.muted, maxWidth: 300 }}>{s.text}</span>
            <span style={{ display: 'flex', gap: 10 }}>
              {(['globe', 'camera', 'message'] as const).map((ic) => (
                <span key={ic} style={{ ...sz(36), borderRadius: t.rSm === 0 ? 0 : 999, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.muted }}>
                  <Icon name={ic} size={16} />
                </span>
              ))}
            </span>
          </div>
          {cols.map((col) => (
            <div key={col.title} style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
              <span style={{ fontWeight: 650, fontSize: 14.5 }}>{col.title}</span>
              {(col.list ?? []).map((l) => (
                <span key={l} style={{ fontSize: 14.5, color: c.muted, overflowWrap: 'anywhere' }}>
                  {l}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', justifyContent: 'space-between', gap: 10, marginTop: m ? 32 : 48, paddingTop: 20, borderTop: `1px solid ${c.border}`, fontSize: 13.5, color: c.muted }}>
          <span>{year}. Todos os direitos reservados.</span>
          <span style={{ display: 'flex', gap: 20 }}>
            {legal.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </span>
        </div>
        {big && (
          <div aria-hidden="true" style={{ fontFamily: t.heading, fontWeight: 800, fontSize: bigSize, lineHeight: 0.8, letterSpacing: '-0.05em', whiteSpace: 'nowrap', marginTop: m ? 24 : 40, color: c.accent, overflow: 'hidden', transform: 'translateY(12%)' }}>
            {ctx.brand}
          </div>
        )}
      </Wrap>
    </Block>
  )
}

