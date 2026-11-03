// Tooltip do sparkline: passa o mouse sobre o contêiner .spark e captura a região.
const L = require('./lib.cjs');
const PAINEL = { 'dev-1': '#/painel', 'dev-2': '#/painel', 'dev-3': '#/app/painel' };
(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const { ctx, page } = await L.newPage(1440, 900);
    await L.login(page, site);
    await page.goto(L.SITES[site].url + PAINEL[site]); await page.waitForTimeout(1600);
    const el = page.locator('main .spark, main .kpi__spark').first();
    const bb = await el.boundingBox();
    await page.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.5); await page.waitForTimeout(150);
    await page.mouse.move(bb.x + bb.width * 0.55, bb.y + bb.height * 0.5); await page.waitForTimeout(500);
    res[site] = await page.evaluate(() => [...document.querySelectorAll('[role=tooltip], .spark__tip, .tooltip, .tip, [class*=tip]')].filter(e => { const s = getComputedStyle(e); return !e.hidden && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0' && e.getBoundingClientRect().width > 0; }).map(e => e.textContent.trim()));
    await page.screenshot({ path: L.shot(`${site}-sparkline-tooltip.png`), clip: { x: Math.max(0, bb.x - 30), y: Math.max(0, bb.y - 110), width: Math.min(460, bb.width + 60), height: bb.height + 140 } });
    await ctx.close();
  }
  console.log(JSON.stringify(res));
  L.saveJSON('s09c-sparkline.json', res);
  await L.close();
})();
