// Varredura de larguras: overflow horizontal, elementos fora da viewport, texto cortado, sobreposições no topo.
const fs = require('fs');
const path = require('path');
const { OUT, SITES, newPage, gotoLogin, login, launch } = require('./lib.cjs');

const WIDTHS = [320, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920];

const probe = () => {
  const vw = innerWidth;
  const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const inScroller = (el) => { let p = el.parentElement; while (p && p !== document.body) { const s = getComputedStyle(p); if (['auto', 'scroll', 'hidden', 'clip'].includes(s.overflowX)) return true; p = p.parentElement; } return false; };
  const offRight = [...document.querySelectorAll('body *')].filter((e) => vis(e) && !e.closest('[aria-hidden=true]') && !e.closest('.sr-only') && !e.closest('#sidebar') && !e.closest('.drawer') && !e.closest('[role=tooltip]') && !e.closest('.toast-region, .toast')).filter((e) => { const r = e.getBoundingClientRect(); return (r.right > vw + 1 || r.left < -1) && !inScroller(e); }).map((e) => e.tagName + '.' + String(e.className).slice(0, 30) + ' [' + Math.round(e.getBoundingClientRect().left) + ',' + Math.round(e.getBoundingClientRect().right) + ']').slice(0, 6);
  const trunc = [...document.querySelectorAll('body *')].filter((e) => vis(e) && e.children.length === 0 && e.textContent.trim() && !e.closest('.sr-only') && !e.closest('[aria-hidden=true]')).filter((e) => { const s = getComputedStyle(e); return (s.textOverflow === 'ellipsis' || s.overflow === 'hidden' || s.overflowX === 'hidden') && e.scrollWidth > e.clientWidth + 1; }).map((e) => e.textContent.trim().slice(0, 40));
  // carrosséis/listas com rolagem horizontal local
  const hscroll = [...document.querySelectorAll('body *')].filter((e) => vis(e) && ['auto', 'scroll'].includes(getComputedStyle(e).overflowX) && e.scrollWidth > e.clientWidth + 1).map((e) => e.tagName + '.' + String(e.className).slice(0, 30) + ' ' + e.scrollWidth + '/' + e.clientWidth);
  return { sw: document.documentElement.scrollWidth, bsw: document.body.scrollWidth, vw, overflow: document.documentElement.scrollWidth > vw + 1, offRight, trunc: [...new Set(trunc)].slice(0, 8), hscroll };
};

(async () => {
  const browser = await launch();
  const res = {};
  for (const site of Object.keys(SITES)) {
    res[site] = {};
    for (const w of WIDTHS) {
      const h = w <= 480 ? 844 : 900;
      const { ctx, page } = await newPage(browser, w, h);
      await gotoLogin(page, site);
      const lg = await page.evaluate(probe);
      if ([320, 600, 1920].includes(w)) await page.screenshot({ path: path.join(OUT, 'capturas', site, `varredura-login-${w}.png`) });
      await login(page, site);
      const db = await page.evaluate(probe);
      await page.screenshot({ path: path.join(OUT, 'capturas', site, `varredura-dashboard-${w}.png`) });
      if ([320, 600, 1024].includes(w)) await page.screenshot({ path: path.join(OUT, 'capturas', site, `varredura-dashboard-${w}-full.png`), fullPage: true });
      res[site][w] = { login: lg, dashboard: db, errors: page._errors };
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'scripts', 'out-07-varredura.json'), JSON.stringify(res, null, 1));
  await browser.close();
})();
