const { open, dump, controls, C } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Começar no modo guiado' }).click();
  await page.waitForTimeout(800);
  console.log('URL', page.url());
  await page.screenshot({ path: C + '02-guiado-objetivo.png', fullPage: true });
  await dump(page);
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
