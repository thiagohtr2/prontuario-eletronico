const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: /Abrir o site Verdant Atelier/ }).click();
  await page.waitForTimeout(1000);
  console.log('URL', page.url(), 'dialogs', await page.getByRole('dialog').count());
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'verdant-aberto.png') });
  const root = (await page.getByRole('dialog').count()) ? page.getByRole('dialog').first() : page.locator('#conteudo');
  const s = await root.ariaSnapshot();
  console.log(s.slice(0, 6000));
  console.log('....', s.slice(-3000));
}, { url: URL + '#/modulos/inspiracao' });
