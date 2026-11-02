const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Corporativas/ }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^Azul Institucional/ }).click();
  await page.waitForTimeout(700);
  console.log('pressed', await page.getByRole('button', { name: /^Azul Institucional/ }).getAttribute('aria-pressed'));
  await page.screenshot({ path: W + '/capturas/09-identidade-paleta-azul-institucional.png' });
  await page.getByRole('tab', { name: 'Tipografia' }).click();
  await page.waitForTimeout(500);
  const snap = await page.locator('main').ariaSnapshot();
  const ls = snap.split('\n'); const i = ls.findIndex(l => l.includes('tablist')); 
  console.log(ls.slice(i, i + 120).join('\n'));
  await page.screenshot({ path: W + '/scripts/tmp-20.png', fullPage: true });
  await ctx.close();
})();
