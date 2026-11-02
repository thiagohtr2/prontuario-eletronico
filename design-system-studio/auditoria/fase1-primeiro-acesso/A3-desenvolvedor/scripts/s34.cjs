const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/exportar', { waitUntil: 'networkidle' });
  for (const h of ['Master Prompt (.md)', 'Especificação JSON', 'CSS de referência', 'Ficha do projeto (HTML)', 'Backup completo']) {
    const art = page.locator('main article').filter({ has: page.getByRole('heading', { name: h, exact: true }) });
    const [dl] = await Promise.all([page.waitForEvent('download'), art.getByRole('button', { name: 'Baixar' }).click()]);
    const fn = 'exportar-' + dl.suggestedFilename();
    await dl.saveAs(W + '/exportados/' + fn);
    console.log(h, '=>', fn);
    await page.waitForTimeout(300);
  }
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
