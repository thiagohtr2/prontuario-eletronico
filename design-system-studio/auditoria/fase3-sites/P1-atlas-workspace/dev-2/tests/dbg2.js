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
      const cs = getComputedStyle(el);
      if (r.right > vw + 1) {
        out.push(`${el.tagName.toLowerCase()}.${String(el.className.baseVal ?? el.className).slice(0,40)} pos=${cs.position} right=${Math.round(r.right)} w=${Math.round(r.width)}`);
      }
    });
    const m = document.querySelector('.page'); const pr = m.getBoundingClientRect();
    return { page: [Math.round(pr.left), Math.round(pr.right)], docScroll: document.documentElement.scrollWidth, list: out.slice(0, 12) };
  });
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})();
