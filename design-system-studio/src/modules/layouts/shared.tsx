import { memo, useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { useProject, useStudio } from '@/core/store'
import { keepScroll, Term } from '@/ui'
import { DesktopSchematic } from './schematic'
import { REGION_LEGEND, type DesktopLayout } from './types'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Largura de um elemento (ResizeObserver), medida antes da pintura para não haver salto. */
export function useElementWidth<T extends HTMLElement>(ref: RefObject<T>, fallback = 0): number {
  const [width, setWidth] = useState(fallback)
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const w = Math.round(el.getBoundingClientRect().width)
      if (w > 0) setWidth(w)
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return width
}

/** Altura da janela (muda só ao redimensionar, nunca por seleção). */
export function useViewportHeight(fallback = 800): number {
  const [h, setH] = useState(() => (typeof window === 'undefined' ? fallback : window.innerHeight || fallback))
  useEffect(() => {
    const onResize = () => setH(window.innerHeight || fallback)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [fallback])
  return h
}

/** Interruptor compartilhado (desktop + mobile) das etiquetas dos desenhos. */
export function LegendsSwitch() {
  const checked = useProject((p) => p.prefs.showLegends)
  const setPrefs = useStudio((s) => s.setPrefs)
  const id = useId()
  return (
    <label className="ui-switch lay-legend-switch" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        data-testid="legends-toggle"
        checked={checked}
        onChange={(e) => {
          const next = e.target.checked
          keepScroll(() => setPrefs({ showLegends: next }))
        }}
      />
      <span className="ui-switch__track" aria-hidden="true" />
      <span>Mostrar legendas nos desenhos</span>
    </label>
  )
}

/** Explicação curta das etiquetas, para leigos. */
export function LegendKey({ mobile = false }: { mobile?: boolean }) {
  const items = mobile
    ? [
        { kind: 'header' as const, label: 'HEADER', text: <Term id="topbar">barra superior</Term> },
        { kind: 'sidebar' as const, label: 'MENU INFERIOR', text: <Term id="bottomNav">menu embaixo</Term> },
        { kind: 'detail' as const, label: 'DRAWER', text: <Term id="drawer">menu que desliza</Term> },
        { kind: 'content' as const, label: 'CONTEÚDO', text: 'o que a pessoa vê e usa' },
      ]
    : [
        { kind: 'header' as const, label: 'HEADER', text: <Term id="header">barra superior</Term> },
        { kind: 'sidebar' as const, label: 'SIDEBAR', text: <Term id="sidebar">menu lateral</Term> },
        { kind: 'rail' as const, label: 'RAIL', text: <Term id="rail">trilho de ícones</Term> },
        { kind: 'content' as const, label: 'CONTEÚDO', text: 'área principal' },
        { kind: 'panel' as const, label: 'PAINEL', text: 'coluna de apoio' },
      ]
  return (
    <div className="lay-legend-key" aria-label="O que significam as etiquetas">
      {items.map((it) => (
        <span key={it.label} className="lay-legend-key__item">
          <span className="lay-chip" style={{ background: REGION_LEGEND[it.kind].color }}>
            {it.label}
          </span>
          {it.text}
        </span>
      ))}
    </div>
  )
}

export interface ChipOption {
  id: string
  label: string
  count?: number
}

/**
 * Filtros em chips: quebram linha em telas largas e viram uma faixa rolável na horizontal
 * no celular (uma linha só). Trocar de filtro não move a rolagem da página.
 */
export function ChipRow({ options, value, onChange, label }: { options: ChipOption[]; value: string; onChange: (id: string) => void; label: string }) {
  return (
    <div className="lay-chiprow" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" className="ui-chip" aria-pressed={o.id === value} onClick={() => keepScroll(() => onChange(o.id))}>
          {o.label}
          {o.count !== undefined && <span className="ui-chip__count">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

/** Esquema desktop que ocupa 100% da largura do contêiner, em proporção 16:10. */
export const FitSchematic = memo(function FitSchematic({
  layout,
  showLegends,
  detail = 'auto',
}: {
  layout: DesktopLayout
  showLegends: boolean
  detail?: 'auto' | 'thumb' | 'full'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const width = useElementWidth(ref)
  return (
    <div ref={ref} className="lay-fit">
      {width > 0 && <DesktopSchematic layout={layout} width={width} height={Math.floor((width * 10) / 16)} showLegends={showLegends} detail={detail} />}
    </div>
  )
})
