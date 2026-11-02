const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/entrada' });
  const p = s.page;
  await p.getByRole('tab', { name: 'Cadastro' }).click();
  await p.waitForTimeout(700);
  await s.shot('06-cadastro-opcoes', { full: true });
  console.log((await s.aria('main')).split('\n').slice(33).join('\n'));
  await s.done();
})();
