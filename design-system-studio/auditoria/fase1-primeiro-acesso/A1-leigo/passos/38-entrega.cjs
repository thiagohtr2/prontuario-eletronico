module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('button', { name: /Continuar: Entrega/ }).first().click();
    await page.waitForTimeout(2000);
    await shot('38-tela-entrega');
    await shot('38-tela-entrega-completa', true);
    const snap = await aria();
    const i = snap.indexOf('Etapa 10');
    log(snap.slice(i, i + 6000));
  }
};
