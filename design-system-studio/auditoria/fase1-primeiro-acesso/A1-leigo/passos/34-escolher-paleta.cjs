module.exports = {
  async run({ page, shot, aria, log }) {
    const s = page.getByRole('searchbox', { name: 'Buscar paletas' });
    await s.click();
    await page.keyboard.type('laranja', { delay: 20 });
    await page.waitForTimeout(800);
    const card = page.getByRole('button', { name: /^Engenharia Profissionais/ });
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await shot('34-antes-escolher-engenharia');
    await card.click();
    await page.waitForTimeout(1200);
    await shot('34b-depois-escolher-engenharia');
    const snap = await aria();
    log(snap.split('\n').filter(l => /Selecionad|pressed\]|status|Paleta|salva/.test(l)).join('\n'));
  }
};
