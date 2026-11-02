const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/identidade', { waitUntil: 'networkidle' }); await page.getByText('Prévia da identidade').first().waitFor(); await page.waitForTimeout(800);
  await page.getByRole('tab', { name: 'Formas e superfícies' }).click(); await page.waitForTimeout(800);
  const clk = async (re) => { await page.locator('main button[aria-pressed]').filter({ hasText: re }).first().click(); await page.waitForTimeout(350); };
  await clk(/^Grandes \(14 px\)$/); await clk(/^Elevada \(sombras\)$/); await clk(/^Sutil$/);
  await page.waitForTimeout(600);
  const pv = await page.evaluate(() => { const all=[...document.querySelectorAll('main *')]; const f=(t)=>all.find(e=>e.innerText && e.innerText.trim()===t && [...e.children].every(c=>(c.innerText||'').trim()!==t)); const st=(e)=>{ if(!e) return null; const s=getComputedStyle(e); return {radius:s.borderRadius, shadow:s.boxShadow.slice(0,80), border:s.borderTopWidth+' '+s.borderTopColor, bg:s.backgroundColor, h:Math.round(e.getBoundingClientRect().height)}; }; const up=(e)=>{ let c=e; for(let i=0;i<5&&c;i++){ c=c.parentElement; if(c && getComputedStyle(c).borderRadius!=='0px') return c; } return null; }; const r={}; const p=f('Primário'); r.btn=st(p&&(p.closest('button')||p)); const inp=[...document.querySelectorAll('main input')].find(i=>(i.placeholder||'').startsWith('Placeholder')); r.input=st(inp); const pr=f('Pedidos recentes'); r.card=st(pr&&up(pr)); const bl=f('Bruno Lima'); r.selRow=st(bl&&up(bl)); r.badge=st(f('12 novos')); const al=f('Alterações salvas'); r.alert=st(al&&up(al)); return r; });
  console.log(JSON.stringify(pv,null,1));
  await page.evaluate(() => scrollTo(0,0)); await page.waitForTimeout(300);
  await page.screenshot({ path: C + '30-formas-escolhidas.png' });
  await page.screenshot({ path: C + '30b-preview-identidade-final-zoom.png', clip: { x: 960, y: 330, width: 460, height: 500 } });
  console.log('LOGS', logs.join('\n'));
  await close();
})();
