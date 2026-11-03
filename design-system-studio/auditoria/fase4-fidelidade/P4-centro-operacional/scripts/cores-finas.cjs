// PAL2/PAL6/CMP1: distribuição de cor de texto, aba ativa (navActive), linha selecionada (selected), cor do sparkline, h1.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { SITES } = require('./lib.cjs');
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const [dev, cfg] of Object.entries(SITES)) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage(); await p.goto(cfg.url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
    await p.locator(`${cfg.table} tbody input[type=checkbox]`).first().check({ force: true }); await p.waitForTimeout(200);
    out[dev] = await p.evaluate((cfg) => {
      const hex = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return c; const q = m[1].split(/[ ,/]+/).map(Number); if (q.length === 4 && q[3] === 0) return 'transparent'; return '#' + q.slice(0, 3).map((v) => v.toString(16).padStart(2, '0')).join(''); };
      const dist = {}; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
      while ((n = tw.nextNode())) { if (!n.textContent.trim()) continue; const e = n.parentElement; const r = e.getBoundingClientRect(); if (r.width < 2) continue; const c = hex(getComputedStyle(e).color); dist[c] = (dist[c] || 0) + n.textContent.trim().length; }
      const row = document.querySelector(cfg.table + ' tbody tr'); const td = row.querySelector('td:nth-child(2), th:nth-child(2)');
      const spark = document.querySelector(cfg.kpi + ' ' + cfg.spark + ' path, ' + cfg.kpi + ' ' + cfg.spark + ' polyline, ' + cfg.kpi + ' svg.spark path, ' + cfg.kpi + ' ' + cfg.spark + ' svg *');
      const sparks = Array.from(document.querySelectorAll(cfg.kpi)).map((k) => { const s = k.querySelector((cfg.spark) + ' path, ' + cfg.spark + ' polyline'); return s ? hex(getComputedStyle(s).stroke) + ' fill:' + getComputedStyle(s).fill : null; });
      return { textColorChars: dist, selectedRow: [hex(getComputedStyle(row).backgroundColor), hex(getComputedStyle(td).backgroundColor), hex(getComputedStyle(td).color)], sparkStroke: sparks, h1: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent.trim()) };
    }, cfg);
    // aba ativa no celular
    const c2 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const q = await c2.newPage(); await q.goto(cfg.url, { waitUntil: 'domcontentloaded' }); await q.waitForTimeout(2500);
    out[dev].activeTab = await q.evaluate((cfg) => { const hex = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return c; const q = m[1].split(/[ ,/]+/).map(Number); if (q.length === 4 && q[3] === 0) return 'transparent'; return '#' + q.slice(0, 3).map((v) => v.toString(16).padStart(2, '0')).join(''); }; const ts = Array.from(document.querySelectorAll(cfg.mtabs + ' [role=tab]')); const a = ts.find((t) => t.getAttribute('aria-selected') === 'true'); const i = ts.find((t) => t.getAttribute('aria-selected') === 'false'); const ca = getComputedStyle(a), ci = getComputedStyle(i); const after = getComputedStyle(a, '::after'); return { active: { bg: hex(ca.backgroundColor), color: hex(ca.color), border: ca.borderBottom, after: after.content !== 'none' ? hex(after.backgroundColor) + ' h' + after.height : null, boxShadow: ca.boxShadow }, inactive: { bg: hex(ci.backgroundColor), color: hex(ci.color) } }; }, cfg);
    await c2.close(); await ctx.close();
  }
  fs.writeFileSync(path.resolve(__dirname, '../medicoes/cores-finas.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1)); await b.close();
})();
