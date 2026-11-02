import { mix } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, Wrap, type SiteProps } from './kit'

type CaseArt = 'orbs' | 'stripes' | 'arch' | 'grid'

/** Composições geométricas que representam os cases. */
function CaseVisual({ p, art, bg, fg, height }: { p: SitePalette; art: CaseArt; bg: string; fg: string; height: number }) {
  return (
    <div style={{ position: 'relative', height, background: bg, overflow: 'hidden', borderRadius: 4 }}>
      {art === 'orbs' && (
        <>
          <span style={{ position: 'absolute', left: '12%', top: '18%', width: '46%', aspectRatio: '1', borderRadius: '50%', background: fg }} />
          <span style={{ position: 'absolute', right: '10%', bottom: '-14%', width: '52%', aspectRatio: '1', borderRadius: '50%', border: `${Math.round(height / 22)}px solid ${p.bg}` }} />
          <span style={{ position: 'absolute', left: '44%', top: '46%', width: '14%', aspectRatio: '1', borderRadius: '50%', background: p.bg }} />
        </>
      )}
      {art === 'stripes' && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(-45deg, ${fg} 0 22px, transparent 22px 44px)`, opacity: 0.9 }} />
          <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontFamily: ff('space-grotesk'), fontWeight: 700, fontSize: height / 3.2, color: p.bg, letterSpacing: '-0.05em', mixBlendMode: 'normal', background: bg, padding: '0 16px' }}>
            Mareia
          </span>
        </>
      )}
      {art === 'arch' && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ position: 'absolute', left: `${10 + i * 20}%`, bottom: 0, width: '18%', height: `${40 + i * 14}%`, borderRadius: '999px 999px 0 0', background: i % 2 ? fg : p.bg }} />
          ))}
        </>
      )}
      {art === 'grid' && (
        <div style={{ position: 'absolute', inset: '12%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} style={{ borderRadius: [0, 4, 7, 9].includes(i) ? '50%' : i % 3 === 0 ? '999px 0 0 999px' : 4, background: [1, 6, 11].includes(i) ? p.bg : fg, opacity: [2, 5, 8].includes(i) ? 0.45 : 1 }} />
          ))}
        </div>
      )}
    </div>
  )
}

const CASES: { name: string; desc: string; tags: string; art: CaseArt; tone: 'a' | 's' | 't' | 'm'; tall: boolean }[] = [
  { name: 'Mareia', desc: 'Rebranding de cervejaria artesanal do litoral', tags: 'Identidade · Embalagem', art: 'stripes', tone: 's', tall: true },
  { name: 'Ponto Cego', desc: 'Festival de cinema independente', tags: 'Identidade · Motion', art: 'orbs', tone: 'a', tall: false },
  { name: 'Lote 7', desc: 'Incorporadora com obras de baixo impacto', tags: 'Estratégia · Digital', art: 'arch', tone: 'm', tall: false },
  { name: 'Ruído Bom', desc: 'App de meditação com sons urbanos', tags: 'Produto · Sistema visual', art: 'grid', tone: 't', tall: true },
]

export default function ArcStudio({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const g = ff('space-grotesk')
  const line = hair(p, 0.16)
  const tone = (t: 'a' | 's' | 't' | 'm'): [string, string] =>
    t === 'a' ? [p.accent, p.secondary] : t === 's' ? [p.secondary, p.accent] : t === 't' ? [p.text, p.accent] : [mix(p.bg, p.text, 0.08), p.accent]
  return (
    <SiteRoot p={p} font={g} name="ARC STUDIO">
      {/* Header */}
      <header>
        <Wrap m={m} max={1400} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: m ? 64 : 84 }}>
          <span style={{ fontWeight: 700, fontSize: m ? 26 : 32, letterSpacing: '-0.06em' }}>
            arc<sup style={{ fontSize: '0.4em', marginLeft: 2 }}>®</sup>
          </span>
          {!m && (
            <nav style={{ display: 'flex', gap: 34, fontSize: 15, fontWeight: 500 }}>
              {['Trabalhos', 'Serviços', 'Estúdio', 'Contato'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </nav>
          )}
          {m ? (
            <Burger color={p.text} />
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, border: `1px solid ${line}`, borderRadius: 999, padding: '8px 16px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2fbf71' }} /> Agenda aberta para 2027
            </span>
          )}
        </Wrap>
      </header>

      {/* Hero tipográfico gigante */}
      <section>
        <Wrap m={m} max={1400} style={{ padding: m ? '32px 20px 40px' : '64px 48px 72px' }}>
          <h1 style={{ fontWeight: 600, fontSize: m ? 54 : 158, lineHeight: 0.9, letterSpacing: '-0.065em' }}>
            Fazemos marcas{' '}
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle', width: m ? 84 : 240, height: m ? 44 : 120, borderRadius: 999, background: p.accent, color: p.onAccent, transform: 'translateY(-6%)' }}>
              <Icon name="arrow" size={m ? 26 : 70} color={p.onAccent} stroke={2} />
            </span>{' '}
            que não pedem <span style={{ color: 'transparent', WebkitTextStroke: `${m ? 1.5 : 2.5}px ${p.text}` }}>licença</span>
            <span style={{ color: p.secondary }}>.</span>
          </h1>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(12, minmax(0, 1fr))', gap: 24, marginTop: m ? 28 : 64, alignItems: 'end' }}>
            <p style={{ gridColumn: m ? 'auto' : '1 / span 5', fontSize: m ? 16 : 20, lineHeight: 1.45, fontFamily: ff('inter') }}>
              Somos um estúdio independente de branding e design digital. Doze pessoas, uma mesa grande e nenhuma apresentação com mais de 20 slides.
            </p>
            <div style={{ gridColumn: m ? 'auto' : '10 / span 3', display: 'flex', alignItems: 'center', gap: 14, justifySelf: m ? 'start' : 'end' }}>
              <span style={{ width: m ? 56 : 72, height: m ? 56 : 72, borderRadius: '50%', background: p.text, display: 'grid', placeItems: 'center' }}>
                <Icon name="play" size={m ? 20 : 24} color={p.bg} fill={p.bg} />
              </span>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                Showreel 2026
                <br />
                <span style={{ color: p.muted, fontWeight: 400, fontSize: 14 }}>1 min 42 s</span>
              </span>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Faixa de serviços vazada */}
      <div style={{ borderTop: `1px solid ${p.text}`, borderBottom: `1px solid ${p.text}`, overflow: 'hidden', whiteSpace: 'nowrap', padding: m ? '14px 0' : '22px 0' }}>
        {['Branding', 'Identidade', 'Motion', 'Digital', 'Embalagem', 'Branding', 'Identidade', 'Motion'].map((t, i) => (
          <span key={i} style={{ fontSize: m ? 40 : 88, fontWeight: 600, letterSpacing: '-0.05em', marginRight: m ? 20 : 40, color: i % 2 ? p.text : 'transparent', WebkitTextStroke: i % 2 ? undefined : `1.5px ${p.text}` }}>
            {t} <span style={{ color: p.secondary, WebkitTextStroke: '0' }}>✦</span>
          </span>
        ))}
      </div>

      {/* Grade assimétrica de cases */}
      <section>
        <Wrap m={m} max={1400} style={{ padding: m ? '48px 20px' : '112px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16 }}>
            <h2 style={{ fontWeight: 600, fontSize: m ? 34 : 72, letterSpacing: '-0.055em', lineHeight: 0.95 }}>Trabalhos selecionados</h2>
            <span style={{ fontFamily: ff('inter'), fontSize: 14.5, whiteSpace: 'nowrap', borderBottom: `1px solid ${p.text}` }}>Todos (48)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: m ? 32 : 40, marginTop: m ? 28 : 56, alignItems: 'start' }}>
            {(m ? [CASES] : [[CASES[0], CASES[2]], [CASES[1], CASES[3]]]).map((col, ci) => (
              <div key={ci} style={{ display: 'grid', gap: m ? 32 : 56, paddingTop: !m && ci === 1 ? 140 : 0 }}>
                {col.map((c) => {
                  const [bg, fg] = tone(c.tone)
                  return (
                    <article key={c.name}>
                      <CaseVisual p={p} art={c.art} bg={bg} fg={fg} height={m ? 260 : c.tall ? 620 : 460} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 16, alignItems: 'baseline', flexWrap: 'wrap' }}>
                        <h3 style={{ fontWeight: 600, fontSize: m ? 24 : 32, letterSpacing: '-0.04em' }}>{c.name}</h3>
                        <span style={{ fontFamily: ff('inter'), fontSize: 13.5, color: p.muted }}>{c.tags}</span>
                      </div>
                      <p style={{ fontFamily: ff('inter'), color: p.muted, fontSize: m ? 15 : 16, marginTop: 4 }}>{c.desc}</p>
                    </article>
                  )
                })}
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Serviços em linhas grandes */}
      <section style={{ borderTop: `1px solid ${p.text}` }}>
        <Wrap m={m} max={1400} style={{ padding: m ? '40px 20px' : '96px 48px' }}>
          <div style={{ fontFamily: ff('inter'), fontSize: 13, letterSpacing: '0.2em', color: p.muted, fontWeight: 600 }}>O QUE FAZEMOS</div>
          <div style={{ marginTop: m ? 16 : 28 }}>
            {[
              ['01', 'Estratégia de marca', 'Posicionamento, naming e arquitetura de marca.'],
              ['02', 'Identidade visual', 'Logotipo, tipografia, cor e sistema gráfico completo.'],
              ['03', 'Design digital', 'Sites, produtos e design systems que escalam.'],
              ['04', 'Motion & conteúdo', 'Vinhetas, campanhas e assets para redes.'],
            ].map(([n, t, d], i) => (
              <div
                key={n}
                style={{
                  display: 'grid',
                  gridTemplateColumns: m ? '36px 1fr' : '80px 1.4fr 1fr 60px',
                  gap: m ? 10 : 24,
                  alignItems: 'center',
                  padding: m ? '18px 12px' : '28px 24px',
                  margin: m ? '0 -12px' : '0 -24px',
                  borderTop: `1px solid ${line}`,
                  background: i === 1 ? p.accent : 'transparent',
                  color: i === 1 ? p.onAccent : p.text,
                  borderRadius: i === 1 ? 6 : 0,
                }}
              >
                <span style={{ fontFamily: ff('jetbrains-mono'), fontSize: 13, opacity: 0.7 }}>{n}</span>
                <span style={{ fontWeight: 600, fontSize: m ? 24 : 54, letterSpacing: '-0.045em', lineHeight: 1 }}>{t}</span>
                {!m && <span style={{ fontFamily: ff('inter'), fontSize: 16, opacity: 0.8 }}>{d}</span>}
                {!m && <Icon name="arrowUp" size={32} color={i === 1 ? p.onAccent : p.text} stroke={1.6} />}
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Clientes + números */}
      <section style={{ background: p.surface, borderTop: `1px solid ${p.text}`, borderBottom: `1px solid ${p.text}` }}>
        <Wrap m={m} max={1400} style={{ padding: m ? '40px 20px' : '88px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', borderLeft: `1px solid ${line}`, borderTop: `1px solid ${line}` }}>
            {[
              ['MAREIA', { fontWeight: 800, letterSpacing: '0.2em' }],
              ['ponto cego', { fontFamily: ff('fraunces'), fontStyle: 'italic', fontSize: 28 }],
              ['LOTE/7', { fontFamily: ff('jetbrains-mono'), fontWeight: 700 }],
              ['Ruído Bom', { fontWeight: 300, letterSpacing: '-0.04em', fontSize: 30 }],
              ['NORTE&CO', { fontWeight: 700, fontStyle: 'italic' }],
              ['ovo', { fontWeight: 800, fontSize: 34, letterSpacing: '-0.08em' }],
              ['Casa Tâmara', { fontFamily: ff('georgia'), fontSize: 24 }],
              ['VÉRTICE', { fontWeight: 500, letterSpacing: '0.35em', fontSize: 16 }],
            ].map(([t, st]) => (
              <div key={t as string} style={{ height: m ? 96 : 140, display: 'grid', placeItems: 'center', borderRight: `1px solid ${line}`, borderBottom: `1px solid ${line}`, fontSize: 22, color: mix(p.text, p.bg, 0.15), ...(st as object) }}>
                {t as string}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: m ? 18 : 24, marginTop: m ? 32 : 64 }}>
            {[
              ['12', 'anos de estúdio'],
              ['180+', 'marcas lançadas'],
              ['9', 'prêmios de design'],
            ].map(([n, t]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <span style={{ fontWeight: 600, fontSize: m ? 64 : 120, letterSpacing: '-0.06em', lineHeight: 0.9, color: p.accent }}>{n}</span>
                <span style={{ fontFamily: ff('inter'), fontSize: 15, color: p.muted }}>{t}</span>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Contato gigante */}
      <footer>
        <Wrap m={m} max={1400} style={{ padding: m ? '48px 20px 28px' : '112px 48px 40px' }}>
          <div style={{ fontFamily: ff('inter'), fontSize: 14, color: p.muted }}>Tem um projeto em mente?</div>
          <h2 style={{ fontWeight: 600, fontSize: m ? 58 : 190, letterSpacing: '-0.07em', lineHeight: 0.85, marginTop: 12 }}>
            Vamos <span style={{ fontFamily: ff('fraunces'), fontStyle: 'italic', fontWeight: 400, color: p.secondary }}>conversar</span>?
          </h2>
          <div style={{ display: 'inline-block', marginTop: m ? 24 : 40, fontSize: m ? 20 : 40, fontWeight: 500, letterSpacing: '-0.03em', borderBottom: `3px solid ${p.accent}`, paddingBottom: 4 }}>oi@arcstudio.exemplo</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginTop: m ? 40 : 96, paddingTop: 20, borderTop: `1px solid ${p.text}`, fontFamily: ff('inter'), fontSize: 14 }}>
            <span>Rua Augusta, 1500 — São Paulo</span>
            <span style={{ display: 'flex', gap: 20 }}>
              {['Instagram', 'Behance', 'LinkedIn'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </span>
            <span style={{ color: p.muted }}>© 2026 arc® — estúdio fictício</span>
          </div>
        </Wrap>
      </footer>
      <div style={{ height: 10, background: `linear-gradient(90deg, ${p.accent} 0 50%, ${p.secondary} 50% 100%)` }} />
    </SiteRoot>
  )
}
