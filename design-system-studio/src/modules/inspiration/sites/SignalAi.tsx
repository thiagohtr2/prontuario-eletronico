import { isDark, mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, Wrap, type IconName, type SiteProps } from './kit'

function gradientText(p: SitePalette) {
  return {
    background: `linear-gradient(90deg, ${p.accent}, ${p.secondary})`,
    WebkitBackgroundClip: 'text' as const,
    backgroundClip: 'text' as const,
    color: 'transparent',
  }
}

/** Cartão de código com chamada à API e resposta em streaming. */
function CodeCard({ p, m }: { p: SitePalette; m: boolean }) {
  const dark = isDark(p.bg)
  const panel = dark ? mix(p.surface, '#000000', 0.2) : '#0f1117'
  const kw = mix(p.accent, '#ffffff', 0.35)
  const str = mix(p.secondary, '#ffffff', 0.2)
  const dim = '#7d8196'
  const lines: [string, string][][] = [
    [[kw, 'from'], ['#e8e8f0', ' signal '], [kw, 'import'], ['#e8e8f0', ' Client']],
    [['#e8e8f0', '']],
    [['#e8e8f0', 'client = Client()'], [dim, '  # usa SIGNAL_API_KEY']],
    [['#e8e8f0', 'resposta = client.responder(']],
    [['#e8e8f0', '    modelo='], [str, '"signal-3"'], ['#e8e8f0', ',']],
    [['#e8e8f0', '    contexto=docs.carregar('], [str, '"contratos/"'], ['#e8e8f0', '),']],
    [['#e8e8f0', '    pergunta='], [str, '"Quais cláusulas vencem em 2027?"'], ['#e8e8f0', ',']],
    [['#e8e8f0', ')']],
  ]
  return (
    <div style={{ borderRadius: 16, border: `1px solid ${withAlpha('#ffffff', 0.12)}`, background: panel, color: '#e8e8f0', boxShadow: `0 40px 120px ${withAlpha(p.accent, 0.3)}`, overflow: 'hidden', fontFamily: ff('jetbrains-mono'), fontSize: m ? 11.5 : 13.5, textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 14px', borderBottom: `1px solid ${withAlpha('#ffffff', 0.08)}` }}>
        <span style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.85 }} />
          ))}
        </span>
        {['python', 'curl', 'node'].map((t, i) => (
          <span key={t} style={{ fontSize: 12, color: i === 0 ? '#ffffff' : dim, borderBottom: i === 0 ? `2px solid ${p.accent}` : 'none', paddingBottom: 2 }}>
            {t}
          </span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1.25fr 1fr' }}>
        <pre style={{ margin: 0, padding: m ? 14 : 20, lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
          {lines.map((ln, i) => (
            <div key={i}>
              <span style={{ color: dim, marginRight: 14, userSelect: 'none' }}>{String(i + 1).padStart(2, ' ')}</span>
              {ln.map(([c, t], k) => (
                <span key={k} style={{ color: c }}>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </pre>
        <div style={{ padding: m ? 14 : 20, borderLeft: m ? 'none' : `1px solid ${withAlpha('#ffffff', 0.08)}`, borderTop: m ? `1px solid ${withAlpha('#ffffff', 0.08)}` : 'none', lineHeight: 1.65 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: dim, fontSize: 11.5 }}>
            <span>RESPOSTA</span>
            <span style={{ color: '#28c840' }}>● 142 ms</span>
          </div>
          <p style={{ marginTop: 10, color: '#e8e8f0' }}>
            Encontrei <span style={{ color: str }}>3 cláusulas</span> com vencimento em 2027: reajuste do contrato de aluguel (mar), renovação de licenças (jul) e garantia de equipamentos (nov).
            <span style={{ display: 'inline-block', width: 8, height: 15, background: p.accent, marginLeft: 4, verticalAlign: -2 }} />
          </p>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {['contrato-aluguel.pdf', 'licencas.xlsx'].map((t) => (
              <span key={t} style={{ fontSize: 11, border: `1px solid ${withAlpha('#ffffff', 0.15)}`, borderRadius: 6, padding: '2px 8px', color: dim }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignalAi({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const head = ff('inter')
  const mono = ff('jetbrains-mono')
  const line = hair(p, 0.1)
  const dark = isDark(p.bg)
  const tile = { background: p.surface, border: `1px solid ${line}`, borderRadius: 20, padding: m ? 18 : 26, position: 'relative' as const, overflow: 'hidden' as const }
  return (
    <SiteRoot p={p} font={mono} name="SIGNAL / AI" style={{ fontSize: 14.5 }}>
      {/* Hero com malha de gradientes */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `radial-gradient(40% 50% at 25% 30%, ${withAlpha(p.accent, dark ? 0.45 : 0.25)}, transparent 70%), radial-gradient(35% 45% at 80% 20%, ${withAlpha(p.secondary, dark ? 0.35 : 0.22)}, transparent 70%), radial-gradient(50% 40% at 60% 90%, ${withAlpha(p.accent, dark ? 0.25 : 0.12)}, transparent 70%)` }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${withAlpha(p.text, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${withAlpha(p.text, 0.05)} 1px, transparent 1px)`, backgroundSize: '56px 56px', maskImage: 'linear-gradient(180deg, #000 30%, transparent 90%)', WebkitMaskImage: 'linear-gradient(180deg, #000 30%, transparent 90%)' }} />
        <header style={{ position: 'relative' }}>
          <Wrap m={m} max={1240} style={{ display: 'flex', alignItems: 'center', gap: 36, height: m ? 62 : 76 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: head, fontWeight: 700, fontSize: m ? 17 : 19, letterSpacing: '-0.02em' }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg, ${p.accent}, ${p.secondary})`, display: 'grid', placeItems: 'center' }}>
                <Icon name="wave" size={16} color="#ffffff" stroke={2.4} />
              </span>
              SIGNAL<span style={{ color: p.muted, fontWeight: 400 }}>/AI</span>
            </span>
            {!m && (
              <nav style={{ display: 'flex', gap: 26, fontSize: 13.5, color: p.muted }}>
                {['Produto', 'Modelos', 'Docs', 'Preços', 'Blog'].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </nav>
            )}
            <div style={{ flex: 1 }} />
            {!m && <span style={{ fontSize: 13.5 }}>Entrar</span>}
            {m ? <Burger color={p.text} /> : <span style={{ background: p.text, color: p.bg, borderRadius: 10, padding: '10px 16px', fontSize: 13.5, fontWeight: 600 }}>Começar grátis</span>}
          </Wrap>
        </header>
        <Wrap m={m} max={1240} style={{ position: 'relative', textAlign: 'center', padding: m ? '40px 20px 48px' : '80px 48px 96px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12.5, border: `1px solid ${withAlpha(p.text, 0.18)}`, borderRadius: 999, padding: '6px 8px 6px 14px', background: withAlpha(p.surface, 0.6) }}>
            Novo: Signal-3 com contexto de 2M tokens
            <span style={{ background: withAlpha(p.accent, 0.25), borderRadius: 999, padding: '2px 8px' }}>→</span>
          </span>
          <h1 style={{ fontFamily: head, fontWeight: 650, fontSize: m ? 42 : 88, lineHeight: 0.98, letterSpacing: '-0.05em', marginTop: 24, maxWidth: 980, marginLeft: 'auto', marginRight: 'auto' }}>
            Modelos que entendem <span style={gradientText(p)}>o seu contexto.</span>
          </h1>
          <p style={{ color: p.muted, fontSize: m ? 14.5 : 17, maxWidth: 620, margin: '22px auto 0', lineHeight: 1.6 }}>API de linguagem para ler contratos, responder clientes e automatizar processos — com seus dados protegidos e latência abaixo de 200 ms.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 30, flexDirection: m ? 'column' : 'row', alignItems: 'center' }}>
            <span style={{ background: `linear-gradient(135deg, ${p.accent}, ${mix(p.accent, p.secondary, 0.6)})`, color: '#ffffff', borderRadius: 12, padding: '14px 24px', fontWeight: 600, fontFamily: head, fontSize: 15, width: m ? '100%' : 'auto' }}>Criar chave de API</span>
            <span style={{ border: `1px solid ${withAlpha(p.text, 0.2)}`, borderRadius: 12, padding: '13px 18px', fontSize: 13.5, background: withAlpha(p.surface, 0.6), width: m ? '100%' : 'auto' }}>
              <span style={{ color: p.muted }}>$</span> pip install signal-ai
            </span>
          </div>
          <div style={{ maxWidth: 1000, margin: m ? '40px auto 0' : '64px auto 0' }}>
            <CodeCard p={p} m={m} />
          </div>
        </Wrap>
      </section>

      {/* Faixa de clientes */}
      <section style={{ borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1240} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: m ? 18 : 24, padding: m ? '22px 20px' : '28px 48px', flexWrap: 'wrap', color: p.muted, fontSize: m ? 13 : 15 }}>
          <span style={{ fontSize: 12, width: m ? '100%' : 'auto' }}>Usado por 4.000 equipes</span>
          {['northwind', 'Lúmina', 'QUADRA', 'tecelagem.io', 'Vetor Bank', 'ondas'].map((t, i) => (
            <span key={t} style={{ fontFamily: i % 2 ? head : mono, fontWeight: i % 2 ? 700 : 500, letterSpacing: i === 2 ? '0.2em' : '-0.01em', opacity: 0.8 }}>
              {t}
            </span>
          ))}
        </Wrap>
      </section>

      {/* Grade bento de recursos */}
      <section>
        <Wrap m={m} max={1240} style={{ padding: m ? '56px 20px' : '112px 48px' }}>
          <div style={{ fontSize: 12.5, color: p.secondary, letterSpacing: '0.12em' }}>// PLATAFORMA</div>
          <h2 style={{ fontFamily: head, fontWeight: 650, fontSize: m ? 32 : 56, letterSpacing: '-0.045em', lineHeight: 1, marginTop: 12, maxWidth: 720 }}>Tudo o que um produto inteligente precisa.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(6, minmax(0, 1fr))', gridAutoRows: m ? 'auto' : 240, gap: 16, marginTop: m ? 28 : 48 }}>
            <div style={{ ...tile, gridColumn: m ? 'auto' : 'span 4' }}>
              <h3 style={{ fontFamily: head, fontWeight: 600, fontSize: m ? 19 : 22 }}>Latência previsível</h3>
              <p style={{ color: p.muted, marginTop: 6, maxWidth: 380 }}>P95 de 180 ms em 14 regiões, inclusive São Paulo.</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: m ? 4 : 6, height: m ? 90 : 100, marginTop: 20 }}>
                {Array.from({ length: m ? 24 : 40 }, (_, i) => {
                  const h = 30 + ((i * 47) % 55) + (i % 7 === 0 ? 15 : 0)
                  return <span key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 3, background: i > (m ? 18 : 32) ? `linear-gradient(180deg, ${p.secondary}, ${p.accent})` : withAlpha(p.accent, 0.35) }} />
                })}
              </div>
            </div>
            <div style={{ ...tile, gridColumn: m ? 'auto' : 'span 2' }}>
              <Icon name="lock" size={26} color={p.secondary} />
              <h3 style={{ fontFamily: head, fontWeight: 600, fontSize: m ? 19 : 22, marginTop: 16 }}>Seus dados ficam seus</h3>
              <p style={{ color: p.muted, marginTop: 6 }}>Nada é usado para treino. Criptografia ponta a ponta.</p>
              <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                {['LGPD', 'SOC 2', 'ISO 27001'].map((t) => (
                  <span key={t} style={{ fontSize: 11.5, border: `1px solid ${line}`, borderRadius: 6, padding: '3px 8px' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ ...tile, gridColumn: m ? 'auto' : 'span 2' }}>
              <h3 style={{ fontFamily: head, fontWeight: 600, fontSize: m ? 19 : 22 }}>Agentes</h3>
              <p style={{ color: p.muted, marginTop: 6 }}>Ferramentas, memória e planos em várias etapas.</p>
              <svg viewBox="0 0 240 110" width="100%" aria-hidden="true" style={{ display: 'block', marginTop: 12 }}>
                {[
                  [40, 55, 120, 25],
                  [40, 55, 120, 85],
                  [120, 25, 200, 55],
                  [120, 85, 200, 55],
                ].map(([a, b, c, d], i) => (
                  <path key={i} d={`M${a} ${b} C ${(a + c) / 2} ${b} ${(a + c) / 2} ${d} ${c} ${d}`} stroke={withAlpha(p.text, 0.25)} strokeWidth={1.5} fill="none" />
                ))}
                {[
                  [40, 55, p.accent],
                  [120, 25, p.secondary],
                  [120, 85, p.secondary],
                  [200, 55, p.accent],
                ].map(([x, y, c], i) => (
                  <g key={i}>
                    <circle cx={x as number} cy={y as number} r={14} fill={withAlpha(c as string, 0.2)} />
                    <circle cx={x as number} cy={y as number} r={6} fill={c as string} />
                  </g>
                ))}
              </svg>
            </div>
            <div style={{ ...tile, gridColumn: m ? 'auto' : 'span 2' }}>
              <h3 style={{ fontFamily: head, fontWeight: 600, fontSize: m ? 19 : 22 }}>Multilíngue</h3>
              <p style={{ color: p.muted, marginTop: 6 }}>Português nativo e mais 40 idiomas.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
                {['olá', 'hello', 'hola', 'bonjour', 'ciao', 'hallo', 'merhaba'].map((t, i) => (
                  <span key={t} style={{ fontSize: 13, borderRadius: 999, padding: '4px 10px', background: i === 0 ? withAlpha(p.accent, 0.25) : withAlpha(p.text, 0.06) }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ ...tile, gridColumn: m ? 'auto' : 'span 2' }}>
              <h3 style={{ fontFamily: head, fontWeight: 600, fontSize: m ? 19 : 22 }}>Ajuste fino</h3>
              <p style={{ color: p.muted, marginTop: 6 }}>Treine com 500 exemplos em minutos.</p>
              <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
                {[0.72, 0.4, 0.9].map((v, i) => (
                  <div key={i} style={{ height: 6, borderRadius: 3, background: withAlpha(p.text, 0.1), position: 'relative' }}>
                    <span style={{ position: 'absolute', inset: 0, width: `${v * 100}%`, borderRadius: 3, background: `linear-gradient(90deg, ${p.accent}, ${p.secondary})` }} />
                    <span style={{ position: 'absolute', left: `calc(${v * 100}% - 7px)`, top: -4, width: 14, height: 14, borderRadius: '50%', background: p.text }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Benchmarks */}
      <section style={{ borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1240} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 4fr) minmax(0, 7fr)', gap: m ? 28 : 64, padding: m ? '56px 20px' : '104px 48px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12.5, color: p.secondary, letterSpacing: '0.12em' }}>// AVALIAÇÕES</div>
            <h2 style={{ fontFamily: head, fontWeight: 650, fontSize: m ? 30 : 46, letterSpacing: '-0.04em', lineHeight: 1.04, marginTop: 12 }}>Mais preciso em português.</h2>
            <p style={{ color: p.muted, marginTop: 14 }}>Resultados em conjuntos de teste públicos traduzidos e revisados por linguistas.</p>
          </div>
          <div style={{ display: 'grid', gap: 22 }}>
            {[
              ['Compreensão de documentos', [92, 84, 79]],
              ['Raciocínio jurídico', [88, 76, 71]],
              ['Atendimento ao cliente', [95, 89, 86]],
            ].map(([t, vals]) => (
              <div key={t as string}>
                <div style={{ fontFamily: head, fontWeight: 600, fontSize: 15, marginBottom: 10 }}>{t as string}</div>
                {(vals as number[]).map((v, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: m ? '80px 1fr 34px' : '110px 1fr 40px', gap: 12, alignItems: 'center', fontSize: 12.5, marginTop: 6 }}>
                    <span style={{ color: i === 0 ? p.text : p.muted }}>{['Signal-3', 'Modelo A', 'Modelo B'][i]}</span>
                    <span style={{ height: 10, borderRadius: 5, background: withAlpha(p.text, 0.06) }}>
                      <span style={{ display: 'block', height: '100%', width: `${v}%`, borderRadius: 5, background: i === 0 ? `linear-gradient(90deg, ${p.accent}, ${p.secondary})` : withAlpha(p.text, 0.25) }} />
                    </span>
                    <span style={{ textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Preços */}
      <section style={{ borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1240} style={{ padding: m ? '56px 20px' : '104px 48px' }}>
          <h2 style={{ fontFamily: head, fontWeight: 650, fontSize: m ? 30 : 46, letterSpacing: '-0.04em', textAlign: 'center' }}>Pague pelo que usar.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 16, marginTop: m ? 24 : 44 }}>
            {(
              [
                ['Grátis', 'R$ 0', '1M tokens/mês', ['Signal-3 mini', 'Comunidade', '3 projetos'], 'code'],
                ['Pro', 'R$ 0,80', 'por 1M tokens', ['Todos os modelos', 'Ajuste fino', 'Suporte em 24 h'], 'bolt'],
                ['Empresa', 'Sob medida', 'volume e SLA', ['Nuvem dedicada', 'SSO e auditoria', 'Engenheiro dedicado'], 'shield'],
              ] as [string, string, string, string[], IconName][]
            ).map(([n, price, sub, items, icon], i) => (
              <div key={n} style={{ borderRadius: 20, padding: 2, background: i === 1 ? `linear-gradient(135deg, ${p.accent}, ${p.secondary})` : line }}>
                <div style={{ borderRadius: 18, background: p.surface, padding: m ? 20 : 28, height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: head, fontWeight: 600, fontSize: 17 }}>{n}</span>
                    <Icon name={icon} size={20} color={i === 1 ? p.secondary : p.muted} />
                  </div>
                  <div style={{ fontFamily: head, fontWeight: 650, fontSize: m ? 32 : 40, letterSpacing: '-0.04em', marginTop: 16 }}>{price}</div>
                  <div style={{ color: p.muted, fontSize: 13 }}>{sub}</div>
                  <ul style={{ display: 'grid', gap: 10, marginTop: 20 }}>
                    {items.map((t) => (
                      <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <Icon name="check" size={16} color={p.secondary} stroke={2.4} /> {t}
                      </li>
                    ))}
                  </ul>
                  <span style={{ display: 'block', textAlign: 'center', marginTop: 24, borderRadius: 10, padding: '12px 0', fontWeight: 600, background: i === 1 ? p.text : 'transparent', color: i === 1 ? p.bg : p.text, border: i === 1 ? 'none' : `1px solid ${withAlpha(p.text, 0.2)}` }}>
                    {i === 2 ? 'Falar com vendas' : 'Começar'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* CTA final */}
      <section>
        <Wrap m={m} max={1240} style={{ paddingBottom: m ? 48 : 96 }}>
          <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', padding: m ? '44px 22px' : '88px 48px', textAlign: 'center', background: `radial-gradient(60% 120% at 50% 100%, ${withAlpha(p.accent, 0.5)}, transparent 70%), ${p.surface}`, border: `1px solid ${line}` }}>
            <h2 style={{ fontFamily: head, fontWeight: 650, fontSize: m ? 32 : 60, letterSpacing: '-0.045em', lineHeight: 1 }}>
              Construa algo <span style={gradientText(p)}>inteligente</span> hoje.
            </h2>
            <p style={{ color: p.muted, marginTop: 14 }}>US$ 0 para começar. Sem cartão de crédito.</p>
            <span style={{ display: 'inline-block', marginTop: 26, background: p.text, color: p.bg, borderRadius: 12, padding: '14px 26px', fontWeight: 600, fontFamily: head }}>Criar conta grátis</span>
          </div>
        </Wrap>
      </section>

      <footer style={{ borderTop: `1px solid ${line}`, fontSize: 13 }}>
        <Wrap m={m} max={1240} style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '2fr repeat(3, 1fr)', gap: 24, padding: m ? '36px 20px' : '56px 48px' }}>
          <div style={{ gridColumn: m ? '1 / -1' : 'auto' }}>
            <span style={{ fontFamily: head, fontWeight: 700, fontSize: 17 }}>SIGNAL/AI</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: p.muted }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} /> Todos os sistemas operacionais
            </div>
            <div style={{ color: p.muted, marginTop: 8 }}>© 2026 — empresa fictícia</div>
          </div>
          {[
            ['Produto', ['Modelos', 'Agentes', 'Preços', 'Status']],
            ['Desenvolvedores', ['Docs', 'Referência da API', 'SDKs', 'Changelog']],
            ['Empresa', ['Sobre', 'Segurança', 'Carreiras', 'Contato']],
          ].map(([t, items]) => (
            <div key={t as string}>
              <div style={{ color: p.muted }}>{t as string}</div>
              <ul style={{ display: 'grid', gap: 6, marginTop: 10 }}>
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
