const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/preview' });
  const p = s.page;
  await p.waitForTimeout(600);
  const pag = p.getByRole('group', { name: 'Página da prévia' });
  const dev = p.getByRole('group', { name: 'Dispositivo da prévia' });
  const stage = p.locator('.lp-stage');
  for (const pg of ['Aplicação', 'Login', 'Cadastro']) {
    await pag.getByRole('button', { name: pg, exact: true }).click();
    for (const d of ['Computador', 'Tablet', 'Celular']) {
      await dev.getByRole('button', { name: d, exact: true }).click();
      await p.waitForTimeout(700);
      const nm = ('34-previa-integrada-' + pg + '-' + d).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      await s.shot(nm + '-palco', { dir: 'capturas', locator: stage });
    }
  }
  // interatividade no celular (aplicação)
  await pag.getByRole('button', { name: 'Aplicação', exact: true }).click();
  await dev.getByRole('button', { name: 'Celular', exact: true }).click();
  await p.waitForTimeout(600);
  console.log((await stage.ariaSnapshot()).split('\n').filter(l => l.includes('button') || l.includes('navigation')).join('\n'));
  await s.done();
})();
