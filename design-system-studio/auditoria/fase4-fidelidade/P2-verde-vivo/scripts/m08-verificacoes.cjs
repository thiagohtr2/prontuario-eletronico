// Verificações pontuais: faixa e marca do dev-3 no catálogo, item ativo da linha 2 (catálogo, categoria), snap das pílulas.
const { chromium, SITES } = require('./lib.cjs');
const CFG = require('./cfg.cjs');
(async () => {
  const b = await chromium.launch();
  for (const site of Object.keys(CFG)) {
    const c = CFG[site];
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
    await p.goto(SITES[site] + c.catalog + (site === 'dev-3' ? '' : '')); await p.waitForTimeout(1300);
    const o = await p.evaluate((c) => {
      const hex = x => { const m = (x || '').match(/rgba?\(([^)]+)\)/); if (!m) return x; const q = m[1].split(/[ ,/]+/).map(Number); return '#' + q.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('') + (q.length > 3 && q[3] < 1 ? '@' + q[3] : ''); };
      const a = document.querySelector(c.announce); const ln = document.querySelector(c.logoName);
      const items = [...document.querySelectorAll(c.navItems + ' a, ' + c.navItems + ' button')].filter(e => e.getBoundingClientRect().width > 0).map(e => ({ t: e.textContent.trim().slice(0, 14), cur: e.getAttribute('aria-current'), color: hex(getComputedStyle(e).color), fw: getComputedStyle(e).fontWeight, bg: hex(getComputedStyle(e).backgroundColor) }));
      return { announce: a && { h: Math.round(a.getBoundingClientRect().height), bg: hex(getComputedStyle(a).backgroundColor), color: hex(getComputedStyle(a).color) }, logoName: ln && { t: ln.textContent, ff: getComputedStyle(ln).fontFamily.slice(0, 20), fw: getComputedStyle(ln).fontWeight }, navActive: items.filter(i => i.cur || i.fw >= 600 || i.bg !== '#000000@0') };
    }, c);
    console.log(site, JSON.stringify(o));
    await ctx.close();
  }
  await b.close();
})();
