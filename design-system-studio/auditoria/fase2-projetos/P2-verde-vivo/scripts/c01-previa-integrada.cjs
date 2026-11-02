const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const C = (n) => u.path.join(u.W, 'capturas', n + '.png');
  for (const pg of ['Aplicação', 'Landing']) {
    await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: pg }).click();
    await page.waitForTimeout(500);
    for (const dev of ['Computador', 'Tablet', 'Celular']) {
      await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: dev }).click();
      await page.waitForTimeout(900);
      const slug = `previa-integrada-${pg === 'Aplicação' ? 'aplicacao' : 'landing'}-${dev.toLowerCase()}`;
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator('#conteudo').evaluate(e => e.scrollTo && e.scrollTo(0, 0));
      const img = page.getByRole('img', { name: /^Prévia do/ }).first();
      await img.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({ path: C(slug + '-tela-1440x900') });
      const bb = await img.boundingBox();
      console.log(slug, JSON.stringify(bb));
      try { await img.screenshot({ path: C(slug + '-elemento') }); } catch (e) { console.log('elem shot fail', e.message.slice(0, 200)); }
      const info = await img.evaluate(el => { const out = []; let n = el; for (let k = 0; k < 6 && n; k++) { out.push([n.tagName, n.className && String(n.className).slice(0, 60), n.scrollHeight, n.clientHeight, getComputedStyle(n).overflowY].join('|')); n = n.firstElementChild; } return out; });
      console.log('  estrutura', info.join(' // '));
    }
  }
}, { url: URL + '#/guiado/preview' });
