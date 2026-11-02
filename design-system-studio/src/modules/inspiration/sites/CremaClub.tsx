import { mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, useSvgId, Wrap, type SiteProps } from './kit'

function Bean({ x, y, r, p }: { x: number; y: number; r: number; p: SitePalette }) {
  const c = mix(p.text, p.accent, 0.25)
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <ellipse cx={0} cy={0} rx={13} ry={18} fill={c} />
      <path d="M0 -15 Q-6 0 0 15" stroke={mix(c, '#000000', 0.45)} strokeWidth={2.2} fill="none" />
    </g>
  )
}

/** Xícara vista de cima com latte art. */
function CupTop({ p }: { p: SitePalette }) {
  const china = mix(p.surface, '#ffffff', 0.6)
  const coffee = mix(p.secondary, p.text, 0.45)
  const crema = mix(p.secondary, p.text, 0.2)
  const foam = mix(p.secondary, '#ffffff', 0.7)
  return (
    <svg viewBox="0 0 440 440" width="100%" aria-hidden="true" style={{ display: 'block' }}>
      <circle cx={210} cy={226} r={176} fill={withAlpha(p.text, 0.08)} />
      <circle cx={204} cy={216} r={172} fill={china} />
      <circle cx={204} cy={216} r={150} fill="none" stroke={withAlpha(p.text, 0.08)} strokeWidth={2} />
      <rect x={312} y={196} width={92} height={40} rx={20} fill={china} stroke={withAlpha(p.text, 0.08)} strokeWidth={2} />
      <circle cx={212} cy={224} r={124} fill={withAlpha(p.text, 0.12)} />
      <circle cx={204} cy={216} r={124} fill={china} />
      <circle cx={204} cy={216} r={104} fill={crema} />
      <circle cx={204} cy={216} r={96} fill={coffee} />
      {/* Rosetta */}
      <path d="M204 290 C 150 270 140 200 204 150 C 268 200 258 270 204 290 Z" fill={foam} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${172 + i * 2} ${180 + i * 20} Q204 ${196 + i * 20} ${236 - i * 2} ${180 + i * 20}`} stroke={coffee} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.75} />
      ))}
      <path d="M204 140 L204 300" stroke={coffee} strokeWidth={3} opacity={0.6} />
      <circle cx={204} cy={148} r={14} fill={foam} />
      {/* Colher */}
      <g transform="rotate(28 120 400)">
        <ellipse cx={120} cy={340} rx={18} ry={26} fill={mix(p.muted, '#ffffff', 0.45)} />
        <rect x={116} y={360} width={8} height={70} rx={4} fill={mix(p.muted, '#ffffff', 0.45)} />
      </g>
    </svg>
  )
}

function Bag({ p, tone, origin, n }: { p: SitePalette; tone: string; origin: string; n: string }) {
  const id = useSvgId('crema-bag')
  return (
    <svg viewBox="0 0 220 280" width="100%" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id('g')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mix(tone, '#000000', 0.18)} />
          <stop offset="0.5" stopColor={tone} />
          <stop offset="1" stopColor={mix(tone, '#000000', 0.22)} />
        </linearGradient>
      </defs>
      <ellipse cx={110} cy={268} rx={84} ry={8} fill={withAlpha(p.text, 0.12)} />
      <path d="M40 40 L180 40 L192 262 L28 262 Z" fill={`url(#${id('g')})`} />
      <path d="M40 40 L60 18 L160 18 L180 40 Z" fill={mix(tone, '#ffffff', 0.12)} />
      <path d="M52 30 L168 30" stroke={withAlpha('#000000', 0.25)} strokeWidth={3} strokeDasharray="4 4" />
      <rect x={56} y={92} width={108} height={124} rx={4} fill={p.surface} />
      <text x={110} y={124} textAnchor="middle" fontFamily={ff('fraunces')} fontStyle="italic" fontSize={18} fill={p.text}>
        Crema
      </text>
      <path d="M74 136 L146 136" stroke={withAlpha(p.text, 0.3)} />
      <text x={110} y={160} textAnchor="middle" fontFamily={ff('inter')} fontSize={origin.length > 12 ? 7.4 : 10} letterSpacing={origin.length > 12 ? 0.6 : 1.5} fill={p.muted} fontWeight={600}>
        {origin.toUpperCase()}
      </text>
      <text x={110} y={198} textAnchor="middle" fontFamily={ff('fraunces')} fontSize={26} fill={p.accent}>
        Nº {n}
      </text>
    </svg>
  )
}

const MENU: [string, [string, string, string][]][] = [
  [
    'Espressos',
    [
      ['Espresso', 'Blend da casa, 30 ml', '7'],
      ['Cortado', 'Espresso com leite vaporizado', '9'],
      ['Cappuccino', 'Com canela do Ceilão', '13'],
      ['Flat white', 'Duplo, leite integral ou de aveia', '14'],
    ],
  ],
  [
    'Métodos',
    [
      ['Coado V60', 'Grão do dia, 250 ml', '15'],
      ['Prensa francesa', 'Para dividir, 500 ml', '24'],
      ['Aeropress', 'Receita do campeonato', '16'],
    ],
  ],
  [
    'Gelados',
    [
      ['Cold brew', '18 h de extração a frio', '15'],
      ['Tônica com espresso', 'Laranja-bahia e alecrim', '18'],
    ],
  ],
  [
    'Da cozinha',
    [
      ['Pão de queijo', 'Canastra meia-cura, porção', '12'],
      ['Bolo de fubá', 'Com goiabada cascão', '14'],
      ['Croissant de amêndoas', 'Fermentação natural', '17'],
    ],
  ],
]

export default function CremaClub({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const serif = ff('fraunces')
  const line = hair(p, 0.18)
  const seal = useSvgId('crema-seal')
  return (
    <SiteRoot p={p} font={ff('inter')} name="CREMA CLUB">
      {/* Header com selo central */}
      <header style={{ borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: m ? 72 : 104 }}>
          <nav style={{ display: 'flex', gap: 28, fontSize: 14.5 }}>{m ? <Burger color={p.text} /> : ['Cardápio', 'Grãos', 'Clube'].map((t) => <span key={t}>{t}</span>)}</nav>
          <svg width={m ? 60 : 84} height={m ? 60 : 84} viewBox="0 0 100 100" aria-hidden="true" style={{ display: 'block' }}>
            <defs>
              <path id={seal('c')} d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
            </defs>
            <circle cx={50} cy={50} r={48} fill={p.text} />
            <text fontSize={9.5} letterSpacing={2.4} fill={p.bg} fontFamily={ff('inter')} fontWeight={700}>
              <textPath href={`#${seal('c')}`}>CREMA CLUB · TORREFAÇÃO · 2014 ·</textPath>
            </text>
            <text x={50} y={58} textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize={24} fill={p.bg}>
              Cc
            </text>
          </svg>
          <nav style={{ display: 'flex', gap: 24, fontSize: 14.5, justifyContent: 'flex-end', alignItems: 'center' }}>
            {!m && <span>Endereços</span>}
            <span style={{ border: `1.5px solid ${p.text}`, borderRadius: 999, padding: m ? '7px 14px' : '10px 20px', fontWeight: 600, fontSize: m ? 13 : 14.5 }}>Pedir{m ? '' : ' online'}</span>
          </nav>
        </Wrap>
      </header>

      {/* Hero acolhedor */}
      <section>
        <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: m ? 24 : 56, alignItems: 'center', padding: m ? '32px 20px 48px' : '72px 48px 96px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, background: p.surface, border: `1px solid ${line}`, borderRadius: 999, padding: '6px 14px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3fa45b' }} />
              Aberto agora · até 20h
            </div>
            <h1 style={{ fontFamily: serif, fontWeight: 420, fontSize: m ? 46 : 84, lineHeight: 1, letterSpacing: '-0.03em', marginTop: 22 }}>
              Café de origem, <em style={{ fontWeight: 360, color: p.accent }}>torrado</em> na semana.
            </h1>
            <p style={{ fontSize: m ? 16 : 18.5, color: p.muted, marginTop: 20, maxWidth: 480, lineHeight: 1.6 }}>
              Grãos de pequenos produtores da Mantiqueira e do Cerrado, torrados toda segunda-feira no fundo da nossa loja. Sente, peça um coado e fique.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 30, flexDirection: m ? 'column' : 'row' }}>
              <span style={{ background: p.accent, color: p.onAccent, borderRadius: 999, padding: '15px 28px', fontWeight: 600, textAlign: 'center' }}>Ver o cardápio</span>
              <span style={{ border: `1.5px solid ${p.text}`, borderRadius: 999, padding: '14px 28px', fontWeight: 600, textAlign: 'center' }}>Comprar grãos</span>
            </div>
          </div>
          <div style={{ position: 'relative', maxWidth: m ? 340 : 520, width: '100%', justifySelf: 'center' }}>
            <div style={{ position: 'absolute', inset: '6%', borderRadius: '50%', background: p.secondary, opacity: 0.55 }} />
            <svg viewBox="0 0 440 440" width="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
              <Bean x={40} y={90} r={30} p={p} />
              <Bean x={380} y={60} r={-20} p={p} />
              <Bean x={410} y={370} r={60} p={p} />
              <Bean x={60} y={400} r={-40} p={p} />
              <Bean x={350} y={410} r={10} p={p} />
            </svg>
            <div style={{ position: 'relative' }}>
              <CupTop p={p} />
            </div>
            <div style={{ position: 'absolute', right: m ? -4 : -10, top: m ? 8 : 30, background: p.surface, border: `1px solid ${line}`, borderRadius: 16, padding: m ? '10px 12px' : '14px 18px', transform: 'rotate(4deg)' }}>
              <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: m ? 16 : 20 }}>Grão do dia</div>
              <div style={{ fontSize: 12.5, color: p.muted }}>Bourbon amarelo · 86 pts</div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Faixa corrida */}
      <div style={{ background: p.accent, color: p.onAccent, overflow: 'hidden', whiteSpace: 'nowrap', padding: m ? '12px 0' : '16px 0', fontFamily: serif, fontStyle: 'italic', fontSize: m ? 18 : 24 }}>
        {'Espresso ✺ Coado ✺ Cold brew ✺ Cappuccino ✺ Pão de queijo ✺ Bolo de fubá ✺ Espresso ✺ Coado ✺ Cold brew ✺ Cappuccino ✺ '.repeat(2)}
      </div>

      {/* Cardápio com pontilhado */}
      <section style={{ padding: m ? '48px 0' : '104px 0' }}>
        <Wrap m={m}>
          <div style={{ border: `1px solid ${p.text}`, padding: m ? 6 : 10 }}>
            <div style={{ border: `1px solid ${line}`, background: p.surface, padding: m ? '28px 18px' : '56px 64px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12.5, letterSpacing: '0.3em', color: p.muted, fontWeight: 600 }}>SERVIDO O DIA TODO</div>
                <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 38 : 64, letterSpacing: '-0.02em', marginTop: 8 }}>
                  O <em>cardápio</em>
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(2, minmax(0, 1fr))', columnGap: 72, rowGap: m ? 28 : 44, marginTop: m ? 28 : 48 }}>
                {MENU.map(([cat, items]) => (
                  <div key={cat}>
                    <h3 style={{ fontFamily: serif, fontStyle: 'italic', fontSize: m ? 22 : 26, color: p.accent, borderBottom: `1px solid ${line}`, paddingBottom: 8 }}>{cat}</h3>
                    <ul style={{ display: 'grid', gap: 14, marginTop: 16 }}>
                      {items.map(([n, d, price]) => (
                        <li key={n}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: m ? 15.5 : 17, fontWeight: 600 }}>
                            <span>{n}</span>
                            <span style={{ flex: 1, borderBottom: `2px dotted ${withAlpha(p.text, 0.35)}`, transform: 'translateY(-4px)' }} />
                            <span style={{ fontFamily: serif, fontWeight: 500 }}>R$ {price}</span>
                          </div>
                          <div style={{ fontSize: 13.5, color: p.muted, marginTop: 2 }}>{d}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Grãos da casa */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} style={{ padding: m ? '48px 20px' : '104px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 34 : 54, letterSpacing: '-0.02em' }}>Grãos da casa</h2>
            <span style={{ fontSize: 14.5, borderBottom: `1px solid ${p.text}` }}>Torra de segunda, entrega na quarta →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 20 : 32, marginTop: m ? 24 : 48 }}>
            {[
              ['Mantiqueira', '07', ['chocolate', 'caramelo'], 3, 'R$ 62', mix(p.accent, p.text, 0.15)],
              ['Cerrado Mineiro', '12', ['nozes', 'rapadura'], 4, 'R$ 58', mix(p.text, p.accent, 0.2)],
              ['Chapada Diamantina', '19', ['frutas vermelhas', 'mel'], 2, 'R$ 74', mix(p.secondary, p.text, 0.3)],
            ].map(([origin, n, notes, roast, price, tone]) => (
              <article key={origin as string} style={{ display: m ? 'grid' : 'block', gridTemplateColumns: '120px 1fr', gap: 18, alignItems: 'center' }}>
                <div style={{ background: p.bg, borderRadius: 24, padding: m ? '16px 12px 8px' : '36px 56px 24px' }}>
                  <Bag p={p} tone={tone as string} origin={origin as string} n={n as string} />
                </div>
                <div style={{ marginTop: m ? 0 : 18 }}>
                  <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 22 : 26 }}>{origin as string}</h3>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {(notes as string[]).map((t) => (
                      <span key={t} style={{ fontSize: 12.5, border: `1px solid ${line}`, borderRadius: 999, padding: '3px 10px' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 14 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: p.muted }}>
                      Torra
                      {[1, 2, 3, 4, 5].map((k) => (
                        <span key={k} style={{ width: 9, height: 9, borderRadius: '50%', background: k <= (roast as number) ? p.accent : withAlpha(p.text, 0.15) }} />
                      ))}
                    </span>
                    <strong style={{ fontFamily: serif, fontSize: 18, fontWeight: 500 }}>{price as string} · 250 g</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* História: do pé à xícara */}
      <section>
        <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 5fr) minmax(0, 6fr)', gap: m ? 28 : 72, padding: m ? '48px 20px' : '104px 48px', alignItems: 'center' }}>
          <div style={{ position: 'relative', aspectRatio: '4 / 5', borderRadius: '240px 240px 16px 16px', overflow: 'hidden', background: `linear-gradient(180deg, ${mix(p.secondary, '#ffffff', 0.5)} 0%, ${mix(p.secondary, '#ffffff', 0.2)} 40%, transparent 40%)` }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: i % 2 ? '-10%' : '-45%',
                  right: i % 2 ? '-45%' : '-10%',
                  top: `${34 + i * 12}%`,
                  height: '44%',
                  borderRadius: '50%',
                  backgroundColor: mix(i % 2 ? p.secondary : p.accent, p.text, 0.1 + i * 0.12),
                  backgroundImage: i % 2 ? 'none' : `radial-gradient(${withAlpha('#000000', 0.18)} 3px, transparent 3.5px)`,
                  backgroundSize: '18px 14px',
                }}
              />
            ))}
            <div style={{ position: 'absolute', right: '16%', top: '14%', width: 70, height: 70, borderRadius: '50%', background: mix(p.accent, '#ffffff', 0.55) }} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, letterSpacing: '0.3em', color: p.muted, fontWeight: 600 }}>NOSSA HISTÓRIA</div>
            <blockquote style={{ fontFamily: serif, fontWeight: 360, fontSize: m ? 30 : 46, lineHeight: 1.12, letterSpacing: '-0.02em', marginTop: 16 }}>
              “Conhecemos cada produtor pelo nome — e cada lote pelo sabor.”
            </blockquote>
            <ol style={{ display: 'grid', gap: 18, marginTop: 32 }}>
              {[
                ['Colheita', 'Compramos direto de 14 sítios, pagando acima do mercado.'],
                ['Torra', 'Pequenos lotes de 12 kg, perfil ajustado a cada safra.'],
                ['Xícara', 'Baristas treinados servem em até 9 dias após a torra.'],
              ].map(([t, d], i) => (
                <li key={t} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 30, color: p.accent, lineHeight: 1, width: 28 }}>{i + 1}</span>
                  <div>
                    <strong style={{ fontSize: 17 }}>{t}</strong>
                    <p style={{ color: p.muted, fontSize: 15, marginTop: 2 }}>{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Wrap>
      </section>

      {/* Clube de assinatura */}
      <section style={{ padding: m ? '0 0 48px' : '0 0 104px' }}>
        <Wrap m={m}>
          <div style={{ background: p.accent, color: p.onAccent, borderRadius: m ? 24 : 36, padding: m ? '32px 24px' : '64px 72px', display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 28, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -80, bottom: -120, width: 360, height: 360, borderRadius: '50%', border: `40px solid ${withAlpha(p.onAccent, 0.1)}` }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 12.5, letterSpacing: '0.3em', opacity: 0.8, fontWeight: 600 }}>CLUBE CREMA</div>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 34 : 56, letterSpacing: '-0.02em', lineHeight: 1.04, marginTop: 10 }}>Dois pacotes por mês, na sua porta.</h2>
              <p style={{ marginTop: 14, opacity: 0.85, fontSize: m ? 15 : 17 }}>Grãos frescos escolhidos pelos nossos torrefadores, frete grátis e 10% de desconto na loja.</p>
            </div>
            <div style={{ position: 'relative', background: p.bg, color: p.text, borderRadius: 20, padding: m ? 20 : 28 }}>
              <div style={{ fontSize: 14, color: p.muted }}>A partir de</div>
              <div style={{ fontFamily: serif, fontSize: m ? 40 : 52, lineHeight: 1 }}>
                R$ 98<span style={{ fontSize: 18, color: p.muted }}>/mês</span>
              </div>
              <ul style={{ display: 'grid', gap: 8, marginTop: 16, fontSize: 14.5 }}>
                {['Cancele quando quiser', 'Moído ou em grãos', 'Cartinha do produtor'].map((t) => (
                  <li key={t} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Icon name="check" size={17} color={p.accent} stroke={2.4} /> {t}
                  </li>
                ))}
              </ul>
              <span style={{ display: 'block', textAlign: 'center', marginTop: 20, background: p.text, color: p.bg, borderRadius: 999, padding: '14px 0', fontWeight: 600 }}>Assinar o clube</span>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Endereços */}
      <section style={{ borderTop: `1px solid ${line}` }}>
        <Wrap m={m} style={{ padding: m ? '40px 20px' : '80px 48px' }}>
          <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 30 : 44 }}>Venha nos visitar</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 16 : 32, marginTop: m ? 20 : 36 }}>
            {[
              ['Vila Madalena', 'Rua Harmonia, 180', 'Seg a sáb · 7h–20h'],
              ['Centro', 'Largo do Café, 12', 'Seg a sex · 7h–19h'],
              ['Torrefação', 'Rua da Mooca, 902', 'Sáb · visitas às 10h'],
            ].map(([n, a, h]) => (
              <div key={n} style={{ display: 'flex', gap: 14, borderTop: `1px solid ${p.text}`, paddingTop: 16 }}>
                <Icon name="pin" size={22} color={p.accent} />
                <div>
                  <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 400 }}>{n}</h3>
                  <div style={{ fontSize: 14.5, marginTop: 4 }}>{a}</div>
                  <div style={{ fontSize: 14, color: p.muted }}>{h}</div>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      <footer style={{ background: p.text, color: p.bg }}>
        <Wrap m={m} style={{ display: 'flex', flexDirection: m ? 'column' : 'row', justifyContent: 'space-between', gap: 20, padding: m ? '36px 20px' : '48px 48px', alignItems: m ? 'flex-start' : 'center' }}>
          <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 30 }}>Crema Club</span>
          <span style={{ display: 'flex', gap: 22, fontSize: 14, opacity: 0.8, flexWrap: 'wrap' }}>
            {['Cardápio', 'Grãos', 'Clube', 'Trabalhe conosco', 'Instagram'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </span>
          <span style={{ fontSize: 12.5, opacity: 0.6 }}>© 2026 Crema Club — marca fictícia</span>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
