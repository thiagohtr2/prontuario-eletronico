// Gera capturas de tela em larguras de celular, tablet e desktop.
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.resolve(__dirname, '..', 'index.html');
const out = n => path.join(__dirname, 'shots', n);
(async () => {
  const browser = await chromium.launch();
  async function login(page) {
    await page.goto(url);
    await page.fill('#login-email', 'ana@conecta.demo');
    await page.fill('#login-pass', 'Conecta123');
    await page.click('#btn-login');
    await page.waitForSelector('#app:not([hidden])');
    await page.waitForTimeout(1000);
  }
  for (const [w, h, name] of [[390, 844, 'm390'], [320, 640, 'm320'], [820, 1000, 't820'], [1024, 768, 'd1024']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 768, isMobile: w < 768, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(url); await page.waitForTimeout(300);
    await page.screenshot({ path: out(`${name}-login.png`) });
    await page.click('#tab-cadastro'); await page.waitForTimeout(200);
    await page.screenshot({ path: out(`${name}-cadastro.png`) });
    await page.click('#tab-entrar');
    await login(page);
    await page.screenshot({ path: out(`${name}-feed.png`) });
    if (w < 768) {
      await page.click('#btn-drawer'); await page.waitForTimeout(500);
      await page.screenshot({ path: out(`${name}-drawer.png`) });
      await page.keyboard.press('Escape');
    }
    await ctx.close();
  }
  await browser.close();
})();
