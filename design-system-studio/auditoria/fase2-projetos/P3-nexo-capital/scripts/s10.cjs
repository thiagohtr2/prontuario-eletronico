const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Drawer pela esquerda\./ }).click();
  await page.waitForTimeout(700);
  const snap = await page.locator('main').ariaSnapshot();
  console.log(snap.split('\n').slice(snap.split('\n').findIndex(l => l.includes('One Screen com painel em abas'))+1).join('\n'));
  await page.screenshot({ path: W + '/scripts/tmp-13.png' });
  await ctx.close();
})();
