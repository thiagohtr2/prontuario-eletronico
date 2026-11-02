const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const C = (n) => u.path.join(u.W, 'capturas', n + '.png');
  const go = async (h) => { await page.goto(URL + h, { waitUntil: 'networkidle' }); await page.waitForTimeout(600); };
  // Identidade
  await go('#/guiado/identidade');
  await page.getByRole('button', { name: 'Naturais 6' }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /^Floresta Naturais/ }).scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, -150); await page.waitForTimeout(300);
  await page.screenshot({ path: C('identidade-paleta-floresta-selecionada') });
  await page.getByRole('tab', { name: 'Tipografia' }).click(); await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 250)); await page.waitForTimeout(300);
  await page.screenshot({ path: C('identidade-tipografia-fraunces-inter') });
  await page.getByRole('tab', { name: 'Ajustar cores' }).click(); await page.waitForTimeout(500);
  await page.screenshot({ path: C('identidade-tokens-floresta-contraste') });
  await page.getByRole('tab', { name: 'Formas e superfícies' }).click(); await page.waitForTimeout(500);
  await page.screenshot({ path: C('identidade-formas-superficies-padrao') });
  // Navegação
  await go('#/guiado/navegacao');
  await page.screenshot({ path: C('navegacao-header-mega-emporio-status') });
  const a = page.getByRole('article', { name: 'Mega Empório', exact: true });
  await a.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
  await page.screenshot({ path: C('navegacao-header-mega-emporio-card-selecionado') });
  await a.getByRole('button', { name: 'Ver em tamanho grande' }).click(); await page.waitForTimeout(800);
  await page.screenshot({ path: C('navegacao-header-mega-emporio-grande-computador') });
  const d = page.getByRole('dialog');
  await d.getByRole('button', { name: /^Departamentos/ }).first().click(); await page.waitForTimeout(500);
  await page.screenshot({ path: C('navegacao-header-mega-emporio-grande-mega-menu-aberto') });
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  if (!(await page.getByRole('dialog').count())) { await a.getByRole('button', { name: 'Ver em tamanho grande' }).click(); await page.waitForTimeout(700); }
  await page.getByRole('dialog').getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: 'Celular' }).click(); await page.waitForTimeout(700);
  await page.screenshot({ path: C('navegacao-header-mega-emporio-grande-celular') });
  const hb = page.getByRole('dialog').getByRole('button', { name: /menu/i });
  console.log('botoes menu no celular:', await hb.count(), (await hb.allInnerTexts()).join('|'));
  const names = await page.getByRole('dialog').getByRole('button').evaluateAll(bs => bs.map(b => b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 40));
  console.log(names.join(' | '));
  // Componentes
  await go('#/guiado/componentes');
  const reg = page.getByRole('region', { name: /No projeto/ });
  await reg.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
  await page.screenshot({ path: C('componentes-no-projeto-3-itens') });
  // Inspiração
  await go('#/modulos/inspiracao');
  await page.screenshot({ path: C('inspiracao-galeria-verdant-aprovado') });
}, { url: URL + '#/' });
