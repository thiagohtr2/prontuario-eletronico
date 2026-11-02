const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Topbar com Bottom Navigation\./ }).click();
  await page.waitForTimeout(700);
  await shot(page, '12-mobile-selecionado');
  const d = page.getByRole('dialog');
  console.log('dialogs', await d.count());
  if (await d.count()) { console.log((await d.first().ariaSnapshot()).slice(0, 3000)); await shot(page, '12-mobile-dialog'); }
  const c = page.getByRole('complementary', { name: /Detalhes/ });
  if (await c.count()) console.log('ASIDE:', await c.first().innerText());
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
