module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('tab', { name: 'Login' }).click();
    await page.waitForTimeout(1000);
    await shot('16-aba-login');
    await page.mouse.move(800, 450);
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(800);
    await shot('16b-aba-login-miniaturas');
    const snap = await aria();
    const i = snap.indexOf('tab "Cadastro"');
    log(snap.slice(i, i + 3500));
  }
};
