const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada',{waitUntil:'networkidle'});
  // Diego tries the disabled continue button
  await page.mouse.click(1310,868); await page.waitForTimeout(300);
  console.log('after disabled click url', page.url());
  let t=Date.now();
  await page.getByRole('tab',{name:'Landing page'}).click();
  await page.waitForTimeout(400);
  const tClick=Date.now()-t;
  await L.snap(page,'07-landing-tab');
  await L.snap(page,'07-landing-tab-full',true);
  const i=await L.info(page);
  console.log(JSON.stringify({tClick,url:i.url,h:i.h}));
  console.log('---TEXT---\n'+i.text.slice(0,7000));
  console.log('---CTRLS---\n'+i.ctrls.filter(c=>!/^BUTTON "\d+\./.test(c)).join('\n'));
  console.log('LOGS',page._logs);
  await ctx.close();
})();
