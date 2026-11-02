const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const labels = await page.locator('[aria-label^="Prévia d"]').evaluateAll(els => els.map(e => e.getAttribute('aria-label') + ' <' + e.tagName + ' role=' + e.getAttribute('role') + '>'));
  console.log(labels);
  for (const dev of ['Tablet', 'Celular']) {
    await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: dev }).click();
    await page.waitForTimeout(700);
    const el = page.locator(`[aria-label="Prévia do ${dev.toLowerCase()}"]`).first();
    console.log(dev, 'count', await el.count(), await el.boundingBox());
    if (await el.count()) {
      await shot(`06-previa-integrada-aplicacao-${dev.toLowerCase()}-recorte`, { dir: CAP, el });
      console.log((await el.innerText()).replace(/\s+/g, ' ').slice(0, 600));
      const s = await el.ariaSnapshot();
      console.log(s.slice(0, 1500));
    }
  }
  // Login em 3 dispositivos
  await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Login' }).click();
  for (const dev of ['Computador', 'Celular']) {
    await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: dev }).click();
    await page.waitForTimeout(700);
    await shot(`06-previa-integrada-login-${dev.toLowerCase()}`, { dir: CAP });
  }
  await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Aplicação' }).click();
  await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: 'Computador' }).click();
}, { viewport: { width: 1440, height: 900 } });
