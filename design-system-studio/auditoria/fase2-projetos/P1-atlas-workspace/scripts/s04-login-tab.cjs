const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/entrada' });
  const p = s.page;
  await p.getByRole('tab', { name: 'Login' }).click();
  await p.waitForTimeout(700);
  await s.shot('04-login-opcoes', { full: true });
  console.log(await s.aria('main'));
  await s.done();
})();
