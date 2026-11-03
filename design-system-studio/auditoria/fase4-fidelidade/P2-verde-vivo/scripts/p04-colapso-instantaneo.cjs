// Recolhimento da linha 2 com rolagem instantânea (sem animação de rolagem), nos 3 sites.
const { chromium, open } = require('./lib.cjs');
const CFG = require('./cfg.cjs');
(async () => {
  const b = await chromium.launch();
  for (const site of Object.keys(CFG)) {
    const c = CFG[site];
    for (const rm of [false, true]) {
      const { ctx, page } = await open(b, site, 'desktop', c.catalog, rm ? { reducedMotion: 'reduce' } : {});
      await page.waitForTimeout(1200);
      const m = () => page.evaluate((c) => { const n = document.querySelector(c.row2).getBoundingClientRect(); return { y: Math.round(scrollY), cls: document.querySelector(c.header).className, nav: [Math.round(n.top), Math.round(n.bottom), Math.round(n.height)], vis: getComputedStyle(document.querySelector(c.row2)).visibility }; }, c);
      const seq = [];
      for (const [y, l] of [[400, 'desce400'], [1200, 'desce1200'], [900, 'sobe900'], [600, 'sobe600']]) {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y); await page.waitForTimeout(700); seq.push([l, await m()]);
      }
      console.log(site, rm ? 'reduced' : 'normal', JSON.stringify(seq));
      await ctx.close();
    }
  }
  await b.close();
})();
