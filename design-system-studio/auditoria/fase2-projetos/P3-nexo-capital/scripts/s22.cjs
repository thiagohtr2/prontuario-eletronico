const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /^Sidebars/ }).click();
  await page.waitForTimeout(500);
  const a = page.locator(`#conteudo article[aria-label="Sóbria Corporativa"]`);
  await a.getByRole('button', { name: 'Composição B' }).click();
  await page.waitForTimeout(400);
  await a.screenshot({ path: W + `/scripts/tmp-26-B.png` });
  console.log((await a.locator('p').allInnerTexts()).join(' | '));
  await a.getByRole('button', { name: 'Composição A' }).click();
  await page.waitForTimeout(300);
  await ctx.close();
})();
