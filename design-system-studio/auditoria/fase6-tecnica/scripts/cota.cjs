// Cota do localStorage: enche até o limite exato e observa o que acontece ao salvar o projeto.
const { chromium } = require('playwright')
const path = require('path')
const { BASE, save } = require('./perf-lib.cjs')
;(async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } })
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 200)))
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 200)) })
  await page.goto(BASE + '#/modulos/cores', { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.locator('[data-testid^="palette-option-"] .ui-option__hit').nth(1).click()
  await page.waitForTimeout(300)
  const fill = await page.evaluate(() => {
    const k = 'atelier-ui:studio:v1'
    const before = (localStorage.getItem(k) || '').length
    let i = 0
    for (const size of [262144, 16384, 1024, 64, 4]) {
      for (;;) { try { localStorage.setItem('__f' + i++, 'x'.repeat(size)) } catch { break } }
    }
    const total = Object.keys(localStorage).reduce((a, x) => a + x.length + (localStorage.getItem(x) || '').length, 0)
    return { estadoAntes: before, totalCharsArmazenados: total }
  })
  // 1) salva uma versão (o estado cresce ~1 projeto) com a cota cheia
  await page.evaluate(() => { location.hash = '#/projeto' })
  await page.waitForTimeout(1000)
  const errsBeforeSnap = errs.length
  await page.fill('#snap-label', 'Versão sob cota cheia')
  await page.getByRole('button', { name: 'Salvar versão' }).click()
  await page.waitForTimeout(600)
  const toastText = await page.evaluate(() => Array.from(document.querySelectorAll('[class*=toast]')).map((t) => t.textContent).join(' | '))
  const versionsOnScreen = await page.locator('.snap-item').count()
  const storedVersions = await page.evaluate(() => JSON.parse(localStorage.getItem('atelier-ui:studio:v1')).state.history.length)
  const errSnap = errs.slice(errsBeforeSnap)
  // 2) depois disso, uma troca de paleta ainda é salva?
  await page.evaluate(() => { location.hash = '#/modulos/cores' })
  await page.waitForTimeout(1000)
  const before = await page.evaluate(() => localStorage.getItem('atelier-ui:studio:v1'))
  await page.locator('[data-testid^="palette-option-"] .ui-option__hit').nth(9).click()
  await page.waitForTimeout(400)
  const sel = await page.locator('[data-testid^="palette-option-"][data-selected="true"]').getAttribute('data-testid')
  const after = await page.evaluate(() => localStorage.getItem('atelier-ui:studio:v1'))
  const savedPalette = JSON.parse(after).state.project.identity.paletteId
  await page.screenshot({ path: path.join(__dirname, '..', 'dados', 'capturas', 'r6-cota-estourada.png') })
  const visibleWarning = { toastAoSalvarVersao: toastText, versoesNaTela: versionsOnScreen, versoesGravadas: storedVersions, errosAoSalvarVersao: errSnap }
  // recarrega: o que volta?
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  const afterReload = await page.locator('[data-testid^="palette-option-"][data-selected="true"]').getAttribute('data-testid')
  const r = { ...fill, paletaNaTela: sel, paletaSalva: savedPalette, gravacaoMudou: before !== after, avisoVisivel: visibleWarning, paletaAposRecarregar: afterReload, erros: errs.slice(0, 4) }
  save(path.join(__dirname, '..', 'dados', 'cota.json'), r)
  console.log(JSON.stringify(r, null, 2))
  await browser.close()
})()
