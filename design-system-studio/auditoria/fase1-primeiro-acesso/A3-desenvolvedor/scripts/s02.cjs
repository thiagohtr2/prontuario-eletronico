const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Começar no modo guiado' }).click();
  await page.waitForTimeout(600);
  console.log('URL', page.url());
  await shot(page, '02-guiado-objetivo');
  await shot(page, '02-guiado-objetivo-full', true);
  console.log(await aria(page));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
