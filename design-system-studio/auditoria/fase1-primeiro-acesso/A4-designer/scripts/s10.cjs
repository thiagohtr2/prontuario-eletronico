const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/entrada', { waitUntil: 'networkidle' }); await page.getByText('Como as pessoas entram').first().waitFor();
  await page.getByRole('tab', { name: 'Landing page' }).click();
  await page.waitForTimeout(1000);
  await page.locator('main').getByRole('button', { name: 'Ver prévia' }).first().click();
  await page.waitForTimeout(1200);
  const dlg = page.locator('[role=dialog]');
  // find scroll container inside dialog
  const info = await page.evaluate(() => { const d=document.querySelector('[role=dialog]'); const sc=[...d.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+20 && ['auto','scroll'].includes(getComputedStyle(e).overflowY)); return sc.map(e=>e.className+' '+e.scrollHeight+'/'+e.clientHeight); });
  console.log('scrollers', info);
  await dlg.getByRole('button', { name: 'Cores do modelo' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: C + '10-preview-nexa-cores-modelo.png' });
  // scroll inner preview
  for (const [i,y] of [[1,700],[2,1600],[3,2600]]) {
    await page.evaluate((y) => { const d=document.querySelector('[role=dialog]'); const sc=[...d.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+20 && ['auto','scroll'].includes(getComputedStyle(e).overflowY)); sc.forEach(s=>s.scrollTop=y); }, y);
    await page.waitForTimeout(400);
    await page.screenshot({ path: C + `10-preview-nexa-scroll${i}.png` });
  }
  await dlg.getByRole('button', { name: 'Celular' }).click();
  await page.waitForTimeout(1000);
  await page.evaluate(() => { const d=document.querySelector('[role=dialog]'); [...d.querySelectorAll('*')].forEach(s=>{ if(s.scrollTop) s.scrollTop=0; }); });
  await page.screenshot({ path: C + '11-preview-nexa-celular.png' });
  const mob = await page.evaluate(() => { const d=document.querySelector('[role=dialog]'); const f=[...d.querySelectorAll('iframe,[class*=frame],[class*=device],[class*=phone],[class*=mobile]')].map(e=>e.tagName+'.'+e.className+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height)); return f.slice(0,10); });
  console.log('mobile frame', mob);
  // switch back to my identity, keep toggle off
  await dlg.getByRole('button', { name: 'Minha identidade' }).click();
  await page.waitForTimeout(300);
  await dlg.getByRole('button', { name: 'Fechar' }).click();
  console.log('LOGS', logs.join('\n'));
  await close();
})();
