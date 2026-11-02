const L = require('./lib');
const sy = p => p.evaluate(() => Math.round(scrollY));
(async () => {
  const { ctx, page } = await L.open('perfil', 'android');
  await page.goto('http://127.0.0.1:4300/#/guiado/revisao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  L.log('A45 tocar "Aprovar esqueleto e continuar"');
  await page.locator('.gd-footer').getByRole('button', { name: /Aprovar esqueleto/ }).tap(); await page.waitForTimeout(1800);
  console.log('URL', page.url(), 'altura', await page.evaluate(() => document.documentElement.scrollHeight));
  await L.shot(page, '39-passo6-previa-integrada-topo');
  await L.shot(page, '39-passo6-previa-integrada-inteira', true);
  const t = await L.text(page, 30000); const i = t.indexOf('Etapa 6'); console.log(t.slice(i, i + 1800));
  console.log('footer', await page.locator('.gd-footer').innerText().catch(() => 'sem footer'));
  const m = await L.measure(page); console.log('small', JSON.stringify(m.filter(x => x.small && x.y > 0)));
  console.log('OVERFLOW', JSON.stringify(await L.overflow(page)));
  console.log('FONTS', JSON.stringify(await L.fonts(page)));
  await ctx.close();
})();
