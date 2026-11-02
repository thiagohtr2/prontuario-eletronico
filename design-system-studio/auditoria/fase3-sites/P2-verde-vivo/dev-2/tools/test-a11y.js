// Verificações de acessibilidade/regras: contraste de textos, nomes acessíveis, reduced-motion.
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
function lum(c) { const a = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; }
(async () => {
  const b = await chromium.launch();
  for (const [name, vp, hash] of [['desktop', { width: 1280, height: 800 }, '#/'], ['catalogo', { width: 1280, height: 800 }, '#/catalogo'], ['mobile', { width: 390, height: 844 }, '#/catalogo']]) {
    const ctx = await b.newContext({ viewport: vp });
    const p = await ctx.newPage();
    await p.goto(URL + hash); await p.waitForTimeout(1200);
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); });
    const res = await p.evaluate(() => {
      function parse(c) { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,\/]+/).map(Number); return v; }
      function bgOf(el) { let e = el; while (e) { const c = parse(getComputedStyle(e).backgroundColor); if (c && (c[3] === undefined || c[3] > 0.95)) return c; e = e.parentElement; } return [246, 250, 246]; }
      const L = c => { const a = c.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; };
      const bad = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set();
      while (walker.nextNode()) {
        const n = walker.currentNode; if (!n.textContent.trim()) continue;
        const el = n.parentElement; if (seen.has(el)) continue; seen.add(el);
        if (el.closest('[hidden], [inert], svg, script, style, .visually-hidden')) continue;
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
        const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
        const fg = parse(cs.color), bg = bgOf(el); if (!fg) continue;
        const f2 = fg.length > 3 && fg[3] < 1 ? fg.slice(0, 3).map((v, i) => Math.round(v * fg[3] + bg[i] * (1 - fg[3]))) : fg;
        const ratio = (Math.max(L(f2), L(bg)) + 0.05) / (Math.min(L(f2), L(bg)) + 0.05);
        const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
        const large = size >= 24 || (size >= 18.66 && bold);
        const need = large ? 3 : 4.5;
        if (ratio < need) bad.push(`${(el.className || el.tagName)} "${n.textContent.trim().slice(0, 28)}" ${ratio.toFixed(2)} (<${need}) ${size}px`);
      }
      const noName = [...document.querySelectorAll('button, a[href], input, select')].filter(e => !e.closest('[hidden],[inert]') && !(e.getAttribute('aria-label') || e.textContent.trim() || (e.labels && e.labels.length) || e.getAttribute('title'))).map(e => e.outerHTML.slice(0, 80));
      const imgs = [...document.querySelectorAll('svg.art')].filter(s => !s.getAttribute('aria-label') && s.getAttribute('aria-hidden') !== 'true').length;
      return { bad, noName, imgs, lang: document.documentElement.lang, h1: document.querySelectorAll('h1:not([hidden])').length };
    });
    console.log(name, JSON.stringify(res, null, 1));
    await ctx.close();
  }
  // reduced motion: parallax desligado
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(URL); await p.waitForTimeout(600);
  await p.evaluate(() => window.scrollTo(0, 500)); await p.waitForTimeout(300);
  console.log('reduced-motion transform:', await p.$eval('.hero__tall .art', e => getComputedStyle(e).transform), 'reveal opacity:', await p.$eval('.care-card', e => getComputedStyle(e).opacity));
  await b.close();
})();
