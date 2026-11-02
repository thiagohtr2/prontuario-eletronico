module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('tab', { name: 'Cadastro' }).click();
    await page.waitForTimeout(600);
    const card = page.getByRole('button', { name: /^Cadastro simplificado/ });
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await page.waitForTimeout(900);
    await shot('21-depois-escolher-cadastro-simplificado');
    await page.getByRole('button', { name: /Continuar: Desktop/ }).first().click();
    await page.waitForTimeout(1500);
    await shot('22-tela-desktop');
    await shot('22-tela-desktop-completa', true);
    const snap = await aria();
    const i = snap.indexOf('- main:');
    log(snap.slice(i, i + 7000));
  }
};
