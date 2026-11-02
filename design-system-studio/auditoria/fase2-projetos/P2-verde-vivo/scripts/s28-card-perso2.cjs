const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const reg = page.getByRole('region', { name: /No projeto/ });
  await reg.getByRole('button', { name: 'Personalizar' }).first().click();
  await page.waitForTimeout(700);
  const d = page.getByRole('dialog');
  await d.getByRole('textbox', { name: 'Nome no projeto' }).fill('Card de produto do catálogo');
  await d.getByRole('textbox', { name: 'Título', exact: true }).fill('Nome da planta');
  await d.getByRole('textbox', { name: 'Texto', exact: true }).fill('Descrição curta da planta, porte e cuidados. Preço.');
  await d.getByRole('textbox', { name: 'Botão', exact: true }).fill('Ver produto');
  await d.getByRole('button', { name: 'Trocar ícone' }).click();
  await page.waitForTimeout(600);
  const dd = page.getByRole('dialog');
  console.log('dialogs', await dd.count());
  const snap = await dd.last().ariaSnapshot();
  console.log(snap.slice(0, 5000));
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'trocar-icone.png') });
}, { url: URL + '#/guiado/componentes' });
