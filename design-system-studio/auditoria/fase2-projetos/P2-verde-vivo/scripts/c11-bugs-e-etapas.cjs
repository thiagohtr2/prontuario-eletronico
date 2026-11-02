const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const C = (n) => u.path.join(u.W, 'capturas', n + '.png');
  const go = async (h) => { await page.goto(URL + h, { waitUntil: 'networkidle' }); await page.waitForTimeout(600); };
  // Bug: header cortado na prévia integrada (computador e tablet)
  await go('#/guiado/preview');
  for (const dev of ['Computador', 'Tablet']) {
    await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: dev }).click();
    await page.waitForTimeout(800);
    const img = page.getByRole('img', { name: /^Prévia do/ }).first();
    const top = await img.evaluate(e => e.getBoundingClientRect().top + scrollY);
    await page.evaluate(y => window.scrollTo(0, y), top - 70);
    await page.waitForTimeout(300);
    const bb = await img.boundingBox();
    await page.screenshot({ path: C('bug-previa-integrada-header-mega-emporio-cortado-' + dev.toLowerCase()), clip: { x: bb.x, y: bb.y, width: bb.width, height: 200 } });
  }
  // Etapa 1 e 2 (evidência das escolhas)
  await go('#/guiado/objetivo');
  await page.getByRole('radiogroup', { name: 'Tipo de projeto' }).scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -80)); await page.waitForTimeout(300);
  await page.screenshot({ path: C('etapa1-objetivo-tipo-loja-ou-catalogo') });
  await page.getByRole('region', { name: 'Módulos e funcionalidades previstas' }).scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -120)); await page.waitForTimeout(300);
  await page.screenshot({ path: C('etapa1-objetivo-nome-funcionalidades-tecnologia') });
  await go('#/guiado/entrada');
  await page.screenshot({ path: C('etapa2-entrada-fluxo-landing-sem-login') });
  await go('#/guiado/revisao');
  await page.getByRole('heading', { name: 'Esqueleto aprovado' }).scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
  await page.screenshot({ path: C('etapa5-revisao-esqueleto-apos-aprovacao') });
  console.log((await page.locator('#conteudo').ariaSnapshot()).split('\n').filter(l => /button|aprovad/i.test(l)).slice(-8).join('\n'));
}, { url: URL + '#/' });
