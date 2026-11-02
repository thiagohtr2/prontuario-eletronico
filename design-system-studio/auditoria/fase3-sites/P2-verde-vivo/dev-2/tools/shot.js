// Capturas de tela: node tools/shot.js '[{"name":"x","w":1280,"h":800,"hash":"#/catalogo","full":true,"scrollAll":true,"touch":false,"js":"..."}]' (grava em _shots/)
const { chromium } = require('playwright');
require('fs').mkdirSync(require('path').resolve(__dirname, '..', '_shots'), { recursive: true });
const D = require('path').resolve(__dirname, '..') + '/';
const OUT = D + '_shots/';
(async () => {
  const b = await chromium.launch();
  const jobs = JSON.parse(process.argv[2]);
  for (const j of jobs) {
    const ctx = await b.newContext({ viewport: { width: j.w, height: j.h || 900 }, hasTouch: !!j.touch, isMobile: !!j.touch });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(m.type()+': '+m.text().slice(0,200)); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    await page.goto('file://' + D + 'index.html' + (j.hash || ''));
    await page.waitForTimeout(j.wait || 900);
    if (j.scrollAll) {
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += 400) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(80); }
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
    }
    if (j.js) { await page.evaluate(j.js); await page.waitForTimeout(j.jsWait || 500); }
    if (j.clip) await page.screenshot({ path: OUT + j.name + '.png', clip: j.clip });
    else await page.screenshot({ path: OUT + j.name + '.png', fullPage: !!j.full });
    console.log(j.name, errs.join(' | ') || 'ok');
    await ctx.close();
  }
  await b.close();
})();
