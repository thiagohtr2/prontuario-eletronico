const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open(1440, 900, { ctx: { deviceScaleFactor: 2 }, nosave: true });
  await page.goto(BASE + '#/guiado/entrada', { waitUntil: 'networkidle' }); await page.getByText('Como as pessoas entram').first().waitFor();
  await page.getByRole('tab', { name: 'Landing page' }).click();
  await page.waitForTimeout(1500);
  const cards = page.locator('main button[aria-pressed]').filter({ hasText: /Nexa|Metric Studio|Aurora Flow|Lume Health/ });
  const n = await cards.count(); console.log('n', n);
  for (let i=0;i<n;i++){ const c = cards.nth(i); const t=(await c.innerText()).split('\n')[0].replace(/\W+/g,''); await c.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); await c.screenshot({ path: C + `07-card-${t}.png` }); }
  // measure card structure
  const m = await page.evaluate(() => { const b=[...document.querySelectorAll('main button[aria-pressed]')].find(x=>x.innerText.startsWith('Nexa')); const art = b.parentElement; const r=art.getBoundingClientRect(); const thumb=b.getBoundingClientRect(); return {card: [r.width, r.height], thumb:[thumb.width, thumb.height], parentClass: art.className, gridGap: getComputedStyle(art.parentElement).gap, cols: getComputedStyle(art.parentElement).gridTemplateColumns}; });
  console.log(JSON.stringify(m));
  await close();
})();
