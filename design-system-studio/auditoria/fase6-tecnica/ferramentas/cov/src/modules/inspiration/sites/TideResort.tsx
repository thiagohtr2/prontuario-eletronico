import { isDark, mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, useSvgId, Wrap, type IconName, type SiteProps } from './kit'

/** Mar ao amanhecer, com sol baixo e ondas. */
function Seascape({ p, palms = true }: { p: SitePalette; palms?: boolean }) {
  const id = useSvgId('tide-sea')
  const night = isDark(p.bg)
  const sea = mix(p.accent, '#0b2a33', night ? 0.55 : 0.15)
  return (
    <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? mix(p.bg, '#000000', 0.2) : mix(p.secondary, '#ffffff', 0.55)} />
          <stop offset="0.7" stopColor={night ? mix(p.bg, p.secondary, 0.45) : mix(p.secondary, '#ffffff', 0.15)} />
          <stop offset="1" stopColor={night ? mix(p.secondary, p.accent, 0.4) : p.secondary} />
        </linearGradient>
        <linearGradient id={id('sea')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(sea, '#ffffff', 0.35)} />
          <stop offset="1" stopColor={mix(sea, '#000000', 0.15)} />
        </linearGradient>
      </defs>
      <rect width="1440" height="800" fill={`url(#${id('sky')})`} />
      <circle cx={720} cy={520} r={130} fill={night ? mix(p.accent, '#ffffff', 0.55) : mix(p.secondary, '#ffffff', 0.7)} opacity={0.9} />
      {night && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % 1440} cy={(i * 97) % 420} r={1.4 + (i % 3) * 0.6} fill={withAlpha('#ffffff', 0.6)} />)}
      <rect y={520} width="1440" height="280" fill={`url(#${id('sea')})`} />
      <path d="M560 540 L880 540" stroke={withAlpha('#ffffff', 0.55)} strokeWidth={3} />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 560 + i * 26
        return <path key={i} d={`M${600 - i * 60} ${y} L${840 + i * 60} ${y}`} stroke={withAlpha('#ffffff', 0.35 - i * 0.03)} strokeWidth={2} strokeDasharray={`${40 + i * 8} ${18 + i * 4}`} />
      })}
      <path d="M0 720 Q360 680 720 720 T1440 710 V800 H0Z" fill={mix(p.secondary, '#ffffff', 0.3)} />
      <path d="M0 740 Q360 712 720 744 T1440 736" stroke={withAlpha('#ffffff', 0.7)} strokeWidth={3} fill="none" />
      {palms && (
        <g fill={mix(p.text, sea, 0.3)}>
          <path d="M1290 800 Q1300 640 1260 470" stroke={mix(p.text, sea, 0.3)} strokeWidth={14} fill="none" />
          {[-70, -30, 10, 50, 100, 150].map((a) => (
            <path key={a} d="M1260 470 q70 -20 130 30 q-70 -6 -130 -30z" transform={`rotate(${a} 1260 470)`} />
          ))}
          <path d="M140 800 Q120 680 160 560" stroke={mix(p.text, sea, 0.3)} strokeWidth={11} fill="none" />
          {[-150, -110, -60, -20, 20].map((a) => (
            <path key={a} d="M160 560 q60 -18 110 26 q-60 -6 -110 -26z" transform={`rotate(${a} 160 560)`} />
          ))}
        </g>
      )}
      {[0, 1].map((i) => (
        <path key={i} d={`M${980 + i * 40} ${300 + i * 20} q12 -10 24 0 q12 -10 24 0`} stroke={withAlpha(p.text, 0.45)} strokeWidth={2.5} fill="none" />
      ))}
    </svg>
  )
}

/** Interior de suíte com janela para o mar (arte em CSS). */
function RoomArt({ p, variant }: { p: SitePalette; variant: 0 | 1 }) {
  const wall = variant ? mix(p.secondary, '#ffffff', 0.55) : mix(p.bg, p.secondary, 0.25)
  return (
    <div style={{ position: 'relative', height: '100%', background: wall, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: variant ? '52%' : '12%', top: '12%', width: '36%', height: '52%', borderRadius: variant ? '999px 999px 0 0' : 0, overflow: 'hidden', border: `10px solid ${mix(wall, '#ffffff', 0.5)}` }}>
        <Seascape p={p} palms={false} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '24%', background: mix(p.secondary, '#7a5a3a', 0.45) }} />
      <div style={{ position: 'absolute', left: variant ? '8%' : '44%', bottom: '14%', width: '48%', height: '22%', borderRadius: 10, background: '#ffffff', boxShadow: `0 20px 30px ${withAlpha('#000000', 0.12)}` }} />
      <div style={{ position: 'absolute', left: variant ? '8%' : '44%', bottom: '30%', width: '48%', height: '16%', borderRadius: '14px 14px 0 0', background: mix(p.accent, '#ffffff', 0.15) }} />
      <div style={{ position: 'absolute', left: variant ? '12%' : '48%', bottom: '33%', width: '14%', height: '9%', borderRadius: 8, background: mix(p.secondary, '#ffffff', 0.6) }} />
      <div style={{ position: 'absolute', left: variant ? '28%' : '64%', bottom: '33%', width: '14%', height: '9%', borderRadius: 8, background: mix(p.secondary, '#ffffff', 0.6) }} />
      <div style={{ position: 'absolute', left: variant ? '62%' : '8%', bottom: '18%', width: '10%', height: '34%' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '20%', width: '60%', height: '30%', borderRadius: '4px 4px 10px 10px', background: mix(p.secondary, '#7a5a3a', 0.6) }} />
        <div style={{ position: 'absolute', bottom: '28%', left: 0, width: '100%', height: '72%', borderRadius: '50% 50% 40% 40%', background: mix(p.accent, '#3c6b3c', 0.5) }} />
      </div>
    </div>
  )
}

export default function TideResort({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const serif = ff('georgia')
  const line = hair(p, 0.18)
  const caps = { fontSize: m ? 11.5 : 12.5, letterSpacing: '0.32em', textTransform: 'uppercase' as const }
  return (
    <SiteRoot p={p} font={serif} name="TIDE RESORT">
      {/* Hero com mar em tela cheia */}
      <section style={{ position: 'relative', height: m ? 700 : 860, color: p.text }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Seascape p={p} />
        </div>
        <header style={{ position: 'relative', zIndex: 2 }}>
          <Wrap m={m} max={1320} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: m ? 76 : 110 }}>
            <nav style={{ display: 'flex', gap: 32, ...caps, fontSize: 12 }}>{m ? <Burger color={p.text} weight={1.5} /> : ['Quartos', 'Experiências', 'Gastronomia'].map((t) => <span key={t}>{t}</span>)}</nav>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: m ? 30 : 44, letterSpacing: '0.42em', paddingLeft: '0.42em', lineHeight: 1 }}>TIDE</div>
              <div style={{ ...caps, fontSize: m ? 8.5 : 10, letterSpacing: '0.5em', marginTop: 6 }}>Resort & Spa</div>
            </div>
            <nav style={{ display: 'flex', gap: 32, justifyContent: 'flex-end', alignItems: 'center', ...caps, fontSize: 12 }}>
              {!m && <span>Spa</span>}
              {!m && <span>PT</span>}
              <span style={{ border: `1px solid ${p.text}`, padding: m ? '8px 12px' : '11px 20px' }}>Reservar</span>
            </nav>
          </Wrap>
        </header>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: m ? '56px 20px 0' : '88px 48px 0' }}>
          <div style={caps}>Praia do Espelho · Bahia</div>
          <h1 style={{ fontWeight: 400, fontStyle: 'italic', fontSize: m ? 46 : 92, lineHeight: 1.02, letterSpacing: '-0.02em', marginTop: 20 }}>Onde o tempo segue a maré.</h1>
        </div>
        {/* Barra de reserva */}
        <div style={{ position: 'absolute', zIndex: 2, left: 0, right: 0, bottom: m ? 20 : 48 }}>
          <Wrap m={m} max={1080}>
            <div style={{ background: withAlpha(p.surface, 0.94), display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '1fr 1fr 1fr auto', boxShadow: `0 20px 50px ${withAlpha('#000000', 0.12)}` }}>
              {[
                ['Chegada', 'Sex, 12 dez'],
                ['Partida', 'Seg, 15 dez'],
                ['Hóspedes', '2 adultos'],
              ].map(([k, v], i) => (
                <div key={k} style={{ padding: m ? '14px 16px' : '20px 28px', borderRight: `1px solid ${line}`, borderBottom: m && i < 2 ? `1px solid ${line}` : 'none', gridColumn: m && i === 2 ? '1 / -1' : 'auto' }}>
                  <div style={{ ...caps, fontSize: 10.5, color: p.muted, letterSpacing: '0.24em' }}>{k}</div>
                  <div style={{ fontSize: m ? 17 : 20, marginTop: 4 }}>{v}</div>
                </div>
              ))}
              <span style={{ background: p.accent, color: p.onAccent, display: 'grid', placeItems: 'center', padding: m ? '16px 0' : '0 40px', ...caps, fontSize: 12, letterSpacing: '0.24em', gridColumn: m ? '1 / -1' : 'auto' }}>Ver disponibilidade</span>
            </div>
          </Wrap>
        </div>
      </section>

      {/* Boas-vindas editorial */}
      <section>
        <Wrap m={m} max={920} style={{ textAlign: 'center', padding: m ? '64px 20px' : '128px 48px' }}>
          <div style={{ ...caps, color: p.accent }}>Bem-vindo</div>
          <p style={{ fontSize: m ? 24 : 36, lineHeight: 1.4, marginTop: 24 }}>
            Vinte e quatro suítes entre o coqueiral e o mar morno. Sem televisão nos quartos, com café da manhã servido na areia e um silêncio que só a maré interrompe.
          </p>
          <div style={{ width: 1, height: 72, background: p.text, margin: '40px auto 0', opacity: 0.4 }} />
        </Wrap>
      </section>

      {/* Suítes em blocos alternados */}
      {[
        ['Suíte Maré Alta', '62 m² · varanda com rede · vista frontal para o mar', 'R$ 1.890', 0],
        ['Bangalô Coqueiral', '80 m² · piscina privativa · jardim de bromélias', 'R$ 2.640', 1],
      ].map(([n, d, price, v]) => (
        <section key={n as string} style={{ borderTop: `1px solid ${line}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', maxWidth: 1440, margin: '0 auto' }}>
            <div style={{ height: m ? 300 : 620, order: m ? 1 : v ? 2 : 1 }}>
              <RoomArt p={p} variant={v as 0 | 1} />
            </div>
            <div style={{ order: 2, padding: m ? '32px 20px 48px' : '80px 88px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ ...caps, color: p.muted }}>Acomodação {v ? '02' : '01'}</div>
              <h2 style={{ fontWeight: 400, fontSize: m ? 34 : 52, marginTop: 16, letterSpacing: '-0.01em' }}>{n as string}</h2>
              <p style={{ color: p.muted, marginTop: 14, fontSize: m ? 16 : 18, lineHeight: 1.6 }}>{d as string}</p>
              <div style={{ display: 'flex', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
                {(
                  [
                    ['bed', 'Cama king'],
                    ['waves', 'Vista mar'],
                    ['cup', 'Café na areia'],
                    ['wifi', 'Wi-Fi'],
                  ] as [IconName, string][]
                ).map(([icon, t]) => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: ff('inter'), fontSize: 13.5, color: p.muted }}>
                    <Icon name={icon} size={20} color={p.accent} stroke={1.4} /> {t}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 36, paddingTop: 24, borderTop: `1px solid ${line}`, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, color: p.muted }}>
                  a partir de <span style={{ fontSize: 26, color: p.text }}>{price as string}</span> / noite
                </span>
                <span style={{ ...caps, fontSize: 12, borderBottom: `1px solid ${p.text}`, paddingBottom: 4 }}>Conhecer</span>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Experiências */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1320} style={{ padding: m ? '56px 20px' : '120px 48px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...caps, color: p.accent }}>Experiências</div>
            <h2 style={{ fontWeight: 400, fontSize: m ? 34 : 54, marginTop: 14, fontStyle: 'italic' }}>Dias sem pressa</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 16 : 28, marginTop: m ? 28 : 56 }}>
            {[
              ['Spa das Marés', 'Rituais com argila e óleos da restinga', 'spa'],
              ['Mesa de Pescadores', 'Menu do dia com o que chegou no barco', 'food'],
              ['Mergulho nos Recifes', 'Piscinas naturais na maré baixa', 'dive'],
            ].map(([t, d, k]) => (
              <article key={t}>
                <div style={{ position: 'relative', height: m ? 260 : 480, overflow: 'hidden', background: k === 'dive' ? `linear-gradient(180deg, ${mix(p.accent, '#ffffff', 0.35)}, ${mix(p.accent, '#000000', 0.3)})` : k === 'spa' ? mix(p.secondary, '#ffffff', 0.4) : mix(p.bg, p.secondary, 0.35) }}>
                  {k === 'spa' && (
                    <div style={{ position: 'absolute', left: '50%', bottom: '22%', transform: 'translateX(-50%)', display: 'grid', justifyItems: 'center', gap: 4 }}>
                      {[60, 90, 120, 150].map((w, i) => (
                        <span key={w} style={{ width: w * (m ? 0.8 : 1), height: (m ? 22 : 30) + i * 4, borderRadius: '50%', background: mix(p.text, p.secondary, 0.35 + i * 0.12) }} />
                      ))}
                    </div>
                  )}
                  {k === 'food' && (
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: m ? 170 : 240, aspectRatio: '1', borderRadius: '50%', background: '#ffffff', boxShadow: `0 20px 40px ${withAlpha('#000000', 0.12)}`, display: 'grid', placeItems: 'center' }}>
                      <span style={{ width: '58%', aspectRatio: '1.6', borderRadius: '50% 50% 45% 45%', background: mix(p.accent, '#e0a060', 0.5), boxShadow: `inset -10px -6px 0 ${withAlpha('#000000', 0.12)}` }} />
                    </div>
                  )}
                  {k === 'dive' &&
                    Array.from({ length: 14 }, (_, i) => (
                      <span key={i} style={{ position: 'absolute', left: `${(i * 37) % 90 + 5}%`, top: `${(i * 23) % 70 + 10}%`, width: 8 + (i % 4) * 6, height: 8 + (i % 4) * 6, borderRadius: '50%', border: `2px solid ${withAlpha('#ffffff', 0.6)}` }} />
                    ))}
                  {k === 'dive' && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '22%', background: mix(p.secondary, '#c88a5a', 0.3), borderRadius: '60% 40% 0 0 / 40% 30% 0 0' }} />}
                </div>
                <h3 style={{ fontWeight: 400, fontSize: m ? 24 : 28, marginTop: 20 }}>{t}</h3>
                <p style={{ color: p.muted, marginTop: 6, fontSize: 16 }}>{d}</p>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Depoimento */}
      <section style={{ borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={960} style={{ textAlign: 'center', padding: m ? '64px 20px' : '120px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Icon key={i} name="star" size={16} color={p.accent} fill={p.accent} stroke={1} />
            ))}
          </div>
          <blockquote style={{ fontStyle: 'italic', fontSize: m ? 26 : 40, lineHeight: 1.3, marginTop: 24 }}>“Acordamos com o barulho das ondas e dormimos contando estrelas. Voltaremos todo verão.”</blockquote>
          <div style={{ ...caps, fontSize: 11.5, color: p.muted, marginTop: 24 }}>Helena & Marcos — lua de mel, 2026</div>
        </Wrap>
      </section>

      {/* Localização */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1320} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 5fr) minmax(0, 7fr)', gap: m ? 28 : 72, padding: m ? '56px 20px' : '104px 48px', alignItems: 'center' }}>
          <div>
            <div style={{ ...caps, color: p.accent }}>Como chegar</div>
            <h2 style={{ fontWeight: 400, fontSize: m ? 32 : 46, marginTop: 14 }}>A 40 minutos do aeroporto de Porto Seguro.</h2>
            <p style={{ color: p.muted, marginTop: 16, fontSize: 17, lineHeight: 1.6 }}>Transfer privativo incluso em estadias a partir de 3 noites. Ou chegue de barco pelo rio, ao pôr do sol.</p>
            <div style={{ marginTop: 28, fontFamily: ff('inter'), fontSize: 14.5, lineHeight: 1.8 }}>
              Estrada da Praia do Espelho, km 12
              <br />
              +55 73 0000-0000 · reservas@tide.exemplo
            </div>
          </div>
          <div style={{ position: 'relative', height: m ? 260 : 440, background: mix(p.accent, '#ffffff', 0.75), overflow: 'hidden' }}>
            <svg viewBox="0 0 700 440" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <path d="M0 0 H420 Q380 120 440 220 T400 440 H0Z" fill={mix(p.secondary, '#ffffff', 0.45)} />
              <path d="M120 440 Q180 300 300 260 T420 120" stroke={withAlpha(p.text, 0.35)} strokeWidth={3} strokeDasharray="6 8" fill="none" />
              <path d="M60 60 Q200 160 330 120" stroke={mix(p.accent, '#ffffff', 0.4)} strokeWidth={8} fill="none" />
              <circle cx={420} cy={120} r={28} fill={withAlpha(p.accent, 0.2)} />
              <circle cx={420} cy={120} r={10} fill={p.accent} />
              <text x={444} y={110} fontSize={20} fill={p.text} fontFamily={serif}>
                Tide
              </text>
              <text x={130} y={420} fontSize={14} fill={p.muted} fontFamily={ff('inter')}>
                Aeroporto · 32 km
              </text>
            </svg>
          </div>
        </Wrap>
      </section>

      <footer style={{ background: p.accent, color: p.onAccent, textAlign: 'center' }}>
        <Wrap m={m} max={1000} style={{ padding: m ? '56px 20px 28px' : '96px 48px 40px' }}>
          <div style={{ fontSize: m ? 36 : 56, letterSpacing: '0.42em', paddingLeft: '0.42em' }}>TIDE</div>
          <div style={{ ...caps, fontSize: 10.5, marginTop: 8, opacity: 0.8 }}>Resort & Spa · Bahia</div>
          <div style={{ display: 'flex', maxWidth: 440, margin: '36px auto 0', borderBottom: `1px solid ${withAlpha(p.onAccent, 0.5)}`, fontSize: 15 }}>
            <span style={{ flex: 1, textAlign: 'left', padding: '10px 0', opacity: 0.7 }}>Receba nossas cartas de estação</span>
            <span style={{ padding: '10px 0' }}>→</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: m ? 16 : 32, marginTop: 40, flexWrap: 'wrap', ...caps, fontSize: 11, letterSpacing: '0.22em', opacity: 0.85 }}>
            {['Quartos', 'Spa', 'Gastronomia', 'Eventos', 'Contato'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div style={{ fontFamily: ff('inter'), fontSize: 12, opacity: 0.6, marginTop: 36 }}>© 2026 Tide Resort & Spa — hotel fictício</div>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
