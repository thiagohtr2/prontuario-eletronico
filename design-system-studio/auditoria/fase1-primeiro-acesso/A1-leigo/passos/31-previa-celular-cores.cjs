module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: 'Celular' }).click();
    await page.waitForTimeout(1200);
    await shot('31-previa-no-celular');
    await page.getByRole('button', { name: /Continuar: Cores/ }).first().click();
    await page.waitForTimeout(1500);
    await shot('32-tela-cores');
    await shot('32-tela-cores-completa', true);
    const snap = await aria();
    const i = snap.indexOf('Etapa 7');
    log(snap.slice(i, i + 5000));
  }
};
