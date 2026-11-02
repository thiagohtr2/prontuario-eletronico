const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Ver todas as 66 categorias' }).click();
  await page.waitForTimeout(300);
  for (const [cat, f] of [['35 Cards', 'cards'], ['8 Campos de busca', 'busca'], ['39 Badges e tags', 'badges']]) {
    await page.getByRole('button', { name: cat, exact: true }).click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: u.path.join(u.W, 'scratch', 'g9-' + f + '-full.png'), fullPage: true });
    const m = await page.locator('#conteudo').ariaSnapshot();
    const lines = m.split('\n');
    const i = lines.findIndex(l => /heading ".*" \[level=2\]/.test(l) && !/Categorias/.test(l));
    console.log('=====', cat);
    console.log(lines.filter(l => /heading .*level=2|paragraph: |Escolher a família/.test(l)).slice(0, 25).join('\n'));
  }
}, { url: URL + '#/guiado/componentes' });
