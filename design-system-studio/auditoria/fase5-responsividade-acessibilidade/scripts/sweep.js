// Varredura de responsividade: todas as rotas × larguras.
// Uso: node sweep.js <rotulo> <larguras separadas por vírgula> [estado=cheio|vazio] [opções]
//   ex.: node sweep.js A 320,360,375 cheio
//        node sweep.js Z 375,1280 cheio textzoom=200
//        node sweep.js L 844x390,915x412 cheio
const L = require('./lib')

const label = process.argv[2] || 'X'
const sizes = (process.argv[3] || '375').split(',')
const state = process.argv[4] || 'cheio'
const extra = Object.fromEntries(process.argv.slice(5).map((a) => a.split('=')))
const FULL = new Set(['320', '375', '768', '1280', '640'])
const routeFilter = extra.routes ? extra.routes.split('|') : null

function dims(s) {
  if (s.includes('x')) {
    const [w, h] = s.split('x').map(Number)
    return { w, h, mobile: true }
  }
  const w = Number(s)
  const h = w < 600 ? 800 : w < 1024 ? 1024 : w <= 1440 ? 900 : 1080
  return { w, h, mobile: w < 768 }
}

;(async () => {
  const browser = await L.launch()
  const results = []
  for (const s of sizes) {
    const { w, h, mobile } = dims(s)
    const tag = `${s}${state === 'vazio' ? '-vazio' : ''}${extra.textzoom ? '-txt' + extra.textzoom : ''}${extra.tag ? '-' + extra.tag : ''}`
    const { ctx, page } = await L.newPage(browser, w, h, { state, mobile: extra.desktopEmu ? false : mobile, textZoom: extra.textzoom ? Number(extra.textzoom) : undefined })
    for (const [id, route] of L.ROUTES) {
      if (routeFilter && !routeFilter.includes(id)) continue
      const t0 = Date.now()
      let rec = { id, route, size: s, w, h, mobile, state, tag }
      try {
        await L.go(page, route, 600)
        rec.finalHash = await page.evaluate(() => location.hash)
        rec.m = await L.measure(page)
        if (mobile || w <= 820 || extra.covered) rec.covered = await L.coveredScan(page, 10)
        rec.shot = await L.shot(page, `sw/${id}--${tag}`, { fullPage: false })
        if (FULL.has(s) || extra.full) {
          await page.screenshot({ path: `${L.CAP}/sw/${id}--${tag}--full.png`, fullPage: true, scale: 'css', animations: 'disabled' })
          rec.shotFull = `capturas/sw/${id}--${tag}--full.png`
        }
      } catch (e) {
        rec.error = String(e).slice(0, 300)
      }
      rec.ms = Date.now() - t0
      results.push(rec)
      process.stdout.write(`${tag} ${id} ${rec.error ? 'ERRO' : 'ok'} ov=${rec.m?.docOverflowX} ovEls=${rec.m?.overflowCount} trunc=${rec.m?.truncatedCount} small=${rec.m?.smallTextCount} lt44=${rec.m?.targetsLt44} lt24=${rec.m?.targetsLt24} cov=${rec.covered?.length ?? '-'} ${rec.ms}ms\n`)
    }
    await ctx.close()
    L.save(`sweep-${label}.json`, results)
  }
  await browser.close()
})()
