const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/identidade' });
  const p = s.page;
  await p.getByRole('button', { name: 'Minimalistas 6' }).click();
  await p.waitForTimeout(400);
  await s.shot('15-identidade-minimalistas');
  for (const t of ['Ajustar cores', 'Tipografia', 'Formas e superfícies']) {
    await p.getByRole('tab', { name: t }).click();
    await p.waitForTimeout(600);
    await s.shot('15-identidade-aba-' + t.split(' ')[0].toLowerCase(), { full: true });
    const panel = p.locator('main');
    console.log('===== ABA', t);
    console.log((await panel.ariaSnapshot()).split('\n').filter(l => !l.includes('/url') && !l.includes('- img')).slice(38, 200).join('\n'));
  }
  await s.done();
})();
