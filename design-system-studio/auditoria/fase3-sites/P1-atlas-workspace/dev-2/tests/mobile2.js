const L = require('./lib');
(async () => {
  // paisagem
  for (const [w, h] of [[667, 375], [568, 320], [736, 414]]) {
    const { browser, page, errors } = await L.launch({ width: w, height: h }, { mobile: true, touch: true });
    await L.login(page);
    const m = await page.evaluate(() => ({ hdr: document.querySelector('.app-header').getBoundingClientRect().height, hdrPos: getComputedStyle(document.querySelector('.app-header')).position, bn: document.querySelector('.bottom-nav').getBoundingClientRect().height, vh: innerHeight, ov: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
    const fixedTotal = (m.hdrPos === 'static' ? 0 : m.hdr) + m.bn;
    console.log(`landscape ${w}x${h}: header ${m.hdr} (${m.hdrPos}) + bottom ${m.bn} = ${fixedTotal} (${(fixedTotal / m.vh * 100).toFixed(1)}%) overflow ${m.ov}`);
    await page.screenshot({ path: L.shot(`landscape-${w}x${h}`) });
    await browser.close();
  }
  // hide on scroll
  const { browser, page } = await L.launch({ width: 390, height: 800 }, { mobile: true, touch: true });
  await L.login(page);
  await page.evaluate(() => { location.hash = '#/projetos'; }); await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 700)); await page.waitForTimeout(400);
  const hidden = await page.evaluate(() => document.querySelector('.app-header').classList.contains('is-hidden'));
  await page.evaluate(() => window.scrollTo(0, 500)); await page.waitForTimeout(400);
  const shown = await page.evaluate(() => !document.querySelector('.app-header').classList.contains('is-hidden'));
  console.log('topbar esconde ao rolar para baixo:', hidden, '| reaparece ao subir:', shown);
  await browser.close();
  // 320 login / signup / painel
  const t = await L.launch({ width: 320, height: 640 }, { mobile: true, touch: true });
  await t.page.goto(L.url);
  await t.page.screenshot({ path: L.shot('login-320') });
  await t.page.goto(L.url + '#/cadastro'); await t.page.screenshot({ path: L.shot('signup-320'), fullPage: true });
  await t.browser.close();
})();
