// Cores semânticas efetivas (erro de campo, resumo, badges) e rolagem da lista no drawer do dev-3.
const { SITES, newPage, gotoLogin, login, launch } = require('./lib.cjs');
(async () => {
  const b = await launch();
  for (const site of Object.keys(SITES)) {
    const { ctx, page } = await newPage(b, 1440, 900);
    await gotoLogin(page, site);
    await page.click('form button[type=submit]:visible'); await page.waitForTimeout(400);
    const r = await page.evaluate(() => { const fe = [...document.querySelectorAll('.field-error,.field__error')].find((e) => e.offsetParent); const al = [...document.querySelectorAll('[role=alert]')].find((e) => e.offsetParent); const inp = document.querySelector('input[aria-invalid=true]'); return { fieldError: fe && getComputedStyle(fe).color, alertBg: al && getComputedStyle(al).backgroundColor, alertColor: al && getComputedStyle(al).color, alertBorder: al && getComputedStyle(al).borderTopColor, invalidBorder: inp && getComputedStyle(inp).borderTopColor }; });
    console.log(site, JSON.stringify(r));
    await ctx.close();
  }
  const { ctx, page } = await newPage(b, 390, 844);
  await login(page, 'dev-3');
  await page.locator('button[aria-label="Abrir menu"]:visible').click(); await page.waitForTimeout(400);
  const d = await page.evaluate(() => { const sb = document.querySelector('#sidebar'); const sc = [...sb.querySelectorAll('*'), sb].filter((e) => ['auto', 'scroll'].includes(getComputedStyle(e).overflowY)).map((e) => e.tagName + '.' + e.className + ' ' + e.scrollHeight + '/' + e.clientHeight); const cfg = [...sb.querySelectorAll('a,button')].filter((e) => /Configurações/.test(e.textContent) && e.getBoundingClientRect().height > 0).map((e) => e.tagName + ' ' + e.className + ' y=' + Math.round(e.getBoundingClientRect().y)); return { sc, cfg }; });
  console.log('dev-3 drawer', JSON.stringify(d));
  await ctx.close(); await b.close();
})();
