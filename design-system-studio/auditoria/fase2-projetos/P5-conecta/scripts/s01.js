const { run } = require('./lib');
run(async ({ page, shot }) => {
  const ls = await page.evaluate(() => Object.keys(localStorage));
  console.log('localStorage keys (inicio):', ls);
  console.log('title:', await page.title());
  await shot('s01-home');
  await shot('s01-home-full', { full: true });
  const snap = await page.locator('body').ariaSnapshot();
  return snap;
});
