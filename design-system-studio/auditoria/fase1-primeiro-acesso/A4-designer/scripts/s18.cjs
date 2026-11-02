const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/preview', { waitUntil: 'networkidle' }); await page.getByText('Escolhas nesta prévia').first().waitFor(); await page.waitForTimeout(800);
  await page.getByRole('button', { name: /Continuar: Cores/ }).click();
  await page.waitForTimeout(1800);
  console.log(page.url());
  await page.screenshot({ path: C + '23-cores-viewport.png' });
  await page.screenshot({ path: C + '23-cores-full.png', fullPage: true });
  console.log('H', await page.evaluate(() => document.documentElement.scrollHeight));
  await dump(page, 7000);
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
