const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const m = await page.locator('#conteudo').ariaSnapshot(); const i = m.indexOf('region "No projeto'); console.log(m.slice(i, i + 1500));
  // abrir edição do card existente
  const reg = page.getByRole('region', { name: /No projeto/ });
  await reg.scrollIntoViewIfNeeded();
  await reg.screenshot({ path: u.path.join(u.W, 'scratch', 'no-projeto.png') });
}, { url: URL + '#/guiado/componentes' });
