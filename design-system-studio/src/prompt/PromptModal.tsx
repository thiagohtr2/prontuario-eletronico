import { useMemo } from 'react'
import { Download } from 'lucide-react'
import { downloadFile, slugify } from '@/core/download'
import { useStudio } from '@/core/store'
import { Button, Callout, CopyButton, Modal } from '@/ui'
import { itemForTarget, KIND_LABEL, targetTitle, type PromptTarget } from './items'
import { renderItemPrompt } from './text'

/**
 * Modal do prompt individual. Fica em um arquivo próprio, carregado só quando a pessoa abre um
 * prompt: assim o motor de prompts e os catálogos não pesam no carregamento das telas (TE-14).
 */
export default function PromptModal({ target, onClose }: { target: PromptTarget; onClose: () => void }) {
  const project = useStudio((s) => s.project)
  const { text, title } = useMemo(() => {
    const item = itemForTarget(target, project)
    // O nome do arquivo e o título vêm do próprio elemento (nada de “prompt-elemento.md”).
    return {
      text: item ? renderItemPrompt(item, project) : null,
      title: item && (target.kind === 'component' || target.kind === 'item') ? `${KIND_LABEL[item.kind]} ${item.name}` : targetTitle(target),
    }
  }, [target, project])

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
      {text ? <pre className="ui-code" tabIndex={0} data-testid="prompt-text">{text}</pre> : <Callout tone="warning">Este elemento não foi encontrado no catálogo.</Callout>}
    </Modal>
  )
}
