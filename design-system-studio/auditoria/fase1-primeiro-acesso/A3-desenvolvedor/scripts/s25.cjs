const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Continuar: Componentes/ }).click();
  await page.waitForTimeout(900);
  console.log('URL', page.url());
  await shot(page, '25-componentes');
  const a = await aria(page, 'main');
  const lines = a.split('\n').filter(l => !l.includes('/url'));
  const s = lines.findIndex(l => l.includes('Etapa 9'));
  console.log(lines.slice(s).join('\n').slice(0, 9000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
