const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/navegacao', { waitUntil: 'networkidle' }); await page.getByText('Headers (36)').first().waitFor(); await page.waitForTimeout(800);
  await page.getByRole('tab', { name: 'Combinação' }).click(); await page.waitForTimeout(1200);
  const bgs = await page.evaluate(() => { const hb=document.querySelector('main .nvs-hbar'); const out={header: hb?getComputedStyle(hb).backgroundColor:'?'}; const cands=[...document.querySelectorAll('main aside, main nav, main [class*=side], main [class*=rail]')].filter(e=>e.getBoundingClientRect().width>40 && e.getBoundingClientRect().width<120 && e.getBoundingClientRect().height>200); out.side=cands.slice(0,3).map(e=>e.className.toString().slice(0,40)+' '+getComputedStyle(e).backgroundColor+' w='+Math.round(e.getBoundingClientRect().width)); return out; });
  console.log(JSON.stringify(bgs));
  await page.getByRole('button', { name: /Continuar: Componentes/ }).click();
  await page.waitForTimeout(1800);
  console.log(page.url());
  await page.screenshot({ path: C + '37-componentes-viewport.png' });
  await page.screenshot({ path: C + '37-componentes-full.png', fullPage: true });
  console.log('H', await page.evaluate(() => document.documentElement.scrollHeight));
  await dump(page, 3500);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
