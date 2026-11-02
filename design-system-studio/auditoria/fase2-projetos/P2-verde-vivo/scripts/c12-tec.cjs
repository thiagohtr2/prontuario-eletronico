const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'etapa1-objetivo-tecnologia-html-css-js.png') });
  console.log(await page.getByRole('textbox', { name: 'Tecnologia' }).inputValue());
}, { url: URL + '#/guiado/objetivo' });
