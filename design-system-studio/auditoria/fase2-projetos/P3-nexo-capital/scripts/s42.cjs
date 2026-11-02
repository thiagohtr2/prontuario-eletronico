const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  await page.goto('http://127.0.0.1:4300/#/guiado/revisao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => {
    const el = [...document.querySelectorAll('header *')].find(e => /Esqueleto\s*\d\/5/.test(e.textContent) && e.children.length < 4);
    if (!el) return null;
    const attrs = n => [...n.attributes].map(a => a.name + '=' + a.value).join(' ');
    return { html: el.outerHTML.slice(0, 600), parent: attrs(el.parentElement) };
  });
  console.log(JSON.stringify(info, null, 1));
  const s = await page.locator('#conteudo').ariaSnapshot();
  console.log(s.split('\n').filter(l => l.length < 300).slice(0, 70).join('\n'));
  await page.screenshot({ path: W + '/capturas/22-revisao-apos-aprovacao.png', fullPage: false });
  await ctx.close();
})();
