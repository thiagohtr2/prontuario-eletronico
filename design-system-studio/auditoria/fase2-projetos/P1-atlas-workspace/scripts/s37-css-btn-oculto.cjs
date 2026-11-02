const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/identidade' });
  const p = s.page;
  await p.waitForTimeout(800);
  await p.evaluate(() => window.scrollTo(0, 1200)); await p.waitForTimeout(400);
  await s.shot('40-bug-botoes-prompt-css-identidade-ocultos-sob-barra-fixa', { dir: 'capturas' });
  await s.done();
})();
