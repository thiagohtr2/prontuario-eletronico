/** Tamanho máximo da logomarca guardada (data URL), abaixo do limite do banco. */
const MAX_DATA_URL = 650_000
const ACCEPTED = /^image\/(png|jpeg|svg\+xml|webp)$/

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Não foi possível ler essa imagem. Tente outro arquivo.'))
    image.src = src
  })
}

/**
 * Área útil da imagem: corta margens transparentes ou quase brancas, para a
 * logomarca ocupar todo o espaço reservado no cabeçalho da receita.
 */
function contentBounds(context: CanvasRenderingContext2D, width: number, height: number) {
  const { data } = context.getImageData(0, 0, width, height)
  let top = height
  let left = width
  let right = -1
  let bottom = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const empty = data[i + 3] < 12 || (data[i] > 246 && data[i + 1] > 246 && data[i + 2] > 246)
      if (empty) continue
      if (x < left) left = x
      if (x > right) right = x
      if (y < top) top = y
      if (y > bottom) bottom = y
    }
  }
  if (right < 0) return { x: 0, y: 0, width, height }
  const pad = Math.round(Math.max(right - left, bottom - top) * 0.02)
  const x = Math.max(0, left - pad)
  const y = Math.max(0, top - pad)
  return { x, y, width: Math.min(width, right + pad + 1) - x, height: Math.min(height, bottom + pad + 1) - y }
}

/**
 * Prepara a logomarca enviada: aceita PNG, JPG, SVG ou WebP, apara as margens,
 * reduz para no máximo 640 px e devolve um PNG em data URL (o formato que o
 * gerador de PDF lê e que a coluna do banco aceita).
 */
export async function prepararLogo(file: File): Promise<string> {
  if (!ACCEPTED.test(file.type)) throw new Error('Envie uma imagem PNG, JPG, SVG ou WebP.')
  if (file.size > 8 * 1024 * 1024) throw new Error('A imagem passa de 8 MB. Envie uma versão menor.')

  const url = URL.createObjectURL(file)
  try {
    const image = await loadImage(url)
    // SVG sem tamanho declarado chega com 0 × 0.
    const width = image.naturalWidth || 640
    const height = image.naturalHeight || 640

    const source = document.createElement('canvas')
    source.width = width
    source.height = height
    const sourceContext = source.getContext('2d', { willReadFrequently: true })
    if (!sourceContext) throw new Error('Seu navegador não conseguiu processar a imagem.')
    sourceContext.drawImage(image, 0, 0, width, height)
    const bounds = contentBounds(sourceContext, width, height)

    for (const max of [640, 480, 360, 260]) {
      const scale = Math.min(1, max / Math.max(bounds.width, bounds.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(bounds.width * scale))
      canvas.height = Math.max(1, Math.round(bounds.height * scale))
      const context = canvas.getContext('2d')
      if (!context) break
      context.imageSmoothingQuality = 'high'
      context.drawImage(source, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/png')
      if (dataUrl.length <= MAX_DATA_URL) return dataUrl
    }
    throw new Error('A imagem ficou pesada demais mesmo reduzida. Prefira um PNG simples, com fundo transparente.')
  } finally {
    URL.revokeObjectURL(url)
  }
}
