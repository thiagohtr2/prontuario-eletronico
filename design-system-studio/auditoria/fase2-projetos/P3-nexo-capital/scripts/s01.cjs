const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/', { waitUntil: 'networkidle' });
  console.log('URL', page.url(), 'TITLE', await page.title());
  console.log('LS keys', await page.evaluate(() => Object.keys(localStorage)));
  await page.screenshot({ path: W + '/scripts/tmp-01.png' });
  console.log(await page.locator('body').ariaSnapshot());
  await ctx.close();
})();
