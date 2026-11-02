// Agrega os resultados da varredura em tabelas (rotas × larguras)
const fs = require('fs'), path = require('path')
const D = path.resolve(__dirname, '../dados')
const files = process.argv.slice(2).length ? process.argv.slice(2) : ['sweep-A.json', 'sweep-B.json', 'sweep-C.json']
const recs = files.flatMap((f) => JSON.parse(fs.readFileSync(path.join(D, f), 'utf8')))
const sizes = [...new Set(recs.map((r) => r.size))]
const ids = [...new Set(recs.map((r) => r.id))]
const metric = (name, fn) => {
  console.log('\n## ' + name)
  console.log(['rota', ...sizes].join('\t'))
  for (const id of ids) console.log([id, ...sizes.map((s) => { const r = recs.find((x) => x.id === id && x.size === s); return r && r.m ? fn(r) : '-' })].join('\t'))
}
metric('overflow documento (px)', (r) => r.m.docOverflowX)
metric('elementos fora da viewport (não-prévia)', (r) => r.m.overflow.filter((o) => !o.preview).length)
metric('elementos fora da viewport (prévia)', (r) => r.m.overflow.filter((o) => o.preview).length)
metric('textos cortados Studio', (r) => r.m.truncatedCount)
metric('texto <12px Studio', (r) => r.m.smallTextCount)
metric('alvos <44 (Studio)', (r) => r.m.targetsLt44)
metric('alvos <24 (Studio)', (r) => r.m.targetsLt24)
metric('pares de alvos <8px', (r) => r.m.closeTargetsCount)
metric('campos fonte<16', (r) => r.m.fieldsSmallFont.filter((f) => f.h > 2).length)
metric('cobertos (scan)', (r) => (r.covered ? r.covered.length : '-'))
metric('foco fora da tela', (r) => r.m.offscreenFocusable)
metric('altura doc', (r) => r.m.docHeight)
metric('h1', (r) => r.m.h1)
metric('largura mínima cartão .ui-option', (r) => (r.m.cardWidths ? r.m.cardWidths.min : '-'))
