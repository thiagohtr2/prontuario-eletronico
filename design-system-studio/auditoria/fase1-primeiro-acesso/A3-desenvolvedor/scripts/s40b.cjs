const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/modulos/cores', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await shot(page, '40a-color-system-livre');
  const a = await aria(page, 'main');
  const L = a.split('\n').filter(l=>!l.includes('/url'));
  console.log(L.slice(0, 40).join('\n'));
  const tabs = page.getByRole('tab'); const n = await tabs.count(); const t=[]; for (let i=0;i<n;i++) t.push(await tabs.nth(i).innerText()); console.log('TABS:', t.join(' | '));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
