const { chromium } = require('playwright');
const fs = require('fs');
const STATE = __dirname + '/../perfil/state.json';
async function open(w=1440,h=900, opts={}){
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, acceptDownloads: true, ...(fs.existsSync(STATE) && !opts.fresh ? { storageState: STATE } : {}), ...opts.ctx });
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', m => { if (m.type()!=='log' && m.type()!=='debug') logs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
  const close = async () => { await page.waitForTimeout(1200); if (!opts.nosave) await ctx.storageState({ path: STATE }); await browser.close(); };
  return { ctx, page, logs, close, browser };
}
async function dump(page, n=5000){ const t = await page.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText); console.log(t.slice(0,n)); }
async function controls(page, sel='main'){ const els = await page.evaluate((sel) => [...document.querySelector(sel).querySelectorAll('a,button,input,select,textarea,[role=tab],[role=radio],[role=option],[role=checkbox]')].map(e => `${e.tagName}${e.getAttribute('role')?'('+e.getAttribute('role')+')':''} | ${(e.innerText||e.value||e.getAttribute('aria-label')||e.placeholder||'').trim().replace(/\s+/g,' ').slice(0,70)} | ${e.getAttribute('aria-pressed')||e.getAttribute('aria-checked')||e.getAttribute('aria-selected')||''}${e.disabled?' DISABLED':''}`), sel); console.log(els.join('\n')); }
const C = __dirname + '/../capturas/';
const BASE = 'http://127.0.0.1:4300/';
module.exports = { open, dump, controls, C, BASE };
