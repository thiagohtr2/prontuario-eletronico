// Sobreposição entre lista e rodapé da sidebar em alturas comuns de notebook.
const path = require('path');
const { OUT, SITES, newPage, login, launch } = require('./lib.cjs');
(async () => {
  const b = await launch();
  for (const site of Object.keys(SITES)) for (const [w, h] of [[1366, 768], [1280, 800], [1440, 900]]) {
    const { ctx, page } = await newPage(b, w, h);
    await login(page, site);
    const r = await page.evaluate(() => { const sb = document.querySelector('#sidebar'); const links = [...sb.querySelectorAll('nav a')].filter((a) => a.getBoundingClientRect().height > 0); const last = links[links.length - 1].getBoundingClientRect(); const foot = sb.lastElementChild.getBoundingClientRect(); const nav = sb.querySelector('nav'); return { lastBottom: Math.round(last.bottom), footTop: Math.round(foot.top), overlap: last.bottom > foot.top + 1, navScrollable: nav.scrollHeight > nav.clientHeight + 1 && ['auto', 'scroll'].includes(getComputedStyle(nav).overflowY) }; });
    if (site === 'dev-3' && w === 1366) await page.screenshot({ path: path.join(OUT, 'capturas', site, 'sidebar-1366x768-sobreposicao.png') });
    console.log(site, w + 'x' + h, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
