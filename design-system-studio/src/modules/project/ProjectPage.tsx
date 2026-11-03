import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Copy, Download, FilePlus2, FolderOpen, GitCompare, History, RefreshCcw, RotateCcw, Save, Trash2 } from 'lucide-react'
import { downloadJson, slugify } from '@/core/download'
import { useProject, useStudio } from '@/core/store'
import { relativeTime } from '@/core/time'
import { diffProjects, diffPrompts } from '@/prompt/diff'
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
  const [compareId, setCompareId] = useState<string | null>(null)
  // Vindo do “Começar do zero” da tela inicial, a confirmação já abre.
  const location = useLocation()
  const [confirmWipe, setConfirmWipe] = useState(() => Boolean((location.state as { wipe?: boolean } | null)?.wipe))
  const [understood, setUnderstood] = useState(false)
  const navigate = useNavigate()
  const project = useStudio((s) => s.project)
  const library = useStudio((s) => s.library)
  const { newProject, openProject, deleteLibraryProject, duplicateProject } = useStudio.getState()
  const compared = history.find((h) => h.id === compareId)
  const changes = compared ? diffProjects(compared.project, project) : []
  const promptDelta = compared ? diffPrompts(compared.project, project) : null

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

      <Section title="Seus projetos" description="Vários projetos neste navegador, cada um com as próprias versões. Abrir outro projeto guarda o atual aqui automaticamente.">
        <div className="ui-actions" style={{ marginBottom: 12 }}>
          <Button
            icon={<FilePlus2 />}
            onClick={() => {
              newProject()
              toast.success('Projeto novo aberto. O anterior ficou em “Seus projetos”.')
            }}
            data-testid="new-project"
          >
            Novo projeto
          </Button>
          <Button
            variant="ghost"
            icon={<Copy />}
            onClick={() => {
              duplicateProject()
              toast.success('Cópia guardada em “Seus projetos”.')
            }}
          >
            Duplicar o atual
          </Button>
        </div>
        <ul className="snap-list" data-testid="project-library">
          <li className="snap-item" data-current="true">
            <div className="snap-item__meta">
              <strong className="u-truncate">{name || 'Projeto sem nome'}</strong>
              <span className="u-subtle u-small">Aberto agora · alterado {relativeTime(updatedAt)}</span>
            </div>
            <Badge tone="accent">Atual</Badge>
          </li>
          {library.map((e) => (
            <li key={e.id} className="snap-item">
              <div className="snap-item__meta">
                <strong className="u-truncate">{e.name}</strong>
                <span className="u-subtle u-small">
                  Guardado {relativeTime(e.savedAt)} · {e.history.length} versão(ões)
                </span>
              </div>
              <Actions>
                <Button
                  size="sm"
                  icon={<FolderOpen />}
                  onClick={() => {
                    openProject(e.id)
                    toast.success(`“${e.name}” aberto. O projeto anterior ficou em “Seus projetos”.`)
                  }}
                >
                  Abrir
                </Button>
                <Button size="sm" variant="ghost" icon={<Trash2 />} onClick={() => deleteLibraryProject(e.id)} aria-label={`Excluir projeto ${e.name}`}>
                  Excluir
                </Button>
              </Actions>
            </li>
          ))}
        </ul>
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
                  <Button size="sm" variant="ghost" icon={<GitCompare />} onClick={() => setCompareId(h.id)}>
                    Comparar com o atual
                  </Button>
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

      <Section
        id="recomecar"
        title="Recomeçar do zero"
        description="Apaga tudo o que o Studio guardou neste navegador: o projeto atual, todas as versões, os outros projetos e as preferências. O Studio volta exatamente como na primeira vez."
      >
        <div>
          <Button
            variant="danger"
            icon={<RefreshCcw />}
            onClick={() => {
              setUnderstood(false)
              setConfirmWipe(true)
            }}
            data-testid="reset-everything"
          >
            Apagar tudo e começar do zero
          </Button>
        </div>
      </Section>

      <Section title="Limpar só o projeto atual" description="Apaga as escolhas do projeto aberto e mantém as versões e os outros projetos. Uma versão de segurança é salva antes.">
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
        open={confirmWipe}
        onClose={() => setConfirmWipe(false)}
        title="Apagar tudo e começar do zero?"
        subtitle="Isto não pode ser desfeito. Se quiser guardar alguma coisa, baixe um backup antes."
        width={520}
        testId="reset-everything-modal"
        footer={
          <>
            <Button onClick={() => setConfirmWipe(false)}>Cancelar</Button>
            <Button
              variant="danger"
              disabled={!understood}
              onClick={() => {
                useStudio.getState().resetEverything()
                setConfirmWipe(false)
                navigate('/')
                toast.success('Tudo apagado. O Studio está como na primeira vez.')
              }}
              data-testid="confirm-reset-everything"
            >
              Apagar tudo
            </Button>
          </>
        }
      >
        <div className="u-stack">
          <ul className="wipe-list">
            <li>O projeto atual ({name || 'Projeto sem nome'})</li>
            <li>{history.length} versão(ões) salva(s)</li>
            <li>{library.length} outro(s) projeto(s) em “Seus projetos”</li>
            <li>Preferências e cópias de recuperação deste navegador</li>
          </ul>
          <div>
            <Button
              size="sm"
              icon={<Download />}
              onClick={() => downloadJson(`${slugify(name || 'projeto')}-backup.json`, { kind: 'atelier-ui/backup', exportedAt: new Date().toISOString(), project, history, library })}
            >
              Baixar backup antes
            </Button>
          </div>
          <Switch checked={understood} onChange={setUnderstood} label="Entendo que tudo será apagado e que não dá para desfazer" id="wipe-understood" />
        </div>
      </Modal>

      <Modal
        open={Boolean(compared)}
        onClose={() => setCompareId(null)}
        title={compared ? `“${compared.label}” × projeto atual` : ''}
        subtitle={promptDelta ? `Master Prompt: ${promptDelta.removed} linha(s) saíram e ${promptDelta.added} entraram.` : undefined}
        width={760}
        testId="compare-modal"
        footer={
          <>
            <Button onClick={() => setCompareId(null)}>Fechar</Button>
            <Button
              variant="primary"
              icon={<RotateCcw />}
              onClick={() => {
                if (compareId) setConfirmRestore(compareId)
                setCompareId(null)
              }}
            >
              Restaurar esta versão
            </Button>
          </>
        }
      >
        {changes.length === 0 ? (
          <Callout tone="success">Nenhuma decisão mudou entre esta versão e o projeto atual.</Callout>
        ) : (
          <table className="cmp-table">
            <thead>
              <tr>
                <th scope="col">Decisão</th>
                <th scope="col">Na versão</th>
                <th scope="col">Agora</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((c) => (
                <tr key={`${c.area}-${c.label}`}>
                  <th scope="row">
                    <span className="u-subtle u-small">{c.area}</span>
                    <br />
                    {c.label}
                  </th>
                  <td>{c.before}</td>
                  <td>{c.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
