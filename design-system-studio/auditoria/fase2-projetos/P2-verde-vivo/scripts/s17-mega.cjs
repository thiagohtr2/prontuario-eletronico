const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const a = page.getByRole('article', { name: 'Mega Empório', exact: true });
  await a.scrollIntoViewIfNeeded();
  await a.getByRole('button', { name: 'Ver em tamanho grande' }).click();
  await page.waitForTimeout(800);
  const d = page.getByRole('dialog');
  console.log('dialog', await d.count());
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'mega-grande.png') });
  console.log((await d.ariaSnapshot()).slice(0, 3000));
  const dep = d.getByRole('button', { name: /^Departamentos/ });
  if (await dep.count()) { await dep.first().click(); await page.waitForTimeout(600); await page.screenshot({ path: u.path.join(u.W, 'scratch', 'mega-grande-departamentos.png') }); }
}, { url: URL + '#/guiado/navegacao' });
