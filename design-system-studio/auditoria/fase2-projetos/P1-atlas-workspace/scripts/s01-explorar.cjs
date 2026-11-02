const { open } = require('./lib.cjs');
(async () => {
  const s = await open();
  console.log('URL', s.page.url(), 'TITLE', await s.page.title());
  console.log(await s.page.evaluate(() => JSON.stringify(Object.keys(localStorage))));
  await s.shot('01-inicio');
  await s.shot('01-inicio-full', { full: true });
  console.log(await s.aria());
  await s.done();
})();
