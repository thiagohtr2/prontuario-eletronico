const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/modulos/componentes', { waitUntil: 'networkidle' });
  const reg = page.getByRole('region', { name: /No projeto/ });
  console.log('HEADING:', await reg.getByRole('heading').first().innerText());
  const items = await reg.getByRole('listitem').allInnerTexts();
  console.log(items.map(t => t.replace(/\n+/g,' ')).join('\n'));
  await page.goto('http://127.0.0.1:4300/#/prompt', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const a = await aria(page, 'main'); const L = a.split('\n'); const s = L.findIndex(l=>l.includes('itens no Master Prompt'));
  console.log(L.slice(Math.max(0,s-3), s+8).join('\n'));
  await page.getByRole('tab', { name: /^Contradições/ }).click(); await page.waitForTimeout(400);
  await shot(page, '42-contradicoes');
  const b = await aria(page, 'main'); const M = b.split('\n'); const t = M.findIndex(l=>l.includes('tablist'));
  console.log(M.slice(t+6, t+20).join('\n'));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
