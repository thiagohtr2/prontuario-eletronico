// Varredura de larguras: overflow horizontal, arquitetura ativa, textos cortados e alvos < 44 px.
// Uso: node varredura.js dev-1
const { chromium, CFG, CAP, DATA, newCtx, openLogin, login, fs } = require('./lib');
const site = process.argv[2];
const c = CFG[site];
const W = [320, 344, 360, 375, 390, 412, 430, 480, 600, 767, 768, 820, 1024, 1280, 1440, 1920];
const ROTAS = ['#/feed', '#/explorar', '#/perfil', '#/mensagens'];
(async () => {
  const b = await chromium.launch();
  const R = { site, login: {}, app: {} };
  // celular emulado para < 768; desktop para >= 768
  for (const mobile of [true, false]) {
    const ws = W.filter((w) => (mobile ? w < 768 : w >= 768));
    const ctx = await newCtx(b, mobile ? { viewport: { width: ws[0], height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: require('./lib').MOBILE_UA } : { viewport: { width: ws[0], height: 900 } });
    const p = await openLogin(ctx, site);
    for (const w of ws) {
      await p.setViewportSize({ width: w, height: mobile ? 844 : 900 }); await p.waitForTimeout(350);
      R.login[w] = await p.evaluate(() => ({ ...window.__m.overflowX(), cortados: window.__m.cutTexts().filter((x) => !/sr-only|visually/.test(x.cls)).length }));
      if ([320, 768, 1024].includes(w)) await p.screenshot({ path: `${CAP}/${site}-varredura-login-${w}.png`, fullPage: true });
    }
    await login(p, site);
    for (const w of ws) {
      await p.setViewportSize({ width: w, height: mobile ? 844 : 900 }); await p.waitForTimeout(400);
      R.app[w] = {};
      for (const rota of ROTAS) {
        await p.evaluate((r) => { location.hash = r; window.scrollTo(0, 0); }, rota); await p.waitForTimeout(1000);
        R.app[w][rota] = await p.evaluate((c) => {
          const m = window.__m; const dock = m.q(c.dock); const nav = m.q(c.nav);
          const navLinks = nav ? [...nav.querySelectorAll('a,button')].filter(m.vis).length : 0;
          const ov = m.overflowX();
          // elementos que estouram a viewport à direita
          const culprits = ov.over ? [...document.querySelectorAll('body *')].filter((e) => m.vis(e) && e.getBoundingClientRect().right > innerWidth + 1).slice(0, 5).map((e) => e.tagName + '.' + String(e.className).slice(0, 30) + '@' + Math.round(e.getBoundingClientRect().right)) : [];
          return { over: ov.over, sw: ov.sw, iw: ov.iw, culprits, dock: m.vis(dock) && dock.getBoundingClientRect().height > 0, menuBtn: m.vis(m.q(c.menuBtn)), navLinks, cortados: m.cutTexts().filter((x) => !/sr-only|visually|label$/.test(x.cls) && x.cw > 2).map((x) => x.t + '(' + x.cls + ')'), pequenos: innerWidth < 768 ? m.smallTargets().filter((t) => !t.inline).map((t) => t.label + ' ' + t.w + 'x' + t.h) : [] };
        }, c);
      }
      if ([320, 412, 600, 767, 768, 1024, 1280, 1920].includes(w)) await p.evaluate(() => { location.hash = '#/feed'; window.scrollTo(0, 0); }).then(() => p.waitForTimeout(900)).then(() => p.screenshot({ path: `${CAP}/${site}-varredura-${w}.png` }));
    }
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(`${DATA}/${site}-varredura.json`, JSON.stringify(R, null, 1));
  console.log('ok');
})();
