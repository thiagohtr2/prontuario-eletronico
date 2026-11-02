const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/componentes' });
  const p = s.page;
  await p.getByRole('button', { name: /Ver todas as 66 categorias/ }).click();
  await p.waitForTimeout(600);
  console.log((await p.getByRole('complementary', { name: 'Categorias de componentes' }).ariaSnapshot()).split('\n').filter(l => !l.includes('- img')).join('\n'));
  await s.done();
})();
