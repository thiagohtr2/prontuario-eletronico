const { open, dump, controls, C } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const a = await page.evaluate(() => [...document.querySelectorAll('main button')].slice(10,14).map(b => b.outerHTML.slice(0,300)));
  console.log(a.join('\n\n'));
  await ctx.close();
})();
