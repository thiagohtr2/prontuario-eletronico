// Celular 390x844 (isMobile/hasTouch): header fixo, busca, faixa de categorias, dock, conteúdo atrás do dock,
// faixa de anúncio, hambúrguer, busca em tela cheia, filtros em bottom sheet, colunas, hero, alvos de toque, horizontal.
const { chromium, open, scrollThrough, path } = require('./lib.cjs');
const CFG = require('./cfg.cjs');
const fs = require('fs');
const SHOT = (site, n) => path.join(__dirname, '..', 'capturas', `${site}-mobile-${n}.png`);
const HEX = `(c => { const m = (c || '').match(/rgba?\\(([^)]+)\\)/); if (!m) return c; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return '#' + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('') + (p.length > 3 && p[3] < 1 ? '@' + p[3] : ''); })`;
async function vis(page, sel) { if (!sel) return false; return page.evaluate((s) => [...document.querySelectorAll(s)].some(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && !e.hidden && !e.closest('[hidden]'); }), sel); }
(async () => {
  const browser = await chromium.launch();
  const res = {};
  for (const site of Object.keys(CFG)) {
    const c = CFG[site]; const R = res[site] = {};
    for (const [nome, hash] of [['landing', c.landing], ['catalogo', c.catalog]]) {
      const { ctx, page } = await open(browser, site, 'mobile', hash, { reducedMotion: site === 'dev-3' ? 'reduce' : 'no-preference' });
      await page.waitForTimeout(1200);
      const O = R[nome] = {};
      O.static = await page.evaluate(([c, HEX]) => {
        const hex = eval(HEX);
        const visEl = (s) => s ? [...document.querySelectorAll(s)].find(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; }) : null;
        const R = (e) => e ? (r => ({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), b: Math.round(r.bottom) }))(e.getBoundingClientRect()) : null;
        const o = {};
        const ann = visEl(c.announce); o.announce = ann && { r: R(ann), ws: getComputedStyle(ann.querySelector('p, span') || ann).whiteSpace, close: R(visEl(c.announceClose)), textOv: (() => { const t = ann.querySelector('.announce__msg, .announce__text, p'); return t ? getComputedStyle(t).textOverflow + '/' + getComputedStyle(t).whiteSpace : null; })() };
        // bloco fixo do topo: todos os elementos fixed/sticky no topo
        const tops = [...document.querySelectorAll('body *')].filter(e => { const cs = getComputedStyle(e); if (!/fixed|sticky/.test(cs.position)) return false; const r = e.getBoundingClientRect(); return r.width > 300 && r.height > 20 && r.top < 200 && cs.display !== 'none' && cs.visibility !== 'hidden'; }).map(e => ({ el: e.tagName + '.' + (e.className || '').toString().split(' ')[0] + (e.id ? '#' + e.id : ''), pos: getComputedStyle(e).position, r: R(e) }));
        o.topBars = tops.slice(0, 5);
        const ms = visEl(c.mSearch); o.mSearch = ms && { r: R(ms), fs: getComputedStyle(ms).fontSize, tag: ms.tagName, ph: ms.placeholder || ms.textContent.trim() };
        const strip = visEl(c.strip), sc = visEl(c.stripScroller);
        o.strip = strip && { r: R(strip), ovx: sc && getComputedStyle(sc).overflowX, snap: sc && getComputedStyle(sc).scrollSnapType, scrollW: sc && sc.scrollWidth, clientW: sc && sc.clientWidth,
          pills: [...document.querySelectorAll(c.pill)].filter(e => e.getBoundingClientRect().width > 0).slice(0, 12).map(p => ({ t: p.textContent.trim(), svg: !!p.querySelector('svg'), h: Math.round(p.getBoundingClientRect().height), cur: p.getAttribute('aria-current') || p.getAttribute('aria-pressed') || p.getAttribute('aria-selected'), bg: hex(getComputedStyle(p).backgroundColor), color: hex(getComputedStyle(p).color), snapAlign: getComputedStyle(p).scrollSnapAlign || getComputedStyle(p.parentElement).scrollSnapAlign })) };
        const dock = visEl(c.dock);
        o.dock = dock && { r: R(dock), vw: document.documentElement.clientWidth, vh: innerHeight, pos: getComputedStyle(dock).position, radius: getComputedStyle(dock).borderRadius, bg: hex(getComputedStyle(dock).backgroundColor), shadow: getComputedStyle(dock).boxShadow !== 'none',
          items: [...dock.querySelectorAll('a, button')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const ico = e.querySelector('[class*="ico"], [class*="pill"]') || e; return { t: e.textContent.trim(), cur: e.getAttribute('aria-current'), color: hex(getComputedStyle(e).color), icoBg: hex(getComputedStyle(ico).backgroundColor), w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height), fill: (() => { const p = e.querySelector('svg path, svg use'); const s = e.querySelector('svg'); return s ? getComputedStyle(s).fill + '|' + (p ? getComputedStyle(p).fill : '') : null; })(), dot: !!e.querySelector('[class*="dot"]') || getComputedStyle(e, '::after').content !== 'none' || getComputedStyle(e.querySelector('.dock__label') || e, '::after').content !== 'none' }; }) };
        o.hamburger = !!visEl(c.hamburger);
        o.vw = document.documentElement.clientWidth; o.sw = document.documentElement.scrollWidth;
        // hero
        const tall = visEl(c.heroTall), small = visEl(c.heroSmall), title = visEl(c.heroTitle), text = visEl('.hero__text, .hero-lead');
        o.hero = { tall: R(tall), small: R(small), title: R(title), text: R(text), titleFs: title && getComputedStyle(title).fontSize };
        o.stagger = [...document.querySelectorAll(c.stagger)].filter(e => e.getBoundingClientRect().width > 0).map(e => R(e));
        // grade de produtos
        const cards = [...document.querySelectorAll(c.card)].filter(e => e.getBoundingClientRect().width > 0);
        if (cards.length) { const y0 = Math.round(cards[0].getBoundingClientRect().y); o.cols = cards.filter(e => Math.abs(Math.round(e.getBoundingClientRect().y) - y0) < 4).length; o.cardW = Math.round(cards[0].getBoundingClientRect().width); }
        o.inputs = [...document.querySelectorAll('input, select, textarea')].filter(e => e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden').map(e => (e.id || e.name || e.type) + ':' + getComputedStyle(e).fontSize);
        return o;
      }, [c, HEX]);
      await page.screenshot({ path: SHOT(site, nome + '-topo') });
      // depois de rolar 700 px
      await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' })); await page.waitForTimeout(700);
      O.scrolled = await page.evaluate((c) => {
        const tops = [...document.querySelectorAll('body *')].filter(e => { const cs = getComputedStyle(e); if (!/fixed|sticky/.test(cs.position)) return false; const r = e.getBoundingClientRect(); return r.width > 300 && r.height > 20 && r.top <= 2 && r.bottom > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; }).map(e => ({ el: e.tagName + '.' + (e.className || '').toString().split(' ')[0], r: [Math.round(e.getBoundingClientRect().top), Math.round(e.getBoundingClientRect().bottom)] }));
        const strip = document.querySelector(c.strip); const sr = strip && strip.getBoundingClientRect();
        const ms = document.querySelector(c.mSearch); const msr = ms && ms.getBoundingClientRect();
        return { tops: tops.slice(0, 4), strip: sr && [Math.round(sr.top), Math.round(sr.bottom), getComputedStyle(strip).visibility], search: msr && [Math.round(msr.top), Math.round(msr.bottom)] };
      }, c);
      await page.screenshot({ path: SHOT(site, nome + '-rolada') });
      // fim da página: conteúdo atrás do dock?
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await page.waitForTimeout(800);
      O.bottom = await page.evaluate((c) => {
        const dock = [...document.querySelectorAll(c.dock)].find(e => e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden');
        const dr = dock ? dock.getBoundingClientRect() : null;
        const leaves = [...document.querySelectorAll('footer *, main *')].filter(e => e.children.length === 0 && (e.textContent.trim() || e.tagName === 'A') && e.getBoundingClientRect().height > 0 && getComputedStyle(e).visibility !== 'hidden');
        const last = leaves.sort((a, b) => b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom)[0];
        const lr = last ? last.getBoundingClientRect() : null;
        const covered = dock ? leaves.filter(e => { const r = e.getBoundingClientRect(); return r.bottom > dr.top + 2 && r.top < dr.bottom; }).map(e => e.textContent.trim().slice(0, 30)) : [];
        return { dockTop: dr && Math.round(dr.top), lastText: last && last.textContent.trim().slice(0, 40), lastBottom: lr && Math.round(lr.bottom), covered: covered.slice(0, 5), vh: innerHeight };
      }, c);
      await page.screenshot({ path: SHOT(site, nome + '-fim') });
      // alvos de toque (página inteira, elementos visíveis)
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(500);
      O.targets = await page.evaluate(() => {
        const els = [...document.querySelectorAll('a[href], button, input, select, textarea, summary, [role=button], [role=tab], [role=option], [tabindex]:not([tabindex="-1"])')].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !e.closest('[hidden], [aria-hidden="true"], .sr-only, .visually-hidden') && !(e.classList.contains('skip-link')); });
        const small = els.filter(e => { const r = e.getBoundingClientRect(); return r.width < 43.5 || r.height < 43.5; }).map(e => { const r = e.getBoundingClientRect(); return `${e.tagName.toLowerCase()}.${(e.className || '').toString().split(' ')[0]} "${(e.getAttribute('aria-label') || e.textContent).trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`; });
        return { total: els.length, small: small.length, list: small.slice(0, 25) };
      });
      await ctx.close();
    }
    // ---------- interações no catálogo ----------
    const { ctx, page } = await open(browser, site, 'mobile', c.catalog, { reducedMotion: site === 'dev-3' ? 'reduce' : 'no-preference' });
    await page.waitForTimeout(1300);
    const I = R.inter = {};
    try {
      // tocar na busca
      await page.locator(c.mSearch).first().tap(); await page.waitForTimeout(800);
      I.searchTap = await page.evaluate(() => {
        const ae = document.activeElement; const dlg = [...document.querySelectorAll('[role=dialog], .sscreen, [role=listbox]')].filter(d => { const r = d.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(d).visibility !== 'hidden' && !d.closest('[hidden]'); });
        return { active: ae && (ae.tagName + '#' + ae.id + ' fs=' + getComputedStyle(ae).fontSize + ' role=' + ae.getAttribute('role')), panels: dlg.map(d => { const r = d.getBoundingClientRect(); return (d.getAttribute('aria-label') || d.className.toString().split(' ')[0]) + ` ${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`; }), text: dlg.map(d => d.innerText.replace(/\n+/g, ' / ').slice(0, 120)) };
      });
      await page.screenshot({ path: SHOT(site, 'busca-toque') });
      await page.keyboard.press('Escape'); await page.waitForTimeout(400);
      // categoria: rolar a faixa e tocar numa pílula visível
      await page.goto('about:blank'); await page.goto(require('./lib.cjs').SITES[site] + c.catalog); await page.waitForTimeout(1300);
      const n0 = await page.evaluate((c) => [...document.querySelectorAll(c.card)].filter(e => e.getBoundingClientRect().width > 0).length, c);
      await page.evaluate((c) => { const s = document.querySelector(c.stripScroller); if (s) s.scrollLeft = 120; }, c); await page.waitForTimeout(400);
      const before = await page.evaluate((c) => { const s = document.querySelector(c.stripScroller); return s ? Math.round(s.scrollLeft) : null; }, c);
      const pills = page.locator(c.pill);
      let tapped = null; const np = await pills.count();
      for (let i = 0; i < np; i++) { const p = pills.nth(i); const bb = await p.boundingBox(); if (bb && bb.x > 30 && bb.x + bb.width < 370 && !/todas/i.test(await p.innerText())) { tapped = (await p.innerText()).trim(); await p.tap(); break; } }
      await page.waitForTimeout(1300);
      I.pill = await page.evaluate(([c, before, tapped, n0]) => { const s = document.querySelector(c.stripScroller); const cards = [...document.querySelectorAll(c.card)].filter(e => e.getBoundingClientRect().width > 0); const act = [...document.querySelectorAll(c.pill)].filter(p => p.getAttribute('aria-current') || p.getAttribute('aria-pressed') === 'true' || p.classList.contains('is-active')).map(p => p.textContent.trim()); return { tapped, before, after: s ? Math.round(s.scrollLeft) : null, n0, n1: cards.length, hash: location.hash, active: act, scrollY: Math.round(scrollY) }; }, [c, before, tapped, n0]);
      await page.screenshot({ path: SHOT(site, 'categoria-tocada') });
      // filtros: bottom sheet
      await page.goto('about:blank'); await page.goto(require('./lib.cjs').SITES[site] + c.catalog); await page.waitForTimeout(1300);
      const fb = page.locator(c.filterBtn).first(); await fb.scrollIntoViewIfNeeded(); await fb.tap(); await page.waitForTimeout(900);
      I.sheet = await page.evaluate((c) => { const p = [...document.querySelectorAll(c.drawerPanel)].find(e => e.getBoundingClientRect().width > 0); if (!p) return null; const r = p.getBoundingClientRect(); const handle = p.querySelector('[class*="handle"], [class*="grabber"]'); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), b: Math.round(r.bottom), vh: innerHeight, radius: getComputedStyle(p).borderRadius, handle: !!(handle && handle.getBoundingClientRect().width > 0), maxH: getComputedStyle(p).maxHeight }; }, c);
      await page.screenshot({ path: SHOT(site, 'filtros-sheet') });
      await page.keyboard.press('Escape'); await page.waitForTimeout(400);
      // dock: tocar no 2º destino
      await page.goto('about:blank'); await page.goto(require('./lib.cjs').SITES[site] + c.landing); await page.waitForTimeout(1300);
      I.dockLanding = await vis(page, c.dock);
      await page.goto('about:blank'); await page.goto(require('./lib.cjs').SITES[site] + c.catalog); await page.waitForTimeout(1300);
      const items = page.locator(c.dockItem); const ni = await items.count(); I.dockTaps = [];
      for (let i = 0; i < ni; i++) { const it = items.nth(i); if (!(await it.isVisible())) continue; const t = (await it.innerText()).trim(); await it.tap(); await page.waitForTimeout(1000); I.dockTaps.push(await page.evaluate(([c, t]) => ({ t, hash: location.hash, y: Math.round(scrollY), cur: [...document.querySelectorAll(c.dockItem)].filter(e => e.getAttribute('aria-current')).map(e => e.textContent.trim()), dlg: [...document.querySelectorAll('[role=dialog]')].filter(d => d.getBoundingClientRect().width > 0 && getComputedStyle(d).visibility !== 'hidden' && !d.closest('[hidden]')).map(d => (d.getAttribute('aria-label') || (d.querySelector('h2') || {}).textContent || '').trim().slice(0, 20)) }), [c, t])); await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
      // hambúrguer
      if (c.hamburger) {
        for (const h of [c.landing, c.catalog]) {
          await page.goto('about:blank'); await page.goto(require('./lib.cjs').SITES[site] + h); await page.waitForTimeout(1200);
          const hb = page.locator(c.hamburger).first();
          if (await hb.count() && await hb.isVisible()) { await hb.tap(); await page.waitForTimeout(700); I['hamb' + (h ? 'Cat' : 'Land')] = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog], .mmenu, .menu-dialog, dialog')].find(e => e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden' && !e.closest('[hidden]')); return d ? d.innerText.replace(/\n+/g, ' / ').slice(0, 200) : null; }); await page.screenshot({ path: SHOT(site, 'hamburguer-' + (h ? 'catalogo' : 'landing')) }); }
        }
      }
    } catch (e) { I.err = e.message.slice(0, 300); }
    await ctx.close();
    // ---------- horizontal 844x390 ----------
    for (const [nome, hash] of [['landing', c.landing], ['catalogo', c.catalog]]) {
      const ctx2 = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      const p2 = await ctx2.newPage(); await p2.goto(require('./lib.cjs').SITES[site] + hash); await p2.waitForTimeout(1300);
      await p2.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' })); await p2.waitForTimeout(600);
      await p2.evaluate(() => window.scrollTo({ top: 450, behavior: 'instant' })); await p2.waitForTimeout(600);
      R['horiz_' + nome] = await p2.evaluate(() => { const els = [...document.querySelectorAll('body *')].filter(e => { const cs = getComputedStyle(e); if (!/fixed|sticky/.test(cs.position)) return false; const r = e.getBoundingClientRect(); return r.width > 300 && r.height > 15 && r.bottom > 0 && r.top < innerHeight && cs.display !== 'none' && cs.visibility !== 'hidden' && !e.closest('[hidden]'); }); const top = els.filter(e => e.getBoundingClientRect().top < 100).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0); const bot = els.filter(e => e.getBoundingClientRect().bottom > innerHeight - 100).reduce((m, e) => Math.max(m, innerHeight - e.getBoundingClientRect().top), 0); return { top: Math.round(top), bottom: Math.round(bot), pct: Math.round((top + bot) / innerHeight * 100), els: els.map(e => e.tagName + '.' + (e.className || '').toString().split(' ')[0] + ' ' + Math.round(e.getBoundingClientRect().top) + '-' + Math.round(e.getBoundingClientRect().bottom)).slice(0, 6) }; });
      await p2.screenshot({ path: SHOT(site, 'horizontal-' + nome) });
      await ctx2.close();
    }
    console.log(site, 'ok');
  }
  fs.writeFileSync(path.join(__dirname, 'resultados', 'm03-celular.json'), JSON.stringify(res, null, 1));
  await browser.close();
})();
