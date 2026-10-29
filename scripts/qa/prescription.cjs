#!/usr/bin/env node
/**
 * Fluxo da receita em navegador real, com o Supabase simulado:
 *   1. Configurações: envia uma logomarca (SVG), troca cor e papel, abre o
 *      modelo e baixa o PDF.
 *   2. Prontuário: abre a receita de um atendimento salvo e baixa o PDF.
 *   3. Nova evolução: adiciona um medicamento e gera a receita antes de salvar.
 * Os PDFs baixados ficam em qa-output/receitas, com uma imagem PNG de cada
 * página quando o pdftoppm está instalado.
 *
 * Uso: npm run qa:build && node scripts/qa/prescription.cjs
 */
const { chromium } = require('playwright')
const { spawn, spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const { installSupabaseMock } = require('./mock-supabase.cjs')

const ROOT = path.resolve(__dirname, '../..')
const PORT = Number(process.env.QA_PORT ?? 4321)
const BASE = `http://127.0.0.1:${PORT}`
const OUT = path.join(process.env.QA_OUT ?? path.join(ROOT, 'qa-output'), 'receitas')

// Logomarca de teste só com formas (SVG em <img> não carrega fontes).
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <circle cx="200" cy="200" r="180" fill="none" stroke="#9a4562" stroke-width="10"/>
  <g fill="#9a4562" opacity="0.9">
    <ellipse cx="200" cy="130" rx="38" ry="80"/>
    <ellipse cx="200" cy="130" rx="38" ry="80" transform="rotate(72 200 200)"/>
    <ellipse cx="200" cy="130" rx="38" ry="80" transform="rotate(144 200 200)"/>
    <ellipse cx="200" cy="130" rx="38" ry="80" transform="rotate(216 200 200)"/>
    <ellipse cx="200" cy="130" rx="38" ry="80" transform="rotate(288 200 200)"/>
  </g>
  <circle cx="200" cy="200" r="34" fill="#fff"/>
</svg>`

async function download(page, trigger, name) {
  const [file] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), trigger()])
  const target = path.join(OUT, name)
  await file.saveAs(target)
  const png = spawnSync('pdftoppm', ['-r', '90', '-png', target, target.replace(/\.pdf$/, '')])
  return { target, suggested: file.suggestedFilename(), rasterized: png.status === 0 }
}

async function waitReady(page) {
  await page.getByRole('dialog').getByRole('button', { name: 'Baixar PDF' }).and(page.locator(':enabled')).waitFor({ timeout: 30000 })
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  const logoPath = path.join(OUT, 'logo-teste.svg')
  fs.writeFileSync(logoPath, LOGO_SVG)

  const server = spawn(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--outDir', 'dist-qa', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' })
  await new Promise((resolve) => setTimeout(resolve, 2500))
  const browser = await chromium.launch()
  const results = []
  const errors = []

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, locale: 'pt-BR' })
    const page = await context.newPage()
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
    await installSupabaseMock(page, { authenticated: true })

    // 1. Configurações → modelo
    await page.goto(BASE + '/configuracoes', { waitUntil: 'networkidle' })
    await page.locator('input[type=file]').setInputFiles(logoPath)
    await page.getByRole('img', { name: 'Sua logomarca' }).waitFor({ timeout: 10000 }).catch(async (error) => {
      const message = await page.locator('.field-error').allTextContents()
      throw new Error(`Logomarca não apareceu: ${message.join(' ') || error.message}`)
    })
    await page.getByText('Rosé antigo').click()
    await page.getByText('Meia folha, 148 × 210 mm').click()
    await page.screenshot({ path: path.join(OUT, 'configuracoes-1440.png'), fullPage: true })
    await page.getByRole('button', { name: 'Ver modelo da receita' }).click()
    await waitReady(page)
    await page.screenshot({ path: path.join(OUT, 'modelo-dialogo-1440.png') })
    results.push(['modelo (perfil, A5, rosé, logomarca)', await download(page, () => page.getByRole('button', { name: 'Baixar PDF' }).click(), 'modelo-a5.pdf')])
    await page.keyboard.press('Escape')

    // 2. Prontuário → receita de atendimento salvo
    await page.goto(BASE + '/pacientes/p1', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Receita' }).first().click()
    await waitReady(page)
    results.push(['prontuário (atendimento salvo, A4)', await download(page, () => page.getByRole('button', { name: 'Baixar PDF' }).click(), 'prontuario.pdf')])
    await page.keyboard.press('Escape')

    // 3. Nova evolução → receita antes de salvar
    await page.goto(BASE + '/atendimentos/novo?paciente=p2', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Adicionar medicamento' }).click()
    await page.getByLabel('Medicamento e concentração').fill('Amoxicilina 500 mg, cápsula')
    await page.getByLabel('Quantidade').fill('21 cápsulas')
    await page.getByLabel('Como usar').fill('Tomar 1 cápsula de 8 em 8 horas, por 7 dias.')
    await page.getByLabel('Orientações da receita').fill('Tomar com água, longe das refeições.')
    await page.getByRole('button', { name: 'Gerar receita em PDF' }).click()
    await waitReady(page)
    results.push(['editor (antes de salvar, A4)', await download(page, () => page.getByRole('button', { name: 'Baixar PDF' }).click(), 'editor.pdf')])
    await context.close()

    // Celular: diálogo mostra resumo no lugar da pré-visualização
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true, locale: 'pt-BR', hasTouch: true })
    const phone = await mobile.newPage()
    await installSupabaseMock(phone, { authenticated: true })
    await phone.goto(BASE + '/pacientes/p1', { waitUntil: 'networkidle' })
    await phone.getByRole('button', { name: 'Receita' }).first().click()
    await waitReady(phone)
    await phone.screenshot({ path: path.join(OUT, 'dialogo-390.png') })
    await phone.keyboard.press('Escape')
    await phone.goto(BASE + '/atendimentos/e1/editar', { waitUntil: 'networkidle' })
    await phone.getByRole('heading', { name: 'Receita' }).scrollIntoViewIfNeeded()
    await phone.screenshot({ path: path.join(OUT, 'editor-receita-390.png'), fullPage: true })
    await phone.goto(BASE + '/configuracoes', { waitUntil: 'networkidle' })
    await phone.screenshot({ path: path.join(OUT, 'configuracoes-390.png'), fullPage: true })
    await mobile.close()
  } finally {
    await browser.close()
    server.kill()
  }

  for (const [label, result] of results) {
    console.log(`✓ ${label}: ${path.relative(ROOT, result.target)} (nome sugerido: ${result.suggested})${result.rasterized ? '' : ' — sem pdftoppm'}`)
  }
  if (errors.length) {
    console.log('Erros de console:\n  ' + [...new Set(errors)].join('\n  '))
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
