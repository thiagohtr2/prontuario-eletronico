module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('button', { name: /Aprovar esqueleto e continuar/ }).click();
    await page.waitForTimeout(2000);
    await shot('30-depois-aprovar-previa');
    await shot('30-depois-aprovar-previa-completa', true);
    const snap = await aria();
    const i = snap.indexOf('- main:');
    log(snap.slice(i, i + 5000));
  }
};
