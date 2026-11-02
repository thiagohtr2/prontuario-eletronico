const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/desktop' });
  const p = s.page;
  await p.waitForTimeout(500);
  await p.getByRole('complementary', { name: 'Detalhes do layout' }).getByRole('button', { name: 'Prompt deste elemento' }).click();
  await p.waitForTimeout(600);
  const dlg = p.getByRole('dialog').first();
  console.log((await dlg.ariaSnapshot()).split('\n').filter(l => l.includes('button')).join('\n'));
  await p.keyboard.press('Escape');
  // botão de exportar do cabeçalho
  await p.getByRole('button', { name: 'Exportar e importar' }).first().click();
  await p.waitForTimeout(700);
  console.log('URL apos botao header:', p.url());
  const d2 = p.getByRole('dialog');
  console.log('dialogs:', await d2.count());
  if (await d2.count()) console.log(await d2.first().ariaSnapshot());
  await s.done();
})();
