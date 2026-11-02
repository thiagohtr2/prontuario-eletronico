const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  let t=Date.now();
  await page.goto('http://127.0.0.1:4300/',{waitUntil:'networkidle'});
  const tLoad=Date.now()-t;
  t=Date.now();
  await page.getByRole('button',{name:'Master Prompt'}).first().click();
  await page.waitForTimeout(300); await page.waitForLoadState('networkidle');
  const tClick=Date.now()-t;
  await L.snap(page,'02-master-prompt-direto');
  await L.snap(page,'02-master-prompt-direto-full',true);
  const i=await L.info(page,{onlyMain:false});
  console.log(JSON.stringify({tLoad,tClick,url:i.url,h:i.h}));
  console.log('---TEXT---\n'+i.text.slice(0,6000));
  console.log('---CTRLS---\n'+i.ctrls.filter(c=>!/@12,/.test(c)).join('\n'));
  console.log('LOGS',page._logs);
  await ctx.close();
})();
