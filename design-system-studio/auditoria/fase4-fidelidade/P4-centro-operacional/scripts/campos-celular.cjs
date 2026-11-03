// Observação extra (fora da rubrica): fonte dos campos no celular (regra de 16 px, L392).
const { chromium } = require('playwright');
const { SITES } = require('./lib.cjs');
(async () => {
  const b = await chromium.launch();
  for (const [dev, cfg] of Object.entries(SITES)) {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await c.newPage(); await p.goto(cfg.url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
    const tabs = p.locator(`${cfg.mtabs} [role=tab]`); const n = await tabs.count(); const res = new Set();
    for (let i = 0; i < n; i++) { await tabs.nth(i).tap(); await p.waitForTimeout(300); (await p.$$eval('input:not([type=checkbox]), select', (es) => es.filter((e) => e.getBoundingClientRect().height > 2).map((e) => (e.id || e.type) + ':' + getComputedStyle(e).fontSize))).forEach((x) => res.add(x)); }
    console.log(dev, [...res]); await c.close();
  }
  await b.close();
})();
