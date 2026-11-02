const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  // auditor-only checkpoint: prompt after skeleton
  const p2 = await ctx.newPage();
  await p2.goto('http://127.0.0.1:4300/#/prompt',{waitUntil:'networkidle'});
  const pre = await p2.evaluate(()=>{const p=[...document.querySelectorAll('pre,code,textarea')].sort((a,b)=>b.innerText.length-a.innerText.length)[0]; return p? (p.value||p.innerText):''});
  const stats = await p2.evaluate(()=>{const m=document.querySelector('main').innerText; return m.slice(m.indexOf('itens no Master')-4, m.indexOf('Master Prompt\nItens'))});
  L.fs.writeFileSync(L.path.join(L.BASE,'exportados','01-checkpoint-apos-esqueleto.md'), pre);
  console.log('checkpoint len',pre.length,'\n',stats);
  await p2.close();
  await page.goto('http://127.0.0.1:4300/#/guiado/preview',{waitUntil:'networkidle'});
  let t=Date.now();
  await page.getByRole('button',{name:/Continuar: Cores/}).click();
  await page.waitForTimeout(500); await page.waitForLoadState('networkidle');
  const tClick=Date.now()-t;
  await L.snap(page,'18-cores');
  await L.snap(page,'18-cores-full',true);
  const i=await L.info(page);
  console.log(JSON.stringify({tClick,url:i.url,h:i.h}));
  const tx=i.text; const k=Math.max(0,tx.indexOf('Etapa '));
  console.log('---TEXT---\n'+tx.slice(k, k+3500));
  console.log('---CTRLS---\n'+i.ctrls.filter(c=>!/^BUTTON "\d+\./.test(c)).slice(0,60).join('\n'));
  const st = await page.evaluate(()=>{const b=[...document.querySelectorAll('main button')].find(b=>/^Continuar/.test(b.innerText.trim())); return {txt:b?.innerText,dis:b?.disabled}});
  console.log(st,'LOGS',page._logs);
  await ctx.close();
})();
