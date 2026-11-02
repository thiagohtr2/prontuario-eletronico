import { mix, withAlpha } from '@/core/color'
import type { SitePalette } from '../types'
import { Avatar, Burger, ff, hair, Icon, SiteRoot, Wrap, type SiteProps } from './kit'

type Photo = 'beds' | 'sprouts' | 'harvest'

/** "Fotos" de horta feitas em CSS. */
function GardenPhoto({ p, kind, height }: { p: SitePalette; kind: Photo; height: number }) {
  const soil = mix(p.accent, '#3b2416', 0.7)
  const green = mix(p.secondary, '#1f4d2b', 0.35)
  if (kind === 'beds')
    return (
      <div style={{ height, borderRadius: 16, background: `linear-gradient(180deg, ${mix(p.secondary, '#ffffff', 0.55)} 0 22%, ${mix(p.secondary, '#7aa36b', 0.4)} 22% 100%)`, position: 'relative', overflow: 'hidden' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: 'absolute', left: `${8 + i * 30}%`, width: '24%', top: '32%', bottom: '10%', borderRadius: 10, backgroundColor: soil, transform: 'perspective(200px) rotateX(18deg)', backgroundImage: `radial-gradient(circle, ${green} 6px, transparent 7px)`, backgroundSize: '22px 22px' }} />
        ))}
      </div>
    )
  if (kind === 'sprouts')
    return (
      <div style={{ height, borderRadius: 16, backgroundColor: soil, backgroundImage: `radial-gradient(ellipse 5px 9px at 50% 40%, ${mix(p.secondary, '#ffffff', 0.2)} 98%, transparent), radial-gradient(ellipse 5px 9px at 50% 40%, ${green} 98%, transparent)`, backgroundSize: '26px 26px, 26px 26px', backgroundPosition: '0 0, 13px 13px' }} />
    )
  return (
    <div style={{ height, borderRadius: 16, background: mix(p.surface, p.secondary, 0.25), display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', placeItems: 'center', padding: 12, gap: 6 }}>
      {['#e2483a', '#f2b33d', '#e2483a', '#7bb662', '#f08a3c', '#7bb662', '#e2483a', '#f2b33d', '#a3487a', '#7bb662'].map((c, i) => (
        <span key={i} style={{ width: '78%', aspectRatio: '1', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, ${mix(c, '#ffffff', 0.4)}, ${c} 60%, ${mix(c, '#000000', 0.25)})` }} />
      ))}
    </div>
  )
}

const POSTS: { name: string; ini: string; when: string; text: string; tags: string[]; photo?: Photo; likes: number; comments: number }[] = [
  { name: 'Marta Ribeiro', ini: 'MR', when: 'há 2 h', text: 'Primeira colheita da horta da praça! Quem ajudou no mutirão de março pode passar para pegar sua parte.', tags: ['#colheita', '#praçadaárvore'], photo: 'harvest', likes: 128, comments: 24 },
  { name: 'Coletivo Raiz Leste', ini: 'RL', when: 'há 5 h', text: 'Mutirão de canteiros neste sábado, 9h. Levem luvas e chapéu — teremos café e bolo de milho.', tags: ['#mutirão'], photo: 'beds', likes: 86, comments: 31 },
  { name: 'Joana Pires', ini: 'JP', when: 'ontem', text: 'Tenho mudas de manjericão-roxo e tomate-cereja sobrando. Troco por sementes de girassol!', tags: ['#troca', '#mudas'], likes: 42, comments: 17 },
  { name: 'Davi Oliveira', ini: 'DO', when: 'ontem', text: 'As sementes crioulas de feijão que ganhei no encontro já brotaram. Comunidade é isso.', tags: ['#sementes'], photo: 'sprouts', likes: 203, comments: 40 },
  { name: 'Bia Andrade', ini: 'BA', when: 'há 2 dias', text: 'Dica de quem aprendeu errando: alface não gosta de sol das 14h. Sombrite salvou meu canteiro.', tags: ['#dicas'], likes: 97, comments: 12 },
  { name: 'Horta da Escola Sol', ini: 'ES', when: 'há 2 dias', text: 'As crianças do 3º ano batizaram cada canteiro. O nosso favorito: “Alface Rebelde”.', tags: ['#educação'], likes: 311, comments: 58 },
]

export default function FloraSocial({ palette: p, device }: SiteProps) {
  const m = device === 'mobile'
  const serif = ff('fraunces')
  const line = hair(p, 0.1)
  const tones = [p.accent, p.secondary, mix(p.accent, p.secondary, 0.5), p.text, mix(p.secondary, '#ffffff', 0.4)]
  const onTones = [p.onAccent, p.text, p.text, p.bg, p.text]
  return (
    <SiteRoot p={p} font={ff('inter')} name="FLORA SOCIAL">
      {/* Header */}
      <header>
        <Wrap m={m} max={1240} style={{ display: 'flex', alignItems: 'center', gap: 32, height: m ? 64 : 80 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: serif, fontSize: m ? 22 : 26, fontWeight: 500, letterSpacing: '-0.02em' }}>
            <svg width={28} height={28} viewBox="0 0 28 28" aria-hidden="true">
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx={14} cy={7} rx={5} ry={7} fill={p.accent} transform={`rotate(${a} 14 14)`} opacity={0.9} />
              ))}
              <circle cx={14} cy={14} r={4.5} fill={p.secondary} />
            </svg>
            flora social
          </span>
          {!m && (
            <nav style={{ display: 'flex', gap: 6, fontSize: 15, fontWeight: 500 }}>
              {['Feed', 'Hortas', 'Eventos', 'Grupos'].map((t, i) => (
                <span key={t} style={{ padding: '8px 14px', borderRadius: 999, background: i === 0 ? withAlpha(p.accent, 0.12) : 'transparent', color: i === 0 ? mix(p.accent, p.text, 0.3) : p.text }}>
                  {t}
                </span>
              ))}
            </nav>
          )}
          <div style={{ flex: 1 }} />
          {!m && <span style={{ fontWeight: 600, fontSize: 15 }}>Entrar</span>}
          <span style={{ background: p.text, color: p.bg, borderRadius: 999, padding: m ? '9px 16px' : '12px 22px', fontWeight: 600, fontSize: m ? 14 : 15 }}>Participar</span>
          {m && <Burger color={p.text} />}
        </Wrap>
      </header>

      {/* Hero com colagem de pessoas e conversas */}
      <section>
        <Wrap m={m} max={1240} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: m ? 32 : 48, alignItems: 'center', padding: m ? '24px 20px 48px' : '56px 48px 96px' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, background: p.surface, border: `1px solid ${line}`, borderRadius: 999, padding: '6px 14px 6px 6px' }}>
              <span style={{ background: p.secondary, color: p.text, borderRadius: 999, padding: '2px 10px', fontSize: 12 }}>novo</span>
              Mapa de hortas da sua cidade
            </span>
            <h1 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 46 : 80, lineHeight: 0.98, letterSpacing: '-0.035em', marginTop: 20 }}>
              Onde quem planta{' '}
              <span style={{ background: p.secondary, borderRadius: 999, padding: m ? '0 10px' : '0 18px', display: 'inline-block', lineHeight: 1.05 }}>se encontra</span>.
            </h1>
            <p style={{ color: p.muted, fontSize: m ? 16 : 19, marginTop: 20, maxWidth: 480 }}>Troque mudas, organize mutirões e descubra a horta comunitária mais perto de você. Gratuito, para sempre.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexDirection: m ? 'column' : 'row' }}>
              <span style={{ background: p.accent, color: p.onAccent, borderRadius: 999, padding: '16px 30px', fontWeight: 600, textAlign: 'center', boxShadow: `0 6px 0 ${mix(p.accent, '#000000', 0.25)}` }}>Criar meu perfil</span>
              <span style={{ borderRadius: 999, padding: '16px 24px', fontWeight: 600, textAlign: 'center', display: 'inline-flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="pin" size={18} /> Ver hortas perto de mim
              </span>
            </div>
            <div style={{ display: 'flex', gap: m ? 18 : 32, marginTop: 36, flexWrap: 'wrap' }}>
              {[
                ['12 mil', 'membros'],
                ['340', 'hortas'],
                ['1.800', 'trocas por mês'],
              ].map(([n, t]) => (
                <div key={t}>
                  <div style={{ fontFamily: serif, fontSize: m ? 28 : 36, fontWeight: 500 }}>{n}</div>
                  <div style={{ fontSize: 13.5, color: p.muted }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', height: m ? 360 : 540 }}>
            {[
              [8, 6, 120, 'AM', 0],
              [44, 0, 96, 'TS', 1],
              [74, 14, 110, 'LK', 2],
              [2, 44, 92, 'BC', 4],
              [30, 36, 150, 'RN', 3],
              [78, 44, 104, 'JF', 0],
              [16, 76, 100, 'PE', 1],
              [52, 78, 88, 'VG', 2],
            ].map(([x, y, s, ini, t], i) => {
              const size = (s as number) * (m ? 0.66 : 1)
              return (
                <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: size, height: size, borderRadius: i % 3 === 0 ? '42% 58% 55% 45% / 50% 45% 55% 50%' : '50%', background: tones[t as number], display: 'grid', placeItems: 'center', color: onTones[t as number], fontWeight: 700, fontSize: size * 0.28, boxShadow: `0 0 0 6px ${p.bg}` }}>
                  {i === 4 ? <Icon name="leaf" size={size * 0.42} color={onTones[3]} stroke={1.6} /> : (ini as string)}
                </div>
              )
            })}
            <div style={{ position: 'absolute', left: m ? '22%' : '30%', top: m ? '24%' : '22%', background: p.surface, borderRadius: '20px 20px 20px 4px', padding: m ? '9px 12px' : '12px 16px', boxShadow: `0 12px 30px ${withAlpha(p.text, 0.12)}`, fontSize: m ? 12.5 : 14.5, maxWidth: m ? 190 : 240 }}>
              Alguém tem muda de manjericão?
            </div>
            <div style={{ position: 'absolute', right: 0, top: m ? '66%' : '67%', background: p.accent, color: p.onAccent, borderRadius: '20px 20px 4px 20px', padding: m ? '9px 12px' : '12px 16px', boxShadow: `0 12px 30px ${withAlpha(p.text, 0.12)}`, fontSize: m ? 12.5 : 14.5, fontWeight: 600 }}>
              Eu tenho! Passa sábado na horta.
            </div>
          </div>
        </Wrap>
      </section>

      {/* Feed em colunas */}
      <section style={{ background: p.surface, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <Wrap m={m} max={1240} style={{ padding: m ? '44px 20px' : '88px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 32 : 50, letterSpacing: '-0.03em' }}>Acontecendo agora</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Tudo', 'Trocas', 'Mutirões', 'Dicas'].map((t, i) => (
                <span key={t} style={{ fontSize: 14, fontWeight: 600, padding: '8px 14px', borderRadius: 999, background: i === 0 ? p.text : 'transparent', color: i === 0 ? p.bg : p.text, border: `1px solid ${i === 0 ? p.text : line}` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ columnCount: m ? 1 : 3, columnGap: 20, marginTop: m ? 20 : 36 }}>
            {POSTS.slice(0, m ? 3 : 6).map((post, i) => (
              <article key={post.name} style={{ breakInside: 'avoid', background: p.bg, borderRadius: 24, padding: m ? 16 : 20, marginBottom: 20, border: `1px solid ${line}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar size={40} bg={tones[i % 5]} fg={onTones[i % 5]} label={post.ini} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 650, fontSize: 15 }}>{post.name}</div>
                    <div style={{ fontSize: 12.5, color: p.muted }}>{post.when}</div>
                  </div>
                </div>
                <p style={{ marginTop: 12, fontSize: m ? 15 : 15.5, lineHeight: 1.55 }}>{post.text}</p>
                {post.photo && (
                  <div style={{ marginTop: 12 }}>
                    <GardenPhoto p={p} kind={post.photo} height={m ? 170 : 190} />
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                  {post.tags.map((t) => (
                    <span key={t} style={{ fontSize: 12.5, fontWeight: 600, color: mix(p.accent, p.text, 0.35), background: withAlpha(p.accent, 0.1), borderRadius: 999, padding: '3px 10px' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 18, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${line}`, fontSize: 13.5, color: p.muted }}>
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                    <Icon name="heart" size={17} color={p.accent} fill={i % 2 ? 'none' : p.accent} /> {post.likes}
                  </span>
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                    <Icon name="chat" size={17} /> {post.comments}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Eventos + grupos */}
      <section>
        <Wrap m={m} max={1240} style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 7fr) minmax(0, 5fr)', gap: m ? 40 : 64, padding: m ? '44px 20px' : '88px 48px' }}>
          <div>
            <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 30 : 42, letterSpacing: '-0.03em' }}>Próximos encontros</h2>
            <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
              {[
                ['16', 'NOV', 'Mutirão de compostagem', 'Horta da Praça da Árvore', 48],
                ['23', 'NOV', 'Feira de trocas de sementes', 'Centro Cultural Leste', 112],
                ['30', 'NOV', 'Oficina: horta em apartamento', 'Online, ao vivo', 230],
              ].map(([d, mo, t, place, n], i) => (
                <div key={t as string} style={{ display: 'flex', gap: m ? 12 : 18, alignItems: 'center', background: p.surface, border: `1px solid ${line}`, borderRadius: 20, padding: m ? 12 : 16 }}>
                  <div style={{ width: m ? 56 : 68, flex: 'none', textAlign: 'center', borderRadius: 16, background: i === 0 ? p.accent : withAlpha(p.secondary, 0.5), color: i === 0 ? p.onAccent : p.text, padding: '10px 0' }}>
                    <div style={{ fontFamily: serif, fontSize: m ? 24 : 30, lineHeight: 1, fontWeight: 600 }}>{d as string}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.1em', marginTop: 2 }}>{mo as string}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 650, fontSize: m ? 15 : 17 }}>{t as string}</div>
                    <div style={{ fontSize: 13.5, color: p.muted, display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                      <Icon name="pin" size={14} /> {place as string}
                    </div>
                    <div style={{ fontSize: 12.5, color: p.muted, marginTop: 4 }}>{n as number} pessoas vão</div>
                  </div>
                  {!m && <span style={{ border: `1.5px solid ${p.text}`, borderRadius: 999, padding: '9px 18px', fontWeight: 600, fontSize: 14 }}>Eu vou</span>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: m ? 30 : 42, letterSpacing: '-0.03em' }}>Grupos</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
              {[
                ['Hortas urbanas', 4.2],
                ['PANCs', 1.1],
                ['Compostagem', 2.8],
                ['Sementes crioulas', 0.9],
                ['Plantas medicinais', 3.4],
                ['Abelhas sem ferrão', 0.6],
                ['Horta na escola', 1.7],
                ['Varanda verde', 5.1],
              ].map(([t, k], i) => (
                <span key={t as string} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: m ? '9px 14px' : '12px 18px', fontWeight: 600, fontSize: m ? 14 : 15.5, background: i % 3 === 0 ? withAlpha(p.accent, 0.14) : i % 3 === 1 ? withAlpha(p.secondary, 0.55) : p.surface, border: `1px solid ${line}` }}>
                  {t as string}
                  <span style={{ fontSize: 12, color: p.muted, fontWeight: 500 }}>{String(k).replace('.', ',')} mil</span>
                </span>
              ))}
            </div>
            <figure style={{ marginTop: 32, background: p.secondary, borderRadius: '40px 40px 40px 8px', padding: m ? 22 : 28 }}>
              <blockquote style={{ fontFamily: serif, fontSize: m ? 20 : 24, lineHeight: 1.3, fontWeight: 500 }}>“Mudei de cidade sem conhecer ninguém. Hoje tenho uma horta, vinte vizinhos e muito pé de couve.”</blockquote>
              <figcaption style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, fontSize: 14 }}>
                <Avatar size={36} bg={p.text} fg={p.bg} label="CS" /> <strong>Clara Souza</strong>
                <span style={{ opacity: 0.7 }}>· membro desde 2024</span>
              </figcaption>
            </figure>
          </div>
        </Wrap>
      </section>

      {/* CTA */}
      <section style={{ padding: m ? '0 0 48px' : '0 0 96px' }}>
        <Wrap m={m} max={1240}>
          <div style={{ background: p.text, color: p.bg, borderRadius: m ? 28 : 44, padding: m ? '40px 24px' : '72px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {[
              [-40, -40, 180, p.accent],
              [88, 60, 140, p.secondary],
              [6, 70, 90, p.secondary],
            ].map(([x, y, s, c], i) => (
              <span key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: s as number, height: s as number, borderRadius: '50%', background: c as string, opacity: 0.85 }} />
            ))}
            <h2 style={{ position: 'relative', fontFamily: serif, fontWeight: 500, fontSize: m ? 36 : 64, letterSpacing: '-0.035em', lineHeight: 1 }}>Sua próxima muda está a um bairro de distância.</h2>
            <div style={{ position: 'relative', display: 'flex', gap: 8, maxWidth: 480, margin: '28px auto 0', background: p.bg, borderRadius: 999, padding: 6, flexDirection: 'row' }}>
              <span style={{ flex: 1, textAlign: 'left', color: p.muted, padding: '10px 14px', fontSize: 14.5 }}>Seu e-mail</span>
              <span style={{ background: p.accent, color: p.onAccent, borderRadius: 999, padding: '10px 20px', fontWeight: 600, fontSize: 14.5 }}>Participar</span>
            </div>
          </div>
        </Wrap>
      </section>

      <footer style={{ borderTop: `1px solid ${line}`, fontSize: 14 }}>
        <Wrap m={m} max={1240} style={{ display: 'flex', flexDirection: m ? 'column' : 'row', justifyContent: 'space-between', gap: 16, padding: m ? '28px 20px' : '40px 48px', color: p.muted }}>
          <span style={{ fontFamily: serif, fontSize: 20, color: p.text }}>flora social</span>
          <span style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {['Sobre', 'Regras da comunidade', 'Ajuda', 'Privacidade'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </span>
          <span>© 2026 — comunidade fictícia</span>
        </Wrap>
      </footer>
    </SiteRoot>
  )
}
