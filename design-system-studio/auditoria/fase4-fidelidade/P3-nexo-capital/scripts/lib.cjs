// Biblioteca comum da auditoria de fidelidade P3 (fase 4).
const path = require('path');
const { chromium } = require('playwright');

const OUT = path.resolve(__dirname, '..');
const SITES = {
  'dev-1': { url: 'http://127.0.0.1:4531/', email: 'ana.ribeiro@nexocapital.com.br', pass: 'Nexo@2026' },
  'dev-2': { url: 'http://127.0.0.1:4532/', email: 'ana.souza@nexocapital.com.br', pass: 'Nexo@2026' },
  'dev-3': { url: 'http://127.0.0.1:4533/', email: 'demo@nexo.example', pass: 'Demo@2026' },
};

function ctxOpts(w, h) {
  const mobile = w <= 480;
  return mobile
    ? { viewport: { width: w, height: h || 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
    : { viewport: { width: w, height: h || 900 }, deviceScaleFactor: 1 };
}

async function newPage(browser, w, h, extra = {}) {
  const ctx = await browser.newContext({ ...ctxOpts(w, h), ...extra });
  const page = await ctx.newPage();
  page._errors = [];
  page.on('pageerror', (e) => page._errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') page._errors.push('console: ' + m.text()); });
  return { ctx, page };
}

async function gotoLogin(page, site) {
  await page.goto(SITES[site].url, { waitUntil: 'networkidle' }).catch(() => page.goto(SITES[site].url));
  await page.waitForSelector('input[type=password]', { state: 'visible', timeout: 8000 });
  await page.waitForTimeout(300);
}

async function login(page, site) {
  await gotoLogin(page, site);
  const s = SITES[site];
  await page.fill('input[type=email]:visible', s.email);
  await page.fill('input[type=password]:visible', s.pass);
  await page.click('form button[type=submit]:visible');
  // aguarda sair do login
  await page.waitForFunction(() => !document.querySelector('input[type=password]') || !document.querySelector('input[type=password]').offsetParent, null, { timeout: 10000 });
  await page.waitForTimeout(1800); // skeletons / carregamentos simulados
}

async function launch() { return chromium.launch(); }

module.exports = { OUT, SITES, ctxOpts, newPage, gotoLogin, login, launch };
