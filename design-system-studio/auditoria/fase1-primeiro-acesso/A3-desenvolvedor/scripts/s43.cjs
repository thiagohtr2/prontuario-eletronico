const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/modulos/componentes', { waitUntil: 'networkidle' });
  const reg = page.getByRole('region', { name: /No projeto/ });
  const li = reg.getByRole('listitem').filter({ hasText: 'Sidebars' });
  const btns = li.getByRole('button'); const n = await btns.count(); const nm=[]; for (let i=0;i<n;i++) nm.push((await btns.nth(i).getAttribute('aria-label')) || (await btns.nth(i).innerText())); console.log('BUTTONS in item:', nm.join(' | '));
  const rm = li.getByRole('button', { name: 'Remover' });
  console.log('remover count', await rm.count(), 'visible', await rm.first().isVisible().catch(()=>false));
  await rm.first().click();
  await page.waitForTimeout(600);
  await shot(page, '43-apos-remover');
  const dlg = page.locator('[role=dialog],[role=alertdialog]'); console.log('dialogs:', await dlg.count()); if (await dlg.count()) console.log((await dlg.first().innerText()).slice(0,500));
  for (const s of await page.getByRole('status').all()) { const t=(await s.innerText()).trim(); if (t) console.log('STATUS:', t); }
  console.log('COUNT NOW:', (await reg.getByRole('listitem').count()));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
