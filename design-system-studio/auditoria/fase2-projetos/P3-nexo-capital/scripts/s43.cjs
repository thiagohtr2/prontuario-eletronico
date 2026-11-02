const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  const cnt = async () => (await page.locator('.shell-progress').innerText()).trim();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  console.log('antes', await cnt());
  for (const nxt of ['Continuar: Entrada', 'Continuar: Desktop', 'Continuar: Mobile', 'Continuar: Revisão']) {
    await page.getByRole('button', { name: nxt }).click();
    await page.waitForTimeout(600);
    console.log('após', nxt, '->', await cnt(), page.url());
  }
  await page.screenshot({ path: W + '/capturas/23-contador-esqueleto-apos-continuar.png' });
  await ctx.close();
})();
