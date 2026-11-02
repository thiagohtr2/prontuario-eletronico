const { run } = require('./lib');
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Apenas login/ }).click();
  await page.waitForTimeout(500);
  await shot('g02-entrada-apenaslogin', { full: true });
  const snap = await page.locator('main').ariaSnapshot();
  return snap.split('\n').slice(34).join('\n');
});
