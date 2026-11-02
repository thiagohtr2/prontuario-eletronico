const { chromium } = require('playwright');
const path = require('path');
exports.url = 'file://' + path.resolve(__dirname, '..', 'index.html');
exports.shot = (name) => path.join(__dirname, 'shots', name + '.png');
exports.launch = async (viewport, opts = {}) => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport, hasTouch: !!opts.touch, isMobile: !!opts.mobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  return { browser, ctx, page, errors };
};
exports.login = async (page) => {
  await page.goto(exports.url);
  await page.fill('#lg-email', 'demo@atlas.com');
  await page.fill('#lg-pass', 'Atlas@2026');
  await page.click('#lg-submit');
  await page.waitForSelector('#app', { timeout: 5000 });
  await page.waitForTimeout(1500); // blocos do painel terminam de carregar
};
