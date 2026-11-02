const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Ver todas as 66 categorias/ }).click().catch(() => {});
  for (const cat of ['59 Login', '25 Headers e topbars', '26 Sidebars', '64 Layouts mobile']) {
    await page.getByRole('button', { name: cat, exact: true }).click();
    await page.waitForTimeout(600);
    const t = await page.locator('#conteudo').ariaSnapshot();
    const ls = t.split('\n'); const i = ls.findIndex(l => /heading ".*" \[level=2\]/.test(l) && l.includes(cat.replace(/^\d+ /, '')));
    console.log('==', cat); console.log(ls.slice(i, i + 4).join('\n'));
    await page.screenshot({ path: W + `/scripts/tmp-32-${cat.replace(/\W+/g,'_')}.png` });
  }
  await ctx.close();
})();
