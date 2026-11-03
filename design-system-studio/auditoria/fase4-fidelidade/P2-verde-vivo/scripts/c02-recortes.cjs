// Recortes de elementos para as composições: primeiro card de produto, drawer de filtros e header mobile.
const { chromium, SITES, path } = require('./lib.cjs');
const CFG = require('./cfg.cjs');
const OUT = path.join(__dirname, '..', 'capturas');
(async () => {
  const b = await chromium.launch();
  for (const site of Object.keys(CFG)) {
    const c = CFG[site];
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const p = await ctx.newPage(); await p.goto(SITES[site] + c.catalog); await p.waitForTimeout(1500);
    const card = p.locator(c.card).first(); await card.evaluate(e => e.scrollIntoView({ block: 'center', behavior: 'instant' })); await p.waitForTimeout(600);
    await card.screenshot({ path: path.join(OUT, `${site}-recorte-card.png`) });
    await ctx.close();
  }
  await b.close();
})();
