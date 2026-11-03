import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { freshStart, go, savedProject } from './helpers'

/** Versão 5.0: fidelidade do site construído, comparação de versões e projetos nomeados. */

const runner = readFileSync(resolve(process.cwd(), 'tools/validation-runner/runner.py'), 'utf8')
const FIDELITY_JS = runner.match(/FIDELITY_JS = r"""([\s\S]*?)"""/)![1]

const expectations = {
  brand: 'Escala Viva',
  navItems: ['Visão geral', 'Turnos', 'Equipe', 'Relatórios'],
  headerHeight: 64,
  sidebarWidth: 252,
  bottomSlots: 4,
  drawer: false,
  fonts: { heading: 'Georgia', body: 'Arial' },
  primary: '#0b6e4f',
}

/** Site de teste fiel à especificação (header 64, sidebar 252, barra inferior no celular). */
const faithful = `<!doctype html><html><head><style>
  body { margin: 0; font-family: Arial, sans-serif; }
  h1 { font-family: Georgia, serif; }
  header { position: sticky; top: 0; height: 64px; margin-left: 252px; display: flex; align-items: center; }
  aside { position: fixed; left: 0; top: 0; bottom: 0; width: 252px; }
  aside a { display: block; }
  .cta { background: #0b6e4f; color: #fff; }
  .bottom { display: none; }
  .brand-m { display: none; }
  @media (max-width: 767px) {
    aside { display: none; } header { margin-left: 0; } .brand-m { display: inline; }
    .bottom { display: flex; position: fixed; left: 0; right: 0; bottom: 0; height: 64px; }
  }
</style></head><body>
  <aside><strong>Escala Viva</strong><nav><a href="#">Visão geral</a><a href="#">Turnos</a><a href="#">Equipe</a><a href="#">Relatórios</a></nav></aside>
  <header><span class="brand-m">Escala Viva</span><h1>Visão geral</h1><button class="cta">Novo turno</button></header>
  <nav class="bottom"><a href="#">Visão geral</a><a href="#">Turnos</a><a href="#">Equipe</a><a href="#">Mais</a></nav>
</body></html>`

/** Mesmo site com desvios: header de 80 px, sidebar de 300 px, outra fonte e sem barra inferior. */
const unfaithful = faithful
  .replace('height: 64px; margin-left: 252px', 'height: 80px; margin-left: 300px')
  .replace('width: 252px;', 'width: 300px;')
  .replace('font-family: Arial, sans-serif;', 'font-family: Verdana, sans-serif;')
  .replace(".bottom { display: flex; position: fixed; left: 0; right: 0; bottom: 0; height: 64px; }", '')

async function check(page: import('@playwright/test').Page, html: string) {
  const results: { id: string; ok: boolean; measured: string }[] = []
  for (const [phase, width] of [['desktop', 1280], ['mobile', 390]] as const) {
    await page.setViewportSize({ width, height: 800 })
    await page.setContent(html)
    results.push(...(await page.evaluate(`(${FIDELITY_JS})(${JSON.stringify({ ...expectations, phase })})`)) as typeof results)
  }
  // Um fato pode ser conferido nas duas larguras: só vale se conferir em todas.
  const byId: Record<string, { id: string; ok: boolean; measured: string }> = {}
  for (const r of results) byId[r.id] = byId[r.id] && !byId[r.id].ok ? byId[r.id] : r
  return byId
}

test.describe('Fidelidade à especificação (executor)', () => {
  test('site fiel: todos os fatos conferem', async ({ page }) => {
    const r = await check(page, faithful)
    for (const id of ['brand', 'nav-desktop', 'header-height', 'sidebar-width', 'font-body', 'font-heading', 'primary', 'bottom-nav', 'sidebar-hidden-mobile']) expect(r[id]?.ok, `${id}: ${r[id]?.measured}`).toBe(true)
  })

  test('site com desvios: medidas, fonte e navegação inferior não conferem', async ({ page }) => {
    const r = await check(page, unfaithful)
    expect(r['header-height']).toMatchObject({ ok: false, measured: '80 px' })
    expect(r['sidebar-width']).toMatchObject({ ok: false, measured: '300 px' })
    expect(r['font-body'].ok).toBe(false)
    expect(r['bottom-nav'].ok).toBe(false)
    expect(r['brand'].ok).toBe(true)
  })
})

test.describe('Telas da 5.0', () => {
  test('relatório com fidelidade aparece no Validation Lab', async ({ page }) => {
    await freshStart(page)
    await go(page, '/validacao')
    const report = {
      tool: 'atelier-ui-validation-runner/1.1',
      generatedAt: new Date().toISOString(),
      baseUrl: 'http://localhost:3000',
      widths: [390, 1280],
      pages: ['/'],
      issues: [],
      fidelity: [
        { id: 'header-height', label: 'Altura do header', width: 1280, expected: '64 px', measured: '80 px', ok: false },
        { id: 'brand', label: 'Marca do projeto visível', width: 1280, expected: '“Escala Viva”', measured: 'encontrada', ok: true },
      ],
    }
    await page.getByTestId('report-input').setInputFiles({ name: 'report.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(report)) })
    await expect(page.getByText('Fidelidade à especificação: 1 de 2 fatos conferem')).toBeVisible()
    await expect(page.getByTestId('fidelity-results')).toContainText('medido 80 px')
  })

  test('projetos nomeados e comparação de versões', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/objetivo')
    await page.getByTestId('project-name').fill('Primeiro projeto')
    await go(page, '/projeto')
    await page.getByLabel('Nome da versão').fill('Antes da paleta')
    await page.getByRole('button', { name: 'Salvar versão' }).click()
    await go(page, '/modulos/cores')
    await page.getByTestId('palette-option-floresta').locator('xpath=self::*[@aria-pressed] | .//*[@aria-pressed] | .//*[contains(@class, "ui-option__hit")]').first().click()
    await go(page, '/projeto')
    await page.getByRole('button', { name: 'Comparar com o atual' }).first().click()
    const modal = page.getByTestId('compare-modal')
    await expect(modal).toContainText('Paleta')
    await modal.getByRole('button', { name: 'Fechar' }).last().click()
    await page.getByTestId('new-project').click()
    await expect.poll(async () => (await savedProject(page)).meta.name).toBe('')
    await expect(page.getByTestId('project-library')).toContainText('Primeiro projeto')
    await page.getByTestId('project-library').getByRole('button', { name: 'Abrir' }).click()
    await expect.poll(async () => (await savedProject(page)).meta.name).toBe('Primeiro projeto')
  })
})
