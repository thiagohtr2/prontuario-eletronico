const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('group', { name: 'Filtrar headers' }).getByRole('button', { name: /^SaaS/ }).click();
  await page.waitForTimeout(400);
  const arts = page.locator('main article');
  const n = await arts.count();
  for (let i = 0; i < n; i++) {
    const name = await arts.nth(i).getAttribute('aria-label');
    const sel = arts.nth(i).getByRole('button', { name: /Selecionar$/ });
    const t = (await sel.count()) ? (await sel.first().getAttribute('aria-label') || await sel.first().innerText()) : '';
    console.log(i, name, '|', t.replace(/\n/g,' ').slice(0, 220));
  }
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
