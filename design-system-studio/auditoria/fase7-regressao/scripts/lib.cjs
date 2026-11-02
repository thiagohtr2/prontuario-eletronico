// Biblioteca mínima para as sondagens exploratórias da fase 7 (regressão).
// Usa o Chromium do Playwright instalado no projeto; não altera nada no servidor.
const { chromium } = require('@playwright/test')
const path = require('path')
const fs = require('fs')

const BASE = 'http://127.0.0.1:4300'
const OUT = path.resolve(__dirname, '..')
const UA_ANDROID =
  'Mozilla/5.0 (Linux; Android 13; SM-A135M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'
const DEVICES = {
  desktop: { viewport: { width: 1440, height: 900 } },
  android: { viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: UA_ANDROID },
  iphone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: UA_ANDROID },
}

async function open(dev = 'desktop', extra = {}) {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ ...DEVICES[dev], acceptDownloads: true, ...extra })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()))
  await page.goto(BASE + '/')
  await page.evaluate(() => localStorage.clear())
  return { browser, ctx, page, errors }
}

async function go(page, route) {
  await page.goto(BASE + '/#' + route)
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() => !document.body.innerText.includes('Carregando…'), null, { timeout: 15000 })
  await page.waitForTimeout(200)
}

async function setProject(page, patch) {
  // Escreve diretamente no estado persistido e recarrega (atalho só para sondagem).
  await page.evaluate((patch) => {
    const raw = JSON.parse(localStorage.getItem('atelier-ui:studio:v1') || '{}')
    const deep = (a, b) => {
      for (const [k, v] of Object.entries(b)) {
        if (v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object') deep(a[k], v)
        else a[k] = v
      }
    }
    deep(raw.state.project, patch)
    localStorage.setItem('atelier-ui:studio:v1', JSON.stringify(raw))
  }, patch)
}

async function saved(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('atelier-ui:studio:v1') || '{}').state?.project)
}

async function shot(page, name, opts = {}) {
  const p = path.join(OUT, 'capturas', name + '.png')
  await page.screenshot({ path: p, ...opts })
  console.log('captura:', path.relative(OUT, p))
  return p
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
module.exports = { open, go, saved, setProject, shot, sleep, BASE, OUT, DEVICES }
