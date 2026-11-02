const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/desktop' });
  const p = s.page;
  await p.waitForTimeout(500);
  await s.shot('09-desktop-escolhido');
  await s.shot('09-desktop-escolhido-full', { full: true });
  const a = await s.aria('main');
  const lines = a.split('\n').filter(l => !l.includes('/url') && !l.includes('- img'));
  console.log(lines.slice(33, 70).join('\n'));
  console.log('...');
  console.log(lines.slice(-40).join('\n'));
  await s.done();
})();
