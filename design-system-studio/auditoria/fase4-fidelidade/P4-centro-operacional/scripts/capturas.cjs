// Capturas dos 3 sites nos viewports principais e extras.
// Uso: node capturas.js   (servidores em 127.0.0.1:4541..4543)
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.resolve(__dirname, '../capturas');
const SITES = { 'dev-1': 'http://127.0.0.1:4541/', 'dev-2': 'http://127.0.0.1:4542/', 'dev-3': 'http://127.0.0.1:4543/' };
const VIEWS = [
  { n: '1440x900', w: 1440, h: 900 },
  { n: '1920x1080', w: 1920, h: 1080 },
  { n: '768x1024', w: 768, h: 1024 },
  { n: '390x844', w: 390, h: 844, mobile: true },
  // extras
  { n: '1280x800', w: 1280, h: 800 },
  { n: '1024x768', w: 1024, h: 768 },
  { n: '1280x600', w: 1280, h: 600 },
  { n: '2560x1440', w: 2560, h: 1440 },
  { n: '390x500', w: 390, h: 500, mobile: true },
  { n: '740x360', w: 740, h: 360, mobile: true },
  { n: '844x390', w: 844, h: 390, mobile: true },
  { n: '320x568', w: 320, h: 568, mobile: true },
];
(async () => {
  const browser = await chromium.launch();
  for (const [dev, url] of Object.entries(SITES)) {
    for (const v of VIEWS) {
      const ctx = await browser.newContext({
        viewport: { width: v.w, height: v.h },
        deviceScaleFactor: 1,
        isMobile: !!v.mobile, hasTouch: !!v.mobile,
      });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3500);
      await page.screenshot({ path: `${OUT}/${dev}-${v.n}.png` });
      await ctx.close();
      console.log(dev, v.n);
    }
  }
  await browser.close();
})();
