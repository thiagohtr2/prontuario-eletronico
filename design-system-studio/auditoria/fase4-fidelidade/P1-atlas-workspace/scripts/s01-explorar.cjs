// Exploração inicial: tela de entrada, login e landmarks do shell a 1440x900 e 390x844.
const L = require('./lib.cjs');

(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    res[site] = {};
    for (const [vw, vh, mob, tag] of [[1440, 900, false, 'desk'], [390, 844, true, 'cel']]) {
      const { ctx, page } = await L.newPage(vw, vh, mob);
      await page.goto(L.SITES[site].url, { waitUntil: 'load' });
      await page.waitForTimeout(600);
      const first = await page.evaluate(() => ({
        hash: location.hash, title: document.title,
        hasEmail: !!document.querySelector('input[type=email]'),
        hasPwd: !!document.querySelector('input[type=password]'),
        h1: [...document.querySelectorAll('h1,h2')].map(e => e.textContent.trim()).slice(0, 4),
      }));
      await L.login(page, site);
      const shell = await page.evaluate(() => {
        const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
        const desc = (e) => e ? (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '')) : null;
        const vis = (e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0; };
        const land = [...document.querySelectorAll('aside, header, nav, main, [role=navigation], [role=banner]')].filter(vis).map(e => ({ d: desc(e), r: r(e), label: e.getAttribute('aria-label'), pos: getComputedStyle(e).position }));
        return { hash: location.hash, title: document.title, h1: [...document.querySelectorAll('h1')].map(e => e.textContent.trim()), land };
      });
      res[site][tag] = { first, shell, errs: page._errs || [] };
      await page.screenshot({ path: L.shot(`${site}-explorar-${tag}.png`) });
      await ctx.close();
    }
  }
  L.saveJSON('s01-explorar.json', res);
  console.log(JSON.stringify(res, null, 1));
  await L.close();
})();
