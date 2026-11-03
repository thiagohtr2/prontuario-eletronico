// Esboço do primeiro card e da barra de ferramentas do catálogo de cada site.
const { chromium, open } = require('./lib.cjs');
const sel = { 'dev-1': ['.catalog__toolbar', '.pcard'], 'dev-2': ['.catalog__toolbar', '.pcard'], 'dev-3': ['.toolbar', '.card'] };
(async () => {
  const browser = await chromium.launch();
  for (const site of Object.keys(sel)) {
    const { page } = await open(browser, site, 'desktop', '#/catalogo');
    await page.waitForTimeout(1500);
    const out = await page.evaluate((sels) => sels.map(s => { const e = document.querySelector(s); return e ? e.outerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '<svg/>').slice(0, 2500) : 'NONE ' + s; }).join('\n---\n'), sel[site]);
    console.log('=====', site, '\n', out);
  }
  await browser.close();
})();
