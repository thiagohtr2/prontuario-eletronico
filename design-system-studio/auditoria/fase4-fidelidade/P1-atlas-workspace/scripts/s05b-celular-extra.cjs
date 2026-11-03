// Complementos do celular: folha "Mais" do dev-2 (trava de rolagem), preservação de rolagem num destino longo e horizontal 667x375.
const L = require('./lib.cjs');
const LONG = { 'dev-1': 1, 'dev-2': 0, 'dev-3': 1 }; // índice de um destino com página longa (Painel/Projetos)
(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const { ctx, page } = await L.newPage(390, 844, true);
    await L.login(page, site);
    const items = page.locator('#bottom-nav a, #bottom-nav button, nav.bottom-nav a, nav.bottom-nav button').filter({ visible: true });
    const r = {};
    // abrir/fechar o 4º item
    await items.nth(3).tap(); await page.waitForTimeout(800);
    r.mais = await page.evaluate(() => ({ hash: location.hash, dialog: !!document.querySelector('[role=dialog]:not([hidden]), dialog[open]'), bodyOverflow: getComputedStyle(document.body).overflow, htmlOverflow: getComputedStyle(document.documentElement).overflow }));
    await page.screenshot({ path: L.shot(`${site}-cel-mais.png`) });
    if (r.mais.dialog) {
      await page.keyboard.press('Escape'); await page.waitForTimeout(600);
      r.maisAfterEsc = await page.evaluate(() => ({ dialog: !!document.querySelector('[role=dialog]:not([hidden]), dialog[open]'), bodyOverflow: getComputedStyle(document.body).overflow, focus: document.activeElement && (document.activeElement.getAttribute('aria-label') || document.activeElement.innerText) }));
    }
    // destino longo: rolar, trocar, voltar
    const a = items.nth(LONG[site]), b = items.nth(LONG[site] === 0 ? 1 : 0);
    await a.tap(); await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' })); await page.waitForTimeout(600);
    r.before = await page.evaluate(() => ({ y: Math.round(scrollY), max: document.documentElement.scrollHeight - innerHeight, hash: location.hash }));
    await b.tap(); await page.waitForTimeout(1000);
    r.other = await page.evaluate(() => ({ y: Math.round(scrollY), hash: location.hash }));
    await a.tap(); await page.waitForTimeout(1200);
    r.restored = await page.evaluate(() => ({ y: Math.round(scrollY), hash: location.hash }));
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' })); await page.waitForTimeout(500);
    r.preActive = await page.evaluate(() => Math.round(scrollY));
    await a.tap(); await page.waitForTimeout(1200);
    r.afterActive = await page.evaluate(() => Math.round(scrollY));
    // horizontal pequena (largura < 768)
    for (const [w, h] of [[667, 375], [740, 360]]) {
      await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
      r['land' + w] = await page.evaluate(() => {
        const vis = (e) => e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0;
        const bn = document.querySelector('#bottom-nav, nav.bottom-nav');
        const hd = [...document.querySelectorAll('header')].filter(vis).find(h => ['sticky', 'fixed'].includes(getComputedStyle(h).position));
        const bnH = vis(bn) ? bn.getBoundingClientRect().height : 0, hdH = hd ? hd.getBoundingClientRect().height : 0;
        const it = bn && [...bn.querySelectorAll('a,button')].find(vis); const svg = it && it.querySelector('svg'); const lab = it && [...it.querySelectorAll('span')].find(s => s.children.length === 0 && s.textContent.trim());
        const side = it && svg && lab ? (Math.abs(svg.getBoundingClientRect().y - lab.getBoundingClientRect().y) < 12 ? 'lado a lado' : 'empilhado') : null;
        return { bnH, hdH, hdPos: hd && getComputedStyle(hd).position, sum: bnH + (hd && getComputedStyle(hd).position !== 'static' ? hdH : 0), pct: +(((bnH + hdH) / innerHeight) * 100).toFixed(1), itemLayout: side, itemH: it ? it.getBoundingClientRect().height : 0 };
      });
      await page.screenshot({ path: L.shot(`${site}-cel-horizontal-${w}x${h}.png`) });
    }
    res[site] = r;
    await ctx.close();
  }
  console.log(JSON.stringify(res, null, 1));
  L.saveJSON('s05b-celular-extra.json', res);
  await L.close();
})();
