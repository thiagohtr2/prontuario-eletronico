// Medições e interações do celular (390x844 móvel com toque) e da horizontal (844x390).
const L = require('./lib.cjs');

const MEAS = () => {
  const hex = (c) => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return c; const p = m[1].split(',').map(s => parseFloat(s)); if (p.length === 4 && p[3] === 0) return 'transparent'; return '#' + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join(''); };
  const R = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return { x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) }; };
  const vis = (e) => { if (!e) return false; const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0 && b.right > 0 && b.x < innerWidth && b.bottom > 0 && b.y < innerHeight; };
  const bn = document.querySelector('#bottom-nav, nav.bottom-nav');
  const out = {};
  if (bn) {
    const items = [...bn.querySelectorAll('a, button')].filter(vis);
    out.bn = { r: R(bn), pos: getComputedStyle(bn).position, bg: hex(getComputedStyle(bn).backgroundColor), borderTop: getComputedStyle(bn).borderTopWidth + ' ' + hex(getComputedStyle(bn).borderTopColor), paddingBottom: getComputedStyle(bn).paddingBottom,
      items: items.map(a => {
        const svg = a.querySelector('svg'); const lab = [...a.querySelectorAll('span')].find(s => s.textContent.trim() && !s.querySelector('svg') && s.children.length === 0) || a;
        const pill = [...a.querySelectorAll('span,i,div')].find(s => s.querySelector('svg')) || null;
        return { text: a.innerText.trim(), r: R(a), cur: a.getAttribute('aria-current'), color: hex(getComputedStyle(a).color), bg: hex(getComputedStyle(a).backgroundColor), icon: svg ? R(svg) : null, iconFill: svg ? (getComputedStyle(svg).fill) : null, labelFs: getComputedStyle(lab).fontSize, labelFw: getComputedStyle(lab).fontWeight, pillBg: pill ? hex(getComputedStyle(pill).backgroundColor) : null, pillRadius: pill ? getComputedStyle(pill).borderRadius : null };
      }) };
  }
  const hd = [...document.querySelectorAll('header')].filter(vis).find(h => ['sticky', 'fixed'].includes(getComputedStyle(h).position));
  out.top = hd && { r: R(hd), pos: getComputedStyle(hd).position, paddingTop: getComputedStyle(hd).paddingTop, text: hd.innerText.replace(/\s+/g, ' ').trim(), controls: [...hd.querySelectorAll('a,button,input')].filter(vis).map(b => ({ label: b.getAttribute('aria-label') || b.innerText.trim(), r: R(b) })) };
  const sb = document.querySelector('aside#sidebar');
  out.sidebarVisible = vis(sb);
  out.hamburger = [...document.querySelectorAll('button')].filter(vis).filter(b => /abrir menu|menu lateral|☰|abrir navegação|open menu/i.test(b.getAttribute('aria-label') || '')).map(b => b.getAttribute('aria-label'));
  const main = document.querySelector('main');
  out.main = main && { padTop: getComputedStyle(main).paddingTop, padBottom: getComputedStyle(main).paddingBottom };
  out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  return out;
};

const LASTCONTENT = () => {
  // depois de rolar até o fim: o último elemento folha visível do <main> termina acima da bottom nav?
  const bn = document.querySelector('#bottom-nav, nav.bottom-nav');
  const main = document.querySelector('main');
  const leaves = [...main.querySelectorAll('*')].filter(e => { const b = e.getBoundingClientRect(); const s = getComputedStyle(e); return b.height > 0 && b.width > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !e.closest('.sr-only') && e.children.length === 0 && (e.textContent.trim() || ['BUTTON', 'INPUT', 'A', 'svg', 'IMG'].includes(e.tagName)); });
  let maxB = 0, el = null; leaves.forEach(e => { const b = e.getBoundingClientRect().bottom; if (b > maxB) { maxB = b; el = e; } });
  const nb = bn.getBoundingClientRect();
  return { scrollY: Math.round(scrollY), lastBottom: Math.round(maxB), lastText: el ? (el.textContent || el.tagName).trim().slice(0, 40) : null, navTop: Math.round(nb.y), hidden: maxB > nb.y + 1 };
};

const TARGETS = () => {
  const vis = (e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0 && b.right > 0 && b.x < innerWidth && b.bottom > 0 && b.y < innerHeight && !e.closest('.sr-only') && s.opacity !== '0'; };
  const els = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab], summary')].filter(vis);
  const res = els.map(e => {
    let b = e.getBoundingClientRect();
    // checkbox/radio dentro de label: vale a área da label
    if (e.tagName === 'INPUT' && ['checkbox', 'radio'].includes(e.type)) { const lab = e.closest('label') || (e.id && document.querySelector(`label[for="${e.id}"]`)); if (lab) { const lb = lab.getBoundingClientRect(); b = { width: Math.max(b.width, lb.width), height: Math.max(b.height, lb.height) }; } }
    return { t: (e.getAttribute('aria-label') || e.innerText || e.placeholder || e.type || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 30), w: Math.round(b.width), h: Math.round(b.height), inline: e.tagName === 'A' && getComputedStyle(e).display === 'inline' };
  });
  const small = res.filter(r => r.w < 44 || r.h < 44);
  return { total: res.length, ok: res.length - small.length, small: small.slice(0, 25), smallNonInline: small.filter(s => !s.inline).length };
};

(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const S = L.SITES[site];
    res[site] = {};
    // --- Telas públicas no celular
    {
      const { ctx, page } = await L.newPage(390, 844, true);
      await page.goto(S.url + S.login); await page.waitForTimeout(600);
      res[site].login = await page.evaluate(() => {
        const hex = (c) => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return c; const p = m[1].split(',').map(s => parseFloat(s)); if (p.length === 4 && p[3] === 0) return 'transparent'; return '#' + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join(''); };
        const form = document.querySelector('form'); let card = form; // sobe até o "cartão" (elemento com borda ou fundo próprio)
        for (let e = form; e && e !== document.body; e = e.parentElement) { const s = getComputedStyle(e); if (s.borderTopWidth !== '0px' || (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && hex(s.backgroundColor) !== hex(getComputedStyle(document.body).backgroundColor))) { card = e; break; } }
        const cs = getComputedStyle(card); const cb = card.getBoundingClientRect();
        const inp = [...document.querySelectorAll('input[type=email], input[type=password]')].map(i => ({ fs: getComputedStyle(i).fontSize, h: i.getBoundingClientRect().height, x: i.getBoundingClientRect().x, right: innerWidth - i.getBoundingClientRect().right }));
        const btn = document.querySelector('button[type=submit]');
        return { card: { cls: card.className, x: cb.x, right: innerWidth - cb.right, w: cb.width, border: cs.borderTopWidth + ' ' + hex(cs.borderTopColor), shadow: cs.boxShadow, radius: cs.borderRadius, padding: cs.padding, bg: hex(cs.backgroundColor) }, inputs: inp, btnH: btn.getBoundingClientRect().height, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      res[site].loginTargets = await page.evaluate(TARGETS);
      await page.goto(S.url + S.cadastro); await page.waitForTimeout(600);
      res[site].cadastro = await page.evaluate(() => {
        const inp = [...document.querySelectorAll('form input:not([type=checkbox])')].filter(i => i.getBoundingClientRect().width > 0).map(i => ({ name: i.name || i.id, type: i.type, fs: getComputedStyle(i).fontSize, h: Math.round(i.getBoundingClientRect().height), x: Math.round(i.getBoundingClientRect().x), w: Math.round(i.getBoundingClientRect().width) }));
        const cb = document.querySelector('form input[type=checkbox]');
        const lab = cb && (cb.closest('label') || document.querySelector(`label[for="${cb.id}"]`));
        const cbr = cb && cb.getBoundingClientRect(); const lr = lab && lab.getBoundingClientRect();
        return { inputs: inp, xs: [...new Set(inp.map(i => i.x))], checkbox: cb && { w: cbr.width, h: cbr.height, labelW: lr && lr.width, labelH: lr && lr.height }, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      res[site].cadastroTargets = await page.evaluate(TARGETS);
      await ctx.close();
    }
    // --- App no celular
    {
      const { ctx, page } = await L.newPage(390, 844, true);
      await L.login(page, site);
      res[site].app = await page.evaluate(MEAS);
      res[site].appTargets = await page.evaluate(TARGETS);
      await page.evaluate(() => window.scrollTo(0, 99999)); await page.waitForTimeout(700);
      res[site].lastContent = await page.evaluate(LASTCONTENT);
      await page.screenshot({ path: L.shot(`${site}-cel-fim-da-rolagem.png`) });
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400);
      // toques na bottom nav
      const nItems = res[site].app.bn ? res[site].app.bn.items.length : 0;
      res[site].taps = [];
      for (let i = 0; i < nItems; i++) {
        const loc = page.locator('#bottom-nav a, #bottom-nav button, nav.bottom-nav a, nav.bottom-nav button').filter({ visible: true }).nth(i);
        await loc.tap(); await page.waitForTimeout(900);
        const st = await page.evaluate(() => ({ hash: location.hash, h1: (document.querySelector('main h1') || {}).textContent, topTitle: (() => { const h = [...document.querySelectorAll('header')].find(h => getComputedStyle(h).position === 'fixed' || getComputedStyle(h).position === 'sticky'); return h ? h.innerText.replace(/\s+/g, ' ').trim().slice(0, 60) : null; })(), current: [...document.querySelectorAll('#bottom-nav [aria-current], nav.bottom-nav [aria-current]')].map(e => e.innerText.trim() + ':' + e.getAttribute('aria-current')), dialog: !!document.querySelector('[role=dialog]:not([hidden]), dialog[open]') }));
        res[site].taps.push(st);
        await page.screenshot({ path: L.shot(`${site}-cel-toque-${i + 1}.png`) });
        if (st.dialog) { await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
      }
      // tocar no ativo rola ao topo; preservação de rolagem
      const first = page.locator('#bottom-nav a, #bottom-nav button, nav.bottom-nav a, nav.bottom-nav button').filter({ visible: true }).nth(0);
      const second = page.locator('#bottom-nav a, #bottom-nav button, nav.bottom-nav a, nav.bottom-nav button').filter({ visible: true }).nth(1);
      await first.tap(); await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo(0, 500)); await page.waitForTimeout(400);
      const before = await page.evaluate(() => scrollY);
      await second.tap(); await page.waitForTimeout(800);
      await first.tap(); await page.waitForTimeout(900);
      const restored = await page.evaluate(() => scrollY);
      await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(500);
      const pre = await page.evaluate(() => scrollY);
      await first.tap(); await page.waitForTimeout(900);
      const afterActive = await page.evaluate(() => scrollY);
      res[site].scrollBehavior = { before, restored, preActiveTap: pre, afterActiveTap: afterActive };
      // horizontal
      await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(700);
      res[site].landscape = await page.evaluate(() => {
        const vis = (e) => e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0;
        const bn = document.querySelector('#bottom-nav, nav.bottom-nav'); const hd = [...document.querySelectorAll('header')].filter(vis).find(h => ['sticky', 'fixed'].includes(getComputedStyle(h).position));
        const sb = document.querySelector('aside#sidebar');
        return { bnVis: vis(bn), bnH: vis(bn) ? bn.getBoundingClientRect().height : 0, hdH: hd ? hd.getBoundingClientRect().height : 0, hdPos: hd ? getComputedStyle(hd).position : null, sbVis: vis(sb), sbW: vis(sb) ? sb.getBoundingClientRect().width : 0 };
      });
      await page.screenshot({ path: L.shot(`${site}-cel-horizontal-844x390.png`) });
      await ctx.close();
    }
    console.log('ok', site);
  }
  L.saveJSON('s05-celular.json', res);
  await L.close();
})();
