const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/desktop' });
  const p = s.page;
  await p.waitForTimeout(600);
  const det = p.getByRole('complementary', { name: 'Detalhes do layout' });
  await s.shot('09-desktop-sidebar-integral-classica-previa-grande', { dir: 'capturas', locator: det });
  // legenda desligada
  await p.getByRole('switch', { name: 'Mostrar legendas nos desenhos' }).click({ force: true });
  await p.waitForTimeout(400);
  await s.shot('09-desktop-sidebar-integral-classica-previa-grande-sem-legendas', { dir: 'capturas', locator: det });
  await p.getByRole('switch', { name: 'Mostrar legendas nos desenhos' }).click({ force: true });
  // Prompt deste elemento
  await det.getByRole('button', { name: 'Prompt deste elemento' }).click();
  await p.waitForTimeout(700);
  const dlg = p.getByRole('dialog');
  console.log('dialog', await dlg.count());
  if (await dlg.count()) { await s.shot('09-desktop-prompt-do-elemento', { dir: 'capturas', locator: dlg.first() }); console.log((await dlg.first().innerText()).slice(0, 1500)); }
  await s.done();
})();
