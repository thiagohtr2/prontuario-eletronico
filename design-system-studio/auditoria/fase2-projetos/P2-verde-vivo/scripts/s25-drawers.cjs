const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Ver todas as 66 categorias' }).click();
  for (const cat of ['34 Drawers', '38 Data grids', '13 Multi-select', '14 Checkbox', '17 Sliders', '28 Segmented controls', '64 Layouts mobile']) {
    await page.getByRole('button', { name: cat, exact: true }).click();
    await page.waitForTimeout(500);
    const m = await page.locator('#conteudo').ariaSnapshot();
    const lines = m.split('\n');
    const i = lines.findIndex(l => /heading ".*" \[level=2\]/.test(l));
    console.log('==', cat, lines.slice(i, i + 2).join(' ').trim());
    const txt = await page.locator('#conteudo').innerText();
    const idx = txt.toLowerCase().indexOf('filtr');
    if (idx >= 0) console.log('   ...filtr:', txt.slice(Math.max(0, idx - 120), idx + 120).replace(/\n/g, ' / '));
    if (cat === '34 Drawers') await page.screenshot({ path: u.path.join(u.W, 'scratch', 'g9-drawers-full.png'), fullPage: true });
  }
}, { url: URL + '#/guiado/componentes' });
