import fs from 'node:fs'
import path from 'node:path'
import { createProject } from '@/core/project'
import { itemForTarget } from '@/prompt/items'
import { headers, headerLookFor, sidebars, sidebarLookFor } from '@/modules/navigation/catalog'
describe('variante B', () => {
  it('spec descreve a composição escolhida?', () => {
    const p = createProject()
    const out: Record<string, unknown>[] = []
    let hdiff = 0, sdiff = 0
    for (const h of headers) {
      const a = headerLookFor(h, 0), b = headerLookFor(h, 1)
      if (a.height !== b.height) {
        hdiff++
        const item = itemForTarget({ kind: 'header', id: h.id, variant: 1 }, p)!
        out.push({ header: h.id, alturaA: a.height, alturaB: b.height, medidaNoPromptVarianteB: item.measurements['altura (desktop)'] })
      }
    }
    for (const s of sidebars) {
      const a = sidebarLookFor(s, 0), b = sidebarLookFor(s, 1)
      if (JSON.stringify(a) !== JSON.stringify(b)) sdiff++
    }
    fs.writeFileSync(path.resolve(process.cwd(), '../../dados/variante-b.json'), JSON.stringify({ headersComAlturaDiferenteNaVarianteB: hdiff, sidebarsComLookDiferenteNaVarianteB: sdiff, exemplos: out.slice(0, 8) }, null, 2))
    expect(true).toBe(true)
  })
})
