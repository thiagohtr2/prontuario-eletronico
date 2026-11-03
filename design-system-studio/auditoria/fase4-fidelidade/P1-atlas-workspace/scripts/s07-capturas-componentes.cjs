// Capturas das páginas que contêm os componentes (tabela, formulário, cards) a 1440x900 e 390x844.
const L = require('./lib.cjs');
const P = {
  'dev-1': { tabela: '#/painel', form: '#/ajuda', cards: '#/projetos' },
  'dev-2': { tabela: '#/relatorios', form: '#/ajuda', cards: '#/projetos' },
  'dev-3': { tabela: '#/app/relatorios', form: '#/app/ajuda', cards: '#/app/projetos' },
};
(async () => {
  for (const site of Object.keys(L.SITES)) {
    for (const [vw, vh, mob, tag] of [[1440, 900, false, '1440x900'], [390, 844, true, '390x844']]) {
      const { ctx, page } = await L.newPage(vw, vh, mob);
      await L.login(page, site);
      for (const [k, route] of Object.entries(P[site])) {
        await page.goto(L.SITES[site].url + route); await page.waitForTimeout(1500);
        if (k === 'tabela') { await page.evaluate(() => { const t = document.querySelector('main table'); if (t) t.scrollIntoView({ block: 'start' }); window.scrollBy(0, -140); }); await page.waitForTimeout(500); }
        if (k === 'form') { await page.evaluate(() => { const f = [...document.querySelectorAll('main form')].pop(); if (f) f.scrollIntoView({ block: 'start' }); window.scrollBy(0, -140); }); await page.waitForTimeout(500); }
        await page.mouse.move(1, 1);
        await page.screenshot({ path: L.shot(`${site}-${k}-${tag}.png`) });
      }
      await ctx.close();
    }
  }
  await L.close();
})();
