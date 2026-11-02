const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(8000);
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Login' }).click();
  await page.waitForTimeout(400);
  await page.locator('#conteudo').getByRole('button', { name: 'Ver prévia' }).first().click();
  await page.waitForTimeout(800);
  const d = page.getByRole('dialog');
  console.log(await d.locator('h2').first().innerText());
  await page.screenshot({ path: W + '/capturas/16-login-acesso-corporativo-previa-computador.png' });
  // error states
  await d.getByRole('switch', { name: 'Mostrar estados de erro' }).check({ force: true });
  await page.waitForTimeout(500);
  await page.screenshot({ path: W + '/capturas/16b-login-acesso-corporativo-computador-estados-erro.png' });
  await d.getByRole('switch', { name: 'Mostrar estados de erro' }).uncheck({ force: true });
  await d.getByRole('button', { name: 'Celular' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: W + '/capturas/17-login-acesso-corporativo-previa-celular.png' });
  await d.getByRole('button', { name: 'Criar conta' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: W + '/capturas/17b-login-celular-aba-criar-conta-sem-cadastro.png' });
  console.log((await d.ariaSnapshot()).split('\n').filter(l => l.length < 300).slice(0, 50).join('\n'));
  await ctx.close();
})();
