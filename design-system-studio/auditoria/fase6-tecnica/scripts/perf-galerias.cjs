// Latência de clique em miniaturas (Event Timing API = duração até o próximo paint, base do INP),
// long tasks durante a interação, mutações de DOM e (com REACT=1) commits/componentes renderizados.
// Uso: RUNS=3 node perf-galerias.cjs      |   REACT=1 RUNS=1 node perf-galerias.cjs
const { chromium } = require('playwright')
const path = require('path')
const { BASE, INIT, REACT_HOOK, median, load, cdpMetrics, waitReady, save } = require('./perf-lib.cjs')

const RUNS = Number(process.env.RUNS || 3)
const REACT = Boolean(process.env.REACT)
const CLICKS = Number(process.env.CLICKS || 10)

const SCENARIOS = [
  { name: 'Layouts desktop (42)', route: 'modulos/desktop', sel: '[data-testid^="desktop-option-"] .ui-option__hit' },
  { name: 'Layouts mobile (44)', route: 'modulos/mobile', sel: '[data-testid^="mobile-option-"] .ui-option__hit' },
  { name: 'Componentes: categorias (66 × 16 famílias)', route: 'modulos/componentes', sel: '[data-testid^="component-category-"]' },
  { name: 'Componentes: famílias', route: 'modulos/componentes', sel: '[data-testid^="family-option-"] .ui-option__hit' },
  { name: 'Paletas (60)', route: 'modulos/cores', sel: '[data-testid^="palette-option-"] .ui-option__hit' },
  { name: 'Navegação: headers/sidebars', route: 'modulos/navegacao', sel: '[data-testid^="header-option-"] .nvs-card__select' },
  { name: 'Templates: abrir editor (28)', route: 'modulos/templates', sel: '[data-testid^="template-option-"] .ui-option__hit', closeWithEsc: true },
  { name: 'Inspiração: abrir visualizador (20)', route: 'modulos/inspiracao', sel: '[data-testid^="inspiration-option-"] .ui-option__hit', closeWithEsc: true },
]

;(async () => {
  const browser = await chromium.launch()
  const results = []
  for (let run = 1; run <= RUNS; run++) {
    for (const sc of SCENARIOS) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      await ctx.addInitScript(INIT)
      if (REACT) await ctx.addInitScript(REACT_HOOK)
      const page = await ctx.newPage()
      const cdp = await ctx.newCDPSession(page)
      await cdp.send('Performance.enable')
      const errors = []
      page.on('pageerror', (e) => errors.push(String(e)))
      await page.goto(BASE + '#/' + sc.route, { waitUntil: 'load' })
      await waitReady(page)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(800)
      const count = await page.locator(sc.sel).count()
      if (!count) {
        results.push({ run, scenario: sc.name, error: 'seletor sem resultados: ' + sc.sel })
        await ctx.close()
        continue
      }
      const nodesBefore = await page.evaluate(() => document.getElementsByTagName('*').length)
      const idx = Array.from({ length: Math.min(CLICKS, count) }, (_, i) => Math.floor((i * count) / Math.min(CLICKS, count)))
      // Mutações de DOM por clique
      await page.evaluate(() => {
        window.__mut = 0
        new MutationObserver((l) => { for (const r of l) window.__mut += r.addedNodes.length + r.removedNodes.length + (r.type === 'attributes' ? 1 : 0) }).observe(document.body, { subtree: true, childList: true, attributes: true })
      })
      const perClick = []
      for (const i of idx) {
        const before = await page.evaluate(() => ({ ev: window.__perf.ev.length, lt: window.__perf.lt.length, mut: window.__mut, c: window.__react ? window.__react.commits : 0, r: window.__react ? window.__react.rendered : 0 }))
        const el = page.locator(sc.sel).nth(i)
        await el.scrollIntoViewIfNeeded()
        await page.waitForTimeout(150)
        const t0 = Date.now()
        await el.click()
        await page.waitForTimeout(450)
        const after = await page.evaluate((b) => {
          const P = window.__perf
          const evs = P.ev.slice(b.ev)
          const byId = {}
          for (const e of evs) byId[e.id] = Math.max(byId[e.id] || 0, e.d)
          const lts = P.lt.slice(b.lt)
          return {
            inp: Math.max(0, ...Object.values(byId)),
            maxProc: Math.max(0, ...evs.map((e) => e.proc)),
            longTasks: lts.length,
            longTaskMs: lts.reduce((a, [, d]) => a + d, 0),
            mutations: window.__mut - b.mut,
            commits: window.__react ? window.__react.commits - b.c : null,
            rendered: window.__react ? window.__react.rendered - b.r : null,
          }
        }, before)
        perClick.push({ i, wall: Date.now() - t0, ...after })
        if (sc.closeWithEsc) {
          await page.keyboard.press('Escape')
          await page.waitForTimeout(400)
        }
      }
      const m = await cdpMetrics(cdp)
      const nodesAfter = await page.evaluate(() => document.getElementsByTagName('*').length)
      let topRendered = null
      if (REACT) topRendered = await page.evaluate(() => Object.entries(window.__react.byName).sort((a, b) => b[1] - a[1]).slice(0, 12))
      results.push({
        run, scenario: sc.name, items: count, loadavg: load(), nodesBefore, nodesAfter, heapMB: Math.round(m.JSHeapUsedSize / 1048576 * 10) / 10,
        inpMedian: median(perClick.map((c) => c.inp)), inpMax: Math.max(...perClick.map((c) => c.inp)),
        procMedian: median(perClick.map((c) => c.maxProc)),
        longTasksTotal: perClick.reduce((a, c) => a + c.longTasks, 0), longTaskMsTotal: perClick.reduce((a, c) => a + c.longTaskMs, 0),
        mutationsMedian: median(perClick.map((c) => c.mutations)),
        commitsMedian: REACT ? median(perClick.map((c) => c.commits)) : null,
        renderedMedian: REACT ? median(perClick.map((c) => c.rendered)) : null,
        topRendered, perClick, errors,
      })
      const r = results[results.length - 1]
      process.stdout.write(`run ${run} ${sc.name}: n=${count} INPmed=${r.inpMedian} max=${r.inpMax} LT=${r.longTasksTotal} mut=${r.mutationsMedian} rendered=${r.renderedMedian} nodes=${nodesAfter} load=${r.loadavg[0]}\n`)
      await ctx.close()
    }
  }
  await browser.close()
  const summary = {}
  for (const sc of SCENARIOS) {
    const rows = results.filter((r) => r.scenario === sc.name && !r.error)
    if (!rows.length) { summary[sc.name] = { error: results.find((r) => r.scenario === sc.name)?.error }; continue }
    summary[sc.name] = {
      runs: rows.length, items: rows[0].items,
      inpMedianaDasMedianas: median(rows.map((r) => r.inpMedian)), inpPior: Math.max(...rows.map((r) => r.inpMax)),
      procMediana: median(rows.map((r) => r.procMedian)),
      longTasksPorRodada: median(rows.map((r) => r.longTasksTotal)), longTaskMsPorRodada: median(rows.map((r) => r.longTaskMsTotal)),
      mutacoesPorClique: median(rows.map((r) => r.mutationsMedian)),
      componentesRenderizadosPorClique: REACT ? median(rows.map((r) => r.renderedMedian)) : undefined,
      commitsPorClique: REACT ? median(rows.map((r) => r.commitsMedian)) : undefined,
      nosDom: median(rows.map((r) => r.nodesAfter)), heapMB: median(rows.map((r) => r.heapMB)),
      loadavg: median(rows.map((r) => r.loadavg[0])),
    }
  }
  save(path.join(__dirname, '..', 'dados', REACT ? 'perf-galerias-react.json' : 'perf-galerias.json'), { method: { runs: RUNS, clicksPerScenario: CLICKS, reactHook: REACT }, summary, results })
  console.table(summary)
})()
