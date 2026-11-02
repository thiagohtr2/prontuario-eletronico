const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/modulos/desktop', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const det = page.getByRole('complementary', { name: 'Detalhes do layout' });
  await det.locator('summary').first().click().catch(e => console.log('no summary', e.message));
  await page.waitForTimeout(500);
  console.log(await det.ariaSnapshot());
  await det.scrollIntoViewIfNeeded();
  await page.screenshot({ path: W + '/capturas/13-desktop-previa-grande-sidebar-integral-classica.png' });
  await det.screenshot({ path: W + '/capturas/14-desktop-detalhes-tecnicos-layout.png' });
  await ctx.close();
})();
