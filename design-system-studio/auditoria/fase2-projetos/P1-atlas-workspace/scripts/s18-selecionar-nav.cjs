const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/navegacao' });
  const p = s.page;
  // HEADER
  const h = p.locator('main article', { has: p.getByRole('group', { name: /Prévia interativa: Trilha de Contexto/ }) }).first();
  await h.scrollIntoViewIfNeeded();
  await h.locator('button:has-text("Selecionar")').first().click();
  await p.waitForTimeout(700);
  console.log('header sel btn:', (await h.locator('button:has-text("Selecion")').first().innerText()).replace(/\s+/g, ' '));
  await s.shot('19-header-trilha-de-contexto-card', { dir: 'capturas', locator: h });
  await h.getByRole('button', { name: 'Ver em tamanho grande' }).click();
  await p.waitForTimeout(800);
  let dlg = p.getByRole('dialog').first();
  console.log((await dlg.ariaSnapshot()).split('\n').filter(l => !l.includes('/url')).slice(0, 60).join('\n'));
  await s.shot('19-header-trilha-de-contexto-grande', { dir: 'capturas', locator: dlg });
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  // SIDEBAR
  await p.getByRole('tab', { name: /^Sidebars/ }).click();
  await p.waitForTimeout(600);
  const sb = p.locator('main article', { has: p.getByRole('group', { name: /Prévia interativa: Clássica Integral/ }) }).first();
  await sb.scrollIntoViewIfNeeded();
  await sb.locator('button:has-text("Selecionar")').first().click();
  await p.waitForTimeout(700);
  console.log('sidebar sel btn:', (await sb.locator('button:has-text("Selecion")').first().innerText()).replace(/\s+/g, ' '));
  await s.shot('20-sidebar-classica-integral-card', { dir: 'capturas', locator: sb });
  await sb.getByRole('button', { name: 'Ver em tamanho grande' }).click();
  await p.waitForTimeout(800);
  dlg = p.getByRole('dialog').first();
  await s.shot('20-sidebar-classica-integral-grande', { dir: 'capturas', locator: dlg });
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  // COMBINAÇÃO
  await p.getByRole('tab', { name: 'Combinação' }).click();
  await p.waitForTimeout(800);
  await s.shot('21-navegacao-combinacao', { dir: 'capturas', full: true });
  console.log('===== COMBINACAO');
  console.log((await s.aria('main')).split('\n').filter(l => !l.includes('/url') && !l.includes('- img')).slice(33, 140).join('\n'));
  await s.done();
})();
