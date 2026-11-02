module.exports = {
  async run({ page, shot, aria, log }) {
    await page.mouse.move(800, 400);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(600);
    await shot('06-rolou-ve-sobre-o-projeto');
    await page.getByRole('textbox', { name: 'Nome do projeto' }).click();
    await page.keyboard.type('Loja da Marta', { delay: 30 });
    await page.getByRole('textbox', { name: 'Objetivo' }).click();
    await page.keyboard.type('controlar o estoque, as vendas e os clientes da loja', { delay: 10 });
    await page.getByRole('textbox', { name: 'Público-alvo' }).click();
    await page.keyboard.type('eu e meus 2 funcionários', { delay: 10 });
    await page.waitForTimeout(400);
    await shot('07-depois-preencher-nome-objetivo');
    // módulos
    const nova = page.getByRole('textbox', { name: 'Nova funcionalidade' });
    await nova.scrollIntoViewIfNeeded();
    await nova.click();
    await page.keyboard.type('Estoque', { delay: 20 });
    await page.getByRole('button', { name: 'Adicionar' }).click();
    await page.waitForTimeout(300);
    await nova.click();
    await page.keyboard.type('Vendas', { delay: 20 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await page.keyboard.type('Clientes', { delay: 20 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await shot('08-depois-adicionar-modulos');
    const snap = await aria();
    const i = snap.indexOf('Módulos e funcionalidades');
    log(snap.slice(i, i + 1200));
    log(snap.split('\n').filter(l => /Projeto sem nome|Loja da Marta|Salvo/.test(l)).join('\n'));
  }
};
