module.exports = {
  async run({ page, shot, aria, log }) {
    const b = page.getByRole('button', { name: 'Usar esta sugestão' });
    await b.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await shot('09-antes-usar-sugestao');
    await b.click();
    await page.waitForTimeout(1000);
    await shot('10-depois-usar-sugestao');
    const snap = await aria();
    log(snap.split('\n').filter(l => /Sugest|sugest|status|Esqueleto \d|alert|Aplicad|aplicad/.test(l)).join('\n'));
    const st = await page.locator('[role=status]').allInnerTexts();
    log('STATUS:', JSON.stringify(st));
  }
};
