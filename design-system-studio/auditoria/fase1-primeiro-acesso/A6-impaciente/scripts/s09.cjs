const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada',{waitUntil:'networkidle'});
  let t=Date.now();
  await page.getByRole('tab',{name:'Login'}).click();
  await page.waitForTimeout(400);
  const tClick=Date.now()-t;
  await L.snap(page,'09-login-tab');
  const i=await L.info(page);
  console.log(JSON.stringify({tClick,url:i.url,h:i.h}));
  const tx=i.text; const k=tx.indexOf('Cadastro\n');
  console.log('---TEXT---\n'+tx.slice(k, k+2500));
  console.log('---CTRLS---\n'+i.ctrls.filter(c=>!/^BUTTON "\d+\./.test(c)).slice(0,40).join('\n'));
  const rec = await page.evaluate(()=>(document.querySelector('main').innerText.match(/recomend\w*|sugest\w*|padrão/gi)||[]));
  console.log('recommend words:',rec);
  await ctx.close();
})();
