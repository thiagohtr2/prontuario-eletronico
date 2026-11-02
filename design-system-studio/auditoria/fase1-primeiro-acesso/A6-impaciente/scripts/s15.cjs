const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile',{waitUntil:'networkidle'});
  await L.snap(page,'15-mobile-topo');
  await page.mouse.wheel(0,400); await page.waitForTimeout(300);
  let t=Date.now();
  await page.locator('main button').filter({hasText:'Bottom Navigation clássica'}).first().click();
  await page.waitForTimeout(500);
  const t1=Date.now()-t;
  await L.snap(page,'15b-mobile-escolhido');
  const st = await page.evaluate(()=>{const b=[...document.querySelectorAll('main button')].find(b=>/^Continuar/.test(b.innerText.trim())); return {txt:b?.innerText,dis:b?.disabled}});
  const dialogs = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog]')].map(d=>d.innerText.slice(0,300)));
  console.log({t1,st,dialogs});
  await ctx.close();
})();
