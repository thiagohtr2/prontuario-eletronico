// Carga a frio por rota: Navigation Timing, FCP, LCP, CLS, long tasks, bytes, nós, heap.
// Cada medição usa um contexto novo (cache vazio). Uso: RUNS=5 node perf-carga.cjs
const { chromium } = require('playwright')
const path = require('path')
const { BASE, INIT, median, load, cdpMetrics, waitReady, save } = require('./perf-lib.cjs')

const ROUTES = (process.env.ROUTES || ',livre,guiado/objetivo,modulos/desktop,modulos/mobile,modulos/componentes,modulos/navegacao,modulos/inspiracao,modulos/templates,modulos/landing,modulos/cores,prompt').split(',')
const RUNS = Number(process.env.RUNS || 5)
const VIEWPORT = process.env.MOBILE ? { width: 390, height: 844 } : { width: 1440, height: 900 }

;(async () => {
  const browser = await chromium.launch()
  const raw = []
  for (let run = 1; run <= RUNS; run++) {
    for (const route of ROUTES) {
      const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 })
      await ctx.addInitScript(INIT)
      const page = await ctx.newPage()
      const cdp = await ctx.newCDPSession(page)
      await cdp.send('Performance.enable')
      const errors = []
      page.on('pageerror', (e) => errors.push(String(e)))
      const la = load()
      const t0 = Date.now()
      await page.goto(BASE + '#/' + route, { waitUntil: 'load' })
      await waitReady(page)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1200)
      const data = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0]
        const res = performance.getEntriesByType('resource')
        const by = { js: [0, 0], css: [0, 0], font: [0, 0], other: [0, 0] }
        for (const r of res) {
          const k = /\.js(\?|$)/.test(r.name) ? 'js' : /\.css(\?|$)/.test(r.name) ? 'css' : /\.woff2?(\?|$)/.test(r.name) ? 'font' : 'other'
          by[k][0]++
          by[k][1] += r.encodedBodySize
        }
        const P = window.__perf
        const fcp = P.fcp
        const tbt = P.lt.filter(([s]) => s >= fcp).reduce((a, [, d]) => a + Math.max(0, d - 50), 0)
        return {
          ttfb: nav.responseStart,
          dcl: nav.domContentLoadedEventEnd,
          loadEvent: nav.loadEventEnd,
          fcp,
          lcp: P.lcp,
          lcpEl: P.lcpEl,
          ready: P.ready,
          cls: P.cls,
          longTasks: P.lt.length,
          longTaskTotal: P.lt.reduce((a, [, d]) => a + d, 0),
          longestTask: P.lt.reduce((a, [, d]) => Math.max(a, d), 0),
          tbt,
          requests: res.length + 1,
          bytes: by,
          domNodes: document.getElementsByTagName('*').length,
        }
      })
      const m = await cdpMetrics(cdp)
      raw.push({ run, route, loadavg: la, wallMs: Date.now() - t0, errors, ...data, heapMB: m.JSHeapUsedSize / 1048576, cdpNodes: m.Nodes, layoutCount: m.LayoutCount, recalcStyleCount: m.RecalcStyleCount, scriptDuration: m.ScriptDuration, taskDuration: m.TaskDuration })
      process.stdout.write(`run ${run} /${route || '(home)'} ready=${Math.round(data.ready)} lcp=${Math.round(data.lcp)} js=${Math.round(data.bytes.js[1] / 1024)}KB load=${la[0]}\n`)
      await ctx.close()
    }
  }
  await browser.close()
  const summary = {}
  for (const route of ROUTES) {
    const rows = raw.filter((r) => r.route === route)
    const f = (k) => Math.round(median(rows.map((r) => r[k])) * 100) / 100
    summary[route || '(home)'] = {
      n: rows.length,
      ttfb: f('ttfb'), dcl: f('dcl'), loadEvent: f('loadEvent'), fcp: f('fcp'), lcp: f('lcp'), ready: f('ready'), cls: f('cls'),
      tbt: f('tbt'), longTasks: f('longTasks'), longestTask: f('longestTask'),
      lcpMin: Math.round(Math.min(...rows.map((r) => r.lcp))), lcpMax: Math.round(Math.max(...rows.map((r) => r.lcp))),
      readyMin: Math.round(Math.min(...rows.map((r) => r.ready))), readyMax: Math.round(Math.max(...rows.map((r) => r.ready))),
      requests: f('requests'),
      jsKB: Math.round(median(rows.map((r) => r.bytes.js[1])) / 1024), jsFiles: median(rows.map((r) => r.bytes.js[0])),
      cssKB: Math.round(median(rows.map((r) => r.bytes.css[1])) / 1024),
      fontKB: Math.round(median(rows.map((r) => r.bytes.font[1])) / 1024), fontFiles: median(rows.map((r) => r.bytes.font[0])),
      domNodes: f('domNodes'), heapMB: f('heapMB'), lcpEl: rows[0].lcpEl,
      errors: rows.flatMap((r) => r.errors).slice(0, 3),
      loadavgMedian: median(rows.map((r) => r.loadavg[0])),
    }
  }
  const tag = process.env.MOBILE ? 'mobile' : 'desktop'
  save(path.join(__dirname, '..', 'dados', `perf-carga-${tag}.json`), { method: { base: BASE, runs: RUNS, viewport: VIEWPORT, cache: 'contexto novo por medição (frio)', server: 'python http.server (HTTP/1.0, sem compressão)' }, summary, raw })
  console.table(Object.fromEntries(Object.entries(summary).map(([k, v]) => [k, { fcp: v.fcp, lcp: v.lcp, ready: v.ready, cls: v.cls, tbt: v.tbt, jsKB: v.jsKB, jsFiles: v.jsFiles, fontKB: v.fontKB, nodes: v.domNodes, heapMB: Math.round(v.heapMB) }])))
})()
