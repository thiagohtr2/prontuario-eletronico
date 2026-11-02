const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  console.log('checked?', await page.getByRole('radio', { name: /^Dashboard/ }).getAttribute('aria-checked'));
  await page.getByRole('textbox', { name: 'Nome do projeto' }).fill('Nexo Capital');
  await page.getByRole('textbox', { name: 'Objetivo' }).fill('Plataforma financeira com dashboard financeiro, tabelas de dados e gráficos.');
  await page.getByRole('textbox', { name: 'Descrição resumida' }).fill('Plataforma financeira "Nexo Capital": login profissional, dashboard financeiro com tabelas de dados e gráficos, navegação com sidebar e header, design corporativo e responsividade em telas pequenas.');
  for (const f of ['Login profissional', 'Dashboard financeiro', 'Tabelas de dados']) {
    await page.getByRole('textbox', { name: 'Nova funcionalidade' }).fill(f);
    await page.getByRole('button', { name: 'Adicionar' }).click();
    await page.waitForTimeout(200);
  }
  await page.getByRole('button', { name: 'Gráficos', exact: true }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'HTML + CSS + JavaScript' }).click();
  await page.waitForTimeout(400);
  console.log('tech value:', await page.getByRole('textbox', { name: 'Tecnologia' }).inputValue());
  console.log(await page.locator('main').ariaSnapshot());
  await page.screenshot({ path: W + '/capturas/01-objetivo-preenchido.png', fullPage: true });
  console.log('LS keys', await page.evaluate(() => Object.keys(localStorage)));
  await ctx.close();
})();
