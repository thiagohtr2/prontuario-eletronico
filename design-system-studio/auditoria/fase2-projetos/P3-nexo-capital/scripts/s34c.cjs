const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(5000);
  await page.goto('http://127.0.0.1:4300/#/guiado/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const dv = page.getByRole('group', { name: 'Dispositivo da prévia' });
  await dv.getByRole('button', { name: 'Celular' }).click();
  await page.waitForTimeout(700);
  const s = await page.locator('#conteudo').ariaSnapshot();
  const ls = s.split('\n'); const i = ls.findIndex(l => l.includes('Dispositivo da prévia'));
  console.log(ls.slice(i, i + 40).join('\n'));
  await page.screenshot({ path: W + '/scripts/tmp-41.png' });
  await ctx.close();
})();
