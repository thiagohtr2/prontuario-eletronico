const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega',{waitUntil:'networkidle'});
  let t=Date.now();
  await page.getByRole('link',{name:'Dê um nome ao projeto.'}).click();
  await page.waitForTimeout(500); await page.waitForLoadState('networkidle');
  const tClick=Date.now()-t;
  await L.snap(page,'22-nome-link');
  const focus = await page.evaluate(()=>{const a=document.activeElement; return a? (a.tagName+' '+(a.placeholder||a.name||a.id||'')) : null});
  const y = await page.evaluate(()=>scrollY);
  console.log({tClick,url:page.url(),focus,y});
  // type name
  t=Date.now();
  const inp = page.getByPlaceholder('Ex.: Agenda Viva');
  const vis = await inp.isVisible();
  const box = await inp.boundingBox();
  console.log('name input visible',vis, box);
  await inp.click();
  await inp.fill('Vai Já Entregas');
  await page.waitForTimeout(400);
  const tType=Date.now()-t;
  await L.snap(page,'22b-nome-digitado');
  const side = await page.evaluate(()=>document.querySelector('aside, nav')?.innerText.slice(-120));
  const footer = await page.evaluate(()=>{const b=[...document.querySelectorAll('main button')].filter(b=>/Continuar|Voltar|Início|Master/.test(b.innerText)); return b.map(x=>x.innerText.trim())});
  console.log({tType,side,footer});
  await ctx.close();
})();
