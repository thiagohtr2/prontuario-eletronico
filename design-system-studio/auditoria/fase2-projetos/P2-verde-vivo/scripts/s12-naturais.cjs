const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Naturais 6' }).click();
  await page.waitForTimeout(500);
  await u.shot('g7-naturais');
}, { url: URL + '#/guiado/identidade' });
