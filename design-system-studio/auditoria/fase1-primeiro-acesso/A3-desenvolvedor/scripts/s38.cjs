const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open({ width: 1280, height: 800 });
  const pages = [['#/livre','38a-1280-livre'],['#/guiado/desktop','38b-1280-desktop'],['#/guiado/identidade','38c-1280-identidade'],['#/guiado/navegacao','38d-1280-navegacao'],['#/guiado/entrega','38e-1280-entrega']];
  for (const [h, n] of pages) {
    await page.goto('http://127.0.0.1:4300/' + h, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await shot(page, n);
    const ov = await page.evaluate(() => {
      const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth;
      const offenders = [];
      for (const el of document.querySelectorAll('main *')) {
        if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX === 'visible' && el.children.length === 0 && el.textContent.trim()) {
          offenders.push(el.tagName + ':' + el.textContent.trim().slice(0, 40));
        }
      }
      return { sw, cw, offenders: offenders.slice(0, 8) };
    });
    console.log(h, JSON.stringify(ov));
  }
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
