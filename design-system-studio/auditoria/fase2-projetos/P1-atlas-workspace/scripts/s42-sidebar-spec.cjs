const { open, BASE } = require('./lib.cjs');
const path = require('path'); const fs = require('fs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/navegacao' });
  const p = s.page;
  const dir = path.join(s.W, 'exportados/outros-botoes/headers-e-sidebars');
  await p.getByRole('tab', { name: /^Sidebars/ }).click(); await p.waitForTimeout(500);
  const sb = p.locator('main#conteudo article', { has: p.getByRole('group', { name: /Prévia interativa: Clássica Integral/ }) }).first();
  await sb.scrollIntoViewIfNeeded();
  await sb.getByRole('button', { name: 'Ver em tamanho grande' }).click(); await p.waitForTimeout(700);
  const dlg = p.getByRole('dialog').first();
  try { const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }), dlg.getByRole('button', { name: 'Exportar especificação' }).click()]); const n = dl.suggestedFilename(); await dl.saveAs(path.join(dir, n)); console.log('OK |', n, fs.statSync(path.join(dir, n)).size); } catch (e) { console.log('FALHOU', e.message.split('\n')[0]); }
  // Combinação: tem exportação?
  await dlg.getByRole('button', { name: 'Fechar' }).first().click(); await p.waitForTimeout(400);
  await p.getByRole('tab', { name: 'Combinação' }).click(); await p.waitForTimeout(500);
  const bs = await p.locator('main#conteudo').getByRole('button').evaluateAll(b => b.map(x => (x.getAttribute('aria-label') || x.innerText).trim()).filter(t => /export|baixar|download|prompt/i.test(t)));
  console.log('botoes export na combinacao:', bs);
  // scroll para a prévia da combinação com arranjo sidebar inteira
  await p.getByRole('button', { name: 'Sidebar inteira' }).click(); await p.waitForTimeout(500);
  await p.evaluate(() => window.scrollBy(0, 560)); await p.waitForTimeout(400);
  await s.shot('21-combinacao-previa-sidebar-inteira-viewport', { dir: 'capturas' });
  await p.getByRole('button', { name: 'Header por cima' }).click({ force: true }); await p.waitForTimeout(500);
  await s.shot('21-combinacao-previa-header-por-cima-viewport', { dir: 'capturas' });
  await s.done();
})();
