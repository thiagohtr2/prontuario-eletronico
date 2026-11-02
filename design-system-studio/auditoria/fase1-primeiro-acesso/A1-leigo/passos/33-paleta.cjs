module.exports = {
  async run({ page, shot, aria, log }) {
    const s = page.getByRole('searchbox', { name: 'Buscar paletas' });
    await s.click();
    await page.keyboard.type('laranja', { delay: 40 });
    await page.waitForTimeout(1000);
    await page.mouse.move(600, 450);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(600);
    await shot('33-busca-laranja');
    const snap = await aria();
    const i = snap.indexOf('group "Categorias de paletas"');
    log(snap.slice(i, i + 2500));
  }
};
