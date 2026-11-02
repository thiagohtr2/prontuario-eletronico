const L = require('./lib');
const sy = p => p.evaluate(() => Math.round(scrollY));
(async () => {
  const { ctx, page } = await L.open('perfil', 'android');
  await page.goto('http://127.0.0.1:4300/#/guiado/desktop', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  L.log('A31 tocar "Continuar: Mobile"');
  await page.getByRole('button', { name: /Continuar: Mobile/ }).tap(); await page.waitForTimeout(1500);
  console.log('URL', page.url(), 'scroll', await sy(page), 'height', await page.evaluate(() => document.documentElement.scrollHeight));
  await L.shot(page, '27-passo4-mobile-topo');
  await L.shot(page, '27-passo4-mobile-inteira', true);
  const t = await L.text(page, 30000); const i = t.indexOf('Etapa 4'); console.log(t.slice(i, i + 3000));
  console.log('footer', await page.locator('.gd-footer').innerText());
  const m = await L.measure(page); console.log('small', JSON.stringify(m.filter(x => x.small && x.y > 0).slice(0, 20)));
  console.log('FONTS', JSON.stringify(await L.fonts(page)));
  console.log('OVERFLOW', JSON.stringify(await L.overflow(page)));
  await ctx.close();
})();
