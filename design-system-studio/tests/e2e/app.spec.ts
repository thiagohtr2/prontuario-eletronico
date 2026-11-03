import { expect, test } from '@playwright/test'
import { freshStart, go, horizontalOverflow, ROUTES, trackErrors } from './helpers'

test.describe('Abertura e integridade', () => {
  test('a tela inicial abre sem erros de JavaScript', async ({ page }) => {
    const errors = trackErrors(page)
    await freshStart(page)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Do site que você imagina')
    await expect(page.getByTestId('start-guided')).toBeVisible()
    await expect(page.getByTestId('start-free')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('todas as rotas abrem sem erros', async ({ page }) => {
    const errors = trackErrors(page)
    await freshStart(page)
    for (const route of ROUTES) {
      await go(page, route)
      await expect(page.locator('main#conteudo')).toBeVisible()
      await expect(page.locator('main#conteudo h1').first(), route).toBeVisible()
    }
    expect(errors).toEqual([])
  })
})

test.describe('Responsividade do Studio', () => {
  const widths = [320, 375, 768, 1024, 1440]
  for (const width of widths) {
    test(`sem overflow horizontal em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await freshStart(page)
      for (const route of ROUTES) {
        await go(page, route)
        expect(await horizontalOverflow(page), `${route} @ ${width}px`).toBeLessThanOrEqual(0)
      }
    })
  }
})

test.describe('Navegação do Studio', () => {
  test('no celular, o menu abre como drawer, navega e fecha com Esc', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await freshStart(page)
    const sidebar = page.locator('#studio-sidebar')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(sidebar).toHaveAttribute('data-open', 'true')
    await sidebar.getByRole('link', { name: 'Cores e identidade' }).click()
    await expect(page).toHaveURL(/#\/modulos\/cores/)
    await expect(sidebar).toHaveAttribute('data-open', 'false')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await page.keyboard.press('Escape')
    await expect(sidebar).toHaveAttribute('data-open', 'false')
  })

  test('busca de funcionalidades com Ctrl+K e teclado', async ({ page }) => {
    await freshStart(page)
    await page.keyboard.press('Control+k')
    const dialog = page.getByTestId('feature-search')
    await expect(dialog).toBeVisible()
    await page.keyboard.type('paleta')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#\/modulos\/cores/)
  })

  test('grupos da sidebar podem ser recolhidos', async ({ page }) => {
    await freshStart(page)
    const toggle = page.getByRole('button', { name: 'Identidade' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#studio-sidebar').getByRole('link', { name: 'Cores e identidade' })).toHaveCount(0)
  })
})
