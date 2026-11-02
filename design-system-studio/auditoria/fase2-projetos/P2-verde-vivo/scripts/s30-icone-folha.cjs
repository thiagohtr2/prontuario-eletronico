const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const reg = page.getByRole('region', { name: /No projeto/ });
  await reg.getByRole('button', { name: 'Personalizar' }).first().click();
  await page.waitForTimeout(700);
  const d = page.getByRole('dialog');
  await d.getByRole('button', { name: 'Trocar ícone' }).click();
  await page.waitForTimeout(300);
  await d.getByRole('searchbox', { name: 'Buscar ícone' }).fill('folha');
  await page.waitForTimeout(300);
  await d.getByRole('group', { name: 'Biblioteca de ícones' }).getByRole('button', { name: 'Folha' }).click();
  await page.waitForTimeout(500);
  const s = await d.ariaSnapshot();
  console.log(s.split('\n').filter(l => /Ícone|text: Novo/.test(l)).join('\n'));
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'componente-card-produto-soft-pill-personalizado.png') });
  await d.getByRole('button', { name: 'Concluir' }).click();
  await page.waitForTimeout(500);
  console.log('dialogs after concluir', await page.getByRole('dialog').count());
}, { url: URL + '#/guiado/componentes' });
