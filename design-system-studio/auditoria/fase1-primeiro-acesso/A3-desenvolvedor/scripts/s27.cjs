const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.getByRole('region', { name: /No projeto/ }).getByRole('button', { name: 'Personalizar' }).click();
  await page.waitForTimeout(600);
  const d = page.getByRole('dialog').first();
  const snap = await d.ariaSnapshot();
  console.log(snap.split('\n').filter(l=>!l.includes('/url')).join('\n').slice(0, 9000));
  // look at computed style of preview primary button
  const btn = d.getByRole('button', { name: /Começar agora/ }).first();
  if (await btn.count()) { const cs = await btn.evaluate(e => { const s = getComputedStyle(e); return { h: e.getBoundingClientRect().height, fs: s.fontSize, pad: s.padding, br: s.borderRadius, bg: s.backgroundColor, ff: s.fontFamily.slice(0,40), fw: s.fontWeight }; }); console.log('PREVIEW BTN', JSON.stringify(cs)); }
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
