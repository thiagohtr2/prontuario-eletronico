// REG-02: salto de rolagem ao escolher arquitetura do computador no celular (etapa 3 do guiado).
const { open, go, saved, shot, sleep } = require('./lib.cjs')

;(async () => {
  for (const dev of ['android', 'iphone', 'desktop']) {
    const { browser, page } = await open(dev)
    await go(page, '/guiado/objetivo')
    await page.getByTestId('project-type-saas').click()
    await go(page, '/guiado/desktop')
    // 1) botão "Escolher este modelo" no painel de destaque
    const btn = page.getByRole('button', { name: 'Escolher este modelo' })
    await btn.scrollIntoViewIfNeeded()
    // posiciona o botão no meio da tela como um usuário faria
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Escolher este modelo'))
      const r = b.getBoundingClientRect()
      window.scrollBy(0, r.top - innerHeight / 2)
    })
    await sleep(300)
    const before = await page.evaluate(() => scrollY)
    const docH0 = await page.evaluate(() => document.documentElement.scrollHeight)
    if (dev === 'desktop') await btn.click()
    else await btn.tap()
    await sleep(600)
    const after = await page.evaluate(() => scrollY)
    const docH1 = await page.evaluate(() => document.documentElement.scrollHeight)
    const p = await saved(page)
    console.log(dev, 'botão Escolher este modelo: scrollY', before, '→', after, 'delta', after - before, 'docH', docH0, '→', docH1, 'desktopId', p.layout.desktopId)
    await shot(page, `reg02-${dev}-apos-escolher-este-modelo`)

    // 2) miniaturas em sequência
    const cards = page.locator('[data-testid^="desktop-option-"]')
    for (const i of [5, 20, 33]) {
      const card = cards.nth(i)
      await card.scrollIntoViewIfNeeded()
      await sleep(250)
      const b0 = await page.evaluate(() => scrollY)
      const hit = card.locator('.ui-option__hit')
      if (dev === 'desktop') await hit.click()
      else await hit.tap()
      await sleep(600)
      const b1 = await page.evaluate(() => scrollY)
      console.log(dev, 'miniatura', i, 'scrollY', b0, '→', b1, 'delta', b1 - b0)
    }
    await browser.close()
  }
})()
