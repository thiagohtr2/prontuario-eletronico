const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('requestfailed', (r) => errs.push('reqfail ' + r.url()));
  const f = path.resolve(__dirname, '..', 'exportados', 'conecta-ficha.html');
  await p.goto('file://' + f, { waitUntil: 'load' });
  await p.waitForTimeout(800);
  await p.screenshot({ path: path.resolve(__dirname, '..', 'capturas', '15-ficha-html-exportada.png') });
  console.log('title:', await p.title());
  const h = await p.locator('h1, h2').allInnerTexts();
  console.log('headings:', h.slice(0, 20));
  console.log('erros:', errs);
  await b.close();
})();
