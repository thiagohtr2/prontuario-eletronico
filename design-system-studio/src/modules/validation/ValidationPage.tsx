import { useMemo, useRef, useState } from 'react'
import { Download, FileCode2, ShieldCheck, Terminal, Trash2, Upload } from 'lucide-react'
import { downloadFile, downloadJson, readJsonFile } from '@/core/download'
import { useStudio } from '@/core/store'
import { REFERENCE_WIDTHS } from '@/prompt/responsive'
import { buildFixPrompt, buildRunnerConfig, parseReport } from '@/prompt/validation'
import { Badge, Button, Callout, CopyButton, EmptyState, Field, Input, PageHeader, Section, Switch, Textarea, keepScroll, toast } from '@/ui'
import runnerSource from '../../../tools/validation-runner/runner.py?raw'
import './validation.css'

const CHECK_LABEL = {
  horizontalOverflow: { label: 'Overflow horizontal', help: 'Página mais larga que a tela e os elementos que causam isso.' },
  offscreen: { label: 'Elementos fora da tela', help: 'Elementos cortados na borda esquerda.' },
  tapTargets: { label: 'Alvos de toque pequenos', help: 'Botões e links difíceis de tocar (telas < 768 px).' },
  inputFontSize: { label: 'Fonte pequena em campos', help: 'Inputs com menos de 16 px (zoom automático no iOS).' },
} as const

function ConfigForm() {
  const config = useStudio((s) => s.project.validation.config)
  const setConfig = useStudio((s) => s.setValidationConfig)
  const project = useStudio((s) => s.project)
  const [customWidth, setCustomWidth] = useState('')
  const urlInvalid = config.url.trim() !== '' && !/^https?:\/\/[^\s]+$/i.test(config.url.trim())
  const toggleWidth = (w: number) =>
    keepScroll(() => setConfig({ widths: config.widths.includes(w) ? config.widths.filter((x) => x !== w) : [...config.widths, w].sort((a, b) => a - b) }))

  return (
    <div className="u-stack-lg">
      <div className="ui-form-grid">
        <Field label="URL do site" htmlFor="v-url" error={urlInvalid ? 'Use um endereço completo, começando com http:// ou https://' : undefined} help="Prefira um ambiente de testes (staging).">
          <Input id="v-url" type="url" inputMode="url" value={config.url} placeholder="https://staging.meusite.com" onChange={(e) => setConfig({ url: e.target.value })} data-testid="validation-url" />
        </Field>
        <Field label="Espera após carregar (ms)" htmlFor="v-wait" help="Tempo para animações e dados carregarem.">
          <Input id="v-wait" type="number" min={0} max={30000} step={100} value={config.waitMs} onChange={(e) => setConfig({ waitMs: Math.max(0, Number(e.target.value) || 0) })} />
        </Field>
        <Field label="Rotas autorizadas (uma por linha)" htmlFor="v-routes" full help="Somente estas páginas serão visitadas. Não inclua rotas que apagam ou alteram dados.">
          <Textarea id="v-routes" rows={4} value={config.routes.join('\n')} onChange={(e) => setConfig({ routes: e.target.value.split('\n').map((r) => r.trim()) })} spellCheck={false} />
        </Field>
      </div>
      <Section title="Larguras de tela">
        <div className="ui-chips" role="group" aria-label="Larguras de tela">
          {Array.from(new Set([...REFERENCE_WIDTHS, ...config.widths]))
            .sort((a, b) => a - b)
            .map((w) => (
              <button key={w} type="button" className="ui-chip" aria-pressed={config.widths.includes(w)} onClick={() => toggleWidth(w)}>
                {w} px
              </button>
            ))}
        </div>
        <form
          className="u-row"
          onSubmit={(e) => {
            e.preventDefault()
            const w = Number(customWidth)
            if (w >= 200 && w <= 4000 && !config.widths.includes(w)) setConfig({ widths: [...config.widths, w].sort((a, b) => a - b) })
            setCustomWidth('')
          }}
        >
          <Input aria-label="Largura personalizada" type="number" min={200} max={4000} placeholder="Outra largura" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} style={{ maxWidth: 180 }} />
          <Button type="submit" size="sm">
            Adicionar largura
          </Button>
          <span className="u-subtle u-small">{config.widths.length} selecionada(s)</span>
        </form>
      </Section>
      <Section title="Verificações">
        <div className="u-stack">
          {(Object.keys(CHECK_LABEL) as (keyof typeof CHECK_LABEL)[]).map((k) => (
            <Switch key={k} checked={config.checks[k]} onChange={(v) => setConfig({ checks: { ...config.checks, [k]: v } })} label={CHECK_LABEL[k].label} description={CHECK_LABEL[k].help} />
          ))}
          <Field label="Tamanho mínimo do alvo de toque (px)" htmlFor="v-tap">
            <Input id="v-tap" type="number" min={16} max={96} value={config.minTapTarget} onChange={(e) => setConfig({ minTapTarget: Math.min(96, Math.max(16, Number(e.target.value) || 44)) })} style={{ maxWidth: 160 }} />
          </Field>
        </div>
      </Section>
      <Section title="Sites com login">
        <Switch
          checked={config.manualLogin}
          onChange={(v) => setConfig({ manualLogin: v })}
          label="Login manual antes dos testes"
          description="O executor abre o navegador para você entrar com uma conta de teste. A senha nunca é pedida aqui nem salva em arquivos."
        />
      </Section>
      <div className="ui-actions">
        <Button
          variant="primary"
          icon={<Download />}
          disabled={!config.url.trim() || urlInvalid || config.widths.length === 0}
          onClick={() => downloadJson('validation-config.json', buildRunnerConfig(project))}
          data-testid="download-validation-config"
        >
          Baixar configuração
        </Button>
        <Button icon={<FileCode2 />} onClick={() => downloadFile('runner.py', runnerSource, 'text/x-python')}>
          Baixar executor (runner.py)
        </Button>
      </div>
    </div>
  )
}

function ReportView() {
  const report = useStudio((s) => s.project.validation.report)
  const project = useStudio((s) => s.project)
  const setReport = useStudio((s) => s.setValidationReport)
  const [errors, setErrors] = useState<string[] | null>(null)
  const [filter, setFilter] = useState<string>('todas')
  const fileRef = useRef<HTMLInputElement>(null)
  const fixPrompt = useMemo(() => (report ? buildFixPrompt(report, project) : ''), [report, project])

  const onFile = async (file?: File) => {
    if (!file) return
    setErrors(null)
    try {
      const parsed = parseReport(await readJsonFile(file))
      if (parsed.ok) {
        setReport(parsed.report)
        toast.success(`Relatório importado: ${parsed.report.issues.length} ocorrência(s).`)
      } else setErrors(parsed.errors)
    } catch (e) {
      setErrors([(e as Error).message])
    }
  }

  const types = report ? Array.from(new Set(report.issues.map((i) => i.type))) : []
  const issues = report ? report.issues.filter((i) => filter === 'todas' || i.type === filter) : []

  return (
    <div className="u-stack-lg">
      <div className="ui-actions">
        <Button variant={report ? 'secondary' : 'primary'} icon={<Upload />} onClick={() => fileRef.current?.click()}>
          Importar relatório (report.json)
        </Button>
        {report && (
          <Button variant="ghost" icon={<Trash2 />} onClick={() => setReport(null)}>
            Remover relatório
          </Button>
        )}
        <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" aria-label="Relatório para importar" data-testid="report-input" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = '' }} />
      </div>
      {errors && (
        <Callout tone="danger" title="Relatório inválido:">
          {errors.join(' · ')}
        </Callout>
      )}
      {!report ? (
        <EmptyState icon={<Terminal />} title="Nenhum relatório importado">
          Rode o executor local e importe o arquivo gerado.
        </EmptyState>
      ) : (
        <>
          <div className="val-summary">
            <div>
              <strong>{report.issues.length}</strong>
              <span>ocorrências</span>
            </div>
            <div>
              <strong>{report.pages.length}</strong>
              <span>página(s)</span>
            </div>
            <div>
              <strong>{report.widths.length}</strong>
              <span>larguras</span>
            </div>
            <div>
              <strong>{report.issues.filter((i) => i.severity === 'alta').length}</strong>
              <span>de severidade alta</span>
            </div>
          </div>
          <p className="u-subtle u-small">
            {report.baseUrl} · {new Date(report.generatedAt).toLocaleString('pt-BR')} · {report.tool}
          </p>
          {types.length > 0 && (
            <div className="ui-chips" role="group" aria-label="Filtrar por tipo">
              {['todas', ...types].map((t) => (
                <button key={t} type="button" className="ui-chip" aria-pressed={filter === t} onClick={() => keepScroll(() => setFilter(t))}>
                  {t === 'todas' ? 'Todas' : t} <span className="ui-chip__count">{t === 'todas' ? report.issues.length : report.issues.filter((i) => i.type === t).length}</span>
                </button>
              ))}
            </div>
          )}
          <ul className="val-issues">
            {issues.map((i, idx) => (
              <li key={idx} className="val-issue">
                <div className="u-row" style={{ gap: 8 }}>
                  <Badge tone={i.severity === 'alta' ? 'danger' : i.severity === 'media' ? 'warning' : undefined}>{i.severity}</Badge>
                  <strong>{i.type}</strong>
                  <span className="u-subtle u-small">
                    {i.page} · {i.width} px
                  </span>
                </div>
                <code className="val-issue__el">{i.element}</code>
                <p>{i.description}</p>
                <p className="u-muted u-small">
                  <strong>Sugestão:</strong> {i.suggestion}
                </p>
              </li>
            ))}
          </ul>
          <Section title="Prompt de correção" description="Para o Claude Code, Cursor ou outra IA. Preserva as decisões aprovadas no Studio.">
            <div className="ui-actions">
              <CopyButton text={fixPrompt} variant="primary" label="Copiar prompt de correção" />
              <Button icon={<Download />} onClick={() => downloadFile('prompt-correcao-responsividade.md', fixPrompt, 'text/markdown')}>
                Baixar .md
              </Button>
            </div>
            <pre className="ui-code" style={{ maxHeight: 420 }}>
              {fixPrompt}
            </pre>
          </Section>
        </>
      )}
    </div>
  )
}

export default function ValidationPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Ferramentas"
        title="Responsive Validation Lab"
        description="Teste um site já construído em várias larguras de tela, encontre problemas de responsividade e gere um prompt de correção. O teste roda no seu computador, com um executor local em Python + Playwright."
      />
      <div className="u-stack-lg">
        <Callout tone="warning" title="Em evolução.">
          O executor local é complementar à interface do Studio. A versão atual detecta overflow horizontal, elementos fora da tela, alvos de toque pequenos e fontes pequenas em campos.
        </Callout>
        <Section title="1. Configuração">
          <ConfigForm />
        </Section>
        <Section title="2. Rodar no seu computador">
          <ol className="val-steps">
            <li>
              Instale uma vez: <code>pip install playwright</code> e <code>python -m playwright install chromium</code>
            </li>
            <li>
              Na pasta dos arquivos baixados: <code>python runner.py --config validation-config.json --out report.json</code>
            </li>
            <li>Com login manual, entre na janela que abrir e pressione Enter no terminal.</li>
          </ol>
          <div className="val-safety">
            <ShieldCheck aria-hidden="true" />
            <ul>
              <li>Prefira contas de teste, staging e dados fictícios.</li>
              <li>Restrinja as rotas; o executor não clica nem envia formulários.</li>
              <li>Senhas nunca vão para arquivos de configuração nem para o Master Prompt.</li>
              <li>O relatório não contém cookies, tokens, textos da página ou capturas de tela.</li>
            </ul>
          </div>
        </Section>
        <Section title="3. Relatório e correção">
          <ReportView />
        </Section>
      </div>
    </div>
  )
}
