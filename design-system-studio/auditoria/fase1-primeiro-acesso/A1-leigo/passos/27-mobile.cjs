module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('button', { name: /Continuar: Mobile/ }).first().click();
    await page.waitForTimeout(1500);
    await shot('27-tela-mobile');
    await page.mouse.move(600, 450);
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(800);
    await shot('27b-tela-mobile-miniaturas');
    const snap = await aria();
    const i = snap.indexOf('- main:');
    log(snap.slice(i, i + 4500));
  }
};
