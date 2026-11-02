import { isDark, mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Avatar, Burger, ff, hair, Icon, SiteRoot, useSvgId, Wrap, type IconName, type SiteProps } from './kit'

type Scene = 'mountains' | 'desert' | 'coast' | 'forest' | 'snow'

/** Paisagens ilustradas em camadas (SVG). */
function Landscape({ p, scene, trail = false, shift = 0 }: { p: SitePalette; scene: Scene; trail?: boolean; shift?: number }) {
  const id = useSvgId('nomad-land')
  const sec = p.secondary
  const night = isDark(p.bg)
  const skyTop = night
    ? mix(p.bg, sec, 0.25)
    : scene === 'snow'
      ? mix(sec, '#ffffff', 0.55)
      : scene === 'desert'
        ? mix(p.accent, '#ffffff', 0.45)
        : mix(p.accent, '#ffffff', 0.62)
  const skyBottom = night ? mix(p.bg, p.accent, 0.35) : mix(p.accent, '#ffffff', scene === 'desert' ? 0.2 : 0.85)
  const layers =
    scene === 'desert'
      ? [mix(p.accent, '#ffffff', 0.3), mix(p.accent, '#7a3b1c', 0.25), mix(p.accent, '#4a2010', 0.45)]
      : scene === 'snow'
        ? [mix(sec, '#ffffff', 0.6), mix(sec, '#ffffff', 0.3), mix(sec, '#000000', 0.2)]
        : [mix(sec, '#ffffff', 0.55), mix(sec, '#ffffff', 0.25), sec, mix(sec, '#000000', 0.4)]
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="1" stopColor={skyBottom} />
        </linearGradient>
      </defs>
      <rect width="1200" height="600" fill={`url(#${id('sky')})`} />
      <g transform={`translate(0 ${shift})`}>
      <circle cx={scene === 'coast' ? 300 : 820} cy={scene === 'desert' ? 230 : 250} r={scene === 'desert' ? 90 : 70} fill={mix(p.accent, '#ffffff', 0.15)} opacity={0.95} />
      {scene === 'desert' && (
        <>
          <path d="M0 400 Q300 330 600 390 T1200 370 V600 H0Z" fill={layers[0]} />
          <path d="M0 460 Q260 400 520 450 T1200 430 V600 H0Z" fill={layers[1]} />
          <path d="M0 520 Q300 470 700 520 T1200 500 V600 H0Z" fill={layers[2]} />
          <path d="M880 470 v-60 m0 20 h-14 v-16 m14 26 h14 v-22" stroke={mix(sec, '#000000', 0.3)} strokeWidth={8} strokeLinecap="round" fill="none" />
        </>
      )}
      {scene === 'coast' && (
        <>
          <path d="M0 360 L1200 360 V600 H0Z" fill={mix(sec, '#ffffff', 0.15)} />
          {[390, 430, 480, 540].map((y, i) => (
            <path key={y} d={`M0 ${y} Q150 ${y - 12} 300 ${y} T600 ${y} T900 ${y} T1200 ${y}`} stroke={withAlpha('#ffffff', 0.45 - i * 0.08)} strokeWidth={4} fill="none" />
          ))}
          <path d="M700 600 Q820 470 1200 440 V600Z" fill={mix(p.accent, '#ffffff', 0.55)} />
          <path d="M1010 470 Q1000 380 1040 320" stroke={mix(sec, '#000000', 0.45)} strokeWidth={8} fill="none" />
          {[-60, -20, 20, 60, 100].map((a) => (
            <path key={a} d="M1040 320 q40 -10 70 20" stroke={mix(sec, '#000000', 0.2)} strokeWidth={10} fill="none" strokeLinecap="round" transform={`rotate(${a} 1040 320)`} />
          ))}
        </>
      )}
      {(scene === 'mountains' || scene === 'snow' || scene === 'forest') && (
        <>
          <path d="M0 380 L160 250 L300 340 L470 190 L640 330 L800 220 L980 330 L1200 240 V600 H0Z" fill={layers[0]} />
          {scene === 'snow' && <path d="M430 222 L470 190 L512 226 L490 236 L470 222 L452 236 Z M760 250 L800 220 L842 252 L820 260 L800 248 L780 262Z" fill="#ffffff" />}
          <path d="M0 450 L220 300 L380 410 L560 280 L760 420 L940 320 L1200 430 V600 H0Z" fill={layers[1]} />
          {scene === 'snow' && <path d="M520 306 L560 280 L602 312 L580 318 L560 306 L538 320Z M900 346 L940 320 L982 350 L960 356 L940 344 L918 358Z" fill="#ffffff" />}
          <path d="M0 520 Q300 440 600 500 T1200 480 V600 H0Z" fill={layers[2] ?? layers[1]} />
          {layers[3] && <path d="M0 580 Q400 520 800 570 T1200 560 V600 H0Z" fill={layers[3]} />}
          {scene === 'forest' &&
            Array.from({ length: 22 }, (_, i) => {
              const x = 20 + i * 56
              const h = 80 + ((i * 37) % 60)
              return <path key={i} d={`M${x} 590 L${x + 22} ${590 - h} L${x + 44} 590Z`} fill={mix(sec, '#000000', 0.35 + (i % 3) * 0.1)} />
            })}
        </>
      )}
      {trail && <path d="M560 600 C 600 540 520 520 600 480 S 720 420 690 380" stroke={p.bg} strokeWidth={4} strokeDasharray="10 10" fill="none" opacity={0.85} />}
      {shift > 0 && <rect x={0} y={598} width={1200} height={shift + 4} fill={layers[3] ?? layers[2] ?? layers[1]} />}
      </g>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${200 + i * 50} ${150 + i * 18} q10 -10 20 0 q10 -10 20 0`} stroke={withAlpha(p.text, 0.45)} strokeWidth={2.5} fill="none" />
      ))}
    </svg>
  )
}

export default function NomadTrails({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const serif = ff('fraunces')
  const line = hair(p, 0.12)
  const card = { background: p.surface, borderRadius: 22, border: `1px solid ${line}` }
  return (
    <SiteRoot p={p} font={ff('inter')} name="NOMAD TRAILS">
      {/* Hero com paisagem em tela cheia */}
      <section style={{ position: 'relative', height: m ? 640 : 780 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Landscape p={p} scene="mountains" trail shift={m ? 140 : 150} />
        </div>
        <header style={{ position: 'relative', zIndex: 2 }}>
          <Wrap m={m} max={1280} style={{ display: 'flex', alignItems: 'center', gap: 36, height: m ? 64 : 84 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800, letterSpacing: '0.16em', fontSize: m ? 14 : 15 }}>
              <svg width={28} height={28} viewBox="0 0 28 28" aria-hidden="true">
                <circle cx={14} cy={14} r={12} fill="none" stroke={p.text} strokeWidth={2} />
                <path d="M14 5 L17 14 L14 23 L11 14Z" fill={p.accent} />
              </svg>
              NOMAD TRAILS
            </span>
            {!m && (
              <nav style={{ display: 'flex', gap: 28, fontSize: 15, fontWeight: 500 }}>
                {['Destinos', 'Roteiros', 'Estilos', 'Diário de bordo'].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </nav>
            )}
            <div style={{ flex: 1 }} />
            {!m && <span style={{ fontWeight: 600, fontSize: 15 }}>Minhas viagens</span>}
            {m ? <Burger color={p.text} /> : <Avatar size={38} bg={p.text} fg={p.bg} label="LC" />}
          </Wrap>
        </header>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: m ? '40px 20px 0' : '72px 48px 0' }}>
          <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 13.5, fontWeight: 600, background: withAlpha(p.surface, 0.75), borderRadius: 999, padding: '7px 14px' }}>
            <Icon name="star" size={15} color={p.accent} fill={p.accent} stroke={1} /> 4,9 em 18 mil viagens
          </div>
          <h1 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 46 : 92, lineHeight: 0.98, letterSpacing: '-0.035em', marginTop: 18, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
            O mundo cabe em uma <em style={{ fontWeight: 400 }}>mochila</em>.
          </h1>
          <p style={{ fontSize: m ? 16 : 19, marginTop: 16, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', color: mix(p.text, p.bg, 0.12) }}>Roteiros em pequenos grupos, guias locais e trilhas que não aparecem nos mapas.</p>
        </div>
      </section>

      {/* Busca sobreposta */}
      <div style={{ position: 'relative', zIndex: 3, marginTop: m ? -150 : -64 }}>
        <Wrap m={m} max={1120}>
          <div style={{ ...card, borderRadius: m ? 22 : 999, boxShadow: `0 24px 60px ${withAlpha('#000000', 0.15)}`, padding: m ? 14 : 10, display: 'grid', gridTemplateColumns: m ? '1fr' : '1.4fr 1fr 1fr 1fr auto', gap: m ? 8 : 0, alignItems: 'center' }}>
            {(
              [
                ['pin', 'Destino', 'Patagônia, Chile'],
                ['calendar', 'Quando', 'Mar 2027'],
                ['users', 'Viajantes', '2 adultos'],
                ['route', 'Estilo', 'Trilhas'],
              ] as [IconName, string, string][]
            ).map(([icon, k, v], i) => (
              <div key={k} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: m ? '10px 12px' : '8px 24px', ...(m ? { border: `1px solid ${line}`, borderRadius: 14 } : { borderLeft: i ? `1px solid ${line}` : 'none' }) }}>
                <Icon name={icon} size={20} color={p.accent} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: p.muted, fontWeight: 600 }}>{k}</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{v}</div>
                </div>
              </div>
            ))}
            <span style={{ background: p.accent, color: p.onAccent, borderRadius: 999, padding: m ? '14px 0' : '18px 30px', fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="search" size={18} color={p.onAccent} stroke={2.2} /> Buscar
            </span>
          </div>
        </Wrap>
      </div>

      {/* Destinos */}
      <section style={{ padding: m ? '48px 0' : '104px 0 96px' }}>
        <Wrap m={m} max={1280}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>TEMPORADA 2027</div>
              <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 32 : 52, letterSpacing: '-0.03em', marginTop: 8 }}>Destinos para sonhar acordado</h2>
            </div>
            {!m && (
              <span style={{ display: 'flex', gap: 8 }}>
                {['arrowLeft', 'arrow'].map((n) => (
                  <span key={n} style={{ width: 46, height: 46, borderRadius: '50%', border: `1px solid ${withAlpha(p.text, 0.25)}`, display: 'grid', placeItems: 'center' }}>
                    <Icon name={n as IconName} size={18} />
                  </span>
                ))}
              </span>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 12 : 22, marginTop: m ? 22 : 40 }}>
            {(
              [
                ['Atacama', 'Chile', '8 dias', 'R$ 6.890', 'desert'],
                ['Costa dos Corais', 'Alagoas', '6 dias', 'R$ 3.490', 'coast'],
                ['Floresta Negra', 'Alemanha', '9 dias', 'R$ 9.200', 'forest'],
                ['Lofoten', 'Noruega', '10 dias', 'R$ 12.400', 'snow'],
              ] as [string, string, string, string, Scene][]
            ).map(([n, c, d, price, scene]) => (
              <article key={n}>
                <div style={{ position: 'relative', height: m ? 210 : 360, borderRadius: m ? 18 : 26, overflow: 'hidden' }}>
                  <Landscape p={p} scene={scene} />
                  <span style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%', background: withAlpha(p.surface, 0.85), display: 'grid', placeItems: 'center' }}>
                    <Icon name="heart" size={17} color={p.accent} />
                  </span>
                  <span style={{ position: 'absolute', left: 12, bottom: 12, background: withAlpha(p.surface, 0.9), borderRadius: 999, padding: '4px 10px', fontSize: 12.5, fontWeight: 600 }}>{d}</span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <h3 style={{ fontFamily: serif, fontSize: m ? 19 : 24, fontWeight: 500 }}>{n}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: m ? 13 : 14.5, color: p.muted, flexWrap: 'wrap' }}>
                    <span>{c}</span>
                    <span>
                      a partir de <strong style={{ color: p.text }}>{price}</strong>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Roteiro dia a dia + mapa */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 5fr) minmax(0, 7fr)', gap: m ? 28 : 64, padding: m ? '48px 20px' : '104px 48px', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>ROTEIRO EM DESTAQUE</div>
            <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 32 : 48, letterSpacing: '-0.03em', marginTop: 8 }}>Patagônia em 10 dias</h2>
            <ol style={{ marginTop: 28, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 17, top: 10, bottom: 10, borderLeft: `2px dashed ${withAlpha(p.accent, 0.5)}` }} />
              {[
                ['Dias 1–2', 'Punta Arenas', 'Chegada, mercado de frutos do mar e pinguins.'],
                ['Dias 3–5', 'Torres del Paine', 'Circuito W com refúgios e guia de montanha.'],
                ['Dias 6–7', 'El Calafate', 'Caminhada sobre o glaciar Perito Moreno.'],
                ['Dias 8–10', 'El Chaltén', 'Trilha até a Laguna de los Tres ao amanhecer.'],
              ].map(([d, place, t], i) => (
                <li key={d} style={{ position: 'relative', display: 'flex', gap: 18, paddingBottom: 22 }}>
                  <span style={{ width: 36, height: 36, flex: 'none', borderRadius: '50%', background: i === 1 ? p.accent : p.bg, color: i === 1 ? p.onAccent : p.text, border: `2px solid ${p.accent}`, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14, position: 'relative' }}>{i + 1}</span>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: p.muted, letterSpacing: '0.06em' }}>{d.toUpperCase()}</div>
                    <div style={{ fontFamily: serif, fontSize: 21, fontWeight: 500 }}>{place}</div>
                    <p style={{ color: p.muted, fontSize: 15 }}>{t}</p>
                  </div>
                </li>
              ))}
            </ol>
            <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center', background: p.text, color: p.bg, borderRadius: 999, padding: '14px 26px', fontWeight: 600 }}>
              Ver roteiro completo <Icon name="arrow" size={17} color={p.bg} />
            </span>
          </div>
          <div style={{ borderRadius: 26, overflow: 'hidden', border: `1px solid ${line}`, background: mix(p.bg, p.secondary, 0.12), position: 'relative' }}>
            <svg viewBox="0 0 640 560" width="100%" aria-hidden="true" style={{ display: 'block' }}>
              <path d="M0 0 H220 Q260 120 230 220 T300 420 Q330 500 290 560 H0Z" fill={mix(p.secondary, '#ffffff', 0.55)} />
              {Array.from({ length: 8 }, (_, i) => (
                <path key={i} d={`M${330 + i * 30} ${40 + i * 60} q30 -40 60 0`} stroke={withAlpha(p.text, 0.18)} strokeWidth={2} fill="none" />
              ))}
              <ellipse cx={430} cy={300} rx={60} ry={26} fill={mix(p.secondary, '#ffffff', 0.4)} />
              <ellipse cx={520} cy={120} rx={40} ry={18} fill={mix(p.secondary, '#ffffff', 0.4)} />
              {[
                [460, 120],
                [480, 200],
                [560, 250],
                [520, 400],
                [380, 470],
              ].map(([x, y], i) => (
                <path key={i} d={`M${x - 24} ${y + 14} L${x} ${y - 20} L${x + 24} ${y + 14}Z`} fill={mix(p.secondary, '#000000', 0.15)} opacity={0.6} />
              ))}
              <path d="M330 500 C 380 440 300 400 380 360 S 470 300 430 230 S 520 150 540 90" stroke={p.accent} strokeWidth={4} strokeDasharray="10 8" fill="none" strokeLinecap="round" />
              {[
                [330, 500],
                [380, 360],
                [430, 230],
                [540, 90],
              ].map(([x, y], i) => (
                <g key={i}>
                  <path d={`M${x} ${y} c-14 -18 -14 -36 0 -40 c14 4 14 22 0 40z`} fill={i === 1 ? p.accent : p.text} transform={`translate(0 -2)`} />
                  <circle cx={x} cy={y - 26} r={9} fill={p.bg} />
                  <text x={x} y={y - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={p.text} fontFamily={ff('inter')}>
                    {i + 1}
                  </text>
                </g>
              ))}
              <g transform="translate(570 500)">
                <circle r={26} fill={p.bg} stroke={withAlpha(p.text, 0.2)} />
                <path d="M0 -18 L6 0 L0 18 L-6 0Z" fill={p.accent} />
                <text y={-30} textAnchor="middle" fontSize={11} fontWeight={700} fill={p.text} fontFamily={ff('inter')}>
                  N
                </text>
              </g>
            </svg>
            <div style={{ position: 'absolute', left: 16, top: 16, ...card, borderRadius: 14, padding: '10px 14px', fontSize: 13.5 }}>
              <strong>182 km</strong> de trilhas · <strong>4</strong> bases
            </div>
          </div>
        </Wrap>
      </section>

      {/* Estilos de viagem */}
      <section>
        <Wrap m={m} max={1280} style={{ padding: m ? '48px 20px' : '96px 48px' }}>
          <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 30 : 44, letterSpacing: '-0.03em', textAlign: m ? 'left' : 'center' }}>Viaje do seu jeito</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 12 : 20, marginTop: m ? 20 : 40 }}>
            {(
              [
                ['route', 'Trilhas', '48 roteiros'],
                ['cup', 'Gastronomia', '22 roteiros'],
                ['eye', 'Fotografia', '15 roteiros'],
                ['users', 'Em família', '31 roteiros'],
              ] as [IconName, string, string][]
            ).map(([icon, t, d], i) => (
              <div key={t} style={{ ...card, padding: m ? 18 : 28, background: i === 0 ? mix(p.secondary, '#000000', 0.35) : p.surface, color: i === 0 ? '#ffffff' : p.text }}>
                <Icon name={icon} size={m ? 26 : 32} color={i === 0 ? '#ffffff' : p.accent} />
                <h3 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 20 : 26, marginTop: m ? 18 : 40 }}>{t}</h3>
                <div style={{ fontSize: 14, opacity: 0.75 }}>{d}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Diário de bordo */}
      <section style={{ borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ padding: m ? '48px 20px' : '96px 48px' }}>
          <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 30 : 44, letterSpacing: '-0.03em' }}>Diário de bordo</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1.5fr 1fr', gap: m ? 20 : 32, marginTop: m ? 20 : 36 }}>
            <article>
              <div style={{ height: m ? 220 : 420, borderRadius: 26, overflow: 'hidden' }}>
                <Landscape p={p} scene="snow" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: p.accent, marginTop: 16, letterSpacing: '0.1em' }}>GUIA · 12 MIN</div>
              <h3 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 24 : 32, marginTop: 6, letterSpacing: '-0.02em' }}>Como montar a mochila perfeita para o frio extremo</h3>
            </article>
            <div style={{ display: 'grid', gap: m ? 16 : 24, alignContent: 'start' }}>
              {(
                [
                  ['coast', 'RELATO', 'Três semanas sem internet no litoral alagoano'],
                  ['desert', 'FOTOGRAFIA', 'O céu mais escuro do planeta fica no Atacama'],
                ] as [Scene, string, string][]
              ).map(([scene, k, t]) => (
                <article key={t} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, alignItems: 'center' }}>
                  <div style={{ height: 110, borderRadius: 18, overflow: 'hidden' }}>
                    <Landscape p={p} scene={scene} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: p.accent, letterSpacing: '0.1em' }}>{k}</div>
                    <h3 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 18 : 21, marginTop: 4 }}>{t}</h3>
                  </div>
                </article>
              ))}
              <div style={{ ...card, padding: 22, background: withAlpha(p.accent, 0.08) }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" size={15} color={p.accent} fill={p.accent} stroke={1} />
                  ))}
                </div>
                <p style={{ fontFamily: serif, fontSize: 19, marginTop: 10, lineHeight: 1.35 }}>“O guia conhecia cada pedra do caminho e cada avó das vilas. Voltei outra pessoa.”</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, fontSize: 14 }}>
                  <Avatar size={32} bg={p.secondary} fg="#ffffff" label="RM" /> Renata M., Patagônia 2026
                </div>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Newsletter + footer */}
      <footer style={{ background: mix(p.secondary, '#000000', 0.55), color: '#f5f2ec' }}>
        <Wrap m={m} max={1280} style={{ padding: m ? '48px 20px 24px' : '88px 48px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: 28, alignItems: 'center' }}>
            <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 32 : 48, letterSpacing: '-0.03em', lineHeight: 1.05 }}>Roteiros secretos, uma vez por mês.</h2>
            <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,.1)', borderRadius: 999, padding: 6 }}>
              <span style={{ flex: 1, padding: '12px 16px', opacity: 0.7, fontSize: 15 }}>seu@email.com</span>
              <span style={{ background: p.accent, color: p.onAccent, borderRadius: 999, padding: '12px 22px', fontWeight: 700 }}>Quero</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginTop: m ? 40 : 72, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.15)', fontSize: 14, opacity: 0.8 }}>
            <span style={{ fontWeight: 800, letterSpacing: '0.16em' }}>NOMAD TRAILS</span>
            <span style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {['Sobre', 'Guias locais', 'Seguro viagem', 'Contato'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </span>
            <span>© 2026 — agência fictícia</span>
          </div>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
