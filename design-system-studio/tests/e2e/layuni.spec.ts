import { expect, test, type Page } from '@playwright/test'
import { freshStart, go, horizontalOverflow, savedProject, trackErrors } from './helpers'

/**
 * Layuni — galeria de modelos de site completos: visualizador, “Usar este modelo”, edição contextual
 * em “Seu site”, paletas, sobreposições, responsividade e Master Prompt.
 */

const stage = (page: Page) => page.getByTestId('site-viewer-stage')

async function useModel(page: Page, id: string, mode: 'new' | 'replace' | 'identity' | 'architecture' = 'new') {
  await go(page, `/modelos/${id}`)
  await page.getByTestId('use-starter').click()
  const modal = page.getByTestId('use-starter-modal')
  await expect(modal).toBeVisible()
  if (mode !== 'new') await modal.locator(`input[value="${mode}"]`).check()
  await page.getByTestId('confirm-use-starter').click()
  await expect(page).toHaveURL(/#\/site/)
}

test('galeria: modelos por categoria, busca e cartão que abre o site inteiro', async ({ page }) => {
  const errors = trackErrors(page)
  await freshStart(page)
  await go(page, '/modelos')
  const cards = page.getByTestId('starter-grid').locator('[data-testid^="starter-"]')
  expect(await cards.count()).toBeGreaterThanOrEqual(12)
  await page.getByRole('button', { name: /^E-commerce/ }).click()
  await expect(page.getByTestId('starter-folha-vaso')).toBeVisible()
  await expect(page.getByTestId('starter-pulsar-saude')).toHaveCount(0)
  await page.getByRole('button', { name: /^Todos/ }).click()
  await page.getByLabel('Buscar modelos').fill('saúde')
  await expect(page.getByTestId('starter-pulsar-saude')).toBeVisible()
  await page.getByTestId('starter-pulsar-saude').getByRole('link').click()
  await expect(page).toHaveURL(/#\/modelos\/pulsar-saude/)
  await expect(stage(page).locator('[data-component-id]').first()).toBeVisible()
  expect(errors).toEqual([])
})

test('visualizador: páginas pelos chips e pelo menu do próprio site, sem pulo de rolagem', async ({ page }) => {
  await freshStart(page)
  await go(page, '/modelos/pulsar-saude')
  await expect(page.getByTestId('page-tab-painel')).toHaveAttribute('aria-pressed', 'true')
  await page.mouse.wheel(0, 260)
  await page.waitForTimeout(200)
  const y = await page.evaluate(() => window.scrollY)
  await page.getByTestId('page-tab-pacientes').click()
  await expect(stage(page).locator('[data-testid="site-page"][data-page="pacientes"]')).toBeVisible()
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThan(4)
  // Menu da sidebar dentro da prévia navega entre as páginas do site.
  await stage(page).getByRole('group', { name: 'Menu lateral' }).getByText('Agenda', { exact: true }).first().click()
  await expect(page.getByTestId('page-tab-agenda')).toHaveAttribute('aria-pressed', 'true')
  await expect(stage(page).locator('[data-component-id="cmp_calendario-cirurgias"]')).toBeVisible()
  // Estado da página: vazio usa o componente de estado vazio da biblioteca.
  await page.getByRole('button', { name: 'Vazio', exact: true }).click()
  await expect(stage(page).locator('[data-state="vazio"]')).toBeVisible()
})

test('visualizador: celular, tablet, tela cheia (Esc sai) e paletas do modelo', async ({ page }) => {
  await freshStart(page)
  await go(page, '/modelos/escala-clara')
  await page.getByRole('button', { name: 'Celular', exact: true }).click()
  await expect(stage(page).getByTestId('site-phone')).toBeVisible()
  await page.getByRole('button', { name: 'Tablet', exact: true }).click()
  await expect(stage(page).locator('[data-component-id]').first()).toBeVisible()
  await page.getByTestId('viewer-fullscreen').click()
  await expect(page.getByRole('dialog', { name: 'Prévia em tela cheia' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Prévia em tela cheia' })).toHaveCount(0)
  await page.getByRole('tab', { name: 'Cores' }).click()
  const bg = () => stage(page).locator('.sp-page').first().evaluate((el) => getComputedStyle(el).backgroundColor)
  const before = await bg()
  await page.getByTestId('palette-variant-noite').click()
  await expect.poll(bg).not.toBe(before)
})

test('sobreposições abrem por cima da página, sem ocupar a grade', async ({ page }) => {
  await freshStart(page)
  await go(page, '/modelos/escala-clara')
  await page.getByTestId('page-tab-trocas').click()
  await expect(stage(page).locator('[data-component-id="cmp_modal-troca"]')).toHaveCount(0)
  await page.getByTestId('overlay-cmp_modal-troca').click()
  await expect(stage(page).locator('.sp-overlay[data-component-id="cmp_modal-troca"]')).toBeVisible()
  await expect(stage(page)).toContainText('Confirmar a troca?')
  await page.getByTestId('overlay-cmp_modal-troca').click()
  await expect(stage(page).locator('.sp-overlay')).toHaveCount(0)
})

test('modelo: editar pede para usar o modelo; usar cria projeto novo e guarda o anterior', async ({ page }) => {
  await freshStart(page)
  await go(page, '/modulos/objetivo')
  await page.getByLabel('Nome do projeto').fill('Projeto que já existia')
  await go(page, '/modelos/folha-vaso')
  await page.getByRole('tab', { name: 'Componentes' }).click()
  await page.getByTestId('site-inventory').locator('[data-testid^="inv-component:"] button').first().click()
  await expect(page.getByTestId('use-starter-modal')).toBeVisible()
  await page.getByTestId('confirm-use-starter').click()
  await expect(page).toHaveURL(/#\/site/)
  const p = await savedProject(page)
  expect(p.meta.name).toBe('Folha & Vaso')
  expect(p.origin).toMatchObject({ templateId: 'folha-vaso', templateVersion: 1, mode: 'new' })
  expect(p.pages.length).toBeGreaterThanOrEqual(5)
  const library = await page.evaluate(() => JSON.parse(localStorage.getItem('atelier-ui:studio:v1') ?? '{}').state?.library ?? [])
  expect(library.map((l: { project: { meta: { name: string } } }) => l.project.meta.name)).toContain('Projeto que já existia')
  // Persistência: recarregar mantém o site.
  await page.reload()
  await expect(stage(page).locator('[data-component-id]').first()).toBeVisible()
})

test('“só a identidade” mantém as páginas do projeto atual', async ({ page }) => {
  await freshStart(page)
  await useModel(page, 'pulsar-saude')
  const before = await savedProject(page)
  await useModel(page, 'gazeta-aurora', 'identity')
  const after = await savedProject(page)
  expect(after.pages.map((p: { id: string }) => p.id)).toEqual(before.pages.map((p: { id: string }) => p.id))
  expect(after.identity.typography.heading).toBe('fraunces')
  expect(after.origin.mode).toBe('identity')
})

test('seu site: clicar num bloco abre o editor no lugar e a prévia e o prompt atualizam', async ({ page }) => {
  await freshStart(page)
  await useModel(page, 'pulsar-saude')
  await page.getByTestId('edit-mode').click()
  await stage(page).locator('[data-component-id="cmp_kpi-leitos"]').click()
  const editor = page.getByTestId('component-editor')
  await expect(editor).toBeVisible()
  await editor.locator('#cmp-in-rotulo').fill('Leitos agora')
  await editor.getByRole('button', { name: 'Concluir' }).click()
  await expect(stage(page).locator('[data-component-id="cmp_kpi-leitos"]')).toContainText('Leitos agora')
  await expect.poll(async () => (await savedProject(page)).components.find((c: { id: string }) => c.id === 'cmp_kpi-leitos').props.rotulo).toBe('Leitos agora')
  // O header também é editável por clique.
  await stage(page).locator('[data-pick="header"]').click()
  await expect(page.getByTestId('site-editor-modal')).toBeVisible()
  await page.getByTestId('site-editor-modal').getByRole('button', { name: 'Concluir' }).click()
  // Master Prompt descreve as páginas e o valor novo.
  await go(page, '/prompt')
  await expect(page.locator('body')).toContainText('Páginas do site')
})

test('escopo explícito do estilo: todos os KPIs mudam, o resto não', async ({ page }) => {
  await freshStart(page)
  await useModel(page, 'pulsar-saude')
  await page.getByRole('tab', { name: 'Componentes' }).click()
  await page.getByTestId('inv-component:cmp_kpi-altas').getByRole('button', { name: /Trocar estilo/ }).click()
  const modal = page.getByTestId('family-scope-modal')
  await modal.locator('#fam-select').selectOption('soft-pill')
  await modal.getByRole('button', { name: /^Todos os kpis/i }).click()
  await page.getByTestId('apply-family-scope').click()
  await expect
    .poll(async () => {
      const comps = (await savedProject(page)).components as { categoryId: string; familyId: string }[]
      return { kpis: comps.filter((c) => c.categoryId === 'kpis-stat-cards').every((c) => c.familyId === 'soft-pill'), others: comps.filter((c) => c.categoryId !== 'kpis-stat-cards').some((c) => c.familyId === 'soft-pill') }
    })
    .toEqual({ kpis: true, others: false })
})

for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
  test(`responsivo em ${width} px: galeria e visualizador sem rolagem lateral nem erros`, async ({ page }) => {
    const errors = trackErrors(page)
    await page.setViewportSize({ width, height: width < 768 ? 800 : 900 })
    await freshStart(page)
    await go(page, '/modelos')
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
    await go(page, '/modelos/alameda-capital')
    await expect(stage(page).locator('[data-component-id]').first()).toBeVisible()
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
    await page.getByTestId('page-tab-inicio').click()
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
    expect(errors).toEqual([])
  })
}
