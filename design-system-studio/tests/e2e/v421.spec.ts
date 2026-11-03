import { expect, test, type Page } from '@playwright/test'
import { freshStart, go, savedProject } from './helpers'

/** Versão 4.21 (guiado sem gargalos, acessível e robusto): B-06, B-07, B-08, B-10, B-11, B-13, B-16, B-17. */

const STORAGE = 'atelier-ui:studio:v1'

async function startGuided(page: Page, type = 'saas') {
  await freshStart(page)
  await page.getByTestId('start-guided').click()
  await page.getByTestId(`project-type-${type}`).click()
  await page.getByTestId('project-name').fill('Painel Interno')
}

test.describe('Guiado sem gargalos', () => {
  test('B-06: “Continuar” com pendência explica o que falta e abre a parte certa', async ({ page }) => {
    await startGuided(page)
    await page.getByTestId('guided-next').click()
    await page.getByTestId('entry-flow-landing-login').locator('xpath=self::*[@aria-pressed] | .//*[@aria-pressed]').first().click()
    const next = page.getByTestId('guided-next')
    await expect(next).toHaveAttribute('aria-disabled', 'true')
    await expect(page.locator('#guided-next-hint')).toContainText('landing')
    await next.click({ force: true })
    await expect(page.getByRole('tab', { name: /Landing page/ })).toHaveAttribute('aria-selected', 'true')
    await expect(page).toHaveURL(/#\/guiado\/entrada/)
    // “Não preciso de landing” troca o fluxo sem perder o login.
    await page.getByTestId('entry-no-landing').click()
    await expect.poll(async () => (await savedProject(page)).entry.flow).toBe('login-only')
  })

  test('B-06/B-13: atalho de sistema interno = apenas login, sem cadastro e sem pendência de cadastro', async ({ page }) => {
    await startGuided(page)
    await page.getByTestId('guided-next').click()
    await page.getByTestId('entry-internal-system').click()
    await expect.poll(async () => (await savedProject(page)).entry).toMatchObject({ flow: 'login-only', noSignup: true })
    await page.getByRole('tab', { name: /Cadastro/ }).click()
    await expect(page.getByLabel('Não haverá cadastro')).toBeChecked()
  })

  test('B-07: “Usar recomendados e continuar” preenche o esqueleto e vai para a revisão', async ({ page }) => {
    await startGuided(page, 'dashboard')
    await page.getByTestId('use-recommended').click()
    await expect(page).toHaveURL(/#\/guiado\/revisao/)
    const p = await savedProject(page)
    expect(p.entry.flow).toBe('login-only')
    expect(p.layout.desktopId).toBe('sidebar-integral-classica')
    expect(p.layout.mobileId).toBe('bottom-nav-classica')
    // B-17: o contador reflete as escolhas reais (4 de 5; falta aprovar a revisão).
    await expect(page.locator('.shell-progress')).toContainText('Esqueleto 4/5')
    await expect(page.getByRole('heading', { name: 'Seu esqueleto (ainda não aprovado)' })).toBeVisible()
  })

  test('B-08: a entrega diz o que fazer agora e aponta pendências antes de copiar', async ({ page }) => {
    await freshStart(page)
    await go(page, '/prompt')
    const box = page.getByTestId('what-now')
    await expect(box).toContainText('Antes de copiar')
    await expect(box).toContainText('Cole o prompt')
  })
})

test.describe('Acessibilidade e robustez', () => {
  test('B-11: “Pular para o conteúdo” leva o foco ao conteúdo sem trocar de tela', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/cores')
    await page.keyboard.press('Tab')
    await expect(page.locator('.shell-skip')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#\/modulos\/cores/)
    await expect(page.locator('#conteudo')).toBeFocused()
  })

  test.describe('celular 390×844', () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    test('B-11: menu lateral fechado fica fora do Tab (inert) e volta ao abrir', async ({ page }) => {
      await freshStart(page)
      await go(page, '/modulos/cores')
      await expect(page.locator('#studio-sidebar')).toHaveAttribute('inert', '')
      await page.getByRole('button', { name: 'Abrir menu' }).click()
      await expect(page.locator('#studio-sidebar')).not.toHaveAttribute('inert', '')
    })
  })

  test('B-10: módulo que não carrega mostra aviso em português e mantém o Studio de pé', async ({ page }) => {
    await freshStart(page)
    await page.route(/ColorPage-[^/]*\.js$/, (route) => route.abort())
    await go(page, '/modulos/cores')
    await expect(page.getByTestId('error-panel')).toContainText('Esta tela não pôde ser aberta')
    await expect(page.locator('.shell-topbar')).toBeVisible()
    await page.unroute(/ColorPage-[^/]*\.js$/)
    await go(page, '/prompt')
    await expect(page.getByTestId('error-panel')).toHaveCount(0)
  })

  test('B-10: falha ao salvar aparece para a pessoa', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/objetivo')
    await page.evaluate(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException('cheio', 'QuotaExceededError')
      }
    })
    await page.getByTestId('project-name').fill('Sem espaço')
    await expect(page.getByTestId('save-warning')).toContainText('não estão sendo salvas')
  })

  test('B-10: dados salvos ilegíveis viram cópia de recuperação em vez de sumir', async ({ page }) => {
    await freshStart(page)
    await page.evaluate((key) => localStorage.setItem(key, '{"state": {"project": quebrado'), STORAGE)
    await page.reload()
    await expect(page.getByTestId('save-warning')).toContainText('Guardamos uma cópia')
    const keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.includes('recuperacao')))
    expect(keys.length).toBe(1)
    const copy = await page.evaluate((k) => localStorage.getItem(k), keys[0])
    expect(copy).toContain('quebrado')
  })
})
