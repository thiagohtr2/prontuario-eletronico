import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ComponentType } from 'react'
import type { SitePalette, SiteProps } from './types'

/** Largura virtual em que os sites são desenhados no desktop. */
export const VIRTUAL_WIDTH = 1280

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Observa largura (clientWidth) de um elemento e altura natural de outro. */
function useMeasure(initialWidth: number, initialHeight: number) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: initialWidth, h: initialHeight })
  useIsoLayoutEffect(() => {
    const o = outer.current
    const i = inner.current
    if (!o || !i) return
    const read = () => setSize((s) => (s.w === o.clientWidth && s.h === i.offsetHeight ? s : { w: o.clientWidth || s.w, h: i.offsetHeight || s.h }))
    read()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(read)
    ro.observe(o)
    ro.observe(i)
    return () => ro.disconnect()
  }, [])
  return { outer, inner, ...size }
}

/**
 * Miniatura viva: o site é desenhado a 1280 px e reduzido com `transform: scale()` dentro
 * de uma caixa de altura fixa. Ao passar o mouse no cartão, a página desliza devagar.
 */
export function SiteThumbnail({ Site, palette, height = 228 }: { Site: ComponentType<SiteProps>; palette: SitePalette; height?: number }) {
  const { outer, inner, w, h } = useMeasure(320, 2400)
  const scale = w / VIRTUAL_WIDTH
  const travel = Math.max(0, Math.min(h * scale - height, height * 4))
  return (
    <div
      ref={outer}
      className="ins-thumb"
      aria-hidden="true"
      style={{ height, background: palette.bg, ['--ins-s' as string]: scale, ['--ins-travel' as string]: `${travel}px` } as CSSProperties}
    >
      <div ref={inner} className="ins-thumb__inner" style={{ width: VIRTUAL_WIDTH }}>
        <Site palette={palette} device="desktop" />
      </div>
    </div>
  )
}

/** Navegador de mentira com o site em tamanho de desktop, reduzido para caber e rolável. */
export function BrowserFrame({
  Site,
  palette,
  domain,
  scrollRef,
}: {
  Site: ComponentType<SiteProps>
  palette: SitePalette
  domain: string
  scrollRef?: React.RefObject<HTMLDivElement>
}) {
  const { outer, inner, w, h } = useMeasure(860, 4000)
  const scale = Math.min(1, w / VIRTUAL_WIDTH)
  return (
    <div className="ins-browser">
      <div className="ins-browser__bar" aria-hidden="true">
        <span className="ins-browser__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="ins-browser__url">{domain}</span>
        <span className="ins-browser__dots ins-browser__dots--ghost" />
      </div>
      <div
        ref={(el) => {
          ;(outer as React.MutableRefObject<HTMLDivElement | null>).current = el
          if (scrollRef) (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el
        }}
        className="ins-browser__view"
        style={{ background: palette.bg }}
        tabIndex={0}
        aria-label="Prévia do site no computador (role para ver a página inteira)"
      >
        <div style={{ height: h * scale, position: 'relative' }}>
          <div ref={inner} style={{ width: VIRTUAL_WIDTH, transform: `scale(${scale})`, transformOrigin: '0 0', position: 'absolute', top: 0, left: 0 }}>
            <Site palette={palette} device="desktop" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Celular de ~390 px com o site desenhado para mobile, rolável. */
export function PhoneFrame({
  Site,
  palette,
  scrollRef,
}: {
  Site: ComponentType<SiteProps>
  palette: SitePalette
  scrollRef?: React.RefObject<HTMLDivElement>
}) {
  return (
    <div className="ins-phone">
      <div className="ins-phone__screen" style={{ background: palette.bg, color: palette.text }}>
        <div className="ins-phone__status" aria-hidden="true">
          <span>9:41</span>
          <span className="ins-phone__island" />
          <span className="ins-phone__icons">
            <i />
            <i />
            <b />
          </span>
        </div>
        <div ref={scrollRef} className="ins-phone__view" tabIndex={0} aria-label="Prévia do site no celular (role para ver a página inteira)">
          <Site palette={palette} device="mobile" />
        </div>
      </div>
    </div>
  )
}
