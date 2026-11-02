const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  await page.goto('http://127.0.0.1:4300/#/projeto', { waitUntil: 'networkidle' });
  await page.getByRole('group', { name: 'Profundidade dos controles' }).getByRole('button', { name: 'Avançado' }).click();
  await page.waitForTimeout(400);
  for (const h of ['#/modulos/cadastro', '#/guiado/entrada']) {
    await page.goto('http://127.0.0.1:4300/' + h, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    if (h.includes('entrada')) { await page.getByRole('tab', { name: 'Cadastro' }).click(); await page.waitForTimeout(400); }
    const txt = await page.locator('#conteudo').innerText();
    console.log('==', h, /sem cadastro|não haverá|nenhum cadastro|Não terá/i.test(txt) ? 'TEM opção sem cadastro' : 'sem opção');
    console.log(txt.split('\n').filter(l => /sem cadastro|não haverá|nenhum|Não terá/i.test(l)).slice(0, 5).join('\n'));
  }
  await page.goto('http://127.0.0.1:4300/#/projeto', { waitUntil: 'networkidle' });
  await page.getByRole('group', { name: 'Profundidade dos controles' }).getByRole('button', { name: 'Essencial' }).click();
  await page.waitForTimeout(300);
  console.log('Essencial restaurado:', await page.getByRole('group', { name: 'Profundidade dos controles' }).getByRole('button', { name: 'Essencial' }).getAttribute('aria-pressed'));
  await ctx.close();
})();
