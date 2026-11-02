const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/desktop',{waitUntil:'networkidle'});
  await page.mouse.wheel(0,400); await page.waitForTimeout(400);
  await L.snap(page,'13-desktop-scroll');
  let t=Date.now();
  await page.locator('main button').filter({hasText:'Sidebar integral clássica'}).first().click();
  await page.waitForTimeout(500);
  const t1=Date.now()-t;
  await L.snap(page,'13b-desktop-clicou-card');
  const st = await page.evaluate(()=>{const b=[...document.querySelectorAll('main button')].find(b=>/^Continuar: Mobile/.test(b.innerText.trim())); return {dis:b?.disabled}});
  const toasts = await page.evaluate(()=>[...document.querySelectorAll('[role=status],[role=alert],[aria-live]')].map(e=>e.innerText).filter(Boolean));
  const panel = await page.evaluate(()=>{const m=document.querySelector('main').innerText;const k=m.search(/Exemplo ·|Selecionad/);return m.slice(k,k+300)});
  console.log({t1,st,toasts,panel, header: await page.evaluate(()=>document.querySelector('header').innerText.replace(/\n/g,' | '))});
  await ctx.close();
})();
