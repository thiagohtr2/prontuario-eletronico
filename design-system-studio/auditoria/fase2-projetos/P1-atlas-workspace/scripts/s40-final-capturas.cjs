const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/entrega' });
  const p = s.page;
  await p.waitForTimeout(800);
  await s.shot('42-master-prompt-tela-final-etapa10', { dir: 'capturas' });
  await p.getByRole('tab', { name: /^Itens/ }).click(); await p.waitForTimeout(500);
  await s.shot('42-master-prompt-aba-itens-15', { dir: 'capturas', full: true });
  await p.getByRole('tab', { name: /^Contradições/ }).click(); await p.waitForTimeout(500);
  await s.shot('42-master-prompt-aba-contradicoes-0', { dir: 'capturas' });
  await p.getByRole('tab', { name: 'Especificação JSON' }).click(); await p.waitForTimeout(500);
  await s.shot('42-master-prompt-aba-json', { dir: 'capturas' });
  await p.goto(BASE + '#/prompt', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await s.shot('42-central-de-prompts-master-prompt', { dir: 'capturas' });
  // header em tamanho grande, celular (evidência de ☰ no header vs bottom nav)
  await p.goto(BASE + '#/guiado/navegacao', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  const h = p.locator('main#conteudo article', { has: p.getByRole('group', { name: /Prévia interativa: Trilha de Contexto/ }) }).first();
  await h.scrollIntoViewIfNeeded();
  await h.getByRole('button', { name: 'Ver em tamanho grande' }).click(); await p.waitForTimeout(700);
  const dlg = p.getByRole('dialog').first();
  await dlg.getByRole('button', { name: 'Celular' }).click(); await p.waitForTimeout(700);
  await s.shot('19-header-trilha-de-contexto-grande-celular', { dir: 'capturas', locator: dlg });
  const menu = dlg.getByRole('button', { name: /menu/i });
  console.log('botões menu no celular:', await menu.allInnerTexts(), await dlg.getByRole('button').evaluateAll(bs => bs.map(b => b.getAttribute('aria-label') || b.innerText).filter(Boolean).slice(0, 20)));
  const ham = dlg.getByRole('button', { name: /Abrir menu/ });
  if (await ham.count()) { await ham.first().click(); await p.waitForTimeout(600); await s.shot('19-header-trilha-de-contexto-celular-menu-aberto', { dir: 'capturas', locator: dlg }); }
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  // sidebar em tamanho grande, celular
  await p.getByRole('tab', { name: /^Sidebars/ }).click(); await p.waitForTimeout(500);
  const sb = p.locator('main#conteudo article', { has: p.getByRole('group', { name: /Prévia interativa: Clássica Integral/ }) }).first();
  await sb.scrollIntoViewIfNeeded();
  await sb.getByRole('button', { name: 'Ver em tamanho grande' }).click(); await p.waitForTimeout(700);
  const d2 = p.getByRole('dialog').first();
  await d2.getByRole('button', { name: 'Celular' }).click(); await p.waitForTimeout(700);
  await s.shot('20-sidebar-classica-integral-grande-celular', { dir: 'capturas', locator: d2 });
  const ham2 = d2.getByRole('button', { name: /Abrir menu|menu/i });
  console.log('sidebar celular botoes:', await d2.getByRole('button').evaluateAll(bs => bs.map(b => b.getAttribute('aria-label') || b.innerText).filter(Boolean).slice(0, 20)));
  if (await ham2.count()) { await ham2.first().click(); await p.waitForTimeout(600); await s.shot('20-sidebar-classica-integral-celular-drawer-aberto', { dir: 'capturas', locator: d2 }); }
  await s.done();
})();
