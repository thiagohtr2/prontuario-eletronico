const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Layouts híbridos 9' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^Header fixo com busca e menu inferior flutuante\./ }).click();
  await page.waitForTimeout(800);
  await u.shot('g4-mobile-escolhido');
  const m = await page.locator('main').ariaSnapshot();
  const i = m.indexOf('Escolhido');
  console.log(m.slice(m.indexOf('- text: Exemplo') > 0 ? m.indexOf('- text: Exemplo') : Math.max(0, m.length - 4000)));
}, { url: URL + '#/guiado/mobile' });
