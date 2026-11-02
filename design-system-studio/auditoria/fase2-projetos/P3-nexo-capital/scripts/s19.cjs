const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('group', { name: 'Filtrar headers' }).getByRole('button', { name: /^SaaS/ }).click();
  await page.waitForTimeout(400);
  // reset Painel de Trabalho to A (was toggled while exploring)
  const pt = page.locator('main article[aria-label="Painel de Trabalho"]');
  await pt.getByRole('button', { name: 'Composição A' }).click();
  const a = page.locator('main article[aria-label="Painel Analítico"]');
  await a.getByRole('button', { name: 'Composição A' }).click();
  await page.waitForTimeout(300);
  await a.getByRole('button', { name: /Selecionar$/ }).click();
  await page.waitForTimeout(700);
  const snap = await page.locator('main').ariaSnapshot();
  const ls = snap.split('\n'); const i = ls.findIndex(l => l.includes('Header:')); console.log(ls.slice(i - 2, i + 6).join('\n'));
  await a.scrollIntoViewIfNeeded();
  await page.screenshot({ path: W + '/scripts/tmp-24.png' });
  console.log(await a.ariaSnapshot().then(s => s.split('\n').slice(-14).join('\n')));
  await ctx.close();
})();
