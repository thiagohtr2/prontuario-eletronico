#!/usr/bin/env node
/**
 * Teste de responsividade em navegador real (Chromium via Playwright).
 *
 * Uso:
 *   npm run qa:build                      # build apontando para o Supabase simulado
 *   node scripts/qa/responsive.cjs        # sobe o preview, mede e gera o relatório
 *
 * Para cada página e largura, mede no DOM real:
 *   - overflow horizontal do documento (scrollWidth > clientWidth);
 *   - elementos fora do viewport;
 *   - alvos de toque menores que 44×44 px;
 *   - controles distintos a menos de 8 px um do outro, ou sobrepostos;
 *   - texto truncado ou cortado;
 *   - conteúdo coberto pelo dock flutuante no fim da rolagem.
 *
 * Requer Playwright com Chromium instalado (npx playwright install chromium).
 */
const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const { installSupabaseMock } = require('./mock-supabase.cjs')

const ROOT = path.resolve(__dirname, '../..')
const PORT = Number(process.env.QA_PORT ?? 4317)
const BASE = `http://127.0.0.1:${PORT}`
const OUT = process.env.QA_OUT ?? path.join(ROOT, 'qa-output')
const SHOTS = path.join(OUT, 'screens')
const SHOT_WIDTHS = new Set((process.env.QA_SHOT_WIDTHS ?? '320,390,768,1024,1440').split(',').map(Number))

const VIEWPORTS = [
  ...[320, 344, 360, 375, 390, 412, 430, 480, 600].map((width) => ({ name: `${width}`, width, height: 780 })),
  { name: '640 (1280 @ 200%)', width: 640, height: 450 },
  ...[768, 820, 1024, 1280, 1440, 1920].map((width) => ({ name: `${width}`, width, height: 900 })),
  { name: '568×320 paisagem', width: 568, height: 320 },
  { name: '844×390 paisagem', width: 844, height: 390 },
]

const ALL_PAGES = [
  { id: 'landing', path: '/', auth: false },
  { id: 'entrar', path: '/entrar', auth: false },
  { id: 'cadastro', path: '/cadastro', auth: false },
  { id: 'recuperar', path: '/recuperar-senha', auth: false },
  { id: 'redefinir-invalido', path: '/redefinir-senha', auth: false },
  { id: 'inicio', path: '/inicio', auth: true },
  { id: 'pacientes', path: '/pacientes', auth: true },
  { id: 'prontuario', path: '/pacientes/p1', auth: true },
  { id: 'atendimentos', path: '/atendimentos', auth: true },
  { id: 'nova-evolucao', path: '/atendimentos/novo', auth: true },
  { id: 'editar-atendimento', path: '/atendimentos/e1/editar', auth: true },
  { id: 'clinicas', path: '/clinicas', auth: true },
  { id: 'configuracoes', path: '/configuracoes', auth: true },
  { id: 'redefinir-senha', path: '/redefinir-senha', auth: true },
  // Estados
  { id: 'entrar-erros-campo', path: '/entrar', auth: false, action: 'submitEmpty' },
  { id: 'entrar-erro-servidor', path: '/entrar', auth: false, action: 'submitWrongPassword' },
  { id: 'cadastro-sucesso', path: '/cadastro', auth: false, action: 'submitSignup' },
  { id: 'inicio-menu-aberto', path: '/inicio', auth: true, action: 'openUserMenu' },
  { id: 'pacientes-modal-aberto', path: '/pacientes', auth: true, action: 'openPatientModal' },
  { id: 'prontuario-excluir-aberto', path: '/pacientes/p1', auth: true, action: 'openDeleteDialog' },
  { id: 'prontuario-receita-aberta', path: '/pacientes/p1', auth: true, action: 'openPrescription' },
  { id: 'configuracoes-modelo-aberto', path: '/configuracoes', auth: true, action: 'openSample' },
  { id: 'clinicas-form-aberto', path: '/clinicas', auth: true, action: 'openClinicForm' },
  { id: 'inicio-vazio', path: '/inicio', auth: true, empty: true },
  { id: 'pacientes-vazio', path: '/pacientes', auth: true, empty: true },
  { id: 'inicio-carregando', path: '/inicio', auth: true, latencyMs: 4000, noWait: true },
]

// Filtros opcionais: QA_WIDTHS=320,1440 QA_PAGES=landing,inicio
const onlyWidths = process.env.QA_WIDTHS?.split(',').map(Number)
const onlyPages = process.env.QA_PAGES?.split(',')
const PAGES = onlyPages ? ALL_PAGES.filter((spec) => onlyPages.includes(spec.id)) : ALL_PAGES
const RUN_VIEWPORTS = onlyWidths ? VIEWPORTS.filter((viewport) => onlyWidths.includes(viewport.width)) : VIEWPORTS

const actions = {
  async submitEmpty(page) {
    await page.getByRole('button', { name: 'Entrar', exact: true }).last().click()
  },
  async submitWrongPassword(page) {
    await page.locator('#auth-email').fill('ana@exemplo.com')
    await page.locator('#auth-password').fill('senha-incorreta')
    await page.getByRole('button', { name: 'Entrar', exact: true }).last().click()
    await page.getByRole('alert').first().waitFor()
  },
  async submitSignup(page) {
    await page.locator('#auth-nome').fill('Dra. Ana Souza')
    await page.locator('#auth-email').fill('ana.souza@exemplo.com.br')
    await page.locator('#auth-password').fill('senha-forte-123')
    await page.getByRole('button', { name: 'Criar conta', exact: true }).last().click()
    await page.getByText('Confirme seu e-mail').waitFor()
  },
  async openUserMenu(page) {
    const button = page.getByRole('button', { name: /menu da conta/i }).filter({ visible: true }).first()
    await button.click()
    await page.getByRole('menu').waitFor()
  },
  async openPatientModal(page) {
    await page.getByRole('button', { name: 'Novo paciente' }).click()
    await page.getByRole('dialog').waitFor()
  },
  async openPrescription(page) {
    await page.getByRole('button', { name: 'Receita' }).first().click()
    await page.getByRole('dialog').getByRole('button', { name: 'Baixar PDF' }).and(page.locator(':enabled')).waitFor({ timeout: 30000 })
  },
  async openSample(page) {
    await page.getByRole('button', { name: 'Ver modelo da receita' }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Baixar PDF' }).and(page.locator(':enabled')).waitFor({ timeout: 30000 })
  },
  async openClinicForm(page) {
    await page.getByRole('button', { name: 'Nova clínica' }).click()
    await page.getByRole('dialog').waitFor()
  },
  async openDeleteDialog(page) {
    await page.getByRole('button', { name: 'Excluir paciente' }).click()
    await page.getByRole('dialog').waitFor()
  },
}

/** Executado dentro da página: coleta as medições. */
function measure() {
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const issues = []
  const describe = (el) => {
    const label = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ')
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} "${label.slice(0, 40)}"`
  }
  const isRendered = (el) => {
    const style = getComputedStyle(el)
    if (style.visibility === 'hidden' || style.display === 'none') return false
    if (style.clip === 'rect(0px, 0px, 0px, 0px)') return false // sr-only
    const rect = el.getBoundingClientRect()
    if (rect.width < 2 && rect.height < 2) return false // sr-only
    return el.checkVisibility ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : true
  }
  const clippedByScroller = (el) => {
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
      const ox = getComputedStyle(node).overflowX
      if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') return true
    }
    return false
  }

  // 1. Overflow do documento
  const scrollWidth = document.documentElement.scrollWidth
  if (scrollWidth > vw + 1) issues.push({ type: 'overflow-documento', detail: `scrollWidth ${scrollWidth} > clientWidth ${vw}` })

  // 2. Elementos fora do viewport
  for (const el of document.body.querySelectorAll('*')) {
    if (!isRendered(el)) continue
    const rect = el.getBoundingClientRect()
    if ((rect.right > vw + 1 || rect.left < -1) && !clippedByScroller(el)) {
      issues.push({ type: 'fora-do-viewport', detail: `${describe(el)} left ${Math.round(rect.left)} right ${Math.round(rect.right)}` })
    }
  }

  // Com um diálogo aberto, o resto da página fica sob o overlay e não conta.
  const dialog = document.querySelector('[role=dialog]')
  const scope = dialog ?? document
  // Área realmente visível: recortada pelos containers com rolagem própria.
  const visibleRect = (el) => {
    let { left, top, right, bottom } = el.getBoundingClientRect()
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
      const style = getComputedStyle(node)
      if (/(auto|scroll|hidden|clip)/.test(style.overflowY + style.overflowX)) {
        const r = node.getBoundingClientRect()
        left = Math.max(left, r.left); top = Math.max(top, r.top)
        right = Math.min(right, r.right); bottom = Math.min(bottom, r.bottom)
      }
    }
    return { left, top, right, bottom, width: right - left, height: bottom - top }
  }

  // 3. Alvos de toque
  const interactive = Array.from(
    scope.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role="tab"], [role="menuitem"]'),
  ).filter((el) => isRendered(el) && !el.hidden)
  const inlineLinks = []
  for (const el of interactive) {
    const rect = el.getBoundingClientRect()
    if (rect.width < 43.5 || rect.height < 43.5) {
      const inline = el.tagName === 'A' && el.closest('p, li > span, dd') && getComputedStyle(el).display === 'inline'
      if (inline) inlineLinks.push(describe(el))
      else issues.push({ type: 'alvo-pequeno', detail: `${describe(el)} ${Math.round(rect.width)}×${Math.round(rect.height)}` })
    }
  }

  // 4. Distância entre controles distintos
  const rects = interactive
    .map((el) => ({ el, rect: visibleRect(el) }))
    .filter(({ rect }) => rect.width > 0 && rect.height > 0)
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i]
      const b = rects[j]
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue
      // Partes de um mesmo controle: opções de um segmented control e
      // botões sobrepostos ao próprio campo (mostrar senha, limpar busca).
      const sameTablist = a.el.closest('[role=tablist]') && a.el.closest('[role=tablist]') === b.el.closest('[role=tablist]')
      const overlay = a.el.parentElement === b.el.parentElement && (a.el.tagName === 'INPUT' || b.el.tagName === 'INPUT')
      if (sameTablist || overlay) continue
      const dx = Math.max(0, Math.max(a.rect.left, b.rect.left) - Math.min(a.rect.right, b.rect.right))
      const dy = Math.max(0, Math.max(a.rect.top, b.rect.top) - Math.min(a.rect.bottom, b.rect.bottom))
      const overlapX = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left)
      const overlapY = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top)
      // Elementos fixos/sticky (header, dock) se sobrepõem ao conteúdo rolável
      // por definição; essa cobertura é medida no item 6.
      const layer = (el) => (el.closest('.app-dock, .app-header, header.sticky, [role=dialog], [role=menu]') ? 'top' : 'flow')
      if (layer(a.el) !== layer(b.el)) continue
      if (overlapX > 1 && overlapY > 1) {
        issues.push({ type: 'sobreposicao', detail: `${describe(a.el)} × ${describe(b.el)}` })
      } else if ((dx === 0 || dy === 0) && Math.max(dx, dy) < 7.5) {
        issues.push({ type: 'gap-menor-que-8', detail: `${describe(a.el)} ↔ ${describe(b.el)} = ${Math.max(dx, dy).toFixed(1)}px` })
      }
    }
  }

  // 5. Texto truncado ou cortado
  const truncated = []
  for (const el of document.querySelectorAll('.truncate, [class*="line-clamp"]')) {
    if (!isRendered(el)) continue
    if (el.scrollWidth > el.clientWidth + 1) truncated.push(`${describe(el)}`)
  }

  // Rótulos sem quebra (whitespace-nowrap) que não cabem no próprio controle.
  for (const el of document.querySelectorAll('.whitespace-nowrap')) {
    if (!isRendered(el) || !el.parentElement) continue
    const rect = el.getBoundingClientRect()
    const box = el.parentElement.getBoundingClientRect()
    if (rect.right > box.right + 1 || rect.left < box.left - 1) {
      issues.push({ type: 'rotulo-transborda', detail: `${describe(el)} ${Math.round(rect.width)}px em ${Math.round(box.width)}px` })
    }
  }

  // 6. Conteúdo coberto pelo dock (no fim da rolagem)
  const dock = document.querySelector('.app-dock')
  let dockCover = null
  if (dock && isRendered(dock) && !dialog) {
    window.scrollTo(0, document.documentElement.scrollHeight)
    const dockTop = dock.getBoundingClientRect().top
    const main = document.querySelector('main')
    const items = Array.from(main.querySelectorAll('a[href], button, input, select, textarea, p, h1, h2, h3, li')).filter(isRendered)
    const lowest = items.reduce((max, el) => Math.max(max, el.getBoundingClientRect().bottom), 0)
    dockCover = { dockTop: Math.round(dockTop), lowestContent: Math.round(lowest) }
    if (lowest > dockTop + 1) issues.push({ type: 'coberto-pelo-dock', detail: `conteúdo termina em ${Math.round(lowest)}, dock começa em ${Math.round(dockTop)}` })
    window.scrollTo(0, 0)
  }

  return { vw, vh, scrollWidth, issues, inlineLinks, truncated, dockCover, controls: interactive.length }
}

function startPreview() {
  const child = spawn(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--outDir', 'dist-qa', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('vite preview não subiu')), 30000)
    child.stdout.on('data', (chunk) => {
      if (String(chunk).includes(String(PORT))) {
        clearTimeout(timer)
        resolve(child)
      }
    })
    child.stderr.on('data', (chunk) => process.stderr.write(chunk))
  })
}

async function main() {
  if (!fs.existsSync(path.join(ROOT, 'dist-qa', 'index.html'))) {
    console.error('Rode antes: npm run qa:build')
    process.exit(1)
  }
  fs.mkdirSync(SHOTS, { recursive: true })
  const server = await startPreview()
  const browser = await chromium.launch()
  const results = []
  const consoleErrors = []

  try {
    for (const viewport of RUN_VIEWPORTS) {
      for (const spec of PAGES) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: 1,
          hasTouch: viewport.width < 1024,
          isMobile: false,
          locale: 'pt-BR',
          reducedMotion: 'reduce',
        })
        const page = await context.newPage()
        page.on('console', (message) => {
          if (message.type() === 'error') consoleErrors.push(`${spec.id} @ ${viewport.name}: ${message.text()}`)
        })
        page.on('pageerror', (error) => consoleErrors.push(`${spec.id} @ ${viewport.name}: ${error.message}`))
        await installSupabaseMock(page, { authenticated: spec.auth, empty: spec.empty, latencyMs: spec.latencyMs })
        await page.goto(BASE + spec.path, { waitUntil: 'domcontentloaded' })
        if (!spec.noWait) {
          await page.waitForLoadState('networkidle')
          await page.waitForFunction(() => !document.querySelector('[role=status] .animate-spin'), null, { timeout: 8000 }).catch(() => {})
        } else {
          await page.waitForTimeout(500)
        }
        await page.evaluate(() => document.fonts.ready)
        let actionError = null
        if (spec.action) {
          try {
            await actions[spec.action](page)
            await page.waitForTimeout(150)
          } catch (error) {
            actionError = error.message.split('\n')[0]
          }
        }
        const data = await page.evaluate(measure)
        if (actionError) data.issues.push({ type: 'acao-falhou', detail: actionError })
        results.push({ page: spec.id, path: spec.path, viewport: viewport.name, width: viewport.width, height: viewport.height, ...data })
        if (SHOT_WIDTHS.has(viewport.width) && viewport.height !== 320 && viewport.height !== 390 && viewport.height !== 450) {
          await page.screenshot({ path: path.join(SHOTS, `${spec.id}-${viewport.width}.png`), fullPage: !spec.action })
          // Elementos fixos (dock) aparecem fora do lugar na captura de página inteira.
          if (viewport.width < 768 && !spec.action) {
            await page.screenshot({ path: path.join(SHOTS, `${spec.id}-${viewport.width}-tela.png`) })
          }
        }
        if (viewport.height <= 450) {
          await page.screenshot({ path: path.join(SHOTS, `${spec.id}-${viewport.width}x${viewport.height}.png`) })
        }
        await context.close()
      }
      process.stdout.write(`✓ ${viewport.name}\n`)
    }
  } finally {
    await browser.close()
    server.kill()
  }

  // QA_MERGE=1 atualiza só as combinações medidas agora num results.json existente.
  const file = path.join(OUT, 'results.json')
  if (process.env.QA_MERGE && fs.existsSync(file)) {
    const previous = JSON.parse(fs.readFileSync(file, 'utf8'))
    const key = (r) => `${r.page}|${r.viewport}`
    const fresh = new Set(results.map(key))
    const merged = previous.results.filter((r) => !fresh.has(key(r))).concat(results)
    const ran = new Set(results.map((r) => `${r.page} @ ${r.viewport}`))
    const errors = previous.consoleErrors.filter((e) => !ran.has(e.split(':')[0])).concat(consoleErrors)
    fs.writeFileSync(file, JSON.stringify({ results: merged, consoleErrors: errors }, null, 2))
  } else {
    fs.writeFileSync(file, JSON.stringify({ results, consoleErrors }, null, 2))
  }
  const failing = results.filter((r) => r.issues.length > 0)
  console.log(`\n${results.length} combinações medidas, ${failing.length} com problemas, ${consoleErrors.length} erros de console.`)
  for (const r of failing) {
    console.log(`\n✗ ${r.page} @ ${r.viewport}`)
    for (const issue of r.issues.slice(0, 12)) console.log(`   - ${issue.type}: ${issue.detail}`)
    if (r.issues.length > 12) console.log(`   … +${r.issues.length - 12}`)
  }
  const truncatedAll = results.filter((r) => r.truncated.length)
  if (truncatedAll.length) {
    console.log('\nTexto truncado (verificar se é conteúdo secundário):')
    for (const r of truncatedAll) console.log(`   ${r.page} @ ${r.viewport}: ${r.truncated.join('; ')}`)
  }
  if (consoleErrors.length) console.log('\nErros de console:\n   ' + [...new Set(consoleErrors)].slice(0, 20).join('\n   '))
  process.exitCode = failing.length > 0 ? 1 : 0
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
