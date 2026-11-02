const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Cadastro' }).click();
  await page.waitForTimeout(500);
  console.log(await page.locator('main').ariaSnapshot());
  await page.screenshot({ path: W + '/scripts/tmp-09.png', fullPage: true });
  await ctx.close();
})();
