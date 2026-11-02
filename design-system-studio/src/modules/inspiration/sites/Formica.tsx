import { mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, Wrap, type SiteProps } from './kit'

/** Prancha científica: formiga operária em vista lateral, com partes numeradas. */
function AntPlate({ p, labels = true, body = 1, head = 1 }: { p: SitePalette; labels?: boolean; body?: number; head?: number }) {
  const ink = p.text
  const fill = mix(p.secondary, p.surface, 0.35)
  const shade = mix(p.secondary, p.text, 0.25)
  const sw = 2.2
  const parts: [number, number, number, number, string][] = [
    [60, 48, 70, 76, 'Antena'],
    [96, 210, 88, 186, 'Mandíbula'],
    [150, 112, 136, 140, 'Cabeça'],
    [236, 128, 232, 160, 'Mesossoma'],
    [300, 238, 294, 196, 'Pecíolo'],
    [430, 120, 400, 150, 'Gáster'],
  ]
  return (
    <svg viewBox="0 0 520 330" width="100%" aria-hidden="true" style={{ display: 'block' }}>
      <g stroke={ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Pernas do lado oposto */}
        <g opacity={0.35}>
          <path d="M210 190 L196 236 L168 280" />
          <path d="M238 194 L262 240 L254 292" />
          <path d="M262 192 L316 232 L360 276" />
        </g>
        {/* Gáster com hachuras */}
        <g transform={`translate(392 196) scale(${body}) rotate(-12)`}>
          <ellipse cx={0} cy={0} rx={82} ry={56} fill={fill} />
          <path d="M-40 -48 Q-58 0 -40 46 M-8 -56 Q-28 0 -8 56 M26 -52 Q8 0 26 52 M56 -38 Q44 0 56 38" stroke={shade} strokeWidth={1.4} />
          <path d="M-70 -20 Q-74 4 -66 26" stroke={withAlpha(p.surface, 0.9)} strokeWidth={5} />
        </g>
        {/* Pecíolo */}
        <ellipse cx={300} cy={192} rx={14} ry={16} fill={fill} />
        <ellipse cx={278} cy={186} rx={10} ry={12} fill={fill} />
        {/* Mesossoma */}
        <path d="M184 170 Q200 148 240 152 Q270 156 276 176 Q270 200 236 200 Q198 200 184 186 Z" fill={fill} />
        <path d="M206 160 Q230 170 262 166" stroke={shade} strokeWidth={1.4} />
        {/* Cabeça */}
        <g transform={`translate(134 164) scale(${head})`}>
          <ellipse cx={0} cy={0} rx={48} ry={40} fill={fill} />
          <ellipse cx={-14} cy={-10} rx={9} ry={7} fill={ink} />
          <path d="M-30 22 Q-10 34 20 26" stroke={shade} strokeWidth={1.4} />
          <path d="M-42 18 Q-70 26 -64 48 Q-56 36 -36 32" fill={fill} />
        </g>
        {/* Antenas cotoveladas */}
        <path d="M118 132 L96 84 L44 58" />
        <path d="M132 128 L128 72 L84 34" opacity={0.6} />
        {/* Pernas */}
        <path d="M198 192 L168 240 L132 290 L118 300" />
        <path d="M232 198 L240 252 L222 304 L214 316" />
        <path d="M258 194 L300 242 L344 296 L356 306" />
      </g>
      {labels &&
        parts.map(([x, y, tx, ty, label], i) => (
          <g key={label}>
            <path d={`M${x} ${y} L${tx} ${ty}`} stroke={p.accent} strokeWidth={1.2} />
            <circle cx={x} cy={y} r={11} fill={p.surface} stroke={p.accent} strokeWidth={1.4} />
            <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontFamily={ff('jetbrains-mono')} fill={p.accent} fontWeight={600}>
              {i + 1}
            </text>
          </g>
        ))}
      {labels && (
        <g fontFamily={ff('jetbrains-mono')} fontSize={10.5} fill={p.muted}>
          <path d="M380 304 L480 304 M380 298 L380 310 M480 298 L480 310" stroke={ink} strokeWidth={1.4} />
          <text x={430} y={324} textAnchor="middle">5 mm</text>
        </g>
      )}
    </svg>
  )
}

/** Corte transversal do formigueiro. */
function NestSection({ p, m }: { p: SitePalette; m: boolean }) {
  const soil = [mix(p.secondary, p.text, 0.15), mix(p.secondary, p.text, 0.28), mix(p.secondary, p.text, 0.4)]
  const cavity = mix(p.bg, p.secondary, 0.15)
  const chambers: [number, number, number, number, string][] = [
    [190, 150, 64, 26, 'Depósito de folhas'],
    [470, 205, 96, 36, 'Jardim de fungos'],
    [770, 165, 70, 28, 'Berçário'],
    [600, 320, 72, 28, 'Câmara real'],
    [270, 305, 60, 24, 'Descarte'],
  ]
  return (
    <svg viewBox="0 0 1000 380" width="100%" aria-hidden="true" style={{ display: 'block' }}>
      <rect x={0} y={0} width={1000} height={66} fill={p.bg} />
      <rect x={0} y={66} width={1000} height={110} fill={soil[0]} />
      <rect x={0} y={176} width={1000} height={110} fill={soil[1]} />
      <rect x={0} y={286} width={1000} height={94} fill={soil[2]} />
      {Array.from({ length: 70 }, (_, i) => (
        <circle key={i} cx={(i * 137) % 1000} cy={80 + ((i * 53) % 290)} r={1.5 + (i % 3)} fill={withAlpha(p.text, 0.18)} />
      ))}
      <path d="M440 66 Q470 40 500 40 Q530 40 560 66 Z" fill={soil[0]} />
      {[60, 140, 330, 650, 880, 950].map((x) => (
        <path key={x} d={`M${x} 66 l-6 -18 M${x} 66 l2 -22 M${x} 66 l8 -16`} stroke={p.accent} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
      ))}
      <g stroke={cavity} strokeWidth={m ? 14 : 11} fill="none" strokeLinecap="round">
        <path d="M500 50 Q490 110 470 170" />
        <path d="M480 120 Q330 110 230 140" />
        <path d="M490 120 Q640 120 720 155" />
        <path d="M470 240 Q520 290 560 310" />
        <path d="M430 230 Q340 270 300 295" />
        <path d="M800 190 Q830 260 680 320" />
      </g>
      {chambers.map(([x, y, rx, ry, label], i) => (
        <g key={label}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={cavity} />
          {i === 1 && Array.from({ length: 26 }, (_, k) => <circle key={k} cx={x - 70 + ((k * 23) % 140)} cy={y - 14 + ((k * 7) % 28)} r={4} fill={mix(p.surface, '#ffffff', 0.4)} opacity={0.9} />)}
          {i === 3 && <ellipse cx={x} cy={y + 4} rx={22} ry={9} fill={p.accent} />}
          {i === 2 && [0, 1, 2, 3].map((k) => <ellipse key={k} cx={x - 30 + k * 20} cy={y + 6} rx={6} ry={9} fill={p.surface} />)}
          {!m && (
            <text x={x} y={y - ry - 10} textAnchor="middle" fontSize={13} fontFamily={ff('jetbrains-mono')} fill={p.bg} fontWeight={600}>
              {label}
            </text>
          )}
        </g>
      ))}
      <g fontFamily={ff('jetbrains-mono')} fontSize={m ? 18 : 12} fill={withAlpha(p.bg, 0.85)}>
        <text x={16} y={96}>−0,5 m</text>
        <text x={16} y={206}>−3 m</text>
        <text x={16} y={316}>−8 m</text>
      </g>
    </svg>
  )
}

export default function Formica({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const serif = ff('georgia')
  const mono = ff('jetbrains-mono')
  const line = hair(p, 0.2)
  const label = { fontFamily: mono, fontSize: m ? 11 : 12, letterSpacing: '0.08em', color: p.muted, textTransform: 'uppercase' as const }
  return (
    <SiteRoot p={p} font={serif} name="FORMICA">
      {/* Masthead de revista científica */}
      <header>
        <Wrap m={m} max={1240}>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...label, padding: '14px 0', borderBottom: `1px solid ${line}` }}>
            <span>Vol. 12 · Nº 4 · Out. 2026</span>
            {m ? <Burger color={p.text} size={20} /> : <span>Assinar · Entrar</span>}
          </div>
          <div style={{ textAlign: 'center', padding: m ? '20px 0 14px' : '34px 0 22px' }}>
            <div style={{ fontSize: m ? 46 : 110, letterSpacing: '0.18em', lineHeight: 1, paddingLeft: '0.18em', fontWeight: 400 }}>FORMICA</div>
            <div style={{ fontStyle: 'italic', color: p.muted, marginTop: m ? 8 : 14, fontSize: m ? 14 : 18 }}>Revista de campo sobre formigas, colônias e a ciência do coletivo</div>
          </div>
          <div style={{ borderTop: `3px double ${p.text}`, borderBottom: `1px solid ${line}` }}>
            {!m && (
              <nav style={{ display: 'flex', justifyContent: 'center', gap: 44, padding: '12px 0', fontFamily: mono, fontSize: 12.5, letterSpacing: '0.14em' }}>
                {['EXPEDIÇÕES', 'ESPÉCIMES', 'LABORATÓRIO', 'DOCUMENTÁRIOS', 'ARQUIVO'].map((t, i) => (
                  <span key={t} style={{ color: i === 0 ? p.accent : p.text }}>
                    {t}
                  </span>
                ))}
              </nav>
            )}
          </div>
        </Wrap>
      </header>

      {/* Reportagem de capa com prancha */}
      <section>
        <Wrap m={m} max={1240} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 5fr) minmax(0, 7fr)', gap: m ? 24 : 56, padding: m ? '28px 20px 44px' : '64px 48px 88px', alignItems: 'center' }}>
          <div style={{ order: m ? 2 : 1 }}>
            <div style={{ ...label, color: p.accent }}>Reportagem de capa</div>
            <h1 style={{ fontSize: m ? 38 : 64, lineHeight: 1.02, letterSpacing: '-0.02em', marginTop: 14, fontWeight: 400 }}>
              A sociedade <em>sob nossos pés</em>
            </h1>
            <p style={{ fontSize: m ? 16 : 19, lineHeight: 1.6, marginTop: 18, color: mix(p.text, p.bg, 0.15) }}>
              Durante dezoito meses, uma equipe acompanhou uma colônia de saúvas no cerrado mineiro. O que encontraram foi uma cidade com agricultura, coleta de lixo e uma rainha de quinze anos.
            </p>
            <div style={{ ...label, marginTop: 20, textTransform: 'none', letterSpacing: 0 }}>Texto de Helena Moraes · Ilustrações de Caio Brandt · 24 min de leitura</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 26, background: p.text, color: p.bg, padding: '14px 22px', fontFamily: mono, fontSize: 13, letterSpacing: '0.1em' }}>
              LER REPORTAGEM <Icon name="arrow" size={16} />
            </span>
          </div>
          <figure style={{ order: m ? 1 : 2, border: `1px solid ${p.text}`, background: p.surface, padding: m ? 12 : 22, position: 'relative' }}>
            <div
              style={{
                backgroundImage: `linear-gradient(${withAlpha(p.text, 0.06)} 1px, transparent 1px), linear-gradient(90deg, ${withAlpha(p.text, 0.06)} 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
                padding: m ? '16px 4px 8px' : '28px 16px 12px',
                border: `1px solid ${line}`,
              }}
            >
              <AntPlate p={p} />
            </div>
            <figcaption style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
              <span style={{ fontStyle: 'italic', fontSize: m ? 13.5 : 15 }}>
                Prancha I — <em>Atta laevigata</em>, operária média
              </span>
              <span style={{ ...label, fontSize: 11 }}>1 Antena · 2 Mandíbula · 3 Cabeça · 4 Mesossoma · 5 Pecíolo · 6 Gáster</span>
            </figcaption>
          </figure>
        </Wrap>
      </section>

      {/* Caderno de campo: linha do tempo */}
      <section style={{ borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}`, background: p.surface }}>
        <Wrap m={m} max={1240} style={{ padding: m ? '40px 20px' : '72px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 400 }}>Caderno de campo</h2>
            <span style={label}>Expedição 2025–2026</span>
          </div>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(4, minmax(0, 1fr))', gap: m ? 0 : 28, marginTop: m ? 24 : 44 }}>
            {!m && <div style={{ position: 'absolute', left: 0, right: 0, top: 7, height: 1, background: p.text }} />}
            {m && <div style={{ position: 'absolute', left: 7, top: 6, bottom: 6, width: 1, background: p.text }} />}
            {[
              ['12.03.2025', 'Serra do Cipó, MG', '19°15′S 43°33′W', 'Primeira marcação da colônia: 214 olheiros ativos.'],
              ['30.06.2025', 'Seca no cerrado', '19°15′S 43°33′W', 'Operárias passam a cortar 40% mais folhas secas.'],
              ['18.11.2025', 'Revoada nupcial', '19°16′S 43°34′W', 'Mais de 3 mil rainhas aladas deixam o ninho em 2 horas.'],
              ['04.04.2026', 'Escavação controlada', '19°15′S 43°33′W', 'Molde em gesso revela 8 metros de profundidade.'],
            ].map(([d, place, coord, note], i) => (
              <div key={d} style={{ position: 'relative', paddingLeft: m ? 32 : 0, paddingBottom: m ? 24 : 0 }}>
                <span style={{ position: m ? 'absolute' : 'relative', left: 0, top: 0, display: 'block', width: 15, height: 15, borderRadius: '50%', background: i === 3 ? p.accent : p.surface, border: `2px solid ${i === 3 ? p.accent : p.text}` }} />
                <div style={{ fontFamily: mono, fontSize: 12.5, marginTop: m ? 0 : 18, color: p.accent }}>{d}</div>
                <h3 style={{ fontSize: m ? 19 : 22, fontWeight: 400, marginTop: 6 }}>{place}</h3>
                <div style={{ ...label, fontSize: 11, marginTop: 4 }}>{coord}</div>
                <p style={{ fontSize: m ? 14.5 : 15.5, marginTop: 8, color: mix(p.text, p.bg, 0.15), lineHeight: 1.55 }}>{note}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Laboratório: corte do ninho + números */}
      <section>
        <Wrap m={m} max={1240} style={{ padding: m ? '44px 20px' : '88px 48px' }}>
          <div style={label}>Laboratório · Figura 2</div>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 400, marginTop: 10, maxWidth: 760 }}>Anatomia de uma cidade subterrânea</h2>
          <div style={{ marginTop: m ? 20 : 36, border: `1px solid ${p.text}` }}>
            <NestSection p={p} m={m} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', marginTop: 0, borderLeft: m ? 'none' : `1px solid ${line}` }}>
            {[
              ['8 m', 'de profundidade na câmara mais funda'],
              ['3.000', 'câmaras conectadas por túneis'],
              ['5 milhões', 'de operárias em uma única colônia'],
            ].map(([n, t]) => (
              <div key={t} style={{ padding: m ? '18px 0' : '28px 28px', borderRight: m ? 'none' : `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
                <div style={{ fontSize: m ? 34 : 48, lineHeight: 1 }}>{n}</div>
                <div style={{ ...label, textTransform: 'none', letterSpacing: 0, fontSize: 13, marginTop: 8 }}>{t}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Catálogo de espécimes + infográfico */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1240} style={{ padding: m ? '44px 20px' : '88px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 400 }}>Espécimes do acervo</h2>
            <span style={{ fontFamily: mono, fontSize: 13, color: p.accent }}>Ver 1.240 registros →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 14 : 24, marginTop: m ? 20 : 36 }}>
            {[
              ['FRM-0231', 'Atta laevigata', 'Saúva-cabeça-de-vidro', '12 mm', 'Cerrado', 1, 1.25],
              ['FRM-0587', 'Camponotus rufipes', 'Formiga-de-pau', '9 mm', 'Mata Atlântica', 0.85, 0.95],
              ['FRM-1102', 'Odontomachus bauri', 'Formiga-mandíbula-armadilha', '11 mm', 'Floresta úmida', 0.9, 0.9],
            ].map(([code, latin, common, size, hab, body, head]) => (
              <article key={code as string} style={{ background: p.bg, border: `1px solid ${p.text}` }}>
                <div style={{ padding: m ? '14px 20px 6px' : '20px 28px 8px', borderBottom: `1px solid ${line}` }}>
                  <AntPlate p={p} labels={false} body={body as number} head={head as number} />
                </div>
                <div style={{ padding: m ? 16 : 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', ...label, fontSize: 11 }}>
                    <span>{code}</span>
                    <span>{size}</span>
                  </div>
                  <h3 style={{ fontStyle: 'italic', fontSize: m ? 20 : 22, fontWeight: 400, marginTop: 8 }}>{latin}</h3>
                  <div style={{ fontSize: 14.5, color: p.muted, marginTop: 2 }}>
                    {common} · {hab}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 4fr) minmax(0, 8fr)', gap: m ? 18 : 56, marginTop: m ? 40 : 72, paddingTop: m ? 28 : 40, borderTop: `1px solid ${line}` }}>
            <div>
              <div style={label}>Infográfico · Figura 3</div>
              <h3 style={{ fontSize: m ? 24 : 30, fontWeight: 400, marginTop: 10 }}>Quem faz o quê na colônia</h3>
              <p style={{ color: p.muted, fontSize: 15, marginTop: 10 }}>Distribuição das castas em uma colônia adulta de saúvas, segundo contagem por amostragem.</p>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                ['Jardineiras (mínimas)', 52],
                ['Cortadeiras (médias)', 31],
                ['Carregadeiras', 12],
                ['Soldados', 5],
              ].map(([t, v]) => (
                <div key={t as string} style={{ display: 'grid', gridTemplateColumns: m ? '1fr 44px' : '200px 1fr 48px', gap: m ? 6 : 16, alignItems: 'center' }}>
                  <span style={{ fontSize: 14.5, gridColumn: m ? '1 / -1' : 'auto' }}>{t}</span>
                  <span style={{ height: 14, background: withAlpha(p.text, 0.08), position: 'relative' }}>
                    <span style={{ position: 'absolute', inset: 0, width: `${v}%`, background: `repeating-linear-gradient(45deg, ${p.accent} 0 3px, ${mix(p.accent, p.bg, 0.35)} 3px 6px)` }} />
                  </span>
                  <span style={{ fontFamily: mono, fontSize: 13, textAlign: 'right' }}>{v}%</span>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* Documentário */}
      <section style={{ background: mix(p.text, '#000000', 0.2), color: mix(p.bg, '#ffffff', 0.3) }}>
        <Wrap m={m} max={1240} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 7fr) minmax(0, 5fr)', gap: m ? 24 : 48, padding: m ? '44px 20px' : '88px 48px', alignItems: 'center' }}>
          <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', background: `linear-gradient(180deg, #2b3a2a 0%, #1a2419 55%, #3a2c1d 56%, #24190f 100%)` }}>
            <svg viewBox="0 0 640 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
              {[60, 160, 270, 420, 520, 600].map((x, i) => (
                <path key={x} d={`M${x} 200 Q${x - 20} ${120 - i * 6} ${x + 10} ${40 + i * 10}`} stroke="#4f6b3a" strokeWidth={14 + (i % 3) * 6} fill="none" opacity={0.7} />
              ))}
              <path d="M0 260 Q160 230 320 262 T640 250" stroke={withAlpha(p.secondary, 0.9)} strokeWidth={3} strokeDasharray="2 10" fill="none" strokeLinecap="round" />
              {Array.from({ length: 16 }, (_, i) => (
                <ellipse key={i} cx={20 + i * 40} cy={258 - Math.sin(i / 2) * 10} rx={5} ry={2.5} fill="#1a120a" />
              ))}
            </svg>
            <span style={{ position: 'absolute', left: '50%', top: '50%', width: m ? 64 : 84, height: m ? 64 : 84, transform: 'translate(-50%, -50%)', borderRadius: '50%', background: p.accent, display: 'grid', placeItems: 'center', boxShadow: '0 0 0 10px rgba(255,255,255,.12)' }}>
              <Icon name="play" size={m ? 26 : 32} color={p.onAccent} fill={p.onAccent} />
            </span>
            <span style={{ position: 'absolute', left: 16, bottom: 14, fontFamily: mono, fontSize: 12, color: '#fff', background: 'rgba(0,0,0,.5)', padding: '4px 8px' }}>52:10</span>
          </div>
          <div>
            <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '0.1em', opacity: 0.7 }}>DOCUMENTÁRIO ORIGINAL</div>
            <h2 style={{ fontSize: m ? 30 : 44, fontWeight: 400, marginTop: 12, lineHeight: 1.08 }}>Um milhão de operárias</h2>
            <p style={{ marginTop: 14, opacity: 0.75, fontSize: m ? 15 : 16.5 }}>Câmeras macro dentro do formigueiro registram, pela primeira vez, um dia inteiro de trabalho no jardim de fungos.</p>
            <ol style={{ marginTop: 22, display: 'grid', gap: 0 }}>
              {['Ep. 1 — A rainha', 'Ep. 2 — O jardim', 'Ep. 3 — A revoada'].map((t, i) => (
                <li key={t} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: `1px solid ${withAlpha(p.bg, 0.2)}`, fontSize: 15 }}>
                  <span>{t}</span>
                  <span style={{ fontFamily: mono, fontSize: 12.5, opacity: 0.7 }}>{['48 min', '52 min', '45 min'][i]}</span>
                </li>
              ))}
            </ol>
          </div>
        </Wrap>
      </section>

      {/* Newsletter + footer com referências */}
      <footer>
        <Wrap m={m} max={1240} style={{ padding: m ? '40px 20px 24px' : '72px 48px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: m ? 24 : 56, paddingBottom: 32, borderBottom: `3px double ${p.text}` }}>
            <div>
              <h2 style={{ fontSize: m ? 26 : 34, fontWeight: 400 }}>Cadernos de campo, toda quinzena</h2>
              <p style={{ color: p.muted, marginTop: 8 }}>Notas de expedição, pranchas inéditas e o espécime da semana.</p>
            </div>
            <div style={{ display: 'flex', alignSelf: 'end', border: `1px solid ${p.text}` }}>
              <span style={{ flex: 1, padding: '14px 16px', color: p.muted, fontFamily: mono, fontSize: 13 }}>seu@email.com</span>
              <span style={{ background: p.text, color: p.bg, padding: '14px 18px', fontFamily: mono, fontSize: 13 }}>ASSINAR</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 2fr)', gap: 24, paddingTop: 24 }}>
            <div style={{ fontSize: 28, letterSpacing: '0.18em' }}>FORMICA</div>
            <div style={{ ...label, textTransform: 'none', letterSpacing: 0, fontSize: 12, lineHeight: 1.7 }}>
              Referências desta edição: Moraes, H. (2026). Agricultura subterrânea no cerrado. Cadernos Formica, 12(4), 33–58. · Brandt, C. (2026). Pranchas de campo, série I. © 2026 Formica — publicação fictícia.
            </div>
          </div>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
