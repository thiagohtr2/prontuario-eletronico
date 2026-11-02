const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/componentes', { waitUntil: 'networkidle' }); await page.getByText('Escolha pelos olhos.').first().waitFor(); await page.waitForTimeout(1000);
  // measure the Apple Precision button stage in gallery (actual button element)
  const m = await page.evaluate(() => { const t=[...document.querySelectorAll('main *')].find(e=>(e.innerText||'').trim()==='8. Apple Precision' && e.children.length===0); let card=t; for(let i=0;i<8;i++){ card=card.parentElement; if(card.innerText.includes('Adicionar ao projeto') && card.innerText.includes('Começar agora')) break; } const els=[...card.querySelectorAll('*')].filter(e=>(e.innerText||'').trim().toLowerCase()==='começar agora'); const b=els.map(e=>{ let x=e; while(x && getComputedStyle(x).backgroundColor==='rgba(0, 0, 0, 0)') x=x.parentElement; return x; })[0]; const s=getComputedStyle(b); const inner=getComputedStyle(els[els.length-1]); return {tag:b.tagName, radius:s.borderRadius, h:b.getBoundingClientRect().height, pad:s.padding, bg:s.backgroundColor, ff:inner.fontFamily.slice(0,60), fs:inner.fontSize, fw:inner.fontWeight}; });
  console.log(JSON.stringify(m));
  const np = await page.evaluate(() => { const t=document.querySelector('main').innerText; const i=t.lastIndexOf('No projeto'); return t.slice(i, i+400); });
  console.log('NOPROJ', np);
  await page.getByRole('button', { name: /Continuar: Entrega/ }).click();
  await page.waitForTimeout(2000);
  console.log(page.url());
  await page.screenshot({ path: C + '40-entrega-viewport.png' });
  await page.screenshot({ path: C + '40-entrega-full.png', fullPage: true });
  await dump(page, 5000);
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
