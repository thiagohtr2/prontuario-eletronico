const { open, dump, controls, C } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' }); await page.getByText('Aplicativo ou SaaS').first().waitFor();
  await page.getByRole('radio', { name: /Aplicativo ou SaaS/ }).click();
  await page.getByPlaceholder('Ex.: Agenda Viva').fill('Lumen');
  await page.waitForTimeout(2500);
  const st = await page.evaluate(async () => ({ ls: Object.keys(localStorage), idb: (indexedDB.databases ? (await indexedDB.databases()).map(d=>d.name) : 'n/a') }));
  console.log('before reload', JSON.stringify(st));
  await page.reload({ waitUntil: 'networkidle' }); await page.getByText('Aplicativo ou SaaS').first().waitFor(); await page.waitForTimeout(1000);
  const s = await page.evaluate(() => ({ checked: [...document.querySelectorAll('[role=radio]')].filter(r=>r.getAttribute('aria-checked')==='true').map(r=>r.innerText.split('\n')[0]), name: document.querySelector('input[placeholder="Ex.: Agenda Viva"]')?.value, side: document.querySelector('aside')?.innerText.slice(-80) }));
  console.log('after reload', JSON.stringify(s));
  await ctx.close();
})();
