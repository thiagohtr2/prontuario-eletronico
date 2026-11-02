const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: W + '/scripts/tmp-34.png' });
  for (const t of [/^Itens/, /^Contradições/, 'Especificação JSON']) {
    await page.getByRole('tab', { name: t }).click();
    await page.waitForTimeout(500);
    const s = await page.locator('#conteudo').ariaSnapshot();
    const ls = s.split('\n'); const i = ls.findIndex(l => l.includes('tablist'));
    console.log('=====', t); console.log(ls.slice(i + 5).filter(l => l.length < 600).join('\n').slice(0, 5000));
  }
  await ctx.close();
})();
