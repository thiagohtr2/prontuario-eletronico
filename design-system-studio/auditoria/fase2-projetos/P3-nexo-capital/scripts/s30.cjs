const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  // name the table component in the "No projeto" list
  const nm = page.getByRole('region', { name: /No projeto/ }).getByRole('textbox', { name: 'Nome do componente no projeto' }).first();
  await nm.fill('Tabelas de dados'); await nm.press('Tab');
  await page.waitForTimeout(300);
  async function add(cat, family, name) {
    await page.getByRole('button', { name: /Ver todas as 66 categorias/ }).click().catch(() => {});
    await page.getByRole('button', { name: cat, exact: true }).click();
    await page.waitForTimeout(600);
    const fam = page.getByRole('button', { name: new RegExp('^Escolher a família ' + family + ' para') });
    const idx = await fam.evaluate(el => [...document.querySelectorAll('#conteudo button')].indexOf(el));
    await page.locator('#conteudo button').nth(idx + 1).click();
    await page.waitForTimeout(900);
    const d = page.getByRole('dialog');
    console.log('== added', cat, 'dialog?', await d.count());
    if (await d.count()) {
      const s = await d.first().ariaSnapshot();
      console.log(s.split('\n').filter(l => !/option "/.test(l)).slice(0, 70).join('\n'));
      await d.getByRole('textbox', { name: 'Nome no projeto' }).fill(name);
      await page.waitForTimeout(200);
      await page.screenshot({ path: W + `/scripts/tmp-31-${cat.replace(/\W+/g,'_')}.png` });
      await d.getByRole('button', { name: 'Concluir' }).click();
      await page.waitForTimeout(500);
    }
  }
  await add('41 Gráficos', 'Compact Pro', 'Gráficos');
  await add('58 Dashboard', 'Compact Pro', 'Dashboard financeiro');
  const t = await page.locator('#conteudo').ariaSnapshot();
  const ls = t.split('\n'); const i = ls.findIndex(l => l.includes('region "No projeto'));
  console.log(ls.slice(i, i + 40).join('\n'));
  await ctx.close();
})();
