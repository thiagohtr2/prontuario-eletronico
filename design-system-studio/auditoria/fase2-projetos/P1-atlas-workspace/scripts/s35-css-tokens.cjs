const { open, BASE } = require('./lib.cjs');
const path = require('path'); const fs = require('fs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/identidade' });
  const p = s.page;
  await p.waitForTimeout(800);
  const btns = p.getByRole('button', { name: 'CSS dos tokens' });
  console.log('botoes:', await btns.count());
  const dir = path.join(s.W, 'exportados/outros-botoes/identidade'); fs.mkdirSync(dir, { recursive: true });
  for (let t = 1; t <= 2; t++) {
    try {
      const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }), btns.first().click()]);
      await dl.saveAs(path.join(dir, dl.suggestedFilename()));
      console.log('tentativa', t, 'OK', dl.suggestedFilename());
      break;
    } catch (e) { console.log('tentativa', t, 'FALHOU', e.message.split('\n')[0]); await s.shot('40-css-tokens-sem-download-t' + t, { dir: 'capturas' }); }
  }
  await s.done();
})();
