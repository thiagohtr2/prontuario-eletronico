import { isDark, mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, useSvgId, Wrap, type SiteProps } from './kit'

/** Fone de ouvido over-ear em vista frontal. */
function Headphones({ p }: { p: SitePalette }) {
  const id = useSvgId('lumen-hp')
  const dark = isDark(p.bg)
  const shell = dark ? '#2a2a2e' : '#d9d7d2'
  const shellHi = mix(shell, '#ffffff', dark ? 0.25 : 0.6)
  const shellLo = mix(shell, '#000000', dark ? 0.55 : 0.25)
  const cushion = dark ? '#121214' : '#3a3a3e'
  return (
    <svg viewBox="0 0 520 470" width="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id('metal')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shellHi} />
          <stop offset="0.5" stopColor={shell} />
          <stop offset="1" stopColor={shellLo} />
        </linearGradient>
        <radialGradient id={id('cup')} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={shellHi} />
          <stop offset="0.6" stopColor={shell} />
          <stop offset="1" stopColor={shellLo} />
        </radialGradient>
        <radialGradient id={id('floor')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000000" stopOpacity={dark ? 0.7 : 0.25} />
          <stop offset="1" stopColor="#000000" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={260} cy={452} rx={210} ry={14} fill={`url(#${id('floor')})`} />
      {/* Arco */}
      <path d="M96 250 C 96 90 170 30 260 30 C 350 30 424 90 424 250" stroke={shellLo} strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d="M96 250 C 96 90 170 30 260 30 C 350 30 424 90 424 250" stroke={`url(#${id('metal')})`} strokeWidth={24} fill="none" strokeLinecap="round" />
      <path d="M128 200 C 136 110 190 70 260 70 C 330 70 384 110 392 200" stroke={cushion} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M150 160 C 170 110 210 92 260 92" stroke={withAlpha('#ffffff', 0.08)} strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* Hastes */}
      {[96, 424].map((x) => (
        <g key={x}>
          <rect x={x - 7} y={226} width={14} height={60} rx={7} fill={`url(#${id('metal')})`} />
          <path d={`M${x - 30} 290 Q${x} 262 ${x + 30} 290`} stroke={`url(#${id('metal')})`} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* Conchas */}
      {[96, 424].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy={350} rx={84} ry={102} fill={shellLo} />
          <ellipse cx={x} cy={346} rx={80} ry={98} fill={`url(#${id('cup')})`} />
          <ellipse cx={x} cy={346} rx={58} ry={74} fill="none" stroke={withAlpha('#ffffff', dark ? 0.08 : 0.35)} strokeWidth={2} />
          <ellipse cx={x} cy={346} rx={30} ry={38} fill={shellLo} opacity={0.5} />
          <ellipse cx={x} cy={346} rx={80} ry={98} fill="none" stroke={p.accent} strokeWidth={2} opacity={0.85} />
          <rect x={x + (i ? -6 : 0) - 3} y={300} width={6} height={6} rx={3} fill={p.accent} />
        </g>
      ))}
    </svg>
  )
}

function Speaker({ p }: { p: SitePalette }) {
  const body = isDark(p.bg) ? '#26262a' : '#cfccc6'
  return (
    <svg viewBox="0 0 200 240" width="100%" aria-hidden="true" style={{ display: 'block' }}>
      <ellipse cx={100} cy={228} rx={60} ry={8} fill={withAlpha('#000000', 0.35)} />
      <rect x={52} y={20} width={96} height={204} rx={48} fill={body} />
      {Array.from({ length: 13 }, (_, r) =>
        Array.from({ length: 7 }, (_, c) => <circle key={`${r}-${c}`} cx={70 + c * 10} cy={60 + r * 11} r={2.4} fill={withAlpha('#000000', 0.35)} />),
      )}
      <circle cx={100} cy={40} r={6} fill={p.accent} />
    </svg>
  )
}

function Earbuds({ p }: { p: SitePalette }) {
  const shell = isDark(p.bg) ? '#efeee9' : '#2a2a2e'
  return (
    <svg viewBox="0 0 200 240" width="100%" aria-hidden="true" style={{ display: 'block' }}>
      <rect x={40} y={110} width={120} height={90} rx={40} fill={isDark(p.bg) ? '#2a2a2e' : '#d7d4ce'} />
      <path d="M40 140 L160 140" stroke={withAlpha('#000000', 0.3)} strokeWidth={2} />
      {[72, 128].map((x, i) => (
        <g key={x} transform={`rotate(${i ? 18 : -18} ${x} 90)`}>
          <circle cx={x} cy={80} r={22} fill={shell} />
          <circle cx={x} cy={80} r={10} fill={p.accent} opacity={0.85} />
          <rect x={x - 8} y={92} width={16} height={46} rx={8} fill={shell} />
        </g>
      ))}
      <circle cx={100} cy={176} r={4} fill={p.accent} />
    </svg>
  )
}

function Turntable({ p }: { p: SitePalette }) {
  const plinth = isDark(p.bg) ? '#1f1f22' : '#d9d5cd'
  return (
    <svg viewBox="0 0 200 240" width="100%" aria-hidden="true" style={{ display: 'block' }}>
      <rect x={14} y={50} width={172} height={150} rx={10} fill={plinth} />
      <circle cx={90} cy={125} r={62} fill="#0c0c0d" />
      {[52, 44, 36].map((r) => (
        <circle key={r} cx={90} cy={125} r={r} fill="none" stroke={withAlpha('#ffffff', 0.08)} />
      ))}
      <circle cx={90} cy={125} r={18} fill={p.accent} />
      <circle cx={90} cy={125} r={3} fill="#0c0c0d" />
      <path d="M166 66 L160 150 L132 168" stroke={mix(plinth, '#ffffff', 0.5)} strokeWidth={5} fill="none" strokeLinecap="round" />
      <circle cx={166} cy={66} r={9} fill={mix(plinth, '#ffffff', 0.35)} />
    </svg>
  )
}

export default function LumenAudio({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const display = ff('space-grotesk')
  const line = hair(p, 0.12)
  const glow = withAlpha(p.accent, isDark(p.bg) ? 0.16 : 0.12)
  const callouts: [string, string, number, number][] = [
    ['40 h', 'de bateria com cancelamento ligado', 4, 34],
    ['Berílio', 'drivers de 40 mm, graves sem distorção', 4, 66],
    ['Adaptativo', 'cancelamento que se ajusta ao ambiente', 76, 30],
    ['248 g', 'alumínio anodizado e couro vegano', 76, 64],
  ]
  return (
    <SiteRoot p={p} font={ff('inter')} name="LUMEN AUDIO">
      {/* Header minimalista */}
      <header style={{ position: 'relative', zIndex: 2 }}>
        <Wrap m={m} max={1280} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: m ? 60 : 72 }}>
          <span style={{ fontFamily: display, fontWeight: 300, letterSpacing: '0.5em', fontSize: m ? 16 : 18 }}>LUMEN</span>
          {!m && (
            <nav style={{ display: 'flex', gap: 34, fontSize: 13.5, color: p.muted, letterSpacing: '0.04em' }}>
              {['Fones', 'Caixas', 'Toca-discos', 'Acessórios', 'Suporte'].map((t, i) => (
                <span key={t} style={{ color: i === 0 ? p.text : p.muted }}>
                  {t}
                </span>
              ))}
            </nav>
          )}
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            {!m && <Icon name="search" size={19} />}
            <Icon name="bag" size={20} />
            {m && <Burger color={p.text} />}
          </div>
        </Wrap>
      </header>

      {/* Hero centrado no produto */}
      <section style={{ position: 'relative', textAlign: 'center', background: `radial-gradient(ellipse 50% 55% at 50% 45%, ${glow} 0%, transparent 70%)`, padding: m ? '24px 0 48px' : '32px 0 96px' }}>
        <div style={{ fontSize: 12.5, letterSpacing: '0.42em', color: p.accent, fontWeight: 600 }}>LUMEN ONE</div>
        <div style={{ position: 'relative', maxWidth: m ? 330 : 1100, margin: m ? '20px auto 0' : '24px auto 0' }}>
          <div style={{ width: m ? '100%' : 500, margin: '0 auto' }}>
            <Headphones p={p} />
          </div>
          {!m &&
            callouts.map(([t, d, x, y], i) => (
              <div key={t} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 210, textAlign: i < 2 ? 'right' : 'left' }}>
                <div style={{ fontFamily: display, fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em' }}>{t}</div>
                <div style={{ fontSize: 13.5, color: p.muted, marginTop: 2 }}>{d}</div>
                <div style={{ height: 1, background: `linear-gradient(${i < 2 ? '90deg' : '270deg'}, transparent, ${withAlpha(p.text, 0.4)})`, marginTop: 10 }} />
              </div>
            ))}
        </div>
        <Wrap m={m}>
          <h1 style={{ fontFamily: display, fontWeight: 400, fontSize: m ? 38 : 72, letterSpacing: '-0.04em', lineHeight: 1, marginTop: m ? 28 : 40 }}>Ouça o que o silêncio esconde.</h1>
          <p style={{ color: p.muted, fontSize: m ? 15.5 : 18, maxWidth: 560, margin: '16px auto 0' }}>Cancelamento de ruído adaptativo, som de estúdio e 40 horas de bateria. A partir de R$ 2.490.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexDirection: m ? 'column' : 'row' }}>
            <span style={{ background: p.accent, color: p.onAccent, borderRadius: 999, padding: '15px 34px', fontWeight: 600 }}>Comprar</span>
            <span style={{ border: `1px solid ${withAlpha(p.text, 0.3)}`, borderRadius: 999, padding: '15px 30px', fontWeight: 500, display: 'inline-flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="play" size={14} fill={p.text} color={p.text} /> Ouvir demonstração
            </span>
          </div>
        </Wrap>
        {m && (
          <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 32, textAlign: 'left' }}>
            {callouts.map(([t, d]) => (
              <div key={t} style={{ borderTop: `1px solid ${line}`, paddingTop: 12 }}>
                <div style={{ fontFamily: display, fontSize: 22 }}>{t}</div>
                <div style={{ fontSize: 12.5, color: p.muted }}>{d}</div>
              </div>
            ))}
          </Wrap>
        )}
      </section>

      {/* Resposta de frequência */}
      <section style={{ borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 4fr) minmax(0, 7fr)', gap: m ? 24 : 64, padding: m ? '48px 20px' : '112px 48px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12.5, letterSpacing: '0.3em', color: p.muted, fontWeight: 600 }}>ACÚSTICA</div>
            <h2 style={{ fontFamily: display, fontWeight: 400, fontSize: m ? 32 : 52, letterSpacing: '-0.035em', lineHeight: 1.02, marginTop: 14 }}>Afinado por ouvidos. Medido por máquinas.</h2>
            <p style={{ color: p.muted, marginTop: 16, fontSize: m ? 15 : 17 }}>Resposta plana de 20 Hz a 40 kHz, com um leve calor nos médios — do jeito que os engenheiros de mixagem gostam.</p>
          </div>
          <div style={{ background: p.surface, borderRadius: 20, padding: m ? 16 : 32, border: `1px solid ${line}` }}>
            <svg viewBox="0 0 640 280" width="100%" aria-hidden="true" style={{ display: 'block' }}>
              {[40, 100, 160, 220].map((y) => (
                <path key={y} d={`M40 ${y} L630 ${y}`} stroke={withAlpha(p.text, 0.08)} />
              ))}
              {Array.from({ length: 40 }, (_, i) => {
                const h = 30 + Math.abs(Math.sin(i * 0.55) * 90) + ((i * 13) % 30)
                return <rect key={i} x={44 + i * 14.6} y={240 - h} width={8} height={h} rx={2} fill={withAlpha(p.accent, 0.12 + (i % 5) * 0.03)} />
              })}
              <path d="M40 170 C 90 120 140 118 200 128 S 320 140 380 132 S 500 118 540 140 S 600 170 630 190" stroke={p.accent} strokeWidth={3} fill="none" />
              <path d="M40 190 C 120 160 200 160 300 165 S 520 150 630 210" stroke={withAlpha(p.text, 0.35)} strokeWidth={2} strokeDasharray="5 6" fill="none" />
              {['20 Hz', '100', '1 kHz', '10 kHz', '40 kHz'].map((t, i) => (
                <text key={t} x={40 + i * 138} y={268} fontSize={12} fill={p.muted} fontFamily={ff('jetbrains-mono')}>
                  {t}
                </text>
              ))}
            </svg>
            <div style={{ display: 'flex', gap: 20, fontSize: 12.5, color: p.muted, marginTop: 8 }}>
              <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <span style={{ width: 16, height: 3, background: p.accent }} /> LUMEN ONE
              </span>
              <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <span style={{ width: 16, borderTop: `2px dashed ${withAlpha(p.text, 0.35)}` }} /> Média da categoria
              </span>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Materiais */}
      <section style={{ padding: m ? '0 0 48px' : '0 0 112px' }}>
        <Wrap m={m} max={1280}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 12 : 20 }}>
            {[
              ['Alumínio escovado', 'Usinado de um bloco único', `repeating-linear-gradient(90deg, ${mix(p.secondary, '#ffffff', 0.25)} 0 1px, ${mix(p.secondary, '#ffffff', 0.12)} 1px 3px, ${mix(p.secondary, '#000000', 0.05)} 3px 4px)`],
              ['Couro vegano', 'Almofadas com espuma de memória', `radial-gradient(circle at 30% 30%, ${withAlpha('#ffffff', 0.12)}, transparent 40%), radial-gradient(${withAlpha('#000000', 0.25)} 1px, transparent 1.5px) 0 0 / 7px 7px, ${mix(p.accent, '#000000', 0.55)}`],
              ['Malha acústica', 'Tecido técnico transparente ao som', `radial-gradient(${withAlpha(p.text, 0.25)} 1.6px, transparent 2px) 0 0 / 10px 10px, radial-gradient(${withAlpha(p.text, 0.18)} 1.6px, transparent 2px) 5px 5px / 10px 10px, ${p.surface}`],
            ].map(([t, d, bg]) => (
              <figure key={t} style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${line}` }}>
                <div style={{ height: m ? 160 : 260, background: bg }} />
                <figcaption style={{ padding: m ? 16 : 20, background: p.surface }}>
                  <div style={{ fontFamily: display, fontSize: m ? 18 : 20 }}>{t}</div>
                  <div style={{ fontSize: 13.5, color: p.muted }}>{d}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Família de produtos */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ padding: m ? '48px 20px' : '112px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: display, fontWeight: 400, fontSize: m ? 32 : 52, letterSpacing: '-0.035em' }}>A família LUMEN</h2>
            <span style={{ color: p.accent, fontSize: 14.5 }}>Comparar todos →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 12 : 24, marginTop: m ? 24 : 44 }}>
            {(
              [
                ['Lumen Pod', 'Fones intra-auriculares', 'R$ 1.290', Earbuds],
                ['Lumen Tower', 'Caixa de som Wi-Fi', 'R$ 3.890', Speaker],
                ['Lumen Deck', 'Toca-discos com Bluetooth', 'R$ 4.590', Turntable],
              ] as const
            ).map(([n, d, price, Art]) => (
              <article key={n} style={{ background: p.bg, borderRadius: 24, padding: m ? 20 : 28, display: m ? 'grid' : 'block', gridTemplateColumns: '110px 1fr', gap: 16, alignItems: 'center' }}>
                <div style={{ background: `radial-gradient(circle at 50% 60%, ${glow}, transparent 70%)`, padding: m ? 0 : '12px 64px' }}>
                  <Art p={p} />
                </div>
                <div style={{ marginTop: m ? 0 : 16 }}>
                  <h3 style={{ fontFamily: display, fontWeight: 500, fontSize: m ? 20 : 24 }}>{n}</h3>
                  <div style={{ color: p.muted, fontSize: 14 }}>{d}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                    <span style={{ fontSize: 16 }}>{price}</span>
                    <span style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid ${withAlpha(p.text, 0.3)}`, display: 'grid', placeItems: 'center' }}>
                      <Icon name="arrow" size={16} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Especificações + avaliação */}
      <section>
        <Wrap m={m} max={1280} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: m ? 36 : 80, padding: m ? '48px 20px' : '112px 48px' }}>
          <div>
            <h2 style={{ fontFamily: display, fontWeight: 400, fontSize: m ? 28 : 40, letterSpacing: '-0.03em' }}>Especificações</h2>
            <dl style={{ marginTop: 20, fontFamily: ff('jetbrains-mono'), fontSize: 13.5 }}>
              {[
                ['Drivers', 'Berílio, 40 mm'],
                ['Resposta', '20 Hz – 40 kHz'],
                ['Bateria', '40 h (ANC ligado)'],
                ['Recarga', '10 min = 6 h'],
                ['Conexão', 'Bluetooth 5.4 · USB-C'],
                ['Peso', '248 g'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${line}` }}>
                  <dt style={{ color: p.muted }}>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Icon key={i} name="star" size={20} color={p.accent} fill={p.accent} stroke={1} />
              ))}
            </div>
            <blockquote style={{ fontFamily: display, fontWeight: 300, fontSize: m ? 26 : 38, lineHeight: 1.18, letterSpacing: '-0.02em', marginTop: 18 }}>
              “O fone mais silencioso que já testamos — e o mais musical.”
            </blockquote>
            <div style={{ color: p.muted, marginTop: 14, fontSize: 14 }}>Revista Alta Fidelidade (publicação fictícia), edição de outubro</div>
          </div>
        </Wrap>
      </section>

      <footer style={{ borderTop: `1px solid ${line}`, fontSize: 13.5, color: p.muted }}>
        <Wrap m={m} max={1280} style={{ display: 'flex', flexDirection: m ? 'column' : 'row', justifyContent: 'space-between', gap: 18, padding: m ? '32px 20px' : '48px 48px' }}>
          <span style={{ fontFamily: display, fontWeight: 300, letterSpacing: '0.5em', color: p.text }}>LUMEN</span>
          <span style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            {['Loja', 'Garantia', 'Manuais', 'Revendas', 'Contato'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </span>
          <span>© 2026 Lumen Audio — marca fictícia</span>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
