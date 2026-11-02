const L = require('./lib');
const routes = ['painel','inicio','projetos','projetos/site-institucional','projetos/site-institucional/pagina-inicial','tarefas','calendario','pessoas','mensagens','relatorios','relatorios?kpi=receita','configuracoes','ajuda'];
const widths = [1440, 1100, 900, 390];
(async () => {
  for (const w of widths) {
    const { browser, page, errors } = await L.launch({ width: w, height: w < 600 ? 800 : 900 }, { mobile: w < 600, touch: w < 600 });
    await L.login(page);
    for (const r of routes) {
      await page.evaluate((r) => { location.hash = '#/' + r; }, r);
      await page.waitForTimeout(1500);
      const ov = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      if (ov.sw > ov.cw) console.log(`OVERFLOW w=${w} route=${r} scrollWidth=${ov.sw} clientWidth=${ov.cw}`);
      if (['painel','tarefas','inicio','ajuda'].includes(r) || r.startsWith('projetos/site-institucional/')) await page.screenshot({ path: L.shot(`${r.replace(/[\/?=]/g,'_')}-${w}`), fullPage: false });
    }
    console.log(`w=${w} errors:`, errors.length ? errors.join(' | ') : 'none');
    await browser.close();
  }
})();
