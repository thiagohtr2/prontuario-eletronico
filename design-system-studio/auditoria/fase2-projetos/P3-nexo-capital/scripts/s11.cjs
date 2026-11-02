const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const phone = page.getByRole('group', { name: /Prévia do celular/ });
  await phone.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: W + '/capturas/04-mobile-drawer-esquerda-escolhido.png' });
  const box = await phone.boundingBox(); console.log(box);
  await phone.screenshot({ path: W + '/capturas/05-mobile-previa-grande-drawer-fechado.png' });
  await phone.getByRole('button', { name: 'Abrir menu' }).click();
  await page.waitForTimeout(700);
  await phone.screenshot({ path: W + '/capturas/06-mobile-previa-grande-drawer-aberto.png' });
  console.log(await phone.ariaSnapshot());
  await ctx.close();
})();
