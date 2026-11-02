const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/mobile', { waitUntil: 'networkidle' }); await page.getByText('Arquitetura do celular').first().waitFor(); await page.waitForTimeout(800);
  const opt = page.locator('main [aria-pressed], main [role=radio]').filter({ hasText: 'Topbar com Bottom Navigation' });
  console.log('count', await opt.count());
  await opt.first().scrollIntoViewIfNeeded(); await opt.first().click(); await page.waitForTimeout(1000);
  await page.screenshot({ path: C + '17-mobile-escolhido.png' });
  const d = await page.evaluate(() => document.querySelector('.lay-mob-detail, [class*=detail]')?.innerText.replace(/\s+/g,' ').slice(0,700));
  console.log(d);
  await page.getByRole('button', { name: /Continuar: Revisão/ }).click();
  await page.waitForTimeout(1500);
  console.log(page.url());
  await page.screenshot({ path: C + '18-revisao-full.png', fullPage: true });
  await dump(page, 3500);
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
