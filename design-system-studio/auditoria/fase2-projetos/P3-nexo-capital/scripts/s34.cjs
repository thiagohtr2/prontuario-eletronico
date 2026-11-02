const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const pg = page.getByRole('group', { name: 'Página da prévia' });
  const dv = page.getByRole('group', { name: 'Dispositivo da prévia' });
  const shots = [];
  for (const p of ['Aplicação', 'Login', 'Cadastro']) {
    await pg.getByRole('button', { name: p }).click();
    for (const d of ['Computador', 'Tablet', 'Celular']) {
      await dv.getByRole('button', { name: d }).click();
      await page.waitForTimeout(700);
      const img = page.locator('#conteudo [role="img"][aria-label^="Prévia"]').first();
      const label = await img.getAttribute('aria-label').catch(() => null);
      const box = await img.boundingBox().catch(() => null);
      console.log(p, d, label, box && [Math.round(box.width), Math.round(box.height)]);
      const name = `15-previa-integrada-${p.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()}-${d.toLowerCase()}`;
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: W + `/capturas/${name}.png` });
      if (box) await img.screenshot({ path: W + `/capturas/${name}-recorte.png` });
    }
  }
  await ctx.close();
})();
