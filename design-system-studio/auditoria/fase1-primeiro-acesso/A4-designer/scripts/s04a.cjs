const { open, dump, controls, C } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' }); await page.getByText('Aplicativo ou SaaS').first().waitFor();
  await page.waitForTimeout(1500);
  const s = await page.evaluate(() => ({ checked: [...document.querySelectorAll('[role=radio]')].map(r=>r.innerText.split('\n')[0]+':'+r.getAttribute('aria-checked')).join(', '), name: document.querySelector('input[placeholder="Ex.: Agenda Viva"]')?.value, mods: document.body.innerText.includes('Painel de saldo'), ls: Object.keys(localStorage) }));
  console.log(JSON.stringify(s));
  await page.screenshot({ path: C + '04a-reload-objetivo.png' });
  await ctx.close();
})();
