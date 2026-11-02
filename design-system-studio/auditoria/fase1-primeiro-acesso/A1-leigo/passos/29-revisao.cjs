module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('button', { name: /Continuar: Revisão/ }).first().click();
    await page.waitForTimeout(1500);
    await shot('29-tela-revisao');
    await shot('29-tela-revisao-completa', true);
    const snap = await aria();
    const i = snap.indexOf('- main:');
    log(snap.slice(i, i + 6000));
  }
};
