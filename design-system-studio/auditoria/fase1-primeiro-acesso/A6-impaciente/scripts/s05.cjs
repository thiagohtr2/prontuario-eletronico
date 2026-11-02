const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo',{waitUntil:'networkidle'});
  let t=Date.now();
  await page.getByRole('button',{name:'Usar esta sugestão'}).click();
  await page.waitForTimeout(400);
  const tClick=Date.now()-t;
  await L.snap(page,'05-sugestao-aplicada');
  const top = await page.evaluate(()=>document.querySelector('header')?.innerText);
  const i=await L.info(page);
  console.log(JSON.stringify({tClick,url:i.url,h:i.h, top}));
  console.log('---TEXT (sug area)---\n'+i.text.slice(i.text.indexOf('Outro tipo'), i.text.indexOf('Outro tipo')+800));
  const toasts = await page.evaluate(()=>[...document.querySelectorAll('[role=status],[role=alert],[aria-live]')].map(e=>e.innerText).filter(Boolean));
  console.log('toasts',toasts);
  console.log('LOGS',page._logs);
  await ctx.close();
})();
