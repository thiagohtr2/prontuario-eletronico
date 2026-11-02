const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/entrada' });
  const p = s.page;
  await p.getByRole('button', { name: /^Apenas login/ }).click();
  await p.waitForTimeout(500);
  await s.shot('03-entrada-apenas-login', { full: true });
  console.log(await s.aria('main'));
  await s.done();
})();
