const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '37 Tabelas' }).click();
  await page.waitForTimeout(600);
  const fam = page.getByRole('button', { name: 'Escolher a família Compact Pro para Tabelas' });
  const idx = await fam.evaluate(el => [...document.querySelectorAll('#conteudo button')].indexOf(el));
  await page.locator('#conteudo button').nth(idx + 1).click(); // Adicionar ao projeto
  await page.waitForTimeout(900);
  console.log('URL', page.url());
  const d = page.getByRole('dialog');
  if (await d.count()) console.log('DIALOG', await d.first().ariaSnapshot());
  const t = await page.locator('#conteudo').ariaSnapshot();
  const ls = t.split('\n'); const i = ls.findIndex(l => l.includes('region "No projeto'));
  console.log(ls.slice(i, i + 40).join('\n'));
  await page.screenshot({ path: W + '/scripts/tmp-30.png' });
  await ctx.close();
})();
