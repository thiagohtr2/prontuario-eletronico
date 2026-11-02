const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Layouts híbridos 9' }).click();
  await page.waitForTimeout(300);
  const ph = page.getByRole('group', { name: /^Prévia do celular/ });
  await ph.scrollIntoViewIfNeeded();
  await ph.screenshot({ path: u.path.join(u.W, 'capturas', 'mobile-escolhido-prevJa-grande-fechado.png') });
  await ph.getByRole('button', { name: 'Buscar' }).click();
  await page.waitForTimeout(600);
  await ph.screenshot({ path: u.path.join(u.W, 'scratch', 'm-buscar.png') });
  console.log('APOS BUSCAR\n', await ph.ariaSnapshot());
  const dl = await page.getByRole('dialog').count();
  console.log('dialogs', dl);
}, { url: URL + '#/guiado/mobile' });
