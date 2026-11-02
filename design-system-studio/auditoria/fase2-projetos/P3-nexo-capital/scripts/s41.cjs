const { open, W } = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(8000);
  async function grab(label, clickFn, dir) {
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }).catch(() => null), clickFn()]);
    if (!dl) { console.log(label, '-> SEM DOWNLOAD'); return; }
    const fn = dl.suggestedFilename(); const out = dir + '/' + fn; const ex = fs.existsSync(out);
    await dl.saveAs(out); console.log(label, '->', fn, fs.statSync(out).size, ex ? '(sobrescreveu nome repetido)' : '');
  }
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  const h = page.locator('#conteudo article[aria-label="Painel Analítico"]');
  await h.scrollIntoViewIfNeeded();
  await h.getByRole('button', { name: 'Ver em tamanho grande' }).click();
  await page.waitForTimeout(600);
  let d = page.getByRole('dialog');
  console.log('header dialog buttons:', (await d.getByRole('button').allInnerTexts()).map(s => s.trim()).filter(Boolean).join(' | '));
  await grab('Header Painel Analítico: Exportar especificação', () => d.getByRole('button', { name: 'Exportar especificação' }).click(), W + '/exportados/especificacoes-navegacao');
  await d.getByRole('button', { name: 'Fechar' }).first().click(); await page.waitForTimeout(300);
  await page.getByRole('tab', { name: /^Sidebars/ }).click(); await page.waitForTimeout(400);
  const s = page.locator('#conteudo article[aria-label="Sóbria Corporativa"]');
  await s.scrollIntoViewIfNeeded();
  await s.getByRole('button', { name: 'Ver em tamanho grande' }).click();
  await page.waitForTimeout(600);
  d = page.getByRole('dialog');
  await grab('Sidebar Sóbria Corporativa: Exportar especificação', () => d.getByRole('button', { name: 'Exportar especificação' }).click(), W + '/exportados/especificacoes-navegacao');
  await d.getByRole('button', { name: 'Fechar' }).first().click(); await page.waitForTimeout(300);
  // identity prompt
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Prompt da identidade' }).click(); await page.waitForTimeout(500);
  d = page.getByRole('dialog');
  await grab('Prompt da identidade: Baixar .md', () => d.getByRole('button', { name: 'Baixar .md' }).click(), W + '/exportados/outros');
  await d.getByRole('button', { name: 'Fechar' }).first().click();
  // validation runner
  await page.goto('http://127.0.0.1:4300/#/validacao', { waitUntil: 'networkidle' });
  await grab('Validação: Baixar executor (runner.py)', () => page.getByRole('button', { name: 'Baixar executor (runner.py)' }).click(), W + '/exportados/outros');
  console.log('Baixar configuração disabled?', await page.getByRole('button', { name: 'Baixar configuração' }).isDisabled());
  await ctx.close();
})();
