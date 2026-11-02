const L = require('./lib')
;(async () => {
  const b = await L.launch()
  const out = []
  for (const route of ['/modulos/cores', '/guiado/desktop', '/prompt']) {
    const { ctx, page } = await L.newPage(b, 1280, 900)
    await L.go(page, route, 600)
    const before = await page.evaluate(() => ({ hash: location.hash, h1: document.querySelector('h1')?.innerText }))
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(900)
    const after = await page.evaluate(() => ({ hash: location.hash, h1: document.querySelector('h1')?.innerText, active: document.activeElement.id || document.activeElement.tagName }))
    out.push({ route, before, after })
    if (route === '/modulos/cores') await L.shot(page, 'teclado/skip-link-depois-enter-cores')
    // clique com mouse também
    await L.go(page, route, 400)
    await page.evaluate(() => document.querySelector('.shell-skip').click())
    await page.waitForTimeout(700)
    out.push({ route, click: await page.evaluate(() => ({ hash: location.hash, h1: document.querySelector('h1')?.innerText })) })
    await ctx.close()
  }
  console.log(JSON.stringify(out, null, 1))
  L.save('skip-link.json', out)
  await b.close()
})()
