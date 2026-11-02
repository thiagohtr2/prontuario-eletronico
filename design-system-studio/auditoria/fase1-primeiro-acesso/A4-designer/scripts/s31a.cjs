const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open(1440,900,{nosave:true});
  await page.goto(BASE + '#/guiado/navegacao', { waitUntil: 'networkidle' }); await page.getByText('Headers (36)').first().waitFor(); await page.waitForTimeout(800);
  const tabs = await page.evaluate(() => [...document.querySelectorAll('main [role=tab], main button')].filter(b=>/Sidebars|Headers|Combina/.test(b.innerText)).map(b=>b.tagName+' '+b.getAttribute('role')+' '+b.innerText.trim()+' sel='+b.getAttribute('aria-selected')));
  console.log(tabs);
  await page.locator('main').getByText('Sidebars (36)').click(); await page.waitForTimeout(1200);
  await page.screenshot({ path: C + '35a-sidebars-tab.png' });
  const t = await page.evaluate(() => document.querySelector('main').innerText); const i=t.indexOf('Sidebars (36)'); console.log(t.slice(i, i+1500));
  const btns = await page.evaluate(() => [...new Set([...document.querySelectorAll('main button')].map(b=>b.innerText.trim().replace(/\s+/g,' ')).filter(x=>x && x.length<30))].slice(0,60).join(' | '));
  console.log(btns);
  await close();
})();
