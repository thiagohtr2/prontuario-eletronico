const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  await page.getByRole('radio', { name: /Aplicativo ou SaaS/ }).click();
  await page.getByRole('textbox', { name: 'Nome do projeto' }).fill('Orbita PM');
  await page.getByRole('textbox', { name: 'Objetivo' }).fill('Gestão de projetos B2B multiempresa (multi-tenant) com papéis e permissões');
  await page.getByRole('textbox', { name: 'Descrição resumida' }).fill('SaaS onde cada organização (tenant) gerencia projetos em quadros kanban, convida equipes com papéis (Owner, Admin, Membro, Convidado), acompanha relatórios e gerencia assinatura/faturamento.');
  await page.getByRole('textbox', { name: 'Público-alvo' }).fill('Empresas de 10 a 500 pessoas: PMOs, líderes de equipe e times de produto');
  await page.getByRole('textbox', { name: 'Finalidade principal' }).fill('Mover tarefas no kanban e ver o status do projeto em segundos');
  const mods = ['Quadro kanban (drag-and-drop)', 'Papéis e permissões (RBAC)', 'Relatórios e burndown', 'Faturamento e planos', 'Configurações da organização', 'Convites de equipe', 'Troca de organização (multi-tenant)'];
  for (const m of mods) {
    await page.getByRole('textbox', { name: 'Nova funcionalidade' }).fill(m);
    await page.getByRole('button', { name: 'Adicionar' }).click();
  }
  // tech: click chips to see behavior
  await page.getByRole('button', { name: 'React + TypeScript', exact: true }).click();
  console.log('TECH after chip1:', await page.getByRole('textbox', { name: 'Tecnologia' }).inputValue());
  await page.getByRole('button', { name: 'Tailwind CSS', exact: true }).click();
  console.log('TECH after chip2:', await page.getByRole('textbox', { name: 'Tecnologia' }).inputValue());
  await page.waitForTimeout(300);
  await shot(page, '03-objetivo-preenchido-full', true);
  console.log(await aria(page, 'main'));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
