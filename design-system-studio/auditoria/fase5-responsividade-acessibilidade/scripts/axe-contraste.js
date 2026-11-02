// Coleta todos os nós com contraste insuficiente (axe color-contrast) com cores e se estão em prévia.
const L = require('./lib')
const fs = require('fs')
const AXE = fs.readFileSync(L.OUT + '/ferramentas/node_modules/axe-core/axe.min.js', 'utf8')
;(async () => {
  const b = await L.launch()
  const out = []
  for (const w of [1280, 375]) {
    const { ctx, page } = await L.newPage(b, w, w < 768 ? 800 : 900)
    for (const [id, route] of L.ROUTES) {
      await L.go(page, route, 700)
      await page.evaluate(AXE)
      const nodes = await page.evaluate(async () => {
        const r = await axe.run(document, { runOnly: ['color-contrast'] })
        const v = r.violations[0]
        if (!v) return []
        return v.nodes.map((n) => {
          const d = (n.any[0] && n.any[0].data) || {}
          const el = document.querySelector(n.target[0])
          let prev = false
          if (el) {
            const PREV = /(^|\s)(lay-ph|lay-ds|lay-fit|lay-mob-media|ent-phone|ent-fit|ent-stage|ent-thumb|tpl-thumb|tpl-frame|ins-phone|ins-browser|ins-thumb|lp-stage|lp-phone|lp-scroll|lp-frame|cmp-pv|cmp-fam-media|nvs-stage|nvs-app|nvs-phone|nvs-combo|nvs-hbar|nvs-sbar|rv-card__media|clr-)/
            let x = el
            while (x && x !== document.body) { if (PREV.test(' ' + (x.getAttribute('class') || ''))) { prev = true; break } if (x.tagName === 'HEADER' && x.getAttribute('aria-label') && x.getAttribute('aria-label').startsWith('Header')) { prev = true; break } x = x.parentElement }
          }
          return { fg: d.fgColor, bg: d.bgColor, ratio: d.contrastRatio, size: d.fontSize, weight: d.fontWeight, prev, cls: el ? (el.getAttribute('class') || el.tagName).slice(0, 60) : '', text: el ? (el.innerText || '').trim().slice(0, 40) : '' }
        })
      })
      out.push({ id, w, nodes })
      console.log(w, id, nodes.length)
    }
    await ctx.close()
  }
  L.save('axe-contraste.json', out)
  // agrega pares de cor no Studio
  const pairs = {}
  for (const r of out) for (const n of r.nodes) { const k = `${n.prev ? 'PRÉVIA' : 'STUDIO'} ${n.fg} sobre ${n.bg} (${n.ratio})`; pairs[k] = pairs[k] || { n: 0, ex: new Set() }; pairs[k].n++; if (pairs[k].ex.size < 4) pairs[k].ex.add(`${r.id}: ${n.cls} "${n.text}"`) }
  const rows = Object.entries(pairs).sort((a, b) => b[1].n - a[1].n).map(([k, v]) => `${v.n}\t${k}\t${[...v.ex].join(' | ')}`)
  fs.writeFileSync(L.DADOS + '/axe-contraste-pares.tsv', rows.join('\n'))
  console.log(rows.slice(0, 40).join('\n'))
  await b.close()
})()
