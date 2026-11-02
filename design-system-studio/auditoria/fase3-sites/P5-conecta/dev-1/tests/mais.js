// Verifica o item "Mais" (links excedentes) com fonte ampliada em 1024 px.
const { chromium } = require('playwright');
const path = require('path');
const root = path.resolve(__dirname, '..');
const url = 'file://' + path.join(root, 'index.html');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1024, height: 800 } });
  await p.goto(url); await p.click('#fill-demo'); await p.click('#login-submit');
  await p.waitForFunction(() => location.hash === '#/feed'); await p.waitForTimeout(700);
  console.log('1024 normal: Mais visível =', await p.evaluate(() => !document.querySelector('#nav-more').hidden));
  await p.addStyleTag({ content: '.nav-link{font-size:20px !important}' });
  await p.evaluate(() => window.dispatchEvent(new Event('resize'))); await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({ mais: !document.querySelector('#nav-more').hidden, hidden: [...document.querySelectorAll('#main-nav-list > .nav-item')].filter((l) => l.hidden).map((l) => l.dataset.key), ov: document.documentElement.scrollWidth - innerWidth }));
  console.log('fonte 20px:', JSON.stringify(r));
  await p.hover('#nav-more-btn'); await p.waitForTimeout(200);
  console.log('hover abre Mais =', await p.evaluate(() => !document.querySelector('#nav-more-menu').hidden));
  if (process.env.SHOTS) await p.screenshot({ path: process.env.SHOTS + '/d-mais2.png' });
  await b.close();
})();
