const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  const card = page.getByRole('button', { name: 'Escolher a família Compact Pro para Botões' });
  await card.scrollIntoViewIfNeeded();
  // the Adicionar button following it
  const addBtns = page.getByRole('button', { name: 'Adicionar ao projeto' });
  await addBtns.nth(12).click();
  await page.waitForTimeout(800);
  await shot(page, '26-botao-adicionado');
  const d = page.getByRole('dialog');
  console.log('dialogs', await d.count());
  const reg = page.getByRole('region', { name: /No projeto/ });
  console.log('REGION:\n' + (await reg.ariaSnapshot()).slice(0, 4000));
  // all categories
  await page.getByRole('button', { name: /Ver todas as 66 categorias/ }).click();
  await page.waitForTimeout(500);
  const cats = await page.getByRole('complementary', { name: 'Categorias de componentes' }).innerText();
  console.log('CATS:\n' + cats.replace(/\n+/g, ' | '));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
