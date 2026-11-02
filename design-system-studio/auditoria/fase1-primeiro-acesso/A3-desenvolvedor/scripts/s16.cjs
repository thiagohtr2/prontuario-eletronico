const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Azul Institucional/ }).click();
  await page.waitForTimeout(400);
  await page.getByRole('tab', { name: 'Ajustar cores' }).click();
  await page.waitForTimeout(600);
  await shot(page, '16-ajustar-cores');
  await shot(page, '16-ajustar-cores-full', true);
  const a = await aria(page, 'main');
  const lines = a.split('\n').filter(l => !l.includes('/url'));
  const s = lines.findIndex(l => l.includes('tablist'));
  console.log(lines.slice(s).join('\n').slice(0, 12000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
