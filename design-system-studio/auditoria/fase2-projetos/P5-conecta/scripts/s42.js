const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  for (const [rota, nome] of [['#/guiado/preview', '14-studio-390-previa-integrada'], ['#/guiado/mobile', '14-studio-390-arquitetura-celular']]) {
    await page.goto('http://127.0.0.1:4300/' + rota, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await shot(nome, { dir: CAP });
    const ov = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    console.log(nome, 'scrollWidth/clientWidth', ov);
  }
  // prévia integrada no celular: escolher dispositivo Celular
  await page.goto('http://127.0.0.1:4300/#/guiado/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const g = page.getByRole('group', { name: 'Dispositivo da prévia' });
  if (await g.count()) {
    await g.getByRole('button', { name: 'Celular' }).click();
    await page.waitForTimeout(700);
    const phone = page.locator('[aria-label^="Prévia do celular"]').first();
    await phone.scrollIntoViewIfNeeded();
    await shot('14-studio-390-previa-celular', { dir: CAP });
  }
}, { mobile: true });
