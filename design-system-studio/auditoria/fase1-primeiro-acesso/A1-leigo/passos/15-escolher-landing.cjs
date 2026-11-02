module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('tab', { name: 'Landing page' }).click();
    await page.waitForTimeout(500);
    const card = page.getByRole('button', { name: /^Nexa Finance/ });
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await card.click();
    await page.waitForTimeout(1000);
    await shot('15-depois-escolher-nexa');
    await page.mouse.wheel(0, -3000);
    await page.waitForTimeout(600);
    await shot('15b-topo-depois-escolher-nexa');
    const snap = await aria();
    log(snap.split('\n').filter(l => /selecionad|Selecionad|pressed|Continuar|Escolha|tab "/.test(l)).join('\n'));
  }
};
