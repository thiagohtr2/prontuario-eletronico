import { useState } from 'react'
import { History, RotateCcw, Save, Trash2 } from 'lucide-react'
import { useProject, useStudio } from '@/core/store'
import { relativeTime } from '@/core/time'
import { Actions, Badge, Button, Callout, Field, Input, Modal, PageHeader, Section, Segmented, Switch, toast } from '@/ui'
import './project.css'

export default function ProjectPage() {
  const history = useStudio((s) => s.history)
  const saveSnapshot = useStudio((s) => s.saveSnapshot)
  const restoreSnapshot = useStudio((s) => s.restoreSnapshot)
  const deleteSnapshot = useStudio((s) => s.deleteSnapshot)
  const resetProject = useStudio((s) => s.resetProject)
  const setPrefs = useStudio((s) => s.setPrefs)
  const setDepth = useStudio((s) => s.setDepth)
  const prefs = useStudio((s) => s.project.prefs)
  const depth = useProject((p) => p.depth)
  const name = useProject((p) => p.meta.name)
  const createdAt = useProject((p) => p.createdAt)
  const updatedAt = useProject((p) => p.updatedAt)
  const [label, setLabel] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmRestore, setConfirmRestore] = useState<string | null>(null)

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Ferramentas"
        title="Projeto e versões"
        description="Salve versões do projeto para comparar direções ou voltar atrás. O projeto atual é salvo automaticamente a cada alteração."
      />

      <Section title="Projeto atual">
        <dl className="ui-dl">
          <div>
            <dt>Nome</dt>
            <dd>{name || 'Projeto sem nome'}</dd>
          </div>
          <div>
            <dt>Criado</dt>
            <dd>{new Date(createdAt).toLocaleString('pt-BR')}</dd>
          </div>
          <div>
            <dt>Última alteração</dt>
            <dd>{relativeTime(updatedAt)}</dd>
          </div>
          <div>
            <dt>Armazenamento</dt>
            <dd>Neste navegador (localStorage). Para levar a outro computador, exporte um backup em “Exportar e importar”.</dd>
          </div>
        </dl>
      </Section>

      <Section title="Preferências" description="Valem para todo o Studio e para os dois modos.">
        <div className="u-stack">
          <Switch checked={prefs.showLegends} onChange={(v) => setPrefs({ showLegends: v })} label="Mostrar legendas nos desenhos" description="Etiquetas como HEADER, SIDEBAR e CONTEÚDO nos desenhos de layout (desktop e celular)." />
          <Switch checked={prefs.showHints} onChange={(v) => setPrefs({ showHints: v })} label="Mostrar dicas para iniciantes" description="Explicações curtas sobre cada decisão. Desative se você já conhece os termos." />
          <div className="u-stack-sm">
            <span className="ui-label">Profundidade dos controles</span>
            <Segmented
              label="Profundidade dos controles"
              value={depth}
              onChange={setDepth}
              options={[
                { value: 'essential', label: 'Essencial' },
                { value: 'advanced', label: 'Avançado' },
              ]}
            />
            <span className="ui-help">Essencial mostra as decisões importantes; Avançado mostra propriedades técnicas detalhadas (tokens, medidas, JSON).</span>
          </div>
        </div>
      </Section>

      <Section title="Versões salvas" description="Até 30 versões. Antes de importar, restaurar ou limpar, o Studio salva uma versão automaticamente.">
        <form
          className="u-row"
          onSubmit={(e) => {
            e.preventDefault()
            saveSnapshot(label || `Versão de ${new Date().toLocaleString('pt-BR')}`)
            setLabel('')
            toast.success('Versão salva.')
          }}
        >
          <div className="u-grow" style={{ flexBasis: 260 }}>
            <Field label="Nome da versão" htmlFor="snap-label">
              <Input id="snap-label" value={label} placeholder="Ex.: Direção escura com sidebar flutuante" onChange={(e) => setLabel(e.target.value)} />
            </Field>
          </div>
          <Button type="submit" variant="primary" icon={<Save />} style={{ alignSelf: 'flex-end' }}>
            Salvar versão
          </Button>
        </form>
        {history.length === 0 ? (
          <Callout>Nenhuma versão salva ainda.</Callout>
        ) : (
          <ul className="snap-list">
            {history.map((h) => (
              <li key={h.id} className="snap-item">
                <div className="snap-item__meta">
                  <strong className="u-truncate">{h.label}</strong>
                  <span className="u-subtle u-small">
                    <History width={13} height={13} style={{ verticalAlign: '-2px' }} aria-hidden="true" /> {new Date(h.createdAt).toLocaleString('pt-BR')} · {h.project.meta.name || 'Projeto sem nome'}
                  </span>
                </div>
                <Actions>
                  <Button size="sm" icon={<RotateCcw />} onClick={() => setConfirmRestore(h.id)}>
                    Restaurar
                  </Button>
                  <Button size="sm" variant="ghost" icon={<Trash2 />} onClick={() => deleteSnapshot(h.id)} aria-label={`Excluir versão ${h.label}`}>
                    Excluir
                  </Button>
                </Actions>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Limpar projeto" description="Apaga todas as escolhas e começa do zero. Uma versão de segurança é salva antes.">
        <div>
          <Button variant="danger" icon={<Trash2 />} onClick={() => setConfirmReset(true)} data-testid="reset-project">
            Limpar projeto
          </Button>
        </div>
      </Section>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Limpar o projeto?"
        subtitle="Todas as escolhas serão apagadas. Você poderá recuperar o estado atual em “Versões salvas”."
        width={480}
        footer={
          <>
            <Button onClick={() => setConfirmReset(false)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() => {
                resetProject()
                setConfirmReset(false)
                toast.success('Projeto limpo. Uma versão de segurança foi salva.')
              }}
              data-testid="confirm-reset"
            >
              Sim, limpar
            </Button>
          </>
        }
      >
        <Badge tone="warning">Esta ação substitui o projeto atual</Badge>
      </Modal>

      <Modal
        open={confirmRestore !== null}
        onClose={() => setConfirmRestore(null)}
        title="Restaurar esta versão?"
        subtitle="O projeto atual será substituído. Antes disso, o Studio salva uma versão do estado atual."
        width={480}
        footer={
          <>
            <Button onClick={() => setConfirmRestore(null)}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (confirmRestore) restoreSnapshot(confirmRestore)
                setConfirmRestore(null)
                toast.success('Versão restaurada.')
              }}
            >
              Restaurar
            </Button>
          </>
        }
      >
        <p className="u-muted">Você pode desfazer restaurando a versão “Antes de restaurar uma versão”.</p>
      </Modal>
    </div>
  )
}
