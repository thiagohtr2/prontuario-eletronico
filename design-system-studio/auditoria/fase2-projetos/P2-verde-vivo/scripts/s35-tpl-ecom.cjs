const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Abrir o template E-commerce de moda' }).click();
  await page.waitForTimeout(1200);
  console.log('URL', page.url(), 'dialogs', await page.getByRole('dialog').count());
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'tpl-ecom.png') });
  const root = (await page.getByRole('dialog').count()) ? page.getByRole('dialog').first() : page.locator('#conteudo');
  const s = await root.ariaSnapshot();
  console.log(s.length, s.slice(0, 2500));
  console.log('....', s.slice(-4500));
}, { url: URL + '#/modulos/templates' });
