// Medições de desktop (1440x900) e larguras de tablet/notebook para a sidebar.
const fs = require('fs');
const path = require('path');
const { OUT, SITES, newPage, gotoLogin, login, launch } = require('./lib.cjs');

const SEL = {
  'dev-1': { header: '#app-header', main: '#main', kpi: '.kpi', chart: '.chart-card', act: '.activity-card', table: 'table.tbl', tableCard: '.tbl-card', top: '.sb-top' },
  'dev-2': { header: '#app-header', main: '#main', kpi: '.kpi', chart: '#blk-chart', act: '#blk-act', table: 'table.tbl', tableCard: null, top: '.sidebar__top' },
  'dev-3': { header: 'header.app-header', main: '#conteudo-app', kpi: '.kpi', chart: '.chart-card', act: '.activity-card', table: 'table.data-table', tableCard: '.table-card', top: null },
};

function measureFn(sel) {
  const rgb2hex = (c) => { const m = (c || '').match(/rgba?\(([^)]+)\)/); if (!m) return c; const p = m[1].split(',').map((x) => parseFloat(x)); if (p.length === 4 && p[3] === 0) return 'transparent'; return '#' + p.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, '0')).join('') + (p.length === 4 && p[3] < 1 ? '@' + p[3] : ''); };
  const R = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom) }; };
  const cs = (el) => el ? getComputedStyle(el) : null;
  const vis = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const q = (s) => s ? document.querySelector(s) : null;
  const sb = document.querySelector('#sidebar');
  const hd = q(sel.header);
  const main = q(sel.main);
  const out = {};
  const sbs = cs(sb);
  out.sidebar = { rect: R(sb), radius: sbs.borderRadius, shadow: sbs.boxShadow, margin: sbs.margin, position: sbs.position, overflowY: sbs.overflowY, bg: rgb2hex(sbs.backgroundColor) };
  // filhos com overflow
  out.sidebarScrollers = [...sb.querySelectorAll('*')].filter((e) => ['auto', 'scroll'].includes(getComputedStyle(e).overflowY)).map((e) => e.tagName + '.' + e.className);
  const hs = cs(hd);
  out.header = { rect: R(hd), bg: rgb2hex(hs.backgroundColor), borderBottom: hs.borderBottomWidth + ' ' + rgb2hex(hs.borderBottomColor), shadow: hs.boxShadow, position: hs.position };
  // topo da sidebar
  const top = sel.top ? q(sel.top) : sb.firstElementChild;
  out.sidebarTop = { rect: R(top), text: top ? top.textContent.trim().replace(/\s+/g, ' ').slice(0, 80) : null, children: top ? [...sb.children].slice(0, 4).map((c) => c.tagName + '.' + c.className + ' h=' + Math.round(c.getBoundingClientRect().height)) : null };
  // inventário do header
  const hdBtns = [...hd.querySelectorAll('a,button,select,[role=tab]')].filter(vis);
  out.headerItems = hdBtns.map((e) => ({ t: (e.textContent || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 30), aria: e.getAttribute('aria-label'), cur: e.getAttribute('aria-current') || e.getAttribute('aria-selected'), w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height) }));
  const tabsNav = hd.querySelector('nav[aria-label="Principal"]') || hd.querySelector('nav');
  const tabs = tabsNav ? [...tabsNav.querySelectorAll('a,button,[role=tab]')].filter(vis) : [];
  out.tabs = tabs.map((t) => { const s = getComputedStyle(t); return { text: t.textContent.trim(), cur: t.getAttribute('aria-current'), sel: t.getAttribute('aria-selected'), bg: rgb2hex(s.backgroundColor), color: rgb2hex(s.color), bl: s.borderLeftWidth + ' ' + rgb2hex(s.borderLeftColor), bt: s.borderTopWidth, radius: s.borderTopLeftRadius, rect: R(t) }; });
  const avatar = [...hd.querySelectorAll('button,a')].filter(vis).find((e) => /perfil|avatar|conta/i.test((e.getAttribute('aria-label') || '') + e.className));
  out.avatar = avatar ? { rect: R(avatar), aria: avatar.getAttribute('aria-label'), inner: R(avatar.querySelector('.avatar') || avatar) } : null;
  // sidebar: grupos e itens
  const gt = sb.querySelector('h2, h3, .sb-group-title, [class*=group] [class*=title]');
  if (gt) { const s = getComputedStyle(gt); out.groupTitle = { text: gt.textContent.trim(), fs: s.fontSize, tt: s.textTransform, fw: s.fontWeight, ls: s.letterSpacing, color: rgb2hex(s.color) }; }
  const navLinks = [...sb.querySelectorAll('nav a, nav button')].filter(vis);
  out.navItems = navLinks.slice(0, 12).map((a) => { const s = getComputedStyle(a); const ic = a.querySelector('svg'); return { text: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 30), h: Math.round(a.getBoundingClientRect().height), icon: ic ? Math.round(ic.getBoundingClientRect().width) : 0, cur: a.getAttribute('aria-current'), exp: a.getAttribute('aria-expanded') }; });
  const act = sb.querySelector('[aria-current="page"]') || sb.querySelector('[aria-current]');
  if (act) {
    const s = getComputedStyle(act); const b = getComputedStyle(act, '::before'); const a2 = getComputedStyle(act, '::after');
    out.activeItem = { text: act.textContent.trim(), bg: rgb2hex(s.backgroundColor), color: rgb2hex(s.color), borderLeft: s.borderLeftWidth + ' ' + rgb2hex(s.borderLeftColor), shadow: s.boxShadow, before: b.content !== 'none' ? { w: b.width, h: b.height, bg: rgb2hex(b.backgroundColor), left: b.left, pos: b.position } : null, after: a2.content !== 'none' ? { w: a2.width, h: a2.height, bg: rgb2hex(a2.backgroundColor), left: a2.left } : null, rect: R(act) };
    const nonAct = navLinks.find((e) => e !== act && !e.getAttribute('aria-expanded'));
    if (nonAct) { const s2 = getComputedStyle(nonAct); out.nonActive = { bg: rgb2hex(s2.backgroundColor), color: rgb2hex(s2.color) }; }
  }
  const allNavLabels = [...sb.querySelectorAll('nav a, nav button')].map((a) => a.textContent.trim().replace(/\s+/g, ' ')).filter(Boolean);
  out.navLabels = allNavLabels;
  const foot = sb.lastElementChild;
  out.sidebarFoot = { text: foot.textContent.trim().replace(/\s+/g, ' ').slice(0, 120), rect: R(foot), buttons: [...foot.querySelectorAll('button,a')].map((b) => b.getAttribute('aria-label') || b.textContent.trim()) };
  out.unitSelector = [...sb.querySelectorAll('button')].filter((b) => b.getAttribute('aria-haspopup')).map((b) => ({ aria: b.getAttribute('aria-label'), text: b.textContent.trim().replace(/\s+/g, ' ').slice(0, 60), rect: R(b) }));
  // conteúdo
  const h1 = main.querySelector('h1');
  out.h1 = h1 ? { text: h1.textContent.trim(), rect: R(h1), fs: cs(h1).fontSize, fw: cs(h1).fontWeight, ff: cs(h1).fontFamily, color: rgb2hex(cs(h1).color) } : null;
  out.main = { rect: R(main), bg: rgb2hex(cs(main).backgroundColor), padding: cs(main).padding };
  out.body = { bg: rgb2hex(cs(document.body).backgroundColor), color: rgb2hex(cs(document.body).color), fs: cs(document.body).fontSize, ff: cs(document.body).fontFamily };
  // primeiro descendente de main com padding
  let pc = main; for (let i = 0; i < 4 && pc; i++) { const s = cs(pc); if (parseFloat(s.paddingLeft) > 0) break; pc = pc.firstElementChild; }
  out.contentPadding = pc ? { el: pc.tagName + '.' + pc.className, padding: cs(pc).padding } : null;
  const kpis = [...document.querySelectorAll(sel.kpi)].filter(vis);
  out.kpis = kpis.map((k) => { const s = cs(k); const lab = k.querySelector('[class*=label]'); const val = k.querySelector('[class*=value]'); const delta = k.querySelector('[class*=delta], [class*=foot], [class*=trend]'); return { rect: R(k), bg: rgb2hex(s.backgroundColor), border: s.borderTopWidth + ' ' + s.borderTopStyle + ' ' + rgb2hex(s.borderTopColor), radius: s.borderTopLeftRadius, shadow: s.boxShadow, label: lab ? { t: lab.textContent.trim(), color: rgb2hex(cs(lab).color), fs: cs(lab).fontSize } : null, value: val ? { t: val.textContent.trim(), fs: cs(val).fontSize, fw: cs(val).fontWeight, color: rgb2hex(cs(val).color), fvn: cs(val).fontVariantNumeric } : null, delta: delta ? { t: delta.textContent.trim().slice(0, 50), html: [...delta.querySelectorAll('*')].map((e) => rgb2hex(cs(e).color)).concat(rgb2hex(cs(delta).color)) } : null }; });
  const chart = q(sel.chart), actc = q(sel.act);
  out.chartCard = chart ? { rect: R(chart), title: (chart.querySelector('h2,h3') || {}).textContent, radius: cs(chart).borderTopLeftRadius, shadow: cs(chart).boxShadow } : null;
  out.actCard = actc ? { rect: R(actc), title: (actc.querySelector('h2,h3') || {}).textContent } : null;
  if (chart && actc) out.chartRatio = +(chart.getBoundingClientRect().width / (chart.getBoundingClientRect().width + actc.getBoundingClientRect().width)).toFixed(3);
  // gráfico: cores das barras
  const svg = chart ? [...chart.querySelectorAll('svg')].sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0] : null;
  if (svg) {
    const fills = {}; svg.querySelectorAll('rect,path').forEach((r) => { const f = rgb2hex(getComputedStyle(r).fill); const w = r.getBoundingClientRect().width; if (w > 2 && w < 120) fills[f] = (fills[f] || 0) + 1; });
    const lines = [...svg.querySelectorAll('line')].map((l) => rgb2hex(getComputedStyle(l).stroke));
    const texts = [...svg.querySelectorAll('text')].map((t) => t.textContent.trim()).slice(0, 40);
    out.chart = { rect: R(svg), role: svg.getAttribute('role'), aria: svg.getAttribute('aria-label'), parentRole: svg.parentElement.getAttribute('role'), parentAria: svg.parentElement.getAttribute('aria-label'), fills, lines: [...new Set(lines)], texts, valueLabels: texts.filter((t) => /R\$|%/.test(t)).length };
    const legend = chart.querySelector('[class*=legend]');
    out.legend = legend ? { rect: R(legend), text: legend.textContent.trim().replace(/\s+/g, ' '), buttons: legend.querySelectorAll('button,[role=switch],[role=checkbox]').length, below: legend.getBoundingClientRect().top >= svg.getBoundingClientRect().bottom - 2 } : null;
    out.chartAlt = !!chart.querySelector('table') || !!svg.getAttribute('aria-label') || !!svg.parentElement.getAttribute('aria-label');
    out.chartPeriodControl = [...chart.querySelectorAll('select,button')].filter(vis).map((b) => b.textContent.trim().slice(0, 30));
  }
  // atividades
  out.activityItems = actc ? [...actc.querySelectorAll('li, .activity-item')].filter(vis).length : 0;
  // tabela
  const t = q(sel.table);
  if (t) {
    const ths = [...t.querySelectorAll('thead th')];
    const firstRow = t.querySelector('tbody tr');
    const tds = firstRow ? [...firstRow.children] : [];
    const thead = t.querySelector('thead');
    const valIdx = ths.findIndex((th) => /valor/i.test(th.textContent));
    const valCell = valIdx >= 0 && tds[valIdx] ? tds[valIdx] : null;
    const rows = [...t.querySelectorAll('tbody tr')].filter(vis);
    const card = sel.tableCard ? q(sel.tableCard) : t.closest('section');
    out.table = {
      rect: R(t), thead: !!thead, scopeCol: ths.filter((th) => th.getAttribute('scope') === 'col').length, ths: ths.map((th) => th.textContent.trim().replace(/\s+/g, ' ') + '|' + (th.getAttribute('aria-sort') || '')),
      theadBg: thead ? rgb2hex(cs(ths[1] || ths[0]).backgroundColor) + ' / ' + rgb2hex(cs(thead).backgroundColor) : null,
      thFs: ths[1] ? cs(ths[1]).fontSize + ' ' + cs(ths[1]).fontWeight + ' ' + rgb2hex(cs(ths[1]).color) : null,
      rowH: rows.slice(0, 4).map((r) => Math.round(r.getBoundingClientRect().height)), rowCount: rows.length,
      rowBgs: rows.slice(0, 4).map((r) => rgb2hex(cs(r).backgroundColor) + '/' + rgb2hex(cs(r.children[1] || r).backgroundColor)),
      tdFs: tds[1] ? cs(tds[1]).fontSize : null,
      valAlign: valCell ? cs(valCell).textAlign : null, valFvn: valCell ? cs(valCell).fontVariantNumeric : null,
      badges: rows.slice(0, 4).map((r) => { const b = r.querySelector('[class*=badge]'); return b ? b.textContent.trim() + '|' + rgb2hex(cs(b).backgroundColor) + '|' + rgb2hex(cs(b).color) + '|r=' + cs(b).borderTopLeftRadius : null; }),
      checkboxes: t.querySelectorAll('input[type=checkbox]').length,
      rowActions: t.querySelectorAll('tbody tr button').length,
      card: card ? { radius: cs(card).borderTopLeftRadius, border: cs(card).borderTopWidth + ' ' + rgb2hex(cs(card).borderTopColor), shadow: cs(card).boxShadow, bg: rgb2hex(cs(card).backgroundColor) } : null,
      title: card ? (card.querySelector('h2,h3') || {}).textContent : null,
      toolbarButtons: card ? [...card.querySelectorAll('button')].filter((b) => vis(b) && !t.contains(b)).map((b) => b.textContent.trim().slice(0, 25) + ' h=' + Math.round(b.getBoundingClientRect().height) + ' r=' + cs(b).borderTopLeftRadius) : [],
    };
  }
  // botões e campos: raios
  const btnPrim = [...document.querySelectorAll('button')].filter(vis).find((b) => /btn--primary|btn-primary|primary/.test(b.className));
  out.primaryBtn = btnPrim ? { text: btnPrim.textContent.trim().slice(0, 30), bg: rgb2hex(cs(btnPrim).backgroundColor), color: rgb2hex(cs(btnPrim).color), radius: cs(btnPrim).borderTopLeftRadius, h: Math.round(btnPrim.getBoundingClientRect().height), fs: cs(btnPrim).fontSize } : null;
  const inp = [...document.querySelectorAll('input[type=search], input[type=text], input:not([type])')].filter(vis)[0];
  out.input = inp ? { radius: cs(inp).borderTopLeftRadius, h: Math.round(inp.getBoundingClientRect().height), border: cs(inp).borderTopWidth + ' ' + rgb2hex(cs(inp).borderTopColor), fs: cs(inp).fontSize } : null;
  // sombras em superfícies de conteúdo
  out.contentShadows = [...main.querySelectorAll('*')].filter((e) => vis(e) && cs(e).boxShadow !== 'none').map((e) => e.tagName + '.' + e.className.toString().slice(0, 30) + ' ' + cs(e).boxShadow).slice(0, 10);
  // muted text
  const muted = main.querySelector('h1 + p, .page-sub, [class*=sub]');
  out.muted = muted ? { t: muted.textContent.trim().slice(0, 50), color: rgb2hex(cs(muted).color), fs: cs(muted).fontSize } : null;
  out.fontsInter = document.fonts.check('15px Inter');
  out.docScroll = { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
  return out;
}

(async () => {
  const browser = await launch();
  const res = {};
  for (const site of Object.keys(SITES)) {
    const sel = SEL[site];
    res[site] = {};
    const { ctx, page } = await newPage(browser, 1440, 900);
    await login(page, site);
    await page.mouse.move(5, 895);
    await page.waitForTimeout(400);
    res[site].m1440 = await page.evaluate(measureFn, sel);
    // rolagem: rolar com a roda sobre o conteúdo
    await page.mouse.move(800, 600);
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(600);
    res[site].afterScroll = await page.evaluate((sel) => {
      const R = (el) => { const r = el.getBoundingClientRect(); return { y: Math.round(r.y), h: Math.round(r.height) }; };
      const sb = document.querySelector('#sidebar'); const hd = document.querySelector(sel.header); const main = document.querySelector(sel.main);
      const sc = [...document.querySelectorAll('*')].filter((e) => e.scrollTop > 0).map((e) => e.tagName + '#' + e.id + '.' + e.className + ':' + e.scrollTop);
      return { winY: window.scrollY, sidebar: R(sb), header: R(hd), headerShadow: getComputedStyle(hd).boxShadow, scrolled: sc };
    }, sel);
    await page.screenshot({ path: path.join(OUT, 'capturas', site, 'dashboard-1440-rolado.png') });
    // pequena rolagem (20 px) para a sombra
    await ctx.close();
    // larguras de sidebar em várias larguras
    res[site].sidebarWidths = {};
    for (const w of [600, 767, 768, 820, 1000, 1023, 1024, 1279, 1280, 1920]) {
      const { ctx: c2, page: p2 } = await newPage(browser, w, 900);
      await login(p2, site);
      res[site].sidebarWidths[w] = await p2.evaluate((sel) => {
        const sb = document.querySelector('#sidebar'); const r = sb.getBoundingClientRect(); const s = getComputedStyle(sb);
        const hd = document.querySelector(sel.header);
        const visHd = [...document.querySelectorAll('header')].filter((h) => h.getBoundingClientRect().height > 0).map((h) => { const rr = h.getBoundingClientRect(); return h.className + ' x=' + Math.round(rr.x) + ' w=' + Math.round(rr.width) + ' h=' + Math.round(rr.height); });
        const kp = [...document.querySelectorAll(sel.kpi)].map((k) => Math.round(k.getBoundingClientRect().width));
        const ch = document.querySelector(sel.chart), ac = document.querySelector(sel.act);
        return { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), display: s.display, vis: s.visibility, transform: s.transform, headers: visHd, kpiW: kp, chartActSideBySide: ch && ac ? Math.abs(ch.getBoundingClientRect().top - ac.getBoundingClientRect().top) < 5 : null, chartW: ch ? Math.round(ch.getBoundingClientRect().width) : null };
      }, sel);
      await c2.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'scripts', 'out-03-desktop.json'), JSON.stringify(res, null, 1));
  await browser.close();
})();
