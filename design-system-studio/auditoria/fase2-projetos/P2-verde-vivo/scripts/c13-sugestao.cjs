const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const s = page.getByText('Sugestão (opcional):');
  await s.scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollBy(0, -250)); await page.waitForTimeout(300);
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'observacao-sugestao-loja-landing-com-login.png') });
}, { url: URL + '#/guiado/objetivo' });
