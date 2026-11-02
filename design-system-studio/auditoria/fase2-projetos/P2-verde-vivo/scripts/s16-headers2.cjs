const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  for (const n of ['Vitrine Central', 'Feira Express', 'Hub de Produtos', 'Portal Amplo']) {
    const a = page.getByRole('article', { name: n, exact: true });
    await a.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await a.screenshot({ path: u.path.join(u.W, 'scratch', 'hdr-' + n.replace(/ /g, '_') + '-A.png') });
    const s = await a.ariaSnapshot();
    console.log('==', n, '\n', s.split('\n').filter(l => /button ".*Selecionar|paragraph|strong: [A-Z]/.test(l)).join('\n').slice(0, 900));
  }
}, { url: URL + '#/guiado/navegacao' });
