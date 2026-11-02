const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/exportar', { waitUntil: 'networkidle' });
  const input = page.locator('input[type=file]');
  console.log('file inputs:', await input.count());
  await input.first().setInputFiles(W + '/exportados/exportar-orbita-pm-especificacao.json');
  await page.waitForTimeout(1200);
  await shot(page, '39-import-json');
  const dlg = page.getByRole('dialog');
  if (await dlg.count()) { console.log('DIALOG:', (await dlg.first().innerText()).slice(0, 1200)); }
  const st = page.getByRole('status');
  for (const s of await st.all()) { const t = (await s.innerText()).trim(); if (t) console.log('STATUS:', t); }
  const alerts = page.getByRole('alert'); for (const s of await alerts.all()) console.log('ALERT:', (await s.innerText()).trim());
  // ctrl+k search
  await page.keyboard.press('Control+k'); await page.waitForTimeout(400);
  await page.keyboard.type('token'); await page.waitForTimeout(500);
  await shot(page, '39b-busca-ctrlk');
  const d2 = page.getByRole('dialog').last();
  if (await d2.count()) console.log('SEARCH:', (await d2.innerText()).slice(0, 800));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
