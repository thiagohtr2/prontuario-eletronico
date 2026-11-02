const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  await page.getByRole('radio', { name: /^Dashboard/ }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: W + '/scripts/tmp-03.png', fullPage: false });
  console.log(await page.locator('main').ariaSnapshot());
  await ctx.close();
})();
