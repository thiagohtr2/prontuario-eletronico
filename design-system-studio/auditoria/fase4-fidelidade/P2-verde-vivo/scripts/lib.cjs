// Utilitários comuns da auditoria de fidelidade P2 (somente leitura dos sites).
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.resolve(__dirname, '..', 'capturas');
const SITES = { 'dev-1': 'http://127.0.0.1:4521/', 'dev-2': 'http://127.0.0.1:4522/', 'dev-3': 'http://127.0.0.1:4523/' };
const VP = {
  desktop: { viewport: { width: 1440, height: 900 } },
  tablet: { viewport: { width: 768, height: 1024 } },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
};
async function open(browser, site, vpName, hash = '', extra = {}) {
  const ctx = await browser.newContext({ ...VP[vpName], ...extra });
  const page = await ctx.newPage();
  page._errs = [];
  page.on('pageerror', e => page._errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') page._errs.push(m.text()); });
  await page.goto(SITES[site] + hash, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  return { ctx, page };
}
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const h = () => document.documentElement.scrollHeight;
    for (let y = 0; y < h(); y += Math.round(innerHeight * 0.6)) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 700));
  });
}
module.exports = { chromium, OUT, SITES, VP, open, scrollThrough, path };
