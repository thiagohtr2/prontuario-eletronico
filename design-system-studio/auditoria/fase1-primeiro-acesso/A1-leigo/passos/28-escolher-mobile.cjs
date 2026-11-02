module.exports = {
  async run({ page, shot, aria, log }) {
    const b = page.getByRole('button', { name: 'Escolher este modelo' }).first();
    await b.scrollIntoViewIfNeeded();
    await b.click();
    await page.waitForTimeout(1000);
    await shot('28-depois-escolher-bottom-nav');
    const snap = await aria();
    log(snap.split('\n').filter(l => /Selecionad|selecionad|Escolhido|escolhido|Escolher este|Continuar|Escolha uma|Esqueleto \d/.test(l)).join('\n'));
  }
};
