const L = require('./lib')
;(async () => {
  const b = await L.launch()
  const res = {}
  for (const w of [320, 375, 768]) {
    const { ctx, page } = await L.newPage(b, w, w < 600 ? 800 : 1024)
    await L.go(page, '/modulos/preview', 700)
    await page.locator('button:has-text("Celular")').first().click()
    await page.waitForTimeout(600)
    res['preview-celular-' + w] = await page.evaluate(() => {
      const f = document.querySelector('.lp-phone, [aria-label="Prévia do celular"]') || document.querySelector('[role=img][aria-label*="celular"]')
      if (!f) return null
      const r = f.getBoundingClientRect()
      const inner = f.querySelector('[style*="scale"]')
      const m = inner ? (inner.style.transform.match(/scale\(([^)]+)\)/) || [])[1] : null
      return { w: Math.round(r.width), h: Math.round(r.height), scale: m, vw: document.documentElement.clientWidth }
    })
    await page.locator('.lp-stage, [aria-label="Prévia do celular"]').first().scrollIntoViewIfNeeded().catch(() => {})
    await L.shot(page, `detalhes/preview-celular-${w}`)
    // abas da Central de Prompts
    await L.go(page, '/prompt', 600)
    res['abas-prompt-' + w] = await page.evaluate(() => {
      const t = document.querySelector('.ui-tabs'); const tabs = Array.from(t.querySelectorAll('[role=tab]'))
      const tr = t.getBoundingClientRect()
      return { scrollW: t.scrollWidth, clientW: t.clientWidth, escondidas: tabs.filter((x) => x.getBoundingClientRect().right > tr.right + 1).map((x) => x.innerText), scrollbar: getComputedStyle(t).scrollbarWidth }
    })
    await ctx.close()
  }
  console.log(JSON.stringify(res, null, 1))
  L.save('detalhes4.json', res)
  await b.close()
})()
