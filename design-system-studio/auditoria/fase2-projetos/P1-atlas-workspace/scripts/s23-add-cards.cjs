const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/componentes' });
  const p = s.page;
  await p.getByRole('button', { name: '35 Cards' }).click();
  await p.waitForTimeout(600);
  const fam = p.getByRole('button', { name: /Escolher a família Swiss Minimal para Cards/ });
  const card = fam.locator('xpath=ancestor::*[.//button[normalize-space()="Adicionar ao projeto"]][1]');
  await card.getByRole('button', { name: 'Adicionar ao projeto' }).click();
  await p.waitForTimeout(1000);
  console.log('URL', p.url());
  const dlg = p.getByRole('dialog');
  console.log('dialogs', await dlg.count());
  await s.shot('24-cards-apos-adicionar');
  if (await dlg.count()) console.log((await dlg.first().ariaSnapshot()).split('\n').filter(l => !l.includes('- img')).slice(0, 150).join('\n'));
  const reg = p.getByRole('region', { name: /No projeto/ });
  console.log(await reg.ariaSnapshot().catch(e => 'sem region'));
  await s.done();
})();
