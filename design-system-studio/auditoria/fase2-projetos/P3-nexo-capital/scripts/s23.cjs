const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /^Sidebars/ }).click();
  await page.waitForTimeout(500);
  const a = page.locator(`#conteudo article[aria-label="Sóbria Corporativa"]`);
  await a.getByRole('button', { name: 'Composição A' }).click();
  await a.getByRole('button', { name: /Selecionar$/ }).click();
  await page.waitForTimeout(700);
  const snap = await page.locator('#conteudo').ariaSnapshot();
  const ls = snap.split('\n'); const i = ls.findIndex(l => l.includes('Header:')); console.log(ls.slice(i, i + 4).join('\n'));
  await page.getByRole('tab', { name: 'Combinação' }).click();
  await page.waitForTimeout(700);
  const s2 = await page.locator('#conteudo').ariaSnapshot();
  const l2 = s2.split('\n'); const j = l2.findIndex(l => l.includes('tablist')); console.log(l2.slice(j, j + 80).join('\n'));
  await page.screenshot({ path: W + '/scripts/tmp-27.png', fullPage: true });
  await ctx.close();
})();
