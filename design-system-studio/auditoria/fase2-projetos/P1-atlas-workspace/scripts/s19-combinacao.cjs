const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/navegacao' });
  const p = s.page;
  await p.getByRole('tab', { name: 'Combinação' }).click();
  await p.waitForTimeout(600);
  const arr = p.getByRole('button', { name: 'Header por cima' });
  console.log('header por cima pressed:', await arr.getAttribute('aria-pressed'));
  await arr.scrollIntoViewIfNeeded();
  await p.mouse.wheel(0, 350); await p.waitForTimeout(400);
  await s.shot('21-combinacao-arranjo-header-por-cima-padrao', { dir: 'capturas' });
  await p.getByRole('button', { name: 'Sidebar inteira' }).click();
  await p.waitForTimeout(600);
  console.log('sidebar inteira pressed:', await p.getByRole('button', { name: 'Sidebar inteira' }).getAttribute('aria-pressed'));
  await s.shot('21-combinacao-arranjo-sidebar-inteira', { dir: 'capturas' });
  const note = await p.locator('main#conteudo').innerText();
  const m = note.match(/Logo uma vez[^\n]*/g); console.log(m);
  // recarrega para ver se persiste
  await p.reload({ waitUntil: 'networkidle' });
  await p.getByRole('tab', { name: 'Combinação' }).click();
  await p.waitForTimeout(500);
  console.log('apos reload sidebar inteira pressed:', await p.getByRole('button', { name: 'Sidebar inteira' }).getAttribute('aria-pressed'));
  await s.done();
})();
