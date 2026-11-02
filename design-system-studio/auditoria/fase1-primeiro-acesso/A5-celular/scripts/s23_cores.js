const L = require('./lib');
const sy = p => p.evaluate(() => Math.round(scrollY));
(async () => {
  const { ctx, page } = await L.open('perfil', 'android');
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('altura', await page.evaluate(() => document.documentElement.scrollHeight));
  await L.shot(page, '43-passo7-identidade-topo');
  await L.shot(page, '43-passo7-identidade-inteira', true);
  const t = await L.text(page, 40000); const i = t.indexOf('Etapa 7'); console.log(t.slice(i, i + 2200));
  const m = await L.measure(page);
  console.log('small', JSON.stringify(m.filter(x => x.small && x.y > 0).slice(0, 30)));
  console.log('inputs', JSON.stringify(m.filter(x => /input|select|textarea/.test(x.tag)).map(x => x.type + ':' + x.txt + ' fs=' + x.fs + ' ' + x.w + 'x' + x.h + ' y=' + x.y)));
  console.log('FONTS', JSON.stringify(await L.fonts(page)));
  console.log('OVERFLOW', JSON.stringify(await L.overflow(page)));
  await ctx.close();
})();
