const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('tab', { name: 'Landing page' }).click();
  await page.waitForTimeout(400);
  const card = page.getByRole('button', { name: /^Folha Viva Plantas/ });
  // botão Ver prévia irmão
  const vp = page.getByRole('button', { name: 'Ver prévia' }).nth(2);
  await card.scrollIntoViewIfNeeded();
  await vp.click();
  await page.waitForTimeout(1000);
  await u.shot('g2-folha-previa-dialog');
  const dlg = page.getByRole('dialog');
  console.log('dialogs', await dlg.count());
  if (await dlg.count()) console.log(await dlg.first().ariaSnapshot());
}, { url: URL + '#/guiado/entrada' });
