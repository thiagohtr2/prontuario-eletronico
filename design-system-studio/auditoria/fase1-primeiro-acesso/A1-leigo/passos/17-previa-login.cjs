module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('tab', { name: 'Login' }).click();
    await page.waitForTimeout(500);
    const card = page.getByRole('button', { name: /^Clássico central/ });
    await card.scrollIntoViewIfNeeded();
    // botão "Ver prévia" logo depois do cartão
    const prev = card.locator('xpath=following::button[normalize-space()="Ver prévia"][1]');
    await prev.click();
    await page.waitForTimeout(1200);
    await shot('17-previa-login-classico');
    const snap = await aria();
    const d = snap.indexOf('dialog');
    log(d >= 0 ? snap.slice(d, d + 2500) : snap.slice(-2500));
  }
};
