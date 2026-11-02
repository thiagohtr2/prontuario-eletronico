import { useMemo, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { downloadFile, slugify } from '@/core/download'
import { useStudio } from '@/core/store'
import { Button, Callout, CopyButton, Modal } from '@/ui'
import { itemForTarget, targetTitle, type PromptTarget } from './items'
import { renderItemPrompt } from './text'

/**
 * Ação padrão "Gerar prompt deste elemento". Abre um modal com o prompt individual
 * (autossuficiente, com regras de identidade e responsividade), pronto para copiar ou baixar.
 */
export function PromptButton({
  target,
  label = 'Prompt deste elemento',
  size = 'sm',
  variant = 'ghost',
}: {
  target: PromptTarget
  label?: string
  size?: 'sm' | 'md'
  variant?: 'ghost' | 'secondary'
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size={size} variant={variant} icon={<FileText />} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && <PromptModal target={target} onClose={() => setOpen(false)} />}
    </>
  )
}

export function PromptModal({ target, onClose }: { target: PromptTarget; onClose: () => void }) {
  const project = useStudio((s) => s.project)
  const text = useMemo(() => {
    const item = itemForTarget(target, project)
    return item ? renderItemPrompt(item, project) : null
  }, [target, project])
  const title = targetTitle(target)

  return (
    <Modal
      open
      onClose={onClose}
      width={820}
      title={`Prompt individual — ${title}`}
      subtitle="Autossuficiente: inclui a identidade herdada e as regras de responsividade. Cole em Claude Code, Cursor ou outra IA."
      testId="prompt-modal"
      footer={
        text ? (
          <>
            <Button icon={<Download />} onClick={() => downloadFile(`prompt-${slugify(title)}.md`, text, 'text/markdown')}>
              Baixar .md
            </Button>
            <CopyButton text={text} variant="primary" label="Copiar prompt" />
          </>
        ) : undefined
      }
    >
      {text ? <pre className="ui-code" data-testid="prompt-text">{text}</pre> : <Callout tone="warning">Este elemento não foi encontrado no catálogo.</Callout>}
    </Modal>
  )
}
