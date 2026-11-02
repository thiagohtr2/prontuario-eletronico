const { withPage, URL } = require('./lib.cjs');
const urlArg = process.argv[2] || '#/guiado/preview';
const prefix = process.argv[3] || 'previa-integrada';
withPage(async (page, ctx, u) => {
  const C = (n) => u.path.join(u.W, 'capturas', n + '.png');
  await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Landing' }).click();
  await page.waitForTimeout(500);
  for (const dev of ['Computador', 'Tablet', 'Celular']) {
    await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: dev }).click();
    await page.waitForTimeout(900);
    // achar contêiner rolável dentro da prévia
    const info = await page.evaluate(() => {
      const h = [...document.querySelectorAll('#conteudo h1')].find(x => /Plantas que/.test(x.textContent));
      let n = h, found = null, chain = [];
      while (n && n.id !== 'conteudo') { const cs = getComputedStyle(n); chain.push(`${n.tagName}.${String(n.className).slice(0,30)} sh=${n.scrollHeight} ch=${n.clientHeight} ov=${cs.overflowY}`); if (!found && n.scrollHeight > n.clientHeight + 5 && /(auto|scroll)/.test(cs.overflowY)) { found = n; n.setAttribute('data-aud-scroll', '1'); } n = n.parentElement; }
      const r = (found || h).getBoundingClientRect();
      return { found: !!found, sh: found && found.scrollHeight, ch: found && found.clientHeight, top: r.top + scrollY, chain: chain.slice(0, 8) };
    });
    console.log(dev, JSON.stringify(info));
    const slug = `${prefix}-landing-${dev.toLowerCase()}`;
    // alinhar prévia no topo da área útil
    await page.evaluate(y => window.scrollTo(0, y), Math.max(0, (await page.getByRole('group', { name: 'Dispositivo da prévia' }).evaluate(e => e.getBoundingClientRect().bottom + scrollY)) - 64));
    await page.waitForTimeout(300);
    if (info.found) {
      const steps = Math.min(6, Math.ceil(info.sh / info.ch));
      for (let s = 0; s < steps; s++) {
        await page.evaluate(k => { const el = document.querySelector('[data-aud-scroll]'); el.scrollTop = k * el.clientHeight * 0.9; }, s);
        await page.waitForTimeout(400);
        await page.screenshot({ path: C(`${slug}-parte${s + 1}`) });
      }
      console.log('  partes', steps);
    } else {
      await page.screenshot({ path: C(`${slug}-parte1`) });
      await page.mouse.wheel(0, 700); await page.waitForTimeout(400);
      await page.screenshot({ path: C(`${slug}-parte2`) });
    }
  }
}, { url: URL + urlArg });
