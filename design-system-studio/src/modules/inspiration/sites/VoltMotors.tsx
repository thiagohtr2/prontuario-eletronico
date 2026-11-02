import { isDark, mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, useSvgId, Wrap, type SiteProps } from './kit'

type CarKind = 'sedan' | 'suv' | 'roadster'

/** Silhueta lateral do carro elétrico (vetorial, com reflexos). */
function Car({ p, paint, kind = 'sedan', reflection = false }: { p: SitePalette; paint?: string; kind?: CarKind; reflection?: boolean }) {
  const id = useSvgId('volt-car')
  const dark = isDark(p.bg)
  const body = paint ?? mix(p.bg, p.text, dark ? 0.32 : 0.5)
  const top = mix(body, '#ffffff', 0.35)
  const low = mix(body, '#000000', 0.35)
  const glass = mix(p.bg, '#000000', dark ? 0.5 : 0.75)
  const tire = dark ? '#050506' : '#151518'
  const rim = mix(body, '#ffffff', 0.55)
  const sy = kind === 'suv' ? 1.16 : kind === 'roadster' ? 0.84 : 1
  const roof =
    kind === 'roadster'
      ? 'M300 150 Q350 128 420 124 L520 122 Q580 126 640 146 L620 150 L320 154 Z'
      : 'M285 150 Q345 108 425 100 L555 97 Q622 102 682 136 L662 142 L300 152 Z'
  const shape = (
    <g transform={`translate(0 ${262 - 262 * sy}) scale(1 ${sy})`}>
      <path
        d={
          kind === 'roadster'
            ? 'M120 262 L98 240 Q92 214 110 196 Q170 170 270 160 Q340 136 430 130 L540 128 Q620 134 700 156 Q820 164 900 180 Q944 192 950 224 L944 250 Q940 262 920 262 Z'
            : 'M120 262 L96 240 Q90 212 108 190 Q160 160 250 146 Q330 98 420 88 L560 84 Q642 90 722 132 Q820 150 900 172 Q944 186 950 222 L944 250 Q940 262 920 262 Z'
        }
        fill={`url(#${id('body')})`}
      />
      <path d={roof} fill={`url(#${id('glass')})`} />
      <path d="M470 102 L476 150" stroke={low} strokeWidth={5} />
      <path d="M130 206 Q500 186 936 204" stroke={withAlpha('#ffffff', 0.28)} strokeWidth={2} fill="none" />
      <path d="M300 230 L700 230" stroke={withAlpha('#000000', 0.25)} strokeWidth={2} />
      <path d="M560 168 L600 168" stroke={withAlpha('#ffffff', 0.4)} strokeWidth={3} strokeLinecap="round" />
    </g>
  )
  return (
    <svg viewBox="0 0 1000 340" width="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id('body')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.45" stopColor={body} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
        <linearGradient id={id('glass')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={glass} />
          <stop offset="0.6" stopColor={mix(glass, '#ffffff', 0.18)} />
          <stop offset="1" stopColor={glass} />
        </linearGradient>
        <radialGradient id={id('floor')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={withAlpha('#000000', dark ? 0.7 : 0.25)} />
          <stop offset="1" stopColor={withAlpha('#000000', 0)} />
        </radialGradient>
      </defs>
      <ellipse cx={520} cy={300} rx={470} ry={26} fill={`url(#${id('floor')})`} />
      {reflection && (
        <g transform="translate(0 600) scale(1 -1)" opacity={0.08}>
          {shape}
        </g>
      )}
      {shape}
      {[250, 770].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={262} r={72} fill={dark ? mix(p.bg, '#000000', 0.4) : mix(body, '#000000', 0.55)} />
          <circle cx={cx} cy={262} r={60} fill={tire} />
          <circle cx={cx} cy={262} r={40} fill={mix(tire, rim, 0.25)} stroke={rim} strokeWidth={3} />
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d={`M${cx} 262 L${cx} 226`} stroke={rim} strokeWidth={6} strokeLinecap="round" transform={`rotate(${a} ${cx} 262)`} />
          ))}
          <circle cx={cx} cy={262} r={7} fill={p.accent} />
        </g>
      ))}
      <path d="M884 183 L944 198" stroke={p.accent} strokeWidth={5} strokeLinecap="round" transform={`translate(0 ${262 - 262 * sy}) scale(1 ${sy})`} />
      <path d="M100 204 L150 200" stroke={p.secondary} strokeWidth={5} strokeLinecap="round" transform={`translate(0 ${262 - 262 * sy}) scale(1 ${sy})`} />
    </svg>
  )
}

function Logo({ p, size = 22 }: { p: SitePalette; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, fontFamily: ff('space-grotesk'), fontWeight: 700, fontSize: size, letterSpacing: '0.04em' }}>
      VOLT<span style={{ color: p.accent }}>/</span>
      <span style={{ fontSize: size * 0.48, letterSpacing: '0.32em', fontWeight: 500, color: p.muted }}>MOTORS</span>
    </span>
  )
}

const PAINTS = [
  ['Grafite Noturno', '#3b3f46'],
  ['Prata Lunar', '#c4c8ce'],
  ['Azul Abissal', '#1f3a7a'],
  ['Branco Gelo', '#eef0f2'],
  ['Cobre Solar', '#b0603a'],
]

export default function VoltMotors({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const display = ff('space-grotesk')
  const line = hair(p, 0.12)
  const glow = withAlpha(p.secondary, isDark(p.bg) ? 0.35 : 0.22)
  return (
    <SiteRoot p={p} font={ff('inter')} name="VOLT / MOTORS">
      {/* Hero cinematográfico */}
      <section
        style={{
          position: 'relative',
          minHeight: m ? 640 : 820,
          background: `radial-gradient(ellipse 70% 45% at 50% 78%, ${glow} 0%, transparent 70%), linear-gradient(180deg, ${p.bg} 0%, ${mix(p.bg, p.secondary, 0.08)} 70%, ${p.bg} 100%)`,
          overflow: 'hidden',
        }}
      >
        <header style={{ position: 'relative', zIndex: 2 }}>
          <Wrap m={m} max={1320} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: m ? 64 : 84 }}>
            <Logo p={p} size={m ? 19 : 22} />
            {!m && (
              <nav style={{ display: 'flex', gap: 36, fontSize: 14, letterSpacing: '0.04em' }}>
                {['Modelos', 'Tecnologia', 'Recarga', 'Assinatura'].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </nav>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 14 }}>
              {!m && <span>Entrar</span>}
              {m ? (
                <Burger color={p.text} />
              ) : (
                <span style={{ background: p.accent, color: p.onAccent, padding: '11px 22px', fontWeight: 600, borderRadius: 2, letterSpacing: '0.04em' }}>Reservar</span>
              )}
            </div>
          </Wrap>
        </header>

        <Wrap m={m} max={1320} style={{ position: 'relative', zIndex: 2, paddingTop: m ? 28 : 56 }}>
          <div style={{ fontSize: 12.5, letterSpacing: '0.32em', color: p.accent, fontWeight: 600 }}>NOVO VOLT E-1 · 2027</div>
          <h1 style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 42 : 76, lineHeight: 0.98, letterSpacing: '-0.035em', marginTop: 14, maxWidth: 640 }}>
            Silêncio em alta velocidade.
          </h1>
        </Wrap>

        {/* Tipografia monumental atrás do carro */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: m ? 270 : 330,
            textAlign: 'center',
            fontFamily: display,
            fontWeight: 700,
            fontSize: m ? 210 : 460,
            lineHeight: 0.8,
            letterSpacing: '-0.06em',
            color: 'transparent',
            WebkitTextStroke: `1.5px ${withAlpha(p.text, 0.2)}`,
            zIndex: 1,
          }}
        >
          E-1
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: m ? 420 : 1080, margin: m ? '96px auto 0' : '40px auto 0', padding: m ? '0 8px' : 0 }}>
          <Car p={p} reflection />
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)`, marginTop: m ? -18 : -40, opacity: 0.8 }} />
        </div>

        <Wrap
          m={m}
          max={1320}
          style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: m ? 'column' : 'row', justifyContent: 'space-between', alignItems: m ? 'stretch' : 'flex-end', gap: 24, padding: m ? '28px 20px 40px' : '36px 48px 56px' }}
        >
          <p style={{ color: p.muted, maxWidth: 420, fontSize: m ? 15 : 16.5 }}>Sedã 100% elétrico com tração integral, 620 km de autonomia e cabine em silêncio absoluto.</p>
          <div style={{ display: 'flex', gap: 12, flexDirection: m ? 'column' : 'row' }}>
            <span style={{ background: p.accent, color: p.onAccent, padding: '16px 28px', fontWeight: 600, textAlign: 'center', borderRadius: 2, letterSpacing: '0.03em' }}>Reservar por R$ 1.000</span>
            <span style={{ border: `1px solid ${withAlpha(p.text, 0.4)}`, padding: '16px 28px', fontWeight: 600, textAlign: 'center', borderRadius: 2 }}>Configurar o seu →</span>
          </div>
        </Wrap>
      </section>

      {/* Faixa de números */}
      <section style={{ borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1320} style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))' }}>
          {[
            ['620', 'km', 'de autonomia (ciclo WLTP)'],
            ['3,1', 's', 'de 0 a 100 km/h'],
            ['18', 'min', 'para recarregar de 10% a 80%'],
            ['5', '★', 'em segurança, nota máxima'],
          ].map(([n, u, t], i) => (
            <div
              key={t}
              style={{
                padding: m ? '24px 0 24px' : '44px 32px',
                paddingLeft: m ? (i % 2 ? 16 : 0) : i ? 32 : 0,
                borderLeft: (m ? i % 2 : i) ? `1px solid ${line}` : 'none',
                borderTop: m && i > 1 ? `1px solid ${line}` : 'none',
              }}
            >
              <div style={{ fontFamily: display, fontSize: m ? 40 : 64, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {n}
                <span style={{ fontSize: m ? 16 : 22, color: p.accent, marginLeft: 6, letterSpacing: 0 }}>{u}</span>
              </div>
              <div style={{ color: p.muted, fontSize: m ? 13 : 14.5, marginTop: 10 }}>{t}</div>
            </div>
          ))}
        </Wrap>
      </section>

      {/* Configurador de cor */}
      <section style={{ padding: m ? '56px 0' : '120px 0' }}>
        <Wrap m={m} max={1320} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 4fr) minmax(0, 7fr)', gap: m ? 28 : 64, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12.5, letterSpacing: '0.32em', color: p.muted, fontWeight: 600 }}>01 — DESIGN</div>
            <h2 style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 32 : 52, letterSpacing: '-0.03em', lineHeight: 1.02, marginTop: 14 }}>Cinco cores. Nenhum ruído.</h2>
            <p style={{ color: p.muted, marginTop: 16, fontSize: m ? 15 : 16.5, maxWidth: 420 }}>Pintura em três camadas com pigmento cerâmico. A carroceria foi esculpida no túnel de vento: coeficiente aerodinâmico de 0,21.</p>
            <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
              {PAINTS.map(([name, c], i) => (
                <span key={name} title={name} style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(145deg, ${mix(c, '#ffffff', 0.35)}, ${c} 55%, ${mix(c, '#000000', 0.35)})`, boxShadow: i === 2 ? `0 0 0 2px ${p.bg}, 0 0 0 4px ${p.accent}` : `0 0 0 1px ${line}` }} />
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 14, color: p.muted }}>
              Selecionada: <strong style={{ color: p.text }}>Azul Abissal</strong>
            </div>
          </div>
          <div style={{ background: `radial-gradient(ellipse at 50% 60%, ${p.surface} 0%, ${p.bg} 70%)`, borderRadius: 4, padding: m ? '32px 0 12px' : '64px 24px 32px' }}>
            <Car p={p} paint="#1f3a7a" />
          </div>
        </Wrap>
      </section>

      {/* Cabine e tecnologia */}
      <section style={{ background: p.surface, padding: m ? '56px 0' : '112px 0' }}>
        <Wrap m={m} max={1320} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 7fr) minmax(0, 5fr)', gap: m ? 32 : 72, alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              aspectRatio: '16 / 10',
              borderRadius: 6,
              overflow: 'hidden',
              background: `linear-gradient(160deg, ${mix(p.surface, '#000000', 0.55)} 0%, ${mix(p.surface, '#000000', 0.8)} 100%)`,
              color: '#f4f5f7',
            }}
          >
            {/* Painel curvo */}
            <div style={{ position: 'absolute', left: '6%', right: '6%', top: '18%', height: '52%', borderRadius: '18px 18px 60px 60px / 18px 18px 40px 40px', background: 'linear-gradient(180deg, #0b0d12, #151a24)', border: '1px solid rgba(255,255,255,.12)', display: 'grid', gridTemplateColumns: '1fr 1.4fr', overflow: 'hidden' }}>
              <div style={{ padding: m ? 12 : 22, borderRight: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ fontSize: m ? 9 : 11, opacity: 0.6, letterSpacing: '0.2em' }}>VELOCIDADE</div>
                <div style={{ fontFamily: display, fontSize: m ? 34 : 64, fontWeight: 600, lineHeight: 1, marginTop: 6 }}>112</div>
                <div style={{ fontSize: m ? 9 : 12, opacity: 0.6 }}>km/h · autopiloto</div>
                <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,.12)', marginTop: m ? 10 : 20 }}>
                  <div style={{ width: '72%', height: '100%', borderRadius: 2, background: p.accent }} />
                </div>
                <div style={{ fontSize: m ? 9 : 11, opacity: 0.6, marginTop: 6 }}>Bateria 72% · 446 km</div>
              </div>
              <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true">
                <rect width="300" height="180" fill="#10141c" />
                {[30, 70, 110, 150].map((y) => (
                  <path key={y} d={`M0 ${y} L300 ${y + 10}`} stroke="rgba(255,255,255,.06)" />
                ))}
                {[40, 110, 190, 250].map((x) => (
                  <path key={x} d={`M${x} 0 L${x - 20} 180`} stroke="rgba(255,255,255,.06)" />
                ))}
                <path d="M20 170 C 80 140 90 90 150 80 S 240 40 290 20" stroke={p.accent} strokeWidth={4} fill="none" strokeLinecap="round" />
                <circle cx={150} cy={80} r={7} fill="#fff" />
                <circle cx={150} cy={80} r={16} fill="none" stroke={withAlpha(p.accent, 0.6)} strokeWidth={2} />
              </svg>
            </div>
            <div style={{ position: 'absolute', left: '50%', bottom: '-30%', width: '46%', height: '52%', transform: 'translateX(-50%)', borderRadius: '50%', border: '14px solid #22262e' }} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, letterSpacing: '0.32em', color: p.muted, fontWeight: 600 }}>02 — CABINE</div>
            <h2 style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 32 : 48, letterSpacing: '-0.03em', lineHeight: 1.04, marginTop: 14 }}>Uma tela. Toda a estrada.</h2>
            <ul style={{ marginTop: 28, display: 'grid', gap: 0 }}>
              {[
                ['Piloto assistido nível 3', 'Mantém faixa, distância e muda de pista sozinho em rodovias.'],
                ['Tela panorâmica de 17″', 'Mapas, mídia e climatização em um só painel curvo.'],
                ['Atualizações pelo ar', 'O carro melhora enquanto dorme na sua garagem.'],
              ].map(([t, d]) => (
                <li key={t} style={{ borderTop: `1px solid ${line}`, padding: '18px 0', display: 'flex', gap: 16 }}>
                  <Icon name="bolt" size={20} color={p.accent} style={{ marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: m ? 15.5 : 17 }}>{t}</div>
                    <div style={{ color: p.muted, fontSize: m ? 14 : 15, marginTop: 4 }}>{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Wrap>
      </section>

      {/* Linha de modelos */}
      <section style={{ padding: m ? '56px 0' : '120px 0' }}>
        <Wrap m={m} max={1320}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 32 : 52, letterSpacing: '-0.03em' }}>A linha VOLT</h2>
            <span style={{ fontSize: 14, color: p.muted }}>Preços sugeridos · frete e emplacamento à parte</span>
          </div>
        </Wrap>
        <div style={{ overflowX: m ? 'auto' : 'visible', marginTop: m ? 24 : 44 }}>
          <Wrap
            m={m}
            max={1320}
            style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(3, 280px)' : 'repeat(3, minmax(0, 1fr))', gap: m ? 14 : 24, width: m ? 'max-content' : '100%' }}
          >
            {(
              [
                ['E-1', 'Sedã', 'R$ 289.900', 'sedan', '620 km'],
                ['E-X', 'SUV', 'R$ 349.900', 'suv', '540 km'],
                ['E-0', 'Roadster', 'R$ 412.000', 'roadster', '480 km'],
              ] as const
            ).map(([n, t, price, kind, range], i) => (
              <article key={n} style={{ border: `1px solid ${line}`, borderRadius: 4, padding: m ? 20 : 28, background: i === 0 ? p.surface : 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: display, fontSize: m ? 30 : 40, fontWeight: 600, letterSpacing: '-0.03em' }}>{n}</span>
                  <span style={{ fontSize: 12.5, letterSpacing: '0.2em', color: p.muted }}>{t.toUpperCase()}</span>
                </div>
                <div style={{ margin: m ? '18px -8px 8px' : '28px -12px 12px' }}>
                  <Car p={p} kind={kind} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: p.muted, borderTop: `1px solid ${line}`, paddingTop: 14 }}>
                  <span>A partir de</span>
                  <span>Autonomia</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginTop: 4, fontSize: m ? 15 : 17 }}>
                  <span>{price}</span>
                  <span>{range}</span>
                </div>
              </article>
            ))}
          </Wrap>
        </div>
      </section>

      {/* Rede de recarga */}
      <section style={{ borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1320} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 5fr) minmax(0, 7fr)', gap: m ? 24 : 64, alignItems: 'center', padding: m ? '56px 20px' : '112px 48px' }}>
          <div>
            <div style={{ fontSize: 12.5, letterSpacing: '0.32em', color: p.muted, fontWeight: 600 }}>03 — RECARGA</div>
            <h2 style={{ fontFamily: display, fontWeight: 600, fontSize: m ? 32 : 52, letterSpacing: '-0.03em', lineHeight: 1.02, marginTop: 14 }}>1.200 estações. Do litoral à serra.</h2>
            <p style={{ color: p.muted, marginTop: 16, fontSize: m ? 15 : 16.5, maxWidth: 440 }}>Carregadores ultrarrápidos a cada 120 km nas principais rodovias. O planejador de rota escolhe a parada com café.</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 24, fontWeight: 600, color: p.accent }}>
              Ver mapa da rede <Icon name="arrow" size={18} />
            </span>
          </div>
          <svg viewBox="0 0 640 380" width="100%" aria-hidden="true" style={{ display: 'block' }}>
            {Array.from({ length: 19 }, (_, row) =>
              Array.from({ length: 32 }, (_, col) => {
                const x = 10 + col * 20
                const y = 10 + row * 20
                const dx = (x - 330) / 300
                const dy = (y - 190) / 180
                const inside = dx * dx * 1.1 + dy * dy + Math.sin(col * 0.7) * 0.08 < 0.85
                return inside ? <circle key={`${row}-${col}`} cx={x} cy={y} r={2.2} fill={withAlpha(p.text, 0.22)} /> : null
              }),
            )}
            <path d="M150 250 L250 210 L330 230 L410 170 L510 150" stroke={p.accent} strokeWidth={2.5} fill="none" strokeDasharray="6 6" />
            <path d="M250 210 L290 120 L380 90" stroke={withAlpha(p.accent, 0.6)} strokeWidth={2} fill="none" strokeDasharray="6 6" />
            {[
              [150, 250],
              [250, 210],
              [330, 230],
              [410, 170],
              [510, 150],
              [290, 120],
              [380, 90],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={14} fill={withAlpha(p.accent, 0.18)} />
                <circle cx={x} cy={y} r={6} fill={p.accent} />
              </g>
            ))}
          </svg>
        </Wrap>
      </section>

      {/* CTA test-drive */}
      <section style={{ background: p.accent, color: p.onAccent, textAlign: 'center' }}>
        <Wrap m={m} style={{ padding: m ? '56px 20px' : '104px 48px' }}>
          <h2 style={{ fontFamily: display, fontWeight: 700, fontSize: m ? 40 : 88, letterSpacing: '-0.045em', lineHeight: 0.95 }}>Sinta o silêncio.</h2>
          <p style={{ marginTop: 18, fontSize: m ? 15 : 18, opacity: 0.8 }}>Test-drive de 40 minutos, na sua casa ou em uma das nossas 14 lojas.</p>
          <span style={{ display: 'inline-block', marginTop: 28, background: p.onAccent, color: p.accent, padding: '17px 34px', fontWeight: 700, borderRadius: 2, letterSpacing: '0.04em' }}>AGENDAR TEST-DRIVE</span>
        </Wrap>
      </section>

      {/* Footer com wordmark monumental */}
      <footer style={{ padding: m ? '48px 0 24px' : '80px 0 32px' }}>
        <Wrap m={m} max={1320}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 24 : 32, fontSize: 14.5 }}>
            {[
              ['Modelos', ['E-1 Sedã', 'E-X SUV', 'E-0 Roadster', 'Seminovos']],
              ['Proprietários', ['App VOLT', 'Manutenção', 'Garantia', 'Recarga em casa']],
              ['Empresa', ['Sobre', 'Sustentabilidade', 'Imprensa', 'Carreiras']],
              ['Contato', ['Lojas', 'Atendimento 24 h', 'Frotas', 'Ouvidoria']],
            ].map(([t, items]) => (
              <div key={t as string}>
                <div style={{ color: p.muted, fontSize: 12.5, letterSpacing: '0.2em', fontWeight: 600 }}>{(t as string).toUpperCase()}</div>
                <ul style={{ display: 'grid', gap: 8, marginTop: 14 }}>
                  {(items as string[]).map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div aria-hidden="true" style={{ fontFamily: display, fontWeight: 700, fontSize: m ? 96 : 280, letterSpacing: '-0.06em', lineHeight: 0.8, marginTop: m ? 40 : 72, color: 'transparent', WebkitTextStroke: `1.5px ${withAlpha(p.text, 0.25)}` }}>
            VOLT/
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, color: p.muted, fontSize: 12.5, marginTop: 24, borderTop: `1px solid ${line}`, paddingTop: 18 }}>
            <span>© 2026 VOLT/MOTORS — marca fictícia</span>
            <span>Consumo e autonomia variam conforme uso e clima.</span>
          </div>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
