const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('radio', { name: /Loja ou catálogo/ }).click();
  await page.getByRole('textbox', { name: 'Nome do projeto' }).fill('Verde Vivo');
  await page.getByRole('textbox', { name: 'Objetivo' }).fill('Loja de plantas online: apresentar a marca e vender plantas pelo catálogo');
  await page.getByRole('textbox', { name: 'Descrição resumida' }).fill('Loja de plantas "Verde Vivo" com landing page, catálogo de produtos em cards, busca, filtros, header com navegação e navegação mobile. Design com inspiração botânica e identidade visual apropriada para uma loja de plantas.');
  const feats = ['Landing page', 'Catálogo de produtos', 'Header com navegação', 'Cards de produtos', 'Busca', 'Filtros', 'Navegação mobile'];
  for (const f of feats) {
    await page.getByRole('textbox', { name: 'Nova funcionalidade' }).fill(f);
    await page.getByRole('button', { name: 'Adicionar' }).click();
    await page.waitForTimeout(150);
  }
  await page.getByRole('button', { name: 'HTML + CSS + JavaScript' }).click();
  await page.waitForTimeout(400);
  console.log('TEC=', await page.getByRole('textbox', { name: 'Tecnologia' }).inputValue());
  await u.shot('g1-objetivo-preenchido-full', { full: true });
  console.log(await page.locator('main').ariaSnapshot());
  console.log('LS keys', await page.evaluate(() => Object.keys(localStorage)));
}, { url: URL + '#/guiado/objetivo' });
