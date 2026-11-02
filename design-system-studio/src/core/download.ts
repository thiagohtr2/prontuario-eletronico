/** Utilitários de exportação de arquivos. Todos os downloads geram arquivos válidos e completos. */

export function slugify(text: string, fallback = 'projeto'): string {
  const slug = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || fallback
}

/* -------------------------------------------------------------------------- */
/* Página publicada no claude.ai: downloads passam pela capacidade "downloads" */
/* -------------------------------------------------------------------------- */

interface HostedDownloads {
  save: (request: { filename: string; data: string | Blob }) => Promise<{ status: 'saved' | 'delivered' }>
}

let hostedPromise: Promise<HostedDownloads | null> | null = null

/** Namespace de downloads do visualizador do claude.ai, ou null fora dele. */
function hostedDownloads(): Promise<HostedDownloads | null> | null {
  const claude = (window as unknown as { claude?: { use?: (name: string) => Promise<unknown> } }).claude
  if (!claude || typeof claude.use !== 'function') return null
  hostedPromise ??= claude
    .use('downloads')
    .then((ns) => (ns as HostedDownloads | null) ?? null)
    .catch(() => null)
  return hostedPromise
}

const HOSTED_ERROR: Record<string, string> = {
  rejected_extension: 'Este tipo de arquivo não pode ser baixado na página publicada. Use “Copiar” ou rode o Studio no seu computador.',
  extension_not_enabled: 'Este tipo de arquivo não está disponível aqui. Use “Copiar” ou rode o Studio no seu computador.',
  rate_limited: 'Já existe um download aguardando confirmação. Tente de novo em instantes.',
}

function notifyDownloadError(message: string) {
  window.dispatchEvent(new CustomEvent('atelier:download-error', { detail: message }))
}

function anchorDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Baixa um arquivo de texto. No navegador comum usa um link de download; na página
 * publicada no claude.ai, pede a confirmação do visualizador pela capacidade "downloads".
 */
export function downloadFile(filename: string, content: string, mime = 'text/plain'): void {
  const hosted = typeof window !== 'undefined' ? hostedDownloads() : null
  if (!hosted) return anchorDownload(filename, content, mime)
  void hosted.then((ns) => {
    if (!ns) return anchorDownload(filename, content, mime)
    ns.save({ filename, data: content }).catch((err: { code?: string }) => {
      const code = err?.code ?? 'unavailable'
      if (code === 'declined') return
      notifyDownloadError(HOSTED_ERROR[code] ?? 'Não foi possível baixar o arquivo aqui. Use “Copiar” ou rode o Studio no seu computador.')
    })
  })
}

export const downloadJson = (filename: string, data: unknown) =>
  downloadFile(filename, JSON.stringify(data, null, 2), 'application/json')

/** Envolve um trecho de HTML em um documento completo e autônomo. */
export function htmlDocument(title: string, body: string, css = ''): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${title.replace(/</g, '&lt;')}</title>
<style>
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0}
body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;overflow-x:hidden}
img,svg{max-width:100%}
${css}
</style>
</head>
<body>
${body}
</body>
</html>
`
}

/** Lê um arquivo escolhido pelo usuário como JSON. */
export function readJsonFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'))
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)))
      } catch {
        reject(new Error('O arquivo não contém um JSON válido.'))
      }
    }
    reader.readAsText(file)
  })
}
