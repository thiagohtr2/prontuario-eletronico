#!/usr/bin/env node
/**
 * Teste de teclado em navegador real: percorre as telas com Tab e confere
 * que cada elemento focado tem indicador visível e não fica escondido sob o
 * header fixo ou atrás do dock. Também confere Escape e retorno de foco no
 * menu da conta e a prisão de foco no diálogo.
 *
 * Uso: npm run qa:build && node scripts/qa/keyboard.cjs
 */
const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const path = require('node:path')
const { installSupabaseMock } = require('./mock-supabase.cjs')

const ROOT = path.resolve(__dirname, '../..')
const PORT = Number(process.env.QA_PORT ?? 4319)
const BASE = `http://127.0.0.1:${PORT}`

const PAGES = [
  { path: '/', auth: false },
  { path: '/entrar', auth: false },
  { path: '/cadastro', auth: false },
  { path: '/inicio', auth: true },
  { path: '/pacientes', auth: true },
  { path: '/pacientes/p1', auth: true },
  { path: '/atendimentos/novo', auth: true },
]
const WIDTHS = [390, 1440]

function inspectFocus() {
  const el = document.activeElement
  if (!el || el === document.body) return null
  const rect = el.getBoundingClientRect()
  const style = getComputedStyle(el)
  const indicator = (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none'
  let coverTop = 0
  let coverBottom = window.innerHeight
  for (const fixed of document.querySelectorAll('.app-dock, header.sticky, .sticky')) {
    const r = fixed.getBoundingClientRect()
    if (getComputedStyle(fixed).display === 'none' || r.height === 0 || fixed.contains(el)) continue
    if (r.top <= 0 + 1 && r.bottom < window.innerHeight / 2) coverTop = Math.max(coverTop, r.bottom)
    if (r.bottom >= window.innerHeight - 40 && r.top > window.innerHeight / 2) coverBottom = Math.min(coverBottom, r.top)
  }
  const inFixed = style.position === 'fixed' || el.closest('.app-dock, header.sticky, .sticky, [role=dialog], [role=menu]')
  // WCAG 2.4.11: o elemento focado não pode ficar inteiramente escondido.
  const hidden = !inFixed && (rect.bottom <= coverTop + 1 || rect.top >= coverBottom - 1)
  const label = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || el.tagName).trim().slice(0, 40)
  return { label, indicator, hidden, top: Math.round(rect.top), coverTop: Math.round(coverTop), coverBottom: Math.round(coverBottom) }
}

async function main() {
  const server = spawn(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--outDir', 'dist-qa', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' })
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const browser = await chromium.launch()
  const problems = []
  let checked = 0
  try {
    for (const width of WIDTHS) {
      for (const spec of PAGES) {
        const context = await browser.newContext({ viewport: { width, height: 780 }, reducedMotion: 'reduce' })
        const page = await context.newPage()
        await installSupabaseMock(page, { authenticated: spec.auth })
        await page.goto(BASE + spec.path, { waitUntil: 'networkidle' })
        for (let i = 0; i < 45; i++) {
          await page.keyboard.press('Tab')
          const focus = await page.evaluate(inspectFocus)
          if (!focus) continue
          checked++
          if (!focus.indicator) problems.push(`${spec.path} @ ${width}: sem indicador de foco em "${focus.label}"`)
          if (focus.hidden) problems.push(`${spec.path} @ ${width}: "${focus.label}" focado sob elemento fixo (top ${focus.top}, área ${focus.coverTop}–${focus.coverBottom})`)
        }
        await context.close()
      }

      // Menu da conta: abre com Enter, Escape fecha e devolve o foco.
      const context = await browser.newContext({ viewport: { width, height: 780 } })
      const page = await context.newPage()
      await installSupabaseMock(page, { authenticated: true })
      await page.goto(BASE + '/inicio', { waitUntil: 'networkidle' })
      const menuButton = page.getByRole('button', { name: /menu da conta/i }).filter({ visible: true }).first()
      await menuButton.focus()
      await page.keyboard.press('Enter')
      const menuOpen = await page.getByRole('menu').isVisible()
      const firstItemFocused = await page.evaluate(() => document.activeElement?.getAttribute('role') === 'menuitem')
      await page.keyboard.press('Escape')
      const menuClosed = (await page.getByRole('menu').count()) === 0
      const focusBack = await menuButton.evaluate((el) => el === document.activeElement)
      if (!menuOpen || !firstItemFocused || !menuClosed || !focusBack)
        problems.push(`menu @ ${width}: aberto=${menuOpen} foco-no-item=${firstItemFocused} fechou=${menuClosed} foco-voltou=${focusBack}`)

      // Diálogo: o foco não sai dele com Tab e volta ao botão ao fechar.
      await page.goto(BASE + '/pacientes', { waitUntil: 'networkidle' })
      const opener = page.getByRole('button', { name: 'Novo paciente' })
      await opener.click()
      let escaped = false
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press('Tab')
        if (!(await page.evaluate(() => Boolean(document.activeElement?.closest('[role=dialog]'))))) escaped = true
      }
      await page.keyboard.press('Escape')
      const dialogClosed = (await page.getByRole('dialog').count()) === 0
      const openerFocused = await opener.evaluate((el) => el === document.activeElement)
      if (escaped || !dialogClosed || !openerFocused)
        problems.push(`diálogo @ ${width}: foco-escapou=${escaped} fechou=${dialogClosed} foco-voltou=${openerFocused}`)
      await context.close()
    }
  } finally {
    await browser.close()
    server.kill()
  }
  console.log(`${checked} focos verificados.`)
  if (problems.length) {
    console.log(problems.join('\n'))
    process.exitCode = 1
  } else {
    console.log('Nenhum problema de teclado encontrado.')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
