const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  // header large
  const h = page.locator(`#conteudo article[aria-label="Painel Analítico"]`);
  await h.scrollIntoViewIfNeeded();
  await h.getByRole('button', { name: 'Ver em tamanho grande' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: W + '/capturas/11-header-painel-analitico-A-grande.png' });
  let d = page.getByRole('dialog');
  console.log(await d.first().ariaSnapshot().then(s => s.split('\n').slice(0, 12).join('\n')));
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  console.log('dialog after esc', await page.getByRole('dialog').count());
  await page.getByRole('tab', { name: /^Sidebars/ }).click();
  await page.waitForTimeout(500);
  const s = page.locator(`#conteudo article[aria-label="Sóbria Corporativa"]`);
  await s.scrollIntoViewIfNeeded();
  await s.getByRole('button', { name: 'Ver em tamanho grande' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: W + '/capturas/12-sidebar-sobria-corporativa-A-grande.png' });
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await ctx.close();
})();
