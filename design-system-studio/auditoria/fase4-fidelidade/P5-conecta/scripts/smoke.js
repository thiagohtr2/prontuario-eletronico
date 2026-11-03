const { chromium, CFG, CAP, newCtx, openLogin, login } = require('./lib');
(async () => {
  const b = await chromium.launch();
  for (const site of Object.keys(CFG)) {
    for (const kind of ['m390', 'd1440']) {
      const ctx = await newCtx(b, kind);
      const p = await openLogin(ctx, site);
      await p.screenshot({ path: `${CAP}/${site}-${kind}-login.png` });
      try { await login(p, site); } catch (e) { console.log(site, kind, 'LOGIN FAIL', e.message); }
      await p.screenshot({ path: `${CAP}/${site}-${kind}-feed.png` });
      console.log(site, kind, p.url(), p.__errors);
      await ctx.close();
    }
  }
  await b.close();
})();
