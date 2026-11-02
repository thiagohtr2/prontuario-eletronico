const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Ver todas as 66 categorias' }).click();
  await page.waitForTimeout(600);
  const c = page.getByRole('complementary', { name: 'Categorias de componentes' });
  console.log(await c.ariaSnapshot());
  await c.screenshot({ path: u.path.join(u.W, 'scratch', 'g9-categorias.png') });
}, { url: URL + '#/guiado/componentes' });
