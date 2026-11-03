// Fonte dos campos do formulário de conteúdo ("Fale com a gente") a 390 px e estado vazio da tabela do dev-3.
const L = require('./lib.cjs');
const FORM = { 'dev-1': '#/ajuda', 'dev-2': '#/ajuda', 'dev-3': '#/app/ajuda' };
(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const { ctx, page } = await L.newPage(390, 844, true);
    await L.login(page, site);
    await page.goto(L.SITES[site].url + FORM[site]); await page.waitForTimeout(1300);
    res[site] = await page.evaluate(() => { const f = [...document.querySelectorAll('main form')].pop(); const ins = [...f.querySelectorAll('input:not([type=checkbox]), select, textarea')].filter(i => i.getBoundingClientRect().width > 0); return { fs: [...new Set(ins.map(i => getComputedStyle(i).fontSize))], xs: [...new Set(ins.map(i => Math.round(i.getBoundingClientRect().x)))], btnW: Math.round(f.querySelector('button[type=submit]').getBoundingClientRect().width) }; });
    if (site === 'dev-3') {
      await page.goto(L.SITES[site].url + '#/app/relatorios'); await page.waitForTimeout(1200);
      const sel = page.locator('main select').first();
      if (await sel.count()) { const opts = await sel.locator('option').evaluateAll(o => o.map(x => x.textContent.trim())); res[site].filterOpts = opts; }
      await page.goto(L.SITES[site].url + '#/app/relatorios?erro=1'); await page.waitForTimeout(1500);
      res[site].erro = await page.evaluate(() => document.querySelector('main').innerText.replace(/\s+/g, ' ').match(/[^.]*(erro|não foi possível)[^.]*\.?/i)?.[0] || null);
    }
    await ctx.close();
  }
  console.log(JSON.stringify(res, null, 1)); L.saveJSON('s14-form-celular.json', res); await L.close();
})();
