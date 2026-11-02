const { open } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/', { waitUntil: 'networkidle' });
  console.log('at load', await page.evaluate(() => JSON.stringify(Object.keys(localStorage))));
  if (process.argv[2]==='w') { await page.evaluate(() => localStorage.setItem('probe','1')); await page.waitForTimeout(1500); }
  await ctx.close();
})();
