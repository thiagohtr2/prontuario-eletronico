import { isDark, mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Avatar, Burger, ff, hair, Icon, SiteRoot, useSvgId, Wrap, type SiteProps } from './kit'

function stars(p: SitePalette) {
  const c = withAlpha(p.text, isDark(p.bg) ? 0.7 : 0.25)
  const d = withAlpha(p.text, isDark(p.bg) ? 0.35 : 0.15)
  return [
    `radial-gradient(1.5px 1.5px at 20px 30px, ${c}, transparent)`,
    `radial-gradient(1px 1px at 90px 120px, ${d}, transparent)`,
    `radial-gradient(1.5px 1.5px at 160px 60px, ${d}, transparent)`,
    `radial-gradient(1px 1px at 230px 180px, ${c}, transparent)`,
    `radial-gradient(2px 2px at 300px 90px, ${c}, transparent)`,
  ].join(', ')
}

function Patch({ p, n, color, size = 88 }: { p: SitePalette; n: string; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ display: 'block', flex: 'none' }}>
      <circle cx={50} cy={50} r={47} fill={p.surface} stroke={color} strokeWidth={3} />
      <circle cx={50} cy={50} r={38} fill="none" stroke={withAlpha(p.text, 0.25)} strokeDasharray="2 4" />
      <ellipse cx={50} cy={56} rx={34} ry={10} fill="none" stroke={color} strokeWidth={2} transform="rotate(-18 50 56)" />
      <circle cx={50} cy={52} r={14} fill={mix(color, p.surface, 0.3)} />
      <path d="M50 20 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill={p.text} />
      <text x={50} y={86} textAnchor="middle" fontSize={10} fontFamily={ff('jetbrains-mono')} fill={p.text} fontWeight={700}>
        {n}
      </text>
    </svg>
  )
}

function Rocket({ p }: { p: SitePalette }) {
  const id = useSvgId('oz-rocket')
  const hull = isDark(p.bg) ? '#e9ebf3' : '#ffffff'
  const shade = isDark(p.bg) ? '#b9bdcc' : '#d7d9e2'
  return (
    <svg viewBox="0 0 160 640" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id('hull')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={shade} />
          <stop offset="0.45" stopColor={hull} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
        <linearGradient id={id('flame')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6d5" />
          <stop offset="0.35" stopColor={p.accent} />
          <stop offset="1" stopColor={p.accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M80 6 Q112 46 112 110 L48 110 Q48 46 80 6 Z" fill={`url(#${id('hull')})`} />
      <circle cx={80} cy={78} r={10} fill={mix(p.secondary, '#000000', 0.4)} stroke={shade} strokeWidth={3} />
      <rect x={48} y={110} width={64} height={130} fill={`url(#${id('hull')})`} />
      <rect x={48} y={150} width={64} height={10} fill={p.accent} />
      <rect x={44} y={240} width={72} height={300} fill={`url(#${id('hull')})`} />
      <rect x={44} y={250} width={72} height={6} fill={mix(shade, '#000000', 0.2)} />
      <text x={80} y={400} textAnchor="middle" fontSize={13} fontWeight={700} fill={mix(shade, '#000000', 0.45)} fontFamily={ff('space-grotesk')} transform="rotate(-90 80 400)">
        ORBITAL ZERO
      </text>
      <path d="M44 470 L14 540 L44 530 Z M116 470 L146 540 L116 530 Z" fill={p.accent} />
      <rect x={52} y={540} width={56} height={16} fill={mix(shade, '#000000', 0.35)} />
      <path d="M56 556 Q80 640 104 556 Z" fill={`url(#${id('flame')})`} />
    </svg>
  )
}

export default function OrbitalZero({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const display = ff('space-grotesk')
  const mono = ff('jetbrains-mono')
  const line = hair(p, 0.14)
  const planet = `radial-gradient(circle at 35% 30%, ${mix(p.secondary, '#ffffff', 0.35)} 0%, ${p.secondary} 35%, ${mix(p.secondary, '#000000', 0.55)} 70%, ${mix(p.secondary, '#000000', 0.85)} 100%)`
  return (
    <SiteRoot p={p} font={ff('inter')} name="ORBITAL ZERO">
      {/* Hero com campo de estrelas, contagem regressiva e planeta */}
      <section style={{ position: 'relative', overflow: 'hidden', backgroundImage: stars(p), backgroundSize: '320px 220px', minHeight: m ? 780 : 960 }}>
        <header style={{ position: 'relative', zIndex: 3 }}>
          <Wrap m={m} max={1300} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: m ? 64 : 84 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: display, fontWeight: 700, letterSpacing: '0.14em', fontSize: m ? 15 : 17 }}>
              <svg width={26} height={26} viewBox="0 0 26 26" aria-hidden="true">
                <circle cx={13} cy={13} r={6} fill={p.accent} />
                <ellipse cx={13} cy={13} rx={12} ry={5} fill="none" stroke={p.text} strokeWidth={1.6} transform="rotate(-25 13 13)" />
              </svg>
              ORBITAL ZERO
            </span>
            {!m && (
              <nav style={{ display: 'flex', gap: 34, fontSize: 14.5 }}>
                {['Missões', 'Veículos', 'Tripulação', 'Academia'].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </nav>
            )}
            {m ? (
              <Burger color={p.text} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 14 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: mono, fontSize: 12.5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3ee08f', boxShadow: '0 0 0 4px rgba(62,224,143,.2)' }} />
                  AO VIVO
                </span>
                <span style={{ border: `1px solid ${withAlpha(p.text, 0.35)}`, borderRadius: 999, padding: '10px 20px', fontWeight: 600 }}>Inscrever-se</span>
              </div>
            )}
          </Wrap>
        </header>

        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: m ? '44px 20px 0' : '72px 48px 0' }}>
          <div style={{ fontFamily: mono, fontSize: m ? 11.5 : 13, letterSpacing: '0.24em', color: p.accent }}>MISSÃO OZ-7 · LANÇAMENTO EM</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: m ? 10 : 22, marginTop: 16, fontFamily: mono }}>
            {[
              ['12', 'dias'],
              ['04', 'horas'],
              ['33', 'min'],
              ['18', 'seg'],
            ].map(([n, t], i) => (
              <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: m ? 10 : 22 }}>
                <div>
                  <div style={{ fontSize: m ? 30 : 44, fontWeight: 600, lineHeight: 1, padding: m ? '10px 10px' : '14px 18px', border: `1px solid ${line}`, borderRadius: 10, background: withAlpha(p.surface, 0.6) }}>{n}</div>
                  <div style={{ fontSize: 11, color: p.muted, marginTop: 6, letterSpacing: '0.12em' }}>{t.toUpperCase()}</div>
                </div>
                {i < 3 && <span style={{ fontSize: m ? 26 : 38, color: p.muted, paddingTop: m ? 8 : 12 }}>:</span>}
              </div>
            ))}
          </div>
          <h1 style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 44 : 92, letterSpacing: '-0.04em', lineHeight: 0.98, margin: m ? '28px auto 0' : '40px auto 0', maxWidth: 940 }}>
            Próxima parada: órbita baixa.
          </h1>
          <p style={{ color: p.muted, fontSize: m ? 15.5 : 18, maxWidth: 560, margin: '18px auto 0' }}>Quatro civis, seis dias e 96 voltas ao redor da Terra. Acompanhe cada etapa ao vivo.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28, flexDirection: m ? 'column' : 'row' }}>
            <span style={{ background: p.accent, color: p.onAccent, borderRadius: 999, padding: '15px 28px', fontWeight: 600, display: 'inline-flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="play" size={16} color={p.onAccent} fill={p.onAccent} /> Acompanhar ao vivo
            </span>
            <span style={{ border: `1px solid ${withAlpha(p.text, 0.35)}`, borderRadius: 999, padding: '15px 28px', fontWeight: 600 }}>Conhecer a missão</span>
          </div>
        </div>

        {/* Planeta com anel */}
        <div style={{ position: 'absolute', left: '50%', bottom: m ? -430 : -1290, width: m ? 560 : 1500, height: m ? 560 : 1500, transform: 'translateX(-50%)', borderRadius: '50%', background: planet, boxShadow: `0 0 120px ${withAlpha(p.secondary, 0.55)}, inset -40px -60px 120px rgba(0,0,0,.4)`, zIndex: 1 }} />
        <div style={{ position: 'absolute', left: '50%', bottom: m ? 60 : 110, width: m ? 760 : 1900, height: m ? 80 : 170, transform: 'translateX(-50%) rotate(-4deg)', borderRadius: '50%', border: `2px solid ${withAlpha(p.text, 0.25)}`, zIndex: 2 }} />
      </section>

      {/* Telemetria */}
      <section style={{ borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}`, background: p.surface }}>
        <Wrap m={m} max={1300} style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(5, minmax(0, 1fr))', fontFamily: mono }}>
          {[
            ['ALTITUDE', '408 km'],
            ['VELOCIDADE', '27.600 km/h'],
            ['TRIPULAÇÃO', '4 civis'],
            ['DURAÇÃO', '6 dias'],
            ['ÓRBITAS', '96'],
          ].map(([k, v], i) => (
            <div key={k} style={{ padding: m ? '16px 0' : '22px 0', paddingLeft: m ? (i % 2 ? 14 : 0) : i ? 24 : 0, borderLeft: (m ? i % 2 : i) ? `1px solid ${line}` : 'none', borderTop: m && i > 1 ? `1px solid ${line}` : 'none', gridColumn: m && i === 4 ? '1 / -1' : 'auto' }}>
              <div style={{ fontSize: 11, color: p.muted, letterSpacing: '0.16em' }}>{k}</div>
              <div style={{ fontSize: m ? 18 : 22, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </Wrap>
      </section>

      {/* Linha do tempo de missões */}
      <section style={{ padding: m ? '56px 0' : '112px 0' }}>
        <Wrap m={m} max={1300}>
          <div style={{ fontFamily: mono, fontSize: 12.5, letterSpacing: '0.2em', color: p.accent }}>PROGRAMA</div>
          <h2 style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 32 : 54, letterSpacing: '-0.03em', marginTop: 12 }}>Uma missão de cada vez.</h2>
          <div style={{ position: 'relative', marginTop: m ? 28 : 56 }}>
            {!m && (
              <svg viewBox="0 0 1200 120" width="100%" aria-hidden="true" style={{ display: 'block', position: 'absolute', top: 10, left: 0 }}>
                <path d="M0 110 Q600 -50 1200 110" stroke={withAlpha(p.text, 0.25)} strokeWidth={1.5} fill="none" strokeDasharray="4 8" />
              </svg>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(4, minmax(0, 1fr))', gap: m ? 12 : 24, position: 'relative' }}>
              {[
                ['OZ-5', '2024', 'Concluída', 'Primeiro voo tripulado da cápsula Aurora.', p.muted],
                ['OZ-6', '2025', 'Concluída', 'Acoplagem automática com a estação Vega.', p.muted],
                ['OZ-7', '2026', 'Próxima', 'Seis dias em órbita com quatro civis.', p.accent],
                ['OZ-8', '2028', 'Planejada', 'Sobrevoo lunar sem pouso, 9 dias.', p.secondary],
              ].map(([n, y, s, d, c], i) => (
                <article
                  key={n}
                  style={{
                    border: `1px solid ${i === 2 ? p.accent : line}`,
                    borderRadius: 18,
                    padding: m ? 18 : 24,
                    background: i === 2 ? withAlpha(p.accent, 0.08) : p.surface,
                    marginTop: m ? 0 : [70, 18, 0, 50][i],
                    display: m ? 'flex' : 'block',
                    gap: 16,
                    alignItems: 'center',
                  }}
                >
                  <Patch p={p} n={n} color={c} size={m ? 64 : 88} />
                  <div style={{ marginTop: m ? 0 : 18 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontFamily: mono, fontSize: 12 }}>
                      <span>{y}</span>
                      <span style={{ color: c, border: `1px solid ${c}`, borderRadius: 999, padding: '1px 8px' }}>{s}</span>
                    </div>
                    <h3 style={{ fontFamily: display, fontSize: m ? 20 : 24, fontWeight: 600, marginTop: 8 }}>{n}</h3>
                    <p style={{ color: p.muted, fontSize: 14.5, marginTop: 4 }}>{d}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* Veículo: foguete com estágios */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1300} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 5fr) minmax(0, 7fr)', gap: m ? 28 : 72, padding: m ? '56px 20px' : '104px 48px', alignItems: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '80px 1fr' : '140px 1fr', gap: m ? 16 : 28, alignItems: 'stretch', height: m ? 380 : 560 }}>
            <Rocket p={p} />
            <div style={{ display: 'grid', alignContent: 'space-between', padding: m ? '6px 0 50px' : '10px 0 70px' }}>
              {[
                ['Cápsula Aurora', '4 lugares · janela panorâmica'],
                ['Segundo estágio', '1 motor a vácuo'],
                ['Primeiro estágio', 'Reutilizável · pousa sozinho'],
                ['9 motores', 'Metano e oxigênio líquido'],
              ].map(([t, d]) => (
                <div key={t} style={{ borderLeft: `2px solid ${p.accent}`, paddingLeft: 12 }}>
                  <div style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 15 : 18 }}>{t}</div>
                  <div style={{ color: p.muted, fontSize: m ? 12.5 : 14 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: mono, fontSize: 12.5, letterSpacing: '0.2em', color: p.accent }}>VEÍCULO</div>
            <h2 style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 32 : 54, letterSpacing: '-0.03em', marginTop: 12, lineHeight: 1.02 }}>Zero-1: feito para voltar.</h2>
            <p style={{ color: p.muted, marginTop: 16, fontSize: m ? 15 : 17, maxWidth: 520 }}>O primeiro estágio pousa na plataforma marítima oito minutos após o lançamento e voa de novo em três semanas.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 0, marginTop: 32, borderTop: `1px solid ${line}` }}>
              {[
                ['62 m', 'altura total'],
                ['7.600 kN', 'empuxo na decolagem'],
                ['22 t', 'carga útil em órbita'],
                ['15×', 'reutilização por estágio'],
              ].map(([n, t], i) => (
                <div key={t} style={{ padding: '20px 0', paddingLeft: i % 2 ? 20 : 0, borderLeft: i % 2 ? `1px solid ${line}` : 'none', borderBottom: `1px solid ${line}` }}>
                  <div style={{ fontFamily: display, fontSize: m ? 28 : 40, fontWeight: 600, letterSpacing: '-0.03em' }}>{n}</div>
                  <div style={{ color: p.muted, fontSize: 14 }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* Tripulação */}
      <section style={{ padding: m ? '56px 0' : '112px 0' }}>
        <Wrap m={m} max={1300}>
          <h2 style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 32 : 54, letterSpacing: '-0.03em' }}>Tripulação OZ-7</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 12 : 24, marginTop: m ? 24 : 44 }}>
            {[
              ['Lia Moreno', 'Comandante', 'LM'],
              ['Tomás Reis', 'Piloto', 'TR'],
              ['Ana Okafor', 'Médica de bordo', 'AO'],
              ['Davi Sato', 'Engenheiro civil', 'DS'],
            ].map(([n, r, ini], i) => (
              <article key={n} style={{ textAlign: 'center', border: `1px solid ${line}`, borderRadius: 20, padding: m ? '22px 10px' : '32px 20px', background: p.surface }}>
                <div style={{ position: 'relative', width: m ? 84 : 120, height: m ? 84 : 120, margin: '0 auto', borderRadius: '50%', background: `radial-gradient(circle at 40% 35%, ${mix(p.text, p.surface, 0.1)}, ${mix(p.text, p.surface, 0.45)})`, display: 'grid', placeItems: 'center' }}>
                  <div style={{ width: '70%', height: '52%', borderRadius: '40% 40% 48% 48%', background: `linear-gradient(135deg, ${mix(p.secondary, '#000000', 0.3)}, ${p.accent})`, boxShadow: 'inset 6px 6px 0 rgba(255,255,255,.35)' }} />
                  <span style={{ position: 'absolute', bottom: -6, right: -2 }}>
                    <Avatar size={m ? 28 : 36} bg={[p.accent, p.secondary, p.text, p.muted][i]} fg={[p.onAccent, '#ffffff', p.bg, p.bg][i]} label={ini} ring={p.surface} />
                  </span>
                </div>
                <h3 style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 16 : 19, marginTop: 18 }}>{n}</h3>
                <div style={{ color: p.muted, fontSize: 13.5 }}>{r}</div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* CTA da academia */}
      <section style={{ position: 'relative', overflow: 'hidden', borderTop: `1px solid ${line}` }}>
        {[1, 2, 3].map((k) => (
          <div key={k} aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: k * (m ? 260 : 420), height: k * (m ? 260 : 420), transform: 'translate(-50%, -50%)', borderRadius: '50%', border: `1px solid ${withAlpha(p.text, 0.12)}` }} />
        ))}
        <Wrap m={m} max={900} style={{ position: 'relative', textAlign: 'center', padding: m ? '72px 20px' : '140px 48px' }}>
          <div style={{ fontFamily: mono, fontSize: 12.5, letterSpacing: '0.2em', color: p.accent }}>ACADEMIA ORBITAL</div>
          <h2 style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 34 : 64, letterSpacing: '-0.035em', lineHeight: 1, marginTop: 14 }}>Seu lugar na próxima janela de lançamento.</h2>
          <p style={{ color: p.muted, marginTop: 18, fontSize: m ? 15 : 17 }}>Seis meses de treino em centrífuga, mergulho e simulador. Inscrições abertas até 30 de novembro.</p>
          <span style={{ display: 'inline-block', marginTop: 30, background: p.text, color: p.bg, borderRadius: 999, padding: '16px 32px', fontWeight: 600 }}>Quero me candidatar</span>
        </Wrap>
      </section>

      <footer style={{ borderTop: `1px solid ${line}`, fontSize: 14 }}>
        <Wrap m={m} max={1300} style={{ display: 'flex', flexDirection: m ? 'column' : 'row', justifyContent: 'space-between', gap: 20, padding: m ? '32px 20px' : '44px 48px', color: p.muted }}>
          <span style={{ fontFamily: display, fontWeight: 700, letterSpacing: '0.14em', color: p.text }}>ORBITAL ZERO</span>
          <span style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            {['Missões', 'Imprensa', 'Carreiras', 'Segurança', 'Contato'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </span>
          <span style={{ fontFamily: mono, fontSize: 12.5 }}>© 2026 · empresa fictícia</span>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
