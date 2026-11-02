const L = require('./lib');
const sy = p => p.evaluate(() => Math.round(scrollY));
(async () => {
  const { ctx, page } = await L.open('perfil', 'android');
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  L.log('A35 arrastar o dedo até o celular grande (2x)');
  await L.swipe(page, 180, 700, 150); await L.swipe(page, 180, 700, 250);
  console.log('scroll', await sy(page));
  await L.shot(page, '31-mobile-celular-grande');
  const inner = await page.evaluate(() => { const hint = [...document.querySelectorAll('p,div,span')].find(x => /Toque nos botões do celular/.test(x.textContent) && x.children.length < 3); let root = hint?.parentElement; const btns = root ? [...root.querySelectorAll('button')] : []; return btns.map(b => { const r = b.getBoundingClientRect(); return { t: (b.getAttribute('aria-label') || b.innerText).trim().replace(/\s+/g, ' ').slice(0, 30), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), fs: getComputedStyle(b).fontSize }; }).filter(o => o.w > 0); });
  console.log('BOTOES no celular grande', JSON.stringify(inner));
  const fab = inner.find(b => /novo|adicionar|criar|\+|ação/i.test(b.t)) || inner.find(b => /Agenda/i.test(b.t));
  console.log('alvo', JSON.stringify(fab));
  if (fab) { L.log('A36 tocar botão dentro do celular grande: ' + fab.t); await page.touchscreen.tap(fab.x + fab.w / 2, fab.y + fab.h / 2); await page.waitForTimeout(900); }
  await L.shot(page, '32-mobile-celular-grande-apos-toque');
  console.log('scroll', await sy(page));
  await ctx.close();
})();
