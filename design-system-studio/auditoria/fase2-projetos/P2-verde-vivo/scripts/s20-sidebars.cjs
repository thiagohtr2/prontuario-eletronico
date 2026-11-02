const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('tab', { name: /Sidebars/ }).click();
  await page.waitForTimeout(600);
  const m = await page.locator('#conteudo').ariaSnapshot();
  console.log(m.split('\n').filter(l => /Selecionar"|group "Filtrar|button ".* \d+"|img$|strong: ".*:"|aviso|alert|Atenção|layout/i.test(l)).slice(0, 80).join('\n'));
  await u.shot('g8-sidebars');
  await page.getByRole('tab', { name: /Combinação/ }).click();
  await page.waitForTimeout(600);
  await u.shot('g8-combinacao');
  const m2 = await page.locator('#conteudo').ariaSnapshot();
  const i = m2.indexOf('tablist "Tipo de navegação"');
  console.log('COMBINACAO\n', m2.slice(i, i + 5000));
}, { url: URL + '#/guiado/navegacao' });
