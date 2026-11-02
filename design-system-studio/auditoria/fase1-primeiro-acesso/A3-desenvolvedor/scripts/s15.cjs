const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/preview', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Continuar: Cores/ }).click();
  await page.waitForTimeout(900);
  console.log('URL', page.url());
  await shot(page, '15-identidade');
  await shot(page, '15-identidade-full', true);
  const a = await aria(page, 'main');
  const lines = a.split('\n').filter(l => !l.includes('/url'));
  console.log(lines.slice(30).join('\n').slice(0, 12000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
