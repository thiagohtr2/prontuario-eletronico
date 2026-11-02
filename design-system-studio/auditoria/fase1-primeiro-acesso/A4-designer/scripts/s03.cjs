const { open, dump, controls, C } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' }); await page.getByText('Aplicativo ou SaaS').first().waitFor();
  // measurements of cards
  const m = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('main [role=radio].goal-type').forEach(b => {
      const ps = [...b.querySelectorAll('strong,span,p,h3,h4,div')].filter(e => e.children.length===0 && e.innerText.trim());
      const r = ps.map(e => { const rc = e.getBoundingClientRect(); return `${e.tagName}:${e.innerText.slice(0,18)}@y${Math.round(rc.top)} h${Math.round(rc.height)} fs${getComputedStyle(e).fontSize}`; });
      out.push(b.getBoundingClientRect().height.toFixed(0) + ' :: ' + r.join(' | '));
    });
    const inputs = [...document.querySelectorAll('main input, main textarea')].map(i => `${i.placeholder.slice(0,20)} h=${i.getBoundingClientRect().height} y=${Math.round(i.getBoundingClientRect().top+scrollY)} fs=${getComputedStyle(i).fontSize}`);
    return out.concat(inputs);
  });
  console.log(m.join('\n'));
  await page.getByRole('radio', { name: /Aplicativo ou SaaS/ }).click();
  await page.waitForTimeout(400);
  const ins = page.locator('main input[type=text], main textarea');
  await page.getByPlaceholder('Ex.: Agenda Viva').fill('Lumen');
  await page.getByPlaceholder('Ex.: organizar agendamentos de clientes').fill('Dar clareza sobre saldo, gastos e metas financeiras pessoais');
  await page.getByPlaceholder('Conte em poucas linhas como o site funciona.').fill('App web de finanças pessoais com painel de saldo, gastos por categoria, metas de economia e lista de transações. Versão desktop e mobile.');
  await page.getByPlaceholder('Ex.: donos de pequenos estúdios').fill('Adultos 25-45 anos que querem controlar o próprio dinheiro');
  await page.getByPlaceholder('Ex.: marcar um horário em menos de 1 minuto').fill('Ver quanto pode gastar hoje sem comprometer as metas');
  const mod = page.getByPlaceholder('Nova funcionalidade').or(page.getByPlaceholder('Ex.: Agenda semanal'));
  for (const f of ['Painel de saldo','Gastos por categoria','Metas de economia','Transações']) { await mod.first().fill(f); await page.getByRole('button', { name: 'Adicionar' }).click(); await page.waitForTimeout(150); }
  await page.getByRole('button', { name: 'React + TypeScript', exact: true }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: C + '03-objetivo-preenchido.png', fullPage: true });
  // viewport shot near form top
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(300);
  await page.screenshot({ path: C + '03b-objetivo-form-viewport.png' });
  await dump(page, 2500);
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
