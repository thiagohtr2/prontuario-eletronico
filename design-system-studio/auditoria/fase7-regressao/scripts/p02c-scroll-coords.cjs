// REG-02 (variação): toque por coordenada (sem auto-rolagem do Playwright), com o botão em várias alturas da tela.
const { open, go, saved, sleep } = require('./lib.cjs')

;(async () => {
  for (const targetY of [70, 120, 300, 500, 620]) {
    const { browser, page } = await open('android', { deviceScaleFactor: 3 })
    await go(page, '/guiado/objetivo')
    await page.getByTestId('project-type-saas').tap()
    await go(page, '/guiado/desktop')
    await sleep(400)
    const pos = await page.evaluate((targetY) => {
      const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Escolher este modelo'))
      const r = b.getBoundingClientRect()
      window.scrollTo(0, scrollY + r.top - targetY)
      const r2 = b.getBoundingClientRect()
      const cx = r2.left + r2.width / 2
      const cy = r2.top + r2.height / 2
      const hit = document.elementFromPoint(cx, cy)
      return { x: cx, y: cy, h: r2.height, sy: scrollY, hitIsButton: b.contains(hit), hit: hit?.className?.toString().slice(0, 40) }
    }, targetY)
    await sleep(300)
    const before = await page.evaluate(() => scrollY)
    await page.touchscreen.tap(pos.x, pos.y)
    await sleep(800)
    const after = await page.evaluate(() => scrollY)
    const id = (await saved(page)).layout.desktopId
    console.log(`botão em y=${Math.round(pos.y)} (alvo=${pos.hitIsButton ? 'botão' : 'OUTRO: ' + pos.hit}): scrollY ${before} → ${after} (delta ${after - before}), desktopId=${id}`)
    await browser.close()
  }
})()
