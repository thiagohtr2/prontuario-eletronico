const { run } = require('./lib');
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Stories com dock e drawer lateral/ }).click();
  await page.waitForTimeout(600);
  await shot('g04-mobile-stories-click');
  const snap = await page.locator('main').ariaSnapshot();
  const i = snap.indexOf('Exemplo');
  const j = snap.indexOf('Escolhido');
  return snap.slice(Math.max(0, Math.min(i < 0 ? 1e9 : i, j < 0 ? 1e9 : j) - 200));
});
