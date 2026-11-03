// Modo de alto contraste (forced-colors) emulado: o indicador de foco sobrevive?
const L = require('./lib')
;(async () => {
  const b = await L.launch()
  const { ctx, page } = await L.newPage(b, 1280, 900)
  await page.emulateMedia({ forcedColors: 'active' })
  await L.go(page, '/modulos/cores', 700)
  const out = []
  for (const [sel, name] of [['.ui-chips button.ui-chip >> nth=1', 'chip'], ['.ui-option__hit >> nth=1', 'cartao'], ['button.ui-tab >> nth=1', 'aba'], ['button.ui-btn--primary >> nth=0', 'botao-primario'], ['#studio-sidebar a.shell-link >> nth=2', 'link-menu']]) {
    const loc = page.locator(sel).first()
    await loc.scrollIntoViewIfNeeded()
    await loc.focus()
    await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab')
    const st = await page.evaluate(() => { const a = document.activeElement; const c = getComputedStyle(a); return { el: a.className.split(' ')[0], outline: c.outlineStyle + ' ' + c.outlineWidth, shadow: c.boxShadow, forced: matchMedia('(forced-colors: active)').matches } })
    out.push({ name, ...st })
    const box = await loc.boundingBox()
    await page.screenshot({ path: `${L.CAP}/teclado/forced-colors-${name}.png`, clip: { x: Math.max(0, box.x - 16), y: Math.max(0, box.y - 16), width: Math.min(box.width + 32, 600), height: Math.min(box.height + 32, 400) } })
  }
  console.log(JSON.stringify(out, null, 1))
  L.save('forced-colors.json', out)
  await ctx.close(); await b.close()
})()
