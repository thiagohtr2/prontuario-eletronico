module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('tab', { name: 'Landing page' }).click();
    await page.waitForTimeout(600);
    await page.mouse.move(800, 450);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(800);
    await shot('14-miniaturas-landing');
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(800);
    await shot('14b-miniaturas-landing-mais');
  }
};
