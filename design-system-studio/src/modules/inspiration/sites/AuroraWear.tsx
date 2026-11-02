import { mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, SiteRoot, useSvgId, Wrap, type SiteProps } from './kit'

type Outfit = 'coat' | 'dress' | 'suit' | 'knit'

/** Figura de moda estilizada (croqui vetorial). */
function Figure({ outfit, main, second, skin = '#d9a88a', hair: hairC = '#2a1d17' }: { outfit: Outfit; main: string; second: string; skin?: string; hair?: string }) {
  const id = useSvgId('aurora-fig')
  const shade = mix(main, '#000000', 0.25)
  return (
    <svg viewBox="0 0 200 540" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id('g')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mix(main, '#ffffff', 0.12)} />
          <stop offset="0.6" stopColor={main} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
      </defs>
      <ellipse cx={100} cy={528} rx={62} ry={8} fill={withAlpha('#000000', 0.12)} />
      {/* Pernas */}
      {outfit !== 'dress' && (
        <>
          <path d="M80 330 L74 510 L90 510 L100 340 Z" fill={outfit === 'suit' ? main : second} />
          <path d="M120 330 L126 510 L110 510 L100 340 Z" fill={outfit === 'suit' ? shade : mix(second, '#000000', 0.15)} />
        </>
      )}
      {outfit === 'dress' && (
        <>
          <path d="M88 420 L86 510 L94 510 L98 420 Z" fill={skin} />
          <path d="M112 420 L114 510 L106 510 L102 420 Z" fill={mix(skin, '#000000', 0.1)} />
        </>
      )}
      <path d="M70 510 L94 510 L94 520 L66 520 Z" fill="#1a1716" />
      <path d="M106 510 L130 510 L134 520 L106 520 Z" fill="#1a1716" />
      {/* Pescoço e cabeça */}
      <rect x={92} y={70} width={16} height={26} rx={6} fill={mix(skin, '#000000', 0.08)} />
      <ellipse cx={100} cy={52} rx={21} ry={26} fill={skin} />
      <path d="M78 54 Q76 22 100 22 Q126 22 122 56 Q118 36 100 36 Q86 38 78 54 Z" fill={hairC} />
      <path d="M118 40 Q134 70 126 104 Q120 80 116 60 Z" fill={hairC} />
      {/* Roupa */}
      {outfit === 'coat' && (
        <>
          <path d="M66 96 Q100 86 134 96 L150 420 Q100 436 50 420 Z" fill={`url(#${id('g')})`} />
          <path d="M100 96 L100 420" stroke={shade} strokeWidth={2} />
          <path d="M86 96 L100 150 L114 96" fill={second} />
          <path d="M66 100 Q52 200 58 320" stroke={shade} strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M134 100 Q148 200 142 320" stroke={shade} strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M70 230 Q100 240 130 230" stroke={shade} strokeWidth={6} fill="none" />
        </>
      )}
      {outfit === 'dress' && (
        <>
          <path d="M74 96 Q100 88 126 96 L128 200 L156 430 Q100 444 44 430 L72 200 Z" fill={`url(#${id('g')})`} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${86 + i * 10} 210 L${70 + i * 20} 430`} stroke={withAlpha('#000000', 0.12)} strokeWidth={2} />
          ))}
          <path d="M74 98 Q60 160 66 220" stroke={skin} strokeWidth={11} fill="none" strokeLinecap="round" />
          <path d="M126 98 Q140 160 134 220" stroke={mix(skin, '#000000', 0.1)} strokeWidth={11} fill="none" strokeLinecap="round" />
        </>
      )}
      {outfit === 'suit' && (
        <>
          <path d="M68 96 Q100 88 132 96 L140 330 L60 330 Z" fill={`url(#${id('g')})`} />
          <path d="M88 96 L100 200 L112 96" fill={second} />
          <path d="M88 96 L84 160 L100 200 M112 96 L116 160 L100 200" stroke={shade} strokeWidth={2} fill="none" />
          <path d="M68 100 Q56 200 62 300" stroke={shade} strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M132 100 Q144 200 138 300" stroke={shade} strokeWidth={14} fill="none" strokeLinecap="round" />
        </>
      )}
      {outfit === 'knit' && (
        <>
          <path d="M66 96 Q100 86 134 96 L138 300 Q100 312 62 300 Z" fill={`url(#${id('g')})`} />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${68 + i * 8} 110 L${66 + i * 8.6} 296`} stroke={withAlpha('#000000', 0.1)} strokeWidth={3} />
          ))}
          <path d="M66 100 Q50 200 58 300" stroke={shade} strokeWidth={16} fill="none" strokeLinecap="round" />
          <path d="M134 100 Q150 200 142 300" stroke={shade} strokeWidth={16} fill="none" strokeLinecap="round" />
          <rect x={84} y={90} width={32} height={14} rx={7} fill={shade} />
        </>
      )}
    </svg>
  )
}

/** Peça em "flat lay" para a vitrine de produtos. */
function Garment({ kind, color }: { kind: 'coat' | 'sweater' | 'trousers' | 'bag'; color: string }) {
  const shade = mix(color, '#000000', 0.22)
  return (
    <svg viewBox="0 0 200 240" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {kind === 'coat' && <path d="M70 30 L130 30 L170 70 L160 210 L120 214 L100 70 L80 214 L40 210 L30 70 Z" fill={color} stroke={shade} strokeWidth={2} />}
      {kind === 'sweater' && (
        <>
          <path d="M70 40 Q100 56 130 40 L176 70 L162 104 L146 96 L146 200 L54 200 L54 96 L38 104 L24 70 Z" fill={color} />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${62 + i * 10} 100 L${62 + i * 10} 196`} stroke={shade} strokeWidth={2} opacity={0.5} />
          ))}
        </>
      )}
      {kind === 'trousers' && <path d="M60 30 L140 30 L150 214 L112 214 L100 90 L88 214 L50 214 Z" fill={color} stroke={shade} strokeWidth={2} />}
      {kind === 'bag' && (
        <>
          <path d="M70 90 Q70 40 100 40 Q130 40 130 90" stroke={shade} strokeWidth={8} fill="none" />
          <rect x={40} y={86} width={120} height={110} rx={12} fill={color} />
          <rect x={88} y={110} width={24} height={14} rx={3} fill={shade} />
        </>
      )}
    </svg>
  )
}

export default function AuroraWear({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const serif = ff('fraunces')
  const line = hair(p, 0.14)
  const caps = { fontSize: m ? 11 : 12, letterSpacing: '0.24em', textTransform: 'uppercase' as const }
  const looks: [Outfit, string, string, string, number][] = [
    ['coat', 'Casaco Bruma + Calça Lume', p.accent, mix(p.secondary, p.text, 0.6), 1.25],
    ['knit', 'Tricô Neve + Saia Pó', mix(p.secondary, '#ffffff', 0.3), mix(p.text, p.secondary, 0.4), 1],
    ['suit', 'Alfaiataria Grafite', mix(p.text, p.bg, 0.25), mix(p.bg, '#ffffff', 0.4), 1.12],
    ['dress', 'Vestido Aurora em lã fria', mix(p.accent, p.secondary, 0.45), p.secondary, 1.12],
    ['coat', 'Sobretudo Camelo', p.secondary, mix(p.text, p.bg, 0.2), 1],
    ['knit', 'Cardigã Ferrugem + Calça Lume', mix(p.accent, '#c06a3a', 0.4), mix(p.secondary, p.text, 0.55), 1.25],
  ]
  return (
    <SiteRoot p={p} font={ff('inter')} name="AURORA WEAR">
      <div style={{ background: p.text, color: p.bg, textAlign: 'center', padding: '8px 16px', ...caps, fontSize: 11, letterSpacing: '0.18em' }}>
        {m ? 'Frete grátis acima de R$ 600' : 'Frete grátis acima de R$ 600 · Trocas em 30 dias · Ateliê em São Paulo'}
      </div>
      {/* Header de marca de moda */}
      <header style={{ borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1440} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: m ? 64 : 88 }}>
          <nav style={{ display: 'flex', gap: 28, ...caps, fontSize: 12 }}>{m ? <Burger color={p.text} weight={1.4} /> : ['Mulher', 'Homem', 'Coleção', 'Lookbook'].map((t) => <span key={t}>{t}</span>)}</nav>
          <span style={{ fontFamily: serif, fontWeight: 300, fontSize: m ? 26 : 38, letterSpacing: '0.5em', paddingLeft: '0.5em' }}>AURORA</span>
          <nav style={{ display: 'flex', gap: 24, justifyContent: 'flex-end', ...caps, fontSize: 12 }}>
            {!m && <span>Buscar</span>}
            {!m && <span>Conta</span>}
            <span>Sacola (1)</span>
          </nav>
        </Wrap>
      </header>

      {/* Hero editorial */}
      <section>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '7fr 5fr', maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ position: 'relative', height: m ? 480 : 820, background: `linear-gradient(180deg, ${mix(p.secondary, p.bg, 0.35)} 0%, ${p.secondary} 100%)`, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '50%', top: '4%', bottom: '4%', width: m ? '46%' : '38%', transform: 'translateX(-50%)' }}>
              <Figure outfit="coat" main={p.accent} second={mix(p.secondary, p.text, 0.6)} />
            </div>
            <div style={{ position: 'absolute', left: m ? 16 : 40, bottom: m ? 16 : 40, ...caps, fontSize: 11 }}>Look 01 — Casaco Bruma</div>
            <div aria-hidden="true" style={{ position: 'absolute', right: m ? -8 : 24, top: m ? 12 : 40, fontFamily: serif, fontWeight: 300, fontSize: m ? 80 : 180, lineHeight: 0.8, color: withAlpha(p.text, 0.12) }}>26</div>
          </div>
          <div style={{ padding: m ? '36px 20px 48px' : '96px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 32 }}>
            <div style={caps}>Coleção · Outono / Inverno 2026</div>
            <div>
              <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: m ? 56 : 112, lineHeight: 0.9, letterSpacing: '-0.04em' }}>
                Inverno
                <br />
                <em style={{ fontWeight: 300 }}>em camadas</em>
              </h1>
              <p style={{ color: p.muted, fontSize: m ? 15.5 : 17, marginTop: 24, maxWidth: 380, lineHeight: 1.7 }}>Lã fria, silhuetas longas e uma cartela que vai do camelo ao vinho. Peças feitas para atravessar estações.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 32, flexDirection: m ? 'column' : 'row' }}>
                <span style={{ background: p.text, color: p.bg, padding: '16px 30px', textAlign: 'center', ...caps, fontSize: 12 }}>Ver lookbook</span>
                <span style={{ border: `1px solid ${p.text}`, padding: '15px 30px', textAlign: 'center', ...caps, fontSize: 12 }}>Comprar coleção</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: m ? 96 : 140, height: m ? 120 : 176, flex: 'none', background: `repeating-linear-gradient(45deg, ${mix(p.accent, '#000000', 0.1)} 0 6px, ${p.accent} 6px 12px), ${p.accent}` }} />
              <div style={{ fontSize: 13.5, color: p.muted, lineHeight: 1.6 }}>
                <div style={{ ...caps, fontSize: 11, color: p.text }}>Detalhe</div>
                Sarja de lã merino com 32% de lã reciclada, tecida em Minas Gerais.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook */}
      <section style={{ borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1440} style={{ padding: m ? '48px 20px' : '112px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
            <h2 style={{ fontFamily: serif, fontWeight: 300, fontSize: m ? 38 : 72, letterSpacing: '-0.03em' }}>Lookbook</h2>
            <span style={caps}>12 looks</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))', gap: m ? 12 : 28, marginTop: m ? 24 : 48, alignItems: 'end' }}>
            {looks.slice(0, 6).map(([outfit, caption, main, second, ratio], i) => (
              <figure key={caption}>
                <div style={{ height: (m ? 240 : 460) * ratio, background: i % 2 ? p.surface : mix(p.secondary, p.bg, 0.55), padding: m ? '16px 8px 8px' : '40px 24px 16px' }}>
                  <Figure outfit={outfit} main={main} second={second} skin={['#d9a88a', '#8d5a3b', '#f0c8a8', '#b67a52', '#e3b394', '#6d4530'][i]} hair={['#2a1d17', '#120c0a', '#7a4a2a', '#1a1210', '#4a2f20', '#0f0a08'][i]} />
                </div>
                <figcaption style={{ display: 'flex', gap: 10, marginTop: 12, fontSize: m ? 12.5 : 14 }}>
                  <span style={{ ...caps, fontSize: 11, color: p.muted, letterSpacing: '0.16em', whiteSpace: 'nowrap' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Peças */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1440} style={{ padding: m ? '48px 20px' : '96px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: serif, fontWeight: 300, fontSize: m ? 32 : 48, letterSpacing: '-0.02em' }}>Peças da coleção</h2>
            <span style={{ ...caps, borderBottom: `1px solid ${p.text}`, paddingBottom: 3 }}>Ver todas</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 12 : 24, marginTop: m ? 24 : 40 }}>
            {(
              [
                ['Casaco Bruma', 'R$ 1.480', 'coat', p.accent, [p.accent, p.secondary, p.text]],
                ['Tricô Neve', 'R$ 690', 'sweater', mix(p.secondary, '#ffffff', 0.35), [mix(p.secondary, '#ffffff', 0.35), p.text]],
                ['Calça Lume', 'R$ 540', 'trousers', mix(p.text, p.bg, 0.3), [mix(p.text, p.bg, 0.3), p.secondary]],
                ['Bolsa Dia', 'R$ 820', 'bag', mix(p.accent, '#5a2a1a', 0.45), [mix(p.accent, '#5a2a1a', 0.45), p.text]],
              ] as [string, string, 'coat' | 'sweater' | 'trousers' | 'bag', string, string[]][]
            ).map(([n, price, kind, color, swatches]) => (
              <article key={n}>
                <div style={{ aspectRatio: '3 / 4', background: p.bg, padding: '14%', display: 'grid', placeItems: 'center' }}>
                  <Garment kind={kind} color={color} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 12, fontSize: m ? 13 : 14.5, flexWrap: 'wrap' }}>
                  <span>{n}</span>
                  <span>{price}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  {swatches.map((c, i) => (
                    <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, boxShadow: i === 0 ? `0 0 0 2px ${p.surface}, 0 0 0 3px ${p.text}` : `inset 0 0 0 1px ${withAlpha(p.text, 0.2)}` }} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Editorial */}
      <section>
        <Wrap m={m} max={1200} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: m ? 28 : 80, padding: m ? '56px 20px' : '128px 48px', alignItems: 'center' }}>
          <blockquote style={{ fontFamily: serif, fontWeight: 300, fontStyle: 'italic', fontSize: m ? 30 : 52, lineHeight: 1.12, letterSpacing: '-0.02em' }}>
            “Quero roupas que envelheçam junto com quem as veste.”
          </blockquote>
          <div>
            <div style={caps}>Marina Toledo, diretora criativa</div>
            <p style={{ color: p.muted, marginTop: 18, lineHeight: 1.8, fontSize: m ? 15 : 16.5 }}>
              A coleção nasceu de caminhadas pelo litoral no inverno: o cinza do mar, o camelo da areia molhada e o vinho das primeiras horas da manhã. Cada peça é produzida em pequenas tiragens, numeradas à mão.
            </p>
            <span style={{ display: 'inline-block', marginTop: 24, ...caps, fontSize: 12, borderBottom: `1px solid ${p.text}`, paddingBottom: 3 }}>Ler a entrevista</span>
          </div>
        </Wrap>
      </section>

      {/* Campanha */}
      <section style={{ background: p.accent, color: p.onAccent }}>
        <Wrap m={m} max={1440} style={{ padding: m ? '56px 20px' : '120px 48px', textAlign: 'center' }}>
          <div style={{ ...caps, opacity: 0.8 }}>Feito para durar</div>
          <h2 style={{ fontFamily: serif, fontWeight: 300, fontSize: m ? 44 : 120, letterSpacing: '-0.04em', lineHeight: 0.92, marginTop: 18 }}>Compre menos, escolha melhor.</h2>
          <span style={{ display: 'inline-block', marginTop: 36, background: p.onAccent, color: p.accent, padding: '16px 34px', ...caps, fontSize: 12 }}>Conhecer o ateliê</span>
        </Wrap>
      </section>

      <footer>
        <Wrap m={m} max={1440} style={{ padding: m ? '40px 20px 28px' : '72px 48px 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '2fr repeat(3, 1fr)', gap: 28, fontSize: 13.5 }}>
            <div style={{ gridColumn: m ? '1 / -1' : 'auto' }}>
              <span style={{ fontFamily: serif, fontWeight: 300, fontSize: 28, letterSpacing: '0.5em' }}>AURORA</span>
              <div style={{ display: 'flex', borderBottom: `1px solid ${p.text}`, marginTop: 18, maxWidth: 360 }}>
                <span style={{ flex: 1, padding: '10px 0', color: p.muted }}>Seu e-mail para novidades</span>
                <span style={{ padding: '10px 0', ...caps, fontSize: 11 }}>Assinar</span>
              </div>
            </div>
            {[
              ['Loja', ['Mulher', 'Homem', 'Acessórios', 'Vale-presente']],
              ['Ajuda', ['Trocas', 'Entregas', 'Guia de medidas', 'Contato']],
              ['Marca', ['Ateliê', 'Sustentabilidade', 'Lojas', 'Imprensa']],
            ].map(([t, items]) => (
              <div key={t as string}>
                <div style={{ ...caps, fontSize: 11, color: p.muted }}>{t as string}</div>
                <ul style={{ display: 'grid', gap: 6, marginTop: 12 }}>
                  {(items as string[]).map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ ...caps, fontSize: 10.5, color: p.muted, marginTop: 40 }}>© 2026 Aurora Wear — marca fictícia</div>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
