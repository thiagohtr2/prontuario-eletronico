// Medições de celular (390x844 e 320x700, emulação móvel): topbar, drawer, comportamento do drawer,
// tabela, gráfico, KPIs, alvos de toque, login no celular.
const fs = require('fs');
const path = require('path');
const { OUT, SITES, newPage, gotoLogin, login, launch } = require('./lib.cjs');

const SEL = {
  'dev-1': { header: '#app-header', main: '#main', drawer: '#drawer', scrim: '#scrim', kpi: '.kpi', chart: '.chart-card', act: '.activity-card', table: 'table.tbl' },
  'dev-2': { header: '#app-header', main: '#main', drawer: '#drawer', scrim: '#drawer-scrim', kpi: '.kpi', chart: '#blk-chart', act: '#blk-act', table: 'table.tbl' },
  'dev-3': { header: 'header.topbar', main: '#conteudo-app', drawer: '#sidebar', scrim: '.scrim', kpi: '.kpi', chart: '.chart-card', act: '.activity-card', table: 'table.data-table' },
};

const targetsFn = (rootSel) => {
  const root = rootSel ? document.querySelector(rootSel) : document;
  const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; };
  const els = [...root.querySelectorAll('a[href],button,input,select,textarea,summary,[role=button],[role=tab],[tabindex="0"]')].filter(vis).filter((e) => !e.closest('[inert]') && !e.closest('[aria-hidden=true]') && !e.classList.contains('sr-only') && !(e.closest('.sr-only')));
  return els.map((e) => {
    let r = e.getBoundingClientRect();
    // checkbox/radio dentro de label: usa a área do label
    if ((e.type === 'checkbox' || e.type === 'radio')) { const l = e.closest('label') || (e.id && document.querySelector('label[for="' + e.id + '"]')); if (l) { const lr = l.getBoundingClientRect(); if (lr.width * lr.height > r.width * r.height) r = lr; } }
    return { t: (e.getAttribute('aria-label') || e.textContent || e.value || e.type || '').trim().replace(/\s+/g, ' ').slice(0, 30), tag: e.tagName.toLowerCase(), w: Math.round(r.width), h: Math.round(r.height), ok: Math.round(r.width) >= 44 && Math.round(r.height) >= 44, okH: Math.round(r.height) >= 44 };
  });
};

(async () => {
  const browser = await launch();
  const res = {};
  for (const site of Object.keys(SITES)) {
    const sel = SEL[site];
    const R = res[site] = {};
    // ---------- login no celular ----------
    {
      const { ctx, page } = await newPage(browser, 390, 844);
      await gotoLogin(page, site);
      R.login390 = await page.evaluate(() => {
        const hd = [...document.querySelectorAll('header')].find((h) => h.getBoundingClientRect().height > 0);
        const card = document.querySelector('.login-card, .login__card, .auth-card');
        const inputs = [...document.querySelectorAll('input')].filter((i) => i.getBoundingClientRect().height > 0).map((i) => ({ type: i.type, fs: getComputedStyle(i).fontSize, h: Math.round(i.getBoundingClientRect().height) }));
        const cr = card ? card.getBoundingClientRect() : null;
        return { header: hd ? { h: Math.round(hd.getBoundingClientRect().height), bg: getComputedStyle(hd).backgroundColor } : null, card: cr ? { x: Math.round(cr.x), w: Math.round(cr.width), border: getComputedStyle(card).borderLeftWidth, radius: getComputedStyle(card).borderTopLeftRadius } : null, inputs, vw: innerWidth, sw: document.documentElement.scrollWidth };
      });
      R.loginTargets = await page.evaluate(targetsFn, null);
      await ctx.close();
    }
    // ---------- app no celular ----------
    const { ctx, page } = await newPage(browser, 390, 844);
    await login(page, site);
    R.topbar = await page.evaluate((sel) => {
      const hd = document.querySelector(sel.header); const r = hd.getBoundingClientRect(); const s = getComputedStyle(hd);
      const mb = [...document.querySelectorAll('button[aria-label="Abrir menu"]')].find((b) => b.getBoundingClientRect().width > 0);
      const mr = mb ? mb.getBoundingClientRect() : null;
      return { h: Math.round(r.height), y: Math.round(r.y), bg: s.backgroundColor, position: s.position, menuBtn: mr ? { x: Math.round(mr.x), w: Math.round(mr.width), h: Math.round(mr.height) } : null, text: hd.textContent.trim().replace(/\s+/g, ' ').slice(0, 60), items: [...hd.querySelectorAll('button,a')].filter((b) => b.getBoundingClientRect().width > 0).map((b) => (b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 25) + ' ' + Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height)) };
    }, sel);
    // bottom nav?
    R.bottomNav = await page.evaluate(() => [...document.querySelectorAll('nav, [class*=bottom]')].filter((n) => { const r = n.getBoundingClientRect(); const s = getComputedStyle(n); return r.height > 0 && (s.position === 'fixed' || s.position === 'sticky') && r.bottom >= innerHeight - 2 && r.top > innerHeight / 2; }).map((n) => n.className));
    // conteúdo: KPIs, gráfico, tabela
    R.content = await page.evaluate((sel) => {
      const kp = [...document.querySelectorAll(sel.kpi)].map((k) => { const r = k.getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width) }; });
      const ch = document.querySelector(sel.chart), ac = document.querySelector(sel.act);
      const svg = ch ? [...ch.querySelectorAll('svg')].sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0] : null;
      const sr = svg ? svg.getBoundingClientRect() : null;
      const xlabels = svg ? [...svg.querySelectorAll('text')].filter((t) => { const tr = t.getBoundingClientRect(); return tr.top > sr.top + sr.height * 0.75; }) : [];
      const cut = svg ? [...svg.querySelectorAll('text')].filter((t) => { const tr = t.getBoundingClientRect(); return tr.left < sr.left - 1 || tr.right > sr.right + 1; }).map((t) => t.textContent) : [];
      const legend = ch ? ch.querySelector('[class*=legend]') : null;
      const t = document.querySelector(sel.table);
      const tv = t ? t.getBoundingClientRect() : null;
      let scroller = t ? t.parentElement : null; let sc = null;
      while (scroller && scroller !== document.body) { const s = getComputedStyle(scroller); if (['auto', 'scroll'].includes(s.overflowX)) { sc = { cls: scroller.className, sw: scroller.scrollWidth, cw: scroller.clientWidth }; break; } scroller = scroller.parentElement; }
      const row = t ? t.querySelector('tbody tr') : null;
      return {
        kpis: kp, kpiCols: new Set(kp.map((k) => k.x)).size,
        chartActStacked: ch && ac ? ac.getBoundingClientRect().top >= ch.getBoundingClientRect().bottom - 2 : null,
        chart: sr ? { w: Math.round(sr.width), h: Math.round(sr.height), xlabels: xlabels.map((x) => x.textContent), cut, cardW: Math.round(ch.getBoundingClientRect().width) } : null,
        legendBelow: legend && sr ? legend.getBoundingClientRect().top >= sr.bottom - 2 : null,
        table: t ? { w: Math.round(tv.width), display: getComputedStyle(t).display, rowDisplay: row ? getComputedStyle(row).display : null, rowH: row ? Math.round(row.getBoundingClientRect().height) : null, scroller: sc, theadVisible: t.querySelector('thead') ? t.querySelector('thead').getBoundingClientRect().height > 1 && getComputedStyle(t.querySelector('thead')).position !== 'absolute' : null, cardLabels: row ? [...row.querySelectorAll('[data-label]')].length : 0 } : null,
        doc: { sw: document.documentElement.scrollWidth, vw: innerWidth },
      };
    }, sel);
    await page.screenshot({ path: path.join(OUT, 'capturas', site, 'dashboard-390-full.png'), fullPage: true });
    R.appTargets = await page.evaluate(targetsFn, null);
    // ---------- drawer ----------
    const mainBefore = await page.evaluate((sel) => { const m = document.querySelector(sel.main).getBoundingClientRect(); return Math.round(m.x); }, sel);
    const trigger = page.locator('button[aria-label="Abrir menu"]:visible').first();
    await trigger.click();
    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(OUT, 'capturas', site, 'drawer-390.png') });
    R.drawer = await page.evaluate(({ sel, mainBefore }) => {
      const d = document.querySelector(sel.drawer); const r = d.getBoundingClientRect(); const s = getComputedStyle(d);
      const scrims = [...document.querySelectorAll(sel.scrim)].filter((x) => x.getBoundingClientRect().width > 0 && getComputedStyle(x).visibility !== 'hidden' && getComputedStyle(x).opacity !== '0');
      const sc = scrims[0];
      const m = document.querySelector(sel.main);
      const ae = document.activeElement;
      const bodyOv = getComputedStyle(document.body).overflow + '/' + getComputedStyle(document.documentElement).overflow;
      const inertBg = !!(m.closest('[inert]') || m.closest('[aria-hidden=true]'));
      const items = [...d.querySelectorAll('a,button')].filter((e) => e.getBoundingClientRect().height > 0).map((e) => ({ t: (e.getAttribute('aria-label') || e.textContent).trim().replace(/\s+/g, ' ').slice(0, 30), h: Math.round(e.getBoundingClientRect().height), w: Math.round(e.getBoundingClientRect().width), icon: !!e.querySelector('svg') }));
      return { rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }, bg: s.backgroundColor, transition: s.transitionDuration + ' ' + s.transitionProperty.slice(0, 60) + ' ' + s.transitionTimingFunction, scrim: sc ? { bg: getComputedStyle(sc).backgroundColor, w: Math.round(sc.getBoundingClientRect().width) } : null, mainXBefore: mainBefore, mainXAfter: Math.round(m.getBoundingClientRect().x), focus: ae ? (ae.getAttribute('aria-label') || ae.textContent.trim().slice(0, 30)) + ' inDrawer=' + d.contains(ae) : null, bodyOv, inertBg, text: d.textContent.trim().replace(/\s+/g, ' ').slice(0, 300), items, vh: innerHeight };
    }, { sel, mainBefore });
    R.drawerTargets = await page.evaluate(targetsFn, sel.drawer);
    // trap de foco: 40 tabs
    let outside = 0;
    for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); const inside = await page.evaluate((s) => document.querySelector(s).contains(document.activeElement), sel.drawer); if (!inside) outside++; }
    R.drawerTrapOutside = outside;
    // Esc
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    R.escClose = await page.evaluate((s) => { const d = document.querySelector(s); const r = d.getBoundingClientRect(); const ae = document.activeElement; return { drawerX: Math.round(r.x), drawerVisible: r.right > 0 && getComputedStyle(d).visibility !== 'hidden', focus: ae ? ae.getAttribute('aria-label') : null }; }, sel.drawer);
    // scrim
    await trigger.click(); await page.waitForTimeout(450);
    await page.mouse.click(375, 400); await page.waitForTimeout(450);
    R.scrimClose = await page.evaluate((s) => { const d = document.querySelector(s); const r = d.getBoundingClientRect(); const ae = document.activeElement; return { drawerVisible: r.right > 0 && getComputedStyle(d).visibility !== 'hidden', focus: ae ? ae.getAttribute('aria-label') : null }; }, sel.drawer);
    // X
    await trigger.click(); await page.waitForTimeout(450);
    const closeBtn = page.locator(sel.drawer + ' button[aria-label^="Fechar"]:visible').first();
    R.hasCloseBtn = await closeBtn.count();
    if (R.hasCloseBtn) { await closeBtn.click(); await page.waitForTimeout(450); }
    R.xClose = await page.evaluate((s) => { const d = document.querySelector(s); const r = d.getBoundingClientRect(); const ae = document.activeElement; return { drawerVisible: r.right > 0 && getComputedStyle(d).visibility !== 'hidden', focus: ae ? ae.getAttribute('aria-label') : null }; }, sel.drawer);
    // destino
    await trigger.click(); await page.waitForTimeout(450);
    const dest = page.locator(sel.drawer + ' a:visible', { hasText: 'Contratos' }).first();
    R.destCount = await dest.count();
    if (R.destCount) { await dest.click(); await page.waitForTimeout(900); }
    R.destNav = await page.evaluate((s) => { const d = document.querySelector(s); const r = d.getBoundingClientRect(); const h1 = document.querySelector('main h1, h1'); return { url: location.hash, drawerVisible: r.right > 0 && getComputedStyle(d).visibility !== 'hidden', h1: h1 ? h1.textContent.trim() : null, focus: document.activeElement ? (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim().slice(0, 30)) : null }; }, sel.drawer);
    await ctx.close();
    // ---------- 320 px ----------
    {
      const { ctx: c3, page: p3 } = await newPage(browser, 320, 700);
      await login(p3, site);
      await p3.locator('button[aria-label="Abrir menu"]:visible').first().click();
      await p3.waitForTimeout(450);
      R.drawer320 = await p3.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) }; }, sel.drawer);
      await p3.screenshot({ path: path.join(OUT, 'capturas', site, 'drawer-320.png') });
      await c3.close();
    }
    // paisagem
    {
      const { ctx: c4, page: p4 } = await newPage(browser, 844, 390, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      await login(p4, site);
      const t = p4.locator('button[aria-label="Abrir menu"]:visible').first();
      R.landscapeMenu = await t.count();
      R.landscape = await p4.evaluate((sel) => { const sb = document.querySelector('#sidebar').getBoundingClientRect(); const hds = [...document.querySelectorAll('header')].filter((h) => h.getBoundingClientRect().height > 0).map((h) => Math.round(h.getBoundingClientRect().height)); return { sidebarW: Math.round(sb.width), sidebarX: Math.round(sb.x), headers: hds, sw: document.documentElement.scrollWidth }; }, sel);
      await p4.screenshot({ path: path.join(OUT, 'capturas', site, 'paisagem-844x390.png') });
      await c4.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'scripts', 'out-04-mobile.json'), JSON.stringify(res, null, 1));
  await browser.close();
})();
