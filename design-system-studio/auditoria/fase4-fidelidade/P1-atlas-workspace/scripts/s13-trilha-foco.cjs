// Trilha de 3 níveis (desktop e celular) e foco preso na sobreposição do tablet.
const L = require('./lib.cjs');
const TRILHA = { 'dev-1': '#/projetos/site-institucional/pagina-inicial', 'dev-2': null, 'dev-3': null };
const PAINEL = { 'dev-1': '#/painel', 'dev-2': '#/painel', 'dev-3': '#/app/painel' };
(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const S = L.SITES[site]; const r = {};
    for (const [vw, vh, mob, tag] of [[1440, 900, false, 'desk'], [390, 844, true, 'cel']]) {
      const { ctx, page } = await L.newPage(vw, vh, mob);
      await L.login(page, site);
      // navega até a página mais funda de um projeto clicando
      const proj = { 'dev-1': '#/projetos', 'dev-2': '#/projetos', 'dev-3': '#/app/projetos' }[site];
      await page.goto(S.url + proj); await page.waitForTimeout(1200);
      const link = page.locator('main a').filter({ hasText: /site institucional/i }).first();
      if (await link.count()) { await link.click(); await page.waitForTimeout(1200); }
      const deeper = page.locator('main a').filter({ hasText: /página inicial/i }).first();
      if (await deeper.count()) { await deeper.click(); await page.waitForTimeout(1200); }
      r[tag] = await page.evaluate(() => { const c = [...document.querySelectorAll('nav[aria-label*=rilha], .crumbs, [class*=back]')].filter(e => e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none'); return { hash: location.hash, crumbs: c.map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean), dialog: !!document.querySelector('dialog[open]') }; });
      await page.screenshot({ path: L.shot(`${site}-trilha-${tag}.png`) });
      await ctx.close();
    }
    // foco preso no tablet
    const { ctx, page } = await L.newPage(900, 1024);
    await L.login(page, site);
    await page.goto(S.url + PAINEL[site]); await page.waitForTimeout(1200);
    const opener = page.locator('button[aria-label*="Expandir"], button[aria-label*="Abrir menu"]').filter({ visible: true }).first();
    await opener.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(700);
    let outside = 0;
    for (let i = 0; i < 25; i++) { await page.keyboard.press('Tab'); const inside = await page.evaluate(() => !!document.activeElement.closest('aside#sidebar')); if (!inside) outside++; }
    r.trap = { tabsOutside: outside };
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    r.trap.focusBack = await page.evaluate(() => document.activeElement.getAttribute('aria-label'));
    await ctx.close();
    res[site] = r; console.log(site, JSON.stringify(r));
  }
  L.saveJSON('s13-trilha-foco.json', res);
  await L.close();
})();
