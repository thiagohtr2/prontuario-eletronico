import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, ExternalLink } from 'lucide-react'
import { downloadFile, downloadJson, slugify } from '@/core/download'
import { useStudio } from '@/core/store'
import { KIND_LABEL, type PromptItem, type PromptSection } from '@/prompt/items'
import { PromptButton } from '@/prompt/PromptButton'
import { buildProjectSpec } from '@/prompt/spec'
import { renderMasterPrompt } from '@/prompt/text'
import { ALL_ENTRIES } from '@/shell/nav'
import { Badge, Button, Callout, CopyButton, EmptyState, Switch, Tabs, Textarea } from '@/ui'
import './prompts.css'

type Tab = 'master' | 'itens' | 'conflitos' | 'json'

const SECTION_LABEL: Record<PromptSection, string> = {
  architecture: 'B · Arquitetura',
  navigation: 'C · Navegação',
  identity: 'D · Identidade visual',
  components: 'E · Componentes',
  references: 'Referências visuais',
}

const SOURCE_PATH: Record<string, string> = {
  entrada: '/guiado/entrada',
  landing: '/modulos/landing',
  login: '/modulos/login',
  cadastro: '/modulos/cadastro',
  desktop: '/modulos/desktop',
  mobile: '/modulos/mobile',
  cores: '/modulos/cores',
  navegacao: '/modulos/navegacao',
  componentes: '/modulos/componentes',
  inspiracao: '/modulos/inspiracao',
  templates: '/modulos/templates',
}

function ItemRow({ item }: { item: PromptItem }) {
  const setExcluded = useStudio((s) => s.setExcluded)
  const setNote = useStudio((s) => s.setNote)
  const note = useStudio((s) => s.project.prompt.notes[item.key] ?? '')
  const [open, setOpen] = useState(Boolean(note))
  const path = SOURCE_PATH[item.source]
  const sourceLabel = ALL_ENTRIES.find((e) => e.path === path)?.label ?? item.source
  return (
    <li className="pc-item" data-included={item.included} data-testid={`prompt-item-${item.key}`}>
      <div className="pc-item__row">
        <div className="pc-item__main">
          <span className="pc-item__kind">{KIND_LABEL[item.kind]}</span>
          <span className="pc-item__name">
            {item.name}
            {item.variant && <span className="u-muted" style={{ fontWeight: 500 }}> — {item.variant}</span>}
          </span>
          <span className="pc-item__summary">{item.summary}</span>
          <span className="pc-item__id">
            {item.key} · origem:{' '}
            {path ? (
              <Link to={path}>
                {sourceLabel} <ExternalLink width={11} height={11} aria-hidden="true" />
              </Link>
            ) : (
              sourceLabel
            )}
          </span>
        </div>
        <div className="ui-actions">
          <Switch checked={item.included} onChange={(v) => setExcluded(item.key, !v)} label="No Master Prompt" />
        </div>
      </div>
      <div className="ui-actions">
        <PromptButton target={{ kind: 'item', key: item.key }} />
        <Button size="sm" variant="ghost" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {note ? 'Editar observação' : 'Adicionar observação ou exceção'}
        </Button>
      </div>
      {open && (
        <div className="pc-note">
          <label className="ui-label" htmlFor={`note-${item.key}`}>
            Observação para a IA (entra no prompt como exceção)
          </label>
          <Textarea id={`note-${item.key}`} rows={2} value={note} placeholder="Ex.: no celular, esconder o botão de ajuda." onChange={(e) => setNote(item.key, e.target.value)} />
        </div>
      )}
    </li>
  )
}

/** Central de prompts: Master Prompt, itens registrados, contradições e JSON. */
export function PromptWorkspace() {
  const project = useStudio((s) => s.project)
  const resolveConflict = useStudio((s) => s.resolveConflict)
  const spec = useMemo(() => buildProjectSpec(project), [project])
  const text = useMemo(() => renderMasterPrompt(spec), [spec])
  const json = useMemo(() => JSON.stringify(spec, null, 2), [spec])
  const [tab, setTab] = useState<Tab>('master')
  const included = spec.items.filter((i) => i.included)
  const openConflicts = spec.conflicts.filter((c) => !c.resolution)
  const base = slugify(project.meta.name || 'projeto')
  const sections = (Object.keys(SECTION_LABEL) as PromptSection[]).map((s) => ({ section: s, items: spec.items.filter((i) => i.section === s) })).filter((g) => g.items.length)

  const ready = spec.pending.length === 0 && openConflicts.length === 0

  return (
    <div>
      <section className="pc-next" data-ready={ready} data-testid="what-now" aria-labelledby="pc-next-title">
        <h2 id="pc-next-title">{ready ? 'Pronto para usar. O que fazer agora:' : 'Quase pronto. Antes de copiar:'}</h2>
        {!ready && (
          <p className="pc-next__check">
            {spec.pending.length > 0 && <span>{spec.pending.length} decisão(ões) pendente(s) (lista abaixo)</span>}
            {spec.pending.length > 0 && openConflicts.length > 0 && ' · '}
            {openConflicts.length > 0 && (
              <button type="button" className="pc-next__link" onClick={() => setTab('conflitos')}>
                {openConflicts.length} contradição(ões) para decidir
              </button>
            )}
            . Você pode copiar mesmo assim: a IA vai perguntar sobre o que estiver em aberto.
          </p>
        )}
        <ol className="pc-next__steps">
          <li>
            <span>Copie o Master Prompt.</span> <CopyButton text={text} size="sm" label="Copiar" />
          </li>
          <li>Abra sua IA de programação (Claude Code, Cursor, Lovable, Bolt, v0…) em um projeto novo e vazio.</li>
          <li>Cole o prompt e peça: “Construa o projeto seguindo exatamente esta especificação.”</li>
          <li>
            Com o site no ar, confira o resultado na <Link to="/validacao">Validação responsiva</Link>.
          </li>
        </ol>
      </section>

      <div className="pc-stats">
        <div className="pc-stat">
          <strong>{included.length}</strong>
          <span>itens no Master Prompt</span>
        </div>
        <div className="pc-stat">
          <strong>{spec.items.length - included.length}</strong>
          <span>retirados (seleção mantida)</span>
        </div>
        <div className="pc-stat" data-tone={openConflicts.length ? 'warning' : undefined}>
          <strong>{openConflicts.length}</strong>
          <span>contradições a decidir</span>
        </div>
        <div className="pc-stat" data-tone={spec.pending.length ? 'warning' : undefined}>
          <strong>{spec.pending.length}</strong>
          <span>decisões pendentes</span>
        </div>
      </div>

      {spec.pending.length > 0 && (
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <Callout tone="warning" title="Pendências:">
            <ul className="pc-pending">
              {spec.pending.map((p) => (
                <li key={p.id}>
                  <Link to={p.route}>{p.message}</Link>
                </li>
              ))}
            </ul>
          </Callout>
        </div>
      )}

      <Tabs
        label="Partes da Central de Prompts"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'master', label: 'Master Prompt' },
          { value: 'itens', label: `Itens (${spec.items.length})` },
          { value: 'conflitos', label: `Contradições (${spec.conflicts.length + spec.resolutions.length})` },
          { value: 'json', label: 'Especificação JSON' },
        ]}
      />

      {tab === 'master' && (
        <div className="u-stack">
          <div className="ui-actions">
            <CopyButton text={text} variant="primary" label="Copiar Master Prompt" />
            <Button icon={<Download />} onClick={() => downloadFile(`${base}-master-prompt.md`, text, 'text/markdown')} data-testid="download-master">
              Baixar .md
            </Button>
            <span className="u-subtle u-small">{text.length.toLocaleString('pt-BR')} caracteres · gerado a partir da especificação JSON</span>
          </div>
          <pre className="ui-code" tabIndex={0} style={{ maxHeight: 720 }} data-testid="master-prompt-text">
            {text}
          </pre>
        </div>
      )}

      {tab === 'itens' && (
        <div className="pc-items">
          <Callout>Cada escolha registra identificador, tipo, variante, propriedades, cores, estrutura, comportamento, responsividade e exceções. Desligar um item o retira do Master Prompt sem apagar a seleção.</Callout>
          {sections.map((g) => (
            <section key={g.section} className="pc-group">
              <h3>{SECTION_LABEL[g.section]}</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {g.items.map((item) => (
                  <ItemRow key={item.key} item={item} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {tab === 'conflitos' && (
        <div>
          {spec.resolutions.length > 0 && (
            <div className="pc-conflict" data-resolved="true" data-testid="auto-resolutions">
              <div className="u-row" style={{ justifyContent: 'space-between' }}>
                <strong>Resolvidas automaticamente pela precedência do Studio</strong>
                <Badge tone="success">{spec.resolutions.length} resolvida(s)</Badge>
              </div>
              <p className="u-muted">
                Modelos diferentes descreviam o mesmo fato com valores diferentes. Vale sempre: o layout desktop define estrutura e medidas; header e sidebar, só a aparência interna; o layout mobile, a
                navegação no celular; a identidade global, cores, fontes e raios; o conteúdo do projeto substitui o conteúdo de exemplo.
              </p>
              <ul className="pc-pending">
                {spec.resolutions.map((r) => (
                  <li key={r.id} data-testid={`resolution-${r.id}`}>
                    <strong>{r.title}:</strong> {r.instruction}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {spec.conflicts.length === 0 ? (
            <EmptyState title="Nenhuma contradição a decidir">As escolhas atuais são compatíveis entre si{spec.resolutions.length ? ' (as diferenças de medida e conteúdo acima já foram resolvidas)' : ''}.</EmptyState>
          ) : (
            spec.conflicts.map((c) => (
              <div key={c.id} className="pc-conflict" data-resolved={Boolean(c.resolution)} data-testid={`conflict-${c.id}`}>
                <div className="u-row" style={{ justifyContent: 'space-between' }}>
                  <strong>{c.title}</strong>
                  {c.resolution ? <Badge tone="success">Decidido</Badge> : <Badge tone="warning">Decida a prioridade</Badge>}
                </div>
                <p className="u-muted">{c.description}</p>
                <div className="pc-options" role="group" aria-label={`Opções para: ${c.title}`}>
                  {c.options.map((o) => (
                    <button key={o.id} type="button" className="pc-option" aria-pressed={c.resolution?.id === o.id} onClick={() => resolveConflict(c.id, c.resolution?.id === o.id ? null : o.id)}>
                      <strong>{o.label}</strong>
                      <span>{o.instruction}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'json' && (
        <div className="u-stack">
          <div className="ui-actions">
            <Button variant="primary" icon={<Download />} onClick={() => downloadJson(`${base}-especificacao.json`, spec)}>
              Baixar JSON
            </Button>
            <CopyButton text={json} label="Copiar JSON" />
            <span className="u-subtle u-small">Fonte da verdade: o texto do Master Prompt é gerado a partir deste objeto. Pode ser reimportado.</span>
          </div>
          <pre className="ui-code" tabIndex={0} style={{ maxHeight: 720 }}>
            {json}
          </pre>
        </div>
      )}
    </div>
  )
}
