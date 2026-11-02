const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/entrega' });
  const p = s.page;
  for (const t of [/^Itens/, /^Contradições/, 'Especificação JSON']) {
    await p.getByRole('tab', { name: t }).click();
    await p.waitForTimeout(700);
    const nm = String(t).replace(/\W+/g, '').toLowerCase().slice(0, 14);
    await s.shot('28-entrega-aba-' + nm, { dir: 'tmp' });
    const lines = (await p.locator('main#conteudo').ariaSnapshot()).split('\n').filter(l => !l.includes('/url') && !l.includes('- img'));
    const i = lines.findIndex(l => l.includes('tablist'));
    console.log('===== ABA', t);
    console.log(lines.slice(i + 5, i + 140).join('\n').slice(0, 7000));
  }
  await s.done();
})();
