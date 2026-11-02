const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/componentes', { waitUntil: 'networkidle' }); await page.getByText('Escolha pelos olhos.').first().waitFor(); await page.waitForTimeout(1000);
  const card = page.locator('main').getByText('8. Apple Precision', { exact: true }).locator('xpath=ancestor::*[.//button[contains(., "Adicionar ao projeto")]][1]');
  await card.getByRole('button', { name: /Adicionar ao projeto/ }).click(); await page.waitForTimeout(1500);
  console.log(page.url());
  await page.screenshot({ path: C + '39-botao-adicionado.png' });
  const dlg = await page.evaluate(() => document.querySelector('[role=dialog]')?.innerText.slice(0,2500) || 'nodialog');
  console.log(dlg);
  const np = await page.evaluate(() => { const t=document.querySelector('main').innerText; const i=t.indexOf('No projeto'); return t.slice(i, i+800); });
  console.log('NOPROJ', np);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
