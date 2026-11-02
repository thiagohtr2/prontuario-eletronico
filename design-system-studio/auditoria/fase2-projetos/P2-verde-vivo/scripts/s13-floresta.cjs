const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Naturais 6' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^Floresta Naturais/ }).click();
  await page.waitForTimeout(800);
  await u.shot('g7-floresta-selecionada');
  const m = await page.locator('main').ariaSnapshot();
  console.log(m.split('\n').filter(l => /pressed|Selecionad|Floresta/.test(l)).join('\n'));
  await page.getByRole('tab', { name: 'Tipografia' }).click();
  await page.waitForTimeout(600);
  await u.shot('g7-tipografia');
  const m2 = await page.locator('main').ariaSnapshot();
  const i = m2.indexOf('tablist');
  console.log(m2.slice(i, i + 12000));
}, { url: URL + '#/guiado/identidade' });
