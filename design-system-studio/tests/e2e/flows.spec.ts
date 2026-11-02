import { expect, test, type Page } from '@playwright/test'
import { freshStart, go, savedProject, trackErrors } from './helpers'

/** Clica no controle de seleção de um cartão (o próprio cartão ou o botão com aria-pressed dentro dele). */
async function selectCard(page: Page, testId: string) {
  const card = page.getByTestId(testId)
  await card.scrollIntoViewIfNeeded()
  const hit = card.locator('xpath=self::*[@aria-pressed] | .//*[@aria-pressed]').first()
  await hit.click()
}

async function scrollStaysAfter(page: Page, action: () => Promise<void>) {
  await page.waitForTimeout(200)
  const before = await page.evaluate(() => window.scrollY)
  await action()
  await page.waitForTimeout(350)
  const after = await page.evaluate(() => window.scrollY)
  expect(after, 'a rolagem não pode mudar ao selecionar').toBe(before)
  return before
}

test.describe('Fluxo completo de criação (modo guiado)', () => {
  test('do objetivo ao Master Prompt, com persistência', async ({ page }) => {
    const errors = trackErrors(page)
    await freshStart(page)
    await page.getByTestId('start-guided').click()
    await expect(page).toHaveURL(/#\/guiado\/objetivo/)

    // 1. Objetivo
    await page.getByTestId('project-type-saas').click()
    await page.getByTestId('project-name').fill('Agenda Viva')
    await page.getByTestId('guided-next').click()

    // 2. Entrada: apenas login, com cadastro
    await expect(page).toHaveURL(/#\/guiado\/entrada/)
    await expect(page.getByTestId('guided-next')).toBeDisabled()
    await selectCard(page, 'entry-flow-login-only')
    await page.getByRole('tab', { name: 'Login' }).click()
    await page.locator('[data-testid^="login-option-"]').first().locator('xpath=self::*[@aria-pressed] | .//*[@aria-pressed]').first().click()
    await page.getByRole('tab', { name: 'Cadastro' }).click()
    await page.locator('[data-testid^="signup-option-"]').first().locator('xpath=self::*[@aria-pressed] | .//*[@aria-pressed]').first().click()
    await page.getByTestId('guided-next').click()

    // 3. Desktop
    await expect(page).toHaveURL(/#\/guiado\/desktop/)
    await selectCard(page, 'desktop-option-sidebar-integral-classica')
    await page.getByTestId('guided-next').click()

    // 4. Mobile
    await expect(page).toHaveURL(/#\/guiado\/mobile/)
    await selectCard(page, 'mobile-option-bottom-nav-classica')
    await page.getByTestId('guided-next').click()

    // 5. Revisão → aprovar
    await expect(page).toHaveURL(/#\/guiado\/revisao/)
    await expect(page.getByText('Esqueleto completo.')).toBeVisible()
    await page.getByTestId('guided-next').click()

    // 6–9. Acabamento
    await expect(page).toHaveURL(/#\/guiado\/preview/)
    await page.getByTestId('guided-next').click()
    await expect(page).toHaveURL(/#\/guiado\/identidade/)
    await selectCard(page, 'palette-option-floresta')
    await page.getByTestId('guided-next').click()
    await expect(page).toHaveURL(/#\/guiado\/navegacao/)
    await page.getByTestId('guided-next').click()
    await expect(page).toHaveURL(/#\/guiado\/componentes/)
    await page.getByTestId('guided-next').click()

    // 10. Entrega
    await expect(page).toHaveURL(/#\/guiado\/entrega/)
    const p = await savedProject(page)
    expect(p.entry.flow).toBe('login-only')
    expect(p.entry.loginId).toBeTruthy()
    expect(p.entry.signupId).toBeTruthy()
    expect(p.layout.desktopId).toBe('sidebar-integral-classica')
    expect(p.layout.mobileId).toBe('bottom-nav-classica')
    expect(p.guided.skeletonApproved).toBe(true)
    const text = page.getByTestId('master-prompt-text')
    await expect(text).toContainText('Agenda Viva')
    await expect(text).toContainText('Floresta')
    await expect(text).toContainText('Apenas login')

    // Persistência: recarregar mantém tudo, inclusive a etapa.
    await page.reload()
    await expect(page).toHaveURL(/#\/guiado\/entrega/)
    await expect(page.getByTestId('master-prompt-text')).toContainText('Agenda Viva')
    expect(errors).toEqual([])
  })
})

test.describe('Seleção sem deslocar a rolagem (regressão)', () => {
  test('layout desktop: clicar em miniaturas mantém a posição e salva a escolha', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/desktop')
    const cards = page.locator('[data-testid^="desktop-option-"]')
    expect(await cards.count()).toBe(42)
    for (const index of [30, 12, 40]) {
      const card = cards.nth(index)
      await card.scrollIntoViewIfNeeded()
      const id = (await card.getAttribute('data-testid'))!.replace('desktop-option-', '')
      await scrollStaysAfter(page, () => card.locator('xpath=self::*[@aria-pressed] | .//*[@aria-pressed]').first().click())
      expect((await savedProject(page)).layout.desktopId).toBe(id)
    }
  })

  test('layout mobile: clicar em miniaturas mantém a posição e atualiza o celular grande', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/mobile')
    const cards = page.locator('[data-testid^="mobile-option-"]')
    expect(await cards.count()).toBe(44)
    await expect(page.getByTestId('phone-preview').first()).toBeVisible()
    for (const index of [35, 8, 43]) {
      const card = cards.nth(index)
      await card.scrollIntoViewIfNeeded()
      const id = (await card.getAttribute('data-testid'))!.replace('mobile-option-', '')
      await scrollStaysAfter(page, () => card.locator('xpath=self::*[@aria-pressed] | .//*[@aria-pressed]').first().click())
      expect((await savedProject(page)).layout.mobileId).toBe(id)
    }
  })

  test('a seleção continua marcada ao sair e voltar', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/desktop')
    await selectCard(page, 'desktop-option-header-central-flutuante')
    await go(page, '/modulos/cores')
    await go(page, '/modulos/desktop')
    await expect(page.getByTestId('desktop-option-header-central-flutuante').locator('xpath=self::*[@aria-pressed] | .//*[@aria-pressed]').first()).toHaveAttribute('aria-pressed', 'true')
  })
})

test.describe('Legendas didáticas', () => {
  test('mostrar/ocultar legendas vale para desktop e mobile', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/desktop')
    const toggle = page.getByTestId('legends-toggle')
    await expect(toggle).toBeChecked()
    const legend = page.locator('[data-testid^="desktop-option-"]').first().getByText('CONTEÚDO', { exact: true })
    await expect(legend.first()).toBeVisible()
    await toggle.uncheck({ force: true })
    await expect(legend).toHaveCount(0)
    expect((await savedProject(page)).prefs.showLegends).toBe(false)
    await go(page, '/modulos/mobile')
    await expect(page.getByTestId('legends-toggle')).not.toBeChecked()
  })
})

test.describe('Menus interativos no celular', () => {
  test('o gatilho abre o drawer na prévia do celular sem rolar a página', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/mobile')
    await selectCard(page, 'mobile-option-drawer-esquerda')
    const phone = page.getByTestId('phone-preview').first()
    await phone.scrollIntoViewIfNeeded()
    await scrollStaysAfter(page, () => phone.getByTestId('phone-menu-trigger').first().click())
    await expect(phone.getByTestId('phone-overlay').first()).toBeVisible()
  })
})
