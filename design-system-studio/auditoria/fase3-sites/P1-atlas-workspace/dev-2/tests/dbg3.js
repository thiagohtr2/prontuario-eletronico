const L = require('./lib');
const [,, w, route] = process.argv;
(async () => {
  const { browser, page } = await L.launch({ width: +w, height: 900 }, { mobile: +w < 600, touch: +w < 600 });
  await L.login(page);
  await page.evaluate((r) => { location.hash = '#/' + r; }, route);
  await page.waitForTimeout(1500);
  const res = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth; const out = [];
    document.querySelectorAll('body *').forEach(el => {
      if (el.closest('.sw-table__scroll')) return;
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1) out.push(`${el.tagName.toLowerCase()}.${String(el.className.baseVal ?? el.className).slice(0,40)} right=${Math.round(r.right)} w=${Math.round(r.width)}`);
    });
    const sc = document.querySelector('.sw-table__scroll');
    return { out, scroller: sc && [sc.clientWidth, sc.scrollWidth, getComputedStyle(sc).overflowX, sc.getBoundingClientRect().right],
      htmlOverflow: getComputedStyle(document.documentElement).overflowX, bodyScroll: document.body.scrollWidth,
      grid: getComputedStyle(document.querySelector('.app')).gridTemplateColumns };
  });
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})();
