const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/desktop', { waitUntil: 'networkidle' }); await page.getByText('Arquitetura do computador').first().waitFor(); await page.waitForTimeout(800);
  // measure preview proportions
  const m = await page.evaluate(() => { const p=document.querySelector('.lay-detail__preview'); if(!p) return 'nopreview'; const r=p.getBoundingClientRect(); const kids=[...p.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e); return e.children.length>0 && e.getBoundingClientRect().width>10;}).slice(0,12).map(e=>{const b=e.getBoundingClientRect(); return e.className.toString().slice(0,40)+' '+Math.round(b.width)+'x'+Math.round(b.height);}); return 'preview '+Math.round(r.width)+'x'+Math.round(r.height)+'\n'+kids.join('\n'); });
  console.log(m);
  await page.getByRole('button', { name: /Continuar: Mobile/ }).click();
  await page.waitForTimeout(1500);
  console.log(page.url());
  await page.screenshot({ path: C + '16-mobile-viewport.png' });
  await page.screenshot({ path: C + '16-mobile-full.png', fullPage: true });
  await dump(page, 3000);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
