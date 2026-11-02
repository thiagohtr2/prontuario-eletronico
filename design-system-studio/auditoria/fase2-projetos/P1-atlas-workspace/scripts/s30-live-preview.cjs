const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/modulos/preview' });
  const p = s.page;
  await p.waitForTimeout(700);
  const dev = p.getByRole('group', { name: 'Dispositivo da prévia' });
  const stage = p.locator('.lp-stage').first();
  console.log('stage count', await p.locator('.lp-stage').count());
  for (const d of ['Computador', 'Tablet', 'Celular']) {
    await dev.getByRole('button', { name: d, exact: true }).click();
    await p.waitForTimeout(700);
    await s.shot('36-live-site-preview-aplicacao-' + d.toLowerCase(), { dir: 'capturas' });
  }
  await dev.getByRole('button', { name: 'Computador', exact: true }).click();
  await p.waitForTimeout(500);
  // menu de perfil
  const perfil = p.getByRole('button', { name: 'Abrir menu do perfil' }).first();
  await perfil.click(); await p.waitForTimeout(500);
  await s.shot('36-live-preview-desktop-menu-perfil-sidebar', { dir: 'capturas' });
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  const notif = p.getByRole('button', { name: /Notificações/ }).first();
  if (await notif.count()) { await notif.click(); await p.waitForTimeout(500); await s.shot('36-live-preview-desktop-notificacoes', { dir: 'capturas' }); await p.keyboard.press('Escape'); }
  await p.waitForTimeout(300);
  const rec = p.getByRole('button', { name: 'Recolher menu' }).first();
  await rec.click(); await p.waitForTimeout(600);
  await s.shot('36-live-preview-desktop-sidebar-recolhida', { dir: 'capturas' });
  console.log('apos recolher:', await p.getByRole('button', { name: /menu/i }).allInnerTexts());
  await s.done();
})();
