const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/objetivo' });
  const p = s.page;
  await p.getByRole('radio', { name: /Aplicativo ou SaaS/ }).click();
  await p.getByRole('textbox', { name: 'Nome do projeto' }).fill('Atlas Workspace');
  await p.getByRole('textbox', { name: 'Objetivo', exact: true }).fill('SaaS profissional');
  await p.getByRole('textbox', { name: 'Tecnologia' }).fill('HTML + CSS + JavaScript');
  await p.getByRole('textbox', { name: 'Tecnologia' }).press('Tab');
  await p.waitForTimeout(500);
  await s.shot('02-objetivo-preenchido', { full: true });
  console.log(await s.aria('main'));
  console.log(await p.evaluate(() => JSON.stringify(Object.keys(localStorage))));
  await s.done();
})();
