// axe-core em todas as rotas, em computador (1280) e celular (375, emulação móvel).
// Uso: node axe-rotas.js [larguras] [estado]
const L = require('./lib')
const widths = (process.argv[2] || '1280,375').split(',').map(Number)
const state = process.argv[3] || 'cheio'
;(async () => {
  const browser = await L.launch()
  const out = []
  for (const w of widths) {
    const { ctx, page } = await L.newPage(browser, w, w < 768 ? 800 : 900, { state })
    for (const [id, route] of L.ROUTES) {
      const t0 = Date.now()
      try {
        await L.go(page, route, 800)
        const r = await L.runAxe(page)
        const sem = await page.evaluate(() => {
          const hs = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
          const visibleToAT = (el) => !el.closest('[aria-hidden="true"],[inert]')
          const levels = hs.filter(visibleToAT).map((h) => Number(h.tagName[1]))
          let skips = 0
          for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) skips++
          return {
            main: document.querySelectorAll('main,[role=main]').length,
            nav: Array.from(document.querySelectorAll('nav,[role=navigation]')).filter(visibleToAT).map((n) => n.getAttribute('aria-label') || '(sem nome)'),
            h1: hs.filter((h) => h.tagName === 'H1' && visibleToAT(h)).map((h) => h.innerText.trim().slice(0, 50)),
            h1Hidden: hs.filter((h) => h.tagName === 'H1' && !visibleToAT(h)).length,
            headings: levels.length,
            headingSkips: skips,
            firstHeadings: hs.filter(visibleToAT).slice(0, 12).map((h) => h.tagName + ':' + h.innerText.trim().slice(0, 40)),
            liveRegions: Array.from(document.querySelectorAll('[aria-live],[role=status],[role=alert]')).map((e) => (e.getAttribute('role') || '') + '/' + (e.getAttribute('aria-live') || '')),
            title: document.title,
            lang: document.documentElement.lang,
          }
        })
        out.push({ id, route, w, state, ...r, sem, ms: Date.now() - t0 })
        console.log(w, id, r.violations.map((v) => `${v.id}:${v.count}`).join(' '), Date.now() - t0 + 'ms')
      } catch (e) {
        out.push({ id, route, w, state, error: String(e).slice(0, 300) })
        console.log(w, id, 'ERRO', String(e).slice(0, 200))
      }
    }
    await ctx.close()
    L.save(`axe-rotas-${state}.json`, out)
  }
  await browser.close()
})()
