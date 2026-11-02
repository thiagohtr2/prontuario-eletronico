const { open, W } = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(10000);
  await page.goto('http://127.0.0.1:4300/#/exportar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: W + '/capturas/18-exportar-e-importar.png', fullPage: false });
  const arts = page.locator('#conteudo article');
  const n = await arts.count();
  const log = [];
  for (let i = 0; i < n; i++) {
    const a = arts.nth(i);
    const title = await a.locator('h3').innerText();
    try {
      const [dl] = await Promise.all([
        page.waitForEvent('download', { timeout: 10000 }),
        a.getByRole('button', { name: 'Baixar' }).click(),
      ]);
      const fn = dl.suggestedFilename();
      const failure = await dl.failure();
      await dl.saveAs(W + '/exportados/' + fn);
      const size = fs.statSync(W + '/exportados/' + fn).size;
      log.push(`${title} -> ${fn} (${size} bytes) failure=${failure}`);
    } catch (e) { log.push(`${title} -> ERRO ${e.message.split('\n')[0]}`); }
    await page.waitForTimeout(400);
  }
  console.log(log.join('\n'));
  await ctx.close();
})();
