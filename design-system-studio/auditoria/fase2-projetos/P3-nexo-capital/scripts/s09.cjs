const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/desktop', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Sidebar integral clássica\./ }).click();
  await page.waitForTimeout(600);
  console.log(await page.getByRole('complementary', { name: 'Detalhes do layout' }).ariaSnapshot());
  const dlg = page.getByRole('dialog');
  console.log('dialogs', await dlg.count());
  await page.screenshot({ path: W + '/scripts/tmp-11.png' });
  console.log((await page.locator('main').ariaSnapshot()).split('\n').slice(-12).join('\n'));
  await ctx.close();
})();
