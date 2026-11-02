const { run } = require('./lib');
const cat = process.argv[2] || '35 Cards';
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Ver todas as 66 categorias/ }).click().catch(() => {});
  await page.waitForTimeout(300);
  await page.getByRole('complementary', { name: 'Categorias de componentes' }).getByRole('button', { name: cat, exact: true }).click();
  await page.waitForTimeout(800);
  await shot('s20-' + cat.replace(/\s+/g, '_'), { full: true });
  const s = await page.locator('#conteudo').ariaSnapshot();
  const i = s.indexOf('heading "' + cat.replace(/^\d+ /, ''));
  return s.slice(i, i + 3500);
});
