const L = require('./lib')
;(async () => {
  const b = await L.launch()
  // 1. livre 320: texto do status do cartão vazando
  {
    const { ctx, page } = await L.newPage(b, 320, 800)
    await L.go(page, '/livre', 600)
    const el = page.locator('.free-card__status').first()
    await el.scrollIntoViewIfNeeded()
    const info = await el.evaluate((e) => { const r = e.getBoundingClientRect(); const p = e.closest('[class*="free-card"]'); const pr = p.getBoundingClientRect(); return { r: [r.left, r.right, r.top], card: [pr.left, pr.right], text: e.innerText, ws: getComputedStyle(e).whiteSpace, canScrollX: document.scrollingElement.scrollWidth > document.scrollingElement.clientWidth } })
    await page.evaluate(() => window.scrollTo(500, window.scrollY))
    info.scrollXAfter = await page.evaluate(() => window.scrollX)
    console.log('livre320', JSON.stringify(info))
    await page.evaluate(() => window.scrollTo(0, window.scrollY))
    const box = await el.boundingBox()
    await page.screenshot({ path: L.CAP + '/detalhes/livre-320-status-vazando.png', clip: { x: 0, y: Math.max(0, box.y - 200), width: 320, height: 320 } })
    await ctx.close()
  }
  // 2. stepper do guiado a 1024
  for (const w of [1024, 1100, 1280]) {
    const { ctx, page } = await L.newPage(b, w, 900)
    await L.go(page, '/guiado/objetivo', 600)
    const box = await page.locator('.gd-stepper').boundingBox()
    await page.screenshot({ path: L.CAP + `/detalhes/stepper-guiado-${w}.png`, clip: { x: box.x - 8, y: box.y - 8, width: box.width + 16, height: box.height + 16 } })
    await ctx.close()
  }
  // 3. m-mobile 768 rolado (painel sticky sobre a galeria)
  for (const w of [700, 768, 820]) {
    const { ctx, page } = await L.newPage(b, w, 1024)
    await L.go(page, '/modulos/mobile', 800)
    await page.evaluate(() => window.scrollTo(0, 1300))
    await page.waitForTimeout(400)
    const st = await page.evaluate(() => { const s = document.querySelector('.lay-mob-stage'); if (!s) return null; const r = s.getBoundingClientRect(); const cs = getComputedStyle(s); return { pos: cs.position, top: r.top, h: r.height, w: r.width, left: r.left, vh: innerHeight, z: cs.zIndex, bg: cs.backgroundColor } })
    console.log('mob', w, JSON.stringify(st))
    await L.shot(page, `detalhes/mobile-galeria-${w}-rolada`)
    await ctx.close()
  }
  // 4. h3 vazios no desktop 375
  {
    const { ctx, page } = await L.newPage(b, 375, 800)
    await L.go(page, '/modulos/desktop', 800)
    const hs = await page.evaluate(() => Array.from(document.querySelectorAll('h1,h2,h3,h4')).filter((h) => !h.innerText.trim()).map((h) => ({ tag: h.tagName, cls: h.className, html: h.outerHTML.slice(0, 200), aria: h.closest('[aria-hidden=true]') ? 'hidden' : 'visível' })))
    console.log('vazios', JSON.stringify(hs.slice(0, 6)), hs.length)
    await ctx.close()
  }
  await b.close()
})()
