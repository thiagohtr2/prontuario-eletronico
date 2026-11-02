const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: W + '/capturas/02a-entrada-fluxo-apenas-login.png' });
  await page.getByRole('tab', { name: 'Login' }).click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /^Acesso corporativo/ }).scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, -150); await page.waitForTimeout(300);
  await page.screenshot({ path: W + '/capturas/02b-entrada-login-acesso-corporativo-selecionado.png' });
  await page.getByRole('tab', { name: 'Cadastro' }).click(); await page.waitForTimeout(500);
  await page.screenshot({ path: W + '/capturas/02c-entrada-cadastro-nenhum-escolhido.png' });
  await ctx.close();
})();
