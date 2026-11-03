// Investiga a sidebar sticky: altura do contêiner do shell × altura do documento, em páginas longas.
const L = require('./lib.cjs');
const ROUTES = { 'dev-1': ['#/painel', '#/projetos', '#/pessoas'], 'dev-2': ['#/painel', '#/projetos', '#/tarefas'], 'dev-3': ['#/app/painel', '#/app/projetos', '#/app/relatorios'] };
(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const { ctx, page } = await L.newPage(1440, 900);
    await L.login(page, site);
    res[site] = [];
    for (const r of ROUTES[site]) {
      await page.goto(L.SITES[site].url + r); await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await page.waitForTimeout(500);
      const m = await page.evaluate(() => {
        const sb = document.querySelector('aside#sidebar'); const shell = sb.parentElement;
        const b = sb.getBoundingClientRect(); const sh = shell.getBoundingClientRect();
        const after = [...document.body.children].filter(e => e !== shell && !shell.contains(e) && e.getBoundingClientRect().height > 0).map(e => ({ tag: e.tagName, id: e.id, cls: e.className, h: e.getBoundingClientRect().height, pos: getComputedStyle(e).position }));
        const sbt = sb.querySelector('.sidebar__top');
        return { scrollY: Math.round(scrollY), docH: document.documentElement.scrollHeight, shellBottomAbs: Math.round(sh.bottom + scrollY), shellCls: shell.className, sbTop: Math.round(b.y), sbBottom: Math.round(b.bottom), topVisible: sbt ? Math.round(sbt.getBoundingClientRect().y) : null, bodyKids: after };
      });
      res[site].push({ route: r, ...m });
      await page.screenshot({ path: L.shot(`${site}-sticky-fim-${r.replace(/[#/]/g, '')}.png`) });
    }
    await ctx.close();
  }
  console.log(JSON.stringify(res, null, 1));
  L.saveJSON('s04b-sticky.json', res);
  await L.close();
})();
