import { isDark, mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, useSvgId, Wrap, type IconName, type SiteProps } from './kit'

const SERIES = [100, 101.2, 100.6, 102.4, 103.1, 102.2, 104.6, 105.9, 105.1, 107.4, 108.8, 108.1, 110.2, 111.6, 110.9, 112.8, 113.4, 114.8]
const BENCH = SERIES.map((_, i) => 100 + i * 0.6)

function path(values: number[], w: number, h: number, min: number, max: number) {
  return values.map((v, i) => `${i ? 'L' : 'M'}${((i / (values.length - 1)) * w).toFixed(1)} ${(h - ((v - min) / (max - min)) * h).toFixed(1)}`).join(' ')
}

function AreaChart({ p, height = 220 }: { p: SitePalette; height?: number }) {
  const id = useSvgId('atlas-area')
  const w = 600
  const h = height
  const min = 98
  const max = 116
  const d = path(SERIES, w, h, min, max)
  return (
    <svg viewBox={`0 0 ${w} ${h + 26}`} width="100%" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id('fill')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.accent} stopOpacity={0.28} />
          <stop offset="1" stopColor={p.accent} stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <path key={t} d={`M0 ${h * t} L${w} ${h * t}`} stroke={withAlpha(p.text, 0.08)} />
      ))}
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={`url(#${id('fill')})`} />
      <path d={path(BENCH, w, h, min, max)} stroke={p.secondary} strokeWidth={2} strokeDasharray="5 5" fill="none" />
      <path d={d} stroke={p.accent} strokeWidth={2.6} fill="none" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((SERIES[SERIES.length - 1] - min) / (max - min)) * h} r={5} fill={p.accent} stroke={p.surface} strokeWidth={2} />
      {['nov', 'jan', 'mar', 'mai', 'jul', 'set', 'nov'].map((t, i) => (
        <text key={i} x={(i / 6) * (w - 20) + 10} y={h + 20} fontSize={11} fill={p.muted} textAnchor="middle" fontFamily={ff('inter')}>
          {t}
        </text>
      ))}
    </svg>
  )
}

function Donut({ p, size = 120 }: { p: SitePalette; size?: number }) {
  const parts = [45, 25, 20, 10]
  const colors = [p.accent, p.secondary, mix(p.accent, p.surface, 0.55), withAlpha(p.text, 0.25)]
  const r = 42
  const c = 2 * Math.PI * r
  let acc = 0
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ display: 'block', flex: 'none' }}>
      {parts.map((v, i) => {
        const len = (v / 100) * c
        const el = <circle key={i} cx={50} cy={50} r={r} fill="none" stroke={colors[i]} strokeWidth={14} strokeDasharray={`${len - 1.5} ${c}`} strokeDashoffset={-acc} transform="rotate(-90 50 50)" />
        acc += len
        return el
      })}
    </svg>
  )
}

function Spark({ color, up = true }: { color: string; up?: boolean }) {
  const pts = up ? [8, 10, 9, 13, 12, 15, 14, 18, 20] : [18, 16, 17, 14, 15, 12, 13, 10, 9]
  return (
    <svg width="100%" height={32} viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block' }}>
      <path d={pts.map((v, i) => `${i ? 'L' : 'M'}${i * 12.5} ${24 - v}`).join(' ')} stroke={color} strokeWidth={2} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function AtlasCapital({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const serif = ff('georgia')
  const line = hair(p, 0.12)
  const up = isDark(p.bg) ? '#4ade80' : '#167a45'
  const down = isDark(p.bg) ? '#f87171' : '#b42318'
  const num = { fontVariantNumeric: 'tabular-nums' as const }
  return (
    <SiteRoot p={p} font={ff('inter')} name="ATLAS CAPITAL">
      {/* Faixa de cotações */}
      <div style={{ background: p.text, color: p.bg, fontSize: 12.5, overflow: 'hidden', whiteSpace: 'nowrap', ...num }}>
        <Wrap m={m} max={1280} style={{ display: 'flex', gap: 28, height: 34, alignItems: 'center' }}>
          {[
            ['ATL50', '128.402', '+1,24%', true],
            ['DÓLAR', 'R$ 5,02', '−0,31%', false],
            ['SELIC', '10,50%', '', true],
            ['CDI 12M', '10,40%', '', true],
            ['IPCA 12M', '4,10%', '', true],
            ['OURO', 'R$ 412/g', '+0,80%', true],
          ].map(([k, v, c, isUp]) => (
            <span key={k as string} style={{ display: 'inline-flex', gap: 8 }}>
              <span style={{ opacity: 0.6 }}>{k as string}</span>
              <span style={{ fontWeight: 600 }}>{v as string}</span>
              {c && <span style={{ color: isUp ? mix(up, '#ffffff', isDark(p.text) ? 0.45 : 0) : mix(down, '#ffffff', isDark(p.text) ? 0.45 : 0) }}>{isUp ? '▲' : '▼'} {c as string}</span>}
            </span>
          ))}
        </Wrap>
      </div>

      {/* Header corporativo */}
      <header style={{ background: p.surface, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ display: 'flex', alignItems: 'center', gap: 40, height: m ? 62 : 78 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <svg width={30} height={30} viewBox="0 0 30 30" aria-hidden="true">
              <circle cx={15} cy={15} r={13} fill="none" stroke={p.accent} strokeWidth={2} />
              <ellipse cx={15} cy={15} rx={6} ry={13} fill="none" stroke={p.accent} strokeWidth={1.6} />
              <path d="M2 15 H28 M5 8 H25 M5 22 H25" stroke={p.secondary} strokeWidth={1.6} />
            </svg>
            <span style={{ fontFamily: serif, fontSize: m ? 18 : 21, letterSpacing: '0.12em' }}>ATLAS</span>
            <span style={{ fontSize: 11, letterSpacing: '0.3em', color: p.muted, fontWeight: 600, marginTop: 2 }}>CAPITAL</span>
          </span>
          {!m && (
            <nav style={{ display: 'flex', gap: 28, fontSize: 14.5 }}>
              {['Investimentos', 'Previdência', 'Câmbio', 'Research', 'Sobre'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </nav>
          )}
          <div style={{ flex: 1 }} />
          {!m && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14.5, fontWeight: 600 }}>
              <Icon name="lock" size={16} /> Acessar conta
            </span>
          )}
          {m ? <Burger color={p.text} /> : <span style={{ background: p.accent, color: p.onAccent, borderRadius: 4, padding: '12px 22px', fontWeight: 600, fontSize: 14.5 }}>Abrir conta</span>}
        </Wrap>
      </header>

      {/* Hero com painel de desempenho */}
      <section style={{ borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 5fr) minmax(0, 6fr)', gap: m ? 28 : 64, padding: m ? '36px 20px 44px' : '80px 48px 88px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12.5, letterSpacing: '0.24em', color: p.muted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 24, height: 2, background: p.secondary }} /> GESTÃO DE PATRIMÔNIO
            </div>
            <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 40 : 64, lineHeight: 1.04, letterSpacing: '-0.02em', marginTop: 18 }}>Patrimônio construído com método.</h1>
            <p style={{ color: p.muted, fontSize: m ? 16 : 18, marginTop: 18, maxWidth: 470 }}>Carteiras desenhadas por uma equipe de 40 analistas, com rebalanceamento trimestral e relatórios claros, sem jargão.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 30, flexDirection: m ? 'column' : 'row' }}>
              <span style={{ background: p.accent, color: p.onAccent, borderRadius: 4, padding: '15px 26px', fontWeight: 600, textAlign: 'center' }}>Falar com um especialista</span>
              <span style={{ border: `1px solid ${withAlpha(p.text, 0.3)}`, borderRadius: 4, padding: '15px 26px', fontWeight: 600, textAlign: 'center' }}>Simular investimento</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 26, fontSize: 13, color: p.muted }}>
              <Icon name="shield" size={18} color={p.secondary} /> Instituição regulada · R$ 38 bi sob gestão · Desde 1998
            </div>
          </div>
          <div style={{ background: p.surface, border: `1px solid ${line}`, borderRadius: 10, boxShadow: `0 24px 60px ${withAlpha(p.text, 0.08)}`, padding: m ? 18 : 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 13, color: p.muted }}>Carteira</div>
                <div style={{ fontFamily: serif, fontSize: m ? 18 : 21 }}>Atlas Equilíbrio</div>
              </div>
              <div style={{ display: 'flex', gap: 2, border: `1px solid ${line}`, borderRadius: 6, padding: 2, fontSize: 12.5, fontWeight: 600 }}>
                {['1M', '6M', '1A', '5A'].map((t) => (
                  <span key={t} style={{ padding: '5px 10px', borderRadius: 4, background: t === '1A' ? p.accent : 'transparent', color: t === '1A' ? p.onAccent : p.muted }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 16, ...num }}>
              <span style={{ fontSize: m ? 34 : 44, fontWeight: 700, letterSpacing: '-0.03em', color: up }}>+14,8%</span>
              <span style={{ fontSize: 13.5, color: p.muted }}>em 12 meses · CDI +10,4%</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <AreaChart p={p} height={m ? 150 : 210} />
            </div>
            <div style={{ display: 'flex', gap: 18, fontSize: 12.5, color: p.muted, marginTop: 4 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 14, height: 3, background: p.accent }} /> Carteira
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 14, height: 0, borderTop: `2px dashed ${p.secondary}` }} /> CDI
              </span>
            </div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 18, paddingTop: 18, borderTop: `1px solid ${line}` }}>
              <Donut p={p} size={m ? 86 : 104} />
              <ul style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: '8px 20px', fontSize: 13.5, flex: 1, ...num }}>
                {[
                  ['Renda fixa', '45%', p.accent],
                  ['Ações Brasil', '25%', p.secondary],
                  ['Internacional', '20%', mix(p.accent, p.surface, 0.55)],
                  ['Alternativos', '10%', withAlpha(p.text, 0.25)],
                ].map(([t, v, c]) => (
                  <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 2, background: c }} />
                    <span style={{ flex: 1 }}>{t}</span>
                    <strong>{v}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Indicadores */}
      <section>
        <Wrap m={m} max={1280} style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 10 : 20, padding: m ? '32px 20px' : '56px 48px' }}>
          {[
            ['Sob gestão', 'R$ 38 bi', '+9% no ano', true],
            ['Clientes', '62 mil', '+4.100 em 2026', true],
            ['Volatilidade', '6,2%', '−0,8 p.p.', false],
            ['Rating de gestão', 'AA+', 'Agência independente', true],
          ].map(([k, v, d, isUp]) => (
            <div key={k as string} style={{ border: `1px solid ${line}`, borderRadius: 8, padding: m ? 14 : 20, background: p.surface }}>
              <div style={{ fontSize: 13, color: p.muted }}>{k as string}</div>
              <div style={{ fontSize: m ? 24 : 32, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 4, ...num }}>{v as string}</div>
              <div style={{ margin: '8px 0 6px' }}>
                <Spark color={isUp ? p.accent : p.secondary} up={isUp as boolean} />
              </div>
              <div style={{ fontSize: 12.5, color: isUp ? up : p.muted, fontWeight: 600 }}>{d as string}</div>
            </div>
          ))}
        </Wrap>
      </section>

      {/* Soluções */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ padding: m ? '44px 20px' : '88px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16, alignItems: 'end' }}>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 30 : 46, letterSpacing: '-0.02em' }}>Soluções para cada etapa da vida financeira</h2>
            <p style={{ color: p.muted, fontSize: m ? 15 : 17 }}>Do primeiro investimento à sucessão familiar, um mesmo assessor acompanha você.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(4, minmax(0, 1fr))', gap: 0, marginTop: m ? 24 : 44, borderTop: `2px solid ${p.text}` }}>
            {(
              [
                ['chart', 'Investimentos', 'Carteiras recomendadas e fundos exclusivos.'],
                ['shield', 'Previdência', 'Planos com taxa zero de carregamento.'],
                ['globe', 'Câmbio', 'Remessas e conta global em 12 moedas.'],
                ['layers', 'Crédito estruturado', 'Linhas com garantia de carteira.'],
              ] as [IconName, string, string][]
            ).map(([icon, t, d], i) => (
              <div key={t} style={{ padding: m ? '20px 0' : '28px 24px 8px', paddingLeft: m ? 0 : i ? 24 : 0, borderLeft: !m && i ? `1px solid ${line}` : 'none', borderBottom: m ? `1px solid ${line}` : 'none', display: m ? 'flex' : 'block', gap: 16 }}>
                <Icon name={icon} size={26} color={p.accent} />
                <div>
                  <h3 style={{ fontFamily: serif, fontSize: m ? 20 : 23, fontWeight: 400, marginTop: m ? 0 : 18 }}>{t}</h3>
                  <p style={{ color: p.muted, fontSize: 14.5, marginTop: 6 }}>{d}</p>
                  <span style={{ display: 'inline-block', marginTop: 12, fontSize: 14, fontWeight: 600, color: p.accent }}>Saiba mais →</span>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Tabela de rentabilidade */}
      <section>
        <Wrap m={m} max={1280} style={{ padding: m ? '44px 20px' : '88px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 30 : 42, letterSpacing: '-0.02em' }}>Rentabilidade dos fundos</h2>
            <span style={{ fontSize: 13, color: p.muted }}>Dados até 31/10/2026 · líquidos de taxas</span>
          </div>
          {m ? (
            <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
              {[
                ['Atlas Crédito Privado', '13,9%', '134%'],
                ['Atlas Equilíbrio', '14,8%', '142%'],
                ['Atlas Ações Valor', '18,2%', '175%'],
                ['Atlas Global', '11,1%', '107%'],
              ].map(([n, y, cdi]) => (
                <div key={n} style={{ border: `1px solid ${line}`, borderRadius: 8, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...num }}>
                  <div>
                    <strong style={{ fontSize: 15 }}>{n}</strong>
                    <div style={{ fontSize: 12.5, color: p.muted }}>{cdi} do CDI</div>
                  </div>
                  <strong style={{ color: up }}>+{y}</strong>
                </div>
              ))}
            </div>
          ) : (
            <table style={{ marginTop: 28, fontSize: 15, ...num }}>
              <thead>
                <tr style={{ fontSize: 12.5, color: p.muted, letterSpacing: '0.06em' }}>
                  {['FUNDO', 'CATEGORIA', '12 MESES', '24 MESES', '% DO CDI', 'RISCO', ''].map((h, i) => (
                    <th key={i} style={{ padding: '12px 0', borderBottom: `2px solid ${p.text}`, textAlign: i >= 2 && i <= 4 ? 'right' : 'left', paddingRight: i >= 2 && i <= 4 ? 28 : 0 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Atlas Crédito Privado', 'Renda fixa', '13,9%', '27,4%', '134%', 2],
                  ['Atlas Equilíbrio', 'Multimercado', '14,8%', '29,1%', '142%', 3],
                  ['Atlas Ações Valor', 'Ações', '18,2%', '21,7%', '175%', 5],
                  ['Atlas Global', 'Internacional', '11,1%', '24,0%', '107%', 4],
                ].map(([n, c, a, b, cdi, risk]) => (
                  <tr key={n as string}>
                    <td style={{ padding: '18px 0', borderBottom: `1px solid ${line}`, fontWeight: 600 }}>{n as string}</td>
                    <td style={{ padding: '18px 0', borderBottom: `1px solid ${line}`, color: p.muted }}>{c as string}</td>
                    <td style={{ padding: '18px 28px 18px 0', borderBottom: `1px solid ${line}`, textAlign: 'right', color: up, fontWeight: 600 }}>+{a as string}</td>
                    <td style={{ padding: '18px 28px 18px 0', borderBottom: `1px solid ${line}`, textAlign: 'right', color: up }}>+{b as string}</td>
                    <td style={{ padding: '18px 28px 18px 0', borderBottom: `1px solid ${line}`, textAlign: 'right' }}>{cdi as string}</td>
                    <td style={{ padding: '18px 0', borderBottom: `1px solid ${line}` }}>
                      <span style={{ display: 'inline-flex', gap: 3 }}>
                        {[1, 2, 3, 4, 5].map((k) => (
                          <span key={k} style={{ width: 6, height: 6 + k * 2, alignSelf: 'flex-end', borderRadius: 1, background: k <= (risk as number) ? p.accent : withAlpha(p.text, 0.12) }} />
                        ))}
                      </span>
                    </td>
                    <td style={{ padding: '18px 0', borderBottom: `1px solid ${line}`, textAlign: 'right', color: p.accent, fontWeight: 600, fontSize: 14 }}>Investir →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p style={{ fontSize: 12, color: p.muted, marginTop: 16 }}>Rentabilidade passada não é garantia de rentabilidade futura. Leia a lâmina e o regulamento antes de investir.</p>
        </Wrap>
      </section>

      {/* Research */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ padding: m ? '44px 20px' : '88px 48px' }}>
          <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 30 : 42, letterSpacing: '-0.02em' }}>Research Atlas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr)', gap: m ? 14 : 24, marginTop: m ? 20 : 36 }}>
            {[
              ['Macro', 'Juros em queda: o que muda na renda fixa em 2027', '28 out · 9 min'],
              ['Ações', 'Cinco setores para atravessar o ciclo', '21 out · 6 min'],
              ['Planejamento', 'Sucessão sem conflito: um guia prático', '14 out · 12 min'],
            ].map(([k, t, meta], i) => (
              <article key={t} style={{ border: `1px solid ${line}`, borderRadius: 8, overflow: 'hidden', background: p.bg }}>
                <div style={{ height: i === 0 && !m ? 170 : 110, background: i === 0 ? p.accent : mix(p.bg, p.secondary, 0.25), padding: 18, display: 'flex', alignItems: 'flex-end' }}>
                  <svg viewBox="0 0 200 60" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
                    {Array.from({ length: 14 }, (_, k) => {
                      const hgt = 10 + ((k * 37 + i * 11) % 48)
                      return <rect key={k} x={k * 14.5} y={60 - hgt} width={9} height={hgt} fill={i === 0 ? withAlpha(p.onAccent, 0.35 + (k / 14) * 0.5) : withAlpha(p.text, 0.18 + (k / 14) * 0.3)} />
                    })}
                  </svg>
                </div>
                <div style={{ padding: m ? 16 : 22 }}>
                  <div style={{ fontSize: 12, letterSpacing: '0.16em', color: p.accent, fontWeight: 700 }}>{k.toUpperCase()}</div>
                  <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: i === 0 && !m ? 26 : 20, lineHeight: 1.2, marginTop: 8 }}>{t}</h3>
                  <div style={{ fontSize: 13, color: p.muted, marginTop: 12 }}>{meta}</div>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Contato com especialista */}
      <section style={{ background: p.accent, color: p.onAccent }}>
        <Wrap m={m} max={1280} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: m ? 24 : 64, padding: m ? '44px 20px' : '88px 48px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: m ? 32 : 50, letterSpacing: '-0.02em', lineHeight: 1.06 }}>Uma conversa de 30 minutos pode mudar os próximos 30 anos.</h2>
            <p style={{ marginTop: 14, opacity: 0.8, fontSize: m ? 15 : 17 }}>Sem compromisso. Um especialista analisa sua carteira atual e propõe um plano.</p>
          </div>
          <div style={{ background: p.surface, color: p.text, borderRadius: 10, padding: m ? 18 : 28, display: 'grid', gap: 12 }}>
            {['Nome completo', 'E-mail', 'Patrimônio para investir'].map((t, i) => (
              <div key={t} style={{ border: `1px solid ${line}`, borderRadius: 6, padding: '12px 14px', fontSize: 14.5, color: p.muted, display: 'flex', justifyContent: 'space-between' }}>
                {t}
                {i === 2 && <Icon name="chevron" size={18} />}
              </div>
            ))}
            <span style={{ background: p.text, color: p.bg, borderRadius: 6, padding: '14px 0', fontWeight: 600, textAlign: 'center' }}>Agendar conversa</span>
          </div>
        </Wrap>
      </section>

      <footer style={{ background: p.text, color: p.bg, fontSize: 13.5 }}>
        <Wrap m={m} max={1280} style={{ padding: m ? '36px 20px 24px' : '64px 48px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '1.6fr repeat(4, 1fr)', gap: 24 }}>
            <div style={{ gridColumn: m ? '1 / -1' : 'auto' }}>
              <span style={{ fontFamily: serif, fontSize: 21, letterSpacing: '0.12em' }}>ATLAS</span> <span style={{ fontSize: 11, letterSpacing: '0.3em', opacity: 0.6 }}>CAPITAL</span>
              <p style={{ opacity: 0.6, marginTop: 10, maxWidth: 300 }}>Av. Paulista, 1000 · São Paulo · Ouvidoria 0800 000 0000</p>
            </div>
            {[
              ['Investir', ['Fundos', 'Previdência', 'Renda fixa', 'Câmbio']],
              ['Conteúdo', ['Research', 'Podcast', 'Glossário']],
              ['Empresa', ['Sobre', 'Governança', 'Carreiras']],
              ['Legal', ['Privacidade', 'Termos', 'Lâminas']],
            ].map(([t, items]) => (
              <div key={t as string}>
                <div style={{ opacity: 0.55, fontSize: 12, letterSpacing: '0.14em', fontWeight: 600 }}>{(t as string).toUpperCase()}</div>
                <ul style={{ display: 'grid', gap: 6, marginTop: 10 }}>
                  {(items as string[]).map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 32, paddingTop: 18, borderTop: `1px solid ${withAlpha(p.bg, 0.18)}`, fontSize: 11.5, opacity: 0.55, lineHeight: 1.6 }}>
            ATLAS CAPITAL é uma instituição fictícia criada para fins de demonstração. Os números, fundos e índices desta página são ilustrativos e não constituem oferta ou recomendação de investimento.
          </p>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
