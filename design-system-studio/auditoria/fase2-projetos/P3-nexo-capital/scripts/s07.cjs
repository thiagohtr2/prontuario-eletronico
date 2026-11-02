const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Login' }).click();
  await page.waitForTimeout(400);
  const idx = await page.getByRole('button', { name: /^Acesso corporativo/ }).evaluate(el => [...document.querySelectorAll('main button')].indexOf(el));
  await page.locator('main button').nth(idx + 1).click();
  await page.waitForTimeout(600);
  await page.getByRole('dialog').getByRole('button', { name: 'Selecionar este modelo' }).click();
  await page.waitForTimeout(600);
  console.log('dialog open after select?', await page.getByRole('dialog').count());
  console.log(await page.locator('main').ariaSnapshot().then(s => s.split('\n').slice(0, 80).join('\n')));
  await page.screenshot({ path: W + '/scripts/tmp-08.png' });
  await ctx.close();
})();
