const path = require('path');
const { chromium } = require('playwright');
const INDEX = 'file://' + path.join(__dirname, '..', 'index.html');
const OUT = path.join(__dirname, 'shots');
(async () => {
  const browser = await chromium.launch();
  const shot = async (w, h, nome, acao) => {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.route('**/*', (r) => (r.request().url().startsWith('file:') ? r.continue() : r.abort()));
    await page.goto(INDEX);
    await page.waitForTimeout(1200);
    if (acao) await acao(page);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, nome + '.png') });
    await page.close();
  };
  await shot(390, 844, 'mobile-dados', async (p) => { await p.click('#tab-m-dados'); });
  await shot(390, 844, 'mobile-alertas', async (p) => { await p.click('#tab-m-alertas'); });
  await shot(667, 375, 'landscape-667', null);
  await shot(820, 1180, 'tablet-820-alertas', async (p) => { await p.click('.tabs-desktop [data-go="alertas"]'); });
  await browser.close();
  console.log('ok');
})();
