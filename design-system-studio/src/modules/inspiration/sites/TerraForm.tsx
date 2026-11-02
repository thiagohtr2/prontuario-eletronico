import { mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, Wrap, type SiteProps } from './kit'

const C30 = Math.cos(Math.PI / 6)
const iso = (x: number, y: number, z: number) => [(x - y) * C30, (x + y) * 0.5 - z]

function Block({ x, y, z, w, d, h, top, left, right }: { x: number; y: number; z: number; w: number; d: number; h: number; top: string; left: string; right: string }) {
  const pt = (a: number, b: number, c: number) => iso(a, b, c).join(',')
  return (
    <g>
      <polygon points={[pt(x, y + d, z), pt(x + w, y + d, z), pt(x + w, y + d, z + h), pt(x, y + d, z + h)].join(' ')} fill={left} />
      <polygon points={[pt(x + w, y, z), pt(x + w, y + d, z), pt(x + w, y + d, z + h), pt(x + w, y, z + h)].join(' ')} fill={right} />
      <polygon points={[pt(x, y, z + h), pt(x + w, y, z + h), pt(x + w, y + d, z + h), pt(x, y + d, z + h)].join(' ')} fill={top} />
    </g>
  )
}

/** Axonometria de uma casa em patamares sobre o terreno. */
function Axonometric({ p }: { p: SitePalette }) {
  const top = mix(p.surface, '#ffffff', 0.3)
  const left = mix(p.secondary, p.bg, 0.25)
  const right = mix(p.secondary, p.text, 0.22)
  const glass = mix(p.text, p.secondary, 0.25)
  const ground = mix(p.bg, p.secondary, 0.25)
  const line = withAlpha(p.text, 0.18)
  return (
    <svg viewBox="-560 -150 1120 560" width="100%" aria-hidden="true" style={{ display: 'block' }}>
      {/* Terreno com curvas de nível */}
      <polygon points={[iso(-60, -60, 0), iso(560, -60, 0), iso(560, 460, 0), iso(-60, 460, 0)].map((q) => q.join(',')).join(' ')} fill={ground} />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <path
          key={k}
          d={`M${iso(-60, k * 80 - 20, 0).join(',')} Q ${iso(250, k * 80 + 30, 0).join(',')} ${iso(560, k * 80 - 40, 0).join(',')}`}
          stroke={line}
          strokeWidth={1.2}
          fill="none"
        />
      ))}
      {/* Volumes em patamares */}
      <Block x={0} y={60} z={0} w={300} d={170} h={60} top={top} left={left} right={right} />
      <Block x={120} y={60} z={60} w={260} d={120} h={70} top={top} left={left} right={right} />
      <Block x={40} y={240} z={0} w={140} d={140} h={36} top={top} left={left} right={right} />
      {/* Janelas em fita */}
      <polygon points={[iso(130, 180, 78), iso(380, 180, 78), iso(380, 180, 112), iso(130, 180, 112)].map((q) => q.join(',')).join(' ')} fill={glass} />
      <polygon points={[iso(20, 230, 14), iso(280, 230, 14), iso(280, 230, 44), iso(20, 230, 44)].map((q) => q.join(',')).join(' ')} fill={glass} />
      <polygon points={[iso(380, 70, 80), iso(380, 170, 80), iso(380, 170, 112), iso(380, 70, 112)].map((q) => q.join(',')).join(' ')} fill={mix(glass, p.text, 0.3)} />
      {/* Brises */}
      {Array.from({ length: 10 }, (_, i) => {
        const x = 140 + i * 24
        return <polygon key={i} points={[iso(x, 182, 70), iso(x + 6, 182, 70), iso(x + 6, 182, 128), iso(x, 182, 128)].map((q) => q.join(',')).join(' ')} fill={right} />
      })}
      {/* Árvores e escala humana */}
      {[
        [470, 120],
        [430, 330],
        [-10, 380],
      ].map(([x, y], i) => {
        const [sx, sy] = iso(x, y, 0)
        return (
          <g key={i}>
            <path d={`M${sx} ${sy} L${sx} ${sy - 40}`} stroke={mix(p.text, p.secondary, 0.4)} strokeWidth={3} />
            <circle cx={sx} cy={sy - 58} r={26} fill={withAlpha(p.text, 0.12)} stroke={withAlpha(p.text, 0.35)} />
          </g>
        )
      })}
      {(() => {
        const [sx, sy] = iso(330, 300, 0)
        return (
          <g>
            <rect x={sx - 3} y={sy - 26} width={6} height={20} rx={3} fill={p.accent} />
            <circle cx={sx} cy={sy - 31} r={4} fill={p.accent} />
          </g>
        )
      })()}
      {/* Cotas */}
      <g stroke={p.text} strokeWidth={1} fill={p.text} fontSize={13} fontFamily={ff('jetbrains-mono')}>
        <path d={`M${iso(0, 400, 0).join(',')} L${iso(300, 400, 0).join(',')}`} />
        <text x={iso(150, 420, 0)[0]} y={iso(150, 420, 0)[1] + 8} textAnchor="middle" stroke="none">
          18,40 m
        </text>
      </g>
    </svg>
  )
}

/** Fachada em concreto com janelas recuadas e brises verticais (arte em CSS). */
function Facade({ p, m }: { p: SitePalette; m: boolean }) {
  const concrete = mix(p.secondary, p.bg, 0.2)
  return (
    <div
      style={{
        position: 'relative',
        height: m ? 300 : 620,
        background: `linear-gradient(180deg, ${mix(p.bg, p.secondary, 0.15)} 0 18%, ${concrete} 18% 100%)`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: '8%', right: '8%', top: '18%', bottom: 0, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: m ? 6 : 14, padding: m ? 8 : 18 }}>
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            style={{
              background: i === 9 ? `linear-gradient(180deg, ${mix(p.accent, '#000000', 0.2)}, ${p.accent})` : `linear-gradient(180deg, ${mix(p.text, p.secondary, 0.1)}, ${mix(p.text, p.secondary, 0.35)})`,
              boxShadow: `inset 0 ${m ? 4 : 10}px 0 ${withAlpha('#000000', 0.25)}`,
            }}
          />
        ))}
      </div>
      <div style={{ position: 'absolute', left: '8%', right: '8%', top: '18%', bottom: 0, display: 'flex', justifyContent: 'space-between' }}>
        {Array.from({ length: 13 }, (_, i) => (
          <span key={i} style={{ width: m ? 3 : 6, background: mix(concrete, '#ffffff', 0.25), boxShadow: `${m ? 2 : 4}px 0 0 ${withAlpha('#000000', 0.15)}` }} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: m ? 10 : 18, background: mix(p.text, p.secondary, 0.3) }} />
    </div>
  )
}

const PROJECTS = [
  ['01', 'Casa Declive', 'Cunha, SP', 'Residencial', '2025', '420 m²'],
  ['02', 'Pavilhão Aterro', 'Lisboa, PT', 'Cultural', '2024', '1.240 m²'],
  ['03', 'Escola Várzea', 'Campinas, SP', 'Educação', '2023', '3.800 m²'],
  ['04', 'Refúgio Pedra', 'Serra da Canastra, MG', 'Residencial', '2022', '180 m²'],
  ['05', 'Mercado Norte', 'Belém, PA', 'Comercial', '2021', '6.100 m²'],
]

export default function TerraForm({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const sans = ff('inter')
  const mono = ff('jetbrains-mono')
  const line = hair(p, 0.16)
  const cols = m ? 4 : 12
  const gridLines = (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, padding: m ? '0 20px' : '0 48px', pointerEvents: 'none' }}>
      {Array.from({ length: cols }, (_, i) => (
        <span key={i} style={{ borderLeft: `1px solid ${withAlpha(p.text, 0.06)}`, borderRight: i === cols - 1 ? `1px solid ${withAlpha(p.text, 0.06)}` : 'none' }} />
      ))}
    </div>
  )
  return (
    <SiteRoot p={p} font={sans} name="TERRA / FORM">
      <div style={{ position: 'relative' }}>
        {gridLines}
        {/* Header suíço */}
        <header style={{ position: 'relative', borderBottom: `1px solid ${p.text}` }}>
          <Wrap m={m} max={1440} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: m ? 60 : 72 }}>
            <span style={{ fontWeight: 800, letterSpacing: '-0.04em', fontSize: m ? 20 : 24 }}>
              TERRA<span style={{ color: p.accent }}>/</span>FORM
            </span>
            {m ? (
              <Burger color={p.text} />
            ) : (
              <nav style={{ display: 'flex', gap: 40, fontSize: 14, fontWeight: 500 }}>
                {['Projetos', 'Estúdio', 'Processo', 'Contato'].map((t, i) => (
                  <span key={t}>
                    <span style={{ fontFamily: mono, fontSize: 11, color: p.muted, marginRight: 6, verticalAlign: 'super' }}>0{i + 1}</span>
                    {t}
                  </span>
                ))}
                <span style={{ color: p.muted }}>PT / EN</span>
              </nav>
            )}
          </Wrap>
        </header>

        {/* Hero tipográfico em grade de 12 colunas */}
        <section style={{ position: 'relative' }}>
          <Wrap m={m} max={1440} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(12, minmax(0, 1fr))', padding: m ? '40px 20px 32px' : '96px 48px 64px', alignItems: 'end', columnGap: 0 }}>
            <h1 style={{ gridColumn: m ? 'auto' : '1 / span 9', fontWeight: 600, fontSize: m ? 52 : 132, letterSpacing: '-0.055em', lineHeight: 0.9 }}>
              Arquitetura que respeita o terreno<span style={{ color: p.accent }}>.</span>
            </h1>
            <div style={{ gridColumn: m ? 'auto' : '10 / span 3', paddingLeft: m ? 0 : 20, marginTop: m ? 24 : 0, fontSize: m ? 15 : 16 }}>
              <p>Estúdio de arquitetura e paisagem. São Paulo — Lisboa. Desde 2009.</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, fontWeight: 600 }}>
                Ver projetos <Icon name="arrow" size={18} style={{ transform: 'rotate(90deg)' }} />
              </span>
            </div>
          </Wrap>
        </section>
      </div>

      {/* Axonometria em faixa larga */}
      <section style={{ borderTop: `1px solid ${p.text}`, borderBottom: `1px solid ${p.text}`, background: p.surface }}>
        <div style={{ padding: m ? '24px 8px 8px' : '56px 48px 24px', maxWidth: 1440, margin: '0 auto' }}>
          <Axonometric p={p} />
        </div>
        <Wrap m={m} max={1440} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: m ? '12px 20px 18px' : '16px 48px 24px', fontFamily: mono, fontSize: 12, color: p.muted }}>
          <span>FIG. 01 — CASA DECLIVE, CUNHA SP — 2025</span>
          <span>23°04′S 44°57′W · COTA 1.120 m</span>
        </Wrap>
      </section>

      {/* Índice de projetos */}
      <section>
        <Wrap m={m} max={1440} style={{ padding: m ? '48px 20px' : '104px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${p.text}`, paddingBottom: 14 }}>
            <h2 style={{ fontWeight: 600, fontSize: m ? 26 : 40, letterSpacing: '-0.04em' }}>Índice</h2>
            <span style={{ fontFamily: mono, fontSize: 12, color: p.muted }}>37 PROJETOS · 2009–2026</span>
          </div>
          {!m && (
            <div style={{ display: 'grid', gridTemplateColumns: '60px 2.4fr 1.6fr 1.2fr 80px 100px', fontFamily: mono, fontSize: 11.5, color: p.muted, padding: '14px 0', borderBottom: `1px solid ${line}` }}>
              <span>Nº</span>
              <span>PROJETO</span>
              <span>LOCAL</span>
              <span>TIPOLOGIA</span>
              <span>ANO</span>
              <span style={{ textAlign: 'right' }}>ÁREA</span>
            </div>
          )}
          {PROJECTS.map(([n, name, place, type, year, area], i) =>
            m ? (
              <div key={n} style={{ padding: '16px 0', borderBottom: `1px solid ${line}`, display: 'flex', gap: 14 }}>
                <span style={{ fontFamily: mono, fontSize: 12, color: p.muted, paddingTop: 5 }}>{n}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', color: i === 1 ? p.accent : p.text }}>{name}</div>
                  <div style={{ fontSize: 13.5, color: p.muted, marginTop: 2 }}>
                    {place} · {type} · {year}
                  </div>
                </div>
              </div>
            ) : (
              <div key={n} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '60px 2.4fr 1.6fr 1.2fr 80px 100px', alignItems: 'center', padding: '20px 0', borderBottom: `1px solid ${line}`, background: i === 1 ? withAlpha(p.text, 0.04) : 'transparent' }}>
                <span style={{ fontFamily: mono, fontSize: 12.5, color: p.muted }}>{n}</span>
                <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.035em', color: i === 1 ? p.accent : p.text }}>{name}</span>
                <span style={{ fontSize: 15 }}>{place}</span>
                <span style={{ fontSize: 15, color: p.muted }}>{type}</span>
                <span style={{ fontFamily: mono, fontSize: 13 }}>{year}</span>
                <span style={{ fontFamily: mono, fontSize: 13, textAlign: 'right' }}>{area}</span>
                {i === 1 && (
                  <div style={{ position: 'absolute', right: 160, top: -40, width: 200, height: 130, border: `1px solid ${p.text}`, background: p.surface, overflow: 'hidden' }}>
                    <Facade p={p} m />
                  </div>
                )}
              </div>
            ),
          )}
        </Wrap>
      </section>

      {/* Projeto em destaque */}
      <section style={{ borderTop: `1px solid ${p.text}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 7fr) minmax(0, 5fr)', maxWidth: 1440, margin: '0 auto' }}>
          <Facade p={p} m={m} />
          <div style={{ padding: m ? '32px 20px 48px' : '64px 48px', borderLeft: m ? 'none' : `1px solid ${p.text}`, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: mono, fontSize: 12, color: p.accent }}>PROJETO EM DESTAQUE — 02</span>
            <h2 style={{ fontWeight: 600, fontSize: m ? 34 : 56, letterSpacing: '-0.045em', lineHeight: 0.98, marginTop: 14 }}>Pavilhão Aterro</h2>
            <p style={{ marginTop: 18, fontSize: m ? 15 : 17, lineHeight: 1.6, color: mix(p.text, p.bg, 0.15) }}>
              Um antigo aterro à beira do Tejo virou praça coberta. A estrutura em concreto aparente e os brises de madeira filtram o sol da tarde e deixam o vento do rio atravessar.
            </p>
            <dl style={{ marginTop: 'auto', paddingTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: 14 }}>
              {[
                ['Área', '1.240 m²'],
                ['Status', 'Concluído'],
                ['Cliente', 'Câmara Municipal'],
                ['Prêmio', 'Bienal 2025'],
              ].map(([k, v]) => (
                <div key={k} style={{ borderTop: `1px solid ${line}`, padding: '12px 0' }}>
                  <dt style={{ fontFamily: mono, fontSize: 11, color: p.muted }}>{k.toUpperCase()}</dt>
                  <dd style={{ fontWeight: 600, marginTop: 2 }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Processo */}
      <section style={{ borderTop: `1px solid ${p.text}`, background: p.surface }}>
        <Wrap m={m} max={1440} style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', padding: m ? '40px 20px' : '88px 48px', gap: m ? '28px 16px' : 0 }}>
          {[
            ['Escuta', 'Antes do desenho, semanas de conversa sobre rotina, clima e orçamento.'],
            ['Terreno', 'Levantamento topográfico, insolação e vegetação existente.'],
            ['Desenho', 'Maquetes físicas e modelos 3D até cada vão ter um motivo.'],
            ['Obra', 'Acompanhamento semanal com a construtora até a entrega.'],
          ].map(([t, d], i) => (
            <div key={t} style={{ paddingRight: m ? 0 : 32, paddingLeft: m ? 0 : i ? 24 : 0, borderLeft: !m && i ? `1px solid ${line}` : 'none' }}>
              <div style={{ fontWeight: 700, fontSize: m ? 56 : 104, letterSpacing: '-0.06em', lineHeight: 0.85, color: 'transparent', WebkitTextStroke: `1.4px ${p.text}` }}>0{i + 1}</div>
              <h3 style={{ fontWeight: 600, fontSize: m ? 19 : 24, marginTop: 18, letterSpacing: '-0.02em' }}>{t}</h3>
              <p style={{ color: p.muted, fontSize: m ? 13.5 : 15, marginTop: 6 }}>{d}</p>
            </div>
          ))}
        </Wrap>
      </section>

      {/* Prêmios e publicações */}
      <section style={{ borderTop: `1px solid ${p.text}` }}>
        <Wrap m={m} max={1440} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(12, minmax(0, 1fr))', padding: m ? '40px 20px' : '88px 48px' }}>
          <h2 style={{ gridColumn: m ? 'auto' : '1 / span 4', fontWeight: 600, fontSize: m ? 26 : 40, letterSpacing: '-0.04em', marginBottom: m ? 16 : 0 }}>Prêmios e publicações</h2>
          <ul style={{ gridColumn: m ? 'auto' : '6 / span 7' }}>
            {[
              ['2025', 'Bienal Ibero-Americana — Pavilhão Aterro', 'Prêmio'],
              ['2024', 'Revista Planta Baixa, nº 88 — Casa Declive', 'Capa'],
              ['2023', 'Prêmio Arquitetura Escolar — Escola Várzea', 'Menção'],
              ['2021', 'Exposição “Chão Comum”, Porto', 'Mostra'],
            ].map(([y, t, k]) => (
              <li key={t} style={{ display: 'grid', gridTemplateColumns: m ? '48px 1fr' : '72px 1fr 90px', gap: 12, padding: '16px 0', borderTop: `1px solid ${line}`, fontSize: m ? 14.5 : 16 }}>
                <span style={{ fontFamily: mono, fontSize: 13, color: p.muted }}>{y}</span>
                <span>{t}</span>
                {!m && <span style={{ fontFamily: mono, fontSize: 12, color: p.muted, textAlign: 'right' }}>{k.toUpperCase()}</span>}
              </li>
            ))}
          </ul>
        </Wrap>
      </section>

      {/* Contato monumental */}
      <footer style={{ background: p.text, color: p.bg }}>
        <Wrap m={m} max={1440} style={{ padding: m ? '48px 20px 24px' : '104px 48px 32px' }}>
          <h2 style={{ fontWeight: 600, fontSize: m ? 40 : 104, letterSpacing: '-0.055em', lineHeight: 0.92, maxWidth: 1100 }}>Vamos conversar sobre o seu terreno.</h2>
          <div style={{ fontSize: m ? 20 : 36, fontWeight: 500, marginTop: m ? 20 : 36, color: p.accent, letterSpacing: '-0.02em' }}>ola@terraform.exemplo</div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : 'repeat(4, minmax(0, 1fr))', gap: 24, marginTop: m ? 40 : 88, paddingTop: 20, borderTop: `1px solid ${withAlpha(p.bg, 0.25)}`, fontSize: 14 }}>
            {[
              ['São Paulo', 'Rua Fradique, 410\nPinheiros'],
              ['Lisboa', 'Rua do Açúcar, 22\nMarvila'],
              ['Redes', 'Instagram\nLinkedIn'],
              ['Estúdio', '© 2026 TERRA/FORM\nEstúdio fictício'],
            ].map(([t, d]) => (
              <div key={t}>
                <div style={{ fontFamily: mono, fontSize: 11, opacity: 0.6 }}>{t.toUpperCase()}</div>
                <div style={{ marginTop: 6, whiteSpace: 'pre-line', opacity: 0.9 }}>{d}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
