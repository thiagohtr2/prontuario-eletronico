// uso: node ver.cjs <hash> <nome> [full=1]
const { open, BASE } = require('./lib.cjs');
(async () => {
  const [hash, name, full] = process.argv.slice(2);
  const s = await open({ url: BASE + hash });
  await s.page.waitForTimeout(600);
  await s.shot(name, { full: full === '1' });
  console.log(await s.aria('main'));
  await s.done();
})();
