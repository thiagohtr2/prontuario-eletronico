const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/entrada', { waitUntil: 'networkidle' }); await page.getByText('Como as pessoas entram').first().waitFor();
  await page.getByRole('button', { name: /Landing page com chamada para login/ }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: C + '05-entrada-escolhida.png', fullPage: true });
  await dump(page, 4000);
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
