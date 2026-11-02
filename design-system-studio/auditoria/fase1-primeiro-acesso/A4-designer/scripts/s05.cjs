const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/objetivo', { waitUntil: 'networkidle' }); await page.getByText('Aplicativo ou SaaS').first().waitFor();
  await page.getByRole('radio', { name: /Aplicativo ou SaaS/ }).click();
  await page.getByPlaceholder('Ex.: Agenda Viva').fill('Lumen');
  await page.getByPlaceholder('Ex.: organizar agendamentos de clientes').fill('Dar clareza sobre saldo, gastos e metas financeiras pessoais');
  await page.getByPlaceholder('Conte em poucas linhas como o site funciona.').fill('App web de finanças pessoais com painel de saldo, gastos por categoria, metas de economia e lista de transações. Versão desktop e mobile.');
  await page.getByPlaceholder('Ex.: donos de pequenos estúdios').fill('Adultos 25-45 anos que querem controlar o próprio dinheiro');
  await page.getByPlaceholder('Ex.: marcar um horário em menos de 1 minuto').fill('Ver quanto pode gastar hoje sem comprometer as metas');
  const mod = page.getByPlaceholder('Ex.: Agenda semanal');
  for (const f of ['Painel de saldo','Gastos por categoria','Metas de economia','Transações']) { await mod.fill(f); await page.getByRole('button', { name: 'Adicionar' }).click(); await page.waitForTimeout(150); }
  await page.getByRole('button', { name: 'React + TypeScript', exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Continuar: Entrada/ }).click();
  await page.waitForTimeout(1200);
  console.log(page.url());
  await page.screenshot({ path: C + '04-entrada.png', fullPage: true });
  await dump(page, 3500);
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
