// REG-02 (variação): reproduz o roteiro do A5 com gesto de toque real (CDP) antes de tocar no botão.
const { open, go, saved, shot, sleep } = require('./lib.cjs')

async function swipe(page, x, y1, y2, steps = 12) {
  const cdp = page.__cdp || (page.__cdp = await page.context().newCDPSession(page))
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y1 }] })
  for (let i = 1; i <= steps; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y1 + ((y2 - y1) * i) / steps }] })
    await sleep(16)
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await sleep(700)
}

;(async () => {
  const runs = process.argv[2] ? Number(process.argv[2]) : 3
  for (let r = 0; r < runs; r++) {
    const { browser, page } = await open('android', { deviceScaleFactor: 3 })
    await go(page, '/guiado/objetivo')
    await page.getByTestId('project-type-saas').tap()
    await page.getByTestId('project-name').fill('Barbearia da Joana')
    await go(page, '/guiado/desktop')
    await sleep(600)
    const sy = () => page.evaluate(() => Math.round(scrollY))
    await swipe(page, 180, 650, 150)
    await swipe(page, 180, 650, 250)
    const s0 = await sy()
    const btn = page.getByRole('button', { name: /Escolher este modelo/ }).first()
    await btn.scrollIntoViewIfNeeded()
    const before = await sy()
    const box = await btn.boundingBox()
    const docH0 = await page.evaluate(() => document.documentElement.scrollHeight)
    const footer0 = await page.locator('.gd-footer').boundingBox()
    await btn.tap()
    const trace = []
    for (let i = 0; i < 15; i++) {
      trace.push(await sy())
      await sleep(100)
    }
    const after = await sy()
    const docH1 = await page.evaluate(() => document.documentElement.scrollHeight)
    const footer1 = await page.locator('.gd-footer').boundingBox()
    console.log(`run ${r}: após swipes ${s0}; antes ${before} (botão y=${Math.round(box.y)}), depois ${after}, delta ${after - before}; docH ${docH0}→${docH1}; footer h ${Math.round(footer0.height)}→${Math.round(footer1.height)}; trace ${trace.join(',')}`)
    console.log('desktopId', (await saved(page)).layout.desktopId)
    if (r === 0) await shot(page, 'reg02-android-toque-apos-escolher')
    await browser.close()
  }
})()
