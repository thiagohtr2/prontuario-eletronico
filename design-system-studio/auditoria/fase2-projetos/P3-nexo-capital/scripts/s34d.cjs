const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  await page.goto('http://127.0.0.1:4300/#/guiado/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const pg = page.getByRole('group', { name: 'Página da prévia' });
  const dv = page.getByRole('group', { name: 'Dispositivo da prévia' });
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  for (const p of ['Aplicação', 'Login', 'Cadastro']) {
    await pg.getByRole('button', { name: p }).click();
    for (const d of ['Computador', 'Tablet', 'Celular']) {
      await dv.getByRole('button', { name: d }).click();
      await page.waitForTimeout(800);
      const name = `15-previa-integrada-${norm(p)}-${norm(d)}`;
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: W + `/capturas/${name}.png` });
      let el = d === 'Celular' ? page.locator('#conteudo [role="group"][aria-label^="Prévia do celular"]').first()
                               : page.locator('#conteudo [role="img"][aria-label^="Prévia do"]').first();
      if (!(await el.count())) el = page.locator('#conteudo [aria-label^="Prévia"]').first();
      const lbl = (await el.count()) ? await el.getAttribute('aria-label') : null;
      console.log(p, d, '->', lbl);
      if (lbl) {
        await el.screenshot({ path: W + `/capturas/${name}-recorte.png` });
        if (d === 'Celular' && p === 'Aplicação') {
          const btn = el.getByRole('button', { name: 'Abrir menu' });
          if (await btn.count()) {
            await btn.click(); await page.waitForTimeout(700);
            await el.screenshot({ path: W + `/capturas/${name}-menu-aberto-recorte.png` });
            console.log('drawer:', (await el.ariaSnapshot()).split('\n').slice(0, 14).join(' | '));
            const close = el.getByRole('button', { name: 'Fechar menu' });
            if (await close.count()) await close.click();
          }
        }
      }
    }
  }
  await ctx.close();
})();
