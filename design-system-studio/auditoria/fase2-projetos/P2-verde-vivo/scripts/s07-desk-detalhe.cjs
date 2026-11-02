const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: 'Sem sidebar 5' }).click();
  await page.waitForTimeout(400);
  await u.shot('g3-desktop-semsidebar');
  for (const [nm, f] of [['Navegação superior de duas linhas.', 'g3-det-duaslinhas'], ['Topbar integral fixa.', 'g3-det-topbar']]) {
    const b = page.getByRole('button', { name: new RegExp('^' + nm.replace('.', '\\.')) });
    await b.hover();
    await page.waitForTimeout(400);
    const aside = page.getByRole('complementary', { name: 'Detalhes do layout' });
    console.log(f, (await aside.ariaSnapshot()).slice(0, 1500));
    await aside.screenshot({ path: u.path.join(u.W, 'scratch', f + '.png') });
  }
}, { url: URL + '#/guiado/desktop' });
