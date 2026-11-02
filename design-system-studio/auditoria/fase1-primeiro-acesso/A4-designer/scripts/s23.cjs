const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/identidade', { waitUntil: 'networkidle' }); await page.getByText('Prévia da identidade').first().waitFor(); await page.waitForTimeout(800);
  await page.getByRole('tab', { name: 'Tipografia' }).click(); await page.waitForTimeout(1000);
  const fontBtns = page.locator('main button[aria-pressed]').filter({ hasText: 'Space Grotesk' });
  await fontBtns.nth(0).click(); await page.waitForTimeout(400);
  await page.locator('main button[aria-pressed]').filter({ hasText: /^Semi-negrito$/ }).click(); await page.waitForTimeout(800);
  // measure preview
  const pv = await page.evaluate(() => { const f=(t)=>[...document.querySelectorAll('main *')].find(e=>e.children.length===0 && e.innerText && e.innerText.trim()===t); const r={}; for (const t of ['Visão geral','Pedidos recentes','Ana Souza','Primário','Marca','Texto secundário com']) { const e=f(t)||[...document.querySelectorAll('main *')].find(x=>x.innerText&&x.innerText.startsWith(t)&&x.children.length<=1); if(!e) continue; const s=getComputedStyle(e); r[t]={ff:s.fontFamily.slice(0,50),fs:s.fontSize,fw:s.fontWeight,lh:s.lineHeight,ls:s.letterSpacing}; } return r; });
  console.log(JSON.stringify(pv,null,1));
  // check if Space Grotesk font actually loaded
  const loaded = await page.evaluate(async () => { await document.fonts.ready; return { sg: document.fonts.check('600 16px "Space Grotesk"'), list: [...document.fonts].map(f=>f.family+':'+f.status).filter((v,i,a)=>a.indexOf(v)===i).slice(0,20) }; });
  console.log(JSON.stringify(loaded));
  await page.screenshot({ path: C + '28-tipografia-escolhida.png' });
  await page.screenshot({ path: C + '28b-preview-tipografia-zoom.png', clip: { x: 960, y: 330, width: 460, height: 300 } });
  console.log('LOGS', logs.join('\n'));
  await close();
})();
