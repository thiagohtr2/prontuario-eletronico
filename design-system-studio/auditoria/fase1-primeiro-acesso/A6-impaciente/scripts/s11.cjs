const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada',{waitUntil:'networkidle'});
  await page.getByRole('tab',{name:'Cadastro'}).click(); await page.waitForTimeout(300);
  let t=Date.now();
  await page.locator('main button').filter({hasText:'Cadastro na mesma tela do login'}).first().click();
  await page.waitForTimeout(400);
  const t1=Date.now()-t;
  await L.snap(page,'11-cadastro-escolhido');
  const st = await page.evaluate(()=>{const b=[...document.querySelectorAll('main button')].find(b=>/^Continuar: Desktop/.test(b.innerText.trim())); return {dis:b.disabled, bar:b.closest('div')?.parentElement?.innerText}});
  const sel = await page.evaluate(()=>{const m=document.querySelector('main').innerText;const k=m.indexOf('Cadastro selecionado');return m.slice(k,k+90)});
  const tabs = await page.evaluate(()=>[...document.querySelectorAll('[role=tab]')].map(e=>e.innerText+(e.querySelector('svg')?'':'')));
  console.log({t1,st,sel,tabs});
  await ctx.close();
})();
