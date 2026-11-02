module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('tab', { name: 'Login' }).click();
    await page.waitForTimeout(500);
    const card = page.getByRole('button', { name: /^Clássico central/ });
    await card.scrollIntoViewIfNeeded();
    await card.locator('xpath=following::button[normalize-space()="Ver prévia"][1]').click();
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: 'Selecionar este modelo' }).click();
    await page.waitForTimeout(1000);
    await shot('18-depois-selecionar-login');
    log('dialog aberto?', await page.getByRole('dialog').count());
    let snap = await aria();
    log(snap.split('\n').filter(l => /selecionad|Selecionad|Continuar|Escolha|tab "|Login selecionado/.test(l)).join('\n'));
    // aba Cadastro
    await page.getByRole('tab', { name: 'Cadastro' }).click();
    await page.waitForTimeout(1000);
    await shot('19-aba-cadastro');
    await page.mouse.move(800, 450);
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(800);
    await shot('19b-aba-cadastro-miniaturas');
    snap = await aria();
    const i = snap.indexOf('tab "Cadastro"');
    log(snap.slice(i, i + 2500));
  }
};
