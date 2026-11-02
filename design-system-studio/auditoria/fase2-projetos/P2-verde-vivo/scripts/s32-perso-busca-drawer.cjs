const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const reg = page.getByRole('region', { name: /No projeto/ });
  console.log((await reg.ariaSnapshot()).split('\n').filter(l => /text: .* · |placeholder|textbox/.test(l)).join('\n'));
  // Busca = item 2
  await reg.getByRole('button', { name: 'Personalizar' }).nth(1).click();
  await page.waitForTimeout(600);
  let d = page.getByRole('dialog');
  console.log('abrindo', await d.getAttribute('aria-label') || (await d.ariaSnapshot()).split('\n')[0]);
  await d.getByRole('textbox', { name: 'Nome no projeto' }).fill('Busca de produtos (plantas)');
  await d.getByRole('textbox', { name: 'Texto de exemplo (placeholder)' }).fill('Buscar plantas…');
  await page.waitForTimeout(400);
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'componente-busca-soft-pill-personalizado.png') });
  await d.getByRole('button', { name: 'Concluir' }).click();
  await page.waitForTimeout(500);
  await reg.getByRole('button', { name: 'Personalizar' }).nth(2).click();
  await page.waitForTimeout(600);
  d = page.getByRole('dialog');
  console.log('abrindo', (await d.ariaSnapshot()).split('\n')[0]);
  await d.getByRole('textbox', { name: 'Nome no projeto' }).fill('Painel de filtros do catálogo');
  await page.waitForTimeout(400);
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'componente-drawer-filtros-soft-pill.png') });
  await d.getByRole('button', { name: 'Concluir' }).click();
  await page.waitForTimeout(500);
  await reg.scrollIntoViewIfNeeded();
  console.log((await reg.ariaSnapshot()));
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'no-projeto-3.png') });
}, { url: URL + '#/guiado/componentes' });
