const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/navegacao' });
  const p = s.page;
  for (const f of ['Minimalistas 8', 'SaaS 12']) {
    await p.getByRole('group', { name: 'Filtrar headers' }).getByRole('button', { name: f }).click();
    await p.waitForTimeout(500);
    console.log('===== FILTRO', f);
    const arts = p.locator('main article');
    const n = await arts.count();
    for (let i = 0; i < n; i++) {
      const a = arts.nth(i);
      const sel = await a.locator('button:has-text("Selecionar")').first().getAttribute('aria-label').catch(() => null);
      const txt = await a.locator('button:has-text("Selecionar")').first().innerText().catch(() => '');
      console.log('-', (sel || txt).replace(/\s+/g, ' '));
    }
    await s.shot('17-headers-filtro-' + f.split(' ')[0].toLowerCase(), { full: true });
  }
  await s.done();
})();
