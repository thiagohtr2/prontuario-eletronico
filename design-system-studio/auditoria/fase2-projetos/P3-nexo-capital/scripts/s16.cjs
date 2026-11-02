const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  for (const t of ['Formas e superfícies', 'Ajustar cores']) {
    await page.getByRole('tab', { name: t }).click();
    await page.waitForTimeout(500);
    const snap = await page.locator('main').ariaSnapshot();
    const ls = snap.split('\n'); const i = ls.findIndex(l => l.includes('tablist')); const j = ls.findIndex(l => l.includes('complementary "Prévia da identidade"'));
    console.log('=====', t); console.log(ls.slice(i + 5, j).join('\n'));
  }
  await ctx.close();
})();
