const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  const art = page.locator('main article[aria-label="Trilha de Contexto"]');
  await art.scrollIntoViewIfNeeded();
  await art.getByRole('button', { name: 'Composição B' }).click();
  await page.waitForTimeout(300);
  console.log('COMP B text:', (await art.locator('p').last().innerText()).slice(0, 400));
  await art.getByRole('button', { name: /Selecionar$/ }).click();
  await page.waitForTimeout(500);
  await art.screenshot({ path: require('./lib.cjs').W + '/capturas/23-header-trilha-contexto.png' });
  await page.getByRole('tab', { name: /Sidebars/ }).click();
  await page.waitForTimeout(500);
  const g = page.locator('main [role=group][aria-label^="Filtrar sidebars"]');
  if (await g.count()) console.log('FILTERS:', (await g.innerText()).replace(/\n/g,' | '));
  const arts = page.locator('main article');
  const n = await arts.count();
  for (let i = 0; i < n; i++) {
    const name = await arts.nth(i).getAttribute('aria-label');
    const sel = arts.nth(i).getByRole('button', { name: /Selecionar$/ });
    const t = (await sel.count()) ? (await sel.first().getAttribute('aria-label') || await sel.first().innerText()) : '';
    console.log(i, name, '|', t.replace(/\n/g,' ').slice(0, 200));
  }
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
