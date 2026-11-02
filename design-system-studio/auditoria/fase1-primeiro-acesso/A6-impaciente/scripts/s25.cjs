const L=require('./lib.cjs');
(async()=>{
  const {ctx,page}=await L.open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada',{waitUntil:'networkidle'});
  await page.getByRole('tab',{name:'Cadastro'}).click(); await page.waitForTimeout(300);
  const n = await page.evaluate(()=>[...document.querySelectorAll('main button')].filter(b=>b.innerText.trim()==='Ver prévia').length - 1);
  const filt = await page.evaluate(()=>[...document.querySelectorAll('main button')].filter(b=>/\n\d+$/.test(b.innerText.trim())).map(b=>b.innerText.replace(/\n/g,' ')));
  console.log('cadastro modelos', n, filt);
  await page.goto('http://127.0.0.1:4300/#/guiado/desktop',{waitUntil:'networkidle'});
  const sd = await page.evaluate(()=>(document.querySelector('main').innerText.match(/Sugerido/g)||[]).length);
  console.log('desktop sugeridos', sd);
  await ctx.close();
})();
