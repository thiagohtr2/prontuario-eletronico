const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Ver todas as 66 categorias/ }).click();
  await page.waitForTimeout(500);
  console.log(await page.getByRole('complementary', { name: 'Categorias de componentes' }).ariaSnapshot());
  await ctx.close();
})();
