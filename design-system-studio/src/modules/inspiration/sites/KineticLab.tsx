import { mix, readableOn, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { band, Burger, ff, hair, Icon, SiteRoot, Wrap, type SiteProps } from './kit'

type Pose = 'run' | 'lift' | 'stretch'

/** Figura atlética em traços grossos, com linhas de velocidade. */
function Athlete({ p, pose, body, lines = true }: { p: SitePalette; pose: Pose; body: string; lines?: boolean }) {
  const sw = 22
  return (
    <svg viewBox="0 0 400 420" width="100%" height="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      {lines &&
        [70, 120, 170, 220].map((y, i) => (
          <path key={y} d={`M${10 + i * 12} ${y} L${120 + i * 10} ${y}`} stroke={i % 2 ? p.secondary : p.accent} strokeWidth={8} strokeLinecap="round" opacity={0.9} />
        ))}
      <g stroke={body} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {pose === 'run' && (
          <>
            <path d="M232 110 L196 214" />
            <path d="M226 128 L282 164 L320 140" />
            <path d="M224 132 L180 160 L150 206" />
            <path d="M196 214 L262 262 L248 344" />
            <path d="M196 214 L150 284 L92 290" />
          </>
        )}
        {pose === 'lift' && (
          <>
            <path d="M200 120 L200 230" />
            <path d="M200 140 L140 110 L130 60" />
            <path d="M200 140 L260 110 L270 60" />
            <path d="M200 230 L160 300 L170 380" />
            <path d="M200 230 L240 300 L230 380" />
          </>
        )}
        {pose === 'stretch' && (
          <>
            <path d="M190 130 L230 240" />
            <path d="M196 150 L120 90" />
            <path d="M196 150 L300 120" />
            <path d="M230 240 L150 320 L90 340" />
            <path d="M230 240 L300 320 L330 390" />
          </>
        )}
      </g>
      {pose === 'lift' && (
        <g>
          <path d="M70 60 L330 60" stroke={mix(body, '#888888', 0.3)} strokeWidth={10} strokeLinecap="round" />
          {[60, 84, 316, 340].map((x) => (
            <rect key={x} x={x - 10} y={20} width={20} height={80} rx={6} fill={x < 200 ? p.accent : p.secondary} />
          ))}
        </g>
      )}
      <circle cx={pose === 'run' ? 248 : pose === 'lift' ? 200 : 182} cy={pose === 'run' ? 72 : pose === 'lift' ? 88 : 98} r={30} fill={p.accent} />
    </svg>
  )
}

function Ring({ fg, value, label, sub, color }: { fg: string; value: number; label: string; sub: string; color: string }) {
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="100%" viewBox="0 0 120 120" aria-hidden="true" style={{ display: 'block', maxWidth: 150, margin: '0 auto' }}>
        <circle cx={60} cy={60} r={r} stroke={withAlpha(fg, 0.15)} strokeWidth={12} fill="none" />
        <circle cx={60} cy={60} r={r} stroke={color} strokeWidth={12} fill="none" strokeDasharray={`${c * value} ${c}`} strokeLinecap="round" transform="rotate(-90 60 60)" />
        <text x={60} y={58} textAnchor="middle" fontSize={22} fontWeight={700} fill={fg} fontFamily={ff('space-grotesk')}>
          {label}
        </text>
        <text x={60} y={78} textAnchor="middle" fontSize={10} fill={withAlpha(fg, 0.65)} fontFamily={ff('inter')}>
          {sub}
        </text>
      </svg>
    </div>
  )
}

export default function KineticLab({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const g = ff('space-grotesk')
  const line = hair(p, 0.14)
  const inv = band(p)
  const slant = { fontFamily: g, fontWeight: 700, fontStyle: 'italic' as const, textTransform: 'uppercase' as const, letterSpacing: '-0.04em' }
  return (
    <SiteRoot p={p} font={ff('inter')} name="KINETIC LAB">
      {/* Header */}
      <header style={{ background: inv.bg, color: inv.fg }}>
        <Wrap m={m} max={1320} style={{ display: 'flex', alignItems: 'center', gap: 36, height: m ? 62 : 76 }}>
          <span style={{ ...slant, fontSize: m ? 20 : 24, letterSpacing: '-0.02em' }}>
            KINETIC<span style={{ color: p.accent }}>/</span>LAB
          </span>
          {!m && (
            <nav style={{ display: 'flex', gap: 28, fontSize: 14, fontWeight: 600, letterSpacing: '0.04em' }}>
              {['PROGRAMAS', 'UNIDADES', 'COACHES', 'APP'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </nav>
          )}
          <div style={{ flex: 1 }} />
          {m ? (
            <Burger color={inv.fg} weight={2.6} />
          ) : (
            <span style={{ background: p.accent, color: p.onAccent, padding: '12px 22px', transform: 'skewX(-12deg)', display: 'inline-block' }}>
              <span style={{ display: 'inline-block', transform: 'skewX(12deg)', ...slant, fontSize: 15, letterSpacing: '0.02em' }}>Aula grátis</span>
            </span>
          )}
        </Wrap>
      </header>

      {/* Hero invertido com corte diagonal */}
      <section style={{ background: inv.bg, color: inv.fg, clipPath: m ? 'polygon(0 0, 100% 0, 100% 96%, 0 100%)' : 'polygon(0 0, 100% 0, 100% 88%, 0 100%)', paddingBottom: m ? 48 : 120, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(-60deg, transparent 0 60px, ${withAlpha(inv.fg, 0.03)} 60px 120px)` }} />
        <Wrap m={m} max={1320} style={{ position: 'relative', display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 7fr) minmax(0, 5fr)', gap: m ? 12 : 24, alignItems: 'center', paddingTop: m ? 28 : 56 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', color: p.accent }}>
              <span style={{ width: 28, height: 3, background: p.accent }} /> TREINO HÍBRIDO · TEMPORADA 27
            </div>
            <h1 style={{ ...slant, fontSize: m ? 54 : 118, lineHeight: 0.86, marginTop: 18 }}>
              Mova-se
              <br />
              <span style={{ color: 'transparent', WebkitTextStroke: `${m ? 1.5 : 2.5}px ${inv.fg}` }}>com</span>
              <br />
              <span style={{ color: p.accent, whiteSpace: 'nowrap' }}>intenção.</span>
            </h1>
            <p style={{ fontSize: m ? 16 : 19, marginTop: 24, maxWidth: 480, opacity: 0.8 }}>Corrida, força e mobilidade no mesmo plano — ajustado toda semana pelos seus dados e por um coach de verdade.</p>
            <div style={{ display: 'flex', gap: 14, marginTop: 30, flexDirection: m ? 'column' : 'row' }}>
              <span style={{ background: p.accent, color: p.onAccent, padding: '17px 30px', ...slant, fontSize: 17, letterSpacing: '0.01em', textAlign: 'center' }}>Começar 7 dias grátis</span>
              <span style={{ border: `2px solid ${withAlpha(inv.fg, 0.5)}`, padding: '15px 28px', ...slant, fontSize: 17, letterSpacing: '0.01em', textAlign: 'center' }}>Ver programas</span>
            </div>
          </div>
          <div style={{ position: 'relative', height: m ? 300 : 520 }}>
            <div style={{ position: 'absolute', right: '6%', top: '8%', width: m ? 220 : 380, height: m ? 220 : 380, borderRadius: '50%', border: `${m ? 14 : 22}px solid ${p.secondary}`, opacity: 0.9 }} />
            <div style={{ position: 'absolute', inset: 0 }}>
              <Athlete p={p} pose="run" body={inv.fg} />
            </div>
            <div style={{ position: 'absolute', left: m ? 0 : '4%', bottom: m ? 0 : '6%', background: inv.fg, color: inv.bg, padding: m ? '10px 14px' : '14px 18px', transform: 'skewX(-8deg)' }}>
              <div style={{ transform: 'skewX(8deg)' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.7 }}>PACE MÉDIO</div>
                <div style={{ ...slant, fontSize: m ? 24 : 32 }}>4'52"/km</div>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Faixa inclinada */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: m ? -18 : -40, transform: 'rotate(-2.5deg)', background: p.accent, color: p.onAccent, padding: m ? '12px 0' : '18px 0', whiteSpace: 'nowrap', overflow: 'hidden', width: '110%', marginLeft: '-5%' }}>
        <span style={{ ...slant, fontSize: m ? 22 : 34, letterSpacing: '0.01em' }}>{'CORRIDA ● FORÇA ● MOBILIDADE ● HIIT ● RECUPERAÇÃO ● '.repeat(4)}</span>
      </div>

      {/* Programas */}
      <section>
        <Wrap m={m} max={1320} style={{ padding: m ? '56px 20px 48px' : '120px 48px 96px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
            <h2 style={{ ...slant, fontSize: m ? 40 : 80, lineHeight: 0.9 }}>Escolha seu programa</h2>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.06em', borderBottom: `3px solid ${p.accent}` }}>TODOS OS 12 →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 14 : 20, marginTop: m ? 24 : 48 }}>
            {(
              [
                ['01', 'Corrida 10K', '8 semanas', 4, 'run', p.accent],
                ['02', 'Força total', '12 semanas', 5, 'lift', p.secondary],
                ['03', 'Mobilidade', '6 semanas', 2, 'stretch', p.text],
              ] as [string, string, string, number, Pose, string][]
            ).map(([n, t, d, level, pose, c], i) => (
              <article key={n} style={{ background: p.surface, border: `1px solid ${line}`, clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 36px), calc(100% - 36px) 100%, 0 100%)', padding: m ? 20 : 28, position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ ...slant, fontSize: m ? 44 : 64, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: `1.5px ${p.text}` }}>{n}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, background: i === 0 ? p.accent : 'transparent', color: i === 0 ? p.onAccent : p.text, border: i === 0 ? 'none' : `1.5px solid ${line}`, padding: '4px 10px' }}>{i === 0 ? 'POPULAR' : d.toUpperCase()}</span>
                </div>
                <div style={{ height: m ? 170 : 230, margin: '12px 0', background: withAlpha(c, 0.08) }}>
                  <Athlete p={p} pose={pose} body={p.text} lines={false} />
                </div>
                <h3 style={{ ...slant, fontSize: m ? 26 : 34 }}>{t}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 13.5, color: p.muted }}>
                  <span>Intensidade</span>
                  <span style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((k) => (
                      <span key={k} style={{ width: 18, height: 8, transform: 'skewX(-20deg)', background: k <= level ? c : withAlpha(p.text, 0.12) }} />
                    ))}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Painel de desempenho */}
      <section style={{ background: inv.bg, color: inv.fg }}>
        <Wrap m={m} max={1320} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 4fr) minmax(0, 8fr)', gap: m ? 28 : 64, padding: m ? '56px 20px' : '104px 48px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', color: p.accent }}>APP KINETIC</div>
            <h2 style={{ ...slant, fontSize: m ? 40 : 64, lineHeight: 0.9, marginTop: 14 }}>Seus dados viram treino.</h2>
            <p style={{ opacity: 0.75, marginTop: 16, fontSize: m ? 15 : 17 }}>Relógio, balança e sono conectados. Seu coach ajusta a carga antes de você se machucar.</p>
          </div>
          <div style={{ background: withAlpha(inv.fg, 0.06), border: `1px solid ${withAlpha(inv.fg, 0.12)}`, padding: m ? 18 : 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: m ? 10 : 24 }}>
              <Ring fg={inv.fg} value={0.82} label="52" sub="VO₂ máx" color={p.accent} />
              <Ring fg={inv.fg} value={0.64} label="+18%" sub="força" color={p.secondary} />
              <Ring fg={inv.fg} value={0.9} label="7h40" sub="sono" color={mix(p.accent, p.secondary, 0.5)} />
            </div>
            <div style={{ marginTop: m ? 18 : 28, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.7 }}>CARGA SEMANAL</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: m ? 6 : 10, height: m ? 90 : 120, marginTop: 10 }}>
              {[40, 55, 48, 70, 62, 85, 30].map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <span style={{ display: 'block', width: '100%', height: (v / 100) * (m ? 68 : 94), background: i === 5 ? p.accent : withAlpha(inv.fg, 0.25), transform: 'skewX(-8deg)' }} />
                  <span style={{ fontSize: 11, opacity: 0.6 }}>{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* Grade de aulas */}
      <section>
        <Wrap m={m} max={1320} style={{ padding: m ? '56px 20px' : '104px 48px' }}>
          <h2 style={{ ...slant, fontSize: m ? 36 : 64, lineHeight: 0.9 }}>Grade da semana</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '52px repeat(3, minmax(0, 1fr))' : '80px repeat(5, minmax(0, 1fr))', gap: m ? 6 : 10, marginTop: m ? 20 : 40, fontSize: m ? 12 : 14 }}>
            <span />
            {['SEG', 'TER', 'QUA', 'QUI', 'SEX'].slice(0, m ? 3 : 5).map((d) => (
              <span key={d} style={{ ...slant, fontSize: m ? 16 : 20, textAlign: 'center', paddingBottom: 6, borderBottom: `3px solid ${p.text}` }}>
                {d}
              </span>
            ))}
            {['06:00', '07:30', '12:15', '18:30', '20:00'].map((h, r) => (
              <div key={h} style={{ display: 'contents' }}>
                <span style={{ fontWeight: 700, fontFamily: ff('jetbrains-mono'), paddingTop: 12 }}>{h}</span>
                {Array.from({ length: m ? 3 : 5 }, (_, c) => {
                  const k = (r * 3 + c * 2) % 5
                  const cls = ['Corrida', 'Força', 'HIIT', 'Mobilidade', 'Força'][k]
                  const color = [p.accent, p.secondary, p.text, mix(p.accent, p.secondary, 0.5), p.secondary][k]
                  const empty = (r + c) % 4 === 3
                  return (
                    <div key={c} style={{ minHeight: m ? 54 : 64, background: empty ? 'transparent' : withAlpha(color, 0.12), borderLeft: empty ? `1px dashed ${line}` : `4px solid ${color}`, padding: m ? '6px 6px' : '10px 12px' }}>
                      {!empty && (
                        <>
                          <div style={{ fontWeight: 700 }}>{cls}</div>
                          <div style={{ fontSize: m ? 11 : 12.5, color: p.muted }}>{['45 min', '50 min', '30 min', '40 min', '60 min'][k]}</div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Planos */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1320} style={{ padding: m ? '56px 20px' : '104px 48px' }}>
          <h2 style={{ ...slant, fontSize: m ? 36 : 64, lineHeight: 0.9, textAlign: m ? 'left' : 'center' }}>Planos sem fidelidade</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 14 : 20, marginTop: m ? 24 : 48 }}>
            {[
              ['Digital', 'R$ 59', ['App com planos', 'Comunidade', 'Ajuste mensal'], false],
              ['Híbrido', 'R$ 189', ['Tudo do Digital', 'Aulas ilimitadas', 'Coach dedicado', 'Avaliação física'], true],
              ['Performance', 'R$ 349', ['Tudo do Híbrido', 'Nutricionista', 'Fisioterapia preventiva'], false],
            ].map(([n, price, items, hi]) => (
              <div key={n as string} style={{ background: hi ? inv.bg : p.bg, color: hi ? inv.fg : p.text, border: `1px solid ${line}` }}>
                <div style={{ background: hi ? p.accent : 'transparent', color: hi ? p.onAccent : p.text, padding: m ? '14px 20px' : '18px 28px', borderBottom: hi ? 'none' : `1px solid ${line}`, ...slant, fontSize: m ? 22 : 26 }}>{n as string}</div>
                <div style={{ padding: m ? 20 : 28 }}>
                  <div style={{ ...slant, fontSize: m ? 44 : 56 }}>
                    {price as string}
                    <span style={{ fontSize: 16, opacity: 0.6, fontStyle: 'normal', textTransform: 'none' }}>/mês</span>
                  </div>
                  <ul style={{ display: 'grid', gap: 10, marginTop: 18, fontSize: 15 }}>
                    {(items as string[]).map((t) => (
                      <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <Icon name="check" size={17} color={hi ? p.accent : p.secondary} stroke={2.6} /> {t}
                      </li>
                    ))}
                  </ul>
                  <span style={{ display: 'block', textAlign: 'center', marginTop: 24, padding: '14px 0', background: hi ? p.accent : 'transparent', color: hi ? p.onAccent : p.text, border: hi ? 'none' : `2px solid ${p.text}`, ...slant, fontSize: 16, letterSpacing: '0.02em' }}>Assinar</span>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* CTA diagonal */}
      <section style={{ background: p.secondary, color: readableOn(p.secondary, '#ffffff', '#111111'), clipPath: m ? 'polygon(0 4%, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 14%, 100% 0, 100% 100%, 0 100%)' }}>
        <Wrap m={m} max={1320} style={{ padding: m ? '64px 20px 48px' : '140px 48px 96px', display: 'flex', flexDirection: m ? 'column' : 'row', justifyContent: 'space-between', alignItems: m ? 'flex-start' : 'flex-end', gap: 24 }}>
          <h2 style={{ ...slant, fontSize: m ? 48 : 112, lineHeight: 0.86 }}>
            Primeira
            <br />
            semana grátis.
          </h2>
          <span style={{ background: readableOn(p.secondary, '#ffffff', '#111111'), color: p.secondary, padding: '18px 32px', ...slant, fontSize: 18, letterSpacing: '0.02em' }}>Agendar aula →</span>
        </Wrap>
      </section>

      <footer style={{ background: inv.bg, color: inv.fg }}>
        <Wrap m={m} max={1320} style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '2fr repeat(3, 1fr)', gap: 24, padding: m ? '36px 20px' : '56px 48px', fontSize: 14 }}>
          <div style={{ gridColumn: m ? '1 / -1' : 'auto' }}>
            <span style={{ ...slant, fontSize: 26 }}>
              KINETIC<span style={{ color: p.accent }}>/</span>LAB
            </span>
            <p style={{ opacity: 0.6, marginTop: 8 }}>14 unidades em SP, RJ e BH. Rede fictícia.</p>
          </div>
          {[
            ['Treinar', ['Programas', 'Aulas', 'App']],
            ['Unidades', ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte']],
            ['Empresa', ['Coaches', 'Corporativo', 'Contato']],
          ].map(([t, items]) => (
            <div key={t as string}>
              <div style={{ fontWeight: 700, letterSpacing: '0.1em', fontSize: 12.5, color: p.accent }}>{(t as string).toUpperCase()}</div>
              <ul style={{ display: 'grid', gap: 6, marginTop: 10, opacity: 0.85 }}>
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
