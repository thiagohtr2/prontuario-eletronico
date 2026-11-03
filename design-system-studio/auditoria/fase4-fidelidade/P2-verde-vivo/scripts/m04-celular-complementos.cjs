// Complementos do celular: bottom sheet de filtros do dev-3 (clique por script, pois a página oscila),
// toques no dock do dev-3, menu do hambúrguer da landing do dev-3 e celular na horizontal (667x375, 740x360).
const { chromium, SITES, path } = require('./lib.cjs');
const CFG = require('./cfg.cjs');
const fs = require('fs');
const SHOT = (site, n) => path.join(__dirname, '..', 'capturas', `${site}-mobile-${n}.png`);
const MOB = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 };
(async () => {
  const b = await chromium.launch(); const res = {};
  // dev-3: oscilação no celular?
  {
    const ctx = await b.newContext(MOB); const page = await ctx.newPage();
    await page.goto(SITES['dev-3'] + '#/catalogo'); await page.waitForTimeout(1300);
    await page.evaluate(() => document.querySelector('#open-filters').scrollIntoView({ block: 'center', behavior: 'instant' }));
    const s = []; for (let i = 0; i < 10; i++) { s.push(await page.evaluate(() => Math.round(scrollY) + (document.documentElement.classList.contains('strip-collapsed') ? 'C' : 'E'))); await page.waitForTimeout(120); }
    res.dev3Oscilacao = s.join(' ');
    await page.evaluate(() => document.querySelector('#open-filters').click()); await page.waitForTimeout(900);
    res.dev3Sheet = await page.evaluate(() => { const p = document.querySelector('#filter-drawer'); const r = p.getBoundingClientRect(); const h = p.querySelector('[class*="grabber"], [class*="handle"]'); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), vh: innerHeight, radius: getComputedStyle(p).borderRadius, handle: !!(h && h.getBoundingClientRect().width > 0), maxH: getComputedStyle(p).maxHeight }; });
    await page.screenshot({ path: SHOT('dev-3', 'filtros-sheet') });
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    // dock
    await page.goto('about:blank'); await page.goto(SITES['dev-3'] + '#/catalogo'); await page.waitForTimeout(1300);
    const taps = [];
    for (const i of [0, 1, 2, 3]) {
      await page.goto('about:blank'); await page.goto(SITES['dev-3'] + '#/catalogo'); await page.waitForTimeout(1000);
      await page.evaluate((i) => document.querySelectorAll('#dock .dock-item')[i].click(), i); await page.waitForTimeout(900);
      taps.push(await page.evaluate(() => ({ hash: location.hash, cur: [...document.querySelectorAll('#dock .dock-item')].filter(e => e.getAttribute('aria-current')).map(e => e.textContent.trim()), active: document.activeElement && (document.activeElement.id || document.activeElement.tagName), dlg: [...document.querySelectorAll('[role=dialog]')].filter(d => d.getBoundingClientRect().width > 0 && d.classList.contains('is-open') || (d.getBoundingClientRect().width > 0 && getComputedStyle(d).visibility === 'visible' && getComputedStyle(d).transform === 'none')).map(d => d.id) })));
    }
    res.dev3Dock = taps;
    // hambúrguer da landing
    await page.goto('about:blank'); await page.goto(SITES['dev-3'] + ''); await page.waitForTimeout(1000);
    await page.evaluate(() => document.querySelector('#landing-menu-btn').click()); await page.waitForTimeout(700);
    res.dev3Hamb = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog], dialog, .menu-dialog')].find(e => e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden'); return d ? { text: d.innerText.replace(/\n+/g, ' / ').slice(0, 200), r: (r => [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)])(d.getBoundingClientRect()) } : null; });
    await page.screenshot({ path: SHOT('dev-3', 'hamburguer-landing') });
    await ctx.close();
  }
  // horizontal
  for (const vp of [{ width: 667, height: 375 }, { width: 740, height: 360 }]) {
    for (const site of Object.keys(CFG)) {
      for (const [nome, hash] of [['landing', ''], ['catalogo', '#/catalogo']]) {
        const ctx = await b.newContext({ viewport: vp, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const p = await ctx.newPage();
        await p.goto(SITES[site] + hash); await p.waitForTimeout(1200);
        const meas = async () => p.evaluate(() => { const els = [...document.querySelectorAll('body *')].filter(e => { const cs = getComputedStyle(e); if (!/fixed|sticky/.test(cs.position)) return false; const r = e.getBoundingClientRect(); return r.width > 300 && r.height > 15 && r.bottom > 0 && r.top < innerHeight && cs.display !== 'none' && cs.visibility !== 'hidden' && !e.closest('[hidden]'); }); const top = els.filter(e => e.getBoundingClientRect().top < 120).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0); const bot = els.filter(e => e.getBoundingClientRect().bottom > innerHeight - 120 && e.getBoundingClientRect().top > 120).reduce((m, e) => Math.max(m, innerHeight - e.getBoundingClientRect().top), 0); return { top: Math.round(top), bottom: Math.round(bot), pct: Math.round((top + bot) / innerHeight * 100), els: els.map(e => e.tagName + '.' + (e.className || '').toString().split(' ')[0] + ' ' + Math.round(e.getBoundingClientRect().top) + '-' + Math.round(e.getBoundingClientRect().bottom)).slice(0, 6) }; });
        const atTop = await meas();
        await p.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' })); await p.waitForTimeout(700);
        const reading = await meas();
        res[`horiz_${vp.width}x${vp.height}_${site}_${nome}`] = { atTop, reading };
        if (vp.width === 667) await p.screenshot({ path: SHOT(site, `horizontal-667-${nome}`) });
        await ctx.close();
      }
    }
  }
  fs.writeFileSync(path.join(__dirname, 'resultados', 'm04-celular-complementos.json'), JSON.stringify(res, null, 1));
  for (const [k, v] of Object.entries(res)) console.log(k, JSON.stringify(v).slice(0, 400));
  await b.close();
})();
