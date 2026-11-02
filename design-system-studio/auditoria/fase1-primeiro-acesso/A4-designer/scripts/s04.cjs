const { open, dump, controls, C } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' }); await page.getByText('Aplicativo ou SaaS').first().waitFor();
  await page.getByRole('button', { name: /Continuar: Entrada/ }).click();
  await page.waitForTimeout(1200);
  console.log(page.url());
  await page.screenshot({ path: C + '04-entrada.png', fullPage: true });
  await dump(page, 3500);
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
