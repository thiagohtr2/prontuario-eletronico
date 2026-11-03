// Complemento para dev-1: INT8 (alerta novo) e estado de erro com espera maior.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { SITES } = require('./lib.cjs');
const cfg = SITES['dev-1'];
const CAP = path.resolve(__dirname, '../capturas');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(cfg.url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3500);
  const snap = () => p.evaluate((cfg) => {
    const l = document.querySelector(cfg.alertsList); const items = Array.from(l.children); const f = items[0];
    const sh = document.querySelector(cfg.header).parentElement.getBoundingClientRect();
    return { n: items.length, first: f && f.innerText.replace(/\s+/g, ' ').slice(0, 60), cls: f && f.className, anim: f && (getComputedStyle(f).animationName + ' ' + getComputedStyle(f).animationDuration), live: l.getAttribute('aria-live'), srLive: (document.querySelector('#sr-status') || {}).textContent, shell: [sh.width, sh.height], docV: document.scrollingElement.scrollHeight - innerHeight };
  }, cfg);
  const R = {};
  R.before = await snap();
  // espera espontânea (até 50 s)
  for (let i = 0; i < 100; i++) { await p.waitForTimeout(500); const s = await snap(); if (s.first !== R.before.first) { R.spontaneous = { ...s, waitedMs: (i + 1) * 500 }; break; } }
  // gerar via menu
  await p.click('#sim-btn'); await p.waitForTimeout(300);
  R.menuItems = await p.$$eval('[role=menuitem]', (es) => es.map((e) => e.textContent.trim() + (e.getAttribute('aria-disabled') === 'true' || e.disabled ? ' (desab.)' : '')));
  const before2 = await snap();
  await p.getByRole('menuitem', { name: /Gerar novo alerta/ }).click(); await p.waitForTimeout(100);
  R.generated = await snap(); R.generatedBefore = before2;
  // aria-live da lista é "off": o anúncio vai para #sr-status
  await p.waitForTimeout(1500);
  R.srStatusAfter = await p.evaluate(() => { const s = document.querySelector('#sr-status'); return s ? { live: s.getAttribute('aria-live'), text: s.textContent } : null; });
  // estado de erro
  await p.click('#sim-btn'); await p.waitForTimeout(300);
  await p.getByRole('menuitem', { name: /falha de conex/ }).click();
  for (let i = 0; i < 20; i++) { await p.waitForTimeout(500); const st = await p.evaluate(() => { const s = document.querySelector('#orders-state'); return s && !s.hidden ? s.innerText.replace(/\s+/g, ' ').slice(0, 100) : null; }); if (st) { R.errorState = { text: st, waitedMs: (i + 1) * 500 }; break; } }
  await p.screenshot({ path: `${CAP}/dev-1-estado-erro.png` });
  fs.writeFileSync(path.resolve(__dirname, '../medicoes/dev-1-complemento.json'), JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1));
  await b.close();
})();
