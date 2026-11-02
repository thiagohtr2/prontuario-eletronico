const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/entrada', { waitUntil: 'networkidle' }); await page.getByText('Como as pessoas entram').first().waitFor();
  await page.getByRole('tab', { name: 'Landing page' }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: C + '06-landing-galeria-viewport.png' });
  await page.screenshot({ path: C + '06-landing-galeria-full.png', fullPage: true });
  console.log('H', await page.evaluate(() => document.documentElement.scrollHeight));
  await dump(page, 6000);
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
