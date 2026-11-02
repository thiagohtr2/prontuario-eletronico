const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/objetivo' });
  const p = s.page;
  const counter = async () => (await p.locator('header, [role=banner]').first().innerText()).match(/Esqueleto\s*\d\/\d/)?.[0];
  console.log('inicio', await counter());
  for (const b of ['Continuar: Entrada', 'Continuar: Desktop', 'Continuar: Mobile', 'Continuar: Revisão']) {
    await p.getByRole('button', { name: b }).click();
    await p.waitForTimeout(700);
    console.log(b, '->', p.url(), await counter());
  }
  await s.shot('14-contador-apos-continuar', { dir: 'tmp' });
  const lines = (await s.aria('complementary')).split('\n').filter(l => l.includes('link "'));
  console.log(lines.slice(0, 12).join('\n'));
  await s.done();
})();
