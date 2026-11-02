const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: W + '/capturas/19-master-prompt-tela-final.png' });
  await page.screenshot({ path: W + '/capturas/19b-master-prompt-tela-final-pagina-inteira.png', fullPage: true });
  await page.getByRole('tab', { name: /^Contradições/ }).click(); await page.waitForTimeout(400);
  await page.screenshot({ path: W + '/capturas/28-contradicoes-zero-apesar-de-conflitos-no-texto.png' });
  await page.getByRole('tab', { name: /^Itens/ }).click(); await page.waitForTimeout(400);
  await page.screenshot({ path: W + '/capturas/29-itens-do-master-prompt.png', fullPage: true });
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const reg = page.getByRole('region', { name: /No projeto/ });
  await reg.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
  await page.screenshot({ path: W + '/capturas/30-componentes-no-projeto.png' });
  await page.goto('http://127.0.0.1:4300/#/modulos/cadastro', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: W + '/capturas/31-bug-cadastro-sem-opcao-nao-havera-cadastro.png' });
  // component previews chosen
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  const items = reg.getByRole('listitem');
  const n = await items.count();
  for (let i = 0; i < n; i++) {
    await reg.getByRole('listitem').nth(i).getByRole('button', { name: 'Personalizar' }).click();
    await page.waitForTimeout(700);
    const d = page.getByRole('dialog');
    const t = (await d.locator('h2').first().innerText()).replace(/\W+/g, '-').toLowerCase();
    await page.screenshot({ path: W + `/capturas/32-componente-${i + 1}-${t}.png` });
    await d.getByRole('button', { name: 'Concluir' }).click(); await page.waitForTimeout(300);
  }
  await ctx.close();
})();
