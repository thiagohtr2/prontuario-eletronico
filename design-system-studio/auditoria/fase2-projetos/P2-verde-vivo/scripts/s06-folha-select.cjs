const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('tab', { name: 'Landing page' }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Ver prévia' }).nth(2).click();
  await page.waitForTimeout(800);
  await page.getByRole('dialog').getByRole('button', { name: 'Selecionar este modelo' }).click();
  await page.waitForTimeout(800);
  console.log('dialog after select:', await page.getByRole('dialog').count());
  await u.shot('g2-folha-selecionada');
  const m = await page.locator('main').ariaSnapshot();
  console.log(m.split('\n').filter(l => /selecionad|Selecionad|Continuar|Escolha|pressed|Folha/.test(l)).join('\n'));
}, { url: URL + '#/guiado/entrada' });
