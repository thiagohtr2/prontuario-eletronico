const L = require('./lib');
const sy = p => p.evaluate(() => Math.round(scrollY));
(async () => {
  const { ctx, page } = await L.open('perfil', 'android');
  await page.goto('http://127.0.0.1:4300/#/guiado/revisao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  console.log('aprovar desabilitado?', await page.getByRole('button', { name: /Aprovar esqueleto/ }).first().isDisabled());
  L.log('A40 tocar link "Resolver" (17 px de altura)');
  await page.getByRole('link', { name: 'Resolver' }).tap(); await page.waitForTimeout(1500);
  console.log('URL', page.url(), 'scroll', await sy(page), 'aba ativa', await page.locator('[role=tab][aria-selected=true]').innerText().catch(() => '-'));
  await L.shot(page, '35-resolver-leva-para');
  const t = await L.text(page, 30000); const i = t.indexOf('Etapa'); console.log(t.slice(i, i + 1800));
  const m = await L.measure(page); for (const x of m.filter(x => x.y > 300 && x.y < 1800)) console.log(JSON.stringify(x));
  await ctx.close();
})();
