module.exports = {
  async run({ page, shot, aria, log }) {
    // Marta vê "Selecionado" e tenta continuar clicando no botão (que está desabilitado)
    const btn = page.getByRole('button', { name: /Continuar: Desktop/ });
    const box = await btn.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(800);
    await shot('12-depois-clicar-continuar-desabilitado');
    log('URL depois do clique:', page.url());
    log('title attr:', await btn.getAttribute('title'));
    // Marta segue a dica "Escolha um modelo de landing page" e clica na aba "Landing page"
    await page.getByRole('tab', { name: 'Landing page' }).click();
    await page.waitForTimeout(1000);
    await shot('13-aba-landing-page');
    await shot('13-aba-landing-page-completa', true);
    const snap = await aria();
    const i = snap.indexOf('tablist');
    log(snap.slice(i, i + 5000));
  }
};
