// Complementos: Sair (dev-1/dev-2), sino no celular (dev-2), ação "VER" da tabela (dev-3), tooltip do sparkline.
const L = require('./lib.cjs');
const PAINEL = { 'dev-1': '#/painel', 'dev-2': '#/painel', 'dev-3': '#/app/painel' };
const VIS = `window.__vis = (e) => { if (!e) return false; const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0' && b.width > 0 && b.height > 0; };`;
(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const r = {}; const S = L.SITES[site];
    const { ctx, page } = await L.newPage(1440, 900); await ctx.addInitScript({ content: VIS });
    await L.login(page, site);
    await page.goto(S.url + PAINEL[site]); await page.waitForTimeout(1500);
    // tooltip do sparkline: varre o 1º sparkline
    const sp = page.locator('main article.kpi svg, main .sw-kpi svg, main .kpi svg').filter({ has: page.locator('polyline, path') });
    const n = await sp.count(); let tip = [];
    for (let i = 0; i < n && !tip.length; i++) { const bb = await sp.nth(i).boundingBox(); if (!bb || bb.width < 80) continue; for (const f of [0.2, 0.5, 0.8]) { await page.mouse.move(bb.x + bb.width * f, bb.y + bb.height * 0.5); await page.waitForTimeout(300); tip = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => __vis(e) && /R\$|\d/.test(e.textContent) && ['absolute', 'fixed'].includes(getComputedStyle(e).position) && e.getBoundingClientRect().width < 260 && e.children.length <= 3 && e.textContent.trim().length < 60).map(e => e.textContent.trim()).slice(0, 2)); if (tip.length) { await page.screenshot({ path: L.shot(`${site}-sparkline-tooltip.png`), clip: { x: Math.max(0, bb.x - 40), y: Math.max(0, bb.y - 120), width: Math.min(500, bb.width + 80), height: 220 } }); break; } } }
    r.sparkTip = tip;
    // tabela do dev-3: ação VER
    if (site === 'dev-3') { await page.goto(S.url + '#/app/relatorios'); await page.waitForTimeout(1500); const b = page.locator('main table tbody tr').first().locator('button, a').last(); await b.click(); await page.waitForTimeout(700); r.verAction = await page.evaluate(() => ({ dialogs: [...document.querySelectorAll('dialog, [role=dialog], [role=status], .toast, [class*=toast]')].filter(__vis).map(d => d.innerText.replace(/\s+/g, ' ').slice(0, 120)), hash: location.hash })); await page.screenshot({ path: L.shot(`${site}-tabela-acao-ver.png`) }); await page.keyboard.press('Escape'); }
    // Sair pelo menu do header
    await page.goto(S.url + PAINEL[site]); await page.waitForTimeout(1200);
    await page.locator('header button[aria-label*="erfil"]').filter({ visible: true }).first().click(); await page.waitForTimeout(500);
    await page.locator('[role=menu] a, [role=menu] button, [role=dialog] a, [role=dialog] button, .menu a, .menu button').filter({ hasText: /^\s*Sair\s*$/ }).filter({ visible: true }).first().click();
    await page.waitForTimeout(1500);
    r.logout = await page.evaluate(() => ({ hash: location.hash, pwd: !!document.querySelector('input[type=password]') }));
    await ctx.close();
    if (site === 'dev-2') {
      const { ctx, page } = await L.newPage(390, 844, true); await ctx.addInitScript({ content: VIS });
      await L.login(page, site);
      await page.locator('button[aria-label*="otifica"]').filter({ visible: true }).first().tap(); await page.waitForTimeout(800);
      r.celBell = await page.evaluate(() => [...document.querySelectorAll('[role=dialog], dialog[open], [class*=sheet]')].filter(__vis).map(e => { const b = e.getBoundingClientRect(); return { cls: String(e.className).slice(0, 30), x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), text: e.innerText.replace(/\s+/g, ' ').slice(0, 100) }; }));
      await page.screenshot({ path: L.shot(`${site}-cel-acao-topbar.png`) });
      await ctx.close();
    }
    res[site] = r; console.log(site, JSON.stringify(r));
  }
  L.saveJSON('s09b-complementos.json', res);
  await L.close();
})();
