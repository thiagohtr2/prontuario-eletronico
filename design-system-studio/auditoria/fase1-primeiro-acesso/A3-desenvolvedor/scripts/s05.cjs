const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Landing page com chamada para login/ }).click();
  await page.waitForTimeout(500);
  await shot(page, '05-entrada-fluxo-escolhido-full', true);
  const a = await aria(page, 'main');
  console.log(a.split('\n').filter(l => !l.includes('/url')).slice(30).join('\n'));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
