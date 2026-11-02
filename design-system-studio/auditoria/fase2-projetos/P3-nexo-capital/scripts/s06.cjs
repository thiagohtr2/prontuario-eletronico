const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Login' }).click();
  await page.waitForTimeout(400);
  const card = page.getByRole('button', { name: /^Acesso corporativo/ });
  // the "Ver prévia" following the card
  const idx = await page.getByRole('button', { name: /^Acesso corporativo/ }).evaluate(el => {
    const all = [...document.querySelectorAll('main button')];
    return all.indexOf(el);
  });
  const btns = page.locator('main button');
  await btns.nth(idx + 1).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: W + '/scripts/tmp-07.png' });
  const dlg = page.getByRole('dialog');
  if (await dlg.count()) console.log(await dlg.first().ariaSnapshot());
  await ctx.close();
})();
