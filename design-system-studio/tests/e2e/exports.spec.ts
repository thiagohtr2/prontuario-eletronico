import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { freshStart, go, savedProject } from './helpers'

test.describe('Exportações e importação', () => {
  test('todos os downloads geram arquivos válidos', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/objetivo')
    await page.getByTestId('project-name').fill('Loja Aurora')
    await go(page, '/exportar')

    const grab = async (testId: string) => {
      const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId(testId).click()])
      const path = await download.path()
      return { name: download.suggestedFilename(), text: readFileSync(path!, 'utf8') }
    }

    const md = await grab('export-master')
    expect(md.name).toBe('loja-aurora-master-prompt.md')
    expect(md.text).toContain('# Master Prompt — Loja Aurora')

    const spec = await grab('export-spec')
    const specJson = JSON.parse(spec.text)
    expect(specJson.$schema).toBe('atelier-ui/spec@1')
    expect(specJson.project.name).toBe('Loja Aurora')

    const css = await grab('export-css')
    expect(css.text).toContain('--color-primary:')

    const html = await grab('export-html')
    expect(html.text.startsWith('<!doctype html>')).toBe(true)
    expect(html.text).toContain('Loja Aurora')
    expect(html.text.trim().endsWith('</html>')).toBe(true)

    const backup = await grab('export-backup')
    const backupJson = JSON.parse(backup.text)
    expect(backupJson.kind).toBe('atelier-ui/backup')
    expect(backupJson.project.meta.name).toBe('Loja Aurora')
  })

  test('importar um backup recupera o estado do projeto', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/objetivo')
    await page.getByTestId('project-name').fill('Projeto Original')
    await go(page, '/exportar')
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('export-backup').click()])
    const backupPath = await download.path()

    await go(page, '/modulos/objetivo')
    await page.getByTestId('project-name').fill('Alterado depois')
    await go(page, '/exportar')
    await page.getByTestId('import-input').setInputFiles(backupPath!)
    await expect(page.getByText('Projeto importado')).toBeVisible()
    expect((await savedProject(page)).meta.name).toBe('Projeto Original')
  })

  test('arquivo inválido mostra erro e não altera o projeto', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/objetivo')
    await page.getByTestId('project-name').fill('Intocado')
    await go(page, '/exportar')
    await page.getByTestId('import-input').setInputFiles({ name: 'ruim.json', mimeType: 'application/json', buffer: Buffer.from('{"foo": 1}') })
    await expect(page.getByText('Não foi possível importar')).toBeVisible()
    expect((await savedProject(page)).meta.name).toBe('Intocado')
  })
})
