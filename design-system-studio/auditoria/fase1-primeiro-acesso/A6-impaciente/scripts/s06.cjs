const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo',{waitUntil:'networkidle'});
  let t=Date.now();
  await page.getByRole('button',{name:/Continuar: Entrada/}).click();
  await page.waitForTimeout(400); await page.waitForLoadState('networkidle');
  const tClick=Date.now()-t;
  await L.snap(page,'06-entrada');
  await L.snap(page,'06-entrada-full',true);
  const top = await page.evaluate(()=>document.querySelector('header')?.innerText.replace(/\n/g,' | '));
  const i=await L.info(page);
  console.log(JSON.stringify({tClick,url:i.url,h:i.h, top}));
  console.log('---TEXT---\n'+i.text.slice(0,7000));
  console.log('---CTRLS---\n'+i.ctrls.filter(c=>!/^BUTTON "\d+\./.test(c)).join('\n'));
  console.log('LOGS',page._logs);
  await ctx.close();
})();
