const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Landing page' }).click();
  await page.waitForTimeout(500);
  await shot(page, '06-entrada-landing-full', true);
  const a = await aria(page, 'main');
  console.log(a.split('\n').filter(l => !l.includes('/url')).slice(34).join('\n'));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
