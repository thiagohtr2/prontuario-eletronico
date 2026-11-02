const L = require('./lib')
;(async () => {
  const b = await L.launch()
  for (const w of [320, 344]) {
    const { ctx, page } = await L.newPage(b, w, 800)
    await L.go(page, '/livre', 600)
    const el = page.locator('.free-card__status', { hasText: 'Painel Analítico' }).first()
    await el.scrollIntoViewIfNeeded()
    const info = await el.evaluate((e) => { const r = e.getBoundingClientRect(); const card = e.closest('a,button,[class*="free-card"]'); const cr = card.getBoundingClientRect(); const cs = getComputedStyle(e); return { r: [Math.round(r.left), Math.round(r.right)], card: [Math.round(cr.left), Math.round(cr.right)], cardTag: card.tagName + '.' + card.className, ws: cs.whiteSpace, ov: cs.overflow, vw: document.documentElement.clientWidth } })
    console.log(w, JSON.stringify(info))
    const box = await el.boundingBox()
    await page.screenshot({ path: L.CAP + `/detalhes/livre-${w}-status-vazando.png`, clip: { x: 0, y: Math.max(0, box.y - 140), width: w, height: 240 } })
    await ctx.close()
  }
  await b.close()
})()
