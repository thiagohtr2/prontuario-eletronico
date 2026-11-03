// Varre tamanhos de fonte (mín. 12 px; botões/filtros ≥ 14 px), raios e sombras em superfícies não flutuantes.
const { chromium, SITES, path } = require('./lib.cjs');
const CFG = require('./cfg.cjs');
const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const res = {};
  for (const site of Object.keys(CFG)) {
    const c = CFG[site]; res[site] = {};
    for (const [vpn, vp] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }]]) {
      for (const [nome, hash] of [['landing', c.landing], ['catalogo', c.catalog]]) {
        const ctx = await b.newContext(vp); const p = await ctx.newPage(); await p.goto(SITES[site] + hash); await p.waitForTimeout(1300);
        await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 60)); } window.scrollTo({ top: 0, behavior: 'instant' }); });
        res[site][`${vpn}-${nome}`] = await p.evaluate((c) => {
          const visible = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !e.closest('[hidden], .sr-only, .visually-hidden, [aria-hidden="true"]'); };
          const texts = [...document.querySelectorAll('body *')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && visible(e));
          const fsz = texts.map(e => ({ e, fs: parseFloat(getComputedStyle(e).fontSize) }));
          const lt12 = fsz.filter(x => x.fs < 11.95).map(x => x.e.tagName + '.' + (x.e.className || '').toString().split(' ')[0] + ' "' + x.e.textContent.trim().slice(0, 18) + '" ' + x.fs);
          const ctrls = [...document.querySelectorAll('button, select, .chip, [role=button], label.chip')].filter(e => visible(e) && e.textContent.trim());
          const lt14 = ctrls.filter(e => parseFloat(getComputedStyle(e).fontSize) < 13.95).map(e => e.tagName + '.' + (e.className || '').toString().split(' ')[0] + ' "' + e.textContent.trim().slice(0, 18) + '" ' + getComputedStyle(e).fontSize);
          const comp = e => e.closest(c.card) || e.closest(c.drawer) || e.closest('.search, .search-field, .search__field, .suggest, .search__panel, [role=dialog], [role=listbox], .popover, .mega, .dock, .drawer, .overlay, .toast, .toasts, .sscreen');
          const floating = e => { let a = e; while (a && a !== document.body) { const pos = getComputedStyle(a).position; if (/fixed|absolute|sticky/.test(pos)) return true; a = a.parentElement; } return false; };
          const shadows = [...document.querySelectorAll('main *, footer *, section *')].filter(e => visible(e) && getComputedStyle(e).boxShadow !== 'none' && !comp(e) && !floating(e) && !/inset/.test(getComputedStyle(e).boxShadow)).map(e => e.tagName + '.' + (e.className || '').toString().split(' ')[0] + ' ' + getComputedStyle(e).boxShadow.slice(0, 50));
          const radii = {}; [...document.querySelectorAll('main *, footer *')].filter(e => visible(e) && !comp(e)).forEach(e => { const cs = getComputedStyle(e); const r = cs.borderTopLeftRadius; if (r !== '0px' && (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.borderTopWidth !== '0px')) { const k = r; radii[k] = radii[k] || []; if (radii[k].length < 3) radii[k].push(e.tagName + '.' + (e.className || '').toString().split(' ')[0]); } });
          return { nTexts: texts.length, lt12: { n: lt12.length, ex: lt12.slice(0, 6) }, ctrls: ctrls.length, lt14: { n: lt14.length, ex: lt14.slice(0, 6) }, shadowsNonFloating: shadows.slice(0, 8), nShadows: shadows.length, radii };
        }, c);
        await ctx.close();
      }
    }
  }
  fs.writeFileSync(path.join(__dirname, 'resultados', 'm07-tipografia-geometria.json'), JSON.stringify(res, null, 1));
  for (const s in res) { console.log('=====', s); for (const k in res[s]) console.log(k, JSON.stringify(res[s][k]).slice(0, 700)); }
  await b.close();
})();
