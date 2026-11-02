const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  console.log('config disabled?', await page.getByRole('button', { name: 'Baixar configuração' }).isDisabled());
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.getByRole('button', { name: /Baixar executor/ }).click()]);
  const nm = dl.suggestedFilename();
  await dl.saveAs(u.path.join(u.W, 'exportados', nm));
  console.log('runner', nm, await dl.failure());
  await page.getByRole('button', { name: 'Baixar configuração' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'validacao-responsiva-configuracao-desabilitada-sem-url') });
}, { url: URL + '#/validacao' });
