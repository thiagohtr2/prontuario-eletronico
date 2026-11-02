// REG-16: o celular grande (painel fixo) da etapa 4 do guiado fica sob o rodapé a 1440×900?
const { open, go, shot, sleep } = require('./lib.cjs')
;(async () => {
  for (const vp of [{ width: 1440, height: 900 }, { width: 1280, height: 720 }, { width: 1920, height: 1080 }]) {
    const { browser, page } = await open('desktop', { viewport: vp })
    await go(page, '/guiado/mobile')
    const out = []
    for (const y of [0, 400, 2000, 6000]) {
      await page.evaluate((y) => window.scrollTo(0, y), y)
      await sleep(250)
      out.push(await page.evaluate(() => {
        const ph = document.querySelector('[data-testid="phone-preview"]').getBoundingClientRect()
        const f = document.querySelector('.gd-footer').getBoundingClientRect()
        return { sy: Math.round(scrollY), phoneTop: Math.round(ph.top), phoneBottom: Math.round(ph.bottom), footerTop: Math.round(f.top), hiddenPx: Math.max(0, Math.round(ph.bottom - f.top)) }
      }))
    }
    console.log(`${vp.width}×${vp.height}`, JSON.stringify(out))
    if (vp.width === 1440) { await page.evaluate(() => window.scrollTo(0, 2000)); await sleep(200); await shot(page, 'reg16-guiado-celular-sob-rodape-1440') }
    await browser.close()
  }
})()
