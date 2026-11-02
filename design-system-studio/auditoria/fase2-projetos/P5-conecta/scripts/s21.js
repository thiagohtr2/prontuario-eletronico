const { run } = require('./lib');
const cat = process.argv[2] || '35 Cards';
const fam = process.argv[3] || 'Modern Material';
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Ver todas as 66 categorias/ }).click().catch(() => {});
  await page.waitForTimeout(300);
  await page.getByRole('complementary', { name: 'Categorias de componentes' }).getByRole('button', { name: cat, exact: true }).click();
  await page.waitForTimeout(600);
  const famBtn = page.getByRole('button', { name: `Escolher a família ${fam} para ${cat.replace(/^\d+ /, '')}` });
  await famBtn.click();
  await page.waitForTimeout(600);
  await shot('s21-fam-click');
  const dlg = page.getByRole('dialog');
  console.log('dialogs after family click:', await dlg.count());
  if (await dlg.count()) { console.log((await dlg.first().ariaSnapshot()).slice(0, 4000)); }
  return '';
});
