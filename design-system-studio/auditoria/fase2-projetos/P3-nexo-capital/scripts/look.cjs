// usage: node look.cjs <hash> <outname> [full] [selector]
const { open, W } = require('./lib.cjs');
(async () => {
  const [hash, out, full, sel] = process.argv.slice(2);
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/' + (hash || ''), { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: W + '/scripts/' + (out || 'tmp') + '.png', fullPage: full === 'full' });
  console.log(await page.locator(sel || 'main').ariaSnapshot());
  await ctx.close();
})();
