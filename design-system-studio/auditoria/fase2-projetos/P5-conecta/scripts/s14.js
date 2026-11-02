const { run } = require('./lib');
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Sociais/ }).click();
  await page.waitForTimeout(500);
  await shot('s14-sociais');
});
