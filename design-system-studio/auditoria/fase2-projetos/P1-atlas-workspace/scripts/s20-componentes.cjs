const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/navegacao' });
  const p = s.page;
  await p.getByRole('button', { name: 'Continuar: Componentes' }).click();
  await p.waitForTimeout(900);
  console.log('URL', p.url());
  await s.shot('22-componentes', { full: false });
  console.log((await p.locator('main#conteudo').ariaSnapshot()).split('\n').filter(l => !l.includes('/url') && !l.includes('- img')).slice(33, 400).join('\n'));
  await s.done();
})();
