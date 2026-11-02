import { useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Archive, Braces, FileCode2, FileText, Globe, Upload } from 'lucide-react'
import { downloadFile, downloadJson, htmlDocument, readJsonFile, slugify } from '@/core/download'
import { useStudio } from '@/core/store'
import { projectTheme } from '@/core/theme'
import { TOKEN_GROUPS } from '@/core/tokens'
import { IdentityPreview } from '@/modules/color/IdentityPreview'
import { buildProjectCss } from '@/prompt/css'
import { KIND_LABEL } from '@/prompt/items'
import { buildProjectSpec } from '@/prompt/spec'
import { renderMasterPrompt } from '@/prompt/text'
import { Button, Callout, PageHeader, Section, toast } from '@/ui'
import './prompts.css'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Ficha visual do projeto em HTML autônomo: identidade, tokens e decisões. */
export function buildProjectSheetHtml(project: ReturnType<typeof useStudio.getState>['project']): string {
  const spec = buildProjectSpec(project)
  const theme = projectTheme(project)
  const preview = renderToStaticMarkup(<IdentityPreview theme={theme} />)
  const tokens = TOKEN_GROUPS.map(
    (g) =>
      `<h3>${esc(g.title)}</h3><div class="tokens">${g.keys
        .map((k) => `<div class="tk"><span class="sw" style="background:${theme.tokens[k.key]}"></span><span><b>${esc(k.label)}</b><code>${k.key} · ${theme.tokens[k.key]}</code></span></div>`)
        .join('')}</div>`,
  ).join('')
  const items = spec.items
    .filter((i) => i.included)
    .map((i) => `<li><span class="kind">${esc(KIND_LABEL[i.kind])}</span><b>${esc(i.name)}</b>${i.variant ? ` — ${esc(i.variant)}` : ''}<p>${esc(i.summary)}</p></li>`)
    .join('')
  const body = `
<main class="wrap">
  <header><p class="eyebrow">Atelier UI · Ficha do projeto</p><h1>${esc(spec.project.name)}</h1><p class="muted">${esc(spec.project.type)}${spec.project.objective ? ` · ${esc(spec.project.objective)}` : ''}</p></header>
  <section><h2>Prévia da identidade</h2>${preview}</section>
  <section><h2>Decisões aprovadas</h2><ul class="items">${items}</ul></section>
  <section><h2>Tokens</h2>${tokens}</section>
  <section><h2>Master Prompt</h2><pre>${esc(renderMasterPrompt(spec))}</pre></section>
</main>`
  const css = `
:root{--s-border:#ebebef}
body{background:#fff;color:#15151a;line-height:1.5}
.wrap{max-width:1080px;margin:0 auto;padding:40px 20px 80px}
h1{font-size:34px;margin:4px 0}h2{font-size:20px;margin:40px 0 12px}h3{font-size:14px;margin:20px 0 8px;color:#55555f}
.eyebrow{color:#4c46dc;font-weight:600;margin:0}.muted{color:#55555f;margin:0}
.items{list-style:none;padding:0;margin:0;display:grid;gap:10px}.items li{border-top:1px solid #ebebef;padding-top:10px}
.items p{margin:2px 0 0;color:#55555f;font-size:14px}.kind{display:block;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#4c46dc}
.tokens{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px}
.tk{display:flex;gap:10px;align-items:center;font-size:13px}.tk span:last-child{display:grid}
.sw{width:34px;height:34px;border-radius:8px;border:1px solid #d9d9e0;flex:none}
code{font-family:ui-monospace,monospace;font-size:12px;color:#7c7c87}
pre{white-space:pre-wrap;word-break:break-word;border:1px solid #ebebef;border-radius:8px;padding:16px;font-size:12.5px}`
  return htmlDocument(`${spec.project.name} — Ficha do projeto`, body, css)
}

export default function ExportPage() {
  const project = useStudio((s) => s.project)
  const history = useStudio((s) => s.history)
  const importProject = useStudio((s) => s.importProject)
  const [errors, setErrors] = useState<string[] | null>(null)
  const [over, setOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const base = slugify(project.meta.name || 'projeto')

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setErrors(null)
    try {
      const raw = await readJsonFile(file)
      const result = importProject(raw)
      if (result.ok) toast.success('Projeto importado. O estado anterior foi salvo em “Projeto e versões”.')
      else setErrors(result.errors)
    } catch (e) {
      setErrors([(e as Error).message])
    }
  }

  const exports = [
    {
      icon: FileText,
      title: 'Master Prompt (.md)',
      description: 'Texto completo com todas as decisões aprovadas, pronto para colar na IA.',
      action: () => downloadFile(`${base}-master-prompt.md`, renderMasterPrompt(buildProjectSpec(project)), 'text/markdown'),
      testId: 'export-master',
    },
    {
      icon: Braces,
      title: 'Especificação JSON',
      description: 'A fonte da verdade: estrutura, tokens, componentes, regras e o estado do projeto (reimportável).',
      action: () => downloadJson(`${base}-especificacao.json`, buildProjectSpec(project)),
      testId: 'export-spec',
    },
    {
      icon: FileCode2,
      title: 'CSS de referência',
      description: 'Variáveis CSS dos tokens, tipografia, raios, sombras e espaçamentos, com regras base.',
      action: () => downloadFile(`${base}-tokens.css`, buildProjectCss(project), 'text/css'),
      testId: 'export-css',
    },
    {
      icon: Globe,
      title: 'Ficha do projeto (HTML)',
      description: 'Documento autônomo com prévia da identidade, tokens, decisões e o Master Prompt.',
      action: () => downloadFile(`${base}-ficha.html`, buildProjectSheetHtml(project), 'text/html'),
      testId: 'export-html',
    },
    {
      icon: Archive,
      title: 'Backup completo',
      description: `Projeto atual e ${history.length} versão(ões) salva(s), para reutilizar depois ou em outro computador.`,
      action: () => downloadJson(`${base}-backup.json`, { kind: 'atelier-ui/backup', exportedAt: new Date().toISOString(), project, history }),
      testId: 'export-backup',
    },
  ]

  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Entrega"
        title="Exportar e importar"
        description="Todos os arquivos são gerados a partir do estado atual do projeto e são válidos. Demonstrações em HTML de templates e de sites de inspiração ficam nos respectivos módulos."
      />
      <Section title="Exportar">
        <div className="ex-grid">
          {exports.map(({ icon: Icon, title, description, action, testId }) => (
            <article key={title} className="ex-card">
              <span className="ex-card__icon">
                <Icon aria-hidden="true" />
              </span>
              <div className="u-stack-sm">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <div>
                <Button onClick={action} data-testid={testId}>
                  Baixar
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Importar" description="Aceita backups, projetos e especificações JSON exportados pelo Studio. Antes de importar, o projeto atual é salvo como versão.">
        <div
          className="ex-drop"
          data-over={over}
          onDragOver={(e) => {
            e.preventDefault()
            setOver(true)
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            void handleFile(e.dataTransfer.files[0])
          }}
        >
          <Upload aria-hidden="true" />
          <strong>Arraste um arquivo .json para cá</strong>
          <span className="u-small">ou</span>
          <Button variant="primary" onClick={() => fileRef.current?.click()}>
            Escolher arquivo
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            data-testid="import-input"
            aria-label="Arquivo para importar"
            onChange={(e) => {
              void handleFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </div>
        {errors && (
          <Callout tone="danger" title="Não foi possível importar:">
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              {errors.map((er) => (
                <li key={er}>{er}</li>
              ))}
            </ul>
          </Callout>
        )}
      </Section>
    </div>
  )
}
