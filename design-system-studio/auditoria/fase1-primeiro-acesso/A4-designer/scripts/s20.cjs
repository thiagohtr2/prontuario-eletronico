const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open(1440,900,{nosave:true});
  await page.goto(BASE + '#/guiado/identidade', { waitUntil: 'networkidle' }); await page.getByText('Prévia da identidade').first().waitFor(); await page.waitForTimeout(800);
  await page.getByRole('tab', { name: 'Ajustar cores' }).click(); await page.waitForTimeout(800);
  const toks = await page.evaluate(() => [...document.querySelectorAll('main input')].map(i => `${i.type} ${i.getAttribute('aria-label')||i.name||''} = ${i.value}`).join('\n'));
  console.log(toks);
  await page.evaluate(() => scrollTo(0, 300));
  await page.waitForTimeout(300);
  await page.screenshot({ path: C + '25b-ajustar-cores-viewport.png' });
  await close();
})();
