module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('group', { name: 'Modo de utilização' }).getByRole('button', { name: 'Guiado' }).click();
    await page.waitForTimeout(1500);
    await shot('43-depois-voltar-guiado');
    log('URL após Guiado:', page.url());
    let snap = await aria();
    let i = snap.indexOf('- main:');
    log(snap.slice(i, i + 800));
    // ícone de pasta no topo (sem texto)
    const ico = page.getByRole('button', { name: 'Exportar e importar' });
    await ico.hover();
    await page.waitForTimeout(1200);
    await shot('44-hover-icone-pasta');
    log('title do ícone:', await ico.getAttribute('title'));
    await ico.click();
    await page.waitForTimeout(1500);
    await shot('44b-depois-clicar-icone-pasta');
    log('URL após ícone:', page.url());
    snap = await aria();
    i = snap.indexOf('- main:');
    log(snap.slice(i, i + 2500));
  }
};
