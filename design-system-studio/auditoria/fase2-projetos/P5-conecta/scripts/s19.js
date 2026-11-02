const { run } = require('./lib');
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Ver todas as 66 categorias/ }).click();
  await page.waitForTimeout(500);
  const cat = page.getByRole('complementary', { name: 'Categorias de componentes' });
  await shot('s19-categorias', { el: cat });
  return await cat.ariaSnapshot();
});
