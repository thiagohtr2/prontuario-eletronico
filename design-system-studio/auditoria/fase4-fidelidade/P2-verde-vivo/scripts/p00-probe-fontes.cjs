// Verifica se as fontes carregam no Chromium do ambiente e coleta erros de console.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  for (const port of [4521, 4522, 4523]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errs = []; const failed = [];
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
    page.on('requestfailed', r => failed.push(r.url().slice(0, 90) + ' ' + (r.failure() && r.failure().errorText)));
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    const f = await page.evaluate(async () => {
      await document.fonts.ready;
      const loaded = [...document.fonts].filter(x => x.status === 'loaded').map(x => x.family + ' ' + x.style + ' ' + x.weight);
      return { fraunces: document.fonts.check('650 20px Fraunces'), inter: document.fonts.check('400 15px Inter'), loaded };
    });
    console.log(port, JSON.stringify(f), '\n errors:', errs.slice(0, 5), '\n failed:', failed.slice(0, 5));
    await ctx.close();
  }
  await browser.close();
})();
