const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/componentes' });
  const p = s.page;
  const cats = process.argv.slice(2);
  const all = p.getByRole('button', { name: /Ver todas as 66 categorias/ });
  if (await all.count()) { await all.click(); await p.waitForTimeout(400); }
  for (const c of cats) {
    await p.getByRole('complementary', { name: 'Categorias de componentes' }).getByRole('button', { name: c, exact: true }).click();
    await p.waitForTimeout(700);
    const label = c.replace(/^\d+ /, '');
    const fam = p.getByRole('button', { name: new RegExp('Escolher a família Swiss Minimal para ' + label) });
    console.log(c, 'familia encontrada:', await fam.count());
    await fam.scrollIntoViewIfNeeded();
    await s.shot('25-cat-' + label.replace(/\W+/g, '-').toLowerCase());
    const card = fam.locator('xpath=ancestor::*[.//button[normalize-space()="Adicionar ao projeto"]][1]');
    await card.getByRole('button', { name: 'Adicionar ao projeto' }).click();
    await p.waitForTimeout(900);
    const dlg = p.getByRole('dialog').first();
    await s.shot('25-personalizar-' + label.replace(/\W+/g, '-').toLowerCase(), { dir: 'capturas', locator: dlg });
    const snap = (await dlg.ariaSnapshot()).split('\n').filter(l => !l.includes('- img'));
    const i = snap.findIndex(l => l.includes('Configuração da instância'));
    console.log(snap.slice(0, 3).join('\n'));
    console.log(snap.slice(i, i + 40).join('\n'));
    await dlg.getByRole('button', { name: 'Concluir' }).click();
    await p.waitForTimeout(500);
  }
  console.log(await p.getByRole('region', { name: /No projeto/ }).ariaSnapshot());
  await s.done();
})();
