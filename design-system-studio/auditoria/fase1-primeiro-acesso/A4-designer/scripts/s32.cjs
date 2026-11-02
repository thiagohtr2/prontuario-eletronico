const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/navegacao', { waitUntil: 'networkidle' }); await page.getByText('Headers (36)').first().waitFor(); await page.waitForTimeout(800);
  await page.locator('main').getByText('Sidebars (36)').click(); await page.waitForTimeout(1000);
  await page.locator('main button').filter({ hasText: /^Compactas\s*6$/ }).click(); await page.waitForTimeout(800);
  // the select button within the first card
  const btn = page.locator('main button').filter({ has: page.locator('strong', { hasText: /^Selecionar$/ }) }).first();
  console.log('btn count', await page.locator('main button').filter({ has: page.locator('strong', { hasText: /^Selecionar$/ }) }).count());
  await btn.scrollIntoViewIfNeeded(); await page.evaluate(() => scrollBy(0, -380)); await page.waitForTimeout(400);
  await page.screenshot({ path: C + '35-sidebar-trilho.png' });
  await btn.click(); await page.waitForTimeout(900);
  const chips = await page.evaluate(() => [...document.querySelectorAll('main *')].filter(e=>e.children.length<=2 && /^(Header|Sidebar):/.test((e.innerText||'').trim())).map(e=>e.innerText.trim()).slice(1,3));
  console.log(chips);
  await page.evaluate(() => scrollTo(0, 0));
  await page.getByRole('tab', { name: 'Combinação' }).click(); await page.waitForTimeout(1200);
  await page.evaluate(() => scrollTo(0, 540)); await page.waitForTimeout(400);
  await page.screenshot({ path: C + '36-combinacao.png' });
  console.log('LOGS', logs.join('\n'));
  await close();
})();
