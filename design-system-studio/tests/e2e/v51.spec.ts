import { expect, test } from '@playwright/test'
import { freshStart, go, savedProject } from './helpers'

/** Versão 5.1: refinamentos P2/P3 (acessibilidade, busca, importação, textos). */

test('busca entende plural/acento e encontra modelos pelo nome', async ({ page }) => {
  await freshStart(page)
  await page.keyboard.press('Control+k')
  const input = page.getByRole('combobox', { name: 'Buscar funcionalidades' })
  await input.fill('botão')
  await expect(page.locator('#search-results')).toContainText('Componentes')
  await input.fill('bottom navigation classica')
  await expect(page.locator('#search-results')).toContainText('Bottom Navigation clássica')
  await expect(input).toHaveAttribute('aria-activedescendant', 'search-opt-0')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#\/modulos\/mobile/)
})

test('abas seguem o padrão do teclado (setas e foco só na aba ativa)', async ({ page }) => {
  await freshStart(page)
  await go(page, '/modulos/cores')
  const tabs = page.getByRole('tablist').first()
  const active = tabs.getByRole('tab', { selected: true })
  await active.focus()
  await page.keyboard.press('ArrowRight')
  await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(tabs.getByRole('tab').nth(1)).toBeFocused()
  expect(await tabs.getByRole('tab').evaluateAll((els) => els.filter((e) => (e as HTMLElement).tabIndex === 0).length)).toBe(1)
})

test('título da aba acompanha a tela e #/livre ativa o modo livre', async ({ page }) => {
  await freshStart(page)
  await go(page, '/modulos/cores')
  await expect(page).toHaveTitle(/Cores e identidade · Atelier UI/)
  await go(page, '/livre')
  await expect.poll(async () => (await savedProject(page)).mode).toBe('free')
})

test('importação recusa token desconhecido e texto gigante com mensagem clara', async ({ page }) => {
  await freshStart(page)
  await go(page, '/modulos/objetivo')
  await page.getByTestId('project-name').fill('Base')
  await expect.poll(async () => (await savedProject(page))?.meta?.name).toBe('Base')
  await go(page, '/exportar')
  const base = (await savedProject(page)) as Record<string, unknown>
  const bad = structuredClone(base) as { identity: { overrides: Record<string, string> }; meta: { name: string } }
  bad.identity.overrides = { corInventada: '#123456' }
  await page.getByTestId('import-input').setInputFiles({ name: 'p.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(bad)) })
  await expect(page.getByText(/token desconhecido/)).toBeVisible()
  const big = structuredClone(base) as { meta: { name: string } }
  big.meta.name = 'x'.repeat(5000)
  await page.getByTestId('import-input').setInputFiles({ name: 'p2.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(big)) })
  await expect(page.getByText(/texto longo demais/)).toBeVisible()
})

test.describe('celular 390×844', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  test('menu lateral aberto é um diálogo com o foco dentro dele', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/cores')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    const sidebar = page.locator('#studio-sidebar')
    await expect(sidebar).toHaveAttribute('role', 'dialog')
    await expect.poll(() => sidebar.evaluate((el) => el.contains(document.activeElement))).toBe(true)
    for (let i = 0; i < 40; i++) await page.keyboard.press('Tab')
    expect(await sidebar.evaluate((el) => el.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(sidebar).toHaveAttribute('data-open', 'false')
  })
})

test('recomeçar do zero apaga projeto, versões, outros projetos e preferências', async ({ page }) => {
  await freshStart(page)
  await go(page, '/modulos/objetivo')
  await page.getByTestId('project-name').fill('Projeto antigo')
  await go(page, '/projeto')
  await page.getByLabel('Nome da versão').fill('v1')
  await page.getByRole('button', { name: 'Salvar versão' }).click()
  await page.getByRole('button', { name: 'Duplicar o atual' }).click()
  await page.evaluate(() => localStorage.setItem('atelier-ui:ui:collapsed-groups', '["identidade"]'))
  // Atalho da tela inicial abre a confirmação direto.
  await go(page, '/')
  await page.getByTestId('home-start-over').click()
  const modal = page.getByTestId('reset-everything-modal')
  await expect(modal).toContainText('1 versão(ões) salva(s)')
  await expect(modal).toContainText('1 outro(s) projeto(s)')
  await expect(page.getByTestId('confirm-reset-everything')).toBeDisabled()
  await page.getByText('Entendo que tudo será apagado e que não dá para desfazer').click()
  await expect(page.getByLabel('Entendo que tudo será apagado e que não dá para desfazer')).toBeChecked()
  await page.getByTestId('confirm-reset-everything').click()
  await expect(page).toHaveURL(/#\/$/)
  await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem('atelier-ui:studio:v1') ?? '{}').state)).toMatchObject({ history: [], library: [] })
  expect((await savedProject(page)).meta.name).toBe('')
  expect(await page.evaluate(() => localStorage.getItem('atelier-ui:ui:collapsed-groups'))).toBeNull()
  await expect(page.getByTestId('home-continue')).toHaveCount(0)
})
