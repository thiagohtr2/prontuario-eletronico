const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/modulos/preview' });
  const p = s.page;
  await p.waitForTimeout(600);
  const dev = p.getByRole('group', { name: 'Dispositivo da prévia' });
  await dev.getByRole('button', { name: 'Celular', exact: true }).click();
  await p.waitForTimeout(700);
  const stage = p.locator('.lp-stage').first();
  await stage.scrollIntoViewIfNeeded();
  await s.shot('37-live-preview-celular-inicial', { dir: 'capturas', locator: stage });
  const n = stage.getByRole('button', { name: 'Notificações' });
  await n.click(); await p.waitForTimeout(600);
  await s.shot('37-live-preview-celular-notificacoes', { dir: 'capturas', locator: stage });
  console.log('apos notif:', (await stage.ariaSnapshot()).split('\n').slice(0, 12).join('\n'));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  for (const b of ['Buscar', 'Perfil']) {
    await stage.getByRole('navigation').getByRole('button', { name: b }).click(); await p.waitForTimeout(500);
    await s.shot('37-live-preview-celular-toque-' + b.toLowerCase(), { dir: 'capturas', locator: stage });
    console.log('apos', b, ':', (await stage.innerText()).split('\n').slice(0, 4).join(' | '));
  }
  await s.done();
})();
