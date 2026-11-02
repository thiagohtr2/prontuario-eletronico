const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/navegacao' });
  const p = s.page;
  await p.getByRole('tab', { name: /^Sidebars/ }).click();
  await p.waitForTimeout(600);
  const grp = p.getByRole('group', { name: /Filtrar sidebars/ });
  console.log(await grp.ariaSnapshot().catch(e => 'sem grupo: ' + e.message.slice(0, 80)));
  const arts = p.locator('main article');
  const n = await arts.count();
  for (let i = 0; i < n; i++) {
    const a = arts.nth(i);
    const txt = await a.locator('button:has-text("Selecionar")').first().innerText().catch(() => '');
    const comp = await a.locator('p').first().innerText().catch(() => '');
    console.log('-', txt.replace(/\s+/g, ' '), '||', comp.replace(/\s+/g, ' '));
  }
  await s.shot('18-sidebars', { full: true });
  await s.done();
})();
