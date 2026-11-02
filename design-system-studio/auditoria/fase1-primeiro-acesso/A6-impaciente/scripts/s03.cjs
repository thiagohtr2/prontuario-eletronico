const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/prompt',{waitUntil:'networkidle'});
  // auditor-only: capture zero-effort prompt text
  const pre = await page.evaluate(()=>{const p=[...document.querySelectorAll('pre,code,textarea')].sort((a,b)=>b.innerText.length-a.innerText.length)[0]; return p? (p.value||p.innerText):''});
  L.fs.writeFileSync(L.path.join(L.BASE,'exportados','00-master-prompt-zero-decisoes.md'), pre);
  console.log('prompt len', pre.length);
  let t=Date.now();
  await page.getByRole('link',{name:'Defina o tipo de projeto.'}).click();
  await page.waitForTimeout(300); await page.waitForLoadState('networkidle');
  const tClick=Date.now()-t;
  await L.snap(page,'03-objetivo');
  await L.snap(page,'03-objetivo-full',true);
  const i=await L.info(page);
  console.log(JSON.stringify({tClick,url:i.url,h:i.h}));
  console.log('---TEXT---\n'+i.text.slice(0,8000));
  console.log('---CTRLS---\n'+i.ctrls.join('\n'));
  console.log('LOGS',page._logs);
  await ctx.close();
})();
