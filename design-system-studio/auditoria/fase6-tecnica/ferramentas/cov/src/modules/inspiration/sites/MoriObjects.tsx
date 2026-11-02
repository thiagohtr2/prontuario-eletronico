import { mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, useSvgId, Wrap, type SiteProps } from './kit'

type Ware = 'vase' | 'bowl' | 'cup' | 'bottle' | 'plate' | 'jar' | 'candle' | 'pitcher'

const SHAPES: Record<Ware, string> = {
  vase: 'M78 40 Q70 60 72 80 Q40 120 44 180 Q50 236 100 240 Q150 236 156 180 Q160 120 128 80 Q130 60 122 40 Z',
  bowl: 'M20 140 Q24 216 100 222 Q176 216 180 140 Z',
  cup: 'M52 120 L58 220 Q100 232 142 220 L148 120 Z',
  bottle: 'M88 30 L88 92 Q50 110 52 170 L56 236 Q100 246 144 236 L148 170 Q150 110 112 92 L112 30 Z',
  plate: 'M12 196 Q100 262 188 196 Z',
  jar: 'M60 90 Q36 110 38 170 Q42 232 100 236 Q158 232 162 170 Q164 110 140 90 Z',
  candle: 'M70 150 L130 150 L136 230 L64 230 Z',
  pitcher: 'M66 70 L134 70 L150 100 Q164 170 140 232 L60 232 Q36 170 50 110 Z',
}

/** Peça de cerâmica com esmalte em degradê. */
function Ceramic({ p, ware, glaze }: { p: SitePalette; ware: Ware; glaze: string }) {
  const id = useSvgId('mori-ware')
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id('g')} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor={mix(glaze, '#ffffff', 0.35)} />
          <stop offset="0.45" stopColor={glaze} />
          <stop offset="1" stopColor={mix(glaze, '#000000', 0.28)} />
        </linearGradient>
      </defs>
      <ellipse cx={100} cy={242} rx={ware === 'plate' ? 96 : 70} ry={8} fill={withAlpha(p.text, 0.12)} />
      <path d={SHAPES[ware]} fill={`url(#${id('g')})`} />
      {ware === 'bowl' && <ellipse cx={100} cy={140} rx={80} ry={14} fill={mix(glaze, '#000000', 0.18)} />}
      {ware === 'cup' && <ellipse cx={100} cy={120} rx={48} ry={9} fill={mix(glaze, '#000000', 0.2)} />}
      {ware === 'plate' && (
        <>
          <ellipse cx={100} cy={196} rx={88} ry={18} fill={mix(glaze, '#ffffff', 0.25)} />
          <ellipse cx={100} cy={198} rx={58} ry={10} fill={mix(glaze, '#000000', 0.08)} />
        </>
      )}
      {ware === 'jar' && <rect x={74} y={76} width={52} height={16} rx={4} fill={mix(glaze, '#000000', 0.2)} />}
      {ware === 'candle' && (
        <>
          <rect x={92} y={110} width={16} height={40} rx={3} fill={mix(p.bg, '#ffffff', 0.6)} />
          <path d="M100 86 Q108 100 100 110 Q92 100 100 86Z" fill={p.accent} />
        </>
      )}
      {ware === 'pitcher' && <path d="M150 110 Q182 120 172 160 Q164 186 146 190" stroke={mix(glaze, '#000000', 0.15)} strokeWidth={10} fill="none" strokeLinecap="round" />}
      {/* Escorrido de esmalte */}
      {(ware === 'vase' || ware === 'jar' || ware === 'bottle') && <path d="M50 150 Q100 170 150 150 Q140 162 120 166 Q112 184 104 168 Q92 176 84 166 Q62 162 50 150 Z" fill={withAlpha(p.bg, 0.22)} />}
    </svg>
  )
}

const PRODUCTS: { name: string; maker: string; price: string; ware: Ware; glaze: (p: SitePalette) => string }[] = [
  { name: 'Vaso Shizuku', maker: 'Ateliê Hara', price: 'R$ 420', ware: 'vase', glaze: (p) => p.secondary },
  { name: 'Tigela Kumo', maker: 'Cerâmica Cunha', price: 'R$ 180', ware: 'bowl', glaze: (p) => mix(p.accent, p.secondary, 0.3) },
  { name: 'Copo Yuki', maker: 'Ateliê Hara', price: 'R$ 96', ware: 'cup', glaze: (p) => mix(p.text, p.secondary, 0.35) },
  { name: 'Garrafa Ame', maker: 'Estúdio Barro', price: 'R$ 310', ware: 'bottle', glaze: (p) => mix(p.accent, p.text, 0.25) },
  { name: 'Prato Raso Sora', maker: 'Cerâmica Cunha', price: 'R$ 140', ware: 'plate', glaze: (p) => mix(p.secondary, p.text, 0.12) },
  { name: 'Pote Mochi', maker: 'Estúdio Barro', price: 'R$ 220', ware: 'jar', glaze: (p) => mix(p.secondary, p.accent, 0.45) },
  { name: 'Castiçal Hi', maker: 'Fundição Leve', price: 'R$ 160', ware: 'candle', glaze: (p) => mix(p.text, '#ffffff', 0.25) },
  { name: 'Jarra Kawa', maker: 'Ateliê Hara', price: 'R$ 380', ware: 'pitcher', glaze: (p) => mix(p.secondary, p.text, 0.2) },
]

export default function MoriObjects({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const serif = ff('georgia')
  const line = hair(p, 0.12)
  const small = { fontSize: 12.5, letterSpacing: '0.12em', color: p.muted, textTransform: 'uppercase' as const }
  return (
    <SiteRoot p={p} font={ff('inter')} name="MORI OBJECTS" style={{ fontSize: 15 }}>
      {/* Header discreto */}
      <header>
        <Wrap m={m} max={1360} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: m ? 64 : 88, fontSize: 13.5 }}>
          <nav style={{ display: 'flex', gap: 26 }}>{m ? <Burger color={p.text} size={20} weight={1.5} /> : ['Objetos', 'Cerâmica', 'Têxteis', 'Diário'].map((t) => <span key={t}>{t}</span>)}</nav>
          <span style={{ fontFamily: serif, fontSize: m ? 26 : 32, letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', border: `1.5px solid ${p.text}` }} />
            mori
          </span>
          <nav style={{ display: 'flex', gap: 22, justifyContent: 'flex-end' }}>
            {!m && <span>Busca</span>}
            {!m && <span>Conta</span>}
            <span>Sacola (0)</span>
          </nav>
        </Wrap>
      </header>

      {/* Hero: natureza-morta com muito respiro */}
      <section>
        <Wrap m={m} max={1360} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 3fr) minmax(0, 7fr) minmax(0, 2fr)', gap: m ? 20 : 48, padding: m ? '16px 20px 56px' : '40px 48px 120px', alignItems: 'end' }}>
          <div style={{ order: m ? 2 : 1 }}>
            <div style={small}>Coleção outono · 18 peças</div>
            <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 36 : 54, lineHeight: 1.08, letterSpacing: '-0.01em', marginTop: 16 }}>Objetos para viver devagar.</h1>
            <p style={{ color: p.muted, marginTop: 16, lineHeight: 1.7, maxWidth: 320 }}>Cerâmicas, têxteis e utensílios feitos à mão por pequenos ateliês em Cunha e em Quioto. Uma peça de cada vez.</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 28, fontSize: 14, borderBottom: `1px solid ${p.text}`, paddingBottom: 4 }}>
              Ver coleção <Icon name="arrow" size={15} stroke={1.4} />
            </span>
          </div>
          <div style={{ order: m ? 1 : 2, position: 'relative', height: m ? 340 : 600, background: p.surface }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: '22%', height: 1, background: line }} />
            <div style={{ position: 'absolute', left: '8%', right: '8%', bottom: '22%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2%' }}>
              <div style={{ width: '36%', height: m ? 210 : 380 }}>
                <Ceramic p={p} ware="vase" glaze={p.secondary} />
              </div>
              <div style={{ width: '30%', height: m ? 140 : 250 }}>
                <Ceramic p={p} ware="jar" glaze={mix(p.accent, p.secondary, 0.4)} />
              </div>
              <div style={{ width: '22%', height: m ? 90 : 160 }}>
                <Ceramic p={p} ware="cup" glaze={mix(p.text, p.secondary, 0.4)} />
              </div>
            </div>
            <div style={{ position: 'absolute', right: m ? 12 : 24, top: m ? 12 : 24, ...small, fontSize: 11 }}>Nº 01 / 18</div>
            <div style={{ position: 'absolute', left: m ? 12 : 24, bottom: m ? 12 : 24, fontSize: 12.5, color: p.muted }}>Vaso Shizuku, Pote Mochi e Copo Yuki</div>
          </div>
          {!m && (
            <div style={{ order: 3, ...small, writingMode: 'vertical-rl', justifySelf: 'end', alignSelf: 'start', letterSpacing: '0.3em' }}>FEITO À MÃO · DESDE 2015</div>
          )}
        </Wrap>
      </section>

      {/* Filtros + grade de produtos */}
      <section>
        <Wrap m={m} max={1360}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', borderBottom: `1px solid ${line}`, paddingBottom: 16 }}>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 24 : 30 }}>Todos os objetos</h2>
            <div style={{ display: 'flex', gap: m ? 12 : 22, fontSize: 13.5, color: p.muted, flexWrap: 'wrap' }}>
              {[
                ['Tudo', 48],
                ['Cerâmica', 26],
                ['Têxteis', 12],
                ['Metal', 6],
                ['Madeira', 4],
              ].map(([t, n], i) => (
                <span key={t as string} style={{ color: i === 0 ? p.text : p.muted, borderBottom: i === 0 ? `1px solid ${p.text}` : 'none' }}>
                  {t as string} <sup style={{ fontSize: 10 }}>{n as number}</sup>
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', columnGap: m ? 12 : 28, rowGap: m ? 28 : 56, padding: m ? '24px 0 64px' : '40px 0 128px' }}>
            {PRODUCTS.map((it, i) => (
              <article key={it.name}>
                <div style={{ position: 'relative', aspectRatio: '4 / 5', background: p.surface, padding: m ? '18% 16% 12%' : '18% 20% 14%' }}>
                  <Ceramic p={p} ware={it.ware} glaze={it.glaze(p)} />
                  {i === 1 && <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 11, letterSpacing: '0.12em', color: p.accent }}>NOVO</span>}
                  {i === 5 && <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 11, letterSpacing: '0.12em', color: p.muted }}>ÚLTIMA PEÇA</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 14, fontSize: m ? 13.5 : 14.5, flexWrap: 'wrap' }}>
                  <span>{it.name}</span>
                  <span>{it.price}</span>
                </div>
                <div style={{ fontSize: 12.5, color: p.muted, marginTop: 2 }}>{it.maker}</div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Objeto da semana */}
      <section style={{ borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', maxWidth: 1360, margin: '0 auto' }}>
          <div style={{ background: mix(p.secondary, p.bg, 0.35), height: m ? 340 : 680, display: 'grid', placeItems: 'center' }}>
            <div style={{ width: m ? '60%' : '50%', height: m ? 220 : 400 }}>
              <Ceramic p={p} ware="bowl" glaze={mix(p.accent, p.secondary, 0.3)} />
            </div>
          </div>
          <div style={{ padding: m ? '36px 20px 48px' : '80px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={small}>Objeto da semana</div>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 34 : 50, marginTop: 14 }}>Tigela Kumo</h2>
            <p style={{ color: p.muted, lineHeight: 1.8, marginTop: 18, maxWidth: 440, fontSize: m ? 15 : 16 }}>
              Torneada por Akemi Sato em Cunha. O esmalte de cinzas de eucalipto escorre na queima a 1.280 °C — por isso nenhuma tigela é igual a outra.
            </p>
            <dl style={{ marginTop: 28, maxWidth: 440, fontSize: 14 }}>
              {[
                ['Material', 'Grés com esmalte de cinzas'],
                ['Medidas', 'Ø 14 cm × 7 cm'],
                ['Cuidados', 'Pode ir à lava-louças'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderTop: `1px solid ${line}` }}>
                  <dt style={{ color: p.muted }}>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 28 }}>
              <span style={{ fontFamily: serif, fontSize: 24 }}>R$ 180</span>
              <span style={{ background: p.text, color: p.bg, padding: '14px 28px', fontSize: 14, letterSpacing: '0.04em' }}>Adicionar à sacola</span>
            </div>
          </div>
        </div>
      </section>

      {/* Processo do ofício */}
      <section>
        <Wrap m={m} max={1360} style={{ padding: m ? '56px 20px' : '128px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 4fr) minmax(0, 8fr)', gap: m ? 24 : 64 }}>
            <div>
              <div style={small}>O ofício</div>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 28 : 38, lineHeight: 1.2, marginTop: 14 }}>Seis semanas entre o barro e a sua mesa.</h2>
            </div>
            <ol style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : 'repeat(4, minmax(0, 1fr))', gap: m ? 24 : 32 }}>
              {[
                ['Amassar', 'O barro descansa três dias antes de ir ao torno.'],
                ['Tornear', 'Cada peça leva de 10 a 40 minutos de mãos firmes.'],
                ['Esmaltar', 'Banhos de cinzas, ferro e feldspato.'],
                ['Queimar', 'Forno a lenha por 30 horas seguidas.'],
              ].map(([t, d], i) => (
                <li key={t} style={{ borderTop: `1px solid ${p.text}`, paddingTop: 16 }}>
                  <span style={{ fontFamily: serif, fontSize: 14, color: p.muted }}>0{i + 1}</span>
                  <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: 22, marginTop: 10 }}>{t}</h3>
                  <p style={{ color: p.muted, fontSize: 14, marginTop: 6, lineHeight: 1.6 }}>{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </Wrap>
      </section>

      {/* Diário */}
      <section style={{ background: p.surface }}>
        <Wrap m={m} max={1360} style={{ padding: m ? '48px 20px' : '96px 48px', display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: m ? 28 : 64 }}>
          {[
            ['12 out 2026', 'Uma tarde no ateliê de Akemi Sato', 'Conversa sobre paciência, cinzas de eucalipto e o dia em que o forno quebrou.'],
            ['28 set 2026', 'Como cuidar de peças de linho', 'Lavar menos, secar à sombra e aceitar os amassados como parte da beleza.'],
          ].map(([d, t, s]) => (
            <article key={t}>
              <div style={small}>{d}</div>
              <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 24 : 30, marginTop: 12, lineHeight: 1.2 }}>{t}</h3>
              <p style={{ color: p.muted, marginTop: 10, lineHeight: 1.7 }}>{s}</p>
              <span style={{ display: 'inline-block', marginTop: 16, fontSize: 13.5, borderBottom: `1px solid ${p.text}` }}>Ler no diário</span>
            </article>
          ))}
        </Wrap>
      </section>

      <footer>
        <Wrap m={m} max={1360} style={{ padding: m ? '40px 20px 28px' : '80px 48px 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: 32, alignItems: 'end' }}>
            <div>
              <div style={{ fontFamily: serif, fontSize: 22 }}>Cartas de estação</div>
              <div style={{ display: 'flex', borderBottom: `1px solid ${p.text}`, marginTop: 16, maxWidth: 420, fontSize: 14 }}>
                <span style={{ flex: 1, padding: '10px 0', color: p.muted }}>Seu e-mail</span>
                <span style={{ padding: '10px 0' }}>Assinar</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, justifyContent: m ? 'flex-start' : 'flex-end', fontSize: 13, color: p.muted, flexWrap: 'wrap' }}>
              {['Envios', 'Trocas', 'Ateliês parceiros', 'Contato'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 48, ...small, fontSize: 11 }}>
            <span>© 2026 mori objects — loja fictícia</span>
            <span>São Paulo · Quioto</span>
          </div>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
