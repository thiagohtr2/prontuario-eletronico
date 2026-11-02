const L = require('./lib')
;(async () => {
  const b = await L.launch()
  const res = {}
  {
    const { ctx, page } = await L.newPage(b, 375, 800)
    await L.go(page, '/guiado/desktop', 700)
    const btn = page.locator('[data-testid="guided-next"]')
    await btn.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(800)
    res.guidedNext = await page.evaluate(() => ({ hash: location.hash, active: document.activeElement.tagName + ' ' + (document.activeElement.innerText || '').trim().slice(0, 30), scrollY, h1: document.querySelector('h1').innerText, title: document.title }))
    // toast sobre a barra fixa
    await L.go(page, '/guiado/revisao', 600)
    await page.locator('[data-testid="guided-next"]').tap()
    await page.waitForTimeout(400)
    res.toast = await page.evaluate(() => { const t = document.querySelector('.ui-toast'); const f = document.querySelector('.gd-footer'); if (!t) return null; const tr = t.getBoundingClientRect(); const fr = f ? f.getBoundingClientRect() : null; return { toast: [Math.round(tr.top), Math.round(tr.bottom)], footer: fr ? [Math.round(fr.top), Math.round(fr.bottom)] : null, overlap: fr ? Math.max(0, Math.min(tr.bottom, fr.bottom) - Math.max(tr.top, fr.top)) : 0, text: t.innerText } })
    await L.shot(page, 'detalhes/toast-sobre-barra-guiado-375')
    await ctx.close()
  }
  console.log(JSON.stringify(res, null, 1))
  L.save('detalhes5.json', res)
  await b.close()
})()
