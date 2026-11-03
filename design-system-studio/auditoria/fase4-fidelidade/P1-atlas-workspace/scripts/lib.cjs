// Infraestrutura comum da auditoria de fidelidade P1 (Atlas Workspace).
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.resolve(__dirname, '..');
const SITES = {
  'dev-1': { url: 'http://127.0.0.1:4511/', email: 'marina@atlas.app', senha: 'atlas1234', login: '#/entrar', cadastro: '#/cadastro' },
  'dev-2': { url: 'http://127.0.0.1:4512/', email: 'demo@atlas.com', senha: 'Atlas@2026', login: '#/login', cadastro: '#/cadastro' },
  'dev-3': { url: 'http://127.0.0.1:4513/', email: 'demo@atlas.app', senha: 'demo1234', login: '#/entrar', cadastro: '#/cadastro' },
};

let browser;
async function getBrowser() {
  if (!browser) browser = await chromium.launch();
  return browser;
}

async function newPage(vw, vh, mobile = false) {
  const b = await getBrowser();
  const opts = { viewport: { width: vw, height: vh } };
  if (mobile) Object.assign(opts, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const ctx = await b.newContext(opts);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => { (page._errs = page._errs || []).push(String(e)); });
  return { ctx, page };
}

async function login(page, site) {
  const s = SITES[site];
  await page.goto(s.url, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  await page.fill('input[type=email]', s.email);
  await page.fill('input[type=password]', s.senha);
  await page.locator('button[type=submit]').first().click();
  // espera sair da tela de login
  await page.waitForFunction(() => !document.querySelector('input[type=password]'), null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1200);
}

function shot(name) { return path.join(OUT, 'capturas', name); }
function saveJSON(name, obj) { fs.writeFileSync(path.join(OUT, 'medicoes', name), JSON.stringify(obj, null, 2)); }

module.exports = { SITES, getBrowser, newPage, login, shot, saveJSON, OUT, close: async () => browser && browser.close() };
