// Interações do app a 1440x900 (I11–I22, P16, A4) e do trilho a 820 px (I10, D15).
const fs = require('fs');
const path = require('path');
const { OUT, SITES, newPage, login, launch } = require('./lib.cjs');

const SEL = {
  'dev-1': { header: '#app-header', main: '#main', kpi: '.kpi', chart: '.chart-card', table: 'table.tbl', rail: '#btn-rail', period: 'header', sbProfile: '#sb-profile' },
  'dev-2': { header: '#app-header', main: '#main', kpi: '.kpi', chart: '#blk-chart', table: 'table.tbl', rail: '#btn-menu', period: 'header', sbProfile: '#sidebar-more' },
  'dev-3': { header: 'header.app-header', main: '#conteudo-app', kpi: '.kpi', chart: '.chart-card', table: 'table.data-table', rail: '.rail-toggle', period: 'main', sbProfile: '.profile-more' },
};
const vmenu = () => [...document.querySelectorAll('[role=menu], .menu, .popover')].filter((m) => { const r = m.getBoundingClientRect(); const s = getComputedStyle(m); return r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; }).map((m) => { const r = m.getBoundingClientRect(); return { text: m.innerText.trim().replace(/\s+/g, ' | ').slice(0, 200), y: Math.round(r.y), b: Math.round(r.bottom), x: Math.round(r.x), r: Math.round(r.right) }; });

async function T(R, key, fn) { try { R[key] = await fn(); } catch (e) { R[key] = { error: e.message.split('\n')[0] }; } }

(async () => {
  const browser = await launch();
  const res = {};
  for (const site of Object.keys(SITES)) {
    const sel = SEL[site];
    const R = res[site] = {};
    const { ctx, page } = await newPage(browser, 1440, 900, { acceptDownloads: true });
    await login(page, site);
    // I11 menu do perfil (avatar do header)
    await T(R, 'I11', async () => {
      const av = page.locator(sel.header + ' button[aria-label*="perfil"]:visible').first();
      await av.click(); await page.waitForTimeout(300);
      const open = await page.evaluate(vmenu);
      const exp = await av.getAttribute('aria-expanded');
      await page.screenshot({ path: path.join(OUT, 'capturas', site, 'menu-perfil-header.png') });
      await page.keyboard.press('Escape'); await page.waitForTimeout(300);
      const after = await page.evaluate(vmenu);
      const focus = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('aria-label'));
      // clique fora
      await av.click(); await page.waitForTimeout(250); await page.mouse.click(700, 500); await page.waitForTimeout(250);
      const afterOut = await page.evaluate(vmenu);
      return { open, expanded: exp, afterEsc: after.length, focusAfterEsc: focus, afterClickOutside: afterOut.length };
    });
    // I12 seletor de unidade
    await T(R, 'I12', async () => {
      const ub = page.locator('#sidebar button[aria-haspopup]:visible').first();
      await ub.click(); await page.waitForTimeout(300);
      const open = await page.evaluate(vmenu);
      await page.screenshot({ path: path.join(OUT, 'capturas', site, 'menu-unidade.png') });
      await page.keyboard.press('Escape'); await page.waitForTimeout(250);
      return { open, afterEsc: (await page.evaluate(vmenu)).length };
    });
    // I13 menu ⋯ do perfil na sidebar
    await T(R, 'I13', async () => {
      const pb = page.locator(sel.sbProfile + ':visible').first();
      const br = await pb.boundingBox();
      await pb.click(); await page.waitForTimeout(300);
      const open = await page.evaluate(vmenu);
      await page.screenshot({ path: path.join(OUT, 'capturas', site, 'menu-perfil-sidebar.png') });
      await page.keyboard.press('Escape'); await page.waitForTimeout(250);
      return { btnY: Math.round(br.y), open, opensUp: open.length ? open[0].b <= br.y + 2 : null };
    });
    // I22 hover / foco na navegação
    await T(R, 'I22', async () => {
      const item = page.locator('#sidebar nav a:visible', { hasText: 'Contratos' }).first();
      const base = await item.evaluate((e) => getComputedStyle(e).backgroundColor);
      await item.hover(); await page.waitForTimeout(250);
      const hov = await item.evaluate((e) => getComputedStyle(e).backgroundColor);
      await page.mouse.move(700, 500);
      await item.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(150);
      const foc = await page.evaluate(() => { const e = document.activeElement; const s = getComputedStyle(e); return { t: e.textContent.trim().slice(0, 20), outline: s.outlineWidth + ' ' + s.outlineStyle + ' ' + s.outlineColor, offset: s.outlineOffset, shadow: s.boxShadow }; });
      return { base, hover: hov, focus: foc };
    });
    // P16 foco em botão do conteúdo e em botão do header
    await T(R, 'P16', async () => {
      const out = {};
      const b = page.locator(sel.main + ' button:visible').first();
      await b.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(100);
      out.content = await page.evaluate(() => { const e = document.activeElement; const s = getComputedStyle(e); return { t: (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 25), outline: s.outlineWidth + ' ' + s.outlineStyle + ' ' + s.outlineColor, shadow: s.boxShadow }; });
      const hb = page.locator(sel.header + ' nav a:visible, ' + sel.header + ' nav button:visible').nth(1);
      await hb.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(100);
      out.header = await page.evaluate(() => { const e = document.activeElement; const s = getComputedStyle(e); return { t: (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 25), outline: s.outlineWidth + ' ' + s.outlineStyle + ' ' + s.outlineColor, shadow: s.boxShadow }; });
      return out;
    });
    // I18 tooltip do gráfico
    await T(R, 'I18', async () => {
      const bars = await page.evaluate((s) => { const c = document.querySelector(s); const svg = [...c.querySelectorAll('svg')].sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0]; return [...svg.querySelectorAll('rect')].filter((r) => getComputedStyle(r).fill === 'rgb(29, 78, 216)').map((r) => { const b = r.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }); }, sel.chart);
      const p = bars[Math.floor(bars.length / 2)];
      await page.mouse.move(p.x, p.y); await page.waitForTimeout(400);
      const tip = await page.evaluate(() => [...document.querySelectorAll('.chart-tip, [role=tooltip], .tooltip')].filter((t) => t.getBoundingClientRect().height > 0 && getComputedStyle(t).visibility !== 'hidden' && getComputedStyle(t).opacity !== '0' && !t.hidden).map((t) => t.innerText.trim().replace(/\s+/g, ' ')));
      await page.screenshot({ path: path.join(OUT, 'capturas', site, 'grafico-tooltip.png'), clip: { x: 252, y: 250, width: 900, height: 500 } });
      return { bars: bars.length, tip };
    });
    // I19 legenda liga/desliga
    await T(R, 'I19', async () => {
      const count = () => page.evaluate((s) => { const c = document.querySelector(s); const svg = [...c.querySelectorAll('svg')].sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0]; const f = {}; svg.querySelectorAll('rect').forEach((r) => { const b = r.getBoundingClientRect(); if (b.height > 1 && b.width > 2 && b.width < 120 && getComputedStyle(r).display !== 'none' && getComputedStyle(r).opacity !== '0') { const k = getComputedStyle(r).fill; f[k] = (f[k] || 0) + 1; } }); return f; }, sel.chart);
      const before = await count();
      const lb = page.locator(sel.chart + ' [class*=legend] button:visible').nth(1);
      const pressedBefore = await lb.getAttribute('aria-pressed');
      await lb.click(); await page.waitForTimeout(500);
      const after = await count();
      const pressedAfter = await lb.getAttribute('aria-pressed');
      await lb.click(); await page.waitForTimeout(300);
      return { before, after, pressedBefore, pressedAfter };
    });
    // I16 ordenação
    await T(R, 'I16', async () => {
      const vals = () => page.evaluate((s) => { const t = document.querySelector(s); const ths = [...t.querySelectorAll('thead th')]; const i = ths.findIndex((th) => /Valor/.test(th.textContent)); return { sort: ths[i].getAttribute('aria-sort'), vals: [...t.querySelectorAll('tbody tr')].map((r) => r.children[i] ? r.children[i].textContent.trim() : '') }; }, sel.table);
      const before = await vals();
      const btn = page.locator(sel.table + ' thead th', { hasText: 'Valor' }).locator('button').first();
      if (await btn.count()) await btn.click(); else await page.locator(sel.table + ' thead th', { hasText: 'Valor' }).first().click();
      await page.waitForTimeout(500);
      const after = await vals();
      return { before, after };
    });
    // I17 seleção
    await T(R, 'I17', async () => {
      const boxes = page.locator(sel.table + ' tbody input[type=checkbox]');
      await boxes.first().check({ force: true }); await page.waitForTimeout(250);
      const hdr = page.locator(sel.table + ' thead input[type=checkbox]').first();
      const ind = await hdr.evaluate((e) => ({ indeterminate: e.indeterminate, checked: e.checked, aria: e.getAttribute('aria-checked') }));
      const bulk = await page.evaluate(() => [...document.querySelectorAll('[class*=bulk], [class*=selection], [class*=batch]')].filter((e) => e.getBoundingClientRect().height > 0).map((e) => e.innerText.trim().slice(0, 80)));
      await hdr.click({ force: true }); await page.waitForTimeout(250);
      const all = await page.evaluate((s) => [...document.querySelectorAll(s + ' tbody input[type=checkbox]')].map((c) => c.checked), sel.table);
      await hdr.click({ force: true }); await page.waitForTimeout(250);
      return { afterOne: ind, bulk, afterHeader: all };
    });
    // I15 abas do header
    await T(R, 'I15', async () => {
      const h1b = await page.evaluate((s) => document.querySelector(s + ' h1').textContent.trim(), sel.main);
      const kb = await page.evaluate((s) => [...document.querySelectorAll(s)].map((k) => k.innerText.split('\n')[0]).join(' / '), sel.kpi);
      await page.locator(sel.header + ' nav a:visible, ' + sel.header + ' nav button:visible', { hasText: 'Receita' }).first().click();
      await page.waitForTimeout(2000);
      const h1a = await page.evaluate((s) => document.querySelector(s + ' h1').textContent.trim(), sel.main);
      const ka = await page.evaluate((s) => [...document.querySelectorAll(s)].map((k) => k.innerText.split('\n')[0]).join(' / '), sel.kpi);
      const cur = await page.evaluate((s) => [...document.querySelectorAll(s + ' nav [aria-current]')].map((e) => e.textContent.trim() + ':' + e.getAttribute('aria-current')), sel.header);
      await page.screenshot({ path: path.join(OUT, 'capturas', site, 'aba-receita-1440.png') });
      await page.locator(sel.header + ' nav a:visible, ' + sel.header + ' nav button:visible', { hasText: 'Visão geral' }).first().click();
      await page.waitForTimeout(2000);
      return { h1Before: h1b, h1After: h1a, kpiBefore: kb, kpiAfter: ka, current: cur, hash: await page.evaluate(() => location.hash) };
    });
    // I14 período
    await T(R, 'I14', async () => {
      const snap = () => page.evaluate((s) => ({ kpi: [...document.querySelectorAll(s.kpi)].map((k) => (k.querySelector('[class*=value]') || k).textContent.trim()).join(' / '), rows: document.querySelector(s.table) ? document.querySelectorAll(s.table + ' tbody tr').length : null, firstRow: document.querySelector(s.table + ' tbody tr') ? document.querySelector(s.table + ' tbody tr').innerText.replace(/\s+/g, ' ').slice(0, 60) : null, chartTexts: (() => { const c = document.querySelector(s.chart); const svg = c && [...c.querySelectorAll('svg')].sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0]; return svg ? [...svg.querySelectorAll('text')].map((t) => t.textContent).join(',') : null; })(), act: (() => { const a = document.querySelector('.activity-card, #blk-act'); return a ? a.innerText.replace(/\s+/g, ' ').slice(0, 80) : null; })() }), sel);
      const before = await snap();
      const sel2 = page.locator(sel.period + ' select:visible').first();
      let where = null;
      if (await sel2.count()) { await sel2.selectOption({ index: 2 }); where = 'select em ' + sel.period; }
      else { await page.locator(sel.period + ' button:visible', { hasText: 'Últimos 30 dias' }).first().click(); await page.waitForTimeout(250); await page.locator('[role=menuitemradio]:visible, [role=menuitem]:visible, [role=option]:visible', { hasText: '90 dias' }).first().click(); where = 'menu em ' + sel.period; }
      await page.waitForTimeout(120);
      const loading = await page.evaluate(() => ({ busy: document.querySelectorAll('[aria-busy=true]').length, skel: [...document.querySelectorAll('.skel, .skeleton, .skel-block, .skeleton-card, [class*=skel]')].filter((e) => e.getBoundingClientRect().height > 0).length }));
      await page.screenshot({ path: path.join(OUT, 'capturas', site, 'periodo-carregando.png') });
      await page.waitForTimeout(2200);
      const after = await snap();
      return { where, before, loading, after };
    });
    // I20 sombra após pequena rolagem
    await T(R, 'I20', async () => {
      const s0 = await page.evaluate((s) => getComputedStyle(document.querySelector(s)).boxShadow, sel.header);
      await page.mouse.move(800, 600); await page.mouse.wheel(0, 20); await page.waitForTimeout(500);
      const s1 = await page.evaluate((s) => getComputedStyle(document.querySelector(s)).boxShadow, sel.header);
      await page.mouse.wheel(0, -200); await page.waitForTimeout(300);
      return { top: s0, after20: s1 };
    });
    // I21 exportar
    await T(R, 'I21', async () => {
      const btn = page.locator('button:visible', { hasText: 'Exportar' }).first();
      const dl = page.waitForEvent('download', { timeout: 3000 }).then((d) => d.suggestedFilename()).catch(() => null);
      await btn.click(); await page.waitForTimeout(500);
      const toast = await page.evaluate(() => [...document.querySelectorAll('[role=status], .toast, [aria-live]')].map((t) => t.innerText.trim()).filter(Boolean).slice(-3));
      return { download: await dl, toast };
    });
    // A4 sair
    await T(R, 'A4', async () => {
      await page.locator(sel.header + ' button[aria-label*="perfil"]:visible').first().click(); await page.waitForTimeout(300);
      await page.locator('[role=menu] :is(a,button):visible, .menu :is(a,button):visible', { hasText: 'Sair' }).first().click();
      await page.waitForTimeout(1200);
      return await page.evaluate(() => ({ hash: location.hash, loginVisible: !!(document.querySelector('input[type=password]') && document.querySelector('input[type=password]').offsetParent), status: [...document.querySelectorAll('[role=status]')].map((s) => s.textContent.trim()).filter(Boolean) }));
    });
    await ctx.close();

    // I10 trilho a 820
    {
      const { ctx: c2, page: p2 } = await newPage(browser, 820, 1000);
      await login(p2, site);
      await T(R, 'railTooltip', async () => {
        const it = p2.locator('#sidebar nav a:visible').nth(2);
        const info = await it.evaluate((e) => ({ aria: e.getAttribute('aria-label'), title: e.getAttribute('title'), text: e.innerText.trim(), tip: e.getAttribute('data-tooltip') || e.getAttribute('data-tip') }));
        await it.hover(); await p2.waitForTimeout(700);
        const tip = await p2.evaluate(() => [...document.querySelectorAll('[role=tooltip], .tooltip, [class*=tip]')].filter((t) => t.getBoundingClientRect().height > 0 && getComputedStyle(t).visibility !== 'hidden' && getComputedStyle(t).opacity !== '0' && !t.hidden).map((t) => t.innerText.trim()));
        await p2.screenshot({ path: path.join(OUT, 'capturas', site, 'trilho-820-tooltip.png') });
        return { info, tip };
      });
      await T(R, 'I10', async () => {
        const btn = p2.locator(sel.rail + ':visible').first();
        await btn.click(); await p2.waitForTimeout(450);
        const open = await p2.evaluate(() => { const sb = document.querySelector('#sidebar').getBoundingClientRect(); const sc = [...document.querySelectorAll('.scrim, .sidebar-scrim, [class*=scrim]')].filter((x) => x.getBoundingClientRect().width > 0 && getComputedStyle(x).opacity !== '0' && getComputedStyle(x).visibility !== 'hidden'); const m = document.querySelector('main').getBoundingClientRect(); return { sbW: Math.round(sb.width), sbX: Math.round(sb.x), scrim: sc.length, mainX: Math.round(m.x), focusIn: document.querySelector('#sidebar').contains(document.activeElement), shadow: getComputedStyle(document.querySelector('#sidebar')).boxShadow }; });
        await p2.screenshot({ path: path.join(OUT, 'capturas', site, 'trilho-820-expandido.png') });
        await p2.keyboard.press('Escape'); await p2.waitForTimeout(400);
        const afterEsc = await p2.evaluate(() => ({ sbW: Math.round(document.querySelector('#sidebar').getBoundingClientRect().width), focus: document.activeElement.getAttribute('aria-label') }));
        await btn.click(); await p2.waitForTimeout(450);
        await p2.mouse.click(700, 600); await p2.waitForTimeout(400);
        const afterOut = await p2.evaluate(() => Math.round(document.querySelector('#sidebar').getBoundingClientRect().width));
        return { open, afterEsc, afterClickOutside: afterOut };
      });
      await c2.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'scripts', 'out-06-app.json'), JSON.stringify(res, null, 1));
  await browser.close();
})();
