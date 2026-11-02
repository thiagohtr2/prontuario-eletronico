const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Ver todas as 66 categorias' }).click();
  for (const cat of ['8 Campos de busca', '34 Drawers']) {
    await page.getByRole('button', { name: cat, exact: true }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Adicionar ao projeto' }).first().click();
    await page.waitForTimeout(900);
    const d = page.getByRole('dialog');
    const s = await d.ariaSnapshot();
    const i = s.indexOf('Configuração da instância');
    console.log('=====', cat, '\n', s.slice(0, 400), '\n...\n', s.slice(i, i + 2500));
    await page.screenshot({ path: u.path.join(u.W, 'scratch', 'add-' + cat.replace(/ /g, '_') + '.png') });
    await d.getByRole('button', { name: 'Concluir' }).click();
    await page.waitForTimeout(500);
  }
}, { url: URL + '#/guiado/componentes' });
