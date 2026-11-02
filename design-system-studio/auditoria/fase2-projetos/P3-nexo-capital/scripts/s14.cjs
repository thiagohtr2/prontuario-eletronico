const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Corporativas/ }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: W + '/scripts/tmp-19.png', fullPage: true });
  await ctx.close();
})();
