const { open, BASE } = require('./lib.cjs');
const path = require('path'); const fs = require('fs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/navegacao' });
  const p = s.page;
  const dir = path.join(s.W, 'exportados/outros-botoes/headers-e-sidebars'); fs.mkdirSync(dir, { recursive: true });
  async function grab(label, fn) {
    try { const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }), fn()]); const n = dl.suggestedFilename(); await dl.saveAs(path.join(dir, n)); console.log('OK |', label, '|', n, fs.statSync(path.join(dir, n)).size, 'bytes'); }
    catch (e) { console.log('FALHOU |', label, '|', e.message.split('\n')[0]); }
  }
  await p.waitForTimeout(600);
  const h = p.locator('main#conteudo article', { has: p.getByRole('group', { name: /Prévia interativa: Trilha de Contexto/ }) }).first();
  await h.scrollIntoViewIfNeeded();
  await h.getByRole('button', { name: 'Ver em tamanho grande' }).click(); await p.waitForTimeout(700);
  let dlg = p.getByRole('dialog').first();
  await dlg.getByRole('button', { name: 'Celular' }).click(); await p.waitForTimeout(700);
  await s.shot('19-header-trilha-de-contexto-grande-celular', { dir: 'capturas', locator: dlg });
  await dlg.getByRole('button', { name: 'Abrir menu do perfil' }).click(); await p.waitForTimeout(500);
  await s.shot('19-header-trilha-de-contexto-celular-menu-perfil-aberto', { dir: 'capturas', locator: dlg });
  await dlg.getByRole('button', { name: /Notificações/ }).click({ force: true }); await p.waitForTimeout(500);
  await s.shot('19-header-trilha-de-contexto-celular-notificacoes', { dir: 'capturas', locator: dlg });
  await grab('Headers › Trilha de Contexto › Exportar especificação', () => dlg.getByRole('button', { name: 'Exportar especificação' }).click());
  await dlg.getByRole('button', { name: 'Fechar' }).first().click(); await p.waitForTimeout(500);
  console.log('dialogs abertos após Fechar:', await p.getByRole('dialog').count());
  await p.getByRole('tab', { name: /^Sidebars/ }).click(); await p.waitForTimeout(500);
  const sb = p.locator('main#conteudo article', { has: p.getByRole('group', { name: /Prévia interativa: Clássica Integral/ }) }).first();
  await sb.scrollIntoViewIfNeeded();
  await sb.getByRole('button', { name: 'Ver em tamanho grande' }).click(); await p.waitForTimeout(700);
  dlg = p.getByRole('dialog').first();
  await s.shot('20-sidebar-classica-integral-grande-computador', { dir: 'capturas', locator: dlg });
  await dlg.getByRole('button', { name: 'Celular' }).click(); await p.waitForTimeout(700);
  await s.shot('20-sidebar-classica-integral-grande-celular', { dir: 'capturas', locator: dlg });
  const btns = await dlg.getByRole('button').evaluateAll(bs => bs.map(b => b.getAttribute('aria-label') || b.innerText.trim()).filter(Boolean));
  console.log('sidebar celular botões:', btns.slice(0, 25));
  const ham = dlg.getByRole('button', { name: /Abrir menu$|Abrir menu lateral|Menu/ });
  if (await ham.count()) { await ham.first().click(); await p.waitForTimeout(600); await s.shot('20-sidebar-classica-integral-celular-drawer-aberto', { dir: 'capturas', locator: dlg }); }
  await grab('Sidebars › Clássica Integral › Exportar especificação', () => dlg.getByRole('button', { name: 'Exportar especificação' }).click());
  await s.done();
})();
