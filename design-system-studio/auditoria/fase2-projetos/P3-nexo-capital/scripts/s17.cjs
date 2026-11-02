const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  for (const f of ['Corporativos', 'SaaS']) {
    await page.getByRole('group', { name: 'Filtrar headers' }).getByRole('button', { name: new RegExp('^' + f) }).click();
    await page.waitForTimeout(400);
    const arts = page.locator('main article');
    const n = await arts.count();
    console.log('=====', f, n);
    for (let i = 0; i < n; i++) {
      const a = arts.nth(i);
      const name = await a.getAttribute('aria-label');
      const sel = a.getByRole('button', { name: /Selecionar$/ });
      const t = await sel.first().getAttribute('aria-label') || await sel.first().innerText();
      console.log('-', name, '|', t.replace(/\s+/g, ' '));
    }
    await page.screenshot({ path: W + `/scripts/tmp-22-${f}.png`, fullPage: true });
  }
  await ctx.close();
})();
