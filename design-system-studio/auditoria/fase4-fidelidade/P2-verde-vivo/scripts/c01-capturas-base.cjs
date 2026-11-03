// Capturas de base: landing (#/) e catálogo (#/catalogo) em 1440x900, 768x1024 e 390x844 (toque).
const { chromium, OUT, SITES, open, scrollThrough, path } = require('./lib.cjs');
(async () => {
  const browser = await chromium.launch();
  for (const site of Object.keys(SITES)) {
    for (const vp of ['desktop', 'tablet', 'mobile']) {
      for (const [nome, hash] of [['landing', ''], ['catalogo', '#/catalogo']]) {
        const { ctx, page } = await open(browser, site, vp, hash);
        await scrollThrough(page);
        await page.screenshot({ path: path.join(OUT, `${site}-${vp}-${nome}-dobra.png`) });
        await page.screenshot({ path: path.join(OUT, `${site}-${vp}-${nome}-inteira.png`), fullPage: true });
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        console.log(site, vp, nome, 'altura', h, 'erros', page._errs.length ? page._errs.slice(0, 3) : 0);
        await ctx.close();
      }
    }
  }
  await browser.close();
})();
