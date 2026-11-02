// Teste de fumaça: abre o index.html via file://, percorre login e navegação, relata erros de console.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const url = 'file://' + path.resolve(__dirname, '..', 'index.html');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto(url);
  await page.waitForTimeout(300);
  console.log('title:', await page.title(), '| url:', page.url());
  await page.screenshot({ path: path.join(__dirname, 'shots', 'smoke-login-1280.png') });
  // tab cadastro / URL
  await page.click('#tab-cadastro');
  console.log('url após aba:', page.url());
  await page.click('#tab-entrar');
  await page.fill('#login-email', 'ana@conecta.demo');
  await page.fill('#login-pass', 'Conecta123');
  await page.click('#btn-login');
  await page.waitForSelector('#app:not([hidden])', { timeout: 5000 });
  await page.waitForTimeout(1200);
  console.log('url app:', page.url(), '| title:', await page.title());
  await page.screenshot({ path: path.join(__dirname, 'shots', 'smoke-feed-1280.png') });
  console.log('ERRORS:', JSON.stringify(errors, null, 1));
  await browser.close();
})();
