const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/mobile' });
  const p = s.page;
  await p.getByRole('button', { name: /^Bottom Navigation clássica\./ }).click();
  await p.waitForTimeout(700);
  const lines = (await s.aria('main')).split('\n').filter(l => !l.includes('/url') && !l.includes('- img'));
  console.log(lines.slice(-30).join('\n'));
  await s.shot('10-mobile-escolhido');
  const prev = p.getByRole('group', { name: /^Prévia do celular/ });
  await prev.scrollIntoViewIfNeeded();
  await s.shot('11-mobile-bottom-nav-classica-previa', { dir: 'capturas', locator: prev });
  // interações: tocar em botões da prévia
  for (const b of ['Buscar', 'Agenda', 'Perfil', 'Notificações', 'Início']) {
    const btn = prev.getByRole('button', { name: b, exact: true }).first();
    if (await btn.count()) { await btn.click(); await p.waitForTimeout(500); await s.shot('11-mobile-previa-toque-' + b.toLowerCase().normalize('NFD').replace(/[^a-z]/g, ''), { dir: 'capturas', locator: prev }); console.log('== após', b); console.log(await prev.ariaSnapshot()); }
  }
  await s.done();
})();
