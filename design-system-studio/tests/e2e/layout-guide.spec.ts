import { expect, test, type Page } from '@playwright/test'
import { freshStart, go, horizontalOverflow, trackErrors } from './helpers'

/** Boas práticas de layout: ferramenta que configura, gera, edita e copia um prompt. */

const editor = (page: Page) => page.getByTestId('lg-editor')

async function open(page: Page) {
  await freshStart(page)
  await go(page, '/boas-praticas')
  await expect(page.getByRole('heading', { level: 1, name: 'Boas práticas de layout' })).toBeVisible()
}

test('acessível pela navegação e pela busca do Studio', async ({ page }) => {
  await freshStart(page)
  await go(page, '/livre')
  await page.getByRole('link', { name: 'Boas práticas de layout', exact: true }).first().click()
  await expect(page).toHaveURL(/#\/boas-praticas/)
  await expect(page).toHaveTitle(/Boas práticas de layout · Atelier UI/)
  await go(page, '/')
  await page.keyboard.press('Control+k')
  await page.getByRole('combobox', { name: 'Buscar funcionalidades' }).fill('boas praticas layout')
  await expect(page.locator('#search-results')).toContainText('Boas práticas de layout')
})

test('atalho preenche as opções e o prompt muda conforme as seleções', async ({ page }) => {
  const errors = trackErrors(page)
  await open(page)
  await expect(page.getByText('Nenhum prompt ainda')).toBeVisible()
  await page.getByTestId('lg-preset-celular').click()
  await expect(page.getByTestId('lg-preset-celular')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('lg-task-adaptar-celular')).toBeChecked()
  await expect(page.getByTestId('lg-device-notebook')).not.toBeChecked()
  await expect(page.getByTestId('lg-env-ios')).toBeChecked()
  // Personalizar depois do atalho continua possível (e o atalho deixa de estar marcado).
  await page.getByTestId('lg-device-notebook').check()
  await expect(page.getByTestId('lg-preset-celular')).toHaveAttribute('aria-pressed', 'false')

  await page.getByTestId('lg-create').click()
  await expect(editor(page)).toHaveValue(/# Boas práticas de layout — Adaptar uma tela para celular/)
  await expect(editor(page)).toHaveValue(/Notebook \(1280–1440 px\)/)
  await expect(page.getByTestId('lg-status')).toContainText('Prompt criado')
  // Enquanto não for editado, o texto acompanha as opções.
  await page.getByTestId('lg-module-A').getByRole('switch').uncheck({ force: true })
  await expect(editor(page)).not.toHaveValue(/### A\. Responsividade/)
  await page.getByTestId('lg-module-M').getByRole('switch').check({ force: true })
  await expect(editor(page)).toHaveValue(/### M\. Impressão/)
  await page.getByTestId('lg-select-all').check()
  await expect(page.getByTestId('lg-module-count')).toHaveText('14 de 14 ativos')
  await expect(editor(page)).toHaveValue(/### A\. Responsividade/)
  expect(errors).toEqual([])
})

test('contexto preenchido entra no prompt; limpar pede confirmação', async ({ page }) => {
  await open(page)
  await page.getByTestId('lg-ctx-nome').fill('Portal Vida')
  await page.getByText('Mais detalhes: arquivos').click()
  await page.getByTestId('lg-ctx-preservar').fill('O rodapé atual')
  await page.getByTestId('lg-create').click()
  await expect(editor(page)).toHaveValue(/- Projeto: Portal Vida/)
  await expect(editor(page)).toHaveValue(/Preserve sem alterar:\*\*\nO rodapé atual/)

  await page.getByTestId('lg-clear').click()
  const modal = page.getByTestId('lg-confirm-limpar')
  await expect(modal).toBeVisible()
  await modal.getByRole('button', { name: 'Cancelar' }).click()
  await expect(page.getByTestId('lg-ctx-nome')).toHaveValue('Portal Vida')
  await page.getByTestId('lg-clear').click()
  await page.getByTestId('lg-confirm-limpar').getByRole('button', { name: 'Limpar campos' }).click()
  await expect(page.getByTestId('lg-ctx-nome')).toHaveValue('')
  await expect(editor(page)).toHaveValue(/Nenhum contexto foi informado/)
  await expect(page.getByTestId('lg-status')).toContainText('Campos de contexto limpos')
})

test('texto editado não é sobrescrito sem confirmação; copiar confirma na tela', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await open(page)
  await page.getByTestId('lg-create').click()
  await editor(page).fill('Meu prompt revisado à mão')
  await expect(page.getByTestId('lg-state')).toHaveText('Editado')
  await page.getByTestId('lg-task-criar').check()
  await expect(page.getByTestId('lg-state')).toHaveText('Desatualizado')
  await expect(editor(page)).toHaveValue('Meu prompt revisado à mão')

  await page.getByTestId('lg-create').click()
  const confirm = page.getByTestId('lg-confirm-regenerar')
  await expect(confirm).toBeVisible()
  await confirm.getByRole('button', { name: 'Manter o meu texto' }).click()
  await expect(editor(page)).toHaveValue('Meu prompt revisado à mão')

  await page.getByTestId('lg-copy').click()
  await expect(page.getByTestId('lg-status')).toContainText('Prompt copiado')
  await expect(page.getByTestId('lg-copy')).toContainText('Copiado')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('Meu prompt revisado à mão')

  await page.getByTestId('lg-create').click()
  await page.getByTestId('lg-confirm-regenerar').getByRole('button', { name: 'Substituir o texto' }).click()
  await expect(editor(page)).toHaveValue(/# Boas práticas de layout — Criar um layout novo/)
  await expect(page.getByTestId('lg-state')).toHaveText('Acompanha as opções')
})

test('restaurar padrão volta as seleções e mantém o contexto; tudo persiste ao recarregar', async ({ page }) => {
  await open(page)
  await page.getByTestId('lg-ctx-pagina').fill('Checkout')
  await page.getByTestId('lg-preset-desktop').click()
  await page.getByTestId('lg-restore').click()
  await page.getByTestId('lg-confirm-restaurar').getByRole('button', { name: 'Restaurar padrão' }).click()
  await expect(page.getByTestId('lg-task-revisar')).toBeChecked()
  await expect(page.getByTestId('lg-ctx-pagina')).toHaveValue('Checkout')
  await page.getByTestId('lg-create').click()
  await page.reload()
  await expect(page.getByTestId('lg-ctx-pagina')).toHaveValue('Checkout')
  await expect(editor(page)).toHaveValue(/Página ou tela: Checkout/)
})

test('teclado: escolhe a tarefa com as setas e o foco fica visível', async ({ page }) => {
  await open(page)
  await page.getByTestId('lg-task-revisar').focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByTestId('lg-task-corrigir-responsividade')).toBeChecked()
  await expect(page.getByTestId('lg-task-corrigir-responsividade')).toBeFocused()
  const ring = await page.locator('.lg-choice[data-checked="true"]').evaluate((el) => getComputedStyle(el).boxShadow)
  expect(ring).not.toBe('none')
  await page.getByTestId('lg-create').focus()
  await page.keyboard.press('Enter')
  await expect(editor(page)).toHaveValue(/Corrigir problemas de responsividade/)
})

for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
  test(`em ${width} px: sem rolagem lateral, botões sem sobreposição e prompt utilizável`, async ({ page }) => {
    const errors = trackErrors(page)
    await page.setViewportSize({ width, height: width < 768 ? 800 : 900 })
    await open(page)
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
    if (width < 1180) await page.getByTestId('lg-jump').click()
    await page.getByTestId('lg-create').click()
    await expect(editor(page)).toBeVisible()
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
    // Nenhum botão do painel de resultado colide com outro, e todos cabem na tela.
    const boxes = await page.locator('.lg-result button').evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect()
        return { l: r.left, r: r.right, t: r.top, b: r.bottom, h: r.height }
      }),
    )
    for (const b of boxes) {
      expect(b.l).toBeGreaterThanOrEqual(0)
      expect(b.r).toBeLessThanOrEqual(width)
      if (width < 768) expect(b.h).toBeGreaterThanOrEqual(44)
    }
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i]
        const c = boxes[j]
        const overlap = a.l < c.r - 1 && c.l < a.r - 1 && a.t < c.b - 1 && c.t < a.b - 1
        expect(overlap, `botões ${i} e ${j} se sobrepõem`).toBe(false)
      }
    expect(errors).toEqual([])
  })
}
