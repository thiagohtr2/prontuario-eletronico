import { defineConfig, devices } from '@playwright/test'

/**
 * Configuração da fase 7 (regressão): roda apenas `tests/e2e/regression.spec.ts` contra a versão
 * congelada servida em http://127.0.0.1:4300 (sem build e sem webServer).
 * Uso, a partir de design-system-studio/:
 *   npx playwright test -c auditoria/fase7-regressao/playwright.audit.config.ts
 */
export default defineConfig({
  testDir: '../../tests/e2e',
  testMatch: 'regression.spec.ts',
  outputDir: './resultados/artefatos',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: './resultados/resultado.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4300',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
})
