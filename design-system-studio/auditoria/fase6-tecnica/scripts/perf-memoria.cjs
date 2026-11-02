// Troca de rota (1ª visita, com download do chunk; 2ª+ visita, em cache) e memória antes/depois
// de percorrer todos os módulos 3 vezes (heap após coleta de lixo forçada via CDP).
// Uso: RUNS=3 node perf-memoria.cjs
const { chromium } = require('playwright')
const path = require('path')
const { BASE, INIT, median, load, cdpMetrics, waitReady, save } = require('./perf-lib.cjs')

const RUNS = Number(process.env.RUNS || 3)
const ROUTES = ['livre', 'modulos/objetivo', 'modulos/landing', 'modulos/login', 'modulos/cadastro', 'modulos/desktop', 'modulos/mobile', 'modulos/preview', 'modulos/cores', 'modulos/navegacao', 'modulos/componentes', 'modulos/inspiracao', 'modulos/templates', 'prompt', 'exportar', 'validacao', 'projeto', 'guiado/objetivo']

async function go(page, route) {
  return page.evaluate(async (r) => {
    const main = document.getElementById('conteudo')
    const prevH1 = main.querySelector('h1')
    const t0 = performance.now()
    location.hash = '#/' + r
    await new Promise((resolve) => {
      const check = () => {
        const h = main.querySelector('h1')
        const loading = /Carregando…/.test(main.textContent || '') && !h
        if (h && h !== prevH1 && !loading) requestAnimationFrame(() => setTimeout(resolve, 0))
        else if (performance.now() - t0 > 20000) resolve()
        else requestAnimationFrame(check)
      }
      requestAnimationFrame(check)
    })
    return { ms: performance.now() - t0, nodes: document.getElementsByTagName('*').length }
  }, route)
}

async function snapshot(cdp, page) {
  await cdp.send('HeapProfiler.collectGarbage')
  await page.waitForTimeout(300)
  await cdp.send('HeapProfiler.collectGarbage')
  const m = await cdpMetrics(cdp)
  return { heapMB: Math.round((m.JSHeapUsedSize / 1048576) * 10) / 10, nodes: m.Nodes, listeners: m.JSEventListeners, documents: m.Documents, layoutObjects: m.LayoutObjects }
}

;(async () => {
  const browser = await chromium.launch()
  const runs = []
  for (let run = 1; run <= RUNS; run++) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    await ctx.addInitScript(INIT)
    const page = await ctx.newPage()
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Performance.enable')
    await cdp.send('HeapProfiler.enable')
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto(BASE + '#/', { waitUntil: 'load' })
    await waitReady(page)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)
    const mem = [{ label: 'início (home)', ...(await snapshot(cdp, page)) }]
    const switches = []
    for (let loop = 1; loop <= 3; loop++) {
      for (const r of ROUTES) {
        const res = await go(page, r)
        switches.push({ loop, route: r, ...res })
        await page.waitForTimeout(250)
      }
      await go(page, '')
      await page.waitForTimeout(500)
      mem.push({ label: `após volta ${loop} por ${ROUTES.length} rotas`, ...(await snapshot(cdp, page)) })
    }
    runs.push({ run, loadavg: load(), mem, switches, errors })
    process.stdout.write(`run ${run}: heap ${mem.map((m) => m.heapMB).join(' → ')} MB; nodes ${mem.map((m) => m.nodes).join(' → ')}\n`)
    await ctx.close()
  }
  await browser.close()
  const routeSummary = {}
  for (const r of ROUTES) {
    const first = runs.map((x) => x.switches.find((s) => s.route === r && s.loop === 1).ms)
    const warm = runs.flatMap((x) => x.switches.filter((s) => s.route === r && s.loop > 1).map((s) => s.ms))
    routeSummary[r] = { primeiraVisitaMs: Math.round(median(first)), visitaEmCacheMs: Math.round(median(warm)), nosDom: median(runs.map((x) => x.switches.find((s) => s.route === r && s.loop === 1).nodes)) }
  }
  const memSummary = runs[0].mem.map((m, i) => ({ etapa: m.label, heapMB: median(runs.map((x) => x.mem[i].heapMB)), nodes: median(runs.map((x) => x.mem[i].nodes)), listeners: median(runs.map((x) => x.mem[i].listeners)), documents: median(runs.map((x) => x.mem[i].documents)) }))
  save(path.join(__dirname, '..', 'dados', 'perf-memoria.json'), { method: { runs: RUNS, routes: ROUTES, loops: 3, gc: 'HeapProfiler.collectGarbage ×2 antes de cada leitura' }, routeSummary, memSummary, runs })
  console.table(routeSummary)
  console.table(memSummary)
})()
