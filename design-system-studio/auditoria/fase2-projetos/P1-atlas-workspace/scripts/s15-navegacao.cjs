const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/preview' });
  const p = s.page;
  await p.getByRole('button', { name: 'Continuar: Cores' }).click();
  await p.waitForTimeout(500);
  await p.getByRole('button', { name: 'Continuar: Navegação' }).click();
  await p.waitForTimeout(800);
  console.log('URL', p.url());
  await s.shot('17-navegacao', { full: true });
  console.log((await s.aria('main')).split('\n').filter(l => !l.includes('/url') && !l.includes('- img')).slice(33).join('\n'));
  await s.done();
})();
