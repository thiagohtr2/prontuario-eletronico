const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.waitForTimeout(500);
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'bug-contador-esqueleto-0de5-antes-de-aprovar.png') });
  await page.getByRole('heading', { name: 'Esqueleto aprovado' }).scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 250);
  await page.waitForTimeout(400);
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'revisao-esqueleto-antes-de-aprovar.png') });
  await page.getByRole('button', { name: 'Aprovar esqueleto e continuar' }).click();
  await page.waitForTimeout(1200);
  console.log('URL', page.url());
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'apos-aprovar.png') });
  const b = await page.locator('banner').ariaSnapshot();
  console.log(b);
  console.log((await page.locator('main').ariaSnapshot()).slice(0, 25000));
}, { url: URL + '#/guiado/revisao' });
