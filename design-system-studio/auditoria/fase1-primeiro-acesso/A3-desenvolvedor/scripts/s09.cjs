const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Cadastro' }).click();
  await page.getByRole('button', { name: /^Cadastro por convite para equipe/ }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: /^Cadastro em etapas progressivas/ }).click();
  await page.waitForTimeout(400);
  const btns = page.locator('main button[aria-pressed]');
  const n = await btns.count();
  for (let i = 0; i < n; i++) { const b = btns.nth(i); const t = (await b.innerText()).slice(0, 40).replace(/\n/g, ' '); console.log(await b.getAttribute('aria-pressed'), t); }
  await shot(page, '09-cadastro-etapas');
  await page.getByRole('button', { name: /Continuar: Desktop/ }).click();
  await page.waitForTimeout(600);
  console.log('URL', page.url());
  await shot(page, '09b-desktop');
  await shot(page, '09b-desktop-full', true);
  const a = await aria(page, 'main');
  console.log(a.split('\n').filter(l => !l.includes('/url')).slice(34).join('\n').slice(0, 7000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
