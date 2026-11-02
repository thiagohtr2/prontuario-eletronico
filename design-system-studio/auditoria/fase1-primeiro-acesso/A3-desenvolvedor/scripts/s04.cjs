const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  console.log('persisted name:', await page.getByRole('textbox', { name: 'Nome do projeto' }).inputValue());
  await page.getByRole('textbox', { name: 'Tecnologia' }).fill('React 18 + TypeScript + Vite + Tailwind CSS');
  await page.getByRole('button', { name: /Continuar: Entrada/ }).click();
  await page.waitForTimeout(600);
  console.log('URL', page.url());
  await shot(page, '04-entrada');
  await shot(page, '04-entrada-full', true);
  const a = await aria(page, 'main');
  console.log(a.split('\n').filter(l => !l.includes('/url')).join('\n'));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
