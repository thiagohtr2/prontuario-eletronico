// Capturas principais: login e dashboard em 1440x900, 768x1024, 390x844 (móvel emulado).
const fs = require('fs');
const path = require('path');
const { OUT, SITES, newPage, gotoLogin, login, launch } = require('./lib.cjs');

(async () => {
  const browser = await launch();
  const sizes = [[1440, 900], [768, 1024], [390, 844]];
  const log = {};
  for (const site of Object.keys(SITES)) {
    const dir = path.join(OUT, 'capturas', site);
    fs.mkdirSync(dir, { recursive: true });
    log[site] = {};
    for (const [w, h] of sizes) {
      const { ctx, page } = await newPage(browser, w, h);
      await gotoLogin(page, site);
      await page.screenshot({ path: path.join(dir, `login-${w}.png`) });
      await login(page, site);
      await page.screenshot({ path: path.join(dir, `dashboard-${w}.png`) });
      await page.screenshot({ path: path.join(dir, `dashboard-${w}-full.png`), fullPage: true });
      log[site][w] = { url: page.url(), errors: page._errors.slice() };
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'scripts', 'out-01-capturas.json'), JSON.stringify(log, null, 2));
  await browser.close();
  console.log(JSON.stringify(log, null, 2));
})();
