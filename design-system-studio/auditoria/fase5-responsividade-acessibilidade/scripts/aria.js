// Árvore de acessibilidade (ariaSnapshot) de telas representativas — substitui, de forma limitada, um leitor de tela.
const L = require('./lib')
const fs = require('fs')
;(async () => {
  const b = await L.launch()
  const { ctx, page } = await L.newPage(b, 1280, 900)
  const items = [
    ['home', '/'], ['guiado-desktop', '/guiado/desktop'], ['guiado-objetivo', '/guiado/objetivo'], ['mobile', '/modulos/mobile'], ['cores', '/modulos/cores'], ['prompt', '/prompt'], ['preview', '/modulos/preview'], ['landing', '/modulos/landing'], ['navegacao', '/modulos/navegacao'], ['exportar', '/exportar'], ['validacao', '/validacao'],
  ]
  fs.mkdirSync(L.DADOS + '/aria', { recursive: true })
  for (const [id, route] of items) {
    await L.go(page, route, 800)
    const snap = await page.locator('body').ariaSnapshot()
    fs.writeFileSync(`${L.DADOS}/aria/${id}.yml`, snap)
    console.log(id, snap.split('\n').length, 'linhas')
  }
  // modais
  await L.go(page, '/modulos/componentes', 800)
  await page.locator('button:has-text("Personalizar")').first().click()
  await page.waitForTimeout(600)
  fs.writeFileSync(`${L.DADOS}/aria/modal-editor-componente.yml`, await page.locator('[role=dialog]').first().ariaSnapshot())
  await page.keyboard.press('Escape')
  await page.keyboard.press('Control+k')
  await page.waitForTimeout(400)
  fs.writeFileSync(`${L.DADOS}/aria/modal-busca.yml`, await page.locator('[role=dialog]').first().ariaSnapshot())
  await ctx.close()
  await b.close()
})()
