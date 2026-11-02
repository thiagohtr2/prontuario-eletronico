const { open, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open(390, 844, { nosave: true });
  for (const [r,n] of [['guiado/identidade','identidade'],['guiado/entrega','entrega']]) {
    await page.goto(BASE + '#/' + r, { waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
    await page.screenshot({ path: C + `47-390-${n}.png` });
    const ov = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    console.log(n, JSON.stringify(ov));
  }
  console.log('LOGS', logs.join('\n'));
  await close();
})();
