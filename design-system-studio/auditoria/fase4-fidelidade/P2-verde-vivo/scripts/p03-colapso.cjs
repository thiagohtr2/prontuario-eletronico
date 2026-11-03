// Verifica visualmente o recolhimento da linha 2 ao rolar (desktop) nos 3 sites.
const { chromium, open, path } = require('./lib.cjs');
const CFG = require('./cfg.cjs');
(async () => {
  const browser = await chromium.launch();
  for (const site of Object.keys(CFG)) {
    const c = CFG[site];
    const { ctx, page } = await open(browser, site, 'desktop', c.catalog);
    await page.waitForTimeout(1200);
    const m = async (lbl) => { const o = await page.evaluate((c) => { const h = document.querySelector(c.header), r1 = document.querySelector(c.row1), r2 = document.querySelector(c.row2); const f = e => { const r = e.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; }; return { y: scrollY, hdr: f(h), row1: f(r1), row2: f(r2), r2vis: getComputedStyle(r2).visibility, cls: h.className }; }, c); console.log(site, lbl, JSON.stringify(o)); };
    await page.mouse.wheel(0, 1200); await page.waitForTimeout(900); await m('desceu');
    await page.screenshot({ path: path.join(__dirname, '..', 'capturas', `${site}-desktop-header-rolando-para-baixo.png`), clip: { x: 0, y: 0, width: 1440, height: 220 } });
    await page.mouse.wheel(0, -300); await page.waitForTimeout(900); await m('subiu');
    await page.screenshot({ path: path.join(__dirname, '..', 'capturas', `${site}-desktop-header-rolando-para-cima.png`), clip: { x: 0, y: 0, width: 1440, height: 220 } });
    await ctx.close();
  }
  await browser.close();
})();
