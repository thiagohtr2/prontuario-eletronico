const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/componentes' });
  const p = s.page;
  await p.getByRole('button', { name: '35 Cards' }).click();
  await p.waitForTimeout(700);
  await s.shot('23-cards-familias', { full: true });
  const fam = p.getByRole('button', { name: /Escolher a família Swiss Minimal para Cards/ });
  await fam.scrollIntoViewIfNeeded();
  await fam.click();
  await p.waitForTimeout(800);
  await s.shot('23-cards-swiss-clicado');
  const dlg = p.getByRole('dialog');
  console.log('dialogs', await dlg.count());
  if (await dlg.count()) console.log((await dlg.first().ariaSnapshot()).split('\n').filter(l => !l.includes('- img')).slice(0, 120).join('\n'));
  else console.log((await p.locator('main#conteudo').ariaSnapshot()).split('\n').filter(l => !l.includes('/url') && !l.includes('- img')).slice(-60).join('\n'));
  await s.done();
})();
