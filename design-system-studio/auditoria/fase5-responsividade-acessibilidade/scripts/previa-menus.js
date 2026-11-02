// Menus e gavetas dentro das prévias (celular grande do módulo mobile e headers da navegação)
const L = require('./lib')
;(async () => {
  const b = await L.launch()
  const res = {}
  {
    const { ctx, page } = await L.newPage(b, 375, 800)
    await L.go(page, '/modulos/navegacao', 900)
    const btn = page.locator('.nvs-menu-btn:visible').first()
    await btn.scrollIntoViewIfNeeded()
    const bi = await btn.evaluate((e) => ({ label: e.getAttribute('aria-label'), exp: e.getAttribute('aria-expanded'), controls: e.getAttribute('aria-controls'), w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height }))
    await btn.tap()
    await page.waitForTimeout(500)
    const st = await page.evaluate(() => {
      const a = document.activeElement
      const dialogs = Array.from(document.querySelectorAll('[role=dialog]')).filter((d) => { const r = d.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(d).visibility !== 'hidden' })
      return { active: a.tagName + '.' + a.className + ' ' + (a.getAttribute('aria-label') || a.innerText || '').slice(0, 30), dialogs: dialogs.map((d) => ({ label: d.getAttribute('aria-label'), cls: d.className, hidden: d.getAttribute('aria-hidden'), contains: d.contains(a) })) }
    })
    const seq = []
    for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); seq.push(await page.evaluate(() => { const a = document.activeElement; return a.tagName + ' ' + (a.getAttribute('aria-label') || a.innerText || '').trim().slice(0, 25) + (a.closest('[role=dialog]') ? ' [no diálogo]' : '') })) }
    await L.shot(page, 'estados/menu-header-previa-foco-375')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    const after = await page.evaluate(() => ({ active: document.activeElement.tagName + ' ' + (document.activeElement.getAttribute('aria-label') || '').slice(0, 30), open: Array.from(document.querySelectorAll('[role=dialog]')).filter((d) => d.getBoundingClientRect().height > 0 && getComputedStyle(d).visibility !== 'hidden' && d.getAttribute('aria-label') === 'Menu de navegação').length }))
    res.headerSheet = { botao: bi, aberto: st, tabs: seq, depoisEsc: after }
    console.log(JSON.stringify(res.headerSheet, null, 1))
    await ctx.close()
  }
  {
    // celular grande do módulo mobile: drawer
    const { ctx, page } = await L.newPage(b, 375, 800)
    await L.go(page, '/modulos/mobile', 900)
    const ph = page.locator('[role=group][aria-label^="Prévia do celular"]').first()
    await ph.scrollIntoViewIfNeeded()
    const btn = ph.locator('button[aria-expanded]').first()
    const bi = await btn.evaluate((e) => ({ label: e.getAttribute('aria-label'), w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height) }))
    await btn.tap()
    await page.waitForTimeout(500)
    const st = await page.evaluate(() => ({ open: document.querySelector('[role=group][aria-label^="Prévia do celular"]').dataset.open, active: document.activeElement.tagName + ' ' + (document.activeElement.getAttribute('aria-label') || document.activeElement.innerText || '').trim().slice(0, 30) }))
    await L.shot(page, 'estados/drawer-celular-previa-aberto-375')
    // fechar tocando fora (no véu)
    const box = await ph.boundingBox()
    await page.mouse.click(box.x + box.width - 20, box.y + box.height / 2)
    await page.waitForTimeout(400)
    const afterScrim = await page.evaluate(() => document.querySelector('[role=group][aria-label^="Prévia do celular"]').dataset.open)
    // reabrir e fechar com Esc
    await btn.tap(); await page.waitForTimeout(300)
    await page.keyboard.press('Escape'); await page.waitForTimeout(300)
    const afterEsc = await page.evaluate(() => ({ open: document.querySelector('[role=group][aria-label^="Prévia do celular"]').dataset.open, active: document.activeElement.tagName + ' ' + (document.activeElement.getAttribute('aria-label') || '').slice(0, 30) }))
    // alvos dentro do celular grande
    const targets = await ph.evaluate((p) => Array.from(p.querySelectorAll('button,a[href],input')).filter((e) => e.getBoundingClientRect().width > 0).map((e) => { const r = e.getBoundingClientRect(); return { l: (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 20), w: Math.round(r.width), h: Math.round(r.height) } }))
    res.phoneDrawer = { botao: bi, aberto: st, fechaTocandoFora: afterScrim !== 'true', depoisEsc: afterEsc, alvos: targets.length, alvosMenores44: targets.filter((t) => t.w < 44 || t.h < 44).length, alvosMenores24: targets.filter((t) => t.w < 24 || t.h < 24).length, exemplos: targets.filter((t) => t.w < 44 || t.h < 44).slice(0, 8) }
    console.log(JSON.stringify(res.phoneDrawer, null, 1))
    await ctx.close()
  }
  L.save('previa-menus.json', res)
  await b.close()
})()
