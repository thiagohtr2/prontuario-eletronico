const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const C = (n) => u.path.join(u.W, 'capturas', n + '.png');
  await page.getByRole('tab', { name: 'Landing page' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: C('entrada-landing-folha-viva-selecionada-tela') });
  await page.getByRole('button', { name: 'Ver prévia' }).first().click();
  await page.waitForTimeout(900);
  const d = page.getByRole('dialog');
  console.log('dialog', await d.count(), (await d.ariaSnapshot()).split('\n').slice(0, 14).join('\n'));
  await d.getByRole('group', { name: 'Cores da prévia' }).getByRole('button', { name: 'Minha identidade' }).click();
  await page.waitForTimeout(600);
  // rolar conteúdo interno
  const reg = d.getByRole('region', { name: /^Prévia da landing/ });
  const mark = await reg.evaluate(el => { let n = el; while (n && !(n.scrollHeight > n.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(n).overflowY))) n = n.parentElement; if (n) { n.setAttribute('data-aud-scroll', '1'); return { sh: n.scrollHeight, ch: n.clientHeight, cls: String(n.className).slice(0, 40) }; } return null; });
  console.log('scroller', JSON.stringify(mark));
  for (const dev of ['Computador', 'Celular']) {
    await d.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: dev }).click();
    await page.waitForTimeout(800);
    const m2 = await reg.evaluate(el => { document.querySelectorAll('[data-aud-scroll]').forEach(x => x.removeAttribute('data-aud-scroll')); const all = [el, ...el.querySelectorAll('*')]; let best = null; for (const n of all) { if (n.scrollHeight > n.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(n).overflowY)) { best = n; break; } } if (!best) { let n = el.parentElement; while (n && !(n.scrollHeight > n.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(n).overflowY))) n = n.parentElement; best = n; } if (best) { best.setAttribute('data-aud-scroll', '1'); return { sh: best.scrollHeight, ch: best.clientHeight }; } return null; });
    console.log(dev, JSON.stringify(m2));
    const steps = m2 ? Math.min(6, Math.ceil(m2.sh / (m2.ch * 0.9))) : 1;
    for (let s = 0; s < steps; s++) {
      if (m2) await page.evaluate(k => { const el = document.querySelector('[data-aud-scroll]'); el.scrollTop = k * el.clientHeight * 0.9; }, s);
      await page.waitForTimeout(350);
      await page.screenshot({ path: C(`landing-folha-viva-previa-${dev.toLowerCase()}-minha-identidade-parte${s + 1}`) });
    }
    if (dev === 'Celular') {
      await page.evaluate(() => { const el = document.querySelector('[data-aud-scroll]'); if (el) el.scrollTop = 0; });
      const mb = reg.getByRole('button', { name: /menu/i }).first();
      console.log('menu btn', await mb.count());
      if (await mb.count()) { await mb.click(); await page.waitForTimeout(600); await page.screenshot({ path: C('landing-folha-viva-previa-celular-menu-aberto') }); console.log((await reg.ariaSnapshot()).slice(0, 800)); }
    }
  }
}, { url: URL + '#/guiado/entrada' });
