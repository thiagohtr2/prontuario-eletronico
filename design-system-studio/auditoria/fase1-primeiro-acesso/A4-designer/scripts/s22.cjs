const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/identidade', { waitUntil: 'networkidle' }); await page.getByText('Prévia da identidade').first().waitFor(); await page.waitForTimeout(800);
  await page.getByRole('tab', { name: 'Tipografia' }).click(); await page.waitForTimeout(1200);
  await page.screenshot({ path: C + '27-tipografia-viewport.png' });
  await page.screenshot({ path: C + '27-tipografia-full.png', fullPage: true });
  const t = await page.evaluate(() => document.querySelector('main').innerText);
  const i = t.indexOf('Formas e superfícies'); console.log(t.slice(i, i+3500));
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
