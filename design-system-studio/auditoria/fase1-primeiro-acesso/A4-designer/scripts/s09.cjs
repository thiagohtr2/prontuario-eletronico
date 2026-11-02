const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/entrada', { waitUntil: 'networkidle' }); await page.getByText('Como as pessoas entram').first().waitFor();
  await page.getByRole('tab', { name: 'Landing page' }).click();
  await page.waitForTimeout(1200);
  const card = page.locator('main button[aria-pressed]').filter({ hasText: /^Nexa/ });
  await card.click();
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: C + '08-landing-nexa-selecionada.png' });
  // open preview from selection bar
  await page.locator('main').getByRole('button', { name: 'Ver prévia' }).first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: C + '09-preview-nexa-desktop.png' });
  const dlg = await page.evaluate(() => { const d=document.querySelector('[role=dialog]'); return d ? d.innerText.slice(0,1500) : 'no dialog'; });
  console.log(dlg);
  const ctr = await page.evaluate(() => { const d=document.querySelector('[role=dialog]')||document.body; return [...d.querySelectorAll('button,a,[role=tab]')].map(e=>`${e.tagName} ${(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,40)} ${e.getAttribute('aria-pressed')||e.getAttribute('aria-selected')||''}`).join('\n'); });
  console.log(ctr);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
