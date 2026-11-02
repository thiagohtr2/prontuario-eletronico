const { open, dump, controls, C } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log(page.url());
  await page.screenshot({ path: C + '03a-direct-url.png' });
  await dump(page, 800);
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
