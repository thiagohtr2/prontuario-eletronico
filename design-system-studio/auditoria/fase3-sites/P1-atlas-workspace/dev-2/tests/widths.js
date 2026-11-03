// Overflow horizontal em todas as larguras de referência + intermediárias, em rotas públicas e internas
const L = require('./lib');
const widths = [320,344,360,375,390,412,430,480,520,600,700,767,768,820,900,1000,1023,1024,1100,1279,1280,1440,1600,1920];
const pub = ['login','cadastro','recuperar','termos'];
const priv = ['painel','inicio','projetos','tarefas','relatorios','ajuda','configuracoes','mensagens','calendario','pessoas'];
(async () => {
  let bad = 0;
  for (const w of widths) {
    const mobile = w < 768;
    const { browser, page, errors } = await L.launch({ width: w, height: mobile ? 800 : 900 }, { mobile, touch: mobile });
    await page.goto(L.url);
    for (const r of pub) {
      await page.evaluate((r) => { location.hash = '#/' + r; }, r);
      await page.waitForTimeout(150);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ov > 0) { bad++; console.log(`OVERFLOW w=${w} ${r} +${ov}`); }
    }
    await page.evaluate(() => { location.hash = '#/login'; });
    await page.fill('#lg-email', 'demo@atlas.com'); await page.fill('#lg-pass', 'Atlas@2026'); await page.click('#lg-submit');
    await page.waitForSelector('#app');
    for (const r of priv) {
      await page.evaluate((r) => { location.hash = '#/' + r; }, r);
      await page.waitForTimeout(r === 'painel' ? 1400 : 250);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ov > 0) { bad++; console.log(`OVERFLOW w=${w} ${r} +${ov}`); }
    }
    if (errors.length) console.log(`w=${w} console:`, errors.join(' | '));
    await browser.close();
  }
  console.log('done, overflow cases:', bad);
})();
