const { open, dump, controls, C } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  await page.getByText('Aplicativo ou SaaS').first().waitFor();
  const a = await page.evaluate(() => { const b=[...document.querySelectorAll('button')].find(x=>x.innerText.includes('Aplicativo ou SaaS')); return [b.outerHTML.slice(0,400), document.querySelectorAll('main').length, b.closest('main')?'inmain':'notmain']; });
  console.log(a.join('\n\n'));
  await ctx.close();
})();
