const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/desktop', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Sidebar integral com header global\./ }).click();
  await page.waitForTimeout(600);
  await shot(page, '10-desktop-selecionado');
  const a = await aria(page, 'main');
  const lines = a.split('\n').filter(l => !l.includes('/url'));
  // print lines that are not the catalog
  const idx = lines.findIndex(l => l.includes('Famílias de layout'));
  console.log(lines.slice(34, idx).join('\n'));
  const tail = lines.slice(-60);
  console.log('---TAIL---\n' + tail.join('\n'));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
