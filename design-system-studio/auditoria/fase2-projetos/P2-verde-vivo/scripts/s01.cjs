const { withPage } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  console.log('URL', page.url(), 'TITLE', await page.title());
  console.log('LS', await page.evaluate(() => JSON.stringify(Object.keys(localStorage))));
  await u.shot('s01-inicial');
  await u.shot('s01-inicial-full', { full: true });
  const snap = await page.locator('body').ariaSnapshot();
  console.log(snap.slice(0, 12000));
});
