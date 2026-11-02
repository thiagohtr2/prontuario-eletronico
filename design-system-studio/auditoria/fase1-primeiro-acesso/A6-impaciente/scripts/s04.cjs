const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo',{waitUntil:'networkidle'});
  let t=Date.now();
  await page.getByRole('radio',{name:/Aplicativo ou SaaS/}).click();
  await page.waitForTimeout(300);
  const tClick=Date.now()-t;
  await L.snap(page,'04-objetivo-saas');
  const i=await L.info(page);
  console.log(JSON.stringify({tClick,url:i.url,h:i.h}));
  console.log('---TEXT---\n'+i.text.slice(0,5000));
  console.log('---CTRLS (filtered)---\n'+i.ctrls.filter(c=>!/^BUTTON "\d+\./.test(c)).join('\n'));
  console.log('LOGS',page._logs);
  await ctx.close();
})();
