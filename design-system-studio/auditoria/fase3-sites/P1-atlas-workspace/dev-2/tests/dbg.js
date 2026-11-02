const L = require('./lib');
const [,, w, route] = process.argv;
(async () => {
  const { browser, page } = await L.launch({ width: +w, height: 900 }, { mobile: +w < 600, touch: +w < 600 });
  await L.login(page);
  await page.evaluate((r) => { location.hash = '#/' + r; }, route);
  await page.waitForTimeout(1500);
  const res = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && r.width > 0) {
        // only report if no ancestor scroller clips it
        let p = el.parentElement, clipped = false;
        while (p && p !== document.body) { const cs = getComputedStyle(p); if (/(auto|hidden|scroll)/.test(cs.overflowX)) { clipped = true; break; } p = p.parentElement; }
        if (!clipped) out.push(`${el.tagName.toLowerCase()}.${(el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0,50)} right=${Math.round(r.right)} w=${Math.round(r.width)}`);
      }
    });
    return out.slice(0, 15);
  });
  console.log(res.join('\n'));
  await browser.close();
})();
