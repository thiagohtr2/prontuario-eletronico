// Resume o relatório JSON do Playwright: título, status, esperado e 1ª linha do erro.
const fs = require('fs')
const file = process.argv[2] || require('path').resolve(__dirname, '../resultados/resultado.json')
const r = JSON.parse(fs.readFileSync(file, 'utf8'))
const rows = []
const walk = (s, path) => {
  for (const sp of s.specs || []) for (const t of sp.tests) for (const res of t.results) {
    const err = (res.errors?.[0]?.message || res.error?.message || '').replace(/\x1b\[[0-9;]*m/g, '').split('\n').filter(Boolean).slice(0, 4).join(' | ')
    rows.push({ title: [...path, sp.title].join(' › '), status: res.status, expected: t.expectedStatus, outcome: t.status, ms: res.duration, err })
  }
  for (const c of s.suites || []) walk(c, [...path, c.title])
}
for (const s of r.suites) walk(s, [])
for (const x of rows) console.log(`${x.outcome.padEnd(10)} ${x.status.padEnd(8)} exp=${x.expected.padEnd(7)} ${(x.ms / 1000).toFixed(1)}s  ${x.title.replace('regression.spec.ts › ', '')}${x.err ? '\n      ' + x.err.slice(0, 400) : ''}`)
console.log('\nstats', JSON.stringify(r.stats))
