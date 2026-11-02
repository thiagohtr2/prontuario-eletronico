const { open, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open(1440,900,{nosave:true});
  await page.goto(BASE + '#/guiado/navegacao', { waitUntil: 'networkidle' }); await page.getByText('Headers (36)').first().waitFor(); await page.waitForTimeout(800);
  await page.locator('main').getByText('Sidebars (36)').click(); await page.waitForTimeout(1000);
  const h = await page.evaluate(() => { const e=[...document.querySelectorAll('main *')].find(x=>x.children.length<=2 && (x.innerText||'').trim()==='Selecionar'); return e ? e.outerHTML.slice(0,400) : 'none'; });
  console.log(h);
  await page.locator('main button').filter({ hasText: /^Compactas\s*6$/ }).click(); await page.waitForTimeout(800);
  console.log(await page.evaluate(() => [...document.querySelectorAll('main *')].filter(x=>x.children.length<=2 && (x.innerText||'').trim()==='Selecionar').length));
  console.log(await page.evaluate(() => { const t=document.querySelector('main').innerText; const i=t.indexOf('Compactas'); return t.slice(i, i+600); }));
  await close();
})();
