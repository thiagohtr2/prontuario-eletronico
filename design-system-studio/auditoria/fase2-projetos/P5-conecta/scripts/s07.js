const { run } = require('./lib');
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Cadastro' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^Cadastro na mesma tela do login/ }).click();
  await page.waitForTimeout(400);
  await shot('g02-cadastro-escolhido');
  console.log((await page.locator('main').ariaSnapshot()).split('\n').slice(44, 52).join('\n'));
  // ver prévia do login escolhido
  await page.getByRole('tab', { name: 'Login' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Ver prévia' }).first().click();
  await page.waitForTimeout(800);
  await shot('g02-login-previa');
  const dlg = page.getByRole('dialog');
  if (await dlg.count()) return await dlg.first().ariaSnapshot();
  return 'sem dialog';
});
