const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/entrada' });
  const p = s.page;
  await p.getByRole('tab', { name: 'Login' }).click();
  await p.getByRole('button', { name: /^Clássico central/ }).click();
  await p.waitForTimeout(500);
  console.log((await s.aria('main')).split('\n').slice(33, 60).join('\n'));
  // abre prévia do selecionado
  await p.getByRole('button', { name: 'Ver prévia' }).first().click();
  await p.waitForTimeout(800);
  await s.shot('05-login-previa-modal');
  const dlg = p.getByRole('dialog');
  console.log('DIALOG count', await dlg.count());
  if (await dlg.count()) console.log(await dlg.first().ariaSnapshot());
  await s.done();
})();
