const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  for (const h of ['#/modulos/login', '#/modulos/objetivo', '#/modulos/landing']) {
    await page.goto('http://127.0.0.1:4300/' + h, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const txt = await page.locator('main').innerText();
    const lines = txt.split('\n').filter(l => /cadastro|sem conta|Criar conta/i.test(l));
    console.log('==', h, '\n', lines.slice(0, 20).join('\n'));
  }
  // search palette
  await page.getByRole('button', { name: /Buscar funcionalidades/ }).click();
  await page.waitForTimeout(300);
  await page.keyboard.type('cadastro');
  await page.waitForTimeout(500);
  const dlg = page.getByRole('dialog');
  if (await dlg.count()) console.log(await dlg.first().ariaSnapshot());
  await page.screenshot({ path: W + '/scripts/tmp-16.png' });
  await ctx.close();
})();
