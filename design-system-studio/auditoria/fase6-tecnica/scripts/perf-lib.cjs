// Utilitários comuns das medições de desempenho (auditoria fase 6).
const fs = require('fs')
const os = require('os')

const BASE = process.env.BASE || 'http://127.0.0.1:4300/'

/** Observadores instalados antes de qualquer script da página. */
const INIT = `
(() => {
  const P = (window.__perf = { lcp: 0, cls: 0, lt: [], ev: [], ready: 0, fcp: 0 })
  const obs = (type, fn, extra = {}) => { try { new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type, buffered: true, ...extra }) } catch (e) { P['no_' + type] = String(e) } }
  obs('largest-contentful-paint', (e) => { P.lcp = e.renderTime || e.loadTime || e.startTime; P.lcpEl = e.element ? e.element.tagName + '.' + (e.element.className || '').toString().slice(0, 40) : '' })
  obs('layout-shift', (e) => { if (!e.hadRecentInput) P.cls += e.value })
  obs('longtask', (e) => P.lt.push([Math.round(e.startTime), Math.round(e.duration)]))
  obs('paint', (e) => { if (e.name === 'first-contentful-paint') P.fcp = e.startTime })
  obs('event', (e) => { if (e.interactionId) P.ev.push({ id: e.interactionId, name: e.name, d: e.duration, s: Math.round(e.startTime), delay: Math.round(e.processingStart - e.startTime), proc: Math.round(e.processingEnd - e.processingStart) }) }, { durationThreshold: 16 })
  const poll = () => {
    const main = document.getElementById('conteudo')
    const h = main && main.querySelector('h1')
    const loading = main && /Carregando/.test(main.textContent || '') && !h
    if (h && !loading) P.ready = performance.now()
    else requestAnimationFrame(poll)
  }
  requestAnimationFrame(poll)
})()
`

/** Gancho mínimo do React DevTools: conta commits e componentes efetivamente renderizados. */
const REACT_HOOK = `
(() => {
  const seen = new WeakMap()
  const R = (window.__react = { commits: 0, rendered: 0, byName: {} })
  const COMPONENT_TAGS = new Set([0, 1, 11, 14, 15])
  function walk(f) {
    while (f) {
      if (COMPONENT_TAGS.has(f.tag)) {
        const rec = seen.get(f) || (f.alternate && seen.get(f.alternate))
        const changed = !rec || rec.p !== f.memoizedProps || rec.s !== f.memoizedState
        const r = { p: f.memoizedProps, s: f.memoizedState }
        seen.set(f, r); if (f.alternate) seen.set(f.alternate, r)
        if (changed) {
          R.rendered++
          const t = f.type && (f.type.displayName || f.type.name || (f.type.type && (f.type.type.displayName || f.type.type.name)) || (f.type.render && f.type.render.name))
          const n = t || 'anon'
          R.byName[n] = (R.byName[n] || 0) + 1
        }
      }
      if (f.child) walk(f.child)
      f = f.sibling
    }
  }
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true, isDisabled: false, renderers: new Map(),
    inject(r) { const id = this.renderers.size + 1; this.renderers.set(id, r); return id },
    onCommitFiberRoot(id, root) { R.commits++; walk(root.current.child) },
    onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, checkDCE() {}, onScheduleFiberRoot() {},
  }
})()
`

const median = (a) => {
  const s = [...a].filter((x) => typeof x === 'number' && !Number.isNaN(x)).sort((x, y) => x - y)
  if (!s.length) return null
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}
const min = (a) => Math.min(...a)
const max = (a) => Math.max(...a)
const load = () => os.loadavg().map((x) => Math.round(x * 100) / 100)

async function cdpMetrics(cdp) {
  const { metrics } = await cdp.send('Performance.getMetrics')
  const o = {}
  for (const m of metrics) o[m.name] = m.value
  return o
}

async function waitReady(page, timeout = 30000) {
  await page.waitForFunction(() => window.__perf && window.__perf.ready > 0, null, { timeout })
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

module.exports = { BASE, INIT, REACT_HOOK, median, min, max, load, cdpMetrics, waitReady, save }
