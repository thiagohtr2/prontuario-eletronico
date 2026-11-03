// PAL13: amostra de padding e gap (px) em 1440x900; conta múltiplos de 4.
// Também confere fonte efetivamente usada pelo renderizador (PAL7) via largura de texto.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { SITES } = require('./lib.cjs');
(async () => {
  const b = await chromium.launch();
  const out = {};
  for (const [dev, cfg] of Object.entries(SITES)) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage(); await p.goto(cfg.url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
    out[dev] = await p.evaluate(() => {
      const vals = {}; let n4 = 0, tot = 0;
      document.querySelectorAll('header *, main *, aside *, footer *, header, main, aside, footer').forEach((e) => {
        const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
        if (e.closest('svg')) return;
        const c = getComputedStyle(e);
        const props = [c.paddingTop, c.paddingRight, c.paddingBottom, c.paddingLeft];
        if (c.display.includes('grid') || c.display.includes('flex')) { props.push(c.rowGap, c.columnGap); }
        props.forEach((v) => { const x = parseFloat(v); if (!x || isNaN(x)) return; tot++; if (Math.abs(x / 4 - Math.round(x / 4)) < 0.01) n4++; else vals[x] = (vals[x] || 0) + 1; });
      });
      // fonte: compara largura com fallback serif
      const probe = (ff) => { const s = document.createElement('span'); s.style.cssText = 'position:absolute;visibility:hidden;font-size:40px;font-family:' + ff; s.textContent = 'Centro Operacional 0123456789'; document.body.appendChild(s); const w = s.getBoundingClientRect().width; s.remove(); return w; };
      const bodyFF = getComputedStyle(document.querySelector('main') || document.body).fontFamily;
      return { total: tot, mult4: n4, pct: +(100 * n4 / tot).toFixed(1), offScale: vals, fontWidth: { site: probe(bodyFF), inter: probe('Inter'), serif: probe('serif') }, mainFont: bodyFF };
    });
    await ctx.close();
  }
  fs.writeFileSync(path.resolve(__dirname, '../medicoes/espacamento-fonte.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
