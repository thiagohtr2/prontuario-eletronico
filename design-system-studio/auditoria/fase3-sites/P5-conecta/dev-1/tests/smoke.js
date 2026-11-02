// Teste rápido: abre via file://, entra com a conta de demonstração e tira capturas.
const { chromium } = require('playwright');
const path = require('path');
const root = path.resolve(__dirname, '..');
const url = 'file://' + path.join(root, 'index.html');
const out = process.env.SHOTS || path.join(root, 'tests', 'shots');
require('fs').mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  for (const [name, vp] of [['mobile', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: name === 'mobile', isMobile: name === 'mobile' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto(url);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/${name}-login.png`, fullPage: true });
    await page.fill('#login-email', 'ana@conecta.app');
    await page.fill('#login-password', 'conecta123');
    await page.click('#login-submit');
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${out}/${name}-feed.png`, fullPage: false });
    console.log(name, 'hash=', await page.evaluate(() => location.hash), 'errors=', errors);
    await ctx.close();
  }
  await browser.close();
})();
