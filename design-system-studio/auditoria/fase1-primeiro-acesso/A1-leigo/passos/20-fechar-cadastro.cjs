module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('tab', { name: 'Cadastro' }).click();
    await page.waitForTimeout(1000);
    await shot('20-aba-cadastro');
    await page.mouse.move(800, 450);
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(800);
    await shot('20b-aba-cadastro-miniaturas');
    const snap = await aria();
    const i = snap.indexOf('tab "Cadastro"');
    log(snap.slice(i, i + 2200));
    log(snap.split('\n').filter(l => /Continuar|Escolha um|Pronto/.test(l)).join('\n'));
  }
};
