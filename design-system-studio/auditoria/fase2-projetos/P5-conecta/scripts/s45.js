const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Login' }).click();
  for (const dev of ['Computador', 'Tablet', 'Celular']) {
    await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: dev }).click();
    await page.waitForTimeout(700);
    await shot(`06-previa-integrada-login-${dev.toLowerCase()}`, { dir: CAP });
  }
  await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Aplicação' }).click();
  await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: 'Computador' }).click();
});
