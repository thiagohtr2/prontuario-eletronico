const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /^Sidebars/ }).click();
  await page.waitForTimeout(500);
  const snap = await page.locator('#conteudo').ariaSnapshot();
  const ls = snap.split('\n'); const i = ls.findIndex(l => l.includes('tablist')); 
  console.log(ls.slice(i, i + 25).join('\n'));
  const arts = page.locator('#conteudo article');
  const n = await arts.count();
  for (let k = 0; k < n; k++) {
    const a = arts.nth(k);
    const sel = a.getByRole('button', { name: /Selecionar$|Selecionado$/ });
    const t = (await sel.first().getAttribute('aria-label')) || await sel.first().innerText();
    console.log('-', t.replace(/\s+/g, ' '));
  }
  await ctx.close();
})();
