import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { freshStart, go, savedProject } from './helpers'

test.describe('Color System e herança global', () => {
  test('selecionar paleta salva, marca o cartão e atualiza a prévia', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/cores')
    const card = page.getByTestId('palette-option-floresta')
    await card.getByRole('button', { pressed: false }).first().click()
    await expect(card).toHaveAttribute('data-selected', 'true')
    expect((await savedProject(page)).identity.paletteId).toBe('floresta')
    await expect(page.getByTestId('identity-preview')).toHaveCSS('background-color', 'rgb(246, 250, 246)')
  })

  test('trocar de paleta não desloca a rolagem', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/cores')
    const target = page.getByTestId('palette-option-noite-na-mata')
    // Alvo inteiro dentro da janela: assim o próprio Playwright não rola a página antes do clique.
    await target.locator('.ui-option__hit').evaluate((el) => el.scrollIntoView({ block: 'center' }))
    await page.mouse.wheel(0, -40)
    await page.waitForTimeout(150)
    const before = await page.evaluate(() => window.scrollY)
    expect(before).toBeGreaterThan(300)
    await target.locator('.ui-option__hit').click()
    await page.waitForTimeout(250)
    expect(await page.evaluate(() => window.scrollY)).toBe(before)
    await expect(target).toHaveAttribute('data-selected', 'true')
  })

  test('alterar um token individual entra nas exceções e pode ser restaurado', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/cores')
    await page.getByRole('tab', { name: 'Tokens e cores' }).click()
    const input = page.getByLabel('Hexadecimal de Cor primária')
    await input.fill('#ff3366')
    await input.press('Enter')
    expect((await savedProject(page)).identity.overrides.primary).toBe('#ff3366')
    await page.getByRole('button', { name: 'Voltar Cor primária para a paleta' }).click()
    expect((await savedProject(page)).identity.overrides.primary).toBeUndefined()
  })
})

test.describe('Persistência e modos', () => {
  test('escolhas permanecem após recarregar e são as mesmas no modo livre', async ({ page }) => {
    await freshStart(page)
    await go(page, '/guiado/objetivo')
    await page.getByTestId('project-type-dashboard').click()
    await page.getByTestId('project-name').fill('Painel Solar')
    await page.reload()
    await expect(page.getByTestId('project-name')).toHaveValue('Painel Solar')
    await expect(page.getByTestId('project-type-dashboard')).toHaveAttribute('aria-checked', 'true')
    await page.getByRole('group', { name: 'Modo de utilização' }).first().getByRole('button', { name: 'Livre' }).click()
    await expect(page).toHaveURL(/#\/livre/)
    await expect(page.getByTestId('module-objetivo')).toContainText('Painel Solar')
    const p = await savedProject(page)
    expect(p.mode).toBe('free')
    expect(p.meta.projectType).toBe('dashboard')
  })

  test('o acabamento só libera após aprovar o esqueleto', async ({ page }) => {
    await freshStart(page)
    await go(page, '/guiado/identidade')
    await expect(page).toHaveURL(/#\/guiado\/revisao/)
  })
})

test.describe('Central de Prompts', () => {
  test('Master Prompt reflete o projeto e prompts individuais abrem', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/objetivo')
    await page.getByTestId('project-name').fill('Clínica Serena')
    await go(page, '/modulos/cores')
    await page.getByTestId('palette-option-clinico').locator('.ui-option__hit').click()
    await go(page, '/prompt')
    const text = page.getByTestId('master-prompt-text')
    await expect(text).toContainText('# Master Prompt — Clínica Serena')
    await expect(text).toContainText('Clínico')
    await page.getByRole('tab', { name: /Itens/ }).click()
    await page.getByTestId('prompt-item-identity.palette').getByRole('button', { name: 'Prompt deste elemento' }).click()
    await expect(page.getByTestId('prompt-text')).toContainText('Responsividade obrigatória')
    await page.keyboard.press('Escape')
    await page.getByTestId('prompt-item-identity.typography').getByText('No Master Prompt').click()
    await expect(page.getByTestId('prompt-item-identity.typography').getByRole('switch')).not.toBeChecked()
    await page.getByRole('tab', { name: 'Master Prompt' }).click()
    await expect(text).not.toContainText('### Tipografia:')
  })
})

test.describe('Validation Lab', () => {
  test('gera configuração sem segredos e importa relatório com prompt de correção', async ({ page }) => {
    await freshStart(page)
    await go(page, '/validacao')
    await page.getByTestId('validation-url').fill('https://staging.exemplo.com')
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('download-validation-config').click()])
    const cfg = JSON.parse(readFileSync((await download.path())!, 'utf8'))
    expect(cfg.kind).toBe('atelier-ui/validation-config')
    expect(cfg.config.url).toBe('https://staging.exemplo.com')
    expect(JSON.stringify(cfg)).not.toMatch(/password|senha|cookie|token/i)

    const report = {
      tool: 'teste',
      generatedAt: new Date().toISOString(),
      baseUrl: 'https://staging.exemplo.com',
      widths: [360, 1280],
      pages: ['/'],
      issues: [{ page: '/', width: 360, type: 'overflow-horizontal', severity: 'alta', element: 'div.hero', description: 'Página 40px mais larga', suggestion: 'Use max-width: 100%' }],
    }
    await page.getByTestId('report-input').setInputFiles({ name: 'report.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(report)) })
    await expect(page.locator('.val-issue').getByText('Página 40px mais larga')).toBeVisible()
    await expect(page.locator('pre.ui-code')).toContainText('Correção de responsividade')
  })
})
