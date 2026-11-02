import { isDark, mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, Icon, SiteRoot, Wrap, type SiteProps } from './kit'

/** Desenha um sprite a partir de linhas de caracteres (cada caractere = 1 pixel). */
function Sprite({ rows, colors, px, x = 0, y = 0 }: { rows: string[]; colors: Record<string, string>; px: number; x?: number; y?: number }) {
  return (
    <g>
      {rows.flatMap((row, r) =>
        row.split('').map((ch, c) => (colors[ch] ? <rect key={`${r}-${c}`} x={x + c * px} y={y + r * px} width={px} height={px} fill={colors[ch]} /> : null)),
      )}
    </g>
  )
}

const HERO = ['....KKKK....', '...KHHHHK...', '..KHHHHHHK..', '..KSSESSEK..', '..KSSSSSSK..', '...KSSSSK...', '..KBBBBBBK.W', '.KSKBBBBKSKW', '.KSKBBBBKSKW', '...KBKKBK..W', '...KBK.KBK..', '...KK...KK..']
const SLIME = ['...GGGG...', '..GGGGGG..', '.GGWGGWGG.', '.GGKGGKGG.', 'GGGGGGGGGG', 'GGGGGGGGGG', '.GGGGGGGG.']
const COIN = ['.YYY.', 'YYWYY', 'YYWYY', 'YYWYY', '.YYY.']
const GHOST = ['..WWWW..', '.WWWWWW.', 'WWKWWKWW', 'WWKWWKWW', 'WWWWWWWW', 'WWWWWWWW', 'WW.WW.WW']
const SHIP = ['....A....', '...AAA...', '..AAWAA..', '.AAAAAAA.', 'AA.AAA.AA', 'A..R.R..A']
const HEART = ['.RR.RR.', 'RRRRRRR', 'RRRRRRR', '.RRRRR.', '..RRR..', '...R...']
const DRAGON = ['..GG......', '.GGGG.....', 'GGWKGGG...', 'GGGGGGGG..', '.RR.GGGGGG', '....GGGGG.', '...GG..GG.']

function Scene({ p, m }: { p: SitePalette; m: boolean }) {
  const px = 16
  const sky = isDark(p.bg) ? mix(p.bg, p.secondary, 0.35) : mix(p.secondary, '#ffffff', 0.6)
  const ground = mix(p.accent, '#7a4a1a', 0.55)
  const grass = mix(p.secondary, '#3aa655', 0.55)
  const colors = { K: '#1d1530', H: p.accent, S: '#f2c29b', E: '#1d1530', B: p.secondary, W: '#ffffff' }
  return (
    <svg viewBox="0 0 640 480" width="100%" aria-hidden="true" style={{ display: 'block', shapeRendering: 'crispEdges' }}>
      <rect width="640" height="480" fill={sky} />
      {Array.from({ length: 30 }, (_, i) => (
        <rect key={i} x={(i * 97) % 640} y={(i * 53) % 220} width={4} height={4} fill={withAlpha('#ffffff', 0.7)} />
      ))}
      <Sprite rows={['..WWWW....', '.WWWWWWWW.', 'WWWWWWWWWW']} colors={{ W: withAlpha('#ffffff', 0.85) }} px={px} x={64} y={64} />
      <Sprite rows={['...WWW..', '.WWWWWWW', 'WWWWWWWW']} colors={{ W: withAlpha('#ffffff', 0.7) }} px={px} x={420} y={110} />
      {/* Montanhas em degraus */}
      {[
        [0, 288, 10, mix(sky, '#000000', 0.25)],
        [256, 256, 14, mix(sky, '#000000', 0.18)],
      ].map(([x0, y0, w, c], k) => (
        <g key={k}>
          {Array.from({ length: w as number }, (_, i) => {
            const h = Math.min(i, (w as number) - 1 - i) * px
            return <rect key={i} x={(x0 as number) + i * px} y={(y0 as number) - h} width={px} height={h + 200} fill={c as string} />
          })}
        </g>
      ))}
      {/* Chão de blocos */}
      {Array.from({ length: 40 }, (_, i) => (
        <g key={i}>
          <rect x={i * px} y={400} width={px} height={px} fill={grass} />
          <rect x={i * px} y={416} width={px} height={64} fill={ground} />
          <rect x={i * px + (i % 2 ? 0 : 8)} y={432 + (i % 3) * 12} width={6} height={4} fill={mix(ground, '#000000', 0.25)} />
        </g>
      ))}
      {/* Plataforma e moedas */}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={360 + i * px} y={300} width={px - 1} height={px - 1} fill={mix(p.accent, '#a0522d', 0.35)} stroke="#1d1530" strokeWidth={1} />
      ))}
      {[0, 1, 2].map((i) => (
        <Sprite key={i} rows={COIN} colors={{ Y: p.accent, W: '#fff6c8' }} px={5} x={372 + i * 30} y={262} />
      ))}
      <Sprite rows={SLIME} colors={{ G: grass, W: '#ffffff', K: '#1d1530' }} px={6} x={480} y={358} />
      <Sprite rows={HERO} colors={colors} px={m ? 10 : 11} x={150} y={400 - 12 * (m ? 10 : 11)} />
      <rect x={0} y={0} width={640} height={480} fill="none" stroke="#1d1530" strokeWidth={4} />
    </svg>
  )
}

export default function PixelPlay({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const mono = ff('jetbrains-mono')
  const ink = isDark(p.bg) ? '#0b0816' : p.text
  const chunk = (bg: string, fg: string) => ({ background: bg, color: fg, border: `3px solid ${ink}`, boxShadow: `5px 5px 0 ${ink}`, fontFamily: mono, fontWeight: 800, letterSpacing: '0.04em' })
  const panel = { background: p.surface, border: `3px solid ${ink}`, boxShadow: `6px 6px 0 ${ink}` }
  const grid = `linear-gradient(${withAlpha(p.text, 0.05)} 2px, transparent 2px) 0 0 / 32px 32px, linear-gradient(90deg, ${withAlpha(p.text, 0.05)} 2px, transparent 2px) 0 0 / 32px 32px`
  return (
    <SiteRoot p={p} font={ff('space-grotesk')} name="PIXEL PLAY" style={{ background: `${grid}, ${p.bg}` }}>
      {/* Header */}
      <header style={{ borderBottom: `3px solid ${ink}`, background: p.surface }}>
        <Wrap m={m} max={1240} style={{ display: 'flex', alignItems: 'center', gap: 32, height: m ? 64 : 80 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: mono, fontWeight: 800, fontSize: m ? 17 : 21, letterSpacing: '0.04em' }}>
            <svg width={28} height={24} viewBox="0 0 28 24" style={{ shapeRendering: 'crispEdges' }} aria-hidden="true">
              <Sprite rows={HEART} colors={{ R: p.secondary }} px={4} />
            </svg>
            PIXEL<span style={{ background: p.accent, color: p.onAccent, padding: '0 6px' }}>PLAY</span>
          </span>
          {!m && (
            <nav style={{ display: 'flex', gap: 26, fontFamily: mono, fontSize: 14, fontWeight: 700 }}>
              {['JOGOS', 'RANKING', 'TORNEIOS', 'LOJA'].map((t, i) => (
                <span key={t} style={{ borderBottom: i === 0 ? `3px solid ${p.accent}` : 'none', paddingBottom: 2 }}>
                  {t}
                </span>
              ))}
            </nav>
          )}
          <div style={{ flex: 1 }} />
          {!m && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: mono, fontWeight: 700, fontSize: 14, border: `2px solid ${withAlpha(p.text, 0.3)}`, padding: '6px 12px' }}>
              <svg width={15} height={15} viewBox="0 0 25 25" style={{ shapeRendering: 'crispEdges' }} aria-hidden="true">
                <Sprite rows={COIN} colors={{ Y: p.accent, W: '#fff6c8' }} px={5} />
              </svg>
              1.250
            </span>
          )}
          {m ? <Burger color={p.text} weight={3} /> : <span style={{ ...chunk(p.accent, p.onAccent), padding: '10px 18px', fontSize: 14 }}>ENTRAR</span>}
        </Wrap>
      </header>

      {/* Hero com cena em pixel art */}
      <section>
        <Wrap m={m} max={1240} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: m ? 32 : 56, padding: m ? '32px 20px 48px' : '72px 48px 96px', alignItems: 'center' }}>
          <div>
            <span style={{ ...chunk(p.secondary, readable(p.secondary)), display: 'inline-block', padding: '5px 10px', fontSize: 12.5, boxShadow: `3px 3px 0 ${ink}` }}>★ NOVO: CAVERNAS DE CRISTAL</span>
            <h1 style={{ fontFamily: mono, fontWeight: 800, fontSize: m ? 36 : 62, lineHeight: 1.04, letterSpacing: '-0.03em', marginTop: 22, textTransform: 'uppercase' }}>
              Aperte <span style={{ color: p.accent }}>start</span> para a próxima aventura.
            </h1>
            <p style={{ color: p.muted, fontSize: m ? 16 : 18.5, marginTop: 18, maxWidth: 480 }}>Mais de 300 jogos independentes, torneios toda semana e uma comunidade que joga junto desde 2019.</p>
            <div style={{ display: 'flex', gap: 16, marginTop: 30, flexDirection: m ? 'column' : 'row' }}>
              <span style={{ ...chunk(p.accent, p.onAccent), padding: '16px 26px', fontSize: 16, textAlign: 'center' }}>▶ JOGAR GRÁTIS</span>
              <span style={{ ...chunk(p.surface, p.text), padding: '16px 26px', fontSize: 16, textAlign: 'center' }}>VER TRAILER</span>
            </div>
            <div style={{ display: 'flex', gap: m ? 20 : 32, marginTop: 32, fontFamily: mono, flexWrap: 'wrap' }}>
              {[
                ['2,4 mi', 'JOGADORES'],
                ['312', 'JOGOS'],
                ['48', 'TORNEIOS/MÊS'],
              ].map(([n, t]) => (
                <div key={t}>
                  <div style={{ fontWeight: 800, fontSize: m ? 22 : 28, color: p.secondary }}>{n}</div>
                  <div style={{ fontSize: 11.5, color: p.muted, letterSpacing: '0.1em' }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...panel, padding: m ? 10 : 16, borderRadius: 18, background: ink }}>
            <div style={{ borderRadius: 10, overflow: 'hidden' }}>
              <Scene p={p} m={m} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 6px 2px', fontFamily: mono, fontSize: 12, color: '#cfc8e8' }}>
              <span>VIDAS ♥♥♥</span>
              <span>MOEDAS 042</span>
              <span>FASE 1-3</span>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Plataformas */}
      <div style={{ borderTop: `3px solid ${ink}`, borderBottom: `3px solid ${ink}`, background: p.accent, color: p.onAccent, fontFamily: mono, fontWeight: 800, overflow: 'hidden', whiteSpace: 'nowrap', padding: '12px 0', fontSize: m ? 14 : 16 }}>
        {'★ PC  ★ CONSOLE  ★ CELULAR  ★ NUVEM  ★ CROSSPLAY  ★ CONQUISTAS  ★ SALVAMENTO NA NUVEM '.repeat(3)}
      </div>

      {/* Jogos em destaque */}
      <section>
        <Wrap m={m} max={1240} style={{ padding: m ? '48px 20px' : '96px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: mono, fontWeight: 800, fontSize: m ? 28 : 44, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Em alta esta semana</h2>
            <div style={{ display: 'flex', gap: 8, fontFamily: mono, fontSize: 13, fontWeight: 700, flexWrap: 'wrap' }}>
              {['TODOS', 'AÇÃO', 'PUZZLE', 'RPG', 'CORRIDA'].map((t, i) => (
                <span key={t} style={{ padding: '6px 12px', border: `2px solid ${ink}`, background: i === 0 ? p.secondary : p.surface, color: i === 0 ? readable(p.secondary) : p.text }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 14 : 24, marginTop: m ? 24 : 40 }}>
            {(
              [
                ['Slime Rush', 'Ação · Plataforma', 'GRÁTIS', SLIME, { G: '#5fd068', W: '#ffffff', K: '#1d1530' }, '#2b6e4f', 4.8],
                ['Ghost Lab', 'Puzzle · Terror leve', 'R$ 24', GHOST, { W: '#f4f1ff', K: '#1d1530' }, '#3b2d6e', 4.6],
                ['Nave Zero', 'Shoot em up', 'R$ 18', SHIP, { A: '#3ddcff', W: '#ffffff', R: '#ff5a3c' }, '#0f1a3d', 4.9],
                ['Dragão de Bolso', 'RPG · Coleção', 'R$ 32', DRAGON, { G: '#ff7a3c', W: '#ffffff', K: '#1d1530', R: '#ffd23f' }, '#5a1f3a', 4.7],
              ] as [string, string, string, string[], Record<string, string>, string, number][]
            ).map(([n, g, price, rows, colors, bg, score], i) => (
              <article key={n} style={{ ...panel, boxShadow: `${m ? 4 : 6}px ${m ? 4 : 6}px 0 ${ink}` }}>
                <div style={{ position: 'relative', aspectRatio: '1', background: `linear-gradient(${withAlpha('#ffffff', 0.06)} 2px, transparent 2px) 0 0 / 16px 16px, linear-gradient(90deg, ${withAlpha('#ffffff', 0.06)} 2px, transparent 2px) 0 0 / 16px 16px, ${bg}`, borderBottom: `3px solid ${ink}`, display: 'grid', placeItems: 'center' }}>
                  <svg viewBox={`0 0 ${rows[0].length * 10} ${rows.length * 10}`} width="56%" style={{ shapeRendering: 'crispEdges', display: 'block' }} aria-hidden="true">
                    <Sprite rows={rows} colors={colors} px={10} />
                  </svg>
                  {i === 2 && <span style={{ position: 'absolute', top: 10, left: 10, background: p.accent, color: p.onAccent, fontFamily: mono, fontWeight: 800, fontSize: 11, padding: '3px 7px', border: `2px solid ${ink}` }}>TOP 1</span>}
                </div>
                <div style={{ padding: m ? 12 : 16 }}>
                  <h3 style={{ fontFamily: mono, fontWeight: 800, fontSize: m ? 14.5 : 17, textTransform: 'uppercase' }}>{n}</h3>
                  <div style={{ fontSize: 13, color: p.muted, marginTop: 2 }}>{g}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontFamily: mono, fontWeight: 800, fontSize: 13.5 }}>
                    <span style={{ color: p.accent }}>★ {String(score).replace('.', ',')}</span>
                    <span style={{ background: price === 'GRÁTIS' ? p.secondary : 'transparent', color: price === 'GRÁTIS' ? readable(p.secondary) : p.text, padding: '2px 8px', border: `2px solid ${ink}` }}>{price}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Ranking + torneio */}
      <section style={{ borderTop: `3px solid ${ink}`, background: p.surface }}>
        <Wrap m={m} max={1240} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 7fr) minmax(0, 5fr)', gap: m ? 32 : 40, padding: m ? '48px 20px' : '96px 48px' }}>
          <div>
            <h2 style={{ fontFamily: mono, fontWeight: 800, fontSize: m ? 26 : 36, textTransform: 'uppercase' }}>Ranking semanal</h2>
            <div style={{ ...panel, background: p.bg, marginTop: 20 }}>
              {[
                ['NinaByte', 98420, '▲ 2'],
                ['zéDoPixel', 97115, '▼ 1'],
                ['Lua_Gamer', 95230, '▲ 4'],
                ['TurboCaju', 91008, '—'],
                ['koala.exe', 88760, '▲ 1'],
              ].map(([n, s, t], i) => (
                <div key={n as string} style={{ display: 'grid', gridTemplateColumns: m ? '40px 1fr auto' : '52px 44px 1fr 120px 60px', alignItems: 'center', gap: 12, padding: m ? '12px 12px' : '14px 18px', borderTop: i ? `2px dashed ${withAlpha(p.text, 0.18)}` : 'none', fontFamily: mono }}>
                  <span style={{ width: m ? 32 : 36, height: m ? 32 : 36, display: 'grid', placeItems: 'center', fontWeight: 800, border: `2px solid ${ink}`, background: i === 0 ? p.accent : i === 1 ? mix(p.text, p.bg, 0.4) : i === 2 ? mix(p.accent, '#a0522d', 0.5) : p.surface, color: i === 0 ? p.onAccent : i < 3 ? '#ffffff' : p.text }}>{i + 1}</span>
                  {!m && (
                    <svg width={36} height={36} viewBox="0 0 70 70" style={{ shapeRendering: 'crispEdges' }} aria-hidden="true">
                      <rect width={70} height={70} fill={[p.secondary, p.accent, mix(p.secondary, p.accent, 0.5), mix(p.text, p.bg, 0.5), p.secondary][i]} />
                      <Sprite rows={GHOST} colors={{ W: '#ffffff', K: '#1d1530' }} px={7} x={7} y={10} />
                    </svg>
                  )}
                  <span style={{ fontWeight: 700, fontSize: m ? 14 : 16 }}>{n as string}</span>
                  <span style={{ fontWeight: 800, fontSize: m ? 14 : 16, textAlign: 'right' }}>{(s as number).toLocaleString('pt-BR')}</span>
                  {!m && <span style={{ fontSize: 13, textAlign: 'right', color: String(t).startsWith('▲') ? '#3ccf72' : String(t).startsWith('▼') ? '#ff5a5a' : p.muted }}>{t as string}</span>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...panel, background: p.secondary, color: readable(p.secondary), padding: m ? 22 : 30, alignSelf: 'start' }}>
            <div style={{ fontFamily: mono, fontWeight: 800, fontSize: 13, letterSpacing: '0.1em' }}>TORNEIO DE INVERNO</div>
            <div style={{ fontFamily: mono, fontWeight: 800, fontSize: m ? 30 : 40, lineHeight: 1.05, marginTop: 12 }}>R$ 50 MIL EM PRÊMIOS</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
              {[
                ['03', 'DIAS'],
                ['14', 'HRS'],
                ['27', 'MIN'],
              ].map(([n, t]) => (
                <div key={t} style={{ flex: 1, background: ink, color: '#ffffff', textAlign: 'center', padding: '12px 0', border: `3px solid ${ink}` }}>
                  <div style={{ fontFamily: mono, fontWeight: 800, fontSize: m ? 24 : 30 }}>{n}</div>
                  <div style={{ fontFamily: mono, fontSize: 11, opacity: 0.7 }}>{t}</div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 18, fontSize: 15 }}>Equipes de 3 jogadores · Slime Rush · inscrições até sexta.</p>
            <span style={{ ...chunk(p.accent, p.onAccent), display: 'block', textAlign: 'center', padding: '14px 0', marginTop: 20, fontSize: 15 }}>INSCREVER EQUIPE</span>
          </div>
        </Wrap>
      </section>

      {/* Clã / newsletter */}
      <section style={{ borderTop: `3px solid ${ink}` }}>
        <Wrap m={m} max={900} style={{ textAlign: 'center', padding: m ? '56px 20px' : '104px 48px' }}>
          <svg width={m ? 84 : 112} height={m ? 72 : 96} viewBox="0 0 70 60" style={{ shapeRendering: 'crispEdges', display: 'block', margin: '0 auto' }} aria-hidden="true">
            <Sprite rows={HEART} colors={{ R: p.secondary }} px={10} />
          </svg>
          <h2 style={{ fontFamily: mono, fontWeight: 800, fontSize: m ? 30 : 48, textTransform: 'uppercase', marginTop: 20 }}>Entre no clã</h2>
          <p style={{ color: p.muted, marginTop: 10, fontSize: m ? 15 : 17 }}>Códigos secretos, jogos grátis antes de todo mundo e convites para testes.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexDirection: m ? 'column' : 'row', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            <span style={{ flex: 1, ...panel, boxShadow: 'none', padding: '14px 16px', textAlign: 'left', fontFamily: mono, color: p.muted, fontSize: 14 }}>seu@email.com_</span>
            <span style={{ ...chunk(p.accent, p.onAccent), padding: '14px 24px', fontSize: 15 }}>QUERO ENTRAR</span>
          </div>
        </Wrap>
      </section>

      <footer style={{ background: ink, color: '#f4f1ff' }}>
        <div aria-hidden="true" style={{ height: 12, background: `linear-gradient(135deg, ${p.bg} 25%, transparent 25%) -6px 0 / 12px 12px, linear-gradient(225deg, ${p.bg} 25%, transparent 25%) -6px 0 / 12px 12px` }} />
        <Wrap m={m} max={1240} style={{ display: 'flex', flexDirection: m ? 'column' : 'row', justifyContent: 'space-between', gap: 18, padding: m ? '28px 20px' : '40px 48px', fontFamily: mono, fontSize: 13 }}>
          <span style={{ fontWeight: 800 }}>PIXEL PLAY</span>
          <span style={{ display: 'flex', gap: 20, flexWrap: 'wrap', opacity: 0.8 }}>
            {['Sobre', 'Desenvolvedores', 'Suporte', 'Termos'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </span>
          <span style={{ opacity: 0.6, display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Icon name="gamepad" size={16} color="#f4f1ff" /> © 2026 — plataforma fictícia
          </span>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}

function readable(bg: string) {
  return isDark(bg) ? '#ffffff' : '#120d24'
}
