const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Sem sidebar 5' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^Navegação superior de duas linhas\./ }).click();
  await page.waitForTimeout(700);
  console.log('dialogs', await page.getByRole('dialog').count());
  await u.shot('g3-click-duaslinhas');
  const aside = page.getByRole('complementary', { name: 'Detalhes do layout' });
  if (await aside.count()) console.log(await aside.ariaSnapshot());
  const m = await page.locator('main').ariaSnapshot();
  console.log(m.split('\n').filter(l => /Continuar|Escolha|pressed|selecionad/i.test(l)).join('\n'));
}, { url: URL + '#/guiado/desktop' });
