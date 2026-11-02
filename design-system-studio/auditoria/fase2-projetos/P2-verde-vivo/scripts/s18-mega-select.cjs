const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const a = page.getByRole('article', { name: 'Mega Empório', exact: true });
  await a.scrollIntoViewIfNeeded();
  await a.getByRole('button', { name: 'Ver em tamanho grande' }).click();
  await page.waitForTimeout(800);
  const d = page.getByRole('dialog');
  await d.getByRole('button', { name: 'Selecionar composição A' }).click();
  await page.waitForTimeout(800);
  console.log('dialog still', await page.getByRole('dialog').count());
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'mega-selecionado.png') });
  if (await page.getByRole('dialog').count()) {
    const [dl] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      page.getByRole('dialog').getByRole('button', { name: 'Exportar especificação' }).click(),
    ]);
    const nm = dl.suggestedFilename();
    await dl.saveAs(u.path.join(u.W, 'exportados', nm));
    console.log('DOWNLOAD', nm, await dl.failure());
  }
}, { url: URL + '#/guiado/navegacao' });
