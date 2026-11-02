const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Ver todas as 66 categorias' }).click();
  await page.getByRole('button', { name: '35 Cards', exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Adicionar ao projeto' }).first().click();
  await page.waitForTimeout(1000);
  console.log('dialogs', await page.getByRole('dialog').count());
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'cards-apos-add.png') });
  if (await page.getByRole('dialog').count()) console.log((await page.getByRole('dialog').first().ariaSnapshot()).slice(0, 8000));
  else { const m = await page.locator('#conteudo').ariaSnapshot(); const i = m.indexOf('No projeto'); console.log(m.slice(i - 200, i + 3000)); }
}, { url: URL + '#/guiado/componentes' });
