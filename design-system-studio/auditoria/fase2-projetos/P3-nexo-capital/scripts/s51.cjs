const { open, W } = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(8000);
  const dir = W + '/exportados/inspiracao-atlas-capital';
  async function grab(label, clickFn) {
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }).catch(() => null), clickFn()]);
    if (!dl) { console.log(label, '-> SEM DOWNLOAD'); return; }
    const fn = dl.suggestedFilename(); const out = dir + '/' + fn;
    await dl.saveAs(out); console.log(label, '->', fn, fs.statSync(out).size, 'failure=' + await dl.failure());
  }
  await page.goto('http://127.0.0.1:4300/#/modulos/inspiracao', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Abrir o site ATLAS CAPITAL/ }).click();
  await page.waitForTimeout(800);
  const d = page.getByRole('dialog').first();
  const ex = d.getByRole('group', { name: 'Exportar' });
  for (const b of ['CSS de referência', 'JSON', 'HTML demonstrativo']) await grab('ATLAS: ' + b, () => ex.getByRole('button', { name: b }).click());
  await d.getByRole('button', { name: 'Prompt deste conceito' }).click(); await page.waitForTimeout(600);
  const d2 = page.getByRole('dialog').last();
  console.log('prompt dialog title:', await d2.locator('h2').first().innerText());
  const bt = d2.getByRole('button', { name: 'Baixar .md' });
  if (await bt.count()) await grab('ATLAS: Prompt deste conceito (.md)', () => bt.click());
  await ctx.close();
})();
