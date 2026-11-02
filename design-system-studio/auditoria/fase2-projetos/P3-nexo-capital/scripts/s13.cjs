const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/revisao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Aprovar esqueleto e continuar' }).click();
  await page.waitForTimeout(800);
  console.log('URL', page.url());
  const dlg = page.getByRole('dialog');
  if (await dlg.count()) console.log(await dlg.first().ariaSnapshot());
  else console.log((await page.locator('main').ariaSnapshot()).split('\n').slice(0, 60).join('\n'));
  await page.screenshot({ path: W + '/scripts/tmp-17.png' });
  await ctx.close();
})();
