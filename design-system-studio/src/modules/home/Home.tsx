import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Compass, Wand2 } from 'lucide-react'
import { SKELETON_STEPS, skeletonDone } from '@/core/project'
import { useProject, useStudio } from '@/core/store'
import { STEP_META } from '@/shell/nav'
import { Badge, Button } from '@/ui'
import { relativeTime } from '@/core/time'
import './home.css'

function GuidedArt() {
  return (
    <svg viewBox="0 0 400 148" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="148" fill="#fff" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${28 + i * 76} 44)`}>
          <rect width="60" height="60" rx="10" fill={i < 2 ? '#F1F0FD' : '#fff'} stroke={i < 2 ? '#4C46DC' : '#E3E3E8'} strokeWidth="1.5" />
          <circle cx="30" cy="24" r="9" fill={i < 2 ? '#4C46DC' : '#D9D9E0'} />
          <rect x="16" y="40" width="28" height="5" rx="2.5" fill={i < 2 ? '#C9C6F6' : '#ECECEF'} />
          {i < 4 && <path d={`M64 30h8`} stroke="#D9D9E0" strokeWidth="2" strokeLinecap="round" />}
        </g>
      ))}
      <text x="28" y="128" fontFamily="Inter Variable, system-ui" fontSize="12" fill="#7C7C87">Objetivo → Entrada → Desktop → Mobile → Revisão</text>
    </svg>
  )
}

function FreeArt() {
  return (
    <svg viewBox="0 0 400 148" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="148" fill="#fff" />
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 24 + (i % 4) * 90
        const y = 22 + Math.floor(i / 4) * 56
        return (
          <g key={i}>
            <rect x={x} y={y} width="78" height="44" rx="8" fill="#fff" stroke={i === 2 ? '#4C46DC' : '#E3E3E8'} strokeWidth="1.5" />
            <rect x={x + 10} y={y + 10} width="18" height="18" rx="5" fill={i === 2 ? '#4C46DC' : '#ECECEF'} />
            <rect x={x + 34} y={y + 13} width="34" height="5" rx="2.5" fill="#D9D9E0" />
            <rect x={x + 34} y={y + 23} width="24" height="4" rx="2" fill="#ECECEF" />
          </g>
        )
      })}
    </svg>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const setMode = useStudio((s) => s.setMode)
  const mode = useProject((p) => p.mode)
  const name = useProject((p) => p.meta.name)
  const step = useProject((p) => p.guided.step)
  const updatedAt = useProject((p) => p.updatedAt)
  const completed = useProject((p) => p.guided.completed)
  const doneSkeleton = useProject((p) => skeletonDone(p).length)
  const hasProgress = Boolean(name) || completed.length > 0

  const start = (m: 'guided' | 'free') => {
    setMode(m)
    navigate(m === 'guided' ? `/guiado/${step}` : '/livre')
  }

  return (
    <div className="ui-page">
      <section className="home-hero">
        <span className="ui-eyebrow">Atelier UI · Design System Studio</span>
        <h1>Do site que você imagina ao site que a IA realmente constrói.</h1>
        <p>
          Escolha visualmente a estrutura, os menus, as cores e os componentes do seu site. No final, o Studio gera um
          Master Prompt detalhado para entregar ao Claude Code, Cursor ou outra IA de programação.
        </p>
      </section>

      {hasProgress && (
        <div className="home-continue" data-testid="home-continue">
          <div className="u-stack-sm" style={{ gap: 2 }}>
            <strong>Continuar “{name || 'Projeto sem nome'}”</strong>
            <span className="u-muted u-small">
              Esqueleto {doneSkeleton}/{SKELETON_STEPS.length} · próxima etapa: {STEP_META[step].label} · salvo {relativeTime(updatedAt)}
            </span>
          </div>
          <Button variant="primary" iconRight={<ArrowRight />} onClick={() => start(mode)}>
            Continuar no modo {mode === 'guided' ? 'guiado' : 'livre'}
          </Button>
        </div>
      )}

      <div className="home-modes">
        <article className="home-mode" data-current={mode === 'guided'}>
          <div className="home-mode__art">
            <GuidedArt />
          </div>
          <div>
            <h2 className="home-mode__title">
              <Wand2 width={22} height={22} aria-hidden="true" /> Modo Guiado <Badge tone="accent">Recomendado para iniciantes</Badge>
            </h2>
            <ul>
              <li><Check aria-hidden="true" />O Studio explica cada decisão com exemplos visuais.</li>
              <li><Check aria-hidden="true" />Começa pelo objetivo e pelo esqueleto do site, depois o acabamento.</li>
              <li><Check aria-hidden="true" />Você não precisa conhecer termos como sidebar, drawer ou breakpoint.</li>
            </ul>
          </div>
          <Button variant="primary" size="lg" iconRight={<ArrowRight />} onClick={() => start('guided')} data-testid="start-guided">
            Começar no modo guiado
          </Button>
        </article>

        <article className="home-mode" data-current={mode === 'free'}>
          <div className="home-mode__art">
            <FreeArt />
          </div>
          <div>
            <h2 className="home-mode__title">
              <Compass width={22} height={22} aria-hidden="true" /> Modo Livre
            </h2>
            <ul>
              <li><Check aria-hidden="true" />Acesso direto a qualquer módulo, sem sequência obrigatória.</li>
              <li><Check aria-hidden="true" />Layouts, paletas, componentes, galerias, editor e Master Prompt.</li>
              <li><Check aria-hidden="true" />As mesmas escolhas do modo guiado: alterne quando quiser.</li>
            </ul>
          </div>
          <Button variant="secondary" size="lg" iconRight={<ArrowRight />} onClick={() => start('free')} data-testid="start-free">
            Abrir todos os módulos
          </Button>
        </article>
      </div>

      <section className="ui-section" style={{ marginTop: 'var(--sp-8)' }}>
        <div className="ui-section__head">
          <div>
            <h2 className="ui-section__title">Primeiro o esqueleto, depois o acabamento</h2>
            <p className="ui-section__desc">A ordem importa: decidir a estrutura antes das cores evita retrabalho com a IA.</p>
          </div>
        </div>
        <ol className="home-steps">
          <li>
            <small>1 · Esqueleto</small>
            <strong>Estrutura do site</strong>
            <span>Tipo de site, páginas de entrada e onde ficam header, sidebar e conteúdo — no computador e no celular.</span>
          </li>
          <li>
            <small>2 · Identidade</small>
            <strong>Cores e tipografia</strong>
            <span>Uma paleta central com tokens que todos os componentes herdam.</span>
          </li>
          <li>
            <small>3 · Componentes</small>
            <strong>Menus, botões, cards…</strong>
            <span>Escolha e personalize cada peça, com edição visual.</span>
          </li>
          <li>
            <small>4 · Entrega</small>
            <strong>Master Prompt</strong>
            <span>Especificação completa em texto e JSON, pronta para a IA construir o site.</span>
          </li>
        </ol>
      </section>
    </div>
  )
}
