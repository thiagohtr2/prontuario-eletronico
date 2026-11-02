const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/revisao' });
  const p = s.page;
  await p.getByRole('button', { name: 'Aprovar esqueleto e continuar' }).click();
  await p.waitForTimeout(1200);
  console.log('URL', p.url());
  await s.shot('13-apos-aprovar');
  const lines = (await s.aria('body')).split('\n').filter(l => !l.includes('/url') && !l.includes('- img'));
  console.log(lines.slice(0, 30).join('\n'));
  console.log('...MAIN');
  console.log((await s.aria('main')).split('\n').filter(l => !l.includes('/url') && !l.includes('- img')).slice(0, 200).join('\n'));
  await s.done();
})();
