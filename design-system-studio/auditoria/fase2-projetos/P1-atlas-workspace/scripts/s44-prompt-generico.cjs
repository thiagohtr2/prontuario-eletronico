const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/prompt' });
  const p = s.page;
  await p.getByRole('tab', { name: /^Itens/ }).click(); await p.waitForTimeout(600);
  await p.locator('main#conteudo').getByRole('button', { name: 'Prompt deste elemento' }).nth(5).click(); await p.waitForTimeout(600);
  await s.shot('43-bug-prompt-individual-titulo-generico-elemento', { dir: 'capturas', locator: p.getByRole('dialog').first() });
  await s.done();
})();
