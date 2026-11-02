module.exports = {
  async run({ page, shot, aria, log }) {
    await page.mouse.move(600, 450);
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(800);
    await shot('23-layouts-desktop-miniaturas');
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(800);
    await shot('23b-layouts-desktop-miniaturas-mais');
  }
};
