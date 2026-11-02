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
  const catName = cat.replace(/^\d+ /, '');
  const famBtn = page.getByRole('button', { name: `Escolher a família ${fam} para ${catName}` });
  // botão Adicionar logo após o botão da família: pegar o card que contém famBtn
  const card = famBtn.locator('xpath=ancestor::*[.//button[normalize-space()="Adicionar ao projeto" or contains(.,"Adicionar ao projeto")]][1]');
  await card.getByRole('button', { name: /Adicionar ao projeto/ }).click();
  await page.waitForTimeout(900);
  await shot('s22-apos-adicionar-' + catName.replace(/\s+/g, '_'));
  const dlg = page.getByRole('dialog');
  console.log('dialogs:', await dlg.count(), 'url:', page.url());
  if (await dlg.count()) { console.log((await dlg.first().ariaSnapshot()).slice(0, 6000)); }
  else {
    const s = await page.locator('#conteudo').ariaSnapshot();
    const i = s.indexOf('region "No projeto');
    console.log(s.slice(i, i + 3000));
  }
});
