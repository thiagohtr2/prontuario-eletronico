const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/revisao', { waitUntil: 'networkidle' }); await page.getByText('Revisão do esqueleto').first().waitFor(); await page.waitForTimeout(800);
  await page.getByRole('button', { name: /Aprovar esqueleto e continuar/ }).click();
  await page.waitForTimeout(2000);
  console.log(page.url());
  await page.screenshot({ path: C + '19-previa-integrada-viewport.png' });
  await page.screenshot({ path: C + '19-previa-integrada-full.png', fullPage: true });
  await dump(page, 3000);
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
