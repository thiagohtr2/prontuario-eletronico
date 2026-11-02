const { run } = require('./lib');
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Login' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^Acesso responsivo/ }).click();
  await page.waitForTimeout(400);
  await shot('g02-login-escolhido');
  console.log((await page.locator('main').ariaSnapshot()).split('\n').slice(44, 56).join('\n'));
  await page.getByRole('tab', { name: 'Cadastro' }).click();
  await page.waitForTimeout(500);
  await shot('g02-tab-cadastro', { full: true });
  const snap = await page.locator('main').ariaSnapshot();
  return snap.split('\n').slice(44).join('\n');
});
