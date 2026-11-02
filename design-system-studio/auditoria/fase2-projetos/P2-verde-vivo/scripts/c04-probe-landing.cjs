const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Landing' }).click();
  await page.waitForTimeout(600);
  for (const dev of ['Computador', 'Celular']) {
    await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: dev }).click();
    await page.waitForTimeout(800);
    const m = await page.locator('#conteudo').ariaSnapshot();
    const i = m.indexOf('group "Dispositivo da prévia"');
    console.log('==', dev, m.slice(i + 250, i + 1600));
    const html = await page.evaluate(() => { const g = document.querySelector('[role=group][aria-label="Dispositivo da prévia"]'); let n = g; for (let k = 0; k < 4; k++) n = n.parentElement; return n.outerHTML.slice(0, 50); });
  }
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'landing-celular-probe.png') });
}, { url: URL + '#/guiado/preview' });
