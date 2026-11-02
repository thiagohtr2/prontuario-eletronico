module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('button', { name: /Abrir Central de Prompts/ }).click();
    await page.waitForTimeout(1500);
    await shot('41-central-de-prompts');
    let snap = await aria();
    let i = snap.indexOf('- main:');
    log(snap.slice(i, i + 2500));
    // Modo Livre
    await page.getByRole('group', { name: 'Modo de utilização' }).getByRole('button', { name: 'Livre' }).click();
    await page.waitForTimeout(1500);
    await shot('42-depois-clicar-livre');
    snap = await aria();
    const c = snap.indexOf('complementary');
    log(snap.slice(c, c + 2500));
    i = snap.indexOf('- main:');
    log(snap.slice(i, i + 1500));
  }
};
