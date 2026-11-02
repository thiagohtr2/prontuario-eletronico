const { open, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open(1440,900,{nosave:true});
  await page.goto(BASE + '#/guiado/navegacao', { waitUntil: 'networkidle' }); await page.getByText('Headers (36)').first().waitFor(); await page.waitForTimeout(800);
  await page.locator('main').getByText('Sidebars (36)').click(); await page.waitForTimeout(1000);
  const h = await page.evaluate(() => [...document.querySelectorAll('main *')].filter(x=>(x.innerText||'').trim()==='Selecionar').slice(0,6).map(e=>e.tagName+' role='+e.getAttribute('role')+' '+e.outerHTML.slice(0,200)));
  console.log(h.join('\n'));
  await close();
})();
