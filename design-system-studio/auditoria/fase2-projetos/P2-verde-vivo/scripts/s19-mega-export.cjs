const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const m = await page.locator('main').ariaSnapshot();
  console.log(m.split('\n').filter(l => /Header:|Sidebar:/.test(l)).join('\n'));
  const a = page.getByRole('article', { name: 'Mega Empório', exact: true });
  await a.scrollIntoViewIfNeeded();
  await a.screenshot({ path: u.path.join(u.W, 'scratch', 'mega-card-selecionado.png') });
  await a.getByRole('button', { name: 'Ver em tamanho grande' }).click();
  await page.waitForTimeout(800);
  const [dl] = await Promise.all([
    page.waitForEvent('download', { timeout: 15000 }),
    page.getByRole('dialog').getByRole('button', { name: 'Exportar especificação' }).click(),
  ]);
  const nm = dl.suggestedFilename();
  await dl.saveAs(u.path.join(u.W, 'exportados', nm));
  console.log('DOWNLOAD', nm, await dl.failure());
  console.log((await page.getByRole('dialog').ariaSnapshot()).split('\n').slice(-12).join('\n'));
}, { url: URL + '#/guiado/navegacao' });
