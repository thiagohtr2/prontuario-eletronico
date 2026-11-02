import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Largura interna (content box) de um elemento, atualizada com ResizeObserver. */
export function useElementWidth<T extends HTMLElement>(): [RefObject<T>, number] {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.clientWidth)
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width]
}

/**
 * Miniatura: renderiza o conteúdo em uma largura virtual fixa (ex.: 1280 px) e reduz com
 * transform: scale() até caber na largura do cartão. Sem interação (pointer-events: none).
 */
export function ScaledThumb({
  virtualWidth,
  height,
  ratio,
  fade,
  children,
}: {
  virtualWidth: number
  /** Esmaece a borda inferior quando o conteúdo é cortado. */
  fade?: boolean
  height?: number
  /** Proporção CSS, ex.: "16 / 10". Usada quando não há altura fixa. */
  ratio?: string
  children: ReactNode
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const scale = (width || 320) / virtualWidth
  return (
    <div ref={ref} className={fade ? 'ent-thumb ent-thumb--fade' : 'ent-thumb'} aria-hidden="true" style={{ height, aspectRatio: height ? undefined : ratio }}>
      <div className="ent-thumb__inner" style={{ width: virtualWidth, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}

/**
 * Moldura de altura fixa com rolagem interna. O conteúdo é desenhado na largura virtual e
 * reduzido (nunca ampliado) para caber; a altura rolável acompanha o conteúdo escalado.
 */
export function FitFrame({ virtualWidth, height, resetKey, children, label }: { virtualWidth: number; height: string | number; resetKey?: string; children: ReactNode; label?: string }) {
  const [outerRef, width] = useElementWidth<HTMLDivElement>()
  const innerRef = useRef<HTMLDivElement>(null)
  const [contentH, setContentH] = useState(0)
  const scale = Math.min(1, (width || virtualWidth) / virtualWidth)

  useIsoLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return
    setContentH(el.offsetHeight)
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setContentH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (outerRef.current) outerRef.current.scrollTop = 0
  }, [resetKey, outerRef])

  return (
    <div ref={outerRef} className="ent-fit" style={{ height }} tabIndex={0} role="region" aria-label={label ?? 'Prévia com rolagem interna'}>
      <div className="ent-fit__sizer" style={{ height: contentH ? contentH * scale : undefined, width: virtualWidth * scale, margin: '0 auto' }}>
        <div ref={innerRef} className="ent-fit__inner" style={{ width: virtualWidth, transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  )
}

/** Palco da prévia: navegador no computador ou celular em moldura de aparelho. Altura fixa. */
export function PreviewStage({
  device,
  resetKey,
  children,
  desktopWidth = 1280,
  label,
}: {
  device: 'desktop' | 'mobile'
  resetKey?: string
  children: ReactNode
  desktopWidth?: number
  label?: string
}) {
  if (device === 'mobile') {
    return (
      <div className="ent-stage ent-stage--phone">
        <div className="ent-phone" style={{ maxWidth: 390 + 18 }}>
          <div className="ent-phone__bar" aria-hidden="true">
            <span>9:41</span>
            <span className="ent-phone__notch" />
            <span>100%</span>
          </div>
          <FitFrame virtualWidth={390} height="min(680px, 62vh)" resetKey={`${resetKey}-m`} label={label}>
            {children}
          </FitFrame>
        </div>
      </div>
    )
  }
  return (
    <div className="ent-stage">
      <FitFrame virtualWidth={desktopWidth} height="min(640px, 62vh)" resetKey={`${resetKey}-d`} label={label}>
        {children}
      </FitFrame>
    </div>
  )
}
