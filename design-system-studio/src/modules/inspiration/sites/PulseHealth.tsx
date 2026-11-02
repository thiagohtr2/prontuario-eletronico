import { mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Avatar, Burger, ff, hair, Icon, SiteRoot, Wrap, type IconName, type SiteProps } from './kit'

function Portrait({ p, skin, hair: hairColor, long }: { p: SitePalette; skin: string; hair: string; long?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" width="100%" aria-hidden="true" style={{ display: 'block' }}>
      <circle cx={100} cy={100} r={100} fill={mix(p.secondary, p.surface, 0.2)} />
      {long && <path d="M58 92 Q56 150 70 170 L130 170 Q144 150 142 92 Z" fill={hairColor} />}
      <path d="M30 200 Q32 146 100 140 Q168 146 170 200 Z" fill="#ffffff" />
      <path d="M78 146 L100 182 L122 146" fill={mix(p.accent, '#000000', 0.15)} />
      <path d="M70 152 Q66 184 92 190" stroke={withAlpha(p.text, 0.55)} strokeWidth={3} fill="none" />
      <circle cx={92} cy={190} r={5} fill={withAlpha(p.text, 0.55)} />
      <rect x={88} y={118} width={24} height={28} rx={8} fill={mix(skin, '#000000', 0.08)} />
      <ellipse cx={100} cy={96} rx={34} ry={38} fill={skin} />
      <path d={long ? 'M64 92 Q66 54 100 54 Q136 54 136 92 Q118 70 88 74 Q72 78 64 92 Z' : 'M66 88 Q64 56 100 54 Q136 56 134 86 Q124 70 100 70 Q78 70 66 88 Z'} fill={hairColor} />
      <circle cx={88} cy={98} r={3} fill={p.text} />
      <circle cx={112} cy={98} r={3} fill={p.text} />
      <path d="M90 114 Q100 121 110 114" stroke={p.text} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </svg>
  )
}

const SPECIALTIES: [string, IconName][] = [
  ['Cardiologia', 'heart'],
  ['Clínica geral', 'pulse'],
  ['Dermatologia', 'sun'],
  ['Pediatria', 'users'],
  ['Nutrição', 'leaf'],
  ['Psicologia', 'chat'],
  ['Oftalmologia', 'eye'],
  ['Exames', 'drop'],
]

export default function PulseHealth({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const line = hair(p, 0.1)
  const soft = withAlpha(p.accent, 0.1)
  const card = { background: p.surface, borderRadius: 20, border: `1px solid ${line}`, boxShadow: `0 10px 30px ${withAlpha(p.text, 0.06)}` }
  return (
    <SiteRoot p={p} font={ff('system')} name="PULSE HEALTH">
      {/* Header */}
      <header style={{ background: p.surface, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1240} style={{ display: 'flex', alignItems: 'center', gap: 36, height: m ? 62 : 76 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: ff('inter'), fontWeight: 700, fontSize: m ? 17 : 19, letterSpacing: '-0.02em' }}>
            <span style={{ width: 34, height: 34, borderRadius: 11, background: p.accent, display: 'grid', placeItems: 'center' }}>
              <Icon name="pulse" size={20} color={p.onAccent} stroke={2.2} />
            </span>
            Pulse Health
          </span>
          {!m && (
            <nav style={{ display: 'flex', gap: 28, fontSize: 15, color: p.muted }}>
              {['Especialidades', 'Exames', 'Planos', 'Para empresas'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </nav>
          )}
          <div style={{ flex: 1 }} />
          {!m && <span style={{ fontSize: 15, fontWeight: 600 }}>Entrar</span>}
          {m ? <Burger color={p.text} /> : <span style={{ background: p.accent, color: p.onAccent, borderRadius: 12, padding: '12px 20px', fontWeight: 600, fontSize: 15 }}>Agendar consulta</span>}
        </Wrap>
      </header>

      {/* Hero com agendamento */}
      <section style={{ background: `linear-gradient(180deg, ${p.surface} 0%, ${p.bg} 100%)` }}>
        <Wrap m={m} max={1240} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1.05fr) minmax(0, 1fr)', gap: m ? 32 : 64, padding: m ? '32px 20px 48px' : '72px 48px 96px', alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: soft, color: mix(p.accent, p.text, 0.3), borderRadius: 999, padding: '7px 14px', fontSize: 13.5, fontWeight: 600 }}>
              <Icon name="clock" size={15} /> Consultas em até 24 horas
            </span>
            <h1 style={{ fontFamily: ff('inter'), fontWeight: 700, fontSize: m ? 38 : 62, lineHeight: 1.04, letterSpacing: '-0.035em', marginTop: 18 }}>
              Cuidado contínuo, <span style={{ color: p.accent }}>perto de você.</span>
            </h1>
            <p style={{ color: p.muted, fontSize: m ? 16 : 18.5, marginTop: 16, maxWidth: 500 }}>Médicos que acompanham sua história, exames no mesmo lugar e resultados direto no celular.</p>

            <div style={{ ...card, marginTop: 28, padding: m ? 16 : 20 }}>
              <div style={{ display: 'flex', gap: 6, background: withAlpha(p.text, 0.05), borderRadius: 12, padding: 4, width: 'fit-content', fontSize: 14, fontWeight: 600 }}>
                {['Consulta', 'Exame', 'Teleconsulta'].map((t, i) => (
                  <span key={t} style={{ padding: '8px 14px', borderRadius: 9, background: i === 0 ? p.surface : 'transparent', boxShadow: i === 0 ? `0 1px 3px ${withAlpha(p.text, 0.12)}` : 'none', color: i === 0 ? p.text : p.muted }}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1.3fr 1fr 1fr', gap: 10, marginTop: 14 }}>
                {[
                  ['Especialidade', 'Cardiologia', 'heart'],
                  ['Data', 'Qui, 14 nov', 'calendar'],
                  ['Unidade', 'Paulista', 'pin'],
                ].map(([k, v, icon]) => (
                  <div key={k} style={{ border: `1px solid ${line}`, borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Icon name={icon as IconName} size={18} color={p.accent} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: p.muted }}>{k}</div>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>
              <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 12, background: p.accent, color: p.onAccent, borderRadius: 12, padding: '14px 0', fontWeight: 600 }}>
                <Icon name="search" size={18} color={p.onAccent} /> Buscar horários disponíveis
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, fontSize: 14, color: p.muted }}>
              <span style={{ display: 'flex' }}>
                {['MC', 'JP', 'RS', 'AL'].map((t, i) => (
                  <span key={t} style={{ marginLeft: i ? -8 : 0 }}>
                    <Avatar size={30} bg={[p.accent, p.secondary, p.text, mix(p.accent, p.text, 0.4)][i]} fg={[p.onAccent, p.text, p.bg, '#ffffff'][i]} label={t} ring={p.bg} />
                  </span>
                ))}
              </span>
              <span>
                <strong style={{ color: p.text }}>4,9</strong> de nota · 12 mil pacientes
              </span>
            </div>
          </div>

          {/* Composição de painéis de saúde */}
          <div style={{ position: 'relative', height: m ? 380 : 560 }}>
            <div style={{ position: 'absolute', inset: m ? '6% 4% 4% 10%' : '4% 2% 6% 12%', borderRadius: m ? 40 : 64, background: p.secondary }} />
            <div style={{ position: 'absolute', left: m ? '2%' : 0, top: m ? '12%' : '14%', width: m ? '70%' : '64%', ...card, padding: m ? 16 : 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: m ? 12.5 : 14, color: p.muted }}>Frequência cardíaca</span>
                <Icon name="heart" size={18} color={p.accent} fill={p.accent} />
              </div>
              <div style={{ fontFamily: ff('inter'), fontWeight: 700, fontSize: m ? 30 : 44, letterSpacing: '-0.03em' }}>
                72 <span style={{ fontSize: m ? 13 : 16, color: p.muted, fontWeight: 500 }}>bpm</span>
              </div>
              <svg viewBox="0 0 300 70" width="100%" aria-hidden="true" style={{ display: 'block', marginTop: 6 }}>
                <path d="M0 40 L60 40 L72 40 L80 14 L92 62 L102 30 L110 40 L170 40 L180 40 L188 10 L200 64 L210 30 L218 40 L300 40" stroke={p.accent} strokeWidth={3} fill="none" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ position: 'absolute', right: 0, top: m ? '46%' : '44%', width: m ? '76%' : '62%', ...card, padding: m ? 14 : 20, display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: m ? 46 : 58, flex: 'none', borderRadius: '50%', overflow: 'hidden' }}>
                <Portrait p={p} skin="#c68863" hair="#2b1d16" long />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: p.accent, fontWeight: 700 }}>PRÓXIMA CONSULTA</div>
                <div style={{ fontWeight: 650, fontSize: m ? 14.5 : 16 }}>Dra. Helena Prado</div>
                <div style={{ fontSize: 13, color: p.muted }}>Cardiologia · Ter, 14h00</div>
              </div>
            </div>
            <div style={{ position: 'absolute', left: m ? '8%' : '14%', bottom: m ? '4%' : '6%', ...card, borderRadius: 999, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: m ? 13 : 14.5, fontWeight: 600 }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: soft, display: 'grid', placeItems: 'center' }}>
                <Icon name="check" size={16} color={p.accent} stroke={2.6} />
              </span>
              Resultado do exame disponível
            </div>
            {!m && (
              <div style={{ position: 'absolute', right: '6%', top: '4%', ...card, padding: 16, textAlign: 'center' }}>
                <svg width={84} height={84} viewBox="0 0 84 84" aria-hidden="true">
                  <circle cx={42} cy={42} r={34} stroke={withAlpha(p.accent, 0.15)} strokeWidth={8} fill="none" />
                  <circle cx={42} cy={42} r={34} stroke={p.accent} strokeWidth={8} fill="none" strokeDasharray={`${2 * Math.PI * 34 * 0.82} 999`} strokeLinecap="round" transform="rotate(-90 42 42)" />
                  <text x={42} y={47} textAnchor="middle" fontSize={15} fontWeight={700} fill={p.text} fontFamily={ff('inter')}>
                    82%
                  </text>
                </svg>
                <div style={{ fontSize: 12.5, color: p.muted, marginTop: 4 }}>Meta de passos</div>
              </div>
            )}
          </div>
        </Wrap>
      </section>

      {/* Especialidades */}
      <section style={{ padding: m ? '48px 0' : '96px 0' }}>
        <Wrap m={m} max={1240}>
          <div style={{ textAlign: m ? 'left' : 'center' }}>
            <h2 style={{ fontFamily: ff('inter'), fontWeight: 700, fontSize: m ? 28 : 42, letterSpacing: '-0.03em' }}>Mais de 40 especialidades</h2>
            <p style={{ color: p.muted, marginTop: 8, fontSize: m ? 15 : 17 }}>Encontre o profissional certo e agende em poucos toques.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 10 : 16, marginTop: m ? 24 : 44 }}>
            {SPECIALTIES.map(([t, icon], i) => (
              <div key={t} style={{ background: p.surface, border: `1px solid ${line}`, borderRadius: 16, padding: m ? 12 : 20, display: 'flex', alignItems: 'center', gap: m ? 10 : 14 }}>
                <span style={{ width: m ? 34 : 46, height: m ? 34 : 46, flex: 'none', borderRadius: 12, background: i % 3 === 1 ? withAlpha(p.secondary, 0.8) : soft, display: 'grid', placeItems: 'center' }}>
                  <Icon name={icon} size={m ? 19 : 22} color={i % 3 === 1 ? mix(p.secondary, p.text, 0.65) : p.accent} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 650, fontSize: m ? 13 : 15.5, overflowWrap: 'normal' }}>{t}</div>
                  {!m && <div style={{ fontSize: 13, color: p.muted }}>{12 + i * 3} profissionais</div>}
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Como funciona */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1240} style={{ padding: m ? '48px 20px' : '88px 48px' }}>
          <h2 style={{ fontFamily: ff('inter'), fontWeight: 700, fontSize: m ? 28 : 42, letterSpacing: '-0.03em' }}>Como funciona</h2>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 20 : 40, marginTop: m ? 24 : 44 }}>
            {!m && <div style={{ position: 'absolute', left: 28, right: '30%', top: 27, borderTop: `2px dashed ${withAlpha(p.accent, 0.4)}` }} />}
            {[
              ['Agende', 'Escolha especialidade, unidade e horário — ou faça por vídeo.'],
              ['Consulte', 'O médico vê seu histórico completo antes de você entrar.'],
              ['Acompanhe', 'Receitas, exames e lembretes ficam no app, sem papel.'],
            ].map(([t, d], i) => (
              <div key={t} style={{ position: 'relative', display: m ? 'flex' : 'block', gap: 16 }}>
                <span style={{ width: 56, height: 56, flex: 'none', borderRadius: '50%', background: i === 0 ? p.accent : p.surface, color: i === 0 ? p.onAccent : p.accent, border: `2px solid ${p.accent}`, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 20, position: 'relative' }}>{i + 1}</span>
                <div>
                  <h3 style={{ fontFamily: ff('inter'), fontWeight: 700, fontSize: m ? 19 : 22, marginTop: m ? 4 : 20 }}>{t}</h3>
                  <p style={{ color: p.muted, marginTop: 6, fontSize: m ? 14.5 : 16 }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Médicos */}
      <section style={{ padding: m ? '48px 0' : '96px 0' }}>
        <Wrap m={m} max={1240}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: ff('inter'), fontWeight: 700, fontSize: m ? 28 : 42, letterSpacing: '-0.03em' }}>Conheça nossa equipe</h2>
            <span style={{ color: p.accent, fontWeight: 600 }}>Ver todos os médicos →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 14 : 24, marginTop: m ? 24 : 40 }}>
            {[
              ['Dra. Helena Prado', 'Cardiologista', 'CRM 123.456', '#c68863', '#2b1d16', true, 'Hoje, 16h'],
              ['Dr. Rafael Nunes', 'Clínico geral', 'CRM 234.567', '#e8b896', '#5a3a22', false, 'Amanhã, 9h'],
              ['Dra. Aisha Lima', 'Pediatra', 'CRM 345.678', '#8d5a3b', '#1a1210', true, 'Hoje, 18h30'],
            ].map(([n, s, crm, skin, hc, long, slot]) => (
              <article key={n as string} style={{ ...card, boxShadow: 'none', padding: m ? 16 : 24, display: m ? 'flex' : 'block', gap: 16, alignItems: 'center' }}>
                <div style={{ width: m ? 84 : '100%', flex: 'none', borderRadius: m ? '50%' : 16, overflow: 'hidden', background: mix(p.secondary, p.surface, 0.2), aspectRatio: m ? '1' : '4 / 3', display: 'grid', placeItems: 'end center' }}>
                  <div style={{ width: m ? '100%' : '62%' }}>
                    <Portrait p={p} skin={skin as string} hair={hc as string} long={long as boolean} />
                  </div>
                </div>
                <div style={{ marginTop: m ? 0 : 18, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontFamily: ff('inter'), fontWeight: 700, fontSize: m ? 16 : 19 }}>{n as string}</h3>
                    {!m && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600 }}>
                        <Icon name="star" size={15} color="#f5a524" fill="#f5a524" stroke={1} /> 4,9
                      </span>
                    )}
                  </div>
                  <div style={{ color: p.muted, fontSize: 14 }}>
                    {s as string} · {crm as string}
                  </div>
                  <span style={{ display: 'inline-block', marginTop: 12, background: soft, color: mix(p.accent, p.text, 0.3), borderRadius: 8, padding: '6px 10px', fontSize: 13, fontWeight: 600 }}>Próximo horário: {slot as string}</span>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Planos */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1240} style={{ padding: m ? '48px 20px' : '96px 48px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: ff('inter'), fontWeight: 700, fontSize: m ? 28 : 42, letterSpacing: '-0.03em' }}>Planos sem carência</h2>
            <p style={{ color: p.muted, marginTop: 8 }}>Consultas ilimitadas com clínico geral em todos os planos.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 14 : 24, marginTop: m ? 24 : 44, alignItems: 'stretch' }}>
            {[
              ['Essencial', 'R$ 89', 'por mês', ['Clínico geral ilimitado', 'Teleconsulta 24 h', '20% off em exames'], false],
              ['Família', 'R$ 219', 'até 4 pessoas', ['Tudo do Essencial', '6 especialidades', 'Pediatria ilimitada', 'Exames básicos inclusos'], true],
              ['Empresa', 'Sob consulta', 'a partir de 10 vidas', ['Gestão de saúde da equipe', 'Programa de bem-estar', 'Relatórios anônimos'], false],
            ].map(([n, price, sub, items, hi]) => (
              <div key={n as string} style={{ borderRadius: 22, padding: m ? 22 : 30, border: `${hi ? 2 : 1}px solid ${hi ? p.accent : line}`, background: hi ? withAlpha(p.accent, 0.05) : p.bg, position: 'relative' }}>
                {hi && <span style={{ position: 'absolute', top: -13, left: 24, background: p.accent, color: p.onAccent, fontSize: 12, fontWeight: 700, borderRadius: 999, padding: '4px 12px' }}>Mais escolhido</span>}
                <h3 style={{ fontFamily: ff('inter'), fontWeight: 700, fontSize: 19 }}>{n as string}</h3>
                <div style={{ fontFamily: ff('inter'), fontWeight: 750, fontSize: m ? 32 : 38, letterSpacing: '-0.03em', marginTop: 10 }}>{price as string}</div>
                <div style={{ color: p.muted, fontSize: 14 }}>{sub as string}</div>
                <ul style={{ display: 'grid', gap: 10, marginTop: 20, fontSize: 15 }}>
                  {(items as string[]).map((t) => (
                    <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Icon name="check" size={17} color={p.accent} stroke={2.4} /> {t}
                    </li>
                  ))}
                </ul>
                <span style={{ display: 'block', textAlign: 'center', marginTop: 24, borderRadius: 12, padding: '13px 0', fontWeight: 600, background: hi ? p.accent : 'transparent', color: hi ? p.onAccent : p.text, border: hi ? 'none' : `1.5px solid ${withAlpha(p.text, 0.25)}` }}>
                  {hi ? 'Assinar Família' : 'Saiba mais'}
                </span>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Perguntas frequentes */}
      <section style={{ padding: m ? '48px 0' : '96px 0' }}>
        <Wrap m={m} max={880}>
          <h2 style={{ fontFamily: ff('inter'), fontWeight: 700, fontSize: m ? 28 : 40, letterSpacing: '-0.03em', textAlign: 'center' }}>Perguntas frequentes</h2>
          <div style={{ marginTop: m ? 20 : 36 }}>
            {[
              ['Preciso de pedido médico para exames?', 'Para exames laboratoriais simples, não. Nossos médicos podem emitir o pedido na hora, em consulta presencial ou por vídeo.'],
              ['A teleconsulta tem receita válida?', ''],
              ['Posso incluir dependentes depois?', ''],
              ['Como cancelo um agendamento?', ''],
            ].map(([q, a], i) => (
              <div key={q} style={{ borderBottom: `1px solid ${line}`, padding: '18px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', fontWeight: 650, fontSize: m ? 15.5 : 17 }}>
                  {q}
                  <span style={{ width: 30, height: 30, flex: 'none', borderRadius: '50%', background: i === 0 ? p.accent : withAlpha(p.text, 0.06), display: 'grid', placeItems: 'center' }}>
                    <Icon name={i === 0 ? 'minus' : 'plus'} size={16} color={i === 0 ? p.onAccent : p.text} stroke={2.2} />
                  </span>
                </div>
                {a && <p style={{ color: p.muted, marginTop: 10, fontSize: m ? 14.5 : 16, maxWidth: 680 }}>{a}</p>}
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* App */}
      <section style={{ padding: m ? '0 0 48px' : '0 0 96px' }}>
        <Wrap m={m} max={1240}>
          <div style={{ background: p.text, color: p.bg, borderRadius: m ? 24 : 32, padding: m ? '32px 24px 0' : '56px 64px 0', display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 32, overflow: 'hidden' }}>
            <div style={{ paddingBottom: m ? 0 : 56 }}>
              <h2 style={{ fontFamily: ff('inter'), fontWeight: 700, fontSize: m ? 28 : 42, letterSpacing: '-0.03em', lineHeight: 1.08 }}>Seu histórico de saúde no bolso.</h2>
              <p style={{ opacity: 0.75, marginTop: 12, fontSize: m ? 15 : 17 }}>Resultados, receitas e lembretes de remédio em um só lugar.</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
                {['Baixar para iPhone', 'Baixar para Android'].map((t) => (
                  <span key={t} style={{ border: `1px solid ${withAlpha(p.bg, 0.35)}`, borderRadius: 12, padding: '11px 16px', fontSize: 14, fontWeight: 600, display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                    <Icon name="phone" size={17} color={p.bg} /> {t}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ justifySelf: 'center', width: m ? 200 : 250, height: m ? 220 : 300, borderRadius: '32px 32px 0 0', borderTop: `8px solid ${withAlpha(p.bg, 0.2)}`, borderLeft: `8px solid ${withAlpha(p.bg, 0.2)}`, borderRight: `8px solid ${withAlpha(p.bg, 0.2)}`, background: p.bg, color: p.text, padding: '20px 16px', alignSelf: 'end' }}>
              <div style={{ fontSize: 12, color: p.muted }}>Olá, Marina</div>
              <div style={{ fontWeight: 700, fontSize: 17, marginTop: 2 }}>Seus lembretes</div>
              {['Losartana 50 mg · 8h', 'Hemograma · resultado ✓', 'Consulta · Ter 14h'].map((t, i) => (
                <div key={t} style={{ marginTop: 10, borderRadius: 12, padding: '10px 12px', background: i === 1 ? soft : withAlpha(p.text, 0.04), fontSize: 13, fontWeight: 600 }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      <footer style={{ borderTop: `1px solid ${line}`, background: p.surface, fontSize: 14 }}>
        <Wrap m={m} max={1240} style={{ padding: m ? '32px 20px' : '48px 48px', display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '2fr repeat(3, 1fr)', gap: 24 }}>
          <div style={{ gridColumn: m ? '1 / -1' : 'auto' }}>
            <strong style={{ fontFamily: ff('inter'), fontSize: 17 }}>Pulse Health</strong>
            <p style={{ color: p.muted, marginTop: 6, maxWidth: 300 }}>Responsável técnico: Dr. Paulo Mendes, CRM 000.000 (fictício). Marca fictícia.</p>
          </div>
          {[
            ['Pacientes', ['Agendar', 'Exames', 'Planos']],
            ['Empresa', ['Sobre', 'Unidades', 'Carreiras']],
            ['Ajuda', ['Central', 'Privacidade', 'Ouvidoria']],
          ].map(([t, items]) => (
            <div key={t as string}>
              <strong>{t as string}</strong>
              <ul style={{ display: 'grid', gap: 6, marginTop: 8, color: p.muted }}>
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
