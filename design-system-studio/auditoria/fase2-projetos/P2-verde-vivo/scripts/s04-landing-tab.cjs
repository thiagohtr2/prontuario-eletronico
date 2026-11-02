const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('tab', { name: 'Landing page' }).click();
  await page.waitForTimeout(600);
  await u.shot('g2-landing-tab');
  await u.shot('g2-landing-tab-full', { full: true });
  console.log(await page.locator('main').ariaSnapshot());
}, { url: URL + '#/guiado/entrada' });
