const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Combinação' }).click();
  await page.waitForTimeout(500);
  const before = await page.evaluate(() => localStorage.getItem('atelier-ui:studio:v1').length);
  await page.getByRole('button', { name: 'Sidebar inteira' }).click();
  await page.waitForTimeout(700);
  const after = await page.evaluate(() => localStorage.getItem('atelier-ui:studio:v1').length);
  console.log('LS len before/after', before, after);
  const s2 = await page.locator('#conteudo').ariaSnapshot();
  const l2 = s2.split('\n'); const j = l2.findIndex(l => l.includes('Navegação nos dois')); console.log(l2.slice(j, j + 8).join('\n'));
  // capture combination preview
  const grp = page.getByRole('group', { name: 'Arranjo da prévia' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#conteudo').getByText('Arranjo da prévia').first().scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 250);
  await page.waitForTimeout(500);
  await page.screenshot({ path: W + '/capturas/10-header-sidebar-combinacao-sidebar-inteira.png' });
  // reload and check persistence of arrangement
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Combinação' }).click();
  await page.waitForTimeout(500);
  console.log('after reload pressed:', await page.getByRole('button', { name: 'Sidebar inteira' }).getAttribute('aria-pressed'));
  await ctx.close();
})();
