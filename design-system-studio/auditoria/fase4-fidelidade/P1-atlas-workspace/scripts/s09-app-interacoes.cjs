// Interações do shell e complementos de KPI/tabela (1440x900, 900x1024, 390x844).
const L = require('./lib.cjs');
const P = {
  'dev-1': { painel: '#/painel', tabela: '#/painel' },
  'dev-2': { painel: '#/painel', tabela: '#/relatorios' },
  'dev-3': { painel: '#/app/painel', tabela: '#/app/relatorios' },
};
const HELP = `window.__hex = (c) => { const m = c && c.match(/rgba?\\(([^)]+)\\)/); if (!m) return c; const p = m[1].split(',').map(s => parseFloat(s)); if (p.length === 4 && p[3] === 0) return 'transparent'; return '#' + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join(''); };
window.__vis = (e) => { if (!e) return false; const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0' && b.width > 0 && b.height > 0; };
window.__popups = () => [...document.querySelectorAll('[role=menu], [role=dialog], dialog[open], [role=listbox], .popover, .menu, [class*=popover], [class*=dropdown], [class*=sheet]')].filter(e => __vis(e) && e.getBoundingClientRect().height > 30).map(e => { const b = e.getBoundingClientRect(); return { role: e.getAttribute('role'), cls: (e.className && e.className.baseVal === undefined ? e.className : '').toString().slice(0, 40), x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), right: Math.round(b.right), bottom: Math.round(b.bottom), text: e.innerText.replace(/\\s+/g, ' ').slice(0, 160) }; });`;

(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const S = L.SITES[site]; const r = {};
    const { ctx, page } = await L.newPage(1440, 900); await ctx.addInitScript({ content: HELP });
    await L.login(page, site);
    // ---------- KPI
    await page.goto(S.url + P[site].painel); await page.waitForTimeout(1800); await page.mouse.move(1, 1);
    r.kpi = await page.evaluate(() => {
      const ks = [...document.querySelectorAll('main article.kpi, main .sw-kpi, main .kpi')].filter(k => __vis(k) && k.getBoundingClientRect().height > 80 && !k.querySelector('article.kpi, .sw-kpi .sw-kpi'));
      const k = ks[0]; if (!k) return null; const s = getComputedStyle(k); const b = k.getBoundingClientRect();
      const lab = k.querySelector('.sw-label, [class*=label]'); const ls = lab && getComputedStyle(lab);
      const varEl = k.querySelector('[class*=delta], [class*=var], [class*=trend]');
      return { count: ks.length, w: Math.round(b.width), h: Math.round(b.height), radius: s.borderRadius, borders: [s.borderTopWidth, s.borderRightWidth, s.borderBottomWidth, s.borderLeftWidth].join(' '), borderColor: __hex(s.borderTopColor) + '/' + __hex(s.borderLeftColor), shadow: s.boxShadow, label: lab && { text: lab.innerText.trim(), tt: ls.textTransform, ls: ls.letterSpacing, color: __hex(ls.color) }, variation: varEl && { text: varEl.innerText.replace(/\s+/g, ' ').trim(), color: __hex(getComputedStyle(varEl.querySelector('strong, span') || varEl).color) }, colors: [...k.querySelectorAll('*')].filter(e => /12,4/.test(e.textContent) && e.children.length <= 1).map(e => __hex(getComputedStyle(e).color)).slice(0, 3), widths: ks.map(x => Math.round(x.getBoundingClientRect().width)) };
    });
    // tooltip no sparkline
    const spark = page.locator('main svg').filter({ has: page.locator('polyline, path') }).first();
    try { const bb = await page.locator('main article.kpi svg, main .sw-kpi svg, main .kpi svg').nth(1).boundingBox(); if (bb) { await page.mouse.move(bb.x + bb.width * 0.6, bb.y + bb.height / 2); await page.waitForTimeout(500); } r.sparkTip = await page.evaluate(() => [...document.querySelectorAll('[role=tooltip], .tooltip, [class*=tip]')].filter(e => __vis(e)).map(e => e.innerText.trim()).filter(Boolean).slice(0, 3)); } catch (e) { r.sparkTip = 'erro'; }
    // clique no KPI
    await page.goto(S.url + P[site].painel); await page.waitForTimeout(1600);
    try { const kc = page.locator('main article.kpi, main .sw-kpi, main .kpi').first(); const bb = await kc.boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + 40); await page.waitForTimeout(1200); r.kpiClick = await page.evaluate(() => ({ hash: location.hash, h1: (document.querySelector('main h1') || {}).textContent })); } catch (e) { r.kpiClick = 'erro ' + String(e).slice(0, 80); }
    // ---------- Tabela: menu de ações
    await page.goto(S.url + P[site].tabela); await page.waitForTimeout(1600);
    try {
      const act = page.locator('main table').filter({ hasText: /cliente/i }).first().locator('tbody tr').first().locator('td').last().locator('button, a').first();
      await act.scrollIntoViewIfNeeded(); await act.click(); await page.waitForTimeout(600);
      r.tableAction = await page.evaluate(() => ({ popups: __popups(), hash: location.hash }));
      await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    } catch (e) { r.tableAction = 'erro ' + String(e).slice(0, 80); }
    // ---------- Shell
    await page.goto(S.url + P[site].painel); await page.waitForTimeout(1500);
    // recolher
    const coll = page.locator('aside#sidebar button[aria-label="Recolher menu"]').first();
    r.collapse = {};
    if (await coll.count()) {
      await coll.click(); await page.waitForTimeout(600);
      r.collapse.after = await page.evaluate(() => { const sb = document.querySelector('aside#sidebar'); const lbl = [...sb.querySelectorAll('nav a')].map(a => [...a.querySelectorAll('span')].find(s => s.children.length === 0 && s.textContent.trim().length > 2)).filter(Boolean)[1]; return { w: sb.getBoundingClientRect().width, labelVisible: lbl ? (__vis(lbl) && lbl.getBoundingClientRect().width > 5) : null, toggleLabel: [...sb.querySelectorAll('button')].filter(__vis).map(b => b.getAttribute('aria-label')).filter(Boolean), ls: Object.keys(localStorage).map(k => k + '=' + String(localStorage.getItem(k)).slice(0, 30)) }; });
      const it = page.locator('aside#sidebar nav a').nth(2); await it.hover(); await page.waitForTimeout(700);
      r.collapse.tooltip = await page.evaluate(() => [...document.querySelectorAll('[role=tooltip], .tooltip, [class*=tooltip], [class*=tip]')].filter(e => __vis(e)).map(e => e.innerText.trim()).filter(Boolean).slice(0, 2));
      await page.reload(); await page.waitForTimeout(1500);
      r.collapse.afterReload = await page.evaluate(() => document.querySelector('aside#sidebar').getBoundingClientRect().width);
      await page.screenshot({ path: L.shot(`${site}-sidebar-recolhida-1440.png`) });
      const exp = page.locator('aside#sidebar button[aria-label="Expandir menu"]').filter({ visible: true }).first();
      if (await exp.count()) { await exp.click(); await page.waitForTimeout(600); }
      r.collapse.expanded = await page.evaluate(() => document.querySelector('aside#sidebar').getBoundingClientRect().width);
    }
    // clique em item
    await page.locator('aside#sidebar nav a').filter({ hasText: 'Projetos' }).first().click(); await page.waitForTimeout(1000);
    r.navClick = await page.evaluate(() => ({ hash: location.hash, h1: (document.querySelector('main h1') || {}).textContent, current: [...document.querySelectorAll('aside#sidebar [aria-current=page]')].map(a => a.innerText.trim()) }));
    // trilha completa (projeto > página)
    // notificações
    await page.goto(S.url + P[site].painel); await page.waitForTimeout(1300);
    const bell = page.locator('header button[aria-label*="otifica"]').filter({ visible: true }).first();
    await bell.click(); await page.waitForTimeout(600);
    r.notif = { open: await page.evaluate(() => __popups()), expanded: await bell.getAttribute('aria-expanded') };
    await page.screenshot({ path: L.shot(`${site}-notificacoes-1440.png`) });
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    r.notif.afterEsc = await page.evaluate(() => ({ popups: __popups().length, focus: document.activeElement && (document.activeElement.getAttribute('aria-label') || '').slice(0, 40) }));
    await bell.click(); await page.waitForTimeout(500); await page.mouse.click(700, 600); await page.waitForTimeout(400);
    r.notif.afterOutside = await page.evaluate(() => __popups().length);
    // menu do perfil (header)
    const av = page.locator('header button[aria-label*="erfil"]').filter({ visible: true }).first();
    await av.click(); await page.waitForTimeout(500);
    r.profile = { open: await page.evaluate(() => __popups()) };
    await page.screenshot({ path: L.shot(`${site}-menu-perfil-1440.png`) });
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    r.profile.focusAfterEsc = await page.evaluate(() => document.activeElement && (document.activeElement.getAttribute('aria-label') || '').slice(0, 40));
    // menu ⋯ da sidebar
    const more = page.locator('aside#sidebar [class*=foot] button').filter({ visible: true }).last();
    const trig = await more.boundingBox();
    await more.click(); await page.waitForTimeout(500);
    r.sbMenu = { trigger: trig && { y: Math.round(trig.y), label: await more.getAttribute('aria-label') }, open: await page.evaluate(() => __popups()) };
    await page.screenshot({ path: L.shot(`${site}-menu-sidebar-1440.png`) });
    // sair
    const sair = page.locator('[role=menu] >> text=/^\\s*Sair\\s*$/, .menu >> text=/^\\s*Sair\\s*$/').filter({ visible: true }).first();
    try { if (await sair.count()) { await sair.click(); } else { await page.keyboard.press('Escape'); await av.click(); await page.waitForTimeout(400); await page.getByText(/^Sair$/).filter({ visible: true }).first().click(); } await page.waitForTimeout(1500); r.logout = await page.evaluate(() => ({ hash: location.hash, pwd: !!document.querySelector('input[type=password]') })); } catch (e) { r.logout = 'erro ' + String(e).slice(0, 100); }
    await ctx.close();
    // ---------- Tablet: sobreposição
    {
      const { ctx, page } = await L.newPage(900, 1024); await ctx.addInitScript({ content: HELP });
      await L.login(page, site);
      await page.goto(S.url + P[site].painel); await page.waitForTimeout(1300);
      const btns = await page.evaluate(() => [...document.querySelectorAll('button')].filter(__vis).map(b => b.getAttribute('aria-label')).filter(l => l && /menu|expandir|navega/i.test(l)));
      r.tablet = { buttons: btns };
      const opener = page.locator('button[aria-label*="Expandir"], button[aria-label*="Abrir menu"], button[aria-label*="abrir menu"], button[aria-label="Menu"], button[aria-label*="navegação"]').filter({ visible: true }).first();
      if (await opener.count()) {
        await opener.click(); await page.waitForTimeout(700);
        r.tablet.open = await page.evaluate(() => { const sb = document.querySelector('aside#sidebar'); const b = sb.getBoundingClientRect(); const scrim = [...document.querySelectorAll('[class*=scrim], [class*=backdrop], [class*=overlay]')].filter(__vis).map(e => ({ cls: e.className.toString().slice(0, 30), bg: getComputedStyle(e).backgroundColor, w: e.getBoundingClientRect().width })); const main = document.querySelector('main').getBoundingClientRect(); return { sbW: Math.round(b.width), sbPos: getComputedStyle(sb).position, mainX: Math.round(main.x), scrim, shadow: getComputedStyle(sb).boxShadow }; });
        await page.screenshot({ path: L.shot(`${site}-tablet-sobreposicao-900.png`) });
        await page.keyboard.press('Escape'); await page.waitForTimeout(500);
        r.tablet.afterEsc = await page.evaluate(() => ({ sbW: Math.round(document.querySelector('aside#sidebar').getBoundingClientRect().width), focus: (document.activeElement.getAttribute('aria-label') || '').slice(0, 30) }));
        await opener.click(); await page.waitForTimeout(600); await page.mouse.click(860, 600); await page.waitForTimeout(500);
        r.tablet.afterOutside = await page.evaluate(() => Math.round(document.querySelector('aside#sidebar').getBoundingClientRect().width));
      }
      await ctx.close();
    }
    // ---------- Celular: popovers dentro da viewport
    {
      const { ctx, page } = await L.newPage(390, 844, true); await ctx.addInitScript({ content: HELP });
      await L.login(page, site);
      const act = page.locator('header button').filter({ visible: true }).last();
      await act.tap(); await page.waitForTimeout(700);
      r.celPopup = { label: await act.getAttribute('aria-label'), popups: await page.evaluate(() => __popups()) };
      await page.screenshot({ path: L.shot(`${site}-cel-acao-topbar.png`) });
      await ctx.close();
    }
    res[site] = r;
    console.log('ok', site);
  }
  L.saveJSON('s09-app-interacoes.json', res);
  await L.close();
})();
