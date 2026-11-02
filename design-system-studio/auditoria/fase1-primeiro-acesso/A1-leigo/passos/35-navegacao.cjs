module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('button', { name: /Continuar: Navegação/ }).first().click();
    await page.waitForTimeout(1500);
    await shot('35-tela-navegacao');
    await page.mouse.move(600, 450);
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(800);
    await shot('35b-tela-navegacao-rolada');
    const snap = await aria();
    const i = snap.indexOf('Etapa 8');
    log(snap.slice(i, i + 4500));
  }
};
