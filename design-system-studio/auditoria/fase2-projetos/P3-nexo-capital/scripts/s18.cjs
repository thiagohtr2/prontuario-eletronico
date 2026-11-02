const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('group', { name: 'Filtrar headers' }).getByRole('button', { name: /^SaaS/ }).click();
  await page.waitForTimeout(400);
  for (const nm of ['Painel Analítico', 'Painel de Trabalho']) {
    const a = page.locator(`main article[aria-label="${nm}"]`);
    await a.scrollIntoViewIfNeeded();
    await a.screenshot({ path: W + `/scripts/tmp-23-${nm.replace(/ /g,'_')}-A.png` });
    await a.getByRole('button', { name: 'Composição B' }).click();
    await page.waitForTimeout(400);
    await a.screenshot({ path: W + `/scripts/tmp-23-${nm.replace(/ /g,'_')}-B.png` });
    console.log(nm, (await a.locator('p').allInnerTexts()).join(' | '));
  }
  await ctx.close();
})();
