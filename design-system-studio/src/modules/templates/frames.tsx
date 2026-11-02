import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { TemplateRender } from './TemplateRender'
import { resolveTemplateTheme, type TemplateOverrides, type TplTheme } from './theme'
import type { TemplateModel } from './types'

export const DESKTOP_W = 1280
export const MOBILE_W = 390

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Observa a largura (e opcionalmente a altura) de um elemento. */
function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useIso(() => {
    const el = ref.current
    if (!el) return
    const read = () => setSize((prev) => (prev.w === el.clientWidth && prev.h === el.offsetHeight ? prev : { w: el.clientWidth, h: el.offsetHeight }))
    read()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

/** Renderiza só quando o elemento se aproxima da área visível (e mantém depois). */
function useNearViewport<T extends HTMLElement>(ref: RefObject<T>) {
  const [seen, setSeen] = useState(typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    if (seen || !ref.current) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref, seen])
  return seen
}

/**
 * Miniatura viva: o template é renderizado em largura virtual de 1280 px e reduzido com
 * `transform: scale()` dentro de uma caixa de altura fixa (sem cliques internos).
 */
export function TemplateThumb({ template, overrides, height = 212 }: { template: TemplateModel; overrides?: TemplateOverrides; height?: number }) {
  const [ref, size] = useSize<HTMLDivElement>()
  const seen = useNearViewport(ref)
  const theme = useMemo(() => resolveTemplateTheme(template, overrides), [template, overrides])
  const scale = size.w ? size.w / DESKTOP_W : 0.26
  return (
    <div ref={ref} className="tpl-thumb" style={{ height, background: theme.bg }} aria-hidden="true">
      {seen && (
        <div className="tpl-thumb__inner" style={{ width: DESKTOP_W, transform: `scale(${scale})` }}>
          <TemplateRender template={template} theme={theme} device="desktop" limit={4} />
        </div>
      )}
    </div>
  )
}

/**
 * Prévia do editor: moldura de tamanho fixo com rolagem interna. No desktop, a página é
 * reduzida para caber na largura; no celular, aparece em 390 px dentro de um aparelho.
 */
export function PreviewFrame({
  template,
  theme,
  device,
  selected,
  onToggleSection,
}: {
  template: TemplateModel
  theme: TplTheme
  device: 'desktop' | 'mobile'
  selected: string[]
  onToggleSection: (id: string) => void
}) {
  const [frameRef, frame] = useSize<HTMLDivElement>()
  const [innerRef, inner] = useSize<HTMLDivElement>()
  const mobile = device === 'mobile'
  const virtual = mobile ? MOBILE_W : DESKTOP_W
  const avail = mobile ? frame.w - 40 : frame.w
  const scale = frame.w ? Math.min(1, Math.max(0.2, avail / virtual)) : mobile ? 1 : 0.6
  const stage: CSSProperties = {
    width: virtual * scale,
    height: inner.h ? inner.h * scale : undefined,
    margin: mobile ? '20px auto' : 0,
  }
  return (
    <div
      ref={frameRef}
      className="tpl-frame"
      data-device={device}
      style={{ ['--tpl-inv' as string]: String(1 / scale) }}
      data-testid="template-preview"
    >
      <div className="tpl-frame__stage" style={stage}>
        <div
          ref={innerRef}
          className={mobile ? 'tpl-frame__inner tpl-frame__inner--phone' : 'tpl-frame__inner'}
          style={{ width: virtual, transform: scale === 1 ? undefined : `scale(${scale})` }}
        >
          <TemplateRender template={template} theme={theme} device={device} selected={selected} onToggleSection={onToggleSection} />
        </div>
      </div>
    </div>
  )
}
