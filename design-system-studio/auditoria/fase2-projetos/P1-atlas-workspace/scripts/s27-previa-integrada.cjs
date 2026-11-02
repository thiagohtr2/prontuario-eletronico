const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/preview' });
  const p = s.page;
  await p.waitForTimeout(600);
  const pag = p.getByRole('group', { name: 'Página da prévia' });
  const dev = p.getByRole('group', { name: 'Dispositivo da prévia' });
  // localizar o contêiner da prévia: o grupo de dispositivo contém a prévia? tentamos achar o frame
  const info = await p.evaluate(() => {
    const g = document.querySelector('[aria-label="Dispositivo da prévia"]');
    const r = g && g.getBoundingClientRect();
    return { tag: g && g.tagName, cls: g && g.className, r: r && [r.x, r.y, r.width, r.height], parentCls: g && g.parentElement.className };
  });
  console.log(JSON.stringify(info));
  for (const pg of ['Aplicação', 'Login', 'Cadastro']) {
    await pag.getByRole('button', { name: pg, exact: true }).click();
    for (const d of ['Computador', 'Tablet', 'Celular']) {
      await dev.getByRole('button', { name: d, exact: true }).click();
      await p.waitForTimeout(700);
      const nm = ('34-previa-integrada-' + pg + '-' + d).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      await s.shot(nm, { dir: 'capturas', full: true });
    }
  }
  await s.done();
})();
