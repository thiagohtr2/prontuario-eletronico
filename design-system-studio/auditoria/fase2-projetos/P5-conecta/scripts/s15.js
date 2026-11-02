const { run } = require('./lib');
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Comunidade Sociais/ }).click();
  await page.waitForTimeout(500);
  await shot('s15-comunidade');
  for (const t of ['Ajustar cores', 'Tipografia', 'Formas e superfícies']) {
    await page.getByRole('tab', { name: t }).click();
    await page.waitForTimeout(500);
    await shot('s15-tab-' + t.replace(/\s+/g, '_'), { full: true });
    const panel = page.getByRole('tabpanel');
    const s = (await panel.count()) ? await panel.first().ariaSnapshot() : (await page.locator('main').ariaSnapshot());
    console.log('==== ' + t + '\n' + s);
  }
});
