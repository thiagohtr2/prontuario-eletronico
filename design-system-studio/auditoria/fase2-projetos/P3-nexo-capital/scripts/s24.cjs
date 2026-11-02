const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Combinação' }).click();
  await page.waitForTimeout(700);
  const s2 = await page.locator('#conteudo').ariaSnapshot();
  const l2 = s2.split('\n'); const j = l2.findIndex(l => l.includes('Arranjo')); console.log(l2.slice(j - 2, l2.length).filter(l => !/option "/.test(l)).join('\n'));
  await ctx.close();
})();
