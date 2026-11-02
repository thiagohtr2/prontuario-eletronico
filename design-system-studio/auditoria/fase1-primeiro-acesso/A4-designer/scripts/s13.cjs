const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/desktop', { waitUntil: 'networkidle' }); await page.getByText('Arquitetura do computador').first().waitFor(); await page.waitForTimeout(800);
  const opt = page.locator('main [aria-pressed], main [role=radio]').filter({ hasText: 'Painel financeiro com rail' });
  console.log('count', await opt.count());
  await opt.first().scrollIntoViewIfNeeded();
  await opt.first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: C + '15-desktop-painel-financeiro.png' });
  const aside = await page.evaluate(() => { const els=[...document.querySelectorAll('main aside, main [class*=sticky], main [class*=preview]')]; return els.map(e=>e.className+' :: '+e.innerText.replace(/\s+/g,' ').slice(0,600)).slice(0,4).join('\n'); });
  console.log(aside);
  console.log('btn', await page.evaluate(() => document.querySelector('[data-testid=guided-next]')?.innerText + ' disabled=' + document.querySelector('[data-testid=guided-next]')?.disabled));
  console.log('LOGS', logs.join('\n'));
  await close();
})();
