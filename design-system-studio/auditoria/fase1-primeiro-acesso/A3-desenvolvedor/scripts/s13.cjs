const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Continuar: Revisão/ }).click();
  await page.waitForTimeout(700);
  console.log('URL', page.url());
  await shot(page, '13-revisao');
  await shot(page, '13-revisao-full', true);
  const a = await aria(page, 'main');
  const lines = a.split('\n').filter(l => !l.includes('/url'));
  console.log(lines.slice(34).join('\n').slice(0, 6000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
