// Sondagem do DOM: marcos (landmarks), regiões e candidatos a elementos-chave por site.
const fs = require('fs');
const path = require('path');
const { OUT, SITES, newPage, login, launch } = require('./lib.cjs');

(async () => {
  const browser = await launch();
  const res = {};
  for (const site of Object.keys(SITES)) {
    const { ctx, page } = await newPage(browser, 1440, 900);
    await login(page, site);
    res[site] = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const desc = (el) => { const r = el.getBoundingClientRect(); return { tag: el.tagName.toLowerCase(), id: el.id, cls: (el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0, 80), role: el.getAttribute('role'), aria: el.getAttribute('aria-label'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };
      const out = {};
      out.landmarks = [...document.querySelectorAll('header,nav,aside,main,footer,[role=navigation],[role=banner],[role=main],[role=complementary],[role=dialog]')].filter(vis).map(desc);
      out.headings = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map((e) => ({ ...desc(e), text: e.textContent.trim().slice(0, 60) }));
      out.tables = [...document.querySelectorAll('table')].map((t) => ({ ...desc(t), vis: vis(t), ths: [...t.querySelectorAll('th')].map((th) => th.textContent.trim().slice(0, 20) + '|' + th.getAttribute('scope') + '|' + th.getAttribute('aria-sort')) }));
      out.svgs = [...document.querySelectorAll('svg')].filter((s) => { const r = s.getBoundingClientRect(); return r.width > 200; }).map((s) => ({ ...desc(s), aria: s.getAttribute('aria-label'), rects: s.querySelectorAll('rect').length, lines: s.querySelectorAll('line').length }));
      out.canvas = document.querySelectorAll('canvas').length;
      out.buttons = [...document.querySelectorAll('button,a[href],select,[role=tab]')].filter(vis).map((e) => ({ ...desc(e), text: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40), expanded: e.getAttribute('aria-expanded'), current: e.getAttribute('aria-current'), selected: e.getAttribute('aria-selected') }));
      out.rootVars = (() => { const s = getComputedStyle(document.documentElement); const vars = []; for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) { if (r.selectorText === ':root' && r.style) { for (const p of r.style) if (p.startsWith('--')) vars.push(p + ':' + r.style.getPropertyValue(p).trim()); } } } catch (e) {} } return vars; })();
      return out;
    });
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'scripts', 'out-02-sondagem.json'), JSON.stringify(res, null, 1));
  await browser.close();
})();
