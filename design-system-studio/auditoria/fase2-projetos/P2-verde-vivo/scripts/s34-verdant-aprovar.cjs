const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('button', { name: /Abrir o site Verdant Atelier/ }).click();
  await page.waitForTimeout(1000);
  const d = page.getByRole('dialog').first();
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'inspiracao-verdant-atelier-paleta-original.png') });
  await d.getByRole('button', { name: 'Aprovar conceito' }).click();
  await page.waitForTimeout(1000);
  console.log('dialogs', await page.getByRole('dialog').count());
  await page.screenshot({ path: u.path.join(u.W, 'scratch', 'verdant-aprovado.png') });
  const dd = page.getByRole('dialog');
  if (await dd.count()) {
    const s = await dd.first().ariaSnapshot();
    console.log(s.split('\n').slice(-25).join('\n'));
    for (const b of ['CSS de referência', 'JSON', 'HTML demonstrativo']) {
      try {
        const [dl] = await Promise.all([
          page.waitForEvent('download', { timeout: 15000 }),
          dd.first().getByRole('button', { name: b, exact: true }).click(),
        ]);
        const nm = dl.suggestedFilename();
        await dl.saveAs(u.path.join(u.W, 'exportados', nm));
        console.log('DOWNLOAD', b, '->', nm, await dl.failure());
      } catch (e) { console.log('FALHA download', b, String(e).slice(0, 300)); }
      await page.waitForTimeout(500);
    }
  } else {
    const m = await page.locator('#conteudo').ariaSnapshot();
    console.log(m.slice(0, 3000));
  }
}, { url: URL + '#/modulos/inspiracao' });
