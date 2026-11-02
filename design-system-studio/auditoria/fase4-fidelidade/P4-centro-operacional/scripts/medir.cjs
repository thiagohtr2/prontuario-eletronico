// Medições estáticas no DOM + varredura de larguras.
// Uso: node medir.cjs [dev-1|dev-2|dev-3]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { SITES, pageMeasure, pageDefects } = require('./lib.cjs');
const OUT = path.resolve(__dirname, '../medicoes');

const MAIN = [
  { n: '1440x900', w: 1440, h: 900 }, { n: '1920x1080', w: 1920, h: 1080 }, { n: '1280x800', w: 1280, h: 800 },
  { n: '2560x1440', w: 2560, h: 1440 }, { n: '1180x800', w: 1180, h: 800 }, { n: '1024x768', w: 1024, h: 768 },
  { n: '820x1180', w: 820, h: 1180 }, { n: '768x1024', w: 768, h: 1024 }, { n: '1280x600', w: 1280, h: 600 },
  { n: '390x844', w: 390, h: 844, m: 1 }, { n: '360x780', w: 360, h: 780, m: 1 }, { n: '375x667', w: 375, h: 667, m: 1 },
  { n: '412x915', w: 412, h: 915, m: 1 }, { n: '430x932', w: 430, h: 932, m: 1 }, { n: '390x500', w: 390, h: 500, m: 1 },
  { n: '740x360', w: 740, h: 360, m: 1 }, { n: '844x390', w: 844, h: 390, m: 1 },
];
const SWEEP = [320, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920];
const sweepH = (w) => (w >= 1024 ? 900 : w === 768 ? 1024 : w === 820 ? 1180 : 844);

(async () => {
  const only = process.argv[2];
  const browser = await chromium.launch();
  for (const [dev, cfg] of Object.entries(SITES)) {
    if (only && only !== dev) continue;
    const result = { main: {}, sweep: {} };
    for (const v of MAIN) {
      const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, isMobile: !!v.m, hasTouch: !!v.m });
      const page = await ctx.newPage();
      await page.goto(cfg.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      result.main[v.n] = await page.evaluate(pageMeasure, cfg);
      result.main[v.n].defects = await page.evaluate(pageDefects, { touch: !!v.m });
      await ctx.close();
      process.stdout.write(dev + ' ' + v.n + '\n');
    }
    for (const w of SWEEP) {
      const m = w < 768;
      const ctx = await browser.newContext({ viewport: { width: w, height: sweepH(w) }, isMobile: m, hasTouch: m });
      const page = await ctx.newPage();
      await page.goto(cfg.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2500);
      const base = await page.evaluate(() => ({ v: document.scrollingElement.scrollHeight - innerHeight, h: document.scrollingElement.scrollWidth - innerWidth }));
      const d = await page.evaluate(pageDefects, { touch: m });
      const regions = await page.evaluate((cfg) => {
        const out = {};
        for (const k of ['header', 'content', 'panel', 'footer', 'mtabs', 'dtabs']) { const e = cfg[k] && document.querySelector(cfg[k]); if (e) { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); out[k] = cs.display === 'none' || r.width < 2 || r.height < 2 ? null : [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; } }
        // sobreposição entre regiões
        const ks = Object.keys(out).filter((k) => out[k]); const ov = [];
        for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) {
          const a = out[ks[i]], b = out[ks[j]];
          const w = Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]); const h = Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]);
          if (w > 2 && h > 2) ov.push(ks[i] + 'x' + ks[j] + ' ' + w + 'x' + h);
        }
        out.regionOverlap = ov; return out;
      }, cfg);
      result.sweep[w] = { docScrollV: base.v, docScrollH: base.h, ...d, regions };
      await ctx.close();
      process.stdout.write(dev + ' sweep ' + w + '\n');
    }
    fs.writeFileSync(path.join(OUT, dev + '-medicoes.json'), JSON.stringify(result, null, 1));
  }
  await browser.close();
})();
