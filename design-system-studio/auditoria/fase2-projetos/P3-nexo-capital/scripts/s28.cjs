const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '37 Tabelas' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: W + '/scripts/tmp-29.png', fullPage: true });
  const t = await page.locator('#conteudo').ariaSnapshot();
  const ls = t.split('\n'); const i = ls.findIndex(l => l.includes('heading "Tabelas"'));
  console.log(ls.slice(i, i + 12).join('\n'));
  await ctx.close();
})();
