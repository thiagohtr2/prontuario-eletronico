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

export function downloadFile(filename: string, content: string, mime = 'text/plain'): void {
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
