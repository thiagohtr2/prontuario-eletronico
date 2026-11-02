// Utilitários de infraestrutura para dirigir o navegador (perfil persistente).
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const W = path.resolve(__dirname, '..');
const BASE = 'http://127.0.0.1:4300/';
async function open(opts = {}) {
  const ctx = await chromium.launchPersistentContext(path.join(W, 'perfil'), {
    viewport: opts.viewport || { width: 1440, height: 900 }, acceptDownloads: true,
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  const logs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`[console.${m.type()}] ${m.text()}`); });
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  page.on('dialog', async d => { logs.push(`[dialog ${d.type()}] ${d.message()}`); try { await d.accept(); } catch {} });
  if (opts.url !== false) await page.goto(opts.url || BASE, { waitUntil: 'networkidle' });
  const shot = async (name, o = {}) => { const p = path.join(W, o.dir || 'tmp', name + '.png'); fs.mkdirSync(path.dirname(p), { recursive: true }); await (o.locator || page).screenshot({ path: p, fullPage: !!o.full }); return p; };
  const aria = async (sel = 'body') => page.locator(sel).first().ariaSnapshot();
  const done = async () => { if (logs.length) console.log('--LOGS--\n' + logs.join('\n')); await ctx.close(); };
  return { ctx, page, shot, aria, done, logs, W, BASE };
}
module.exports = { open, W, BASE };
