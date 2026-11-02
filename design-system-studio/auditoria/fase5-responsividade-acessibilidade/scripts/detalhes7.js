const L = require('./lib')
;(async () => {
  const b = await L.launch()
  const out = {}
  for (const [w, route] of [[320, '/livre'], [344, '/livre'], [320, '/modulos/cores'], [360, '/livre']]) {
    const { ctx, page } = await L.newPage(b, w, 800)
    await L.go(page, route, 700)
    out[`${w}${route}`] = await page.evaluate(() => ({ innerWidth, innerHeight, clientW: document.documentElement.clientWidth, scrollW: document.documentElement.scrollWidth, vvW: visualViewport.width, vvScale: visualViewport.scale }))
    if (w === 320 && route === '/livre') {
      await page.locator('button.shell-search-btn').tap()
      await page.waitForTimeout(500)
      await L.shot(page, 'detalhes/livre-320-busca-cortada')
    }
    await ctx.close()
  }
  console.log(JSON.stringify(out, null, 1))
  L.save('viewport-320.json', out)
  await b.close()
})()
