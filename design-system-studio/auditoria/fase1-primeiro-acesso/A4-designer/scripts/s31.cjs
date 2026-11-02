const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/navegacao', { waitUntil: 'networkidle' }); await page.getByText('Headers (36)').first().waitFor(); await page.waitForTimeout(800);
  await page.locator('main').getByText('Sidebars (36)').click(); await page.waitForTimeout(1000);
  await page.locator('main button').filter({ hasText: /^Compactas\s*6$/ }).click(); await page.waitForTimeout(800);
  const titles = await page.evaluate(() => [...document.querySelectorAll('main button')].filter(b=>b.innerText.trim()==='Selecionar').map(b=>{ let p=b; for(let i=0;i<4;i++) p=p.parentElement; return p.innerText.split('\n').slice(0,3).join(' / '); }));
  console.log(titles.join('\n'));
  const sel = page.locator('main').getByText('Selecionar', { exact: true }).first();
  await sel.scrollIntoViewIfNeeded(); await page.evaluate(() => scrollBy(0, -420)); await page.waitForTimeout(400);
  await page.screenshot({ path: C + '35-sidebar-compacta.png' });
  await sel.click(); await page.waitForTimeout(800);
  const chips = await page.evaluate(() => [...document.querySelectorAll('main *')].filter(e=>e.children.length<=2 && /^(Header|Sidebar):/.test((e.innerText||'').trim())).map(e=>e.innerText.trim()).slice(1,3));
  console.log(chips);
  // Combinação tab
  await page.evaluate(() => scrollTo(0, 0));
  await page.getByRole('tab', { name: 'Combinação' }).click(); await page.waitForTimeout(1200);
  const cmb = await page.locator('main').getByText('Combinação').first(); 
  await page.evaluate(() => scrollTo(0, 520)); await page.waitForTimeout(400);
  await page.screenshot({ path: C + '36-combinacao.png' });
  const t = await page.evaluate(() => document.querySelector('main').innerText); const i=t.indexOf('Combinação'); console.log(t.slice(i, i+1200));
  console.log('LOGS', logs.join('\n'));
  await close();
})();
