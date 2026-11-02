const L = require('./lib');
const sy = p => p.evaluate(() => Math.round(scrollY));
(async () => {
  const { ctx, page } = await L.open('perfil', 'android');
  await page.goto('http://127.0.0.1:4300/#/modulos/cadastro', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  console.log('guided footer?', await page.locator('.gd-footer').count());
  const cands = await page.evaluate(() => [...document.querySelectorAll('main button, main [role=radio]')].map(b => { const r = b.getBoundingClientRect(); return { t: (b.getAttribute('aria-label') || b.innerText).trim().replace(/\s+/g, ' ').slice(0, 50), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height), p: b.getAttribute('aria-pressed') ?? b.getAttribute('aria-checked') }; }).filter(o => o.w > 0).slice(0, 25));
  for (const c of cands) console.log(JSON.stringify(c));
  await ctx.close();
})();
