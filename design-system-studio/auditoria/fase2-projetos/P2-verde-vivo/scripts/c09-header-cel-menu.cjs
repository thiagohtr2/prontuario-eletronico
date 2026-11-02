const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const C = (n) => u.path.join(u.W, 'capturas', n + '.png');
  const a = page.getByRole('article', { name: 'Mega Empório', exact: true });
  await a.scrollIntoViewIfNeeded();
  await a.getByRole('button', { name: 'Ver em tamanho grande' }).click(); await page.waitForTimeout(800);
  const d = page.getByRole('dialog');
  await d.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: 'Celular' }).click(); await page.waitForTimeout(700);
  await d.getByRole('button', { name: 'Abrir menu', exact: true }).click(); await page.waitForTimeout(700);
  await page.screenshot({ path: C('navegacao-header-mega-emporio-grande-celular-menu-aberto') });
}, { url: URL + '#/guiado/navegacao' });
