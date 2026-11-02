const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Login' }).click();
  await page.getByRole('button', { name: /^Acesso corporativo/ }).click();
  await page.waitForTimeout(300);
  await page.getByRole('tab', { name: 'Cadastro' }).click();
  await page.waitForTimeout(400);
  await shot(page, '08-cadastro-tab');
  const a = await aria(page, 'main');
  const lines = a.split('\n').filter(l => !l.includes('/url') && !l.includes('Ver prévia') && !l.trim().startsWith('- img') && !l.trim().startsWith('- text: Ver prévia'));
  console.log(lines.slice(34).join('\n').slice(0, 5000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
