const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const C = (n) => u.path.join(u.W, 'capturas', n + '.png');
  await page.goto(URL + '#/guiado/desktop', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Sem sidebar 5' }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /^Navegação superior de duas linhas\./ }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: C('layout-desktop-escolhido-navegacao-superior-duas-linhas-tela') });
  const aside = page.getByRole('complementary', { name: 'Detalhes do layout' });
  await aside.screenshot({ path: C('layout-desktop-escolhido-previa-grande') });

  await page.goto(URL + '#/guiado/mobile', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Layouts híbridos 9' }).click();
  await page.waitForTimeout(400);
  const ph = page.getByRole('group', { name: /^Prévia do celular/ });
  const top = await ph.evaluate(e => e.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => window.scrollTo(0, y), top - 66);
  await page.waitForTimeout(400);
  const bb = await ph.boundingBox();
  console.log('phone bb', JSON.stringify(bb));
  await page.screenshot({ path: C('layout-mobile-escolhido-previa-grande-tela') });
  const clip = { x: bb.x - 10, y: Math.max(60, bb.y - 10), width: bb.width + 20, height: Math.min(bb.height + 20, 900 - Math.max(60, bb.y - 10)) };
  await page.screenshot({ path: C('layout-mobile-escolhido-previa-grande-celular'), clip });
  const before = await ph.innerText();
  const tries = [['Notificações', 'notificacoes'], ['Buscar', 'busca'], ['Mercado', 'categoria-mercado'], ['Explorar', 'explorar'], ['Salvos', 'salvos'], ['Perfil', 'perfil']];
  for (const [b, f] of tries) {
    await ph.getByRole('button', { name: b, exact: true }).first().click();
    await page.waitForTimeout(600);
    const after = await ph.innerText();
    const dlg = await page.getByRole('dialog').count();
    const snap = await ph.ariaSnapshot();
    const changed = after !== before;
    console.log('click', b, 'mudou texto?', changed, 'dialogs', dlg, 'expanded/pressed:', snap.split('\n').filter(l => /expanded|pressed|dialog|menu/.test(l)).map(l => l.trim()).join(' ; ').slice(0, 300));
    await page.screenshot({ path: C('layout-mobile-escolhido-interacao-' + f), clip });
    if (dlg) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
  }
}, { url: URL + '#/' });
