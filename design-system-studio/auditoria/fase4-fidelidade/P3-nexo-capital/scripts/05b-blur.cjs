// Reteste da validação ao sair do campo (clique fora em vez de Tab) e Tab até a senha.
const { SITES, newPage, gotoLogin, launch } = require('./lib.cjs');
(async () => {
  const b = await launch();
  for (const site of Object.keys(SITES)) {
    const { ctx, page } = await newPage(b, 1440, 900);
    await gotoLogin(page, site);
    await page.click('input[type=email]:visible'); await page.keyboard.type('abc');
    await page.mouse.click(1300, 450); await page.waitForTimeout(300);
    const a = await page.evaluate(() => [...document.querySelectorAll('.field-error,.field__error')].filter((e) => e.offsetParent).map((e) => e.textContent.trim()));
    // senha: digitar e sair pelo Tab
    await page.click('input[type=password]:visible'); await page.keyboard.type('1'); await page.keyboard.press('Tab'); await page.waitForTimeout(300);
    const c = await page.evaluate(() => [...document.querySelectorAll('.field-error,.field__error')].filter((e) => e.offsetParent).map((e) => e.textContent.trim()));
    console.log(site, 'clique fora:', JSON.stringify(a), '| senha+Tab:', JSON.stringify(c));
    await ctx.close();
  }
  await b.close();
})();
