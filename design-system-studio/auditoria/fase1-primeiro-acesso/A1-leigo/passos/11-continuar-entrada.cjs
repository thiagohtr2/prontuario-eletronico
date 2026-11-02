module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('button', { name: /Continuar: Entrada/ }).click();
    await page.waitForTimeout(1200);
    await shot('11-tela-entrada');
    await shot('11-tela-entrada-completa', true);
    const snap = await aria();
    const i = snap.indexOf('- main:');
    log(snap.slice(i));
  }
};
