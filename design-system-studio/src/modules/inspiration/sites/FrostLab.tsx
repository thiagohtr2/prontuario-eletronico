import { isDark, mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Burger, ff, hair, Icon, SiteRoot, useSvgId, Wrap, type IconName, type SiteProps } from './kit'

/** Geladeira French Door em vista frontal. */
function Fridge({ p, finish }: { p: SitePalette; finish?: string }) {
  const id = useSvgId('frost-fr')
  const steel = finish ?? (isDark(p.bg) ? '#9aa3ad' : '#d9dee3')
  const a = mix(steel, '#ffffff', 0.45)
  const b = mix(steel, '#000000', 0.12)
  const edge = mix(steel, '#000000', 0.3)
  const handle = mix(steel, '#000000', 0.45)
  return (
    <svg viewBox="0 0 360 620" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id('steel')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={b} />
          <stop offset="0.35" stopColor={a} />
          <stop offset="0.6" stopColor={steel} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <linearGradient id={id('shine')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx={180} cy={606} rx={170} ry={10} fill={withAlpha('#000000', 0.18)} />
      <rect x={14} y={10} width={332} height={584} rx={20} fill={edge} />
      <rect x={18} y={14} width={160} height={350} rx={16} fill={`url(#${id('steel')})`} />
      <rect x={182} y={14} width={160} height={350} rx={16} fill={`url(#${id('steel')})`} />
      <rect x={18} y={370} width={324} height={218} rx={16} fill={`url(#${id('steel')})`} />
      <path d="M30 30 L150 340" stroke={`url(#${id('shine')})`} strokeWidth={60} opacity={0.5} />
      <path d="M200 30 L320 340" stroke={`url(#${id('shine')})`} strokeWidth={40} opacity={0.4} />
      {/* Dispensador */}
      <rect x={52} y={96} width={92} height={150} rx={12} fill={mix(steel, '#000000', 0.55)} />
      <rect x={62} y={106} width={72} height={30} rx={5} fill={mix(p.accent, '#000000', 0.55)} />
      <text x={98} y={127} textAnchor="middle" fontSize={15} fill={mix(p.accent, '#ffffff', 0.6)} fontFamily={ff('jetbrains-mono')} fontWeight={600}>
        3°C
      </text>
      <rect x={82} y={150} width={32} height={46} rx={6} fill={mix(steel, '#000000', 0.7)} />
      <rect x={62} y={226} width={72} height={8} rx={4} fill={mix(steel, '#000000', 0.35)} />
      {/* Puxadores */}
      <rect x={160} y={110} width={9} height={170} rx={4.5} fill={handle} />
      <rect x={191} y={110} width={9} height={170} rx={4.5} fill={handle} />
      <rect x={110} y={392} width={140} height={9} rx={4.5} fill={handle} />
      <text x={180} y={570} textAnchor="middle" fontSize={9} letterSpacing={3} fill={edge} fontFamily={ff('inter')} fontWeight={700}>
        FROST LAB
      </text>
      <rect x={34} y={594} width={24} height={10} rx={2} fill={edge} />
      <rect x={302} y={594} width={24} height={10} rx={2} fill={edge} />
    </svg>
  )
}

const CALLOUTS: { label: string; detail: string; x: number; y: number; side: 'l' | 'r' }[] = [
  { label: 'Dispensador filtrado', detail: 'Água gelada e gelo em cubos', x: 39, y: 24, side: 'l' },
  { label: 'Zona Flex', detail: 'De −2 °C a 5 °C, para carnes ou bebidas', x: 47, y: 68, side: 'l' },
  { label: 'Inverter silencioso', detail: '38 dB — mais baixo que uma conversa', x: 68, y: 46, side: 'r' },
  { label: 'Porta dentro da porta', detail: 'Pegue o que usa sem perder frio', x: 62, y: 16, side: 'r' },
]

const SPECS: [string, string, string, IconName][] = [
  ['640', 'litros', 'capacidade total', 'grid'],
  ['A+++', 'Procel', 'eficiência energética', 'bolt'],
  ['38', 'dB', 'nível de ruído', 'waves'],
  ['−22', '°C', 'congelamento rápido', 'snow'],
]

export default function FrostLab({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const sans = ff('inter')
  const line = hair(p, 0.12)
  const panel = `linear-gradient(160deg, ${mix(p.bg, p.secondary, 0.55)} 0%, ${mix(p.bg, p.secondary, 0.2)} 60%, ${p.bg} 100%)`
  return (
    <SiteRoot p={p} font={sans} name="FROST LAB">
      {/* Barra utilitária */}
      {!m && (
        <div style={{ borderBottom: `1px solid ${line}`, fontSize: 12.5, color: p.muted }}>
          <Wrap m={m} max={1280} style={{ display: 'flex', justifyContent: 'space-between', height: 34, alignItems: 'center' }}>
            <span>Atendimento 0800 400 2040 · Instalação grátis nas capitais · Rastrear pedido</span>
            <span>Seja um revendedor</span>
          </Wrap>
        </div>
      )}

      {/* Header de loja com categorias */}
      <header style={{ borderBottom: `1px solid ${line}`, background: p.surface }}>
        <Wrap m={m} max={1280} style={{ display: 'flex', alignItems: 'center', gap: m ? 12 : 32, height: m ? 60 : 76 }}>
          {m && <Burger color={p.text} />}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800, letterSpacing: '0.08em', fontSize: m ? 16 : 18 }}>
            <span style={{ width: m ? 28 : 32, height: m ? 28 : 32, borderRadius: 8, background: p.accent, display: 'grid', placeItems: 'center' }}>
              <Icon name="snow" size={m ? 16 : 18} color={p.onAccent} stroke={2.2} />
            </span>
            FROST LAB
          </span>
          {!m && (
            <nav style={{ display: 'flex', gap: 22, fontSize: 14.5, fontWeight: 500 }}>
              {['Geladeiras', 'Lava e seca', 'Cozinha', 'Climatização'].map((t, i) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: i === 0 ? p.accent : p.text }}>
                  {t}
                  <Icon name="chevron" size={14} />
                </span>
              ))}
            </nav>
          )}
          <div style={{ flex: 1 }} />
          {!m && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, width: 280, height: 42, borderRadius: 999, border: `1px solid ${line}`, padding: '0 16px', color: p.muted, fontSize: 14, background: p.bg }}>
              <Icon name="search" size={17} /> Buscar produtos, peças…
            </span>
          )}
          {m && <Icon name="search" size={21} />}
          {!m && <Icon name="user" size={21} />}
          <span style={{ position: 'relative' }}>
            <Icon name="bag" size={22} />
            <span style={{ position: 'absolute', top: -6, right: -8, minWidth: 17, height: 17, borderRadius: 9, background: p.accent, color: p.onAccent, fontSize: 10.5, fontWeight: 700, display: 'grid', placeItems: 'center' }}>1</span>
          </span>
        </Wrap>
      </header>

      {/* Hero de produto com especificações anotadas */}
      <section>
        <Wrap m={m} max={1280} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 5fr) minmax(0, 7fr)', gap: m ? 24 : 56, padding: m ? '20px 20px 40px' : '40px 48px 80px', alignItems: 'start' }}>
          <div style={{ order: m ? 2 : 1, paddingTop: m ? 0 : 28 }}>
            <div style={{ fontSize: 13, color: p.muted }}>Geladeiras › French Door</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <span style={{ background: p.accent, color: p.onAccent, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6, letterSpacing: '0.04em' }}>LANÇAMENTO</span>
              <span style={{ border: `1px solid ${line}`, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6 }}>Série Polar</span>
            </div>
            <h1 style={{ fontWeight: 700, fontSize: m ? 32 : 48, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 14 }}>Polar FD-640 French Door Inverse</h1>
            <p style={{ color: p.muted, fontSize: m ? 15.5 : 18, marginTop: 10 }}>Frescor preciso, por mais tempo.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 14 }}>
              <span style={{ display: 'flex', gap: 2 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star" size={16} color={p.accent} fill={p.accent} stroke={1} />
                ))}
              </span>
              <strong>4,9</strong>
              <span style={{ color: p.muted }}>(1.284 avaliações)</span>
            </div>
            <div style={{ marginTop: 24, fontSize: 13.5, fontWeight: 600 }}>Acabamento</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {[
                ['Inox escovado', '#cfd5da'],
                ['Preto fosco', '#2a2d31'],
                ['Branco neve', '#f4f5f6'],
              ].map(([t, c], i) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1.5px solid ${i === 0 ? p.accent : line}`, borderRadius: 10, padding: '8px 12px', fontSize: 13.5 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: c, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.2)' }} />
                  {t}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 18, fontSize: 13.5, fontWeight: 600 }}>Capacidade</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {['540 L', '640 L'].map((t, i) => (
                <span key={t} style={{ border: `1.5px solid ${i === 1 ? p.accent : line}`, borderRadius: 10, padding: '8px 18px', fontSize: 13.5, fontWeight: i === 1 ? 700 : 500 }}>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 26, padding: '20px 0', borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
              <div style={{ fontSize: 13.5, color: p.muted, textDecoration: 'line-through' }}>R$ 9.990</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: m ? 34 : 40, fontWeight: 800, letterSpacing: '-0.03em' }}>R$ 8.990</span>
                <span style={{ fontSize: 14, color: p.muted }}>ou 10× de R$ 899 sem juros</span>
              </div>
              <div style={{ fontSize: 14, color: p.accent, fontWeight: 600, marginTop: 2 }}>R$ 8.540 no Pix (5% off)</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: 10, marginTop: 20 }}>
              <span style={{ background: p.accent, color: p.onAccent, borderRadius: 10, padding: '15px 0', fontWeight: 700, textAlign: 'center' }}>Comprar agora</span>
              <span style={{ border: `1.5px solid ${p.text}`, borderRadius: 10, padding: '14px 0', fontWeight: 600, textAlign: 'center' }}>Adicionar ao carrinho</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 13.5, color: p.muted }}>
              <Icon name="truck" size={18} color={p.accent} /> Entrega em 3 dias úteis · Instalação grátis
            </div>
          </div>

          <div style={{ order: m ? 1 : 2, position: 'relative', background: panel, borderRadius: m ? 18 : 28, height: m ? 400 : 720, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${withAlpha(p.text, 0.08)} 1px, transparent 1px)`, backgroundSize: '22px 22px' }} />
            <div style={{ position: 'absolute', left: '50%', top: m ? 30 : 60, bottom: m ? 24 : 50, width: m ? 200 : 360, transform: 'translateX(-50%)' }}>
              <Fridge p={p} />
            </div>
            {CALLOUTS.map((c, i) => (
              <div
                key={c.label}
                style={{
                  position: 'absolute',
                  top: `${c.y + (m ? 4 : 6)}%`,
                  ...(c.side === 'l' ? { right: `${100 - (m ? 30 + c.x * 0.2 : c.x)}%` } : { left: `${m ? 62 + (c.x - 70) * 0.2 : c.x}%` }),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexDirection: c.side === 'l' ? 'row-reverse' : 'row',
                }}
              >
                <span style={{ width: m ? 22 : 26, height: m ? 22 : 26, borderRadius: '50%', background: p.accent, color: p.onAccent, fontSize: m ? 11 : 12.5, fontWeight: 700, display: 'grid', placeItems: 'center', boxShadow: `0 0 0 6px ${withAlpha(p.accent, 0.2)}` }}>{i + 1}</span>
                {!m && (
                  <>
                    <span style={{ width: 28, height: 1, background: withAlpha(p.text, 0.4) }} />
                    <span style={{ background: p.surface, borderRadius: 12, padding: '10px 14px', boxShadow: `0 8px 24px ${withAlpha('#000000', 0.08)}`, width: 184 }}>
                      <strong style={{ display: 'block', fontSize: 14 }}>{c.label}</strong>
                      <span style={{ fontSize: 12.5, color: p.muted, lineHeight: 1.35, display: 'block' }}>{c.detail}</span>
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </Wrap>
        {m && (
          <Wrap m={m} style={{ marginTop: -16, paddingBottom: 32, display: 'grid', gap: 10 }}>
            {CALLOUTS.map((c, i) => (
              <div key={c.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14 }}>
                <span style={{ width: 22, height: 22, flex: 'none', borderRadius: '50%', background: p.accent, color: p.onAccent, fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{i + 1}</span>
                <span>
                  <strong>{c.label}</strong> <span style={{ color: p.muted }}>— {c.detail}</span>
                </span>
              </div>
            ))}
          </Wrap>
        )}
      </section>

      {/* Faixa de especificações em destaque */}
      <section style={{ background: p.text, color: p.bg }}>
        <Wrap m={m} max={1280} style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 24 : 32, padding: m ? '36px 20px' : '56px 48px' }}>
          {SPECS.map(([n, u, t, icon]) => (
            <div key={t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {!m && (
                <span style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${withAlpha(p.bg, 0.25)}`, display: 'grid', placeItems: 'center' }}>
                  <Icon name={icon} size={22} color={p.bg} />
                </span>
              )}
              <div>
                <div style={{ fontSize: m ? 30 : 40, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {n} <span style={{ fontSize: m ? 14 : 16, fontWeight: 600, opacity: 0.7, letterSpacing: 0 }}>{u}</span>
                </div>
                <div style={{ fontSize: 13.5, opacity: 0.7, marginTop: 6 }}>{t}</div>
              </div>
            </div>
          ))}
        </Wrap>
      </section>

      {/* Recursos em blocos */}
      <section style={{ padding: m ? '48px 0' : '104px 0' }}>
        <Wrap m={m} max={1280}>
          <h2 style={{ fontWeight: 750, fontSize: m ? 28 : 44, letterSpacing: '-0.03em', maxWidth: 640, lineHeight: 1.08 }}>Tecnologia que você não vê. Frescor que você percebe.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: m ? 14 : 24, marginTop: m ? 24 : 44 }}>
            <div style={{ background: p.surface, border: `1px solid ${line}`, borderRadius: 20, padding: m ? 22 : 36 }}>
              <h3 style={{ fontWeight: 700, fontSize: m ? 19 : 24 }}>Frescor 3× mais longo</h3>
              <p style={{ color: p.muted, marginTop: 8, fontSize: m ? 14 : 15.5 }}>Umidade controlada na gaveta de hortifrúti. Teste de laboratório com folhas verdes:</p>
              <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
                {[
                  ['Geladeira comum', 5, 32],
                  ['Polar FD-640', 15, 96],
                ].map(([t, d, w], i) => (
                  <div key={t as string}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                      <span>{t}</span>
                      <strong>{d} dias</strong>
                    </div>
                    <div style={{ height: 12, borderRadius: 6, background: withAlpha(p.text, 0.08) }}>
                      <div style={{ width: `${w}%`, height: '100%', borderRadius: 6, background: i ? p.accent : withAlpha(p.text, 0.3) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: p.surface, border: `1px solid ${line}`, borderRadius: 20, padding: m ? 22 : 36, display: 'flex', gap: 24, alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 700, fontSize: m ? 19 : 24 }}>Conectada ao seu celular</h3>
                <p style={{ color: p.muted, marginTop: 8, fontSize: m ? 14 : 15.5 }}>Ajuste a temperatura de onde estiver e receba aviso se a porta ficar aberta.</p>
              </div>
              <div style={{ width: m ? 96 : 130, flex: 'none', aspectRatio: '9 / 17', borderRadius: 18, border: `5px solid ${p.text}`, background: p.bg, padding: 10, display: 'grid', alignContent: 'start', gap: 8 }}>
                <span style={{ fontSize: m ? 8 : 10, color: p.muted }}>Geladeira</span>
                <span style={{ fontSize: m ? 22 : 30, fontWeight: 800, lineHeight: 1, color: p.accent }}>3°</span>
                <span style={{ height: 6, borderRadius: 3, background: withAlpha(p.accent, 0.25) }}>
                  <span style={{ display: 'block', width: '40%', height: '100%', borderRadius: 3, background: p.accent }} />
                </span>
                <span style={{ fontSize: m ? 8 : 10, color: p.muted, marginTop: 4 }}>Freezer</span>
                <span style={{ fontSize: m ? 16 : 20, fontWeight: 800, lineHeight: 1 }}>−18°</span>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Ficha técnica */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 4fr) minmax(0, 8fr)', gap: m ? 20 : 56, padding: m ? '48px 20px' : '96px 48px' }}>
          <div>
            <h2 style={{ fontWeight: 750, fontSize: m ? 28 : 40, letterSpacing: '-0.03em' }}>Ficha técnica</h2>
            <div style={{ display: 'flex', gap: 6, marginTop: 18, flexWrap: 'wrap' }}>
              {['Dimensões', 'Energia', 'Recursos'].map((t, i) => (
                <span key={t} style={{ padding: '8px 14px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, background: i === 0 ? p.text : 'transparent', color: i === 0 ? p.bg : p.text, border: `1px solid ${i === 0 ? p.text : line}` }}>
                  {t}
                </span>
              ))}
            </div>
            <p style={{ color: p.muted, fontSize: 14, marginTop: 18 }}>Baixe o manual completo em PDF ou fale com um especialista.</p>
          </div>
          <dl style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(2, minmax(0, 1fr))', columnGap: 40 }}>
            {[
              ['Altura × largura × profundidade', '1.790 × 912 × 735 mm'],
              ['Peso', '128 kg'],
              ['Capacidade (refrigerador / freezer)', '432 L / 208 L'],
              ['Consumo mensal', '52,8 kWh'],
              ['Tensão', '127 V ou 220 V'],
              ['Gás refrigerante', 'R600a (baixo impacto)'],
              ['Degelo', 'Frost Free automático'],
              ['Garantia', '1 ano + 10 anos no compressor'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: `1px solid ${line}`, fontSize: m ? 14 : 15 }}>
                <dt style={{ color: p.muted }}>{k}</dt>
                <dd style={{ fontWeight: 600, textAlign: 'right' }}>{v}</dd>
              </div>
            ))}
          </dl>
        </Wrap>
      </section>

      {/* Comparativo de modelos */}
      <section style={{ padding: m ? '48px 0' : '104px 0' }}>
        <Wrap m={m} max={1280}>
          <h2 style={{ fontWeight: 750, fontSize: m ? 28 : 40, letterSpacing: '-0.03em' }}>Compare a Série Polar</h2>
          {m ? (
            <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
              {[
                ['Polar FD-640', 'French Door · 640 L', 'R$ 8.990', true],
                ['Polar BX-480', 'Inverse · 480 L', 'R$ 5.790', false],
                ['Polar SX-380', 'Duplex · 380 L', 'R$ 3.890', false],
              ].map(([n, t, price, hi]) => (
                <div key={n as string} style={{ border: `1.5px solid ${hi ? p.accent : line}`, borderRadius: 14, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <strong>{n}</strong>
                    <div style={{ fontSize: 13.5, color: p.muted }}>{t}</div>
                  </div>
                  <strong>{price}</strong>
                </div>
              ))}
            </div>
          ) : (
            <table style={{ marginTop: 32, fontSize: 15 }}>
              <thead>
                <tr>
                  <th style={{ padding: '0 0 18px', width: '28%' }} />
                  {[
                    ['Polar FD-640', 'French Door', true],
                    ['Polar BX-480', 'Inverse', false],
                    ['Polar SX-380', 'Duplex', false],
                  ].map(([n, t, hi]) => (
                    <th key={n as string} style={{ padding: '18px 20px', background: hi ? withAlpha(p.accent, 0.08) : 'transparent', borderRadius: '14px 14px 0 0' }}>
                      <div style={{ width: 54, height: 90, margin: '0 0 12px' }}>
                        <Fridge p={p} />
                      </div>
                      <strong style={{ display: 'block', fontSize: 17 }}>{n}</strong>
                      <span style={{ color: p.muted, fontSize: 13.5 }}>{t}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Capacidade', '640 L', '480 L', '380 L'],
                  ['Eficiência', 'A+++', 'A++', 'A+'],
                  ['Dispensador de água', true, true, false],
                  ['Zona Flex', true, false, false],
                  ['Wi-Fi', true, true, false],
                  ['Preço', 'R$ 8.990', 'R$ 5.790', 'R$ 3.890'],
                ].map(([k, ...cells]) => (
                  <tr key={k as string}>
                    <td style={{ padding: '14px 0', borderTop: `1px solid ${line}`, color: p.muted }}>{k}</td>
                    {cells.map((c, i) => (
                      <td key={i} style={{ padding: '14px 20px', borderTop: `1px solid ${line}`, background: i === 0 ? withAlpha(p.accent, 0.08) : 'transparent', fontWeight: 600 }}>
                        {c === true ? <Icon name="check" size={19} color={p.accent} stroke={2.4} /> : c === false ? <span style={{ color: p.muted }}>—</span> : c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Wrap>
      </section>

      {/* Suporte */}
      <section style={{ borderTop: `1px solid ${line}` }}>
        <Wrap m={m} max={1280} style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 20 : 32, padding: m ? '36px 20px' : '56px 48px' }}>
          {(
            [
              ['truck', 'Instalação grátis', 'Nas capitais e regiões metropolitanas'],
              ['shield', 'Garantia estendida', 'Até 3 anos extras no checkout'],
              ['clock', 'Assistência 24 h', 'Técnicos certificados em todo o país'],
              ['check', 'Peças originais', 'Estoque garantido por 10 anos'],
            ] as const
          ).map(([icon, t, d]) => (
            <div key={t} style={{ display: 'flex', gap: 12 }}>
              <Icon name={icon} size={24} color={p.accent} />
              <div>
                <strong style={{ fontSize: m ? 14 : 15.5 }}>{t}</strong>
                <div style={{ fontSize: 13.5, color: p.muted, marginTop: 2 }}>{d}</div>
              </div>
            </div>
          ))}
        </Wrap>
      </section>

      <footer style={{ background: p.surface, borderTop: `1px solid ${line}`, fontSize: 14 }}>
        <Wrap m={m} max={1280} style={{ padding: m ? '36px 20px 24px' : '56px 48px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 2fr) repeat(3, minmax(0, 1fr))', gap: 28 }}>
            <div style={{ gridColumn: m ? '1 / -1' : 'auto' }}>
              <strong style={{ letterSpacing: '0.08em' }}>FROST LAB</strong>
              <p style={{ color: p.muted, marginTop: 8, maxWidth: 320 }}>Eletrodomésticos projetados no Brasil, testados em laboratório próprio a 40 °C.</p>
            </div>
            {[
              ['Produtos', ['Geladeiras', 'Freezers', 'Lava e seca', 'Climatização']],
              ['Suporte', ['Manuais', 'Assistência', 'Peças', 'Garantia']],
              ['Empresa', ['Sobre', 'Laboratório', 'Revendas', 'Contato']],
            ].map(([t, items]) => (
              <div key={t as string}>
                <strong>{t}</strong>
                <ul style={{ display: 'grid', gap: 6, marginTop: 10, color: p.muted }}>
                  {(items as string[]).map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 32, paddingTop: 18, borderTop: `1px solid ${line}`, color: p.muted, fontSize: 12.5 }}>
            <span>© 2026 FROST LAB — marca fictícia · Preços ilustrativos</span>
            <span style={{ display: 'flex', gap: 6 }}>
              {['Pix', 'Cartão', 'Boleto'].map((t) => (
                <span key={t} style={{ border: `1px solid ${line}`, borderRadius: 6, padding: '2px 8px' }}>
                  {t}
                </span>
              ))}
            </span>
          </div>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
