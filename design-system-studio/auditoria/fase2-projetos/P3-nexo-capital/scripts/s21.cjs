const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /^Sidebars/ }).click();
  await page.waitForTimeout(500);
  for (const nm of ['Sóbria Corporativa', 'Clássica Integral', 'Lateral da Marca']) {
    const a = page.locator(`#conteudo article[aria-label="${nm}"]`);
    await a.scrollIntoViewIfNeeded();
    await a.screenshot({ path: W + `/scripts/tmp-25-${nm.replace(/ /g,'_')}-A.png` });
    console.log(nm, (await a.locator('p').allInnerTexts()).join(' | '));
  }
  await ctx.close();
})();
