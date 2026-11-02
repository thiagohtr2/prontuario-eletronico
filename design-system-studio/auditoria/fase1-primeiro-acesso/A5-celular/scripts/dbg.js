const L = require('./lib');
(async () => {
  const { ctx, page } = await L.open('perfil', 'android');
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log(page.url());
  await L.shot(page, 'dbg');
  const t = await L.text(page, 6000); console.log(t.slice(t.indexOf('Salvo'), t.indexOf('Salvo')+800));
  console.log(await page.evaluate(() => [...document.querySelectorAll('button')].filter(b=>/Aplicativo/.test(b.innerText)).map(b=>b.outerHTML.slice(0,200))));
  await ctx.close();
})();
