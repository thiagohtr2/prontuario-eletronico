// Capturas de referência: login/cadastro (desktop e celular) e app (1440x900, 768x1024, 390x844 móvel).
const L = require('./lib.cjs');
const PAINEL = { 'dev-1': '#/painel', 'dev-2': '#/painel', 'dev-3': '#/app/painel' };

(async () => {
  for (const site of Object.keys(L.SITES)) {
    const S = L.SITES[site];
    // Telas públicas
    for (const [vw, vh, mob, tag] of [[1440, 900, false, '1440x900'], [390, 844, true, '390x844']]) {
      const { ctx, page } = await L.newPage(vw, vh, mob);
      await page.goto(S.url + S.login); await page.waitForTimeout(600);
      await page.screenshot({ path: L.shot(`${site}-login-${tag}.png`) });
      await page.screenshot({ path: L.shot(`${site}-login-${tag}-full.png`), fullPage: true });
      await page.goto(S.url + S.cadastro); await page.waitForTimeout(600);
      await page.screenshot({ path: L.shot(`${site}-cadastro-${tag}.png`) });
      await page.screenshot({ path: L.shot(`${site}-cadastro-${tag}-full.png`), fullPage: true });
      await ctx.close();
    }
    // App
    for (const [vw, vh, mob, tag] of [[1440, 900, false, '1440x900'], [768, 1024, false, '768x1024'], [390, 844, true, '390x844']]) {
      const { ctx, page } = await L.newPage(vw, vh, mob);
      await L.login(page, site);
      await page.screenshot({ path: L.shot(`${site}-app-inicial-${tag}.png`) });
      await page.goto(S.url + PAINEL[site]); await page.waitForTimeout(1500);
      await page.screenshot({ path: L.shot(`${site}-painel-${tag}.png`) });
      await page.screenshot({ path: L.shot(`${site}-painel-${tag}-full.png`), fullPage: true });
      await ctx.close();
    }
    console.log('ok', site);
  }
  await L.close();
})();
