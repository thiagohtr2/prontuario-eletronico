import { mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, useSvgId, Wrap, type SiteProps } from './kit'

type PlantKind = 'monstera' | 'snake' | 'pilea' | 'ficus' | 'fern'

function Pot({ p, cx = 200, top = 392, w = 170 }: { p: SitePalette; cx?: number; top?: number; w?: number }) {
  const pot = mix(p.secondary, p.text, 0.12)
  const band = mix(p.secondary, p.text, 0.28)
  const h = w * 0.62
  return (
    <g>
      <path d={`M${cx - w / 2 + 8} ${top + 18} L${cx + w / 2 - 8} ${top + 18} L${cx + w / 2 - 22} ${top + h} Q${cx} ${top + h + 8} ${cx - w / 2 + 22} ${top + h} Z`} fill={pot} />
      <rect x={cx - w / 2} y={top} width={w} height={24} rx={5} fill={band} />
      <path d={`M${cx - w / 2 + 14} ${top + 46} L${cx + w / 2 - 14} ${top + 46}`} stroke={withAlpha(p.bg, 0.35)} strokeWidth={3} />
    </g>
  )
}

function MonsteraLeaf({ x, y, rot, s, color, cut, rib }: { x: number; y: number; rot: number; s: number; color: string; cut: string; rib: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 -14 C -18 4 -70 4 -86 -40 C -100 -90 -60 -150 0 -160 C 60 -150 100 -90 86 -40 C 70 4 18 4 0 -14 Z" fill={color} />
      <path d="M0 -14 L0 -152" stroke={rib} strokeWidth={3} strokeLinecap="round" />
      <g stroke={cut} strokeWidth={7} strokeLinecap="round">
        <path d="M-90 -52 L-44 -60" />
        <path d="M-86 -94 L-40 -90" />
        <path d="M-60 -136 L-26 -116" />
        <path d="M90 -52 L44 -60" />
        <path d="M86 -94 L40 -90" />
        <path d="M60 -136 L26 -116" />
      </g>
      <ellipse cx={-20} cy={-70} rx={6} ry={10} fill={cut} />
      <ellipse cx={20} cy={-100} rx={5} ry={9} fill={cut} />
    </g>
  )
}

/** Ilustrações botânicas em SVG, uma por espécie. */
export function Plant({ p, kind, cut }: { p: SitePalette; kind: PlantKind; cut: string }) {
  const leaf = p.accent
  const light = mix(p.accent, '#ffffff', 0.22)
  const dark = mix(p.accent, '#000000', 0.25)
  const stem = mix(p.accent, p.text, 0.3)
  return (
    <svg viewBox="0 0 400 520" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style={{ display: 'block' }}>
      {kind === 'monstera' && (
        <g>
          <g stroke={stem} strokeWidth={5} fill="none" strokeLinecap="round">
            <path d="M200 400 C 196 330 150 260 110 210" />
            <path d="M204 400 C 210 300 250 240 300 190" />
            <path d="M200 400 C 200 320 196 200 200 130" />
            <path d="M198 400 C 180 340 120 330 80 320" />
            <path d="M206 400 C 230 350 290 340 330 330" />
          </g>
          <MonsteraLeaf x={110} y={214} rot={-38} s={0.95} color={leaf} cut={cut} rib={dark} />
          <MonsteraLeaf x={300} y={194} rot={34} s={0.9} color={light} cut={cut} rib={dark} />
          <MonsteraLeaf x={200} y={136} rot={-4} s={0.82} color={dark} cut={cut} rib={leaf} />
          <MonsteraLeaf x={82} y={324} rot={-70} s={0.62} color={light} cut={cut} rib={dark} />
          <MonsteraLeaf x={328} y={334} rot={68} s={0.6} color={leaf} cut={cut} rib={dark} />
          <Pot p={p} />
        </g>
      )}
      {kind === 'snake' && (
        <g>
          {[
            [-60, -8, 250, light],
            [-30, -3, 320, leaf],
            [0, 1, 360, dark],
            [30, 5, 300, leaf],
            [58, 10, 230, light],
          ].map(([dx, rot, h, c], i) => (
            <g key={i} transform={`translate(${200 + Number(dx)} 400) rotate(${rot})`}>
              <path d={`M-16 0 C -22 ${-Number(h) * 0.4} -14 ${-Number(h) * 0.8} 0 ${-Number(h)} C 14 ${-Number(h) * 0.8} 22 ${-Number(h) * 0.4} 16 0 Z`} fill={String(c)} />
              {[0.2, 0.36, 0.52, 0.68].map((t) => (
                <path key={t} d={`M-12 ${-Number(h) * t} Q 0 ${-Number(h) * t - 10} 12 ${-Number(h) * t}`} stroke={withAlpha(p.bg, 0.4)} strokeWidth={3} fill="none" />
              ))}
            </g>
          ))}
          <Pot p={p} />
        </g>
      )}
      {kind === 'pilea' && (
        <g>
          {[
            [130, 250, 34],
            [196, 190, 40],
            [270, 240, 36],
            [100, 320, 28],
            [300, 320, 30],
            [160, 300, 26],
            [240, 300, 30],
            [210, 260, 22],
          ].map(([x, y, rr], i) => (
            <g key={i}>
              <path d={`M200 400 Q ${(200 + x) / 2} ${y + 80} ${x} ${y}`} stroke={stem} strokeWidth={3} fill="none" />
              <circle cx={x} cy={y} r={rr} fill={i % 3 === 0 ? dark : i % 3 === 1 ? leaf : light} />
              <circle cx={x} cy={y} r={3.5} fill={withAlpha(p.bg, 0.6)} />
            </g>
          ))}
          <Pot p={p} />
        </g>
      )}
      {kind === 'ficus' && (
        <g>
          <path d="M200 400 C 196 320 206 240 200 110" stroke={stem} strokeWidth={9} fill="none" strokeLinecap="round" />
          {[
            [200, 112, 0, dark],
            [180, 160, -50, leaf],
            [222, 190, 48, light],
            [176, 236, -58, dark],
            [226, 270, 54, leaf],
            [178, 312, -62, light],
            [222, 346, 60, dark],
          ].map(([x, y, rot, c], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
              <path d="M0 0 C -34 -10 -40 -50 -24 -74 C -14 -90 -30 -104 0 -112 C 30 -104 14 -90 24 -74 C 40 -50 34 -10 0 0 Z" fill={String(c)} />
              <path d="M0 0 L0 -104" stroke={withAlpha(p.bg, 0.35)} strokeWidth={2} />
            </g>
          ))}
          <Pot p={p} />
        </g>
      )}
      {kind === 'fern' && (
        <g>
          {[-62, -36, -12, 12, 36, 62].map((a, i) => (
            <g key={a} transform={`translate(200 398) rotate(${a})`}>
              <path d="M0 0 Q 18 -120 0 -230" stroke={stem} strokeWidth={3} fill="none" />
              {Array.from({ length: 11 }, (_, k) => {
                const t = (k + 1) / 12
                const y = -230 * t
                const x = 18 * Math.sin(Math.PI * t) * 0.9
                const len = 34 * (1 - t * 0.7)
                return (
                  <g key={k}>
                    <ellipse cx={x - len / 2} cy={y} rx={len / 2} ry={5} fill={i % 2 ? leaf : light} transform={`rotate(-18 ${x} ${y})`} />
                    <ellipse cx={x + len / 2} cy={y} rx={len / 2} ry={5} fill={i % 2 ? dark : leaf} transform={`rotate(18 ${x} ${y})`} />
                  </g>
                )
              })}
            </g>
          ))}
          <Pot p={p} />
        </g>
      )}
    </svg>
  )
}

function Seal({ p, size }: { p: SitePalette; size: number }) {
  const id = useSvgId('va-seal')
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <path id={id('c')} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx={60} cy={60} r={58} fill={p.bg} stroke={hair(p, 0.25)} />
      <text fontSize={10.5} letterSpacing={3.2} fill={p.text} fontFamily={ff('inter')} fontWeight={600}>
        <textPath href={`#${id('c')}`}>PLANTADO À MÃO · DESDE 2016 ·</textPath>
      </text>
      <path d="M60 78c0-18 8-30 20-34-1 16-8 28-20 34zM60 78c0-14-6-24-16-27 1 13 6 22 16 27z" fill={p.accent} />
    </svg>
  )
}

const PRODUCTS: { kind: PlantKind; latin: string; common: string; price: string; tag: string }[] = [
  { kind: 'ficus', latin: 'Ficus lyrata', common: 'Figueira-lira', price: 'R$ 189', tag: 'Luz indireta' },
  { kind: 'snake', latin: 'Dracaena trifasciata', common: 'Espada-de-são-jorge', price: 'R$ 96', tag: 'Pouca água' },
  { kind: 'pilea', latin: 'Pilea peperomioides', common: 'Planta-moeda', price: 'R$ 74', tag: 'Pet friendly' },
  { kind: 'fern', latin: 'Nephrolepis exaltata', common: 'Samambaia-americana', price: 'R$ 82', tag: 'Meia-sombra' },
]

export default function VerdantAtelier({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const serif = ff('fraunces')
  const sans = ff('inter')
  const line = hair(p)
  const cut = p.surface
  return (
    <SiteRoot p={p} font={sans} name="Verdant Atelier">
      {/* Faixa de aviso */}
      <div style={{ background: p.accent, color: p.onAccent, textAlign: 'center', fontSize: 12.5, padding: '9px 16px', letterSpacing: '0.02em' }}>
        {m ? 'Frete grátis acima de R$ 250' : 'Frete grátis para mudas acima de R$ 250 · Vasos de cerâmica feitos à mão no nosso ateliê'}
      </div>

      {/* Header com logo central e navegação dividida */}
      <header style={{ borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: m ? 64 : 88 }}>
          <nav style={{ display: 'flex', gap: 28, fontSize: 14.5, alignItems: 'center' }}>
            {m ? <Burger color={p.text} /> : ['Plantas', 'Vasos', 'Oficinas'].map((t) => <span key={t}>{t}</span>)}
          </nav>
          <div style={{ textAlign: 'center', lineHeight: 1 }}>
            <div style={{ fontFamily: serif, fontSize: m ? 24 : 32, fontStyle: 'italic', fontWeight: 420, letterSpacing: '-0.01em' }}>Verdant</div>
            <div style={{ fontSize: m ? 9 : 10.5, letterSpacing: '0.42em', marginTop: 4, color: p.muted, fontWeight: 600 }}>ATELIER</div>
          </div>
          <nav style={{ display: 'flex', gap: 28, fontSize: 14.5, justifyContent: 'flex-end', alignItems: 'center' }}>
            {!m && <span>Diário</span>}
            {!m && <Icon name="search" size={19} />}
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="bag" size={20} />
              {!m && '(2)'}
            </span>
          </nav>
        </Wrap>
      </header>

      {/* Hero editorial assimétrico */}
      <section>
        <Wrap
          m={m}
          style={{
            display: 'grid',
            gridTemplateColumns: m ? '1fr' : 'minmax(0, 7fr) minmax(0, 5fr)',
            gap: m ? 28 : 64,
            alignItems: 'center',
            padding: m ? '28px 20px 48px' : '72px 48px 96px',
          }}
        >
          <div style={{ order: m ? 2 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12.5, letterSpacing: '0.2em', color: p.muted, fontWeight: 600 }}>
              <span style={{ width: 36, height: 1, background: p.muted }} />
              COLEÇÃO PRIMAVERA · Nº 07
            </div>
            <h1 style={{ fontFamily: serif, fontWeight: 380, fontSize: m ? 46 : 96, lineHeight: 0.98, letterSpacing: '-0.035em', margin: m ? '16px 0 18px' : '24px 0 28px' }}>
              A arte de cultivar <em style={{ color: p.accent, fontWeight: 340 }}>devagar.</em>
            </h1>
            <p style={{ fontSize: m ? 16 : 18.5, color: p.muted, maxWidth: 470, lineHeight: 1.6 }}>
              Plantas escolhidas uma a uma, vasos torneados em pequenas fornadas e um guia de cuidado que acompanha cada muda pela vida inteira.
            </p>
            <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: m ? 14 : 28, alignItems: m ? 'stretch' : 'center', marginTop: 32 }}>
              <span style={{ background: p.accent, color: p.onAccent, borderRadius: 999, padding: '15px 30px', fontWeight: 600, fontSize: 15, textAlign: 'center' }}>Explorar coleção</span>
              <span style={{ borderBottom: `1px solid ${p.text}`, paddingBottom: 3, fontSize: 15, alignSelf: m ? 'center' : 'auto' }}>Agendar visita ao ateliê →</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', marginTop: m ? 36 : 56, borderTop: `1px solid ${line}` }}>
              {[
                ['120+', 'espécies no viveiro'],
                ['48 h', 'para entrega local'],
                ['∞', 'guia de cuidado'],
              ].map(([n, t], i) => (
                <div key={t} style={{ padding: m ? '14px 8px 0 0' : '20px 20px 0 0', borderLeft: i ? `1px solid ${line}` : 'none', paddingLeft: i ? (m ? 10 : 20) : 0 }}>
                  <div style={{ fontFamily: serif, fontSize: m ? 24 : 34, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: m ? 12.5 : 13.5, color: p.muted, marginTop: 6 }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
          <figure style={{ order: m ? 1 : 2, position: 'relative', justifySelf: 'center', width: '100%', maxWidth: m ? 360 : 460 }}>
            <div
              style={{
                height: m ? 380 : 580,
                borderRadius: m ? '180px 180px 6px 6px' : '230px 230px 8px 8px',
                background: `linear-gradient(180deg, ${p.surface} 0%, ${mix(p.surface, p.secondary, 0.35)} 100%)`,
                border: `1px solid ${line}`,
                padding: m ? '40px 16px 0' : '60px 24px 0',
                overflow: 'hidden',
              }}
            >
              <Plant p={p} kind="monstera" cut={mix(p.surface, p.secondary, 0.2)} />
            </div>
            <div style={{ position: 'absolute', left: m ? -6 : -44, bottom: m ? 54 : 90 }}>
              <Seal p={p} size={m ? 84 : 116} />
            </div>
            <figcaption style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 14, color: p.muted, marginTop: 12, textAlign: 'right' }}>
              Fig. 01 — Monstera deliciosa, 1,2 m
            </figcaption>
          </figure>
        </Wrap>
      </section>

      {/* Coleção da estação */}
      <section style={{ padding: m ? '8px 0 56px' : '24px 0 112px' }}>
        <Wrap m={m}>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 16, marginBottom: m ? 24 : 40, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12.5, letterSpacing: '0.2em', color: p.muted, fontWeight: 600 }}>VIVEIRO</div>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 32 : 52, letterSpacing: '-0.02em', marginTop: 8 }}>Coleção da estação</h2>
            </div>
            <span style={{ fontSize: 14.5, borderBottom: `1px solid ${p.text}`, paddingBottom: 2 }}>Ver as 120 espécies →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 14 : 28 }}>
            {PRODUCTS.map((it) => (
              <article key={it.latin}>
                <div
                  style={{
                    height: m ? 200 : 330,
                    background: p.surface,
                    borderRadius: m ? '90px 90px 4px 4px' : '140px 140px 6px 6px',
                    border: `1px solid ${line}`,
                    padding: m ? '22px 6px 0' : '36px 16px 0',
                    position: 'relative',
                  }}
                >
                  <Plant p={p} kind={it.kind} cut={cut} />
                  <span style={{ position: 'absolute', top: m ? 10 : 16, left: '50%', transform: 'translateX(-50%)', fontSize: 11, letterSpacing: '0.08em', background: p.bg, border: `1px solid ${line}`, borderRadius: 999, padding: '3px 10px', whiteSpace: 'nowrap' }}>
                    {it.tag}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 14, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 400, fontSize: m ? 16 : 21 }}>{it.latin}</h3>
                  <span style={{ fontWeight: 600, fontSize: m ? 13.5 : 15 }}>{it.price}</span>
                </div>
                <div style={{ fontSize: 13.5, color: p.muted, marginTop: 2 }}>{it.common}</div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Diário: ensaio editorial */}
      <section style={{ borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) 1px minmax(0, 1fr)', gap: m ? 28 : 64, padding: m ? '48px 20px' : '96px 48px' }}>
          <div>
            <div style={{ fontSize: 12.5, letterSpacing: '0.2em', color: p.muted, fontWeight: 600 }}>DIÁRIO · ENSAIO Nº 18</div>
            <blockquote style={{ fontFamily: serif, fontStyle: 'italic', fontWeight: 340, fontSize: m ? 30 : 46, lineHeight: 1.12, letterSpacing: '-0.02em', marginTop: 20 }}>
              “Toda planta conta o tempo de um jeito diferente. A gente só aprende a escutar.”
            </blockquote>
            <div style={{ marginTop: 20, fontSize: 14, color: p.muted }}>— Inês Duarte, botânica residente</div>
          </div>
          {!m && <div style={{ background: line }} />}
          <div style={{ fontSize: m ? 15.5 : 17, lineHeight: 1.75, color: mix(p.text, p.bg, 0.12) }}>
            <p>
              <span style={{ float: 'left', fontFamily: serif, fontSize: m ? 58 : 76, lineHeight: 0.8, padding: '8px 12px 0 0', color: p.accent }}>N</span>o
              inverno, uma figueira-lira quase não cresce — e isso é ótimo. Ela está fortalecendo raízes, guardando energia para as folhas novas que vão aparecer quando os dias ficarem longos.
            </p>
            <p style={{ marginTop: 18 }}>
              Neste ensaio, reunimos o que aprendemos em dez anos de viveiro sobre ritmo, paciência e o erro mais comum de quem começa: regar demais por carinho.
            </p>
            <span style={{ display: 'inline-block', marginTop: 24, fontWeight: 600, color: p.accent }}>Ler o ensaio completo →</span>
          </div>
        </Wrap>
      </section>

      {/* Guia de cuidados */}
      <section style={{ background: p.surface }}>
        <Wrap m={m} style={{ padding: m ? '48px 20px' : '96px 48px' }}>
          <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 30 : 46, letterSpacing: '-0.02em', maxWidth: 560 }}>Guia de cuidados em quatro gestos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 20 : 32, marginTop: m ? 28 : 48 }}>
            {(
              [
                ['01', 'Luz', 'sun', 'Perto da janela, sem sol direto do meio-dia nas folhas.'],
                ['02', 'Água', 'drop', 'Regue quando os dois primeiros dedos de terra estiverem secos.'],
                ['03', 'Solo', 'leaf', 'Substrato aerado, com casca de pinus e húmus de minhoca.'],
                ['04', 'Tempo', 'clock', 'Troque de vaso a cada primavera, só se as raízes pedirem.'],
              ] as const
            ).map(([n, t, icon, d]) => (
              <div key={n} style={{ borderTop: `1px solid ${p.text}`, paddingTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: serif, fontSize: 15, color: p.muted }}>{n}</span>
                  <Icon name={icon} size={22} color={p.accent} />
                </div>
                <h3 style={{ fontFamily: serif, fontSize: m ? 22 : 28, fontWeight: 400, marginTop: 14 }}>{t}</h3>
                <p style={{ fontSize: m ? 13.5 : 15, color: p.muted, marginTop: 8, lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* CTA de oficinas */}
      <section style={{ background: p.accent, color: p.onAccent }}>
        <Wrap m={m} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1.2fr) minmax(0, 1fr)', alignItems: 'center', gap: m ? 24 : 48, padding: m ? '48px 20px' : '88px 48px' }}>
          <div>
            <div style={{ fontSize: 12.5, letterSpacing: '0.2em', opacity: 0.8, fontWeight: 600 }}>OFICINAS · SÁBADOS, 10H</div>
            <h2 style={{ fontFamily: serif, fontWeight: 380, fontSize: m ? 34 : 60, letterSpacing: '-0.025em', lineHeight: 1.02, marginTop: 14 }}>
              Monte seu terrário com quem entende de musgo.
            </h2>
            <p style={{ marginTop: 18, opacity: 0.85, maxWidth: 460, fontSize: m ? 15 : 17 }}>Turmas de oito pessoas, todo o material incluso e café da casa. Você leva o vidro para casa no mesmo dia.</p>
            <span style={{ display: 'inline-block', marginTop: 28, background: p.bg, color: p.text, borderRadius: 999, padding: '14px 28px', fontWeight: 600, fontSize: 15 }}>Reservar vaga — R$ 160</span>
          </div>
          <svg viewBox="0 0 320 300" style={{ width: '100%', maxWidth: m ? 260 : 360, justifySelf: 'center', display: 'block' }} aria-hidden="true">
            <ellipse cx={160} cy={282} rx={120} ry={10} fill={withAlpha(p.onAccent, 0.12)} />
            <path d="M60 120 Q60 80 100 70 L220 70 Q260 80 260 120 L260 230 Q260 280 160 280 Q60 280 60 230 Z" fill={withAlpha(p.onAccent, 0.1)} stroke={withAlpha(p.onAccent, 0.55)} strokeWidth={3} />
            <rect x={110} y={52} width={100} height={22} rx={6} fill={withAlpha(p.onAccent, 0.35)} />
            <path d="M64 236 Q160 214 256 236 L256 240 Q250 278 160 278 Q70 278 64 240 Z" fill={mix(p.secondary, '#000000', 0.25)} />
            <path d="M62 216 Q160 196 258 216 L258 238 Q160 216 62 238 Z" fill={mix(p.secondary, '#ffffff', 0.15)} />
            <path d="M62 200 Q160 186 258 200 L258 218 Q160 198 62 218 Z" fill={withAlpha(p.onAccent, 0.4)} />
            {[95, 140, 190, 225].map((x, i) => (
              <g key={x}>
                <path d={`M${x} 200 Q ${x - 6} ${170 - i * 6} ${x + 4} ${140 - i * 10}`} stroke={withAlpha(p.onAccent, 0.75)} strokeWidth={3} fill="none" />
                <ellipse cx={x + 4} cy={140 - i * 10} rx={10} ry={16} fill={mix(p.accent, '#ffffff', 0.35 + i * 0.1)} />
                <ellipse cx={x - 8} cy={170 - i * 6} rx={7} ry={11} fill={mix(p.accent, '#ffffff', 0.25)} transform={`rotate(-30 ${x - 8} ${170 - i * 6})`} />
              </g>
            ))}
            <circle cx={160} cy={204} r={9} fill={withAlpha(p.onAccent, 0.6)} />
          </svg>
        </Wrap>
      </section>

      {/* Footer invertido com newsletter */}
      <footer style={{ background: p.text, color: p.bg }}>
        <Wrap m={m} style={{ padding: m ? '44px 20px 28px' : '72px 48px 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(3, minmax(0, 1fr))' : 'minmax(0, 1.4fr) repeat(3, minmax(0, 1fr))', gap: m ? 24 : 48 }}>
            <div style={{ gridColumn: m ? '1 / -1' : 'auto' }}>
              <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 30 }}>Verdant</div>
              <p style={{ fontSize: 14.5, opacity: 0.7, marginTop: 10, maxWidth: 320 }}>Cartas mensais sobre estações, mudas novas e o que está florescendo no ateliê.</p>
              <div style={{ display: 'flex', marginTop: 18, borderBottom: `1px solid ${withAlpha(p.bg, 0.5)}`, maxWidth: 360 }}>
                <span style={{ flex: 1, padding: '10px 0', opacity: 0.6, fontSize: 14.5 }}>seu@email.com</span>
                <span style={{ padding: '10px 0', fontWeight: 600, fontSize: 14.5 }}>Assinar →</span>
              </div>
            </div>
            {[
              ['Loja', ['Plantas', 'Vasos', 'Ferramentas', 'Vale-presente']],
              ['Ateliê', ['Oficinas', 'Diário', 'Paisagismo', 'Visitas']],
              ['Ajuda', ['Entregas', 'Trocas', 'Guia de cuidados', 'Contato']],
            ].map(([t, items]) => (
              <div key={t as string}>
                <div style={{ fontSize: 12.5, letterSpacing: '0.18em', opacity: 0.6, fontWeight: 600 }}>{(t as string).toUpperCase()}</div>
                <ul style={{ marginTop: 14, display: 'grid', gap: 8, fontSize: m ? 13.5 : 14.5 }}>
                  {(items as string[]).map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: m ? 36 : 64, paddingTop: 20, borderTop: `1px solid ${withAlpha(p.bg, 0.18)}`, fontSize: 12.5, opacity: 0.6 }}>
            <span>© 2026 Verdant Atelier — marca fictícia</span>
            <span>Rua das Palmeiras, 210 · Viveiro aberto de terça a domingo</span>
          </div>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
