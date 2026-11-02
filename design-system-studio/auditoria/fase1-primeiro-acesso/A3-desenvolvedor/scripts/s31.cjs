const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  let [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Baixar .md' }).first().click()]);
  console.log('MD file:', dl.suggestedFilename()); await dl.saveAs(W + '/exportados/' + dl.suggestedFilename());
  await page.getByRole('tab', { name: 'Itens (17)' }).click(); await page.waitForTimeout(500);
  await shot(page, '31-itens');
  console.log('ITENS:\n' + (await page.getByRole('tabpanel').first().innerText()).slice(0, 3000));
  await page.getByRole('tab', { name: 'Especificação JSON' }).click(); await page.waitForTimeout(500);
  await shot(page, '31b-json-tab');
  const tp = page.getByRole('tabpanel').first();
  console.log('JSON TAB ARIA:\n' + (await tp.ariaSnapshot()).slice(0, 1500));
  const btns = tp.getByRole('button');
  const n = await btns.count(); for (let i=0;i<n;i++) console.log('btn:', (await btns.nth(i).innerText()).replace(/\n/g,' '));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
