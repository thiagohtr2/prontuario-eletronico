const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/identidade' });
  const p = s.page;
  await p.getByRole('button', { name: 'Minimalistas 6' }).click();
  await p.waitForTimeout(300);
  const b = p.getByRole('button', { name: /^Neutro Essencial/ });
  console.log('antes pressed=', await b.getAttribute('aria-pressed'));
  await b.click();
  await p.waitForTimeout(600);
  console.log('depois pressed=', await b.getAttribute('aria-pressed'));
  const st = await p.getByRole('status').allInnerTexts().catch(() => []);
  console.log('status:', st);
  await s.shot('16-paleta-neutro-essencial-minimalistas', { dir: 'capturas' });
  const prev = p.getByRole('complementary', { name: 'Prévia da identidade' });
  await s.shot('16-identidade-previa-neutro-essencial', { dir: 'capturas', locator: prev });
  // CSS dos tokens
  const [dl] = await Promise.all([
    p.waitForEvent('download', { timeout: 4000 }).catch(() => null),
    prev.getByRole('button', { name: 'CSS dos tokens' }).click(),
  ]);
  console.log('download?', dl ? dl.suggestedFilename() : 'nenhum');
  await p.waitForTimeout(600);
  const dlg = p.getByRole('dialog');
  if (await dlg.count()) { console.log((await dlg.first().ariaSnapshot()).slice(0, 2500)); await s.shot('16-css-tokens-modal', { locator: dlg.first() }); }
  await s.done();
})();
