const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/modulos/templates', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await shot(page, '37-template-studio');
  const a = await aria(page, 'main');
  const L = a.split('\n').filter(l=>!l.includes('/url'));
  console.log(L.join('\n').slice(0, 5000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
