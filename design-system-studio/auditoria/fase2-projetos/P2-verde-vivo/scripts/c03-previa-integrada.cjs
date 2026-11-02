const { withPage, URL } = require('./lib.cjs');
const urlArg = process.argv[2] || '#/guiado/preview';
const prefix = process.argv[3] || 'previa-integrada';
withPage(async (page, ctx, u) => {
  const C = (n) => u.path.join(u.W, 'capturas', n + '.png');
  async function shootParts(loc, slug) {
    const top0 = await loc.evaluate(e => e.getBoundingClientRect().top + window.scrollY);
    const h = await loc.evaluate(e => e.getBoundingClientRect().height);
    const usable = 900 - 64 - 70; // header Studio e barra de ações
    let part = 1;
    for (let off = 0; off < h; off += usable) {
      await page.evaluate(y => window.scrollTo(0, y), Math.max(0, top0 - 64 - 8 + off));
      await page.waitForTimeout(350);
      await page.screenshot({ path: C(`${slug}-parte${part}`) });
      part++;
      if (part > 4) break;
    }
    return { h: Math.round(h), parts: part - 1 };
  }
  for (const pg of ['Aplicação', 'Landing']) {
    await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: pg }).click();
    await page.waitForTimeout(500);
    for (const dev of ['Computador', 'Tablet', 'Celular']) {
      await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: dev }).click();
      await page.waitForTimeout(900);
      const slug = `${prefix}-${pg === 'Aplicação' ? 'aplicacao' : 'landing'}-${dev.toLowerCase()}`;
      const loc = dev === 'Celular' ? page.getByRole('group', { name: /^Prévia do celular/ }).first() : page.getByRole('img', { name: /^Prévia do/ }).first();
      let target = loc;
      if (!(await loc.count())) { target = page.locator('#conteudo [class*=frame]').first(); console.log('fallback locator for', slug); }
      const r = await shootParts(target, slug);
      console.log(slug, JSON.stringify(r));
    }
  }
}, { url: URL + urlArg });
