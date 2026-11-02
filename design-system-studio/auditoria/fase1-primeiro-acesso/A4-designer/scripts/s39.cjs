const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open(1440, 900, { nosave: true, fresh: true });
  await page.goto(BASE, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
  const cols = await page.evaluate(() => { const labels=[...document.querySelectorAll('main *')].filter(e=>/^\d · /.test((e.innerText||'').trim()) && e.children.length===0); return labels.map(l=>{ const col=l.parentElement; const kids=[...col.children].map(k=>`${k.tagName}:"${k.innerText.slice(0,18)}"@${Math.round(k.getBoundingClientRect().top)} h${Math.round(k.getBoundingClientRect().height)}`); return kids.join(' | '); }); });
  console.log(cols.join('\n'));
  await page.screenshot({ path: C + '45-home-4colunas-zoom.png', clip: { x: 290, y: 900-40, width: 1130, height: 1 } }).catch(()=>{});
  // tool typography inventory
  const inv = await page.evaluate(() => { const m={}; document.querySelectorAll('body *').forEach(e=>{ if(e.children.length===0 && (e.innerText||'').trim()){ const s=getComputedStyle(e); const k=s.fontSize+'/'+s.fontWeight; m[k]=(m[k]||0)+1; } }); return Object.entries(m).sort((a,b)=>parseFloat(b[0])-parseFloat(a[0])); });
  console.log('home type sizes', JSON.stringify(inv));
  const prim = await page.evaluate(() => { const b=[...document.querySelectorAll('button')].find(x=>x.innerText.includes('Começar no modo guiado')); const s=getComputedStyle(b); return {bg:s.backgroundColor, color:s.color, radius:s.borderRadius, h:b.getBoundingClientRect().height, ff:s.fontFamily.slice(0,30)}; });
  console.log('tool primary', JSON.stringify(prim));
  // disabled continue button contrast on guided objective
  await page.goto(BASE + '#/guiado/objetivo', { waitUntil: 'networkidle' }); await page.getByText('Aplicativo ou SaaS').first().waitFor(); await page.waitForTimeout(600);
  const dis = await page.evaluate(() => { const b=document.querySelector('[data-testid=guided-next]'); const s=getComputedStyle(b); return {bg:s.backgroundColor, color:s.color, opacity:s.opacity, disabled:b.disabled}; });
  console.log('disabled next', JSON.stringify(dis));
  await page.screenshot({ path: C + '46-botao-desabilitado.png', clip: { x: 900, y: 840, width: 520, height: 56 } });
  console.log('LOGS', logs.join('\n'));
  await close();
})();
