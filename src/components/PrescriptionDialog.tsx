import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Download, ExternalLink, FileText } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { ErrorState, Spinner } from './ui/States'
import { errorMessage } from '../lib/api'
import { itensPreenchidos, nomeDoArquivo, PAPEIS, pendenciasDaReceita } from '../lib/prescription/model'
import type { PrescriptionInput } from '../lib/prescription/model'

type State =
  | { status: 'loading' }
  | { status: 'ready'; url: string; input: PrescriptionInput; pendencias: string[] }
  | { status: 'error'; message: string }

/**
 * Gera a receita em PDF e mostra a pré-visualização. No celular, onde os
 * navegadores não exibem PDF dentro da página, mostra um resumo e os botões
 * para abrir ou baixar o arquivo.
 */
export function PrescriptionDialog({
  open,
  onClose,
  getInput,
}: {
  open: boolean
  onClose: () => void
  /** Monta os dados da receita (pode buscar no banco). Chamado a cada abertura. */
  getInput: () => PrescriptionInput | Promise<PrescriptionInput>
}) {
  const [state, setState] = useState<State>({ status: 'loading' })
  const getInputRef = useRef(getInput)
  getInputRef.current = getInput

  const build = useCallback(async (isActive: () => boolean) => {
    setState({ status: 'loading' })
    try {
      const input = await getInputRef.current()
      // A biblioteca de PDF e as fontes só são baixadas aqui, na primeira receita.
      const { generatePrescriptionPdf } = await import('../lib/prescription/generate')
      const blob = await generatePrescriptionPdf(input)
      if (!isActive()) return
      setState({ status: 'ready', url: URL.createObjectURL(blob), input, pendencias: pendenciasDaReceita(input) })
    } catch (caught) {
      console.error('Falha ao gerar a receita:', caught)
      if (isActive()) setState({ status: 'error', message: errorMessage(caught, 'Não foi possível gerar o PDF. Tente novamente.') })
    }
  }, [])

  useEffect(() => {
    if (!open) return
    let active = true
    void build(() => active)
    return () => {
      active = false
    }
  }, [open, build])

  // Libera o arquivo da memória quando a receita muda ou o diálogo fecha.
  const url = state.status === 'ready' ? state.url : null
  useEffect(() => {
    if (!url) return
    return () => URL.revokeObjectURL(url)
  }, [url])

  const ready = state.status === 'ready' ? state : null
  const fileName = ready ? nomeDoArquivo(ready.input.patient.nome, ready.input.dataHora) : 'receita.pdf'

  function download() {
    if (!ready) return
    const link = document.createElement('a')
    link.href = ready.url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const total = ready ? itensPreenchidos(ready.input.itens).length : 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={ready?.input.exemplo ? 'Modelo do receituário' : 'Receita'}
      description={
        ready
          ? `${ready.input.patient.nome} · ${PAPEIS[ready.input.doctor.papel_receituario].split(' ')[0]}`
          : 'Preparando o PDF com seus dados e os da clínica.'
      }
      size="lg"
      footer={
        <>
          <Button
            variant="secondary"
            icon={<ExternalLink size={18} />}
            disabled={!ready}
            onClick={() => ready && window.open(ready.url, '_blank', 'noopener')}
          >
            Abrir PDF
          </Button>
          <Button variant="primary" icon={<Download size={18} />} disabled={!ready} onClick={download}>
            Baixar PDF
          </Button>
        </>
      }
    >
      {state.status === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-muted" role="status">
          <Spinner />
          <span>Gerando a receita...</span>
        </div>
      )}

      {state.status === 'error' && (
        <ErrorState
          message={state.message}
          action={
            <Button variant="secondary" onClick={() => void build(() => true)}>
              Tentar novamente
            </Button>
          }
        />
      )}

      {ready && (
        <div className="flex flex-col gap-4">
          {ready.pendencias.length > 0 && (
            <div className="flex gap-3 rounded-brand bg-warning-soft px-4 py-3" role="note">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warning" aria-hidden />
              <div className="min-w-0 text-sm text-ink">
                <p className="font-semibold">Confira antes de imprimir</p>
                <ul className="mt-1 flex list-disc flex-col gap-1 pl-4">
                  {ready.pendencias.map((pendencia) => (
                    <li key={pendencia}>{pendencia}</li>
                  ))}
                </ul>
                <Link
                  to="/configuracoes"
                  onClick={onClose}
                  className="-ml-3 mt-1 inline-flex min-h-touch items-center rounded-pill px-3 font-medium text-primary hover:bg-primary-soft"
                >
                  Completar meu perfil
                </Link>
              </div>
            </div>
          )}

          {/* Pré-visualização: só a partir do tablet. */}
          <iframe
            title="Pré-visualização da receita"
            src={`${ready.url}#toolbar=1&view=FitH`}
            className="hidden h-[min(68dvh,760px)] w-full rounded-brand border border-line bg-surface-hover md:block"
          />
          <p className="hidden text-xs text-muted md:block">
            A pré-visualização não apareceu? Use Abrir PDF para ver e imprimir em outra aba.
          </p>

          <div className="flex items-center gap-4 rounded-brand border border-line p-4 md:hidden">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-primary-soft text-primary">
              <FileText size={22} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="break-all text-sm font-semibold text-ink">{fileName}</p>
              <p className="mt-1 text-xs text-muted">
                {total > 0 ? `${total} ${total === 1 ? 'medicamento' : 'medicamentos'} · ` : ''}
                {PAPEIS[ready.input.doctor.papel_receituario]}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted md:hidden">
            Toque em Abrir PDF para ver e imprimir, ou em Baixar PDF para salvar no aparelho.
          </p>
        </div>
      )}
    </Modal>
  )
}
