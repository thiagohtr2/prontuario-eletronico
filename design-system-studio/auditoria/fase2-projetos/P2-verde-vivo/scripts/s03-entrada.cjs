const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: /^Landing page sem login/ }).click();
  await page.waitForTimeout(500);
  await u.shot('g2-entrada-fluxo');
  console.log(await page.locator('main').ariaSnapshot());
}, { url: URL + '#/guiado/entrada' });
