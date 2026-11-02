/* Capturas de tela para revisão visual: node tests/shots.js  (salva em qa-shots/) */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const BASE = 'file://' + path.join(__dirname, '..', 'index.html');
const OUT = path.join(__dirname, '..', 'qa-shots');
fs.mkdirSync(OUT, { recursive: true });

const SESSION = JSON.stringify({ name: 'Ana Souza', email: 'demo@atlas.app', role: 'Administradora' });

async function shot(browser, name, width, height, route, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  await page.goto(BASE + '#' + route);
  if (!route.startsWith('/entrar') && !route.startsWith('/cadastro') && !route.startsWith('/recuperar')) {
    await page.evaluate((s) => localStorage.setItem('atlas.session', s), SESSION);
    await page.goto(BASE + '#' + route);
  }
  await page.waitForSelector('h1', { timeout: 4000 });
  await page.waitForTimeout(700);
  if (opts.before) await opts.before(page);
  await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: !!opts.full });
  await ctx.close();
  console.log('ok', name);
}

(async () => {
  const browser = await chromium.launch();
  await shot(browser, 'login-m', 390, 844, '/entrar', { full: true });
  await shot(browser, 'login-d', 1440, 900, '/entrar');
  await shot(browser, 'cadastro-m', 390, 844, '/cadastro', { full: true });
  await shot(browser, 'painel-d', 1440, 900, '/app/painel');
  await shot(browser, 'painel-m', 390, 844, '/app/painel', { full: true });
  await shot(browser, 'projetos-d', 1440, 900, '/app/projetos');
  await shot(browser, 'relatorios-m', 390, 844, '/app/relatorios', { full: true });
  await shot(browser, 'relatorios-d', 1440, 900, '/app/relatorios');
  await shot(browser, 'inicio-m', 390, 844, '/app/inicio');
  await shot(browser, 'ajuda-m', 390, 844, '/app/ajuda', { full: true });
  await shot(browser, 'rail-tablet', 900, 800, '/app/painel');
  await shot(browser, 'overlay-tablet', 900, 800, '/app/painel', {
    before: async (p) => { await p.click('.header__menu'); await p.waitForTimeout(200); }
  });
  await shot(browser, 'notif-d', 1440, 900, '/app/projetos', {
    before: async (p) => { await p.click('[data-action="open-notifications"] >> nth=0'); await p.waitForTimeout(200); }
  });
  await shot(browser, 'painel-320', 320, 700, '/app/painel', { full: true });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(2); });
