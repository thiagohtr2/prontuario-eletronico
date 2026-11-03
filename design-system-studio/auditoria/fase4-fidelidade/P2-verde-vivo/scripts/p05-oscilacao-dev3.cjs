// dev-3: amostra a altura da linha 2 e o scrollY ao longo do tempo depois de uma rolagem única (detecta oscilação).
const { chromium, open } = require('./lib.cjs');
(async () => {
  const b = await chromium.launch();
  for (const site of ['dev-3', 'dev-1']) {
    const sel = site === 'dev-3' ? ['#topbar-nav', '#topbar'] : ['.hdr-nav', '.site-header'];
    const { page } = await open(b, site, 'desktop', '#/catalogo');
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
    const s = [];
    for (let i = 0; i < 16; i++) { s.push(await page.evaluate((sel) => Math.round(scrollY) + ':' + Math.round(document.querySelector(sel[0]).getBoundingClientRect().height) + (document.querySelector(sel[1]).classList.contains('is-collapsed') ? 'C' : 'E'), sel)); await page.waitForTimeout(120); }
    console.log(site, s.join(' '));
  }
  await b.close();
})();
