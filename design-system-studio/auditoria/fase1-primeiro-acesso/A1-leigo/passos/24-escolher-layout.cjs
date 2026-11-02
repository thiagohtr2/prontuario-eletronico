module.exports = {
  async run({ page, shot, aria, log }) {
    const card = page.getByRole('button', { name: /^Sidebar integral clássica\./ });
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await shot('24-antes-clicar-sidebar-classica');
    await card.click();
    await page.waitForTimeout(1000);
    await shot('25-depois-clicar-sidebar-classica');
    const snap = await aria();
    log(snap.split('\n').filter(l => /Selecionad|selecionad|Escolhido|escolhido|Escolher este|Continuar|Escolha uma|pressed\]/.test(l)).join('\n'));
  }
};
