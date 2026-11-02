const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/desktop', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /^Topbar integral fixa\./ }).click();
  await page.waitForTimeout(500);
  const det = page.getByRole('complementary', { name: 'Detalhes do layout' });
  console.log(await det.ariaSnapshot());
  await shot('03-desktop-escolhido-detalhe', { el: det, dir: CAP });
  await shot('03-desktop-escolhido-tela', { dir: CAP });
  // tentar clicar no desenho para ampliar
  await det.getByRole('img').first().click().catch(e => console.log('img click', e.message));
  await page.waitForTimeout(600);
  const dlg = page.getByRole('dialog');
  console.log('dialogs:', await dlg.count());
  if (await dlg.count()) { console.log(await dlg.first().ariaSnapshot()); await shot('s12-dialog'); }
  console.log('header progress:', await page.locator('header, [role=banner]').first().innerText());
});
