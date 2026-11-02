module.exports = {
  async run({ page, shot, aria, log }) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(500);
    await shot('02-antes-clique-comecar-guiado');
    await page.getByRole('button', { name: 'Começar no modo guiado' }).click();
    await page.waitForTimeout(1000);
    await shot('03-depois-clique-comecar-guiado');
    await shot('03-depois-clique-comecar-guiado-completa', true);
    log(await aria());
  }
};
