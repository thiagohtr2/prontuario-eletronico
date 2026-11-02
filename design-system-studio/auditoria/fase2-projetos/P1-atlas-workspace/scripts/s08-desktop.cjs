const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/desktop' });
  const p = s.page;
  await p.getByRole('button', { name: /^Sidebar integral clássica\./ }).click();
  await p.waitForTimeout(500);
  const det = p.getByRole('complementary', { name: 'Detalhes do layout' });
  console.log(await det.ariaSnapshot());
  await s.shot('09-desktop-detalhe-antes', { locator: det });
  await det.getByRole('button', { name: 'Escolher este modelo' }).click();
  await p.waitForTimeout(800);
  await s.shot('09-desktop-escolhido');
  console.log('----- APOS');
  console.log((await s.aria('main')).split('\n').filter(l => !l.includes('/url')).slice(-60).join('\n'));
  const dl = p.getByRole('dialog');
  if (await dl.count()) console.log('DIALOG', await dl.first().ariaSnapshot());
  await s.done();
})();
