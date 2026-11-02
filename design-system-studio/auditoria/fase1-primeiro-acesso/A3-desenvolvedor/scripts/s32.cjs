const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  console.log('tabpanels:', await page.locator('[role=tabpanel]').count(), 'tabs aria-controls:', await page.getByRole('tab').first().getAttribute('aria-controls'));
  await page.getByRole('tab', { name: /^Itens/ }).click(); await page.waitForTimeout(500);
  await shot(page, '32-itens');
  let a = await aria(page, 'main'); let L = a.split('\n').filter(l=>!l.includes('/url')); let s = L.findIndex(l=>l.includes('tablist "Partes')); console.log('ITENS:\n' + L.slice(s+5, s+90).join('\n'));
  await page.getByRole('tab', { name: 'Especificação JSON' }).click(); await page.waitForTimeout(500);
  await shot(page, '32b-json-tab');
  a = await aria(page, 'main'); L = a.split('\n').filter(l=>!l.includes('/url')); s = L.findIndex(l=>l.includes('tablist "Partes')); console.log('JSON TAB:\n' + L.slice(s+5, s+30).join('\n').slice(0,2500));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
