const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Abrir o template E-commerce de moda' }).click();
  await page.waitForTimeout(1200);
  const d = page.getByRole('dialog').first();
  const setHex = async (name, v) => { const t = d.getByRole('textbox', { name }); await t.fill(v); await t.press('Enter'); await page.waitForTimeout(200); };
  await setHex('Cor principal em hexadecimal', '#2d6a4f');
  await setHex('Fundo em hexadecimal', '#f6faf6');
  await setHex('Texto em hexadecimal', '#1b2e24');
  await d.getByRole('group', { name: 'Arredondamento dos cantos' }).getByRole('button', { name: 'Médios' }).click();
  for (const p of [/^Cabeçalho/, /^Categorias/, /^Vitrine/]) await d.getByRole('checkbox', { name: p }).check();
  await page.waitForTimeout(500);
  console.log('cores', await d.getByRole('textbox', { name: 'Cor principal em hexadecimal' }).inputValue(), await d.getByRole('textbox', { name: 'Fundo em hexadecimal' }).inputValue(), await d.getByRole('textbox', { name: 'Texto em hexadecimal' }).inputValue());
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'tpl-ajustado.png') });
  await d.getByRole('button', { name: 'Usar este template no projeto' }).click();
  await page.waitForTimeout(1000);
  console.log('dialogs', await page.getByRole('dialog').count());
  const dd = page.getByRole('dialog').first();
  const s = await dd.ariaSnapshot();
  console.log(s.split('\n').filter(l => /Partes editáveis|checked|projeto|Usar|Remover|Cantos padrão/.test(l)).join('\n'));
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'template-ecommerce-moda-usado-no-projeto.png') });
  for (const b of [/^CSS Variáveis/, /^Especificação JSON/, /^HTML demonstrativo/]) {
    try {
      const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), dd.getByRole('button', { name: b }).click()]);
      const nm = dl.suggestedFilename();
      await dl.saveAs(u.path.join(u.W, 'exportados', nm));
      console.log('DOWNLOAD', String(b), '->', nm, await dl.failure());
    } catch (e) { console.log('FALHA download', String(b), String(e).slice(0, 300)); }
    await page.waitForTimeout(400);
  }
}, { url: URL + '#/modulos/templates' });
