const fs = require('fs'), path = require('path')
const D = path.resolve(__dirname, '../dados')
const recs = JSON.parse(fs.readFileSync(path.join(D, process.argv[2] || 'axe-rotas-cheio.json'), 'utf8'))
const rules = {}
for (const r of recs) {
  if (!r.violations) continue
  for (const v of r.violations) {
    const k = v.id
    rules[k] = rules[k] || { id: k, impact: v.impact, help: v.help, tags: v.tags, total: 0, rotas: new Set(), porLargura: {}, exemplos: [] }
    rules[k].total += v.count
    rules[k].rotas.add(r.id)
    rules[k].porLargura[r.w] = (rules[k].porLargura[r.w] || 0) + v.count
    for (const n of v.nodes.slice(0, 2)) if (rules[k].exemplos.length < 6 && !rules[k].exemplos.some((e) => e.html === n.html)) rules[k].exemplos.push({ rota: r.id, w: r.w, target: n.target, html: n.html.slice(0, 160), summary: n.summary.slice(0, 200) })
  }
}
const order = { critical: 0, serious: 1, moderate: 2, minor: 3 }
const list = Object.values(rules).sort((a, b) => order[a.impact] - order[b.impact] || b.total - a.total)
for (const r of list) {
  console.log(`\n### ${r.id} [${r.impact}] total=${r.total} rotas=${r.rotas.size} porLargura=${JSON.stringify(r.porLargura)} tags=${r.tags.join(',')}\n${r.help}`)
  for (const e of r.exemplos.slice(0, 4)) console.log(`  - ${e.rota}@${e.w}: ${e.target} :: ${e.html.replace(/\n/g, ' ')}\n      ${e.summary.replace(/\n/g, ' | ')}`)
}
fs.writeFileSync(path.join(D, 'axe-agregado.json'), JSON.stringify(list.map((r) => ({ ...r, rotas: [...r.rotas] })), null, 2))
// semântica
console.log('\n\n## semântica por rota (1280)')
for (const r of recs.filter((x) => x.w === 1280 && x.sem)) console.log(r.id, 'main', r.sem.main, 'nav', JSON.stringify(r.sem.nav), 'h1', JSON.stringify(r.sem.h1), 'h1Ocultos', r.sem.h1Hidden, 'heads', r.sem.headings, 'saltos', r.sem.headingSkips, 'live', JSON.stringify(r.sem.liveRegions), 'title', r.sem.title, 'lang', r.sem.lang)
