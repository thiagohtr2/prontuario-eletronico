const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('tab', { name: /Contradições/ }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'contradicao-apontada-antes.png') });
  const m = await page.locator('#conteudo').ariaSnapshot();
  const i = m.indexOf('tablist "Partes da Central');
  console.log(m.slice(i, i + 6000));
  await page.getByRole('tab', { name: /Itens/ }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'itens.png'), fullPage: false });
  const m2 = await page.locator('#conteudo').ariaSnapshot();
  const j = m2.indexOf('tablist "Partes da Central');
  console.log('ITENS\n', m2.slice(j, j + 9000));
}, { url: URL + '#/guiado/entrega' });
