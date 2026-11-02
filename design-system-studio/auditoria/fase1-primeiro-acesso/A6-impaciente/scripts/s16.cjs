const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile',{waitUntil:'networkidle'});
  let t=Date.now();
  await page.getByRole('button',{name:/Continuar: Revisão/}).click();
  await page.waitForTimeout(400); await page.waitForLoadState('networkidle');
  const tClick=Date.now()-t;
  await L.snap(page,'16-revisao');
  await L.snap(page,'16-revisao-full',true);
  const top = await page.evaluate(()=>document.querySelector('header')?.innerText.replace(/\n/g,' | '));
  const i=await L.info(page);
  console.log(JSON.stringify({tClick,url:i.url,h:i.h,top}));
  const tx=i.text; const k=tx.indexOf('Etapa 5');
  console.log('---TEXT---\n'+tx.slice(k, k+4000));
  console.log('---CTRLS---\n'+i.ctrls.filter(c=>!/^BUTTON "\d+\./.test(c)).slice(0,40).join('\n'));
  console.log('LOGS',page._logs);
  await ctx.close();
})();
