const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  await page.goto('http://127.0.0.1:4300/#/modulos/templates', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Abrir o template Dashboard administrativo/ }).click();
  await page.waitForTimeout(900);
  console.log('URL', page.url());
  const d = page.getByRole('dialog');
  const root = (await d.count()) ? d.first() : page.locator('#conteudo');
  console.log((await root.ariaSnapshot()).split('\n').filter(l => l.length < 300).slice(110, 200).join('\n'));
  await page.screenshot({ path: W + '/scripts/tmp-45.png' });
  await ctx.close();
})();
