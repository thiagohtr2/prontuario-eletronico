const { run } = require('./lib');
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  await page.getByRole('radio', { name: /^Outro tipo/ }).click();
  await page.waitForTimeout(400);
  await shot('s02-outro');
  const a = await page.locator('main').ariaSnapshot();
  await page.getByRole('radio', { name: /^Aplicativo ou SaaS/ }).click();
  await page.waitForTimeout(400);
  await shot('s02-app');
  const b = await page.locator('main').ariaSnapshot();
  return 'OUTRO:\n' + a.split('\n').slice(30, 70).join('\n') + '\n\nAPP:\n' + b.split('\n').slice(30, 70).join('\n');
});
