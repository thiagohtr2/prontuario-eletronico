const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: /Buscar funcionalidades/ }).click();
  await page.waitForTimeout(500);
  for (const q of ['paleta', 'header', 'cards', 'Campos de busca', 'drawer', 'landing']) {
    await page.keyboard.press('Control+A');
    await page.keyboard.type(q);
    await page.waitForTimeout(500);
    const s = await page.getByRole('dialog').first().ariaSnapshot();
    console.log('GLOBAL', q, '=>', s.split('\n').filter(l => /option|listitem/.test(l)).map(l => l.trim()).slice(0, 8).join(' | '));
  }
  await page.keyboard.press('Control+A');
  await page.keyboard.type('busca');
  await page.waitForTimeout(400);
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'limitacao-busca-global-busca-sem-resultado.png') });
}, { url: URL + '#/guiado/componentes' });
