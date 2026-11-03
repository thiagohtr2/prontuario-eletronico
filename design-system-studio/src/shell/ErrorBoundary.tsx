import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useRouteError } from 'react-router-dom'

/**
 * Erros de renderização ou de carregamento de um módulo não derrubam o Studio: o menu e a barra
 * do topo continuam visíveis, e a pessoa vê uma mensagem em português com como seguir (TE-05).
 */

function ErrorPanel({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const chunk = error instanceof Error && /dynamically imported module|Failed to fetch|Loading chunk|Importing a module script failed/i.test(error.message)
  return (
    <div className="ui-page" role="alert" data-testid="error-panel">
      <h1 style={{ fontSize: 22, margin: '0 0 8px' }}>Esta tela não pôde ser aberta.</h1>
      <p className="u-muted" style={{ maxWidth: 560 }}>
        {chunk
          ? 'Parte do Studio não carregou (conexão instável ou uma versão nova foi publicada). Seu projeto continua salvo neste navegador.'
          : 'Algo deu errado ao montar esta tela. Seu projeto continua salvo neste navegador; você pode tentar de novo ou ir para outra tela pelo menu.'}
      </p>
      <div className="ui-actions" style={{ marginTop: 16 }}>
        {onRetry && (
          <button type="button" className="ui-btn ui-btn--primary" onClick={onRetry}>
            Tentar de novo
          </button>
        )}
        <button type="button" className="ui-btn ui-btn--secondary" onClick={() => window.location.reload()}>
          Recarregar o Studio
        </button>
      </div>
      {error instanceof Error && (
        <details style={{ marginTop: 16 }}>
          <summary className="u-subtle u-small">Detalhes técnicos</summary>
          <pre className="ui-code" style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
        </details>
      )}
    </div>
  )
}

/** Envolve o conteúdo das rotas; “Tentar de novo” remonta a tela. */
export class ContentBoundary extends Component<{ children: ReactNode; resetKey: string }, { error: unknown }> {
  state: { error: unknown } = { error: null }

  static getDerivedStateFromError(error: unknown) {
    return { error }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Erro em uma tela do Studio:', error, info.componentStack)
  }

  componentDidUpdate(prev: { resetKey: string }) {
    // Trocar de rota limpa o erro: a outra tela abre normalmente.
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null })
  }

  render() {
    if (this.state.error) return <ErrorPanel error={this.state.error} onRetry={() => this.setState({ error: null })} />
    return this.props.children
  }
}

/** `errorElement` da rota raiz (erros fora do conteúdo, como no próprio Shell). */
export function RouteError() {
  const error = useRouteError()
  return <ErrorPanel error={error} />
}
