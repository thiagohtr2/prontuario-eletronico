import { mix, withAlpha } from '@/core/color'
import { Avatar, Burger, ff, hair, Icon, SiteRoot, Wrap, type SiteProps } from './kit'

type Food = 'tomato' | 'lemon' | 'eggplant' | 'carrot' | 'avocado' | 'apple' | 'broccoli' | 'bread' | 'milk' | 'banana'

/** Ilustrações de alimentos (cores próprias do conteúdo). */
function Produce({ kind, size = 80 }: { kind: Food; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ display: 'block', flex: 'none' }}>
      {kind === 'tomato' && (
        <>
          <circle cx={50} cy={56} r={36} fill="#e5432f" />
          <ellipse cx={38} cy={44} rx={9} ry={6} fill="#ff8a70" opacity={0.7} />
          <path d="M50 22 l6 10 l11 -3 l-6 9 l8 7 l-12 0 l-7 9 l-1 -11 l-11 -3 l10 -6 z" fill="#3c9a3c" />
        </>
      )}
      {kind === 'lemon' && (
        <>
          <ellipse cx={50} cy={54} rx={38} ry={30} fill="#f7c935" transform="rotate(-20 50 54)" />
          <ellipse cx={38} cy={46} rx={10} ry={6} fill="#fff1a8" opacity={0.7} transform="rotate(-20 38 46)" />
          <path d="M80 30 q10 -8 14 -2 q-6 8 -14 2z" fill="#3c9a3c" />
        </>
      )}
      {kind === 'eggplant' && (
        <>
          <path d="M40 34 Q20 60 34 84 Q52 100 70 80 Q84 60 62 34 Z" fill="#6b2d6b" />
          <path d="M38 34 Q50 20 64 34 L58 40 L50 34 L44 40 Z" fill="#3c9a3c" />
          <ellipse cx={42} cy={60} rx={5} ry={12} fill="#9a5a9a" opacity={0.6} />
        </>
      )}
      {kind === 'carrot' && (
        <>
          <path d="M30 34 L74 30 Q60 70 40 92 Q28 60 30 34 Z" fill="#f08a2c" />
          {[44, 54, 64].map((y) => (
            <path key={y} d={`M${36 + (y - 44) * 0.1} ${y} l10 -2`} stroke="#c0661a" strokeWidth={3} strokeLinecap="round" />
          ))}
          <path d="M44 32 Q40 14 50 6 Q54 20 52 32 M56 32 Q64 14 76 12 Q68 26 60 32" fill="#3c9a3c" />
        </>
      )}
      {kind === 'avocado' && (
        <>
          <path d="M50 10 Q78 40 80 64 Q80 92 50 92 Q20 92 20 64 Q22 40 50 10 Z" fill="#3f6b2a" />
          <path d="M50 22 Q70 46 70 64 Q70 84 50 84 Q30 84 30 64 Q30 46 50 22 Z" fill="#d8e68a" />
          <circle cx={50} cy={64} r={13} fill="#8a5a2a" />
        </>
      )}
      {kind === 'apple' && (
        <>
          <path d="M50 30 Q30 18 20 40 Q12 70 34 88 Q50 96 66 88 Q88 70 80 40 Q70 18 50 30 Z" fill="#d93a3a" />
          <path d="M50 30 Q52 16 58 10" stroke="#6b3a1a" strokeWidth={4} fill="none" />
          <path d="M56 18 Q70 10 76 20 Q64 26 56 18Z" fill="#3c9a3c" />
        </>
      )}
      {kind === 'broccoli' && (
        <>
          <path d="M44 60 L40 92 L60 92 L56 60 Z" fill="#8cc06a" />
          {[
            [34, 46, 18],
            [52, 36, 20],
            [68, 48, 17],
            [50, 56, 16],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#2f7a2f' : '#3c9a3c'} />
          ))}
        </>
      )}
      {kind === 'bread' && (
        <>
          <path d="M12 64 Q12 30 50 28 Q88 30 88 64 Q88 78 50 80 Q12 78 12 64 Z" fill="#c98a45" />
          {[30, 48, 66].map((x) => (
            <path key={x} d={`M${x} 40 q8 6 6 16`} stroke="#f3d29a" strokeWidth={4} fill="none" strokeLinecap="round" />
          ))}
        </>
      )}
      {kind === 'milk' && (
        <>
          <path d="M34 26 L66 26 L66 36 L74 48 L74 90 L26 90 L26 48 L34 36 Z" fill="#f4f6f8" stroke="#c9d2dc" strokeWidth={2} />
          <rect x={26} y={56} width={48} height={20} fill="#4f8fd8" />
          <rect x={38} y={16} width={24} height={10} rx={2} fill="#4f8fd8" />
        </>
      )}
      {kind === 'banana' && (
        <>
          <path d="M18 40 Q30 84 82 70 Q90 66 86 60 Q40 70 30 34 Z" fill="#f5d33b" />
          <path d="M28 30 L32 38" stroke="#6b4a1a" strokeWidth={5} strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

function Tile({ kind, size, tint }: { kind: Food; size: number; tint: string }) {
  return (
    <div style={{ width: '100%', aspectRatio: '1', borderRadius: 18, background: tint, display: 'grid', placeItems: 'center' }}>
      <Produce kind={kind} size={size} />
    </div>
  )
}

export default function RaizMarket({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const line = hair(p, 0.1)
  const tint = (c: string, a = 0.14) => withAlpha(c, a)
  const products: [string, string, string, string | null, Food, number][] = [
    ['Tomate italiano orgânico', 'kg', 'R$ 9,90', 'R$ 12,90', 'tomato', 0],
    ['Abacate manteiga', 'un', 'R$ 6,50', null, 'avocado', 2],
    ['Limão-taiti', 'kg', 'R$ 5,40', 'R$ 6,90', 'lemon', 0],
    ['Brócolis ninja', 'maço', 'R$ 7,80', null, 'broccoli', 0],
    ['Pão de fermentação natural', '500 g', 'R$ 18,00', null, 'bread', 0],
  ]
  return (
    <SiteRoot p={p} font={ff('inter')} name="RAIZ MARKET">
      {/* Faixa de entrega */}
      <div style={{ background: p.accent, color: p.onAccent, fontSize: 13 }}>
        <Wrap m={m} max={1280} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 36, gap: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <Icon name="truck" size={16} color={p.onAccent} /> Entrega em até 2 h{m ? '' : ' · CEP 01234-000'}
            <Icon name="chevron" size={14} color={p.onAccent} />
          </span>
          {!m && <span style={{ opacity: 0.9 }}>Baixe o app e ganhe frete grátis</span>}
        </Wrap>
      </div>

      {/* Header com busca grande */}
      <header style={{ background: p.surface, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ display: 'flex', alignItems: 'center', gap: m ? 12 : 28, height: m ? 64 : 84 }}>
          {m && <Burger color={p.text} />}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 900, fontSize: m ? 24 : 30, letterSpacing: '-0.05em', color: p.accent }}>
            <svg width={m ? 26 : 32} height={m ? 26 : 32} viewBox="0 0 32 32" aria-hidden="true">
              <circle cx={16} cy={16} r={15} fill={p.secondary} />
              <path d="M16 26 V14 M16 18 Q10 16 9 9 Q15 9 16 14 M16 16 Q22 13 24 7 Q18 7 16 12" stroke={p.accent} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            </svg>
            raiz<span style={{ color: p.text, fontWeight: 500, fontSize: '0.6em', letterSpacing: '-0.01em' }}>market</span>
          </span>
          {!m && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: 50, borderRadius: 999, background: p.bg, border: `2px solid ${tint(p.accent, 0.3)}`, paddingLeft: 20, gap: 10 }}>
              <Icon name="search" size={19} color={p.muted} />
              <span style={{ flex: 1, color: p.muted, fontSize: 15 }}>Buscar frutas, legumes, pães…</span>
              <span style={{ background: p.accent, color: p.onAccent, borderRadius: 999, padding: '10px 20px', margin: 4, fontWeight: 700, fontSize: 14.5 }}>Buscar</span>
            </div>
          )}
          {m && <div style={{ flex: 1 }} />}
          {m && <Icon name="search" size={22} />}
          {!m && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14.5, fontWeight: 600 }}>
              <Icon name="user" size={21} /> Entrar
            </span>
          )}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: p.secondary, color: mix(p.secondary, '#000000', 0.75), borderRadius: 999, padding: m ? '8px 12px' : '10px 18px', fontWeight: 800, fontSize: 14.5 }}>
            <span style={{ position: 'relative' }}>
              <Icon name="bag" size={20} color={mix(p.secondary, '#000000', 0.75)} stroke={2} />
              <span style={{ position: 'absolute', top: -7, right: -8, background: p.accent, color: p.onAccent, borderRadius: 999, fontSize: 10.5, minWidth: 17, height: 17, display: 'grid', placeItems: 'center' }}>7</span>
            </span>
            {!m && 'R$ 86,40'}
          </span>
        </Wrap>
        <Wrap m={m} max={1280} style={{ display: 'flex', gap: 8, paddingBottom: 14, overflow: 'hidden', flexWrap: m ? 'nowrap' : 'wrap' }}>
          {['Ofertas', 'Hortifrúti', 'Padaria', 'Laticínios', 'Mercearia', 'Bebidas', 'Orgânicos', 'Casa'].map((t, i) => (
            <span key={t} style={{ flex: 'none', fontSize: 14, fontWeight: 700, padding: '8px 16px', borderRadius: 999, background: i === 0 ? mix(p.secondary, '#ff5a2a', 0.25) : tint(p.accent, 0.08), color: i === 0 ? '#2a1405' : mix(p.accent, p.text, 0.45) }}>
              {t}
            </span>
          ))}
        </Wrap>
      </header>

      {/* Banner principal + banners laterais */}
      <section>
        <Wrap m={m} max={1280} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 2fr) minmax(0, 1fr)', gap: m ? 12 : 20, padding: m ? '16px 20px' : '28px 48px' }}>
          <div style={{ position: 'relative', borderRadius: m ? 24 : 32, background: p.accent, color: p.onAccent, padding: m ? '28px 22px 200px' : '56px 52px', minHeight: m ? 0 : 420, overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2, maxWidth: m ? '100%' : '55%' }}>
              <span style={{ display: 'inline-block', background: p.secondary, color: '#2a1405', borderRadius: 999, padding: '5px 12px', fontSize: 12.5, fontWeight: 800 }}>FEIRA ORGÂNICA</span>
              <h1 style={{ fontWeight: 900, fontSize: m ? 36 : 58, lineHeight: 1, letterSpacing: '-0.045em', marginTop: 16 }}>Feira fresquinha na sua porta em 2 horas.</h1>
              <p style={{ marginTop: 14, fontSize: m ? 15 : 17, opacity: 0.9 }}>Direto de 60 produtores familiares do cinturão verde.</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                <span style={{ background: p.onAccent, color: p.accent, borderRadius: 999, padding: '14px 24px', fontWeight: 800 }}>Começar compra</span>
                <span style={{ border: `2px dashed ${withAlpha(p.onAccent, 0.7)}`, borderRadius: 12, padding: '10px 14px', fontWeight: 700, fontSize: 14 }}>−20% · cupom RAIZ20</span>
              </div>
            </div>
            <div style={{ position: 'absolute', right: m ? '50%' : -20, bottom: m ? -30 : -40, transform: m ? 'translateX(50%)' : 'none', width: m ? 300 : 460, height: m ? 240 : 400 }}>
              <div style={{ position: 'absolute', inset: '10% 0 0 10%', borderRadius: '50%', background: withAlpha(p.onAccent, 0.12) }} />
              {(
                [
                  ['tomato', 34, 40, 140],
                  ['avocado', 62, 18, 120],
                  ['lemon', 8, 58, 110],
                  ['carrot', 56, 54, 130],
                  ['broccoli', 24, 8, 110],
                  ['eggplant', 78, 58, 100],
                ] as [Food, number, number, number][]
              ).map(([k, x, y, s]) => (
                <div key={k} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, filter: 'drop-shadow(0 10px 12px rgba(0,0,0,.18))' }}>
                  <Produce kind={k} size={s * (m ? 0.62 : 1)} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '1fr', gap: m ? 12 : 20 }}>
            <div style={{ borderRadius: m ? 20 : 28, background: p.secondary, color: '#2a1405', padding: m ? 16 : 28, position: 'relative', overflow: 'hidden', minHeight: m ? 160 : 0 }}>
              <div style={{ fontWeight: 800, fontSize: m ? 16 : 22, letterSpacing: '-0.02em', maxWidth: m ? '100%' : '60%' }}>Cesta da semana</div>
              <div style={{ fontWeight: 900, fontSize: m ? 24 : 34, marginTop: 6 }}>R$ 89</div>
              <div style={{ position: 'absolute', right: m ? 6 : 16, bottom: m ? 6 : 12, display: 'flex' }}>
                <Produce kind="apple" size={m ? 48 : 72} />
                <Produce kind="banana" size={m ? 48 : 72} />
              </div>
            </div>
            <div style={{ borderRadius: m ? 20 : 28, background: p.surface, border: `1px solid ${line}`, padding: m ? 16 : 28, position: 'relative', overflow: 'hidden', minHeight: m ? 160 : 0 }}>
              <div style={{ fontWeight: 800, fontSize: m ? 15 : 20, letterSpacing: '-0.02em', maxWidth: m ? '100%' : '60%' }}>Pão de fermentação natural saindo agora</div>
              <div style={{ color: p.accent, fontWeight: 700, fontSize: 14, marginTop: 8 }}>Ver padaria →</div>
              <div style={{ position: 'absolute', right: m ? 4 : 12, bottom: m ? 0 : 6 }}>
                <Produce kind="bread" size={m ? 64 : 96} />
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Categorias redondas */}
      <section>
        <Wrap m={m} max={1280} style={{ padding: m ? '20px 20px 8px' : '40px 48px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(4, minmax(0, 1fr))' : 'repeat(8, minmax(0, 1fr))', gap: m ? 10 : 16 }}>
            {(
              [
                ['Frutas', 'apple'],
                ['Legumes', 'carrot'],
                ['Verduras', 'broccoli'],
                ['Padaria', 'bread'],
                ['Laticínios', 'milk'],
                ['Cítricos', 'lemon'],
                ['Orgânicos', 'avocado'],
                ['Banana & cia', 'banana'],
              ] as [string, Food][]
            )
              .slice(0, m ? 4 : 8)
              .map(([t, k], i) => (
                <div key={t} style={{ textAlign: 'center' }}>
                  <div style={{ aspectRatio: '1', borderRadius: '50%', background: i % 2 ? tint(p.secondary, 0.25) : tint(p.accent, 0.12), display: 'grid', placeItems: 'center' }}>
                    <Produce kind={k} size={m ? 44 : 64} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: m ? 12.5 : 14, marginTop: 8 }}>{t}</div>
                </div>
              ))}
          </div>
        </Wrap>
      </section>

      {/* Ofertas do dia */}
      <section>
        <Wrap m={m} max={1280} style={{ padding: m ? '32px 20px' : '56px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ fontWeight: 900, fontSize: m ? 24 : 34, letterSpacing: '-0.04em' }}>Ofertas do dia</h2>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 700, color: mix(p.secondary, '#a0300a', 0.6) }}>
              <Icon name="clock" size={16} color={mix(p.secondary, '#a0300a', 0.6)} /> Terminam em 05:42:18
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(5, minmax(0, 1fr))', gap: m ? 10 : 18, marginTop: m ? 16 : 24 }}>
            {products.slice(0, m ? 4 : 5).map(([n, unit, price, old, kind, qty], i) => (
              <article key={n} style={{ background: p.surface, border: `1px solid ${line}`, borderRadius: 22, padding: m ? 10 : 14, position: 'relative' }}>
                {old && <span style={{ position: 'absolute', top: m ? 16 : 22, left: m ? 16 : 22, zIndex: 1, background: '#e5432f', color: '#ffffff', fontSize: 12, fontWeight: 800, borderRadius: 8, padding: '3px 8px' }}>−{Math.round((1 - parseFloat(price.replace('R$ ', '').replace(',', '.')) / parseFloat(old.replace('R$ ', '').replace(',', '.'))) * 100)}%</span>}
                <Tile kind={kind} size={m ? 76 : 110} tint={i % 2 ? tint(p.secondary, 0.22) : tint(p.accent, 0.08)} />
                <div style={{ fontWeight: 700, fontSize: m ? 13.5 : 15, marginTop: 12, lineHeight: 1.3, minHeight: m ? 36 : 40 }}>{n}</div>
                <div style={{ fontSize: 12.5, color: p.muted }}>por {unit}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10, gap: 6 }}>
                  <div>
                    {old && <div style={{ fontSize: 12, color: p.muted, textDecoration: 'line-through' }}>{old}</div>}
                    <div style={{ fontWeight: 900, fontSize: m ? 16 : 19, letterSpacing: '-0.03em' }}>{price}</div>
                  </div>
                  {qty ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: m ? 6 : 10, background: p.accent, color: p.onAccent, borderRadius: 999, padding: m ? '6px 8px' : '7px 10px', fontWeight: 800, fontSize: 14 }}>
                      <Icon name="minus" size={14} color={p.onAccent} stroke={2.6} /> {qty} <Icon name="plus" size={14} color={p.onAccent} stroke={2.6} />
                    </span>
                  ) : (
                    <span style={{ width: m ? 34 : 38, height: m ? 34 : 38, borderRadius: '50%', background: p.accent, display: 'grid', placeItems: 'center' }}>
                      <Icon name="plus" size={18} color={p.onAccent} stroke={2.6} />
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Cestas */}
      <section style={{ background: tint(p.secondary, 0.16), borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ padding: m ? '40px 20px' : '80px 48px' }}>
          <h2 style={{ fontWeight: 900, fontSize: m ? 26 : 40, letterSpacing: '-0.04em' }}>Cestas que chegam toda semana</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 12 : 20, marginTop: m ? 20 : 32 }}>
            {(
              [
                ['Cesta Essencial', 'Para 1–2 pessoas', 'R$ 89', ['8 itens de hortifrúti', '1 pão de fermentação', 'Ovos caipiras (6)'], ['tomato', 'lemon', 'carrot'], false],
                ['Cesta Família', 'Para 3–4 pessoas', 'R$ 149', ['14 itens de hortifrúti', '2 pães + 1 queijo', 'Ovos caipiras (12)'], ['broccoli', 'avocado', 'apple'], true],
                ['Cesta Verde', '100% folhas e ervas', 'R$ 69', ['6 maços variados', 'Ervas frescas', 'Brotos da semana'], ['broccoli', 'lemon', 'avocado'], false],
              ] as [string, string, string, string[], Food[], boolean][]
            ).map(([n, d, price, items, foods, hi]) => (
              <div key={n} style={{ background: p.surface, borderRadius: 26, padding: m ? 18 : 24, border: hi ? `3px solid ${p.accent}` : `1px solid ${line}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: m ? 18 : 21 }}>{n}</h3>
                    <div style={{ fontSize: 13.5, color: p.muted }}>{d}</div>
                  </div>
                  {hi && <span style={{ background: p.accent, color: p.onAccent, fontSize: 11.5, fontWeight: 800, borderRadius: 999, padding: '4px 10px' }}>MAIS PEDIDA</span>}
                </div>
                <div style={{ display: 'flex', marginTop: 14 }}>
                  {foods.map((f, i) => (
                    <div key={i} style={{ marginLeft: i ? -14 : 0 }}>
                      <Produce kind={f} size={m ? 56 : 66} />
                    </div>
                  ))}
                </div>
                <ul style={{ display: 'grid', gap: 6, marginTop: 14, fontSize: 14 }}>
                  {items.map((t) => (
                    <li key={t} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Icon name="check" size={16} color={p.accent} stroke={2.6} /> {t}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
                  <span style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-0.03em' }}>
                    {price}
                    <span style={{ fontSize: 13, color: p.muted, fontWeight: 600 }}>/sem.</span>
                  </span>
                  <span style={{ background: hi ? p.accent : 'transparent', color: hi ? p.onAccent : p.accent, border: `2px solid ${p.accent}`, borderRadius: 999, padding: '9px 18px', fontWeight: 800, fontSize: 14 }}>Assinar</span>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Produtores */}
      <section>
        <Wrap m={m} max={1280} style={{ padding: m ? '40px 20px' : '80px 48px' }}>
          <h2 style={{ fontWeight: 900, fontSize: m ? 26 : 40, letterSpacing: '-0.04em' }}>Do produtor para a sua mesa</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 12 : 20, marginTop: m ? 18 : 32 }}>
            {[
              ['Sítio Boa Terra', 'Dona Cida · Ibiúna, SP', 'a 68 km', ['Folhas', 'Ervas'], 'DC'],
              ['Chácara Sol Nascente', 'Seu Akira · Mogi das Cruzes, SP', 'a 54 km', ['Tomates', 'Morangos'], 'SA'],
              ['Padaria Fermento Vivo', 'Lia e Beto · São Paulo, SP', 'a 6 km', ['Pães', 'Bolos'], 'LB'],
            ].map(([n, who, dist, tags, ini], i) => (
              <div key={n as string} style={{ display: 'flex', gap: 14, alignItems: 'center', background: p.surface, border: `1px solid ${line}`, borderRadius: 22, padding: m ? 14 : 18 }}>
                <Avatar size={m ? 52 : 60} bg={i === 1 ? p.secondary : p.accent} fg={i === 1 ? '#2a1405' : p.onAccent} label={ini as string} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{n as string}</div>
                  <div style={{ fontSize: 13.5, color: p.muted }}>{who as string}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', fontSize: 12, fontWeight: 700 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: p.accent }}>
                      <Icon name="pin" size={13} color={p.accent} /> {dist as string}
                    </span>
                    {(tags as string[]).map((t) => (
                      <span key={t} style={{ background: tint(p.accent, 0.1), borderRadius: 999, padding: '2px 8px' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Entrega + app */}
      <section style={{ padding: m ? '0 0 40px' : '0 0 80px' }}>
        <Wrap m={m} max={1280}>
          <div style={{ background: p.text, color: p.bg, borderRadius: m ? 26 : 34, padding: m ? '28px 22px' : '48px 56px', display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: 28, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontWeight: 900, fontSize: m ? 26 : 40, letterSpacing: '-0.04em', lineHeight: 1.05 }}>Acompanhe seu pedido em tempo real.</h2>
              <p style={{ opacity: 0.75, marginTop: 10 }}>No app, você troca itens até a separação e conversa com quem está montando sua sacola.</p>
              <span style={{ display: 'inline-block', marginTop: 20, background: p.secondary, color: '#2a1405', borderRadius: 999, padding: '13px 22px', fontWeight: 800 }}>Baixar o app</span>
            </div>
            <div style={{ display: 'grid', gap: 0 }}>
              {[
                ['Pedido recebido', '14:02', true],
                ['Separando seus itens', '14:10', true],
                ['A caminho · Moto 214', '14:38', false],
                ['Entregue', 'previsão 15:05', false],
              ].map(([t, h, done], i) => (
                <div key={t as string} style={{ display: 'flex', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: done ? p.secondary : 'transparent', border: `2px solid ${done ? p.secondary : withAlpha(p.bg, 0.4)}`, display: 'grid', placeItems: 'center' }}>{done && <Icon name="check" size={13} color="#2a1405" stroke={3} />}</span>
                    {i < 3 && <span style={{ width: 2, height: 30, background: withAlpha(p.bg, done ? 0.6 : 0.2) }} />}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, fontSize: 15, paddingTop: 1 }}>
                    <span style={{ fontWeight: done ? 700 : 500, opacity: done ? 1 : 0.7 }}>{t as string}</span>
                    <span style={{ opacity: 0.6, fontSize: 13.5 }}>{h as string}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      <footer style={{ background: p.surface, borderTop: `1px solid ${line}`, fontSize: 14 }}>
        <Wrap m={m} max={1280} style={{ padding: m ? '32px 20px' : '48px 48px', display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '2fr repeat(3, 1fr)', gap: 24 }}>
          <div style={{ gridColumn: m ? '1 / -1' : 'auto' }}>
            <span style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-0.05em', color: p.accent }}>raiz</span>
            <p style={{ color: p.muted, marginTop: 6, maxWidth: 300 }}>Mercado de bairro, agora on-line. Marca fictícia.</p>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {['Pix', 'Crédito', 'Débito', 'Vale-refeição'].map((t) => (
                <span key={t} style={{ fontSize: 12, fontWeight: 700, border: `1px solid ${line}`, borderRadius: 8, padding: '3px 8px' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          {[
            ['Comprar', ['Ofertas', 'Cestas', 'Orgânicos']],
            ['Ajuda', ['Entregas', 'Trocas', 'Fale conosco']],
            ['Raiz', ['Produtores', 'Seja parceiro', 'Trabalhe aqui']],
          ].map(([t, items]) => (
            <div key={t as string}>
              <strong>{t as string}</strong>
              <ul style={{ display: 'grid', gap: 6, marginTop: 8, color: p.muted }}>
                {(items as string[]).map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
