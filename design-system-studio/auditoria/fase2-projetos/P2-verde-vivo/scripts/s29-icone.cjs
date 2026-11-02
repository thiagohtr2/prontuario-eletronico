const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const reg = page.getByRole('region', { name: /No projeto/ });
  await reg.getByRole('button', { name: 'Personalizar' }).first().click();
  await page.waitForTimeout(700);
  const d = page.getByRole('dialog');
  console.log('valores', await d.getByRole('textbox', { name: 'Título', exact: true }).inputValue(), '|', await d.getByRole('textbox', { name: 'Botão', exact: true }).inputValue());
  await d.getByRole('button', { name: 'Trocar ícone' }).click();
  await page.waitForTimeout(400);
  for (const q of ['folha', 'planta', 'flor', 'natureza', 'árvore', 'broto', 'eco', 'sacola', 'loja']) {
    await d.getByRole('searchbox', { name: 'Buscar ícone' }).fill(q);
    await page.waitForTimeout(300);
    const g = d.getByRole('group', { name: 'Biblioteca de ícones' });
    const s = await g.ariaSnapshot();
    console.log(q, '=>', s.split('\n').filter(l => /button "/.test(l) && !/Fechar biblioteca/.test(l)).map(l => l.trim()).join(' ').slice(0, 300));
  }
}, { url: URL + '#/guiado/componentes' });
