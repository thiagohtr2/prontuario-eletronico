const { open, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open(1440, 900, { nosave: true });
  await page.goto(BASE + '#/guiado/entrada', { waitUntil: 'networkidle' }); await page.getByText('Como as pessoas entram').first().waitFor();
  await page.getByRole('tab', { name: 'Landing page' }).click(); await page.waitForTimeout(1200);
  const c = await page.evaluate(() => { const card=[...document.querySelectorAll('main button[aria-pressed]')].find(b=>b.innerText.startsWith('Nexa')); const cta=[...card.querySelectorAll('*')].filter(e=>(e.innerText||'').trim()==='Abrir conta grátis'); return cta.map(e=>{ let x=e; while(x && getComputedStyle(x).backgroundColor==='rgba(0, 0, 0, 0)') x=x.parentElement; const s=getComputedStyle(x); return s.backgroundColor+' '+getComputedStyle(e).fontFamily.split(',')[0]; }); });
  console.log('gallery thumb CTA (Nexa)', c);
  await page.goto(BASE + '#/guiado/preview', { waitUntil: 'networkidle' }); await page.getByText('Escolhas nesta prévia').first().waitFor(); await page.waitForTimeout(1000);
  await page.locator('main').getByRole('button', { name: 'Landing', exact: true }).click(); await page.waitForTimeout(1200);
  await page.screenshot({ path: C + '48-previa-landing-com-identidade-final.png', clip: { x: 280, y: 330, width: 840, height: 570 } });
  const l = await page.evaluate(() => { const h=[...document.querySelectorAll('main *')].find(e=>(e.innerText||'').trim().startsWith('Todo o dinheiro') && e.children.length<=2); const b=[...document.querySelectorAll('main *')].filter(e=>(e.innerText||'').trim()==='Abrir conta grátis').map(e=>{ let x=e; while(x && getComputedStyle(x).backgroundColor==='rgba(0, 0, 0, 0)') x=x.parentElement; return x?getComputedStyle(x).backgroundColor+' r='+getComputedStyle(x).borderRadius:'?'; }); return { h1: h?getComputedStyle(h).fontFamily.split(',')[0]+' '+getComputedStyle(h).fontWeight:'?', cta: b }; });
  console.log('integrated landing', JSON.stringify(l));
  await page.locator('main').getByRole('button', { name: 'Aplicação', exact: true }).click(); await page.waitForTimeout(1200);
  await page.screenshot({ path: C + '49-previa-app-identidade-final.png', clip: { x: 280, y: 330, width: 840, height: 570 } });
  console.log('LOGS', logs.join('\n'));
  await close();
})();
