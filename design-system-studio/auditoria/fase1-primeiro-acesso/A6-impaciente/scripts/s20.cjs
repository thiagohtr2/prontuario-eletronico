const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao',{waitUntil:'networkidle'});
  let t=Date.now();
  await page.getByRole('button',{name:/Continuar: Componentes/}).click();
  await page.waitForTimeout(500); await page.waitForLoadState('networkidle');
  const tClick=Date.now()-t;
  await L.snap(page,'20-componentes');
  await L.snap(page,'20-componentes-full',true);
  const i=await L.info(page);
  console.log(JSON.stringify({tClick,url:i.url,h:i.h}));
  const tx=i.text; const k=Math.max(0,tx.indexOf('Etapa '));
  console.log('---TEXT---\n'+tx.slice(k, k+2500));
  console.log('---CTRLS---\n'+i.ctrls.filter(c=>!/^BUTTON "\d+\./.test(c)).slice(0,40).join('\n'));
  const st = await page.evaluate(()=>{const b=[...document.querySelectorAll('main button')].find(b=>/^Continuar|^Ir para|Master Prompt/.test(b.innerText.trim())); return {txt:b?.innerText,dis:b?.disabled}});
  console.log(st,'LOGS',page._logs);
  await ctx.close();
})();
