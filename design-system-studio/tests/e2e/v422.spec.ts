import { expect, test, type Page } from '@playwright/test'
import { freshStart, go, savedProject } from './helpers'

/** Versão 4.22 (prévia fiel): B-05, B-19, B-21, B-22, B-24. */

const STORAGE = 'atelier-ui:studio:v1'
const NAV = ['Visão geral', 'Turnos', 'Equipe', 'Relatórios', 'Ajustes']

async function seed(page: Page, patch: Record<string, unknown>) {
  await freshStart(page)
  await go(page, '/modulos/objetivo')
  await page.getByTestId('project-name').fill('Escala Viva')
  await expect.poll(async () => (await savedProject(page))?.meta?.name).toBe('Escala Viva')
  await page.evaluate(
    ({ patch, key }) => {
      const raw = JSON.parse(localStorage.getItem(key) ?? '{}')
      const deep = (a: Record<string, unknown>, b: Record<string, unknown>) => {
        for (const [k, v] of Object.entries(b)) {
          if (v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object') deep(a[k] as Record<string, unknown>, v as Record<string, unknown>)
          else a[k] = v
        }
      }
      deep(raw.state.project, patch)
      localStorage.setItem(key, JSON.stringify(raw))
    },
    { patch, key: STORAGE },
  )
  await page.reload()
}

const APP = {
  meta: { projectType: 'saas', navItems: NAV },
  layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' },
  navigation: { header: { id: 'linha-essencial', variant: 0 }, sidebar: null },
}

test.describe('B-05 · Prévia integrada fiel ao projeto', () => {
  test('computador: nome e menu do projeto, sem botões de site de marketing dentro do app', async ({ page }) => {
    await seed(page, APP)
    await go(page, '/modulos/preview')
    const stage = page.getByTestId('live-preview')
    await expect(stage).toContainText('Escala Viva')
    for (const item of NAV.slice(0, 4)) await expect(stage).toContainText(item)
    await expect(stage).not.toContainText('Ipê')
    await expect(stage).not.toContainText('Começar grátis')
    await expect(stage.getByRole('button', { name: 'Entrar' })).toHaveCount(0)
  })

  test('celular: marca e itens do projeto na navegação inferior (4 vagas → 3 itens + Mais)', async ({ page }) => {
    await seed(page, APP)
    await go(page, '/modulos/preview')
    await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: /Celular/ }).click()
    const phone = page.getByTestId('live-preview').getByTestId('phone-preview')
    for (const item of NAV.slice(0, 3)) await expect(phone).toContainText(item)
    await expect(phone).not.toContainText('Início')
    await expect(phone).toContainText('Mais')
    await expect(phone).not.toContainText('Orla')
  })

  test('tela cheia abre e fecha com Esc', async ({ page }) => {
    await seed(page, APP)
    await go(page, '/modulos/preview')
    await page.getByTestId('preview-fullscreen').click()
    await expect(page.locator('.lp-main')).toHaveAttribute('data-full', 'true')
    await page.keyboard.press('Escape')
    await expect(page.locator('.lp-main')).toHaveAttribute('data-full', 'false')
  })
})

test.describe('B-19/B-21 · Galeria de navegação', () => {
  test('um único <main>, prévias fora do Tab e headers filtrados pelo tipo de tela', async ({ page }) => {
    await seed(page, { meta: { projectType: 'saas' } })
    await go(page, '/modulos/navegacao')
    await expect(page.locator('main')).toHaveCount(1)
    const focusableInPreviews = await page.locator('.nvs-card__preview').evaluateAll((els) =>
      els.flatMap((e) => Array.from(e.querySelectorAll<HTMLElement>('button, a[href], input')).filter((n) => n.tabIndex >= 0)).length,
    )
    expect(focusableInPreviews).toBe(0)
    // Sistema (SaaS): começa nos headers de área logada; o header de site aparece ao trocar o tipo de tela.
    await expect(page.getByTestId('header-option-linha-essencial')).toHaveCount(0)
    await page.getByRole('group', { name: 'Tipo de tela' }).getByRole('button', { name: /Site público/ }).click()
    await expect(page.getByTestId('header-option-linha-essencial')).toBeVisible()
    await page.getByRole('tab', { name: /Sidebars/ }).click()
    await expect(page.locator('main')).toHaveCount(1)
  })
})

test.describe('B-22 · Escopo estruturado', () => {
  test('monitores grandes e stories escolhidos na revisão entram no Master Prompt', async ({ page }) => {
    await seed(page, { meta: { projectType: 'saas' }, layout: { desktopId: 'sidebar-integral-classica', mobileId: 'stories-dock-flutuante' } })
    await go(page, '/modulos/desktop')
    await page.getByTestId('scope-wide').getByRole('button', { name: 'Largura total' }).click()
    await go(page, '/modulos/mobile')
    await page.getByTestId('scope-stories').getByRole('button', { name: 'Nas telas principais' }).click()
    await expect.poll(async () => (await savedProject(page)).layout).toMatchObject({ wide: 'fluid', storiesScope: 'main' })
    await go(page, '/prompt')
    const text = page.getByTestId('master-prompt-text')
    await expect(text).toContainText('o conteúdo ocupa a largura toda')
    await expect(text).toContainText('telas de primeiro nível da navegação')
  })
})

test.describe('B-24 · Padrão único de modal', () => {
  test('“Escolher este modelo” escolhe e fecha o modal', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/landing')
    await page.locator('[data-testid^="landing-option-"]').first().getByRole('button', { name: 'Ver prévia' }).click()
    const modal = page.getByTestId('landing-preview-modal')
    await expect(modal.getByRole('button', { name: 'Fechar' }).last()).toBeVisible()
    await modal.getByTestId('select-model').click()
    await expect(modal).toHaveCount(0)
    await expect.poll(async () => (await savedProject(page)).entry.landingId).toBeTruthy()
  })
})
