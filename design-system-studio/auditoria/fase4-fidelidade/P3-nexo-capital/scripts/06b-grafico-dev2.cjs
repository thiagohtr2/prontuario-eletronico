// Reteste do tooltip e da legenda do gráfico do dev-2 (barras desenhadas como <path>).
const path = require('path');
const { OUT, newPage, login, launch } = require('./lib.cjs');
(async () => {
  const b = await launch();
  const { ctx, page } = await newPage(b, 1440, 900);
  await login(page, 'dev-2');
  const info = await page.evaluate(() => { const svg = [...document.querySelectorAll('#blk-chart svg')].sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0]; const els = [...svg.querySelectorAll('rect,path')].map((r) => ({ tag: r.tagName, fill: getComputedStyle(r).fill, b: r.getBoundingClientRect() })).filter((e) => e.b.width > 2 && e.b.width < 120 && e.b.height > 2); const f = {}; els.forEach((e) => { f[e.tag + ' ' + e.fill] = (f[e.tag + ' ' + e.fill] || 0) + 1; }); const prim = els.filter((e) => e.fill === 'rgb(29, 78, 216)'); return { f, p: prim.map((e) => ({ x: e.b.x + e.b.width / 2, y: e.b.y + e.b.height / 2 })) }; });
  const p = info.p[3];
  await page.mouse.move(p.x, p.y); await page.waitForTimeout(400);
  const tip = await page.evaluate(() => [...document.querySelectorAll('.chart-tip, [role=tooltip], .tooltip')].filter((t) => t.getBoundingClientRect().height > 0 && getComputedStyle(t).visibility !== 'hidden' && getComputedStyle(t).opacity !== '0' && !t.hidden).map((t) => t.innerText.trim().replace(/\s+/g, ' ')));
  await page.screenshot({ path: path.join(OUT, 'capturas', 'dev-2', 'grafico-tooltip.png'), clip: { x: 252, y: 250, width: 900, height: 500 } });
  await page.locator('#blk-chart [class*=legend] button').nth(1).click(); await page.waitForTimeout(500);
  const after = await page.evaluate(() => { const svg = [...document.querySelectorAll('#blk-chart svg')].sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0]; const f = {}; [...svg.querySelectorAll('rect,path')].forEach((r) => { const bb = r.getBoundingClientRect(); if (bb.width > 2 && bb.width < 120 && bb.height > 2) { const k = r.tagName + ' ' + getComputedStyle(r).fill; f[k] = (f[k] || 0) + 1; } }); return f; });
  console.log(JSON.stringify({ before: info.f, tip, after }));
  await ctx.close(); await b.close();
})();
