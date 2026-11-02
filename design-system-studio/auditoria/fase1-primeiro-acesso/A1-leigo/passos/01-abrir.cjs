module.exports = {
  startUrl: 'http://127.0.0.1:4300/',
  async run({ page, shot, aria, log }) {
    await page.waitForTimeout(1000);
    await shot('01-primeira-tela');
    await shot('01-primeira-tela-completa', true);
    log('TITLE:', await page.title());
    log(await aria());
  }
};
