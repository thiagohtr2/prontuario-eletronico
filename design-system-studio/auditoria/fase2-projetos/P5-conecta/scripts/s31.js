const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByRole('tab', { name: /^Itens/ }).click();
  await page.waitForTimeout(500);
  const item = page.getByRole('listitem').filter({ hasText: 'navigation.header' }).first();
  await item.getByRole('button', { name: 'Adicionar observação ou exceção' }).click();
  await page.waitForTimeout(500);
  await shot('s31-obs');
  console.log(await item.ariaSnapshot());
  const dlg = page.getByRole('dialog');
  if (await dlg.count()) console.log('DIALOG', await dlg.first().ariaSnapshot());
});
