const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Especificação JSON' }).click(); await page.waitForTimeout(400);
  let [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Baixar JSON' }).click()]);
  console.log('JSON file:', dl.suggestedFilename()); await dl.saveAs(W + '/exportados/' + dl.suggestedFilename());
  await page.goto('http://127.0.0.1:4300/#/exportar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await shot(page, '33-exportar');
  await shot(page, '33-exportar-full', true);
  const a = await aria(page, 'main');
  console.log(a.split('\n').filter(l=>!l.includes('/url')).join('\n').slice(0, 6000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
