const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open(1920, 1080, { nosave: true });
  for (const [r, n, w] of [['', 'home', 'Do site que você imagina'], ['modulos/landing', 'landing', null], ['modulos/inspiracao', 'inspiracao', null], ['modulos/templates', 'templates', null], ['guiado/identidade', 'identidade', 'Prévia da identidade']]) {
    await page.goto(BASE + '#/' + r, { waitUntil: 'networkidle' }); await page.waitForTimeout(1800);
    await page.screenshot({ path: C + `44-1920-${n}.png` });
    if (n==='inspiracao' || n==='templates') { await page.screenshot({ path: C + `44-1920-${n}-full.png`, fullPage: true }); const t = await page.evaluate(() => document.querySelector('main').innerText.slice(0, 1800)); console.log('=== '+n+'\n'+t); }
    const m = await page.evaluate(() => { const mn=document.querySelector('main'); const c=mn.firstElementChild; const r=c?c.getBoundingClientRect():null; return {mainW: Math.round(mn.getBoundingClientRect().width), contentW: r?Math.round(r.width):0, contentX: r?Math.round(r.left):0}; });
    console.log(n, JSON.stringify(m));
  }
  console.log('LOGS', logs.join('\n'));
  await close();
})();
