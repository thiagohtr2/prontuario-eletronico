// Verificação detalhada: rolagem preservada ao abrir/fechar o drawer (com capturas antes/depois).
const { chromium, CFG, CAP, DATA, newCtx, openLogin, login, fs } = require('./lib');
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const site of Object.keys(CFG)) {
    const c = CFG[site];
    const ctx = await newCtx(b, 'm390'); const p = await openLogin(ctx, site); await login(p, site); await p.waitForTimeout(4000);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    await p.evaluate(() => window.scrollTo(0, 1100)); await p.waitForTimeout(500);
    await p.evaluate(() => window.scrollTo(0, 1000)); await p.waitForTimeout(800);
    const y0 = await p.evaluate(() => scrollY);
    await p.screenshot({ path: `${CAP}/${site}-m390-rolado-antes-drawer.png` });
    { const bb = await p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, c.menuBtn); await p.touchscreen.tap(bb.x, bb.y); } await p.waitForTimeout(800);
    const y1 = await p.evaluate(() => ({ y: scrollY, htmlTop: getComputedStyle(document.documentElement).top, bodyTop: getComputedStyle(document.body).top, bodyPos: getComputedStyle(document.body).position, H: document.documentElement.scrollHeight }));
    await p.screenshot({ path: `${CAP}/${site}-m390-rolado-drawer-aberto.png` });
    await p.evaluate((s) => document.querySelector(s).click(), c.drawerClose); await p.waitForTimeout(800);
    const y3 = await p.evaluate(() => scrollY);
    await p.screenshot({ path: `${CAP}/${site}-m390-rolado-depois-drawer.png` });
    out[site] = { alturaDoc: H, antes: y0, aberto: y1, fechado: y3 };
    await ctx.close();
  }
  await b.close(); fs.writeFileSync(`${DATA}/rolagem-drawer.json`, JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1));
})();
