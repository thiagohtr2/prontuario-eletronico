const { open, BASE } = require('./lib.cjs');
const path = require('path');
(async () => {
  const s = await open({ url: BASE + '#/exportar' });
  const p = s.page;
  const a = p.locator('main#conteudo article', { has: p.getByRole('heading', { name: 'Master Prompt (.md)' }) });
  const [dl] = await Promise.all([p.waitForEvent('download'), a.getByRole('button', { name: 'Baixar' }).click()]);
  await dl.saveAs(path.join(s.W, 'tmp/verificacao-master-prompt.md'));
  await s.done();
})();
