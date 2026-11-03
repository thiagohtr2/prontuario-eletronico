const { chromium } = require('playwright');
const path = require('path');
require('fs').mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
const base = 'file://' + path.resolve(__dirname, '..', 'index.html');
const shot = (p, n, full) => p.screenshot({ path: path.join(__dirname, 'shots', n + '.png'), fullPage: !!full });
(async () => {
  const b = await chromium.launch();
  const login = async (p) => { await p.goto(base); await p.evaluate(() => { sessionStorage.setItem('nexo.session', JSON.stringify({ user: 1, method: 'senha', at: Date.now() })); location.hash = '#/painel/visao-geral'; }); await p.waitForTimeout(1300); };
  // celular na horizontal
  let p = await b.newPage({ viewport: { width: 667, height: 375 }, hasTouch: true, isMobile: true });
  await login(p);
  const hh = await p.evaluate(() => document.querySelector('#app-header').getBoundingClientRect().height);
  console.log('horizontal: header', hh, '=', (hh / 375 * 100).toFixed(1) + '% da altura');
  await p.click('#btn-drawer'); await p.waitForTimeout(400);
  console.log('horizontal: drawer', await p.evaluate(() => document.querySelector('#drawer').getBoundingClientRect().width), 'scroll interno', await p.evaluate(() => { const d = document.querySelector('.drawer-body'); return d.scrollHeight > d.clientHeight; }));
  // trap de foco: Tab várias vezes permanece no drawer
  let inside = true;
  for (let i = 0; i < 25; i++) { await p.keyboard.press('Tab'); inside = inside && await p.evaluate(() => document.querySelector('#drawer').contains(document.activeElement)); }
  await p.keyboard.down('Shift'); for (let i = 0; i < 5; i++) { await p.keyboard.press('Tab'); inside = inside && await p.evaluate(() => document.querySelector('#drawer').contains(document.activeElement)); } await p.keyboard.up('Shift');
  console.log('foco preso no drawer:', inside);
  await shot(p, 'm667-landscape-drawer');
  await p.close();
  // 1024 KPIs e foco no header
  p = await b.newPage({ viewport: { width: 1024, height: 800 } });
  await login(p);
  await p.keyboard.press('Tab'); // skip link
  await p.keyboard.press('Tab');
  await p.keyboard.press('Tab');
  console.log('foco 1024:', await p.evaluate(() => document.activeElement.className + ' ' + document.activeElement.textContent.trim().slice(0, 30)));
  await shot(p, 'd1024-dash');
  for (let i = 0; i < 14; i++) await p.keyboard.press('Tab');
  console.log('foco depois:', await p.evaluate(() => document.activeElement.className + ' | ' + (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim().slice(0, 30))));
  await shot(p, 'd1024-focus');
  await p.close();
  // reduced motion
  const ctx = await b.newContext({ viewport: { width: 390, height: 800 }, reducedMotion: 'reduce' });
  p = await ctx.newPage();
  await login(p);
  console.log('reduced motion transform:', await p.evaluate(() => getComputedStyle(document.querySelector('#drawer')).transform), await p.evaluate(() => getComputedStyle(document.querySelector('#drawer')).transitionProperty));
  await ctx.close();
  // 1920
  p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await login(p);
  await shot(p, 'd1920-dash');
  await p.close();
  await b.close();
})();
