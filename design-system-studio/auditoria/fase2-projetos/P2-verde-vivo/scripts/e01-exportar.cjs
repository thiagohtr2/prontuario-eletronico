const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const C = (n) => u.path.join(u.W, 'capturas', n + '.png');
  const E = (n) => u.path.join(u.W, 'exportados', n);
  // Tela final do Master Prompt (guiado etapa 10)
  await page.goto(URL + '#/guiado/entrega', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  await page.screenshot({ path: C('master-prompt-tela-final-guiado-etapa10') });
  // downloads na página Exportar
  await page.goto(URL + '#/exportar', { waitUntil: 'networkidle' }); await page.waitForTimeout(700);
  await page.screenshot({ path: C('exportar-e-importar-tela') });
  const arts = ['Master Prompt (.md)', 'Especificação JSON', 'CSS de referência', 'Ficha do projeto (HTML)', 'Backup completo'];
  for (const h of arts) {
    const art = page.getByRole('article').filter({ has: page.getByRole('heading', { name: h, exact: true }) });
    try {
      const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), art.getByRole('button', { name: 'Baixar' }).click()]);
      const nm = dl.suggestedFilename();
      await dl.saveAs(E(nm));
      console.log('OK', h, '->', nm, 'falha:', await dl.failure());
    } catch (e) { console.log('FALHA', h, String(e).slice(0, 300)); await page.screenshot({ path: C('falha-download-' + h.replace(/\W+/g, '-')) }); }
    await page.waitForTimeout(600);
  }
}, { url: URL + '#/' });
