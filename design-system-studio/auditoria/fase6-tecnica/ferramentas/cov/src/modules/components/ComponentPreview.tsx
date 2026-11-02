import { Component, useMemo, type CSSProperties, type ErrorInfo, type ReactNode } from 'react'
import type { PropValue } from '@/core/project'
import type { ResolvedTheme } from '@/core/types'
import { categoryById, familyById, resolveValues, visualFamilies } from './catalog'
import { PreviewContext, type PreviewCtx } from './kit'
import { resolveLook } from './look'
import { rendererFor } from './renderers'
import type { PreviewState } from './types'
import './components.css'

export interface ComponentPreviewProps {
  categoryId: string
  familyId: string
  /** Identidade resolvida (use `useResolvedTheme(instance.tokenOverrides)` para exceções individuais). */
  theme: ResolvedTheme
  /** Configuração da instância (sobrepõe os padrões da categoria). */
  props?: Record<string, PropValue>
  state?: PreviewState
  /** Edição por clique: recebe o nome da parte clicada (`data-part`). */
  onPartClick?: (part: string) => void
  /** Parte destacada no momento (contorno). */
  activePart?: string | null
  /** Altura fixa do palco (px). Padrão: 280. */
  height?: number
  large?: boolean
  className?: string
  style?: CSSProperties
}

class PreviewBoundary extends Component<{ children: ReactNode; resetKey: string }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false })
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('Prévia de componente falhou:', error, info.componentStack)
  }
  render() {
    return this.state.failed ? <div className="cmp-pv__error">Prévia indisponível</div> : this.props.children
  }
}

/**
 * Prévia de um componente (categoria × família) herdando a paleta global. Usada na
 * galeria, no editor e (opcionalmente) na prévia do site ao vivo.
 */
export function ComponentPreview({ categoryId, familyId, theme, props, state = 'normal', onPartClick, activePart, height = 280, large, className, style }: ComponentPreviewProps) {
  const category = categoryById(categoryId)
  const family = familyById(familyId) ?? visualFamilies[0]
  const look = useMemo(() => resolveLook(theme, family), [theme, family])
  const values = useMemo(() => resolveValues(category, props), [category, props])
  const ctx = useMemo<PreviewCtx>(() => ({ L: look, state, onPart: onPartClick, activePart }), [look, state, onPartClick, activePart])
  const def = rendererFor(categoryId)
  const frame = def?.frame ?? 'center'
  const classes = ['cmp-pv', `cmp-pv--${frame}`, onPartClick ? 'cmp-pv--editable' : '', large ? 'cmp-pv--large' : '', className ?? ''].filter(Boolean).join(' ')

  return (
    <div className={classes} style={{ height, background: look.stage, color: look.text, fontFamily: look.font, ...style }} data-family={family.id} data-category={categoryId}>
      {def && category ? (
        <PreviewContext.Provider value={ctx}>
          <PreviewBoundary resetKey={`${categoryId}:${family.id}`}>
            <div className="cmp-pv__inner">
              <def.render v={values} st={state} large={large} />
            </div>
          </PreviewBoundary>
        </PreviewContext.Provider>
      ) : (
        <div className="cmp-pv__error">Componente não encontrado</div>
      )}
    </div>
  )
}
