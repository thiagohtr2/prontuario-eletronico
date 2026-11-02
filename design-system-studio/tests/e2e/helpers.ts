import { expect, type Page } from '@playwright/test'

export const ROUTES = [
  '/',
  '/livre',
  '/guiado/objetivo',
  '/modulos/objetivo',
  '/modulos/landing',
  '/modulos/login',
  '/modulos/cadastro',
  '/modulos/desktop',
  '/modulos/mobile',
  '/modulos/preview',
  '/modulos/cores',
  '/modulos/navegacao',
  '/modulos/componentes',
  '/modulos/inspiracao',
  '/modulos/templates',
  '/prompt',
  '/exportar',
  '/validacao',
  '/projeto',
]

/** Coleta erros de JavaScript e de console durante o teste. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`)
  })
  return errors
}

export async function go(page: Page, route: string) {
  await page.goto(`/#${route}`)
  await page.waitForLoadState('networkidle')
  // Aguarda o módulo carregado sob demanda sair do estado "Carregando…".
  await expect(page.getByText('Carregando…')).toHaveCount(0, { timeout: 15_000 })
}

export async function freshStart(page: Page) {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
}

export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
}

/** Lê o projeto salvo no armazenamento local (fonte única da verdade persistida). */
export async function savedProject(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('atelier-ui:studio:v1') ?? '{}').state?.project)
}
