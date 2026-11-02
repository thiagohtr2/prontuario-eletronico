const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Ver todas as 66 categorias' }).click();
  for (const q of ['filtro', 'busca', 'produto', 'catálogo', 'mobile']) {
    await page.getByRole('searchbox', { name: 'Buscar categoria' }).fill(q);
    await page.waitForTimeout(400);
    const c = page.getByRole('complementary', { name: 'Categorias de componentes' });
    const s = await c.ariaSnapshot();
    console.log('Q=', q, '=>', s.split('\n').filter(l => /button "\d+ /.test(l)).map(l => l.trim()).join(' ; ') || s.slice(0, 300));
  }
  await page.getByRole('searchbox', { name: 'Buscar categoria' }).fill('');
  // busca global
  await page.getByRole('button', { name: /Buscar funcionalidades/ }).click();
  await page.waitForTimeout(500);
  for (const q of ['filtro', 'catálogo', 'produto', 'busca', 'botânic', 'planta']) {
    await page.keyboard.press('Control+A');
    await page.keyboard.type(q);
    await page.waitForTimeout(500);
    const d = page.getByRole('dialog');
    const s = (await d.count()) ? await d.first().ariaSnapshot() : 'sem dialog';
    console.log('GLOBAL', q, '=>\n', s.slice(0, 1500));
    if (q === 'filtro') await page.screenshot({ path: u.path.join(u.W, 'scratch', 'busca-global-filtro.png') });
  }
}, { url: URL + '#/guiado/componentes' });
