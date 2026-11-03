// Medições do shell desktop (1440x900) e das faixas de largura (767/768/1000/1024/1280).
const L = require('./lib.cjs');
const PAINEL = { 'dev-1': '#/painel', 'dev-2': '#/painel', 'dev-3': '#/app/painel' };

const MEASURE = () => {
  const hex = (c) => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return c; const p = m[1].split(',').map(s => parseFloat(s)); if (p.length === 4 && p[3] === 0) return 'transparent'; return '#' + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join(''); };
  const R = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return { x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) }; };
  const vis = (e) => { if (!e) return false; const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0; };
  const cs = (e, p) => e ? getComputedStyle(e, p || null) : null;
  const sb = document.querySelector('aside#sidebar');
  const hd = [...document.querySelectorAll('header')].filter(vis).find(h => ['sticky', 'fixed'].includes(getComputedStyle(h).position));
  const out = {};
  out.sidebar = sb && { r: R(sb), vis: vis(sb), radius: cs(sb).borderRadius, shadow: cs(sb).boxShadow, margin: cs(sb).margin, borderRight: cs(sb).borderRightWidth + ' ' + cs(sb).borderRightStyle + ' ' + hex(cs(sb).borderRightColor), bg: hex(cs(sb).backgroundColor), position: cs(sb).position, top: cs(sb).top };
  out.header = hd && { r: R(hd), cls: hd.className, position: cs(hd).position, borderBottom: cs(hd).borderBottomWidth + ' ' + cs(hd).borderBottomStyle + ' ' + hex(cs(hd).borderBottomColor), bg: hex(cs(hd).backgroundColor), shadow: cs(hd).boxShadow, z: cs(hd).zIndex };
  const top = sb && sb.querySelector('.sidebar__top');
  out.sidebarTop = top && { r: R(top), borderBottom: cs(top).borderBottomWidth + ' ' + hex(cs(top).borderBottomColor), brand: (sb.querySelector('.brand-name,.brand__name') || {}).textContent };
  const nav = sb && sb.querySelector('nav');
  if (nav) {
    // títulos de grupo: o menor elemento cujo texto é Geral/Equipe/Conta
    const titles = [];
    for (const name of ['Geral', 'Equipe', 'Conta']) {
      let best = null;
      nav.querySelectorAll('*').forEach(e => { if (e.children.length <= 1 && e.textContent.trim().toLowerCase() === name.toLowerCase() && vis(e)) { if (!best || e.getBoundingClientRect().width < best.getBoundingClientRect().width) best = e; } });
      titles.push(best && { name, text: best.innerText, fs: cs(best).fontSize, fw: cs(best).fontWeight, ls: cs(best).letterSpacing, tt: cs(best).textTransform, color: hex(cs(best).color) });
    }
    out.groupTitles = titles;
    const items = [...nav.querySelectorAll('a')].filter(vis);
    out.items = items.map(a => ({ text: a.innerText.replace(/\s+/g, ' ').trim(), h: +a.getBoundingClientRect().height.toFixed(1), cur: a.getAttribute('aria-current') }));
    const first = items[0];
    const svg = first && first.querySelector('svg');
    out.itemIcon = svg && { w: svg.getBoundingClientRect().width, h: svg.getBoundingClientRect().height, stroke: svg.getAttribute('stroke-width') || cs(svg).strokeWidth, fill: svg.getAttribute('fill') || cs(svg).fill };
    const act = nav.querySelector('[aria-current="page"]');
    if (act) {
      const pb = cs(act, '::before'), pa = cs(act, '::after');
      out.active = { text: act.innerText.trim(), bg: hex(cs(act).backgroundColor), color: hex(cs(act).color), radius: cs(act).borderRadius, fw: cs(act).fontWeight, shadow: cs(act).boxShadow, borderLeft: cs(act).borderLeftWidth + ' ' + hex(cs(act).borderLeftColor),
        before: pb.content !== 'none' ? { content: pb.content, w: pb.width, h: pb.height, bg: hex(pb.backgroundColor), left: pb.left, pos: pb.position } : null,
        after: pa.content !== 'none' ? { content: pa.content, w: pa.width, h: pa.height, bg: hex(pa.backgroundColor), left: pa.left, pos: pa.position } : null };
      const li = act.parentElement; const lb = cs(li, '::before');
      out.active.liBefore = lb && lb.content !== 'none' ? { w: lb.width, bg: hex(lb.backgroundColor) } : null;
    }
  }
  // rodapé da sidebar
  const foot = sb && (sb.querySelector('.sidebar__foot,.sidebar__footer,.sidebar-foot,[class*=foot]'));
  out.foot = foot && { r: R(foot), cls: foot.className, text: foot.innerText.replace(/\s+/g, ' ').trim(), borderTop: cs(foot).borderTopWidth + ' ' + hex(cs(foot).borderTopColor), buttons: [...foot.querySelectorAll('button,a')].map(b => b.getAttribute('aria-label') || b.innerText.trim()) };
  // header: trilha, sino, avatar
  if (hd) {
    const crumbs = hd.querySelector('nav[aria-label*=rilha], .crumbs, nav.crumbs');
    const last = crumbs && crumbs.querySelector('[aria-current]');
    out.crumbs = crumbs && { text: crumbs.innerText.replace(/\s+/g, ' ').trim(), lastText: last && last.textContent.trim(), lastFw: last && cs(last).fontWeight, vis: vis(crumbs) };
    const btns = [...hd.querySelectorAll('button, a, input')].filter(vis);
    out.headerControls = btns.map(b => ({ tag: b.tagName, label: b.getAttribute('aria-label') || b.getAttribute('placeholder') || b.innerText.trim(), r: R(b), radius: cs(b).borderRadius }));
    out.headerHasHamburger = btns.some(b => /menu|☰/i.test((b.getAttribute('aria-label') || '')) && !/perfil|usuário|conta/i.test(b.getAttribute('aria-label') || ''));
  }
  const main = document.querySelector('main');
  out.main = main && { r: R(main), padding: cs(main).padding };
  // primeira seção de conteúdo (padding real)
  const body = document.body;
  out.body = { fs: cs(body).fontSize, color: hex(cs(body).color), ff: cs(body).fontFamily, bg: hex(cs(body).backgroundColor) };
  const h1 = document.querySelector('main h1');
  out.h1 = h1 && { text: h1.textContent.trim(), fs: cs(h1).fontSize, fw: cs(h1).fontWeight, ls: cs(h1).letterSpacing, ff: cs(h1).fontFamily, x: R(h1).x };
  out.fontsInter = [...document.fonts].filter(f => /inter/i.test(f.family)).map(f => f.family + ' ' + f.weight + ' ' + f.status).slice(0, 6);
  out.interCheck = document.fonts.check('16px Inter');
  out.scroll = { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sh: document.documentElement.scrollHeight };
  return out;
};

(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const S = L.SITES[site];
    res[site] = {};
    const { ctx, page } = await L.newPage(1440, 900);
    await L.login(page, site);
    await page.goto(S.url + PAINEL[site]); await page.waitForTimeout(1500);
    res[site].d1440 = await page.evaluate(MEASURE);
    // depois de rolar
    await page.evaluate(() => window.scrollTo(0, 600)); await page.waitForTimeout(500);
    res[site].d1440scroll = await page.evaluate(() => {
      const sb = document.querySelector('aside#sidebar'); const b = sb.getBoundingClientRect();
      const hd = [...document.querySelectorAll('header')].find(h => ['sticky', 'fixed'].includes(getComputedStyle(h).position) && h.getBoundingClientRect().height > 0);
      const hb = hd.getBoundingClientRect();
      return { scrollY: window.scrollY, sbTop: b.y, sbH: b.height, hdTop: hb.y, hdShadow: getComputedStyle(hd).boxShadow, foot: (() => { const f = sb.querySelector('[class*=foot]'); return f ? f.getBoundingClientRect().bottom : null; })(), sbNavOverflow: getComputedStyle(sb.querySelector('nav')).overflowY };
    });
    await page.evaluate(() => window.scrollTo(0, 20)); await page.waitForTimeout(400);
    res[site].hdShadow20 = await page.evaluate(() => { const hd = [...document.querySelectorAll('header')].find(h => ['sticky', 'fixed'].includes(getComputedStyle(h).position) && h.getBoundingClientRect().height > 0); return getComputedStyle(hd).boxShadow; });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: L.shot(`${site}-painel-1440x900-medido.png`) });
    // faixas de largura
    res[site].widths = {};
    for (const w of [767, 768, 900, 1000, 1023, 1024, 1279, 1280, 1920]) {
      await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(500);
      res[site].widths[w] = await page.evaluate(() => {
        const vis = (e) => { if (!e) return false; const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0 && b.right > 0 && b.x < innerWidth; };
        const sb = document.querySelector('aside#sidebar');
        const bn = document.querySelector('#bottom-nav, .bottom-nav');
        const lbl = sb && [...sb.querySelectorAll('nav a span')].find(s => s.textContent.trim() === 'Painel');
        const hd = [...document.querySelectorAll('header')].filter(vis).find(h => ['sticky', 'fixed'].includes(getComputedStyle(h).position));
        return { sbVis: vis(sb), sbW: sb ? +sb.getBoundingClientRect().width.toFixed(1) : null, sbH: sb ? sb.getBoundingClientRect().height : null, labelVis: vis(lbl), bnVis: vis(bn), hdX: hd ? hd.getBoundingClientRect().x : null, hdH: hd ? hd.getBoundingClientRect().height : null, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
    }
    await ctx.close();
    console.log('ok', site);
  }
  L.saveJSON('s04-desktop.json', res);
  await L.close();
})();
