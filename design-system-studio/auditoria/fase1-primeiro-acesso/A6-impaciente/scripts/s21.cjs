const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes',{waitUntil:'networkidle'});
  let t=Date.now();
  await page.getByRole('button',{name:/Continuar: Entrega/}).click();
  await page.waitForTimeout(500); await page.waitForLoadState('networkidle');
  const tClick=Date.now()-t;
  await L.snap(page,'21-entrega');
  await L.snap(page,'21-entrega-full',true);
  const i=await L.info(page);
  console.log(JSON.stringify({tClick,url:i.url,h:i.h}));
  const tx=i.text; const k=Math.max(0,tx.indexOf('Etapa '));
  console.log('---TEXT---\n'+tx.slice(k, k+3000));
  console.log('---CTRLS---\n'+i.ctrls.filter(c=>!/^BUTTON "\d+\./.test(c)).slice(0,40).join('\n'));
  console.log('LOGS',page._logs);
  await ctx.close();
})();
