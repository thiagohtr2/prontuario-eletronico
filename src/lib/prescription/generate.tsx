/**
 * Geração do PDF da receita. Este módulo é carregado sob demanda (import
 * dinâmico), para a biblioteca de PDF e as fontes não pesarem no app.
 */
import { Font, pdf } from '@react-pdf/renderer'
import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff?url'
import inter500 from '@fontsource/inter/files/inter-latin-500-normal.woff?url'
import inter600 from '@fontsource/inter/files/inter-latin-600-normal.woff?url'
import inter700 from '@fontsource/inter/files/inter-latin-700-normal.woff?url'
import cormorant500 from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff?url'
import cormorant500Italic from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff?url'
import cormorant600 from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff?url'
import cormorant600Italic from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff?url'
import { PrescriptionDocument } from './PrescriptionDocument'
import type { PrescriptionInput } from './model'

Font.register({
  family: 'Inter',
  fonts: [
    { src: inter400, fontWeight: 400 },
    { src: inter500, fontWeight: 500 },
    { src: inter600, fontWeight: 600 },
    { src: inter700, fontWeight: 700 },
  ],
})

Font.register({
  family: 'Cormorant',
  fonts: [
    { src: cormorant500, fontWeight: 500 },
    { src: cormorant500Italic, fontWeight: 500, fontStyle: 'italic' },
    { src: cormorant600, fontWeight: 600 },
    { src: cormorant600Italic, fontWeight: 600, fontStyle: 'italic' },
  ],
})

// A hifenização padrão é para inglês; em português ela quebra palavras errado.
Font.registerHyphenationCallback((word) => [word])

export async function generatePrescriptionPdf(input: PrescriptionInput): Promise<Blob> {
  return pdf(<PrescriptionDocument input={input} />).toBlob()
}
