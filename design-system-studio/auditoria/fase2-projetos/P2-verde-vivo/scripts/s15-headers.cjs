const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const sel = await page.locator('main article').evaluateAll(as => as.map(a => a.getAttribute('aria-label') || a.querySelector('h2,h3')?.textContent));
  console.log('ARTICLES', sel.length, sel.join(' | '));
  await page.getByRole('button', { name: 'Com busca 9' }).click();
  await page.waitForTimeout(500);
  const names = await page.locator('main article').evaluateAll(as => as.map(a => a.getAttribute('aria-label')));
  console.log('COM BUSCA', names.join(' | '));
  for (const n of ['Mega Empório', 'Vitrine Central']) {
    const a = page.getByRole('article', { name: n, exact: true });
    if (await a.count()) {
      await a.scrollIntoViewIfNeeded();
      await a.screenshot({ path: u.path.join(u.W, 'scratch', 'hdr-' + n.replace(/ /g, '_') + '-A.png') });
      await a.getByRole('button', { name: 'Composição B' }).click();
      await page.waitForTimeout(400);
      await a.screenshot({ path: u.path.join(u.W, 'scratch', 'hdr-' + n.replace(/ /g, '_') + '-B.png') });
      console.log(n, 'B:', (await a.ariaSnapshot()).split('\n').filter(l => /paragraph|strong:|text: "?Linha|Logo/.test(l)).slice(0, 8).join('\n'));
      await a.getByRole('button', { name: 'Composição A' }).click();
    } else console.log('nao achei', n);
  }
}, { url: URL + '#/guiado/navegacao' });
