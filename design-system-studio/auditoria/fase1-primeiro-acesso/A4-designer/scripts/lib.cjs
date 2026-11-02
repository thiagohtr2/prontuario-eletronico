const { chromium } = require('playwright');
async function open(w=1440,h=900){
  const ctx = await chromium.launchPersistentContext(__dirname + '/../perfil', { viewport: { width: w, height: h }, acceptDownloads: true });
  const page = ctx.pages()[0] || await ctx.newPage();
  const logs = [];
  page.on('console', m => { if (m.type()!=='log' && m.type()!=='debug') logs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
  return { ctx, page, logs };
}
async function dump(page, n=5000){ const t = await page.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText); console.log(t.slice(0,n)); }
async function controls(page, sel='main'){ const els = await page.evaluate((sel) => [...document.querySelector(sel).querySelectorAll('a,button,input,select,textarea,[role=tab],[role=radio],[role=option]')].map(e => `${e.tagName}${e.type?'['+e.type+']':''} | ${(e.innerText||e.value||e.getAttribute('aria-label')||e.placeholder||'').trim().replace(/\s+/g,' ').slice(0,70)} | pressed=${e.getAttribute('aria-pressed')||e.getAttribute('aria-checked')||e.getAttribute('aria-selected')||''}`), sel); console.log(els.join('\n')); }
const C = __dirname + '/../capturas/';
module.exports = { open, dump, controls, C };
