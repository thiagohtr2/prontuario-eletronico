const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Landing page' }).click();
  await page.getByRole('button', { name: /^Aurora Flow/ }).click();
  await page.waitForTimeout(300);
  await shot(page, '07-landing-aurora-selecionada');
  // open preview
  await page.getByRole('button', { name: 'Ver prévia' }).first().click();
  await page.waitForTimeout(800);
  await shot(page, '07b-landing-previa');
  const dlg = page.getByRole('dialog');
  console.log('dialogs:', await dlg.count());
  if (await dlg.count()) console.log((await dlg.first().ariaSnapshot()).slice(0, 3000));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  console.log('dialogs after esc:', await page.getByRole('dialog').count());
  await page.getByRole('tab', { name: 'Login' }).click();
  await page.waitForTimeout(400);
  await shot(page, '07c-login-tab');
  const a = await aria(page, 'main');
  console.log(a.split('\n').filter(l => !l.includes('/url')).slice(34).join('\n').slice(0, 6000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
