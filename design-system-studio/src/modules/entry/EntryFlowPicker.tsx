import type { ReactNode } from 'react'
import { ENTRY_FLOWS, type EntryFlow } from '@/core/project'
import { studio, useProject } from '@/core/store'
import { Callout, OptionCard } from '@/ui'
import './entry.css'

/* ------------------------------------------------------------------------- */
/* Desenhos esquemáticos (cores do Studio: currentColor + tokens)              */
/* ------------------------------------------------------------------------- */

type PageKind = 'landing' | 'login' | 'app' | 'page'

function Page({ x, y, w = 56, h = 62, kind, label }: { x: number; y: number; w?: number; h?: number; kind: PageKind; label: string }) {
  const line = 'var(--s-border-strong)'
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill="var(--s-surface)" stroke="currentColor" strokeWidth="1.5" />
      <rect x={x} y={y} width={w} height="9" rx="5" fill="currentColor" opacity=".16" />
      {kind === 'landing' && (
        <>
          <rect x={x + 8} y={y + 16} width={w - 16} height="6" rx="2" fill="currentColor" opacity=".7" />
          <rect x={x + 14} y={y + 26} width={w - 28} height="4" rx="2" fill={line} />
          <rect x={x + w / 2 - 9} y={y + 34} width="18" height="7" rx="3" fill="currentColor" />
          <rect x={x + 8} y={y + 47} width={(w - 22) / 3} height="9" rx="2" fill={line} />
          <rect x={x + 11 + (w - 22) / 3} y={y + 47} width={(w - 22) / 3} height="9" rx="2" fill={line} />
          <rect x={x + 14 + ((w - 22) / 3) * 2} y={y + 47} width={(w - 22) / 3} height="9" rx="2" fill={line} />
        </>
      )}
      {kind === 'login' && (
        <>
          <rect x={x + w / 2 - 15} y={y + 15} width="30" height={h - 24} rx="3" fill="none" stroke={line} />
          <rect x={x + w / 2 - 10} y={y + 22} width="20" height="5" rx="2" fill={line} />
          <rect x={x + w / 2 - 10} y={y + 31} width="20" height="5" rx="2" fill={line} />
          <rect x={x + w / 2 - 10} y={y + 41} width="20" height="6" rx="2" fill="currentColor" />
        </>
      )}
      {kind === 'app' && (
        <>
          <rect x={x + 1} y={y + 9} width="13" height={h - 10} fill="currentColor" opacity=".22" />
          <rect x={x + 19} y={y + 15} width={w - 25} height="12" rx="2" fill={line} />
          <rect x={x + 19} y={y + 31} width={(w - 28) / 2} height="22" rx="2" fill={line} />
          <rect x={x + 22 + (w - 28) / 2} y={y + 31} width={(w - 28) / 2} height="22" rx="2" fill="currentColor" opacity=".45" />
        </>
      )}
      {kind === 'page' && (
        <>
          <rect x={x + 7} y={y + 16} width={w - 14} height="14" rx="2" fill={line} />
          <rect x={x + 7} y={y + 35} width={w - 20} height="4" rx="2" fill={line} />
          <rect x={x + 7} y={y + 43} width={w - 26} height="4" rx="2" fill={line} />
        </>
      )}
      <text x={x + w / 2} y={y + h + 14} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--s-text-2)" fontFamily="var(--font)">
        {label}
      </text>
    </g>
  )
}

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${x1} ${y} H${x2}`} />
      <path d={`M${x2 - 5} ${y - 4} L${x2} ${y} L${x2 - 5} ${y + 4}`} />
    </g>
  )
}

const SCHEMES: Record<EntryFlow, ReactNode> = {
  'landing-login': (
    <>
      <Page x={6} y={10} kind="landing" label="Landing" />
      <Arrow x1={66} x2={90} y={41} />
      <Page x={92} y={10} kind="login" label="Login" />
      <Arrow x1={152} x2={176} y={41} />
      <Page x={178} y={10} kind="app" label="Sistema" />
    </>
  ),
  'landing-only': (
    <>
      <Page x={78} y={4} w={84} h={70} kind="landing" label="Landing (uma página)" />
      <g stroke="var(--s-border-strong)" strokeDasharray="3 4">
        <path d="M40 40 H70 M170 40 H200" />
      </g>
    </>
  ),
  'login-only': (
    <>
      <rect x="20" y="33" width="38" height="16" rx="8" fill="none" stroke="var(--s-border-strong)" />
      <text x="39" y="44.5" textAnchor="middle" fontSize="9.5" fill="var(--s-text-3)" fontFamily="var(--font)">
        site
      </text>
      <Arrow x1={60} x2={78} y={41} />
      <Page x={80} y={10} kind="login" label="Login" />
      <Arrow x1={140} x2={162} y={41} />
      <Page x={164} y={10} kind="app" label="Sistema" />
    </>
  ),
  'app-direct': (
    <>
      <rect x="22" y="33" width="44" height="16" rx="8" fill="none" stroke="var(--s-border-strong)" />
      <text x="44" y="44.5" textAnchor="middle" fontSize="9.5" fill="var(--s-text-3)" fontFamily="var(--font)">
        site
      </text>
      <Arrow x1={70} x2={104} y={41} />
      <Page x={108} y={4} w={96} h={70} kind="app" label="Sistema direto" />
    </>
  ),
  institutional: (
    <>
      <Page x={8} y={12} w={52} h={58} kind="landing" label="Início" />
      <g stroke="currentColor" strokeWidth="1.4" fill="none">
        <path d="M60 41 H78 M78 14 V68 M78 14 H88 M78 41 H88 M78 68 H88" />
      </g>
      <Page x={90} y={2} w={40} h={24} kind="page" label="" />
      <Page x={90} y={30} w={40} h={24} kind="page" label="" />
      <Page x={90} y={58} w={40} h={24} kind="page" label="" />
      <text x="138" y="18" fontSize="10.5" fill="var(--s-text-2)" fontFamily="var(--font)" fontWeight="600">
        Sobre
      </text>
      <text x="138" y="46" fontSize="10.5" fill="var(--s-text-2)" fontFamily="var(--font)" fontWeight="600">
        Serviços
      </text>
      <text x="138" y="74" fontSize="10.5" fill="var(--s-text-2)" fontFamily="var(--font)" fontWeight="600">
        Contato
      </text>
    </>
  ),
}

const PLAIN: Record<EntryFlow, string> = {
  'landing-login': 'Ex.: um sistema de gestão com página de vendas e área de clientes.',
  'landing-only': 'Ex.: divulgação de um produto, evento ou serviço.',
  'login-only': 'Ex.: ferramenta interna de uma empresa.',
  'app-direct': 'Ex.: calculadora, painel de TV ou quiosque.',
  institutional: 'Ex.: site de uma clínica, escritório ou escola.',
}

/**
 * Escolha de como as pessoas chegam ao sistema (landing, login, aplicação direta...).
 * Seleciona com `setEntryFlow`; nunca move a rolagem da página.
 */
export function EntryFlowPicker({ guided = false }: { guided?: boolean }) {
  const flow = useProject((p) => p.entry.flow)
  const showHints = useProject((p) => p.prefs.showHints)
  return (
    <div className="u-stack" data-testid="entry-flow-picker">
      {showHints && (
        <Callout title="Landing page não é login.">
          A landing apresenta o produto para quem ainda não conhece. O login é a porta da área restrita. Um sistema pode ter os dois, só um deles ou
          nenhum.{guided ? ' Escolha o caminho que mais se parece com o seu projeto — dá para mudar depois.' : ''}
        </Callout>
      )}
      <div className="ent-flow-grid" role="group" aria-label="Fluxo de entrada">
        {ENTRY_FLOWS.map((f) => (
          <OptionCard
            key={f.id}
            testId={`entry-flow-${f.id}`}
            selected={flow === f.id}
            onSelect={() => studio().setEntryFlow(f.id)}
            media={
              <div className="ent-flow-media">
                <svg viewBox="0 0 240 96" aria-hidden="true">
                  {SCHEMES[f.id]}
                </svg>
              </div>
            }
            title={f.name}
            description={
              <>
                {f.description}
                {(guided || showHints) && (
                  <span style={{ display: 'block', marginTop: 4, color: 'var(--s-text-3)' }}>{PLAIN[f.id]}</span>
                )}
              </>
            }
          />
        ))}
      </div>
    </div>
  )
}
