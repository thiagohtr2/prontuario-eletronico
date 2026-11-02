module.exports = {
  async run({ page, shot, aria, log }) {
    // Marta passa o mouse em "Loja ou catálogo" (ela tem uma loja), lê, e depois escolhe "Sistema com login..."
    await page.getByRole('radio', { name: /Loja ou catálogo/ }).hover();
    await page.waitForTimeout(400);
    await shot('04-hover-loja-ou-catalogo');
    await page.getByRole('radio', { name: /Aplicativo ou SaaS/ }).click();
    await page.waitForTimeout(800);
    await shot('05-depois-escolher-aplicativo');
    const r = await page.getByRole('radio', { name: /Aplicativo ou SaaS/ }).getAttribute('aria-checked');
    log('aria-checked Aplicativo:', r);
    const snap = await aria();
    log(snap.split('\n').filter(l => /radio|Continuar|Escolha o tipo|status|Esqueleto/.test(l)).join('\n'));
  }
};
